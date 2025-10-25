import { ingestCricketData } from '../lib/vectordb';
import * as dotenv from 'dotenv';

// Load environment variables
dotenv.config({ path: '.env.local' });

async function main() {
  console.log('🚀 Starting cricket data ingestion...');
  
  try {
    await ingestCricketData();
    console.log('✅ Cricket data ingestion completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Cricket data ingestion failed:', error);
    process.exit(1);
  }
}

main();
