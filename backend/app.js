require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const path = require("path");
const cors = require("cors");

const User = require("./models/User");
const Sim = require("./models/Sim");
const { runSim } = require("./openai.js");

// Create express app
const app = express();

// ==========================
// PORT CONFIGURATION
// ==========================
// Render.com assigns a PORT environment variable dynamically
// Default to 3000 for local development
const port = process.env.PORT || 3000;

// Log configuration at startup
console.log(`🚀 Server configured to listen on port: ${port}`);
console.log(`   Environment: ${process.env.NODE_ENV || 'development'}`);

// JWT SECRET (from .env)
const JWT_SECRET = process.env.JWT_SECRET;

// PRODUCTION CHECK: Prevent server start if secret is missing
if (!JWT_SECRET) {
  console.error("🔴 FATAL ERROR: JWT_SECRET is missing from environment variables!");
  console.error("   Please add JWT_SECRET to your Render Dashboard environment variables");
  process.exit(1); 
}

// ==========================
// MIDDLEWARE & SECURE CORS
// ==========================
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// CORS Configuration: Explicitly allow your production frontend
const allowedOrigins = [
  // Local Development URLs
  "http://localhost:5173",    // Vite dev server (standard port)
  "http://localhost:3000",    // Alternative local port
  "http://127.0.0.1:5173",    // Alternative localhost notation
  "http://127.0.0.1:3000",    // Alternative localhost notation
  
  // Production URLs (loaded from environment variables)
  process.env.FRONTEND_URL,   // Your Render.com frontend URL
  
  // Remove undefined values if variables aren't set
].filter(Boolean);

// Detailed CORS configuration
app.use(cors({
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) {
      return callback(null, true);
    }
    
    // Check if origin is in allowed list
    if (allowedOrigins.includes(origin)) {
      return callback(null, true);
    }
    
    // Reject requests from unauthorized origins
    const errorMsg = `🚨 CORS BLOCKED: Origin '${origin}' is not allowed. Allowed: ${allowedOrigins.join(', ')}`;
    console.warn(errorMsg);
    return callback(new Error(errorMsg), false);
  },
  credentials: true,                    // Allow cookies
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  exposedHeaders: ['Content-Length'],
  maxAge: 86400                         // Cache CORS headers for 24 hours
}));

// ==========================
// SECURITY HEADERS
// ==========================
// These headers protect against common web vulnerabilities
app.use((req, res, next) => {
  // Prevent clickjacking attacks
  res.setHeader('X-Frame-Options', 'DENY');
  
  // Prevent MIME sniffing
  res.setHeader('X-Content-Type-Options', 'nosniff');
  
  // Enable XSS protection in older browsers
  res.setHeader('X-XSS-Protection', '1; mode=block');
  
  // Prevent referrer leakage
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
  
  // Content Security Policy - prevent XSS and injection attacks
  res.setHeader(
    'Content-Security-Policy',
    "default-src 'self'; script-src 'self'; style-src 'self' 'unsafe-inline'; img-src 'self' data:; connect-src 'self' https://api.groq.com https://console.groq.com"
  );
  
  // HSTS - Force HTTPS in production
  if (process.env.NODE_ENV === 'production') {
    res.setHeader('Strict-Transport-Security', 'max-age=31536000; includeSubDomains');
  }
  
  next();
});

// ==========================
// MongoDB Connection (ATLAS)
// ==========================
// Store connection status for health checks
let mongooseConnection = null;

// Check if MongoDB URI is configured
if (!process.env.MONGODB_URI) {
  console.error("🔴 FATAL ERROR: MONGODB_URI is missing from environment variables!");
  console.error("   Please add MONGODB_URI to your Render Dashboard environment variables");
  process.exit(1);
}

