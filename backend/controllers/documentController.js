import { GoogleGenerativeAI } from "@google/generative-ai";
import { extractTextFromPDF } from "../services/pdfService.js";
import Conversation from "../models/Conversation.js";

export const handleUpload = async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ error: "No file uploaded" });

    const text = await extractTextFromPDF(req.file.buffer);

    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({
      model: process.env.GEMINI_MODEL || "gemini-2.5-flash",
    });

    const result = await model.generateContent(
      `Summarize the following text:\n\n${text}`
    );

    const summary = result.response.text();

    // If a user is logged in, attach to their history
    let conversationId = null;
    if (req.user) {
      const newConversation = await Conversation.create({
        user: req.user._id,
        fileName: req.file.originalname || "document.pdf",
        summary: summary,
        qaPairs: [],
      });
      conversationId = newConversation._id;
    }

    res.json({ summary, conversationId });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ error: error.message });
  }
};

export const handleAsk = async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ error: "No file uploaded" });

    const { question, conversationId } = req.body;
    if (!question) return res.status(400).json({ error: "No question provided" });

    const text = await extractTextFromPDF(req.file.buffer);

    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({
      model: process.env.GEMINI_MODEL || "gemini-2.5-flash",
    });

    const result = await model.generateContent(
      `Answer the following question based on the document:\n\nQuestion: ${question}\n\nDocument:\n${text}`
    );

    const answer = result.response.text();

    // If a user is tracking this conversation, update the history array
    if (req.user && conversationId && conversationId !== "null") {
      await Conversation.findByIdAndUpdate(conversationId, {
        $push: { qaPairs: { question, answer } },
      });
    }

    res.json({ answer });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ error: error.message });
  }
};

export const getHistory = async (req, res) => {
  try {
    if (!req.user) return res.status(401).json({ error: "Unauthorized" });

    // Fetch the last 5 conversations sorted by newest first
    const history = await Conversation.find({ user: req.user._id })
      .sort({ createdAt: -1 })
      .limit(5);

    res.json(history);
  } catch (error) {
    console.error("Error fetching history:", error);
    res.status(500).json({ error: "Server error fetching history" });
  }
};
