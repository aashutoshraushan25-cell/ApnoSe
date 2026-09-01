import { apiClient, ApiResponse } from './apiClient';

export interface SendMessagePayload {
  content?: string;
  type?: 'text' | 'image' | 'video' | 'voice' | 'file';
  mediaUrl?: string;
  isEncrypted?: boolean;
}

export const messageApi = {
  getConversations: (): Promise<ApiResponse<any[]>> => {
    return apiClient.get('/conversations');
  },

  createOrGetConversation: (recipientId: string): Promise<ApiResponse<any>> => {
    return apiClient.post('/conversations', { recipientId });
  },

  getMessages: (conversationId: string, page = 1, limit = 40): Promise<ApiResponse<any[]>> => {
    return apiClient.get(`/conversations/${conversationId}/messages`, { page, limit });
  },

  sendMessage: (conversationId: string, payload: SendMessagePayload): Promise<ApiResponse<any>> => {
    return apiClient.post(`/conversations/${conversationId}/messages`, payload);
  },

  markRead: (conversationId: string): Promise<ApiResponse<null>> => {
    return apiClient.post(`/conversations/${conversationId}/read`);
  },

  deleteMessage: (messageId: string): Promise<ApiResponse<null>> => {
    return apiClient.delete(`/messages/${messageId}`);
  },
};
