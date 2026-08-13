import api from './axiosInstance';

// Public
export const getPublicEvents = (page = 0, size = 10, category = '') =>
  api.get('/events/public', { params: { page, size, category: category || undefined } });
export const getPublicCompletedEvents = () => api.get('/events/public/completed');
export const getEventDetail = (id) => api.get(`/events/public/${id}`);

// Student
export const registerForEvent = (eventId) => api.post(`/student/events/${eventId}/register`);
export const cancelRegistration = (eventId) => api.patch(`/student/events/${eventId}/cancel`);
export const getMyRegistrations = () => api.get('/student/registrations');
export const getCompletedEventsForStudents = () => api.get('/student/events/completed');
export const submitEventFeedback = (eventId, data) => api.post(`/student/events/${eventId}/feedback`, data);

// Organizer
export const createEvent = (data) => api.post('/organizer/events', data);
export const updateEvent = (id, data) => api.put(`/organizer/events/${id}`, data);
export const deleteEvent = (id) => api.delete(`/organizer/events/${id}`);
export const getMyEvents = () => api.get('/organizer/events');
export const completeEvent = (id) => api.patch(`/organizer/events/${id}/complete`);
export const getEventRegistrations = (eventId) =>
  api.get(`/organizer/events/${eventId}/registrations`);

// Admin
export const getPendingEvents = () => api.get('/admin/events/pending');
export const getCompletedEvents = () =>
  api.get('/admin/events').then((res) => ({
    ...res,
    data: res.data.filter((event) => event.status === 'COMPLETED'),
  }));
export const approveEvent = (id) => api.patch(`/admin/events/${id}/approve`);
export const rejectEvent = (id, remarks) =>
  api.patch(`/admin/events/${id}/reject`, null, { params: { remarks } });
