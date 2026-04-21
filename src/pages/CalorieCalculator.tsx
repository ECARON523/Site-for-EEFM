import React, { useState, useEffect } from 'react';
import { Info, Calculator, ChevronRight, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';
import { cn } from '../lib/utils';
import { useRecipeStore } from '../store/useRecipeStore';
import { useUserStore } from '../store/useUserStore';
import RecipeCard from '../components/RecipeCard';

type Gender = 'woman' | 'man';
type Goal = 'lose' | 'maintain' | 'gain';
type Formula = 'mifflin' | 'harris';

const ACTIVITY_LEVELS = [
  { value: 1.2, label: 'Низкая', description: 'Хожу в магазин или недолго прогуливаюсь' },
  { value: 1.375, label: 'Малая', description: 'Легкие тренировки 1-3 раза в неделю' },
  { value: 1.55, label: 'Средняя', description: 'Умеренные тренировки 3-5 раз в неделю' },
  { value: 1.725, label: 'Высокая', description: 'Тяжелые тренировки 6-7 раз в неделю' },
  { value: 1.9, label: 'Очень высокая', description: 'Очень тяжелые тренировки или физическая работа' },
];

export default function CalorieCalculator() {
  const { recipes } = useRecipeStore();
  const { users } = useUserStore();
  const [gender, setGender] = useState<Gender>('woman');
  const [age, setAge] = useState<string>('');
  const [height, setHeight] = useState<string>('');
  const [weight, setWeight] = useState<string>('');
  const [activity, setActivity] = useState(1.2);
  const [goal, setGoal] = useState<Goal>('maintain');
  const [formula, setFormula] = useState<Formula>('harris');
  const [results, setResults] = useState<{
    calories: number;
    protein: number;
    fat: number;
    carbs: number;
    bmi: number;
  } | null>(null);

  const calculate = () => {
    const w = parseFloat(weight);
    const h = parseFloat(height);
    const a = parseFloat(age);

    if (!w || !h || !a || w <= 0 || h <= 0 || a <= 0) return;

    let bmr = 0;
    if (formula === 'mifflin') {
      if (gender === 'man') {
        bmr = (10 * w) + (6.25 * h) - (5 * a) + 5;
      } else {
        bmr = (10 * w) + (6.25 * h) - (5 * a) - 161;
      }
    } else {
      if (gender === 'man') {
        bmr = 66.5 + (13.75 * w) + (5.003 * h) - (6.75 * a);
      } else {
        bmr = 655.1 + (9.563 * w) + (1.850 * h) - (4.676 * a);
      }
    }

    let tdee = bmr * activity;

    if (goal === 'lose') tdee *= 0.8;
    if (goal === 'gain') tdee *= 1.2;

    const calories = Math.round(tdee);
    const protein = Math.round((calories * 0.3) / 4);
    const fat = Math.round((calories * 0.3) / 9);
    const carbs = Math.round((calories * 0.4) / 4);
    const bmi = parseFloat((w / Math.pow(h / 100, 2)).toFixed(1));

    setResults({ calories, protein, fat, carbs, bmi });
  };

  const getBMICategory = (bmi: number) => {
    if (bmi < 18.5) return { label: 'Дефицит', color: 'text-blue-500', position: 'left-0' };
    if (bmi < 25) return { label: 'Норма', color: 'text-green-500', position: 'left-1/2 -translate-x-1/2' };
    return { label: 'Избыток', color: 'text-red-500', position: 'right-0' };
  };

  const bmiInfo = results ? getBMICategory(results.bmi) : null;

  return (
    <div className="max-w-3xl mx-auto py-8 px-4">
      <div className="flex items-center gap-2 text-sm text-text-muted mb-4">
        <Calculator className="w-4 h-4" />
        <span>Калькулятор калорий</span>
      </div>

      <h1 className="text-3xl font-bold mb-4 text-text-primary">Калькулятор калорий</h1>
      <p className="text-text-muted mb-8">
        Рассчитайте сколько калорий, белков, жиров и углеводов вам нужно потреблять ежедневно для поддержания веса, похудения или набора массы.
      </p>

      <div className="space-y-8">
        {/* Gender */}
        <section>
          <h3 className="flex items-center gap-2 font-bold mb-4 text-text-primary">
            <span className="w-2 h-2 bg-yellow-400 rounded-full" />
            Общая информация:
          </h3>
          <div className="grid grid-cols-2 gap-4 mb-4">
            <button
              onClick={() => setGender('woman')}
              className={cn(
                "py-3 px-6 rounded-xl border-2 transition-all text-left",
                gender === 'woman' ? "border-primary bg-primary/10 text-primary" : "border-border-color bg-bg-surface-light text-text-muted hover:border-text-muted"
              )}
            >
              Женщина
            </button>
            <button
              onClick={() => setGender('man')}
              className={cn(
                "py-3 px-6 rounded-xl border-2 transition-all text-left",
                gender === 'man' ? "border-primary bg-primary/10 text-primary" : "border-border-color bg-bg-surface-light text-text-muted hover:border-text-muted"
              )}
            >
              Мужчина
            </button>
          </div>
          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block text-xs text-text-muted mb-1">Возраст, лет</label>
              <input
                type="number"
                value={age}
                onChange={(e) => setAge(e.target.value)}
                className="w-full p-3 rounded-xl border border-border-color bg-bg-surface-light text-text-primary focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
            <div>
              <label className="block text-xs text-text-muted mb-1">Рост, см</label>
              <input
                type="number"
                value={height}
                onChange={(e) => setHeight(e.target.value)}
                className="w-full p-3 rounded-xl border border-border-color bg-bg-surface-light text-text-primary focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
            <div>
              <label className="block text-xs text-text-muted mb-1">Вес, кг</label>
              <input
                type="number"
                value={weight}
                onChange={(e) => setWeight(e.target.value)}
                className="w-full p-3 rounded-xl border border-border-color bg-bg-surface-light text-text-primary focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
          </div>
        </section>

        {/* Activity */}
        <section>
          <h3 className="flex items-center gap-2 font-bold mb-4 text-text-primary">
            <span className="w-2 h-2 bg-yellow-400 rounded-full" />
            Дневная активность:
          </h3>
          <div className="relative pt-6 pb-2">
            <input
              type="range"
              min="0"
              max="4"
              step="1"
              value={ACTIVITY_LEVELS.findIndex(a => a.value === activity)}
              onChange={(e) => setActivity(ACTIVITY_LEVELS[parseInt(e.target.value)].value)}
              className="custom-range"
            />
            <div className="flex justify-between mt-4">
              {ACTIVITY_LEVELS.map((_, i) => (
                <div key={i} className="flex flex-col items-center">
                  <div className="w-1 h-1 bg-border-color rounded-full mb-1" />
                </div>
              ))}
            </div>
          </div>
          <div className="mt-4">
            <p className="font-bold text-text-primary">{ACTIVITY_LEVELS.find(a => a.value === activity)?.label}</p>
            <p className="text-sm text-text-muted">{ACTIVITY_LEVELS.find(a => a.value === activity)?.description}</p>
          </div>
        </section>

        {/* Goal */}
        <section>
          <h3 className="flex items-center gap-2 font-bold mb-4 text-text-primary">
            <span className="w-2 h-2 bg-yellow-400 rounded-full" />
            Ваша цель:
          </h3>
          <div className="grid grid-cols-3 gap-4">
            {[
              { id: 'lose', label: 'Сбросить вес' },
              { id: 'maintain', label: 'Поддерживать вес' },
              { id: 'gain', label: 'Набрать вес' },
            ].map((g) => (
              <button
                key={g.id}
                onClick={() => setGoal(g.id as Goal)}
                className={cn(
                  "py-3 px-4 rounded-xl border-2 transition-all text-center text-sm",
                  goal === g.id ? "border-primary bg-primary/10 text-primary" : "border-border-color bg-bg-surface-light text-text-muted hover:border-text-muted"
                )}
              >
                {g.label}
              </button>
            ))}
          </div>
        </section>

        {/* Formula */}
        <section>
          <h3 className="flex items-center gap-2 font-bold mb-4 text-text-primary">
            <span className="w-2 h-2 bg-yellow-400 rounded-full" />
            Формула расчета: <Info className="w-4 h-4 text-text-muted cursor-help" />
          </h3>
          <div className="grid grid-cols-2 gap-4">
            <button
              onClick={() => setFormula('harris')}
              className={cn(
                "py-3 px-4 rounded-xl border-2 transition-all text-left text-sm",
                formula === 'harris' ? "border-primary bg-primary/10 text-primary" : "border-border-color bg-bg-surface-light text-text-muted hover:border-text-muted"
              )}
            >
              Харриса-Бенедикта
            </button>
            <button
              onClick={() => setFormula('mifflin')}
              className={cn(
                "py-3 px-4 rounded-xl border-2 transition-all text-left text-sm",
                formula === 'mifflin' ? "border-primary bg-primary/10 text-primary" : "border-border-color bg-bg-surface-light text-text-muted hover:border-text-muted"
              )}
            >
              Миффлина-Сан Жеора
            </button>
          </div>
        </section>

        <button
          onClick={calculate}
          className="w-full py-4 bg-primary hover:bg-yellow-500 text-black rounded-2xl font-bold flex items-center justify-center gap-2 transition-colors"
        >
          <Calculator className="w-5 h-5" />
          {results ? 'РАССЧИТАТЬ ЕЩЕ РАЗ' : 'РАССЧИТАТЬ'}
        </button>

        {/* Results */}
        {results && (
          <div className="space-y-8 mt-12 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <h2 className="text-2xl font-bold text-text-primary">Ваш результат</h2>
            
            {/* BMI */}
            <div className="bg-bg-surface p-6 rounded-3xl border border-border-color shadow-sm">
              <div className="flex items-center justify-between mb-6">
                <h4 className="font-bold text-text-primary">Ваш индекс массы тела</h4>
                <Info className="w-4 h-4 text-text-muted" />
              </div>
              <div className="text-center mb-8">
                <span className="text-4xl font-bold text-text-primary">{results.bmi}</span>
              </div>
              <div className="relative h-2 bg-gradient-to-r from-blue-400 via-green-400 to-red-400 rounded-full mb-6">
                <div 
                  className="absolute top-1/2 -translate-y-1/2 w-4 h-4 bg-white border-2 border-border-color rounded-full transition-all duration-1000"
                  style={{ left: `${Math.min(Math.max((results.bmi - 15) * 4, 0), 100)}%` }}
                />
              </div>
              <div className="flex justify-between text-xs text-text-muted">
                <span>Дефицит</span>
                <span>Норма</span>
                <span>Избыток</span>
              </div>
            </div>

            {/* Daily Calories */}
            <div className="bg-bg-surface p-6 rounded-3xl border border-border-color shadow-sm">
              <div className="flex items-center justify-between mb-6">
                <h4 className="font-bold text-text-primary">Ваша суточная норма калорий</h4>
                <Info className="w-4 h-4 text-text-muted" />
              </div>
              
              <div className="flex flex-col md:flex-row items-center gap-8">
                <div className="relative w-32 h-32">
                  <svg className="w-full h-full transform -rotate-90">
                    <circle
                      cx="64"
                      cy="64"
                      r="58"
                      stroke="currentColor"
                      strokeWidth="8"
                      fill="transparent"
                      className="text-border-color"
                    />
                    <circle
                      cx="64"
                      cy="64"
                      r="58"
                      stroke="currentColor"
                      strokeWidth="8"
                      fill="transparent"
                      strokeDasharray={364.4}
                      strokeDashoffset={0}
                      className="text-purple-500"
                    />
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-24 h-24 bg-bg-surface-light rounded-full flex items-center justify-center shadow-inner" />
                  </div>
                </div>

                <div className="flex-1">
                  <div className="text-3xl font-bold mb-4 text-text-primary">
                    {results.calories.toLocaleString()} кКал*
                  </div>
                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <div className="flex items-center gap-1.5 mb-1">
                        <div className="w-2 h-2 rounded-full bg-yellow-400" />
                        <span className="text-sm font-bold text-text-primary">{results.protein} г</span>
                      </div>
                      <span className="text-xs text-text-muted">Белки</span>
                    </div>
                    <div>
                      <div className="flex items-center gap-1.5 mb-1">
                        <div className="w-2 h-2 rounded-full bg-pink-400" />
                        <span className="text-sm font-bold text-text-primary">{results.fat} г</span>
                      </div>
                      <span className="text-xs text-text-muted">Жиры</span>
                    </div>
                    <div>
                      <div className="flex items-center gap-1.5 mb-1">
                        <div className="w-2 h-2 rounded-full bg-purple-400" />
                        <span className="text-sm font-bold text-text-primary">{results.carbs} г</span>
                      </div>
                      <span className="text-xs text-text-muted">Углеводы</span>
                    </div>
                  </div>
                </div>
              </div>
              
              <p className="mt-6 text-[10px] text-text-muted leading-relaxed">
                * Данные результаты являются рекомендацией, для более точных результатов обратитесь к специалистам.
              </p>
            </div>

            {/* For You Section */}
            <section className="mt-12">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-2xl font-bold flex items-center gap-2 text-text-primary">
                  <Sparkles className="w-6 h-6 text-yellow-500" />
                  Для вас
                </h3>
                <p className="text-sm text-text-muted">Рецепты, подходящие под ваш рацион</p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {recipes
                  .filter(r => {
                    if (goal === 'lose') return r.nutritionalInfo.calories < 400;
                    if (goal === 'gain') return r.nutritionalInfo.calories > 600;
                    return r.nutritionalInfo.calories >= 400 && r.nutritionalInfo.calories <= 600;
                  })
                  .slice(0, 4)
                  .map(recipe => {
                    const author = users.find(u => u.id === recipe.authorId) || users[0];
                    return <RecipeCard key={recipe.id} recipe={recipe} author={author} />;
                  })
                }
              </div>
            </section>

            {/* Banner */}
            <div className="relative overflow-hidden rounded-3xl bg-bg-surface-light p-8 flex items-center justify-between border border-border-color">
              <div className="relative z-10 max-w-[60%]">
                <h4 className="text-xl font-bold mb-4 text-text-primary">Готовый план с проверенными рецептами на каждый день</h4>
                <Link 
                  to="/services/weekly-menu"
                  className="inline-block bg-primary text-black px-8 py-2.5 rounded-xl font-bold text-sm hover:bg-yellow-500 transition-colors"
                >
                  ПОСМОТРЕТЬ
                </Link>
              </div>
              <img 
                src="https://images.unsplash.com/photo-1547592166-23ac45744acd?w=400&h=400&fit=crop" 
                alt="Healthy food"
                className="absolute right-0 top-0 h-full w-1/3 object-cover opacity-10 md:opacity-30"
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
