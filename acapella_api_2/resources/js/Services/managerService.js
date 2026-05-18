import apiService, { extractData } from './apiService';

/**
 * Choir Manager Service
 * Handles all choir manager-specific API calls
 * This service consolidates choir, album, and track operations for choir managers
 */
const managerService = {
    /**
     * Choir Management
     */
    async getMyChoirs() {
        const response = await apiService.get('/choirs', { params: { mine: true } });
        const data = extractData(response);
        // Handle paginated responses
        return Array.isArray(data) ? data : (data?.data ?? []);
    },

    async createChoir(data) {
        const response = await apiService.post('/choirs', data);
        return extractData(response);
    },

    async updateChoir(choirId, data) {
        const response = await apiService.put(`/choirs/${choirId}`, data);
        return extractData(response);
    },

    /**
     * Album Management
     */
    async getMyAlbums(choirId) {
        const response = await apiService.get('/albums', { params: { choir_id: choirId } });
        const data = extractData(response);
        return Array.isArray(data) ? data : (data?.data ?? []);
    },

    async getAlbumById(albumId) {
        const response = await apiService.get(`/albums/${albumId}`);
        const data = extractData(response);
        return data ?? {};
    },

    async createAlbum(data) {
        const response = await apiService.post('/albums', data);
        return extractData(response);
    },

    async updateAlbum(albumId, data) {
        const response = await apiService.put(`/albums/${albumId}`, data);
        return extractData(response);
    },

    async deleteAlbum(albumId) {
        const response = await apiService.delete(`/albums/${albumId}`);
        return extractData(response);
    },

    /**
     * Track Management
     */
    async getMyTracks(albumId) {
        const response = await apiService.get('/tracks', { params: { album_id: albumId } });
        const data = extractData(response);
        return Array.isArray(data) ? data : (data?.data ?? []);
    },

    async getMyTracksByChoir(choirId) {
        const response = await apiService.get('/tracks', { params: { choir_id: choirId } });
        const data = extractData(response);
        return Array.isArray(data) ? data : (data?.data ?? []);
    },

    async createTrack(data) {
        const response = await apiService.post('/tracks', data);
        return extractData(response);
    },

    async updateTrack(trackId, data) {
        const response = await apiService.put(`/tracks/${trackId}`, data);
        return extractData(response);
    },

    async deleteTrack(trackId) {
        const response = await apiService.delete(`/tracks/${trackId}`);
        return extractData(response);
    },
};

export default managerService;
