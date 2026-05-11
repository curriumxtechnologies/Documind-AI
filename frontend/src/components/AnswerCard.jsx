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
    <div className="glass w-full max-w-full overflow-hidden rounded-3xl p-5 shadow-2xl shadow-cyan-950/20">
      <div className="mb-4 flex items-center justify-between gap-4">
        <div className="flex min-w-0 items-center gap-3">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-2xl bg-cyan-400/10 text-cyan-300">
            <Bot size={18} />
          </div>

          <div className="min-w-0">
            <p className="truncate text-sm font-semibold text-white">
              DocuMind AI
            </p>
            <p className="truncate text-xs text-slate-400">{message.time}</p>
          </div>
        </div>

        <button
          onClick={copyAnswer}
          className="shrink-0 rounded-xl border border-slate-700 px-3 py-2 text-xs text-slate-300 transition hover:border-cyan-400 hover:text-cyan-300"
        >
          {copied ? <Check size={15} /> : <Copy size={15} />}
        </button>
      </div>

      <div className="max-h-[320px] overflow-y-auto overflow-x-hidden pr-2 text-sm leading-7 text-slate-200">
        <div className="whitespace-pre-wrap break-words">
          {message.answer}
        </div>
      </div>

      {message.sources?.length > 0 && (
        <div className="mt-5 max-h-[260px] space-y-3 overflow-y-auto overflow-x-hidden pr-2">
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