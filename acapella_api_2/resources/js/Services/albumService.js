import apiService, { extractData } from './apiService';

/**
 * Album Service
 * Handles all album-related API calls
 */
const albumService = {
    /**
     * Get all albums (public)
     */
    async getAlbums(params = {}) {
        const response = await apiService.get('/albums', { params });
        return extractData(response);
    },

    /**
     * Get a single album by ID (public)
     */
    async getAlbum(albumId) {
        const response = await apiService.get(`/albums/${albumId}`);
        return extractData(response);
    },

    /**
     * Create a new album (choir_manager, admin)
     */
    async createAlbum(data) {
        const response = await apiService.post('/albums', data);
        return extractData(response);
    },

    /**
     * Update an album (choir_manager, admin)
     */
    async updateAlbum(albumId, data) {
        const response = await apiService.put(`/albums/${albumId}`, data);
        return extractData(response);
    },

    /**
     * Delete an album (choir_manager, admin)
     */
    async deleteAlbum(albumId) {
        const response = await apiService.delete(`/albums/${albumId}`);
        return extractData(response);
    },
};

export default albumService;
