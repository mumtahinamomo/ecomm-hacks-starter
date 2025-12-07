import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface CatalogResponse {
  catalogId: string;
  catalogUrl: string;
  heroImageUrl: string;
  pages: Array<{
    imageUrl: string;
    productName: string;
    price: string;
    originalPrice?: string;
    category?: string;
    sizes?: string[];
    fitNote?: string;
  }>;
  theme: string;
  createdAt: string;
}

export const useCatalog = () => {
  const [isGenerating, setIsGenerating] = useState(false);
  const navigate = useNavigate();

  const generateCatalog = async (userId: string, theme: string = "classic") => {
    setIsGenerating(true);

    try {
      const { data, error } = await supabase.functions.invoke("generate-catalog", {
        body: { userId, theme },
      });

      if (error) {
        throw new Error(error.message);
      }

      const response = data as CatalogResponse;
      toast.success("Your catalog is ready!");
      
      return response;
    } catch (error) {
      const message = error instanceof Error ? error.message : "Failed to generate catalog";
      toast.error(message);
      throw error;
    } finally {
      setIsGenerating(false);
    }
  };

  const generateAndNavigate = async (userId: string, theme: string = "classic") => {
    try {
      const response = await generateCatalog(userId, theme);
      navigate(response.catalogUrl);
      return response;
    } catch (error) {
      // Error already handled in generateCatalog
      return null;
    }
  };

  return {
    generateCatalog,
    generateAndNavigate,
    isGenerating,
  };
};
