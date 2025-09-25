"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { PlayIcon, StopIcon } from "@heroicons/react/24/solid";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
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
import ErrorDialog from "@/components/ui/error-dialog"; // Import ErrorDialog

import StreamViewer from "@/utils/streamviewer";
import { Badge } from "@/components/ui/badge";
import { Loader2 } from "lucide-react";
import { startSystem, stopSystem } from "./api";
import { Settings as SettingsIcon } from "lucide-react";
import { SuccessResponse } from "@/lib/api-response";
import { StartSystemResponse } from "./types";

export default function StreamingPage() {
  const [isStreaming, setIsStreaming] = useState(true);
  const [isStarting, setIsStarting] = useState(false);
  const [isStopping, setIsStopping] = useState(false);
  const [cameraIndex, setCameraIndex] = useState(0);

  // State untuk error dialog
  const [errorOpen, setErrorOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const handleStart = async () => {
    try {
      setIsStarting(true);
      const result = await startSystem(cameraIndex);

      if ("error" in result && result.error) {
        throw result;
      }

      // OKE
      // const successResult = result as SuccessResponse<StartSystemResponse>;
      // console.log(
      //   "Kamera berhasil dimulai di index:",
      //   successResult.data.camera_index
      // );

      setIsStreaming(true);
    } catch (error) {
      if (typeof error === "object" && error !== null && "message" in error) {
        setErrorMessage((error as { message: string }).message);
      } else {
        setErrorMessage("Terjadi kesalahan yang tidak diketahui");
      }
      setErrorOpen(true);
    } finally {
      setIsStarting(false);
    }
  };

  const handleStop = async () => {
    try {
      setIsStopping(true);
      const result = await stopSystem(cameraIndex);

      if ("error" in result && result.error) {
        throw result;
      }

      setIsStreaming(false);
    } catch (error) {
      console.error("Gagal menghentikan sistem:", error);

      if (typeof error === "object" && error !== null && "message" in error) {
        setErrorMessage((error as { message: string }).message);
      } else {
        setErrorMessage("Terjadi kesalahan yang tidak diketahui");
      }

      setErrorOpen(true);
    } finally {
      setIsStopping(false);
    }
  };

  return (
    <div className="w-full px-4 py-6 flex justify-center">
      <div className="w-full max-w-screen-lg space-y-8">
        {/* Error Dialog */}
        <ErrorDialog
          open={errorOpen}
          message={errorMessage}
          onClose={() => setErrorOpen(false)}
        />

        {/* Control Panel */}
        <div className="w-full flex flex-row items-strech gap-6">
          {/* Status Card */}
          <Card className="shadow-md border border-gray-200 rounded-2xl flex-2">
            <CardHeader className="flex flex-row justify-between items-center">
              <div>
                <CardTitle className="text-xl font-semibold">
                  System Status
                </CardTitle>
                <CardDescription className="text-sm text-gray-500">
                  Current AI system status information.
                </CardDescription>
              </div>
              <Badge
                className={
                  (isStreaming
                    ? "border-green-600 text-green-600"
                    : "border-gray-400 text-gray-500") +
                  " border px-4 py-1 rounded-full text-sm bg-transparent"
                }
              >
                {isStreaming ? "System is Running" : "System is Idle"}
              </Badge>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-4">
                <Button
                  onClick={handleStart}
                  disabled={isStreaming || isStarting || isStopping}
                  className="bg-amber-600 hover:bg-amber-700 text-white"
                >
                  {isStarting ? (
                    <>
                      <Loader2 className="animate-spin mr-2 h-4 w-4" />
                      Starting...
                    </>
                  ) : (
                    <>
                      <PlayIcon className="mr-2 h-5 w-5" />
                      Start System
                    </>
                  )}
                </Button>

                <Button
                  onClick={handleStop}
                  disabled={!isStreaming || isStarting || isStopping}
                  className="bg-amber-600 hover:bg-amber-700 text-white"
                >
                  {isStopping ? (
                    <>
                      <Loader2 className="animate-spin mr-2 h-4 w-4" />
                      Stopping...
                    </>
                  ) : (
                    <>
                      <StopIcon className="mr-2 h-5 w-5" />
                      Stop System
                    </>
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Camera Settings */}
          <Card className="shadow-md border border-gray-200 rounded-2xl flex-1">
            <CardHeader>
              <CardTitle className="text-xl font-semibold">
                Camera Settings
              </CardTitle>
              <CardDescription className="text-sm text-gray-500">
                Set camera & AI system configuration.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div>
                <Dialog>
                  <DialogTrigger asChild>
                    <Button className="bg-gray-700 hover:bg-black text-white">
                      <SettingsIcon className="mr-2 h-5 w-5" />
                      Settings
                    </Button>
                  </DialogTrigger>

                  <DialogContent className="max-w-2xl w-full transition-all duration-400 ease-out animate-in fade-in zoom-in-50">
                    <DialogHeader>
                      <DialogTitle>Camera Settings</DialogTitle>
                      <DialogDescription>
                        Set camera and AI system parameters here.
                      </DialogDescription>
                    </DialogHeader>

                    <div className="grid w-full max-w-40 items-center gap-2">
                      <Label htmlFor="camera-index">Camera Index</Label>
                      <Input
                        type="number"
                        id="camera-index"
                        placeholder="Contoh: 0"
                        value={cameraIndex}
                        onChange={(e) => setCameraIndex(Number(e.target.value))}
                      />
                    </div>

                    <div className="grid w-full max-w-40 items-start gap-2">
                      <Label htmlFor="roi-canvas">Detection Zone</Label>

                      <canvas
                        id="roi-canvas"
                        width={320}
                        height={240}
                        className="border border-dashed border-gray-400 rounded"
                      ></canvas>

                      <p className="text-xs text-muted-foreground">
                        Klik dan seret untuk menggambar zona deteksi.
                      </p>
                    </div>

                    <DialogFooter>
                      <DialogClose asChild>
                        <Button variant="outline">Cancel</Button>
                      </DialogClose>
                      <Button>Save</Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Streaming View */}
        <Card className="shadow-md border border-gray-200 rounded-2xl">
          <CardHeader>
            <CardTitle className="text-xl">Video Streaming</CardTitle>
            <CardDescription>
              View the real-time AI inference stream output.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="rounded-lg border border-gray-300 overflow-hidden bg-black min-h-[400px] flex justify-center items-center">
              {isStreaming ? (
                <StreamViewer cameraIndex={0} />
              ) : (
                <p className="text-gray-400 text-center">System not running.</p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
