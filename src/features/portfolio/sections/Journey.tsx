import { useLayoutEffect, useRef, useState } from "react";
import {
  motion,
  useMotionValue,
  useMotionValueEvent,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
} from "framer-motion";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import { CASES, CHAPTERS, type Chapter } from "../data/content";
import { useExplorer } from "../state/explorer";
import { useMediaQuery } from "../hooks";
import { Chip, Reveal, SectionHeading, cx } from "../components/primitives";

const INTRO = "Four chapters, three countries, one craft.";

function Flag({ code, className }: { code: Chapter["flag"]; className?: string }) {
  return (
    <img
      src={`/flags/${code}.svg`}
      alt=""
      width={36}
      height={24}
      loading="lazy"
      decoding="async"
      className={cx("shrink-0 rounded-[4px] object-cover ring-1 ring-paper/20", className)}
    />
  );
}

function RelatedCases({ chapter }: { chapter: Chapter }) {
  const openCase = useExplorer((s) => s.openCase);
  return (
    <div className="flex flex-wrap gap-2">
      {chapter.cases.map((id) => {
        const study = CASES.find((c) => c.id === id);
        if (!study) return null;
        return (
          <button
            key={id}
            type="button"
            onClick={() => openCase(id)}
            aria-haspopup="dialog"
            className="group inline-flex items-center gap-2 rounded-full bg-paper/[0.06] px-4 py-2 text-sm text-paper transition-colors hover:bg-ember hover:text-ink"
          >
            {study.title}
            <ArrowUpRight className="h-3.5 w-3.5 transition-transform group-hover:rotate-45" aria-hidden />
          </button>
        );
      })}
    </div>
  );
}

function ChapterBody({ chapter, index }: { chapter: Chapter; index: number }) {
  return (
    <>
      <div>
        <p className="flex items-center justify-between font-mono text-[11px] uppercase tracking-[0.18em] text-paper/60">
          <span>
            Chapter 0{index + 1} · {chapter.city}
          </span>
          <span>{chapter.utc}</span>
        </p>
        <p aria-hidden className="pf-outline mt-6 font-display text-[clamp(3.5rem,7vw,6.5rem)] font-semibold leading-none tracking-[-0.05em]">
          {chapter.years}
        </p>
        <h3 className="mt-2 flex items-center gap-4 font-display text-4xl font-medium tracking-[-0.03em] md:text-5xl">
          <span className="sr-only">{chapter.years}: </span>
          <Flag code={chapter.flag} className="h-7 w-[42px] md:h-8 md:w-12" />
          {chapter.country}
        </h3>
        <p className="mt-3 text-paper/80">
          <span className="text-paper">{chapter.company}</span>
          <span className="text-paper/40"> — </span>
          {chapter.role}
        </p>
        <p className="mt-5 max-w-prose text-sm leading-relaxed text-paper/65">{chapter.summary}</p>
        <ul className="mt-5 space-y-2 text-sm text-paper/75">
          {chapter.highlights.map((h) => (
            <li key={h} className="flex gap-3">
              <span aria-hidden className="mt-[0.55em] h-1 w-1 shrink-0 rounded-full bg-ember" />
              {h}
            </li>
          ))}
        </ul>
      </div>
      <div className="mt-8 space-y-4">
        <div className="flex flex-wrap gap-2">
          {chapter.stack.map((t) => (
            <Chip key={t}>{t}</Chip>
          ))}
        </div>
        <RelatedCases chapter={chapter} />
      </div>
    </>
  );
}

