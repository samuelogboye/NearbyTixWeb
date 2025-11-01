import axios, { AxiosError, AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';
import { API_URL, STORAGE_KEYS, HTTP_STATUS } from '@constants/index';
import type {
  AuthResponse,
  LoginRequest,
  RegisterRequest,
  Event,
  EventsResponse,
  CreateEventRequest,
  Ticket,
  TicketsResponse,
  ReserveTicketRequest,
  User,
  UpdateLocationRequest,
  RecommendationsResponse,
  EventQueryParams,
  TicketQueryParams,
  RecommendationQueryParams,
  ErrorResponse,
} from '@/types';

class ApiClient {
  private client: AxiosInstance;

  constructor() {
    this.client = axios.create({
      baseURL: API_URL,
      headers: {
        'Content-Type': 'application/json',
      },
      timeout: 30000, // 30 seconds
    });

    // Request interceptor - inject auth token
    this.client.interceptors.request.use(
      (config) => {
        const token = this.getToken();
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => {
        return Promise.reject(error);
      }
    );

    // Response interceptor - handle errors globally
    this.client.interceptors.response.use(
      (response) => response,
      async (error: AxiosError<ErrorResponse>) => {
        // Handle 401 Unauthorized - token expired or invalid
        if (error.response?.status === HTTP_STATUS.UNAUTHORIZED) {
          this.clearAuth();
          // Redirect to login
          if (typeof window !== 'undefined') {
            window.location.href = '/login';
          }
        }

        return Promise.reject(this.normalizeError(error));
      }
    );
  }

  /**
   * Get stored auth token
   */
  private getToken(): string | null {
    if (typeof window === 'undefined') return null;
    return localStorage.getItem(STORAGE_KEYS.ACCESS_TOKEN);
  }

  /**
   * Clear authentication data
   */
  private clearAuth(): void {
    if (typeof window === 'undefined') return;
    localStorage.removeItem(STORAGE_KEYS.ACCESS_TOKEN);
    localStorage.removeItem(STORAGE_KEYS.USER);
  }

  /**
   * Normalize error responses
   */
  private normalizeError(error: AxiosError<ErrorResponse>): Error {
    if (error.response?.data) {
      const { detail } = error.response.data;

      if (typeof detail === 'string') {
        return new Error(detail);
      }

      if (Array.isArray(detail)) {
        // Validation errors
        const messages = detail.map((err) => `${err.loc.join('.')}: ${err.msg}`).join(', ');
        return new Error(messages);
      }
    }

    if (error.message) {
      return new Error(error.message);
    }

    return new Error('An unexpected error occurred');
  }

  /**
   * Generic request method
   */
  private async request<T>(config: AxiosRequestConfig): Promise<T> {
    const response: AxiosResponse<T> = await this.client.request(config);
    return response.data;
  }

  // ==================== AUTH ENDPOINTS ====================

  /**
   * Register a new user
   */
  async register(data: RegisterRequest): Promise<AuthResponse> {
    return this.request<AuthResponse>({
      method: 'POST',
      url: '/auth/register',
      data,
    });
  }

  /**
   * Login user
   */
  async login(data: LoginRequest): Promise<AuthResponse> {
    return this.request<AuthResponse>({
      method: 'POST',
      url: '/auth/login',
      data,
    });
  }

  // ==================== EVENT ENDPOINTS ====================

  /**
   * Get list of events
   */
  async getEvents(params?: EventQueryParams): Promise<EventsResponse> {
    return this.request<EventsResponse>({
      method: 'GET',
      url: '/events/',
      params,
    });
  }

  /**
   * Get event by ID
   */
  async getEvent(id: string): Promise<Event> {
    return this.request<Event>({
      method: 'GET',
      url: `/events/${id}`,
    });
  }

  /**
   * Create a new event
   */
  async createEvent(data: CreateEventRequest): Promise<Event> {
    return this.request<Event>({
      method: 'POST',
      url: '/events/',
      data,
    });
  }

  // ==================== TICKET ENDPOINTS ====================

  /**
   * Reserve a ticket
   */
  async reserveTicket(data: ReserveTicketRequest): Promise<Ticket> {
    return this.request<Ticket>({
      method: 'POST',
      url: '/tickets/',
      data,
    });
  }

  /**
   * Pay for a ticket
   */
  async payTicket(ticketId: string): Promise<Ticket> {
    return this.request<Ticket>({
      method: 'POST',
      url: `/tickets/${ticketId}/pay`,
    });
  }

  /**
   * Get user's tickets
   */
  async getMyTickets(params?: TicketQueryParams): Promise<TicketsResponse> {
    return this.request<TicketsResponse>({
      method: 'GET',
      url: '/tickets/my-tickets',
      params,
    });
  }

  /**
   * Get ticket by ID
   */
  async getTicket(ticketId: string): Promise<Ticket> {
    return this.request<Ticket>({
      method: 'GET',
      url: `/tickets/${ticketId}`,
    });
  }

  // ==================== RECOMMENDATIONS ENDPOINTS ====================

  /**
   * Get personalized event recommendations
   */
  async getRecommendations(params?: RecommendationQueryParams): Promise<RecommendationsResponse> {
    return this.request<RecommendationsResponse>({
      method: 'GET',
      url: '/for-you/',
      params,
    });
  }

  // ==================== USER ENDPOINTS ====================

  /**
   * Get current user profile
   */
  async getMe(): Promise<User> {
    return this.request<User>({
      method: 'GET',
      url: '/users/me',
    });
  }

  /**
   * Update user location
   */
  async updateLocation(data: UpdateLocationRequest): Promise<User> {
    return this.request<User>({
      method: 'PUT',
      url: '/users/me/location',
      data,
    });
  }
}

// Export singleton instance
export const apiClient = new ApiClient();
