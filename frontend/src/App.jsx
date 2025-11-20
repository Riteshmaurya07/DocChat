import React, { useState } from "react";
import Header from "./components/Header";
import WelcomeMessage from "./components/WelcomeMessage";
import ConversationArea from "./components/ConversationArea";
import QuestionInput from "./components/QuestionInput";

const DocumentQA = () => {
  const [file, setFile] = useState(null);
  const [summary, setSummary] = useState("");
  const [question, setQuestion] = useState("");
  const [answers, setAnswers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [fileName, setFileName] = useState("");
  const [isDocumentUploaded, setIsDocumentUploaded] = useState(false);

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
        credentials: "include", // ⭐ Needed for Render
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const data = await response.json();
      setSummary(data.summary);
      setIsDocumentUploaded(true);

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
    setError("");
  };

  return (
    <div className="flex flex-col h-screen bg-gradient-to-b from-gray-900 to-gray-800 text-white">
      <Header
        isDocumentUploaded={isDocumentUploaded}
        fileName={fileName}
        handleResetDocument={handleResetDocument}
      />
      <main className="flex-grow overflow-y-auto p-4">
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
      </main>
      {isDocumentUploaded && (
        <div className="p-4 border-t border-gray-700 bg-gray-900">
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
  );
};

export default DocumentQA;
