const fs = require('fs');

const recipesData = [
  { title: 'Борщ классический', cat: 'Суп', img: 'https://images.unsplash.com/photo-1547592166-23ac45744acd?w=800&h=600&fit=crop' },
  { title: 'Пельмени домашние', cat: 'Обед', img: 'https://images.unsplash.com/photo-1590987363158-9122cc720b02?w=800&h=600&fit=crop' },
  { title: 'Блины тонкие', cat: 'Завтрак', img: 'https://images.unsplash.com/photo-1519671482749-fd09be7ccebf?w=800&h=600&fit=crop' },
  { title: 'Салат Оливье', cat: 'Закуски', img: 'https://images.unsplash.com/photo-1556761223-4c4282c73f77?w=800&h=600&fit=crop' },
  { title: 'Селедка под шубой', cat: 'Закуски', img: 'https://images.unsplash.com/photo-1628294895950-9805252327bc?w=800&h=600&fit=crop' },
  { title: 'Котлеты по-киевски', cat: 'Обед', img: 'https://images.unsplash.com/photo-1604908176997-125f25cc6f3d?w=800&h=600&fit=crop' },
  { title: 'Бефстроганов', cat: 'Ужин', img: 'https://images.unsplash.com/photo-1588168333986-5078d3ae3976?w=800&h=600&fit=crop' },
  { title: 'Щи из свежей капусты', cat: 'Суп', img: 'https://images.unsplash.com/photo-1547592180-85f173990554?w=800&h=600&fit=crop' },
  { title: 'Солянка мясная', cat: 'Суп', img: 'https://images.unsplash.com/photo-1547592180-85f173990554?w=800&h=600&fit=crop' },
  { title: 'Уха из красной рыбы', cat: 'Суп', img: 'https://images.unsplash.com/photo-1604908176997-125f25cc6f3d?w=800&h=600&fit=crop' },
  { title: 'Плов узбекский', cat: 'Обед', img: 'https://images.unsplash.com/photo-1564834724105-918b73d1b9e0?w=800&h=600&fit=crop' },
  { title: 'Шашлык из свинины', cat: 'Ужин', img: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=800&h=600&fit=crop' },
  { title: 'Чебуреки с мясом', cat: 'Закуски', img: 'https://images.unsplash.com/photo-1628840042765-356cda07504e?w=800&h=600&fit=crop' },
  { title: 'Хачапури по-аджарски', cat: 'Закуски', img: 'https://images.unsplash.com/photo-1588315029754-2dd089d39a1a?w=800&h=600&fit=crop' },
  { title: 'Хинкали', cat: 'Обед', img: 'https://images.unsplash.com/photo-1564834724105-918b73d1b9e0?w=800&h=600&fit=crop' },
  { title: 'Цезарь с курицей', cat: 'Закуски', img: 'https://images.unsplash.com/photo-1550304943-4f24f54ddde9?w=800&h=600&fit=crop' },
  { title: 'Греческий салат', cat: 'Здоровая еда', img: 'https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?w=800&h=600&fit=crop' },
  { title: 'Паста Карбонара', cat: 'Ужин', img: 'https://images.unsplash.com/photo-1612874742237-6526221588e3?w=800&h=600&fit=crop' },
  { title: 'Пицца Маргарита', cat: 'Обед', img: 'https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=800&h=600&fit=crop' },
  { title: 'Ризотто с грибами', cat: 'Ужин', img: 'https://images.unsplash.com/photo-1633964913295-ceb43826e7cf?w=800&h=600&fit=crop' },
  { title: 'Лазанья', cat: 'Обед', img: 'https://images.unsplash.com/photo-1574894709920-11b28e7367e3?w=800&h=600&fit=crop' },
  { title: 'Тирамису', cat: 'Десерты', img: 'https://images.unsplash.com/photo-1571115177098-24ec42ed204d?w=800&h=600&fit=crop' },
  { title: 'Чизкейк Нью-Йорк', cat: 'Десерты', img: 'https://images.unsplash.com/photo-1533134242443-d4fd215305ad?w=800&h=600&fit=crop' },
  { title: 'Шарлотка с яблоками', cat: 'Десерты', img: 'https://images.unsplash.com/photo-1563729784474-d77dbb933a9e?w=800&h=600&fit=crop' },
  { title: 'Медовик', cat: 'Десерты', img: 'https://images.unsplash.com/photo-1587314168485-3236d6710814?w=800&h=600&fit=crop' },
  { title: 'Торт Наполеон', cat: 'Десерты', img: 'https://images.unsplash.com/photo-1551024601-bec78aea704b?w=800&h=600&fit=crop' },
  { title: 'Сырники из творога', cat: 'Блюда из творога', img: 'https://images.unsplash.com/photo-1511715112108-9cca6ca07266?w=800&h=600&fit=crop' },
  { title: 'Творожная запеканка', cat: 'Блюда из творога', img: 'https://images.unsplash.com/photo-1551024601-bec78aea704b?w=800&h=600&fit=crop' },
  { title: 'Омлет классический', cat: 'Завтрак', img: 'https://images.unsplash.com/photo-1510693062115-597b2803ba81?w=800&h=600&fit=crop' },
  { title: 'Яичница с беконом', cat: 'Завтрак', img: 'https://images.unsplash.com/photo-1525351484163-7529414344d8?w=800&h=600&fit=crop' },
  { title: 'Овсяная каша с ягодами', cat: 'Завтрак', img: 'https://images.unsplash.com/photo-1517673132405-a56a62b18caf?w=800&h=600&fit=crop' },
  { title: 'Гуляш из говядины', cat: 'Ужин', img: 'https://images.unsplash.com/photo-1547592180-85f173990554?w=800&h=600&fit=crop' },
  { title: 'Жаркое в горшочках', cat: 'Ужин', img: 'https://images.unsplash.com/photo-1604908176997-125f25cc6f3d?w=800&h=600&fit=crop' },
  { title: 'Куриный суп с лапшой', cat: 'Суп', img: 'https://images.unsplash.com/photo-1547592180-85f173990554?w=800&h=600&fit=crop' },
  { title: 'Гороховый суп с копченостями', cat: 'Суп', img: 'https://images.unsplash.com/photo-1547592180-85f173990554?w=800&h=600&fit=crop' },
  { title: 'Рассольник', cat: 'Суп', img: 'https://images.unsplash.com/photo-1547592180-85f173990554?w=800&h=600&fit=crop' },
  { title: 'Окрошка на квасе', cat: 'Суп', img: 'https://images.unsplash.com/photo-1547592180-85f173990554?w=800&h=600&fit=crop' },
  { title: 'Холодец домашний', cat: 'Закуски', img: 'https://images.unsplash.com/photo-1628294895950-9805252327bc?w=800&h=600&fit=crop' },
  { title: 'Винегрет', cat: 'Здоровая еда', img: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=800&h=600&fit=crop' },
  { title: 'Салат Мимоза', cat: 'Закуски', img: 'https://images.unsplash.com/photo-1556761223-4c4282c73f77?w=800&h=600&fit=crop' },
  { title: 'Крабовый салат', cat: 'Закуски', img: 'https://images.unsplash.com/photo-1556761223-4c4282c73f77?w=800&h=600&fit=crop' },
  { title: 'Салат Весенний', cat: 'Здоровая еда', img: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=800&h=600&fit=crop' },
  { title: 'Картофельное пюре', cat: 'Гарнир', img: 'https://images.unsplash.com/photo-1518977676601-b53f82aba655?w=800&h=600&fit=crop' },
  { title: 'Жареная картошка с грибами', cat: 'Ужин', img: 'https://images.unsplash.com/photo-1604908176997-125f25cc6f3d?w=800&h=600&fit=crop' },
  { title: 'Драники картофельные', cat: 'Завтрак', img: 'https://images.unsplash.com/photo-1511715112108-9cca6ca07266?w=800&h=600&fit=crop' },
  { title: 'Голубцы с мясом и рисом', cat: 'Ужин', img: 'https://images.unsplash.com/photo-1588168333986-5078d3ae3976?w=800&h=600&fit=crop' },
  { title: 'Фаршированные перцы', cat: 'Ужин', img: 'https://images.unsplash.com/photo-1588168333986-5078d3ae3976?w=800&h=600&fit=crop' },
  { title: 'Тефтели в томатном соусе', cat: 'Ужин', img: 'https://images.unsplash.com/photo-1529042410759-befb1204b468?w=800&h=600&fit=crop' },
  { title: 'Макароны по-флотски', cat: 'Обед', img: 'https://images.unsplash.com/photo-1612874742237-6526221588e3?w=800&h=600&fit=crop' },
  { title: 'Гречка с мясом', cat: 'Обед', img: 'https://images.unsplash.com/photo-1547592180-85f173990554?w=800&h=600&fit=crop' },
];

const ingredientsList = [
  { name: 'Куриное филе', unit: 'г', amount: 300, imageUrl: 'https://images.unsplash.com/photo-1604503468506-a8da13d82791?w=100&h=100&fit=crop' },
  { name: 'Помидоры', unit: 'шт', amount: 2, imageUrl: 'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?w=100&h=100&fit=crop' },
  { name: 'Огурцы', unit: 'шт', amount: 2, imageUrl: 'https://images.unsplash.com/photo-1604908176997-125f25cc6f3d?w=100&h=100&fit=crop' },
  { name: 'Картофель', unit: 'г', amount: 500, imageUrl: 'https://images.unsplash.com/photo-1518977676601-b53f82aba655?w=100&h=100&fit=crop' },
  { name: 'Сыр', unit: 'г', amount: 100, imageUrl: 'https://images.unsplash.com/photo-1486297678162-eb2a19b0a32d?w=100&h=100&fit=crop' },
  { name: 'Яйца', unit: 'шт', amount: 3, imageUrl: 'https://images.unsplash.com/photo-1587486913049-53fc88980cfc?w=100&h=100&fit=crop' },
  { name: 'Мука', unit: 'г', amount: 200, imageUrl: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=100&h=100&fit=crop' },
  { name: 'Молоко', unit: 'мл', amount: 200, imageUrl: 'https://images.unsplash.com/photo-1550583724-b2692b85b150?w=100&h=100&fit=crop' },
  { name: 'Масло сливочное', unit: 'г', amount: 50, imageUrl: 'https://images.unsplash.com/photo-1588195538326-c5b1e9f80a1b?w=100&h=100&fit=crop' },
  { name: 'Сахар', unit: 'г', amount: 100, imageUrl: 'https://images.unsplash.com/photo-1581428982868-e410dd147a90?w=100&h=100&fit=crop' },
  { name: 'Соль', unit: 'ч.л.', amount: 1, imageUrl: 'https://images.unsplash.com/photo-1628268909376-e8c4df39e2dc?w=100&h=100&fit=crop' },
  { name: 'Перец', unit: 'по вкусу', amount: 1, imageUrl: 'https://images.unsplash.com/photo-1596647907578-8d4885834272?w=100&h=100&fit=crop' },
  { name: 'Зелень', unit: 'пучок', amount: 1, imageUrl: 'https://images.unsplash.com/photo-1628268909376-e8c4df39e2dc?w=100&h=100&fit=crop' },
  { name: 'Чеснок', unit: 'зубчик', amount: 2, imageUrl: 'https://images.unsplash.com/photo-1540148426945-0441b8bf80d4?w=100&h=100&fit=crop' },
  { name: 'Лук', unit: 'шт', amount: 1, imageUrl: 'https://images.unsplash.com/photo-1618512496248-a07fe83aa8cb?w=100&h=100&fit=crop' },
  { name: 'Морковь', unit: 'шт', amount: 1, imageUrl: 'https://images.unsplash.com/photo-1598170845058-32b9d6a5da37?w=100&h=100&fit=crop' },
  { name: 'Свекла', unit: 'шт', amount: 1, imageUrl: 'https://images.unsplash.com/photo-1593280443077-ae46e0100ad1?w=100&h=100&fit=crop' },
  { name: 'Говядина', unit: 'г', amount: 400, imageUrl: 'https://images.unsplash.com/photo-1603048297172-c92544798d5e?w=100&h=100&fit=crop' },
  { name: 'Свинина', unit: 'г', amount: 400, imageUrl: 'https://images.unsplash.com/photo-1602491453631-e2a5ad90a131?w=100&h=100&fit=crop' },
  { name: 'Рыба', unit: 'г', amount: 300, imageUrl: 'https://images.unsplash.com/photo-1511269798133-f54c81cb5855?w=100&h=100&fit=crop' },
];

const stepImages = [
  'https://images.unsplash.com/photo-1556910103-1c02745aae4d?w=800&h=600&fit=crop',
  'https://images.unsplash.com/photo-1556911220-e15b29be8c8f?w=800&h=600&fit=crop',
  'https://images.unsplash.com/photo-1556910110-a5a63dfd3938?w=800&h=600&fit=crop',
  'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=800&h=600&fit=crop',
  'https://images.unsplash.com/photo-1556910096-6f5e72db6803?w=800&h=600&fit=crop'
];

let recipesOutput = `import { Recipe, User, RecipeCategory, RecipeStatus } from '../types';

export const MOCK_USERS: User[] = [
  { id: 'admin', name: 'Администратор', avatar: 'https://picsum.photos/seed/admin/100/100', role: 'admin', followersCount: 1000, followingIds: [] },
  { id: 'u1', name: 'Анна Синицына', avatar: 'https://picsum.photos/seed/anna/100/100', role: 'user', followersCount: 120, followingIds: [] },
  { id: 'u2', name: 'Юлия Зубкова', avatar: 'https://picsum.photos/seed/julia/100/100', role: 'user', followersCount: 45, followingIds: [] },
  { id: 'u3', name: 'Софья Глухова', avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop', role: 'user', followersCount: 300, followingIds: [], bio: 'кулинарный редактор CIVS' },
  { id: 'u4', name: 'Иван Петров', avatar: 'https://picsum.photos/seed/ivan/100/100', role: 'user', followersCount: 10, followingIds: [] },
  { id: 'u5', name: 'Мария Иванова', avatar: 'https://picsum.photos/seed/maria/100/100', role: 'user', followersCount: 500, followingIds: [] },
];

export const MOCK_RECIPES: Recipe[] = [
`;

recipesData.forEach((r, i) => {
  const author = `u${Math.floor(Math.random() * 5) + 1}`;
  const numIngredients = Math.floor(Math.random() * 5) + 4;
  const recipeIngredients = [];
  const usedIngs = new Set();
  
  for (let j = 0; j < numIngredients; j++) {
    let ing;
    do {
      ing = ingredientsList[Math.floor(Math.random() * ingredientsList.length)];
    } while (usedIngs.has(ing.name));
    usedIngs.add(ing.name);
    
    recipeIngredients.push({
      id: `ing_${i}_${j}`,
      name: ing.name,
      amount: ing.amount,
      unit: ing.unit,
      imageUrl: ing.imageUrl,
      category: 'Основные'
    });
  }

  const numSteps = Math.floor(Math.random() * 4) + 3; // 3 to 6 steps
  const recipeSteps = [];
  for (let k = 0; k < numSteps; k++) {
    recipeSteps.push({
      id: `step_${i}_${k}`,
      order: k + 1,
      description: `Шаг ${k + 1}. Подготовьте ингредиенты. Нарежьте все кубиками и обжарьте на сковороде до золотистой корочки. Добавьте специи по вкусу и тушите на медленном огне.`,
      imageUrl: stepImages[Math.floor(Math.random() * stepImages.length)]
    });
  }

  let status = 'approved';
  if (i > 40 && i <= 45) status = 'pending';
  if (i > 45) status = 'rejected';

  const recipeObj = {
    id: `r${i + 1}`,
    title: r.title,
    description: `Настоящий рецепт: ${r.title}. Очень вкусное и популярное блюдо, которое легко приготовить дома.`,
    imageUrl: r.img,
    category: r.cat,
    prepTime: Math.floor(Math.random() * 30) + 10,
    cookTime: Math.floor(Math.random() * 60) + 10,
    difficulty: Math.floor(Math.random() * 5) + 1,
    portions: Math.floor(Math.random() * 6) + 1,
    ingredients: recipeIngredients,
    steps: recipeSteps,
    nutritionalInfo: {
      calories: Math.floor(Math.random() * 500) + 100,
      protein: Math.floor(Math.random() * 30) + 5,
      fat: Math.floor(Math.random() * 30) + 5,
      carbs: Math.floor(Math.random() * 50) + 10,
    },
    authorId: author,
    status: status,
    views: Math.floor(Math.random() * 1000),
    createdAt: new Date(Date.now() - Math.random() * 10000000000).toISOString()
  };

  recipesOutput += `  ${JSON.stringify(recipeObj, null, 2).replace(/\n/g, '\n  ')},\n`;
});

recipesOutput += `];\n`;

fs.writeFileSync('src/data/mockData.ts', recipesOutput);
console.log('Successfully generated 50 real recipes in src/data/mockData.ts');
