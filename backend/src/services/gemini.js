// src/services/gemini.js
import pkg from '@google/genai';
const { GoogleGenerativeAI } = pkg;
import axios from 'axios';

const apiKey = "AIzaSyBIsiLsq9A6PRySUhJwbMPtyXLTaVpoJig";
if (!apiKey) throw new Error('GEMINI_API_KEY not set');

function ensureLang(lang) {
  return lang || 'en-IN';
}

// Helper for Gemini API request
async function geminiRequest({ prompt, model = "gemini-2.0-flash", temperature = 0.7, maxOutputTokens = 2000 }) {
  const requestBody = {
    contents: [{
      role: "user",
      parts: [{ text: prompt }]
    }],
    model,
    generationConfig: { temperature, maxOutputTokens }
  };

  try {
    const response = await axios.post(
      `https://generativelanguage.googleapis.com/v1/models/${model}:generateContent?key=${apiKey}`,
      requestBody
    );
    let text = response.data.candidates[0]?.content?.parts[0]?.text || "No analysis available.";

    // Extract JSON from code block if present
    const jsonMatch = text.match(/```(?:json)?\s*([\s\S]*?)\s*```/i);
    if (jsonMatch) {
      text = jsonMatch[1];
    }

    function cleanJsonString(str) {
      str = str.replace(/\/\/.*$/gm, "");
      str = str.replace(/,\s*([}\]])/g, "$1");
      str = str.replace(/'/g, '"');
      str = str.replace(/([{,]\s*)([a-zA-Z0-9_]+)\s*:/g, '$1"$2":');
      return str;
    }

    try {
      return JSON.parse(text);
    } catch (e) {
      try {
        const cleaned = cleanJsonString(text);
        return JSON.parse(cleaned);
      } catch (e2) {
        return { error: "Failed to parse analysis JSON", raw: text };
      }
    }
  } catch (error) {
    return { error: "An error occurred while processing the Gemini API request." };
  }
}

export async function analyzeSoilAndRecommendCrop({ input, inputType, language, farmerType,location }) {
  const lang = ensureLang(language);

  const prompt = `
You are an expert soil scientist. Analyze the given input (plain text or base64-encoded image of a soil report). Respond ONLY in two pure JSON objects (no extra text, no markdown).

"soilReport" → Provide key findings and interpretation of the soil data in simple language. Include:

Soil type (sandy, clayey, loamy, etc.)

pH value (acidic/neutral/alkaline)

Organic matter content

Major nutrients (N, P, K levels)

Micronutrient deficiencies (Zn, Fe, B, etc.)

Moisture retention capacity

Issues (salinity, erosion, compaction, etc.)

"isSoilReport": true if content is soil-related, else false.

"solution" → Recommend:

Top 3 crops suitable for this soil considering both the soil report and the given location ("${location || 'n/a'}") and farmer type ("${farmerType || 'N/A'}").
and user language preference (${lang}).so must provide the reponse in his language only.
Improvement tips (fertilizer, manure, irrigation, amendments, etc.) to address soil issues.
Example response:(what ever the data is provided in input according to that give all the data ,donot leave any data empty or unknown )
{
  "soilReport": {
    "summary": "...",                // (Farmer-friendly summary of soil/compost health in user language  tranlated text  only,means the text must in user language only not translated and written in english)
    "soilType": "...",               // (Sandy/Clayey/Loamy or Compost if report suggests,only just name  in user language  tranlated text  only means the text must in user language only not translated and written in english)
    "pH": "...",                     // (Numeric value + interpretation  in user language  tranlated text  only means the text must in user language only not translated and written in english)
    "nutrients": {                   // (If available, otherwise leave empty  in user language  tranlated text  only means the text must in user language only not translated and written in english)
      "N": "...",
      "P": "...",
      "K": "...",
      "micronutrients": [ "..." ]
    },
    "heavyMetals": {                 // (Heavy metals with results vs safe limits)
      "Cu": { "value": "...", "status": "Within limit/Exceeds limit  in user language tranlated text only" },
      "Cr": { "value": "...", "status": "..." },
      "Zn": { "value": "...", "status": "..." },
      "Ni": { "value": "...", "status": "..." },
      "Pb": { "value": "...", "status": "..." },
      "Cd": { "value": "...", "status": "..." },
      "Hg": { "value": "...", "status": "..." }
    },
    "organicMatter": "...",          // (% or Low/Medium/High  in user language  tranlated text  only means the text must in user language only not translated and written in english)
    "moisture": "...",               // (Poor/Moderate/Good  in user language  tranlated text  only means the text must in user language only not translated and written in english)
    "issues": [ "..." ],             // (Toxicity, salinity, erosion, etc.  in user language  tranlated text  only means the text must in user language only not translated and written in english)
    "isSoilReport": true
  },
  "solution": {
    "recommendedCrops": [ "...", "...", "..." ],   // (Top 3 based on soil + location + farmerType  in user language  tranlated text  only means the text must in user language only not translated and written in english)
    "improvementTips": [ "..." ]                   // (Soil/compost treatment & safety suggestions  in user language  tranlated text  only means the text must in user language only not translated and written in english)
  }
}

Input:
${input}
  `.trim();

  const response = await geminiRequest({ prompt });
  console.log("Gemini response:", response);

  return {
    json1: response.soilReport || {},
    json2: response.solution || {}
  };
}

