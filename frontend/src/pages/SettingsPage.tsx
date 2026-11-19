import { useCallback, useEffect, useState } from 'react';
import { Badge, Button, Card, Segmented, Typography } from 'antd';
import { ReloadOutlined } from '@ant-design/icons';
import { useAppSettings } from '../context/appSettingsStore';
import type { ExamGroupCode } from '../services/scoresApi';
import { getTopGroup } from '../services/scoresApi';
import { PageHeading } from '../components/PageHeading';

const { Text } = Typography;

export function SettingsPage() {
  const { settings, resolvedTheme, setThemeMode, setDefaultGroup, resetSettings } =
    useAppSettings();
  const [apiStatus, setApiStatus] = useState<'checking' | 'online' | 'offline'>(
    'checking',
  );
  const [checking, setChecking] = useState(false);

  const checkBackend = useCallback(async () => {
    setChecking(true);
    setApiStatus('checking');
    try {
      await getTopGroup('A');
      setApiStatus('online');
    } catch {
      setApiStatus('offline');
    } finally {
      setChecking(false);
    }
  }, []);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      void checkBackend();
    }, 0);

    return () => window.clearTimeout(timer);
  }, [checkBackend]);

  return (
    <div className="space-y-5">
      <PageHeading
        title="Settings"
        subtitle="Application and data connection information."
      />
      <div className="grid gap-5 xl:grid-cols-2">
        <Card
          title="Theme Mode"
          className="rounded-2xl shadow-[0_10px_30px_rgba(15,37,115,0.06)]"
        >
          <Text type="secondary" className="mb-3 block">
            {settings.themeMode === 'system'
              ? `Following system preference (${resolvedTheme} mode)`
              : `${resolvedTheme === 'dark' ? 'Dark' : 'Light'} mode is active`}
          </Text>
          <Segmented
            block
            value={settings.themeMode}
            onChange={(value) =>
              setThemeMode(value as 'light' | 'dark' | 'system')
            }
            options={[
              { label: 'Light', value: 'light' },
              { label: 'Dark', value: 'dark' },
              { label: 'System', value: 'system' },
            ]}
          />
        </Card>

        <Card
          title="Default Admission Group"
          className="rounded-2xl shadow-[0_10px_30px_rgba(15,37,115,0.06)]"
        >
          <Text type="secondary" className="mb-3 block">
            Automatically selected when Dashboard is opened.
          </Text>
          <Segmented
            block
            value={settings.defaultGroup}
            onChange={(value) => setDefaultGroup(value as ExamGroupCode)}
            options={[
              { label: 'Group A', value: 'A' },
              { label: 'Group A01', value: 'A01' },
              { label: 'Group B', value: 'B' },
              { label: 'Group C', value: 'C' },
              { label: 'Group D01', value: 'D01' },
            ]}
          />
        </Card>
      </div>

      <Card
        title="System Information"
        className="max-w-8xl rounded-2xl shadow-[0_10px_30px_rgba(15,37,115,0.06)]"
      >
        <div className="grid gap-4 sm:grid-cols-2">
          <div
            className="rounded-xl p-4 transition-colors duration-300"
            style={{
              backgroundColor:
                resolvedTheme === 'dark' ? '#1f2937' : '#f8fafc',
              border: `1px solid ${
                resolvedTheme === 'dark' ? '#374151' : '#e2e8f0'
              }`,
            }}
          >
            <Text type="secondary" className="block">
              Dataset
            </Text>
            <Text strong>THPT 2024 — 1,061,605 records</Text>
          </div>
          <div
            className="rounded-xl p-4 transition-colors duration-300"
            style={{
              backgroundColor:
                resolvedTheme === 'dark' ? '#1f2937' : '#f8fafc',
              border: `1px solid ${
                resolvedTheme === 'dark' ? '#374151' : '#e2e8f0'
              }`,
            }}
          >
            <Text type="secondary" className="block">
              Backend API
            </Text>
            <div className="flex items-center justify-between gap-3">
              <Text strong>
                {import.meta.env.VITE_API_URL ?? 'http://localhost:3000/api'}
              </Text>
              {apiStatus === 'online' && (
                <Badge status="success" text="Connected" />
              )}
              {apiStatus === 'offline' && (
                <Badge status="error" text="Disconnected" />
              )}
              {apiStatus === 'checking' && (
                <Badge status="processing" text="Checking" />
              )}
            </div>
          </div>
        </div>

        <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <Text type="secondary">
            Restore theme and default admission group.
          </Text>
          <div className="flex gap-2">
            <Button
              icon={<ReloadOutlined />}
              loading={checking}
              onClick={() => void checkBackend()}
            >
              Check API
            </Button>
            <Button danger onClick={resetSettings}>
              Reset to Defaults
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
}
