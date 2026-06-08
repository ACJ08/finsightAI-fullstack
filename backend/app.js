require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");

const User = require("./models/User");
const Sim = require("./models/Sim");
const { runSim } = require("./openai.js");
const cors = require("cors");

// Create express app
const app = express();
const port = process.env.PORT || 62708;

// JWT SECRET (from .env)
const JWT_SECRET = process.env.JWT_SECRET;

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

// ==========================
// MongoDB Connection (ATLAS)
// ==========================
mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => console.log("MongoDB connected successfully"))
  .catch((err) => console.log("MongoDB connection error:", err));

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
// CREATE NEW SIM
// ==========================
app.post("/api/new-sim", authenticateToken, async (req, res) => {
  const {
    project_name,
    target_segment,
    key_features,
    market_conditions,
    compliance_notes,
  } = req.body;

  const inputData = {
    project_name,
    target_segment,
    key_features,
    market_conditions,
    compliance_notes,
  };

  try {
    const sim_results = await runSim(inputData);
    const uuid = crypto.randomUUID();

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

    await sim.save();

    res.json({ message: "Sim successfully added!", data: sim });
  } catch (err) {
    res.status(500).json({ error: "Failed to save simulation." });
  }
});

// ==========================
// RERUN SIM
// ==========================
app.put("/api/rerun-sim/:simId", authenticateToken, async (req, res) => {
  try {
    const existingSim = await Sim.findOne({
      uuid: req.params.simId,
      user: req.user.id,
    });

    if (!existingSim) {
      return res.status(404).json({ error: "Simulation not found." });
    }

    const inputData = {
      project_name:
        req.body.project_name || existingSim.project_name,
      target_segment:
        req.body.target_segment || existingSim.target_segment,
      key_features:
        req.body.key_features || existingSim.key_features,
      market_conditions:
        req.body.market_conditions || existingSim.market_conditions,
      compliance_notes:
        req.body.compliance_notes || existingSim.compliance_notes,
    };

    const new_sim_results = await runSim(inputData);

    existingSim.project_name = inputData.project_name;
    existingSim.target_segment = inputData.target_segment;
    existingSim.key_features = inputData.key_features;
    existingSim.market_conditions = inputData.market_conditions;
    existingSim.compliance_notes = inputData.compliance_notes;
    existingSim.sim_results = new_sim_results;

    existingSim.markModified("sim_results");
    await existingSim.save();

    res.json({
      message: "Simulation re-run successfully!",
      data: existingSim,
    });
  } catch (err) {
    res.status(500).json({ error: "Failed to re-run simulation." });
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
// STATIC FILES
// ==========================
app.use(express.static("public"));

// ==========================
// ROOT TEST ROUTE
// ==========================
app.get("/", (req, res) => {
  res.send("Hello, World!");
});

// ==========================
// START SERVER
// ==========================
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
  console.log("Press Ctrl+C to stop the server.");
});