function HorizontalJourney() {
  const sectionRef = useRef<HTMLElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const distance = useMotionValue(0);
  const [height, setHeight] = useState<number | null>(null);
  const [active, setActive] = useState(-1);
  const unlock = useExplorer((s) => s.unlock);

  useLayoutEffect(() => {
    const measure = () => {
      const track = trackRef.current;
      if (!track) return;
      const d = Math.max(0, track.offsetWidth - document.documentElement.clientWidth);
      distance.set(d);
      setHeight(d + window.innerHeight);
    };
    measure();
    const ro = new ResizeObserver(measure);
    if (trackRef.current) ro.observe(trackRef.current);
    window.addEventListener("resize", measure);
    return () => {
      ro.disconnect();
      window.removeEventListener("resize", measure);
    };
  }, [distance]);

  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ["start start", "end end"] });
  const rawX = useTransform([scrollYProgress, distance], ([p, d]: number[]) => -p * d);
  const x = useSpring(rawX, { stiffness: 160, damping: 32, mass: 0.35 });
  const backdropX = useTransform(x, (v) => v * 0.35);

  useMotionValueEvent(scrollYProgress, "change", (v) => {
    const next = v < 0.12 ? -1 : Math.min(CHAPTERS.length - 1, Math.floor(((v - 0.12) / 0.88) * CHAPTERS.length));
    setActive(next);
    if (v > 0.97) unlock("globe");
  });

  return (
    <section
      ref={sectionRef}
      id="journey"
      aria-labelledby="journey-title"
      className="relative"
      style={{ height: height ?? "400vh" }}
    >
      <div className="sticky top-0 flex h-screen flex-col overflow-hidden">
        <motion.p
          aria-hidden
          style={{ x: backdropX }}
          className="pf-outline pointer-events-none absolute -bottom-[3vw] left-0 whitespace-nowrap font-display text-[24vw] font-semibold leading-none tracking-[-0.06em] opacity-60"
        >
          India · Australia · Germany · India
        </motion.p>

        <div className="relative mx-auto w-full max-w-[1440px] px-12 pt-28">
          <div className="flex items-center gap-6">
            <p className="flex shrink-0 items-center gap-3 font-mono text-xs uppercase tracking-[0.2em] text-paper/60">
              <span className="text-ember">03</span>
              <span className="h-px w-10 bg-paper/25" aria-hidden />
              Journey
            </p>
            <div className="relative h-px flex-1 bg-paper/15" aria-hidden>
              <motion.div style={{ scaleX: scrollYProgress }} className="absolute inset-0 origin-left bg-ember" />
            </div>
            <ol className="flex shrink-0 gap-5 font-mono text-[11px] uppercase tracking-[0.15em]" aria-label="Chapters">
              {CHAPTERS.map((c, i) => (
                <li
                  key={c.id}
                  aria-current={active === i ? "step" : undefined}
                  className={cx(
                    "flex items-center gap-2 transition-all duration-300",
                    active === i ? "text-ember" : "text-paper/40 [&>img]:opacity-50 [&>img]:grayscale",
                  )}
                >
                  <Flag code={c.flag} className="h-3 w-[18px] transition-all duration-300" />
                  {c.years}
                </li>
              ))}
            </ol>
          </div>
        </div>

        <motion.div ref={trackRef} style={{ x }} className="relative flex w-max flex-1 items-center gap-8 pl-12 pr-[12vw] will-change-transform">
          <div className="w-[34vw] max-w-[520px] shrink-0 pr-8">
            <h2 id="journey-title" className="font-display text-[clamp(2.5rem,4.8vw,4.75rem)] font-medium leading-[0.95] tracking-[-0.04em]">
              {INTRO}
            </h2>
            <p className="mt-6 flex items-center gap-3 font-mono text-xs uppercase tracking-[0.2em] text-paper/60">
              Keep scrolling to travel <ArrowRight className="h-4 w-4 text-ember" aria-hidden />
            </p>
          </div>
          {CHAPTERS.map((c, i) => (
            <article
              key={c.id}
              className={cx(
                "flex min-h-[min(60vh,560px)] w-[min(44vw,600px)] shrink-0 flex-col justify-between rounded-[28px] border p-9 transition-colors duration-700",
                active === i ? "border-ember/40 bg-ink-2" : "border-paper/10 bg-ink-2/85",
              )}
            >
              <ChapterBody chapter={c} index={i} />
            </article>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

function VerticalJourney() {
  const listRef = useRef<HTMLOListElement>(null);
  const unlock = useExplorer((s) => s.unlock);
  const { scrollYProgress } = useScroll({ target: listRef, offset: ["start 0.75", "end 0.6"] });

  return (
    <section id="journey" aria-labelledby="journey-title" className="relative px-5 py-28 sm:px-8 md:px-12">
      <div className="mx-auto max-w-[1440px]">
        <SectionHeading index="03" label="Journey" id="journey-title">
          {INTRO}
        </SectionHeading>
        <div className="relative pl-8">
          <span aria-hidden className="absolute bottom-0 left-[5px] top-0 w-px bg-paper/15" />
          <motion.span
            aria-hidden
            style={{ scaleY: scrollYProgress }}
            className="absolute bottom-0 left-[5px] top-0 w-px origin-top bg-ember"
          />
          <ol ref={listRef} className="relative space-y-6">
            {CHAPTERS.map((c, i) => (
              <motion.li
                key={c.id}
                className="relative"
                onViewportEnter={i === CHAPTERS.length - 1 ? () => unlock("globe") : undefined}
                viewport={{ once: true, amount: 0.6 }}
              >
                <span aria-hidden className="absolute -left-8 top-9 h-[11px] w-[11px] rounded-full border-2 border-ember bg-ink" />
                <Reveal>
                  <article className="rounded-[24px] border border-paper/10 bg-ink-2 p-6 sm:p-8">
                    <ChapterBody chapter={c} index={i} />
                  </article>
                </Reveal>
              </motion.li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}

export function Journey() {
  const wide = useMediaQuery("(min-width: 1024px) and (min-height: 640px)");
  const reduce = useReducedMotion();
  return wide && !reduce ? <HorizontalJourney /> : <VerticalJourney />;
}
