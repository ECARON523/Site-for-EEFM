import React, { useState, useRef, useEffect } from 'react';
import { Send, Loader2, Sparkles, Utensils, Clock, Flame, Save, CheckCircle2 } from 'lucide-react';
import { GoogleGenAI, Type } from '@google/genai';
import { cn } from '../lib/utils';
import { useAuthStore } from '../store/useAuthStore';
import { useRecipeStore } from '../store/useRecipeStore';
import { Link } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';
import { Recipe } from '../types';

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

const SUGGESTIONS = [
  "Посоветуй десерт без глютена",
  "Хочу что-то быстрое на ужин",
  "Подбери несколько рецептов для полезного завтрака"
];

const BOT_RESPONSES = [
  "Конечно! Вот отличный вариант для вас.",
  "С удовольствием помогу подобрать что-нибудь вкусненькое.",
  "Отличный выбор! Сейчас посмотрю, что у нас есть.",
  "О, это одна из моих любимых категорий. Вот что я нашел:",
  "Секундочку, подбираю лучшие рецепты специально для вас.",
  "У нас как раз есть несколько потрясающих блюд на этот случай.",
  "Прекрасная идея! Давайте посмотрим на эти варианты.",
  "Я проанализировал нашу базу рецептов и вот мои рекомендации:",
  "Это будет очень вкусно! Обратите внимание на эти рецепты:",
  "Всегда рад помочь с выбором блюда. Вот что я предлагаю:"
];

