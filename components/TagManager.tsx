"use client";

import { ProductForm } from "./ProductForm";
import { ProductSearch } from "./ProductSearch";
import { TagPreview } from "./TagPreview";
import { PDFGenerator } from "./PDFGenerator";
import { useProducts, useRemoveProduct, useClearAllProducts } from "@/stores/productStore";
import { useToast } from "@/contexts/ToastContext";

export function TagManager() {
  const products = useProducts();
  const removeProduct = useRemoveProduct();
  const clearAllProducts = useClearAllProducts();
  const { success, warning } = useToast();

  const handleRemoveProduct = (productId: string, productDescription: string) => {
    removeProduct(productId);
    success("Product Removed", `"${productDescription}" has been removed`);
  };

  const handleClearAll = () => {
    if (products.length === 0) {
      warning("No Products", "There are no products to clear");
      return;
    }
    
    clearAllProducts();
    success("All Products Cleared", `${products.length} products have been removed`);
  };

  return (
    <div className="max-w-6xl mx-auto">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Left side - Form and Product List */}
        <div className="space-y-6">
          <ProductForm />
          
          {products.length > 0 && <ProductSearch />}
          
          {products.length > 0 && (
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold text-gray-900">
                  Products ({products.length})
                </h2>
                <button
                  onClick={handleClearAll}
                  className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
                >
                  Clear All
                </button>
              </div>
              
              <div className="space-y-2 max-h-96 overflow-y-auto">
                {products.map((product) => (
                  <div
                    key={product.id}
                    className="flex items-center justify-between p-3 bg-gray-50 rounded-md"
                  >
                  <div className="flex-1">
                    <div className="font-medium text-gray-900">
                      {product.description}
                    </div>
                    <div className="text-sm text-gray-600">
                      Barcode: {product.barcode}
                    </div>
                    <div className="text-xs text-gray-500">
                      Added: {new Date(product.createdAt).toLocaleDateString()}
                    </div>
                  </div>
                    <button
                      onClick={() => handleRemoveProduct(product.id, product.description)}
                      className="ml-2 px-3 py-1 bg-red-500 text-white rounded text-sm hover:bg-red-600 transition-colors"
                    >
                      Remove
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Right side - Preview and PDF Generation */}
        <div className="space-y-6">
          {products.length > 0 && (
            <>
              <TagPreview />
              <PDFGenerator />
            </>
          )}
        </div>
      </div>
    </div>
  );
}
