export interface ProductVariant {
  id: string;
  name: string;
  description?: string;
  image: string;
}

export interface Product {
  id: string;
  name: string;
  description: string;
  fullDescription?: string;
  price: number;
  images: string[];
  category: string;
  inStock: number;
  featured?: boolean;
  isNew?: boolean;
  variants?: ProductVariant[];
  createdAt: string;
}

export interface CartItem {
  product: Product;
  quantity: number;
  cartKey: string;
  variantId?: string;
  variantName?: string;
  selectedImage?: string;
  selectedOptions?: Record<string, string>;
}
