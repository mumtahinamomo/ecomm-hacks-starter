import { Link } from "react-router-dom";
import { Search, User, Heart, ShoppingBag, BookOpen, Loader2 } from "lucide-react";
import { useCart } from "@/contexts/CartContext";
import { useAuth } from "@/contexts/AuthContext";
import { useCatalog } from "@/hooks/useCatalog";
import { Button } from "@/components/ui/button";

const navLinks = ["WOMEN", "MEN", "KIDS", "BABY"];

export const Header = () => {
  const { totalItems } = useCart();
  const { user } = useAuth();
  const { generateAndNavigate, isGenerating } = useCatalog();

  const handleViewCatalog = async () => {
    if (user?.id) {
      await generateAndNavigate(user.id, "classic");
    }
  };

  return (
    <header className="sticky top-0 z-50 w-full bg-background border-b border-border">
      <div className="flex items-center justify-between h-16 px-4 lg:px-8">
        {/* Logo */}
        <div className="flex items-center gap-6">
          <Link to="/" className="px-3 h-10 bg-primary flex items-center justify-center rounded">
            <span className="text-primary-foreground font-bold text-sm tracking-wider">
              OUTFITTED
            </span>
          </Link>
        </div>

        {/* Navigation */}
        <nav className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <a
              key={link}
              href="#"
              className={`uniqlo-link ${link === "WOMEN" ? "font-bold" : ""}`}
            >
              {link}
            </a>
          ))}
        </nav>

        {/* Right Section */}
        <div className="flex items-center gap-3">
          {/* My Catalog Button */}
          <Button
            onClick={handleViewCatalog}
            disabled={isGenerating || !user}
            variant="outline"
            size="sm"
            className="hidden sm:flex items-center gap-2 border-primary/30 text-primary hover:bg-primary hover:text-primary-foreground"
          >
            {isGenerating ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <BookOpen className="w-4 h-4" />
            )}
            <span className="text-xs tracking-wider">My Catalog</span>
          </Button>

          {/* Search */}
          <div className="hidden sm:flex items-center bg-secondary rounded-full px-4 py-2 gap-2">
            <Search className="w-4 h-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search"
              className="bg-transparent text-sm outline-none w-32 lg:w-48 placeholder:text-muted-foreground"
            />
          </div>

          {/* Icons */}
          <button className="p-2 hover:bg-secondary rounded-full transition-colors">
            <Search className="w-5 h-5 sm:hidden" />
            <User className="w-5 h-5 hidden sm:block" />
          </button>
          <button className="p-2 hover:bg-secondary rounded-full transition-colors">
            <Heart className="w-5 h-5" />
          </button>
          <Link
            to="/cart"
            className="p-2 hover:bg-secondary rounded-full transition-colors relative"
          >
            <ShoppingBag className="w-5 h-5" />
            {totalItems > 0 && (
              <span className="absolute -top-1 -right-1 w-5 h-5 bg-primary text-primary-foreground text-xs rounded-full flex items-center justify-center font-medium">
                {totalItems > 99 ? "99+" : totalItems}
              </span>
            )}
          </Link>
        </div>
      </div>
    </header>
  );
};
