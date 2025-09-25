"use client";

import { useState } from "react";
import {
  PlayIcon,
  StopIcon,
  ChevronDownIcon,
  ChevronUpIcon,
} from "@heroicons/react/24/solid";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Loader2, InfoIcon } from "lucide-react";

import ErrorDialog from "@/components/ui/error-dialog";
import StreamViewer from "@/utils/streamviewer";
import { startSystem, stopSystem } from "../api";
import { useEffect, useRef } from "react";
import { CameraStatus } from "../types";
import CamSettingDialog from "./cam-config-dialog";

export default function CameraControlPanel({
  camera_index,
  is_system_running,
  name_alias,
}: CameraStatus) {
  const [cameraIndex, setCameraIndex] = useState(camera_index);
  const [isSystemActive, setIsSystemActive] = useState(is_system_running);
  const [isStreaming, setIsStreaming] = useState(false);
  const [isStarting, setIsStarting] = useState(false);
  const [isStopping, setIsStopping] = useState(false);
  const [errorOpen, setErrorOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [isExpanded, setIsExpanded] = useState(false);
  const [nameAlias, setNameAlias] = useState<string>(name_alias);

  useEffect(() => {
    if (isSystemActive) {
      setIsStreaming(true);
      setIsExpanded(true); // auto-expand stream panel
    }
  }, [isSystemActive]);

  const handleStart = async () => {
    try {
      setIsStarting(true);
      const result = await startSystem(cameraIndex);
      if ("error" in result && result.error) throw result;
      setIsStreaming(true);
      setIsSystemActive(true);
      setIsExpanded(true);
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
      if ("error" in result && result.error) throw result;
      setIsStreaming(false);
      setIsSystemActive(false);
    } catch (error) {
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
    <div>
      <ErrorDialog
        open={errorOpen}
        message={errorMessage}
        onClose={() => setErrorOpen(false)}
      />

      <Card className="shadow-md border border-gray-200 rounded-2xl">
        <CardHeader className="flex flex-row justify-between items-start">
          {/* Title + Status */}
          <div className="flex flex-col sm:flex-row sm:items-center gap-4">
            <div>
              <CardTitle className="text-xl font-semibold">
                {`Camera ${cameraIndex}`}
              </CardTitle>
              <CardDescription>{nameAlias}</CardDescription>
            </div>

            <Badge
              className={`${
                isSystemActive
                  ? "border-green-600 text-green-600"
                  : "border-gray-400 text-gray-500"
              } border px-4 py-1 rounded-full text-sm bg-transparent`}
            >
              {isSystemActive ? "Running" : "Idle"}
            </Badge>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-3">
            <div className="flex flex-wrap gap-4">
              <Button
                onClick={handleStart}
                disabled={isSystemActive || isStarting || isStopping}
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
                    Start
                  </>
                )}
              </Button>

              <Button
                onClick={handleStop}
                disabled={!isSystemActive || isStarting || isStopping}
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
                    Stop
                  </>
                )}
              </Button>
            </div>

            {/* Settings Dialog */}
            <CamSettingDialog
              camera_index={cameraIndex}
              name_alias={nameAlias}
            />

            {/* Expand Toggle */}
            <Button
              variant="ghost"
              onClick={() => setIsExpanded(!isExpanded)}
              className="text-gray-600 hover:text-black"
            >
              {isExpanded ? <ChevronUpIcon /> : <ChevronDownIcon />}
            </Button>
          </div>
        </CardHeader>

        {/* Expanded Section */}
        <div
          className={`transition-all duration-300 ease-in-out overflow-hidden ${
            isExpanded
              ? "max-h-[auto] opacity-100 py-2"
              : "max-h-0 opacity-0 py-0"
          }`}
        >
          <CardContent className="flex flex-col gap-4">
            <Card className="shadow-md border border-gray-200 rounded-2xl">
              <CardHeader className="flex flex-row gap-5 w-full justify-between items-center">
                <div>
                  <CardTitle>Live Stream</CardTitle>
                  <CardDescription>Real-time stream output</CardDescription>
                </div>
                {/* <Button
                  // onClick={handleStart}
                  disabled={!isSystemActive || isStarting || isStopping}
                  className="bg-blue-600 hover:bg-blue-700 text-white"
                >
                  {isStarting ? (
                    <>
                      <Loader2 className="animate-spin mr-2 h-4 w-4" />
                      Starting...
                    </>
                  ) : (
                    <>
                      <PlayIcon className="mr-2 h-5 w-5" />
                      Start Video Streaming
                    </>
                  )}
                </Button> */}
              </CardHeader>
              <CardContent>
                <div className="rounded-lg border border-gray-300 bg-black min-h-[400px] flex justify-center items-center">
                  {isStreaming ? (
                    <StreamViewer cameraIndex={cameraIndex} />
                  ) : (
                    <p className="text-gray-400 text-center">
                      System not running.
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>
          </CardContent>
        </div>
      </Card>
    </div>
  );
}
