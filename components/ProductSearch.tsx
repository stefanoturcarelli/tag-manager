"use client";

import { useState, useMemo } from "react";
import {
  useSearchProducts,
  useAddProduct,
  useProducts,
} from "@/stores/productStore";
import { useToast } from "@/contexts/ToastContext";

export function ProductSearch() {
  const searchProducts = useSearchProducts();
  const addProduct = useAddProduct();
  const allProducts = useProducts();
  const { success, warning } = useToast();
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState(searchProducts(""));
  const [showUniqueOnly, setShowUniqueOnly] = useState(false);

  // Get unique products based on barcode
  const uniqueProducts = useMemo(() => {
    const seenBarcodes = new Set();
    return allProducts.filter((product) => {
      if (seenBarcodes.has(product.barcode)) {
        return false;
      }
      seenBarcodes.add(product.barcode);
      return true;
    });
  }, [allProducts]);

  // Filter search results based on unique toggle
  const filteredResults = useMemo(() => {
    if (showUniqueOnly) {
      const seenBarcodes = new Set();
      return searchResults.filter((product) => {
        if (seenBarcodes.has(product.barcode)) {
          return false;
        }
        seenBarcodes.add(product.barcode);
        return true;
      });
    }
    return searchResults;
  }, [searchResults, showUniqueOnly]);

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    const results = searchProducts(query);
    setSearchResults(results);
  };

  const clearSearch = () => {
    setSearchQuery("");
    setSearchResults(searchProducts(""));
  };

  const handleQuickAdd = (product: any) => {
    // Check if product already exists in current list
    const exists = allProducts.some((p) => p.barcode === product.barcode);

    if (exists) {
      warning(
        "Product Already Added",
        `Product with barcode ${product.barcode} is already in your list`
      );
      return;
    }

    // Add the product
    addProduct({
      barcode: product.barcode,
      description: product.description,
      t2tCode: product.t2tCode,
      color: product.color,
      usSize: product.usSize,
      ukSize: product.ukSize,
    });

    success(
      "Product Added",
      `"${product.description}" has been added to your tag list`
    );
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-xl font-semibold text-gray-900 mb-4">
        Search Products
      </h2>

      <div className="space-y-4">
        <div className="relative">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => handleSearch(e.target.value)}
            placeholder="Search by description, barcode, T2T code, color, or size..."
            className="w-full px-4 py-2 pl-10 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent placeholder-gray-500 text-gray-900"
          />
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <svg
              className="h-5 w-5 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </div>
          {searchQuery && (
            <button
              onClick={clearSearch}
              className="absolute inset-y-0 right-0 pr-3 flex items-center"
            >
              <svg
                className="h-5 w-5 text-gray-400 hover:text-gray-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          )}
        </div>

        {searchQuery && (
          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-600">
              Found {filteredResults.length} product
              {filteredResults.length !== 1 ? "s" : ""} matching "{searchQuery}"
              {showUniqueOnly && " (unique barcodes only)"}
            </div>
            <label className="flex items-center space-x-2 text-sm">
              <input
                type="checkbox"
                checked={showUniqueOnly}
                onChange={(e) => setShowUniqueOnly(e.target.checked)}
                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <span className="text-gray-700">Show unique only</span>
            </label>
          </div>
        )}

        {filteredResults.length > 0 && (
          <div className="space-y-2 max-h-64 overflow-y-auto">
            {filteredResults.map((product) => {
              const isAlreadyAdded = allProducts.some(
                (p) => p.barcode === product.barcode
              );
              return (
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
                  <div className="ml-4">
                    {isAlreadyAdded ? (
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                        <svg
                          className="w-3 h-3 mr-1"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path
                            fillRule="evenodd"
                            d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                            clipRule="evenodd"
                          />
                        </svg>
                        Added
                      </span>
                    ) : (
                      <button
                        onClick={() => handleQuickAdd(product)}
                        className="inline-flex items-center px-3 py-1 rounded-md text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
                      >
                        <svg
                          className="w-4 h-4 mr-1"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M12 4v16m8-8H4"
                          />
                        </svg>
                        Quick Add
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {searchQuery && filteredResults.length === 0 && (
          <div className="text-center text-gray-500 py-4">
            {searchResults.length === 0
              ? "No products found matching your search."
              : "No unique products found. Try turning off the 'Show unique only' filter."}
          </div>
        )}
      </div>
    </div>
  );
}
