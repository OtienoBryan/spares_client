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
}

interface CartContextType {
  cartItems: CartItem[];
  addToCart: (product: any) => void;
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

  const addToCart = (product: any) => {
    setCartItems(prev => {
      const existing = prev.find(item => item.id === product.id.toString());
      if (existing) {
        return prev.map(item =>
          item.id === product.id.toString()
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      
      // Map API Product to CartItem structure
      const cartItem: CartItem = {
        id: product.id.toString(),
        name: product.name,
        category: product.category, // This will be the full category object
        price: product.price,
        originalPrice: product.originalPrice,
        image: product.image,
        alcohol: product.alcoholContent, // Map alcoholContent to alcohol
        volume: product.volume,
        inStock: product.stock > 0, // Map stock > 0 to inStock boolean
        quantity: 1
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
