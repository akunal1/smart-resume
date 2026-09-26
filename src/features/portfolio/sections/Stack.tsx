import { useState } from "react";
import * as Tabs from "@radix-ui/react-tabs";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowUpRight, Check } from "lucide-react";
import { CASES, CHAPTERS, STACK, TECH_COUNT, type Tech, type Tier } from "../data/content";
import { useExplorer } from "../state/explorer";
import { useMediaQuery } from "../hooks";
import { EASE, SectionHeading, cx } from "../components/primitives";

const TIER_LEVEL: Record<Tier, number> = { Core: 3, Shipped: 2, Exploring: 1 };
const TIER_COPY: Record<Tier, string> = {
  Core: "Daily driver",
  Shipped: "Used in production",
  Exploring: "Learning in public",
};

function Meter({ tier, large = false }: { tier: Tier; large?: boolean }) {
  return (
    <span aria-hidden className="flex items-end gap-[3px]">
      {[1, 2, 3].map((n) => (
        <span
          key={n}
          className={cx(
            "rounded-full transition-colors",
            large ? "w-1.5" : "w-1",
            n <= TIER_LEVEL[tier] ? "bg-ember" : "bg-paper/15",
          )}
          style={{ height: (large ? 8 : 5) + n * (large ? 5 : 3) }}
        />
      ))}
    </span>
  );
}

function TechDetail({ tech }: { tech: Tech }) {
  const openCase = useExplorer((s) => s.openCase);
  const cases = CASES.filter((c) => tech.cases.includes(c.id));
  const chapters = CHAPTERS.filter((ch) => ch.cases.some((id) => tech.cases.includes(id)));

  return (
    <motion.div
      key={tech.name}
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      transition={{ duration: 0.4, ease: EASE }}
    >
      <div className="flex items-center gap-3 font-mono text-[11px] uppercase tracking-[0.18em] text-paper/60">
        <Meter tier={tech.tier} large />
        {tech.tier} · {TIER_COPY[tech.tier]}
      </div>
      <p className="mt-6 font-display text-[clamp(2.2rem,4vw,3.5rem)] font-medium leading-none tracking-[-0.04em]">
        {tech.name}
      </p>
      <p className="mt-4 text-paper/70">{tech.note}</p>

      <p className="mt-10 font-mono text-[11px] uppercase tracking-[0.18em] text-paper/60">Where it shipped</p>
      {cases.length === 0 && !tech.alsoIn ? (
        <p className="mt-3 text-sm text-paper/60">Across client work and side projects.</p>
      ) : (
        <ul className="mt-3 space-y-2">
          {cases.map((c) => (
            <li key={c.id}>
              <button
                type="button"
                onClick={() => openCase(c.id)}
                aria-haspopup="dialog"
                className="group flex w-full items-center justify-between rounded-2xl border border-paper/10 px-4 py-3 text-left text-sm transition-colors hover:border-ember/50"
              >
                <span>
                  {c.title}
                  <span className="block text-xs text-paper/50">{c.client}</span>
                </span>
                <ArrowUpRight className="h-4 w-4 text-paper/50 transition-all group-hover:rotate-45 group-hover:text-ember" aria-hidden />
              </button>
            </li>
          ))}
          {tech.alsoIn && (
            <li className="rounded-2xl border border-dashed border-paper/15 px-4 py-3 text-sm text-paper/70">
              {tech.alsoIn} <span className="text-paper/40">· you're looking at it</span>
            </li>
          )}
        </ul>
      )}
      {chapters.length > 0 && (
        <p className="mt-6 text-xs text-paper/50">
          Chapters: {chapters.map((c) => `${c.country} ${c.years}`).join(" · ")}
        </p>
      )}
    </motion.div>
  );
}

