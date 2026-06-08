// test-cloud.js
require("dotenv").config();
const { runSim } = require("./openai.js");

async function test() {
  console.log("🚀 Starting Cloud AI Test...");
  
  const sampleData = {
    project_name: "Test Product",
    target_segment: "Students",
    key_features: "Fast, reliable, and cheap",
    market_conditions: "Competitive",
    compliance_notes: "None"
  };

  try {
    const result = await runSim(sampleData);
    console.log("✅ AI Response received:");
    console.log(JSON.stringify(result, null, 2));
  } catch (err) {
    console.error("❌ Test Failed:", err);
  }
}

test();