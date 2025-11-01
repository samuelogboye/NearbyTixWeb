import { create } from 'zustand';
import { apiClient } from '@services/api';
import type { Ticket, TicketStatus, TicketQueryParams } from '@/types';
import { PAGINATION } from '@constants/index';

interface TicketsState {
  tickets: Ticket[];
  currentTicket: Ticket | null;
  total: number;
  skip: number;
  limit: number;
  isLoading: boolean;
  error: string | null;

  // Filter
  statusFilter: TicketStatus | null;

  // Actions
  fetchMyTickets: (params?: TicketQueryParams) => Promise<void>;
  fetchTicket: (id: string) => Promise<void>;
  reserveTicket: (eventId: string) => Promise<Ticket>;
  payTicket: (ticketId: string) => Promise<Ticket>;
  setStatusFilter: (status: TicketStatus | null) => void;
  nextPage: () => Promise<void>;
  prevPage: () => Promise<void>;
  clearError: () => void;
  clearCurrentTicket: () => void;
}

export const useTicketsStore = create<TicketsState>((set, get) => ({
  tickets: [],
  currentTicket: null,
  total: 0,
  skip: PAGINATION.DEFAULT_SKIP,
  limit: PAGINATION.DEFAULT_LIMIT,
  isLoading: false,
  error: null,
  statusFilter: null,

  fetchMyTickets: async (params?: TicketQueryParams) => {
    set({ isLoading: true, error: null });
    try {
      const state = get();
      const response = await apiClient.getMyTickets({
        skip: params?.skip ?? state.skip,
        limit: params?.limit ?? state.limit,
        status: params?.status ?? state.statusFilter ?? undefined,
      });

      set({
        tickets: response.tickets,
        total: response.total,
        skip: response.skip,
        limit: response.limit,
        isLoading: false,
      });
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to fetch tickets';
      set({
        isLoading: false,
        error: message,
      });
    }
  },

  fetchTicket: async (id: string) => {
    set({ isLoading: true, error: null, currentTicket: null });
    try {
      const ticket = await apiClient.getTicket(id);
      set({
        currentTicket: ticket,
        isLoading: false,
      });
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to fetch ticket';
      set({
        isLoading: false,
        error: message,
      });
    }
  },

  reserveTicket: async (eventId: string) => {
    set({ isLoading: true, error: null });
    try {
      const ticket = await apiClient.reserveTicket({ event_id: eventId });
      set({
        currentTicket: ticket,
        isLoading: false,
      });
      return ticket;
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to reserve ticket';
      set({
        isLoading: false,
        error: message,
      });
      throw error;
    }
  },

  payTicket: async (ticketId: string) => {
    set({ isLoading: true, error: null });
    try {
      const ticket = await apiClient.payTicket(ticketId);
      set({
        currentTicket: ticket,
        isLoading: false,
      });

      // Update ticket in list if it exists
      const state = get();
      const updatedTickets = state.tickets.map((t) => (t.id === ticketId ? ticket : t));
      set({ tickets: updatedTickets });

      return ticket;
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to pay for ticket';
      set({
        isLoading: false,
        error: message,
      });
      throw error;
    }
  },

  setStatusFilter: (status: TicketStatus | null) => {
    set({ statusFilter: status });
    // Re-fetch with new filter
    get().fetchMyTickets({ skip: 0 });
  },

  nextPage: async () => {
    const state = get();
    const newSkip = state.skip + state.limit;
    if (newSkip < state.total) {
      await state.fetchMyTickets({ skip: newSkip });
    }
  },

  prevPage: async () => {
    const state = get();
    const newSkip = Math.max(0, state.skip - state.limit);
    await state.fetchMyTickets({ skip: newSkip });
  },

  clearError: () => set({ error: null }),

  clearCurrentTicket: () => set({ currentTicket: null }),
}));
