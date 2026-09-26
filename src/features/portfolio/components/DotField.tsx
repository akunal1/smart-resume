import { useEffect, useRef } from "react";
import { useReducedMotion } from "framer-motion";

const GAP = 26;
const RADIUS = 170;
const CATCH_DISTANCE = 48;

/**
 * Interactive dot matrix for the hero. A drifting "signal" wanders the field;
 * dots swell around it and around the pointer. Catching the signal fires `onCatch`.
 */
export function DotField({ onCatch }: { onCatch: () => void }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const reduce = useReducedMotion();
  const catchRef = useRef(onCatch);
  useEffect(() => {
    catchRef.current = onCatch;
  });

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;

    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const client = { x: -1e4, y: -1e4 };
    const pointer = { x: -1e4, y: -1e4, inside: false };
    const signal = { x: 0, y: 0 };
    let w = 0;
    let h = 0;
    let cols = 0;
    let rows = 0;
    let energy = new Float32Array(0);
    let caught = false;
    let ripple = -1;
    let raf = 0;
    let onScreen = true;

    const placeSignal = (t: number) => {
      signal.x = w * (0.64 + 0.24 * Math.sin(t * 0.00017));
      signal.y = h * (0.4 + 0.22 * Math.sin(t * 0.00029 + 1.4));
    };

    const syncPointer = () => {
      const r = canvas.getBoundingClientRect();
      pointer.x = client.x - r.left;
      pointer.y = client.y - r.top;
      pointer.inside = pointer.x >= 0 && pointer.y >= 0 && pointer.x <= r.width && pointer.y <= r.height;
    };

    const tryCatch = () => {
      if (caught || !pointer.inside) return;
      if (Math.hypot(pointer.x - signal.x, pointer.y - signal.y) < CATCH_DISTANCE) {
        caught = true;
        ripple = 0;
        catchRef.current();
      }
    };

    const draw = (t: number) => {
      placeSignal(reduce ? 0 : t);
      syncPointer();
      tryCatch();
      if (ripple >= 0) ripple = ripple > 900 ? -1 : ripple + 11;

      ctx.clearRect(0, 0, w, h);
      const glow = ctx.createRadialGradient(signal.x, signal.y, 0, signal.x, signal.y, 150);
      glow.addColorStop(0, "rgba(255,90,31,0.22)");
      glow.addColorStop(1, "rgba(255,90,31,0)");
      ctx.fillStyle = glow;
      ctx.fillRect(signal.x - 150, signal.y - 150, 300, 300);

      ctx.fillStyle = "rgba(237,233,225,0.14)";
      ctx.beginPath();
      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
          const i = r * cols + c;
          const x = c * GAP + GAP / 2;
          const y = r * GAP + GAP / 2;
          const pd = Math.hypot(x - pointer.x, y - pointer.y);
          const sd = Math.hypot(x - signal.x, y - signal.y);
          let target = Math.max(pointer.inside ? 1 - pd / RADIUS : 0, (1 - sd / 120) * 0.6, 0);
          if (ripple >= 0 && Math.abs(sd - ripple) < 34) target = Math.max(target, 0.9 * (1 - ripple / 900));
          energy[i] += reduce ? target - energy[i] : (target - energy[i]) * 0.14;
          if (energy[i] < 0.04) ctx.rect(x - 0.75, y - 0.75, 1.5, 1.5);
        }
      }
      ctx.fill();

      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
          const e = energy[r * cols + c];
          if (e < 0.04) continue;
          let x = c * GAP + GAP / 2;
          let y = r * GAP + GAP / 2;
          if (pointer.inside) {
            const dx = x - pointer.x;
            const dy = y - pointer.y;
            const d = Math.hypot(dx, dy) || 1;
            x += (dx / d) * e * 9;
            y += (dy / d) * e * 9;
          }
          ctx.fillStyle = `rgba(255,${Math.round(90 + (1 - e) * 140)},${Math.round(31 + (1 - e) * 190)},${0.25 + e * 0.75})`;
          ctx.beginPath();
          ctx.arc(x, y, 0.9 + e * 2.3, 0, Math.PI * 2);
          ctx.fill();
        }
      }
    };

    const loop = (t: number) => {
      draw(t);
      raf = requestAnimationFrame(loop);
    };
    const start = () => {
      if (!raf && onScreen && !document.hidden && !reduce) raf = requestAnimationFrame(loop);
    };
    const stop = () => {
      cancelAnimationFrame(raf);
      raf = 0;
    };

    const resize = () => {
      const r = canvas.getBoundingClientRect();
      w = r.width;
      h = r.height;
      canvas.width = Math.round(w * dpr);
      canvas.height = Math.round(h * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      cols = Math.ceil(w / GAP);
      rows = Math.ceil(h / GAP);
      energy = new Float32Array(cols * rows);
      if (reduce) draw(0);
    };

    const onPointer = (e: PointerEvent) => {
      client.x = e.clientX;
      client.y = e.clientY;
      if (reduce) {
        syncPointer();
        tryCatch();
      }
    };
    const onLeave = () => {
      client.x = -1e4;
      client.y = -1e4;
    };
    const onVisibility = () => (document.hidden ? stop() : start());

    const io = new IntersectionObserver(([entry]) => {
      onScreen = entry.isIntersecting;
      if (onScreen) start();
      else stop();
    });
    const ro = new ResizeObserver(resize);

    resize();
    ro.observe(canvas);
    io.observe(canvas);
    window.addEventListener("pointermove", onPointer, { passive: true });
    window.addEventListener("pointerdown", onPointer, { passive: true });
    document.documentElement.addEventListener("pointerleave", onLeave);
    document.addEventListener("visibilitychange", onVisibility);
    start();

    return () => {
      stop();
      io.disconnect();
      ro.disconnect();
      window.removeEventListener("pointermove", onPointer);
      window.removeEventListener("pointerdown", onPointer);
      document.documentElement.removeEventListener("pointerleave", onLeave);
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, [reduce]);

  return <canvas ref={canvasRef} aria-hidden className="absolute inset-0 h-full w-full" />;
}
