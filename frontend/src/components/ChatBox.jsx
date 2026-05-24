import { useEffect, useRef, useState } from "react";
import { Send, Loader2, User, Bot } from "lucide-react";
import { askQuestion } from "../api";

export default function ChatBox({ activeDocument }) {
  const [question, setQuestion] = useState("");
  const [messages, setMessages] = useState([]);
  const [asking, setAsking] = useState(false);
  const [error, setError] = useState("");
  const messagesEndRef = useRef(null);
  const textareaRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, asking]);

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = Math.min(textareaRef.current.scrollHeight, 200) + "px";
    }
  }, [question]);

  const submitQuestion = async (event) => {
    event.preventDefault();

    if (!activeDocument) {
      setError("Please upload a document first");
      return;
    }

    if (!question.trim()) {
      return;
    }

    const userMessage = {
      type: "user",
      content: question,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMessage]);
    setQuestion("");
    setError("");

    try {
      setAsking(true);
      const data = await askQuestion({
        documentId: activeDocument.document_id,
        question
      });

      const aiMessage = {
        type: "assistant",
        content: data.answer,
        sources: data.sources,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };

      setMessages(prev => [...prev, aiMessage]);
    } catch (err) {
      setError(err.response?.data?.detail || "Failed to get answer.");
    } finally {
      setAsking(false);
    }
  };

  // Welcome screen when no messages
  if (messages.length === 0) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center">
        <div className="w-12 h-12 rounded-full bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center mb-4">
          <Bot size={24} className="text-purple-600 dark:text-purple-400" />
        </div>
        <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-100 mb-2">
          Ask about your document
        </h2>
        <p className="text-gray-500 dark:text-gray-400 text-center max-w-md mb-8">
          Uploaded: {activeDocument?.name}
        </p>
        
        {/* Input at bottom of welcome screen */}
        <div className="w-full max-w-2xl mt-auto">
          <form onSubmit={submitQuestion} className="relative">
            <textarea
              ref={textareaRef}
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  submitQuestion(e);
                }
              }}
              placeholder="Ask anything about your document..."
              rows={1}
              className="w-full rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 pl-4 pr-12 py-3 text-gray-800 dark:text-gray-100 text-sm resize-none focus:outline-none focus:border-purple-400 dark:focus:border-purple-500 focus:ring-1 focus:ring-purple-400 dark:focus:ring-purple-500"
            />
            <button
              type="submit"
              disabled={asking || !question.trim()}
              className="absolute right-2 bottom-2 p-1.5 rounded-lg text-gray-400 hover:text-purple-600 dark:hover:text-purple-400 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {asking ? <Loader2 size={18} className="animate-spin" /> : <Send size={18} />}
            </button>
          </form>
          <p className="text-xs text-gray-400 dark:text-gray-500 text-center mt-3">
            Press Enter to send, Shift+Enter for new line
          </p>
        </div>
      </div>
    );
  }

  // Chat view with messages
  return (
    <div className="flex-1 flex flex-col h-full">
      {/* Messages */}
      <div className="flex-1 overflow-y-auto pb-4 space-y-4">
        {messages.map((message, idx) => (
          <div
            key={idx}
            className={`flex gap-3 ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            {message.type === 'assistant' && (
              <div className="w-7 h-7 rounded-full bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center shrink-0 mt-1">
                <Bot size={14} className="text-purple-600 dark:text-purple-400" />
              </div>
            )}
            
            <div className={`max-w-[80%] ${message.type === 'user' ? 'order-1' : ''}`}>
              <div
                className={`rounded-2xl px-4 py-2 ${
                  message.type === 'user'
                    ? 'bg-purple-600 text-white'
                    : 'bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-100'
                }`}
              >
                <div className="text-sm whitespace-pre-wrap wrap-break-word">
                  {message.content}
                </div>
              </div>
              
              {message.sources && message.sources.length > 0 && (
                <div className="mt-1 text-xs text-gray-400 dark:text-gray-500">
                  Sources: {message.sources.length} reference{message.sources.length !== 1 ? 's' : ''}
                </div>
              )}
            </div>

            {message.type === 'user' && (
              <div className="w-7 h-7 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center shrink-0 mt-1">
                <User size={14} className="text-gray-600 dark:text-gray-400" />
              </div>
            )}
          </div>
        ))}

        {asking && (
          <div className="flex gap-3">
            <div className="w-7 h-7 rounded-full bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center">
              <Bot size={14} className="text-purple-600 dark:text-purple-400" />
            </div>
            <div className="bg-gray-100 dark:bg-gray-800 rounded-2xl px-4 py-2">
              <Loader2 size={16} className="animate-spin text-purple-600 dark:text-purple-400" />
            </div>
          </div>
        )}

        {error && (
          <div className="text-center text-sm text-red-500 dark:text-red-400 py-2">
            {error}
          </div>
        )}
        
        <div ref={messagesEndRef} />
      </div>

      {/* Fixed input at bottom */}
      <div className="border-t border-gray-200 dark:border-gray-800 pt-4 mt-2">
        <form onSubmit={submitQuestion} className="relative">
          <textarea
            ref={textareaRef}
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                submitQuestion(e);
              }
            }}
            placeholder="Ask a follow-up..."
            rows={1}
            className="w-full rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 pl-4 pr-12 py-3 text-gray-800 dark:text-gray-100 text-sm resize-none focus:outline-none focus:border-purple-400 dark:focus:border-purple-500 focus:ring-1 focus:ring-purple-400 dark:focus:ring-purple-500"
          />
          <button
            type="submit"
            disabled={asking || !question.trim()}
            className="absolute right-2 bottom-2 p-1.5 rounded-lg text-gray-400 hover:text-purple-600 dark:hover:text-purple-400 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <Send size={18} />
          </button>
        </form>
        <p className="text-xs text-gray-400 dark:text-gray-500 text-center mt-2">
          DocuMind AI answers from your document only
        </p>
      </div>
    </div>
  );
}