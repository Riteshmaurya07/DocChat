import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import mongoose from "mongoose";
import multer from "multer";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { PDFExtract } from "pdf.js-extract";

dotenv.config();
const app = express();

// ---------- CORS FIX ----------
app.use(
  cors({
    origin: [process.env.FRONTEND_URL],     // Must match EXACT Vercel URL
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  })
);

// Preflight support (CRITICAL)
app.options("*", cors());

// ---------- MIDDLEWARE ----------
app.use(express.json());

// ---------- TEST ROUTE ----------
app.get("/", (req, res) => {
  res.send("Backend is running ✔");
});

// ---------- DATABASE ----------
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.error("MongoDB connection error:", err));

// ---------- FILE UPLOAD ----------
const storage = multer.memoryStorage();
const upload = multer({ storage });

// ---------- GEMINI & PDF ----------
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const pdfExtract = new PDFExtract();

const extractTextFromPDF = (buffer) => {
  return new Promise((resolve, reject) => {
    pdfExtract.extractBuffer(buffer, {}, (err, data) => {
      if (err) return reject(err);
      const text = data.pages
        .map((page) => page.content.map((item) => item.str).join(" "))
        .join("\n");
      resolve(text);
    });
  });
};

// ---------- UPLOAD ROUTE ----------
app.post("/upload", upload.single("document"), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ error: "No file uploaded" });

    const text = await extractTextFromPDF(req.file.buffer);

    const model = genAI.getGenerativeModel({
      model: process.env.GEMINI_MODEL || "gemini-2.5-flash",
    });

    const result = await model.generateContent(
      `Summarize the following text:\n\n${text}`
    );

    const summary = result.response.text();
    res.json({ summary });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ error: error.message });
  }
});

// ---------- QUESTION ROUTE ----------
app.post("/ask", upload.single("document"), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ error: "No file uploaded" });

    const { question } = req.body;
    if (!question) return res.status(400).json({ error: "No question provided" });

    const text = await extractTextFromPDF(req.file.buffer);

    const model = genAI.getGenerativeModel({
      model: process.env.GEMINI_MODEL || "gemini-2.5-flash",
    });

    const result = await model.generateContent(
      `Answer the following question based on the document:\n\nQuestion: ${question}\n\nDocument:\n${text}`
    );

    const answer = result.response.text();
    res.json({ answer });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ error: error.message });
  }
});

// ---------- SERVER ----------
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
