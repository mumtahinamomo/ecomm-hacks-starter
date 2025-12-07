import { useState, useCallback, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Upload, Camera, ChevronDown, ChevronUp, Sparkles, Loader2, Check } from "lucide-react";
import { Product } from "@/hooks/useProducts";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { CameraCapture } from "./CameraCapture";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useCart } from "@/contexts/CartContext";
import { useAuth } from "@/contexts/AuthContext";
import { useVirtualTryOn } from "@/hooks/useVirtualTryOn";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";

interface TryOnModalProps {
  product: Product | null;
  isOpen: boolean;
  onClose: () => void;
  onTryOnComplete?: (images: string[], metrics: { waist_cm?: number; hip_cm?: number }) => void;
}

interface BodyMetrics {
  height_cm?: number;
  shoulder_width_cm?: number;
  chest_cm?: number;
  waist_cm?: number;
  hip_cm?: number;
  weight_lbs?: number;
}

export const TryOnModal = ({ product, isOpen, onClose, onTryOnComplete }: TryOnModalProps) => {
  const [selfieImage, setSelfieImage] = useState<string | null>(null);
  const [savedSelfieUrl, setSavedSelfieUrl] = useState<string | null>(null);
  const [showCamera, setShowCamera] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [measurementsOpen, setMeasurementsOpen] = useState(false);
  const [selfieChoice, setSelfieChoice] = useState<"saved" | "new" | null>(null);
  const { addToCart } = useCart();
  const { user } = useAuth();
  const { generatedImages, isGenerating, progress, generateTryOn, reset: resetTryOn } = useVirtualTryOn();
  const [metrics, setMetrics] = useState<BodyMetrics>({
    height_cm: undefined,
    shoulder_width_cm: undefined,
    chest_cm: undefined,
    waist_cm: undefined,
    hip_cm: undefined,
    weight_lbs: undefined,
  });

  // Fetch saved selfie when modal opens
  useEffect(() => {
    if (isOpen && user) {
      fetchSavedSelfie();
    }
  }, [isOpen, user]);

  // Track product interest when modal opens
  useEffect(() => {
    if (isOpen && product && user) {
      trackProductInterest(product);
    }
  }, [isOpen, product, user]);

  // Reset state when modal closes
  useEffect(() => {
    if (!isOpen) {
      setSelfieImage(null);
      setSavedSelfieUrl(null);
      setShowCamera(false);
      setMeasurementsOpen(false);
      setSelfieChoice(null);
      resetTryOn();
    }
  }, [isOpen]);

  // Pass generated images to parent when complete
  useEffect(() => {
    if (generatedImages.length > 0 && onTryOnComplete) {
      onTryOnComplete(generatedImages, { waist_cm: metrics.waist_cm, hip_cm: metrics.hip_cm });
    }
  }, [generatedImages, onTryOnComplete, metrics.waist_cm, metrics.hip_cm]);

  const fetchSavedSelfie = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from("user_tryon_profiles")
        .select("selfie_url, waist_cm, hip_cm, height_cm, shoulder_width_cm, chest_cm, weight_lbs")
        .eq("user_id", user.id)
        .single();

      if (error) {
        console.error("Error fetching saved selfie:", error);
        return;
      }

      if (data?.selfie_url) {
        setSavedSelfieUrl(data.selfie_url);
      }

      // Also load saved metrics
      if (data) {
        setMetrics({
          height_cm: data.height_cm || undefined,
          shoulder_width_cm: data.shoulder_width_cm || undefined,
          chest_cm: data.chest_cm || undefined,
          waist_cm: data.waist_cm || undefined,
          hip_cm: data.hip_cm || undefined,
          weight_lbs: data.weight_lbs ? Number(data.weight_lbs) : undefined,
        });
      }
    } catch (error) {
      console.error("Error fetching saved selfie:", error);
    }
  };

  const trackProductInterest = async (product: Product) => {
    if (!user) return;

    try {
      await supabase
        .from("user_tryon_profiles")
        .update({
          interested_product_id: product.id,
          interested_product_name: product.name,
        })
        .eq("user_id", user.id);
    } catch (error) {
      console.error("Error tracking product interest:", error);
    }
  };

  const handleFileUpload = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setSelfieImage(e.target?.result as string);
        setSelfieChoice("new");
      };
      reader.readAsDataURL(file);
    }
  }, []);

  const handleCameraCapture = useCallback((imageData: string) => {
    setSelfieImage(imageData);
    setSelfieChoice("new");
    setShowCamera(false);
  }, []);

  const handleUseSavedSelfie = async () => {
    if (savedSelfieUrl) {
      try {
        // Fetch the saved selfie and convert to base64 for the API
        const response = await fetch(savedSelfieUrl);
        if (!response.ok) {
          throw new Error("Failed to fetch saved selfie");
        }
        const blob = await response.blob();
        const reader = new FileReader();
        reader.onload = (e) => {
          const base64Data = e.target?.result as string;
          setSelfieImage(base64Data);
          setSelfieChoice("saved");
        };
        reader.readAsDataURL(blob);
      } catch (error) {
        console.error("Error loading saved selfie:", error);
        toast.error("Failed to load saved selfie. Please upload a new one.");
        setSelfieChoice("new");
      }
    }
  };

  const handleUploadNew = () => {
    setSelfieChoice("new");
    setSelfieImage(null);
  };

  const handleMetricChange = useCallback((field: keyof BodyMetrics, value: string) => {
    setMetrics(prev => ({
      ...prev,
      [field]: value === "" ? undefined : parseInt(value) || undefined,
    }));
  }, []);

  const uploadSelfieToStorage = async (base64Image: string): Promise<string | null> => {
    try {
      const base64Data = base64Image.split(",")[1];
      const byteCharacters = atob(base64Data);
      const byteNumbers = new Array(byteCharacters.length);
      for (let i = 0; i < byteCharacters.length; i++) {
        byteNumbers[i] = byteCharacters.charCodeAt(i);
      }
      const byteArray = new Uint8Array(byteNumbers);
      const blob = new Blob([byteArray], { type: "image/jpeg" });

      const fileName = `selfie_${Date.now()}_${Math.random().toString(36).substring(7)}.jpg`;

      const { data, error } = await supabase.storage
        .from("user-selfies")
        .upload(fileName, blob, {
          contentType: "image/jpeg",
          upsert: false,
        });

      if (error) {
        console.error("Storage upload error:", error);
        return null;
      }

      const { data: urlData } = supabase.storage
        .from("user-selfies")
        .getPublicUrl(data.path);

      return urlData.publicUrl;
    } catch (error) {
      console.error("Upload error:", error);
      return null;
    }
  };

  const handleGenerateTryOn = async () => {
    if (!selfieImage) {
      toast.error("Please upload or capture a selfie first");
      return;
    }

    if (!product) {
      toast.error("No product selected");
      return;
    }

    // Get product images to process
    const modelImageUrls = product.images.length > 0 
      ? product.images.slice(0, 2) // Process up to 2 images
      : product.image 
        ? [product.image] 
        : [];

    if (modelImageUrls.length === 0) {
      toast.error("No product images available");
      return;
    }

    try {
      await generateTryOn(selfieImage, modelImageUrls, user?.id, product.id);
    } catch (error) {
      // Error already handled in hook
    }
  };

  const handleSubmit = async () => {
    if (!selfieImage) {
      toast.error("Please upload or capture a selfie first");
      return;
    }

    if (!user) {
      toast.error("Please sign in to continue");
      return;
    }

    setIsSubmitting(true);

    try {
      let selfieUrl = selfieImage;
      
      // Only upload if it's a new image (base64)
      if (selfieImage.startsWith("data:")) {
        const uploadedUrl = await uploadSelfieToStorage(selfieImage);
        if (!uploadedUrl) {
          toast.error("Failed to upload selfie. Please try again.");
          setIsSubmitting(false);
          return;
        }
        selfieUrl = uploadedUrl;
      }

      // Update existing profile with selfie and metrics
      const { error } = await supabase
        .from("user_tryon_profiles")
        .update({
          height_cm: metrics.height_cm || 170,
          shoulder_width_cm: metrics.shoulder_width_cm || null,
          chest_cm: metrics.chest_cm || null,
          waist_cm: metrics.waist_cm || null,
          hip_cm: metrics.hip_cm || null,
          weight_lbs: metrics.weight_lbs || null,
          selfie_url: selfieUrl,
        })
        .eq("user_id", user.id);

      if (error) {
        console.error("Database error:", error);
        toast.error("Failed to save profile. Please try again.");
        setIsSubmitting(false);
        return;
      }

      toast.success("Selfie saved! Ready for virtual try-on.");
      setSavedSelfieUrl(selfieUrl);
    } catch (error) {
      console.error("Submit error:", error);
      toast.error("An error occurred. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!product) return null;

  const showingGenerated = generatedImages.length > 0;
  const hasSavedSelfie = !!savedSelfieUrl;
  const showSelfieOptions = hasSavedSelfie && selfieChoice === null && !selfieImage;

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-0 z-[60] flex items-center justify-center bg-black/40"
          onClick={onClose}
          onKeyDown={(e) => e.key === "Escape" && onClose()}
          tabIndex={-1}
        >
          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.2, ease: [0.4, 0, 0.2, 1] }}
            className="w-[420px] max-w-[90vw] max-h-[85vh] bg-background rounded-2xl shadow-xl overflow-hidden flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-border">
              <div>
                <h2 className="text-lg font-semibold text-foreground">Virtual Try-On</h2>
                <p className="text-sm text-muted-foreground mt-0.5">
                  {showingGenerated ? "Your personalized look!" : `See ${product.name} on you`}
                </p>
              </div>
              <Button
                onClick={onClose}
                variant="ghost"
                size="icon"
                className="hover:bg-muted rounded-full -mr-2"
              >
                <X className="w-5 h-5" />
              </Button>
            </div>

            {/* Product Preview */}
            <div className="p-6 border-b border-border">
              <div className="flex items-center gap-4">
                <div className="w-16 h-20 bg-muted rounded-lg overflow-hidden flex-shrink-0">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div>
                  <p className="text-xs uppercase tracking-wider text-muted-foreground">
                    {product.category}
                  </p>
                  <p className="text-sm font-medium text-foreground mt-1">
                    {product.name}
                  </p>
                  <p className="text-sm font-bold text-foreground mt-1">
                    ${product.price.toFixed(2)}
                  </p>
                </div>
              </div>
            </div>

            {/* Generation Progress */}
            {isGenerating && (
              <div className="p-6 border-b border-border">
                <div className="flex items-center gap-3">
                  <Loader2 className="w-5 h-5 animate-spin text-primary" />
                  <div>
                    <p className="text-sm font-medium text-foreground">Generating your look...</p>
                    <p className="text-xs text-muted-foreground">{progress}</p>
                  </div>
                </div>
                <div className="mt-3 h-2 bg-muted rounded-full overflow-hidden">
                  <motion.div
                    className="h-full bg-primary"
                    initial={{ width: "0%" }}
                    animate={{ width: "100%" }}
                    transition={{ duration: 30, ease: "linear" }}
                  />
                </div>
              </div>
            )}

            {/* Selfie Section */}
            {!showingGenerated && (
              <div className="p-6 space-y-4 overflow-y-auto flex-1">
                {showCamera ? (
                  <CameraCapture
                    onCapture={handleCameraCapture}
                    onClose={() => setShowCamera(false)}
                  />
                ) : showSelfieOptions ? (
                  /* Side-by-side selfie options */
                  <div className="grid grid-cols-2 gap-3">
                    {/* Use Saved Selfie */}
                    <button
                      onClick={handleUseSavedSelfie}
                      className="relative aspect-[3/4] bg-muted rounded-xl overflow-hidden group border-2 border-transparent hover:border-primary transition-all"
                    >
                      <img
                        src={savedSelfieUrl}
                        alt="Saved selfie"
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-black/40 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                        <Check className="w-8 h-8 text-white mb-2" />
                        <span className="text-white text-sm font-medium">Use This</span>
                      </div>
                      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-3">
                        <p className="text-white text-xs font-medium text-center">Saved Selfie</p>
                      </div>
                    </button>

                    {/* Upload New */}
                    <button
                      onClick={handleUploadNew}
                      className="aspect-[3/4] bg-muted rounded-xl overflow-hidden flex flex-col items-center justify-center gap-3 border-2 border-dashed border-border hover:border-primary transition-all"
                    >
                      <Upload className="w-8 h-8 text-muted-foreground" />
                      <span className="text-sm font-medium text-muted-foreground">Upload New</span>
                    </button>
                  </div>
                ) : selfieImage ? (
                  <div className="relative aspect-[3/4] bg-muted rounded-xl overflow-hidden">
                    <img
                      src={selfieImage}
                      alt="Your selfie"
                      className="w-full h-full object-cover"
                    />
                    <Button
                      onClick={() => {
                        setSelfieImage(null);
                        setSelfieChoice(hasSavedSelfie ? null : "new");
                      }}
                      variant="secondary"
                      size="sm"
                      className="absolute bottom-3 right-3"
                    >
                      Change
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-3">
                    <label className="cursor-pointer block">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleFileUpload}
                        className="hidden"
                      />
                      <div className="flex items-center justify-center gap-3 bg-muted hover:bg-muted/80 text-foreground py-3 px-4 rounded-xl font-medium text-sm transition-all border border-border">
                        <Upload className="w-5 h-5" />
                        Upload Selfie
                      </div>
                    </label>
                    <button 
                      onClick={() => setShowCamera(true)}
                      className="w-full flex items-center justify-center gap-3 bg-primary text-primary-foreground py-3 px-4 rounded-xl font-medium text-sm transition-all hover:opacity-90"
                    >
                      <Camera className="w-5 h-5" />
                      Use Camera
                    </button>
                  </div>
                )}

                {/* Collapsible Measurements */}
                <Collapsible open={measurementsOpen} onOpenChange={setMeasurementsOpen}>
                  <CollapsibleTrigger asChild>
                    <button className="w-full flex items-center justify-between py-3 px-4 bg-muted hover:bg-muted/80 rounded-xl text-sm font-medium text-foreground transition-colors">
                      <span>Body Measurements (optional)</span>
                      {measurementsOpen ? (
                        <ChevronUp className="w-4 h-4 text-muted-foreground" />
                      ) : (
                        <ChevronDown className="w-4 h-4 text-muted-foreground" />
                      )}
                    </button>
                  </CollapsibleTrigger>
                  <CollapsibleContent className="pt-4">
                    <div className="grid grid-cols-2 gap-3">
                      <div className="space-y-1.5">
                        <Label htmlFor="height" className="text-xs text-muted-foreground">
                          Height (in)
                        </Label>
                        <Input
                          id="height"
                          type="number"
                          placeholder="170"
                          value={metrics.height_cm || ""}
                          onChange={(e) => handleMetricChange("height_cm", e.target.value)}
                          className="rounded-lg"
                        />
                      </div>
                      <div className="space-y-1.5">
                        <Label htmlFor="shoulder" className="text-xs text-muted-foreground">
                          Shoulder (in)
                        </Label>
                        <Input
                          id="shoulder"
                          type="number"
                          placeholder="45"
                          value={metrics.shoulder_width_cm || ""}
                          onChange={(e) => handleMetricChange("shoulder_width_cm", e.target.value)}
                          className="rounded-lg"
                        />
                      </div>
                      <div className="space-y-1.5">
                        <Label htmlFor="chest" className="text-xs text-muted-foreground">
                          Chest (in)
                        </Label>
                        <Input
                          id="chest"
                          type="number"
                          placeholder="90"
                          value={metrics.chest_cm || ""}
                          onChange={(e) => handleMetricChange("chest_cm", e.target.value)}
                          className="rounded-lg"
                        />
                      </div>
                      <div className="space-y-1.5">
                        <Label htmlFor="waist" className="text-xs text-muted-foreground">
                          Waist (in)
                        </Label>
                        <Input
                          id="waist"
                          type="number"
                          placeholder="70"
                          value={metrics.waist_cm || ""}
                          onChange={(e) => handleMetricChange("waist_cm", e.target.value)}
                          className="rounded-lg"
                        />
                      </div>
                      <div className="space-y-1.5">
                        <Label htmlFor="hip" className="text-xs text-muted-foreground">
                          Hip (in)
                        </Label>
                        <Input
                          id="hip"
                          type="number"
                          placeholder="40"
                          value={metrics.hip_cm || ""}
                          onChange={(e) => handleMetricChange("hip_cm", e.target.value)}
                          className="rounded-lg"
                        />
                      </div>
                      <div className="space-y-1.5">
                        <Label htmlFor="weight" className="text-xs text-muted-foreground">
                          Weight (lbs)
                        </Label>
                        <Input
                          id="weight"
                          type="number"
                          placeholder="150"
                          value={metrics.weight_lbs || ""}
                          onChange={(e) => handleMetricChange("weight_lbs", e.target.value)}
                          className="rounded-lg"
                        />
                      </div>
                    </div>
                  </CollapsibleContent>
                </Collapsible>
              </div>
            )}

            {/* Footer */}
            <div className="p-6 pt-0 space-y-3">
              {selfieImage && !showingGenerated && !isGenerating && (
                <>
                  <Button
                    onClick={handleGenerateTryOn}
                    disabled={isGenerating}
                    className="w-full rounded-xl py-5 font-semibold bg-gradient-to-r from-primary to-primary/80"
                  >
                    <Sparkles className="w-4 h-4 mr-2" />
                    Generate Virtual Try-On
                  </Button>
                  <Button
                    onClick={handleSubmit}
                    disabled={isSubmitting}
                    variant="outline"
                    className="w-full rounded-xl py-5 font-semibold"
                  >
                    {isSubmitting ? "Saving..." : "Save for Later"}
                  </Button>
                </>
              )}
              <Button
                variant={showingGenerated ? "default" : "outline"}
                onClick={() => {
                  addToCart(product);
                  toast.success(`${product.name} added to cart!`);
                }}
                className="w-full rounded-xl py-5 font-semibold"
              >
                Add to Cart
              </Button>
            </div>

            {/* Privacy note */}
            <div className="px-6 pb-4">
              <p className="text-xs text-center text-muted-foreground">
                Your photos are processed securely for virtual try-on.
              </p>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
