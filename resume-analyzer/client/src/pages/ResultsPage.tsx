import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeft, CheckCircle2, XCircle, ArrowRight,
  Lightbulb, RefreshCw, Download, ChevronDown
} from "lucide-react";
import Navbar from "@/components/Navbar";
import ScoreRing from "@/components/animations/ScoreRing";
import SpotlightCard from "@/components/ui/SpotlightCard";
import PageTransition from "@/components/animations/PageTransition";
import { AnalysisResult } from "@/hooks/useAnalysis";
import { cn } from "@/lib/utils";

gsap.registerPlugin(ScrollTrigger);

type Tab = "keywords" | "bullets" | "tips";

export default function ResultsPage() {
  const navigate = useNavigate();
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [activeTab, setActiveTab] = useState<Tab>("keywords");
  const [expandedBullet, setExpandedBullet] = useState<number | null>(null);
  const pageRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const raw = sessionStorage.getItem("analysis_result");
    if (!raw) { navigate("/analyze"); return; }
    setResult(JSON.parse(raw));
  }, [navigate]);

  useEffect(() => {
    if (!result) return;
    const ctx = gsap.context(() => {
      gsap.fromTo(
        ".score-section",
        { opacity: 0, y: 40 },
        { opacity: 1, y: 0, duration: 0.7, ease: "power3.out", delay: 0.1 }
      );
      gsap.fromTo(
        ".summary-card",
        { opacity: 0, y: 30 },
        { opacity: 1, y: 0, duration: 0.6, delay: 0.4, ease: "power3.out" }
      );
      gsap.fromTo(
        ".tabs-section",
        { opacity: 0, y: 30 },
        { opacity: 1, y: 0, duration: 0.6, delay: 0.6, ease: "power3.out" }
      );
    }, pageRef);
    return () => ctx.revert();
  }, [result]);

  const scoreColor = (score: number) => {
    if (score >= 75) return "#34d399";
    if (score >= 50) return "#fbbf24";
    return "#fb7185";
  };

  if (!result) return null;

  const tabs: { id: Tab; label: string; count?: number }[] = [
    { id: "keywords", label: "Keywords", count: result.present_keywords.length + result.missing_keywords.length },
    { id: "bullets", label: "Rewritten Bullets", count: result.rewritten_bullets.length },
    { id: "tips", label: "Action Tips", count: result.tips.length },
  ];

  return (
    <div ref={pageRef} className="min-h-screen relative">
      <div className="fixed top-1/2 left-1/4 w-80 h-80 bg-emerald-500/4 rounded-full blur-[100px] pointer-events-none" />
      <Navbar />

      <PageTransition>
        <main className="relative z-10 pt-28 pb-24 px-6 max-w-5xl mx-auto">
          {/* Back */}
          <button
            onClick={() => navigate("/analyze")}
            className="flex items-center gap-1.5 text-white/40 hover:text-white/70 text-sm font-body mb-8 transition-colors"
          >
            <ArrowLeft size={14} /> Back to analyzer
          </button>

          {/* Job title */}
          <div className="mb-10">
            <div className="text-xs font-mono text-emerald-500/70 uppercase tracking-widest mb-1">
              Analysis complete
            </div>
            <h1 className="text-3xl md:text-4xl font-display font-bold text-white">
              {result.job_title || "Role Analysis"}
            </h1>
          </div>

          {/* Score rings */}
          <div className="score-section opacity-0 mb-8">
            <SpotlightCard className="p-8">
              <div className="flex flex-wrap items-center justify-around gap-8">
                <ScoreRing
                  score={result.match_score}
                  label="JD Match"
                  color={scoreColor(result.match_score)}
                  delay={0.3}
                />
                <ScoreRing
                  score={result.ats_score}
                  label="ATS Score"
                  color={scoreColor(result.ats_score)}
                  delay={0.5}
                />
                <ScoreRing
                  score={result.keyword_strength}
                  label="Keywords"
                  color={scoreColor(result.keyword_strength)}
                  delay={0.7}
                />

                {/* Verdict */}
                <div className="text-center max-w-xs">
                  <div
                    className="text-4xl font-display font-bold mb-1"
                    style={{ color: scoreColor(result.match_score) }}
                  >
                    {result.match_score >= 75
                      ? "Strong"
                      : result.match_score >= 50
                      ? "Average"
                      : "Weak"}{" "}
                    Match
                  </div>
                  <p className="text-sm text-white/45 font-body leading-relaxed">
                    {result.overall_summary}
                  </p>
                </div>
              </div>
            </SpotlightCard>
          </div>

          {/* Summary card */}
          {result.missing_keywords.length > 0 && (
            <div className="summary-card opacity-0 mb-6">
              <div className="flex items-start gap-3 bg-amber-500/8 border border-amber-500/15 rounded-xl px-5 py-4">
                <Lightbulb size={16} className="text-amber-400 mt-0.5 flex-shrink-0" />
                <p className="text-sm text-white/70 font-body leading-relaxed">
                  <span className="text-amber-400 font-semibold">Quick win:</span> Adding{" "}
                  <span className="text-white font-medium">
                    {result.missing_keywords.slice(0, 3).join(", ")}
                  </span>{" "}
                  to your resume could significantly boost your ATS pass rate.
                </p>
              </div>
            </div>
          )}

          {/* Tabs */}
          <div className="tabs-section opacity-0">
            {/* Tab bar */}
            <div className="flex items-center gap-2 mb-5 flex-wrap">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={cn(
                    "flex items-center gap-2 px-5 py-2 rounded-full text-sm font-body transition-all duration-200",
                    activeTab === tab.id
                      ? "bg-emerald-500 text-black font-medium"
                      : "bg-white/[0.05] text-white/50 border border-white/[0.07] hover:text-white/80 hover:bg-white/[0.08]"
                  )}
                >
                  {tab.label}
                  {tab.count !== undefined && (
                    <span
                      className={cn(
                        "text-xs rounded-full w-5 h-5 flex items-center justify-center",
                        activeTab === tab.id ? "bg-black/20 text-black" : "bg-white/10 text-white/40"
                      )}
                    >
                      {tab.count}
                    </span>
                  )}
                </button>
              ))}

              {/* Actions right */}
              <div className="ml-auto flex items-center gap-2">
                <button
                  onClick={() => navigate("/analyze")}
                  className="flex items-center gap-1.5 text-xs text-white/40 hover:text-white/70 border border-white/[0.07] px-3 py-2 rounded-full transition-colors"
                >
                  <RefreshCw size={12} /> Re-analyze
                </button>
              </div>
            </div>

            {/* Tab content */}
            <AnimatePresence mode="wait">
              {/* Keywords tab */}
              {activeTab === "keywords" && (
                <motion.div
                  key="keywords"
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -16 }}
                  transition={{ duration: 0.25 }}
                >
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <SpotlightCard className="p-6">
                      <div className="flex items-center gap-2 mb-4">
                        <CheckCircle2 size={15} className="text-emerald-400" />
                        <span className="text-sm font-display font-semibold text-white/80">
                          Present in your resume
                        </span>
                        <span className="ml-auto text-xs text-emerald-500/60 font-mono">
                          {result.present_keywords.length} found
                        </span>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {result.present_keywords.length > 0 ? (
                          result.present_keywords.map((kw, i) => (
                            <motion.span
                              key={kw}
                              initial={{ opacity: 0, scale: 0.8 }}
                              animate={{ opacity: 1, scale: 1 }}
                              transition={{ delay: i * 0.05 }}
                              className="tag-present text-xs px-3 py-1.5 rounded-full font-body"
                            >
                              {kw}
                            </motion.span>
                          ))
                        ) : (
                          <p className="text-white/30 text-sm font-body">No matching keywords found.</p>
                        )}
                      </div>
                    </SpotlightCard>

                    <SpotlightCard className="p-6">
                      <div className="flex items-center gap-2 mb-4">
                        <XCircle size={15} className="text-rose-400" />
                        <span className="text-sm font-display font-semibold text-white/80">
                          Missing from your resume
                        </span>
                        <span className="ml-auto text-xs text-rose-500/60 font-mono">
                          {result.missing_keywords.length} missing
                        </span>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {result.missing_keywords.length > 0 ? (
                          result.missing_keywords.map((kw, i) => (
                            <motion.span
                              key={kw}
                              initial={{ opacity: 0, scale: 0.8 }}
                              animate={{ opacity: 1, scale: 1 }}
                              transition={{ delay: i * 0.05 }}
                              className="tag-missing text-xs px-3 py-1.5 rounded-full font-body"
                            >
                              {kw}
                            </motion.span>
                          ))
                        ) : (
                          <p className="text-emerald-400/70 text-sm font-body">Great — no major keywords missing!</p>
                        )}
                      </div>
                    </SpotlightCard>
                  </div>
                </motion.div>
              )}

              {/* Bullets tab */}
              {activeTab === "bullets" && (
                <motion.div
                  key="bullets"
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -16 }}
                  transition={{ duration: 0.25 }}
                  className="space-y-4"
                >
                  {result.rewritten_bullets.map((bullet, i) => (
                    <SpotlightCard key={i} className="overflow-hidden">
                      <button
                        className="w-full flex items-start justify-between gap-4 p-6 text-left"
                        onClick={() => setExpandedBullet(expandedBullet === i ? null : i)}
                      >
                        <div className="flex-1">
                          <div className="text-xs font-mono text-white/30 uppercase tracking-wider mb-2">
                            Bullet {i + 1} — Original
                          </div>
                          <p className="text-sm text-white/50 font-body line-through leading-relaxed">
                            {bullet.original}
                          </p>
                        </div>
                        <ChevronDown
                          size={16}
                          className={cn(
                            "text-white/30 flex-shrink-0 mt-1 transition-transform duration-200",
                            expandedBullet === i && "rotate-180"
                          )}
                        />
                      </button>

                      <AnimatePresence>
                        {expandedBullet === i && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: "auto", opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.25 }}
                            className="overflow-hidden"
                          >
                            <div className="border-t border-white/[0.06] mx-6 pt-4 pb-6">
                              <div className="inline-flex items-center gap-1.5 text-xs font-mono text-emerald-400/70 uppercase tracking-wider mb-3 bg-emerald-500/10 px-3 py-1 rounded-full">
                                <ArrowRight size={10} /> Improved version
                              </div>
                              <p className="text-sm text-white/85 font-body leading-relaxed">
                                {bullet.improved}
                              </p>
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </SpotlightCard>
                  ))}
                </motion.div>
              )}

              {/* Tips tab */}
              {activeTab === "tips" && (
                <motion.div
                  key="tips"
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -16 }}
                  transition={{ duration: 0.25 }}
                  className="space-y-3"
                >
                  {result.tips.map((tip, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.08 }}
                    >
                      <SpotlightCard className="flex items-start gap-5 p-6">
                        <div className="flex-shrink-0 w-8 h-8 rounded-full bg-emerald-500/15 border border-emerald-500/20 flex items-center justify-center">
                          <span className="text-xs font-display font-bold text-emerald-400">
                            {i + 1}
                          </span>
                        </div>
                        <p className="text-sm text-white/75 font-body leading-relaxed pt-1">{tip}</p>
                      </SpotlightCard>
                    </motion.div>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </main>
      </PageTransition>
    </div>
  );
}
