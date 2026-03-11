import dotenv from "dotenv";
dotenv.config({path:"./.env"});
import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import connectDB from "./config/db.js";
import corsOptions from "./config/corsOptions.js";
import documentRoutes from "./routes/documentRoutes.js";
import authRoutes from "./routes/authRoutes.js";


const app = express();

// ---------- CORS FIX ----------
app.use(cors(corsOptions));

// Preflight support (CRITICAL)
app.options("*", cors());

// ---------- MIDDLEWARE ----------
app.use(express.json());
app.use(cookieParser());

// ---------- DATABASE ----------
connectDB();

// ---------- ROUTES ----------
app.use("/api/auth", authRoutes);
app.use("/", documentRoutes);

// ---------- TEST ROUTE ----------
app.get("/", (req, res) => {
  res.send("Backend is running ✔");
});

// ---------- SERVER ----------
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
