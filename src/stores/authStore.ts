import { create } from 'zustand';
import { apiClient } from '@services/api';
import { STORAGE_KEYS } from '@constants/index';
import type { User, LoginRequest, RegisterRequest } from '@/types';

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;

  // Actions
  login: (credentials: LoginRequest, rememberMe?: boolean) => Promise<void>;
  register: (data: RegisterRequest) => Promise<void>;
  logout: () => void;
  setUser: (user: User) => void;
  updateUserLocation: (latitude: number, longitude: number) => Promise<void>;
  initializeAuth: () => Promise<void>;
  clearError: () => void;
}

// Helper function to get the appropriate storage based on rememberMe preference
const getStorage = (rememberMe: boolean = true): Storage => {
  return rememberMe ? localStorage : sessionStorage;
};

// Helper function to get item from either storage
const getStorageItem = (key: string): string | null => {
  return localStorage.getItem(key) || sessionStorage.getItem(key);
};

// Helper function to remove item from both storages
const removeStorageItem = (key: string): void => {
  localStorage.removeItem(key);
  sessionStorage.removeItem(key);
};

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  token: null,
  isAuthenticated: false,
  isLoading: false,
  error: null,

  login: async (credentials: LoginRequest, rememberMe: boolean = true) => {
    set({ isLoading: true, error: null });
    try {
      const response = await apiClient.login(credentials);

      // Get the appropriate storage based on rememberMe preference
      const storage = getStorage(rememberMe);

      // Store token first
      storage.setItem(STORAGE_KEYS.ACCESS_TOKEN, response.access_token);

      // Fetch full user data from /me endpoint
      const user = await apiClient.getMe();
      storage.setItem(STORAGE_KEYS.USER, JSON.stringify(user));

      set({
        user,
        token: response.access_token,
        isAuthenticated: true,
        isLoading: false,
        error: null,
      });
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Login failed';
      set({
        isLoading: false,
        error: message,
      });
      throw error;
    }
  },

  register: async (data: RegisterRequest) => {
    set({ isLoading: true, error: null });
    try {
      const response = await apiClient.register(data);

      // Store token first
      localStorage.setItem(STORAGE_KEYS.ACCESS_TOKEN, response.access_token);

      // Fetch full user data from /me endpoint
      const user = await apiClient.getMe();
      localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(user));

      set({
        user,
        token: response.access_token,
        isAuthenticated: true,
        isLoading: false,
        error: null,
      });
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Registration failed';
      set({
        isLoading: false,
        error: message,
      });
      throw error;
    }
  },

  logout: () => {
    // Clear from both storages
    removeStorageItem(STORAGE_KEYS.ACCESS_TOKEN);
    removeStorageItem(STORAGE_KEYS.USER);

    // Reset state
    set({
      user: null,
      token: null,
      isAuthenticated: false,
      error: null,
    });

    // Redirect to login page
    if (typeof window !== 'undefined') {
      window.location.href = '/login';
    }
  },

  setUser: (user: User) => {
    // Update in the same storage that has the token
    const storage = localStorage.getItem(STORAGE_KEYS.ACCESS_TOKEN)
      ? localStorage
      : sessionStorage;
    storage.setItem(STORAGE_KEYS.USER, JSON.stringify(user));
    set({ user });
  },

  updateUserLocation: async (latitude: number, longitude: number) => {
    set({ isLoading: true, error: null });
    try {
      const updatedUser = await apiClient.updateLocation({ latitude, longitude });

      // Update in the same storage that has the token
      const storage = localStorage.getItem(STORAGE_KEYS.ACCESS_TOKEN)
        ? localStorage
        : sessionStorage;
      storage.setItem(STORAGE_KEYS.USER, JSON.stringify(updatedUser));

      set({
        user: updatedUser,
        isLoading: false,
        error: null,
      });
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to update location';
      set({
        isLoading: false,
        error: message,
      });
      throw error;
    }
  },

  initializeAuth: async () => {
    // Check both localStorage and sessionStorage
    const token = getStorageItem(STORAGE_KEYS.ACCESS_TOKEN);
    const userStr = getStorageItem(STORAGE_KEYS.USER);

    if (token) {
      // Determine which storage has the token
      const storage = localStorage.getItem(STORAGE_KEYS.ACCESS_TOKEN)
        ? localStorage
        : sessionStorage;

      // If we have a token but no user data, fetch from API
      if (!userStr) {
        try {
          const user = await apiClient.getMe();
          storage.setItem(STORAGE_KEYS.USER, JSON.stringify(user));
          set({
            user,
            token,
            isAuthenticated: true,
          });
        } catch (error) {
          // Token is invalid, clear everything
          removeStorageItem(STORAGE_KEYS.ACCESS_TOKEN);
          removeStorageItem(STORAGE_KEYS.USER);
        }
      } else {
        // We have both token and user data
        try {
          const user = JSON.parse(userStr) as User;
          set({
            user,
            token,
            isAuthenticated: true,
          });
        } catch (error) {
          // Invalid stored data, clear it
          removeStorageItem(STORAGE_KEYS.ACCESS_TOKEN);
          removeStorageItem(STORAGE_KEYS.USER);
        }
      }
    }
  },

  clearError: () => set({ error: null }),
}));

// Register logout callback with API client to handle 401 errors
apiClient.setUnauthorizedCallback(() => {
  useAuthStore.getState().logout();
});
