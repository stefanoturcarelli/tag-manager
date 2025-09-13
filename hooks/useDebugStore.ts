"use client";

import { useEffect } from 'react';
import { useProductStore } from '@/stores/productStore';

export const useDebugStore = () => {
  useEffect(() => {
    if (process.env.NODE_ENV === 'development') {
      // Make store globally available for debugging
      (window as any).__productStore = useProductStore;
      
      // Log store changes
      const unsubscribe = useProductStore.subscribe((state) => {
        console.log('🛍️ Product Store Updated:', {
          productsCount: state.products.length,
          isLoading: state.isLoading,
          error: state.error,
          products: state.products
        });
      });

      // Log initial state
      const initialState = useProductStore.getState();
      console.log('🛍️ Initial Product Store State:', initialState);

      return () => {
        unsubscribe();
      };
    }
  }, []);

  // Return current state for debugging
  if (process.env.NODE_ENV === 'development') {
    return useProductStore.getState();
  }
  
  return null;
};

// Global debugging utilities
if (typeof window !== 'undefined' && process.env.NODE_ENV === 'development') {
  (window as any).__debugProductStore = {
    getState: () => useProductStore.getState(),
    addProduct: (product: any) => useProductStore.getState().addProduct(product),
    clearAll: () => useProductStore.getState().clearAllProducts(),
    searchProducts: (query: string) => useProductStore.getState().searchProducts(query),
  };
}
