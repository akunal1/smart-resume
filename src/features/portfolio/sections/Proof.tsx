import { ArrowUpRight } from "lucide-react";
import { CERTIFICATIONS, MILESTONES } from "../data/content";
import { useExplorer } from "../state/explorer";
import { Reveal, SectionHeading, TiltCard } from "../components/primitives";

export function Proof() {
  const openCase = useExplorer((s) => s.openCase);

  return (
    <section id="proof" aria-labelledby="proof-title" className="relative px-5 py-28 sm:px-8 md:px-12 md:py-40">
      <div className="mx-auto max-w-[1440px]">
        <SectionHeading
          index="05"
          label="Proof"
          id="proof-title"
          aside="Milestones worth a second look, and the certifications behind the craft."
        >
          Receipts.
        </SectionHeading>

        <ul className="grid gap-5 md:grid-cols-3">
          {MILESTONES.map((m, i) => (
            <li key={m.title} className="[perspective:1000px]">
              <Reveal delay={i * 0.1} className="h-full">
                <TiltCard className="h-full">
                  <button
                    type="button"
                    onClick={() => openCase(m.caseId)}
                    aria-haspopup="dialog"
                    data-cursor="Open"
                    className="group relative flex h-full min-h-[340px] w-full flex-col justify-between overflow-hidden rounded-[28px] border border-paper/10 bg-gradient-to-b from-ink-3 to-ink-2 p-8 text-left transition-colors duration-500 hover:border-ember/40"
                  >
                    <span
                      aria-hidden
                      className="absolute -right-10 -top-10 h-48 w-48 rounded-full bg-ember/10 blur-3xl transition-opacity duration-700 md:opacity-0 md:group-hover:opacity-100"
                    />
                    <span className="relative flex items-start justify-between">
                      <span aria-hidden className="font-serif text-6xl italic leading-none text-ember md:text-7xl">
                        {m.mark}
                      </span>
                      <ArrowUpRight
                        className="h-5 w-5 text-paper/40 transition-all duration-500 group-hover:rotate-45 group-hover:text-ember"
                        aria-hidden
                      />
                    </span>
                    <span className="relative">
                      <span className="block font-display text-2xl font-medium leading-tight tracking-[-0.02em] md:text-3xl">
                        {m.title}
                      </span>
                      <span className="mt-3 block text-sm leading-relaxed text-paper/65">{m.body}</span>
                    </span>
                  </button>
                </TiltCard>
              </Reveal>
            </li>
          ))}
        </ul>

        <div className="mt-24 md:mt-32">
          <Reveal>
            <h3 className="mb-6 flex items-baseline justify-between font-mono text-xs uppercase tracking-[0.2em] text-paper/60">
              Certifications
              <span className="text-paper/40">{CERTIFICATIONS.length} total</span>
            </h3>
          </Reveal>
          <Reveal delay={0.1}>
            <table className="w-full border-collapse text-left">
              <thead className="sr-only">
                <tr>
                  <th scope="col">Year</th>
                  <th scope="col">Certification</th>
                  <th scope="col">Issuer</th>
                  <th scope="col">Credential ID</th>
                </tr>
              </thead>
              <tbody>
                {CERTIFICATIONS.map((c) => (
                  <tr
                    key={c.title}
                    className="group border-t border-paper/10 transition-colors duration-300 last:border-b hover:bg-paper/[0.03]"
                  >
                    <td className="w-16 py-5 pr-4 align-top font-mono text-xs text-paper/50 md:w-24">{c.year}</td>
                    <th scope="row" className="py-5 pr-4 font-normal">
                      <span className="block text-base text-paper transition-transform duration-500 group-hover:translate-x-1 md:text-lg">
                        {c.title}
                      </span>
                      <span className="mt-1 block text-xs text-paper/50 md:hidden">{c.issuer}</span>
                    </th>
                    <td className="hidden py-5 pr-4 text-sm text-paper/65 md:table-cell">{c.issuer}</td>
                    <td className="hidden py-5 text-right font-mono text-xs text-paper/45 md:table-cell">{c.id ?? "—"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
