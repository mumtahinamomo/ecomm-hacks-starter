import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export interface Product {
  id: string;
  name: string;
  category: string;
  price: number;
  originalPrice?: number;
  rating: number;
  reviewCount: number;
  colors: { name: string; hex: string }[];
  images: string[];
  image: string;
  hoverImage?: string;
}

interface DbProduct {
  id: string;
  name: string;
  category: string;
  price: number;
  original_price: number | null;
  rating: number;
  review_count: number;
}

interface DbProductImage {
  product_id: string;
  image_url: string;
  is_primary: boolean;
  display_order: number;
}

interface DbProductColor {
  product_id: string;
  color_name: string;
  hex_code: string;
}

const fetchProducts = async (): Promise<Product[]> => {
  // Fetch products, images, and colors in parallel
  const [productsRes, imagesRes, colorsRes] = await Promise.all([
    supabase.from("products").select("*").order("created_at", { ascending: true }),
    supabase.from("product_images").select("*").order("display_order", { ascending: true }),
    supabase.from("product_colors").select("*"),
  ]);

  if (productsRes.error) throw productsRes.error;
  if (imagesRes.error) throw imagesRes.error;
  if (colorsRes.error) throw colorsRes.error;

  const products = productsRes.data as DbProduct[];
  const images = imagesRes.data as DbProductImage[];
  const colors = colorsRes.data as DbProductColor[];

  // Group images and colors by product_id
  const imagesByProduct = images.reduce((acc, img) => {
    if (!acc[img.product_id]) acc[img.product_id] = [];
    acc[img.product_id].push(img.image_url);
    return acc;
  }, {} as Record<string, string[]>);

  const colorsByProduct = colors.reduce((acc, color) => {
    if (!acc[color.product_id]) acc[color.product_id] = [];
    acc[color.product_id].push({ name: color.color_name, hex: color.hex_code });
    return acc;
  }, {} as Record<string, { name: string; hex: string }[]>);

  // Default colors for products without specific colors
  const defaultColors = [
    { name: "Black", hex: "#000000" },
    { name: "Navy", hex: "#1B1B3A" },
    { name: "Gray", hex: "#6B7280" },
  ];

  return products.map((product) => {
    const productImages = imagesByProduct[product.id] || [];
    const productColors = colorsByProduct[product.id] || defaultColors;

    return {
      id: product.id,
      name: product.name,
      category: product.category || "WOMEN",
      price: Number(product.price),
      originalPrice: product.original_price ? Number(product.original_price) : undefined,
      rating: Number(product.rating),
      reviewCount: product.review_count,
      colors: productColors,
      images: productImages,
      image: productImages[0] || "/placeholder.svg",
      hoverImage: productImages[1],
    };
  });
};

export const useProducts = () => {
  return useQuery({
    queryKey: ["products"],
    queryFn: fetchProducts,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
};
