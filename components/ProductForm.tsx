"use client";

import { useState } from "react";
import { useAddProduct } from "@/stores/productStore";
import { useToast } from "@/contexts/ToastContext";

interface ProductFormProps {
  onAddProduct?: () => void; // Optional callback for UI feedback
}

export function ProductForm({ onAddProduct }: ProductFormProps) {
  const addProduct = useAddProduct();
  const { success, error } = useToast();
  const [formData, setFormData] = useState({
    barcode: "",
    description: "",
    t2tCode: "",
    color: "",
    usSize: "",
    ukSize: "",
  });
  const [quantity, setQuantity] = useState(1);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Validate required fields
    if (!formData.barcode || !formData.description) {
      error("Validation Error", "Please fill in Barcode and Description");
      return;
    }

    try {
      // Add multiple copies of the same product
      for (let i = 0; i < quantity; i++) {
        addProduct(formData);
      }

      // Show success toast
      success(
        "Product Added!",
        `${quantity} copy${quantity > 1 ? "ies" : ""} of "${
          formData.description
        }" has been added successfully`
      );

      // Call optional callback
      onAddProduct?.();

      // Reset form
      setFormData({
        barcode: "",
        description: "",
        t2tCode: "",
        color: "",
        usSize: "",
        ukSize: "",
      });
      setQuantity(1);
    } catch (err) {
      error("Error", "Failed to add product. Please try again.");
      console.error("Error adding product:", err);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-xl font-semibold text-gray-900 mb-4">
        Add New Product
      </h2>

      <form onSubmit={handleSubmit} className="space-y-4" autoComplete="off">
        <div className="space-y-4">
          <div>
            <label
              htmlFor="barcode"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Barcode *
            </label>
            <input
              type="text"
              id="barcode"
              name="barcode"
              value={formData.barcode}
              onChange={handleChange}
              placeholder="Enter barcode numbers"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent placeholder-gray-500 text-gray-900"
              autoComplete="off"
              autoCorrect="off"
              autoCapitalize="off"
              spellCheck="false"
              data-lpignore="true"
              required
            />
          </div>

          <div>
            <label
              htmlFor="description"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Description *
            </label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  description: e.target.value,
                }))
              }
              placeholder="Enter product description"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent placeholder-gray-500 text-gray-900 min-h-[80px] resize-none"
              autoComplete="off"
              autoCorrect="off"
              autoCapitalize="off"
              spellCheck="false"
              data-lpignore="true"
              required
            />
          </div>

          <div>
            <label
              htmlFor="quantity"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Quantity (optional)
            </label>
            <div className="flex items-center space-x-2">
              <button
                type="button"
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                disabled={quantity <= 1}
                className="flex items-center justify-center w-10 h-10 rounded-lg border-2 border-gray-300 bg-white text-gray-600 hover:bg-gray-50 hover:border-gray-400 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-white disabled:hover:border-gray-300 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                aria-label="Decrease quantity"
              >
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M20 12H4"
                  />
                </svg>
              </button>

              <div className="flex-1 min-w-0">
                <input
                  type="number"
                  id="quantity"
                  name="quantity"
                  value={quantity}
                  onChange={(e) =>
                    setQuantity(
                      Math.max(1, Math.min(100, parseInt(e.target.value) || 1))
                    )
                  }
                  className="w-full px-4 py-2 text-center border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-lg font-semibold text-gray-900"
                  min="1"
                  max="100"
                  autoComplete="off"
                />
              </div>

              <button
                type="button"
                onClick={() => setQuantity(Math.min(100, quantity + 1))}
                disabled={quantity >= 100}
                className="flex items-center justify-center w-10 h-10 rounded-lg border-2 border-gray-300 bg-white text-gray-600 hover:bg-gray-50 hover:border-gray-400 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-white disabled:hover:border-gray-300 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                aria-label="Increase quantity"
              >
                <svg
                  className="w-5 h-5"
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
              </button>
            </div>
            <p className="text-xs text-gray-500 mt-1 text-center">
              Number of copies to generate (1-100)
            </p>
          </div>
        </div>

        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors font-medium"
        >
          {quantity > 1 ? `Add ${quantity} Products` : "Add Product"}
        </button>
      </form>
    </div>
  );
}
