// API service for fetching data from the backend
function resolveApiBaseUrl(): string {
  const fromEnv = import.meta.env.VITE_API_BASE_URL?.trim();
  if (fromEnv) return fromEnv.replace(/\/$/, "");

  // Vite dev: use same-origin /api (proxied in vite.config.ts � no local :3001 needed)
  if (import.meta.env.DEV) return "/api";

  if (typeof window !== "undefined") {
    const host = window.location.hostname;
    if (host.endsWith("vercel.app") || host.includes("precisionparts.co.ke")) {
      return "/api";
    }
  }

  return "http://localhost:3001/api";
}

const API_BASE_URL = resolveApiBaseUrl();

/** Helper to map technical specifications and dimensions from available data fields */
const mapProductFields = (product: Record<string, unknown>): Product => {
  if (!product) return product as unknown as Product;
  return {
    ...product,
    // Support multiple field names for specifications and dimensions
    specifications: (product.specifications as string) || (product.alcoholContent as string) || "N/A",
    dimensions: (product.dimensions as string) || (product.volume as string) || "Standard",
    requiresSpecialHandling: (product.requiresSpecialHandling as boolean) ?? false
  } as Product;
};

export interface Category {
  [x: string]: number;
  id: number;
  name: string;
  description: string;
  image: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  /**
   * When set (along with isActive), category appears on home �Shop by parts�.
   * Sort ascending (1, 2, 3�). Omitted categories are not shown there.
   * Backend may send snake_case `shop_by_parts_sort` � see `categoryShopTiles.ts`.
   */
  shopByPartsSort?: number | null;
  /** Optional shorter label on the tile; defaults to category name. */
  shopByPartsLabel?: string | null;
}

export interface SubCategory {
  id: number;
  name: string;
  description: string;
  isActive: boolean;
  categoryId: number;
  category: Category;
  createdAt: string;
  updatedAt: string;
}

export interface ProductSKU {
  code: string;
  price: number;
  originalPrice?: number;
}

export interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  originalPrice?: number;
  stock: number;
  image: string;
  images?: string[];
  brand: string;
  /** Automotive specifications (mapped from legacy alcoholContent) */
  specifications: string;
  /** Unit size or dimensions (mapped from legacy volume) */
  dimensions: string;
  /** Legacy field for backend compatibility */
  alcoholContent: string;
  /** Legacy field for backend compatibility */
  volume: string;
  /** Primary OEM reference number for precise fitment cross-checking */
  oemNumber?: string;
  /** Part number assigned by the manufacturer (e.g. Bosch, Brembo) */
  manufacturerPartNumber?: string;
  origin: string;
  tags: string[];
  rating: number;
  reviewCount: number;
  isActive: boolean;
  isFeatured: boolean;
  newArrival: boolean;
  /** Refined for automotive: e.g. hazardous materials or professional install required */
  requiresSpecialHandling?: boolean;
  requiresAgeVerification: boolean; // Legacy
  category: Category;
  categoryId: number;
  subcategory?: SubCategory;
  subcategoryId?: number;
  skus?: ProductSKU[];
  createdAt: string;
  updatedAt: string;
}

export interface ApiResponse<T> {
  data: T;
  success: boolean;
  message?: string;
}

export interface OrderItem {
  productId: number;
  quantity: number;
  price: number;
}

export interface CreateOrderRequest {
  items: OrderItem[];
  subtotal: number;
  tax: number;
  shipping: number;
  total: number;
  shippingAddress: string;
  billingAddress?: string;
  notes?: string;
  paymentMethod: string;
}

export interface OrderResponse {
  id: number;
  orderNumber: string;
  status: string;
  paymentStatus: string;
  subtotal: number;
  tax: number;
  shipping: number;
  total: number;
  shippingAddress: string;
  billingAddress?: string;
  notes?: string;
  items: {
    id: number;
    productId: number;
    quantity: number;
    price: number;
    total: number;
    product: {
      id: number;
      name: string;
      image: string;
    };
  }[];
  createdAt: string;
  updatedAt: string;
}

