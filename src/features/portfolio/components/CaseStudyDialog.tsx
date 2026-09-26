import { useEffect, useRef, useState } from "react";
import * as Dialog from "@radix-ui/react-dialog";
import { motion } from "framer-motion";
import { ArrowRight, X } from "lucide-react";
import { CASES, type CaseId, type CaseStudy } from "../data/content";
import { useExplorer } from "../state/explorer";
import { Chip, EASE } from "./primitives";

function Architecture({ nodes }: { nodes: string[] }) {
  return (
    <ol className="flex flex-col md:flex-row md:items-stretch" aria-label="Architecture flow">
      {nodes.map((node, i) => (
        <li key={node} className="flex flex-col md:flex-1 md:flex-row md:items-center">
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.12, duration: 0.5, ease: EASE }}
            className="rounded-2xl border border-paper/10 bg-ink-3 px-4 py-4 text-sm md:flex-1"
          >
            <span className="block font-mono text-[10px] text-ember">{String(i + 1).padStart(2, "0")}</span>
            <span className="mt-1 block text-paper/90">{node}</span>
          </motion.div>
          {i < nodes.length - 1 && (
            <motion.span
              aria-hidden
              initial={{ scale: 0 }}
              whileInView={{ scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.12 + 0.2, duration: 0.4, ease: EASE }}
              className="ml-6 h-5 w-px origin-top bg-ember/70 md:ml-0 md:h-px md:w-6 md:origin-left"
            />
          )}
        </li>
      ))}
    </ol>
  );
}

function CaseBody({ study, index }: { study: CaseStudy; index: number }) {
  const meta = [
    ["Client", study.client],
    ["Role", study.role],
    ["Platform", study.platform],
    ["Timeline", study.year],
  ];

  return (
    <motion.article
      key={study.id}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.35 }}
      className="px-5 pb-16 sm:px-8 md:px-14"
    >
      <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-paper/60">
        <span className="text-ember">Case {String(index + 1).padStart(2, "0")}</span> · {study.kind}
      </p>
      <Dialog.Title className="mt-5 font-display text-[clamp(2.5rem,7vw,6rem)] font-medium leading-[0.92] tracking-[-0.045em]">
        {study.title}
      </Dialog.Title>
      <Dialog.Description className="mt-6 max-w-3xl text-lg leading-relaxed text-paper/70 md:text-xl">
        {study.tagline}
      </Dialog.Description>

      <motion.div
        initial={{ clipPath: "inset(12% 12% 12% 12% round 28px)", opacity: 0.4 }}
        animate={{ clipPath: "inset(0% 0% 0% 0% round 28px)", opacity: 1 }}
        transition={{ duration: 1, ease: EASE, delay: 0.1 }}
        className="mt-12 overflow-hidden rounded-[28px] border border-paper/10 bg-ink-3"
      >
        <img src={study.image} alt={`${study.title} — product screenshot`} className="aspect-[16/8] w-full object-cover" decoding="async" />
      </motion.div>

      <dl className="mt-10 grid grid-cols-2 gap-6 border-y border-paper/10 py-8 md:grid-cols-4">
        {meta.map(([k, v]) => (
          <div key={k}>
            <dt className="font-mono text-[10px] uppercase tracking-[0.2em] text-paper/50">{k}</dt>
            <dd className="mt-2 text-sm text-paper/90">{v}</dd>
          </div>
        ))}
      </dl>

      <div className="mt-16 grid gap-12 md:grid-cols-2 md:gap-16">
        <section aria-labelledby={`${study.id}-problem`}>
          <h3 id={`${study.id}-problem`} className="font-mono text-xs uppercase tracking-[0.2em] text-ember">
            The problem
          </h3>
          <p className="mt-4 text-lg leading-relaxed text-paper/85">{study.problem}</p>
        </section>
        <section aria-labelledby={`${study.id}-approach`}>
          <h3 id={`${study.id}-approach`} className="font-mono text-xs uppercase tracking-[0.2em] text-ember">
            The approach
          </h3>
          <p className="mt-4 text-lg leading-relaxed text-paper/85">{study.approach}</p>
        </section>
      </div>

      <section aria-labelledby={`${study.id}-hard`} className="mt-20">
        <h3 id={`${study.id}-hard`} className="font-mono text-xs uppercase tracking-[0.2em] text-paper/60">
          The hard parts
        </h3>
        <ol className="mt-6 grid gap-4 md:grid-cols-3">
          {study.challenges.map((c, i) => (
            <motion.li
              key={c.title}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08, duration: 0.6, ease: EASE }}
              className="rounded-3xl border border-paper/10 bg-ink-3/60 p-6"
            >
              <span className="font-mono text-xs text-ember">0{i + 1}</span>
              <p className="mt-6 font-display text-xl font-medium tracking-[-0.01em]">{c.title}</p>
              <p className="mt-3 text-sm leading-relaxed text-paper/65">{c.body}</p>
            </motion.li>
          ))}
        </ol>
      </section>

      <section aria-labelledby={`${study.id}-arch`} className="mt-20">
        <h3 id={`${study.id}-arch`} className="mb-6 font-mono text-xs uppercase tracking-[0.2em] text-paper/60">
          How it fits together
        </h3>
        <Architecture nodes={study.architecture} />
      </section>

      <div className="mt-20 grid gap-12 md:grid-cols-2">
        <section aria-labelledby={`${study.id}-stack`}>
          <h3 id={`${study.id}-stack`} className="mb-5 font-mono text-xs uppercase tracking-[0.2em] text-paper/60">
            Stack
          </h3>
          <div className="flex flex-wrap gap-2">
            {study.stack.map((s) => (
              <Chip key={s}>{s}</Chip>
            ))}
          </div>
        </section>
        <section aria-labelledby={`${study.id}-outcome`}>
          <h3 id={`${study.id}-outcome`} className="mb-5 font-mono text-xs uppercase tracking-[0.2em] text-paper/60">
            Outcome
          </h3>
          <ul className="space-y-3">
            {study.outcome.map((o) => (
              <li key={o} className="flex gap-3 text-paper/85">
                <span aria-hidden className="mt-[0.6em] h-1.5 w-1.5 shrink-0 rounded-full bg-ember" />
                {o}
              </li>
            ))}
          </ul>
        </section>
      </div>
    </motion.article>
  );
}

