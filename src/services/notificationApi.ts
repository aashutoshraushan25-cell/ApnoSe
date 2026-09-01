import { apiClient, ApiResponse } from './apiClient';

export const notificationApi = {
  getNotifications: (page = 1, limit = 30): Promise<ApiResponse<{ notifications: any[]; unreadCount: number }>> => {
    return apiClient.get('/notifications', { page, limit });
  },

  markAsRead: (id: string): Promise<ApiResponse<any>> => {
    return apiClient.patch(`/notifications/${id}/read`);
  },

  markAllAsRead: (): Promise<ApiResponse<null>> => {
    return apiClient.post('/notifications/read-all');
  },

  deleteNotification: (id: string): Promise<ApiResponse<null>> => {
    return apiClient.delete(`/notifications/${id}`);
  },
};
