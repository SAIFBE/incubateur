import { useCallback, useEffect, useState } from 'react';
import api from '../../services/api';

const unwrap = (response) => response.data?.data ?? response.data ?? [];

export default function useImpactMoments() {
  const [moments, setMoments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const refresh = useCallback(async () => {
    setLoading(true);
    setError('');

    try {
      const response = await api.get('/impact-moments');
      setMoments(unwrap(response));
    } catch (requestError) {
      setError(requestError.response?.data?.message || 'Impossible de charger les Moments d’impact.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  return { moments, loading, error, refresh };
}
