import { create } from 'zustand';
import { apiClient } from '@services/api';
import type { Event, EventListItem, EventQueryParams } from '@/types';
import { PAGINATION } from '@constants/index';

interface EventsState {
  events: EventListItem[];
  currentEvent: Event | null;
  total: number;
  skip: number;
  limit: number;
  isLoading: boolean;
  error: string | null;

  // Filters
  upcomingOnly: boolean;
  searchQuery: string;

  // Actions
  fetchEvents: (params?: EventQueryParams) => Promise<void>;
  fetchEvent: (id: string) => Promise<void>;
  setUpcomingOnly: (value: boolean) => void;
  setSearchQuery: (query: string) => void;
  nextPage: () => Promise<void>;
  prevPage: () => Promise<void>;
  resetPagination: () => void;
  clearError: () => void;
  clearCurrentEvent: () => void;
}

export const useEventsStore = create<EventsState>((set, get) => ({
  events: [],
  currentEvent: null,
  total: 0,
  skip: PAGINATION.DEFAULT_SKIP,
  limit: PAGINATION.DEFAULT_LIMIT,
  isLoading: false,
  error: null,
  upcomingOnly: true,
  searchQuery: '',

  fetchEvents: async (params?: EventQueryParams) => {
    set({ isLoading: true, error: null });
    try {
      const state = get();
      const response = await apiClient.getEvents({
        skip: params?.skip ?? state.skip,
        limit: params?.limit ?? state.limit,
        upcoming_only: params?.upcoming_only ?? state.upcomingOnly,
      });

      set({
        events: response.events,
        total: response.total,
        skip: response.skip,
        limit: response.limit,
        isLoading: false,
      });
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to fetch events';
      set({
        isLoading: false,
        error: message,
      });
    }
  },

  fetchEvent: async (id: string) => {
    set({ isLoading: true, error: null, currentEvent: null });
    try {
      const event = await apiClient.getEvent(id);
      set({
        currentEvent: event,
        isLoading: false,
      });
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to fetch event';
      set({
        isLoading: false,
        error: message,
      });
    }
  },

  setUpcomingOnly: (value: boolean) => {
    set({ upcomingOnly: value });
    // Re-fetch with new filter
    get().fetchEvents({ skip: 0 });
  },

  setSearchQuery: (query: string) => {
    set({ searchQuery: query });
  },

  nextPage: async () => {
    const state = get();
    const newSkip = state.skip + state.limit;
    if (newSkip < state.total) {
      await state.fetchEvents({ skip: newSkip });
    }
  },

  prevPage: async () => {
    const state = get();
    const newSkip = Math.max(0, state.skip - state.limit);
    await state.fetchEvents({ skip: newSkip });
  },

  resetPagination: () => {
    set({
      skip: PAGINATION.DEFAULT_SKIP,
      limit: PAGINATION.DEFAULT_LIMIT,
    });
  },

  clearError: () => set({ error: null }),

  clearCurrentEvent: () => set({ currentEvent: null }),
}));
