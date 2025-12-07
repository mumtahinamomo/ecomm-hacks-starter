import { Link, useNavigate } from "react-router-dom";
import { Trash2, Plus, Minus, ShoppingBag } from "lucide-react";
import { Header } from "@/components/Header";
import { useCart } from "@/contexts/CartContext";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

const Cart = () => {
  const { items, removeFromCart, updateQuantity, clearCart, totalItems } = useCart();
  const navigate = useNavigate();

  const subtotal = items.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0
  );
  const shipping = subtotal >= 99 ? 0 : 7.95;
  const total = subtotal + shipping;

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="max-w-4xl mx-auto px-4 py-12">
          <h1 className="text-2xl font-bold text-foreground mb-8">Shopping cart</h1>
          <Separator className="mb-8" />
          
          <div className="text-center py-16">
            <ShoppingBag className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
            <p className="text-foreground mb-2">Your cart is currently empty.</p>
            <p className="text-muted-foreground text-sm mb-8">
              Items you have previously added can be found in your cart.
            </p>
            <Link to="/">
              <Button className="rounded-full px-8">Continue Shopping</Button>
            </Link>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="max-w-6xl mx-auto px-4 py-8 lg:py-12">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-foreground">Shopping cart</h1>
          <span className="text-sm text-muted-foreground">
            {totalItems} {totalItems === 1 ? "item" : "items"}
          </span>
        </div>
        <Separator className="mb-8" />

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-6">
            {items.map((item) => (
              <div
                key={item.product.id}
                className="flex gap-4 pb-6 border-b border-border"
              >
                {/* Product Image */}
                <Link to="/" className="flex-shrink-0">
                  <div className="w-24 h-32 sm:w-32 sm:h-40 bg-muted rounded-lg overflow-hidden">
                    <img
                      src={item.product.image}
                      alt={item.product.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                </Link>

                {/* Product Details */}
                <div className="flex-1 min-w-0">
                  <p className="text-xs uppercase tracking-wider text-muted-foreground">
                    {item.product.category}
                  </p>
                  <Link to="/">
                    <h3 className="text-sm font-medium text-foreground mt-1 hover:underline line-clamp-2">
                      {item.product.name}
                    </h3>
                  </Link>

                  {/* Color */}
                  {item.product.colors && item.product.colors.length > 0 && (
                    <div className="flex items-center gap-2 mt-2">
                      <span className="text-xs text-muted-foreground">Color:</span>
                      <div
                        className="w-4 h-4 rounded-full border border-border"
                        style={{ backgroundColor: item.product.colors[0].hex }}
                        title={item.product.colors[0].name}
                      />
                      <span className="text-xs text-muted-foreground">
                        {item.product.colors[0].name}
                      </span>
                    </div>
                  )}

                  {/* Price */}
                  <div className="flex items-center gap-2 mt-3">
                    <span className="text-lg font-bold text-foreground">
                      ${item.product.price.toFixed(2)}
                    </span>
                    {item.product.originalPrice && (
                      <span className="text-sm text-muted-foreground line-through">
                        ${item.product.originalPrice.toFixed(2)}
                      </span>
                    )}
                  </div>

                  {/* Quantity & Remove */}
                  <div className="flex items-center justify-between mt-4">
                    <div className="flex items-center border border-border rounded-lg">
                      <button
                        onClick={() =>
                          updateQuantity(item.product.id, Math.max(1, item.quantity - 1))
                        }
                        className="p-2 hover:bg-muted transition-colors"
                        aria-label="Decrease quantity"
                      >
                        <Minus className="w-4 h-4" />
                      </button>
                      <span className="px-4 py-2 text-sm font-medium min-w-[40px] text-center">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                        className="p-2 hover:bg-muted transition-colors"
                        aria-label="Increase quantity"
                      >
                        <Plus className="w-4 h-4" />
                      </button>
                    </div>
                    <button
                      onClick={() => removeFromCart(item.product.id)}
                      className="text-muted-foreground hover:text-destructive transition-colors p-2"
                      aria-label="Remove item"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </div>
            ))}

            {/* Clear Cart */}
            <div className="pt-4">
              <button
                onClick={clearCart}
                className="text-sm text-muted-foreground hover:text-foreground underline transition-colors"
              >
                Clear cart
              </button>
            </div>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-muted/50 rounded-xl p-6 sticky top-24">
              <h2 className="text-lg font-semibold text-foreground mb-4">
                Order Summary
              </h2>

              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span className="font-medium text-foreground">
                    ${subtotal.toFixed(2)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Shipping</span>
                  <span className="font-medium text-foreground">
                    {shipping === 0 ? "FREE" : `$${shipping.toFixed(2)}`}
                  </span>
                </div>
                {subtotal < 99 && (
                  <p className="text-xs text-muted-foreground bg-background rounded-lg p-3">
                    Add ${(99 - subtotal).toFixed(2)} more for free shipping!
                  </p>
                )}
              </div>

              <Separator className="my-4" />

              <div className="flex justify-between text-base font-bold mb-6">
                <span>Estimated Total</span>
                <span>${total.toFixed(2)}</span>
              </div>

              <Button
                className="w-full rounded-full py-6 font-semibold text-base"
                onClick={() => navigate("/checkout")}
              >
                Proceed to Checkout
              </Button>

              <div className="mt-4 text-center">
                <Link
                  to="/"
                  className="text-sm text-muted-foreground hover:text-foreground underline transition-colors"
                >
                  Continue Shopping
                </Link>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Cart;