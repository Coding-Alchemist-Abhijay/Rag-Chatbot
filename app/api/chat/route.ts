import { GoogleGenerativeAI } from "@google/generative-ai";

import pkg from "@google/generative-ai/package.json";
console.log("Google Generative AI SDK version:", pkg.version);

export async function POST(req: Request) {
  try {
    const { message } = await req.json();

    const prompt = message || "Hello!";

    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

    const model = genAI.getGenerativeModel({
      model: "gemini-2.0-flash",
    });

    const result = await model.generateContent({
      contents: [
        {
          role: "user",
          parts: [{ text: prompt }],
        },
      ],
    });

    const text = result.response.text();
    
    return new Response(JSON.stringify({ response: text }), {
      headers: { "Content-Type": "application/json" },
    });
  } catch (error: unknown) {
    console.error("Chat error:", error);
    const errorMessage = error instanceof Error ? error.message : "Internal Server Error";
    return new Response(
      JSON.stringify({
        error: errorMessage,
        details: error,
      }),
      { status: 500 }
    );
  }
}
