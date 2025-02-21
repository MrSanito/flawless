import mongoose from "mongoose";

const TaskSchema = new mongoose.Schema(
  {
    userId: { type: String, required: true }, // Store Clerk User ID
    text: { type: String, required: true },
    completed: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export default mongoose.models.Task || mongoose.model("Task", TaskSchema);
