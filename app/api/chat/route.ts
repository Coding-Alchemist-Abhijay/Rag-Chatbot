import { GoogleGenerativeAI } from "@google/generative-ai";

import pkg from "@google/generative-ai/package.json";
console.log("Google Generative AI SDK version:", pkg.version);

export async function POST(req: Request) {
  try {
    const { message } = await req.json();

    const prompt = message || "Hello!";

    // ✅ Initialize Gemini client with your API key
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

    // ✅ Use the correct model name (gemini-2.0-flash is generally available)
    const model = genAI.getGenerativeModel({
      model: "gemini-2.0-flash",
    });

    // ✅ New structured input format for v1 API
    const result = await model.generateContent({
      contents: [
        {
          role: "user",
          parts: [{ text: prompt }],
        },
      ],
    });

    // ✅ Get response text
    const text = result.response.text();
    
    // Debug: Log the response to see what we're getting
    console.log("Full result:", JSON.stringify(result, null, 2));
    console.log("Response text:", text);

    // ✅ Return response (frontend expects 'response' field)
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
