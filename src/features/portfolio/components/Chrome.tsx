import { useEffect, useRef, useState } from "react";
import * as Popover from "@radix-ui/react-popover";
import { AnimatePresence, motion, useMotionValueEvent, useScroll } from "framer-motion";
import { Check, Download, Lock, Sparkles } from "lucide-react";
import { ACHIEVEMENTS, PROFILE, SECTIONS } from "../data/content";
import { useExplorer } from "../state/explorer";
import { useActiveSection, useKonami, useLocalTime } from "../hooks";
import { EASE, Magnetic, cx } from "./primitives";

const SECTION_IDS = SECTIONS.map((s) => s.id);

function ProgressRing({ value }: { value: number }) {
  const r = 9;
  const c = 2 * Math.PI * r;
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5 -rotate-90" aria-hidden>
      <circle cx="12" cy="12" r={r} fill="none" stroke="currentColor" strokeOpacity={0.2} strokeWidth={2} />
      <motion.circle
        cx="12"
        cy="12"
        r={r}
        fill="none"
        stroke="#FF5A1F"
        strokeWidth={2}
        strokeLinecap="round"
        strokeDasharray={c}
        initial={{ strokeDashoffset: c }}
        animate={{ strokeDashoffset: c * (1 - value) }}
        transition={{ duration: 0.8, ease: EASE }}
      />
    </svg>
  );
}

function ExplorerLog() {
  const unlocked = useExplorer((s) => s.unlocked);
  const total = ACHIEVEMENTS.length;

  return (
    <Popover.Root>
      <Popover.Trigger
        className="flex items-center gap-2 rounded-full border border-paper/15 bg-ink/60 py-2 pl-2.5 pr-3.5 text-paper backdrop-blur-md transition-colors hover:border-ember data-[state=open]:border-ember"
        aria-label={`Explorer log: ${unlocked.length} of ${total} discovered`}
      >
        <ProgressRing value={unlocked.length / total} />
        <span className="font-mono text-[11px] tracking-wider">
          {unlocked.length}/{total}
        </span>
      </Popover.Trigger>
      <Popover.Portal>
        <Popover.Content
          sideOffset={10}
          align="end"
          collisionPadding={16}
          className="z-[70] w-[min(92vw,380px)] rounded-[24px] border border-paper/10 bg-ink-2/95 p-5 font-display text-paper shadow-2xl shadow-black/60 backdrop-blur-xl data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=open]:zoom-in-95"
        >
          <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-ember">Explorer log</p>
          <p className="mt-2 text-sm text-paper/70">
            This isn't a résumé to read, it's a place to explore. A few things are hidden.
          </p>
          <ul className="mt-4 divide-y divide-paper/10">
            {ACHIEVEMENTS.map((a) => {
              const done = unlocked.includes(a.id);
              return (
                <li key={a.id} className="flex items-start gap-3 py-3">
                  <span
                    className={cx(
                      "mt-0.5 grid h-7 w-7 shrink-0 place-items-center rounded-full border",
                      done ? "border-ember bg-ember text-ink" : "border-paper/15 text-paper/40",
                    )}
                  >
                    {done ? <Check className="h-3.5 w-3.5" aria-hidden /> : <Lock className="h-3 w-3" aria-hidden />}
                  </span>
                  <span>
                    <span className={cx("block text-sm font-medium", done ? "text-paper" : "text-paper/70")}>
                      {a.title}
                      <span className="sr-only">{done ? " (unlocked)" : " (locked)"}</span>
                    </span>
                    <span className="block text-xs text-paper/50">{a.hint}</span>
                  </span>
                </li>
              );
            })}
          </ul>
          <Popover.Arrow className="fill-ink-2" />
        </Popover.Content>
      </Popover.Portal>
    </Popover.Root>
  );
}

export function TopBar() {
  const time = useLocalTime();
  const setBlueprint = useExplorer((s) => s.setBlueprint);
  const taps = useRef({ count: 0, last: 0 });
  const { scrollY } = useScroll();
  const [atTop, setAtTop] = useState(true);
  useMotionValueEvent(scrollY, "change", (v) => setAtTop(v < 120));

  const onMonogram = () => {
    const now = Date.now();
    taps.current.count = now - taps.current.last < 700 ? taps.current.count + 1 : 1;
    taps.current.last = now;
    if (taps.current.count >= 5) {
      taps.current.count = 0;
      setBlueprint(!useExplorer.getState().blueprint);
    }
  };

  return (
    <header className="pointer-events-none fixed inset-x-0 top-0 z-50">
      <div aria-hidden className="absolute inset-x-0 top-0 h-28 bg-gradient-to-b from-ink via-ink/75 to-transparent" />
      <div className="relative mx-auto flex max-w-[1440px] items-center justify-between px-5 py-4 sm:px-8 md:px-12 md:py-5">
        <Magnetic className="pointer-events-auto">
          <a href="#top" onClick={onMonogram} className="flex items-center gap-3" aria-label={`${PROFILE.name}, back to top`}>
            <span className="grid h-10 w-10 place-items-center rounded-full border border-paper/20 font-display text-sm font-semibold tracking-tight transition-colors hover:border-ember">
              AN
            </span>
            <span className="hidden text-sm font-medium sm:block">{PROFILE.name}</span>
          </a>
        </Magnetic>

        <p
          className={cx(
            "hidden items-center gap-2.5 font-mono text-[11px] uppercase tracking-[0.18em] text-paper/60 transition-opacity duration-500 lg:flex",
            !atTop && "opacity-0",
          )}
        >
          <span className="relative flex h-2 w-2" aria-hidden>
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-60 motion-reduce:animate-none" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-400" />
          </span>
          {PROFILE.availability}
          <span className="text-paper/30">/</span>
          Bengaluru {time}
        </p>

        <div className="pointer-events-auto flex items-center gap-2">
          <ExplorerLog />
          <a
            href={PROFILE.resume}
            download="Avinash_Nayak_Resume.pdf"
            className="flex items-center gap-2 rounded-full bg-paper px-4 py-2.5 text-xs font-medium text-ink transition-colors hover:bg-ember"
          >
            <Download className="h-3.5 w-3.5" aria-hidden />
            Résumé
          </a>
        </div>
      </div>
    </header>
  );
}

