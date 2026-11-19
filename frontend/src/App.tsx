import { useState, type ReactNode } from 'react';
import {
  Alert,
  Button,
  Card,
  ConfigProvider,
  Drawer,
  Empty,
  Input,
  Spin,
  Statistic,
  Table,
  Tag,
  Typography,
  Grid,
  Segmented,
} from 'antd';
import {
  BarChartOutlined,
  SearchOutlined,
  SettingOutlined,
  DashboardOutlined,
  MenuOutlined,
  TrophyOutlined,
  ReloadOutlined,
  UserOutlined,
} from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';
import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { useScoreSearch } from './hooks/useScoreSearch';
import { useScoreReport } from './hooks/useScoreReport';
import { useTopGroupA } from './hooks/useTopGroupA';
import type { ExamGroupCode, ExamGroupTopItem } from './services/scoresApi';

type ViewKey = 'dashboard' | 'search' | 'reports' | 'settings';

const { Text, Title } = Typography;

const levelConfig = {
  excellent: { label: 'Excellent', color: '#22c55e', bg: '#dcfce7' },
  good: { label: 'Good', color: '#3b82f6', bg: '#dbeafe' },
  average: { label: 'Average', color: '#f59e0b', bg: '#fef3c7' },
  weak: { label: 'Weak', color: '#ef4444', bg: '#fee2e2' },
};

function PageHeading({
  title,
  subtitle,
  action,
}: {
  title: string;
  subtitle: string;
  action?: ReactNode;
}) {
  return (
    <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
      <div>
        <Title level={3} style={{ marginBottom: 4, color: '#172033' }}>
          {title}
        </Title>
        <Text type="secondary">{subtitle}</Text>
      </div>
      {action}
    </div>
  );
}

