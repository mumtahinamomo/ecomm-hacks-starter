import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, ChevronLeft, ChevronRight, Sparkles } from "lucide-react";
import { Button } from "./ui/button";
import { Product } from "@/hooks/useProducts";
import { TryOnModal } from "./TryOnModal";
import { SizeChart } from "./SizeChart";
import { Size, calculateRecommendedSize } from "@/utils/sizeCalculator";
import { Switch } from "./ui/switch";
import { Label } from "./ui/label";

interface ImageGalleryModalProps {
  images: string[];
  productName: string;
  isOpen: boolean;
  onClose: () => void;
  product: Product;
}

interface BodyMetrics {
  waist_cm?: number;
  hip_cm?: number;
}

export const ImageGalleryModal = ({
  images,
  productName,
  isOpen,
  onClose,
  product,
}: ImageGalleryModalProps) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showTryOnModal, setShowTryOnModal] = useState(false);
  const [generatedImages, setGeneratedImages] = useState<string[]>([]);
  const [viewMode, setViewMode] = useState<"original" | "tryOn">("original");
  const [recommendedSize, setRecommendedSize] = useState<Size | null>(null);
  const [showSizeChart, setShowSizeChart] = useState(false);
  const [bodyMetrics, setBodyMetrics] = useState<BodyMetrics>({});

  // Determine which images to display based on view mode
  const displayImages = viewMode === "tryOn" && generatedImages.length > 0 ? generatedImages : images;
  const hasGeneratedImages = generatedImages.length > 0;

  // Reset state when modal closes
  useEffect(() => {
    if (!isOpen) {
      setCurrentIndex(0);
      setViewMode("original");
      setShowSizeChart(false);
    }
  }, [isOpen]);

  // Calculate size when metrics change
  useEffect(() => {
    if (bodyMetrics.waist_cm || bodyMetrics.hip_cm) {
      const size = calculateRecommendedSize(bodyMetrics.waist_cm, bodyMetrics.hip_cm);
      setRecommendedSize(size);
    }
  }, [bodyMetrics]);

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev === 0 ? displayImages.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev === displayImages.length - 1 ? 0 : prev + 1));
  };

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const handleTryOnClick = () => {
    setShowTryOnModal(true);
  };

  const handleTryOnComplete = (images: string[], metrics: BodyMetrics) => {
    setGeneratedImages(images);
    setBodyMetrics(metrics);
    setViewMode("tryOn");
    setCurrentIndex(0);
    setShowTryOnModal(false);
  };

  const handleViewModeToggle = (checked: boolean) => {
    setViewMode(checked ? "tryOn" : "original");
    setCurrentIndex(0);
  };

  if (!isOpen) return null;

  return (
    <>
      <AnimatePresence>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-background/90 backdrop-blur-sm"
          onClick={handleBackdropClick}
        >
          {/* Close Button */}
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="absolute top-4 right-4 z-10 text-foreground hover:bg-muted"
          >
            <X className="w-6 h-6" />
          </Button>

          {/* View Mode Toggle - Show only when generated images exist */}
          {hasGeneratedImages && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="absolute top-4 left-1/2 -translate-x-1/2 z-10 flex items-center gap-3 bg-background/80 backdrop-blur-md border border-border/50 rounded-full px-4 py-2"
            >
              <Label 
                htmlFor="view-toggle" 
                className={`text-sm cursor-pointer transition-colors ${viewMode === "original" ? "text-foreground font-medium" : "text-muted-foreground"}`}
              >
                Original
              </Label>
              <Switch
                id="view-toggle"
                checked={viewMode === "tryOn"}
                onCheckedChange={handleViewModeToggle}
              />
              <Label 
                htmlFor="view-toggle" 
                className={`text-sm cursor-pointer transition-colors ${viewMode === "tryOn" ? "text-foreground font-medium" : "text-muted-foreground"}`}
              >
                My Look
              </Label>
            </motion.div>
          )}

          {/* Navigation Arrows */}
          {displayImages.length > 1 && (
            <>
              <Button
                variant="ghost"
                size="icon"
                onClick={handlePrev}
                className="absolute left-4 z-10 text-foreground hover:bg-muted"
              >
                <ChevronLeft className="w-8 h-8" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={handleNext}
                className="absolute right-4 z-10 text-foreground hover:bg-muted"
              >
                <ChevronRight className="w-8 h-8" />
              </Button>
            </>
          )}

          {/* Main Image */}
          <motion.div
            key={`${viewMode}-${currentIndex}`}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="max-w-4xl max-h-[85vh] px-16"
          >
            <img
              src={displayImages[currentIndex]}
              alt={`${productName} - Image ${currentIndex + 1}`}
              className="max-w-full max-h-[80vh] object-contain rounded-lg shadow-2xl"
            />
          </motion.div>

          {/* Thumbnail Strip */}
          {displayImages.length > 1 && (
            <div className="absolute bottom-6 flex gap-3">
              {displayImages.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setCurrentIndex(idx)}
                  className={`w-16 h-20 rounded-md overflow-hidden border-2 transition-all ${
                    idx === currentIndex
                      ? "border-primary opacity-100"
                      : "border-transparent opacity-60 hover:opacity-100"
                  }`}
                >
                  <img
                    src={img}
                    alt={`Thumbnail ${idx + 1}`}
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>
          )}

          {/* AI Virtual Try-On Prompt - Only show when no generated images */}
          {!hasGeneratedImages && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3, duration: 0.4 }}
              className="absolute bottom-8 right-8 flex items-center gap-3 cursor-pointer"
              onClick={handleTryOnClick}
            >
              {/* Speech Bubble */}
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.5, duration: 0.3 }}
                className="bg-background/80 backdrop-blur-md border border-border/50 rounded-2xl rounded-br-sm px-4 py-3 shadow-lg max-w-[200px]"
              >
                <p className="text-sm font-medium text-foreground leading-snug">
                  Try this new look using AI virtual try on
                </p>
              </motion.div>

              {/* Pulsing AI Circle */}
              <motion.div
                animate={{ scale: [0.95, 1.08, 0.95] }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
                className="w-14 h-14 rounded-full bg-primary flex items-center justify-center shadow-lg shadow-primary/30"
              >
                <Sparkles className="w-6 h-6 text-primary-foreground" />
              </motion.div>
            </motion.div>
          )}

          {/* Size Recommendation Bubble - Show when viewing try-on images */}
          {hasGeneratedImages && viewMode === "tryOn" && recommendedSize && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3, duration: 0.4 }}
              className="absolute bottom-8 right-8 flex flex-col items-end gap-3"
            >
              {/* Size Chart (Collapsible) */}
              <AnimatePresence>
                {showSizeChart && (
                  <SizeChart recommendedSize={recommendedSize} />
                )}
              </AnimatePresence>

              {/* Size Recommendation Bubble */}
              <motion.div
                className="flex items-center gap-3 cursor-pointer"
                onClick={() => setShowSizeChart(!showSizeChart)}
              >
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="bg-background/80 backdrop-blur-md border border-border/50 rounded-2xl rounded-br-sm px-4 py-3 shadow-lg max-w-[220px]"
                >
                  <p className="text-sm font-medium text-foreground leading-snug">
                    It looks like a size <span className="text-primary font-bold">{recommendedSize}</span> would be perfect for you!
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    {showSizeChart ? "Hide" : "See"} sizing chart
                  </p>
                </motion.div>

                <motion.div
                  animate={{ scale: [0.95, 1.08, 0.95] }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                  className="w-14 h-14 rounded-full bg-primary flex items-center justify-center shadow-lg shadow-primary/30"
                >
                  <Sparkles className="w-6 h-6 text-primary-foreground" />
                </motion.div>
              </motion.div>
            </motion.div>
          )}
        </motion.div>
      </AnimatePresence>

      {/* Try-On Modal */}
      <TryOnModal
        product={product}
        isOpen={showTryOnModal}
        onClose={() => setShowTryOnModal(false)}
        onTryOnComplete={handleTryOnComplete}
      />
    </>
  );
};
