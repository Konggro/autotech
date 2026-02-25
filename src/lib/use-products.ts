import { useEffect, useState } from 'react';
import type { Product } from './mock-data';
import { fetchProducts } from './data-service';

let productsCache: Product[] | null = null;
let inFlightRequest: Promise<Product[]> | null = null;
const subscribers = new Set<(products: Product[]) => void>();

async function loadProductsShared() {
  if (productsCache) return productsCache;
  if (inFlightRequest) return inFlightRequest;

  inFlightRequest = fetchProducts()
    .then((products) => {
      productsCache = products;
      subscribers.forEach((notify) => notify(products));
      return products;
    })
    .finally(() => {
      inFlightRequest = null;
    });

  return inFlightRequest;
}

export function useProducts() {
  const [products, setProducts] = useState<Product[]>(productsCache ?? []);
  const [loading, setLoading] = useState(!productsCache);

  useEffect(() => {
    const handleProductsUpdate = (nextProducts: Product[]) => {
      setProducts(nextProducts);
      setLoading(false);
    };

    subscribers.add(handleProductsUpdate);

    if (productsCache) {
      handleProductsUpdate(productsCache);
    } else {
      void loadProductsShared().then(handleProductsUpdate);
    }

    return () => {
      subscribers.delete(handleProductsUpdate);
    };
  }, []);

  return { products, loading };
}
