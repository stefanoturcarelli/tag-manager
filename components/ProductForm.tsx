"use client";

import { useState } from "react";
import { useAddProduct } from "@/stores/productStore";
import { useToast } from "@/contexts/ToastContext";
import { useAutocomplete } from "@/hooks/useAutocomplete";
import { AutocompleteInput } from "./AutocompleteInput";

interface ProductFormProps {
  onAddProduct?: () => void; // Optional callback for UI feedback
}

export function ProductForm({ onAddProduct }: ProductFormProps) {
  const addProduct = useAddProduct();
  const { success, error } = useToast();
  const { barcodeSuggestions, descriptionSuggestions } = useAutocomplete();
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

      <form
        onSubmit={handleSubmit}
        className="space-y-4"
        autoComplete="on"
        method="post"
      >
        {/* Hidden inputs to help browsers understand form structure */}
        <input type="hidden" name="form-type" value="product" />
        <input type="hidden" name="timestamp" value={Date.now()} />

        <div className="space-y-4">
          <div>
            <label
              htmlFor="barcode"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Barcode *
            </label>
            <AutocompleteInput
              id="barcode"
              name="barcode"
              value={formData.barcode}
              onChange={handleChange}
              placeholder="Enter barcode numbers"
              suggestions={barcodeSuggestions}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent placeholder-gray-500 text-gray-900"
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
            <AutocompleteInput
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
              suggestions={descriptionSuggestions}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent placeholder-gray-500 text-gray-900 min-h-[80px]"
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
            <input
              type="number"
              id="quantity"
              name="quantity"
              value={quantity}
              onChange={(e) =>
                setQuantity(Math.max(1, parseInt(e.target.value) || 1))
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent placeholder-gray-500 text-gray-900"
              placeholder="1"
              min="1"
              max="100"
              autoComplete="off"
            />
            <p className="text-xs text-gray-500 mt-1">
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
