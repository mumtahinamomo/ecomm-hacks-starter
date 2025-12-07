import { Header } from "@/components/Header";
import { Breadcrumb } from "@/components/Breadcrumb";
import { FilterSidebar } from "@/components/FilterAccordion";
import { ProductGrid } from "@/components/ProductGrid";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="max-w-[1440px] mx-auto px-4 lg:px-8">
        <Breadcrumb />
        
        <div className="flex flex-col lg:flex-row gap-8 pb-16">
          {/* Sidebar - Hidden on mobile */}
          <div className="hidden lg:block">
            <FilterSidebar />
          </div>

          {/* Mobile Filter Toggle */}
          <div className="lg:hidden">
            <button className="w-full py-3 border border-border text-sm font-medium flex items-center justify-center gap-2">
              Filter & Sort
            </button>
          </div>

          {/* Product Grid */}
          <div className="flex-1">
            <ProductGrid />
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-border bg-secondary py-12 mt-8">
        <div className="max-w-[1440px] mx-auto px-4 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div>
              <h4 className="text-xs font-semibold uppercase tracking-wider mb-4">Help</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><a href="#" className="hover:text-foreground transition-colors">FAQ</a></li>
                <li><a href="#" className="hover:text-foreground transition-colors">Shipping</a></li>
                <li><a href="#" className="hover:text-foreground transition-colors">Returns</a></li>
                <li><a href="#" className="hover:text-foreground transition-colors">Order Status</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-xs font-semibold uppercase tracking-wider mb-4">Company</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><a href="#" className="hover:text-foreground transition-colors">About Us</a></li>
                <li><a href="#" className="hover:text-foreground transition-colors">Careers</a></li>
                <li><a href="#" className="hover:text-foreground transition-colors">Sustainability</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-xs font-semibold uppercase tracking-wider mb-4">Store</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><a href="#" className="hover:text-foreground transition-colors">Find a Store</a></li>
                <li><a href="#" className="hover:text-foreground transition-colors">Gift Cards</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-xs font-semibold uppercase tracking-wider mb-4">Follow Us</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><a href="#" className="hover:text-foreground transition-colors">Instagram</a></li>
                <li><a href="#" className="hover:text-foreground transition-colors">Twitter</a></li>
                <li><a href="#" className="hover:text-foreground transition-colors">Facebook</a></li>
              </ul>
            </div>
          </div>
          <div className="mt-12 pt-8 border-t border-border text-center text-xs text-muted-foreground">
            © 2024 UNIQLO Clone. This is a demo for Virtual Try-On technology.
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
