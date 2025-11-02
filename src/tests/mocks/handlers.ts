import { http, HttpResponse } from 'msw';
import type { AuthResponse, Event, EventsResponse, Ticket, TicketsResponse, User } from '@/types';

const API_URL = 'http://localhost:8000/api/v1';

// Mock data
export const mockUser: User = {
  id: 'user-1',
  name: 'John Doe',
  email: 'john@example.com',
  latitude: 40.7128,
  longitude: -74.0060,
  created_at: '2024-01-01T00:00:00Z',
  updated_at: '2024-01-01T00:00:00Z',
};

export const mockAuthResponse: AuthResponse = {
  access_token: 'mock-jwt-token',
  token_type: 'bearer',
  user: mockUser,
};

export const mockEvent: Event = {
  id: 'event-1',
  creator_id: 'creator-1',
  title: 'Test Event',
  description: 'A test event description',
  start_time: '2025-12-01T18:00:00Z',
  end_time: '2025-12-01T22:00:00Z',
  total_tickets: 100,
  tickets_sold: 20,
  tickets_available: 80,
  is_sold_out: false,
  latitude: 40.7580,
  longitude: -73.9855,
  venue_name: 'Test Venue',
  address_line1: '123 Test St',
  address_line2: null,
  city: 'New York',
  state: 'NY',
  country: 'USA',
  postal_code: '10001',
  created_at: '2024-01-01T00:00:00Z',
  updated_at: '2024-01-01T00:00:00Z',
};

export const mockTicket: Ticket = {
  id: 'ticket-1',
  event_id: 'event-1',
  user_id: 'user-1',
  status: 'reserved',
  expires_at: '2025-12-01T18:02:00Z',
  paid_at: null,
  created_at: '2025-12-01T18:00:00Z',
  event: {
    id: 'event-1',
    title: 'Test Event',
    start_time: '2025-12-01T18:00:00Z',
    venue_name: 'Test Venue',
    city: 'New York',
    state: 'NY',
  },
  user: {
    id: 'user-1',
    name: 'John Doe',
    email: 'john@example.com',
  },
};

// MSW Request Handlers
export const handlers = [
  // Auth endpoints
  http.post(`${API_URL}/auth/register`, async () => {
    return HttpResponse.json(mockAuthResponse);
  }),

  http.post(`${API_URL}/auth/login`, async () => {
    return HttpResponse.json(mockAuthResponse);
  }),

  // Event endpoints
  http.get(`${API_URL}/events/`, async () => {
    const response: EventsResponse = {
      events: [mockEvent],
      total: 1,
      skip: 0,
      limit: 100,
    };
    return HttpResponse.json(response);
  }),

  http.get(`${API_URL}/events/:id`, async () => {
    return HttpResponse.json(mockEvent);
  }),

  http.post(`${API_URL}/events/`, async () => {
    return HttpResponse.json(mockEvent);
  }),

  // Ticket endpoints
  http.post(`${API_URL}/tickets/`, async () => {
    return HttpResponse.json(mockTicket);
  }),

  http.post(`${API_URL}/tickets/:id/pay`, async () => {
    return HttpResponse.json({ ...mockTicket, status: 'paid', expires_at: null });
  }),

  http.get(`${API_URL}/tickets/my-tickets`, async () => {
    const response: TicketsResponse = {
      tickets: [mockTicket],
      total: 1,
      skip: 0,
      limit: 100,
    };
    return HttpResponse.json(response);
  }),

  http.get(`${API_URL}/tickets/:id`, async () => {
    return HttpResponse.json(mockTicket);
  }),

  // Recommendation endpoints
  http.get(`${API_URL}/for-you/`, async () => {
    return HttpResponse.json({
      events: [mockEvent],
      total: 1,
      skip: 0,
      limit: 100,
    });
  }),

  // User endpoints
  http.get(`${API_URL}/users/me`, async () => {
    return HttpResponse.json(mockUser);
  }),

  http.put(`${API_URL}/users/me/location`, async () => {
    return HttpResponse.json(mockUser);
  }),
];

// Error handlers for testing error scenarios
export const errorHandlers = {
  unauthorized: http.post(`${API_URL}/auth/login`, async () => {
    return HttpResponse.json(
      { detail: 'Invalid credentials' },
      { status: 401 }
    );
  }),

  validationError: http.post(`${API_URL}/auth/register`, async () => {
    return HttpResponse.json(
      {
        detail: [
          {
            loc: ['body', 'email'],
            msg: 'value is not a valid email address',
            type: 'value_error.email',
          },
        ],
      },
      { status: 422 }
    );
  }),

  notFound: http.get(`${API_URL}/events/:id`, async () => {
    return HttpResponse.json(
      { detail: 'Event not found' },
      { status: 404 }
    );
  }),

  serverError: http.get(`${API_URL}/events/`, async () => {
    return HttpResponse.json(
      { detail: 'Internal server error' },
      { status: 500 }
    );
  }),
};
