import { create } from 'zustand';

export type ToastType = 'success' | 'error' | 'info' | 'warning';

export interface Toast {
  id: string;
  type: ToastType;
  message: string;
  duration?: number;
}

interface Modal {
  id: string;
  isOpen: boolean;
  title?: string;
  content?: string;
}

interface UIState {
  toasts: Toast[];
  modals: Map<string, Modal>;
  isGlobalLoading: boolean;

  // Toast Actions
  addToast: (type: ToastType, message: string, duration?: number) => void;
  removeToast: (id: string) => void;
  clearToasts: () => void;

  // Modal Actions
  openModal: (id: string, title?: string, content?: string) => void;
  closeModal: (id: string) => void;
  isModalOpen: (id: string) => boolean;

  // Global Loading
  setGlobalLoading: (loading: boolean) => void;
}

export const useUIStore = create<UIState>((set, get) => ({
  toasts: [],
  modals: new Map(),
  isGlobalLoading: false,

  addToast: (type: ToastType, message: string, duration = 5000) => {
    const id = `toast-${Date.now()}-${Math.random()}`;
    const toast: Toast = { id, type, message, duration };

    set((state) => ({
      toasts: [...state.toasts, toast],
    }));

    // Auto-remove after duration
    if (duration > 0) {
      setTimeout(() => {
        get().removeToast(id);
      }, duration);
    }
  },

  removeToast: (id: string) => {
    set((state) => ({
      toasts: state.toasts.filter((toast) => toast.id !== id),
    }));
  },

  clearToasts: () => {
    set({ toasts: [] });
  },

  openModal: (id: string, title?: string, content?: string) => {
    set((state) => {
      const newModals = new Map(state.modals);
      newModals.set(id, { id, isOpen: true, title, content });
      return { modals: newModals };
    });
  },

  closeModal: (id: string) => {
    set((state) => {
      const newModals = new Map(state.modals);
      const modal = newModals.get(id);
      if (modal) {
        newModals.set(id, { ...modal, isOpen: false });
      }
      return { modals: newModals };
    });
  },

  isModalOpen: (id: string) => {
    const modal = get().modals.get(id);
    return modal?.isOpen ?? false;
  },

  setGlobalLoading: (loading: boolean) => {
    set({ isGlobalLoading: loading });
  },
}));
