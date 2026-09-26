import { useEffect, useRef, useState } from "react";
import {
  AnimatePresence,
  motion,
  useMotionValue,
  useReducedMotion,
  useSpring,
  useTransform,
  useVelocity,
} from "framer-motion";
import { useFinePointer } from "../hooks";
import { EASE } from "./primitives";

/** Ring that trails the native cursor and expands over interactive elements. */
export function Cursor() {
  const fine = useFinePointer();
  const reduce = useReducedMotion();
  const x = useMotionValue(-100);
  const y = useMotionValue(-100);
  const sx = useSpring(x, { stiffness: 600, damping: 45, mass: 0.4 });
  const sy = useSpring(y, { stiffness: 600, damping: 45, mass: 0.4 });
  const [hover, setHover] = useState<{ on: boolean; label: string | null }>({ on: false, label: null });
  const [visible, setVisible] = useState(false);
  const visibleRef = useRef(false);

  useEffect(() => {
    if (!fine || reduce) return;
    const move = (e: PointerEvent) => {
      x.set(e.clientX);
      y.set(e.clientY);
      if (!visibleRef.current) {
        visibleRef.current = true;
        setVisible(true);
      }
    };
    const over = (e: PointerEvent) => {
      const target = (e.target as Element | null)?.closest<HTMLElement>("a, button, [data-cursor]");
      const label = target?.dataset.cursor ?? null;
      setHover((prev) => (prev.on === !!target && prev.label === label ? prev : { on: !!target, label }));
    };
    const leave = () => {
      visibleRef.current = false;
      setVisible(false);
    };
    window.addEventListener("pointermove", move, { passive: true });
    document.addEventListener("pointerover", over, { passive: true });
    document.documentElement.addEventListener("pointerleave", leave);
    return () => {
      window.removeEventListener("pointermove", move);
      document.removeEventListener("pointerover", over);
      document.documentElement.removeEventListener("pointerleave", leave);
    };
  }, [fine, reduce, x, y]);

  if (!fine || reduce) return null;

  const size = hover.label ? 96 : hover.on ? 48 : 22;

  return (
    <motion.div aria-hidden className="pointer-events-none fixed left-0 top-0 z-[120]" style={{ x: sx, y: sy }}>
      <motion.div
        className="flex -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full"
        animate={{
          width: size,
          height: size,
          opacity: visible ? 1 : 0,
          backgroundColor: hover.label ? "rgba(255,90,31,1)" : "rgba(255,90,31,0)",
          borderColor: hover.label ? "rgba(255,90,31,0)" : hover.on ? "rgba(255,90,31,0.9)" : "rgba(237,233,225,0.45)",
        }}
        style={{ borderWidth: 1, borderStyle: "solid" }}
        transition={{ duration: 0.35, ease: EASE }}
      >
        <AnimatePresence>
          {hover.label && (
            <motion.span
              key={hover.label}
              className="whitespace-nowrap font-mono text-[10px] font-medium uppercase tracking-wider text-ink"
              initial={{ opacity: 0, scale: 0.6 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.6 }}
              transition={{ duration: 0.2 }}
            >
              {hover.label}
            </motion.span>
          )}
        </AnimatePresence>
      </motion.div>
    </motion.div>
  );
}

/** Image that follows the pointer and tilts with its velocity. */
export function CursorPreview({ src }: { src: string | null }) {
  const fine = useFinePointer();
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const sx = useSpring(x, { stiffness: 170, damping: 22, mass: 0.6 });
  const sy = useSpring(y, { stiffness: 170, damping: 22, mass: 0.6 });
  const velocity = useVelocity(sx);
  const rotate = useTransform(velocity, [-2500, 2500], [-9, 9], { clamp: true });

  useEffect(() => {
    if (!fine) return;
    const move = (e: PointerEvent) => {
      x.set(e.clientX);
      y.set(e.clientY);
    };
    window.addEventListener("pointermove", move, { passive: true });
    return () => window.removeEventListener("pointermove", move);
  }, [fine, x, y]);

  if (!fine) return null;

  return (
    <motion.div aria-hidden className="pointer-events-none fixed left-0 top-0 z-[60]" style={{ x: sx, y: sy, rotate }}>
      <div className="-translate-x-1/2 -translate-y-[calc(100%+28px)]">
        <AnimatePresence mode="popLayout">
          {src && (
            <motion.div
              key={src}
              className="overflow-hidden rounded-2xl border border-paper/10 bg-ink-3 shadow-2xl shadow-black/60"
              initial={{ opacity: 0, scale: 0.85, clipPath: "inset(45% 45% 45% 45% round 16px)" }}
              animate={{ opacity: 1, scale: 1, clipPath: "inset(0% 0% 0% 0% round 16px)" }}
              exit={{ opacity: 0, scale: 0.9, clipPath: "inset(45% 45% 45% 45% round 16px)" }}
              transition={{ duration: 0.5, ease: EASE }}
            >
              <img src={src} alt="" className="h-[240px] w-[340px] object-cover" decoding="async" />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}
