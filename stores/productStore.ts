import { create } from "zustand";
import { persist, createJSONStorage, devtools } from "zustand/middleware";

export interface Product {
  id: string;
  barcode: string;
  description: string;
  t2tCode: string;
  color: string;
  usSize: string;
  ukSize: string;
  createdAt: string;
  updatedAt: string;
}

interface ProductStore {
  products: Product[];
  isLoading: boolean;
  error: string | null;
  companyLogo: string | null;

  // Actions
  addProduct: (
    product: Omit<Product, "id" | "createdAt" | "updatedAt">
  ) => void;
  updateProduct: (
    id: string,
    product: Partial<Omit<Product, "id" | "createdAt" | "updatedAt">>
  ) => void;
  removeProduct: (id: string) => void;
  clearAllProducts: () => void;
  getProductById: (id: string) => Product | undefined;
  searchProducts: (query: string) => Product[];

  // Utility actions
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  setCompanyLogo: (logo: string | null) => void;
}

export const useProductStore = create<ProductStore>()(
  devtools(
    persist(
      (set, get) => ({
        products: [],
        isLoading: false,
        error: null,
        companyLogo: null,

        addProduct: (productData) => {
          const now = new Date().toISOString();
          const newProduct: Product = {
            ...productData,
            id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
            createdAt: now,
            updatedAt: now,
          };

          set((state) => ({
            products: [...state.products, newProduct],
            error: null,
          }));
        },

        updateProduct: (id, updates) => {
          set((state) => ({
            products: state.products.map((product) =>
              product.id === id
                ? {
                    ...product,
                    ...updates,
                    updatedAt: new Date().toISOString(),
                  }
                : product
            ),
            error: null,
          }));
        },

        removeProduct: (id) => {
          set((state) => ({
            products: state.products.filter((product) => product.id !== id),
            error: null,
          }));
        },

        clearAllProducts: () => {
          set({
            products: [],
            error: null,
          });
        },

        getProductById: (id) => {
          return get().products.find((product) => product.id === id);
        },

        searchProducts: (query) => {
          const products = get().products;
          if (!query.trim()) return products;

          const lowercaseQuery = query.toLowerCase();
          return products.filter(
            (product) =>
              product.description.toLowerCase().includes(lowercaseQuery) ||
              product.barcode.includes(query) ||
              product.t2tCode.toLowerCase().includes(lowercaseQuery) ||
              product.color.toLowerCase().includes(lowercaseQuery) ||
              product.usSize.toLowerCase().includes(lowercaseQuery) ||
              product.ukSize.toLowerCase().includes(lowercaseQuery)
          );
        },

        setLoading: (loading) => {
          set({ isLoading: loading });
        },

        setError: (error) => {
          set({ error });
        },

        setCompanyLogo: (logo) => {
          set({ companyLogo: logo });
        },
      }),
      {
        name: "tag-manager-products", // localStorage key
        storage: createJSONStorage(() => localStorage),
        // Only persist the products array and company logo, not loading/error states
        partialize: (state) => ({
          products: state.products,
          companyLogo: state.companyLogo,
        }),
      }
    ),
    {
      name: "product-store", // This will appear in Redux DevTools
    }
  )
);

// Selectors for better performance
export const useProducts = () => useProductStore((state) => state.products);
export const useProductLoading = () =>
  useProductStore((state) => state.isLoading);
export const useProductError = () => useProductStore((state) => state.error);

// Individual action selectors to avoid object recreation
export const useAddProduct = () => useProductStore((state) => state.addProduct);
export const useUpdateProduct = () =>
  useProductStore((state) => state.updateProduct);
export const useRemoveProduct = () =>
  useProductStore((state) => state.removeProduct);
export const useClearAllProducts = () =>
  useProductStore((state) => state.clearAllProducts);
export const useGetProductById = () =>
  useProductStore((state) => state.getProductById);
export const useSearchProducts = () =>
  useProductStore((state) => state.searchProducts);
export const useSetCompanyLogo = () =>
  useProductStore((state) => state.setCompanyLogo);
export const useCompanyLogo = () =>
  useProductStore((state) => state.companyLogo);
