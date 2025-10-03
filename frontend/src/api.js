import axios from 'axios';

export const URL = 'https://perfectrent.ru';


const api = axios.create({
    baseURL: URL + '/api/'
});

api.interceptors.request.use((config) => {
    const token = localStorage.getItem('authToken');
    if (token){
        config.headers.Authorization = `Token ${token}`;
    }
    return config;
}, (error) => {
    return Promise.reject(error);
});


const createCRUD = (endpoint) => ({
    list: (params = {}) => api.get(endpoint, { params }),
    retrieve: (id) => api.get(`${endpoint}${id}/`),
    create: (data) => api.post(endpoint, data),
    update: (id, data) => api.put(`${endpoint}${id}/`, data),
    destroy: (id) => api.delete(`${endpoint}${id}/`),
});


export const roomsAPI = createCRUD('crud/rooms/');
export const room_typesAPI = createCRUD('crud/room_types/');
export const servicesAPI = createCRUD('crud/services/');
export const bookingsAPI = createCRUD('crud/bookings/');
export const booking_serviceAPI = createCRUD('crud/booking_service/');
export const userAPI = createCRUD('auth/user/');
export const articlesAPI = createCRUD('articles/articles/');
articlesAPI.by_slug = (slug) => api.get(`${'articles/articles/slug/'}${slug}/`)
export const articleImagesAPI = createCRUD('articles/article-images/');
export const authAPI = {
    login: (credentials) => api.post('auth/login/', credentials),
    logout: () => api.post('/auth/logout/'),
    register: (credentials) => api.post('auth/register/', credentials),
    verify: () => api.get('auth/verify/'),
    verify_admin: () => api.get('auth/verify_admin/')
};


export const adminMetadataAPI = {
    get: (credentials) => api.get('hotel_admin/metadata/', credentials)
}