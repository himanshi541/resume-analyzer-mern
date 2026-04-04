import Anthropic from "@anthropic-ai/sdk";
import Analysis from "../models/Analysis.js";

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

export const analyzeResume = async (req, res) => {
  const { resume, jobDescription } = req.body;

  if (!resume || !jobDescription) {
    return res.status(400).json({ error: "Resume and job description are required." });
  }

  if (!process.env.ANTHROPIC_API_KEY) {
    return res.status(500).json({ error: "API key not configured on server." });
  }

  const prompt = `You are a professional resume coach and ATS expert. Analyze this resume against the job description. Be specific and data-driven.

RESUME:
${resume}

JOB DESCRIPTION:
${jobDescription}

Respond ONLY with a valid JSON object (no markdown fences, no extra text):

{
  "match_score": <integer 0-100>,
  "ats_score": <integer 0-100>,
  "keyword_strength": <integer 0-100>,
  "job_title": "<inferred job title from JD, max 4 words>",
  "present_keywords": [<up to 8 strings>],
  "missing_keywords": [<up to 8 strings>],
  "rewritten_bullets": [
    { "original": "<exact bullet>", "improved": "<stronger, metric-driven, ATS-optimized>" }
  ],
  "tips": [<4 specific actionable strings>],
  "overall_summary": "<2 sentence honest assessment of this resume for this role>"
}

For rewritten_bullets: pick the 3 weakest bullets. Add metrics, active voice, and missing keywords.`;

  try {
    const message = await client.messages.create({
      model: "claude-sonnet-4-20250514",
      max_tokens: 1500,
      messages: [{ role: "user", content: prompt }],
    });

    const text = message.content.map((b) => b.text || "").join("");
    const clean = text.replace(/```json|```/g, "").trim();
    const result = JSON.parse(clean);

    // Save to MongoDB (non-blocking)
    Analysis.create({
      resumeSnippet: resume.substring(0, 200),
      jobTitle: result.job_title || "Unknown Role",
      matchScore: result.match_score,
      atsScore: result.ats_score,
      keywordStrength: result.keyword_strength,
      presentKeywords: result.present_keywords || [],
      missingKeywords: result.missing_keywords || [],
      rewrittenBullets: result.rewritten_bullets || [],
      tips: result.tips || [],
    }).catch(() => {}); // Silent fail if no DB

    res.json({ success: true, data: result });
  } catch (err) {
    console.error("Analysis error:", err.message);
    res.status(500).json({ error: "Analysis failed. " + err.message });
  }
};
