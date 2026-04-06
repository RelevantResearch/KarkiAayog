import fetch from "node-fetch";
import dotenv from "dotenv";
dotenv.config();

const API_TOKEN = process.env.HF_API_TOKEN;

async function translate(text: string) {
  const response = await fetch(
    "https://api-inference.huggingface.co/models/Helsinki-NLP/opus-mt-en-ne",
    {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${API_TOKEN}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ inputs: text }),
    }
  );

  const textData = await response.text();

  try {
    const data = JSON.parse(textData);
    if (Array.isArray(data) && data[0]?.translation_text) {
      return data[0].translation_text;
    } else {
      console.error("Translation API error:", data);
      return null;
    }
  } catch (err) {
    console.error("Failed to parse API response:", textData);
    return null;
  }
}

(async () => {
  const nepali = await translate("Hello, how are you?");
  console.log("Nepali:", nepali); // Should print in Devanagari
})();