import React, { useState, useMemo } from 'react';
import { Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import ProductCard from '@/components/ProductCard';
import { useProducts } from '@/contexts/ProductContext';
import { cn } from '@/lib/utils';

const CATEGORIES = ['Все', 'Свечи', 'Гипс', 'Гипс + Свеча', 'Подарки'] as const;
const TAGS = [
  { id: 'all', label: 'Весь ассортимент' },
  { id: 'new', label: 'Новинки' },
  { id: 'featured', label: 'Хиты' },
  { id: 'stock', label: 'В наличии' },
] as const;

type Tag = (typeof TAGS)[number]['id'];

const Catalog: React.FC = () => {
  const { products } = useProducts();
  const [category, setCategory] = useState<(typeof CATEGORIES)[number]>('Все');
  const [tag, setTag] = useState<Tag>('all');
  const [search, setSearch] = useState('');

  const filtered = useMemo(() => {
    return products.filter((p) => {
      if (category !== 'Все' && p.category !== category) return false;
      if (tag === 'new' && !p.isNew) return false;
      if (tag === 'featured' && !p.featured) return false;
      if (tag === 'stock' && p.inStock <= 0) return false;
      if (search) {
        const q = search.toLowerCase();
        if (!p.name.toLowerCase().includes(q) && !p.description.toLowerCase().includes(q)) return false;
      }
      return true;
    });
  }, [products, category, tag, search]);

  return (
    <div className="min-h-screen flex flex-col bg-brand-warm">
      <Header />

      <main className="flex-1 pt-28">
        {/* Header */}
        <section className="container mx-auto px-4 pt-8 pb-12 lg:pt-16 lg:pb-20 text-center">
          <span className="text-[11px] tracking-[0.3em] uppercase text-brand-teal/80 font-medium">
            Коллекция · Море Воска
          </span>
          <h1 className="font-serif text-5xl md:text-6xl lg:text-7xl font-light text-brand-teal-deep mt-4 mb-6 leading-[1.05]">
            Изделия мастерской
          </h1>
          <p className="max-w-xl mx-auto text-base text-muted-foreground/90 font-light leading-relaxed">
            Спокойная coastal эстетика, авторская керамика и свечи ручной работы —
            каждое изделие создаётся вручную в небольшой мастерской.
          </p>
        </section>

        {/* Filters */}
        <section className="container mx-auto px-4 pb-10">
          <div className="flex flex-wrap justify-center gap-2 mb-6">
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => setCategory(cat)}
                className={cn(
                  'px-5 py-2.5 rounded-full text-sm font-medium transition-all duration-300',
                  'border',
                  category === cat
                    ? 'bg-brand-teal-deep text-brand-warm border-brand-teal-deep shadow-[0_8px_24px_-12px_hsl(var(--brand-teal-deep)/0.5)]'
                    : 'bg-transparent text-brand-teal-deep/80 border-brand-sand hover:border-brand-teal hover:text-brand-teal-deep'
                )}
              >
                {cat}
              </button>
            ))}
          </div>

          <div className="flex flex-wrap justify-center items-center gap-x-6 gap-y-2 mb-10">
            {TAGS.map((t) => (
              <button
                key={t.id}
                onClick={() => setTag(t.id)}
                className={cn(
                  'text-[11px] tracking-[0.22em] uppercase font-medium transition-colors pb-1 border-b',
                  tag === t.id
                    ? 'text-brand-teal-deep border-brand-gold'
                    : 'text-brand-teal/50 border-transparent hover:text-brand-teal-deep'
                )}
              >
                {t.label}
              </button>
            ))}
          </div>

          <div className="max-w-md mx-auto relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-brand-teal/50" />
            <Input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Поиск по коллекции"
              className="pl-11 h-12 rounded-full bg-card/80 border-brand-sand/60 focus-visible:ring-brand-teal/30"
            />
          </div>
        </section>

        {/* Products */}
        <section className="container mx-auto px-4 pb-24 lg:pb-32">
          {filtered.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-8 gap-y-14">
              {filtered.map((product, index) => (
                <div
                  key={product.id}
                  className="animate-fade-in"
                  style={{ animationDelay: `${index * 0.06}s`, opacity: 0, animationFillMode: 'forwards' }}
                >
                  <ProductCard product={product} />
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-24">
              <p className="font-serif text-3xl font-light text-brand-teal-deep mb-3">
                Ничего не найдено
              </p>
              <p className="text-sm text-muted-foreground">
                Попробуйте изменить фильтры или поисковый запрос
              </p>
            </div>
          )}
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default Catalog;