"use client";

import { useState } from "react";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { addCamera } from "../api";
import { useEffect } from "react";
import ErrorDialog from "@/components/ui/error-dialog";
import { ErrorResponse } from "@/lib/api-response";
import { SystemConfigurations } from "../types";

interface AddCamDialogProps {
  onSuccess?: () => void;
}

export default function AddCamDialog({ onSuccess }: AddCamDialogProps) {
  const [cameraIndex, setCameraIndex] = useState<number | null>(null);
  const [nameAlias, setNameAlias] = useState<string>("");
  const [open, setOpen] = useState(false);
  const [errorOpen, setErrorOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (open) {
      setCameraIndex(null);
      setNameAlias("");
    }
  }, [open]);

  const handleSave = async () => {
    if (cameraIndex === null || nameAlias.trim() === "") {
      return;
    }
    setIsLoading(true);
    try {
      const config: SystemConfigurations = {
        camera_index: cameraIndex,
        name_alias: nameAlias.trim(),
      };

      const result = await addCamera(config);
      if ("success" in result && result.success) {
        setOpen(false);
        if (onSuccess) onSuccess();
      } else {
        throw result;
      }
    } catch (error) {
      const err = error as ErrorResponse;
      setErrorMessage(err.message ?? "Unknown Error");
      setErrorOpen(true);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <ErrorDialog
        open={errorOpen}
        message={errorMessage}
        onClose={() => setErrorOpen(false)}
      />

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button
            variant="secondary"
            onClick={() => setOpen(true)} // buka dialog manual
            className="bg-slate-700 hover:bg-slate-600 text-white text-sm font-medium px-4 py-2 rounded-lg shadow-sm transition"
          >
            + Add Camera
          </Button>
        </DialogTrigger>

        <DialogContent className="w-auto transition-all duration-400 ease-out animate-in fade-in zoom-in-50">
          <DialogHeader>
            <DialogTitle>Add Camera</DialogTitle>
            <DialogDescription>
              Set camera and AI system parameters here.
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            <div className="flex flex-row gap-5">
              <div className="grid w-full max-w-30 items-center gap-2">
                <Label htmlFor="camera-index">Camera Index</Label>
                <Input
                  type="number"
                  id="camera-index"
                  placeholder="Example: 0"
                  value={cameraIndex ?? ""} // fallback ke string kosong kalau null
                  onChange={(e) => setCameraIndex(Number(e.target.value))}
                />
              </div>

              <div className="grid w-full max-w-60 items-center gap-2">
                <Label htmlFor="camera-index">Name Alias</Label>
                <Input
                  type="text"
                  id="camera-index"
                  placeholder="Example: Enterance Room Cam"
                  value={nameAlias}
                  onChange={(e) => setNameAlias(e.target.value)}
                />
              </div>
            </div>

            <div className="grid w-full items-start gap-2">
              <Label htmlFor="roi-canvas">Detection Zone</Label>
              <canvas
                id="roi-canvas"
                width={320}
                height={240}
                className="border border-dashed border-gray-400 rounded"
              />
              <p className="text-xs text-muted-foreground">
                Klik dan seret untuk menggambar zona deteksi.
              </p>
            </div>
          </div>

          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">Cancel</Button>
            </DialogClose>
            <Button onClick={handleSave} disabled={isLoading}>
              {isLoading ? "Saving..." : "Save"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
