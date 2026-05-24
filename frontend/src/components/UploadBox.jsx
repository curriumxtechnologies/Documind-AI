import { useState } from "react";
import { Upload, Loader2, CheckCircle, FileText } from "lucide-react";
import { uploadDocument } from "../api";

export default function UploadBox({ onUploaded }) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");

  const handleUpload = async (file) => {
    setError("");

    const allowed = [".pdf", ".docx", ".txt"];
    const ext = "." + file.name.split(".").pop().toLowerCase();
    
    if (!allowed.includes(ext)) {
      setError("Please upload a PDF, DOCX, or TXT file");
      return;
    }

    try {
      setUploading(true);
      const data = await uploadDocument(file);
      onUploaded(data);
    } catch (err) {
      setError(err.response?.data?.detail || "Upload failed. Please try again.");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="text-center">
      <div className="w-16 h-16 rounded-full bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center mx-auto mb-4">
        <FileText size={28} className="text-purple-600 dark:text-purple-400" />
      </div>
      
      <h1 className="text-3xl font-semibold text-gray-800 dark:text-gray-100 mb-2">
        Upload a document
      </h1>
      
      <p className="text-gray-500 dark:text-gray-400 mb-6">
        Ask questions and get AI-powered answers
      </p>

      <label className="inline-flex items-center gap-2 px-5 py-2.5 bg-purple-600 hover:bg-purple-700 text-white text-sm font-medium rounded-lg cursor-pointer transition-colors">
        <Upload size={16} />
        {uploading ? "Uploading..." : "Choose file"}
        <input
          type="file"
          accept=".pdf,.docx,.txt"
          className="hidden"
          onChange={(e) => e.target.files[0] && handleUpload(e.target.files[0])}
          disabled={uploading}
        />
      </label>

      {uploading && (
        <div className="mt-4 flex items-center justify-center gap-2 text-sm text-gray-500 dark:text-gray-400">
          <Loader2 size={14} className="animate-spin" />
          Processing your document...
        </div>
      )}

      {error && (
        <div className="mt-4 text-sm text-red-500 dark:text-red-400">
          {error}
        </div>
      )}

      <p className="mt-6 text-xs text-gray-400 dark:text-gray-500">
        Supports PDF, DOCX, TXT • Your data stays private
      </p>
    </div>
  );
}