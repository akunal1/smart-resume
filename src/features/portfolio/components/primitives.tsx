import { useRef, type ReactNode, type PointerEvent as ReactPointerEvent } from "react";
import { motion, useReducedMotion, useSpring } from "framer-motion";
import { useFinePointer } from "../hooks";

export const EASE = [0.16, 1, 0.3, 1] as const;

export const cx = (...classes: (string | false | null | undefined)[]) => classes.filter(Boolean).join(" ");

export function Magnetic({
  children,
  strength = 0.3,
  className,
}: {
  children: ReactNode;
  strength?: number;
  className?: string;
}) {
  const fine = useFinePointer();
  const reduce = useReducedMotion();
  const rect = useRef<DOMRect | null>(null);
  const x = useSpring(0, { stiffness: 260, damping: 18, mass: 0.4 });
  const y = useSpring(0, { stiffness: 260, damping: 18, mass: 0.4 });

  if (!fine || reduce) return <div className={cx("inline-block", className)}>{children}</div>;

  const onMove = (e: ReactPointerEvent<HTMLDivElement>) => {
    const r = rect.current ?? e.currentTarget.getBoundingClientRect();
    x.set((e.clientX - (r.left + r.width / 2)) * strength);
    y.set((e.clientY - (r.top + r.height / 2)) * strength);
  };

  return (
    <motion.div
      className={cx("inline-block", className)}
      style={{ x, y }}
      onPointerEnter={(e) => (rect.current = e.currentTarget.getBoundingClientRect())}
      onPointerMove={onMove}
      onPointerLeave={() => {
        rect.current = null;
        x.set(0);
        y.set(0);
      }}
    >
      {children}
    </motion.div>
  );
}

export function Reveal({
  children,
  delay = 0,
  y = 28,
  className,
}: {
  children: ReactNode;
  delay?: number;
  y?: number;
  className?: string;
}) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "0px 0px -12% 0px" }}
      transition={{ duration: 0.9, delay, ease: EASE }}
    >
      {children}
    </motion.div>
  );
}

/** Masked line reveal; the wrapper clips while the inner line slides up. */
export function RevealLine({
  children,
  delay = 0,
  inView = false,
  className,
}: {
  children: ReactNode;
  delay?: number;
  inView?: boolean;
  className?: string;
}) {
  const animateProps = inView
    ? { whileInView: { y: "0%" }, viewport: { once: true, margin: "0px 0px -10% 0px" } }
    : { animate: { y: "0%" } };
  return (
    <span className={cx("-mb-[0.06em] block overflow-hidden pb-[0.14em]", className)}>
      <motion.span
        className="block will-change-transform"
        initial={{ y: "105%" }}
        {...animateProps}
        transition={{ duration: 1.1, delay, ease: EASE }}
      >
        {children}
      </motion.span>
    </span>
  );
}

export function SectionHeading({
  index,
  label,
  id,
  children,
  aside,
}: {
  index: string;
  label: string;
  id: string;
  children: ReactNode;
  aside?: ReactNode;
}) {
  return (
    <div className="mb-14 grid gap-8 md:mb-20 md:grid-cols-12 md:items-end">
      <div className="md:col-span-8">
        <p className="mb-6 flex items-center gap-3 font-mono text-xs uppercase tracking-[0.2em] text-paper/60">
          <span className="text-ember">{index}</span>
          <span className="h-px w-10 bg-paper/25" aria-hidden />
          {label}
        </p>
        <h2
          id={id}
          className="font-display text-[clamp(2.4rem,6vw,5.5rem)] font-medium leading-[0.95] tracking-[-0.035em]"
        >
          <RevealLine inView>{children}</RevealLine>
        </h2>
      </div>
      {aside && (
        <Reveal delay={0.15} className="text-base leading-relaxed text-paper/65 md:col-span-4 md:pb-2">
          {aside}
        </Reveal>
      )}
    </div>
  );
}

/** Radial highlight that follows the pointer via CSS variables (no re-renders). */
export function Spotlight({ children, className }: { children: ReactNode; className?: string }) {
  const onMove = (e: ReactPointerEvent<HTMLDivElement>) => {
    const r = e.currentTarget.getBoundingClientRect();
    e.currentTarget.style.setProperty("--mx", `${e.clientX - r.left}px`);
    e.currentTarget.style.setProperty("--my", `${e.clientY - r.top}px`);
  };
  return (
    <div onPointerMove={onMove} className={cx("group relative overflow-hidden", className)}>
      <div
        aria-hidden
        className="pf-spotlight pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100"
      />
      {children}
    </div>
  );
}

export function TiltCard({ children, className }: { children: ReactNode; className?: string }) {
  const fine = useFinePointer();
  const reduce = useReducedMotion();
  const rx = useSpring(0, { stiffness: 200, damping: 20 });
  const ry = useSpring(0, { stiffness: 200, damping: 20 });

  if (!fine || reduce) return <div className={className}>{children}</div>;

  return (
    <motion.div
      className={className}
      style={{ rotateX: rx, rotateY: ry, transformPerspective: 900 }}
      onPointerMove={(e) => {
        const r = e.currentTarget.getBoundingClientRect();
        ry.set(((e.clientX - r.left) / r.width - 0.5) * 10);
        rx.set(-((e.clientY - r.top) / r.height - 0.5) * 10);
      }}
      onPointerLeave={() => {
        rx.set(0);
        ry.set(0);
      }}
    >
      {children}
    </motion.div>
  );
}

export function Chip({ children, active = false }: { children: ReactNode; active?: boolean }) {
  return (
    <span
      className={cx(
        "inline-flex items-center rounded-full border px-3 py-1 font-mono text-[11px] uppercase tracking-wider",
        active ? "border-ember/60 text-ember" : "border-paper/15 text-paper/70",
      )}
    >
      {children}
    </span>
  );
}
