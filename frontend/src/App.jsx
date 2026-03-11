import React, { useState } from "react";
import { Routes, Route } from "react-router-dom";
import Header from "./components/Header";
import WelcomeMessage from "./components/WelcomeMessage";
import ConversationArea from "./components/ConversationArea";
import QuestionInput from "./components/QuestionInput";
import Sidebar from "./components/Sidebar";
import Login from "./pages/Login";
import Register from "./pages/Register";

const DocumentQA = () => {
  const [file, setFile] = useState(null);
  const [summary, setSummary] = useState("");
  const [question, setQuestion] = useState("");
  const [answers, setAnswers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [fileName, setFileName] = useState("");
  const [isDocumentUploaded, setIsDocumentUploaded] = useState(false);
  const [conversationId, setConversationId] = useState(null);

  const BACKEND_URL =
    import.meta.env.VITE_BACKEND_URL || "http://localhost:5000";

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
      setFileName(selectedFile.name);
    }
  };

  const handleUpload = async () => {
    if (!file) {
      setError("Please select a file.");
      return;
    }

    if (file.type !== "application/pdf") {
      setError("Please upload a PDF file.");
      return;
    }

    setLoading(true);
    setError("");

    const formData = new FormData();
    formData.append("document", file);

    try {
      const response = await fetch(`${BACKEND_URL}/upload`, {
        method: "POST",
        body: formData,
        credentials: "include",
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const data = await response.json();
      setSummary(data.summary);
      setIsDocumentUploaded(true);
      if (data.conversationId) setConversationId(data.conversationId);

      setAnswers([{ type: "summary", content: data.summary }]);
    } catch (error) {
      setError("An error occurred while uploading the file.");
    } finally {
      setLoading(false);
    }
  };

  const handleAskQuestion = async (e) => {
    e.preventDefault();

    if (!isDocumentUploaded) {
      setError("Please upload a document first.");
      return;
    }

    if (!question.trim()) {
      setError("Please enter a question.");
      return;
    }

    const currentQuestion = question;
    setQuestion("");
    setLoading(true);
    setError("");

    setAnswers((prev) => [
      ...prev,
      { type: "question", content: currentQuestion },
    ]);

    const formData = new FormData();
    formData.append("document", file);
    formData.append("question", currentQuestion);
    if (conversationId) formData.append("conversationId", conversationId);

    try {
      const response = await fetch(`${BACKEND_URL}/ask`, {
        method: "POST",
        body: formData,
        credentials: "include", // ⭐ Required
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const data = await response.json();
      setAnswers((prev) => [...prev, { type: "answer", content: data.answer }]);
    } catch (error) {
      setError("An error occurred while processing your question.");
    } finally {
      setLoading(false);
    }
  };

  const handleResetDocument = () => {
    setFile(null);
    setFileName("");
    setSummary("");
    setAnswers([]);
    setIsDocumentUploaded(false);
    setConversationId(null);
    setError("");
  };

  const loadHistoryItem = (conv) => {
    setFileName(conv.fileName);
    setConversationId(conv._id);
    setSummary(conv.summary);
    setIsDocumentUploaded(true);
    
    // Reconstruct answers array from backend history
    const reconstructedAnswers = [{ type: "summary", content: conv.summary }];
    conv.qaPairs.forEach((qa) => {
      reconstructedAnswers.push({ type: "question", content: qa.question });
      reconstructedAnswers.push({ type: "answer", content: qa.answer });
    });
    setAnswers(reconstructedAnswers);
  };

  return (
    <div className="flex flex-col h-screen bg-gradient-to-b from-gray-900 to-gray-800 text-white flex-row">
      <div className="flex flex-col flex-grow">
        <Header
          isDocumentUploaded={isDocumentUploaded}
          fileName={fileName}
          handleResetDocument={handleResetDocument}
        />
        <main className="flex-grow flex overflow-hidden">
          <Sidebar onSelectHistory={loadHistoryItem} />
          {/* Main Chat Area */}
          <div className="flex-grow flex flex-col justify-between overflow-y-auto p-4">
            {!isDocumentUploaded && answers.length === 0 ? (
              <WelcomeMessage
                fileName={fileName}
                handleFileChange={handleFileChange}
                handleUpload={handleUpload}
                loading={loading}
              />
            ) : (
              <ConversationArea answers={answers} loading={loading} />
            )}
          </div>
        </main>
        {isDocumentUploaded && (
          <div className="p-4 border-t border-gray-700 bg-gray-900 ml-64">
            {error && <div className="text-red-500">{error}</div>}
            <QuestionInput
               question={question}
               setQuestion={setQuestion}
               handleAskQuestion={handleAskQuestion}
               loading={loading}
             />
          </div>
        )}
      </div>
    </div>
  );
};

const App = () => {
  return (
    <Routes>
      <Route path="/" element={<DocumentQA />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
    </Routes>
  );
};

export default App;