mongoose
  .connect(process.env.MONGODB_URI, {
    // Production-ready connection options
    serverSelectionTimeoutMS: 5000,    // Wait 5 seconds for server selection
    socketTimeoutMS: 45000,            // Wait 45 seconds for socket timeout
    retryWrites: true,                 // Automatically retry failed writes (for MongoDB 3.6+)
    w: "majority",                     // Write concern: wait for majority replica set
    maxPoolSize: 10,                   // Connection pooling for better performance
    minPoolSize: 2,                    // Minimum pool size for production
  })
  .then(() => {
    mongooseConnection = mongoose.connection;
    console.log("✅ MongoDB connected successfully");
    const dbHost = process.env.MONGODB_URI.split('@')[1]?.split('/')[0] || 'unknown';
    console.log(`   📊 Connected to: ${dbHost}`);
  })
  .catch((err) => {
    console.error("❌ CRITICAL: MongoDB connection failed!");
    console.error("   Error:", err.message);
    console.error("\n📋 Troubleshooting:");
    console.error("   1. Check MONGODB_URI is set in Render Dashboard");
    console.error("   2. Verify MongoDB Atlas IP Whitelist includes Render.com");
    console.error("   3. Verify username/password credentials in connection string");
    console.error("   4. Ensure MongoDB cluster is running (not paused)");
    
    // In production, exit immediately if DB is not available
    if (process.env.NODE_ENV === 'production') {
      process.exit(1);
    }
  });

// Listen for connection events
mongoose.connection.on('disconnected', () => {
  console.warn("⚠️  MongoDB disconnected - attempting to reconnect...");
});

mongoose.connection.on('error', (err) => {
  console.error("❌ MongoDB connection error:", err.message);
});

// ==========================
// AUTH MIDDLEWARE
// ==========================
function authenticateToken(req, res, next) {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) return res.sendStatus(401);

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) return res.sendStatus(403);
    req.user = user;
    next();
  });
}

// ==========================
// INPUT VALIDATION HELPER
// ==========================
// Sanitize and validate user inputs to prevent injections and invalid data
function validateSimulationInput(data) {
  // Define required fields and their validation rules
  const requiredFields = {
    project_name: { type: 'string', minLength: 3, maxLength: 100 },
    target_segment: { type: 'string', minLength: 3, maxLength: 100 },
    key_features: { type: 'string', minLength: 10, maxLength: 2000 },
    market_conditions: { type: 'string', minLength: 10, maxLength: 2000 },
    compliance_notes: { type: 'string', minLength: 5, maxLength: 2000 },
  };

  const errors = [];

  // Validate each required field
  for (const [field, rules] of Object.entries(requiredFields)) {
    const value = data[field];

    // Check if field exists and is not empty
    if (!value) {
      errors.push(`Missing required field: ${field}`);
      continue;
    }

    // Check type
    if (typeof value !== rules.type) {
      errors.push(`Field '${field}' must be a ${rules.type}, got ${typeof value}`);
      continue;
    }

    // Check length constraints
    if (value.length < rules.minLength) {
      errors.push(`Field '${field}' must be at least ${rules.minLength} characters`);
    }
    if (value.length > rules.maxLength) {
      errors.push(`Field '${field}' cannot exceed ${rules.maxLength} characters`);
    }

    // Prevent XSS by rejecting dangerous characters
    // Check for script tags and event handlers
    if (/<script|javascript:|onerror|onload|onclick|on\w+=/gi.test(value)) {
      errors.push(`Field '${field}' contains invalid characters`);
    }
  }

  return errors;
}

// ==========================
// HEALTH CHECK ENDPOINT
// ==========================
// Render.com uses this to verify the application is running and healthy
// This is NOT protected by authentication because Render needs to check it frequently
app.get("/health", async (req, res) => {
  try {
    // Check if MongoDB is connected
    const dbHealthy = mongoose.connection.readyState === 1;
    
    if (!dbHealthy) {
      return res.status(503).json({
        status: "unhealthy",
        message: "Database connection not available",
        timestamp: new Date().toISOString()
      });
    }

    // If we got here, the app is healthy
    res.status(200).json({
      status: "healthy",
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      environment: process.env.NODE_ENV || "unknown"
    });
  } catch (err) {
    console.error("❌ Health check failed:", err);
    res.status(503).json({
      status: "unhealthy",
      error: err.message,
      timestamp: new Date().toISOString()
    });
  }
});