export function CaseStudyDialog() {
  const activeCase = useExplorer((s) => s.activeCase);
  const openCase = useExplorer((s) => s.openCase);
  const closeCase = useExplorer((s) => s.closeCase);
  const scrollRef = useRef<HTMLDivElement>(null);
  // Keeps the last case rendered while the sheet animates out.
  const [mountedId, setMountedId] = useState<CaseId | null>(null);

  useEffect(() => {
    if (activeCase) setMountedId(activeCase);
    scrollRef.current?.scrollTo({ top: 0 });
  }, [activeCase]);

  const open = activeCase !== null;
  const index = CASES.findIndex((c) => c.id === (activeCase ?? mountedId));
  const study = index >= 0 ? CASES[index] : null;
  const next = CASES[(index + 1) % CASES.length];

  return (
    <Dialog.Root open={open} onOpenChange={(o) => !o && closeCase()}>
      {study && (
          <Dialog.Portal forceMount>
            <Dialog.Overlay asChild forceMount>
              <motion.div
                className="fixed inset-0 z-[80] bg-black/70 backdrop-blur-sm"
                initial={{ opacity: 0 }}
                animate={{ opacity: open ? 1 : 0 }}
                transition={{ duration: 0.4 }}
              />
            </Dialog.Overlay>
            <Dialog.Content asChild forceMount>
              <motion.div
                ref={scrollRef}
                className="pf-root fixed inset-x-0 bottom-0 top-3 z-[90] mx-auto max-w-6xl overflow-y-auto overscroll-contain rounded-t-[32px] border border-b-0 border-paper/10 bg-ink-2 font-display text-paper shadow-2xl shadow-black focus:outline-none md:top-8"
                initial={{ y: "100%" }}
                animate={{ y: open ? 0 : "100%" }}
                transition={open ? { type: "spring", damping: 34, stiffness: 280, mass: 0.9 } : { duration: 0.45, ease: [0.7, 0, 0.84, 0] }}
                onAnimationComplete={() => {
                  if (!useExplorer.getState().activeCase) setMountedId(null);
                }}
              >
                <div className="sticky top-0 z-10 flex items-center justify-between bg-gradient-to-b from-ink-2 from-60% to-transparent px-5 pb-8 pt-5 sm:px-8 md:px-14">
                  <span className="font-mono text-[11px] uppercase tracking-[0.2em] text-paper/50">
                    Case file {String(index + 1).padStart(2, "0")} / {String(CASES.length).padStart(2, "0")}
                  </span>
                  <Dialog.Close className="group flex items-center gap-2 rounded-full border border-paper/15 bg-ink-2 py-2 pl-4 pr-2 text-sm transition-colors hover:border-ember">
                    Close
                    <span className="grid h-7 w-7 place-items-center rounded-full bg-paper/10 transition-colors group-hover:bg-ember group-hover:text-ink">
                      <X className="h-3.5 w-3.5" aria-hidden />
                    </span>
                  </Dialog.Close>
                </div>

                <CaseBody key={study.id} study={study} index={index} />

                <div className="border-t border-paper/10 px-5 py-10 sm:px-8 md:px-14">
                  <button
                    type="button"
                    onClick={() => openCase(next.id)}
                    className="group flex w-full items-center justify-between gap-6 text-left"
                  >
                    <span>
                      <span className="block font-mono text-[11px] uppercase tracking-[0.2em] text-paper/50">Next case</span>
                      <span className="mt-2 block font-display text-3xl font-medium tracking-[-0.03em] transition-colors group-hover:text-ember md:text-5xl">
                        {next.title}
                      </span>
                    </span>
                    <span className="grid h-14 w-14 shrink-0 place-items-center rounded-full border border-paper/15 transition-all duration-500 group-hover:border-ember group-hover:bg-ember group-hover:text-ink">
                      <ArrowRight className="h-5 w-5" aria-hidden />
                    </span>
                  </button>
                </div>
              </motion.div>
            </Dialog.Content>
          </Dialog.Portal>
      )}
    </Dialog.Root>
  );
}
