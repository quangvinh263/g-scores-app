import { useCallback, useEffect, useState } from 'react';
import { getTopGroupA, type TopGroupAItem } from '../services/scoresApi';

export function useTopGroupA() {
  const [data, setData] = useState<TopGroupAItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const reload = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      setData(await getTopGroupA());
    } catch {
      setError('Could not load the Group A leaderboard.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void reload();
  }, [reload]);

  return { data, loading, error, reload };
}
