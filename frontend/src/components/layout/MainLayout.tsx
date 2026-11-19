import type { ReactNode } from 'react';
import { Grid } from 'antd';
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
  const isMobile = !screens.lg;

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
        open={drawerOpen}
        onClose={onCloseDrawer}
        onSelect={onSelectView}
      />

      {isMobile && drawerOpen && (
        <button
          type="button"
          aria-label="Close navigation overlay"
          onClick={onCloseDrawer}
          className="fixed inset-0 z-40 bg-black/50"
        />
      )}

      <main className="pt-16 lg:ml-60">
        <div className="mx-auto max-w-[1500px] p-4 sm:p-6 lg:p-8">
          {children}
        </div>
      </main>
    </div>
  );
}
