import type { ReactNode } from 'react';
import {
  BarChartOutlined,
  DashboardOutlined,
  SearchOutlined,
  SettingOutlined,
} from '@ant-design/icons';
import { Typography } from 'antd';

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
  onSelect: (key: ViewKey) => void;
}

export function AppSidebar({
  activeView,
  isDark,
  isMobile,
  onSelect,
}: AppSidebarProps) {
  const menu = (
    <nav className="space-y-2">
      {menuItems.map((item) => (
        <button
          key={item.key}
          type="button"
          onClick={() => onSelect(item.key)}
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

  if (isMobile) return menu;

  return (
    <aside
      className={`fixed bottom-0 left-0 top-16 z-30 w-60 p-5 shadow-[8px_0_24px_rgba(15,37,115,0.08)] ${
        isDark
          ? 'border-r border-slate-800 bg-[#111827]'
          : 'border-r border-slate-200 bg-white'
      }`}
    >
      <Text
        className={`mb-4 block px-2 text-xs font-semibold uppercase tracking-[0.18em] ${
          isDark ? 'text-slate-400' : 'text-slate-500'
        }`}
      >
        Menu
      </Text>
      {menu}
    </aside>
  );
}
