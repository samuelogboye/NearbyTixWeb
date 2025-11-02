import { describe, it, expect } from 'vitest';
import { loginSchema, registerSchema, createEventSchema } from './validation';

describe('Validation Schemas', () => {
  describe('loginSchema', () => {
    it('should validate valid login data', () => {
      const validData = {
        email: 'test@example.com',
        password: 'password123',
      };

      const result = loginSchema.safeParse(validData);
      expect(result.success).toBe(true);
    });

    it('should reject invalid email', () => {
      const invalidData = {
        email: 'not-an-email',
        password: 'password123',
      };

      const result = loginSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.errors[0]?.message).toBe('Invalid email address');
      }
    });

    it('should reject empty password', () => {
      const invalidData = {
        email: 'test@example.com',
        password: '',
      };

      const result = loginSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.errors[0]?.message).toBe('Password is required');
      }
    });

    it('should reject missing fields', () => {
      const invalidData = {};

      const result = loginSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
    });
  });

  describe('registerSchema', () => {
    it('should validate valid registration data', () => {
      const validData = {
        name: 'John Doe',
        email: 'john@example.com',
        password: 'password123',
        confirmPassword: 'password123',
      };

      const result = registerSchema.safeParse(validData);
      expect(result.success).toBe(true);
    });

    it('should reject empty name', () => {
      const invalidData = {
        name: '',
        email: 'test@example.com',
        password: 'password123',
        confirmPassword: 'password123',
      };

      const result = registerSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.errors[0]?.message).toBe('Name is required');
      }
    });

    it('should reject name longer than 100 characters', () => {
      const invalidData = {
        name: 'a'.repeat(101),
        email: 'test@example.com',
        password: 'password123',
        confirmPassword: 'password123',
      };

      const result = registerSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.errors[0]?.message).toBe('Name must be less than 100 characters');
      }
    });

    it('should reject invalid email', () => {
      const invalidData = {
        name: 'John Doe',
        email: 'invalid-email',
        password: 'password123',
        confirmPassword: 'password123',
      };

      const result = registerSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.errors[0]?.message).toBe('Invalid email address');
      }
    });

    it('should reject password shorter than 8 characters', () => {
      const invalidData = {
        name: 'John Doe',
        email: 'test@example.com',
        password: 'pass',
        confirmPassword: 'pass',
      };

      const result = registerSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.errors[0]?.message).toBe('Password must be at least 8 characters');
      }
    });

    it('should reject non-matching passwords', () => {
      const invalidData = {
        name: 'John Doe',
        email: 'test@example.com',
        password: 'password123',
        confirmPassword: 'different123',
      };

      const result = registerSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
      if (!result.success) {
        const error = result.error.errors.find(e => e.path.includes('confirmPassword'));
        expect(error?.message).toBe('Passwords do not match');
      }
    });

    it('should reject empty confirm password', () => {
      const invalidData = {
        name: 'John Doe',
        email: 'test@example.com',
        password: 'password123',
        confirmPassword: '',
      };

      const result = registerSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
    });
  });

  describe('createEventSchema', () => {
    it('should validate valid event data', () => {
      const validData = {
        title: 'Test Event',
        description: 'A great event',
        start_time: '2025-12-01T18:00:00Z',
        end_time: '2025-12-01T22:00:00Z',
        total_tickets: 100,
        venue: {
          latitude: 40.7128,
          longitude: -74.0060,
          venue_name: 'Test Venue',
          address_line1: '123 Main St',
          address_line2: 'Suite 100',
          city: 'New York',
          state: 'NY',
          country: 'USA',
          postal_code: '10001',
        },
      };

      const result = createEventSchema.safeParse(validData);
      expect(result.success).toBe(true);
    });

    it('should validate event data without optional fields', () => {
      const validData = {
        title: 'Test Event',
        start_time: '2025-12-01T18:00:00Z',
        end_time: '2025-12-01T22:00:00Z',
        total_tickets: 100,
        venue: {
          latitude: 40.7128,
          longitude: -74.0060,
          venue_name: 'Test Venue',
          address_line1: '123 Main St',
          city: 'New York',
          state: 'NY',
          country: 'USA',
          postal_code: '10001',
        },
      };

      const result = createEventSchema.safeParse(validData);
      expect(result.success).toBe(true);
    });

    it('should reject empty title', () => {
      const invalidData = {
        title: '',
        start_time: '2025-12-01T18:00:00Z',
        end_time: '2025-12-01T22:00:00Z',
        total_tickets: 100,
        venue: {
          latitude: 40.7128,
          longitude: -74.0060,
          venue_name: 'Test Venue',
          address_line1: '123 Main St',
          city: 'New York',
          state: 'NY',
          country: 'USA',
          postal_code: '10001',
        },
      };

      const result = createEventSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
    });

    it('should reject title longer than 200 characters', () => {
      const invalidData = {
        title: 'a'.repeat(201),
        start_time: '2025-12-01T18:00:00Z',
        end_time: '2025-12-01T22:00:00Z',
        total_tickets: 100,
        venue: {
          latitude: 40.7128,
          longitude: -74.0060,
          venue_name: 'Test Venue',
          address_line1: '123 Main St',
          city: 'New York',
          state: 'NY',
          country: 'USA',
          postal_code: '10001',
        },
      };

      const result = createEventSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
    });

    it('should reject non-positive ticket count', () => {
      const invalidData = {
        title: 'Test Event',
        start_time: '2025-12-01T18:00:00Z',
        end_time: '2025-12-01T22:00:00Z',
        total_tickets: 0,
        venue: {
          latitude: 40.7128,
          longitude: -74.0060,
          venue_name: 'Test Venue',
          address_line1: '123 Main St',
          city: 'New York',
          state: 'NY',
          country: 'USA',
          postal_code: '10001',
        },
      };

      const result = createEventSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
    });

    it('should reject invalid latitude', () => {
      const invalidData = {
        title: 'Test Event',
        start_time: '2025-12-01T18:00:00Z',
        end_time: '2025-12-01T22:00:00Z',
        total_tickets: 100,
        venue: {
          latitude: 91, // Invalid latitude
          longitude: -74.0060,
          venue_name: 'Test Venue',
          address_line1: '123 Main St',
          city: 'New York',
          state: 'NY',
          country: 'USA',
          postal_code: '10001',
        },
      };

      const result = createEventSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
    });

    it('should reject invalid longitude', () => {
      const invalidData = {
        title: 'Test Event',
        start_time: '2025-12-01T18:00:00Z',
        end_time: '2025-12-01T22:00:00Z',
        total_tickets: 100,
        venue: {
          latitude: 40.7128,
          longitude: 181, // Invalid longitude
          venue_name: 'Test Venue',
          address_line1: '123 Main St',
          city: 'New York',
          state: 'NY',
          country: 'USA',
          postal_code: '10001',
        },
      };

      const result = createEventSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
    });

    it('should reject missing venue fields', () => {
      const invalidData = {
        title: 'Test Event',
        start_time: '2025-12-01T18:00:00Z',
        end_time: '2025-12-01T22:00:00Z',
        total_tickets: 100,
        venue: {
          latitude: 40.7128,
          longitude: -74.0060,
          venue_name: 'Test Venue',
          // Missing required fields
        },
      };

      const result = createEventSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
    });
  });
});
