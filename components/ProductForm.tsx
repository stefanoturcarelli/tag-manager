"use client";

import { useState } from "react";
import { useAddProduct } from "@/stores/productStore";

interface ProductFormProps {
  onAddProduct?: () => void; // Optional callback for UI feedback
}

export function ProductForm({ onAddProduct }: ProductFormProps) {
  const addProduct = useAddProduct();
  const [formData, setFormData] = useState({
    barcode: "",
    description: "",
    t2tCode: "",
    color: "",
    usSize: "",
    ukSize: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate required fields
    if (!formData.barcode || !formData.description) {
      alert("Please fill in Barcode and Description");
      return;
    }

    // Add product to store
    addProduct(formData);
    
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
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-xl font-semibold text-gray-900 mb-4">
        Add New Product
      </h2>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-4">
          <div>
            <label htmlFor="barcode" className="block text-sm font-medium text-gray-700 mb-1">
              Barcode *
            </label>
            <input
              type="text"
              id="barcode"
              name="barcode"
              value={formData.barcode}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent placeholder-gray-500 text-gray-900"
              placeholder="Enter barcode numbers"
              required
            />
          </div>

          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
              Description *
            </label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent placeholder-gray-500 text-gray-900"
              placeholder="Enter product description"
              rows={3}
              required
            />
          </div>
        </div>

        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors font-medium"
        >
          Add Product
        </button>
      </form>
    </div>
  );
}
