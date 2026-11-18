import { useCallback, useState } from 'react';
import { isAxiosError } from 'axios';
import { getScoreBySbd, type StudentScore } from '../services/scoresApi';

export function useScoreSearch() {
  const [data, setData] = useState<StudentScore | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const search = useCallback(async (sbd: string) => {
    const normalized = sbd.trim();
    if (!/^\d{8}$/.test(normalized)) {
      setData(null);
      setError('SBD must contain exactly 8 digits.');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      setData(await getScoreBySbd(normalized));
    } catch (requestError) {
      if (isAxiosError(requestError)) {
        if (requestError.response?.status === 404) {
          setError(`No score found for SBD ${normalized}.`);
        } else {
          setError(requestError.response?.statusText || 'Unable to connect to the server.');
        }
      } else {
        setError('An unexpected error occurred.');
      }
      setData(null);
    } finally {
      setLoading(false);
    }
  }, []);

  const clear = useCallback(() => {
    setData(null);
    setError(null);
  }, []);

  return { data, loading, error, search, clear };
}
