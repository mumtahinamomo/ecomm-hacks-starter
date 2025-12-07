import { useState } from "react";
import { ShoppingBag, Check, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

interface HoverOverlayProps {
  isVisible: boolean;
  productName: string;
  price: string;
  sizes: string[];
  fitNote: string;
}

export const HoverOverlay = ({
  isVisible,
  productName,
  price,
  sizes,
  fitNote,
}: HoverOverlayProps) => {
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [isAdding, setIsAdding] = useState(false);

  const handleAddToCart = () => {
    if (!selectedSize) {
      toast.error("Please select a size");
      return;
    }

    setIsAdding(true);
    
    // Simulate add to cart
    setTimeout(() => {
      toast.success(`Added ${productName} (${selectedSize}) to cart`);
      setIsAdding(false);
    }, 500);
  };

  return (
    <div
      className={`absolute inset-0 flex items-center justify-center transition-all duration-500 ${
        isVisible ? "opacity-100" : "opacity-0 pointer-events-none"
      }`}
    >
      {/* Glassmorphism backdrop */}
      <div className="absolute inset-0 bg-black/40 backdrop-blur-md" />

      {/* Content container */}
      <div
        className={`relative z-10 w-[85%] max-w-sm bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-6 shadow-2xl transform transition-all duration-500 ${
          isVisible ? "scale-100 translate-y-0" : "scale-95 translate-y-4"
        }`}
      >
        {/* Header */}
        <div className="text-center mb-6">
          <h3 className="text-white text-lg font-light tracking-wide mb-1 line-clamp-2">
            {productName}
          </h3>
          <p className="text-white/90 text-2xl font-light">{price}</p>
        </div>

        {/* Size selector */}
        <div className="mb-6">
          <p className="text-white/70 text-xs tracking-widest uppercase mb-3">Select Size</p>
          <div className="flex flex-wrap gap-2 justify-center">
            {sizes.map((size) => (
              <button
                key={size}
                onClick={() => setSelectedSize(size)}
                className={`min-w-[44px] h-10 px-3 rounded-lg text-sm font-medium transition-all duration-200 ${
                  selectedSize === size
                    ? "bg-white text-black"
                    : "bg-white/10 text-white border border-white/20 hover:bg-white/20"
                }`}
              >
                {size}
              </button>
            ))}
          </div>
        </div>

        {/* Fit note */}
        <div className="mb-6 bg-white/5 rounded-xl p-4 border border-white/10">
          <div className="flex items-start space-x-3">
            <Sparkles className="w-4 h-4 text-amber-400 mt-0.5 flex-shrink-0" />
            <p className="text-white/80 text-sm font-light leading-relaxed">
              {fitNote}
            </p>
          </div>
        </div>

        {/* Add to cart button */}
        <Button
          onClick={handleAddToCart}
          disabled={isAdding}
          className="w-full h-12 bg-white text-black hover:bg-white/90 font-medium tracking-wide rounded-xl transition-all duration-200"
        >
          {isAdding ? (
            <>
              <Check className="w-4 h-4 mr-2 animate-pulse" />
              Adding...
            </>
          ) : (
            <>
              <ShoppingBag className="w-4 h-4 mr-2" />
              Add to Cart
            </>
          )}
        </Button>

        {/* Quick actions */}
        <div className="mt-4 flex justify-center space-x-4">
          <button className="text-white/60 text-xs tracking-wider hover:text-white transition-colors">
            View Details
          </button>
          <span className="text-white/30">•</span>
          <button className="text-white/60 text-xs tracking-wider hover:text-white transition-colors">
            Save for Later
          </button>
        </div>
      </div>
    </div>
  );
};
