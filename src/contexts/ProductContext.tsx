import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Product } from '@/types/product';
import goddessCandle from '@/assets/goddess-candle.jpg';
import pumpkinHero from '@/assets/pumpkin-hero.png';
import pumpkinClassic from '@/assets/pumpkin-classic.png';
import pumpkinBotanic from '@/assets/pumpkin-botanic.png';
import pumpkinMoss from '@/assets/pumpkin-moss.png';
import pumpkinLifestyle from '@/assets/pumpkin-lifestyle.png';

const defaultProducts: Product[] = [
  {
    id: 'pumpkin-box',
    name: 'Шкатулка «Тыква»',
    description:
      'Атмосферная декоративная шкатулка в форме тыквы — эстетичный акцент для дома и красивого хранения мелочей. Спокойная seasonal эстетика в фирменной подаче «Море Воска».',
    fullDescription:
      'Декоративная гипсовая шкатулка «Тыква» — интерьерный объект с атмосферой уюта, спокойствия и красивых деталей.\n\nПодходит для хранения украшений, мелочей или как самостоятельный элемент декора. Каждая шкатулка создаётся вручную и становится маленьким акцентом дома, который хочется рассматривать.\n\nМинималистичная seasonal эстетика, мягкие формы и премиальная фактура делают изделие красивым подарком и элементом интерьера.',
    price: 990,
    images: [pumpkinHero, pumpkinClassic, pumpkinBotanic, pumpkinMoss, pumpkinLifestyle],
    category: 'Гипс',
    inStock: 8,
    featured: true,
    isNew: true,
    variants: [
      {
        id: 'classic',
        name: 'Классика',
        description: 'Классическая оранжевая тыква с теплым осенним характером.',
        image: pumpkinClassic,
      },
      {
        id: 'botanic',
        name: 'Ботаника',
        description: 'Белая версия с деликатным цветочным рисунком и мягкой эстетикой.',
        image: pumpkinBotanic,
      },
      {
        id: 'moss',
        name: 'Лесной мох',
        description: 'Фактурная художественная версия с природным характером.',
        image: pumpkinMoss,
      },
    ],
    createdAt: new Date().toISOString(),
  },
  {
    id: '1',
    name: 'Богиня Земли Гайя',
    description: 'Изысканная декоративная свеча ручной работы, изображающая богиню Гайю. Украшена золотыми деталями и символами природы. Идеально подойдёт для создания атмосферы гармонии.',
    price: 2500,
    images: [goddessCandle],
    category: 'Свечи',
    inStock: 5,
    featured: true,
    createdAt: new Date().toISOString(),
  },
  {
    id: '2',
    name: 'Океанская Волна',
    description: 'Свеча в форме морской волны с градиентом от глубокого синего к бирюзовому. Аромат морского бриза.',
    price: 1800,
    images: [],
    category: 'Свечи',
    inStock: 8,
    featured: true,
    createdAt: new Date().toISOString(),
  },
  {
    id: '3',
    name: 'Лотос Просветления',
    description: 'Нежная свеча в форме цветка лотоса. Создаёт атмосферу спокойствия и умиротворения.',
    price: 1200,
    images: [],
    category: 'Свечи',
    inStock: 12,
    featured: false,
    createdAt: new Date().toISOString(),
  },
  {
    id: '4',
    name: 'Морская Ракушка',
    description: 'Реалистичная свеча в виде морской ракушки. Прекрасный подарок для любителей моря.',
    price: 900,
    images: [],
    category: 'Гипс + Свеча',
    inStock: 15,
    featured: false,
    createdAt: new Date().toISOString(),
  },
];

interface ProductContextType {
  products: Product[];
  addProduct: (product: Omit<Product, 'id' | 'createdAt'>) => void;
  updateProduct: (id: string, product: Partial<Product>) => void;
  deleteProduct: (id: string) => void;
  getProduct: (id: string) => Product | undefined;
  categories: string[];
}

const ProductContext = createContext<ProductContextType | undefined>(undefined);

export const ProductProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [products, setProducts] = useState<Product[]>(() => {
    const saved = localStorage.getItem('products_v2');
    return saved ? JSON.parse(saved) : defaultProducts;
  });

  useEffect(() => {
    localStorage.setItem('products_v2', JSON.stringify(products));
  }, [products]);

  const addProduct = (product: Omit<Product, 'id' | 'createdAt'>) => {
    const newProduct: Product = {
      ...product,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
    };
    setProducts(prev => [...prev, newProduct]);
  };

  const updateProduct = (id: string, updates: Partial<Product>) => {
    setProducts(prev =>
      prev.map(p => (p.id === id ? { ...p, ...updates } : p))
    );
  };

  const deleteProduct = (id: string) => {
    setProducts(prev => prev.filter(p => p.id !== id));
  };

  const getProduct = (id: string) => products.find(p => p.id === id);

  const categories = [...new Set(products.map(p => p.category))];

  return (
    <ProductContext.Provider
      value={{ products, addProduct, updateProduct, deleteProduct, getProduct, categories }}
    >
      {children}
    </ProductContext.Provider>
  );
};

export const useProducts = () => {
  const context = useContext(ProductContext);
  if (!context) {
    throw new Error('useProducts must be used within a ProductProvider');
  }
  return context;
};
