import React from "react";

const WelcomeMessage = ({ fileName, handleFileChange, handleUpload, loading }) => {
  return (
    <div className="flex flex-col items-center justify-center h-full">
      <div className="bg-gray-800/70 backdrop-blur-sm rounded-full px-6 py-3 flex items-center mb-8 shadow-lg shadow-blue-500/10 border border-blue-500/20">
        <div className="mr-3 text-blue-400">
          <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
            <rect width="20" height="20" rx="4" fill="currentColor" />
          </svg>
        </div>
        <span className="font-medium">New! Introducing AI Document Q&A</span>
      </div>
      <h1 className="text-5xl font-bold text-center mb-4 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-400">
        What do you want to ask?
      </h1>
      <p className="text-gray-300 text-lg mb-12 text-center max-w-2xl">
        Upload, summarize, and ask questions about your{" "}
        <span className="text-white font-medium">pdf documents</span> using our advanced AI technology.
      </p>
      <div className="flex items-center">
        <input
          type="file"
          id="file-upload"
          onChange={handleFileChange}
          className="hidden"
          accept="application/pdf"
        />
        <label
          htmlFor="file-upload"
          className="flex items-center mr-3 px-3 py-2 bg-gray-700/70 hover:bg-gray-700 cursor-pointer rounded-lg border border-gray-600 transition-colors"
        >
          <svg
            className="w-4 h-4 mr-2 text-blue-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M12 4v16m8-8H4"
            ></path>
          </svg>
          {fileName ? fileName : "Select PDF"}
        </label>
        <button
          onClick={handleUpload}
          className={`px-4 py-2 mr-2 rounded-lg font-medium cursor-pointer text-sm transition-all ${
            loading
              ? "bg-gray-700 cursor-not-allowed"
              : "bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400 shadow-md hover:shadow-blue-500/20"
          }`}
          disabled={loading}
        >
          {loading ? "Processing..." : "Upload & Summarize"}
        </button>
      </div>
    </div>
  );
};

export default WelcomeMessage;