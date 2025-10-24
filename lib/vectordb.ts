import { Pinecone } from "@pinecone-database/pinecone";
import { GoogleGenerativeAI } from "@google/generative-ai";

let pinecone: Pinecone | null = null;
let index: any = null; // eslint-disable-line @typescript-eslint/no-explicit-any

if (process.env.PINECONE_API_KEY) {
  pinecone = new Pinecone({
    apiKey: process.env.PINECONE_API_KEY,
  });
  
  const indexName = process.env.PINECONE_INDEX_NAME || "cricket-sensei";
  index = pinecone.Index(indexName);
}

let genAI: GoogleGenerativeAI | null = null;

if (process.env.GEMINI_API_KEY) {
  genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
}

export const upsertDocument = async (id: string, text: string, metadata?: Record<string, string | number | boolean>) => {
  if (!genAI || !index) {
    throw new Error(" API keys not configured. Please set GEMINI_API_KEY and PINECONE_API_KEY in your .env.local file");
  }

  try {

    const embeddingModel = genAI.getGenerativeModel({ model: "text-embedding-004" });
    const embeddingResult = await embeddingModel.embedContent(text);
    const vector = embeddingResult.embedding.values;

    await index.upsert([{
      id,
      values: vector,
      metadata: { 
        text, 
        ...metadata 
      },
    }]);

    console.log(`✅ Document ${id} upserted successfully`);
  } catch (error) {
    console.error(` Error upserting document ${id}:`, error);
    throw error;
  }
};

export const queryDocuments = async (query: string, topK = 5): Promise<string[]> => {
  if (!genAI || !index) {
    console.log(" API keys not configured. Returning empty context.");
    return [];
  }

  try {

    const embeddingModel = genAI.getGenerativeModel({ model: "text-embedding-004" });
    const embeddingResult = await embeddingModel.embedContent(query);
    const queryVector = embeddingResult.embedding.values;


    const result = await index.query({
      vector: queryVector,
      topK,
      includeMetadata: true,
    });


    const documents = result.matches?.map((match: any) => { // eslint-disable-line @typescript-eslint/no-explicit-any
      return (match.metadata?.text as string) || "";
    }).filter(Boolean) || [];

    console.log(`🔍 Found ${documents.length} relevant documents for query: "${query}"`);
    return documents;
  } catch (error) {
    console.error(" Error querying documents:", error);
    return [];
  }
};

// Function to ingest cricket data
export const ingestCricketData = async () => {
  const cricketData = [
    {
      id: "cricket-1",
      title: "Cricket World Cup 2023",
      content: "The 2023 Cricket World Cup was held in India from October to November 2023. India won the tournament, defeating Australia in the final at the Narendra Modi Stadium in Ahmedabad. Virat Kohli was the tournament's leading run-scorer with 765 runs."
    },
    {
      id: "cricket-2", 
      title: "T20 Cricket Format",
      content: "Twenty20 (T20) is the shortest format of cricket, lasting about 3 hours. Each team plays a single innings, batting for a maximum of 20 overs. T20 cricket was first introduced in England in 2003 and has become immensely popular worldwide."
    },
    {
      id: "cricket-3",
      title: "Test Cricket", 
      content: "Test cricket is the longest format of the game, played over five days with two innings per side. It is considered the pinnacle of cricket and tests the endurance, skill, and strategy of players. The first Test match was played between Australia and England in 1877."
    },
    {
      id: "cricket-4",
      title: "IPL - Indian Premier League",
      content: "The Indian Premier League (IPL) is a professional Twenty20 cricket league in India. Founded in 2008, it features franchise teams representing different cities. The IPL has become one of the richest and most-watched cricket leagues in the world."
    },
    {
      id: "cricket-5",
      title: "Cricket Rules - Basics",
      content: "Cricket is played between two teams of 11 players each. The batting team tries to score runs by hitting the ball and running between wickets. The bowling team tries to dismiss batters and restrict runs. A match is won by the team that scores more runs."
    },
    {
      id: "cricket-6",
      title: "Cricket Equipment",
      content: "Essential cricket equipment includes a bat (made of willow wood), a leather ball (red for Tests, white for limited-overs), stumps and bails, protective gear like pads, gloves, helmet, and appropriate cricket shoes with spikes."
    },
    {
      id: "cricket-7",
      title: "Famous Cricket Players",
      content: "Some of the greatest cricket players include Sachin Tendulkar (India), Sir Donald Bradman (Australia), Virat Kohli (India), Steve Smith (Australia), and AB de Villiers (South Africa). These players have set numerous records and inspired millions."
    },
    {
      id: "cricket-8",
      title: "Cricket Scoring",
      content: "Runs can be scored by hitting the ball and running between wickets (1, 2, or 3 runs), hitting boundaries (4 runs if the ball touches the ground before crossing the boundary, 6 runs if it crosses the boundary without touching the ground)."
    },
    {
      id: "cricket-9",
      title: "ODI Cricket",
      content: "One Day International (ODI) cricket is a limited-overs format where each team plays 50 overs. The first ODI was played in 1971. The ICC Cricket World Cup, held every four years, is played in the ODI format and is one of the most prestigious tournaments."
    },
    {
      id: "cricket-10",
      title: "Cricket Fielding Positions",
      content: "Cricket has numerous fielding positions including slip, gully, point, cover, mid-off, mid-on, mid-wicket, square leg, fine leg, and third man. The captain strategically places fielders based on the batsman's style and match situation."
    }
  ];
};
