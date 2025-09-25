"use client";

import { useEffect, useState } from "react";
import CameraControlPanel from "./components/cam-control-panel";
import { getSync } from "./api";
import { CameraStatus } from "./types";
import AddCamDialog from "./components/add-cam-dialog";
import { ErrorResponse } from "@/lib/api-response";
import ErrorDialog from "@/components/ui/error-dialog";
import LoadingDialog from "@/components/ui/loading-dialog";

export default function StreamingPage() {
  const [cameraList, setCameraList] = useState<CameraStatus[]>([]);
  const [activeCount, setActiveCount] = useState(0);
  const [errorOpen, setErrorOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [isLoadingSekleton, setLoadingSekleton] = useState(false);

  useEffect(() => {
    // Dummy camera data
    const dummyCam = {
      camera_index: 0,
      name_alias: "Dummy Camera 1",
      is_system_running: true,
    };

    setCameraList([dummyCam]);
    setActiveCount(1);
  }, []);

  return (
    <div>
      <LoadingDialog open={isLoadingSekleton} />

      <ErrorDialog
        open={errorOpen}
        message={errorMessage}
        onClose={() => setErrorOpen(false)}
      />
      {/* Summary Section */}
      <div className="flex flex-col md:flex-row justify-between items-center gap-4 px-6 py-4 bg-slate-100 rounded-b-xl border-t border-slate-200">
        <p className="text-sm text-slate-600">
          Camera Amount:{" "}
          <span className="font-semibold text-slate-800">
            {cameraList.length}
          </span>{" "}
          | Camera Active:{" "}
          <span className="font-semibold text-green-600">{activeCount}</span>
        </p>
      </div>

      {/* Camera Panels */}
      <div className="w-full px-4 py-6 flex justify-center flex-col">
        <div className="w-full max-w-screen-xl space-y-4">
          {cameraList.map((cam) => (
            <CameraControlPanel
              key={cam.camera_index}
              camera_index={cam.camera_index}
              name_alias={cam.name_alias || `Camera ${cam.camera_index}`}
              is_system_running={cam.is_system_running}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
