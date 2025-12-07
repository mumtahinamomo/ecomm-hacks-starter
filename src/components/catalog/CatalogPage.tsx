import { forwardRef, useState } from "react";
import { HoverOverlay } from "./HoverOverlay";

interface CatalogPageProps {
  imageUrl: string;
  productName: string;
  price: string;
  originalPrice?: string;
  category?: string;
  sizes?: string[];
  fitNote?: string;
  pageNumber: number;
  isCover?: boolean;
  isBackCover?: boolean;
  onHover?: (isHovering: boolean) => void;
}

export const CatalogPage = forwardRef<HTMLDivElement, CatalogPageProps>(
  ({ 
    imageUrl, 
    productName, 
    price, 
    originalPrice,
    category = "WOMEN",
    sizes = ["XS", "S", "M", "L", "XL"],
    fitNote = "This fits well for your measurements.",
    pageNumber,
    isCover,
    isBackCover,
    onHover
  }, ref) => {
    const [isHovered, setIsHovered] = useState(false);

    const handleMouseEnter = () => {
      setIsHovered(true);
      onHover?.(true);
    };

    const handleMouseLeave = () => {
      setIsHovered(false);
      onHover?.(false);
    };

    // Cover page styling
    if (isCover) {
      return (
        <div
          ref={ref}
          className="w-full h-full bg-gradient-to-br from-neutral-900 via-neutral-800 to-neutral-900 flex flex-col items-center justify-center p-8 relative overflow-hidden"
        >
          {/* Decorative elements */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-white to-transparent" />
            <div className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-white to-transparent" />
          </div>
          
          <div className="text-center space-y-6 relative z-10">
            <p className="text-neutral-500 text-xs tracking-[0.4em] uppercase font-light">{category}</p>
            <h1 className="text-3xl font-extralight tracking-wide text-white leading-relaxed">
              {productName}
            </h1>
            <div className="w-16 h-px bg-neutral-600 mx-auto" />
            <p className="text-neutral-400 text-sm font-light tracking-wider">
              Exclusively crafted for you
            </p>
          </div>

          {/* Subtle hero image preview */}
          <div className="absolute bottom-0 left-0 right-0 h-1/2 opacity-30">
            <img 
              src={imageUrl} 
              alt="" 
              className="w-full h-full object-cover object-top"
              style={{ maskImage: "linear-gradient(to top, black, transparent)" }}
            />
          </div>
        </div>
      );
    }

    // Back cover styling
    if (isBackCover) {
      return (
        <div
          ref={ref}
          className="w-full h-full bg-gradient-to-br from-neutral-800 via-neutral-900 to-neutral-950 flex flex-col items-center justify-center p-8"
        >
          <div className="text-center space-y-8">
            <h2 className="text-2xl font-extralight tracking-wide text-white">
              {productName}
            </h2>
            <div className="w-12 h-px bg-neutral-600 mx-auto" />
            <p className="text-neutral-500 text-sm font-light tracking-wider max-w-xs">
              Your personal style journey continues. More curated looks await.
            </p>
            <button className="mt-8 px-8 py-3 border border-neutral-600 text-white text-sm tracking-widest uppercase hover:bg-white hover:text-black transition-all duration-300">
              Shop Now
            </button>
          </div>
        </div>
      );
    }

    // Regular product page
    return (
      <div
        ref={ref}
        className="w-full h-full bg-white relative overflow-hidden group"
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        {/* Product Image */}
        <div className="absolute inset-0">
          <img
            src={imageUrl}
            alt={productName}
            className="w-full h-full object-cover object-center transition-transform duration-700 group-hover:scale-105"
          />
        </div>

        {/* Bottom gradient overlay */}
        <div className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-black/60 to-transparent" />

        {/* Product info footer */}
        <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
          <p className="text-xs tracking-[0.3em] uppercase opacity-70 mb-2">{category}</p>
          <h3 className="text-lg font-light tracking-wide mb-2 line-clamp-2">{productName}</h3>
          <div className="flex items-center space-x-3">
            <span className="text-xl font-light">{price}</span>
            {originalPrice && (
              <span className="text-sm line-through opacity-50">{originalPrice}</span>
            )}
          </div>
        </div>

        {/* Page number */}
        <div className="absolute top-4 right-4 text-neutral-400 text-xs tracking-widest">
          {String(pageNumber).padStart(2, '0')}
        </div>

        {/* Hover Overlay */}
        <HoverOverlay
          isVisible={isHovered}
          productName={productName}
          price={price}
          sizes={sizes}
          fitNote={fitNote}
        />
      </div>
    );
  }
);

CatalogPage.displayName = "CatalogPage";
