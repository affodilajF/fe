"use client";

import { useGlobalConfirmStore } from "@/lib/confirm-store";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { AlertCircle, CheckCircle2 } from "lucide-react";

export function GlobalConfirmDialog() {
    const {
        isOpen,
        title,
        message,
        confirmText,
        cancelText,
        hideCancel,
        variant,
        onConfirm,
        onCancel,
        hideConfirm
    } = useGlobalConfirmStore();

    const handleConfirm = () => {
        if (onConfirm) onConfirm();
        hideConfirm();
    };

    const handleCancel = () => {
        if (onCancel) onCancel();
        hideConfirm();
    };

    return (
        <Dialog open={isOpen} onOpenChange={(open) => !open && hideConfirm()}>
            <DialogContent className="w-full transition-all duration-300 ease-out animate-in fade-in zoom-in-50">
                <DialogHeader>
                    <div className="flex items-center gap-2">
                        {variant === "success" || (variant === "warning" && hideCancel) ? (
                            <CheckCircle2 className={`h-6 w-6 ${variant === "success" ? 'text-emerald-600' : 'text-amber-600'}`} />
                        ) : variant === "info" ? (
                            <CheckCircle2 className="h-6 w-6 text-blue-600" />
                        ) : variant === "danger" ? (
                            <AlertCircle className="h-6 w-6 text-red-600" />
                        ) : (
                            <AlertCircle className="h-6 w-6 text-amber-600" />
                        )}
                        <DialogTitle className={
                            variant === "success" ? "text-emerald-700" : 
                            variant === "info" ? "text-blue-700" : 
                            variant === "danger" ? "text-red-700" : 
                            "text-amber-700"
                        }>
                            {title}
                        </DialogTitle>
                    </div>
                </DialogHeader>

                <div className="py-4 text-gray-700 whitespace-pre-line">
                    {message}
                </div>

                <div className="flex justify-end gap-2">
                    {!hideCancel && (
                        <Button
                            type="button"
                            variant="outline"
                            className="border-slate-200 text-slate-600 hover:bg-slate-50"
                            onClick={handleCancel}
                        >
                            {cancelText}
                        </Button>
                    )}
                    <Button
                        type="button"
                        className={`
                            ${variant === "success" ? "bg-emerald-600 hover:bg-emerald-800" : 
                              variant === "info" ? "bg-blue-600 hover:bg-blue-800" : 
                              variant === "danger" ? "bg-red-600 hover:bg-red-800" : 
                              "bg-amber-600 hover:bg-amber-800"}
                        `}
                        onClick={handleConfirm}
                    >
                        {confirmText}
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    );
}
