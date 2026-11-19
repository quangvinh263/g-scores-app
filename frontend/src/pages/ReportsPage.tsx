import { Alert, Button } from 'antd';
import { ReloadOutlined } from '@ant-design/icons';
import { useScoreReport } from '../hooks/useScoreReport';
import { PageHeading } from '../components/PageHeading';
import { ScoreLevelChart } from '../components/reports/ScoreLevelChart';

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

      <ScoreLevelChart data={data} loading={loading} />
    </div>
  );
}
