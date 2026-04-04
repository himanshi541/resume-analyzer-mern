import { cn } from "@/lib/utils";

interface BorderBeamProps {
  className?: string;
  size?: number;
  duration?: number;
  colorFrom?: string;
  colorTo?: string;
}

export default function BorderBeam({
  className,
  size = 200,
  duration = 12,
  colorFrom = "#34d399",
  colorTo = "#6ee7b7",
}: BorderBeamProps) {
  return (
    <div
      className={cn("pointer-events-none absolute inset-0 rounded-[inherit]", className)}
      style={
        {
          "--size": size,
          "--duration": duration,
          "--color-from": colorFrom,
          "--color-to": colorTo,
          "--angle": "0deg",
        } as React.CSSProperties
      }
    >
      <div
        className="absolute inset-[1px] rounded-[inherit]"
        style={{
          background: "transparent",
          border: "1px solid transparent",
          borderImage: `linear-gradient(var(--angle), var(--color-from), var(--color-to), transparent) 1`,
          animation: `border-rotate ${duration}s linear infinite`,
          maskImage: "linear-gradient(transparent 50%, black 50%)",
        }}
      />
      <style>{`
        @keyframes border-rotate {
          to { --angle: 360deg; }
        }
        @property --angle {
          syntax: '<angle>';
          initial-value: 0deg;
          inherits: false;
        }
      `}</style>
    </div>
  );
}
