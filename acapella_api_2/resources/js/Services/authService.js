import apiService, { STORAGE_KEYS, extractData } from './apiService';
import { db } from '../Utils/indexedDB';

const persistSession = async (payload) => {
    const data = payload?.data ?? payload;
    const token = data?.token;
    const user = data?.user_info || data?.user || data;

    if (token) {
        await db.set('auth', STORAGE_KEYS.AUTH_TOKEN, token);
    }

    if (user) {
        await db.set('auth', STORAGE_KEYS.USER_DATA, user);
    }

    return { token, user };
};

const authService = {
    async register(payload) {
        const response = await apiService.post('/auth/register', payload);
        return persistSession(extractData(response));
    },

    async login(credentials) {
        const response = await apiService.post('/auth/login', credentials);
        return persistSession(extractData(response));
    },

    async logout() {
        try {
            await apiService.post('/auth/logout');
        } finally {
            await db.delete('auth', STORAGE_KEYS.AUTH_TOKEN);
            await db.delete('auth', STORAGE_KEYS.USER_DATA);
        }
    },

    async me() {
        const response = await apiService.get('/auth/me');
        const user = extractData(response);
        await db.set('auth', STORAGE_KEYS.USER_DATA, user);
        return user;
    },

    async forgotPassword(email) {
        const response = await apiService.post('/auth/forgot-password', { email });
        return extractData(response);
    },

    async resetPassword(payload) {
        const response = await apiService.post('/auth/reset-password', payload);
        return extractData(response);
    },

    async getToken() {
        await db.init();
        return await db.get('auth', STORAGE_KEYS.AUTH_TOKEN);
    },

    async getCurrentUser() {
        await db.init();
        const user = await db.get('auth', STORAGE_KEYS.USER_DATA);
        return user || null;
    },

    async clearSession() {
        await db.delete('auth', STORAGE_KEYS.AUTH_TOKEN);
        await db.delete('auth', STORAGE_KEYS.USER_DATA);
    },
};

export default authService;
