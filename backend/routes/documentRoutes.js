import express from "express";
import upload from "../middlewares/uploadMiddleware.js";
import { handleUpload, handleAsk, getHistory } from "../controllers/documentController.js";
import { protect, optionalProtect } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.post("/upload", optionalProtect, upload.single("document"), handleUpload);
router.post("/ask", optionalProtect, upload.single("document"), handleAsk);
router.get("/history", protect, getHistory);

export default router;
