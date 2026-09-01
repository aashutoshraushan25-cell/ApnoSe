import { apiClient, ApiResponse } from './apiClient';

export interface RegisterPayload {
  name: string;
  email?: string;
  phone?: string;
  password: string;
  dateOfBirth: string;
  gender?: 'male' | 'female' | 'other' | 'prefer_not_to_say';
  location?: string;
  language?: string;
  profilePhoto?: string;
  encryptionEnabled?: boolean;
}

export interface AuthData {
  user: any;
  accessToken: string;
  refreshToken: string;
}

export const authApi = {
  register: (payload: RegisterPayload): Promise<ApiResponse<AuthData>> => {
    return apiClient.post<AuthData>('/auth/register', payload);
  },

  login: (identifier: string, password: string): Promise<ApiResponse<AuthData>> => {
    return apiClient.post<AuthData>('/auth/login', { identifier, password });
  },

  getMe: (): Promise<ApiResponse<any>> => {
    return apiClient.get('/auth/me');
  },

  logout: (): Promise<ApiResponse<null>> => {
    return apiClient.post('/auth/logout');
  },

  forgotPassword: (identifier: string): Promise<ApiResponse<any>> => {
    return apiClient.post('/auth/forgot-password', { identifier });
  },

  resetPassword: (identifier: string, otp: string, newPassword: string): Promise<ApiResponse<null>> => {
    return apiClient.post('/auth/reset-password', { identifier, otp, newPassword });
  },
};