// ==========================
// PING ENDPOINT (LIGHTWEIGHT)
// ==========================
// Use this for very frequent monitoring (responds faster than /health)
app.get("/ping", (req, res) => {
  res.status(200).json({ 
    status: "pong", 
    timestamp: new Date().toISOString() 
  });
});

// ==========================
// ROOT ROUTE
// ==========================
app.get("/", (req, res) => {
  if (process.env.FRONTEND_URL) {
    return res.redirect(process.env.FRONTEND_URL);
  }

  res.status(200).json({
    status: "FinSight AI API",
    message: "Backend is running. This service exposes API routes for the FinSight AI frontend.",
    frontend: process.env.FRONTEND_URL || "Not configured",
    docs: {
      health: "/health",
      ping: "/ping",
      register: "/api/register",
      login: "/api/login"
    },
    note: "Use the frontend static site URL to access the web app. This endpoint is API-only."
  });
});

// ==========================
// REGISTER
// ==========================
app.post("/api/register", async (req, res) => {
  const { username, password } = req.body;

  try {
    const user = new User({ username, password });
    await user.save();
    res.json({ message: "User registered!" });
  } catch (err) {
    res.status(400).json({ error: "Username already exists." });
  }
});

// ==========================
// LOGIN
// ==========================
app.post("/api/login", async (req, res) => {
  try {
    const { username, password } = req.body;

    const user = await User.findOne({ username });

    if (!user || !(await user.comparePassword(password))) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    const token = jwt.sign(
      { id: user._id, username: user.username },
      JWT_SECRET,
      { expiresIn: "1h" }
    );

    res.json({ token });
  } catch (error) {
    console.error("Login Error:", error);
    res.status(500).json({ error: "Internal server error during login." });
  }
});

// ==========================
// GET ALL SIMS
// ==========================
app.get("/api/get-all-sims", authenticateToken, async (req, res) => {
  try {
    const sims = await Sim.find({ user: req.user.id });
    res.json({ data: sims, timestamp: new Date().toISOString() });
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch simulations." });
  }
});

// ==========================
// GET SINGLE SIM
// ==========================
app.get("/api/get-sim/:simId", authenticateToken, async (req, res) => {
  try {
    const sim = await Sim.findOne({
      uuid: req.params.simId,
      user: req.user.id,
    });

    if (!sim)
      return res.status(404).json({ error: "Simulation not found." });

    res.json({ data: sim, timestamp: new Date().toISOString() });
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch simulation." });
  }
});

// ==========================
// CREATE NEW SIM (WITH VALIDATION & BETTER ERROR HANDLING)
// ==========================
app.post("/api/new-sim", authenticateToken, async (req, res) => {
  const {
    project_name,
    target_segment,
    key_features,
    market_conditions,
    compliance_notes,
  } = req.body;

  // Create input data object
  const inputData = {
    project_name,
    target_segment,
    key_features,
    market_conditions,
    compliance_notes,
  };

  // VALIDATION: Check input data before processing
  const validationErrors = validateSimulationInput(inputData);
  if (validationErrors.length > 0) {
    return res.status(400).json({
      error: "Validation failed - please check your input",
      details: validationErrors
    });
  }

  try {
    // Call AI engine to generate simulation results
    const sim_results = await runSim(inputData);
    
    // 1. CRITICAL CHECK: Stop immediately if the AI returned an error
    if (sim_results.error) {
      console.error("❌ AI Generation Failed:", sim_results.error);
      return res.status(400).json({ 
        error: sim_results.error,
        message: "AI service failed to generate simulation. Please try again."
      });
    }

    // Generate unique ID for this simulation
    const uuid = crypto.randomUUID();

    // Create simulation document
    const sim = new Sim({
      uuid,
      user: req.user.id,
      project_name,
      target_segment,
      key_features,
      market_conditions,
      compliance_notes,
      sim_results,
    });

    // Save to database
    await sim.save();

    res.json({ 
      message: "✅ Simulation successfully created!", 
      data: sim 
    });
  } catch (err) {
    // 2. CRITICAL: Log the exact database error for troubleshooting
    console.error("❌ CRITICAL DATABASE ERROR:", err.message);
    console.error("   Full error:", err);
    
    res.status(500).json({ 
      error: "Failed to save simulation to database",
      message: "An error occurred while creating the simulation. Please try again."
    });
  }
});

