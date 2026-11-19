import type { ReactNode } from 'react';
import { Drawer, Grid } from 'antd';
import { AppHeader } from './AppHeader';
import { AppSidebar, type ViewKey } from './AppSidebar';

interface MainLayoutProps {
  activeView: ViewKey;
  isDark: boolean;
  drawerOpen: boolean;
  onOpenDrawer: () => void;
  onCloseDrawer: () => void;
  onSelectView: (key: ViewKey) => void;
  onToggleTheme: () => void;
  children: ReactNode;
}

export function MainLayout({
  activeView,
  isDark,
  drawerOpen,
  onOpenDrawer,
  onCloseDrawer,
  onSelectView,
  onToggleTheme,
  children,
}: MainLayoutProps) {
  const screens = Grid.useBreakpoint();
  const isMobile = !screens.md;

  return (
    <div
      className={`min-h-screen transition-colors duration-300 ${
        isDark
          ? 'bg-[#0b0f19] text-slate-100'
          : 'bg-[#f1f5f9] text-[#172033]'
      }`}
    >
      <AppHeader
        isMobile={isMobile}
        isDark={isDark}
        onOpenMenu={onOpenDrawer}
        onToggleTheme={onToggleTheme}
      />

      <AppSidebar
        activeView={activeView}
        isDark={isDark}
        isMobile={isMobile}
        onSelect={onSelectView}
      />

      <Drawer
        placement="left"
        open={drawerOpen}
        onClose={onCloseDrawer}
        width={270}
        styles={{
          body: { background: isDark ? '#111827' : '#ffffff' },
          header: { background: isDark ? '#111827' : '#ffffff' },
        }}
        title={
          <span
            className={
              isDark
                ? 'font-semibold text-slate-100'
                : 'font-semibold text-[#0f2573]'
            }
          >
            G-Scores Menu
          </span>
        }
      >
        <AppSidebar
          activeView={activeView}
          isDark={isDark}
          isMobile
          onSelect={onSelectView}
        />
      </Drawer>

      <main className={`pt-16 ${isMobile ? '' : 'ml-60'}`}>
        <div className="mx-auto max-w-[1500px] p-4 sm:p-6 lg:p-8">
          {children}
        </div>
      </main>
    </div>
  );
}
