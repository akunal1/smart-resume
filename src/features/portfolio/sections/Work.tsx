import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { CASES, type CaseId, type CaseKind } from "../data/content";
import { useExplorer } from "../state/explorer";
import { useFinePointer } from "../hooks";
import { CursorPreview } from "../components/Cursor";
import { EASE, SectionHeading, cx } from "../components/primitives";

type Filter = "All" | CaseKind;
const FILTERS: Filter[] = ["All", "Mobile", "Web", "Research"];

export function Work() {
  const [filter, setFilter] = useState<Filter>("All");
  const [hovered, setHovered] = useState<CaseId | null>(null);
  const openCase = useExplorer((s) => s.openCase);
  const opened = useExplorer((s) => s.openedCases);
  const fine = useFinePointer();

  const list = CASES.filter((c) => filter === "All" || c.kind === filter);
  const preview = hovered ? (CASES.find((c) => c.id === hovered)?.image ?? null) : null;

  return (
    <section id="work" aria-labelledby="work-title" className="relative px-5 py-28 sm:px-8 md:px-12 md:py-40">
      <div className="mx-auto max-w-[1440px]">
        <SectionHeading
          index="02"
          label="Selected work"
          id="work-title"
          aside="Six products across sport, agriculture, government, commerce, energy and research. Each one is a case file: the problem, the approach, the hard parts and the result."
        >
          Case files
        </SectionHeading>

        <div role="group" aria-label="Filter case files" className="mb-6 flex flex-wrap items-center gap-2">
          {FILTERS.map((f) => {
            const count = f === "All" ? CASES.length : CASES.filter((c) => c.kind === f).length;
            const active = filter === f;
            return (
              <button
                key={f}
                type="button"
                aria-pressed={active}
                onClick={() => setFilter(f)}
                className={cx(
                  "relative rounded-full px-4 py-2 text-sm transition-colors",
                  active ? "text-ink" : "text-paper/70 hover:text-paper",
                )}
              >
                {active && (
                  <motion.span
                    layoutId="work-filter"
                    className="absolute inset-0 rounded-full bg-paper"
                    transition={{ type: "spring", stiffness: 400, damping: 34 }}
                  />
                )}
                <span className="relative">
                  {f}
                  <sup className="ml-1 font-mono text-[10px] opacity-60">{count}</sup>
                </span>
              </button>
            );
          })}
          <span className="ml-auto hidden font-mono text-[11px] uppercase tracking-[0.18em] text-paper/50 sm:block">
            {opened.length}/{CASES.length} opened
          </span>
        </div>

        <ul className="group/list border-t border-paper/10" onPointerLeave={() => setHovered(null)}>
          <AnimatePresence initial={false} mode="popLayout">
            {list.map((c) => {
              const index = String(CASES.indexOf(c) + 1).padStart(2, "0");
              const seen = opened.includes(c.id);
              return (
                <motion.li
                  key={c.id}
                  layout
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, transition: { duration: 0.2 } }}
                  transition={{ duration: 0.6, ease: EASE }}
                  className="border-b border-paper/10"
                >
                  <button
                    type="button"
                    onClick={() => openCase(c.id)}
                    onPointerEnter={() => setHovered(c.id)}
                    aria-haspopup="dialog"
                    data-cursor="Open"
                    className="group/row grid w-full grid-cols-12 items-center gap-x-4 gap-y-4 py-7 text-left transition-opacity duration-500 focus-visible:!opacity-100 group-hover/list:opacity-40 hover:!opacity-100 md:py-10"
                  >
                    <span className="col-span-2 self-start pt-2 font-mono text-xs text-paper/50 md:col-span-1">
                      {index}
                      {seen && (
                        <>
                          <span className="ml-2 text-ember" aria-hidden>
                            ●
                          </span>
                          <span className="sr-only">(opened)</span>
                        </>
                      )}
                    </span>
                    <span className="col-span-10 md:col-span-6">
                      <span className="block font-display text-[clamp(1.75rem,4.2vw,3.9rem)] font-medium leading-[0.95] tracking-[-0.035em] transition-transform duration-500 ease-out group-hover/row:translate-x-3">
                        {c.title}
                      </span>
                      <span className="mt-3 block text-sm text-paper/60">{c.client}</span>
                    </span>
                    <span className="hidden text-sm text-paper/60 md:col-span-3 md:block">{c.platform}</span>
                    <span className="col-span-10 col-start-3 flex items-center justify-between gap-4 md:col-span-2 md:col-start-auto md:justify-end">
                      <span className="font-mono text-[11px] uppercase tracking-[0.15em] text-paper/60">
                        {c.kind} · {c.year}
                      </span>
                      <span className="grid h-11 w-11 shrink-0 place-items-center rounded-full border border-paper/15 transition-all duration-500 group-hover/row:rotate-45 group-hover/row:border-ember group-hover/row:bg-ember group-hover/row:text-ink">
                        <ArrowUpRight className="h-4 w-4" aria-hidden />
                      </span>
                    </span>
                    {!fine && (
                      <span className="col-span-10 col-start-3 block overflow-hidden rounded-2xl border border-paper/10">
                        <img
                          src={c.image}
                          alt=""
                          loading="lazy"
                          decoding="async"
                          className="aspect-[16/9] w-full object-cover"
                        />
                      </span>
                    )}
                  </button>
                </motion.li>
              );
            })}
          </AnimatePresence>
        </ul>
      </div>
      <CursorPreview src={preview} />
    </section>
  );
}
