import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface CartItem {
  id: string;
  name: string;
  category: string | { id: number; name: string; description: string; image: string; isActive: boolean; createdAt: string; updatedAt: string };
  price: number;
  originalPrice?: number;
  image: string;
  alcohol: string;
  volume: string;
  inStock: boolean;
  quantity: number;
  selectedSku?: string | null;
  skuPrice?: number;
  skuOriginalPrice?: number;
}

interface CartContextType {
  cartItems: CartItem[];
  addToCart: (product: any, selectedSku?: string | null) => void;
  updateQuantity: (id: string, quantity: number) => void;
  removeItem: (id: string) => void;
  clearCart: () => void;
  getTotalItems: () => number;
  getTotalPrice: () => number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};

interface CartProviderProps {
  children: ReactNode;
}

export const CartProvider = ({ children }: CartProviderProps) => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);

  // Load cart from localStorage on component mount
  useEffect(() => {
    console.log('=== CART CONTEXT INIT ===');
    const savedCart = localStorage.getItem('cart');
    console.log('Saved cart from localStorage:', savedCart);
    if (savedCart) {
      try {
        const parsedCart = JSON.parse(savedCart);
        console.log('Parsed cart:', parsedCart);
        console.log('Cart length:', parsedCart.length);
        setCartItems(parsedCart);
      } catch (error) {
        console.error('Error parsing saved cart:', error);
        localStorage.removeItem('cart');
      }
    } else {
      console.log('No cart found in localStorage');
    }
  }, []);

  // Save cart to localStorage whenever cartItems changes
  useEffect(() => {
    console.log('=== CART ITEMS CHANGED ===');
    console.log('Cart items:', cartItems);
    console.log('Cart items length:', cartItems.length);
    localStorage.setItem('cart', JSON.stringify(cartItems));
  }, [cartItems]);

  const addToCart = (product: any, selectedSku?: string | null) => {
    setCartItems(prev => {
      // Create a unique ID that includes SKU if selected
      const itemId = selectedSku 
        ? `${product.id.toString()}_${selectedSku}` 
        : product.id.toString();
      
      const existing = prev.find(item => item.id === itemId);
      if (existing) {
        return prev.map(item =>
          item.id === itemId
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      
      // Get SKU data if SKU is selected
      let price = product.price;
      let originalPrice = product.originalPrice;
      if (selectedSku && product.skus && product.skus.length > 0) {
        const skuData = product.skus.find((sku: any) => sku.code === selectedSku);
        if (skuData) {
          price = skuData.price;
          originalPrice = skuData.originalPrice;
        }
      }
      
      // Map API Product to CartItem structure
      const cartItem: CartItem = {
        id: itemId,
        name: product.name,
        category: product.category, // This will be the full category object
        price: price,
        originalPrice: originalPrice,
        image: product.image,
        alcohol: product.alcoholContent, // Map alcoholContent to alcohol
        volume: product.volume,
        inStock: product.stock > 0, // Map stock > 0 to inStock boolean
        quantity: 1,
        selectedSku: selectedSku || null,
        skuPrice: selectedSku && product.skus ? product.skus.find((sku: any) => sku.code === selectedSku)?.price : undefined,
        skuOriginalPrice: selectedSku && product.skus ? product.skus.find((sku: any) => sku.code === selectedSku)?.originalPrice : undefined
      };
      
      return [...prev, cartItem];
    });
  };

  const updateQuantity = (id: string, quantity: number) => {
    if (quantity === 0) {
      setCartItems(prev => prev.filter(item => item.id !== id));
    } else {
      setCartItems(prev =>
        prev.map(item =>
          item.id === id ? { ...item, quantity } : item
        )
      );
    }
  };

  const removeItem = (id: string) => {
    setCartItems(prev => prev.filter(item => item.id !== id));
  };

  const clearCart = () => {
    setCartItems([]);
  };

  const getTotalItems = () => {
    return cartItems.reduce((total, item) => total + item.quantity, 0);
  };

  const getTotalPrice = () => {
    return cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  const value = {
    cartItems,
    addToCart,
    updateQuantity,
    removeItem,
    clearCart,
    getTotalItems,
    getTotalPrice,
  };

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
};
