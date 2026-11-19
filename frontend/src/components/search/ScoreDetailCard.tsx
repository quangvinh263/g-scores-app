import { Card, Tag, Typography } from 'antd';
import type { ScoreSubject } from '../../services/scoresApi';
import { SCORE_LEVEL_CONFIG } from '../../constants/subjects';

const { Text } = Typography;

export function ScoreDetailCard({ subject }: { subject: ScoreSubject }) {
  const level = subject.level ? SCORE_LEVEL_CONFIG[subject.level] : null;

  return (
    <Card
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
            style={{ color: level.color, background: level.background }}
          >
            {level.label}
          </Tag>
        ) : (
          <Tag className="rounded-full">No score</Tag>
        )}
      </div>
    </Card>
  );
}
