import { useCallback, useEffect, useState } from 'react';
import {
  getTopGroup,
  type ExamGroupCode,
  type ExamGroupTopResponse,
} from '../services/scoresApi';

export function useTopGroupA(group: ExamGroupCode) {
  const [data, setData] = useState<ExamGroupTopResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const reload = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      setData(await getTopGroup(group));
    } catch {
      setError('Could not load the Group A leaderboard.');
    } finally {
      setLoading(false);
    }
  }, [group]);

  useEffect(() => {
    void reload();
  }, [reload]);

  return { data, loading, error, reload };
}
