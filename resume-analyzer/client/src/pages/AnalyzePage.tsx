import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import gsap from "gsap";
import { useDropzone } from "react-dropzone";
import { Upload, FileText, Briefcase, ArrowRight, Loader2, AlertCircle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Navbar from "@/components/Navbar";
import SpotlightCard from "@/components/ui/SpotlightCard";
import PageTransition from "@/components/animations/PageTransition";
import { useAnalysis } from "@/hooks/useAnalysis";
import { cn } from "@/lib/utils";

export default function AnalyzePage() {
  const [resume, setResume] = useState("");
  const [jd, setJd] = useState("");
  const btnRef = useRef<HTMLButtonElement>(null);
  const navigate = useNavigate();
  const { analyze, loading, error } = useAnalysis();

  useEffect(() => {
    gsap.fromTo(
      ".input-card",
      { opacity: 0, y: 30 },
      { opacity: 1, y: 0, duration: 0.5, stagger: 0.15, delay: 0.2, ease: "power3.out" }
    );
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: { "text/plain": [".txt"] },
    onDrop: (files) => {
      const reader = new FileReader();
      reader.onload = (e) => setResume(e.target?.result as string);
      reader.readAsText(files[0]);
    },
  });

  const handleAnalyze = async () => {
    if (!resume.trim() || !jd.trim()) {
      gsap.to(".input-card", { x: [-6, 6, -4, 4, 0], duration: 0.4, ease: "power2.out" });
      return;
    }

    if (btnRef.current) {
      gsap.to(btnRef.current, { scale: 0.96, duration: 0.1, yoyo: true, repeat: 1 });
    }

    const result = await analyze(resume, jd);
    if (result) {
      sessionStorage.setItem("analysis_result", JSON.stringify(result));
      navigate("/results");
    }
  };

  const charCount = (str: string) => str.trim().split(/\s+/).filter(Boolean).length;

  return (
    <div className="min-h-screen relative">
      {/* Subtle bg glow */}
      <div className="fixed top-1/3 right-1/4 w-96 h-96 bg-emerald-500/4 rounded-full blur-[100px] pointer-events-none" />

      <Navbar />

      <PageTransition>
        <main className="relative z-10 pt-28 pb-20 px-6 max-w-6xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-display font-bold text-white mb-3">
              Analyze your resume
            </h1>
            <p className="text-white/45 font-body">
              Paste both below and let AI do the heavy lifting.
            </p>
          </div>

          {/* Input grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 mb-6">
            {/* Resume input */}
            <SpotlightCard className="input-card opacity-0 flex flex-col">
              <div className="flex items-center justify-between px-5 pt-5 pb-3 border-b border-white/[0.06]">
                <div className="flex items-center gap-2">
                  <FileText size={15} className="text-emerald-400" />
                  <span className="font-display font-semibold text-white/80 text-sm">Your Resume</span>
                </div>
                <span className="text-xs font-mono text-white/30">
                  {charCount(resume)} words
                </span>
              </div>

              {/* Drop zone */}
              <div
                {...getRootProps()}
                className={cn(
                  "mx-5 mt-3 mb-2 border border-dashed rounded-lg px-4 py-3 text-xs text-center cursor-pointer transition-colors",
                  isDragActive
                    ? "border-emerald-500/60 bg-emerald-500/8 text-emerald-400"
                    : "border-white/10 text-white/30 hover:border-white/20 hover:text-white/50"
                )}
              >
                <input {...getInputProps()} />
                <Upload size={12} className="inline mr-1.5" />
                {isDragActive ? "Drop to upload" : "Drop .txt file or click to upload"}
              </div>

              <textarea
                value={resume}
                onChange={(e) => setResume(e.target.value)}
                placeholder="Or paste your resume text here...

Include your work experience, skills, projects, and education."
                className="flex-1 min-h-[280px] bg-transparent text-white/80 placeholder-white/20 text-sm font-body leading-relaxed resize-none outline-none px-5 py-3"
              />
            </SpotlightCard>

            {/* JD input */}
            <SpotlightCard className="input-card opacity-0 flex flex-col">
              <div className="flex items-center justify-between px-5 pt-5 pb-3 border-b border-white/[0.06]">
                <div className="flex items-center gap-2">
                  <Briefcase size={15} className="text-emerald-400" />
                  <span className="font-display font-semibold text-white/80 text-sm">Job Description</span>
                </div>
                <span className="text-xs font-mono text-white/30">
                  {charCount(jd)} words
                </span>
              </div>
              <textarea
                value={jd}
                onChange={(e) => setJd(e.target.value)}
                placeholder="Paste the job description here...

Include the full JD — requirements, responsibilities, and any tech stack mentioned."
                className="flex-1 min-h-[320px] bg-transparent text-white/80 placeholder-white/20 text-sm font-body leading-relaxed resize-none outline-none px-5 py-3"
              />
            </SpotlightCard>
          </div>

          {/* Error */}
          <AnimatePresence>
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="flex items-center gap-3 bg-rose-500/10 border border-rose-500/20 text-rose-400 rounded-xl px-5 py-3.5 mb-5 text-sm font-body"
              >
                <AlertCircle size={16} />
                {error}
              </motion.div>
            )}
          </AnimatePresence>

          {/* Analyze button */}
          <div className="flex justify-center">
            <button
              ref={btnRef}
              onClick={handleAnalyze}
              disabled={loading}
              className={cn(
                "group relative flex items-center gap-3 font-display font-semibold px-10 py-4 rounded-full text-base transition-all duration-200",
                loading
                  ? "bg-white/10 text-white/40 cursor-not-allowed"
                  : "bg-emerald-500 hover:bg-emerald-400 text-black hover:scale-105 hover:shadow-[0_0_40px_rgba(52,211,153,0.3)]"
              )}
            >
              {loading ? (
                <>
                  <Loader2 size={18} className="animate-spin" />
                  Analyzing your resume...
                </>
              ) : (
                <>
                  Run AI Analysis
                  <ArrowRight size={17} className="group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </button>
          </div>

          {/* Tips */}
          {!loading && (
            <p className="text-center text-white/25 text-xs font-body mt-5">
              Analysis takes ~5 seconds · Your data is never stored permanently
            </p>
          )}
        </main>
      </PageTransition>
    </div>
  );
}
