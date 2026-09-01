import { apiClient, ApiResponse } from './apiClient';

export interface CreateCommunityPayload {
  name: string;
  description: string;
  category: string;
  coverImage?: string;
  avatarImage?: string;
  privacy?: 'public' | 'private';
  location?: string;
}

export const communityApi = {
  getCommunities: (category?: string, search?: string, page = 1, limit = 20): Promise<ApiResponse<any[]>> => {
    return apiClient.get('/communities', { category, search, page, limit });
  },

  getCommunityById: (id: string): Promise<ApiResponse<any>> => {
    return apiClient.get(`/communities/${id}`);
  },

  createCommunity: (payload: CreateCommunityPayload): Promise<ApiResponse<any>> => {
    return apiClient.post('/communities', payload);
  },

  joinCommunity: (id: string): Promise<ApiResponse<any>> => {
    return apiClient.post(`/communities/${id}/join`);
  },

  leaveCommunity: (id: string): Promise<ApiResponse<null>> => {
    return apiClient.post(`/communities/${id}/leave`);
  },

  getMembers: (id: string, page = 1, limit = 30): Promise<ApiResponse<any[]>> => {
    return apiClient.get(`/communities/${id}/members`, { page, limit });
  },
};
