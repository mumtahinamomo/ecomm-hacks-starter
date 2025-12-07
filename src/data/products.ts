export interface Product {
  id: string;
  name: string;
  category: string;
  price: number;
  originalPrice?: number;
  rating: number;
  reviewCount: number;
  colors: { name: string; hex: string }[];
  image: string;
  hoverImage?: string;
}

export const products: Product[] = [
  {
    id: "1",
    name: "Smart Ankle Pants (Two-Way Stretch)",
    category: "WOMEN",
    price: 49.90,
    rating: 4.5,
    reviewCount: 234,
    colors: [
      { name: "Black", hex: "#1B1B1B" },
      { name: "Navy", hex: "#1F2937" },
      { name: "Beige", hex: "#D4C5B0" },
    ],
    image: "https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=600&h=600&fit=crop&auto=format",
    hoverImage: "https://images.unsplash.com/photo-1551854838-212c50b4c184?w=600&h=600&fit=crop&auto=format",
  },
  {
    id: "2",
    name: "Ultra Stretch Leggings Pants",
    category: "WOMEN",
    price: 39.90,
    rating: 4.7,
    reviewCount: 512,
    colors: [
      { name: "Black", hex: "#1B1B1B" },
      { name: "Dark Gray", hex: "#4B5563" },
    ],
    image: "https://images.unsplash.com/photo-1506629082955-511b1aa562c8?w=600&h=600&fit=crop&auto=format",
    hoverImage: "https://images.unsplash.com/photo-1548529920-d285f6a0bcdd?w=600&h=600&fit=crop&auto=format",
  },
  {
    id: "3",
    name: "Pleated Wide Pants",
    category: "WOMEN",
    price: 59.90,
    originalPrice: 79.90,
    rating: 4.3,
    reviewCount: 178,
    colors: [
      { name: "Olive", hex: "#4B5320" },
      { name: "Black", hex: "#1B1B1B" },
      { name: "White", hex: "#F5F5F5" },
    ],
    image: "https://images.unsplash.com/photo-1509631179647-0177331693ae?w=600&h=600&fit=crop&auto=format",
    hoverImage: "https://images.unsplash.com/photo-1551854716-8b811be39e7e?w=600&h=600&fit=crop&auto=format",
  },
  {
    id: "4",
    name: "Baker Pants",
    category: "WOMEN",
    price: 49.90,
    rating: 4.6,
    reviewCount: 89,
    colors: [
      { name: "Khaki", hex: "#C3B091" },
      { name: "Navy", hex: "#1F2937" },
    ],
    image: "https://images.unsplash.com/photo-1582418702059-97ebafb35d09?w=600&h=600&fit=crop&auto=format",
    hoverImage: "https://images.unsplash.com/photo-1583496661160-fb5886a0aaaa?w=600&h=600&fit=crop&auto=format",
  },
  {
    id: "5",
    name: "Linen Blend Relaxed Pants",
    category: "WOMEN",
    price: 39.90,
    originalPrice: 49.90,
    rating: 4.4,
    reviewCount: 156,
    colors: [
      { name: "White", hex: "#F5F5F5" },
      { name: "Beige", hex: "#D4C5B0" },
      { name: "Light Blue", hex: "#BFDBFE" },
    ],
    image: "https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?w=600&h=600&fit=crop&auto=format",
    hoverImage: "https://images.unsplash.com/photo-1551854838-212c50b4c184?w=600&h=600&fit=crop&auto=format",
  },
  {
    id: "6",
    name: "EZY Tucked Ankle Pants",
    category: "WOMEN",
    price: 49.90,
    rating: 4.8,
    reviewCount: 423,
    colors: [
      { name: "Black", hex: "#1B1B1B" },
      { name: "Gray", hex: "#6B7280" },
      { name: "Navy", hex: "#1F2937" },
    ],
    image: "https://images.unsplash.com/photo-1541099649105-f69ad21f3246?w=600&h=600&fit=crop&auto=format",
    hoverImage: "https://images.unsplash.com/photo-1509551388413-e18d0ac5d495?w=600&h=600&fit=crop&auto=format",
  },
  {
    id: "7",
    name: "Cotton Relaxed Pants",
    category: "WOMEN",
    price: 29.90,
    rating: 4.2,
    reviewCount: 67,
    colors: [
      { name: "Olive", hex: "#4B5320" },
      { name: "Beige", hex: "#D4C5B0" },
    ],
    image: "https://images.unsplash.com/photo-1584370848010-d7fe6bc767ec?w=600&h=600&fit=crop&auto=format",
    hoverImage: "https://images.unsplash.com/photo-1506629082955-511b1aa562c8?w=600&h=600&fit=crop&auto=format",
  },
  {
    id: "8",
    name: "Ultra Light Down Pants",
    category: "WOMEN",
    price: 59.90,
    rating: 4.5,
    reviewCount: 198,
    colors: [
      { name: "Black", hex: "#1B1B1B" },
    ],
    image: "https://images.unsplash.com/photo-1551854716-8b811be39e7e?w=600&h=600&fit=crop&auto=format",
    hoverImage: "https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=600&h=600&fit=crop&auto=format",
  },
  {
    id: "9",
    name: "Denim Straight Jeans",
    category: "WOMEN",
    price: 49.90,
    rating: 4.6,
    reviewCount: 334,
    colors: [
      { name: "Blue", hex: "#3B82F6" },
      { name: "Dark Blue", hex: "#1E3A5F" },
      { name: "Black", hex: "#1B1B1B" },
    ],
    image: "https://images.unsplash.com/photo-1541099649105-f69ad21f3246?w=600&h=600&fit=crop&auto=format",
    hoverImage: "https://images.unsplash.com/photo-1582418702059-97ebafb35d09?w=600&h=600&fit=crop&auto=format",
  },
  {
    id: "10",
    name: "High Rise Cigarette Jeans",
    category: "WOMEN",
    price: 49.90,
    originalPrice: 59.90,
    rating: 4.4,
    reviewCount: 256,
    colors: [
      { name: "Blue", hex: "#3B82F6" },
      { name: "Black", hex: "#1B1B1B" },
    ],
    image: "https://images.unsplash.com/photo-1548529920-d285f6a0bcdd?w=600&h=600&fit=crop&auto=format",
    hoverImage: "https://images.unsplash.com/photo-1509631179647-0177331693ae?w=600&h=600&fit=crop&auto=format",
  },
  {
    id: "11",
    name: "Jersey Relaxed Pants",
    category: "WOMEN",
    price: 34.90,
    rating: 4.3,
    reviewCount: 145,
    colors: [
      { name: "Gray", hex: "#6B7280" },
      { name: "Black", hex: "#1B1B1B" },
      { name: "Navy", hex: "#1F2937" },
    ],
    image: "https://images.unsplash.com/photo-1509551388413-e18d0ac5d495?w=600&h=600&fit=crop&auto=format",
    hoverImage: "https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?w=600&h=600&fit=crop&auto=format",
  },
  {
    id: "12",
    name: "Ponte Slim Pants",
    category: "WOMEN",
    price: 39.90,
    rating: 4.7,
    reviewCount: 289,
    colors: [
      { name: "Black", hex: "#1B1B1B" },
      { name: "Charcoal", hex: "#374151" },
    ],
    image: "https://images.unsplash.com/photo-1583496661160-fb5886a0aaaa?w=600&h=600&fit=crop&auto=format",
    hoverImage: "https://images.unsplash.com/photo-1584370848010-d7fe6bc767ec?w=600&h=600&fit=crop&auto=format",
  },
];

export const filterCategories = [
  "All Bottoms",
  "Pants",
  "Jeans",
  "Leggings",
  "Shorts",
  "Skirts",
];

export const filterSizes = ["XS", "S", "M", "L", "XL", "XXL"];

export const filterColors = [
  { name: "Black", hex: "#1B1B1B" },
  { name: "White", hex: "#F5F5F5" },
  { name: "Navy", hex: "#1F2937" },
  { name: "Beige", hex: "#D4C5B0" },
  { name: "Gray", hex: "#6B7280" },
  { name: "Olive", hex: "#4B5320" },
  { name: "Blue", hex: "#3B82F6" },
];

export const filterPrices = [
  "Under $30",
  "$30 - $50",
  "$50 - $80",
  "Over $80",
];

export const filterMaterials = [
  "Cotton",
  "Linen",
  "Denim",
  "Stretch",
  "Wool Blend",
];
