import { useMemo } from 'react';
import { useProducts } from '@/stores/productStore';

export function useAutocomplete() {
  const products = useProducts();

  const barcodeSuggestions = useMemo(() => {
    const barcodes = products.map((product) => product.barcode);
    return [...new Set(barcodes)].sort();
  }, [products]);

  const descriptionSuggestions = useMemo(() => {
    const descriptions = products.map((product) => product.description);
    return [...new Set(descriptions)].sort();
  }, [products]);

  return {
    barcodeSuggestions,
    descriptionSuggestions,
  };
}
