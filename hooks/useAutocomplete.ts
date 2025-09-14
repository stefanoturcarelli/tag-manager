"use client";

import { useState, useEffect } from "react";
import { useProducts } from "@/stores/productStore";

export function useAutocomplete() {
  const products = useProducts();
  const [barcodeSuggestions, setBarcodeSuggestions] = useState<string[]>([]);
  const [descriptionSuggestions, setDescriptionSuggestions] = useState<
    string[]
  >([]);

  useEffect(() => {
    // Get unique barcodes and descriptions from products
    const uniqueBarcodes = Array.from(
      new Set(products.map((p) => p.barcode))
    ).sort();
    const uniqueDescriptions = Array.from(
      new Set(products.map((p) => p.description))
    ).sort();

    setBarcodeSuggestions(uniqueBarcodes);
    setDescriptionSuggestions(uniqueDescriptions);
  }, [products]);

  const getBarcodeSuggestions = (query: string) => {
    if (!query) return barcodeSuggestions;
    return barcodeSuggestions.filter((barcode) =>
      barcode.toLowerCase().includes(query.toLowerCase())
    );
  };

  const getDescriptionSuggestions = (query: string) => {
    if (!query) return descriptionSuggestions;
    return descriptionSuggestions.filter((description) =>
      description.toLowerCase().includes(query.toLowerCase())
    );
  };

  return {
    barcodeSuggestions,
    descriptionSuggestions,
    getBarcodeSuggestions,
    getDescriptionSuggestions,
  };
}
