import { useParams, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Flipbook } from "@/components/catalog/Flipbook";
import { ArrowLeft, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";

interface CatalogPage {
  imageUrl: string;
  productName: string;
  price: string;
  originalPrice?: string;
  category?: string;
  sizes?: string[];
  fitNote?: string;
}

interface Catalog {
  id: string;
  user_id: string;
  theme: string;
  hero_image_url: string;
  pages: CatalogPage[];
  created_at: string;
}

const CatalogViewer = () => {
  const { catalogId } = useParams<{ catalogId: string }>();
  const navigate = useNavigate();

  const { data: catalog, isLoading, error } = useQuery({
    queryKey: ["catalog", catalogId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("catalogs")
        .select("*")
        .eq("id", catalogId)
        .single();

      if (error) throw error;
      return data as unknown as Catalog;
    },
    enabled: !!catalogId,
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-neutral-950 via-neutral-900 to-neutral-950 flex items-center justify-center">
        <div className="text-center space-y-4">
          <Loader2 className="w-12 h-12 animate-spin text-primary mx-auto" />
          <p className="text-neutral-400 font-light tracking-wide">Loading your catalog...</p>
        </div>
      </div>
    );
  }

  if (error || !catalog) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-neutral-950 via-neutral-900 to-neutral-950 flex items-center justify-center">
        <div className="text-center space-y-6">
          <h1 className="text-2xl font-light text-white tracking-wide">Catalog Not Found</h1>
          <p className="text-neutral-400">This catalog may have been removed or doesn't exist.</p>
          <Button onClick={() => navigate("/")} variant="outline" className="border-neutral-700 text-white hover:bg-neutral-800">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Store
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-neutral-950 via-neutral-900 to-neutral-950">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-neutral-950/80 backdrop-blur-md border-b border-neutral-800">
        <div className="container mx-auto px-6 py-4 flex items-center justify-between">
          <Button 
            onClick={() => navigate("/")} 
            variant="ghost" 
            className="text-neutral-400 hover:text-white hover:bg-neutral-800"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
          <h1 className="text-lg font-light tracking-[0.2em] text-white uppercase">
            Your Digital Catalog
          </h1>
          <div className="w-20" /> {/* Spacer for centering */}
        </div>
      </header>

      {/* Flipbook Container */}
      <main className="pt-24 pb-12 px-4">
        <div className="max-w-6xl mx-auto">
          <Flipbook pages={catalog.pages} theme={catalog.theme} />
        </div>
      </main>

      {/* Footer */}
      <footer className="fixed bottom-0 left-0 right-0 bg-neutral-950/80 backdrop-blur-md border-t border-neutral-800 py-3">
        <p className="text-center text-neutral-500 text-sm font-light tracking-wide">
          Swipe or use arrows to turn pages • Hover for product details
        </p>
      </footer>
    </div>
  );
};

export default CatalogViewer;
