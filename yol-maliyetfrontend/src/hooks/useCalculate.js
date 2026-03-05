import { useState, useCallback } from 'react';
import { calculateRoute } from '../services/api';

/**
 * Custom hook for route calculation API calls.
 * Manages loading, error, and data state.
 */
export function useCalculate() {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const calculate = useCallback(async (params) => {
        setLoading(true);
        setError(null);
        setData(null);

        try {
            const result = await calculateRoute(params);
            if (result.success) {
                setData(result.data);
            } else {
                setError(result.message || 'Bir hata oluştu.');
            }
        } catch (err) {
            if (err.response?.data?.message) {
                setError(err.response.data.message);
            } else if (err.code === 'ECONNABORTED') {
                setError('İstek zaman aşımına uğradı. Lütfen tekrar deneyin.');
            } else if (!err.response) {
                setError('Sunucuya bağlanılamıyor. Lütfen bağlantınızı kontrol edin.');
            } else {
                setError('Beklenmeyen bir hata oluştu. Lütfen tekrar deneyin.');
            }
        } finally {
            setLoading(false);
        }
    }, []);

    const reset = useCallback(() => {
        setData(null);
        setError(null);
        setLoading(false);
    }, []);

    return { data, loading, error, calculate, reset };
}
