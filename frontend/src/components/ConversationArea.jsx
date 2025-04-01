import React from "react";
import ReactMarkdown from "react-markdown";

const ConversationArea = ({ answers, loading }) => {
  return (
    <div className="space-y-6 pb-4">
      {answers.map((item, index) => (
        <div
          key={index}
          className={`max-w-3xl mx-auto ${
            item.type === "question" ? "ml-auto mr-0 max-w-xl" : ""
          }`}
        >
          {item.type === "question" ? (
            <div className="bg-blue-600/30 m-8 backdrop-blur-sm rounded-xl p-4 shadow-lg border border-blue-500/30">
              <ReactMarkdown>{item.content}</ReactMarkdown>
            </div>
          ) : item.type === "summary" ? (
            <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 shadow-lg border border-gray-700/50">
              <h2 className="font-bold text-lg mb-3 text-blue-300 flex items-center">
                Document Summary
              </h2>
              <div className="bg-gray-700/30 p-4 rounded-lg border border-gray-600/50">
                <ReactMarkdown>{item.content}</ReactMarkdown>
              </div>
            </div>
          ) : (
            <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 shadow-lg border border-gray-700/50">
              <h2 className="font-bold text-lg mb-3 text-blue-300 flex items-center">
                Answer
              </h2>
              <div className="bg-gray-700/30 p-4 rounded-lg border border-gray-600/50">
                <ReactMarkdown>{item.content}</ReactMarkdown>
              </div>
            </div>
          )}
        </div>
      ))}
      {loading && (
        <div className="max-w-3xl mx-auto">
          <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-4 shadow-lg border border-gray-700/50 flex items-center">
            <p className="text-gray-300">Processing your question...</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default ConversationArea;