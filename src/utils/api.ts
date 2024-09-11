export type Product = {
  id: number;
  title: string;
  description?: string;
  price: number;
  images: string[];
  category?: string;
  quantity?: number;
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

// CART APIs
export interface CartItem extends Product {
  quantity: number;
}

export const addToCart = (product: Product) => {
  const cart: CartItem[] = JSON.parse(localStorage.getItem("cart") || "[]");
  const existingProductIndex = cart.findIndex((item) => item.id === product.id);

  if (existingProductIndex !== -1) {
    cart[existingProductIndex].quantity += 1;
  } else {
    cart.push({ ...product, quantity: 1 });
  }

  localStorage.setItem("cart", JSON.stringify(cart));
};

export const removeFromCart = (productId: number) => {
  const cart = JSON.parse(localStorage.getItem("cart") || "[]");
  const updatedCart = cart.filter((item: Product) => item.id !== productId);
  localStorage.setItem("cart", JSON.stringify(updatedCart));
};

export const getCartItems = (): Product[] => {
  return JSON.parse(localStorage.getItem("cart") || "[]");
};
