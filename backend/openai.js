const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));

// Environment Variables
const AI_API_URL = process.env.AI_API_URL || "https://api.groq.com/openai/v1/chat/completions";
const AI_API_KEY = process.env.AI_API_KEY; 

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

  try {
    // =========================================================================
    // MODE 1: CLOUD AI (Runs when an API Key is found - e.g., on Render)
    // =========================================================================
    if (AI_API_KEY) {
      console.log("📡 Using Cloud AI (Groq)...");
      
      const response = await fetch(AI_API_URL, {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          "Authorization": `Bearer ${AI_API_KEY}`
        },
        body: JSON.stringify({
          model: "llama-3.3-70b-versatile", // This is the new, supported model
          messages: [{ role: "user", content: prompt }],
          temperature: 0.1,
        }),
      });

      if (!response.ok) {
          const errorText = await response.text();
          throw new Error(`Cloud AI Error (${response.status}): ${errorText}`);
      }

      const data = await response.json();
      const aiMessage = data.choices && data.choices[0] && data.choices[0].message 
                        ? data.choices[0].message.content 
                        : "";
                        
      return parseAiResponse(aiMessage);
    } 
    
    // =========================================================================
    // MODE 2: LOCAL AI (Runs when no API Key is found - e.g., on your PC)
    // =========================================================================
    else {
      console.log("💻 Using Local AI (Ollama)...");
      
      const response = await fetch("http://localhost:11434/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "llama3",
          prompt,
          stream: false
        }),
      });

      if (!response.ok) {
          throw new Error(`Local AI Error (${response.status})`);
      }

      const data = await response.json();
      return parseAiResponse(data.response);
    }

  } catch (networkError) {
    // Graceful Failure for both modes
    console.error("🚨 AI Generation Failed:", networkError.message);
    return { 
      error: "AI Service is unreachable. Ensure Ollama is running locally, or API keys are correct in Render.",
      raw: null 
    };
  }
}

// Helper Function: Parses the JSON from either Cloud or Local responses
function parseAiResponse(rawString) {
  try {
    let cleanResponse = rawString.replace(/```json/gi, "").replace(/```/g, "").trim();
    return JSON.parse(cleanResponse);
  } catch (err) {
    console.error("Failed to parse this string into JSON:", rawString);
    return { error: "Failed to parse LLM response", raw: rawString };
  }
}

module.exports = { runSim };