export function Nav() {
  const active = useActiveSection(SECTION_IDS);
  const { scrollY } = useScroll();
  const [pastHero, setPastHero] = useState(false);
  const [focused, setFocused] = useState(false);

  useMotionValueEvent(scrollY, "change", (v) => setPastHero(v > window.innerHeight * 0.6));
  const shown = pastHero || focused;

  return (
    <motion.nav
      aria-label="Sections"
      initial={false}
      animate={{ y: shown ? 0 : 96, opacity: shown ? 1 : 0 }}
      transition={{ duration: 0.5, ease: EASE }}
      onFocus={() => setFocused(true)}
      onBlur={() => setFocused(false)}
      className="pointer-events-none fixed inset-x-0 bottom-[max(1rem,env(safe-area-inset-bottom))] z-50 flex justify-center px-3"
    >
      <ul className="pointer-events-auto flex items-center gap-0.5 rounded-full border border-paper/10 bg-ink-2/80 p-1.5 shadow-2xl shadow-black/60 backdrop-blur-xl">
        {SECTIONS.map((s) => {
          const isActive = active === s.id;
          return (
            <li key={s.id} className="relative">
              {isActive && (
                <motion.span
                  layoutId="nav-pill"
                  className="absolute inset-0 rounded-full bg-paper"
                  transition={{ type: "spring", stiffness: 420, damping: 36 }}
                />
              )}
              <a
                href={`#${s.id}`}
                aria-current={isActive ? "location" : undefined}
                tabIndex={shown ? 0 : -1}
                className={cx(
                  "relative block rounded-full px-3 py-2 text-[13px] font-medium transition-colors sm:px-4",
                  isActive ? "text-ink" : "text-paper/70 hover:text-paper",
                )}
              >
                {s.label}
              </a>
            </li>
          );
        })}
      </ul>
    </motion.nav>
  );
}

export function ToastHost() {
  const toast = useExplorer((s) => s.toast);
  const dismiss = useExplorer((s) => s.dismissToast);

  useEffect(() => {
    if (!toast) return;
    const id = window.setTimeout(dismiss, 3800);
    return () => window.clearTimeout(id);
  }, [toast, dismiss]);

  return (
    <div role="status" aria-live="polite" className="pointer-events-none fixed inset-x-0 top-20 z-[110] flex justify-center px-4">
      <AnimatePresence>
        {toast && (
          <motion.div
            key={toast.key}
            initial={{ y: -16, opacity: 0, scale: 0.96 }}
            animate={{ y: 0, opacity: 1, scale: 1 }}
            exit={{ y: -10, opacity: 0, scale: 0.98 }}
            transition={{ duration: 0.45, ease: EASE }}
            className="flex items-center gap-3 rounded-full border border-ember/30 bg-ink-2/90 py-2 pl-2 pr-5 shadow-2xl shadow-black/60 backdrop-blur-xl"
          >
            <span className="grid h-8 w-8 place-items-center rounded-full bg-ember text-ink">
              <Sparkles className="h-4 w-4" aria-hidden />
            </span>
            <span>
              <span className="block text-sm font-medium">{toast.title}</span>
              <span className="block text-xs text-paper/60">{toast.body}</span>
            </span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export function Blueprint() {
  const on = useExplorer((s) => s.blueprint);
  const setBlueprint = useExplorer((s) => s.setBlueprint);

  useKonami(() => setBlueprint(!useExplorer.getState().blueprint));

  useEffect(() => {
    if (!on) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setBlueprint(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [on, setBlueprint]);

  return (
    <AnimatePresence>
      {on && (
        <motion.div
          aria-hidden
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="pointer-events-none fixed inset-0 z-[95] bg-[linear-gradient(rgba(255,90,31,0.06)_1px,transparent_1px)] bg-[length:100%_8px]"
        >
          <div className="mx-auto grid h-full max-w-[1440px] grid-cols-4 gap-4 px-5 sm:px-8 md:grid-cols-12 md:gap-6 md:px-12">
            {Array.from({ length: 12 }, (_, i) => (
              <motion.div
                key={i}
                initial={{ scaleY: 0 }}
                animate={{ scaleY: 1 }}
                transition={{ delay: i * 0.03, duration: 0.6, ease: EASE }}
                className={cx("h-full origin-top border-x border-ember/25 bg-ember/[0.04]", i >= 4 && "hidden md:block")}
              />
            ))}
          </div>
          <p className="absolute left-5 top-24 font-mono text-[10px] uppercase tracking-[0.2em] text-ember sm:left-8 md:left-12">
            Blueprint · 12 col · 8px baseline · 1440 max · Esc to exit
          </p>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
