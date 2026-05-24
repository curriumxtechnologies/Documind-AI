import { useState } from "react";
import { Sparkles } from "lucide-react";
import UploadBox from "./components/UploadBox";
import ChatBox from "./components/ChatBox";

export default function App() {
  const [activeDocument, setActiveDocument] = useState(null);

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">
      {/* Minimal Header - ChatGPT style */}
      <header className="border-b border-gray-200 dark:border-gray-800 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm sticky top-0 z-10">
        <div className="max-w-3xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-full bg-purple-600 flex items-center justify-center">
              <Sparkles size={14} className="text-white" />
            </div>
            <span className="font-semibold text-gray-800 dark:text-gray-100 text-sm">
              DocuMind AI
            </span>
          </div>
          {activeDocument && (
            <div className="text-xs text-gray-500 dark:text-gray-400 truncate max-w-50">
              {activeDocument.name}
            </div>
          )}
        </div>
      </header>

      {/* Main Content - ChatGPT centered layout */}
      <main className="max-w-3xl mx-auto px-4 py-8 flex flex-col min-h-[calc(100vh-57px)]">
        {/* Upload Area - Only show if no document */}
        {!activeDocument && (
          <div className="flex-1 flex flex-col items-center justify-center">
            <div className="w-full max-w-md mx-auto">
              <UploadBox onUploaded={setActiveDocument} />
            </div>
          </div>
        )}

        {/* Chat Area - Shows when document is uploaded */}
        {activeDocument && (
          <div className="flex-1 flex flex-col">
            <ChatBox activeDocument={activeDocument} />
          </div>
        )}
      </main>
    </div>
  );
}