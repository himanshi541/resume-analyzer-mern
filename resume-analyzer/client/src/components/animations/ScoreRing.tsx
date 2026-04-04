import { useEffect, useRef } from "react";
import gsap from "gsap";

interface ScoreRingProps {
  score: number;
  label: string;
  color?: string;
  size?: number;
  delay?: number;
}

export default function ScoreRing({
  score,
  label,
  color = "#34d399",
  size = 110,
  delay = 0,
}: ScoreRingProps) {
  const ringRef = useRef<SVGCircleElement>(null);
  const numRef = useRef<HTMLSpanElement>(null);

  const radius = 40;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (score / 100) * circumference;

  useEffect(() => {
    if (!ringRef.current || !numRef.current) return;

    const ring = ringRef.current;
    const num = numRef.current;

    gsap.set(ring, { strokeDashoffset: circumference });
    gsap.set(num, { textContent: "0" });

    gsap.to(ring, {
      strokeDashoffset: offset,
      duration: 1.6,
      delay,
      ease: "power3.out",
    });

    gsap.to(
      { val: 0 },
      {
        val: score,
        duration: 1.4,
        delay,
        ease: "power3.out",
        onUpdate: function () {
          if (num) num.textContent = Math.round(this.targets()[0].val).toString();
        },
      }
    );
  }, [score, offset, circumference, delay]);

  return (
    <div className="flex flex-col items-center gap-2">
      <div className="relative" style={{ width: size, height: size }}>
        <svg width={size} height={size} viewBox="0 0 100 100">
          {/* Background ring */}
          <circle
            cx="50"
            cy="50"
            r={radius}
            fill="none"
            stroke="rgba(255,255,255,0.05)"
            strokeWidth="6"
          />
          {/* Score ring */}
          <circle
            ref={ringRef}
            cx="50"
            cy="50"
            r={radius}
            fill="none"
            stroke={color}
            strokeWidth="6"
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={circumference}
            style={{ transform: "rotate(-90deg)", transformOrigin: "center" }}
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center">
            <span
              ref={numRef}
              className="text-2xl font-display font-700 text-white"
              style={{ color: "white" }}
            >
              0
            </span>
            <span className="text-sm text-white/60">%</span>
          </div>
        </div>
      </div>
      <span className="text-xs font-body text-white/50 tracking-wider uppercase">{label}</span>
    </div>
  );
}
