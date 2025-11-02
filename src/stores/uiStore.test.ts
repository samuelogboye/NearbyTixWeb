import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { useUIStore } from './uiStore';

describe('UIStore', () => {
  beforeEach(() => {
    // Reset store state before each test
    useUIStore.setState({
      toasts: [],
      modals: new Map(),
      isGlobalLoading: false,
    });

    // Use fake timers for testing toast auto-removal
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.restoreAllMocks();
    vi.useRealTimers();
  });

  describe('Initial State', () => {
    it('should have correct initial state', () => {
      const state = useUIStore.getState();

      expect(state.toasts).toEqual([]);
      expect(state.modals.size).toBe(0);
      expect(state.isGlobalLoading).toBe(false);
    });
  });

  describe('Toasts', () => {
    describe('addToast', () => {
      it('should add a success toast', () => {
        useUIStore.getState().addToast('success', 'Operation successful');

        const state = useUIStore.getState();

        expect(state.toasts).toHaveLength(1);
        expect(state.toasts[0]?.type).toBe('success');
        expect(state.toasts[0]?.message).toBe('Operation successful');
        expect(state.toasts[0]?.duration).toBe(5000); // default duration
        expect(state.toasts[0]?.id).toBeDefined();
      });

      it('should add an error toast', () => {
        useUIStore.getState().addToast('error', 'Something went wrong');

        const state = useUIStore.getState();

        expect(state.toasts).toHaveLength(1);
        expect(state.toasts[0]?.type).toBe('error');
        expect(state.toasts[0]?.message).toBe('Something went wrong');
      });

      it('should add multiple toasts', () => {
        useUIStore.getState().addToast('success', 'First toast');
        useUIStore.getState().addToast('error', 'Second toast');
        useUIStore.getState().addToast('info', 'Third toast');

        const state = useUIStore.getState();

        expect(state.toasts).toHaveLength(3);
        expect(state.toasts[0]?.message).toBe('First toast');
        expect(state.toasts[1]?.message).toBe('Second toast');
        expect(state.toasts[2]?.message).toBe('Third toast');
      });

      it('should add toast with custom duration', () => {
        useUIStore.getState().addToast('warning', 'Custom duration', 3000);

        const state = useUIStore.getState();

        expect(state.toasts[0]?.duration).toBe(3000);
      });

      it('should auto-remove toast after duration', () => {
        useUIStore.getState().addToast('success', 'Auto-remove test', 2000);

        expect(useUIStore.getState().toasts).toHaveLength(1);

        // Fast-forward time by 2000ms
        vi.advanceTimersByTime(2000);

        expect(useUIStore.getState().toasts).toHaveLength(0);
      });

      it('should not auto-remove toast with 0 duration', () => {
        useUIStore.getState().addToast('info', 'Persistent toast', 0);

        expect(useUIStore.getState().toasts).toHaveLength(1);

        // Fast-forward time
        vi.advanceTimersByTime(10000);

        // Toast should still be there
        expect(useUIStore.getState().toasts).toHaveLength(1);
      });

      it('should generate unique IDs for toasts', () => {
        useUIStore.getState().addToast('success', 'Toast 1');
        useUIStore.getState().addToast('success', 'Toast 2');

        const state = useUIStore.getState();

        expect(state.toasts[0]?.id).not.toBe(state.toasts[1]?.id);
      });
    });

    describe('removeToast', () => {
      it('should remove specific toast by ID', () => {
        useUIStore.getState().addToast('success', 'Toast 1', 0);
        useUIStore.getState().addToast('error', 'Toast 2', 0);

        const state = useUIStore.getState();
        const firstToastId = state.toasts[0]?.id;

        expect(state.toasts).toHaveLength(2);

        useUIStore.getState().removeToast(firstToastId!);

        const newState = useUIStore.getState();

        expect(newState.toasts).toHaveLength(1);
        expect(newState.toasts[0]?.message).toBe('Toast 2');
      });

      it('should handle removing non-existent toast', () => {
        useUIStore.getState().addToast('success', 'Test toast', 0);

        expect(useUIStore.getState().toasts).toHaveLength(1);

        useUIStore.getState().removeToast('non-existent-id');

        expect(useUIStore.getState().toasts).toHaveLength(1);
      });
    });

    describe('clearToasts', () => {
      it('should remove all toasts', () => {
        useUIStore.getState().addToast('success', 'Toast 1', 0);
        useUIStore.getState().addToast('error', 'Toast 2', 0);
        useUIStore.getState().addToast('warning', 'Toast 3', 0);

        expect(useUIStore.getState().toasts).toHaveLength(3);

        useUIStore.getState().clearToasts();

        expect(useUIStore.getState().toasts).toHaveLength(0);
      });

      it('should clear toasts even when empty', () => {
        useUIStore.getState().clearToasts();

        expect(useUIStore.getState().toasts).toHaveLength(0);
      });
    });
  });

  describe('Modals', () => {
    describe('openModal', () => {
      it('should open a modal', () => {
        useUIStore.getState().openModal('confirm-modal', 'Confirm Action', 'Are you sure?');

        const state = useUIStore.getState();
        const modal = state.modals.get('confirm-modal');

        expect(modal).toBeDefined();
        expect(modal?.id).toBe('confirm-modal');
        expect(modal?.isOpen).toBe(true);
        expect(modal?.title).toBe('Confirm Action');
        expect(modal?.content).toBe('Are you sure?');
      });

      it('should open modal without title and content', () => {
        useUIStore.getState().openModal('simple-modal');

        const state = useUIStore.getState();
        const modal = state.modals.get('simple-modal');

        expect(modal?.isOpen).toBe(true);
        expect(modal?.title).toBeUndefined();
        expect(modal?.content).toBeUndefined();
      });

      it('should open multiple modals', () => {
        useUIStore.getState().openModal('modal-1');
        useUIStore.getState().openModal('modal-2');

        const state = useUIStore.getState();

        expect(state.modals.size).toBe(2);
        expect(state.modals.get('modal-1')?.isOpen).toBe(true);
        expect(state.modals.get('modal-2')?.isOpen).toBe(true);
      });

      it('should update existing modal', () => {
        useUIStore.getState().openModal('test-modal', 'First Title');

        expect(useUIStore.getState().modals.get('test-modal')?.title).toBe('First Title');

        useUIStore.getState().openModal('test-modal', 'Updated Title', 'New content');

        const modal = useUIStore.getState().modals.get('test-modal');

        expect(modal?.title).toBe('Updated Title');
        expect(modal?.content).toBe('New content');
        expect(modal?.isOpen).toBe(true);
      });
    });

    describe('closeModal', () => {
      it('should close an open modal', () => {
        useUIStore.getState().openModal('test-modal');

        expect(useUIStore.getState().modals.get('test-modal')?.isOpen).toBe(true);

        useUIStore.getState().closeModal('test-modal');

        expect(useUIStore.getState().modals.get('test-modal')?.isOpen).toBe(false);
      });

      it('should handle closing non-existent modal', () => {
        useUIStore.getState().closeModal('non-existent-modal');

        // Should not throw error
        expect(useUIStore.getState().modals.get('non-existent-modal')).toBeUndefined();
      });
    });

    describe('isModalOpen', () => {
      it('should return true for open modal', () => {
        useUIStore.getState().openModal('test-modal');

        expect(useUIStore.getState().isModalOpen('test-modal')).toBe(true);
      });

      it('should return false for closed modal', () => {
        useUIStore.getState().openModal('test-modal');
        useUIStore.getState().closeModal('test-modal');

        expect(useUIStore.getState().isModalOpen('test-modal')).toBe(false);
      });

      it('should return false for non-existent modal', () => {
        expect(useUIStore.getState().isModalOpen('non-existent')).toBe(false);
      });
    });
  });

  describe('Global Loading', () => {
    describe('setGlobalLoading', () => {
      it('should set global loading to true', () => {
        useUIStore.getState().setGlobalLoading(true);

        expect(useUIStore.getState().isGlobalLoading).toBe(true);
      });

      it('should set global loading to false', () => {
        useUIStore.setState({ isGlobalLoading: true });

        useUIStore.getState().setGlobalLoading(false);

        expect(useUIStore.getState().isGlobalLoading).toBe(false);
      });

      it('should toggle global loading multiple times', () => {
        useUIStore.getState().setGlobalLoading(true);
        expect(useUIStore.getState().isGlobalLoading).toBe(true);

        useUIStore.getState().setGlobalLoading(false);
        expect(useUIStore.getState().isGlobalLoading).toBe(false);

        useUIStore.getState().setGlobalLoading(true);
        expect(useUIStore.getState().isGlobalLoading).toBe(true);
      });
    });
  });

  describe('Complex Scenarios', () => {
    it('should handle multiple toasts with different auto-remove times', () => {
      useUIStore.getState().addToast('success', 'Quick toast', 1000);
      useUIStore.getState().addToast('error', 'Slow toast', 3000);

      expect(useUIStore.getState().toasts).toHaveLength(2);

      // Fast-forward by 1000ms
      vi.advanceTimersByTime(1000);

      expect(useUIStore.getState().toasts).toHaveLength(1);
      expect(useUIStore.getState().toasts[0]?.message).toBe('Slow toast');

      // Fast-forward by another 2000ms
      vi.advanceTimersByTime(2000);

      expect(useUIStore.getState().toasts).toHaveLength(0);
    });

    it('should handle modal and toast interactions', () => {
      useUIStore.getState().addToast('info', 'Toast message', 0);
      useUIStore.getState().openModal('test-modal', 'Modal Title');

      const state = useUIStore.getState();

      expect(state.toasts).toHaveLength(1);
      expect(state.modals.get('test-modal')?.isOpen).toBe(true);

      useUIStore.getState().clearToasts();
      useUIStore.getState().closeModal('test-modal');

      const newState = useUIStore.getState();

      expect(newState.toasts).toHaveLength(0);
      expect(newState.modals.get('test-modal')?.isOpen).toBe(false);
    });
  });
});
