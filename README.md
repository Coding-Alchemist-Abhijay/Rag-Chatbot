# CricketBot - RAG Chatbot 🏏🤖

A **Retrieval-Augmented Generation (RAG)** chatbot built with **Next.js**, **TypeScript**, and **Google's Gemini AI**. This chatbot provides accurate answers to cricket-related questions by combining AI-powered responses with a custom cricket knowledge base.

## 🌟 Features

- **RAG Architecture**: Retrieval-Augmented Generation using vector embeddings for accurate, context-aware responses
- **Gemini AI Integration**: Powered by Google's Gemini Pro model for natural language understanding
- **User Authentication**: Secure JWT-based authentication with login/signup functionality
- **Rate Limiting**: User-based rate limiting (4 requests per minute) to ensure fair usage
- **Vector Database**: Custom file-based vector database with cosine similarity search
- **Responsive UI**: Clean, modern interface built with Tailwind CSS
- **Cricket Knowledge Base**: Pre-loaded with comprehensive cricket information

## 🏗️ Architecture

### Tech Stack

- **Framework**: Next.js 16 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **AI Model**: Google Gemini Pro & Embedding-001
- **Authentication**: JWT with bcrypt
- **Rate Limiting**: In-memory user-based throttling

### How RAG Works

1. **Document Ingestion**: Cricket knowledge is converted to embeddings using Gemini's embedding model
2. **Vector Storage**: Embeddings are stored in a JSON-based vector database
3. **Query Processing**: User queries are converted to embeddings
4. **Similarity Search**: Top-K most relevant documents are retrieved using cosine similarity
5. **Response Generation**: Retrieved context + user query are sent to Gemini Pro for answer generation

### Project Structure

```
rag-chatbot/
├── app/
│   ├── api/
│   │   ├── auth/
│   │   │   ├── login/route.ts      # Login endpoint
│   │   │   └── signup/route.ts     # Signup endpoint
│   │   └── chat/route.ts           # Chat endpoint with RAG
│   ├── chat/page.tsx               # Chat interface
│   ├── login/page.tsx              # Login page
│   ├── signup/page.tsx             # Signup page
│   └── page.tsx                    # Landing page
├── lib/
│   ├── auth.ts                     # Authentication utilities
│   ├── ratelimit.ts                # Rate limiting logic
│   └── vectordb.ts                 # Vector database implementation
├── scripts/
│   └── ingest-data.ts              # Data ingestion script
└── data/
    ├── vectordb.json               # Vector embeddings storage
    └── users.json                  # User data storage
```

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ installed
- A Google Gemini API key ([Get one here](https://aistudio.google.com/app/api-keys))

### Installation

1. **Install dependencies**:
   ```bash
   npm install
   ```

2. **Set up environment variables**:
   Create a `.env.local` file in the root directory:
   ```bash
   cp .env.example .env.local
   ```

   Edit `.env.local` and add your credentials:
   ```env
   GEMINI_API_KEY=your_actual_gemini_api_key
   JWT_SECRET=your_random_secret_key_minimum_32_characters
   ```

3. **Ingest cricket data into the vector database**:
   ```bash
   npm run ingest
   ```

4. **Run the development server**:
   ```bash
   npm run dev
   ```

5. **Open your browser** and navigate to:
   ```
   http://localhost:3000
   ```

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run ingest` - Ingest data into vector database
- `npm run lint` - Run ESLint

## 📖 Usage

### First Time Setup

1. Visit `http://localhost:3000`
2. Click "Sign Up" and create an account
3. Log in with your credentials
4. Start chatting about cricket!

### Example Questions

- "What is Test cricket?"
- "Tell me about the IPL"
- "How do you score runs in cricket?"
- "Who are some famous cricket players?"
- "What is the difference between ODI and T20?"

### Rate Limits

- **4 requests per minute** per user
- Rate limit info displayed in chat interface
- Resets automatically after 60 seconds

## 🔧 Customization

### Adding Your Own Data

1. Edit `scripts/ingest-data.ts`
2. Replace the `cricketData` array with your own content
3. Run `npm run ingest` to update the vector database

### Changing Topics

This chatbot is pre-configured for cricket, but you can easily adapt it for other topics:

1. Update the data in `scripts/ingest-data.ts`
2. Modify the UI text in `app/page.tsx` and `app/chat/page.tsx`
3. Re-ingest the data

### Adjusting Rate Limits

In `lib/ratelimit.ts`, modify the constructor parameters:
```typescript
export const rateLimiter = new RateLimiter(4, 60000); // (requests, window_ms)
```

## 🌐 Deployment

### Deploy to Vercel

1. **Push your code to GitHub**:
   ```bash
   git add .
   git commit -m "Initial commit"
   git remote add origin your-github-repo-url
   git push -u origin main
   ```

2. **Deploy to Vercel**:
   - Go to [vercel.com](https://vercel.com)
   - Click "Import Project"
   - Select your GitHub repository
   - Add environment variables:
     - `GEMINI_API_KEY`
     - `JWT_SECRET`
   - Click "Deploy"

3. **After deployment**:
   - Your app will be live at `your-app.vercel.app`
   - Run the ingestion script once to populate the database

### Environment Variables for Production

Make sure to set these in your Vercel project settings:

- `GEMINI_API_KEY` - Your Gemini API key
- `JWT_SECRET` - A strong random secret (32+ characters)

## 🔒 Security Considerations

- **JWT Secret**: Always use a strong, random JWT secret in production
- **API Keys**: Never commit API keys to version control
- **HTTPS**: Vercel provides HTTPS by default
- **Rate Limiting**: Protects against abuse
- **Password Hashing**: Uses bcrypt with salt rounds

## 📚 Libraries Used

- **[@google/generative-ai](https://www.npmjs.com/package/@google/generative-ai)**: Gemini AI SDK
- **[jsonwebtoken](https://www.npmjs.com/package/jsonwebtoken)**: JWT authentication
- **[bcryptjs](https://www.npmjs.com/package/bcryptjs)**: Password hashing
- **[Next.js](https://nextjs.org/)**: React framework
- **[Tailwind CSS](https://tailwindcss.com/)**: Styling
- **[TypeScript](https://www.typescriptlang.org/)**: Type safety

## 🤝 Contributing

This is a project for learning and demonstration. Feel free to fork and modify for your own use!

## 📝 License

MIT License - Feel free to use this project for learning or building your own applications.

## 🎯 Future Enhancements (Optional)

- [ ] MongoDB Atlas for chat history storage
- [ ] Conversation persistence
- [ ] Multi-user chat sessions
- [ ] Advanced vector database (Pinecone, Weaviate)
- [ ] More comprehensive cricket dataset
- [ ] User profile management
- [ ] Export chat history

## 🙏 Acknowledgments

- Google Gemini AI for the powerful language models
- Cricket data compiled from various public sources
- Next.js team for the amazing framework

## 📧 Support

For issues or questions:
1. Check the documentation above
2. Review the [Gemini API docs](https://ai.google.dev/gemini-api/docs)
3. Check [Next.js documentation](https://nextjs.org/docs)

---

**Built with ❤️ for the cricket community**
