import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { useCart } from "@/contexts/CartContext";
import { 
  ArrowLeft, 
  ShoppingCart, 
  Trash2, 
  Minus, 
  Plus, 
  Truck, 
  Shield, 
  Clock,
  MapPin,
  CreditCard,
  Gift,
  Percent,
  CheckCircle,
  AlertCircle
} from "lucide-react";

const Cart = () => {
  if (process.env.NODE_ENV === 'development') {
    console.log('[diag] Cart render start');
  }
  const navigate = useNavigate();
  const { cartItems, updateQuantity, removeItem, clearCart } = useCart();
  const { toast } = useToast();
  const [promoCode, setPromoCode] = useState("");
  const [appliedPromo, setAppliedPromo] = useState<string | null>(null);

  // Calculate totals
  const subtotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const originalTotal = cartItems.reduce((sum, item) => sum + ((item.originalPrice || item.price) * item.quantity), 0);
  const savings = originalTotal - subtotal;
  const deliveryFee = 0;
  const total = subtotal + deliveryFee;

  const handleQuantityChange = (id: string, change: number) => {
    const item = cartItems.find(item => item.id === id);
    if (item) {
      const newQuantity = item.quantity + change;
      if (newQuantity >= 1) {
        updateQuantity(id, newQuantity);
      }
    }
  };

  const handleRemoveItem = (id: string) => {
    removeItem(id);
    toast({
      title: "Item removed",
      description: "Item has been removed from your cart.",
    });
  };

  const handleApplyPromo = () => {
    if (promoCode.toLowerCase() === "welcome10") {
      setAppliedPromo("WELCOME10");
      toast({
        title: "Promo code applied!",
        description: "You saved 10% on your order.",
      });
    } else {
      toast({
        title: "Invalid promo code",
        description: "Please check your code and try again.",
        variant: "destructive",
      });
    }
  };

  const handleCheckout = () => {
    navigate("/checkout");
  };

  const handleClearCart = () => {
    clearCart();
    toast({
      title: "Cart cleared",
      description: "All items have been removed from your cart.",
    });
  };

  if (process.env.NODE_ENV === 'development') {
    console.log('[diag] Cart context ok, items:', cartItems.length);
  }

  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        
        <div className="container mx-auto px-4 py-8 sm:py-12 md:py-16">
          <div className="text-center max-w-md mx-auto">
            <div className="w-20 h-20 sm:w-24 sm:h-24 mx-auto mb-4 sm:mb-6 bg-muted rounded-full flex items-center justify-center">
              <ShoppingCart className="h-10 w-10 sm:h-12 sm:w-12 text-muted-foreground" />
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold text-wine mb-3 sm:mb-4">Your cart is empty</h1>
            <p className="text-muted-foreground mb-6 sm:mb-8 text-sm sm:text-base">
              Looks like you haven't added any drinks to your cart yet. Start shopping to fill it up!
            </p>
            <Link to="/">
              <Button size="lg" className="bg-wine hover:bg-wine-light text-white">
                Start Shopping
              </Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <div className="container mx-auto px-3 sm:px-4 py-3 sm:py-6 md:py-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4 sm:mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4 flex-1">
            <Link to="/">
              <Button variant="outline" size="sm" className="w-fit">
                <ArrowLeft className="h-4 w-4 mr-2" />
                <span className="hidden sm:inline">Continue Shopping</span>
                <span className="sm:hidden">Continue</span>
              </Button>
            </Link>
            <div>
              <h1 className="text-xl sm:text-3xl md:text-4xl font-bold text-wine">Shopping Cart</h1>
              <p className="text-xs sm:text-base text-muted-foreground mt-1 sm:mt-2">
                {cartItems.length} {cartItems.length === 1 ? 'item' : 'items'} in your cart
              </p>
            </div>
          </div>
          
          <Button 
            variant="outline" 
            size="sm"
            onClick={handleClearCart}
            className="text-destructive hover:text-destructive w-fit"
          >
            <Trash2 className="h-4 w-4 mr-2" />
            <span className="hidden sm:inline">Clear Cart</span>
            <span className="sm:hidden">Clear</span>
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 lg:gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-3">
            {cartItems.map((item) => (
              <Card key={item.id} className="overflow-hidden">
                <div className="flex flex-col sm:flex-row">
                  <div className="w-full sm:w-24 md:w-32 h-36 sm:h-24 md:h-32 flex-shrink-0">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  
                  <div className="flex-1 p-3 sm:p-6">
                    <div className="flex justify-between items-start mb-2 sm:mb-2">
                      <div className="flex-1">
                        <h3 className="text-sm sm:text-lg font-semibold text-wine mb-1 leading-tight">{item.name}</h3>
                        {item.selectedSku && (
                          <Badge variant="secondary" className="text-xs mb-1 bg-wine/10 text-wine border-wine/20">
                            SKU: {item.selectedSku}
                          </Badge>
                        )}
                        <div className="flex items-center gap-1 sm:gap-2 mb-2 flex-wrap">
                          <Badge variant="outline" className="text-xs">
                            {typeof item.category === 'string' ? item.category : item.category?.name || 'Unknown'}
                          </Badge>
                          <span className="text-xs sm:text-sm text-muted-foreground">{item.alcohol}</span>
                          <span className="text-xs sm:text-sm text-muted-foreground">{item.volume}</span>
                        </div>
                        {!item.inStock && (
                          <Badge variant="destructive" className="text-xs">
                            Out of Stock
                          </Badge>
                        )}
                      </div>
                      
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleRemoveItem(item.id)}
                        className="text-destructive hover:text-destructive flex-shrink-0 h-7 w-7 p-0 sm:h-9 sm:w-9"
                      >
                        <Trash2 className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                      </Button>
                    </div>
                    
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 sm:gap-0">
                      <div className="flex items-center gap-1.5 sm:gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleQuantityChange(item.id, -1)}
                          disabled={item.quantity <= 1}
                          className="h-7 w-7 sm:h-8 sm:w-8 p-0"
                        >
                          <Minus className="h-3 w-3 sm:h-4 sm:w-4" />
                        </Button>
                        <span className="w-7 sm:w-12 text-center font-medium text-xs sm:text-base">{item.quantity}</span>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleQuantityChange(item.id, 1)}
                          className="h-7 w-7 sm:h-8 sm:w-8 p-0"
                        >
                          <Plus className="h-3 w-3 sm:h-4 sm:w-4" />
                        </Button>
                      </div>
                      
                      <div className="text-right">
                        <div className="flex items-center gap-2">
                          <span className="text-base sm:text-xl font-bold text-wine">
                            {(item.price * item.quantity).toFixed(2)}
                          </span>
                          {item.originalPrice && item.originalPrice > item.price && (
                            <span className="text-xs sm:text-sm text-muted-foreground line-through">
                              {(item.originalPrice * item.quantity).toFixed(2)}
                            </span>
                          )}
                        </div>
                        {item.originalPrice && item.originalPrice > item.price && (
                          <div className="text-xs sm:text-sm text-green-600 font-medium">
                            Save {((item.originalPrice - item.price) * item.quantity).toFixed(2)}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <Card className="sticky top-20">
              <CardHeader className="pb-3">
                <CardTitle className="text-base sm:text-lg">Order Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {/* Promo Code */}
                <div className="space-y-2">
                  <label className="text-xs sm:text-sm font-medium">Promo Code</label>
                  <div className="flex gap-2">
                    <Input
                      placeholder="Enter code"
                      value={promoCode}
                      onChange={(e) => setPromoCode(e.target.value)}
                      className="flex-1 h-8 sm:h-10 text-xs sm:text-sm"
                    />
                    <Button 
                      variant="outline" 
                      onClick={handleApplyPromo}
                      disabled={!promoCode}
                      size="sm"
                      className="text-xs sm:text-sm"
                    >
                      Apply
                    </Button>
                  </div>
                  {appliedPromo && (
                    <div className="flex items-center gap-2 text-xs sm:text-sm text-green-600">
                      <CheckCircle className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                      <span>Promo code {appliedPromo} applied</span>
                    </div>
                  )}
                </div>

                <Separator />

                {/* Pricing Breakdown */}
                <div className="space-y-2">
                  <div className="flex justify-between text-xs sm:text-sm">
                    <span>Subtotal ({cartItems.length} items)</span>
                    <span>{subtotal.toFixed(2)}</span>
                  </div>
                  
                  {savings > 0 && (
                    <div className="flex justify-between text-xs sm:text-sm text-green-600">
                      <span>Savings</span>
                      <span>-{savings.toFixed(2)}</span>
                    </div>
                  )}
                  
                  
                </div>

                <Separator />

                <div className="flex justify-between text-sm sm:text-lg font-bold">
                  <span>Total</span>
                  <span>{total.toFixed(2)}</span>
                </div>

                {/* Delivery Info */}
                <div className="space-y-2 p-3 bg-muted/30 rounded-lg">
                  <div className="flex items-center gap-2">
                    <Clock className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-wine" />
                    <span className="text-xs sm:text-sm font-medium">24 hour delivery services</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-wine" />
                    <span className="text-xs sm:text-sm text-muted-foreground">Deliver to 10001</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Shield className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-wine" />
                    <span className="text-xs sm:text-sm text-muted-foreground">Age verification required</span>
                  </div>
                </div>

                {/* Checkout Button */}
                <Button 
                  onClick={handleCheckout}
                  size="sm" 
                  className="w-full bg-wine hover:bg-wine-light text-white text-sm sm:text-base py-5"
                >
                  <CreditCard className="h-4 w-4 mr-2" />
                  Proceed to Checkout
                </Button>

                {/* Security Notice */}
                <div className="text-center text-xs text-muted-foreground">
                  <div className="flex items-center justify-center gap-1 mb-1">
                    <Shield className="h-3 w-3" />
                    <span>Secure checkout</span>
                  </div>
                  <p>Your payment information is encrypted and secure</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Additional Info */}
        <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card>
            <CardContent className="p-6 text-center">
              <Truck className="h-8 w-8 text-wine mx-auto mb-3" />
              <h3 className="font-semibold mb-2">Fast Delivery</h3>
              <p className="text-sm text-muted-foreground">
                Get your drinks delivered in 30 minutes or less
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6 text-center">
              <Shield className="h-8 w-8 text-wine mx-auto mb-3" />
              <h3 className="font-semibold mb-2">Secure Payment</h3>
              <p className="text-sm text-muted-foreground">
                Your payment information is protected and encrypted
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6 text-center">
              <Gift className="h-8 w-8 text-wine mx-auto mb-3" />
              <h3 className="font-semibold mb-2">Easy Returns</h3>
              <p className="text-sm text-muted-foreground">
                Not satisfied? Return within 30 days for a full refund
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
      
      {/* Footer */}
      <Footer />
    </div>
  );
};

export default Cart;
