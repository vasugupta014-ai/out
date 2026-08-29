"use client";

import { Monitor, Moon, Sun } from "lucide-react";
import { useShallow } from "zustand/react/shallow";

import { Button } from "@/components/ui/button";
import { usePreferencesStore } from "@/stores/preferences/preferences-provider";

import {
  ThemeToggler as ThemeTogglerPrimitive,
  type ThemeSelection,
  type Resolved,
} from "@/components/animate-ui/primitives/effects/theme-toggler";

const THEME_CYCLE = ["light", "dark", "system"] as const;

export function ThemeSwitcher() {
  const { themeMode, setPreference } = usePreferencesStore(
    useShallow((state) => ({
      themeMode: state.values.theme_mode,
      setPreference: state.setPreference,
    })),
  );

  const resolvedTheme: Resolved =
    themeMode === "system"
      ? typeof window !== "undefined" &&
        window.matchMedia("(prefers-color-scheme: dark)").matches
        ? "dark"
        : "light"
      : themeMode;
  const themeDirection =
    resolvedTheme === "light" ? "rtl" : "ltr";

  const getNextTheme = () => {
    const currentIndex = THEME_CYCLE.indexOf(themeMode);

    return THEME_CYCLE[(currentIndex + 1) % THEME_CYCLE.length];
  };

  return (
    <ThemeTogglerPrimitive
      theme={themeMode as ThemeSelection}
      resolvedTheme={resolvedTheme}
      setTheme={(theme) => {
        setPreference("theme_mode", theme);
      }}
      direction={themeDirection}
    >
      {({ toggleTheme }) => (
        <Button
          size="icon"
          onClick={() => {
            toggleTheme(getNextTheme());
          }}
          aria-label={`Current theme: ${themeMode}. Click to cycle themes`}
        >
          <Monitor className="hidden [html[data-theme-mode=system]_&]:block" />

          <Sun className="hidden dark:block [html[data-theme-mode=system]_&]:hidden" />

          <Moon className="block dark:hidden [html[data-theme-mode=system]_&]:hidden" />
        </Button>
      )}
    </ThemeTogglerPrimitive>
  );
}