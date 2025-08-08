import React, { useEffect, useRef, useState } from "react";

export interface CameraCaptureProps {
  onCapture: (dataUrl: string, blob: Blob) => void;
  facingMode?: "user" | "environment";
  buttonLabel?: string;
}

const constraints = (facingMode: "user" | "environment"): MediaStreamConstraints => ({
  video: { facingMode, width: { ideal: 640 }, height: { ideal: 480 } },
  audio: false,
});

const CameraCapture: React.FC<CameraCaptureProps> = ({ onCapture, facingMode = "user", buttonLabel = "Capture" }) => {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const [ready, setReady] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const start = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia(constraints(facingMode));
        streamRef.current = stream;
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          await videoRef.current.play();
          setReady(true);
        }
      } catch (e) {
        console.error("Camera error", e);
        setError("Unable to access camera. Check permissions.");
      }
    };
    start();
    return () => {
      streamRef.current?.getTracks().forEach((t) => t.stop());
    };
  }, [facingMode]);

  const handleCapture = async () => {
    if (!videoRef.current) return;
    const video = videoRef.current;
    const canvas = document.createElement("canvas");
    canvas.width = video.videoWidth || 640;
    canvas.height = video.videoHeight || 480;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Downscale to optimize bandwidth/CPU
    const targetW = Math.min(480, canvas.width);
    const scale = targetW / canvas.width;
    const targetH = Math.round(canvas.height * scale);
    canvas.width = targetW;
    canvas.height = targetH;

    ctx.drawImage(video, 0, 0, targetW, targetH);
    const dataUrl = canvas.toDataURL("image/jpeg", 0.85);
    const blob = await new Promise<Blob | null>((resolve) => canvas.toBlob((b) => resolve(b), "image/jpeg", 0.85));
    if (!blob) return;
    onCapture(dataUrl, blob);
  };

  return (
    <div className="w-full">
      <div className="relative overflow-hidden rounded-lg border bg-card shadow-sm">
        <video
          ref={videoRef}
          playsInline
          muted
          className="aspect-video w-full bg-muted object-cover"
        />
        {!ready && !error && (
          <div className="absolute inset-0 grid place-items-center text-muted-foreground text-sm">Initializing camera…</div>
        )}
        {error && (
          <div className="absolute inset-0 grid place-items-center text-destructive text-sm">{error}</div>
        )}
      </div>
      <div className="mt-3 flex justify-center">
        <button
          type="button"
          onClick={handleCapture}
          className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 bg-primary text-primary-foreground hover:bg-primary/90 h-11 px-6 shadow-elegant"
        >
          {buttonLabel}
        </button>
      </div>
    </div>
  );
};

export default CameraCapture;
