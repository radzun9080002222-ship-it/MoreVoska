import React, { useState, useMemo } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { Copy, RotateCcw, FlaskConical, Check } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

type FormulaKey = 'weak' | 'normal' | 'max';

interface Formula {
  label: string;
  gypsum: number;
  water: number;
  titanium: number;
  pros: string[];
  cons: string[];
}

const formulas: Record<FormulaKey, Formula> = {
  weak: {
    label: 'Слабая детализация',
    gypsum: 0.75,
    water: 0.23,
    titanium: 0.02,
    pros: ['Легко льётся', 'Минимум пузырей'],
    cons: ['Низкая прочность', 'Плохая детализация'],
  },
  normal: {
    label: 'Обычная (универсальная)',
    gypsum: 0.775,
    water: 0.20,
    titanium: 0.025,
    pros: ['Баланс прочности и текучести', 'Универсальный вариант'],
    cons: ['Требует аккуратной заливки'],
  },
  max: {
    label: 'Максимальная детализация',
    gypsum: 0.80,
    water: 0.18,
    titanium: 0.02,
    pros: ['Чёткие детали', 'Высокая прочность'],
    cons: ['Быстро схватывается', 'Возможны пузыри без вибрации'],
  },
};

const Calculator: React.FC = () => {
  const [weight, setWeight] = useState(1000);
  const [selected, setSelected] = useState<FormulaKey>('normal');
  const [copied, setCopied] = useState(false);
  const { toast } = useToast();

  const formula = formulas[selected];

  const result = useMemo(() => ({
    gypsum: Math.round(weight * formula.gypsum),
    water: Math.round(weight * formula.water),
    titanium: Math.round(weight * formula.titanium),
  }), [weight, formula]);

  const handleCopy = () => {
    const text = `Рецепт смеси Фрипласт (${formula.label})\nОбщий вес: ${weight} г\n\nФрипласт Аква: ${result.gypsum} г\nВода: ${result.water} г\nДиоксид титана: ${result.titanium} г`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    toast({ title: 'Скопировано!', description: 'Рецепт скопирован в буфер обмена' });
    setTimeout(() => setCopied(false), 2000);
  };

  const handleReset = () => {
    setWeight(1000);
    setSelected('normal');
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="pt-28 pb-20">
        <div className="container mx-auto px-4 max-w-3xl">
          {/* Title */}
          <div className="text-center mb-10">
            <div className="inline-flex items-center gap-2 mb-3">
              <FlaskConical className="w-6 h-6 text-ocean-primary" />
              <span className="text-sm uppercase tracking-widest text-ocean-secondary font-medium">Инструмент</span>
            </div>
            <h1 className="font-serif text-3xl md:text-4xl font-semibold text-foreground mb-2">
              Калькулятор смеси Фрипласт
            </h1>
            <p className="text-muted-foreground text-sm max-w-md mx-auto">
              Рассчитайте точные пропорции компонентов для идеального результата
            </p>
          </div>

          {/* Weight input */}
          <Card className="p-6 mb-6 glass border-ocean-accent/20">
            <label className="block text-sm font-medium text-foreground mb-2">
              Общий вес смеси (граммы)
            </label>
            <Input
              type="number"
              min={1}
              value={weight}
              onChange={(e) => setWeight(Math.max(1, Number(e.target.value)))}
              className="text-lg font-medium max-w-xs"
            />
          </Card>

          {/* Formula selector */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-8">
            {(Object.keys(formulas) as FormulaKey[]).map((key) => {
              const f = formulas[key];
              const isActive = selected === key;
              return (
                <button
                  key={key}
                  onClick={() => setSelected(key)}
                  className={cn(
                    "rounded-xl p-4 text-left transition-all duration-300 border-2",
                    isActive
                      ? "border-ocean-primary bg-ocean-primary/10 shadow-lg shadow-ocean-primary/10"
                      : "border-border bg-card hover:border-ocean-accent/40"
                  )}
                >
                  <div className={cn(
                    "text-sm font-semibold mb-1",
                    isActive ? "text-ocean-primary" : "text-foreground"
                  )}>
                    {f.label}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    Гипс {f.gypsum * 100}% · Вода {f.water * 100}% · TiO₂ {f.titanium * 100}%
                  </div>
                </button>
              );
            })}
          </div>

          {/* Results */}
          <Card className="p-6 mb-6 glass border-ocean-accent/20">
            <h2 className="font-serif text-lg font-semibold text-foreground mb-4">Состав смеси</h2>
            <div className="space-y-3">
              {[
                { label: 'Фрипласт Аква', value: result.gypsum },
                { label: 'Вода', value: result.water },
                { label: 'Диоксид титана', value: result.titanium },
              ].map((item) => (
                <div key={item.label} className="flex items-center justify-between py-2 border-b border-border/50 last:border-0">
                  <span className="text-sm text-muted-foreground">{item.label}</span>
                  <span className="text-lg font-semibold text-foreground">{item.value} г</span>
                </div>
              ))}
            </div>
            <div className="flex gap-3 mt-5">
              <Button variant="outline" size="sm" onClick={handleCopy} className="gap-2">
                {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                {copied ? 'Скопировано' : 'Скопировать рецепт'}
              </Button>
              <Button variant="ghost" size="sm" onClick={handleReset} className="gap-2 text-muted-foreground">
                <RotateCcw className="w-4 h-4" />
                Сбросить
              </Button>
            </div>
          </Card>

          {/* Pros & Cons */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Card className="p-5 border-green-500/20 bg-green-500/5">
              <h3 className="text-sm font-semibold text-green-600 dark:text-green-400 mb-3">Плюсы</h3>
              <ul className="space-y-2">
                {formula.pros.map((p) => (
                  <li key={p} className="flex items-start gap-2 text-sm text-foreground/80">
                    <span className="text-green-500 mt-0.5">✓</span>
                    {p}
                  </li>
                ))}
              </ul>
            </Card>
            <Card className="p-5 border-red-500/20 bg-red-500/5">
              <h3 className="text-sm font-semibold text-red-600 dark:text-red-400 mb-3">Минусы</h3>
              <ul className="space-y-2">
                {formula.cons.map((c) => (
                  <li key={c} className="flex items-start gap-2 text-sm text-foreground/80">
                    <span className="text-red-500 mt-0.5">✗</span>
                    {c}
                  </li>
                ))}
              </ul>
            </Card>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Calculator;
