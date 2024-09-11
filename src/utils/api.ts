export type Product = {
  id: number;
  title: string;
  description: string;
  price: number;
  images: string[];
};

export const fetchProducts = async (
  limit: number,
  skip: number
): Promise<Product[]> => {
  const response = await fetch(
    `https://dummyjson.com/products?limit=${limit}&skip=${skip}`
  );
  if (!response.ok) {
    throw new Error("Failed to fetch products");
  }
  const data = await response.json();
  return data.products;
};

export const searchProducts = async (
  query: string,
  limit: number,
  skip: number
): Promise<Product[]> => {
  const response = await fetch(
    `https://dummyjson.com/products/search?q=${query}&limit=${limit}&skip=${skip}`
  );
  if (!response.ok) {
    throw new Error("Failed to search products");
  }
  const data = await response.json();
  return data.products;
};
