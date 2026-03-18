import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { apiService, OrderResponse } from '@/services/api';

export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  phone?: string;
  address?: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  };
  loyaltyPoints: number;
  memberSince: string;
  isVerified: boolean;
}

export interface Order {
  id: string;
  orderNumber: string;
  date: string;
  status: 'pending' | 'confirmed' | 'preparing' | 'shipped' | 'delivered' | 'cancelled';
  items: {
    id: string;
    name: string;
    price: number;
    quantity: number;
    image: string;
  }[];
  subtotal: number;
  tax: number;
  deliveryFee: number;
  total: number;
  deliveryAddress: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
  };
  estimatedDelivery: string;
  trackingNumber?: string;
}

interface UserContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  register: (userData: RegisterData) => Promise<boolean>;
  logout: () => void;
  updateProfile: (userData: Partial<User>) => Promise<boolean>;
  addLoyaltyPoints: (points: number) => void;
  getOrderHistory: () => Order[];
  getLoyaltyPoints: () => number;
  createOrder: (orderData: any) => Promise<OrderResponse | null>;
}

interface RegisterData {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  phone?: string;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const useUser = () => {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};

interface UserProviderProps {
  children: ReactNode;
}

export const UserProvider = ({ children }: UserProviderProps) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [orders, setOrders] = useState<Order[]>([]);

  console.log('UserProvider rendering, user:', user, 'isLoading:', isLoading);

  // Mock data for demonstration
  const mockOrders: Order[] = [
    {
      id: '1',
      orderNumber: 'ORD-2024-001',
      date: '2024-01-15',
      status: 'delivered',
      items: [
        {
          id: '1',
          name: 'Premium Red Wine',
          price: 29.99,
          quantity: 2,
          image: '/wine-bottle.jpg'
        }
      ],
      subtotal: 59.98,
      tax: 4.80,
      deliveryFee: 0,
      total: 64.78,
      deliveryAddress: {
        street: '123 Main St',
        city: 'New York',
        state: 'NY',
        zipCode: '10001'
      },
      estimatedDelivery: '2024-01-16',
      trackingNumber: 'TRK123456789'
    }
  ];

