import { GoogleGenerativeAI } from "@google/generative-ai";


const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);
const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

export const chatWithGemini = async (userMessage: string, systemPrompt?: string): Promise<string> => {
  try {
    const fullPrompt = systemPrompt 
      ? `${systemPrompt}\n\nUser Question: ${userMessage}\n\nPlease provide a helpful and accurate answer based on the context provided.`
      : `You are a friendly cricket expert chatbot. Answer the following question about cricket in a helpful and engaging way:\n\n${userMessage}`;

    const result = await model.generateContent(fullPrompt);
    const response = result.response.text();

    console.log(`🤖 Generated response for: "${userMessage}"`);
    return response;
  } catch (error) {
    console.error("❌ Error generating Gemini response:", error);
    
    if (error instanceof Error) {
      if (error.message.includes("503")) {
        return "⚠️ The AI model is temporarily overloaded. Please try again in a few seconds.";
      }
      if (error.message.includes("404")) {
        return "❌ AI model not found. Please check your API configuration.";
      }
    }
    
    return "❌ Sorry, I'm having trouble generating a response right now. Please try again later.";
  }
};
