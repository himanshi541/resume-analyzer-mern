import { useState } from "react";
import axios from "axios";

export interface AnalysisResult {
  match_score: number;
  ats_score: number;
  keyword_strength: number;
  job_title: string;
  present_keywords: string[];
  missing_keywords: string[];
  rewritten_bullets: { original: string; improved: string }[];
  tips: string[];
  overall_summary: string;
}

export function useAnalysis() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<AnalysisResult | null>(null);

  const analyze = async (resume: string, jobDescription: string) => {
    setLoading(true);
    setError(null);
    try {
      const { data } = await axios.post("/api/analyze", { resume, jobDescription });
      setResult(data.data);
      return data.data as AnalysisResult;
    } catch (err: any) {
      const msg = err.response?.data?.error || "Analysis failed. Please try again.";
      setError(msg);
      return null;
    } finally {
      setLoading(false);
    }
  };

  return { analyze, loading, error, result };
}
