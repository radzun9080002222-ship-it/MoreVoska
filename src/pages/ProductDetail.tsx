import React, { useState, useMemo, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, ShoppingBag, Minus, Plus, Check, ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import ProductCard from '@/components/ProductCard';
import { useProducts } from '@/contexts/ProductContext';
import { useCart } from '@/contexts/CartContext';
import { toast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';

const ProductDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { getProduct, products } = useProducts();
  const { addToCart } = useCart();
  const [quantity, setQuantity] = useState(1);
  const [activeIndex, setActiveIndex] = useState(0);
  const [variantId, setVariantId] = useState<string | null>(null);

  const product = id ? getProduct(id) : undefined;

  useEffect(() => {
    setActiveIndex(0);
    setQuantity(1);
    setVariantId(product?.variants?.[0]?.id ?? null);
  }, [id, product?.variants]);

  if (!product) {
    return (
      <div className="min-h-screen flex flex-col bg-brand-warm">
        <Header />
        <main className="flex-1 pt-32 flex items-center justify-center">
          <div className="text-center">
            <h1 className="font-serif text-4xl font-light text-brand-teal-deep mb-6">
              Товар не найден
            </h1>
            <Link to="/catalog">
              <Button variant="ocean">Вернуться в каталог</Button>
            </Link>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const activeVariant = product.variants?.find((v) => v.id === variantId);

  const handleSelectVariant = (vid: string) => {
    setVariantId(vid);
    const variant = product.variants?.find((v) => v.id === vid);
    if (variant) {
      const idx = product.images.findIndex((img) => img === variant.image);
      if (idx >= 0) setActiveIndex(idx);
    }
  };

  const related = useMemo(
    () => products.filter((p) => p.category === product.category && p.id !== product.id).slice(0, 4),
    [products, product]
  );

  const handleAddToCart = () => {
    addToCart(product, quantity, activeVariant ? { variant: activeVariant } : undefined);
    toast({
      title: 'Добавлено в корзину',
      description: `${product.name}${activeVariant ? ` · ${activeVariant.name}` : ''} (${quantity} шт.)`,
    });
  };

  const goPrev = () => setActiveIndex((i) => (i - 1 + product.images.length) % product.images.length);
  const goNext = () => setActiveIndex((i) => (i + 1) % product.images.length);

  const features = [
    'Ручная работа',
    'Премиальный гипс',
    'Защитное покрытие',
    'Интерьерный декор и хранение',
    'Подходит для подарка',
  ];

  return (
    <div className="min-h-screen flex flex-col bg-brand-warm">
      <Header />

      <main className="flex-1 pt-28">
        <div className="container mx-auto px-4 py-8 lg:py-12">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-[11px] tracking-[0.22em] uppercase text-brand-teal/70 hover:text-brand-teal-deep transition-colors mb-10"
          >
            <ArrowLeft className="w-4 h-4" />
            Назад
          </button>

          <div className="grid lg:grid-cols-[1.1fr_1fr] gap-10 lg:gap-20">
            {/* Gallery */}
            <div className="space-y-5">
              <div className="relative aspect-[4/5] rounded-[32px] overflow-hidden bg-card group">
                {product.images[activeIndex] ? (
                  <img
                    key={activeIndex}
                    src={product.images[activeIndex]}
                    alt={product.name}
                    className="w-full h-full object-cover animate-fade-in"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-brand-sand/30">
                    <span className="text-7xl text-brand-teal/30">🕯️</span>
                  </div>
                )}

                {product.images.length > 1 && (
                  <>
                    <button
                      onClick={goPrev}
                      aria-label="Предыдущее"
                      className="absolute left-4 top-1/2 -translate-y-1/2 w-11 h-11 rounded-full bg-brand-warm/90 backdrop-blur flex items-center justify-center text-brand-teal-deep opacity-0 group-hover:opacity-100 transition-opacity hover:bg-brand-warm"
                    >
                      <ChevronLeft className="w-5 h-5" />
                    </button>
                    <button
                      onClick={goNext}
                      aria-label="Следующее"
                      className="absolute right-4 top-1/2 -translate-y-1/2 w-11 h-11 rounded-full bg-brand-warm/90 backdrop-blur flex items-center justify-center text-brand-teal-deep opacity-0 group-hover:opacity-100 transition-opacity hover:bg-brand-warm"
                    >
                      <ChevronRight className="w-5 h-5" />
                    </button>
                  </>
                )}
              </div>

              {product.images.length > 1 && (
                <div className="flex gap-3 overflow-x-auto pb-2 -mx-1 px-1 snap-x">
                  {product.images.map((img, index) => (
                    <button
                      key={index}
                      onClick={() => setActiveIndex(index)}
                      className={cn(
                        'shrink-0 w-20 h-24 rounded-2xl overflow-hidden border transition-all snap-start',
                        activeIndex === index
                          ? 'border-brand-gold shadow-[0_8px_20px_-8px_hsl(var(--brand-gold)/0.6)]'
                          : 'border-brand-sand/40 opacity-70 hover:opacity-100'
                      )}
                    >
                      <img src={img} alt="" className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Info */}
            <div className="lg:pt-4">
              <div className="flex items-center gap-3 mb-4">
                <span className="text-[11px] tracking-[0.25em] uppercase text-brand-teal/80 font-medium">
                  {product.category}
                </span>
                {product.isNew && (
                  <span className="px-2.5 py-1 text-[10px] tracking-[0.18em] uppercase font-medium bg-brand-gold/15 text-brand-gold rounded-full">
                    Новинка
                  </span>
                )}
              </div>

              <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl font-light text-brand-teal-deep mb-6 leading-[1.05]">
                {product.name}
              </h1>

              <p className="text-base text-muted-foreground/90 leading-relaxed font-light mb-8">
                {product.description}
              </p>

              {/* Variants */}
              {product.variants && product.variants.length > 0 && (
                <div className="mb-8">
                  <div className="flex items-baseline justify-between mb-3">
                    <span className="text-[11px] tracking-[0.22em] uppercase text-brand-teal/70 font-medium">
                      Вариант исполнения
                    </span>
                    {activeVariant && (
                      <span className="font-serif text-lg text-brand-teal-deep">
                        {activeVariant.name}
                      </span>
                    )}
                  </div>
                  <div className="grid grid-cols-3 gap-3">
                    {product.variants.map((v) => {
                      const active = variantId === v.id;
                      return (
                        <button
                          key={v.id}
                          onClick={() => handleSelectVariant(v.id)}
                          className={cn(
                            'group/v relative overflow-hidden rounded-2xl border transition-all duration-300 bg-card',
                            active
                              ? 'border-brand-gold shadow-[0_10px_24px_-12px_hsl(var(--brand-gold)/0.6)] ring-1 ring-brand-gold/40'
                              : 'border-brand-sand/50 hover:border-brand-teal/40'
                          )}
                        >
                          <div className="aspect-square overflow-hidden bg-brand-warm">
                            <img
                              src={v.image}
                              alt={v.name}
                              className="w-full h-full object-cover transition-transform duration-700 group-hover/v:scale-105"
                            />
                          </div>
                          <div className="px-2 py-2 text-center">
                            <span
                              className={cn(
                                'text-xs font-medium tracking-wide',
                                active ? 'text-brand-teal-deep' : 'text-muted-foreground'
                              )}
                            >
                              {v.name}
                            </span>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                  {activeVariant?.description && (
                    <p className="mt-3 text-sm text-muted-foreground/80 font-light italic">
                      {activeVariant.description}
                    </p>
                  )}
                </div>
              )}

              {/* Price + stock */}
              <div className="flex items-baseline justify-between py-6 border-y border-brand-sand/50 mb-8">
                <span className="font-serif text-4xl font-light text-brand-teal-deep">
                  {product.price.toLocaleString('ru-RU')} ₽
                </span>
                {product.inStock > 0 ? (
                  <span className="flex items-center gap-2 text-xs tracking-[0.18em] uppercase text-brand-teal">
                    <Check className="w-4 h-4" />
                    В наличии
                  </span>
                ) : (
                  <span className="text-xs tracking-[0.18em] uppercase text-muted-foreground">
                    Под заказ
                  </span>
                )}
              </div>

              {/* Quantity + CTA */}
              {product.inStock > 0 && (
                <div className="flex flex-col sm:flex-row gap-3 mb-10">
                  <div className="flex items-center border border-brand-sand rounded-full bg-card/60">
                    <button
                      onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                      className="w-12 h-12 flex items-center justify-center text-brand-teal-deep hover:text-brand-gold transition-colors"
                      aria-label="Уменьшить"
                    >
                      <Minus className="w-4 h-4" />
                    </button>
                    <span className="w-10 text-center font-medium text-brand-teal-deep">{quantity}</span>
                    <button
                      onClick={() => setQuantity((q) => Math.min(product.inStock, q + 1))}
                      className="w-12 h-12 flex items-center justify-center text-brand-teal-deep hover:text-brand-gold transition-colors"
                      aria-label="Увеличить"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>

                  <button
                    onClick={handleAddToCart}
                    className="flex-1 inline-flex items-center justify-center gap-3 h-12 px-8 rounded-full bg-brand-teal-deep text-brand-warm text-sm tracking-[0.15em] uppercase font-medium transition-all duration-300 hover:bg-brand-teal hover:shadow-[0_12px_30px_-12px_hsl(var(--brand-teal-deep)/0.55)]"
                  >
                    <ShoppingBag className="w-4 h-4" />
                    Добавить в корзину
                  </button>
                </div>
              )}

              {/* Full description */}
              {product.fullDescription && (
                <div className="border-t border-brand-sand/50 pt-8 mb-8">
                  <h3 className="text-[11px] tracking-[0.25em] uppercase text-brand-teal/80 font-medium mb-4">
                    Об изделии
                  </h3>
                  <div className="space-y-3 text-sm text-muted-foreground/90 leading-relaxed font-light whitespace-pre-line">
                    {product.fullDescription}
                  </div>
                </div>
              )}

              {/* Features */}
              <div className="border-t border-brand-sand/50 pt-8">
                <h3 className="text-[11px] tracking-[0.25em] uppercase text-brand-teal/80 font-medium mb-4">
                  Особенности
                </h3>
                <ul className="grid sm:grid-cols-2 gap-y-2 gap-x-6 text-sm text-foreground/80 font-light">
                  {features.map((f) => (
                    <li key={f} className="flex items-center gap-3">
                      <span className="w-1 h-1 rounded-full bg-brand-gold" />
                      {f}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          {/* Related */}
          {related.length > 0 && (
            <section className="mt-24 lg:mt-32 pt-16 border-t border-brand-sand/40">
              <div className="text-center mb-12">
                <span className="text-[11px] tracking-[0.3em] uppercase text-brand-teal/70 font-medium">
                  Из той же коллекции
                </span>
                <h2 className="font-serif text-4xl font-light text-brand-teal-deep mt-3">
                  Может понравиться
                </h2>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-12">
                {related.map((p) => (
                  <ProductCard key={p.id} product={p} />
                ))}
              </div>
            </section>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default ProductDetail;