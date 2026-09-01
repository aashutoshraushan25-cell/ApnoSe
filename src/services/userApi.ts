import { apiClient, ApiResponse } from './apiClient';

export interface UpdateUserPayload {
  name?: string;
  bio?: string;
  location?: string;
  language?: string;
  profilePhoto?: string;
  coverPhoto?: string;
  gender?: string;
  privacySettings?: any;
  encryptionEnabled?: boolean;
}

export const userApi = {
  getMe: (): Promise<ApiResponse<any>> => {
    return apiClient.get('/users/me');
  },

  updateMe: (payload: UpdateUserPayload): Promise<ApiResponse<any>> => {
    return apiClient.patch('/users/me', payload);
  },

  getUserById: (id: string): Promise<ApiResponse<any>> => {
    return apiClient.get(`/users/${id}`);
  },

  searchUsers: (q: string, page = 1, limit = 20): Promise<ApiResponse<any[]>> => {
    return apiClient.get('/users/search', { q, page, limit });
  },

  blockUser: (id: string, reason?: string): Promise<ApiResponse<null>> => {
    return apiClient.post(`/users/${id}/block`, { reason });
  },

  unblockUser: (id: string): Promise<ApiResponse<null>> => {
    return apiClient.delete(`/users/${id}/block`);
  },

  getBlockedUsers: (): Promise<ApiResponse<any[]>> => {
    return apiClient.get('/users/blocked');
  },
};
