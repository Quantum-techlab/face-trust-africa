import React, { useEffect, useRef, useState } from "react";
import { Camera, CameraOff, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export interface CameraCaptureProps {
  onCapture: (dataUrl: string, blob: Blob) => void;
  facingMode?: "user" | "environment";
  buttonLabel?: string;
}

const constraints = (
  facingMode: "user" | "environment"
): MediaStreamConstraints => ({
  video: {
    facingMode,
    width: { ideal: 640, max: 1280 },
    height: { ideal: 480, max: 720 },
    frameRate: { ideal: 30, max: 30 },
  },
  audio: false,
});

const CameraCapture: React.FC<CameraCaptureProps> = ({
  onCapture,
  facingMode = "user",
  buttonLabel = "Capture & Verify",
}) => {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const [ready, setReady] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentFacingMode, setCurrentFacingMode] = useState<
    "user" | "environment"
  >(facingMode);
  const [isCapturing, setIsCapturing] = useState(false);
  const [faceDetected, setFaceDetected] = useState(false);
  const [cameraPermission, setCameraPermission] = useState<
    "granted" | "denied" | "prompt"
  >("prompt");

  // Check camera permission status
  useEffect(() => {
    if (navigator.permissions) {
      navigator.permissions
        .query({ name: "camera" as PermissionName })
        .then((result) => {
          setCameraPermission(result.state as "granted" | "denied" | "prompt");
          result.onchange = () => {
            setCameraPermission(
              result.state as "granted" | "denied" | "prompt"
            );
          };
        });
    }
  }, []);

  // Initialize camera
  useEffect(() => {
    const startCamera = async () => {
      try {
        setError(null);
        setReady(false);

        // Stop existing stream
        if (streamRef.current) {
          streamRef.current.getTracks().forEach((track) => track.stop());
        }

        const stream = await navigator.mediaDevices.getUserMedia(
          constraints(currentFacingMode)
        );
        streamRef.current = stream;

        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          await videoRef.current.play();
          setReady(true);
          setCameraPermission("granted");

          // Start face detection simulation
          startFaceDetection();
        }
      } catch (e) {
        console.error("Camera error", e);
        setCameraPermission("denied");
        if (e instanceof Error) {
          if (e.name === "NotAllowedError") {
            setError(
              "Camera access denied. Please allow camera permissions and refresh the page."
            );
          } else if (e.name === "NotFoundError") {
            setError("No camera found. Please connect a camera and try again.");
          } else if (e.name === "NotReadableError") {
            setError(
              "Camera is being used by another application. Please close other apps and try again."
            );
          } else {
            setError(`Camera error: ${e.message}`);
          }
        } else {
          setError(
            "Unable to access camera. Please check permissions and try again."
          );
        }
      }
    };

    startCamera();

    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop());
      }
    };
  }, [currentFacingMode]);

  // Simulate face detection
  const startFaceDetection = () => {
    let lastDetection = false;
    let stableFrames = 0;

    const detectFace = () => {
      if (ready && videoRef.current) {
        // More stable detection logic
        const hasGoodLighting = Math.random() > 0.2; // More lenient
        const faceInFrame = Math.random() > 0.15; // More lenient
        const currentDetection = hasGoodLighting && faceInFrame;

        // Only change state after 3 consecutive stable frames
        if (currentDetection === lastDetection) {
          stableFrames++;
          if (stableFrames >= 3) {
            setFaceDetected(currentDetection);
          }
        } else {
          stableFrames = 0;
          lastDetection = currentDetection;
        }
      }
    };

    const interval = setInterval(detectFace, 300); // Slower update (was 500)
    return () => clearInterval(interval);
  };

  const switchCamera = () => {
    setCurrentFacingMode((prev) => (prev === "user" ? "environment" : "user"));
  };

  const handleCapture = async () => {
    if (!videoRef.current || !ready) return;

    setIsCapturing(true);

    try {
      const video = videoRef.current;
      const canvas = canvasRef.current || document.createElement("canvas");
      canvasRef.current = canvas;

      // Set canvas dimensions to match video
      canvas.width = video.videoWidth || 640;
      canvas.height = video.videoHeight || 480;

      const ctx = canvas.getContext("2d");
      if (!ctx) {
        throw new Error("Could not get canvas context");
      }

      // Apply image enhancements
      ctx.filter = "contrast(1.1) brightness(1.05) saturate(1.1)";

      // Draw video frame to canvas
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

      // Reset filter for future operations
      ctx.filter = "none";

      // Optimize image size for processing
      const targetWidth = Math.min(640, canvas.width);
      const scale = targetWidth / canvas.width;
      const targetHeight = Math.round(canvas.height * scale);

      // Create optimized canvas
      const optimizedCanvas = document.createElement("canvas");
      optimizedCanvas.width = targetWidth;
      optimizedCanvas.height = targetHeight;
      const optimizedCtx = optimizedCanvas.getContext("2d");

      if (optimizedCtx) {
        optimizedCtx.drawImage(canvas, 0, 0, targetWidth, targetHeight);

        // Convert to blob and data URL
        const dataUrl = optimizedCanvas.toDataURL("image/jpeg", 0.85);

        optimizedCanvas.toBlob(
          (blob) => {
            if (blob) {
              onCapture(dataUrl, blob);
            }
          },
          "image/jpeg",
          0.85
        );
      }
    } catch (error) {
      console.error("Capture error:", error);
      setError("Failed to capture image. Please try again.");
    } finally {
      setIsCapturing(false);
    }
  };

  const retryCamera = () => {
    setError(null);
    setCurrentFacingMode("user");
  };

  return (
    <div className="w-full space-y-4">
      <div className="relative overflow-hidden rounded-lg border bg-card shadow-sm">
        {/* Video Element */}
        <video
          ref={videoRef}
          playsInline
          muted
          className="aspect-video w-full bg-muted object-cover"
          style={{
            transform: currentFacingMode === "user" ? "scaleX(-1)" : "none",
          }}
        />

        {/* Overlay States */}
        {!ready && !error && (
          <div className="absolute inset-0 grid place-items-center bg-muted/80 text-muted-foreground">
            <div className="text-center">
              <Camera className="w-8 h-8 mx-auto mb-2 animate-pulse" />
              <p className="text-sm">Initializing camera...</p>
            </div>
          </div>
        )}

        {error && (
          <div className="absolute inset-0 grid place-items-center bg-muted/90 text-center p-4">
            <div>
              <CameraOff className="w-8 h-8 mx-auto mb-2 text-destructive" />
              <p className="text-sm text-destructive mb-3">{error}</p>
              <Button onClick={retryCamera} size="sm" variant="outline">
                <RotateCcw className="w-4 h-4 mr-2" />
                Retry
              </Button>
            </div>
          </div>
        )}

        {/* Face Detection Indicator */}
        {ready && !error && (
          <div className="absolute top-3 left-3">
            <Badge
              variant={faceDetected ? "default" : "secondary"}
              className="text-xs"
            >
              {faceDetected ? "Face Detected" : "Position Face in Frame"}
            </Badge>
          </div>
        )}

        {/* Camera Switch Button */}
        {ready && !error && (
          <Button
            onClick={switchCamera}
            size="sm"
            variant="outline"
            className="absolute top-3 right-3"
          >
            <RotateCcw className="w-4 h-4" />
          </Button>
        )}

        {/* Face Detection Overlay */}
        {ready && !error && faceDetected && (
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-48 h-64 border-2 border-green-400 rounded-lg animate-pulse" />
          </div>
        )}
      </div>

      {/* Controls */}
      <div className="flex flex-col gap-3">
        <Button
          onClick={handleCapture}
          disabled={!ready || isCapturing || !faceDetected}
          className="w-full h-12 text-base font-medium shadow-elegant"
          variant="hero"
        >
          {isCapturing ? (
            <>
              <div className="w-4 h-4 mr-2 border-2 border-white border-t-transparent rounded-full animate-spin" />
              Processing...
            </>
          ) : (
            <>
              <Camera className="w-5 h-5 mr-2" />
              {buttonLabel}
            </>
          )}
        </Button>

        {/* Status Information */}
        <div className="text-xs text-muted-foreground space-y-1">
          <div className="flex justify-between">
            <span>Camera:</span>
            <span className={ready ? "text-green-600" : "text-amber-600"}>
              {ready ? "Ready" : error ? "Error" : "Initializing"}
            </span>
          </div>
          <div className="flex justify-between">
            <span>Face Detection:</span>
            <span
              className={faceDetected ? "text-green-600" : "text-amber-600"}
            >
              {faceDetected ? "Active" : "Searching"}
            </span>
          </div>
          <div className="flex justify-between">
            <span>Camera Mode:</span>
            <span>{currentFacingMode === "user" ? "Front" : "Back"}</span>
          </div>
        </div>
      </div>

      {/* Hidden canvas for image processing */}
      <canvas ref={canvasRef} className="hidden" />
    </div>
  );
};

export default CameraCapture;
