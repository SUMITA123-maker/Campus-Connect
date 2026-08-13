import api from './axiosInstance';

export const uploadMedia = (eventId, file) => {
  const formData = new FormData();
  formData.append('file', file);
  return api.post(`/organizer/events/${eventId}/media`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
};

export const uploadStudentMedia = (eventId, file) => {
  const formData = new FormData();
  formData.append('file', file);
  return api.post(`/student/events/${eventId}/media`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
};

export const getPublicGallery = (eventId) =>
  api.get('/media/gallery', { params: { eventId } });
export const getOrganizerEventMedia = (eventId) =>
  api.get(`/organizer/events/${eventId}/media`);
export const getPendingMedia = () => api.get('/admin/media/pending');
export const getAdminMediaFile = (id) =>
  api.get(`/admin/media/${id}/file`, { responseType: 'blob' });
export const approveMedia = (id) => api.patch(`/admin/media/${id}/approve`);
export const rejectMedia = (id, remarks) =>
  api.patch(`/admin/media/${id}/reject`, null, { params: { remarks } });
