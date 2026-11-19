import { Alert, Button, Card, Spin } from 'antd';
import { ReloadOutlined } from '@ant-design/icons';
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
import { useScoreReport } from '../hooks/useScoreReport';
import { PageHeading } from '../components/PageHeading';

export function ReportsPage() {
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
