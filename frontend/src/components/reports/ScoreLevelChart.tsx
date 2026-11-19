import { Card, Spin } from 'antd';
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
import type { LevelReportItem } from '../../services/scoresApi';

export function ScoreLevelChart({
  data,
  loading,
}: {
  data: LevelReportItem[];
  loading: boolean;
}) {
  return (
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
  );
}
