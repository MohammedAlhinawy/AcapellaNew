import apiService, { extractData } from './apiService';

/**
 * Choir Service
 * Handles all choir-related API calls
 */
const choirService = {
    /**
     * Get all choirs (public)
     */
    async getChoirs(params = {}) {
        const response = await apiService.get('/choirs', { params });
        return extractData(response);
    },

    /**
     * Get a single choir by ID (public)
     */
    async getChoir(choirId) {
        const response = await apiService.get(`/choirs/${choirId}`);
        return extractData(response);
    },

    /**
     * Create a new choir (choir_manager, admin)
     */
    async createChoir(data) {
        const response = await apiService.post('/choirs', data);
        return extractData(response);
    },

    /**
     * Update a choir (choir_manager, admin)
     */
    async updateChoir(choirId, data) {
        const response = await apiService.put(`/choirs/${choirId}`, data);
        return extractData(response);
    },

    /**
     * Delete a choir (choir_manager, admin)
     */
    async deleteChoir(choirId) {
        const response = await apiService.delete(`/choirs/${choirId}`);
        return extractData(response);
    },
};

export default choirService;
