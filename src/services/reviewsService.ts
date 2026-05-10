import { apiClient } from '../lib/apiClient';

export const reviewsService = {
  deleteReviewAsAdmin: (id: string) => apiClient.delete<null>(`/api/reviews/${id}/admin`),
};
