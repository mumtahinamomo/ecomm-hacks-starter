// Hardcoded virtual try-on images for specific products
// These products return pre-set images instead of calling the AI API

export interface HardcodedTryOn {
  productId: string;
  productName: string;
  tryOnImageUrl: string; // URL to the hardcoded try-on result image
}

export const HARDCODED_TRYON_PRODUCTS: HardcodedTryOn[] = [
  {
    productId: "11111111-1111-1111-1111-111111111101",
    productName: "Barrel Jeans",
    tryOnImageUrl: "/images/tryon/barrel-jeans.jpeg",
  },
  {
    productId: "11111111-1111-1111-1111-111111111102",
    productName: "Barrel Jeans | Short",
    tryOnImageUrl: "/images/tryon/barrel-jeans-short.jpeg",
  },
  {
    productId: "11111111-1111-1111-1111-111111111110",
    productName: "EZY Ultra Stretch Jeans",
    tryOnImageUrl: "/images/tryon/ezy-stretch-jeans.jpeg",
  },
];

export function isHardcodedProduct(productId: string): boolean {
  return HARDCODED_TRYON_PRODUCTS.some((p) => p.productId === productId);
}

export function getHardcodedTryOnImage(productId: string): string | null {
  const product = HARDCODED_TRYON_PRODUCTS.find((p) => p.productId === productId);
  return product?.tryOnImageUrl || null;
}
