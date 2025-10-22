import { VectorDB } from '../lib/vectordb';
import * as dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const GEMINI_API_KEY = process.env.GEMINI_API_KEY || '';

// Sample cricket data for demonstration
const cricketData = [
  {
    title: "Cricket World Cup 2023",
    content: "The 2023 Cricket World Cup was held in India from October to November 2023. India won the tournament, defeating Australia in the final at the Narendra Modi Stadium in Ahmedabad. Virat Kohli was the tournament's leading run-scorer with 765 runs.",
  },
  {
    title: "T20 Cricket Format",
    content: "Twenty20 (T20) is the shortest format of cricket, lasting about 3 hours. Each team plays a single innings, batting for a maximum of 20 overs. T20 cricket was first introduced in England in 2003 and has become immensely popular worldwide.",
  },
  {
    title: "Test Cricket",
    content: "Test cricket is the longest format of the game, played over five days with two innings per side. It is considered the pinnacle of cricket and tests the endurance, skill, and strategy of players. The first Test match was played between Australia and England in 1877.",
  },
  {
    title: "IPL - Indian Premier League",
    content: "The Indian Premier League (IPL) is a professional Twenty20 cricket league in India. Founded in 2008, it features franchise teams representing different cities. The IPL has become one of the richest and most-watched cricket leagues in the world.",
  },
  {
    title: "Cricket Rules - Basics",
    content: "Cricket is played between two teams of 11 players each. The batting team tries to score runs by hitting the ball and running between wickets. The bowling team tries to dismiss batters and restrict runs. A match is won by the team that scores more runs.",
  },
  {
    title: "Cricket Equipment",
    content: "Essential cricket equipment includes a bat (made of willow wood), a leather ball (red for Tests, white for limited-overs), stumps and bails, protective gear like pads, gloves, helmet, and appropriate cricket shoes with spikes.",
  },
  {
    title: "Famous Cricket Players",
    content: "Some of the greatest cricket players include Sachin Tendulkar (India), Sir Donald Bradman (Australia), Virat Kohli (India), Steve Smith (Australia), and AB de Villiers (South Africa). These players have set numerous records and inspired millions.",
  },
  {
    title: "Cricket Scoring",
    content: "Runs can be scored by hitting the ball and running between wickets (1, 2, or 3 runs), hitting boundaries (4 runs if the ball touches the ground before crossing the boundary, 6 runs if it crosses the boundary without touching the ground).",
  },
  {
    title: "ODI Cricket",
    content: "One Day International (ODI) cricket is a limited-overs format where each team plays 50 overs. The first ODI was played in 1971. The ICC Cricket World Cup, held every four years, is played in the ODI format and is one of the most prestigious tournaments.",
  },
  {
    title: "Cricket Fielding Positions",
    content: "Cricket has numerous fielding positions including slip, gully, point, cover, mid-off, mid-on, mid-wicket, square leg, fine leg, and third man. The captain strategically places fielders based on the batsman's style and match situation.",
  }
];

async function ingestData() {
  if (!GEMINI_API_KEY) {
    console.error('GEMINI_API_KEY not found in environment variables');
    process.exit(1);
  }

  console.log('Initializing Vector Database...');
  const vectorDB = new VectorDB(GEMINI_API_KEY);

  console.log('Starting data ingestion...');
  
  for (const item of cricketData) {
    try {
      console.log(`Processing: ${item.title}`);
      await vectorDB.addDocument(item.content, {
        title: item.title,
        source: 'cricket-knowledge-base'
      });
      console.log(`✓ Added: ${item.title}`);
    } catch (error) {
      console.error(`✗ Error adding ${item.title}:`, error);
    }
  }

  console.log(`\nIngestion complete! Total documents: ${vectorDB.getDocumentCount()}`);
}

ingestData().catch(console.error);
