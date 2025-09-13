"use client";

import { useState } from "react";
import { Product } from "./TagManager";

interface ProductFormProps {
  onAddProduct: (product: Omit<Product, "id">) => void;
}

export function ProductForm({ onAddProduct }: ProductFormProps) {
  const [formData, setFormData] = useState({
    barcode: "",
    productName: "",
    t2tCode: "",
    color: "",
    usSize: "",
    ukSize: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate required fields
    if (!formData.barcode || !formData.productName) {
      alert("Please fill in at least Barcode and Product Name");
      return;
    }

    onAddProduct(formData);
    
    // Reset form
    setFormData({
      barcode: "",
      productName: "",
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
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
            <label htmlFor="productName" className="block text-sm font-medium text-gray-700 mb-1">
              Product Name *
            </label>
            <input
              type="text"
              id="productName"
              name="productName"
              value={formData.productName}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent placeholder-gray-500 text-gray-900"
              placeholder="Enter product name"
              required
            />
          </div>

          <div>
            <label htmlFor="t2tCode" className="block text-sm font-medium text-gray-700 mb-1">
              T2T Code
            </label>
            <input
              type="text"
              id="t2tCode"
              name="t2tCode"
              value={formData.t2tCode}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent placeholder-gray-500 text-gray-900"
              placeholder="Enter T2T code"
            />
          </div>

          <div>
            <label htmlFor="color" className="block text-sm font-medium text-gray-700 mb-1">
              Color
            </label>
            <input
              type="text"
              id="color"
              name="color"
              value={formData.color}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent placeholder-gray-500 text-gray-900"
              placeholder="Enter color"
            />
          </div>

          <div>
            <label htmlFor="usSize" className="block text-sm font-medium text-gray-700 mb-1">
              US Size
            </label>
            <input
              type="text"
              id="usSize"
              name="usSize"
              value={formData.usSize}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent placeholder-gray-500 text-gray-900"
              placeholder="Enter US size"
            />
          </div>

          <div>
            <label htmlFor="ukSize" className="block text-sm font-medium text-gray-700 mb-1">
              UK Size
            </label>
            <input
              type="text"
              id="ukSize"
              name="ukSize"
              value={formData.ukSize}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent placeholder-gray-500 text-gray-900"
              placeholder="Enter UK size"
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
