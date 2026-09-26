import { useEffect, useRef } from "react";
import { animate, motion, useInView, useReducedMotion, useScroll, useTransform, type MotionValue } from "framer-motion";
import { PRINCIPLES, YEARS_EXPERIENCE } from "../data/content";
import { Reveal, Spotlight } from "../components/primitives";

const STORY =
  "I'm a techie who has shipped from *India,* *Australia* and *Germany:* the official *Australian* *Open* app, India's largest *indirect-tax* portal and, today, *offline-first* software that helps digitise *agriculture.*";

const STATS = [
  { value: YEARS_EXPERIENCE, suffix: "+", label: "Years shipping" },
  { value: 3, suffix: "", label: "Countries worked in" },
  { value: 6, suffix: "", label: "Flagship products" },
  { value: 10, suffix: "", label: "Certifications" },
];

function Word({ word, range, progress }: { word: string; range: [number, number]; progress: MotionValue<number> }) {
  const opacity = useTransform(progress, range, [0.14, 1]);
  const accent = word.startsWith("*");
  const text = word.replace(/\*/g, "");
  return (
    <motion.span style={{ opacity }} className={accent ? "font-serif italic text-ember" : undefined}>
      {text}{" "}
    </motion.span>
  );
}

const SCRUB_CLASS =
  "relative font-display text-[clamp(1.9rem,4.6vw,4.25rem)] font-normal leading-[1.08] tracking-[-0.03em] text-paper";

function ScrubTextAnimated({ words }: { words: string[] }) {
  const ref = useRef<HTMLParagraphElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 0.85", "end 0.5"] });
  return (
    <p ref={ref} className={SCRUB_CLASS}>
      {words.map((w, i) => (
        <Word key={i} word={w} progress={scrollYProgress} range={[i / words.length, (i + 1) / words.length]} />
      ))}
    </p>
  );
}

function ScrubText({ text }: { text: string }) {
  const reduce = useReducedMotion();
  const words = text.split(" ");

  if (!reduce) return <ScrubTextAnimated words={words} />;

  return (
    <p className={SCRUB_CLASS}>
      {words.map((w, i) => (
        <span key={i} className={w.startsWith("*") ? "font-serif italic text-ember" : undefined}>
          {w.replace(/\*/g, "")}{" "}
        </span>
      ))}
    </p>
  );
}

function Counter({ value, suffix }: { value: number; suffix: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "0px 0px -15% 0px" });
  const reduce = useReducedMotion();

  useEffect(() => {
    const node = ref.current;
    if (!inView || !node) return;
    if (reduce) {
      node.textContent = `${value}${suffix}`;
      return;
    }
    const controls = animate(0, value, {
      duration: 1.8,
      ease: [0.16, 1, 0.3, 1],
      onUpdate: (v) => (node.textContent = `${Math.round(v)}${suffix}`),
    });
    return () => controls.stop();
  }, [inView, reduce, value, suffix]);

  return (
    <span ref={ref} aria-hidden>
      0{suffix}
    </span>
  );
}

export function Manifesto() {
  return (
    <section id="about" aria-labelledby="about-title" className="relative px-5 pb-8 pt-28 sm:px-8 md:px-12 md:pb-12 md:pt-44">
      <div className="mx-auto max-w-[1440px]">
        <h2 id="about-title" className="mb-10 flex items-center gap-3 font-mono text-xs uppercase tracking-[0.2em] text-paper/60">
          <span className="text-ember">01</span>
          <span className="h-px w-10 bg-paper/25" aria-hidden />
          The short version
        </h2>

        <div className="md:w-[88%]">
          <ScrubText text={STORY} />
        </div>

        <dl className="mt-20 grid grid-cols-2 gap-px overflow-hidden rounded-3xl border border-paper/10 bg-paper/10 md:mt-28 md:grid-cols-4">
          {STATS.map((s, i) => (
            <Reveal key={s.label} delay={i * 0.08} className="flex flex-col bg-ink p-6 md:p-10">
              <dt className="order-2 mt-3 font-mono text-[11px] uppercase tracking-[0.18em] text-paper/60">{s.label}</dt>
              <dd className="font-display text-[clamp(2.75rem,6vw,5.5rem)] font-medium leading-none tracking-[-0.05em]">
                <span className="sr-only">
                  {s.value}
                  {s.suffix}
                </span>
                <Counter value={s.value} suffix={s.suffix} />
              </dd>
            </Reveal>
          ))}
        </dl>

        <div className="mt-24 md:mt-32">
          <Reveal>
            <h3 className="mb-10 font-mono text-xs uppercase tracking-[0.2em] text-paper/60">How I work</h3>
          </Reveal>
          <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {PRINCIPLES.map((p, i) => (
              <li key={p.title}>
                <Reveal delay={i * 0.08} className="h-full">
                  <Spotlight className="h-full rounded-3xl border border-paper/10 bg-ink-2 p-7 transition-colors duration-500 hover:border-paper/20">
                    <span className="font-mono text-xs text-ember">0{i + 1}</span>
                    <p className="mt-10 font-display text-2xl font-medium leading-tight tracking-[-0.02em]">{p.title}</p>
                    <p className="mt-4 text-sm leading-relaxed text-paper/65">{p.body}</p>
                  </Spotlight>
                </Reveal>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
