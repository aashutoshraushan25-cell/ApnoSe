import { apiClient, ApiResponse } from './apiClient';

export interface CreatePostPayload {
  content?: string;
  media?: string[];
  mediaType?: 'text' | 'image' | 'video' | 'audio';
  visibility?: 'public' | 'friends' | 'family' | 'private';
  location?: string;
  feeling?: string;
  isEncrypted?: boolean;
  encryptedData?: string;
}

export const postApi = {
  getFeed: (page = 1, limit = 20): Promise<ApiResponse<any[]>> => {
    return apiClient.get<any[]>('/posts/feed', { page, limit });
  },

  getPostById: (id: string): Promise<ApiResponse<any>> => {
    return apiClient.get(`/posts/${id}`);
  },

  createPost: (payload: CreatePostPayload): Promise<ApiResponse<any>> => {
    return apiClient.post('/posts', payload);
  },

  updatePost: (id: string, payload: Partial<CreatePostPayload>): Promise<ApiResponse<any>> => {
    return apiClient.patch(`/posts/${id}`, payload);
  },

  deletePost: (id: string): Promise<ApiResponse<null>> => {
    return apiClient.delete(`/posts/${id}`);
  },

  likePost: (id: string, reaction = 'like'): Promise<ApiResponse<{ reaction: string; isLiked: boolean }>> => {
    return apiClient.post(`/posts/${id}/like`, { reaction });
  },

  unlikePost: (id: string): Promise<ApiResponse<{ isLiked: boolean }>> => {
    return apiClient.delete(`/posts/${id}/like`);
  },

  sharePost: (id: string): Promise<ApiResponse<{ sharesCount: number }>> => {
    return apiClient.post(`/posts/${id}/share`);
  },

  getComments: (postId: string, page = 1, limit = 20): Promise<ApiResponse<any[]>> => {
    return apiClient.get(`/posts/${postId}/comments`, { page, limit });
  },

  addComment: (postId: string, content: string, parentId?: string): Promise<ApiResponse<any>> => {
    return apiClient.post(`/posts/${postId}/comments`, { content, parentId });
  },
};
