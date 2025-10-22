import { GoogleGenerativeAI } from '@google/generative-ai';
import fs from 'fs';
import path from 'path';

export interface Document {
  id: string;
  content: string;
  embedding: number[];
  metadata?: {
    title?: string;
    source?: string;
    [key: string]: any;
  };
}

export class VectorDB {
  private documents: Document[] = [];
  private genAI: GoogleGenerativeAI;
  private dbPath: string;

  constructor(apiKey: string) {
    this.genAI = new GoogleGenerativeAI(apiKey);
    this.dbPath = path.join(process.cwd(), 'data', 'vectordb.json');
    this.loadFromDisk();
  }

  private loadFromDisk() {
    try {
      if (fs.existsSync(this.dbPath)) {
        const data = fs.readFileSync(this.dbPath, 'utf-8');
        this.documents = JSON.parse(data);
      }
    } catch (error) {
      console.error('Error loading vector database:', error);
      this.documents = [];
    }
  }

  private saveToDisk() {
    try {
      const dir = path.dirname(this.dbPath);
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
      }
      fs.writeFileSync(this.dbPath, JSON.stringify(this.documents, null, 2));
    } catch (error) {
      console.error('Error saving vector database:', error);
    }
  }

  async generateEmbedding(text: string): Promise<number[]> {
    try {
      const model = this.genAI.getGenerativeModel({ model: 'embedding-001' });
      const result = await model.embedContent(text);
      return result.embedding.values;
    } catch (error) {
      console.error('Error generating embedding:', error);
      throw error;
    }
  }

  private cosineSimilarity(a: number[], b: number[]): number {
    if (a.length !== b.length) {
      throw new Error('Vectors must have the same length');
    }
    
    let dotProduct = 0;
    let normA = 0;
    let normB = 0;
    
    for (let i = 0; i < a.length; i++) {
      dotProduct += a[i] * b[i];
      normA += a[i] * a[i];
      normB += b[i] * b[i];
    }
    
    return dotProduct / (Math.sqrt(normA) * Math.sqrt(normB));
  }

  async addDocument(content: string, metadata?: Document['metadata']): Promise<string> {
    const id = `doc_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const embedding = await this.generateEmbedding(content);
    
    const document: Document = {
      id,
      content,
      embedding,
      metadata
    };
    
    this.documents.push(document);
    this.saveToDisk();
    
    return id;
  }

  async search(query: string, topK: number = 3): Promise<Document[]> {
    if (this.documents.length === 0) {
      return [];
    }

    const queryEmbedding = await this.generateEmbedding(query);
    
    const scoredDocs = this.documents.map(doc => ({
      doc,
      score: this.cosineSimilarity(queryEmbedding, doc.embedding)
    }));
    
    scoredDocs.sort((a, b) => b.score - a.score);
    
    return scoredDocs.slice(0, topK).map(item => item.doc);
  }

  getAllDocuments(): Document[] {
    return this.documents;
  }

  clear() {
    this.documents = [];
    this.saveToDisk();
  }

  getDocumentCount(): number {
    return this.documents.length;
  }
}
