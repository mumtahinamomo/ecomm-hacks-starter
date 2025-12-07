import { useProducts } from "@/hooks/useProducts";
import { ProductCard } from "./ProductCard";
import { Skeleton } from "./ui/skeleton";

export const ProductGrid = () => {
  const { data: products, isLoading, error } = useProducts();

  // Loading state
  if (isLoading) {
    return (
      <>
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-semibold text-foreground">Women's Bottoms</h1>
            <Skeleton className="h-4 w-20 mt-1" />
          </div>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-4 gap-y-8">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="space-y-3">
              <Skeleton className="aspect-[4/5] w-full" />
              <Skeleton className="h-3 w-16" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-5 w-20" />
            </div>
          ))}
        </div>
      </>
    );
  }

  if (error) {
    return <div className="text-destructive">Error loading products</div>;
  }

  return (
    <>
      {/* Grid Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-semibold text-foreground">Women's Bottoms</h1>
          <p className="text-sm text-muted-foreground mt-1">{products?.length || 0} items</p>
        </div>
        <div className="flex items-center gap-4">
          <select className="text-sm border border-border rounded px-3 py-2 bg-background focus:outline-none focus:ring-1 focus:ring-foreground">
            <option>Featured</option>
            <option>Price: Low to High</option>
            <option>Price: High to Low</option>
            <option>Newest</option>
            <option>Top Rated</option>
          </select>
        </div>
      </div>

      {/* Product Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-4 gap-y-8">
        {products?.map((product) => (
          <ProductCard
            key={product.id}
            product={product}
          />
        ))}
      </div>
    </>
  );
};
