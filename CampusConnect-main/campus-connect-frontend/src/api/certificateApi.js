import api from './axiosInstance';

export const getMyCertificates = () => api.get('/student/certificates');
export const downloadCertificate = (certId) =>
  api.get(`/student/certificates/${certId}/download`, { responseType: 'blob' });
export const verifyCertificate = (certId) =>
  api.patch(`/admin/certificates/${certId}/verify`);
export const getEventCertificates = (eventId) =>
  api.get(`/admin/events/${eventId}/certificates`);

export const generateOrganizerCertificates = (eventId, studentIds) =>
  api.post(`/organizer/events/${eventId}/certificates/generate`, { studentIds });
export const getOrganizerEventCertificates = (eventId) =>
  api.get(`/organizer/events/${eventId}/certificates`);
export const downloadOrganizerCertificate = (certId) =>
  api.get(`/organizer/certificates/${certId}/download`, { responseType: 'blob' });
