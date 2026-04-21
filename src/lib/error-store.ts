import { create } from "zustand";

interface GlobalErrorState {
  isOpen: boolean;
  message: string;
  showError: (message: string) => void;
  hideError: () => void;
}

export const useGlobalErrorStore = create<GlobalErrorState>((set) => ({
  isOpen: false,
  message: "",
  showError: (message) => set({ isOpen: true, message }),
  hideError: () => set({ isOpen: false, message: "" }),
}));
