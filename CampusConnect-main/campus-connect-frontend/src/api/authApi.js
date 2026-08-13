import api from './axiosInstance';

export const login = (data) => api.post('/auth/login', data);
export const registerStudent = (data) => api.post('/auth/register/student', data);
export const registerOrganizer = (data) => api.post('/auth/register/organizer', data);
export const getMe = () => api.get('/auth/me');
