import { create } from "zustand";
import { persist } from "zustand/middleware";
import { ACHIEVEMENTS, type AchievementId, type CaseId } from "../data/content";

export interface Toast {
  key: number;
  title: string;
  body: string;
}

interface ExplorerState {
  unlocked: AchievementId[];
  openedCases: CaseId[];
  exploredTech: string[];
  activeCase: CaseId | null;
  blueprint: boolean;
  toast: Toast | null;
  unlock: (id: AchievementId) => void;
  openCase: (id: CaseId) => void;
  closeCase: () => void;
  exploreTech: (name: string) => void;
  setBlueprint: (on: boolean) => void;
  notify: (title: string, body: string) => void;
  dismissToast: () => void;
}

const COMPLETE_REQUIRES = ACHIEVEMENTS.filter((a) => a.id !== "complete").length;

export const useExplorer = create<ExplorerState>()(
  persist(
    (set, get) => ({
      unlocked: [],
      openedCases: [],
      exploredTech: [],
      activeCase: null,
      blueprint: false,
      toast: null,

      unlock: (id) => {
        const { unlocked, notify } = get();
        if (unlocked.includes(id)) return;
        const next = [...unlocked, id];
        set({ unlocked: next });
        const meta = ACHIEVEMENTS.find((a) => a.id === id);
        if (meta) notify(`Unlocked · ${meta.title}`, `${next.length} of ${ACHIEVEMENTS.length} discovered`);
        if (id !== "complete" && next.filter((a) => a !== "complete").length === COMPLETE_REQUIRES) {
          window.setTimeout(() => get().unlock("complete"), 1600);
        }
      },

      openCase: (id) => {
        const opened = get().openedCases.includes(id) ? get().openedCases : [...get().openedCases, id];
        set({ activeCase: id, openedCases: opened });
        get().unlock("case");
        if (opened.length >= 3) get().unlock("detective");
      },

      closeCase: () => set({ activeCase: null }),

      exploreTech: (name) => {
        const { exploredTech } = get();
        if (exploredTech.includes(name)) return;
        const next = [...exploredTech, name];
        set({ exploredTech: next });
        if (next.length >= 5) get().unlock("stack");
      },

      setBlueprint: (on) => {
        set({ blueprint: on });
        if (on) {
          get().notify("Blueprint mode", "Layout grid revealed. Press Esc to exit.");
          window.setTimeout(() => get().unlock("blueprint"), 1400);
        }
      },

      notify: (title, body) => set({ toast: { key: Date.now(), title, body } }),
      dismissToast: () => set({ toast: null }),
    }),
    {
      name: "an-portfolio-explorer",
      partialize: (s) => ({
        unlocked: s.unlocked,
        openedCases: s.openedCases,
        exploredTech: s.exploredTech,
      }),
    },
  ),
);
