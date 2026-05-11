import { FileText, CheckCircle, Clock, Database } from "lucide-react";

export default function Sidebar({ activeDocument }) {
  return (
    <div className="glass rounded-3xl p-5">
      <h3 className="mb-4 text-lg font-semibold text-white">
        Document Status
      </h3>

      {!activeDocument ? (
        <p className="text-sm leading-6 text-slate-400">
          No document uploaded yet. Upload a PDF, DOCX, or TXT file to begin.
        </p>
      ) : (
        <div className="space-y-4">
          <div className="rounded-2xl bg-slate-950/70 p-4">
            <div className="mb-3 flex items-center gap-3">
              <FileText className="text-cyan-300" size={20} />
              <div>
                <p className="break-all text-sm font-semibold text-white">
                  {activeDocument.name}
                </p>
                <p className="text-xs text-slate-500">
                  {activeDocument.file_type} Document
                </p>
              </div>
            </div>
          </div>

          <div className="grid gap-3">
            <div className="flex items-center gap-3 rounded-2xl border border-slate-800 bg-slate-950/50 p-3">
              <CheckCircle className="text-emerald-300" size={18} />
              <span className="text-sm text-slate-300">
                {activeDocument.status}
              </span>
            </div>

            <div className="flex items-center gap-3 rounded-2xl border border-slate-800 bg-slate-950/50 p-3">
              <Database className="text-cyan-300" size={18} />
              <span className="text-sm text-slate-300">
                {activeDocument.chunks_created} Chunks Created
              </span>
            </div>

            <div className="flex items-center gap-3 rounded-2xl border border-slate-800 bg-slate-950/50 p-3">
              <Clock className="text-violet-300" size={18} />
              <span className="text-sm text-slate-300">
                Ready for questions
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}