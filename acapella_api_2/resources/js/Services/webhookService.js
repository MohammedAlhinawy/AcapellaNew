import apiService, { extractData } from './apiService';

/**
 * Webhook Service
 * Handles webhook-related API calls
 */
const webhookService = {
    /**
     * Mongike webhook handler (public, signature-verified)
     * This is for server-to-server communication with Mongike payment provider
     */
    async mongikeWebhook(payload, signature) {
        const response = await apiService.post('/webhooks/mongike', payload, {
            headers: {
                'X-Mongike-Signature': signature,
            },
        });
        return extractData(response);
    },
};

export default webhookService;
