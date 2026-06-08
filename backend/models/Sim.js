const mongoose = require("mongoose");

const simSchema = new mongoose.Schema({
  uuid: { type: String, required: true, unique: true },
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  project_name: String,
  target_segment: String,
  key_features: String,
  market_conditions: String,
  compliance_notes: String,
  sim_results: mongoose.Schema.Types.Mixed, // flexible for LLM output
}, { timestamps: true });

module.exports = mongoose.model("Sim", simSchema);