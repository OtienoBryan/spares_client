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
import { 
  CreditCard, 
  Truck, 
  Lock,
  CheckCircle,
  AlertCircle,
  ArrowLeft,
  Star
} from "lucide-react";

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

  const calculateSavings = () => {
    return cartItems.reduce((total, item) => {
      if (item.originalPrice && item.originalPrice > item.price) {
        return total + ((item.originalPrice - item.price) * item.quantity);
      }
      return total;
    }, 0);
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
    return calculateSubtotal() - calculateSavings() + calculateTax() + calculateServiceFee() + calculateDeliveryFee();
  };

  // Redirect to cart if cart is empty
  useEffect(() => {
    if (cartItems.length === 0) {
      navigate('/cart');
    }
  }, [cartItems.length, navigate]);

  const handlePaystackPayment = async () => {
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

      console.log('Cart items for order:', cartItems);
      console.log('Cart items length:', cartItems.length);
      
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
        notes: formData.instructions,
        paymentMethod: 'paystack'
      };

      console.log('=== CHECKOUT ORDER CREATION START ===');
      console.log('Order data being created:', JSON.stringify(orderData, null, 2));
      console.log('Order data items:', orderData.items);
      console.log('Cart items:', cartItems);
      console.log('Form data:', formData);
      console.log('Payment method:', paymentMethod);
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
      console.log('=== CHECKOUT ORDER CREATION RESULT ===');
      console.log('Order response received:', orderResponse);
      
      if (orderResponse) {
        // Add loyalty points for authenticated users
        if (isAuthenticated && user) {
          const pointsEarned = Math.floor(calculateSubtotal());
          addLoyaltyPoints(pointsEarned);
          
          toast({
            title: "Payment Successful!",
            description: `Your order #${orderResponse.orderNumber} has been placed and payment processed. You earned ${pointsEarned} loyalty points!`,
          });
        } else {
          toast({
            title: "Payment Successful!",
            description: `Your order #${orderResponse.orderNumber} has been placed and payment processed.`,
          });
        }
      } else {
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
      console.error('=== CHECKOUT PAYSTACK PAYMENT ERROR ===');
      console.error('Payment error:', error);
      console.error('Error message:', error.message);
      console.error('Error stack:', error.stack);
      console.error('Cart items at error time:', cartItems);
      console.error('Cart items length:', cartItems.length);
      console.error('Form data:', formData);
      console.error('Payment method:', paymentMethod);
      
      toast({
        title: "Payment Failed",
        description: `There was an error processing your payment: ${error.message || 'Unknown error'}. Please try again or contact support.`,
        variant: "destructive",
      });
    } finally {
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
          const pointsEarned = Math.floor(calculateSubtotal());
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
      
      <div className="container mx-auto px-3 sm:px-4 py-4 sm:py-8">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="flex items-center gap-2 sm:gap-4 mb-4 sm:mb-8">
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
              <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-wine">Checkout</h1>
              <p className="text-sm sm:text-base text-muted-foreground">Complete your order</p>
            </div>
          </div>

          <div className="grid lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
            {/* Checkout Form */}
            <div className="lg:col-span-2 space-y-4 sm:space-y-6">
              {/* Delivery Information */}
              <Card>
                <CardHeader className="pb-3 sm:pb-6">
                  <CardTitle className="flex items-center gap-2 text-lg sm:text-xl">
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
                  <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">

                    {/* Personal Information */}
                    <div className="space-y-2">
                      <Label htmlFor="name">Full Name *</Label>
                      <Input
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        placeholder="Enter your full name"
                        className={formErrors.name ? "border-red-500" : ""}
                      />
                      {formErrors.name && (
                        <p className="text-sm text-red-500">{formErrors.name}</p>
                      )}
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="email">Email Address *</Label>
                        <Input
                          id="email"
                          name="email"
                          type="email"
                          value={formData.email}
                          onChange={handleInputChange}
                          placeholder="Enter your email"
                          className={formErrors.email ? "border-red-500" : ""}
                        />
                        {formErrors.email && (
                          <p className="text-sm text-red-500">{formErrors.email}</p>
                        )}
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="phone">Phone Number *</Label>
                        <Input
                          id="phone"
                          name="phone"
                          type="tel"
                          value={formData.phone}
                          onChange={handleInputChange}
                          placeholder="Enter your phone number"
                          className={formErrors.phone ? "border-red-500" : ""}
                        />
                        {formErrors.phone && (
                          <p className="text-sm text-red-500">{formErrors.phone}</p>
                        )}
                      </div>
                    </div>

                    {/* Address Information */}
                    <div className="space-y-2">
                      <Label htmlFor="address">Address *</Label>
                      <Textarea
                        id="address"
                        name="address"
                        value={formData.address}
                        onChange={handleInputChange}
                        placeholder="Enter your full address including city, state, and ZIP code"
                        rows={3}
                        className={formErrors.address ? "border-red-500" : ""}
                      />
                      {formErrors.address && (
                        <p className="text-sm text-red-500">{formErrors.address}</p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="instructions">Delivery Instructions</Label>
                      <Textarea
                        id="instructions"
                        name="instructions"
                        value={formData.instructions}
                        onChange={handleInputChange}
                        placeholder="Any special instructions for delivery (optional)..."
                        rows={3}
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
                  <div className="space-y-4">
                    <div className="flex items-center space-x-3 p-4 border rounded-lg hover:bg-muted/50 cursor-pointer" onClick={() => setPaymentMethod("paystack")}>
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
                          <CreditCard className="h-5 w-5" />
                          <span className="font-medium">Pay with Paystack</span>
                        </div>
                        <p className="text-sm text-muted-foreground mt-1">
                          Secure online payment with cards, bank transfer, or mobile money
                        </p>
                      </div>
                      <Badge variant="outline" className="text-green-600 border-green-600">
                        <Lock className="h-3 w-3 mr-1" />
                        Secure
                      </Badge>
                    </div>

                    <div className="flex items-center space-x-3 p-4 border rounded-lg hover:bg-muted/50 cursor-pointer" onClick={() => setPaymentMethod("cod")}>
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
                          <Truck className="h-5 w-5" />
                          <span className="font-medium">Cash on Delivery</span>
                        </div>
                        <p className="text-sm text-muted-foreground mt-1">
                          Pay when your order is delivered
                        </p>
                      </div>
                      <Badge variant="outline" className="text-blue-600 border-blue-600">
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
              <Card className="sticky top-4">
                <CardHeader className="pb-3 sm:pb-6">
                  <CardTitle className="text-lg sm:text-xl">Order Summary</CardTitle>
                </CardHeader>
                <CardContent className="p-3 sm:p-6 space-y-3 sm:space-y-4">
                  {/* Order Items */}
                  <div className="space-y-3">
                    {cartItems.map((item) => (
                      <div key={item.id} className="flex items-center gap-3">
                        <img
                          src={item.image}
                          alt={item.name}
                          className="h-12 w-12 object-cover rounded"
                        />
                        <div className="flex-1 min-w-0">
                          <h4 className="font-medium text-sm line-clamp-1">{item.name}</h4>
                          <p className="text-xs text-muted-foreground">Qty: {item.quantity}</p>
                        </div>
                        <div className="text-right">
                          <p className="font-medium text-sm">{(item.price * item.quantity).toFixed(2)}</p>
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
                        You'll earn {Math.floor(calculateSubtotal())} points with this order
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
                    
                    {calculateSavings() > 0 && (
                      <div className="flex justify-between text-sm text-green-600">
                        <span>Savings</span>
                        <span>-{calculateSavings().toFixed(2)}</span>
                      </div>
                    )}
                    
                    
                    <div className="flex justify-between text-sm">
                      <span>Delivery Fee</span>
                      <span>{calculateDeliveryFee().toFixed(2)}</span>
                    </div>
                  </div>

                  <Separator />

                  <div className="flex justify-between text-lg font-bold">
                    <span>Total</span>
                    <span>{calculateTotal().toFixed(2)}</span>
                  </div>

                  {/* Place Order Button */}
                  <Button
                    onClick={handleSubmit}
                    disabled={isProcessing || !isFormValid()}
                    className="w-full bg-wine hover:bg-wine-light text-white disabled:opacity-50 disabled:cursor-not-allowed py-3 sm:py-4 text-sm sm:text-base"
                    size="lg"
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
    </div>
  );
};

export default Checkout;
