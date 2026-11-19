import { Button } from 'antd';
import { MenuOutlined, MoonOutlined, SunOutlined } from '@ant-design/icons';
import logoUrl from '../../assets/logo.png';

interface AppHeaderProps {
  isMobile: boolean;
  isDark: boolean;
  onOpenMenu: () => void;
  onToggleTheme: () => void;
}

export function AppHeader({
  isMobile,
  isDark,
  onOpenMenu,
  onToggleTheme,
}: AppHeaderProps) {
  return (
    <header
      className={`fixed inset-x-0 top-0 z-40 flex h-16 items-center ${
        isDark ? 'bg-[#0a153d]' : 'bg-[#0f2573]'
      } px-4 text-white shadow-lg sm:px-6`}
    >
      {isMobile && (
        <Button
          type="text"
          aria-label="Open navigation"
          icon={<MenuOutlined />}
          className="mr-2 text-white hover:bg-white/10 [&_.anticon]:text-white [&_.anticon>svg]:text-white"
          onClick={onOpenMenu}
        />
      )}
      <div className="flex items-center gap-3">
        <img
          src={logoUrl}
          alt="G-Scores logo"
          className="h-9 w-9 shrink-0 rounded-lg object-contain"
        />
        <div>
          <div className="text-lg font-bold leading-none">G-Scores</div>
          {!isMobile && (
            <div className="mt-1 text-xs text-blue-200">THPT 2024 Analytics</div>
          )}
        </div>
      </div>
      <Button
        type="text"
        shape="circle"
        aria-label={isDark ? 'Switch to Light mode' : 'Switch to Dark mode'}
        title={isDark ? 'Switch to Light mode' : 'Switch to Dark mode'}
        icon={isDark ? <SunOutlined /> : <MoonOutlined />}
        onClick={onToggleTheme}
        className="ml-auto text-white hover!text-white [&>span]:text-white [&_.anticon]:text-white"
      />
    </header>
  );
}
