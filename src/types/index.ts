// User Types
export interface User {
  id: string;
  name: string;
  email: string;
  latitude: number | null;
  longitude: number | null;
  created_at: string;
  updated_at: string;
}

export interface UserSummary {
  id: string;
  name: string;
  email: string;
}

// Event Types
export interface Event {
  id: string;
  creator_id: string;
  title: string;
  description: string | null;
  start_time: string;
  end_time: string;
  total_tickets: number;
  tickets_sold: number;
  tickets_available: number;
  is_sold_out: boolean;
  latitude: number;
  longitude: number;
  venue_name: string;
  address_line1: string;
  address_line2: string | null;
  city: string;
  state: string;
  country: string;
  postal_code: string;
  created_at: string;
  updated_at: string;
}

export interface EventListItem {
  id: string;
  creator_id: string;
  title: string;
  description: string | null;
  start_time: string;
  end_time: string;
  tickets_available: number;
  is_sold_out: boolean;
  latitude: number;
  longitude: number;
  venue_name: string;
  city: string;
  state: string;
  distance_km?: number;
  created_at: string;
}

export interface EventSummary {
  id: string;
  title: string;
  start_time: string;
  venue_name: string;
  city?: string;
  state?: string;
}

// Ticket Types
export type TicketStatus = 'reserved' | 'paid' | 'expired';

export interface Ticket {
  id: string;
  user_id: string;
  event_id: string;
  status: TicketStatus;
  expires_at: string | null;
  paid_at: string | null;
  created_at: string;
  event: EventSummary;
  user: UserSummary;
}

// Venue Type
export interface Venue {
  latitude: number;
  longitude: number;
  venue_name: string;
  address_line1: string;
  address_line2?: string;
  city: string;
  state: string;
  country: string;
  postal_code: string;
}

// Auth Types
export interface AuthResponse {
  access_token: string;
  token_type: 'bearer';
  user: User;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  name: string;
  email: string;
  password: string;
  latitude?: number;
  longitude?: number;
}

// Request Types
export interface CreateEventRequest {
  title: string;
  description?: string;
  start_time: string;
  end_time: string;
  total_tickets: number;
  venue: Venue;
}

export interface ReserveTicketRequest {
  event_id: string;
}

export interface UpdateLocationRequest {
  latitude: number;
  longitude: number;
}

// Paginated Response Types
export interface PaginatedResponse<T = unknown> {
  items?: T[];
  total: number;
  skip: number;
  limit: number;
}

export interface EventsResponse extends PaginatedResponse<EventListItem> {
  events: EventListItem[];
}

export interface TicketsResponse extends PaginatedResponse<Ticket> {
  tickets: Ticket[];
}

export interface RecommendationsResponse extends PaginatedResponse<EventListItem> {
  events: EventListItem[];
  user_location: {
    latitude: number;
    longitude: number;
  };
  search_radius_km: number;
}

// Query Parameters
export interface EventQueryParams {
  skip?: number;
  limit?: number;
  upcoming_only?: boolean;
}

export interface TicketQueryParams {
  skip?: number;
  limit?: number;
  status?: TicketStatus;
}

export interface RecommendationQueryParams {
  skip?: number;
  limit?: number;
  radius_km?: number;
}

// Error Types
export interface ValidationError {
  loc: string[];
  msg: string;
  type: string;
}

export interface ErrorResponse {
  detail: string | ValidationError[];
}

// Health Check
export interface HealthCheck {
  status: 'healthy' | 'unhealthy';
  app_name: string;
  version: string;
  database: {
    connected: boolean;
    status: string;
  };
}
