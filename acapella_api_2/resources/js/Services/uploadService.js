import apiService, { extractData } from './apiService';

const multipartHeaders = {
    'Content-Type': 'multipart/form-data',
};

const uploadService = {
    async createChoir(payload) {
        const response = await apiService.post('/choirs', payload, { headers: multipartHeaders });
        return extractData(response);
    },

    async updateChoir(id, payload) {
        payload.append('_method', 'PUT');
        const response = await apiService.post(`/choirs/${id}`, payload, { headers: multipartHeaders });
        return extractData(response);
    },

    async createAlbum(payload) {
        const response = await apiService.post('/albums', payload, { headers: multipartHeaders });
        return extractData(response);
    },

    async updateAlbum(id, payload) {
        payload.append('_method', 'PUT');
        const response = await apiService.post(`/albums/${id}`, payload, { headers: multipartHeaders });
        return extractData(response);
    },

    async createTrack(payload) {
        const response = await apiService.post('/tracks', payload, { headers: multipartHeaders });
        return extractData(response);
    },

    async updateTrack(id, payload) {
        payload.append('_method', 'PUT');
        const response = await apiService.post(`/tracks/${id}`, payload, { headers: multipartHeaders });
        return extractData(response);
    },
};

export default uploadService;
