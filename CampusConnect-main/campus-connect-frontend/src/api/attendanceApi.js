import api from './axiosInstance';

export const getAttendance = (eventId) =>
  api.get(`/organizer/events/${eventId}/attendance`);
export const markBulkAttendance = (eventId, data) =>
  api.post(`/organizer/events/${eventId}/attendance/bulk`, data);
export const uploadResults = (eventId, data) =>
  api.post(`/organizer/events/${eventId}/results`, data);
