import React from 'react';
import { Link } from 'react-router-dom';
import { Product } from '@/types/product';
import { cn } from '@/lib/utils';

interface ProductCardProps {
  product: Product;
  className?: string;
}

const ProductCard: React.FC<ProductCardProps> = ({ product, className }) => {
  return (
    <Link
      to={`/product/${product.id}`}
      className={cn(
        'group block relative',
        className
      )}
    >
      {/* Image */}
      <div className="relative aspect-[4/5] overflow-hidden rounded-[28px] bg-brand-warm">
        {product.images[0] ? (
          <img
            src={product.images[0]}
            alt={product.name}
            loading="lazy"
            className="w-full h-full object-cover transition-transform duration-[1200ms] ease-out group-hover:scale-[1.04]"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-brand-warm to-brand-sand/40">
            <span className="font-serif text-5xl text-brand-teal/40">🕯️</span>
          </div>
        )}

        {/* Badges */}
        <div className="absolute top-4 left-4 flex flex-col gap-2">
          {product.isNew && (
            <span className="px-3 py-1 text-[10px] tracking-[0.18em] uppercase font-medium bg-brand-warm/95 text-brand-teal-deep rounded-full backdrop-blur-sm">
              Новинка
            </span>
          )}
          {product.featured && !product.isNew && (
            <span className="px-3 py-1 text-[10px] tracking-[0.18em] uppercase font-medium bg-brand-gold/95 text-brand-warm rounded-full backdrop-blur-sm">
              Хит
            </span>
          )}
        </div>

        {product.inStock === 0 && (
          <div className="absolute inset-0 flex items-center justify-center bg-brand-warm/70 backdrop-blur-[2px]">
            <span className="text-[11px] tracking-[0.2em] uppercase text-brand-teal-deep font-medium">
              Нет в наличии
            </span>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="pt-6 px-1">
        <span className="text-[10px] tracking-[0.22em] uppercase text-brand-teal/70 font-medium">
          {product.category}
        </span>
        <h3 className="font-serif text-2xl font-light text-foreground mt-2 mb-2 leading-tight">
          {product.name}
        </h3>
        <p className="text-sm text-muted-foreground/90 leading-relaxed line-clamp-2 mb-4 font-light">
          {product.description}
        </p>
        <div className="flex items-baseline justify-between pt-2 border-t border-brand-sand/40">
          <span className="font-serif text-xl text-brand-teal-deep">
            {product.price.toLocaleString('ru-RU')} ₽
          </span>
          <span className="text-xs tracking-[0.15em] uppercase text-brand-teal/80 group-hover:text-brand-gold transition-colors">
            Подробнее →
          </span>
        </div>
      </div>
    </Link>
  );
};

export default ProductCard;