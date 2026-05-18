import apiService, { extractData } from './apiService';

/**
 * User Service
 * Handles all user-related API calls
 */
const userService = {
    /**
     * Get current authenticated user (protected)
     */
    async getMe() {
        const response = await apiService.get('/users/me');
        return extractData(response);
    },

    /**
     * Get all users (protected)
     */
    async getUsers(params = {}) {
        const response = await apiService.get('/users', { params });
        return extractData(response);
    },

    /**
     * Get a single user by ID (protected)
     */
    async getUser(userId) {
        const response = await apiService.get(`/users/${userId}`);
        return extractData(response);
    },

    /**
     * Update a user (protected)
     */
    async updateUser(userId, data) {
        const response = await apiService.put(`/users/${userId}`, data);
        return extractData(response);
    },

    /**
     * Delete a user (protected)
     */
    async deleteUser(userId) {
        const response = await apiService.delete(`/users/${userId}`);
        return extractData(response);
    },
};

export default userService;
