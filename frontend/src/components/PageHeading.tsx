import type { ReactNode } from 'react';
import { Typography } from 'antd';
import { useAppSettings } from '../context/appSettingsStore';

const { Text, Title } = Typography;

export function PageHeading({
  title,
  subtitle,
  action,
}: {
  title: string;
  subtitle: string;
  action?: ReactNode;
}) {
  const { resolvedTheme } = useAppSettings();

  return (
    <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
      <div>
        <Title
          level={3}
          style={{
            marginBottom: 4,
            color: resolvedTheme === 'dark' ? '#f8fafc' : '#172033',
          }}
        >
          {title}
        </Title>
        <Text type="secondary">{subtitle}</Text>
      </div>
      {action}
    </div>
  );
}
