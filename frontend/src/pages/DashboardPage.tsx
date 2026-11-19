import { useState } from 'react';
import {
  Alert,
  Button,
  Card,
  Segmented,
  Statistic,
  Table,
  Tag,
  Typography,
} from 'antd';
import { ReloadOutlined, TrophyOutlined } from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';
import { useTopGroupA } from '../hooks/useTopGroupA';
import { useAppSettings } from '../context/appSettingsStore';
import type { ExamGroupCode, ExamGroupTopItem } from '../services/scoresApi';
import { PageHeading } from '../components/PageHeading';

const { Text } = Typography;

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
