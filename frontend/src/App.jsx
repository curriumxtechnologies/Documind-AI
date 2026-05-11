import { useState } from "react";
import { Brain, Sparkles, ShieldCheck, Search } from "lucide-react";
import UploadBox from "./components/UploadBox";
import ChatBox from "./components/ChatBox";
import Sidebar from "./components/Sidebar";

export default function App() {
  const [activeDocument, setActiveDocument] = useState(null);

  return (
    <div className="min-h-screen overflow-hidden bg-slate-950 text-white">
      <div className="pointer-events-none fixed inset-0">
        <div className="absolute left-[-10%] top-[-10%] h-72 w-72 rounded-full bg-cyan-500/20 blur-3xl" />
        <div className="absolute right-[-10%] top-[20%] h-96 w-96 rounded-full bg-violet-500/20 blur-3xl" />
        <div className="absolute bottom-[-10%] left-[30%] h-80 w-80 rounded-full bg-blue-500/10 blur-3xl" />
      </div>

      <header className="relative z-10 border-b border-slate-800/80 bg-slate-950/70 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-5">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-cyan-400 text-slate-950 shadow-lg shadow-cyan-500/30">
              <Brain size={24} />
            </div>

            <div>
              <p className="text-lg font-bold">DocuMind AI</p>
              <p className="text-xs text-slate-400">
                Ask questions. Get answers from your documents.
              </p>
            </div>
          </div>

          <nav className="hidden items-center gap-6 text-sm text-slate-300 md:flex">
            <a href="#upload" className="hover:text-cyan-300">Upload</a>
            <a href="#chat" className="hover:text-cyan-300">Chat</a>
            <a href="#features" className="hover:text-cyan-300">Features</a>
          </nav>
        </div>
      </header>

      <main className="relative z-10 mx-auto max-w-7xl px-5 py-10">
        <section className="grid items-center gap-10 py-12 lg:grid-cols-[1.1fr_0.9fr]">
          <div>
            <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-cyan-400/30 bg-cyan-400/10 px-4 py-2 text-sm text-cyan-300">
              <Sparkles size={16} />
              AI-powered document intelligence
            </div>

            <h1 className="max-w-4xl text-5xl font-black leading-tight tracking-tight md:text-7xl">
              DocuMind AI
            </h1>

            <p className="mt-5 max-w-2xl text-xl leading-8 text-slate-300">
              Ask questions. Get answers from your documents.
            </p>

            <p className="mt-4 max-w-2xl text-base leading-7 text-slate-400">
              Upload technical documents and instantly retrieve intelligent
              answers powered by AI.
            </p>

            <a
              href="#upload"
              className="mt-8 inline-flex rounded-2xl bg-cyan-400 px-6 py-4 text-sm font-bold text-slate-950 shadow-xl shadow-cyan-500/20 transition hover:bg-cyan-300"
            >
              Upload Document
            </a>
          </div>

          <div className="glass animate-float rounded-4xl p-6">
            <div className="rounded-3xl bg-slate-950 p-5">
              <div className="mb-4 flex items-center gap-2">
                <div className="h-3 w-3 rounded-full bg-red-400" />
                <div className="h-3 w-3 rounded-full bg-yellow-400" />
                <div className="h-3 w-3 rounded-full bg-green-400" />
              </div>

              <div className="space-y-3">
                <div className="rounded-2xl bg-slate-900 p-4 text-sm text-slate-300">
                  What does this document say about authentication?
                </div>

                <div className="rounded-2xl border border-cyan-400/20 bg-cyan-400/10 p-4 text-sm leading-6 text-slate-200">
                  Authentication is handled using JWT tokens based on the
                  retrieved source sections.
                </div>

                <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-4 text-xs text-slate-400">
                  Source: Page 5 — Authentication
                </div>
              </div>
            </div>
          </div>
        </section>

        <section id="features" className="grid gap-4 py-8 md:grid-cols-3">
          <div className="glass rounded-3xl p-5">
            <Search className="mb-4 text-cyan-300" />
            <h3 className="font-semibold">Semantic Search</h3>
            <p className="mt-2 text-sm leading-6 text-slate-400">
              Finds relevant sections by meaning, not just keywords.
            </p>
          </div>

          <div className="glass rounded-3xl p-5">
            <ShieldCheck className="mb-4 text-emerald-300" />
            <h3 className="font-semibold">Grounded Answers</h3>
            <p className="mt-2 text-sm leading-6 text-slate-400">
              Answers only from uploaded document context.
            </p>
          </div>

          <div className="glass rounded-3xl p-5">
            <Brain className="mb-4 text-violet-300" />
            <h3 className="font-semibold">RAG Architecture</h3>
            <p className="mt-2 text-sm leading-6 text-slate-400">
              Uses embeddings, ChromaDB, retrieval, and OpenAI.
            </p>
          </div>
        </section>

        <section id="upload" className="grid gap-6 py-10 lg:grid-cols-[0.9fr_1.1fr]">
          <div className="space-y-6">
            <UploadBox onUploaded={setActiveDocument} />
            <Sidebar activeDocument={activeDocument} />
          </div>

          <div id="chat">
            <ChatBox activeDocument={activeDocument} />
          </div>
        </section>
      </main>
    </div>
  );
}