import { useState } from 'react';
import {
  Alert,
  Button,
  Card,
  Segmented,
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
  const { settings } = useAppSettings();
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
          <div className="flex flex-col gap-2 sm:flex-row">
            <Segmented
              value={group}
              onChange={(value) => setGroup(value as ExamGroupCode)}
              options={ADMISSION_GROUPS.map((value) => ({
                label: value === 'A' ? 'Group A' : `Group ${value}`,
                value,
              }))}
            />
            <Button icon={<ReloadOutlined />} onClick={() => void reload()}>
              Refresh
            </Button>
          </div>
        }
      />

      <GroupStatsCards data={data} />

      {error && <Alert type="error" showIcon message={error} />}

      <Card
        title={
          <span className="font-semibold text-[#0f2573]">
            Top 10 - {data?.name ?? 'Group A'}
          </span>
        }
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
