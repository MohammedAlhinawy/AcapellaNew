import axios from 'axios';
import { db, STORAGE_KEYS } from '../Utils/indexedDB';

// Re-export STORAGE_KEYS so authService.js can import it from here
export { STORAGE_KEYS };

const apiService = axios.create({
    baseURL: '/api',
    headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
    },
});

apiService.interceptors.request.use(async (config) => {
    try {
        await db.init();
        const token = await db.get('auth', STORAGE_KEYS.AUTH_TOKEN);

        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
    } catch (error) {
        console.error('Error getting token from IndexedDB:', error);
    }

    return config;
});

apiService.interceptors.response.use(
    (response) => response,
    async (error) => {
        if (error.response?.status === 401) {
            try {
                await db.init();
                await db.delete('auth', STORAGE_KEYS.AUTH_TOKEN);
                await db.delete('auth', STORAGE_KEYS.USER_DATA);
            } catch (dbError) {
                console.error('Error clearing IndexedDB on 401:', dbError);
            }
        }

        return Promise.reject(error);
    },
);

export const extractData = (response) => response?.data?.data ?? response?.data;

export default apiService;
