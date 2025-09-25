/* eslint-disable @next/next/no-img-element */
"use client";

import { useEffect, useRef } from "react";

interface Box {
  x1: number;
  y1: number;
  x2: number;
  y2: number;
  label: string;
  score: number;
  track_id?: number; // optional, hanya untuk person
}

interface StreamViewerProps {
  cameraIndex?: number; // optional, default to 0
}

export default function StreamViewer({ cameraIndex = 0 }: StreamViewerProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const ws = useRef<WebSocket | null>(null);

  useEffect(() => {
    const wsUrl = `ws://localhost:8000/ws/view`;
    ws.current = new WebSocket(wsUrl);

    ws.current.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        const imgB64 = data.image;
        const metadata = data.metadata;

        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        const img = new Image();
        img.onload = () => {
          // Clear canvas
          ctx.clearRect(0, 0, canvas.width, canvas.height);
          // Draw image
          ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

          // Draw bounding boxes
          if (metadata && metadata.boxes) {
            metadata.boxes.forEach((box: Box) => {
              const isPerson = box.label === "person";
              ctx.strokeStyle = isPerson ? "blue" : "red";
              ctx.lineWidth = 2;
              ctx.strokeRect(box.x1, box.y1, box.x2 - box.x1, box.y2 - box.y1);

              // Draw label + optional track_id
              ctx.fillStyle = isPerson ? "blue" : "red";
              ctx.font = "16px Arial";
              const text = isPerson
                ? `person ${box.track_id ?? "?"} ${Math.round(
                    box.score * 100
                  )}%`
                : `${box.label} ${Math.round(box.score * 100)}%`;
              ctx.fillText(text, box.x1, box.y1 - 5);
            });
          }
        };
        img.src = "data:image/jpeg;base64," + imgB64;
      } catch (e) {
        console.error("Failed to parse frame", e);
      }
    };

    return () => {
      ws.current?.close();
    };
  }, [cameraIndex]);

  return (
    <div className="w-auto h-auto max-w-full">
      <canvas
        ref={canvasRef}
        // width={360}
        // height={640}
        width={640}
        height={360}
        // width={480}
        // height={854}
        className="rounded shadow-lg"
      />
    </div>
  );
}
