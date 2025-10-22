import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { verifyToken } from '@/lib/auth';
import { rateLimiter } from '@/lib/ratelimit';
import { VectorDB } from '@/lib/vectordb';

const GEMINI_API_KEY = process.env.GEMINI_API_KEY || '';
let vectorDB: VectorDB | null = null;

function getVectorDB() {
  if (!vectorDB && GEMINI_API_KEY) {
    vectorDB = new VectorDB(GEMINI_API_KEY);
  }
  return vectorDB;
}

export async function POST(request: NextRequest) {
  try {
    // Extract and verify token
    const authHeader = request.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const token = authHeader.substring(7);
    const payload = verifyToken(token);
    if (!payload) {
      return NextResponse.json(
        { error: 'Invalid token' },
        { status: 401 }
      );
    }

    // Check rate limit
    const { allowed, remaining, resetTime } = rateLimiter.check(payload.userId);
    
    const headers = {
      'X-RateLimit-Remaining': remaining.toString(),
      'X-RateLimit-Reset': new Date(resetTime).toISOString()
    };

    if (!allowed) {
      return NextResponse.json(
        { 
          error: 'Rate limit exceeded. Please try again later.',
          resetTime: new Date(resetTime).toISOString()
        },
        { 
          status: 429,
          headers
        }
      );
    }

    // Get message from request
    const { message } = await request.json();
    if (!message) {
      return NextResponse.json(
        { error: 'Message is required' },
        { status: 400, headers }
      );
    }

    if (!GEMINI_API_KEY) {
      return NextResponse.json(
        { error: 'GEMINI_API_KEY not configured' },
        { status: 500, headers }
      );
    }

    // Retrieve relevant documents
    const db = getVectorDB();
    const relevantDocs = db ? await db.search(message, 3) : [];

    // Build context from retrieved documents
    let context = '';
    if (relevantDocs.length > 0) {
      context = 'Here is relevant information from the knowledge base:\n\n';
      relevantDocs.forEach((doc, idx) => {
        context += `[${idx + 1}] ${doc.content}\n\n`;
      });
    }

    // Generate response using Gemini
    const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({ model: 'gemini-pro' });

    const prompt = context 
      ? `${context}\nUser question: ${message}\n\nPlease answer the question based on the information provided above. If the information is not sufficient, you can use your general knowledge but indicate that.`
      : message;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    return NextResponse.json({
      response: text,
      sources: relevantDocs.map(doc => ({
        content: doc.content.substring(0, 200) + '...',
        metadata: doc.metadata
      }))
    }, { headers });

  } catch (error) {
    console.error('Chat error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
