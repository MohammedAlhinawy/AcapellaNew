import apiService, { extractData } from './apiService';

/**
 * Track Service
 * Handles all track-related API calls
 */
const trackService = {
    /**
     * Get all tracks (public)
     */
    async getTracks(params = {}) {
        const response = await apiService.get('/tracks', { params });
        return extractData(response);
    },

    /**
     * Get a single track by ID (public)
     */
    async getTrack(trackId) {
        const response = await apiService.get(`/tracks/${trackId}`);
        return extractData(response);
    },

    /**
     * Create a new track (choir_manager, admin)
     */
    async createTrack(data) {
        const response = await apiService.post('/tracks', data);
        return extractData(response);
    },

    /**
     * Update a track (choir_manager, admin)
     */
    async updateTrack(trackId, data) {
        const response = await apiService.put(`/tracks/${trackId}`, data);
        return extractData(response);
    },

    /**
     * Delete a track (choir_manager, admin)
     */
    async deleteTrack(trackId) {
        const response = await apiService.delete(`/tracks/${trackId}`);
        return extractData(response);
    },

    /**
     * Like a track (authenticated)
     */
    async likeTrack(trackId) {
        const response = await apiService.post(`/tracks/${trackId}/like`);
        return extractData(response);
    },

    /**
     * Unlike a track (authenticated)
     */
    async unlikeTrack(trackId) {
        const response = await apiService.delete(`/tracks/${trackId}/like`);
        return extractData(response);
    },

    /**
     * Get related tracks (public)
     */
    async getRelatedTracks(trackId) {
        const response = await apiService.get(`/tracks/${trackId}/related`);
        return extractData(response);
    },

    /**
     * Get user's queue (authenticated)
     */
    async getQueue() {
        const response = await apiService.get('/queue');
        return extractData(response);
    },

    /**
     * Add track to queue (authenticated)
     */
    async addToQueue(trackId) {
        const response = await apiService.post(`/tracks/${trackId}/queue`);
        return extractData(response);
    },

    /**
     * Remove track from queue (authenticated)
     */
    async removeFromQueue(queueId) {
        const response = await apiService.delete(`/queue/${queueId}`);
        return extractData(response);
    },

    /**
     * Clear queue (authenticated)
     */
    async clearQueue() {
        const response = await apiService.delete('/queue');
        return extractData(response);
    },

    /**
     * Replace the queue with the given track order.
     * Used for shuffle and (future) drag-to-reorder.
     * @param {number[]} trackIds  ordered list of track ids
     */
    async reorderQueue(trackIds) {
        const response = await apiService.post('/queue/reorder', { track_ids: trackIds });
        return extractData(response);
    },
};

export default trackService;
