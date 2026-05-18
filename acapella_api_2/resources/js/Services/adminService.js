import apiService, { extractData } from './apiService';

/**
 * Admin Service
 * Handles all admin-specific API calls
 */
const adminService = {
    /**
     * Get admin dashboard stats (admin only)
     */
    async getDashboard() {
        const response = await apiService.get('/admin/dashboard');
        return extractData(response);
    },

    /**
     * Get all users for admin management (admin only)
     */
    async getUsers(params = {}) {
        const response = await apiService.get('/admin/users', { params });
        return extractData(response);
    },

    /**
     * Update user role (admin only)
     */
    async updateUserRole(userId, role) {
        const response = await apiService.post(`/admin/users/${userId}/role`, { role });
        return extractData(response);
    },

    /**
     * Verify a choir (admin only)
     */
    async verifyChoir(choirId) {
        const response = await apiService.post(`/admin/choirs/${choirId}/verify`);
        return extractData(response);
    },

    /**
     * Unverify a choir (admin only)
     */
    async unverifyChoir(choirId) {
        const response = await apiService.post(`/admin/choirs/${choirId}/unverify`);
        return extractData(response);
    },
};

export default adminService;
