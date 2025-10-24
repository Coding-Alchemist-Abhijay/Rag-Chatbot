import { NextRequest, NextResponse } from "next/server";
import { queryDocuments } from "@/lib/vectordb";
import { chatWithGemini } from "@/lib/geminiClient";

export async function POST(req: NextRequest) {
  try {
    const { message } = await req.json();

    if (!message || message.trim() === "") {
      return NextResponse.json({ 
        error: "Please provide a valid message." 
      }, { status: 400 });
    }

    console.log(`🔍 Processing query: "${message}"`);

    const context = await queryDocuments(message, 3);

    const systemPrompt = context.length > 0
      ? `You are CricketSensei, a friendly cricket expert chatbot. Use the following context to answer the user's question. If the answer isn't in the context, say so clearly and provide general knowledge.

Context:
${context.join("\n\n")}`
      : `You are CricketSensei, a friendly cricket expert chatbot. No specific context was found, so use your general cricket knowledge to answer the question.`;

    const response = await chatWithGemini(message, systemPrompt);

    console.log(`Generated response successfully`);

    return NextResponse.json({ 
      response: response,
      contextFound: context.length > 0,
      contextCount: context.length
    });

  } catch (error: unknown) {
    console.error("chat error:", error);
    
    const errorMessage = error instanceof Error ? error.message : "Internal server error";
    return NextResponse.json({ 
      error: errorMessage,
      response: "Sorry, I'm having trouble processing your request. Please try again later."
    }, { status: 500 });
  }
}
