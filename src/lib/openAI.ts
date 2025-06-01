"use server";

import OpenAI from "openai";

const client = new OpenAI({ apiKey: process.env.NEXT_PUBLIC_OPENAI_API_KEY });

export const callOpenAI = async () => {
  const response = await client.responses.create({
    model: "gpt-4.1",
    tools: [{ type: "web_search_preview" }],
    input: "What was a positive news story from today?",
  });

  console.log(response.output_text);
};
