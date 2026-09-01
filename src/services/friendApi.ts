import { apiClient, ApiResponse } from './apiClient';

export const friendApi = {
  getFriends: (page = 1, limit = 20): Promise<ApiResponse<any[]>> => {
    return apiClient.get('/friends', { page, limit });
  },

  getRequests: (): Promise<ApiResponse<any[]>> => {
    return apiClient.get('/friends/requests');
  },

  getSuggestions: (): Promise<ApiResponse<any[]>> => {
    return apiClient.get('/friends/suggestions');
  },

  sendRequest: (userId: string): Promise<ApiResponse<null>> => {
    return apiClient.post(`/friends/${userId}/request`);
  },

  acceptRequest: (userId: string): Promise<ApiResponse<null>> => {
    return apiClient.post(`/friends/${userId}/accept`);
  },

  rejectRequest: (userId: string): Promise<ApiResponse<null>> => {
    return apiClient.post(`/friends/${userId}/reject`);
  },

  removeFriend: (userId: string): Promise<ApiResponse<null>> => {
    return apiClient.delete(`/friends/${userId}`);
  },
};
