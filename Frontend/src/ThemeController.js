import { create } from "zustand";
import { persist } from "zustand/middleware";

const getSystemTheme = () => {
  // Check if window and matchMedia are available (to avoid SSR issues)
  if (typeof window !== "undefined" && window.matchMedia) {
    return window.matchMedia("(prefers-color-scheme: dark)").matches
      ? "dark"
      : "light";
  }
  return "light";
};

export const useThemeStore = create(
  persist(
    (set) => ({
      mode: getSystemTheme(),

      toggleMode: () =>
        set((state) => ({
          mode: state.mode === "light" ? "dark" : "light",
        })),
    }),
    {
      name: "theme-mode-storage",
    },
  ),
);
