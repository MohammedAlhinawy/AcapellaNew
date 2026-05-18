import apiService, { extractData } from './apiService';

/**
 * Playlist Service
 * Handles all playlist-related API calls
 */
const playlistService = {
    /**
     * Get all playlists for the authenticated user
     */
    async getPlaylists() {
        const response = await apiService.get('/playlists');
        return extractData(response);
    },

    /**
     * Get a single playlist by ID
     */
    async getPlaylist(playlistId) {
        const response = await apiService.get(`/playlists/${playlistId}`);
        return extractData(response);
    },

    /**
     * Create a new playlist (authenticated)
     */
    async createPlaylist(data) {
        const response = await apiService.post('/playlists', data);
        return extractData(response);
    },

    /**
     * Update a playlist (authenticated)
     */
    async updatePlaylist(playlistId, data) {
        const response = await apiService.put(`/playlists/${playlistId}`, data);
        return extractData(response);
    },

    /**
     * Delete a playlist (authenticated)
     */
    async deletePlaylist(playlistId) {
        const response = await apiService.delete(`/playlists/${playlistId}`);
        return extractData(response);
    },

    /**
     * Add a track to a playlist (authenticated)
     */
    async addTrackToPlaylist(playlistId, trackId) {
        const response = await apiService.post(`/playlists/${playlistId}/tracks/${trackId}`);
        return extractData(response);
    },

    /**
     * Remove a track from a playlist (authenticated)
     */
    async removeTrackFromPlaylist(playlistId, trackId) {
        const response = await apiService.delete(`/playlists/${playlistId}/tracks/${trackId}`);
        return extractData(response);
    },
};

export default playlistService;