  useEffect(() => {
    // Check for existing session on app load
    const savedUser = localStorage.getItem('user');
    const savedOrders = localStorage.getItem('userOrders');
    
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
    
    if (savedOrders) {
      setOrders(JSON.parse(savedOrders));
    } else {
      setOrders(mockOrders);
    }
    
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    setIsLoading(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Mock authentication - in real app, this would be an API call
      if (email === 'demo@example.com' && password === 'password') {
        const mockUser: User = {
          id: '1',
          email: 'demo@example.com',
          firstName: 'John',
          lastName: 'Doe',
          phone: '+1 (555) 123-4567',
          address: {
            street: '123 Main St',
            city: 'New York',
            state: 'NY',
            zipCode: '10001',
            country: 'USA'
          },
          loyaltyPoints: 150,
          memberSince: '2024-01-01',
          isVerified: true
        };
        
        setUser(mockUser);
        localStorage.setItem('user', JSON.stringify(mockUser));
        setIsLoading(false);
        return true;
      }
      
      setIsLoading(false);
      return false;
    } catch (error) {
      console.error('Login error:', error);
      setIsLoading(false);
      return false;
    }
  };

  const register = async (userData: RegisterData): Promise<boolean> => {
    setIsLoading(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Mock registration - in real app, this would be an API call
      const newUser: User = {
        id: Date.now().toString(),
        email: userData.email,
        firstName: userData.firstName,
        lastName: userData.lastName,
        phone: userData.phone,
        loyaltyPoints: 50, // Welcome bonus
        memberSince: new Date().toISOString().split('T')[0],
        isVerified: false
      };
      
      setUser(newUser);
      localStorage.setItem('user', JSON.stringify(newUser));
      setIsLoading(false);
      return true;
    } catch (error) {
      console.error('Registration error:', error);
      setIsLoading(false);
      return false;
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
  };

  const updateProfile = async (userData: Partial<User>): Promise<boolean> => {
    if (!user) return false;
    
    try {
      const updatedUser = { ...user, ...userData };
      setUser(updatedUser);
      localStorage.setItem('user', JSON.stringify(updatedUser));
      return true;
    } catch (error) {
      console.error('Profile update error:', error);
      return false;
    }
  };

  const addLoyaltyPoints = (points: number) => {
    if (!user) return;
    
    const updatedUser = { ...user, loyaltyPoints: user.loyaltyPoints + points };
    setUser(updatedUser);
    localStorage.setItem('user', JSON.stringify(updatedUser));
  };

  const getOrderHistory = (): Order[] => {
    return orders;
  };

  const getLoyaltyPoints = (): number => {
    return user?.loyaltyPoints || 0;
  };

  const createOrder = async (orderData: any): Promise<OrderResponse | null> => {
    try {
      console.log('=== ORDER CREATION START ===');
      console.log('=== USER CONTEXT ORDER CREATION ===');
      console.log('OrderData parameter received:', orderData);
      console.log('OrderData type:', typeof orderData);
      console.log('OrderData is undefined:', orderData === undefined);
      console.log('OrderData is null:', orderData === null);
      
      if (!orderData) {
        console.error('ERROR: orderData is undefined or null!');
        throw new Error('Order data is required but was not provided');
      }
      
      console.log('Creating order with data:', JSON.stringify(orderData, null, 2));
      console.log('User ID:', user?.id || 'default (not signed in)');
      console.log('API Base URL:', 'http://localhost:3001/api');
      console.log('Cart items count:', orderData.items?.length || 0);
      console.log('Order total:', orderData.total);
      console.log('Order subtotal:', orderData.subtotal);
      console.log('Order shipping:', orderData.shipping);
      console.log('Items array:', orderData.items);
      console.log('Items type:', typeof orderData.items);
      console.log('Items is array:', Array.isArray(orderData.items));
      
      // For guest checkout we pass `0` and let the backend create a guest user.
      const userId = user ? parseInt(user.id) : 0;
      console.log('Using user ID for order:', userId);
      
      console.log('Calling apiService.createOrder...');
      console.log('Parameters being passed to API service:');
      console.log('- orderData:', orderData);
      console.log('- userId:', userId);
      console.log('- orderData type:', typeof orderData);
      console.log('- orderData is undefined:', orderData === undefined);
      
      const orderResponse = await apiService.createOrder(orderData, userId);
      console.log('Order created successfully:', JSON.stringify(orderResponse, null, 2));
      
      // Only add the new order to local state if user is authenticated
      if (user) {
        const newOrder: Order = {
          id: orderResponse.id.toString(),
          orderNumber: orderResponse.orderNumber,
          date: orderResponse.createdAt.split('T')[0],
          status: orderResponse.status as any,
          items: orderResponse.items.map(item => ({
            id: item.id.toString(),
            name: item.product.name,
            price: item.price,
            quantity: item.quantity,
            image: item.product.image
          })),
          subtotal: orderResponse.subtotal,
          tax: orderResponse.tax,
          deliveryFee: orderResponse.shipping,
          total: orderResponse.total,
          deliveryAddress: {
            street: orderResponse.shippingAddress,
            city: '',
            state: '',
            zipCode: ''
          },
          estimatedDelivery: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
        };
        
        setOrders(prev => [newOrder, ...prev]);
        localStorage.setItem('userOrders', JSON.stringify([newOrder, ...orders]));
      }
      
      return orderResponse;
    } catch (error) {
      console.error('=== ORDER CREATION ERROR ===');
      console.error('Error creating order:', error);
      console.error('Error details:', error.message);
      console.error('Error stack:', error.stack);
      console.error('Error name:', error.name);
      console.error('Order data that failed:', JSON.stringify(orderData, null, 2));
      console.error('User ID used:', user ? parseInt(user.id) : 0);
      console.error('Cart items count:', orderData.items?.length || 0);
      console.error('Items array:', orderData.items);
      console.error('Items type:', typeof orderData.items);
      console.error('Items is array:', Array.isArray(orderData.items));
      
      // Log more specific error information
      if (error.message?.includes('Failed to fetch')) {
        console.error('Network error: Backend server may be down');
      } else if (error.message?.includes('404')) {
        console.error('API endpoint not found');
      } else if (error.message?.includes('500')) {
        console.error('Server error: Database or server issue');
      } else if (error.message?.includes('400')) {
        console.error('Bad request: Invalid order data');
      } else if (error.message?.includes('Items must be an array')) {
        console.error('Validation error: Items array is invalid');
        console.error('This suggests the cart items are not being passed correctly');
      }
      
      // Instead of returning null, throw the error so we can see what's happening
      throw error;
    }
  };

  const value = {
    user,
    isAuthenticated: !!user,
    isLoading,
    login,
    register,
    logout,
    updateProfile,
    addLoyaltyPoints,
    getOrderHistory,
    getLoyaltyPoints,
    createOrder
  };

  return (
    <UserContext.Provider value={value}>
      {children}
    </UserContext.Provider>
  );
};