function SearchScoresView() {
  const [sbd, setSbd] = useState('');
  const { data, loading, error, search, clear } = useScoreSearch();

  const submit = () => {
    void search(sbd);
  };

  return (
    <div className="space-y-5">
      <PageHeading
        title="Search Scores"
        subtitle="Look up a candidate's detailed subject scores."
      />

      <Card className="rounded-2xl shadow-[0_10px_30px_rgba(15,37,115,0.06)]">
        <div className="flex flex-col gap-3 sm:flex-row">
          <Input
            size="large"
            value={sbd}
            maxLength={8}
            inputMode="numeric"
            placeholder="Enter 8-digit registration number"
            prefix={<UserOutlined style={{ color: '#94a3b8' }} />}
            onChange={(event) => {
              setSbd(event.target.value.replace(/\D/g, '').slice(0, 8));
              if (error) clear();
            }}
            onPressEnter={submit}
            status={error ? 'error' : undefined}
          />
          <Button
            size="large"
            type="primary"
            icon={<SearchOutlined />}
            loading={loading}
            onClick={submit}
            className="sm:min-w-32"
          >
            Search
          </Button>
        </div>
        {error && (
          <Alert
            className="mt-4"
            type={error.startsWith('SBD') ? 'warning' : 'error'}
            showIcon
            message={error}
          />
        )}
      </Card>

      {loading && (
        <Card className="rounded-2xl text-center">
          <Spin size="large" tip="Loading candidate scores..." />
        </Card>
      )}

      {!loading && !error && !data && (
        <Card className="rounded-2xl">
          <Empty
            image={Empty.PRESENTED_IMAGE_SIMPLE}
            description="Enter an SBD to view results"
          />
        </Card>
      )}

      {!loading && data && (
        <div className="space-y-4">
          <Card className="rounded-2xl border-0 bg-linear-to-r from-[#0f2573] to-[#1d4ed8] text-white">
            <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <Text style={{ color: '#bfdbfe' }}>Registration Number</Text>
                <div className="text-2xl font-bold tracking-[0.12em]">{data.sbd}</div>
              </div>
              <Tag color="blue" className="w-fit rounded-full px-4 py-1">
                Foreign language: {data.ma_ngoai_ngu || 'N/A'}
              </Tag>
            </div>
          </Card>

          <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
            {data.subjects.map((subject) => {
              const level = subject.level ? levelConfig[subject.level] : null;
              return (
                <Card
                  key={subject.code}
                  className="rounded-2xl shadow-[0_8px_24px_rgba(15,37,115,0.06)]"
                  styles={{ body: { padding: 18 } }}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <Text type="secondary" className="block">
                        {subject.name}
                      </Text>
                      <div className="mt-1 text-3xl font-bold text-[#0f2573]">
                        {subject.score?.toFixed(2) ?? '—'}
                      </div>
                    </div>
                    {level ? (
                      <Tag
                        className="rounded-full border-0"
                        style={{ color: level.color, background: level.bg }}
                      >
                        {level.label}
                      </Tag>
                    ) : (
                      <Tag className="rounded-full">No score</Tag>
                    )}
                  </div>
                </Card>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

function ReportsView() {
  const { data, loading, error, reload } = useScoreReport();

  return (
    <div className="space-y-5">
      <PageHeading
        title="Score Levels"
        subtitle="Distribution of candidates by subject and score level."
        action={
          <Button icon={<ReloadOutlined />} onClick={() => void reload()}>
            Refresh
          </Button>
        }
      />

      {error && <Alert type="error" showIcon message={error} />}

      <Card className="rounded-2xl shadow-[0_10px_30px_rgba(15,37,115,0.06)]">
        {loading ? (
          <div className="flex h-96 items-center justify-center">
            <Spin size="large" />
          </div>
        ) : (
          <div className="h-[420px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data} margin={{ top: 10, right: 10, left: 8, bottom: 10 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e8edf4" />
                <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                <YAxis width={64} tick={{ fontSize: 12 }} />
                <Tooltip />
                <Legend />
                <Bar dataKey="excellent" name=">= 8" fill="#22c55e" radius={[4, 4, 0, 0]} />
                <Bar dataKey="good" name="6 - <8" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                <Bar dataKey="average" name="4 - <6" fill="#f59e0b" radius={[4, 4, 0, 0]} />
                <Bar dataKey="weak" name="< 4" fill="#ef4444" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}
      </Card>
    </div>
  );
}

function DashboardView() {
  const [group, setGroup] = useState<ExamGroupCode>('A');
  const { data, loading, error, reload } = useTopGroupA(group);

  const subjectLabels: Record<string, string> = {
    toan: 'Mathematics',
    ngu_van: 'Literature',
    ngoai_ngu: 'Foreign Language',
    vat_li: 'Physics',
    hoa_hoc: 'Chemistry',
    sinh_hoc: 'Biology',
    lich_su: 'History',
    dia_li: 'Geography',
    gdcd: 'Civic Education',
  };

  const subjects = data?.subjects ?? [];
  const top10 = data?.top10 ?? [];

  const columns: ColumnsType<ExamGroupTopItem> = [
    {
      title: 'Rank',
      dataIndex: 'rank',
      width: 76,
      render: (rank: number) => (
        <div
          className={`mx-auto flex h-9 w-9 items-center justify-center rounded-full font-bold ${
            rank === 1
              ? 'bg-amber-100 text-amber-600'
              : rank === 2
                ? 'bg-slate-200 text-slate-600'
                : rank === 3
                  ? 'bg-orange-100 text-orange-700'
                  : 'bg-blue-50 text-[#0f2573]'
          }`}
        >
          {rank}
        </div>
      ),
    },
    {
      title: 'Registration Number',
      dataIndex: 'sbd',
      render: (sbd: string) => <Text strong className="tracking-wide">{sbd}</Text>,
    },
    ...subjects.map((subject) => ({
      title: subjectLabels[subject.code] ?? subject.name,
      dataIndex: 'scores',
      align: 'right' as const,
      render: (scores: Record<string, number>) =>
        (scores[subject.code] ?? 0).toFixed(2),
    })),
    {
      title: 'Total',
      dataIndex: 'total',
      align: 'right',
      render: (value: number) => (
        <Tag color="blue" className="rounded-full px-3 py-1 font-bold">
          {value.toFixed(2)}
        </Tag>
      ),
    },
  ];

  return (
    <div className="space-y-5">
      <PageHeading
        title="Dashboard"
        subtitle={`Top-performing candidates in ${data?.name ?? 'Group A'}.`}
        action={
          <div className="flex flex-col gap-2 sm:flex-row">
            <Segmented
              value={group}
              onChange={(value) => setGroup(value as ExamGroupCode)}
              options={[
                { label: 'Group A', value: 'A' },
                { label: 'Group A01', value: 'A01' },
                { label: 'Group B', value: 'B' },
                { label: 'Group C', value: 'C' },
                { label: 'Group D01', value: 'D01' },
              ]}
            />
            <Button icon={<ReloadOutlined />} onClick={() => void reload()}>
              Refresh
            </Button>
          </div>
        }
      />

      <div className="grid gap-4 md:grid-cols-3">
        <Card className="rounded-2xl border-0 shadow-[0_10px_30px_rgba(15,37,115,0.07)]">
          <Statistic
            title="Combination Subjects"
            value={subjects.length}
            suffix="subjects"
          />
          <div className="mt-2 flex flex-wrap gap-1">
            {subjects.map((subject) => (
              <Tag key={subject.code} color="blue">
                {subjectLabels[subject.code] ?? subject.name}
              </Tag>
            ))}
          </div>
        </Card>
        <Card className="rounded-2xl border-0 shadow-[0_10px_30px_rgba(15,37,115,0.07)]">
          <Statistic
            title="Highest Score"
            value={data?.highest?.total ?? 0}
            precision={2}
            prefix={<TrophyOutlined />}
          />
          <Text type="secondary" className="mt-2 block">
            SBD: <Text strong>{data?.highest?.sbd ?? 'N/A'}</Text>
          </Text>
        </Card>
        <Card className="rounded-2xl border-0 shadow-[0_10px_30px_rgba(15,37,115,0.07)]">
          <Statistic
            title="Top 10 Average"
            value={data?.top10Average ?? 0}
            precision={2}
            suffix="points"
          />
        </Card>
      </div>

      {error && <Alert type="error" showIcon message={error} />}

      <Card
        title={<span className="font-semibold text-[#0f2573]">Top 10 - {data?.name ?? 'Group A'}</span>}
        className="rounded-2xl shadow-[0_10px_30px_rgba(15,37,115,0.06)]"
      >
        <Table
          rowKey="sbd"
          columns={columns}
          dataSource={top10}
          loading={loading}
          pagination={false}
          scroll={{ x: 720 }}
          locale={{ emptyText: 'No leaderboard data available' }}
        />
      </Card>
    </div>
  );
}

function SettingsView() {
  return (
    <div className="space-y-5">
      <PageHeading title="Settings" subtitle="Application and data connection information." />
      <Card className="max-w-2xl rounded-2xl shadow-[0_10px_30px_rgba(15,37,115,0.06)]">
        <div className="space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-4">
            <Text type="secondary">Backend API</Text>
            <Text strong>{import.meta.env.VITE_API_URL ?? 'http://localhost:3000/api'}</Text>
          </div>
          <div className="flex items-center justify-between">
            <Text type="secondary">Dataset</Text>
            <Tag color="green">THPT 2024</Tag>
          </div>
        </div>
      </Card>
    </div>
  );
}

const menuItems: Array<{
  key: ViewKey;
  label: string;
  icon: ReactNode;
}> = [
  { key: 'dashboard', label: 'Dashboard', icon: <DashboardOutlined /> },
  { key: 'search', label: 'Search Scores', icon: <SearchOutlined /> },
  { key: 'reports', label: 'Reports', icon: <BarChartOutlined /> },
  { key: 'settings', label: 'Settings', icon: <SettingOutlined /> },
];

function App() {
  const [activeView, setActiveView] = useState<ViewKey>('dashboard');
  const [drawerOpen, setDrawerOpen] = useState(false);
  const screens = Grid.useBreakpoint();
  const isMobile = !screens.md;

  const selectView = (key: ViewKey) => {
    setActiveView(key);
    setDrawerOpen(false);
  };

  const menu = (
    <nav className="space-y-2">
      {menuItems.map((item) => (
        <button
          key={item.key}
          type="button"
          onClick={() => selectView(item.key)}
          className={`flex w-full items-center gap-3 rounded-xl px-4 py-3 text-left transition ${
            activeView === item.key
              ? 'bg-white/20 text-white shadow-sm'
              : 'text-blue-100 hover:bg-white/10 hover:text-white'
          }`}
        >
          <span className="text-lg">{item.icon}</span>
          <span className="font-medium">{item.label}</span>
        </button>
      ))}
    </nav>
  );

  const content = {
    dashboard: <DashboardView />,
    search: <SearchScoresView />,
    reports: <ReportsView />,
    settings: <SettingsView />,
  }[activeView];

  return (
    <ConfigProvider
      theme={{
        token: {
          colorPrimary: '#0f2573',
          borderRadius: 10,
          fontFamily: 'Rubik, system-ui, sans-serif',
        },
      }}
    >
      <div className="min-h-screen bg-[#f3f6fb]">
        <header className="fixed inset-x-0 top-0 z-40 flex h-16 items-center bg-[#0f2573] px-4 text-white shadow-lg sm:px-6">
          {isMobile && (
            <Button
              type="text"
              aria-label="Open navigation"
              icon={<MenuOutlined />}
              className="mr-2 text-white hover!text-white"
              onClick={() => setDrawerOpen(true)}
            />
          )}
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center items-center justify-center rounded-xl bg-white/12 font-bold">
              G
            </div>
            <div>
              <div className="text-lg font-bold leading-none">G-Scores</div>
              {!isMobile && (
                <div className="mt-1 text-xs text-blue-200">THPT 2024 Analytics</div>
              )}
            </div>
          </div>
        </header>

        {!isMobile && (
          <aside className="fixed bottom-0 left-0 top-16 z-30 w-60 bg-linear-to-b from-[#0f2573] to-[#162d68] p-5">
            <Text className="mb-4 block px-2 text-xs font-semibold uppercase tracking-[0.18em] text-blue-200">
              Menu
            </Text>
            {menu}
          </aside>
        )}

        <Drawer
          placement="left"
          open={drawerOpen}
          onClose={() => setDrawerOpen(false)}
          width={270}
          title={<span className="font-semibold text-[#0f2573]">G-Scores Menu</span>}
        >
          {menu}
        </Drawer>

        <main
          className={`pt-16 ${isMobile ? '' : 'ml-60'}`}
        >
          <div className="mx-auto max-w-[1500px] p-4 sm:p-6 lg:p-8">
            {content}
          </div>
        </main>
      </div>
    </ConfigProvider>
  );
}

export default App;
