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
import { SUBJECT_LABELS } from '../../constants/subjects';

const chartLabelByName: Record<string, string> = {
  [SUBJECT_LABELS.toan]: 'Math',
  [SUBJECT_LABELS.ngu_van]: 'Literature',
  [SUBJECT_LABELS.ngoai_ngu]: 'Foreign',
  [SUBJECT_LABELS.vat_li]: 'Physics',
  [SUBJECT_LABELS.hoa_hoc]: 'Chemistry',
  [SUBJECT_LABELS.sinh_hoc]: 'Biology',
  [SUBJECT_LABELS.lich_su]: 'History',
  [SUBJECT_LABELS.dia_li]: 'Geography',
  [SUBJECT_LABELS.gdcd]: 'Civic Ed',
};

export function ScoreLevelChart({
  data,
  loading,
}: {
  data: LevelReportItem[];
  loading: boolean;
}) {
  return (
    <Card className="w-full rounded-2xl shadow-[0_10px_30px_rgba(15,37,115,0.06)]">
      {loading ? (
        <div className="flex h-96 items-center justify-center">
          <Spin size="large" />
        </div>
      ) : (
        <div className="w-full overflow-x-auto">
          <div className="h-[440px] min-w-[820px] md:h-[420px] md:w-full md:min-w-0">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data} margin={{ top: 10, right: 10, left: 8, bottom: 74 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e8edf4" />
                <XAxis
                  dataKey="name"
                  interval={0}
                  height={86}
                  tickMargin={12}
                  angle={-32}
                  textAnchor="end"
                  tickFormatter={(value: string) => chartLabelByName[value] ?? value}
                  tick={{ fontSize: 11 }}
                />
                <YAxis
                  width={72}
                  tick={{ fontSize: 12 }}
                  tickFormatter={(value: number) =>
                    value >= 1000 ? `${Math.round(value / 1000)}k` : String(value)
                  }
                />
                <Tooltip />
                <Legend />
                <Bar dataKey="excellent" name=">= 8" fill="#22c55e" radius={[4, 4, 0, 0]} />
                <Bar dataKey="good" name="6 - <8" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                <Bar dataKey="average" name="4 - <6" fill="#f59e0b" radius={[4, 4, 0, 0]} />
                <Bar dataKey="weak" name="< 4" fill="#ef4444" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}
    </Card>
  );
}
