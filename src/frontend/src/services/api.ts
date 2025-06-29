import axios, { AxiosInstance, AxiosResponse } from 'axios';
import { store } from '../store/index';
import { clearAuth } from '../store/slices/authSlice';
import { addNotification } from '../store/slices/uiSlice';

// Create axios instance
const api: AxiosInstance = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'http://localhost:5000/api/v1',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
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

// Response interceptor to handle errors
api.interceptors.response.use(
  (response: AxiosResponse) => {
    return response;
  },
  (error) => {
    const { response } = error;
    
    if (response?.status === 401) {
      // Token expired or invalid
      store.dispatch(clearAuth());
      store.dispatch(
        addNotification({
          message: 'Sesi Anda telah berakhir. Silakan login kembali.',
          type: 'warning',
          duration: 5000,
        })
      );
      window.location.href = '/login';
    } else if (response?.status === 403) {
      store.dispatch(
        addNotification({
          message: 'Anda tidak memiliki akses untuk melakukan tindakan ini.',
          type: 'error',
          duration: 5000,
        })
      );
    } else if (response?.status >= 500) {
      store.dispatch(
        addNotification({
          message: 'Terjadi kesalahan server. Silakan coba lagi nanti.',
          type: 'error',
          duration: 5000,
        })
      );
    } else if (!response) {
      store.dispatch(
        addNotification({
          message: 'Tidak dapat terhubung ke server. Periksa koneksi internet Anda.',
          type: 'error',
          duration: 5000,
        })
      );
    }
    
    return Promise.reject(error);
  }
);

// Auth API
export const authAPI = {
  login: (credentials: { email: string; password: string }) =>
    api.post('/auth/login', credentials),
  
  register: (userData: {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
  }) => api.post('/auth/register', userData),
  
  logout: () => api.post('/auth/logout'),
  
  getCurrentUser: () => api.get('/auth/me'),
  
  forgotPassword: (email: string) =>
    api.post('/auth/forgot-password', { email }),
  
  resetPassword: (data: { token: string; password: string }) =>
    api.put('/auth/reset-password', data),
  
  updatePassword: (data: { currentPassword: string; newPassword: string }) =>
    api.put('/auth/update-password', data),
  
  verifyEmail: (token: string) =>
    api.post('/auth/verify-email', { token }),
  
  resendVerification: () =>
    api.post('/auth/resend-verification'),
};

// Vault API
export const vaultAPI = {
  getItems: (folderId?: string) => {
    const params = folderId ? { folderId } : {};
    return api.get('/vault/items', { params });
  },
  
  getItem: (id: string) => api.get(`/vault/items/${id}`),
  
  createItem: (itemData: any) => api.post('/vault/items', itemData),
  
  updateItem: (id: string, data: any) => api.put(`/vault/items/${id}`, data),
  
  deleteItem: (id: string) => api.delete(`/vault/items/${id}`),
  
  getFolders: () => api.get('/vault/folders'),
  
  createFolder: (folderData: {
    name: string;
    description?: string;
    parentId?: string;
  }) => api.post('/vault/folders', folderData),
  
  updateFolder: (id: string, data: any) => api.put(`/vault/folders/${id}`, data),
  
  deleteFolder: (id: string) => api.delete(`/vault/folders/${id}`),
  
  uploadFile: (file: File, metadata: any, onProgress?: (progress: number) => void) => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('metadata', JSON.stringify(metadata));
    
    return api.post('/vault/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      onUploadProgress: (progressEvent) => {
        if (onProgress && progressEvent.total) {
          const progress = Math.round(
            (progressEvent.loaded * 100) / progressEvent.total
          );
          onProgress(progress);
        }
      },
    });
  },
  
  downloadFile: (id: string) => api.get(`/vault/items/${id}/download`, {
    responseType: 'blob',
  }),
  
  searchItems: (query: string) => api.get('/vault/search', {
    params: { q: query },
  }),
  
  shareItem: (id: string, shareData: {
    email: string;
    accessLevel: string;
    expiresAt?: string;
  }) => api.post(`/vault/items/${id}/share`, shareData),
  
  getSharedItems: () => api.get('/vault/shared'),
};

// Faraid API
export const faraidAPI = {
  calculate: (data: {
    assets: Array<{
      type: string;
      value: number;
      description?: string;
    }>;
    heirs: Array<{
      relationship: string;
      gender: 'male' | 'female';
      isAlive: boolean;
      name?: string;
    }>;
    debts?: number;
    wasiyyah?: number;
  }) => api.post('/faraid/calculate', data),
  
  saveCalculation: (calculationData: any) =>
    api.post('/faraid/calculations', calculationData),
  
  getCalculations: () => api.get('/faraid/calculations'),
  
  getCalculation: (id: string) => api.get(`/faraid/calculations/${id}`),
  
  updateCalculation: (id: string, data: any) =>
    api.put(`/faraid/calculations/${id}`, data),
  
  deleteCalculation: (id: string) => api.delete(`/faraid/calculations/${id}`),
};

// Will API
export const willAPI = {
  getTemplates: () => api.get('/will/templates'),
  
  getTemplate: (id: string) => api.get(`/will/templates/${id}`),
  
  createWill: (willData: any) => api.post('/will', willData),
  
  getWills: () => api.get('/will'),
  
  getWill: (id: string) => api.get(`/will/${id}`),
  
  updateWill: (id: string, data: any) => api.put(`/will/${id}`, data),
  
  deleteWill: (id: string) => api.delete(`/will/${id}`),
  
  generatePDF: (id: string) => api.get(`/will/${id}/pdf`, {
    responseType: 'blob',
  }),
};

// Profile API
export const profileAPI = {
  getProfile: () => api.get('/profile'),
  
  updateProfile: (data: any) => api.put('/profile', data),
  
  uploadAvatar: (file: File) => {
    const formData = new FormData();
    formData.append('avatar', file);
    return api.post('/profile/avatar', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  },
  
  deleteAccount: (password: string) =>
    api.delete('/profile', { data: { password } }),
  
  exportData: () => api.get('/profile/export', {
    responseType: 'blob',
  }),
};

// Admin API (for admin users)
export const adminAPI = {
  getUsers: (params?: any) => api.get('/admin/users', { params }),
  
  getUser: (id: string) => api.get(`/admin/users/${id}`),
  
  updateUser: (id: string, data: any) => api.put(`/admin/users/${id}`, data),
  
  deleteUser: (id: string) => api.delete(`/admin/users/${id}`),
  
  getSystemStats: () => api.get('/admin/stats'),
  
  getAuditLogs: (params?: any) => api.get('/admin/audit-logs', { params }),
};

export default api;