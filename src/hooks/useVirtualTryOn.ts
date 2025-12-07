import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { isHardcodedProduct, getHardcodedTryOnImage } from "@/config/hardcodedTryOn";

interface UseVirtualTryOnResult {
  generatedImages: string[];
  isGenerating: boolean;
  progress: string;
  generateTryOn: (
    selfieBase64: string,
    modelImageUrls: string[],
    userId?: string,
    productId?: string
  ) => Promise<string[]>;
  reset: () => void;
}

export const useVirtualTryOn = (): UseVirtualTryOnResult => {
  const [generatedImages, setGeneratedImages] = useState<string[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [progress, setProgress] = useState("");

  const generateTryOn = async (
    selfieBase64: string,
    modelImageUrls: string[],
    userId?: string,
    productId?: string
  ): Promise<string[]> => {
    setIsGenerating(true);
    setProgress("Preparing your virtual try-on...");
    setGeneratedImages([]);

    try {
      // Check if this is a hardcoded product
      if (productId && isHardcodedProduct(productId)) {
        const hardcodedImage = getHardcodedTryOnImage(productId);
        
        if (hardcodedImage) {
          setProgress("Loading your personalized look...");
          
          // Simulate a brief delay for UX
          await new Promise((resolve) => setTimeout(resolve, 1500));
          
          const images = [hardcodedImage];
          setGeneratedImages(images);
          setProgress("Complete!");
          toast.success("Generated 1 try-on image!");
          return images;
        }
      }

      // Regular AI generation for non-hardcoded products
      setProgress(`Processing ${modelImageUrls.length} outfit image(s) with AI...`);

      const { data, error } = await supabase.functions.invoke("virtual-tryon", {
        body: {
          selfieBase64,
          modelImageUrls,
          userId,
        },
      });

      if (error) {
        console.error("Virtual try-on error:", error);
        throw new Error(error.message || "Failed to generate try-on");
      }

      if (!data.success) {
        throw new Error(data.error || "Failed to generate try-on images");
      }

      const images = data.generatedImages as string[];
      setGeneratedImages(images);
      setProgress("Complete!");

      toast.success(`Generated ${images.length} try-on image(s)!`);
      return images;
    } catch (error) {
      console.error("Virtual try-on error:", error);
      const message = error instanceof Error ? error.message : "Failed to generate try-on";

      if (message.includes("Rate limit")) {
        toast.error("AI is busy. Please try again in a moment.");
      } else if (message.includes("quota")) {
        toast.error("AI quota exceeded. Please try again later.");
      } else {
        toast.error(message);
      }

      throw error;
    } finally {
      setIsGenerating(false);
    }
  };

  const reset = () => {
    setGeneratedImages([]);
    setProgress("");
    setIsGenerating(false);
  };

  return {
    generatedImages,
    isGenerating,
    progress,
    generateTryOn,
    reset,
  };
};
