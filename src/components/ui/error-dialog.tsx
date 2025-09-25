// components/ui/error-dialog.tsx
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { AlertCircle } from "lucide-react";

interface ErrorDialogProps {
  open: boolean;
  onClose: () => void;
  message: string;
}

export default function ErrorDialog({
  open,
  onClose,
  message,
}: ErrorDialogProps) {
  return (
    <Dialog open={open} onOpenChange={(isOpen) => !isOpen && onClose()}>
      <DialogContent className="w-full transition-all duration-300 ease-out animate-in fade-in zoom-in-50">
        <DialogHeader>
          <div className="flex items-center gap-2">
            <AlertCircle className="h-6 w-6 text-red-700" />
            <DialogTitle className="text-red-700">Oops...</DialogTitle>
          </div>
        </DialogHeader>

        <div className="py-4 text-gray-700">{message}</div>

        <div className="flex justify-end">
          <Button
            type="button"
            className="bg-red-700 hover:bg-red-900"
            onClick={onClose}
          >
            Close
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