class ApiService {
  private async request<T>(endpoint: string, options?: RequestInit): Promise<T> {
    const url = `${API_BASE_URL}${endpoint}`;
    
    try {
      console.log(`Making API request to: ${url}`);
      console.log('Request options:', options);
      console.log('Request body:', options?.body);
      console.log('Request body type:', typeof options?.body);
      console.log('Request headers:', {
        'Content-Type': 'application/json',
        ...options?.headers,
      });
      
      const response = await fetch(url, {
        method: options?.method || 'GET',
        headers: {
          'Content-Type': 'application/json',
          ...options?.headers,
        },
        body: options?.body,
      });

      console.log(`Response status: ${response.status}`);
      console.log(`Response headers:`, Object.fromEntries(response.headers.entries()));

      if (!response.ok) {
        const errorText = await response.text();
        console.error(`HTTP error! status: ${response.status}, body: ${errorText}`);
        throw new Error(`HTTP error! status: ${response.status} - ${errorText}`);
      }

      // Check if response is HTML (error page) instead of JSON
      const contentType = response.headers.get('content-type');
      if (contentType && !contentType.includes('application/json')) {
        const responseText = await response.text();
        console.error('Received non-JSON response:', responseText.substring(0, 200));
        throw new Error(`Expected JSON but received ${contentType}. Response: ${responseText.substring(0, 100)}...`);
      }

      const data = await response.json();
      console.log('Response data:', data);
      return data;
    } catch (error: unknown) {
      const err = error as Error;
      console.error(`API request failed for ${endpoint}:`, err);
      console.error('Error details:', {
        message: err.message,
        stack: err.stack,
        name: err.name
      });
      
      // Enhance error with network information
      if (err instanceof TypeError && err.message.includes('fetch')) {
        const networkError = new Error('Network connection failed. Please check your internet connection.') as Error & { code?: string };
        networkError.name = 'NetworkError';
        networkError.code = 'NETWORK_ERROR';
        throw networkError;
      }
      
      // Handle 502 Bad Gateway errors specifically
      if (err.message.includes('502')) {
        const gatewayError = new Error('Backend service is temporarily unavailable. Please try again later.') as Error & { code?: string };
        gatewayError.name = 'GatewayError';
        gatewayError.code = 'GATEWAY_ERROR';
        throw gatewayError;
      }
      
      throw err;
    }
  }

  // Categories
  async getCategories(): Promise<Category[]> {
    return this.request<Category[]>('/categories');
  }

  async getCategoryById(id: number): Promise<Category> {
    return this.request<Category>(`/categories/${id}`);
  }

  // Products
  async getProducts(): Promise<Product[]> {
    const data = await this.request<Record<string, unknown>[]>('/products');
    return data.map(mapProductFields);
  }

  async getProductById(id: number): Promise<Product> {
    const data = await this.request<Record<string, unknown>>(`/products/${id}`);
    return mapProductFields(data);
  }

  async getFeaturedProducts(): Promise<Product[]> {
    const data = await this.request<Record<string, unknown>[]>('/products/featured');
    return data.map(mapProductFields);
  }

  async getNewArrivals(): Promise<Product[]> {
    const data = await this.request<Record<string, unknown>[]>('/products/new-arrivals');
    return data.map(mapProductFields);
  }

  async searchProducts(query: string): Promise<Product[]> {
    const data = await this.request<Record<string, unknown>[]>(`/products/search?q=${encodeURIComponent(query)}`);
    return data.map(mapProductFields);
  }

  async getProductsByCategory(categoryId: number): Promise<Product[]> {
    const data = await this.request<Record<string, unknown>[]>(`/products/category/${categoryId}`);
    return data.map(mapProductFields);
  }

