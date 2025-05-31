// src/services/geminiService.ts
import { GenerateContentResponse, GoogleGenAI } from "@google/genai";

const API_KEY = process.env.NEXT_PUBLIC_GEMINI_API_KEY;

export function ensureApiKey(): string {
  if (!API_KEY) {
    console.error("CRITICAL: API_KEY is not configured. This must be set in the environment variables.");
    throw new Error("API_KEY is not configured. Please set the process.env.API_KEY environment variable.");
  }
  return API_KEY;
}

const COMMON_HTML_RULES = `
Strict Rules for HTML Output:
1.  You MUST generate a complete, self-contained HTML document. This means starting with <!DOCTYPE html> and including <html>, <head>, and <body> tags.
2.  The <head> section MUST include a <title> tag (e.g., "<title>Modernized Website</title>") and a <script src="https://cdn.tailwindcss.com"></script> tag to enable Tailwind CSS styling. Do NOT include any other external JavaScript or CSS files.
3.  Use ONLY Tailwind CSS classes for ALL styling within the <body>. Do NOT use inline \`style\` attributes.
4.  Do NOT include any <style> tags within the HTML document.
5.  Do NOT include any <script> tags or any JavaScript within the <body>. JavaScript is only allowed for the Tailwind CDN in the <head>.
6.  The HTML should be well-structured, responsive, and adhere to accessibility best practices (e.g., semantic tags, alt attributes for images).
7.  Focus on clean UX and modern aesthetics. Ensure good color contrast and readable fonts. If a specific theme is provided in the prompt (e.g., 'Sleek Dark Mode', 'Clean Light Mode', 'Vibrant & Playful', 'Professional Corporate', 'Retro Futuristic', 'Minimalist Zen'), the generated HTML's color palette, typography, and overall aesthetic MUST strongly align with that theme. If 'Default (AI's Best Guess)' is chosen, use your best judgment for a contemporary look.
8.  If you need placeholder images, use 'https://picsum.photos/seed/UNIQUE_SEED/WIDTH/HEIGHT' format, replacing UNIQUE_SEED (e.g., image1, image2), WIDTH and HEIGHT appropriately. The generated HTML should be visually appealing. Example: <img src="https://picsum.photos/seed/heroBanner/600/300" alt="Modern Hero Banner">
9.  The root element of your generated HTML's <body> should be designed to fill its container or viewport if appropriate, for example by having classes like 'h-screen flex flex-col' or similar on the <body> or a main wrapper div, depending on the content.
10. Generate rich content, not just a placeholder. Try to infer a realistic page structure based on the input. For example, if it's a forum, show some posts. If it's a shop, show some product cards. Make it look like a real, albeit simplified, modern webpage.
11. Provide ONLY the full HTML document, no surrounding text, markdown, or explanations like "Here is the HTML...". The response must be pure HTML starting with <!DOCTYPE html>.
`;

