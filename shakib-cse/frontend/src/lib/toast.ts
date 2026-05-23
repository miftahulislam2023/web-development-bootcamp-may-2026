import { create } from "zustand";

type Toast = {
  id: string;
  type: "success" | "error" | "info";
  message: string;
};

interface ToastStore {
  toasts: Toast[];
  show: (type: Toast["type"], message: string, ttl?: number) => void;
  remove: (id: string) => void;
}

export const useToast = create<ToastStore>((set) => ({
  toasts: [],
  show: (type, message, ttl = 4000) => {
    const id = String(Date.now()) + Math.random().toString(36).slice(2, 9);
    const toast = { id, type, message };
    set((s) => ({ toasts: [...s.toasts, toast] }));
    setTimeout(
      () => set((s) => ({ toasts: s.toasts.filter((t) => t.id !== id) })),
      ttl,
    );
  },
  remove: (id) => set((s) => ({ toasts: s.toasts.filter((t) => t.id !== id) })),
}));
