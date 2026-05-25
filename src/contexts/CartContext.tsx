import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Product, CartItem, ProductVariant } from '@/types/product';

export interface AddToCartOptions {
  variant?: ProductVariant;
  selectedOptions?: Record<string, string>;
}

const buildCartKey = (productId: string, variantId?: string) =>
  variantId ? `${productId}-${variantId}` : productId;

interface CartContextType {
  items: CartItem[];
  addToCart: (product: Product, quantity?: number, options?: AddToCartOptions) => void;
  removeFromCart: (cartKey: string) => void;
  updateQuantity: (cartKey: string, quantity: number) => void;
  clearCart: () => void;
  totalItems: number;
  totalPrice: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [items, setItems] = useState<CartItem[]>(() => {
    const saved = localStorage.getItem('cart_v2');
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem('cart_v2', JSON.stringify(items));
  }, [items]);

  const addToCart = (product: Product, quantity = 1, options?: AddToCartOptions) => {
    const variant = options?.variant;
    const cartKey = buildCartKey(product.id, variant?.id);
    const selectedOptions: Record<string, string> = {
      ...(options?.selectedOptions ?? {}),
    };
    if (variant && !selectedOptions.color) {
      selectedOptions.color = variant.name;
    }
    setItems(prev => {
      const existing = prev.find(item => item.cartKey === cartKey);
      if (existing) {
        return prev.map(item =>
          item.cartKey === cartKey
            ? { ...item, quantity: Math.min(item.quantity + quantity, product.inStock) }
            : item
        );
      }
      return [
        ...prev,
        {
          product,
          quantity,
          cartKey,
          variantId: variant?.id,
          variantName: variant?.name,
          selectedImage: variant?.image,
          selectedOptions: Object.keys(selectedOptions).length ? selectedOptions : undefined,
        },
      ];
    });
  };

  const removeFromCart = (cartKey: string) => {
    setItems(prev => prev.filter(item => item.cartKey !== cartKey));
  };

  const updateQuantity = (cartKey: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(cartKey);
      return;
    }
    setItems(prev =>
      prev.map(item =>
        item.cartKey === cartKey
          ? { ...item, quantity: Math.min(quantity, item.product.inStock) }
          : item
      )
    );
  };

  const clearCart = () => setItems([]);

  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
  const totalPrice = items.reduce((sum, item) => sum + item.product.price * item.quantity, 0);

  return (
    <CartContext.Provider
      value={{ items, addToCart, removeFromCart, updateQuantity, clearCart, totalItems, totalPrice }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
