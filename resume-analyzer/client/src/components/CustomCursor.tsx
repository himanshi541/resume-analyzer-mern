import { useEffect } from "react";
import gsap from "gsap";

export default function CustomCursor() {
  useEffect(() => {
    const cursor = document.getElementById("cursor");
    const follower = document.getElementById("cursor-follower");
    if (!cursor || !follower) return;

    const moveCursor = (e: MouseEvent) => {
      gsap.to(cursor, { x: e.clientX - 4, y: e.clientY - 4, duration: 0.1 });
      gsap.to(follower, { x: e.clientX - 16, y: e.clientY - 16, duration: 0.25 });
    };

    const handleEnter = () => {
      gsap.to(cursor, { scale: 3, duration: 0.2 });
      gsap.to(follower, { scale: 1.5, borderColor: "rgba(52,211,153,0.8)", duration: 0.2 });
    };

    const handleLeave = () => {
      gsap.to(cursor, { scale: 1, duration: 0.2 });
      gsap.to(follower, { scale: 1, borderColor: "rgba(52,211,153,0.4)", duration: 0.2 });
    };

    window.addEventListener("mousemove", moveCursor);

    const interactables = document.querySelectorAll("button, a, textarea, input, [data-hover]");
    interactables.forEach((el) => {
      el.addEventListener("mouseenter", handleEnter);
      el.addEventListener("mouseleave", handleLeave);
    });

    return () => {
      window.removeEventListener("mousemove", moveCursor);
    };
  }, []);

  return null;
}
