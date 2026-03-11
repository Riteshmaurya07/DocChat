import dotenv from "dotenv";
dotenv.config();

const corsOptions = {
  origin: [process.env.FRONTEND_URL],
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true,
};

export default corsOptions;
