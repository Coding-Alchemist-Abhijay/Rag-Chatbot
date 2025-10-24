'use client';

import { useRouter } from 'next/navigation';
import SignIn from '@/components/signIn';
import SignOut from '@/components/signOut';
import { SignedIn, SignedOut } from '@clerk/nextjs'; 
import { useUser} from "@clerk/nextjs";

 export default function Home() {
  const router = useRouter();
  const { isSignedIn, user } = useUser();

  const handleGetStarted = () => { 
    if (isSignedIn) {
      router.push('/chat');
    } else {
      router.push('/sign-in');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <div className="flex-shrink-0 flex items-center">
              <h1 className="text-2xl font-bold text-indigo-600">CricketSensei</h1>
            </div>
            <div className="flex items-center space-x-4">
              {isSignedIn ? (
                <>
                <button
                  onClick={() => router.push('/chat')}
                  className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-md text-sm font-medium transition"
                >
                  Go to Chat
                </button>
                <SignedIn>
                <SignOut />
                </SignedIn>
                </>
              ) : (
                <>
                <SignedOut>
                <SignIn />
                </SignedOut>
                </>
              )}
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center">
          <h1 className="text-5xl font-extrabold text-gray-900 sm:text-6xl md:text-7xl">
            <span className="block">Your Cricket</span>
            <span className="block text-indigo-600">Knowledge Companion</span>
          </h1>
          <p className="mt-6 max-w-2xl mx-auto text-xl text-gray-600">
            Ask anything about cricket! From rules and history to recent matches and player stats.
            Powered by AI and a comprehensive cricket knowledge base.
          </p>
          <div className="mt-10 flex justify-center gap-4">
            <button
              onClick={handleGetStarted}
              className="px-8 py-3 border border-transparent text-base font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 md:py-4 md:text-lg md:px-10 transition"
            >
              Get Started
            </button>
            <button
              onClick={() => document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' })}
              className="px-8 py-3 border border-gray-300 text-base font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 md:py-4 md:text-lg md:px-10 transition"
            >
              Learn More
            </button>
          </div>
        </div>

        <div id="features" className="mt-32">
          <h2 className="text-3xl font-extrabold text-gray-900 text-center mb-12">
            Features
          </h2>
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="text-indigo-600 text-3xl mb-4">🤖</div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">AI-Powered Responses</h3>
              <p className="text-gray-600">
                Get accurate answers powered by Google`s Gemini AI and our cricket knowledge base.
              </p>
            </div>
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="text-indigo-600 text-3xl mb-4">🔐</div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Secure Authentication</h3>
              <p className="text-gray-600">
                Your account and conversations are protected with Clerk  authentication.
              </p>
            </div>
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="text-indigo-600 text-3xl mb-4">⚡</div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Fast & Reliable</h3>
              <p className="text-gray-600">
                Quick responses with built-in rate limiting to ensure fair usage for everyone.
              </p>
            </div>
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="text-indigo-600 text-3xl mb-4">🏏</div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Cricket Expertise</h3>
              <p className="text-gray-600">
                Comprehensive knowledge about cricket rules, formats, history, and players.
              </p>
            </div>
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="text-indigo-600 text-3xl mb-4">📚</div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">RAG Technology</h3>
              <p className="text-gray-600">
                Retrieval-Augmented Generation ensures accurate, context-aware responses.
              </p>
            </div>
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="text-indigo-600 text-3xl mb-4">💬</div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Natural Conversations</h3>
              <p className="text-gray-600">
                Chat naturally about cricket - ask questions, explore topics, and learn more.
              </p>
            </div>
          </div>
        </div>
      </main>

      <footer className="bg-white mt-32">
        <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
          <p className="text-center text-gray-500 text-sm">
            © 2025 CricketBot RAG Chatbot Built By Abhijay Singh ❤️
          </p>
        </div>
      </footer>
    </div>
  );
}