export async function diagnoseDisease({ input, inputType, language }) {
  const lang = ensureLang(language);
  console.log("DiagnoseDisease called with language:", language, "resolved to:", lang);

  const prompt = `
You are an expert crop doctor. Analyze the following input (plain text or base64-encoded image of a diseased crop). Respond ONLY in a pure JSON object (no extra text, no markdown).

"diagnosis" → Provide:
- Disease name (if detected)
- Confidence level (percentage)
- Severity (Mild/Moderate/Severe)
- Crop type (if known)
- Observed symptoms (list)
- Immediate treatment steps (list)
- Preventive tips (list)
- Recommended products (name and dosage)
- Expected recovery time (text)

All text must be in the user's language (${lang}).

Example response:
{
  "diagnosis": {
    "disease": "...",                       // (Disease name in user language only)
    "confidence": 95,                       // (Confidence % as number)
    "severity": "...",                      // (Mild/Moderate/Severe in user language only)
    "cropType": "...",                      // (Crop name in user language only)
    "symptoms": [ "..." ],                  // (Observed symptoms in user language only)
    "treatment": {
      "immediate": [ "..." ],               // (Immediate steps in user language only)
      "preventive": [ "..." ]               // (Preventive tips in user language only)
    },
    "products": [                           // (Recommended products in user language only)
      { "name": "...", "dosage": "..." }
    ],
    "nutrientRecommendations": [ "..." ],   // (Nutrients to boost recovery in user language only)
    "pesticideRecommendations": [ "..." ],  // (Pesticides/IPM in user language only)
    "expectedRecovery": "...",              // (Recovery timeline in user language only)
    "isSoilReport": false,
    "isDiseaseImage": true
  }
}


InputImage :
${input}
  `.trim();

  const response = await geminiRequest({ prompt });
  console.log("Gemini response:", response);
  return response;
}

export async function weatherAdvisory({ weatherJson, crop, language }) {
  const lang = ensureLang(language);
  const prompt = `
Respond in ${lang}.
Given this weather forecast JSON and crop: ${crop || 'N/A'},
provide actionable guidance for irrigation, pest/disease risk, and field operations for the next 3-5 days.

Weather JSON:
${JSON.stringify(weatherJson).slice(0, 15000)}
  `.trim();

  return await geminiRequest({ prompt });
}

export async function marketRecommendation({ region, priceSeries, language }) {
  const lang = ensureLang(language);
  const prompt = `
Respond in ${lang}.
Based on the following regional commodity price series, recommend 2-3 profitable crops and marketing timing/risk tips.

Region: ${region}
Series: ${JSON.stringify(priceSeries || []).slice(0, 15000)}
  `.trim();

  return await geminiRequest({ prompt });
}