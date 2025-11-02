import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { useAuthStore } from './authStore';
import { apiClient } from '@services/api';
import { STORAGE_KEYS } from '@constants/index';
import type { AuthResponse, User } from '@/types';

// Mock the API client
vi.mock('@services/api', () => ({
  apiClient: {
    login: vi.fn(),
    register: vi.fn(),
    updateLocation: vi.fn(),
  },
}));

describe('AuthStore', () => {
  const mockUser: User = {
    id: 'user-1',
    name: 'John Doe',
    email: 'john@example.com',
    latitude: 40.7128,
    longitude: -74.0060,
    created_at: '2024-01-01T00:00:00Z',
  };

  const mockAuthResponse: AuthResponse = {
    access_token: 'mock-token-123',
    token_type: 'bearer',
    user: mockUser,
  };

  beforeEach(() => {
    // Clear localStorage before each test
    localStorage.clear();

    // Reset store state
    useAuthStore.setState({
      user: null,
      token: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,
    });

    // Clear all mocks
    vi.clearAllMocks();
  });

  afterEach(() => {
    localStorage.clear();
  });

  describe('Initial State', () => {
    it('should have correct initial state', () => {
      const state = useAuthStore.getState();

      expect(state.user).toBeNull();
      expect(state.token).toBeNull();
      expect(state.isAuthenticated).toBe(false);
      expect(state.isLoading).toBe(false);
      expect(state.error).toBeNull();
    });
  });

  describe('login', () => {
    it('should successfully login user', async () => {
      vi.mocked(apiClient.login).mockResolvedValueOnce(mockAuthResponse);

      const credentials = {
        email: 'john@example.com',
        password: 'password123',
      };

      await useAuthStore.getState().login(credentials);

      const state = useAuthStore.getState();

      expect(state.user).toEqual(mockUser);
      expect(state.token).toBe('mock-token-123');
      expect(state.isAuthenticated).toBe(true);
      expect(state.isLoading).toBe(false);
      expect(state.error).toBeNull();

      // Verify localStorage
      expect(localStorage.getItem(STORAGE_KEYS.ACCESS_TOKEN)).toBe('mock-token-123');
      expect(localStorage.getItem(STORAGE_KEYS.USER)).toBe(JSON.stringify(mockUser));
    });

    it('should set isLoading to true during login', async () => {
      let resolveLogin: (value: AuthResponse) => void = () => {};
      const loginPromise = new Promise<AuthResponse>((resolve) => {
        resolveLogin = resolve;
      });

      vi.mocked(apiClient.login).mockReturnValueOnce(loginPromise);

      const loginCall = useAuthStore.getState().login({
        email: 'john@example.com',
        password: 'password123',
      });

      // Check loading state before promise resolves
      expect(useAuthStore.getState().isLoading).toBe(true);

      resolveLogin(mockAuthResponse);
      await loginCall;

      expect(useAuthStore.getState().isLoading).toBe(false);
    });

    it('should handle login failure', async () => {
      const error = new Error('Invalid credentials');
      vi.mocked(apiClient.login).mockRejectedValueOnce(error);

      await expect(
        useAuthStore.getState().login({
          email: 'wrong@example.com',
          password: 'wrongpass',
        })
      ).rejects.toThrow('Invalid credentials');

      const state = useAuthStore.getState();

      expect(state.user).toBeNull();
      expect(state.token).toBeNull();
      expect(state.isAuthenticated).toBe(false);
      expect(state.isLoading).toBe(false);
      expect(state.error).toBe('Invalid credentials');

      // Verify localStorage is not updated
      expect(localStorage.getItem(STORAGE_KEYS.ACCESS_TOKEN)).toBeNull();
      expect(localStorage.getItem(STORAGE_KEYS.USER)).toBeNull();
    });

    it('should handle non-Error objects', async () => {
      vi.mocked(apiClient.login).mockRejectedValueOnce('Unknown error');

      await expect(
        useAuthStore.getState().login({
          email: 'test@example.com',
          password: 'pass',
        })
      ).rejects.toBe('Unknown error');

      expect(useAuthStore.getState().error).toBe('Login failed');
    });
  });

  describe('register', () => {
    it('should successfully register user', async () => {
      vi.mocked(apiClient.register).mockResolvedValueOnce(mockAuthResponse);

      const registerData = {
        name: 'John Doe',
        email: 'john@example.com',
        password: 'password123',
        latitude: 40.7128,
        longitude: -74.0060,
      };

      await useAuthStore.getState().register(registerData);

      const state = useAuthStore.getState();

      expect(state.user).toEqual(mockUser);
      expect(state.token).toBe('mock-token-123');
      expect(state.isAuthenticated).toBe(true);
      expect(state.isLoading).toBe(false);
      expect(state.error).toBeNull();

      // Verify localStorage
      expect(localStorage.getItem(STORAGE_KEYS.ACCESS_TOKEN)).toBe('mock-token-123');
      expect(localStorage.getItem(STORAGE_KEYS.USER)).toBe(JSON.stringify(mockUser));
    });

    it('should handle registration failure', async () => {
      const error = new Error('Email already exists');
      vi.mocked(apiClient.register).mockRejectedValueOnce(error);

      await expect(
        useAuthStore.getState().register({
          name: 'John Doe',
          email: 'existing@example.com',
          password: 'password123',
        })
      ).rejects.toThrow('Email already exists');

      const state = useAuthStore.getState();

      expect(state.user).toBeNull();
      expect(state.isAuthenticated).toBe(false);
      expect(state.error).toBe('Email already exists');
    });
  });

  describe('logout', () => {
    it('should clear user state and localStorage', () => {
      // Set up authenticated state
      localStorage.setItem(STORAGE_KEYS.ACCESS_TOKEN, 'token-123');
      localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(mockUser));

      useAuthStore.setState({
        user: mockUser,
        token: 'token-123',
        isAuthenticated: true,
      });

      // Logout
      useAuthStore.getState().logout();

      const state = useAuthStore.getState();

      expect(state.user).toBeNull();
      expect(state.token).toBeNull();
      expect(state.isAuthenticated).toBe(false);
      expect(state.error).toBeNull();

      // Verify localStorage is cleared
      expect(localStorage.getItem(STORAGE_KEYS.ACCESS_TOKEN)).toBeNull();
      expect(localStorage.getItem(STORAGE_KEYS.USER)).toBeNull();
    });
  });

  describe('setUser', () => {
    it('should update user in state and localStorage', () => {
      const updatedUser: User = {
        ...mockUser,
        name: 'Jane Doe',
      };

      useAuthStore.getState().setUser(updatedUser);

      expect(useAuthStore.getState().user).toEqual(updatedUser);
      expect(localStorage.getItem(STORAGE_KEYS.USER)).toBe(JSON.stringify(updatedUser));
    });
  });

  describe('updateUserLocation', () => {
    it('should successfully update user location', async () => {
      const updatedUser: User = {
        ...mockUser,
        latitude: 34.0522,
        longitude: -118.2437,
      };

      vi.mocked(apiClient.updateLocation).mockResolvedValueOnce(updatedUser);

      await useAuthStore.getState().updateUserLocation(34.0522, -118.2437);

      const state = useAuthStore.getState();

      expect(state.user).toEqual(updatedUser);
      expect(state.isLoading).toBe(false);
      expect(state.error).toBeNull();

      // Verify API call
      expect(apiClient.updateLocation).toHaveBeenCalledWith({
        latitude: 34.0522,
        longitude: -118.2437,
      });

      // Verify localStorage
      expect(localStorage.getItem(STORAGE_KEYS.USER)).toBe(JSON.stringify(updatedUser));
    });

    it('should handle location update failure', async () => {
      const error = new Error('Location update failed');
      vi.mocked(apiClient.updateLocation).mockRejectedValueOnce(error);

      await expect(
        useAuthStore.getState().updateUserLocation(0, 0)
      ).rejects.toThrow('Location update failed');

      const state = useAuthStore.getState();

      expect(state.isLoading).toBe(false);
      expect(state.error).toBe('Location update failed');
    });
  });

  describe('initializeAuth', () => {
    it('should restore auth state from localStorage', () => {
      localStorage.setItem(STORAGE_KEYS.ACCESS_TOKEN, 'stored-token');
      localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(mockUser));

      useAuthStore.getState().initializeAuth();

      const state = useAuthStore.getState();

      expect(state.user).toEqual(mockUser);
      expect(state.token).toBe('stored-token');
      expect(state.isAuthenticated).toBe(true);
    });

    it('should not restore state if token is missing', () => {
      localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(mockUser));

      useAuthStore.getState().initializeAuth();

      const state = useAuthStore.getState();

      expect(state.user).toBeNull();
      expect(state.token).toBeNull();
      expect(state.isAuthenticated).toBe(false);
    });

    it('should not restore state if user is missing', () => {
      localStorage.setItem(STORAGE_KEYS.ACCESS_TOKEN, 'stored-token');

      useAuthStore.getState().initializeAuth();

      const state = useAuthStore.getState();

      expect(state.user).toBeNull();
      expect(state.token).toBeNull();
      expect(state.isAuthenticated).toBe(false);
    });

    it('should clear invalid JSON from localStorage', () => {
      localStorage.setItem(STORAGE_KEYS.ACCESS_TOKEN, 'token');
      localStorage.setItem(STORAGE_KEYS.USER, 'invalid-json');

      useAuthStore.getState().initializeAuth();

      // Invalid data should be cleared
      expect(localStorage.getItem(STORAGE_KEYS.ACCESS_TOKEN)).toBeNull();
      expect(localStorage.getItem(STORAGE_KEYS.USER)).toBeNull();

      const state = useAuthStore.getState();
      expect(state.isAuthenticated).toBe(false);
    });
  });

  describe('clearError', () => {
    it('should clear error state', () => {
      useAuthStore.setState({ error: 'Some error' });

      expect(useAuthStore.getState().error).toBe('Some error');

      useAuthStore.getState().clearError();

      expect(useAuthStore.getState().error).toBeNull();
    });
  });

  describe('Complex Scenarios', () => {
    it('should handle login after logout', async () => {
      // First login
      vi.mocked(apiClient.login).mockResolvedValueOnce(mockAuthResponse);
      await useAuthStore.getState().login({
        email: 'john@example.com',
        password: 'password123',
      });

      expect(useAuthStore.getState().isAuthenticated).toBe(true);

      // Logout
      useAuthStore.getState().logout();
      expect(useAuthStore.getState().isAuthenticated).toBe(false);

      // Login again
      vi.mocked(apiClient.login).mockResolvedValueOnce(mockAuthResponse);
      await useAuthStore.getState().login({
        email: 'john@example.com',
        password: 'password123',
      });

      expect(useAuthStore.getState().isAuthenticated).toBe(true);
    });

    it('should clear error on successful login after failed login', async () => {
      // Failed login
      vi.mocked(apiClient.login).mockRejectedValueOnce(new Error('Invalid credentials'));

      await expect(
        useAuthStore.getState().login({
          email: 'wrong@example.com',
          password: 'wrong',
        })
      ).rejects.toThrow();

      expect(useAuthStore.getState().error).toBe('Invalid credentials');

      // Successful login
      vi.mocked(apiClient.login).mockResolvedValueOnce(mockAuthResponse);
      await useAuthStore.getState().login({
        email: 'john@example.com',
        password: 'password123',
      });

      expect(useAuthStore.getState().error).toBeNull();
    });
  });
});
