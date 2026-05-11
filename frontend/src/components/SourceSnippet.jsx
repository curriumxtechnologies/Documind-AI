import { FileText } from "lucide-react";

export default function SourceSnippet({ source }) {
  return (
    <div className="rounded-2xl border border-slate-700/70 bg-slate-950/60 p-4">
      <div className="mb-2 flex items-center gap-2 text-sm text-cyan-300">
        <FileText size={16} />
        <span>
          Page {source.page || "N/A"} — {source.section_title || "Document Section"}
        </span>
      </div>

      <p className="line-clamp-4 text-sm leading-6 text-slate-300">
        “{source.text}”
      </p>
    </div>
  );
}