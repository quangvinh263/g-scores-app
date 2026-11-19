import { createContext, useContext } from 'react';
import type { ExamGroupCode } from '../services/scoresApi';

export type ThemeMode = 'light' | 'dark' | 'system';
export type ResolvedTheme = 'light' | 'dark';

export interface AppSettings {
  themeMode: ThemeMode;
  defaultGroup: ExamGroupCode;
}

export interface AppSettingsContextValue {
  settings: AppSettings;
  resolvedTheme: ResolvedTheme;
  setThemeMode: (themeMode: ThemeMode) => void;
  setDefaultGroup: (defaultGroup: ExamGroupCode) => void;
  resetSettings: () => void;
}

export const AppSettingsContext =
  createContext<AppSettingsContextValue | null>(null);

export function useAppSettings(): AppSettingsContextValue {
  const context = useContext(AppSettingsContext);
  if (!context) {
    throw new Error('useAppSettings must be used within AppSettingsProvider');
  }
  return context;
}
