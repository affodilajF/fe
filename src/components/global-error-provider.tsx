"use client";

import ErrorDialog from "@/components/ui/error-dialog";
import { useGlobalErrorStore } from "@/lib/error-store";

export function GlobalErrorDialog() {
  const { isOpen, message, hideError } = useGlobalErrorStore();

  return (
    <ErrorDialog
      open={isOpen}
      message={message}
      onClose={hideError}
    />
  );
}
