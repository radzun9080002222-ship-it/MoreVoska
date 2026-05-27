import React from 'react';
import { Link } from 'react-router-dom';
import { Trash2, Minus, Plus, ShoppingBag, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { useCart } from '@/contexts/CartContext';

const Cart: React.FC = () => {
  const { items, updateQuantity, removeFromCart, clearCart, totalPrice } = useCart();

  if (items.length === 0) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 pt-20 flex items-center justify-center">
          <div className="text-center px-4">
            <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-ocean-foam flex items-center justify-center">
              <ShoppingBag className="w-12 h-12 text-ocean-accent" />
            </div>
            <h1 className="font-serif text-3xl text-foreground mb-4">
              Корзина пуста
            </h1>
            <p className="text-muted-foreground mb-8">
              Добавьте товары из каталога
            </p>
            <Link to="/catalog">
              <Button variant="ocean" size="lg" className="gap-2">
                Перейти в каталог
                <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1 pt-20">
        <div className="container mx-auto px-4 py-8 lg:py-12">
          <h1 className="font-serif text-4xl font-light text-foreground mb-8">
            Корзина
          </h1>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Cart Items */}
            <div className="lg:col-span-2 space-y-4">
              {items.map((item) => {
                const { product, quantity, cartKey, variantName, selectedImage, selectedOptions } = item;
                const image = selectedImage || product.images[0];
                const displayVariant = variantName || selectedOptions?.color;
                const displayName = displayVariant ? `${product.name} — ${displayVariant}` : product.name;
                return (
                  <div
                    key={cartKey}
                    className="flex gap-4 p-4 bg-card rounded-xl shadow-ocean"
                  >
                    {/* Image */}
                    <div className="w-24 h-24 rounded-lg overflow-hidden bg-muted shrink-0">
                      {image ? (
                        <img
                          src={image}
                          alt={product.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-3xl">
                          🕯️
                        </div>
                      )}
                    </div>

                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <Link
                        to={`/product/${product.id}`}
                        className="font-serif text-lg font-medium text-foreground hover:text-ocean-primary transition-colors line-clamp-1"
                      >
                        {displayName}
                      </Link>
                      <p className="text-xs text-muted-foreground/80 mt-1 tracking-wide">
                        {product.category}
                      </p>
                      {displayVariant && (
                        <p className="text-xs text-muted-foreground mt-1 tracking-[0.08em]">
                          <span className="text-muted-foreground/70">Цвет:</span>{' '}
                          <span className="text-foreground/80 font-medium">{displayVariant}</span>
                        </p>
                      )}
                      <div className="flex items-center justify-between mt-3">
                        <div className="flex items-center border border-input rounded-lg">
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8"
                            onClick={() => updateQuantity(cartKey, quantity - 1)}
                          >
                            <Minus className="w-3 h-3" />
                          </Button>
                          <span className="w-8 text-center text-sm font-medium">
                            {quantity}
                          </span>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8"
                            onClick={() => updateQuantity(cartKey, quantity + 1)}
                            disabled={quantity >= product.inStock}
                          >
                            <Plus className="w-3 h-3" />
                          </Button>
                        </div>
                        <span className="font-serif text-lg font-semibold text-ocean-primary">
                          {(product.price * quantity).toLocaleString('ru-RU')} ₽
                        </span>
                      </div>
                    </div>

                    {/* Remove */}
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => removeFromCart(cartKey)}
                      className="shrink-0 text-muted-foreground hover:text-destructive"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                );
              })}

              <Button
                variant="ghost"
                onClick={clearCart}
                className="text-muted-foreground hover:text-destructive"
              >
                Очистить корзину
              </Button>
            </div>

            {/* Summary */}
            <div className="lg:col-span-1">
              <div className="bg-card rounded-xl shadow-ocean-md p-6 sticky top-24">
                <h2 className="font-serif text-xl font-medium text-foreground mb-6">
                  Итого
                </h2>

                <div className="space-y-3 mb-6">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Товаров:</span>
                    <span className="text-foreground">
                      {items.reduce((sum, i) => sum + i.quantity, 0)} шт.
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Доставка:</span>
                    <span className="text-foreground">По согласованию</span>
                  </div>
                </div>

                <div className="border-t border-border pt-4 mb-6">
                  <div className="flex justify-between">
                    <span className="font-serif text-lg font-medium">Сумма:</span>
                    <span className="font-serif text-2xl font-semibold text-ocean-primary">
                      {totalPrice.toLocaleString('ru-RU')} ₽
                    </span>
                  </div>
                </div>

                <Button variant="ocean" size="lg" className="w-full mb-3">
                  Оформить заказ
                </Button>

                <Link to="/contact">
                  <Button variant="outline" size="lg" className="w-full">
                    Связаться с нами
                  </Button>
                </Link>

                <p className="text-xs text-muted-foreground text-center mt-4">
                  После оформления мы свяжемся с вами для подтверждения заказа
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Cart;
