import { useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { motion } from "framer-motion";
import { ArrowRight, Sparkles, Target, Zap, Shield } from "lucide-react";
import ParticleBackground from "@/components/three/ParticleBackground";
import TextReveal from "@/components/animations/TextReveal";
import SpotlightCard from "@/components/ui/SpotlightCard";
import BorderBeam from "@/components/ui/BorderBeam";
import Navbar from "@/components/Navbar";

gsap.registerPlugin(ScrollTrigger);

const features = [
  {
    icon: Target,
    title: "JD Match Score",
    desc: "AI compares your resume against the job description and gives you a precise compatibility score.",
  },
  {
    icon: Zap,
    title: "Bullet Rewriter",
    desc: "Weak bullets get rewritten with metrics, active verbs, and ATS-optimized keywords automatically.",
  },
  {
    icon: Shield,
    title: "ATS Optimizer",
    desc: "Understand exactly which keywords are missing and why your resume might get filtered out.",
  },
  {
    icon: Sparkles,
    title: "Instant Tips",
    desc: "Get 4 specific, actionable improvements tailored to the exact role you're applying for.",
  },
];

export default function HomePage() {
  const heroRef = useRef<HTMLDivElement>(null);
  const featuresRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Hero entrance
    const ctx = gsap.context(() => {
      gsap.fromTo(
        ".hero-badge",
        { opacity: 0, y: 20, scale: 0.9 },
        { opacity: 1, y: 0, scale: 1, duration: 0.6, delay: 0.2, ease: "back.out(1.7)" }
      );
      gsap.fromTo(
        ".hero-sub",
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.6, delay: 1.0 }
      );
      gsap.fromTo(
        ".hero-cta",
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.6, delay: 1.2, stagger: 0.1 }
      );
      gsap.fromTo(
        ".hero-stat",
        { opacity: 0, y: 30 },
        { opacity: 1, y: 0, duration: 0.5, delay: 1.4, stagger: 0.1 }
      );

      // Feature cards scroll animation
      gsap.fromTo(
        ".feature-card",
        { opacity: 0, y: 50 },
        {
          opacity: 1,
          y: 0,
          duration: 0.6,
          stagger: 0.12,
          ease: "power3.out",
          scrollTrigger: {
            trigger: featuresRef.current,
            start: "top 80%",
          },
        }
      );
    }, heroRef);

    return () => ctx.revert();
  }, []);

  return (
    <div ref={heroRef} className="min-h-screen relative overflow-hidden">
      <ParticleBackground />
      <Navbar />

      {/* Radial glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-emerald-500/5 blur-[120px] pointer-events-none" />

      {/* Hero */}
      <section className="relative z-10 pt-40 pb-24 px-6 text-center">
        <div className="max-w-4xl mx-auto">
          {/* Badge */}
          <div className="hero-badge inline-flex items-center gap-2 bg-emerald-500/10 border border-emerald-500/20 rounded-full px-4 py-1.5 text-emerald-400 text-sm font-body mb-8" style={{ opacity: 0 }}>
            <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse-glow" />
            AI-Powered Resume Intelligence
          </div>

          {/* Headline */}
          <h1 className="text-6xl md:text-7xl font-display font-bold text-white leading-[1.05] tracking-tight mb-6">
            <TextReveal text="Land the job" delay={0.3} />
            <br />
            <span className="gradient-text">
              <TextReveal text="you deserve." delay={0.7} />
            </span>
          </h1>

          {/* Subheading */}
          <p
            className="hero-sub text-lg text-white/50 font-body max-w-xl mx-auto mb-10 leading-relaxed"
            style={{ opacity: 0 }}
          >
            Paste your resume and a job description. Our AI scores your match, rewrites your bullets,
            and tells you exactly what's missing — in seconds.
          </p>

          {/* CTAs */}
          <div className="hero-cta flex items-center justify-center gap-4 mb-16 flex-wrap" style={{ opacity: 0 }}>
            <Link
              to="/analyze"
              className="group flex items-center gap-2 bg-emerald-500 hover:bg-emerald-400 text-black font-display font-semibold px-7 py-3.5 rounded-full transition-all duration-200 hover:scale-105"
            >
              Analyze my resume
              <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link
              to="/history"
              className="flex items-center gap-2 text-white/60 hover:text-white/90 border border-white/10 hover:border-white/20 px-7 py-3.5 rounded-full font-body transition-all duration-200"
            >
              View past analyses
            </Link>
          </div>

          {/* Stats */}
          <div className="flex items-center justify-center gap-12 flex-wrap">
            {[
              { num: "3×", label: "more interviews" },
              { num: "< 10s", label: "analysis time" },
              { num: "100%", label: "free to start" },
            ].map((stat) => (
              <div key={stat.label} className="hero-stat text-center" style={{ opacity: 0 }}>
                <div className="text-2xl font-display font-bold text-white">{stat.num}</div>
                <div className="text-sm text-white/40 font-body mt-0.5">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section ref={featuresRef} className="relative z-10 px-6 pb-32 max-w-6xl mx-auto">
        <div className="text-center mb-14">
          <h2 className="text-3xl font-display font-bold text-white mb-3">
            Everything you need to get hired
          </h2>
          <p className="text-white/40 font-body">No fluff. Just the insights that matter.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {features.map(({ icon: Icon, title, desc }) => (
            <SpotlightCard key={title} className="feature-card p-6 opacity-0">
              <div className="w-10 h-10 rounded-lg bg-emerald-500/15 border border-emerald-500/20 flex items-center justify-center mb-4">
                <Icon size={18} className="text-emerald-400" />
              </div>
              <h3 className="font-display font-semibold text-white mb-2 text-base">{title}</h3>
              <p className="text-sm text-white/45 font-body leading-relaxed">{desc}</p>
            </SpotlightCard>
          ))}
        </div>
      </section>

      {/* CTA Banner */}
      <section className="relative z-10 px-6 pb-24">
        <div className="max-w-2xl mx-auto">
          <div className="relative rounded-2xl overflow-hidden p-px">
            <BorderBeam />
            <div className="relative bg-white/[0.04] rounded-2xl px-10 py-12 text-center backdrop-blur-sm">
              <h2 className="text-3xl font-display font-bold text-white mb-3">
                Ready to level up?
              </h2>
              <p className="text-white/50 font-body mb-8">
                Upload your resume and see exactly where you stand.
              </p>
              <Link
                to="/analyze"
                className="inline-flex items-center gap-2 bg-emerald-500 hover:bg-emerald-400 text-black font-display font-semibold px-8 py-3.5 rounded-full transition-all duration-200 hover:scale-105"
              >
                Start for free <ArrowRight size={16} />
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
