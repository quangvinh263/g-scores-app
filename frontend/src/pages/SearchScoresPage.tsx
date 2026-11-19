import { useState } from 'react';
import { Alert, Button, Card, Empty, Input, Spin, Tag, Typography } from 'antd';
import { SearchOutlined, UserOutlined } from '@ant-design/icons';
import { useScoreSearch } from '../hooks/useScoreSearch';
import { PageHeading } from '../components/PageHeading';

const { Text } = Typography;

const levelConfig = {
  excellent: { label: 'Excellent', color: '#22c55e', bg: '#dcfce7' },
  good: { label: 'Good', color: '#3b82f6', bg: '#dbeafe' },
  average: { label: 'Average', color: '#f59e0b', bg: '#fef3c7' },
  weak: { label: 'Weak', color: '#ef4444', bg: '#fee2e2' },
};

export function SearchScoresPage() {
  const [sbd, setSbd] = useState('');
  const { data, loading, error, search, clear } = useScoreSearch();

  const submit = () => void search(sbd);

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
