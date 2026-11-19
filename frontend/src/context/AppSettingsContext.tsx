import {
  useEffect,
  useState,
  type ReactNode,
} from 'react';
import type { ExamGroupCode } from '../services/scoresApi';
import {
  AppSettingsContext,
  type AppSettings,
  type ResolvedTheme,
  type ThemeMode,
} from './appSettingsStore';

const STORAGE_KEY = 'g-scores-app-settings';

const DEFAULT_SETTINGS: AppSettings = {
  themeMode: 'system',
  defaultGroup: 'A',
};

function readSettings(): AppSettings {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) return DEFAULT_SETTINGS;

    const parsed = JSON.parse(stored) as Partial<AppSettings>;
    const themeMode =
      parsed.themeMode === 'light' ||
      parsed.themeMode === 'dark' ||
      parsed.themeMode === 'system'
        ? parsed.themeMode
        : 'system';
    const defaultGroup =
      parsed.defaultGroup &&
      ['A', 'A01', 'B', 'C', 'D01'].includes(parsed.defaultGroup)
        ? parsed.defaultGroup
        : 'A';

    return { themeMode, defaultGroup };
  } catch {
    return DEFAULT_SETTINGS;
  }
}

export function AppSettingsProvider({ children }: { children: ReactNode }) {
  const [settings, setSettings] = useState<AppSettings>(readSettings);
  const [systemDark, setSystemDark] = useState(
    () => window.matchMedia('(prefers-color-scheme: dark)').matches,
  );

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleChange = (event: MediaQueryListEvent) =>
      setSystemDark(event.matches);

    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
  }, [settings]);

  useEffect(() => {
    const resolvedTheme =
      settings.themeMode === 'system'
        ? systemDark
          ? 'dark'
          : 'light'
        : settings.themeMode;

    document.documentElement.dataset.theme = resolvedTheme;
  }, [settings.themeMode, systemDark]);

  const resolvedTheme: ResolvedTheme =
    settings.themeMode === 'system'
      ? systemDark
        ? 'dark'
        : 'light'
      : settings.themeMode;

  const setThemeMode = (themeMode: ThemeMode) => {
    setSettings((current) => ({ ...current, themeMode }));
  };

  const setDefaultGroup = (defaultGroup: ExamGroupCode) => {
    setSettings((current) => ({ ...current, defaultGroup }));
  };

  const resetSettings = () => {
    setSettings(DEFAULT_SETTINGS);
  };

  return (
    <AppSettingsContext.Provider
      value={{
        settings,
        resolvedTheme,
        setThemeMode,
        setDefaultGroup,
        resetSettings,
      }}
    >
      {children}
    </AppSettingsContext.Provider>
  );
}
