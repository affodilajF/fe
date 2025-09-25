"use client";

import * as DialogPrimitive from "@radix-ui/react-dialog";
import { Loader2 } from "lucide-react";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";
import { cn } from "@/lib/utils";

interface LoadingDialogProps {
  open: boolean;
}

export default function LoadingDialog({ open }: LoadingDialogProps) {
  return (
    <DialogPrimitive.Root open={open}>
      <DialogPrimitive.Portal>
        <DialogPrimitive.Overlay className="fixed inset-0 z-50 bg-neutral-950/50" />
        <DialogPrimitive.Content
          className={cn(
            "fixed z-50 flex w-auto flex-col items-center justify-center gap-4 rounded-md bg-transparent p-6 shadow-none",
            "top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
          )}
        >
          <VisuallyHidden>
            <DialogPrimitive.Title>Loading</DialogPrimitive.Title>
          </VisuallyHidden>

          <Loader2 className="h-10 w-10 animate-spin text-white" />
          <p className="text-sm text-white">Loading ...</p>
        </DialogPrimitive.Content>
      </DialogPrimitive.Portal>
    </DialogPrimitive.Root>
  );
}
