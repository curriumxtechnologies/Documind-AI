import { useEffect, useRef, useState } from "react";
import { Send, User, Loader2 } from "lucide-react";
import { askQuestion } from "../api";
import AnswerCard from "./AnswerCard";

export default function ChatBox({ activeDocument }) {
  const [question, setQuestion] = useState("");
  const [messages, setMessages] = useState([]);
  const [asking, setAsking] = useState(false);
  const [error, setError] = useState("");
  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, asking]);

  const submitQuestion = async (event) => {
    event.preventDefault();

    if (!activeDocument) {
      setError("Please upload a document first.");
      return;
    }

    if (!question.trim()) {
      setError("Please enter a question.");
      return;
    }

    const userMessage = {
      type: "user",
      question,
      time: new Date().toLocaleTimeString()
    };

    setMessages((prev) => [...prev, userMessage]);
    setQuestion("");
    setError("");

    try {
      setAsking(true);

      const data = await askQuestion({
        documentId: activeDocument.document_id,
        question
      });

      const aiMessage = {
        type: "ai",
        answer: data.answer,
        sources: data.sources,
        time: new Date().toLocaleTimeString()
      };

      setMessages((prev) => [...prev, aiMessage]);
    } catch (err) {
      setError(err.response?.data?.detail || "Failed to get answer.");
    } finally {
      setAsking(false);
    }
  };

  return (
    <div className="glass flex h-170 flex-col rounded-3xl">
      <div className="border-b border-slate-800 p-5">
        <h3 className="text-lg font-semibold text-white">Ask DocuMind AI</h3>
        <p className="text-sm text-slate-400">
          Answers are generated only from your uploaded document.
        </p>
      </div>

      <div className="flex-1 space-y-5 overflow-y-auto p-5">
        {messages.length === 0 && (
          <div className="flex h-full items-center justify-center text-center">
            <div>
              <p className="text-lg font-semibold text-white">
                Start asking questions
              </p>
              <p className="mt-2 max-w-md text-sm text-slate-400">
                Example: “Summarize the architecture” or “What does this
                document say about authentication?”
              </p>
            </div>
          </div>
        )}

        {messages.map((message, index) =>
          message.type === "user" ? (
            <div key={index} className="flex justify-end">
              <div className="max-w-[85%] rounded-3xl bg-cyan-400 px-5 py-4 text-sm font-medium text-slate-950">
                <div className="mb-2 flex items-center gap-2 text-xs opacity-80">
                  <User size={14} />
                  You · {message.time}
                </div>
                {message.question}
              </div>
            </div>
          ) : (
            <AnswerCard key={index} message={message} />
          )
        )}

        {asking && (
          <div className="glass flex items-center gap-3 rounded-3xl p-5 text-sm text-slate-300">
            <Loader2 className="animate-spin text-cyan-300" size={18} />
            DocuMind AI is reading your document...
          </div>
        )}

        <div ref={bottomRef} />
      </div>

      {error && (
        <div className="px-5 pb-2 text-sm text-red-300">
          {error}
        </div>
      )}

      <form onSubmit={submitQuestion} className="border-t border-slate-800 p-5">
        <div className="flex gap-3">
          <input
            value={question}
            onChange={(event) => setQuestion(event.target.value)}
            placeholder="Ask a question from the uploaded document..."
            className="flex-1 rounded-2xl border border-slate-700 bg-slate-950 px-4 py-3 text-sm text-white outline-none transition placeholder:text-slate-500 focus:border-cyan-400"
          />

          <button
            disabled={asking}
            className="rounded-2xl bg-cyan-400 px-5 py-3 font-semibold text-slate-950 transition hover:bg-cyan-300 disabled:opacity-60"
          >
            {asking ? <Loader2 className="animate-spin" size={18} /> : <Send size={18} />}
          </button>
        </div>
      </form>
    </div>
  );
}