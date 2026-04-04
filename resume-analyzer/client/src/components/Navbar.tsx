import { Link, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import { FileText, Clock, Zap } from "lucide-react";
import { cn } from "@/lib/utils";

const links = [
  { href: "/", label: "Home", icon: Zap },
  { href: "/analyze", label: "Analyze", icon: FileText },
  { href: "/history", label: "History", icon: Clock },
];

export default function Navbar() {
  const location = useLocation();

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 px-6 py-4">
      <div className="max-w-6xl mx-auto flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 group">
          <div className="w-8 h-8 rounded-lg bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center">
            <span className="text-emerald-400 text-sm font-display font-bold">R</span>
          </div>
          <span className="font-display font-semibold text-white/90 tracking-tight">
            Resume<span className="text-emerald-400">AI</span>
          </span>
        </Link>

        {/* Nav links */}
        <div className="flex items-center gap-1 bg-white/[0.04] border border-white/[0.07] rounded-full px-2 py-1.5 backdrop-blur-sm">
          {links.map(({ href, label, icon: Icon }) => {
            const active = location.pathname === href;
            return (
              <Link
                key={href}
                to={href}
                className={cn(
                  "relative flex items-center gap-1.5 px-4 py-1.5 rounded-full text-sm transition-colors duration-200",
                  active ? "text-white" : "text-white/50 hover:text-white/80"
                )}
              >
                {active && (
                  <motion.div
                    layoutId="nav-pill"
                    className="absolute inset-0 rounded-full bg-white/10"
                    transition={{ type: "spring", bounce: 0.2, duration: 0.5 }}
                  />
                )}
                <Icon size={13} />
                <span className="relative z-10 font-body">{label}</span>
              </Link>
            );
          })}
        </div>

        {/* CTA */}
        <Link
          to="/analyze"
          className="text-sm font-body text-emerald-400 border border-emerald-500/30 px-4 py-1.5 rounded-full hover:bg-emerald-500/10 transition-colors"
        >
          Get started
        </Link>
      </div>
    </nav>
  );
}
