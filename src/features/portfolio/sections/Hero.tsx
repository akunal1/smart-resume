import { useState, type ReactNode } from "react";
import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion";
import { ArrowDown, MessageCircle } from "lucide-react";
import { CASES, PROFILE, YEARS_EXPERIENCE, type CaseId } from "../data/content";
import { useExplorer } from "../state/explorer";
import { useLocalTime } from "../hooks";
import { DotField } from "../components/DotField";
import { CursorPreview } from "../components/Cursor";
import { EASE, Magnetic, RevealLine } from "../components/primitives";

const CLIENTS = ["Australian Open", "AGCO", "India GST", "Edison International", "IEEE Xplore", "Infosys"];

function CaseWord({
  caseId,
  children,
  onPreview,
}: {
  caseId: CaseId;
  children: ReactNode;
  onPreview: (src: string | null) => void;
}) {
  const openCase = useExplorer((s) => s.openCase);
  const study = CASES.find((c) => c.id === caseId);
  return (
    <button
      type="button"
      onClick={() => openCase(caseId)}
      onPointerEnter={() => onPreview(study?.image ?? null)}
      onPointerLeave={() => onPreview(null)}
      aria-haspopup="dialog"
      aria-describedby="hero-case-hint"
      data-cursor="Open case"
      className="group relative inline font-serif font-normal italic tracking-[-0.02em] text-ember"
    >
      {children}
      <span
        aria-hidden
        className="absolute inset-x-0 bottom-[0.06em] h-[0.04em] origin-left scale-x-0 bg-ember transition-transform duration-500 ease-out group-hover:scale-x-100 group-focus-visible:scale-x-100"
      />
    </button>
  );
}

export function Hero() {
  const unlock = useExplorer((s) => s.unlock);
  const signalFound = useExplorer((s) => s.unlocked.includes("signal"));
  const [preview, setPreview] = useState<string | null>(null);
  const time = useLocalTime();
  const reduce = useReducedMotion();
  const { scrollY } = useScroll();
  const contentY = useTransform(scrollY, [0, 900], [0, reduce ? 0 : -140]);
  const contentOpacity = useTransform(scrollY, [0, 700], [1, reduce ? 1 : 0.25]);

  return (
    <section id="top" aria-labelledby="hero-title" className="relative flex min-h-[100svh] flex-col overflow-hidden">
      <DotField onCatch={() => unlock("signal")} />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_80%_70%_at_60%_40%,transparent_20%,#0A0A0B_90%)]"
      />

      <motion.div
        style={{ y: contentY, opacity: contentOpacity }}
        className="relative mx-auto flex w-full max-w-[1440px] flex-1 flex-col justify-end px-5 pb-10 pt-32 sm:px-8 md:px-12 md:pb-14"
      >
        <motion.p
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15, duration: 0.8, ease: EASE }}
          className="mb-8 inline-flex w-fit max-w-full flex-wrap items-center gap-x-3 gap-y-2 rounded-full border border-paper/15 bg-ink-2/70 py-1.5 pl-1.5 pr-2 shadow-[0_0_40px_-12px_rgba(255,90,31,0.45)] backdrop-blur-md md:mb-10 md:gap-x-4"
        >
          <img
            src="/me.png"
            alt=""
            width={40}
            height={40}
            className="h-9 w-9 shrink-0 rounded-full object-cover object-top ring-2 ring-ember/70 md:h-10 md:w-10"
          />
          <span className="font-display text-base font-semibold tracking-[-0.01em] text-paper md:text-lg">
            {PROFILE.name}
          </span>
          <span aria-hidden className="hidden h-4 w-px bg-paper/25 sm:block" />
          <span className="hidden text-sm text-paper/80 sm:inline md:text-base">{PROFILE.role}</span>
          <span className="rounded-full bg-ember px-3 py-1 font-mono text-[11px] font-medium uppercase tracking-[0.12em] text-ink">
            {YEARS_EXPERIENCE}+ years
          </span>
          <span className="sr-only sm:hidden">, {PROFILE.role}</span>
        </motion.p>

        <h1
          id="hero-title"
          className="font-display text-[clamp(3.25rem,min(14vw,19svh),11.5rem)] font-medium leading-[0.86] tracking-[-0.055em]"
        >
          <RevealLine delay={0.3}>Software for</RevealLine>
          <RevealLine delay={0.42}>
            <CaseWord caseId="ao" onPreview={setPreview}>
              Centre Court
            </CaseWord>
          </RevealLine>
          <RevealLine delay={0.54}>
            &amp; the{" "}
            <CaseWord caseId="agco" onPreview={setPreview}>
              cornfield.
            </CaseWord>
          </RevealLine>
        </h1>
        <span id="hero-case-hint" className="sr-only">
          Opens the related case study
        </span>

        <div className="mt-10 grid gap-8 md:mt-14 md:grid-cols-12 md:items-end">
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.9, duration: 0.9, ease: EASE }}
            className="max-w-md text-base leading-relaxed text-paper/70 md:col-span-6 md:text-lg"
          >
            From live Grand Slam scores to farm software that works with zero bars, I design and build React and React
            Native products that hold up under pressure.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.05, duration: 0.9, ease: EASE }}
            className="flex flex-wrap items-center gap-3 md:col-span-6 md:justify-end"
          >
            <Magnetic>
              <a
                href="#work"
                className="group inline-flex items-center gap-3 rounded-full bg-paper px-6 py-3.5 text-sm font-medium text-ink transition-colors hover:bg-ember"
              >
                See the work
                <ArrowDown className="h-4 w-4 transition-transform duration-300 group-hover:translate-y-0.5" aria-hidden />
              </a>
            </Magnetic>
            <Magnetic>
              <a
                href={PROFILE.assistant}
                className="inline-flex items-center gap-3 rounded-full border border-paper/20 px-6 py-3.5 text-sm font-medium text-paper transition-colors hover:border-ember hover:text-ember"
              >
                <MessageCircle className="h-4 w-4" aria-hidden />
                Ask my AI twin
              </a>
            </Magnetic>
          </motion.div>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.3, duration: 1 }}
        className="relative border-t border-paper/10"
      >
        <div className="mx-auto flex max-w-[1440px] items-center gap-6 px-5 py-4 sm:px-8 md:px-12">
          <p
            className="hidden shrink-0 items-center gap-2 font-mono text-[10px] uppercase tracking-[0.2em] text-paper/60 md:flex"
            aria-live="polite"
          >
            <span className={signalFound ? "text-ember" : "text-paper/60"} aria-hidden>
              ◉
            </span>
            Signal · {signalFound ? "locked" : "drifting"}
            <span aria-hidden className="text-paper/30">
              /
            </span>
            BLR {time}
          </p>
          <div className="relative min-w-0 flex-1 overflow-hidden [mask-image:linear-gradient(90deg,transparent,#000_12%,#000_88%,transparent)]">
            <p className="sr-only">Shipped for: {CLIENTS.join(", ")}</p>
            <div aria-hidden className="pf-marquee flex w-max gap-10">
              {[...CLIENTS, ...CLIENTS].map((c, i) => (
                <span key={i} className="flex items-center gap-10 whitespace-nowrap font-mono text-[11px] uppercase tracking-[0.2em] text-paper/50">
                  {c}
                  <span className="text-ember/70">✦</span>
                </span>
              ))}
            </div>
          </div>
        </div>
      </motion.div>

      <CursorPreview src={preview} />
    </section>
  );
}
