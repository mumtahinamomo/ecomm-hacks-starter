import { useState, useRef, useCallback, useEffect } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Camera, RotateCcw, Check, X } from "lucide-react";

interface CameraCaptureProps {
  onCapture: (imageData: string) => void;
  onClose: () => void;
}

export const CameraCapture = ({ onCapture, onClose }: CameraCaptureProps) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const startCamera = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "user", width: 640, height: 480 },
      });
      setStream(mediaStream);
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
      }
      setIsLoading(false);
    } catch (err) {
      setError("Unable to access camera. Please check permissions.");
      setIsLoading(false);
    }
  }, []);

  const stopCamera = useCallback(() => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
      setStream(null);
    }
  }, [stream]);

  const capturePhoto = useCallback(() => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      const ctx = canvas.getContext("2d");
      if (ctx) {
        ctx.drawImage(video, 0, 0);
        const imageData = canvas.toDataURL("image/jpeg", 0.8);
        setCapturedImage(imageData);
        stopCamera();
      }
    }
  }, [stopCamera]);

  const retakePhoto = useCallback(() => {
    setCapturedImage(null);
    startCamera();
  }, [startCamera]);

  const confirmPhoto = useCallback(() => {
    if (capturedImage) {
      onCapture(capturedImage);
    }
  }, [capturedImage, onCapture]);

  const handleClose = useCallback(() => {
    stopCamera();
    onClose();
  }, [stopCamera, onClose]);

  // Start camera on mount
  useEffect(() => {
    startCamera();
    return () => {
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className="relative bg-secondary rounded-xl overflow-hidden"
    >
      {/* Close button */}
      <Button
        onClick={handleClose}
        variant="ghost"
        size="icon"
        className="absolute top-2 right-2 z-10 bg-background/50 hover:bg-background/70"
      >
        <X className="w-4 h-4" />
      </Button>

      {/* Video/Image display */}
      <div className="aspect-[4/3] bg-muted relative overflow-hidden">
        {isLoading && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
          </div>
        )}

        {error && (
          <div className="absolute inset-0 flex items-center justify-center p-4 text-center">
            <p className="text-destructive text-sm">{error}</p>
          </div>
        )}

        {capturedImage ? (
          <img
            src={capturedImage}
            alt="Captured"
            className="w-full h-full object-cover"
          />
        ) : (
          <video
            ref={videoRef}
            autoPlay
            playsInline
            muted
            onLoadedData={() => setIsLoading(false)}
            className="w-full h-full object-cover -scale-x-100"
          />
        )}

        <canvas ref={canvasRef} className="hidden" />
      </div>

      {/* Controls */}
      <div className="p-4 flex justify-center gap-4">
        {capturedImage ? (
          <>
            <Button
              onClick={retakePhoto}
              variant="outline"
              className="flex items-center gap-2"
            >
              <RotateCcw className="w-4 h-4" />
              Retake
            </Button>
            <Button
              onClick={confirmPhoto}
              className="flex items-center gap-2 bg-primary text-primary-foreground"
            >
              <Check className="w-4 h-4" />
              Use Photo
            </Button>
          </>
        ) : (
          <Button
            onClick={capturePhoto}
            disabled={isLoading || !!error}
            className="flex items-center gap-2 bg-primary text-primary-foreground"
          >
            <Camera className="w-4 h-4" />
            Capture
          </Button>
        )}
      </div>
    </motion.div>
  );
};
