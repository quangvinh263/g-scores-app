import { useCallback, useEffect, useState } from 'react';
import { getLevelReport, type LevelReportItem } from '../services/scoresApi';

export function useScoreReport() {
  const [data, setData] = useState<LevelReportItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const reload = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      setData(await getLevelReport());
    } catch {
      setError('Could not load the score level report.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    let active = true;
    getLevelReport()
      .then((result) => {
        if (active) setData(result);
      })
      .catch(() => {
        if (active) setError('Could not load the score level report.');
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, []);

  return { data, loading, error, reload };
}
