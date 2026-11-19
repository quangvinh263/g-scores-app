import type { ReactNode } from 'react';
import {
  BarChartOutlined,
  CloseOutlined,
  DashboardOutlined,
  SearchOutlined,
  SettingOutlined,
} from '@ant-design/icons';
import { Typography } from 'antd';
import logoUrl from '../../assets/logo.png';

export type ViewKey =
  | 'dashboard'
  | 'search'
  | 'reports'
  | 'settings';

export interface MenuItem {
  key: ViewKey;
  label: string;
  icon: ReactNode;
}

const menuItems: MenuItem[] = [
  { key: 'dashboard', label: 'Dashboard', icon: <DashboardOutlined /> },
  { key: 'search', label: 'Search Scores', icon: <SearchOutlined /> },
  { key: 'reports', label: 'Reports', icon: <BarChartOutlined /> },
  { key: 'settings', label: 'Settings', icon: <SettingOutlined /> },
];

const { Text } = Typography;

interface AppSidebarProps {
  activeView: ViewKey;
  isDark: boolean;
  isMobile: boolean;
  open: boolean;
  onClose: () => void;
  onSelect: (key: ViewKey) => void;
}

export function AppSidebar({
  activeView,
  isDark,
  isMobile,
  open,
  onClose,
  onSelect,
}: AppSidebarProps) {
  const selectItem = (key: ViewKey) => {
    onSelect(key);
  };

  const menu = (
    <nav className="space-y-2">
      {menuItems.map((item) => (
        <button
          key={item.key}
          type="button"
          onClick={() => selectItem(item.key)}
          className={`flex w-full items-center gap-3 rounded-xl px-4 py-3 text-left transition ${
            activeView === item.key
              ? isDark
                ? 'bg-[#1d4ed8]/30 text-[#93c5fd] shadow-sm'
                : 'bg-[#e6ecff] text-[#0f2573] shadow-sm'
              : isDark
                ? 'text-slate-300 hover:bg-[#1f2937]'
                : 'text-[#334155] hover:bg-slate-100'
          }`}
        >
          <span className="text-lg">{item.icon}</span>
          <span className="font-medium">{item.label}</span>
        </button>
      ))}
    </nav>
  );

  return (
    <aside
      className={`fixed inset-y-0 left-0 z-50 w-64 px-4 pb-5 pt-0 shadow-[8px_0_24px_rgba(15,37,115,0.16)] transition-transform duration-200 lg:top-16 lg:z-30 lg:w-60 lg:p-5 ${
        isDark
          ? 'border-r border-slate-800 bg-[#111827]'
          : 'border-r border-slate-200 bg-white'
      } ${isMobile ? (open ? 'translate-x-0' : '-translate-x-full') : 'translate-x-0'}`}
    >
      {isMobile ? (
        <>
          <div className="flex h-16 items-center justify-between border-b border-slate-200/80 dark:border-slate-700">
            <div className="flex items-center gap-2">
              <img
                src={logoUrl}
                alt="G-Scores logo"
                className="h-9 w-9 rounded-lg object-contain"
              />
              <span className="font-bold text-[#0f2573] dark:text-slate-100">
                G-Scores
              </span>
            </div>
            <button
              type="button"
              aria-label="Close navigation"
              onClick={onClose}
              className={`flex h-9 w-9 items-center justify-center rounded-lg ${
                isDark
                  ? 'text-slate-300 hover:bg-slate-800'
                  : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              <CloseOutlined />
            </button>
          </div>
          <div className="pt-4">{menu}</div>
        </>
      ) : (
        <>
          <Text
            className={`mb-4 block px-2 text-xs font-semibold uppercase tracking-[0.18em] ${
              isDark ? 'text-slate-400' : 'text-slate-500'
            }`}
          >
            Menu
          </Text>
          {menu}
        </>
      )}
    </aside>
  );
}
