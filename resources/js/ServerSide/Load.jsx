import API_CONFIG from "@/ServerSide/EndPoints.jsx";
import axios from 'axios';
import {Store} from '../Repo/Redux/Load'
import {logout, setCredentials} from "../Repo/Redux/Auth/AuthSlice";


const api = axios.create({
    baseURL: API_CONFIG.BASE_URL,
    timeout: 15000,
    headers: API_CONFIG.HEADERS,
});

let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
    failedQueue.forEach(prom => {
       if (error){
           prom.reject(error);
       } else {
           prom.resolve(token);
       }
    });
    failedQueue = [];
}

api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

api.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;

        // 🔥 BU BLOK: Token varsa refresh denemesi yap
        if (
            error.response?.status === 401 &&
            !originalRequest._retry &&
            localStorage.getItem('token')
        ) {
            if (isRefreshing) {
                return new Promise((resolve, reject) => {
                    failedQueue.push({ resolve, reject });
                }).then(token => {
                    originalRequest.headers.Authorization = `Bearer ${token}`;
                    return api(originalRequest);
                }).catch(err => Promise.reject(err));
            }

            originalRequest._retry = true;
            isRefreshing = true;

            try {
                const { token } = await refreshToken();

                localStorage.setItem('token', token);
                Store.dispatch(setCredentials({ token }));

                api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
                processQueue(null, token);

                return api(originalRequest);
            } catch (refreshError) {
                processQueue(refreshError, null);
                Store.dispatch(logout());
                localStorage.removeItem('token');
                return Promise.reject(refreshError);
            } finally {
                isRefreshing = false;
            }
        }

        // ❌ Token yoksa veya başka bir hata varsa direkt hatayı gönder
        return Promise.reject(error);
    }
);


const refreshToken = async () => {
    try {
        const response = await api.post(API_CONFIG.ENDPOINTS.AUTH.REFRESH_TOKEN);
        return response.data;
    } catch (error) {
        throw new Error('Token yenileme başarısız');
    }
};

export const AuthService = {
    login: async (credentials) => {
        try {
            // Interceptor kullanmayan geçici instance
            const plainInstance = axios.create({
                baseURL: API_CONFIG.BASE_URL,
                timeout: 10000,
                headers: API_CONFIG.HEADERS,
            });

            return await plainInstance.post(API_CONFIG.ENDPOINTS.AUTH.LOGIN, credentials);
        } catch (error) {
            throw new Error(error.response?.data?.message || 'Giriş başarısız');
        }
    },

    logout: async () => {
        try {
            const response = await api.post(API_CONFIG.ENDPOINTS.AUTH.LOGOUT);
            delete api.defaults.headers.common['Authorization'];
            return response;
        } catch (error) {
            throw new Error(error.response?.data?.message || 'Çıkış başarısız');
        }
    },

    register: async (userData) => {
        try {
            return await api.post(API_CONFIG.ENDPOINTS.AUTH.REGISTER, userData);
        } catch (error) {
            throw new Error(error.response?.data?.message || 'Kayıt başarısız');
        }
    },

    forgotPassword: async (email) => {
        try {
            return await api.post(API_CONFIG.ENDPOINTS.AUTH.FORGOT_PASSWORD, { email });
        } catch (error) {
            throw new Error(error.response?.data?.message || 'Şifre sıfırlama başarısız');
        }
    },

    me: async () => {
        const token = localStorage.getItem('token');

        try {
            const response = await axios.get(API_CONFIG.ENDPOINTS.AUTH.ME, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Accept': 'application/json'
                }
            });

            return response.data;
        } catch (error) {
            throw new Error('Kullanıcı bilgileri alınamadı');
        }

    }
};

export const UserService = {
    getProfile: async () => {
        try {
            return await api.get(API_CONFIG.ENDPOINTS.USER.PROFILE);
        } catch (error) {
            throw new Error(error.response?.data?.message || 'Profil bilgileri alınamadı');
        }
    },

    updateProfile: async (userData) => {
        try {
            const response = await api.post(API_CONFIG.ENDPOINTS.USER.UPDATE_PROFILE, userData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });
            return response.data;
        } catch (error) {
            throw new Error(error.response?.data?.message || 'Profil güncellenemedi');
        }
    },

    changePassword: async (passwordData) => {
        try {
            return await api.post(API_CONFIG.ENDPOINTS.USER.CHANGE_PASSWORD, passwordData);
        } catch (error) {
            throw new Error(error.response?.data?.message || 'Şifre değiştirilemedi');
        }
    }
};

export const apiService = {
    get: api.get,
    post: api.post,
    put: api.put,
    delete: api.delete,
    patch: api.patch
};

export default {
    AuthService,
    UserService,
    apiService
};
