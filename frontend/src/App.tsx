import { useState } from 'react';
import { ConfigProvider, theme as antTheme } from 'antd';
import { AppSettingsProvider } from './context/AppSettingsContext';
import { useAppSettings } from './context/appSettingsStore';
import { MainLayout, } from './components/layout/MainLayout';
import type { ViewKey } from './components/layout/AppSidebar';
import { DashboardPage } from './pages/DashboardPage';
import { SearchScoresPage } from './pages/SearchScoresPage';
import { ReportsPage } from './pages/ReportsPage';
import { SettingsPage } from './pages/SettingsPage';

function AppContent() {
  const [activeView, setActiveView] = useState<ViewKey>('dashboard');
  const [drawerOpen, setDrawerOpen] = useState(false);
  const { resolvedTheme, setThemeMode } = useAppSettings();
  const isDark = resolvedTheme === 'dark';

  const selectView = (key: ViewKey) => {
    setActiveView(key);
    setDrawerOpen(false);
  };

  const content = {
    dashboard: <DashboardPage />,
    search: <SearchScoresPage />,
    reports: <ReportsPage />,
    settings: <SettingsPage />,
  }[activeView];

  return (
    <ConfigProvider
      theme={{
        algorithm: isDark ? antTheme.darkAlgorithm : antTheme.defaultAlgorithm,
        token: {
          colorPrimary: '#0f2573',
          borderRadius: 10,
          fontFamily: 'Rubik, system-ui, sans-serif',
        },
      }}
    >
      <MainLayout
        activeView={activeView}
        isDark={isDark}
        drawerOpen={drawerOpen}
        onOpenDrawer={() => setDrawerOpen(true)}
        onCloseDrawer={() => setDrawerOpen(false)}
        onSelectView={selectView}
        onToggleTheme={() => setThemeMode(isDark ? 'light' : 'dark')}
      >
        {content}
      </MainLayout>
    </ConfigProvider>
  );
}

function App() {
  return (
    <AppSettingsProvider>
      <AppContent />
    </AppSettingsProvider>
  );
}

export default App;
