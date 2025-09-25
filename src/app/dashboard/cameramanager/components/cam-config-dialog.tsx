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
import { InfoIcon, Trash2Icon } from "lucide-react";
import { SystemConfigurations } from "../types";

export default function CamSettingDialog({
  camera_index,
  name_alias,
}: SystemConfigurations) {
  const [cameraIndex, setCameraIndex] = useState<number>(camera_index);
  const [nameAlias, setNameAlias] = useState<string>(name_alias);

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" className="text-gray-500">
          <InfoIcon className="h-5 w-5" />
        </Button>
      </DialogTrigger>

      <DialogContent className="w-auto transition-all duration-400 ease-out animate-in fade-in zoom-in-50">
        <DialogHeader className="relative">
          <DialogTitle className="flex items-center justify-between">
            <span>Configuration Information</span>
          </DialogTitle>
          <DialogDescription>
            See camera and AI system configuration here
            <span className="text-[10px] text-amber-500"> (read only).</span>
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          <div className="flex flex-row gap-10">
            <div className="grid w-full max-w-40 items-center gap-2">
              <Label htmlFor="camera-index">Camera Index</Label>
              <Input
                type="number"
                id="camera-index"
                placeholder="Contoh: 0"
                value={cameraIndex}
                disabled
                className="text-black bg-gray-200 cursor-not-allowed"
              />
            </div>

            <div className="grid w-full max-w-40 items-center gap-2">
              <Label htmlFor="camera-index">Name Alias</Label>
              <Input
                type="text"
                id="camera-index"
                placeholder="Name Alias"
                value={nameAlias}
                disabled
                className="text-black bg-gray-200 cursor-not-allowed"
              />
            </div>
          </div>

          <div className="grid au items-start gap-2">
            <Label htmlFor="roi-canvas">Detection Zone</Label>
            <canvas
              id="roi-canvas"
              width={320}
              height={240}
              className="border border-dashed border-gray-400 rounded"
            />
            <p className="text-xs text-muted-foreground">
              Click and drag to draw the detection zone.
            </p>
          </div>
        </div>

        <DialogFooter>
          {/* <Button
            variant="ghost"
            size="icon"
            className="text-red-500 hover:bg-red-100 "
            onClick={() => {
              // Aksi delete kamu di sini
              console.log("Delete clicked");
            }}
          >
            <Trash2Icon className="w-5 h-5" />
          </Button> */}
          <Button
            variant="outline"
            className="text-red-400 hover:text-red-500 border-red-200"
          >
            Delete
          </Button>
          <DialogClose asChild>
            <Button>Close</Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