async function callGeminiApi(prompt: string): Promise<string> {
  const currentApiKey = ensureApiKey();
  const ai = new GoogleGenAI({ apiKey: currentApiKey });

  try {
    const response: GenerateContentResponse = await ai.models.generateContent({
      model: "gemini-2.5-flash-preview-04-17",
      contents: [{ role: "user", parts: [{ text: prompt }] }],
    });

    const textResponse = response.text;

    if (typeof textResponse !== "string" || textResponse.trim() === "") {
      const candidate = response.candidates?.[0];
      let reason = "AI response did not provide valid text or was empty.";
      if (candidate?.finishReason && candidate.finishReason !== "STOP") {
        reason = `Content generation stopped: ${candidate.finishReason}`;
        if (candidate.safetyRatings?.some((r) => r.blocked)) {
          reason = "Content was blocked due to safety filters.";
        }
      }
      throw new Error(`Failed to generate modernized HTML: ${reason}`);
    }

    let processedHtml = textResponse.trim();
    const fenceRegex = /^```(?:html)?\s*\n?([\s\S]*?)\s*```$/;
    const match = processedHtml.match(fenceRegex);

    if (match && typeof match[1] === "string") {
      processedHtml = match[1].trim();
    }

    const commonPhrases = [
      "here's the html",
      "here is the html",
      "okay, here's the html",
      "here is the full html document:",
    ];
    let lowerProcessedHtml = processedHtml.toLowerCase();

    // Remove potential leading phrases only if they are followed by <!DOCTYPE html>
    for (const phrase of commonPhrases) {
      if (lowerProcessedHtml.startsWith(phrase)) {
        const potentialHtmlStart = processedHtml.substring(phrase.length).trimStart();
        if (potentialHtmlStart.toLowerCase().startsWith("<!doctype html>")) {
          processedHtml = potentialHtmlStart;
          lowerProcessedHtml = processedHtml.toLowerCase(); // update for next iteration if needed
        }
        break;
      }
    }

    // Ensure it starts with <!DOCTYPE html>
    if (!processedHtml.toLowerCase().startsWith("<!doctype html>")) {
      // If it's just a snippet, it's an error now
      if (!processedHtml.toLowerCase().includes("<html") && !processedHtml.toLowerCase().includes("<body")) {
        console.warn("AI did not return a full HTML document. Received:", processedHtml.substring(0, 200) + "...");
        throw new Error("AI did not return a full HTML document as instructed. Please try again.");
      }
      // If it looks like HTML but missing doctype, prepend it (less ideal but a fallback)
      if (processedHtml.toLowerCase().startsWith("<html")) {
        console.warn("AI returned HTML without DOCTYPE, prepending it.");
        processedHtml = "<!DOCTYPE html>\n" + processedHtml;
      }
    }

    return processedHtml;
  } catch (error) {
    console.error("Error calling Gemini API:", error);
    if (error instanceof Error) {
      if (error.message.includes("API key not valid")) {
        throw new Error("Invalid Gemini API Key. Please check your configuration.");
      }
      if (error.message.toLowerCase().includes("quota") || error.message.toLowerCase().includes("resource exhausted")) {
        throw new Error(
          "API quota exceeded or resource limit reached. Please check your Gemini project quotas or try again later."
        );
      }
      throw new Error(`Failed to communicate with AI model: ${error.message}`);
    }
    throw new Error("Failed to generate modernized HTML due to an unknown AI error.");
  }
}

export async function generateModernizedHtml(description: string, theme: string): Promise<string> {
  const prompt = `You are an expert web developer specializing in modernizing outdated websites. Given the following description of an old website and a desired theme, generate a single, self-contained, full HTML document representing a modernized version of its main page or a key feature.

Old Website Description:
---
${description}
---

Desired Modern Theme: ${theme}
---

${COMMON_HTML_RULES}

Adhere closely to the '${theme}' theme when choosing colors, typography, component styles, and overall aesthetic.
Generate the full HTML document for the modern version:`;

  return callGeminiApi(prompt);
}

export async function analyzeAndModernizeUrl(url: string, theme: string): Promise<string> {
  const prompt = `You are an expert web analyst and modern web developer. You will be given a URL of a website and a desired theme.

Your Task:
1.  **Infer Analysis**: Based on your knowledge of common website patterns, the potential era/style of websites like the one at the given URL, and by imagining you have crawled and analyzed its content, briefly describe:
    *   Its likely primary purpose or category (e.g., e-commerce, blog, forum, corporate, personal homepage, university site).
    *   Common layout patterns it might use (e.g., 2-column, header-content-footer, table-based, navigation menus).
    *   Typical color schemes for such older sites (e.g., neon on black, muted corporate blues, garish colors).
    *   Key components or features it might have (e.g., forms, image galleries, guestbooks, product listings).
    *(This inferred analysis is for your internal reasoning and should guide your HTML generation. Do not include this analysis in the HTML output.)*

2.  **Generate Modernized HTML**: Using your inferred analysis AND the specified theme, generate a single, self-contained, full HTML document representing a modernized version of its main page or a key feature.

Provided URL:
---
${url}
---

Desired Modern Theme: ${theme}
---

${COMMON_HTML_RULES}

Adhere closely to the '${theme}' theme when choosing colors, typography, component styles, and overall aesthetic based on your inferred analysis of the URL.
Generate the full HTML document for the modern version:`;

  return callGeminiApi(prompt);
}
