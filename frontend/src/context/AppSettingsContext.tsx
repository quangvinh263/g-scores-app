import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from 'react';
import type { ExamGroupCode } from '../services/scoresApi';

export type ThemeMode = 'light' | 'dark';

export interface AppSettings {
  themeMode: ThemeMode;
  defaultGroup: ExamGroupCode;
}

interface AppSettingsContextValue {
  settings: AppSettings;
  setThemeMode: (themeMode: ThemeMode) => void;
  setDefaultGroup: (defaultGroup: ExamGroupCode) => void;
  resetSettings: () => void;
}

const STORAGE_KEY = 'g-scores-app-settings';

const DEFAULT_SETTINGS: AppSettings = {
  themeMode: 'light',
  defaultGroup: 'A',
};

function readSettings(): AppSettings {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) return DEFAULT_SETTINGS;

    const parsed = JSON.parse(stored) as Partial<AppSettings>;
    const themeMode =
      parsed.themeMode === 'dark' ? 'dark' : 'light';
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

const AppSettingsContext = createContext<AppSettingsContextValue | null>(null);

export function AppSettingsProvider({ children }: { children: ReactNode }) {
  const [settings, setSettings] = useState<AppSettings>(readSettings);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
  }, [settings]);

  useEffect(() => {
    document.documentElement.dataset.theme = settings.themeMode;
  }, [settings.themeMode]);

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
      value={{ settings, setThemeMode, setDefaultGroup, resetSettings }}
    >
      {children}
    </AppSettingsContext.Provider>
  );
}

export function useAppSettings(): AppSettingsContextValue {
  const context = useContext(AppSettingsContext);
  if (!context) {
    throw new Error('useAppSettings must be used within AppSettingsProvider');
  }
  return context;
}
