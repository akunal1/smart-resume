import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowUpRight, Check, Copy } from "lucide-react";
import { PROFILE } from "../data/content";
import { useExplorer } from "../state/explorer";
import { useLocalTime } from "../hooks";
import { Magnetic, RevealLine } from "../components/primitives";

const LINKS = [
  { label: "LinkedIn", href: PROFILE.linkedin, meta: "Say hello", external: true },
  { label: "GitHub", href: PROFILE.github, meta: "Read the code", external: true },
  { label: "Ask my AI twin", href: PROFILE.assistant, meta: "Available 24/7", external: false },
  { label: "Résumé", href: PROFILE.resume, meta: "PDF", external: false, download: "Avinash_Nayak_Resume.pdf" },
  { label: "Website", href: PROFILE.website, meta: "avinashnayak.in", external: true },
];

export function Contact() {
  const [copied, setCopied] = useState(false);
  const unlock = useExplorer((s) => s.unlock);
  const time = useLocalTime();

  const copyEmail = async () => {
    try {
      await navigator.clipboard.writeText(PROFILE.email);
      setCopied(true);
      unlock("contact");
      window.setTimeout(() => setCopied(false), 2400);
    } catch {
      window.location.href = `mailto:${PROFILE.email}`;
    }
  };

  return (
    <section id="contact" aria-labelledby="contact-title" className="relative overflow-hidden px-5 pb-32 pt-28 sm:px-8 md:px-12 md:pt-44">
      <div
        aria-hidden
        className="pointer-events-none absolute -bottom-1/3 left-1/2 h-[70vw] w-[70vw] -translate-x-1/2 rounded-full bg-ember/[0.07] blur-[120px]"
      />
      <div className="relative mx-auto max-w-[1440px]">
        <p className="mb-10 flex items-center gap-3 font-mono text-xs uppercase tracking-[0.2em] text-paper/60">
          <span className="text-ember">06</span>
          <span className="h-px w-10 bg-paper/25" aria-hidden />
          Connect
        </p>
        <h2
          id="contact-title"
          className="font-display text-[clamp(3rem,9.5vw,10rem)] font-medium leading-[0.88] tracking-[-0.055em]"
        >
          <RevealLine inView>Let's build</RevealLine>
          <RevealLine inView delay={0.08}>
            something that
          </RevealLine>
          <RevealLine inView delay={0.16}>
            <span className="font-serif font-normal italic text-ember">holds up.</span>
          </RevealLine>
        </h2>

        <div className="mt-16 grid gap-14 md:mt-24 md:grid-cols-12">
          <div className="md:col-span-7">
            <Magnetic strength={0.15} className="max-w-full">
              <button
                type="button"
                onClick={copyEmail}
                data-cursor={copied ? "Copied" : "Copy"}
                className="group flex max-w-full items-center gap-4 rounded-full border border-paper/20 py-3 pl-6 pr-3 text-left transition-colors hover:border-ember sm:gap-6 sm:pl-8"
              >
                <span className="truncate font-display text-lg tracking-[-0.01em] sm:text-2xl md:text-3xl">{PROFILE.email}</span>
                <span className="grid h-12 w-12 shrink-0 place-items-center rounded-full bg-paper text-ink transition-colors group-hover:bg-ember sm:h-14 sm:w-14">
                  <AnimatePresence mode="wait" initial={false}>
                    <motion.span
                      key={copied ? "done" : "copy"}
                      initial={{ scale: 0.4, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      exit={{ scale: 0.4, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      {copied ? <Check className="h-5 w-5" aria-hidden /> : <Copy className="h-5 w-5" aria-hidden />}
                    </motion.span>
                  </AnimatePresence>
                  <span className="sr-only">{copied ? "Email copied" : "Copy email address"}</span>
                </span>
              </button>
            </Magnetic>
            <p className="mt-6 text-sm text-paper/60">
              Prefer your mail app?{" "}
              <a
                href={`mailto:${PROFILE.email}`}
                onClick={() => unlock("contact")}
                className="text-paper underline decoration-paper/30 underline-offset-4 transition-colors hover:decoration-ember"
              >
                Write to me directly
              </a>
              . {PROFILE.availability}.
            </p>
            <p className="mt-2 font-mono text-[11px] uppercase tracking-[0.18em] text-paper/50">
              {PROFILE.location} · {time} IST
            </p>
          </div>

          <ul className="border-t border-paper/10 md:col-span-5">
            {LINKS.map((l) => (
              <li key={l.label} className="border-b border-paper/10">
                <a
                  href={l.href}
                  {...(l.external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                  {...(l.download ? { download: l.download } : {})}
                  className="group flex items-center justify-between gap-4 py-5"
                >
                  <span className="font-display text-xl font-medium tracking-[-0.01em] transition-transform duration-500 group-hover:translate-x-2 md:text-2xl">
                    {l.label}
                  </span>
                  <span className="flex items-center gap-3 font-mono text-[11px] uppercase tracking-[0.15em] text-paper/50">
                    {l.meta}
                    <ArrowUpRight className="h-4 w-4 transition-all duration-500 group-hover:rotate-45 group-hover:text-ember" aria-hidden />
                  </span>
                  {l.external && <span className="sr-only">(opens in a new tab)</span>}
                </a>
              </li>
            ))}
          </ul>
        </div>

        <footer className="mt-28 flex flex-col gap-3 border-t border-paper/10 pt-8 font-mono text-[11px] uppercase tracking-[0.15em] text-paper/45 md:mt-40 md:flex-row md:items-center md:justify-between">
          <span>© {new Date().getFullYear()} {PROFILE.name}</span>
          <span>Designed & engineered in Bengaluru · React · Framer Motion · Canvas</span>
          <span title="Cheat code">↑ ↑ ↓ ↓ ← → ← → B A</span>
        </footer>
      </div>
    </section>
  );
}
