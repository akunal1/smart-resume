import { useEffect } from "react";
import { MotionConfig } from "framer-motion";
import { useExplorer } from "./state/explorer";
import { cx } from "./components/primitives";
import { Cursor } from "./components/Cursor";
import { CaseStudyDialog } from "./components/CaseStudyDialog";
import { Blueprint, Nav, ToastHost, TopBar } from "./components/Chrome";
import { Hero } from "./sections/Hero";
import { Manifesto } from "./sections/Manifesto";
import { Work } from "./sections/Work";
import { Journey } from "./sections/Journey";
import { Stack } from "./sections/Stack";
import { Proof } from "./sections/Proof";
import { Contact } from "./sections/Contact";

export default function PortfolioPage() {
  const blueprint = useExplorer((s) => s.blueprint);

  useEffect(() => {
    document.documentElement.classList.add("pf-html");
    return () => document.documentElement.classList.remove("pf-html");
  }, []);

  return (
    <MotionConfig reducedMotion="user">
      <div
        className={cx(
          "pf-root relative min-h-screen overflow-x-clip bg-ink font-display text-paper antialiased",
          blueprint && "pf-blueprint",
        )}
      >
        <a href="#main" className="pf-skip">
          Skip to content
        </a>
        <TopBar />
        <main id="main" tabIndex={-1} className="outline-none">
          <Hero />
          <Manifesto />
          <Work />
          <Journey />
          <Stack />
          <Proof />
          <Contact />
        </main>
        <Nav />
        <CaseStudyDialog />
        <ToastHost />
        <Blueprint />
        <Cursor />
        <div aria-hidden className="pf-grain pointer-events-none fixed inset-0 z-[100] opacity-[0.035]" />
      </div>
    </MotionConfig>
  );
}
