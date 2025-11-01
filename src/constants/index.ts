// API Configuration
export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';
export const API_PREFIX = import.meta.env.VITE_API_PREFIX || '/api/v1';
export const API_URL = `${API_BASE_URL}${API_PREFIX}`;

// Ticket Configuration
export const TICKET_EXPIRATION_SECONDS = parseInt(
  import.meta.env.VITE_TICKET_EXPIRATION_SECONDS || '120',
  10
);

// Storage Keys
export const STORAGE_KEYS = {
  ACCESS_TOKEN: 'nearbytix_access_token',
  USER: 'nearbytix_user',
  LAST_LOCATION: 'nearbytix_last_location',
} as const;

// Route Paths
export const ROUTES = {
  HOME: '/',
  LOGIN: '/login',
  REGISTER: '/register',
  EVENTS: '/events',
  EVENT_DETAIL: '/events/:id',
  MY_TICKETS: '/my-tickets',
  TICKET_DETAIL: '/tickets/:id',
  TICKET_PAYMENT: '/tickets/:id/payment',
  FOR_YOU: '/for-you',
  CREATE_EVENT: '/events/create',
  MY_EVENTS: '/my-events',
  PROFILE: '/profile',
} as const;

// Pagination Defaults
export const PAGINATION = {
  DEFAULT_LIMIT: 20,
  MAX_LIMIT: 100,
  DEFAULT_SKIP: 0,
} as const;

// Geolocation Defaults
export const GEOLOCATION = {
  DEFAULT_RADIUS_KM: 50,
  MIN_RADIUS_KM: 5,
  MAX_RADIUS_KM: 200,
} as const;

// Time Constants
export const TIME = {
  ONE_MINUTE_MS: 60 * 1000,
  ONE_SECOND_MS: 1000,
} as const;

// Toast/Notification Duration
export const NOTIFICATION_DURATION = {
  SUCCESS: 3000,
  ERROR: 5000,
  INFO: 4000,
  WARNING: 4000,
} as const;

// HTTP Status Codes
export const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  CONFLICT: 409,
  UNPROCESSABLE_ENTITY: 422,
  INTERNAL_SERVER_ERROR: 500,
  SERVICE_UNAVAILABLE: 503,
} as const;
