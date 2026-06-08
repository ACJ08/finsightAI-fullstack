const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));

async function runSim(inputData) {
  const prompt = `
    Based on the provided information, reply ONLY with a valid JSON object in the following format:

    {
      "market_fit": { "score": number, "justification": string },
      "risk_level": { "category": string, "justification": string },
      "compliance_status": { "category": string, "justification": string }
    }

    Do not include any explanation or extra text.
    For market_fit score, only use any number from 1 to 10.
    For risk_level category, use only "low", "medium", or "high".
    For compliance_status category, use only "passed", "pending", or "failed".

    Project Name: ${inputData.project_name}
    Target Segment: ${inputData.target_segment}
    Key Features: ${inputData.key_features}
    Market Conditions: ${inputData.market_conditions}
    Compliance Notes: ${inputData.compliance_notes}
    `;

  const response = await fetch("http://localhost:11434/api/generate", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      model: "llama3",
      prompt,
      stream: false
    }),
  });

  const data = await response.json();
  // Ollama returns { response: "...", ... }
  // Parse the JSON from the model's response
  try {
    // Clean the AI response by removing any markdown wrappers before parsing
    let cleanResponse = data.response.replace(/```json/gi, "").replace(/```/g, "").trim();
    return JSON.parse(cleanResponse);
  } catch (err) {
    return { error: "Failed to parse LLM response", raw: data.response };
  }
}

module.exports = { runSim };
