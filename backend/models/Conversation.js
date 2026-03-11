import mongoose from "mongoose";

const qaSchema = new mongoose.Schema({
  question: { type: String, required: true },
  answer: { type: String, required: true },
});

const conversationSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
    fileName: {
      type: String,
      required: true,
    },
    summary: {
      type: String,
      required: true,
    },
    qaPairs: [qaSchema],
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("Conversation", conversationSchema);
