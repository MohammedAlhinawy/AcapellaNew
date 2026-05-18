import apiService, { extractData } from './apiService';

/**
 * Subscription Service
 * Handles all subscription-related API calls
 */
const subscriptionService = {
    /**
     * Initiate a subscription (protected)
     */
    async initiateSubscription(payload) {
        const response = await apiService.post('/subscriptions/initiate', payload);
        return extractData(response);
    },

    /**
     * Get subscription status (protected)
     */
    async getSubscriptionStatus() {
        const response = await apiService.get('/subscriptions/status');
        return extractData(response);
    },
};

export default subscriptionService;
