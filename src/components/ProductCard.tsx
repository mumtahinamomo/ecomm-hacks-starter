import { useState } from "react";
import { motion } from "framer-motion";
import { Product } from "@/hooks/useProducts";
import { StarRating } from "./StarRating";
import { ImageGalleryModal } from "./ImageGalleryModal";

interface ProductCardProps {
  product: Product;
}

export const ProductCard = ({ product }: ProductCardProps) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isGalleryOpen, setIsGalleryOpen] = useState(false);

  const handleImageClick = () => {
    setIsGalleryOpen(true);
  };

  // Collect all available images
  const galleryImages = [product.image];
  if (product.hoverImage && product.hoverImage !== product.image) {
    galleryImages.push(product.hoverImage);
  }

  return (
    <>
      <motion.article
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="group relative"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {/* Image Container */}
        <div
          className="relative aspect-[4/5] overflow-hidden bg-secondary mb-3 cursor-pointer"
          onClick={handleImageClick}
        >
          <motion.img
            src={isHovered && product.hoverImage ? product.hoverImage : product.image}
            alt={product.name}
            className="w-full h-full object-cover"
            animate={{ scale: isHovered ? 1.05 : 1 }}
            transition={{ duration: 0.4 }}
          />

          {/* Sale Badge */}
          {product.originalPrice && (
            <div className="absolute top-2 left-2 bg-primary text-primary-foreground text-xs font-semibold px-2 py-1">
              SALE
            </div>
          )}
        </div>

        {/* Product Info */}
        <div className="space-y-1.5">
          {/* Category */}
          <p className="text-[10px] uppercase tracking-wider text-muted-foreground">{product.category}</p>

          {/* Title */}
          <h3 className="text-sm font-normal leading-tight text-foreground line-clamp-2 min-h-[2.5rem]">
            {product.name}
          </h3>

          {/* Price */}
          <div className="flex items-center gap-2">
            <span className="text-base font-bold text-foreground">${product.price.toFixed(2)}</span>
            {product.originalPrice && (
              <span className="text-sm text-muted-foreground line-through">${product.originalPrice.toFixed(2)}</span>
            )}
          </div>

          {/* Rating */}
          <StarRating rating={product.rating} reviewCount={product.reviewCount} />

          {/* Color Swatches */}
          <div className="flex gap-1.5 pt-1">
            {product.colors.map((color) => (
              <div
                key={color.name}
                className="w-3 h-3 rounded-sm border border-border"
                style={{ backgroundColor: color.hex }}
                title={color.name}
              />
            ))}
          </div>
        </div>
      </motion.article>

      {/* Image Gallery Modal */}
      <ImageGalleryModal
        images={galleryImages}
        productName={product.name}
        isOpen={isGalleryOpen}
        onClose={() => setIsGalleryOpen(false)}
        product={product}
      />
    </>
  );
};
