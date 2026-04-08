import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Label } from "@/components/ui/label";
import { useCart } from "@/contexts/CartContext";
import { useUser } from "@/contexts/UserContext";
import { useToast } from "@/hooks/use-toast";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { LoginModal } from "@/components/auth/LoginModal";
import { 
  CreditCard, 
  Truck, 
  Lock,
  CheckCircle,
  AlertCircle,
  ArrowLeft,
  Star
} from "lucide-react";

declare global {
  interface Window {
    PaystackPop?: any;
  }
}

const Checkout = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { cartItems, updateQuantity, removeItem, clearCart } = useCart();
  const { user, isAuthenticated, addLoyaltyPoints, getLoyaltyPoints, createOrder } = useUser();
  
  // Debug cart items on component mount
  useEffect(() => {
    console.log('=== CHECKOUT COMPONENT MOUNT ===');
    console.log('Cart items in checkout:', cartItems);
    console.log('Cart items length:', cartItems.length);
    console.log('Cart items type:', typeof cartItems);
  }, [cartItems]);
  
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState("paystack");
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [formErrors, setFormErrors] = useState<{[key: string]: string}>({});
  
  // Form states
  const [formData, setFormData] = useState({
    name: user ? `${user.firstName} ${user.lastName}` : "",
    email: user?.email || "",
    phone: user?.phone || "",
    address: user?.address ? `${user.address.street}, ${user.address.city}, ${user.address.state} ${user.address.zipCode}` : "",
    instructions: ""
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
    }));
    
    // Clear error when user starts typing
    if (formErrors[name]) {
      setFormErrors(prev => ({
        ...prev,
        [name]: ""
      }));
    }
  };

  const isFormValid = () => {
    return formData.name.trim() && 
           formData.email.trim() && 
           /\S+@\S+\.\S+/.test(formData.email) &&
           formData.phone.trim() && 
           formData.address.trim();
  };

  const validateForm = () => {
    const errors: {[key: string]: string} = {};
    
    // Required fields validation
    if (!formData.name.trim()) {
      errors.name = "Name is required";
    }
    if (!formData.email.trim()) {
      errors.email = "Email address is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      errors.email = "Please enter a valid email address";
    }
    if (!formData.phone.trim()) {
      errors.phone = "Phone number is required";
    }
    if (!formData.address.trim()) {
      errors.address = "Address is required";
    }
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const calculateSubtotal = () => {
    return cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  const calculateTax = () => {
    return 0; // No tax
  };

  const calculateServiceFee = () => {
    return 0; // No service fee
  };

  const calculateDeliveryFee = () => {
    return 300;
  };

  const calculateTotal = () => {
    // Savings are intentionally not calculated on the checkout page.
    return calculateSubtotal() + calculateTax() + calculateServiceFee() + calculateDeliveryFee();
  };

  const calculateLoyaltyPointsEarned = () => {
    return Math.floor(calculateSubtotal() / 1000) * 10;
  };

  // Redirect to cart if cart is empty
  useEffect(() => {
    if (cartItems.length === 0) {
      navigate('/cart');
    }
  }, [cartItems.length, navigate]);

  const loadPaystackScript = async () => {
    if (typeof window === "undefined") return;
    if (window.PaystackPop) return;

    await new Promise<void>((resolve, reject) => {
      const existing = document.querySelector(
        'script[src="https://js.paystack.co/v1/inline.js"]'
      );

      if (existing) {
        resolve();
        return;
      }

      const script = document.createElement("script");
      script.src = "https://js.paystack.co/v1/inline.js";
      script.async = true;
      script.onload = () => resolve();
      script.onerror = () => reject(new Error("Failed to load Paystack script"));
      document.body.appendChild(script);
    });
  };

  const handlePaystackPayment = async () => {
    setIsProcessing(true);
  
    try {
      if (!cartItems || cartItems.length === 0) {
        toast({
          title: "Cart is empty",
          description: "Please add items to your cart before placing an order.",
          variant: "destructive",
        });
        setIsProcessing(false);
        return;
      }

      const cartItemsCopy = [...cartItems];
      const orderData = {
        items: cartItemsCopy.map(item => ({
          productId: parseInt(item.id),
          quantity: item.quantity,
          price: item.price
        })),
        subtotal: calculateSubtotal(),
        tax: calculateTax(),
        shipping: calculateDeliveryFee(),
        total: calculateTotal(),
        shippingAddress: formData.address,
        billingAddress: formData.address,
        customerName: formData.name,
        customerEmail: formData.email,
        customerPhone: formData.phone,
        notes: formData.instructions,
        paymentMethod: "paystack"
      };

      if (!orderData.items || orderData.items.length === 0) {
        toast({
          title: "Order Error",
          description: "No items found in order. Please try again.",
          variant: "destructive",
        });
        setIsProcessing(false);
        return;
      }

      const paystackPublicKey = (import.meta.env.VITE_PAYSTACK_PUBLIC_KEY ?? "") as string;
      if (!paystackPublicKey) {
        toast({
          title: "Paystack not configured",
          description: "Missing `VITE_PAYSTACK_PUBLIC_KEY`. Add it to your client environment variables.",
          variant: "destructive",
        });
        setIsProcessing(false);
        return;
      }

      await loadPaystackScript();

      if (!window.PaystackPop) {
        toast({
          title: "Paystack not available",
          description: "Paystack script failed to initialize. Please try again.",
          variant: "destructive",
        });
        setIsProcessing(false);
        return;
      }

      const total = calculateTotal();
      const amountKobo = Math.round(total * 100);
      const reference = `ORD-${Date.now()}-${Math.floor(Math.random() * 1_000_000)}`;

      window.PaystackPop.setup({
        key: paystackPublicKey,
        email: formData.email,
        amount: amountKobo,
        currency: "KES",
        ref: reference,
        metadata: {
          custom_fields: [
            { display_name: "Customer Name", variable_name: "customer_name", value: formData.name },
            { display_name: "Customer Phone", variable_name: "customer_phone", value: formData.phone }
          ]
        },
        callback: function (response: any) {
          // Paystack sometimes validates that callback is a "plain" function (not an async function).
          // We still run async logic inside and do not return a Promise from this callback.
          void (async () => {
            try {
              if (response?.status !== "success") {
                toast({
                  title: "Payment not completed",
                  description: "Your payment did not complete successfully. Please try again.",
                  variant: "destructive",
                });
                return;
              }

              const orderResponse = await createOrder({
                ...orderData,
                paymentMethod: "paystack",
                notes: `${orderData.notes || ""}\nPaystack reference: ${response.reference || reference}`.trim()
              });

              if (!orderResponse) {
                toast({
                  title: "Order creation failed",
                  description: "There was an error creating your order.",
                  variant: "destructive",
                });
                return;
              }

              if (isAuthenticated && user) {
                const pointsEarned = calculateLoyaltyPointsEarned();
                addLoyaltyPoints(pointsEarned);
                toast({
                  title: "Payment Successful!",
                  description: `Your order #${orderResponse.orderNumber} has been placed. You earned ${pointsEarned} loyalty points!`,
                });
              } else {
                toast({
                  title: "Payment Successful!",
                  description: `Your order #${orderResponse.orderNumber} has been placed.`,
                });
              }

              clearCart();
              navigate("/");
            } catch (e: any) {
              toast({
                title: "Payment Success, but Order Failed",
                description: e?.message || "Please contact support.",
                variant: "destructive",
              });
            } finally {
              setIsProcessing(false);
            }
          })();
        },
        onClose: () => {
          toast({
            title: "Payment cancelled",
            description: "You closed the Paystack window before completing payment.",
            variant: "destructive",
          });
          setIsProcessing(false);
        }
      }).openIframe();
    } catch (error: any) {
      toast({
        title: "Payment Failed",
        description: error?.message || "Unknown error. Please try again or contact support.",
        variant: "destructive",
      });
      setIsProcessing(false);
    }
  };

  const handleCashOnDelivery = async () => {
    setIsProcessing(true);
    
    try {
      // Validate cart items
      if (!cartItems || cartItems.length === 0) {
        toast({
          title: "Cart is empty",
          description: "Please add items to your cart before placing an order.",
          variant: "destructive",
        });
        setIsProcessing(false);
        return;
      }

      console.log('=== CHECKOUT VALIDATION ===');
      console.log('Cart items:', cartItems);
      console.log('Cart items length:', cartItems.length);
      console.log('Cart items type:', typeof cartItems);

      // Create a copy of cart items to prevent any potential issues
      const cartItemsCopy = [...cartItems];
      console.log('Cart items copy:', cartItemsCopy);
      console.log('Cart items copy length:', cartItemsCopy.length);

      const orderData = {
        items: cartItemsCopy.map(item => ({
          productId: parseInt(item.id),
          quantity: item.quantity,
          price: item.price
        })),
        subtotal: calculateSubtotal(),
        tax: calculateTax(),
        shipping: calculateDeliveryFee(),
        total: calculateTotal(),
        shippingAddress: formData.address,
        billingAddress: formData.address,
        customerName: formData.name,
        customerEmail: formData.email,
        customerPhone: formData.phone,
        notes: formData.instructions,
        paymentMethod: 'cash_on_delivery'
      };

      console.log('=== CHECKOUT CASH ON DELIVERY START ===');
      console.log('Order data being created:', JSON.stringify(orderData, null, 2));
      console.log('Cart items:', cartItems);
      console.log('Form data:', formData);
      console.log('Order data items:', orderData.items);
      console.log('Order data items length:', orderData.items.length);
      console.log('Order data items type:', typeof orderData.items);

      // Final validation before sending
      if (!orderData.items || orderData.items.length === 0) {
        console.error('Order data items is empty or undefined!');
        toast({
          title: "Order Error",
          description: "No items found in order. Please try again.",
          variant: "destructive",
        });
        setIsProcessing(false);
        return;
      }

      console.log('Calling createOrder function...');
      console.log('OrderData being passed to createOrder:', orderData);
      console.log('OrderData type:', typeof orderData);
      console.log('OrderData is undefined:', orderData === undefined);
      
      if (!orderData) {
        console.error('ERROR: orderData is undefined before calling createOrder!');
        toast({
          title: "Order Error",
          description: "Order data is missing. Please try again.",
          variant: "destructive",
        });
        setIsProcessing(false);
        return;
      }
      
      const orderResponse = await createOrder(orderData);
      console.log('=== CHECKOUT CASH ON DELIVERY RESULT ===');
      console.log('Order response received:', orderResponse);
      
      if (orderResponse) {
        // Add loyalty points for authenticated users
        if (isAuthenticated && user) {
          const pointsEarned = calculateLoyaltyPointsEarned();
          addLoyaltyPoints(pointsEarned);
          
          toast({
            title: "Order Placed!",
            description: `Your order #${orderResponse.orderNumber} has been placed. You'll pay on delivery. You earned ${pointsEarned} loyalty points!`,
          });
        } else {
          toast({
            title: "Order Placed!",
            description: `Your order #${orderResponse.orderNumber} has been placed. You'll pay on delivery.`,
          });
        }
      } else {
        console.error('=== ORDER RESPONSE IS NULL ===');
        console.error('createOrder returned null - this means there was an error in UserContext or API service');
        console.error('Check the logs above for the actual error details');
        toast({
          title: "Order Creation Failed",
          description: "There was an error creating your order. Please try again or contact support.",
          variant: "destructive",
        });
        throw new Error('Failed to create order');
      }
      
      clearCart();
      navigate("/");
    } catch (error) {
      console.error('=== CHECKOUT CASH ON DELIVERY ERROR ===');
      console.error('Order creation error:', error);
      console.error('Error message:', error.message);
      console.error('Error stack:', error.stack);
      console.error('Cart items at error time:', cartItems);
      console.error('Cart items length:', cartItems.length);
      console.error('Form data:', formData);
      console.error('Payment method:', paymentMethod);
      
      toast({
        title: "Order Failed",
        description: `There was an error placing your order: ${error.message || 'Unknown error'}. Please try again or contact support.`,
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate form before proceeding
    if (!validateForm()) {
      toast({
        title: "Please complete all required fields",
        description: "Fill in all the required delivery information to continue.",
        variant: "destructive",
      });
      return;
    }
    
    if (paymentMethod === "paystack") {
      handlePaystackPayment();
    } else {
      handleCashOnDelivery();
    }
  };

  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <div className="container mx-auto px-4 py-16">
          <div className="max-w-md mx-auto text-center">
            <div className="mb-8">
              <AlertCircle className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
              <h1 className="text-2xl font-bold text-wine mb-2">Your cart is empty</h1>
              <p className="text-muted-foreground">Add some items to your cart before checking out.</p>
            </div>
            <Button onClick={() => navigate("/")} className="bg-wine hover:bg-wine-light text-white">
              Continue Shopping
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <div className="container mx-auto px-3 sm:px-4 py-3 sm:py-8">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="flex items-center gap-2 sm:gap-4 mb-3 sm:mb-8">
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => navigate("/cart")}
              className="text-wine hover:text-wine-light p-2 sm:p-3"
            >
              <ArrowLeft className="h-4 w-4 mr-1 sm:mr-2" />
              <span className="hidden sm:inline">Back to Cart</span>
              <span className="sm:hidden">Back</span>
            </Button>
            <div>
              <h1 className="text-lg sm:text-2xl md:text-3xl font-bold text-wine">Checkout</h1>
              <p className="text-xs sm:text-base text-muted-foreground">Complete your order</p>
            </div>
          </div>

          <div className="grid lg:grid-cols-3 gap-3 sm:gap-6 lg:gap-8">
            {/* Checkout Form */}
            <div className="lg:col-span-2 space-y-4 sm:space-y-6">
              {!isAuthenticated && (
                <Card>
                  <CardContent className="p-3 sm:p-4">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                      <div>
                        <p className="text-sm sm:text-base font-semibold text-wine">Have an account?</p>
                        <p className="text-xs sm:text-sm text-muted-foreground">Sign in to autofill your details and track your order easily.</p>
                      </div>
                      <Button
                        type="button"
                        size="sm"
                        variant="outline"
                        onClick={() => setIsLoginModalOpen(true)}
                        className="text-xs sm:text-sm"
                      >
                        Sign In
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Delivery Information */}
              <Card>
                <CardHeader className="pb-3 sm:pb-6">
                  <CardTitle className="flex items-center gap-2 text-base sm:text-xl">
                    <Truck className="h-4 w-4 sm:h-5 sm:w-5 text-wine" />
                    Delivery Information
                  </CardTitle>
                  <div className="bg-wine/10 border border-wine/20 rounded-lg p-2 sm:p-3">
                    <div className="flex items-center gap-2 text-wine">
                      <AlertCircle className="h-3 w-3 sm:h-4 sm:w-4 flex-shrink-0" />
                      <span className="text-xs sm:text-sm font-medium">Name, email, phone, and address are required to place your order</span>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="p-3 sm:p-6">
                  <form onSubmit={handleSubmit} className="space-y-3 sm:space-y-6">

                    {/* Personal Information */}
                    <div className="space-y-2">
                      <Label htmlFor="name" className="text-xs sm:text-sm">Full Name *</Label>
                      <Input
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        placeholder="Enter your full name"
                        className={`h-9 text-xs sm:text-sm ${formErrors.name ? "border-red-500" : ""}`}
                      />
                      {formErrors.name && (
                        <p className="text-xs text-red-500">{formErrors.name}</p>
                      )}
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="email" className="text-xs sm:text-sm">Email Address *</Label>
                        <Input
                          id="email"
                          name="email"
                          type="email"
                          value={formData.email}
                          onChange={handleInputChange}
                          placeholder="Enter your email"
                          className={`h-9 text-xs sm:text-sm ${formErrors.email ? "border-red-500" : ""}`}
                        />
                        {formErrors.email && (
                          <p className="text-xs text-red-500">{formErrors.email}</p>
                        )}
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="phone" className="text-xs sm:text-sm">Phone Number *</Label>
                        <Input
                          id="phone"
                          name="phone"
                          type="tel"
                          value={formData.phone}
                          onChange={handleInputChange}
                          placeholder="Enter your phone number"
                          className={`h-9 text-xs sm:text-sm ${formErrors.phone ? "border-red-500" : ""}`}
                        />
                        {formErrors.phone && (
                          <p className="text-xs text-red-500">{formErrors.phone}</p>
                        )}
                      </div>
                    </div>

                    {/* Address Information */}
                    <div className="space-y-2">
                      <Label htmlFor="address" className="text-xs sm:text-sm">Address *</Label>
                      <Textarea
                        id="address"
                        name="address"
                        value={formData.address}
                        onChange={handleInputChange}
                        placeholder="Enter your full address including city, state, and ZIP code"
                        rows={3}
                        className={`text-xs sm:text-sm ${formErrors.address ? "border-red-500" : ""}`}
                      />
                      {formErrors.address && (
                        <p className="text-xs text-red-500">{formErrors.address}</p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="instructions" className="text-xs sm:text-sm">Delivery Instructions</Label>
                      <Textarea
                        id="instructions"
                        name="instructions"
                        value={formData.instructions}
                        onChange={handleInputChange}
                        placeholder="Any special instructions for delivery (optional)..."
                        rows={3}
                        className="text-xs sm:text-sm"
                      />
                    </div>

                  </form>
                </CardContent>
              </Card>

              {/* Payment Method */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <CreditCard className="h-5 w-5 text-wine" />
                    Payment Method
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center space-x-2.5 p-3 border rounded-lg hover:bg-muted/50 cursor-pointer" onClick={() => setPaymentMethod("paystack")}>
                      <input 
                        type="radio" 
                        name="paymentMethod" 
                        value="paystack" 
                        checked={paymentMethod === "paystack"}
                        onChange={(e) => setPaymentMethod(e.target.value)}
                        className="w-4 h-4"
                      />
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <CreditCard className="h-4 w-4" />
                          <span className="font-medium text-xs sm:text-sm">Pay online (Card/bank transfer/MPESA)</span>
                        </div>
                        <p className="text-xs text-muted-foreground mt-1">
                          Secure online payment with cards, bank transfer, or mobile money. You will be redirected to the Paystack payment page to complete your payment.
                        </p>
                      </div>
                      <Badge variant="outline" className="text-green-600 border-green-600 text-[10px] sm:text-xs">
                        <Lock className="h-3 w-3 mr-1" />
                        Secure
                      </Badge>
                    </div>

                    <div className="flex items-center space-x-2.5 p-3 border rounded-lg hover:bg-muted/50 cursor-pointer" onClick={() => setPaymentMethod("cod")}>
                      <input 
                        type="radio" 
                        name="paymentMethod" 
                        value="cod" 
                        checked={paymentMethod === "cod"}
                        onChange={(e) => setPaymentMethod(e.target.value)}
                        className="w-4 h-4"
                      />
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <Truck className="h-4 w-4" />
                          <span className="font-medium text-xs sm:text-sm">Cash on Delivery</span>
                        </div>
                        <p className="text-xs text-muted-foreground mt-1">
                          Pay when your order is delivered
                        </p>
                      </div>
                      <Badge variant="outline" className="text-blue-600 border-blue-600 text-[10px] sm:text-xs">
                        <CheckCircle className="h-3 w-3 mr-1" />
                        Available
                      </Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Order Summary */}
            <div className="space-y-4 sm:space-y-6">
              <Card className="sticky top-2 sm:top-4">
                <CardHeader className="pb-3 sm:pb-6">
                  <CardTitle className="text-lg sm:text-xl">Order Summary</CardTitle>
                </CardHeader>
                <CardContent className="p-3 sm:p-6 space-y-3 sm:space-y-4">
                  {/* Order Items */}
                  <div className="space-y-2.5">
                    {cartItems.map((item) => (
                      <div key={item.id} className="flex items-center gap-2.5">
                        <img
                          src={item.image}
                          alt={item.name}
                          className="h-10 w-10 sm:h-12 sm:w-12 object-cover rounded"
                        />
                        <div className="flex-1 min-w-0">
                          <h4 className="font-medium text-xs sm:text-sm line-clamp-1">{item.name}</h4>
                          <p className="text-[11px] sm:text-xs text-muted-foreground">Qty: {item.quantity}</p>
                        </div>
                        <div className="text-right">
                          <p className="font-medium text-xs sm:text-sm">{(item.price * item.quantity).toFixed(2)}</p>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Loyalty Points Info */}
                  {isAuthenticated && (
                    <div className="bg-wine/10 border border-wine/20 rounded-lg p-3">
                      <div className="flex items-center gap-2 text-wine">
                        <Star className="h-4 w-4" />
                        <span className="text-sm font-medium">Loyalty Points</span>
                      </div>
                      <p className="text-xs text-muted-foreground mt-1">
                        You'll earn {calculateLoyaltyPointsEarned()} points with this order
                      </p>
                      <p className="text-xs text-muted-foreground">
                        Current balance: {getLoyaltyPoints()} points
                      </p>
                    </div>
                  )}

                  <Separator />

                  {/* Pricing Breakdown */}
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Subtotal ({cartItems.length} items)</span>
                      <span>{calculateSubtotal().toFixed(2)}</span>
                    </div>

                    <div className="flex justify-between text-sm">
                      <span>Delivery Fee</span>
                      <span>{calculateDeliveryFee().toFixed(2)}</span>
                    </div>
                  </div>

                  <Separator />

                  <div className="flex justify-between text-sm sm:text-lg font-bold">
                    <span>Total</span>
                    <span>{calculateTotal().toFixed(2)}</span>
                  </div>

                  {/* Place Order Button */}
                  <Button
                    onClick={handleSubmit}
                    disabled={isProcessing || !isFormValid()}
                    className="w-full bg-wine hover:bg-wine-light text-white disabled:opacity-50 disabled:cursor-not-allowed py-2.5 sm:py-4 text-xs sm:text-base"
                    size="sm"
                  >
                    {isProcessing ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                        Processing...
                      </>
                    ) : (
                      <>
                        {paymentMethod === "paystack" ? (
                          <>
                            <CreditCard className="h-4 w-4 mr-2" />
                            <span className="hidden sm:inline">Pay with Paystack</span>
                            <span className="sm:hidden">Pay Now</span>
                          </>
                        ) : (
                          <>
                            <Truck className="h-4 w-4 mr-2" />
                            <span className="hidden sm:inline">Place Order (COD)</span>
                            <span className="sm:hidden">Place Order</span>
                          </>
                        )}
                      </>
                    )}
                  </Button>

                  <p className="text-xs text-muted-foreground text-center">
                    By placing this order, you agree to our terms and conditions
                  </p>
                  
                  {!isFormValid() && !isProcessing && (
                    <p className="text-xs text-red-500 text-center mt-2">
                      Please complete name, email, phone, and address to place your order
                    </p>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
      
      {/* Footer */}
      <Footer />

      <LoginModal
        isOpen={isLoginModalOpen}
        onClose={() => setIsLoginModalOpen(false)}
        onSwitchToRegister={() => setIsLoginModalOpen(false)}
      />
    </div>
  );
};

export default Checkout;