  async getPopularParts(): Promise<Product[]> {
    const data = await this.request<Record<string, unknown>[]>('/products/popular-wines');
    return data.map(mapProductFields);
  }

  // Helper method to get products by category name (for backward compatibility)
  async getProductsByCategoryName(categoryName: string): Promise<Product[]> {
    const categories = await this.getCategories();
    const slug = categoryName.toLowerCase();
    const category = categories.find(cat =>
      cat.name.toLowerCase() === slug ||
      cat.name.toLowerCase().replace(/\s+/g, '-') === slug
    );
    
    if (!category) {
      return [];
    }
    
    return this.getProductsByCategory(category.id);
  }

  // Orders
  async createOrder(orderData: CreateOrderRequest, userId: number): Promise<OrderResponse> {
    let requestBody: string;
    
    try {
      console.log('=== API SERVICE CREATE ORDER START ===');
      console.log('Method called with parameters:', { orderData, userId });
      console.log('Order data parameter received:', orderData);
      console.log('Order data type:', typeof orderData);
      console.log('Order data is undefined:', orderData === undefined);
      console.log('Order data is null:', orderData === null);
      console.log('Arguments length:', arguments.length);
      console.log('All arguments:', Array.from(arguments));
      
      if (!orderData) {
        console.error('ERROR: orderData is undefined or null in API service!');
        console.error('This means the parameter was not passed correctly from UserContext');
        throw new Error('Order data is required but was not provided to API service');
      }
      
      console.log('Order data stringified:', JSON.stringify(orderData, null, 2));
      console.log('Order data items:', orderData.items);
      console.log('Order data items length:', orderData.items?.length);
      console.log('User ID being sent:', userId);
      console.log('API endpoint: /orders');
      
      requestBody = JSON.stringify(orderData);
      console.log('Request body:', requestBody);
      console.log('Request body length:', requestBody.length);
      console.log('Request body type:', typeof requestBody);
      
      const response = await this.request<OrderResponse>('/orders', {
        method: 'POST',
        headers: {
          'user-id': userId.toString(),
        },
        body: requestBody,
      });
      console.log('=== ORDER API RESPONSE SUCCESS ===');
      console.log('Order API response:', JSON.stringify(response, null, 2));
      return response;
    } catch (error: unknown) {
      const err = error as Error;
      console.error('=== API CREATE ORDER ERROR ===');
      console.error('API createOrder error:', err);
      console.error('Error message:', err.message);
      console.error('Error stack:', err.stack);
      console.error('Order data that failed:', JSON.stringify(orderData, null, 2));
      console.log('User ID sent:', userId);
      console.log('Request body that failed:', requestBody);
      
      // Log specific error types
      if (err.message?.includes('500')) {
        console.error('Server returned 500 - Internal Server Error');
      } else if (err.message?.includes('400')) {
        console.error('Server returned 400 - Bad Request');
      } else if (err.message?.includes('Failed to fetch')) {
        console.error('Network error - cannot reach backend server');
      }
      
      throw err;
    }
  }

  async getMyOrders(userId: number): Promise<OrderResponse[]> {
    return this.request<OrderResponse[]>('/orders/my-orders', {
      headers: {
        'user-id': userId.toString(),
      },
    });
  }

  async getOrderById(id: number, userId: number): Promise<OrderResponse> {
    return this.request<OrderResponse>(`/orders/${id}`, {
      headers: {
        'user-id': userId.toString(),
      },
    });
  }

  // SubCategories
  async getSubCategories(categoryId?: number): Promise<SubCategory[]> {
    const url = categoryId ? `/subcategories?categoryId=${categoryId}` : '/subcategories';
    return this.request<SubCategory[]>(url);
  }

  async getSubCategoryById(id: number): Promise<SubCategory> {
    return this.request<SubCategory>(`/subcategories/${id}`);
  }
}

export const apiService = new ApiService();
export default apiService;
