import { useState } from "react";
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
            {/* Your Logo */}
            <img 
              src="/logo.png" 
              alt="DocuMind AI Logo" 
              className="w-7 h-7 object-contain"
            />
            <span className="font-semibold text-gray-800 dark:text-gray-100 text-sm">
              DocuMind AI
            </span>
          </div>
          {activeDocument && (
            <div className="text-xs text-gray-500 dark:text-gray-400 truncate max-w-[200px]">
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