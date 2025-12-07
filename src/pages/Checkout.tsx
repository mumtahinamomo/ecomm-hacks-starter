import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ArrowLeft, CreditCard, Truck, CheckCircle } from "lucide-react";
import { Header } from "@/components/Header";
import { useCart } from "@/contexts/CartContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { toast } from "@/hooks/use-toast";

const Checkout = () => {
  const { items, clearCart } = useCart();
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [shippingMethod, setShippingMethod] = useState("standard");
  const [paymentMethod, setPaymentMethod] = useState("card");

  const subtotal = items.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0
  );
  const shippingCost = shippingMethod === "express" ? 14.95 : subtotal >= 99 ? 0 : 7.95;
  const tax = subtotal * 0.08;
  const total = subtotal + shippingCost + tax;

  const handlePlaceOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate order processing
    await new Promise((resolve) => setTimeout(resolve, 1500));
    
    clearCart();
    toast({
      title: "Order placed successfully!",
      description: "Thank you for your purchase. You will receive a confirmation email shortly.",
    });
    navigate("/");
    setIsSubmitting(false);
  };

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="max-w-4xl mx-auto px-4 py-12 text-center">
          <CheckCircle className="w-16 h-16 mx-auto text-green-500 mb-4" />
          <h1 className="text-2xl font-bold text-foreground mb-2">Your cart is empty</h1>
          <p className="text-muted-foreground mb-8">
            Add some items to your cart before checking out.
          </p>
          <Link to="/">
            <Button className="rounded-full px-8">Continue Shopping</Button>
          </Link>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="max-w-6xl mx-auto px-4 py-8 lg:py-12">
        {/* Back to Cart */}
        <Link
          to="/cart"
          className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors mb-6"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to cart
        </Link>

        <h1 className="text-2xl font-bold text-foreground mb-8">Checkout</h1>

        <form onSubmit={handlePlaceOrder}>
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Left Column - Forms */}
            <div className="lg:col-span-2 space-y-8">
              {/* Shipping Address */}
              <section className="bg-card rounded-xl p-6 border border-border">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-bold">
                    1
                  </div>
                  <h2 className="text-lg font-semibold text-foreground">
                    Shipping Address
                  </h2>
                </div>

                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="firstName">First Name</Label>
                    <Input id="firstName" placeholder="John" required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="lastName">Last Name</Label>
                    <Input id="lastName" placeholder="Doe" required />
                  </div>
                  <div className="space-y-2 sm:col-span-2">
                    <Label htmlFor="email">Email</Label>
                    <Input id="email" type="email" placeholder="john@example.com" required />
                  </div>
                  <div className="space-y-2 sm:col-span-2">
                    <Label htmlFor="address">Address</Label>
                    <Input id="address" placeholder="123 Main Street" required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="city">City</Label>
                    <Input id="city" placeholder="New York" required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="state">State</Label>
                    <Input id="state" placeholder="NY" required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="zip">ZIP Code</Label>
                    <Input id="zip" placeholder="10001" required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone</Label>
                    <Input id="phone" type="tel" placeholder="(555) 123-4567" required />
                  </div>
                </div>
              </section>

              {/* Shipping Method */}
              <section className="bg-card rounded-xl p-6 border border-border">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-bold">
                    2
                  </div>
                  <h2 className="text-lg font-semibold text-foreground">
                    Shipping Method
                  </h2>
                </div>

                <RadioGroup value={shippingMethod} onValueChange={setShippingMethod} className="space-y-3">
                  <label
                    className={`flex items-center justify-between p-4 rounded-lg border cursor-pointer transition-colors ${
                      shippingMethod === "standard"
                        ? "border-primary bg-primary/5"
                        : "border-border hover:border-muted-foreground"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <RadioGroupItem value="standard" id="standard" />
                      <div>
                        <p className="font-medium text-foreground">Standard Shipping</p>
                        <p className="text-sm text-muted-foreground">5-7 business days</p>
                      </div>
                    </div>
                    <span className="font-semibold text-foreground">
                      {subtotal >= 99 ? "FREE" : "$7.95"}
                    </span>
                  </label>

                  <label
                    className={`flex items-center justify-between p-4 rounded-lg border cursor-pointer transition-colors ${
                      shippingMethod === "express"
                        ? "border-primary bg-primary/5"
                        : "border-border hover:border-muted-foreground"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <RadioGroupItem value="express" id="express" />
                      <div>
                        <p className="font-medium text-foreground">Express Shipping</p>
                        <p className="text-sm text-muted-foreground">2-3 business days</p>
                      </div>
                    </div>
                    <span className="font-semibold text-foreground">$14.95</span>
                  </label>
                </RadioGroup>
              </section>

              {/* Payment Method */}
              <section className="bg-card rounded-xl p-6 border border-border">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-bold">
                    3
                  </div>
                  <h2 className="text-lg font-semibold text-foreground">
                    Payment Method
                  </h2>
                </div>

                <RadioGroup value={paymentMethod} onValueChange={setPaymentMethod} className="space-y-3 mb-6">
                  <label
                    className={`flex items-center gap-3 p-4 rounded-lg border cursor-pointer transition-colors ${
                      paymentMethod === "card"
                        ? "border-primary bg-primary/5"
                        : "border-border hover:border-muted-foreground"
                    }`}
                  >
                    <RadioGroupItem value="card" id="card" />
                    <CreditCard className="w-5 h-5 text-muted-foreground" />
                    <span className="font-medium text-foreground">Credit / Debit Card</span>
                  </label>
                </RadioGroup>

                {paymentMethod === "card" && (
                  <div className="space-y-4 pl-8">
                    <div className="space-y-2">
                      <Label htmlFor="cardNumber">Card Number</Label>
                      <Input id="cardNumber" placeholder="1234 5678 9012 3456" required />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="expiry">Expiry Date</Label>
                        <Input id="expiry" placeholder="MM/YY" required />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="cvv">CVV</Label>
                        <Input id="cvv" placeholder="123" required />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="cardName">Name on Card</Label>
                      <Input id="cardName" placeholder="John Doe" required />
                    </div>
                  </div>
                )}
              </section>
            </div>

            {/* Right Column - Order Summary */}
            <div className="lg:col-span-1">
              <div className="bg-muted/50 rounded-xl p-6 sticky top-24">
                <h2 className="text-lg font-semibold text-foreground mb-4">
                  Order Summary
                </h2>

                {/* Items Preview */}
                <div className="space-y-4 mb-4">
                  {items.map((item) => (
                    <div key={item.product.id} className="flex gap-3">
                      <div className="w-16 h-20 bg-background rounded-lg overflow-hidden flex-shrink-0">
                        <img
                          src={item.product.image}
                          alt={item.product.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-foreground line-clamp-2">
                          {item.product.name}
                        </p>
                        <p className="text-xs text-muted-foreground mt-1">
                          Qty: {item.quantity}
                        </p>
                        <p className="text-sm font-semibold text-foreground mt-1">
                          ${(item.product.price * item.quantity).toFixed(2)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                <Separator className="my-4" />

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
                      {shippingCost === 0 ? "FREE" : `$${shippingCost.toFixed(2)}`}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Tax</span>
                    <span className="font-medium text-foreground">
                      ${tax.toFixed(2)}
                    </span>
                  </div>
                </div>

                <Separator className="my-4" />

                <div className="flex justify-between text-base font-bold mb-6">
                  <span>Total</span>
                  <span>${total.toFixed(2)}</span>
                </div>

                <Button
                  type="submit"
                  className="w-full rounded-full py-6 font-semibold text-base"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "Processing..." : "Place Order"}
                </Button>

                <p className="mt-4 text-xs text-muted-foreground text-center">
                  By placing your order, you agree to our Terms of Service and Privacy Policy.
                </p>
              </div>
            </div>
          </div>
        </form>
      </main>
    </div>
  );
};

export default Checkout;
