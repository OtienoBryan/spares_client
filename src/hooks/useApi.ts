import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { apiService, Product, Category, SubCategory } from '@/services/api';

// Generic hook for API calls using React Query
export function useApi<T>(
  apiCall: () => Promise<T>,
  dependencies: any[] = []
) {
  const queryKey = ['api', apiCall.name || 'generic', ...dependencies];
  
  const { data, isLoading: loading, error } = useQuery({
    queryKey,
    queryFn: apiCall,
    staleTime: 5 * 60 * 1000, // 5 minutes
    cacheTime: 10 * 60 * 1000, // 10 minutes
    retry: 1,
    refetchOnWindowFocus: false,
  });

  return { 
    data: data || null, 
    loading, 
    error: error?.message || null 
  };
}

// Specific hooks for different data types with optimized query keys
export function useCategories() {
  const { data, isLoading: loading, error } = useQuery({
    queryKey: ['categories'],
    queryFn: () => apiService.getCategories(),
    staleTime: 10 * 60 * 1000, // 10 minutes - categories don't change often
    cacheTime: 30 * 60 * 1000, // 30 minutes
    retry: 1,
    refetchOnWindowFocus: false,
  });

  return { data: data || null, loading, error: error?.message || null };
}

export function useProducts() {
  const { data, isLoading: loading, error } = useQuery({
    queryKey: ['products'],
    queryFn: () => apiService.getProducts(),
    staleTime: 5 * 60 * 1000, // 5 minutes
    cacheTime: 15 * 60 * 1000, // 15 minutes
    retry: 1,
    refetchOnWindowFocus: false,
  });

  return { data: data || null, loading, error: error?.message || null };
}

export function useFeaturedProducts() {
  const { data, isLoading: loading, error } = useQuery({
    queryKey: ['featured-products'],
    queryFn: () => apiService.getFeaturedProducts(),
    staleTime: 5 * 60 * 1000, // 5 minutes
    cacheTime: 15 * 60 * 1000, // 15 minutes
    retry: 1,
    refetchOnWindowFocus: false,
  });

  return { data: data || null, loading, error: error?.message || null };
}

export function useNewArrivals() {
  const { data, isLoading: loading, error } = useQuery({
    queryKey: ['new-arrivals'],
    queryFn: () => apiService.getNewArrivals(),
    staleTime: 5 * 60 * 1000, // 5 minutes
    cacheTime: 15 * 60 * 1000, // 15 minutes
    retry: 1,
    refetchOnWindowFocus: false,
  });

  return { data: data || null, loading, error: error?.message || null };
}

export function usePopularWines() {
  const { data, isLoading: loading, error } = useQuery({
    queryKey: ['popular-wines'],
    queryFn: () => apiService.getPopularWines(),
    staleTime: 5 * 60 * 1000, // 5 minutes
    cacheTime: 15 * 60 * 1000, // 15 minutes
    retry: 1,
    refetchOnWindowFocus: false,
  });

  return { data: data || null, loading, error: error?.message || null };
}

export function useProduct(id: number) {
  return useApi(() => apiService.getProductById(id), [id]);
}

export function useProductsByCategory(categoryId: number) {
  return useApi(() => apiService.getProductsByCategory(categoryId), [categoryId]);
}

export function useProductsByCategoryName(categoryName: string) {
  return useApi(() => apiService.getProductsByCategoryName(categoryName), [categoryName]);
}

export function useSearchProducts(query: string) {
  return useApi(
    () => query ? apiService.searchProducts(query) : Promise.resolve([]),
    [query]
  );
}

// Hook for search with debouncing
export function useSearchProductsDebounced(query: string, delay: number = 300) {
  const [debouncedQuery, setDebouncedQuery] = useState(query);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(query);
    }, delay);

    return () => clearTimeout(timer);
  }, [query, delay]);

  return useSearchProducts(debouncedQuery);
}

// SubCategory hooks
export function useSubCategories(categoryId?: number) {
  return useApi(() => apiService.getSubCategories(categoryId), [categoryId]);
}

export function useSubCategory(id: number) {
  return useApi(() => apiService.getSubCategoryById(id), [id]);
}
