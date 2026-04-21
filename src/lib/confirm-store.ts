import { create } from "zustand";

type ConfirmVariant = "warning" | "success" | "info" | "danger"; // Tambah "danger" untuk warna Merah

interface ConfirmOptions {
    title?: string;
    message: string;
    confirmText?: string;
    cancelText?: string;
    onConfirm: () => void;
    onCancel?: () => void;
    hideCancel?: boolean;
    variant?: ConfirmVariant;
}

interface GlobalConfirmState {
    isOpen: boolean;
    title: string;
    message: string;
    confirmText: string;
    cancelText: string;
    hideCancel: boolean;
    variant: ConfirmVariant;
    onConfirm: (() => void) | null;
    onCancel: (() => void) | null;
    showConfirm: (options: ConfirmOptions) => void;
    hideConfirm: () => void;
}

export const useGlobalConfirmStore = create<GlobalConfirmState>((set) => ({
    isOpen: false,
    title: "Konfirmasi",
    message: "",
    confirmText: "Lanjutkan",
    cancelText: "Batal",
    hideCancel: false,
    variant: "warning",
    onConfirm: null,
    onCancel: null,
    showConfirm: (options) => set({
        isOpen: true,
        title: options.title ?? "Konfirmasi",
        message: options.message,
        confirmText: options.confirmText ?? "Lanjutkan",
        cancelText: options.cancelText ?? "Batal",
        hideCancel: options.hideCancel ?? false,
        variant: options.variant ?? "warning",
        onConfirm: options.onConfirm,
        onCancel: options.onCancel ?? null,
    }),
    hideConfirm: () => set({ 
        isOpen: false, 
        onConfirm: null, 
        onCancel: null,
        hideCancel: false,
        variant: "warning"
    }),
}));
