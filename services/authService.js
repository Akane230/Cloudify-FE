import api from '../config/api';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const authService = {
  register: async (userData) => {
    try {
      const response = await api.post('/register', {
        username: userData.username,
        email: userData.email,
        first_name: userData.first_name,
        last_name: userData.last_name,
        phone_number: userData.phone_number || userData.phoneNumber || '',
        password: userData.password,
        password_confirmation: userData.password_confirmation || userData.passwordConfirmation,
      });

      if (response.data.access_token) {
        await AsyncStorage.setItem('access_token', response.data.access_token);
        await AsyncStorage.setItem('user', JSON.stringify(response.data.user));
        api.defaults.headers.common['Authorization'] = `Bearer ${response.data.access_token}`;
      }

      return { success: true, data: response.data };
    } catch (error) {
      console.error('authService.register error:', error);
      throw {
        response: error.response,
        message: error.response?.data?.message || error.message || 'Registration failed',
        errors: error.response?.data?.errors,
        original: error,
      };
    }
  },

  login: async (email, password) => {
    try {
      const response = await api.post('/login', { email, password });

      if (response.data.access_token) {
        await AsyncStorage.setItem('access_token', response.data.access_token);
        await AsyncStorage.setItem('user', JSON.stringify(response.data.user));
        api.defaults.headers.common['Authorization'] = `Bearer ${response.data.access_token}`;
      }

      return { success: true, data: response.data };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Invalid email or password',
      };
    }
  },

  logout: async () => {
    try {
      const token = await AsyncStorage.getItem('access_token');

      if (token) {
        api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        await api.post('/logout');
      }

      await AsyncStorage.removeItem('access_token');
      await AsyncStorage.removeItem('user');
      delete api.defaults.headers.common['Authorization'];

      return { success: true, message: 'Logged out successfully' };
    } catch (error) {
      await AsyncStorage.removeItem('access_token');
      await AsyncStorage.removeItem('user');
      return {
        success: false,
        message: error.response?.data?.message || 'Logout failed',
      };
    }
  },

  getCurrentUser: async () => {
    try {
      const token = await AsyncStorage.getItem('access_token');

      if (!token) {
        return { success: false, message: 'No token found' };
      }

      api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      const response = await api.get('/user');

      return { success: true, data: response.data };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to get user',
      };
    }
  },

  isAuthenticated: async () => {
    const token = await AsyncStorage.getItem('access_token');
    return !!token;
  },
};