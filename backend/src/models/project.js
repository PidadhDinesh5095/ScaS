import mongoose from "mongoose";

const ProjectSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    report: { type: Object, required: true }, // Stores soil analysis or other report as JSON
    plan: { type: Object }, // Optional: project plan as JSON
    createdAt: { type: Date, default: Date.now }
  },
  { timestamps: true }
);

export default mongoose.model("Project", ProjectSchema);

