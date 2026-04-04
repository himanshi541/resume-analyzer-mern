import mongoose from "mongoose";

const analysisSchema = new mongoose.Schema(
  {
    resumeSnippet: { type: String, required: true },
    jobTitle: { type: String, default: "Unknown Role" },
    matchScore: { type: Number, required: true },
    atsScore: { type: Number, required: true },
    keywordStrength: { type: Number, required: true },
    presentKeywords: [String],
    missingKeywords: [String],
    rewrittenBullets: [
      {
        original: String,
        improved: String,
      },
    ],
    tips: [String],
  },
  { timestamps: true }
);

export default mongoose.model("Analysis", analysisSchema);