export function Stack() {
  const [group, setGroup] = useState(STACK[0].id);
  const [selected, setSelected] = useState<Tech>(STACK[0].items[0]);
  const explored = useExplorer((s) => s.exploredTech);
  const exploreTech = useExplorer((s) => s.exploreTech);
  const wide = useMediaQuery("(min-width: 1024px)");

  const select = (tech: Tech) => {
    setSelected(tech);
    exploreTech(tech.name);
  };

  return (
    <section id="stack" aria-labelledby="stack-title" className="relative px-5 py-28 sm:px-8 md:px-12 md:py-40">
      <div className="mx-auto max-w-[1440px]">
        <SectionHeading
          index="04"
          label="Toolbox"
          id="stack-title"
          aside="Not a logo wall. Pick a discipline, then a tool, to see how deep it goes and where it actually shipped."
        >
          The stack, <span className="font-serif font-normal italic text-ember">in context.</span>
        </SectionHeading>

        <Tabs.Root
          value={group}
          onValueChange={(v) => {
            setGroup(v);
            const g = STACK.find((s) => s.id === v);
            if (g) setSelected(g.items[0]);
          }}
          orientation={wide ? "vertical" : "horizontal"}
          className="grid gap-8 lg:grid-cols-12 lg:gap-10"
        >
          <Tabs.List
            aria-label="Disciplines"
            className="pf-no-scrollbar -mx-5 flex gap-1 overflow-x-auto px-5 sm:-mx-8 sm:px-8 lg:col-span-3 lg:mx-0 lg:flex-col lg:overflow-visible lg:px-0"
          >
            {STACK.map((g) => {
              const active = g.id === group;
              const seen = g.items.filter((t) => explored.includes(t.name)).length;
              return (
                <Tabs.Trigger
                  key={g.id}
                  value={g.id}
                  className={cx(
                    "relative flex shrink-0 items-center justify-between gap-6 rounded-full px-4 py-2.5 text-left text-sm transition-colors lg:rounded-2xl lg:px-5 lg:py-3.5",
                    active ? "text-ink" : "text-paper/70 hover:text-paper",
                  )}
                >
                  {active && (
                    <motion.span
                      layoutId="stack-tab"
                      className="absolute inset-0 rounded-full bg-paper lg:rounded-2xl"
                      transition={{ type: "spring", stiffness: 400, damping: 36 }}
                    />
                  )}
                  <span className="relative whitespace-nowrap font-medium">{g.label}</span>
                  <span className="relative hidden font-mono text-[10px] opacity-60 lg:inline">
                    {seen}/{g.items.length}
                  </span>
                </Tabs.Trigger>
              );
            })}
          </Tabs.List>

          <div className="lg:col-span-5">
            {STACK.map((g) => (
              <Tabs.Content key={g.id} value={g.id} className="focus-visible:outline-none">
                <p className="mb-6 text-paper/65">{g.blurb}</p>
                <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-2">
                  {g.items.map((t, i) => {
                    const isSelected = selected.name === t.name;
                    const seen = explored.includes(t.name);
                    return (
                      <motion.li
                        key={t.name}
                        initial={{ opacity: 0, y: 14 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.45, delay: i * 0.04, ease: EASE }}
                      >
                        <button
                          type="button"
                          aria-pressed={isSelected}
                          onClick={() => select(t)}
                          className={cx(
                            "group flex h-full min-h-[112px] w-full flex-col justify-between rounded-2xl border p-4 text-left transition-all duration-300",
                            isSelected
                              ? "border-ember bg-ember/[0.08]"
                              : "border-paper/10 bg-ink-2 hover:-translate-y-0.5 hover:border-paper/30",
                          )}
                        >
                          <span className="flex w-full items-center justify-between">
                            <Meter tier={t.tier} />
                            {seen && <Check className="h-3.5 w-3.5 text-ember" aria-hidden />}
                          </span>
                          <span className="mt-6 block font-display text-lg font-medium leading-tight tracking-[-0.01em]">
                            {t.name}
                          </span>
                          <span className="sr-only">
                            , {t.tier}
                            {seen ? ", explored" : ""}
                          </span>
                        </button>
                      </motion.li>
                    );
                  })}
                </ul>
              </Tabs.Content>
            ))}
          </div>

          <aside
            aria-live="polite"
            aria-label="Technology details"
            className="rounded-[28px] border border-paper/10 bg-ink-2 p-7 lg:sticky lg:top-28 lg:col-span-4 lg:self-start"
          >
            <AnimatePresence mode="wait">
              <TechDetail key={selected.name} tech={selected} />
            </AnimatePresence>
            <div className="mt-10 border-t border-paper/10 pt-5">
              <div className="flex items-center justify-between font-mono text-[11px] uppercase tracking-[0.18em] text-paper/60">
                <span>Explored</span>
                <span>
                  {explored.length}/{TECH_COUNT}
                </span>
              </div>
              <div className="mt-3 h-1 overflow-hidden rounded-full bg-paper/10" aria-hidden>
                <motion.div
                  className="h-full origin-left rounded-full bg-ember"
                  animate={{ scaleX: explored.length / TECH_COUNT }}
                  transition={{ duration: 0.6, ease: EASE }}
                />
              </div>
            </div>
          </aside>
        </Tabs.Root>

        <p className="mt-8 flex flex-wrap gap-x-6 gap-y-2 font-mono text-[11px] uppercase tracking-[0.15em] text-paper/50">
          {(Object.keys(TIER_LEVEL) as Tier[]).map((t) => (
            <span key={t} className="flex items-center gap-2">
              <Meter tier={t} /> {t} · {TIER_COPY[t]}
            </span>
          ))}
        </p>
      </div>
    </section>
  );
}
