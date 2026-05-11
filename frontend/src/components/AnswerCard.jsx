import { Bot, Copy, Check } from "lucide-react";
import { useState } from "react";
import SourceSnippet from "./SourceSnippet";

export default function AnswerCard({ message }) {
  const [copied, setCopied] = useState(false);

  const copyAnswer = async () => {
    await navigator.clipboard.writeText(message.answer);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <div className="glass rounded-3xl p-5 shadow-2xl shadow-cyan-950/20">
      <div className="mb-4 flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-2xl bg-cyan-400/10 text-cyan-300">
            <Bot size={18} />
          </div>

          <div>
            <p className="text-sm font-semibold text-white">DocuMind AI</p>
            <p className="text-xs text-slate-400">{message.time}</p>
          </div>
        </div>

        <button
          onClick={copyAnswer}
          className="rounded-xl border border-slate-700 px-3 py-2 text-xs text-slate-300 transition hover:border-cyan-400 hover:text-cyan-300"
        >
          {copied ? <Check size={15} /> : <Copy size={15} />}
        </button>
      </div>

      <div className="whitespace-pre-wrap text-sm leading-7 text-slate-200">
        {message.answer}
      </div>

      {message.sources?.length > 0 && (
        <div className="mt-5 space-y-3">
          <p className="text-xs font-semibold uppercase tracking-widest text-slate-500">
            Sources
          </p>

          {message.sources.map((source, index) => (
            <SourceSnippet key={index} source={source} />
          ))}
        </div>
      )}
    </div>
  );
}