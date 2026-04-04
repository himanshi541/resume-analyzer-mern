import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Trash2, TrendingUp, Calendar, AlertCircle } from "lucide-react";
import axios from "axios";
import Navbar from "@/components/Navbar";
import SpotlightCard from "@/components/ui/SpotlightCard";
import PageTransition from "@/components/animations/PageTransition";
import { cn } from "@/lib/utils";

interface HistoryItem {
  _id: string;
  jobTitle: string;
  matchScore: number;
  atsScore: number;
  keywordStrength: number;
  createdAt: string;
}

export default function HistoryPage() {
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchHistory = async () => {
    try {
      const { data } = await axios.get("/api/history");
      setHistory(data.data || []);
    } catch (err) {
      setError("Could not load history. Make sure MongoDB is running.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchHistory(); }, []);

  const handleDelete = async (id: string) => {
    try {
      await axios.delete(`/api/history/${id}`);
      setHistory((h) => h.filter((item) => item._id !== id));
    } catch {}
  };

  const scoreColor = (score: number) =>
    score >= 75 ? "text-emerald-400" : score >= 50 ? "text-amber-400" : "text-rose-400";

  const scoreBg = (score: number) =>
    score >= 75
      ? "bg-emerald-500/10 border-emerald-500/20"
      : score >= 50
      ? "bg-amber-500/10 border-amber-500/20"
      : "bg-rose-500/10 border-rose-500/20";

  return (
    <div className="min-h-screen relative">
      <div className="fixed top-1/3 left-1/3 w-80 h-80 bg-emerald-500/4 rounded-full blur-[100px] pointer-events-none" />
      <Navbar />

      <PageTransition>
        <main className="relative z-10 pt-28 pb-24 px-6 max-w-4xl mx-auto">
          <div className="flex items-end justify-between mb-10">
            <div>
              <p className="text-xs font-mono text-emerald-500/70 uppercase tracking-widest mb-1">
                MongoDB records
              </p>
              <h1 className="text-3xl md:text-4xl font-display font-bold text-white">
                Analysis History
              </h1>
            </div>
            {history.length > 0 && (
              <span className="text-sm text-white/30 font-body">{history.length} analyses</span>
            )}
          </div>

          {loading && (
            <div className="flex items-center justify-center py-20">
              <div className="w-8 h-8 border-2 border-white/10 border-t-emerald-400 rounded-full animate-spin" />
            </div>
          )}

          {error && (
            <div className="flex items-start gap-3 bg-rose-500/10 border border-rose-500/20 rounded-xl px-5 py-4 text-rose-400 text-sm font-body">
              <AlertCircle size={16} className="mt-0.5 flex-shrink-0" />
              <div>
                <p className="font-medium mb-1">No history available</p>
                <p className="text-rose-400/70">{error}</p>
              </div>
            </div>
          )}

          {!loading && !error && history.length === 0 && (
            <div className="text-center py-20">
              <TrendingUp size={32} className="text-white/20 mx-auto mb-4" />
              <p className="text-white/40 font-body">No analyses yet.</p>
              <p className="text-white/25 text-sm mt-1 font-body">
                Run your first analysis to see it here.
              </p>
            </div>
          )}

          {!loading && history.length > 0 && (
            <div className="space-y-3">
              {history.map((item, i) => (
                <motion.div
                  key={item._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.07 }}
                >
                  <SpotlightCard className="flex items-center gap-5 px-6 py-5">
                    {/* Match score badge */}
                    <div
                      className={cn(
                        "flex-shrink-0 w-14 h-14 rounded-xl border flex items-center justify-center",
                        scoreBg(item.matchScore)
                      )}
                    >
                      <span className={cn("text-lg font-display font-bold", scoreColor(item.matchScore))}>
                        {item.matchScore}
                      </span>
                    </div>

                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <p className="font-display font-semibold text-white/85 truncate">
                        {item.jobTitle}
                      </p>
                      <div className="flex items-center gap-4 mt-1">
                        <span className="text-xs text-white/35 font-body">
                          ATS: <span className={scoreColor(item.atsScore)}>{item.atsScore}%</span>
                        </span>
                        <span className="text-xs text-white/35 font-body">
                          Keywords: <span className={scoreColor(item.keywordStrength)}>{item.keywordStrength}%</span>
                        </span>
                      </div>
                    </div>

                    {/* Date */}
                    <div className="flex items-center gap-1.5 text-xs text-white/25 font-body flex-shrink-0">
                      <Calendar size={11} />
                      {new Date(item.createdAt).toLocaleDateString("en-IN", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      })}
                    </div>

                    {/* Delete */}
                    <button
                      onClick={() => handleDelete(item._id)}
                      className="flex-shrink-0 p-2 text-white/20 hover:text-rose-400 hover:bg-rose-500/10 rounded-lg transition-colors"
                    >
                      <Trash2 size={14} />
                    </button>
                  </SpotlightCard>
                </motion.div>
              ))}
            </div>
          )}
        </main>
      </PageTransition>
    </div>
  );
}
