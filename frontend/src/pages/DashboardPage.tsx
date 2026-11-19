import { useState } from 'react';
import {
  Alert,
  Button,
  Card,
  Table,
  Tag,
  Typography,
} from 'antd';
import { ReloadOutlined } from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';
import { useTopGroupA } from '../hooks/useTopGroupA';
import { useAppSettings } from '../context/appSettingsStore';
import type { ExamGroupCode, ExamGroupTopItem } from '../services/scoresApi';
import { PageHeading } from '../components/PageHeading';
import { GroupStatsCards } from '../components/dashboard/GroupStatsCards';
import { SUBJECT_LABELS, ADMISSION_GROUPS } from '../constants/subjects';

const { Text } = Typography;

export function DashboardPage() {
  const { settings, resolvedTheme } = useAppSettings();
  const [group, setGroup] = useState<ExamGroupCode>(settings.defaultGroup);
  const { data, loading, error, reload } = useTopGroupA(group);

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
      render: (sbd: string) => (
        <Text strong className="tracking-wide">
          {sbd}
        </Text>
      ),
    },
    ...subjects.map((subject) => ({
      title: SUBJECT_LABELS[subject.code] ?? subject.name,
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
          <div className="flex w-full flex-col gap-2 sm:w-auto sm:flex-row">
            <div className="grid w-full grid-cols-3 gap-2 sm:flex sm:w-auto">
              {ADMISSION_GROUPS.map((value) => {
                const label = value === 'A' ? 'Group A' : `Group ${value}`;
                const active = group === value;

                return (
                  <button
                    key={value}
                    type="button"
                    onClick={() => setGroup(value)}
                    className={`min-h-10 rounded-lg px-3 py-2 text-sm font-medium whitespace-nowrap transition ${
                      active
                        ? 'bg-[#0f2573] text-white shadow-sm'
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    {label}
                  </button>
                );
              })}
            </div>
            <Button
              icon={<ReloadOutlined />}
              onClick={() => void reload()}
              className="w-full sm:w-auto"
            >
              Refresh
            </Button>
          </div>
        }
      />

      <GroupStatsCards data={data} />

      {error && <Alert type="error" showIcon message={error} />}

      <div className="md:hidden">
        <Card
          title={
            <span className="font-semibold text-[#0f2573]">
              Top 10 - {data?.name ?? 'Group A'}
            </span>
          }
          className="w-full rounded-2xl shadow-[0_10px_30px_rgba(15,37,115,0.06)]"
        >
          {loading ? (
            <div className="py-8 text-center text-slate-500">Loading...</div>
          ) : (
            <div className="space-y-3">
              {top10.map((candidate) => (
                <div
                  key={candidate.sbd}
                  className="rounded-xl p-3"
                  style={{
                    border: `1px solid ${
                      resolvedTheme === 'dark' ? '#374151' : '#e2e8f0'
                    }`,
                    backgroundColor:
                      resolvedTheme === 'dark' ? '#111827' : '#ffffff',
                  }}
                >
                  <div className="flex items-center justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div
                        className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full font-bold ${
                          candidate.rank === 1
                            ? 'bg-amber-100 text-amber-600'
                            : candidate.rank === 2
                              ? 'bg-slate-200 text-slate-600'
                              : candidate.rank === 3
                                ? 'bg-orange-100 text-orange-700'
                                : 'bg-blue-50 text-[#0f2573]'
                        }`}
                      >
                        {candidate.rank}
                      </div>
                      <div>
                        <Text type="secondary" className="block text-xs">
                          Registration Number
                        </Text>
                        <Text strong className="tracking-wide">
                          {candidate.sbd}
                        </Text>
                      </div>
                    </div>
                    <Tag color="blue" className="m-0 rounded-full px-3 py-1 font-bold">
                      {candidate.total.toFixed(2)}
                    </Tag>
                  </div>
                  <div className="mt-3 grid grid-cols-3 gap-2">
                    {subjects.map((subject) => (
                      <div
                        key={subject.code}
                        className="rounded-lg px-2 py-2 text-center"
                        style={{
                          backgroundColor:
                            resolvedTheme === 'dark' ? '#1f2937' : '#f8fafc',
                          border: `1px solid ${
                            resolvedTheme === 'dark' ? '#374151' : '#e2e8f0'
                          }`,
                        }}
                      >
                        <Text type="secondary" className="block text-xs">
                          {SUBJECT_LABELS[subject.code] ?? subject.name}
                        </Text>
                        <Text strong>
                          {(candidate.scores[subject.code] ?? 0).toFixed(2)}
                        </Text>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </Card>
      </div>

      <Card
        title={
          <span className="font-semibold text-[#0f2573]">
            Top 10 - {data?.name ?? 'Group A'}
          </span>
        }
        className="hidden w-full rounded-2xl shadow-[0_10px_30px_rgba(15,37,115,0.06)] md:block"
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
