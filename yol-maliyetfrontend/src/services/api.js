import axios from 'axios';

const API_BASE = 'http://localhost:3000';

const api = axios.create({
    baseURL: API_BASE,
    headers: {
        'Content-Type': 'application/json',
    },
    timeout: 15000,
});

/**
 * Calculate route cost
 * @param {{ from: string, to: string, vehicleType: string, fuelConsumption?: number, fuelType?: string }} params
 * @returns {Promise<object>} API response data
 */
export async function calculateRoute(params) {
    const response = await api.post('/api/calculate', params);
    return response.data;
}

/**
 * Health check
 * @returns {Promise<object>}
 */
export async function healthCheck() {
    const response = await api.get('/api/health');
    return response.data;
}

export default api;