export default function AIAssistantPage() {
  const { currentUser } = useAuthStore();
  const { recipes, addRecipe } = useRecipeStore();
  const [messages, setMessages] = useState<{ 
    role: 'user' | 'model'; 
    text: string; 
    recipes?: string[];
    generatedRecipe?: Partial<Recipe>;
    isSaved?: boolean;
  }[]>([
    { role: 'model', text: 'Привет, я — умный помощник CIVS.' },
    { role: 'model', text: 'Спроси меня о технике приготовления, специфике кухонь мира или просто как приготовить что-то определенное.' }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const chatContainerRef = useRef<HTMLDivElement>(null);

  // Persistence logic
  const STORAGE_KEY = 'civs_ai_chat_history';
  const EXPIRY_TIME = 10 * 60 * 1000; // 10 minutes

  useEffect(() => {
    const savedData = localStorage.getItem(STORAGE_KEY);
    if (savedData) {
      try {
        const { messages: savedMessages, timestamp, userId } = JSON.parse(savedData);
        const isExpired = Date.now() - timestamp > EXPIRY_TIME;
        const isSameUser = userId === currentUser?.id;

        if (!isExpired && isSameUser) {
          setMessages(savedMessages);
        } else {
          localStorage.removeItem(STORAGE_KEY);
        }
      } catch (e) {
        console.error('Failed to parse saved chat history', e);
        localStorage.removeItem(STORAGE_KEY);
      }
    }
  }, [currentUser?.id]);

  useEffect(() => {
    if (messages.length > 2) { // Don't save initial greeting only
      const dataToSave = {
        messages,
        timestamp: Date.now(),
        userId: currentUser?.id
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(dataToSave));
    }
  }, [messages, currentUser?.id]);

  const scrollToBottom = () => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async (text?: string) => {
    const userMessage = text || input.trim();
    if (!userMessage || isLoading) return;

    if (!text) setInput('');
    setMessages(prev => [...prev, { role: 'user', text: userMessage }]);
    setIsLoading(true);

    try {
      const isGenerationRequest = userMessage.toLowerCase().includes('придумай') || 
                                 userMessage.toLowerCase().includes('создай') || 
                                 userMessage.toLowerCase().includes('рецепт из');

      if (isGenerationRequest) {
        const response = await ai.models.generateContent({
          model: 'gemini-3-flash-preview',
          config: {
            responseMimeType: 'application/json',
            responseSchema: {
              type: Type.OBJECT,
              properties: {
                title: { type: Type.STRING },
                description: { type: Type.STRING },
                category: { type: Type.STRING },
                prepTime: { type: Type.NUMBER },
                cookTime: { type: Type.NUMBER },
                difficulty: { type: Type.NUMBER },
                portions: { type: Type.NUMBER },
                ingredients: {
                  type: Type.ARRAY,
                  items: {
                    type: Type.OBJECT,
                    properties: {
                      name: { type: Type.STRING },
                      amount: { type: Type.NUMBER },
                      unit: { type: Type.STRING }
                    },
                    required: ['name', 'amount', 'unit']
                  }
                },
                steps: {
                  type: Type.ARRAY,
                  items: {
                    type: Type.OBJECT,
                    properties: {
                      order: { type: Type.NUMBER },
                      description: { type: Type.STRING }
                    },
                    required: ['order', 'description']
                  }
                }
              },
              required: ['title', 'description', 'category', 'prepTime', 'cookTime', 'difficulty', 'portions', 'ingredients', 'steps']
            }
          },
          contents: [{ role: 'user', parts: [{ text: `Создай подробный кулинарный рецепт на основе запроса: "${userMessage}". Отвечай строго в формате JSON.` }] }]
        });

        const generatedData = JSON.parse(response.text);
        setMessages(prev => [...prev, { 
          role: 'model', 
          text: `Я придумал для вас новый рецепт: **${generatedData.title}**! Вы можете сохранить его в свой профиль.`,
          generatedRecipe: generatedData 
        }]);
      } else {
        // Prepare recipe context
        const recipeContext = recipes.map(r => ({
          id: r.id,
          title: r.title,
          category: r.category,
          calories: r.nutritionalInfo.calories,
          fat: r.nutritionalInfo.fat,
          description: r.description
        }));

        const model = ai.models.generateContent({
          model: 'gemini-3-flash-preview',
          config: {
            systemInstruction: `Ты — умный помощник CIVS, эксперт по кулинарии. 
            Твоя задача — помогать пользователям подбирать рецепты из нашей базы.
            Вот список доступных рецептов: ${JSON.stringify(recipeContext)}.
            
            Правила оформления ответа:
            1. Используй Markdown для форматирования.
            2. Названия блюд ВСЕГДА выделяй жирным шрифтом, например: **Борщ классический**.
            3. Каждое новое блюдо должно начинаться с НОВОЙ СТРОКИ. Не пиши текст сплошным блоком.
            4. После названия блюда через тире напиши краткое описание или "рассказ" о нем, начиная с заглавной буквы.
            5. Если пользователь просит подобрать блюда (например, "мало жира", "быстрый ужин", "завтрак"), выбери минимум 5 подходящих рецептов из списка.
            6. Для каждого предложенного рецепта ОБЯЗАТЕЛЬНО укажи его ID в конце описания в формате [ID: rX].
            7. Отвечай на русском языке, дружелюбно и профессионально.
            8. Если пользователь нажал на одну из кнопок-подсказок, начни ответ с одной из этих фраз: ${BOT_RESPONSES.join(', ')}.`,
          },
          contents: [
            ...messages.map(m => ({ role: m.role, parts: [{ text: m.text }] })),
            { role: 'user', parts: [{ text: userMessage }] }
          ]
        });

        const response = await model;
        const responseText = response.text || 'Извините, я не смог найти ответ.';
        
        // Extract recipe IDs from response
        const recipeIds = responseText.match(/\[ID: (r\d+)\]/g)?.map(id => id.replace('[ID: ', '').replace(']', '')) || [];
        const cleanText = responseText.replace(/\[ID: r\d+\]/g, '').trim();

        setMessages(prev => [...prev, { role: 'model', text: cleanText, recipes: recipeIds }]);
      }
    } catch (error) {
      console.error('AI Error:', error);
      setMessages(prev => [...prev, { role: 'model', text: 'Произошла ошибка при обращении к ИИ. Попробуйте позже.' }]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSaveGenerated = async (msgIdx: number) => {
    const msg = messages[msgIdx];
    if (!msg.generatedRecipe || !currentUser) return;

    try {
      await addRecipe({
        ...msg.generatedRecipe as Omit<Recipe, 'id' | 'views' | 'createdAt' | 'status'>,
        imageUrl: 'https://images.unsplash.com/photo-1495521821757-a1efb6729352?w=800&h=600&fit=crop',
        nutritionalInfo: { calories: 0, protein: 0, fat: 0, carbs: 0 },
        authorId: currentUser.id,
      });
      
      setMessages(prev => prev.map((m, i) => i === msgIdx ? { ...m, isSaved: true } : m));
    } catch (err) {
      console.error("Failed to save AI recipe:", err);
    }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-6rem)] sm:h-[calc(100vh-8rem)] bg-bg-surface rounded-3xl overflow-hidden border border-border-color relative">
      {/* Background Pattern (Telegram-style) */}
      <div 
        className="absolute inset-0 opacity-[0.03] pointer-events-none"
        style={{
          backgroundImage: `url("https://www.transparenttextures.com/patterns/food.png")`,
          backgroundRepeat: 'repeat'
        }}
      />

      {/* Header Info */}
      {/* Removed rules info as requested */}

      {/* Messages Area */}
      <div ref={chatContainerRef} className="flex-1 overflow-y-auto p-6 space-y-6 z-10 scrollbar-hide">
            {messages.map((msg, idx) => (
          <div key={idx} className={cn("flex flex-col", msg.role === 'user' ? "items-end" : "items-start")}>
            <div className={cn(
              "max-w-[80%] rounded-2xl px-5 py-3 text-[15px] shadow-sm relative",
              msg.role === 'user' 
                ? "bg-primary text-black rounded-tr-none" 
                : "bg-bg-surface-light text-text-primary rounded-tl-none"
            )}>
              <div className={cn(
                "prose prose-sm max-w-none prose-p:leading-relaxed",
                msg.role === 'model' ? "prose-strong:text-primary dark:prose-invert" : "prose-strong:text-black"
              )}>
                <ReactMarkdown>{msg.text}</ReactMarkdown>
              </div>
              
              {/* Generated Recipe */}
              {msg.generatedRecipe && (
                <div className="mt-4 bg-black/5 dark:bg-black/20 rounded-xl p-4 border border-border-color">
                  <h4 className={cn("font-black text-lg mb-2", msg.role === 'user' ? "text-black" : "text-text-primary")}>{msg.generatedRecipe.title}</h4>
                  <p className={cn("text-sm mb-4", msg.role === 'user' ? "text-black/70" : "text-text-muted")}>{msg.generatedRecipe.description}</p>
                  
                  <div className={cn("flex gap-4 mb-4 text-xs font-bold uppercase tracking-wider", msg.role === 'user' ? "text-black/60" : "text-text-muted")}>
                    <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {msg.generatedRecipe.prepTime! + msg.generatedRecipe.cookTime!} мин</span>
                    <span className="flex items-center gap-1"><Flame className="w-3 h-3" /> {msg.generatedRecipe.difficulty}/5</span>
                  </div>

                  <div className="space-y-2 mb-4">
                    <h5 className={cn("font-bold text-xs uppercase", msg.role === 'user' ? "text-black/60" : "text-text-muted")}>Ингредиенты:</h5>
                    <ul className="text-sm space-y-1">
                      {msg.generatedRecipe.ingredients?.map((ing: { name: string; amount: number; unit: string }, i: number) => (
                        <li key={i} className={cn("flex justify-between border-b pb-1", msg.role === 'user' ? "border-black/10 text-black/80" : "border-border-color text-text-primary")}>
                          <span>{ing.name}</span>
                          <span className="font-bold">{ing.amount} {ing.unit}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {currentUser && (
                    <button 
                      onClick={() => handleSaveGenerated(idx)}
                      disabled={msg.isSaved}
                      className={cn(
                        "w-full py-2 rounded-lg font-bold flex items-center justify-center gap-2 transition-all",
                        msg.isSaved 
                          ? "bg-green-900/30 text-green-600 dark:text-green-400" 
                          : msg.role === 'user' ? "bg-black text-primary hover:bg-black/80" : "bg-primary text-black hover:bg-primary-hover"
                      )}
                    >
                      {msg.isSaved ? (
                        <><CheckCircle2 className="w-4 h-4" /> Сохранено</>
                      ) : (
                        <><Save className="w-4 h-4" /> Сохранить в профиль</>
                      )}
                    </button>
                  )}
                </div>
              )}

              {/* Recipe Suggestions */}
              {msg.recipes && msg.recipes.length > 0 && (
                <div className="mt-4 grid grid-cols-1 gap-3">
                  {msg.recipes.map(id => {
                    const recipe = recipes.find(r => r.id === id);
                    if (!recipe) return null;
                    return (
                      <Link 
                        key={id}
                        to={`/recipe/${id}`}
                        className="flex items-center gap-3 p-2 bg-bg-surface rounded-xl hover:bg-bg-surface-light transition-colors border border-border-color group"
                      >
                        <img src={recipe.imageUrl} alt={recipe.title} className="w-12 h-12 rounded-lg object-cover" />
                        <div className="flex-1 min-w-0">
                          <h5 className="font-bold text-sm truncate group-hover:text-primary transition-colors text-text-primary">{recipe.title}</h5>
                          <div className="flex items-center gap-3 text-[10px] text-text-muted">
                            <span className="flex items-center gap-1"><Flame className="w-3 h-3" /> {recipe.nutritionalInfo.calories} ккал</span>
                            <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {recipe.cookTime} мин</span>
                          </div>
                        </div>
                      </Link>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        ))}
        
        {/* Suggestion Buttons */}
        {messages.length === 2 && !isLoading && (
          <div className="flex flex-col items-end gap-3 mt-4">
            {SUGGESTIONS.map((suggestion, idx) => (
              <button
                key={idx}
                onClick={() => handleSend(suggestion)}
                className="bg-bg-surface-light border border-border-color rounded-2xl px-6 py-3 text-[15px] text-text-primary hover:bg-border-color transition-all shadow-sm hover:shadow-md active:scale-95 cursor-pointer border-b-2 hover:border-b-primary"
              >
                {suggestion}
              </button>
            ))}
          </div>
        )}

        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-bg-surface-light rounded-2xl rounded-tl-none px-5 py-3 shadow-sm flex items-center gap-2">
              <Loader2 className="w-4 h-4 animate-spin text-primary" />
              <span className="text-sm text-primary">Печатает...</span>
            </div>
          </div>
        )}
      </div>

      {/* Input Area */}
      <div className="p-6 bg-bg-surface border-t border-border-color z-10">
        <div className="max-w-4xl mx-auto relative flex items-center gap-4">
          <button className="p-2 text-text-muted hover:text-text-primary transition-colors">
            <Sparkles className="w-6 h-6" />
          </button>
          <div className="flex-1 bg-bg-surface-light rounded-full px-6 py-3 flex items-center gap-3">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
              placeholder="Что хотите приготовить?"
              className="flex-1 bg-transparent outline-none text-[15px] text-text-primary"
              disabled={isLoading}
            />
            <button 
              onClick={() => handleSend()}
              disabled={!input.trim() || isLoading}
              className={cn(
                "transition-all",
                input.trim() ? "text-primary scale-110" : "text-text-muted"
              )}
            >
              <Send className="w-6 h-6" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
