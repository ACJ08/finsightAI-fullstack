const mongoose = require("mongoose");

const simSchema = new mongoose.Schema({
  uuid: { 
    type: String, 
    required: true, 
    unique: true,
    index: true  // Index for faster lookups
  },
  user: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: "User", 
    required: true,
    index: true  // Index for fetching user's simulations
  },
  project_name: {
    type: String,
    index: true  // Index for search functionality
  },
  target_segment: String,
  key_features: String,
  market_conditions: String,
  compliance_notes: String,
  sim_results: mongoose.Schema.Types.Mixed, // flexible for LLM output
}, { 
  timestamps: true,
  // Automatically create indexes from the schema
  autoIndex: process.env.NODE_ENV !== 'production'
});

// Create compound index for efficient user queries sorted by date
simSchema.index({ user: 1, createdAt: -1 });

// Optional: Create text search index for project names (for future search feature)
// Uncomment when implementing full-text search
// simSchema.index({ project_name: 'text', target_segment: 'text' });

module.exports = mongoose.model("Sim", simSchema);