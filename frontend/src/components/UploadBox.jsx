import { useState } from "react";
import { UploadCloud, Loader2, CheckCircle, AlertCircle } from "lucide-react";
import { uploadDocument } from "../api";

export default function UploadBox({ onUploaded }) {
  const [dragging, setDragging] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const allowedTypes = [".pdf", ".docx", ".txt"];

  const validateFile = (file) => {
    const extension = "." + file.name.split(".").pop().toLowerCase();

    if (!allowedTypes.includes(extension)) {
      return "Only PDF, DOCX, and TXT files are allowed.";
    }

    return "";
  };

  const handleUpload = async (file) => {
    setError("");
    setSuccess("");

    const validationError = validateFile(file);

    if (validationError) {
      setError(validationError);
      return;
    }

    try {
      setUploading(true);
      setProgress(0);

      const data = await uploadDocument(file, (event) => {
        const percent = Math.round((event.loaded * 100) / event.total);
        setProgress(percent);
      });

      setSuccess("Document indexed successfully.");
      onUploaded(data);
    } catch (err) {
      setError(err.response?.data?.detail || "Upload failed. Please try again.");
    } finally {
      setUploading(false);
    }
  };

  const handleDrop = (event) => {
    event.preventDefault();
    setDragging(false);

    const file = event.dataTransfer.files[0];
    if (file) handleUpload(file);
  };

  return (
    <div className="glass rounded-3xl p-5">
      <div
        onDragOver={(event) => {
          event.preventDefault();
          setDragging(true);
        }}
        onDragLeave={() => setDragging(false)}
        onDrop={handleDrop}
        className={`flex min-h-55 flex-col items-center justify-center rounded-3xl border border-dashed p-6 text-center transition ${
          dragging
            ? "border-cyan-400 bg-cyan-400/10"
            : "border-slate-700 bg-slate-950/40 hover:border-cyan-500/70"
        }`}
      >
        <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-3xl bg-cyan-400/10 text-cyan-300">
          {uploading ? (
            <Loader2 className="animate-spin" size={30} />
          ) : (
            <UploadCloud size={32} />
          )}
        </div>

        <h3 className="text-lg font-semibold text-white">
          Upload your document
        </h3>

        <p className="mt-2 max-w-sm text-sm leading-6 text-slate-400">
          Drag and drop a PDF, DOCX, or TXT file. DocuMind AI will extract,
          chunk, embed, and index the content.
        </p>

        <label className="mt-5 cursor-pointer rounded-2xl bg-cyan-400 px-5 py-3 text-sm font-semibold text-slate-950 transition hover:bg-cyan-300">
          Select Document
          <input
            type="file"
            accept=".pdf,.docx,.txt"
            className="hidden"
            onChange={(event) => {
              const file = event.target.files[0];
              if (file) handleUpload(file);
            }}
          />
        </label>

        {uploading && (
          <div className="mt-5 w-full max-w-sm">
            <div className="h-2 overflow-hidden rounded-full bg-slate-800">
              <div
                className="h-full rounded-full bg-cyan-400 transition-all"
                style={{ width: `${progress}%` }}
              />
            </div>
            <p className="mt-2 text-xs text-slate-400">
              Uploading and indexing... {progress}%
            </p>
          </div>
        )}
      </div>

      {success && (
        <div className="mt-4 flex items-center gap-2 rounded-2xl border border-emerald-400/30 bg-emerald-400/10 p-3 text-sm text-emerald-300">
          <CheckCircle size={16} />
          {success}
        </div>
      )}

      {error && (
        <div className="mt-4 flex items-center gap-2 rounded-2xl border border-red-400/30 bg-red-400/10 p-3 text-sm text-red-300">
          <AlertCircle size={16} />
          {error}
        </div>
      )}
    </div>
  );
}