// ==========================
// RERUN SIM (WITH BETTER ERROR HANDLING)
// ==========================
app.put("/api/rerun-sim/:simId", authenticateToken, async (req, res) => {
  try {
    // Find the existing simulation
    const existingSim = await Sim.findOne({
      uuid: req.params.simId,
      user: req.user.id,
    });

    if (!existingSim) {
      return res.status(404).json({ 
        error: "Simulation not found - please refresh and try again." 
      });
    }

    // Prepare updated data
    const inputData = {
      project_name: req.body.project_name || existingSim.project_name,
      target_segment: req.body.target_segment || existingSim.target_segment,
      key_features: req.body.key_features || existingSim.key_features,
      market_conditions: req.body.market_conditions || existingSim.market_conditions,
      compliance_notes: req.body.compliance_notes || existingSim.compliance_notes,
    };

    // Validate the updated input
    const validationErrors = validateSimulationInput(inputData);
    if (validationErrors.length > 0) {
      return res.status(400).json({
        error: "Validation failed",
        details: validationErrors
      });
    }

    // Call AI engine to generate new results
    const new_sim_results = await runSim(inputData);

    // Check if AI generation failed
    if (new_sim_results.error) {
      console.error("❌ AI Rerun Failed:", new_sim_results.error);
      return res.status(400).json({ 
        error: new_sim_results.error,
        message: "AI service failed to re-run simulation. Please try again."
      });
    }

    // Update the simulation document
    existingSim.project_name = inputData.project_name;
    existingSim.target_segment = inputData.target_segment;
    existingSim.key_features = inputData.key_features;
    existingSim.market_conditions = inputData.market_conditions;
    existingSim.compliance_notes = inputData.compliance_notes;
    existingSim.sim_results = new_sim_results;

    // Mark sim_results as modified so Mongoose saves it
    existingSim.markModified("sim_results");
    await existingSim.save();

    res.json({
      message: "✅ Simulation re-run successfully!",
      data: existingSim,
    });
  } catch (err) {
    console.error("❌ Failed to re-run simulation:", err.message);
    res.status(500).json({ 
      error: "Failed to re-run simulation - please try again later." 
    });
  }
});

// ==========================
// DELETE SIM
// ==========================
app.delete("/api/delete-sim/:simId", authenticateToken, async (req, res) => {
  try {
    const result = await Sim.deleteOne({
      uuid: req.params.simId,
      user: req.user.id,
    });

    if (result.deletedCount === 0) {
      return res
        .status(404)
        .json({ error: "Simulation not found or not authorized." });
    }

    res.json({
      message: `Successfully deleted sim ${req.params.simId}`,
      timestamp: new Date().toISOString(),
    });
  } catch (err) {
    res.status(500).json({ error: "Failed to delete simulation." });
  }
});

// ========================== 
// START SERVER
// ==========================
// The backend is deployed as an API-only service on Render.
// Frontend assets are served separately by the frontend static site.

// If you ever want to deploy the backend and frontend together as one service,
// you can build the frontend during backend deploy and restore the static server.

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
  console.log("Press Ctrl+C to stop the server.");
});