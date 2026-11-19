import { Card, Statistic, Tag, Typography } from 'antd';
import { TrophyOutlined } from '@ant-design/icons';
import type { ExamGroupTopResponse } from '../../services/scoresApi';
import { SUBJECT_LABELS } from '../../constants/subjects';

const { Text } = Typography;

export function GroupStatsCards({ data }: { data: ExamGroupTopResponse | null }) {
  const subjects = data?.subjects ?? [];

  return (
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
              {SUBJECT_LABELS[subject.code] ?? subject.name}
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
  );
}
