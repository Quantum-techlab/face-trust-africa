import React, { useEffect, useRef } from "react";

// Subtle spotlight that follows the cursor using CSS variables and GPU-friendly transforms
// Respects prefers-reduced-motion
const MovingSpotlight: React.FC = () => {
  const ref = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const handler = (e: MouseEvent) => {
      const rect = el.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      el.style.setProperty("--spot-x", `${x}px`);
      el.style.setProperty("--spot-y", `${y}px`);
    };

    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (!media.matches) {
      window.addEventListener("mousemove", handler);
    }
    return () => window.removeEventListener("mousemove", handler);
  }, []);

  return (
    <div
      ref={ref}
      aria-hidden
      className="pointer-events-none absolute inset-0 -z-10 [mask-image:radial-gradient(240px_240px_at_var(--spot-x,_50%)_var(--spot-y,_50%),hsl(0_0%_100%/.9),transparent_60%)]"
      style={{
        background:
          "radial-gradient(400px 400px at var(--spot-x, 50%) var(--spot-y, 50%), hsl(var(--brand)/0.25), transparent 60%)",
      }}
    />
  );
};

export default MovingSpotlight;
