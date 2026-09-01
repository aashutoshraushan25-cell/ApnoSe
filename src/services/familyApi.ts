import { apiClient, ApiResponse } from './apiClient';

export interface AddFamilyPayload {
  memberId: string;
  relationship: string;
  customRelationName?: string;
}

export const familyApi = {
  getMembers: (): Promise<ApiResponse<any[]>> => {
    return apiClient.get('/family');
  },

  addMember: (payload: AddFamilyPayload): Promise<ApiResponse<any>> => {
    return apiClient.post('/family', payload);
  },

  updateMember: (id: string, payload: Partial<AddFamilyPayload>): Promise<ApiResponse<any>> => {
    return apiClient.patch(`/family/${id}`, payload);
  },

  removeMember: (id: string): Promise<ApiResponse<null>> => {
    return apiClient.delete(`/family/${id}`);
  },
};
