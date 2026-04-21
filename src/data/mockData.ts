import { Recipe, User, RecipeCategory, RecipeStatus } from '../types';

export const MOCK_USERS: User[] = [
  { id: 'u6', name: 'Артём Попов', avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&h=100&fit=crop', role: 'admin', followersCount: 1000, followingIds: [] },
  { id: 'u1', name: 'Анна Синицына', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop', role: 'user', followersCount: 120, followingIds: [] },
  { id: 'u2', name: 'Юлия Зубкова', avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop', role: 'user', followersCount: 45, followingIds: [] },
  { id: 'u3', name: 'Софья Глухова', avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&h=100&fit=crop', role: 'user', followersCount: 300, followingIds: [], bio: 'кулинарный редактор CIVS' },
  { id: 'u4', name: 'Иван Петров', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop', role: 'user', followersCount: 10, followingIds: [] },
  { id: 'u5', name: 'Мария Иванова', avatar: 'https://images.unsplash.com/photo-1554151228-14d9def656e4?w=100&h=100&fit=crop', role: 'user', followersCount: 500, followingIds: [] },
];

export const MOCK_RECIPES: Recipe[] = [
  {
    id: "r1",
    title: "Борщ классический",
    description: "Настоящий украинский борщ: наваристый, ярко-красный и невероятно ароматный. Подается со сметаной, чесноком и свежим хлебом.",
    imageUrl: "https://i.ytimg.com/vi/QXdOB9aCAUA/maxresdefault.jpg",
    category: "Суп",
    prepTime: 40,
    cookTime: 90,
    difficulty: 3,
    portions: 6,
    ingredients: [
      { id: "i1", name: "Говядина на кости", amount: 600, unit: "г" },
      { id: "i2", name: "Свекла", amount: 2, unit: "шт" },
      { id: "i3", name: "Капуста белокочанная", amount: 400, unit: "г" },
      { id: "i4", name: "Картофель", amount: 4, unit: "шт" },
      { id: "i5", name: "Морковь", amount: 1, unit: "шт" },
      { id: "i6", name: "Лук репчатый", amount: 1, unit: "шт" },
      { id: "i7", name: "Томатная паста", amount: 3, unit: "ст.л." },
      { id: "i8", name: "Уксус 9%", amount: 1, unit: "ч.л." }
    ],
    steps: [
      { id: "s1", order: 1, description: "Промойте мясо, залейте холодной водой и доведите до кипения. Снимите пену и варите на медленном огне 1.5 часа.", imageUrl: "https://povarok.ru/images/142778/full/borshch-na-rebryshkakh.jpg" },
      { id: "s2", order: 2, description: "Свеклу натрите на крупной терке и обжарьте на масле. Добавьте томатную пасту и уксус (чтобы сохранить цвет).", imageUrl: "https://avatars.mds.yandex.net/i?id=c23f05ccb329344bbb742c9ee50c7134_l-4168927-images-thumbs&n=13" },
      { id: "s3", order: 3, description: "Лук мелко нарежьте, морковь натрите. Обжарьте их вместе до золотистого цвета на отдельной сковороде.", imageUrl: "https://img.pravda.ru/image/preview/article/6/0/6/2260606_amp.jpeg" },
      { id: "s4", order: 4, description: "В готовый бульон добавьте нарезанный кубиками картофель. Варите 10-15 минут.", imageUrl: "https://img.povar.ru/uploads/fb/3d/d8/e4/nastoyashii_borsh-420871.jpg" },
      { id: "s5", order: 5, description: "Добавьте нашинкованную капусту, зажарку из лука и моркови, а затем тушеную свеклу.", imageUrl: "https://img.povar.ru/uploads/8f/f4/2d/0b/borsh_bez_zajarki-846266.jpg" },
      { id: "s6", order: 6, description: "Посолите, поперчите, добавьте лавровый лист. Дайте борщу настояться под крышкой 20 минут перед подачей.", imageUrl: "https://img.povar.ru/uploads/73/c5/5a/b9/postnii_ukrainskii_borsh-646677.JPG" }
    ],
    nutritionalInfo: { calories: 380, protein: 18, fat: 22, carbs: 28 },
    authorId: "u1",
    status: "approved",
    views: 1250,
    createdAt: "2024-01-10T12:00:00Z"
  },
  {
    id: "r2",
    title: "Пельмени домашние",
    description: "Традиционные сибирские пельмени. Тонкое тесто и много сочной начинки из смеси говядины и свинины.",
    imageUrl: "https://www.koolinar.ru/all_image/article/3/3940/article-caa40fc2-e7e2-4316-a93b-62a3258482b1_large.jpg",
    category: "Обед",
    prepTime: 60,
    cookTime: 15,
    difficulty: 4,
    portions: 4,
    ingredients: [
      { id: "i9", name: "Мука пшеничная", amount: 500, unit: "г" },
      { id: "i10", name: "Яйцо", amount: 1, unit: "шт" },
      { id: "i11", name: "Вода", amount: 200, unit: "мл" },
      { id: "i12", name: "Говяжий фарш", amount: 300, unit: "г" },
      { id: "i13", name: "Свиной фарш", amount: 300, unit: "г" },
      { id: "i14", name: "Лук репчатый", amount: 1, unit: "шт" }
    ],
    steps: [
      { id: "r2_s1", order: 1, description: "В глубокую миску просейте муку, добавьте яйцо, соль и воду. Замесите эластичное тесто.", imageUrl: "https://avatars.mds.yandex.net/i?id=c1b01d5aad470bf2b14b182776ca34d8_l-12516513-images-thumbs&n=13" },
      { id: "r2_s2", order: 2, description: "Оставьте тесто отдыхать на 30-40 минут, накрыв его полотенцем или пленкой.", imageUrl: "https://avatars.mds.yandex.net/i?id=ae9d83828368e354ccf8efbb3bc2ab688ee72df9-5233154-images-thumbs&n=13" },
      { id: "r2_s3", order: 3, description: "Для начинки смешайте два вида фарша с мелко нарезанным луком, солью и перцем. Добавьте немного воды для сочности.", imageUrl: "https://avatars.mds.yandex.net/i?id=b4347a52172096d052f411767e092b44_l-5142631-images-thumbs&n=13" },
      { id: "r2_s4", order: 4, description: "Раскатайте тесто в тонкий пласт и вырежьте кружочки с помощью стакана.", imageUrl: "https://avatars.mds.yandex.net/i?id=a63ecec18389cc4129ab95cbb79d0ee37d769866-4566567-images-thumbs&n=13" },
      { id: "r2_s5", order: 5, description: "На каждый кружочек выложите чайную ложку начинки и плотно защипните края.", imageUrl: "https://images.gastronom.ru/GZbyt3N_7M56ErYLnBxPepIutDus-TtwgcX2pAKSRrs/pr:recipe-step-image/g:ce/rs:auto:0:0:0/L2Ntcy9hbGwtaW1hZ2VzL2Q3NDk2YmFmLWRjMjEtNGZmZC04ZDljLTY4ZjU2MDQwYjMwNi5qcGc.webp" },
      { id: "r2_s6", order: 6, description: "Варите пельмени в кипящей подсоленной воде с лавровым листом 5-7 минут после всплытия.", imageUrl: "https://img.povar.ru/uploads/c0/1c/a2/56/pelmeni_iz_baranini-883365.JPG" }
    ],
    nutritionalInfo: { calories: 480, protein: 20, fat: 24, carbs: 48 },
    authorId: "u2",
    status: "approved",
    views: 2100,
    createdAt: "2024-01-15T10:30:00Z"
  },
  {
    id: "r3",
    title: "Блины на молоке",
    description: "Тонкие, кружевные и очень нежные блинчики. Секрет в правильной консистенции теста и хорошо разогретой сковороде.",
    imageUrl: "https://img.povar.ru/uploads/3c/2b/f1/b9/blini_na_moloke-857100.jpg",
    category: "Завтрак",
    prepTime: 15,
    cookTime: 30,
    difficulty: 2,
    portions: 4,
    ingredients: [
      { id: "i15", name: "Молоко", amount: 500, unit: "мл" },
      { id: "i16", name: "Яйца", amount: 3, unit: "шт" },
      { id: "i17", name: "Мука пшеничная", amount: 250, unit: "г" },
      { id: "i18", name: "Сахар", amount: 2, unit: "ст.л." },
      { id: "i19", name: "Растительное масло", amount: 3, unit: "ст.л." }
    ],
    steps: [
      { id: "s11", order: 1, description: "Взбейте яйца с сахаром и солью до легкой пены.", imageUrl: "https://img.povar.ru/mobile/1f/9d/4a/14/zavarnoi_krem_idiliya-446991.jpg" },
      { id: "s12", order: 2, description: "Добавьте половину молока и постепенно всыпайте просеянную муку, постоянно помешивая венчиком.", imageUrl: "https://img.povar.ru/uploads/cb/8f/1a/c4/blinchiki_tonkie_na_moloke-368035.png" },
      { id: "s13", order: 3, description: "Влейте оставшееся молоко и растительное масло. Тесто должно быть жидким и без комочков.", imageUrl: "https://avatars.mds.yandex.net/i?id=d8f7bcab4a7b5d9066e74ea38a0f1678-4396222-images-thumbs&n=13" },
      { id: "s14", order: 4, description: "Разогрейте сковороду и смажьте ее маслом только перед первым блином.", imageUrl: "https://avatars.mds.yandex.net/i?id=152f0fc616a9184c1c658fbbaca64d45_l-5246033-images-thumbs&n=13" },
      { id: "s15", order: 5, description: "Наливайте тесто тонким слоем, распределяя его по всей поверхности. Жарьте до золотистого цвета с обеих сторон.", imageUrl: "https://avatars.mds.yandex.net/i?id=438d0ff82cc4b3c50b45f23d2ab6c133db405181-5275663-images-thumbs&n=13" }
    ],
    nutritionalInfo: { calories: 310, protein: 9, fat: 14, carbs: 38 },
    authorId: "u3",
    status: "approved",
    views: 3500,
    createdAt: "2024-02-01T08:00:00Z"
  },
  {
    id: "r4",
    title: "Салат Оливье",
    description: "Тот самый вкус праздника. Классический рецепт с докторской колбасой, солеными огурчиками и домашним майонезом.",
    imageUrl: "https://www.koolinar.ru/all_image/article/3/3929/article-99a96bf9-8d2e-46b8-ae48-624c58cb0463_large.jpg",
    category: "Закуски",
    prepTime: 40,
    cookTime: 30,
    difficulty: 1,
    portions: 6,
    ingredients: [
      { id: "i20", name: "Картофель", amount: 4, unit: "шт" },
      { id: "i21", name: "Морковь", amount: 2, unit: "шт" },
      { id: "i22", name: "Колбаса докторская", amount: 300, unit: "г" },
      { id: "i23", name: "Яйца", amount: 4, unit: "шт" },
      { id: "i24", name: "Огурцы соленые", amount: 3, unit: "шт" },
      { id: "i25", name: "Зеленый горошек", amount: 1, unit: "банка" },
      { id: "i26", name: "Майонез", amount: 150, unit: "г" }
    ],
    steps: [
      { id: "s16", order: 1, description: "Отварите картофель, морковь и яйца до готовности. Остудите и очистите.", imageUrl: "https://avatars.dzeninfra.ru/get-zen_doc/209388/pub_5af29ddddd248465f4efda4e_5af2a141c71a92d394d5245a/scale_1200" },
      { id: "s17", order: 2, description: "Нарежьте картофель и морковь мелкими кубиками одинакового размера.", imageUrl: "https://avatars.mds.yandex.net/i?id=77bb252e9749ab76640eba57530da59c_l-8194143-images-thumbs&n=13" },
      { id: "s18", order: 3, description: "Так же мелко нарежьте колбасу, яйца и соленые огурцы.", imageUrl: "https://avatars.mds.yandex.net/i?id=1725e94cec0a4b8b1c486acd5a2fe0b2_l-9854613-images-thumbs&n=13" },
      { id: "s19", order: 4, description: "Слейте жидкость из банки с горошком и добавьте его к остальным ингредиентам.", imageUrl: "https://www.povarenok.ru/data/cache/2020mar/08/44/2674825_63212-640x480.jpg" },
      { id: "s20", order: 5, description: "Заправьте салат майонезом, посолите по вкусу и тщательно перемешайте. Дайте настояться в холодильнике.", imageUrl: "https://avatars.mds.yandex.net/i?id=fafead183b6fc929da7ab946f2d040ef70c9561b-10618387-images-thumbs&n=13" }
    ],
    nutritionalInfo: { calories: 450, protein: 14, fat: 38, carbs: 18 },
    authorId: "u4",
    status: "approved",
    views: 1800,
    createdAt: "2024-02-10T15:00:00Z"
  },
  {
    id: "r5",
    title: "Селедка под шубой",
    description: "Традиционный слоеный салат. Нежная сельдь, сладкая свекла и воздушный майонез создают неповторимый вкус.",
    imageUrl: "https://avatars.mds.yandex.net/i?id=ecbc52a10e24af20c05c0d95f7cc03c6617060f9-10311550-images-thumbs&n=13",
    category: "Закуски",
    prepTime: 50,
    cookTime: 40,
    difficulty: 2,
    portions: 6,
    ingredients: [
      { id: "i27", name: "Сельдь слабосоленая", amount: 1, unit: "шт" },
      { id: "i28", name: "Свекла", amount: 2, unit: "шт" },
      { id: "i29", name: "Морковь", amount: 2, unit: "шт" },
      { id: "i30", name: "Картофель", amount: 3, unit: "шт" },
      { id: "i31", name: "Яйца", amount: 3, unit: "шт" },
      { id: "i32", name: "Лук репчатый", amount: 1, unit: "шт" },
      { id: "i33", name: "Майонез", amount: 200, unit: "г" }
    ],
    steps: [
      { id: "s21", order: 1, description: "Отварите все овощи и яйца. Остудите и очистите.", imageUrl: "https://img.povar.ru/mobile/cf/72/0e/fa/salat_stolichnii_klassicheskii_recept-194877.JPG" },
      { id: "s22", order: 2, description: "Сельдь очистите от костей и нарежьте мелкими кубиками. Лук мелко порубите.", imageUrl: "https://images.gastronom.ru/Q53wzgRAGT0RYhMLie11sGnELjj6pQryk2jQ82PESuM/pr:recipe-step-image/g:ce/rs:auto:0:0:0/L2Ntcy9hbGwtaW1hZ2VzL2Q4NDQxYjI3LWI5NDItNGEzMi1hYWY1LWNjNmFlNDI0NGMxMy5qcGc.webp" },
      { id: "s23", order: 3, description: "Натрите картофель, морковь, свеклу и яйца на крупной терке в разные миски.", imageUrl: "https://img.povar.ru/uploads/e7/43/1f/74/zakuska_quotseledka_pod_shuboiquot_v_yaice-239541.jpg" },
      { id: "s24", order: 4, description: "Выкладывайте слоями: сельдь, лук, картофель, морковь, яйца и сверху свекла. Каждый слой промазывайте майонезом.", imageUrl: "https://welldaily.ru/wp-content/uploads/2023/12/20231225-6589812353d36.jpg" },
      { id: "s25", order: 5, description: "Дайте салату настояться в холодильнике минимум 3-4 часа, чтобы слои пропитались.", imageUrl: "https://avatars.mds.yandex.net/i?id=ecbc52a10e24af20c05c0d95f7cc03c6617060f9-10311550-images-thumbs&n=13" }
    ],
    nutritionalInfo: { calories: 410, protein: 12, fat: 32, carbs: 20 },
    authorId: "u5",
    status: "approved",
    views: 1600,
    createdAt: "2024-02-15T18:00:00Z"
  },
  {
    id: "r6",
    title: "Котлеты по-киевски",
    description: "Легендарное блюдо: нежное куриное филе, внутри которого скрывается ароматное сливочное масло с зеленью. Хрустящая панировка сохраняет все соки внутри.",
    imageUrl: "https://avatars.mds.yandex.net/i?id=f05b967fca7005bbac37de803ea0bf32_l-8901029-images-thumbs&n=13",
    category: "Обед",
    prepTime: 40,
    cookTime: 25,
    difficulty: 4,
    portions: 2,
    ingredients: [
      { id: "i34", name: "Куриное филе", amount: 2, unit: "шт" },
      { id: "i35", name: "Сливочное масло", amount: 80, unit: "г" },
      { id: "i36", name: "Укроп свежий", amount: 20, unit: "г" },
      { id: "i37", name: "Яйца", amount: 2, unit: "шт" },
      { id: "i38", name: "Панировочные сухари", amount: 150, unit: "г" },
      { id: "i39", name: "Мука", amount: 50, unit: "г" }
    ],
    steps: [
      { id: "s26", order: 1, description: "Размягченное сливочное масло смешайте с мелко порубленным укропом. Сформируйте две небольшие колбаски и заморозьте их.", imageUrl: "https://img.povar.ru/uploads/0e/32/0c/0d/bavarskie_kolbaski_k_pivu-652994.JPG" },
      { id: "s27", order: 2, description: "Куриное филе аккуратно разрежьте вдоль, не доходя до конца, и тщательно отбейте через пленку.", imageUrl: "https://avatars.mds.yandex.net/i?id=d2b847e1c6b00b88be0fbc2d4e3b60dbfd7d0c78-10471476-images-thumbs&n=13" },
      { id: "s28", order: 3, description: "В центр каждого филе выложите замороженное масло. Плотно заверните мясо, чтобы не было просветов.", imageUrl: "https://i.ytimg.com/vi/kPcAWfjOt64/maxresdefault.jpg" },
      { id: "s29", order: 4, description: "Обваляйте котлеты в муке, затем в яйце, затем в сухарях. Повторите яйцо и сухари для прочной корочки.", imageUrl: "https://img.povar.ru/uploads/aa/95/17/83/samie_lenivie_quotkotleti_po-kievskiquot-449156.jpg" },
      { id: "s30", order: 5, description: "Обжарьте во фритюре до золотистого цвета, затем доведите до готовности в духовке при 180°C (10-12 минут).", imageUrl: "https://povarok.ru/images/204952/full/kotlety-po-kievski.jpg" }
    ],
    nutritionalInfo: { calories: 580, protein: 38, fat: 42, carbs: 15 },
    authorId: "u1",
    status: "approved",
    views: 950,
    createdAt: "2024-03-01T12:00:00Z"
  },
  {
    id: "r7",
    title: "Бефстроганов",
    description: "Классика русской кухни: тонкие ломтики говядины, томленые в густом сметанном соусе с луком. Идеально сочетается с картофельным пюре.",
    imageUrl: "https://avatars.mds.yandex.net/i?id=799e9ec978377cb84fad94196712ee1e18cc5c1b-5243009-images-thumbs&n=13",
    category: "Ужин",
    prepTime: 20,
    cookTime: 30,
    difficulty: 3,
    portions: 3,
    ingredients: [
      { id: "i40", name: "Говядина (вырезка)", amount: 500, unit: "г" },
      { id: "i41", name: "Лук репчатый", amount: 2, unit: "шт" },
      { id: "i42", name: "Сметана 20%", amount: 200, unit: "г" },
      { id: "i43", name: "Томатная паста", amount: 1, unit: "ст.л." },
      { id: "i44", name: "Мука", amount: 1, unit: "ст.л." },
      { id: "i45", name: "Сливочное масло", amount: 30, unit: "г" }
    ],
    steps: [
      { id: "s31", order: 1, description: "Мясо нарежьте тонкими пластами, отбейте и нарежьте соломкой поперек волокон.", imageUrl: "https://img.povar.ru/mobile/05/7e/50/e8/myaso_po-yaponski-84632.jpg" },
      { id: "s32", order: 2, description: "Лук нарежьте полукольцами и обжарьте на сливочном масле до мягкости.", imageUrl: "https://i.ytimg.com/vi/6jCrtn1ifU0/maxresdefault.jpg?sqp=-oaymwEmCIAKENAF8quKqQMa8AEB-AH-CYAC0AWKAgwIABABGGUgYShOMA8=&amp;rs=AOn4CLBDwhzG9S89wr_h6dJv3So_8Kqv5g" },
      { id: "s33", order: 3, description: "Мясо обваляйте в муке и быстро обжарьте на сильном огне до румяной корочки.", imageUrl: "https://avatars.mds.yandex.net/i?id=7d93c59a88b215f473ae49b06920d4dd_l-8497475-images-thumbs&n=13" },
      { id: "s34", order: 4, description: "Смешайте мясо с луком, добавьте сметану, томатную пасту, соль и перец.", imageUrl: "https://i.ytimg.com/vi/PBQAORuSkrI/maxresdefault.jpg" },
      { id: "s35", order: 5, description: "Тушите на медленном огне под крышкой 15-20 минут до мягкости мяса.", imageUrl: "https://avatars.mds.yandex.net/i?id=9ec7a1757d89767c4f37c2f58684710d_l-10814797-images-thumbs&n=13" }
    ],
    nutritionalInfo: { calories: 440, protein: 30, fat: 34, carbs: 10 },
    authorId: "u2",
    status: "approved",
    views: 1100,
    createdAt: "2024-03-05T19:00:00Z"
  },
  {
    id: "r8",
    title: "Щи из свежей капусты",
    description: "Традиционный русский суп на мясном бульоне. Легкий, витаминный и очень домашний.",
    imageUrl: "https://2688f858-4c46-45f7-8250-8add9f65af29.selstorage.ru/domashnie-shchi-iz-svejey-kapusty-na-kurinom-bulone-s-kuricey-ukro__1245x700.jpeg",
    category: "Суп",
    prepTime: 25,
    cookTime: 70,
    difficulty: 2,
    portions: 5,
    ingredients: [
      { id: "i46", name: "Говядина или свинина", amount: 500, unit: "г" },
      { id: "i47", name: "Капуста свежая", amount: 400, unit: "г" },
      { id: "i48", name: "Картофель", amount: 3, unit: "шт" },
      { id: "i49", name: "Морковь", amount: 1, unit: "шт" },
      { id: "i50", name: "Лук репчатый", amount: 1, unit: "шт" },
      { id: "i51", name: "Помидор", amount: 1, unit: "шт" }
    ],
    steps: [
      { id: "s36", order: 1, description: "Сварите бульон из мяса, периодически снимая пену. Варите около 1 часа.", imageUrl: "https://povarok.ru/images/160798/full/bul-on-navaristyi-po-tatarski.jpg" },
      { id: "s37", order: 2, description: "Капусту тонко нашинкуйте, картофель нарежьте брусочками.", imageUrl: "https://img.povar.ru/uploads/4b/db/7a/9d/borsh_bez_zajarki-846262.jpg" },
      { id: "s38", order: 3, description: "Лук и морковь спассеруйте на масле, в конце добавьте нарезанный помидор.", imageUrl: "https://img.povar.ru/uploads/76/a0/f8/ce/salat_s_jarenim_lukom_i_morkoviu-658881.jpg" },
      { id: "s39", order: 4, description: "В бульон добавьте картофель, через 5 минут капусту. Варите 10 минут.", imageUrl: "https://avatars.mds.yandex.net/i?id=459eb467668ac284e195361e59f9ab71_l-5253972-images-thumbs&n=13" },
      { id: "s40", order: 5, description: "Добавьте зажарку, посолите и варите еще 5-7 минут. Подавайте со сметаной.", imageUrl: "https://2688f858-4c46-45f7-8250-8add9f65af29.selstorage.ru/domashnie-shchi-iz-svejey-kapusty-na-kurinom-bulone-s-kuricey-ukro__1245x700.jpeg" }
    ],
    nutritionalInfo: { calories: 250, protein: 12, fat: 14, carbs: 22 },
    authorId: "u3",
    status: "approved",
    views: 800,
    createdAt: "2024-03-10T13:00:00Z"
  },
  {
    id: "r9",
    title: "Солянка мясная сборная",
    description: "Густой, острый и кислый суп. Настоящий деликатес для любителей копченостей, маслин и лимона.",
    imageUrl: "https://avatars.mds.yandex.net/get-vertis-journal/3911415/a3dc7b78-cd59-4051-83b7-5d0a1dc6a067.jpg/1600x1600",
    category: "Суп",
    prepTime: 35,
    cookTime: 60,
    difficulty: 4,
    portions: 4,
    ingredients: [
      { id: "i52", name: "Говядина", amount: 400, unit: "г" },
      { id: "i53", name: "Копчености (колбаса, ветчина)", amount: 300, unit: "г" },
      { id: "i54", name: "Огурцы соленые", amount: 3, unit: "шт" },
      { id: "i55", name: "Лук репчатый", amount: 2, unit: "шт" },
      { id: "i56", name: "Томатная паста", amount: 2, unit: "ст.л." },
      { id: "i57", name: "Маслины", amount: 50, unit: "г" },
      { id: "i58", name: "Лимон", amount: 0.5, unit: "шт" }
    ],
    steps: [
      { id: "s41", order: 1, description: "Сварите крепкий говяжий бульон. Мясо выньте и нарежьте соломкой.", imageUrl: "https://cdnn21.img.ria.ru/images/07e9/02/0e/1999411105_3:0:1454:816_1920x0_80_0_0_a5868ea79333a0e787e4c4952c939234.jpg" },
      { id: "s42", order: 2, description: "Все копчености нарежьте тонкой соломкой и слегка обжарьте на сковороде.", imageUrl: "https://avatars.mds.yandex.net/i?id=0468c03781d03cd8f2d66f0e5bc64180_l-4078232-images-thumbs&n=13" },
      { id: "s43", order: 3, description: "Лук мелко нарежьте, обжарьте, добавьте томатную пасту и нарезанные огурцы. Потушите 5-7 минут.", imageUrl: "https://img.povar.ru/uploads/17/e5/c0/24/bozbash_po-azerbaidjanski-98950.jpg" },
      { id: "s44", order: 4, description: "В кипящий бульон выложите мясо, копчености и зажарку. Варите 10-15 минут.", imageUrl: "https://avatars.mds.yandex.net/i?id=63c1b7c0dce647a41ac46335db9f86bf_l-8209878-images-thumbs&n=13" },
      { id: "s45", order: 5, description: "В самом конце добавьте маслины и каперсы. Подавайте с ломтиком лимона и сметаной.", imageUrl: "https://avatars.mds.yandex.net/get-vertis-journal/3911415/a3dc7b78-cd59-4051-83b7-5d0a1dc6a067.jpg/1600x1600" }
    ],
    nutritionalInfo: { calories: 510, protein: 25, fat: 38, carbs: 14 },
    authorId: "u4",
    status: "approved",
    views: 1400,
    createdAt: "2024-03-15T14:00:00Z"
  },
  {
    id: "r10",
    title: "Плов с говядиной",
    description: "Настоящий праздничный плов. Рассыпчатый рис, нежное мясо и аромат восточных специй.",
    imageUrl: "https://images.gastronom.ru/Jr3iJjZyXx7mka1wzmTKq1ErNNqG8vliC0yJNTKlJrs/pr:article-cover-image/g:ce/rs:auto:0:0:0/L2Ntcy9hbGwtaW1hZ2VzL2QxOTExNDU1LTNlZDMtNDA1ZC05OGZkLTU1MTQ1OGY0MTZmNC5qcGc.webp",
    category: "Обед",
    prepTime: 40,
    cookTime: 90,
    difficulty: 4,
    portions: 6,
    ingredients: [
      { id: "i59", name: "Рис (девзира или басмати)", amount: 600, unit: "г" },
      { id: "i60", name: "Говядина", amount: 600, unit: "г" },
      { id: "i61", name: "Морковь", amount: 600, unit: "г" },
      { id: "i62", name: "Лук репчатый", amount: 2, unit: "шт" },
      { id: "i63", name: "Растительное масло", amount: 150, unit: "мл" },
      { id: "i64", name: "Зира, барбарис", amount: 1, unit: "ст.л." }
    ],
    steps: [
      { id: "s46", order: 1, description: "Рис тщательно промойте до прозрачной воды и замочите в теплой подсоленной воде.", imageUrl: "https://www.chowhound.com/img/gallery/do-you-actually-need-to-rinse-rice-before-cooking-it/l-intro-1697489311.jpg" },
      { id: "s47", order: 2, description: "В казане разогрейте масло. Обжарьте мясо крупными кусками до румяной корочки.", imageUrl: "https://avatars.mds.yandex.net/i?id=2523d2041ffe6e715197a736d056063f1a8ca03f-15286244-images-thumbs&n=13" },
      { id: "s48", order: 3, description: "Добавьте лук полукольцами, затем морковь соломкой. Жарьте до мягкости моркови (зирвак).", imageUrl: "https://images.gastronom.ru/CRLsftV3DU4BMfrv436XWaiIr6VA2A7N1DwnztYf3ZI/pr:recipe-step-image/g:ce/rs:auto:0:0:0/L2Ntcy9hbGwtaW1hZ2VzL2E4MzNiMzNmLWU2MTgtNDA4OC1hNTMxLTYzOWMyOTc4ZjlkZC5qcGc.webp" },
      { id: "s49", order: 4, description: "Залейте кипятком, добавьте специи и чеснок целиком. Тушите зирвак 30-40 минут.", imageUrl: "https://images.gastronom.ru/RQwI69xnc8T-XdF8Cp4qdv1PzfkWX7Rv1WmSBClZLzo/pr:recipe-step-image/g:ce/rs:auto:0:0:0/L2Ntcy9hbGwtaW1hZ2VzLzYxMTc4YzU0LWY4YzItNGViZS05YmQ3LWQzYjUwNTIwMGZhZC5qcGc.webp" },
      { id: "s50", order: 5, description: "Выложите рис ровным слоем. Долейте воды, чтобы она покрывала рис на 1.5 см. Варите до выкипания воды.", imageUrl: "https://img.povar.ru/mobile/07/75/8d/24/pravilnii_ris-553891.JPG" },
      { id: "s51", order: 6, description: "Соберите рис горкой, сделайте отверстия, накройте крышкой и томите на самом малом огне 20 минут.", imageUrl: "https://img.povar.ru/mobile/dc/ed/a4/16/ris_s_kurinimi_jeludkami-518272.JPG" }
    ],
    nutritionalInfo: { calories: 580, protein: 22, fat: 28, carbs: 65 },
    authorId: "u5",
    status: "approved",
    views: 1900,
    createdAt: "2024-03-20T16:00:00Z"
  },
  {
    id: "r11",
    title: "Сырники из творога",
    description: "Идеальный завтрак: нежные внутри и с хрустящей корочкой снаружи. Секрет в сухом твороге и минимальном количестве муки.",
    imageUrl: "https://i.ytimg.com/vi/lM1yy6i1arw/maxresdefault.jpg",
    category: "Завтрак",
    prepTime: 15,
    cookTime: 15,
    difficulty: 2,
    portions: 2,
    ingredients: [
      { id: "i65", name: "Творог 5-9%", amount: 400, unit: "г" },
      { id: "i66", name: "Яйцо", amount: 1, unit: "шт" },
      { id: "i67", name: "Сахар", amount: 2, unit: "ст.л." },
      { id: "i68", name: "Мука пшеничная", amount: 3, unit: "ст.л." },
      { id: "i69", name: "Ванильный сахар", amount: 1, unit: "ч.л." }
    ],
    steps: [
      { id: "s52", order: 1, description: "Творог протрите через сито или тщательно разомните вилкой до однородности.", imageUrl: "https://здоровое-питание.рф/upload/iblock/1ae/mbi6d6p02i69dqqueur0bm3oxh3g0d8s/a5c45842_9cdd_4794_ae26_ad754ed24f7f.jpg" },
      { id: "s53", order: 2, description: "Добавьте яйцо, сахар и ванильный сахар. Тщательно перемешайте.", imageUrl: "https://img.povar.ru/uploads/98/af/ab/76/russkii_yablochnii_pirog-89591.jpg" },
      { id: "s54", order: 3, description: "Всыпьте муку и замесите мягкое, слегка липкое тесто.", imageUrl: "https://avatars.mds.yandex.net/i?id=6f5d69cadbb4cede4bbf0f2efdd5ba57f8d6eb85-12644621-images-thumbs&n=13" },
      { id: "s55", order: 4, description: "Сформируйте небольшие шарики, обваляйте их в муке и придайте форму шайб.", imageUrl: "https://kedem.ru/photo/recipe/2023/09/risovye-syrniki-08.jpg" },
      { id: "s56", order: 5, description: "Обжаривайте на разогретой сковороде с небольшим количеством масла по 3-4 минуты с каждой стороны.", imageUrl: "https://images.gastronom.ru/Oc9jx6QyEC1p_rV_hlZAsuPKlIMwNK4iUJATKSNgass/pr:recipe-step-image/g:ce/rs:auto:0:0:0/L2Ntcy9hbGwtaW1hZ2VzLzgwZTAwOTNlLTU1ZTQtNGNlMi05MmU5LWI5MDQwOTFlMjEzYS5qcGc.webp" }
    ],
    nutritionalInfo: { calories: 320, protein: 25, fat: 12, carbs: 28 },
    authorId: "u1",
    status: "approved",
    views: 2800,
    createdAt: "2024-03-25T09:00:00Z"
  },
  {
    id: "r12",
    title: "Паста Карбонара",
    description: "Настоящая итальянская классика без сливок. Нежный соус из желтков и сыра, ароматный бекон и паста аль-денте.",
    imageUrl: "https://cdnn21.img.ria.ru/images/07e9/02/0e/1999398127_0:0:1344:756_1920x1080_80_0_0_de14300375b37266ba6caea8ee615c9a.jpg",
    category: "Ужин",
    prepTime: 10,
    cookTime: 20,
    difficulty: 3,
    portions: 2,
    ingredients: [
      { id: "i70", name: "Спагетти", amount: 200, unit: "г" },
      { id: "i71", name: "Бекон или гуанчиале", amount: 100, unit: "г" },
      { id: "i72", name: "Яичные желтки", amount: 3, unit: "шт" },
      { id: "i73", name: "Сыр Пармезан", amount: 50, unit: "г" },
      { id: "i74", name: "Черный перец", amount: 1, unit: "по вкусу" }
    ],
    steps: [
      { id: "s57", order: 1, description: "Поставьте вариться спагетти в большом количестве подсоленной воды.", imageUrl: "https://pg12.ru/userfiles/picfullsize/image-1733317898_7747.jpg" },
      { id: "s58", order: 2, description: "Бекон нарежьте небольшими кусочками и обжарьте на сухой сковороде до хрустящей корочки.", imageUrl: "https://img.povar.ru/mobile/dd/3a/07/16/pasta_karbonara_s_bekonom_i_slivkami-375945.jpg" },
      { id: "s59", order: 3, description: "В отдельной миске смешайте желтки с тертым пармезаном и свежемолотым черным перцем.", imageUrl: "https://avatars.mds.yandex.net/i?id=3b0f6574575d45ce17dadb72e0c3b0d2_l-5240761-images-thumbs&n=13" },
      { id: "s60", order: 4, description: "Готовую пасту переложите к бекону, добавьте немного воды от варки и снимите с огня.", imageUrl: "https://avatars.mds.yandex.net/i?id=30ba9aa53b96a623e2279c58ba25bc7e_l-9181483-images-thumbs&n=13" },
      { id: "s61", order: 5, description: "Быстро влейте яично-сырную смесь и энергично перемешивайте, чтобы соус стал кремовым, но желтки не свернулись.", imageUrl: "https://cdnn21.img.ria.ru/images/07e9/02/0e/1999398127_0:0:1344:756_1920x1080_80_0_0_de14300375b37266ba6caea8ee615c9a.jpg" }
    ],
    nutritionalInfo: { calories: 580, protein: 22, fat: 35, carbs: 45 },
    authorId: "u2",
    status: "approved",
    views: 4200,
    createdAt: "2024-04-01T19:30:00Z"
  },
  {
    id: "r13",
    title: "Салат Цезарь",
    description: "Популярный ресторанный салат. Сочная куриная грудка, хрустящие гренки и пикантный соус на основе анчоусов и пармезана.",
    imageUrl: "https://i.ytimg.com/vi/uhEPO1_46HI/maxresdefault.jpg",
    category: "Закуски",
    prepTime: 20,
    cookTime: 15,
    difficulty: 2,
    portions: 2,
    ingredients: [
      { id: "i75", name: "Куриное филе", amount: 250, unit: "г" },
      { id: "i76", name: "Салат Романо", amount: 1, unit: "пучок" },
      { id: "i77", name: "Хлеб белый (для гренок)", amount: 100, unit: "г" },
      { id: "i78", name: "Сыр Пармезан", amount: 40, unit: "г" },
      { id: "i79", name: "Соус Цезарь", amount: 80, unit: "г" },
      { id: "i80", name: "Черри", amount: 6, unit: "шт" }
    ],
    steps: [
      { id: "s62", order: 1, description: "Куриное филе посолите, поперчите и обжарьте на гриле или сковороде до готовности. Нарежьте ломтиками.", imageUrl: "https://img.povar.ru/uploads/48/5d/4f/5f/kurinaya_grudka_na_skovorode-gril-581200.JPG" },
      { id: "s63", order: 2, description: "Хлеб нарежьте кубиками и подсушите в духовке или на сковороде с чесночным маслом.", imageUrl: "https://avatars.mds.yandex.net/i?id=93236ed5b85cf97ab24c0dd2bcba515c_l-4549790-images-thumbs&n=13" },
      { id: "s64", order: 3, description: "Листья салата промойте, обсушите и порвите руками в большую миску.", imageUrl: "https://i.ytimg.com/vi/qddFrJhSi3Y/maxresdefault.jpg" },
      { id: "s65", order: 4, description: "Добавьте к салату соус, половину тертого пармезана и перемешайте.", imageUrl: "https://cdn.food.ru/unsigned/fit/640/480/ce/0/czM6Ly9tZWRpYS9waWN0dXJlcy8yMDI1MDMwMy8zOExOaTguanBlZw.jpg" },
      { id: "s66", order: 5, description: "Выложите салат на тарелку, сверху разложите курицу, гренки, черри и посыпьте оставшимся сыром.", imageUrl: "https://i.ytimg.com/vi/qsOiq_YqWzk/maxresdefault.jpg" }
    ],
    nutritionalInfo: { calories: 450, protein: 30, fat: 28, carbs: 20 },
    authorId: "u3",
    status: "approved",
    views: 5100,
    createdAt: "2024-04-05T14:00:00Z"
  },
  {
    id: "r14",
    title: "Стейк из лосося",
    description: "Изысканное и полезное блюдо. Нежный лосось, запеченный с лимоном и прованскими травами, сохраняет всю пользу и вкус.",
    imageUrl: "https://avatars.mds.yandex.net/i?id=4ee154551380a276ae58a8978aafa498_l-13104710-images-thumbs&n=13",
    category: "Здоровая еда",
    prepTime: 10,
    cookTime: 15,
    difficulty: 1,
    portions: 1,
    ingredients: [
      { id: "i81", name: "Стейк лосося", amount: 250, unit: "г" },
      { id: "i82", name: "Лимон", amount: 0.5, unit: "шт" },
      { id: "i83", name: "Оливковое масло", amount: 1, unit: "ст.л." },
      { id: "i84", name: "Розмарин свежий", amount: 1, unit: "веточка" },
      { id: "i85", name: "Специи для рыбы", amount: 1, unit: "по вкусу" }
    ],
    steps: [
      { id: "s67", order: 1, description: "Стейк лосося промойте и обсушите бумажным полотенцем.", imageUrl: "https://static.1000.menu/img/content-v2/65/77/35685/steik-lososya-v-folge-v-duxovke1_1723606820_2_lmwa4q4_max.jpg" },
      { id: "s68", order: 2, description: "Натрите рыбу солью, перцем и оливковым маслом. Выложите на противень, застеленный пергаментом.", imageUrl: "https://prostokvashino.ru/upload/iblock/b54/b544cccfd8b8a424a7b74c0a6012adba.jpeg" },
      { id: "s69", order: 3, description: "Сверху положите ломтики лимона и веточку розмарина.", imageUrl: "https://avatars.mds.yandex.net/i?id=b42b6d24d2d8c422da2ad1faf580b7d1_l-5228667-images-thumbs&n=13" },
      { id: "s70", order: 4, description: "Запекайте в разогретой до 200°C духовке 12-15 минут. Не пересушите!", imageUrl: "https://i.ytimg.com/vi/yrYcq3Fydak/maxresdefault.jpg" }
    ],
    nutritionalInfo: { calories: 380, protein: 35, fat: 25, carbs: 2 },
    authorId: "u4",
    status: "approved",
    views: 3200,
    createdAt: "2024-04-10T18:00:00Z"
  },
  {
    id: "r15",
    title: "Курица карри",
    description: "Ароматное блюдо в индийском стиле. Нежные кусочки курицы в густом соусе из кокосового молока и пряных специй.",
    imageUrl: "https://avatars.mds.yandex.net/i?id=4ccf12b1f650500ab6ef716fd9ef8ac9981aba8c-4633663-images-thumbs&n=13",
    category: "Обед",
    prepTime: 15,
    cookTime: 30,
    difficulty: 3,
    portions: 3,
    ingredients: [
      { id: "i86", name: "Куриное филе", amount: 500, unit: "г" },
      { id: "i87", name: "Кокосовое молоко", amount: 400, unit: "мл" },
      { id: "i88", name: "Приправа карри", amount: 2, unit: "ст.л." },
      { id: "i89", name: "Лук репчатый", amount: 1, unit: "шт" },
      { id: "i90", name: "Чеснок", amount: 2, unit: "зубчика" },
      { id: "i91", name: "Имбирь свежий", amount: 10, unit: "г" }
    ],
    steps: [
      { id: "s71", order: 1, description: "Лук, чеснок и имбирь мелко нарежьте и обжарьте на масле до мягкости.", imageUrl: "https://img.povar.ru/uploads/36/17/ac/df/sous_s_marinovannim_imbirem-827928.jpg" },
      { id: "s72", order: 2, description: "Добавьте нарезанную кубиками курицу и жарьте до золотистого цвета.", imageUrl: "https://avatars.mds.yandex.net/i?id=107e75ccdb6b7a1189bff69b3d45442f_l-5268986-images-thumbs&n=13" },
      { id: "s73", order: 3, description: "Всыпьте карри, перемешайте и влейте кокосовое молоко.", imageUrl: "https://images.gastronom.ru/UORgr70Hg5z1fCMJmPC2Q5-532vdymgVyXQToASPiwc/pr:recipe-step-image/g:ce/rs:auto:0:0:0/L2Ntcy9hbGwtaW1hZ2VzL2Q5NGNhNWU3LWFkMGQtNDc5Yi1iYjBlLWJhYjYzYTA5ZjdhYy5qcGc.webp" },
      { id: "s74", order: 4, description: "Тушите на медленном огне 15-20 минут, пока соус не загустеет. Подавайте с рисом.", imageUrl: "https://avatars.mds.yandex.net/i?id=4ccf12b1f650500ab6ef716fd9ef8ac9981aba8c-4633663-images-thumbs&n=13" }
    ],
    nutritionalInfo: { calories: 420, protein: 32, fat: 28, carbs: 10 },
    authorId: "u5",
    status: "approved",
    views: 1500,
    createdAt: "2024-04-15T13:00:00Z"
  },
  {
    id: "r16",
    title: "Тыквенный суп-пюре",
    description: "Нежный, бархатистый суп с согревающим вкусом. Идеально подходит для холодного времени года.",
    imageUrl: "https://images.gastronom.ru/v0eY7hJOZrEE8d2pHERlay9kCnUJt8VCr0_qgkhHiKw/pr:recipe-cover-image/g:ce/rs:auto:0:0:0/L2Ntcy9hbGwtaW1hZ2VzL2EyMDc2OGNlLTdmYWUtNDE1NC05Y2M4LWNhOWFhZmE4MTI2Yi5wbmc.webp",
    category: "Суп",
    prepTime: 15,
    cookTime: 35,
    difficulty: 2,
    portions: 4,
    ingredients: [
      { id: "i92", name: "Тыква", amount: 800, unit: "г" },
      { id: "i93", name: "Сливки 20%", amount: 200, unit: "мл" },
      { id: "i94", name: "Лук репчатый", amount: 1, unit: "шт" },
      { id: "i95", name: "Чеснок", amount: 2, unit: "зубчика" },
      { id: "i96", name: "Имбирь", amount: 10, unit: "г" },
      { id: "i97", name: "Тыквенные семечки", amount: 20, unit: "г" }
    ],
    steps: [
      { id: "s75", order: 1, description: "Тыкву нарежьте кубиками, лук и чеснок мелко порубите.", imageUrl: "https://img.povar.ru/uploads/ec/80/dd/c3/tikva_po-derevenski-801958.jpg" },
      { id: "s76", order: 2, description: "Обжарьте лук, чеснок и имбирь в кастрюле с толстым дном. Добавьте тыкву и залейте водой или бульоном.", imageUrl: "https://images.gastronom.ru/j9Gk5xvOAjYLelnYTykNAUoP-YonCMobnIeVeDZO6yE/pr:recipe-step-image/g:ce/rs:auto:0:0:0/L2Ntcy9hbGwtaW1hZ2VzLzg4YTM4NWM3LTkxNWItNDk0My1iYWNmLWZjZDE1MjNlYmRlYy5qcGc.webp" },
      { id: "s77", order: 3, description: "Варите до мягкости тыквы (около 20 минут). Слейте часть жидкости.", imageUrl: "https://povarok.ru/images/323917/full/veganskie-tykvennye-keksy.jpg" },
      { id: "s78", order: 4, description: "Пробейте суп блендером до однородности, влейте теплые сливки и прогрейте (не доводя до кипения).", imageUrl: "https://povarok.ru/images/122047/full/morkovnyi-krem-sup.jpg" },
      { id: "s79", order: 5, description: "Подавайте, украсив тыквенными семечками и каплей оливкового масла.", imageUrl: "https://images.gastronom.ru/v0eY7hJOZrEE8d2pHERlay9kCnUJt8VCr0_qgkhHiKw/pr:recipe-cover-image/g:ce/rs:auto:0:0:0/L2Ntcy9hbGwtaW1hZ2VzL2EyMDc2OGNlLTdmYWUtNDE1NC05Y2M4LWNhOWFhZmE4MTI2Yi5wbmc.webp" }
    ],
    nutritionalInfo: { calories: 280, protein: 6, fat: 18, carbs: 22 },
    authorId: "u1",
    status: "approved",
    views: 2300,
    createdAt: "2024-04-20T12:00:00Z"
  },
  {
    id: "r17",
    title: "Шакшука",
    description: "Традиционный ближневосточный завтрак. Яйца, запеченные в густом и пряном соусе из томатов, перца и специй.",
    imageUrl: "https://img.povar.ru/uploads/00/ea/6d/72/shakshuka-823164.jpg",
    category: "Завтрак",
    prepTime: 10,
    cookTime: 20,
    difficulty: 2,
    portions: 2,
    ingredients: [
      { id: "i98", name: "Яйца", amount: 4, unit: "шт" },
      { id: "i99", name: "Помидоры в собственном соку", amount: 400, unit: "г" },
      { id: "i100", name: "Болгарский перец", amount: 1, unit: "шт" },
      { id: "i101", name: "Лук репчатый", amount: 1, unit: "шт" },
      { id: "i102", name: "Чеснок", amount: 2, unit: "зубчика" },
      { id: "i103", name: "Зира, паприка", amount: 1, unit: "ч.л." }
    ],
    steps: [
      { id: "s80", order: 1, description: "Лук и перец нарежьте кубиками и обжарьте на оливковом масле до мягкости.", imageUrl: "https://avatars.mds.yandex.net/i?id=44003510b5c28608e80932df6f46c725_l-9053009-images-thumbs&n=13" },
      { id: "s81", order: 2, description: "Добавьте измельченный чеснок и специи. Жарьте 1 минуту до появления аромата.", imageUrl: "https://i.ytimg.com/vi/hMGAq_8h8pA/maxresdefault.jpg" },
      { id: "s82", order: 3, description: "Влейте томаты, посолите и тушите соус (матбуху) на медленном огне 10 минут.", imageUrl: "https://img.povar.ru/mobile/24/57/c9/52/matbuha-598506.JPG" },
      { id: "s83", order: 4, description: "Сделайте ложкой четыре углубления и аккуратно разбейте в них яйца.", imageUrl: "https://s-dt2.cloud.edgecore.ru/app-uploads-prod/app/media/%D1%80%D0%B5%D1%86%D0%B5%D0%BF%D1%82%20%D1%88%D0%B0%D0%BA%D1%88%D1%83%D0%BA%D0%B0/%2011.jpg" },
      { id: "s84", order: 5, description: "Готовьте под крышкой 5 минут, пока белок не схватится, а желток останется жидким.", imageUrl: "https://img.povar.ru/uploads/00/ea/6d/72/shakshuka-823164.jpg" }
    ],
    nutritionalInfo: { calories: 310, protein: 18, fat: 20, carbs: 15 },
    authorId: "u2",
    status: "approved",
    views: 3800,
    createdAt: "2024-04-25T08:30:00Z"
  },
  {
    id: "r18",
    title: "Ризотто с грибами",
    description: "Итальянское блюдо с кремовой текстурой и насыщенным вкусом лесных грибов. Секрет в правильном сорте риса и постоянном помешивании.",
    imageUrl: "https://avatars.mds.yandex.net/get-vertis-journal/4465444/eb5e2d98-7ee2-4031-a15b-0f86452416cd.jpg/1600x1600",
    category: "Ужин",
    prepTime: 10,
    cookTime: 35,
    difficulty: 4,
    portions: 2,
    ingredients: [
      { id: "i104", name: "Рис Арборио", amount: 200, unit: "г" },
      { id: "i105", name: "Шампиньоны или белые грибы", amount: 300, unit: "г" },
      { id: "i106", name: "Овощной бульон", amount: 700, unit: "мл" },
      { id: "i107", name: "Лук-шалот", amount: 1, unit: "шт" },
      { id: "i108", name: "Белое сухое вино", amount: 100, unit: "мл" },
      { id: "i109", name: "Сыр Пармезан", amount: 50, unit: "г" }
    ],
    steps: [
      { id: "s85", order: 1, description: "Грибы нарежьте и обжарьте на сильном огне до золотистого цвета. Отложите часть для украшения.", imageUrl: "https://img.povar.ru/uploads/ca/5a/23/90/shampinoni_jarenie_s_lukom-866663.jpg" },
      { id: "s86", order: 2, description: "Лук мелко нарежьте и обжарьте до прозрачности. Всыпьте рис и жарьте 2 минуты, пока он не станет 'стеклянным'.", imageUrl: "https://avatars.mds.yandex.net/i?id=20c8332219e36600a40c84ab07ad50841844e25a-12475985-images-thumbs&n=13" },
      { id: "s87", order: 3, description: "Влейте вино и дайте ему полностью выпариться при постоянном помешивании.", imageUrl: "https://avatars.mds.yandex.net/i?id=d63d0253174fa6b6600766773c3690b1_l-12625448-images-thumbs&n=13" },
      { id: "s88", order: 4, description: "Постепенно добавляйте горячий бульон по одному половнику, дожидаясь впитывания каждой порции.", imageUrl: "https://vkusvill.ru/upload/resize/403251/403251_1504x1044x90_c_o.webp" },
      { id: "s89", order: 5, description: "Когда рис будет готов (аль-денте), добавьте грибы, тертый пармезан и кусочек сливочного масла. Перемешайте.", imageUrl: "https://avatars.mds.yandex.net/get-vertis-journal/4465444/eb5e2d98-7ee2-4031-a15b-0f86452416cd.jpg/1600x1600" }
    ],
    nutritionalInfo: { calories: 480, protein: 12, fat: 22, carbs: 55 },
    authorId: "u3",
    status: "approved",
    views: 1900,
    createdAt: "2024-05-01T20:00:00Z"
  },
  {
    id: "r19",
    title: "Лазанья Болоньезе",
    description: "Классическое итальянское блюдо. Слои пасты, насыщенный мясной соус болоньезе и нежный сливочный бешамель под сырной корочкой.",
    imageUrl: "https://cdn.food.ru/unsigned/fit/640/480/ce/0/czM6Ly9tZWRpYS9waWN0dXJlcy8yMDI0MTEyMy9VWnJqVmcuanBlZw.jpg",
    category: "Обед",
    prepTime: 40,
    cookTime: 50,
    difficulty: 5,
    portions: 6,
    ingredients: [
      { id: "i110", name: "Листы лазаньи", amount: 12, unit: "шт" },
      { id: "i111", name: "Фарш (говядина + свинина)", amount: 600, unit: "г" },
      { id: "i112", name: "Томаты в собственном соку", amount: 400, unit: "г" },
      { id: "i113", name: "Молоко (для бешамеля)", amount: 500, unit: "мл" },
      { id: "i114", name: "Сыр Моцарелла", amount: 200, unit: "г" },
      { id: "i115", name: "Сливочное масло", amount: 50, unit: "г" }
    ],
    steps: [
      { id: "s90", order: 1, description: "Приготовьте соус болоньезе: обжарьте фарш с луком, добавьте томаты и тушите 30 минут.", imageUrl: "https://cdn.food.ru/unsigned/fit/640/480/ce/0/czM6Ly9tZWRpYS9waWN0dXJlcy8yMDIyMDEyMS9wZkcyZWguanBlZw.jpg" },
      { id: "s91", order: 2, description: "Приготовьте соус бешамель: растопите масло, добавьте муку и постепенно влейте молоко, помешивая до загустения.", imageUrl: "https://images.gastronom.ru/lrK3LgAUba2ruFb4V3rCU5u8YHz2IUTM_j-cO-WgirY/pr:recipe-step-image/g:ce/rs:auto:0:0:0/L2Ntcy9hbGwtaW1hZ2VzL2MxYzUzOWZhLTRlNWQtNGVkMi04YjRiLTM4ZmEzZmExNjcyMi5qcGc.webp" },
      { id: "s92", order: 3, description: "В форму для запекания выложите немного соуса, затем листы лазаньи, болоньезе и бешамель.", imageUrl: "https://avatars.mds.yandex.net/i?id=f3e3938994c583f317066fbdbc15234dec6ae5e8-5754043-images-thumbs&n=13" },
      { id: "s93", order: 4, description: "Повторяйте слои, пока не закончатся ингредиенты. Верхний слой обильно посыпьте сыром.", imageUrl: "https://avatars.mds.yandex.net/i?id=f3e3938994c583f317066fbdbc15234dec6ae5e8-5754043-images-thumbs&n=13" },
      { id: "s94", order: 5, description: "Запекайте в духовке при 190°C около 35-40 минут до румяной корочки.", imageUrl: "https://avatars.dzeninfra.ru/get-zen_doc/271828/pub_66fe74aabadccb6169383458_66fe793e5011dc0040cd37a4/smart_crop_516x290" }
    ],
    nutritionalInfo: { calories: 650, protein: 35, fat: 40, carbs: 38 },
    authorId: "u4",
    status: "approved",
    views: 3400,
    createdAt: "2024-05-05T15:00:00Z"
  },
  {
    id: "r20",
    title: "Греческий салат",
    description: "Свежий и яркий салат. Крупно нарезанные овощи, ароматные травы, маслины и настоящий сыр фета.",
    imageUrl: "https://i.ytimg.com/vi/k3fcCd9aQkE/maxresdefault.jpg",
    category: "Закуски",
    prepTime: 15,
    cookTime: 5,
    difficulty: 1,
    portions: 2,
    ingredients: [
      { id: "i116", name: "Помидоры", amount: 2, unit: "шт" },
      { id: "i117", name: "Огурцы", amount: 2, unit: "шт" },
      { id: "i118", name: "Болгарский перец", amount: 1, unit: "шт" },
      { id: "i119", name: "Красный лук", amount: 0.5, unit: "шт" },
      { id: "i120", name: "Сыр Фета", amount: 150, unit: "г" },
      { id: "i121", name: "Маслины без косточек", amount: 50, unit: "г" },
      { id: "i122", name: "Оливковое масло", amount: 3, unit: "ст.л." }
    ],
    steps: [
      { id: "s95", order: 1, description: "Помидоры, огурцы и перец нарежьте крупными кубиками.", imageUrl: "https://vpuzo.com/uploads/picture/1600/0/2017-09/1506110348_2.jpg" },
      { id: "s96", order: 2, description: "Красный лук нарежьте тонкими полукольцами.", imageUrl: "https://avatars.mds.yandex.net/i?id=041e66e50c64c1c639a927cab1a8e434_l-8505020-images-thumbs&n=13" },
      { id: "s97", order: 3, description: "Смешайте овощи в миске, добавьте маслины.", imageUrl: "https://avatars.mds.yandex.net/i?id=45148838aba44c735055f5ea7bd98e3da0d0711e-13219746-images-thumbs&n=13" },
      { id: "s98", order: 4, description: "Сверху выложите целый пласт феты или нарежьте его крупными кубиками.", imageUrl: "https://avatars.mds.yandex.net/i?id=45c7635f4fa4ee6fc5b0804107913169_l-4809529-images-thumbs&n=13" },
      { id: "s99", order: 5, description: "Полейте оливковым маслом, посыпьте орегано и подавайте.", imageUrl: "https://i.ytimg.com/vi/k3fcCd9aQkE/maxresdefault.jpg" }
    ],
    nutritionalInfo: { calories: 290, protein: 8, fat: 25, carbs: 10 },
    authorId: "u5",
    status: "approved",
    views: 4100,
    createdAt: "2024-05-10T12:00:00Z"
  },
  {
    id: "r21",
    title: "Плов с курицей",
    description: "Более легкая и быстрая версия классического плова. Куриное мясо делает блюдо нежным, а специи придают ему восточный колорит.",
    imageUrl: "https://images.news.ru/2025/08/25/4CzeCFgqFcY8wCI3DOM9wxp14cdWbVwtZvWOMOiN_780.png",
    category: "Обед",
    prepTime: 20,
    cookTime: 45,
    difficulty: 3,
    portions: 4,
    ingredients: [
      { id: "i123", name: "Рис длиннозерный", amount: 400, unit: "г" },
      { id: "i124", name: "Куриное бедро (филе)", amount: 600, unit: "г" },
      { id: "i125", name: "Морковь", amount: 2, unit: "шт" },
      { id: "i126", name: "Лук репчатый", amount: 2, unit: "шт" },
      { id: "i127", name: "Чеснок", amount: 1, unit: "головка" },
      { id: "i128", name: "Специи для плова", amount: 1, unit: "ст.л." }
    ],
    steps: [
      { id: "s100", order: 1, description: "Рис промойте несколько раз до прозрачности воды.", imageUrl: "https://avatars.mds.yandex.net/i?id=cb9402eae87c5464351366e0841713de_l-5018153-images-thumbs&n=13" },
      { id: "s101", order: 2, description: "Курицу нарежьте средними кусочками и обжарьте в казане до румяности.", imageUrl: "https://avatars.mds.yandex.net/i?id=dbeb0398ad670d5a7995d2c49598f5b11463fd53-10703615-images-thumbs&n=13" },
      { id: "s102", order: 3, description: "Добавьте нарезанный лук и морковь соломкой. Жарьте до мягкости овощей.", imageUrl: "https://i.ytimg.com/vi/f78xDwMYFys/maxresdefault.jpg?sqp=-oaymwEmCIAKENAF8quKqQMa8AEB-AH-CYAC0AWKAgwIABABGEYgUihlMA8=&amp;rs=AOn4CLAuf3Y-RKhZoHt0NbT6RVUTo1RJhg" },
      { id: "s103", order: 4, description: "Всыпьте рис, разровняйте и залейте горячей водой на 1.5 см выше уровня риса. В центр поместите головку чеснока.", imageUrl: "https://kulinarenok.ru/storage/recipes/35145/steps/5.jpg" },
      { id: "s104", order: 5, description: "Готовьте под крышкой на слабом огне 20-25 минут до полного впитывания воды.", imageUrl: "https://images.news.ru/2025/08/25/4CzeCFgqFcY8wCI3DOM9wxp14cdWbVwtZvWOMOiN_780.png" }
    ],
    nutritionalInfo: { calories: 480, protein: 25, fat: 18, carbs: 55 },
    authorId: "u1",
    status: "approved",
    views: 1200,
    createdAt: "2024-05-15T13:00:00Z"
  },
  {
    id: "r22",
    title: "Окрошка на квасе",
    description: "Главный летний суп. Освежающая смесь свежих овощей, зелени и мясных деликатесов, заправленная холодным хлебным квасом.",
    imageUrl: "https://i.pinimg.com/originals/4e/08/ba/4e08baace676ff83a648c1c8f02c7f33.jpg",
    category: "Суп",
    prepTime: 25,
    cookTime: 0,
    difficulty: 1,
    portions: 4,
    ingredients: [
      { id: "i129", name: "Квас хлебный", amount: 1.5, unit: "л" },
      { id: "i130", name: "Колбаса докторская", amount: 300, unit: "г" },
      { id: "i131", name: "Картофель отварной", amount: 3, unit: "шт" },
      { id: "i132", name: "Яйца отварные", amount: 4, unit: "шт" },
      { id: "i133", name: "Огурцы свежие", amount: 3, unit: "шт" },
      { id: "i134", name: "Редис", amount: 6, unit: "шт" },
      { id: "i135", name: "Зеленый лук и укроп", amount: 1, unit: "пучок" }
    ],
    steps: [
      { id: "s105", order: 1, description: "Картофель, яйца и колбасу нарежьте мелкими кубиками.", imageUrl: "https://avatars.mds.yandex.net/i?id=a5d3563d60bab45f1ceab2cfd182a2b6_l-5875528-images-thumbs&n=13" },
      { id: "s106", order: 2, description: "Огурцы и редис также нарежьте кубиками или соломкой.", imageUrl: "https://povarok.ru/images/124054/full/okroshka-na-smetane-i-vode.jpg" },
      { id: "s107", order: 3, description: "Зелень мелко порубите и разотрите с солью, чтобы она дала сок.", imageUrl: "https://i.ytimg.com/vi/Iv1YVFWverA/maxresdefault.jpg" },
      { id: "s108", order: 4, description: "Смешайте все нарезанные ингредиенты в большой кастрюле.", imageUrl: "https://i.pinimg.com/originals/63/b5/41/63b5418e7dcc11765ca6b4b9f700cc0a.jpg" },
      { id: "s109", order: 5, description: "Разложите основу по тарелкам, залейте холодным квасом и добавьте ложку сметаны.", imageUrl: "https://retseptplus.ru/supy/okroshka/klassicheskaya-okroshka-na-kvase/klassicheskaya-okroshka-na-kvase-ready0-w1200h630.jpg" }
    ],
    nutritionalInfo: { calories: 210, protein: 12, fat: 14, carbs: 10 },
    authorId: "u2",
    status: "approved",
    views: 3100,
    createdAt: "2024-05-20T11:00:00Z"
  },
  {
    id: "r23",
    title: "Сырный суп с курицей",
    description: "Невероятно сливочный и нежный суп. Плавленый сыр придает ему бархатистую текстуру, а гренки - приятный хруст.",
    imageUrl: "https://images.news.ru/2025/09/21/Ta2b2pt08gVTeB7GnI4Rhs7FHpD6u8HHuodA69Fe_780.png",
    category: "Суп",
    prepTime: 15,
    cookTime: 25,
    difficulty: 2,
    portions: 3,
    ingredients: [
      { id: "i136", name: "Куриное филе", amount: 300, unit: "г" },
      { id: "i137", name: "Плавленый сыр (мягкий)", amount: 200, unit: "г" },
      { id: "i138", name: "Картофель", amount: 3, unit: "шт" },
      { id: "i139", name: "Морковь", amount: 1, unit: "шт" },
      { id: "i140", name: "Лук репчатый", amount: 1, unit: "шт" },
      { id: "i141", name: "Сливки 10%", amount: 100, unit: "мл" }
    ],
    steps: [
      { id: "s110", order: 1, description: "Сварите куриный бульон, мясо достаньте и нарежьте кусочками.", imageUrl: "https://i.ytimg.com/vi/FaBz1HhtOrI/maxresdefault.jpg" },
      { id: "s111", order: 2, description: "В кипящий бульон добавьте нарезанный картофель. Варите 10 минут.", imageUrl: "https://avatars.mds.yandex.net/i?id=da5fb30458e12e153cbf61c8475dbe09_l-5210456-images-thumbs&n=13" },
      { id: "s112", order: 3, description: "Лук и морковь обжарьте на масле и добавьте в суп.", imageUrl: "https://img.povar.ru/uploads/8c/1c/90/17/zakusochnii_pirog_s_konservoi-232571.jpg" },
      { id: "s113", order: 4, description: "Добавьте плавленый сыр и мешайте до полного его растворения.", imageUrl: "https://povarok.ru/images/124531/full/syrnyi-sup-iz-plavlenykh-syrkov.jpg" },
      { id: "s114", order: 5, description: "Влейте сливки, верните курицу в кастрюлю, посолите и прогрейте еще 2-3 минуты.", imageUrl: "https://images.news.ru/2025/09/21/Ta2b2pt08gVTeB7GnI4Rhs7FHpD6u8HHuodA69Fe_780.png" }
    ],
    nutritionalInfo: { calories: 340, protein: 10, fat: 22, carbs: 28 },
    authorId: "u3",
    status: "approved",
    views: 1800,
    createdAt: "2024-05-25T12:30:00Z"
  },
  {
    id: "r24",
    title: "Крылышки Баффало",
    description: "Легендарная американская закуска. Острые, хрустящие крылышки в классическом соусе на основе кайенского перца и сливочного масла.",
    imageUrl: "https://static.1000.menu/img/content-v2/c1/25/17461/kurinye-krylyshki-baffalo-v-duxovke-klassicheskie_1727583174_16_htity18_max.jpg",
    category: "Закуски",
    prepTime: 15,
    cookTime: 35,
    difficulty: 2,
    portions: 4,
    ingredients: [
      { id: "i142", name: "Куриные крылья", amount: 1, unit: "кг" },
      { id: "i143", name: "Острый соус (типа Frank's RedHot)", amount: 100, unit: "мл" },
      { id: "i144", name: "Сливочное масло", amount: 50, unit: "г" },
      { id: "i145", name: "Мука", amount: 2, unit: "ст.л." },
      { id: "i146", name: "Паприка, чесночный порошок", amount: 1, unit: "ч.л." }
    ],
    steps: [
      { id: "s115", order: 1, description: "Крылышки разрежьте по суставам, обсушите и обваляйте в смеси муки и специй.", imageUrl: "https://img.povar.ru/uploads/e9/f4/aa/30/krilishki_quotbaffaloquot-396863.JPG" },
      { id: "s116", order: 2, description: "Выложите на противень и запекайте при 200°C около 30 минут до хрустящей корочки.", imageUrl: "https://cdn.food.ru/unsigned/fit/640/480/ce/0/czM6Ly9tZWRpYS9waWN0dXJlcy9yZWNpcGVzLzk1MzU2L3N0ZXBzLzVvVTdkSy5qcGVn.jpg" },
      { id: "s117", order: 3, description: "Для соуса растопите масло и смешайте его с острым соусом.", imageUrl: "https://img.povar.ru/uploads/70/46/1e/2f/sous_quotbuffaloquot-472153.jpg" },
      { id: "s118", order: 4, description: "Горячие крылышки переложите в миску, залейте соусом и тщательно перемешайте.", imageUrl: "https://img.povar.ru/uploads/09/a2/54/1e/kurinie_krilishki_quotbaffaloquot-336887.png" },
      { id: "s119", order: 5, description: "Подавайте с палочками сельдерея и соусом Блю Чиз.", imageUrl: "https://avatars.mds.yandex.net/i?id=a510ad4a0d6d401766c0d8eb7ee1694b_l-8159518-images-thumbs&n=13" }
    ],
    nutritionalInfo: { calories: 520, protein: 35, fat: 42, carbs: 5 },
    authorId: "u4",
    status: "approved",
    views: 2500,
    createdAt: "2024-06-01T17:00:00Z"
  },
  {
    id: "r25",
    title: "Хумус",
    description: "Полезная закуска из нута.",
    imageUrl: "https://i.ytimg.com/vi/d4soRs0ZBgE/maxresdefault.jpg",
    category: "Закуски",
    prepTime: 10,
    cookTime: 0,
    difficulty: 2,
    portions: 4,
    ingredients: [
      { id: "r25_i1", name: "Нут", amount: 400, unit: "г" },
      { id: "r25_i2", name: "Тахини", amount: 3, unit: "ст.л." }
    ],
    steps: [
      { id: "r25_s1", order: 1, description: "Замочите нут на ночь, затем отварите до полной мягкости (около 1.5-2 часов).", imageUrl: "https://povarok.ru/images/74442/full/khumus-iz-nuta-klassicheskii.jpg" },
      { id: "r25_s2", order: 2, description: "В чашу блендера положите отварной нут, тахини, лимонный сок, чеснок и немного ледяной воды.", imageUrl: "https://cdn2.botanichka.ru/wp-content/uploads/2019/06/zakuski-iz-nuta-07.jpg" },
      { id: "r25_s3", order: 3, description: "Взбейте до идеально гладкой, кремовой консистенции. При необходимости добавьте еще воды.", imageUrl: "https://i.ytimg.com/vi/23dLjAjSfaA/maxresdefault.jpg" },
      { id: "r25_s4", order: 4, description: "Выложите хумус в тарелку, сделайте углубление ложкой, полейте оливковым маслом и посыпьте паприкой.", imageUrl: "https://i.ytimg.com/vi/CGB9fA_mZPQ/maxresdefault.jpg" }
    ],
    nutritionalInfo: { calories: 280, protein: 10, fat: 22, carbs: 15 },
    authorId: "u5",
    status: "approved",
    views: 1900,
    createdAt: "2024-06-05T10:00:00Z"
  },
  {
    id: "r26",
    title: "Овсяная каша с ягодами",
    description: "Полезный и вкусный завтрак для отличного начала дня. Медленные углеводы дадут заряд энергии, а ягоды добавят витаминов.",
    imageUrl: "https://images.gastronom.ru/YZNj8OojvamFNnLZiJGNLZLoB1Eypy9vnLmC6DhSd6U/pr:recipe-cover-image/g:ce/rs:auto:0:0:0/L2Ntcy9hbGwtaW1hZ2VzLzhjYmY0ZjMxLWVmMTctNDk3MS1hMWI2LTQwMjA2NThkMGJhOS5qcGc.webp",
    category: "Завтрак",
    prepTime: 5,
    cookTime: 15,
    difficulty: 1,
    portions: 1,
    ingredients: [
      { id: "i153", name: "Овсяные хлопья (долгого варки)", amount: 50, unit: "г" },
      { id: "i154", name: "Молоко или вода", amount: 200, unit: "мл" },
      { id: "i155", name: "Мед или сироп", amount: 1, unit: "ст.л." },
      { id: "i156", name: "Свежие ягоды (малина, голубика)", amount: 50, unit: "г" },
      { id: "i157", name: "Орехи", amount: 10, unit: "г" }
    ],
    steps: [
      { id: "s125", order: 1, description: "В кастрюлю влейте молоко, доведите до кипения и всыпьте овсяные хлопья.", imageUrl: "https://povarok.ru/images/313948/full/gerkulesovaia-kasha-na-moloke.jpg" },
      { id: "s126", order: 2, description: "Варите на медленном огне 10-12 минут, постоянно помешивая, до желаемой густоты.", imageUrl: "https://cdn.food.ru/unsigned/fit/640/480/ce/0/czM6Ly9tZWRpYS9waWN0dXJlcy9yZWNpcGVzLzczNzQ3L3N0ZXBzL1EzZmR0eS5qcGVn.jpg" },
      { id: "s127", order: 3, description: "Накройте крышкой и дайте каше настояться 5 минут.", imageUrl: "https://povarok.ru/images/313949/full/gerkulesovaia-kasha-na-moloke.jpg" },
      { id: "s128", order: 4, description: "Переложите в тарелку, добавьте мед, украсьте ягодами и орехами.", imageUrl: "https://static.1000.menu/res/640/img/content-v2/a5/74/62734/ovsyanaya-kasha-s-yagodami-na-moloke_1644659759_7_max.jpg" }
    ],
    nutritionalInfo: { calories: 240, protein: 8, fat: 6, carbs: 42 },
    authorId: "u3",
    status: "approved",
    views: 3100,
    createdAt: "2024-06-10T08:00:00Z"
  },
  {
    id: "r27",
    title: "Шарлотка с яблоками",
    description: "Самый простой и любимый яблочный пирог. Пышный бисквит и много сочных яблок с ароматом корицы.",
    imageUrl: "https://images.news.ru/2025/09/23/QY7Pn9LBzg9Q5AfAiu4QTWJbPbYKLubJVT3nKNJf_780.png",
    category: "Выпечка",
    prepTime: 15,
    cookTime: 45,
    difficulty: 2,
    portions: 8,
    ingredients: [
      { id: "i158", name: "Яблоки (кислые)", amount: 4, unit: "шт" },
      { id: "i159", name: "Яйца", amount: 4, unit: "шт" },
      { id: "i160", name: "Сахар", amount: 1, unit: "стакан" },
      { id: "i161", name: "Мука", amount: 1, unit: "стакан" },
      { id: "i162", name: "Корица", amount: 1, unit: "ч.л." }
    ],
    steps: [
      { id: "s129", order: 1, description: "Яблоки очистите от сердцевины и нарежьте тонкими ломтиками. Посыпьте корицей.", imageUrl: "https://avatars.mds.yandex.net/i?id=6cb4ad6dad4ed5db037d2857c48d3f090f423d3d-5392366-images-thumbs&n=13" },
      { id: "s130", order: 2, description: "Яйца взбивайте с сахаром миксером не менее 5-7 минут до пышной белой пены.", imageUrl: "https://povarok.ru/images/366395/full/sharlotka.jpg" },
      { id: "s131", order: 3, description: "Аккуратно лопаткой вмешайте просеянную муку в яичную массу движениями снизу вверх.", imageUrl: "https://static.1000.menu/img/content-v2/9c/26/24902/biskvit-na-yaicax-klassicheskii_1646545358_3_max.jpg" },
      { id: "s132", order: 4, description: "Форму смажьте маслом, выложите яблоки и залейте тестом.", imageUrl: "https://avatars.mds.yandex.net/i?id=d38ce054dba1056ca6c346531729d9a7_l-9852755-images-thumbs&n=13" },
      { id: "s133", order: 5, description: "Выпекайте при 180°C около 40 минут. Готовность проверьте деревянной шпажкой.", imageUrl: "https://static.1000.menu/files/user-v2/24/af/954651/foto/f_27-05-2025-12-24-38.1748348681.jpg" }
    ],
    nutritionalInfo: { calories: 210, protein: 5, fat: 8, carbs: 35 },
    authorId: "u1",
    status: "approved",
    views: 4500,
    createdAt: "2024-06-15T14:00:00Z"
  },
  {
    id: "r28",
    title: "Омлет с овощами",
    description: "Сытный и полезный завтрак. Пышный омлет с яркими болгарскими перцами, томатами и свежей зеленью.",
    imageUrl: "https://i.ytimg.com/vi/ZZmSuYtD8AM/maxresdefault.jpg",
    category: "Завтрак",
    prepTime: 10,
    cookTime: 10,
    difficulty: 1,
    portions: 1,
    ingredients: [
      { id: "i163", name: "Яйца куриные", amount: 3, unit: "шт" },
      { id: "i164", name: "Молоко", amount: 50, unit: "мл" },
      { id: "i165", name: "Болгарский перец", amount: 0.5, unit: "шт" },
      { id: "i166", name: "Помидор", amount: 1, unit: "шт" },
      { id: "i167", name: "Сыр тертый", amount: 30, unit: "г" }
    ],
    steps: [
      { id: "s134", order: 1, description: "Овощи нарежьте небольшими кубиками и обжарьте на сковороде до мягкости.", imageUrl: "https://img.povar.ru/uploads/11/e2/b3/c8/salat_iz_jarenih_ovoshei-592230.jpeg" },
      { id: "s135", order: 2, description: "Яйца взбейте с молоком и солью до однородности.", imageUrl: "https://avatars.mds.yandex.net/i?id=b627896435d3c132a7d8c8b621908087814621ec-4228658-images-thumbs&n=13" },
      { id: "s136", order: 3, description: "Залейте овощи яичной смесью, посыпьте сыром.", imageUrl: "https://images.gastronom.ru/ExpdZpJ-KtA0Pwwx66hko1cVYX1oJeSaHrADOUheWjA/pr:recipe-step-image/g:ce/rs:auto:0:0:0/L2Ntcy9hbGwtaW1hZ2VzLzkyOTQyN2Y5LTYyNmItNGY4My04ZDk1LWQ5YzE4N2U5NzNiYy5qcGc.webp" },
      { id: "s137", order: 4, description: "Готовьте под крышкой на медленном огне 5-7 минут до готовности.", imageUrl: "https://avatars.mds.yandex.net/i?id=6e7f18e223812b22a7f2e5f678e3ecd6790f60c6-4220247-images-thumbs&n=13" }
    ],
    nutritionalInfo: { calories: 260, protein: 18, fat: 18, carbs: 6 },
    authorId: "u2",
    status: "approved",
    views: 1200,
    createdAt: "2024-06-20T09:00:00Z"
  },
  {
    id: "r29",
    title: "Том Ям Кунг",
    description: "Знаменитый тайский суп. Острый, кислый и невероятно ароматный, с креветками, грибами и кокосовым молоком.",
    imageUrl: "https://cdnn21.img.ria.ru/images/07e9/02/04/1997252250_0:114:3072:1842_1920x0_80_0_0_6b247d0020b250b5ce6fd87caee030c8.jpg",
    category: "Суп",
    prepTime: 20,
    cookTime: 25,
    difficulty: 5,
    portions: 2,
    ingredients: [
      { id: "i168", name: "Креветки тигровые", amount: 300, unit: "г" },
      { id: "i169", name: "Грибы вешенки или шампиньоны", amount: 200, unit: "г" },
      { id: "i170", name: "Кокосовое молоко", amount: 200, unit: "мл" },
      { id: "i171", name: "Паста Том Ям", amount: 2, unit: "ст.л." },
      { id: "i172", name: "Лемонграсс, листья лайма", amount: 1, unit: "по вкусу" }
    ],
    steps: [
      { id: "s138", order: 1, description: "В кипящий бульон или воду добавьте лемонграсс, имбирь и листья лайма. Варите 5 минут.", imageUrl: "https://sovkusom.ru/wp-content/uploads/recepty/d/domashniy-tom-yam/1.jpg" },
      { id: "s139", order: 2, description: "Добавьте пасту Том Ям и перемешайте до растворения.", imageUrl: "https://img.povar.ru/mobile/73/dd/a7/eb/sup_tom_yam-823381.jpg" },
      { id: "s140", order: 3, description: "Положите нарезанные грибы и варите еще 5 минут.", imageUrl: "https://povarok.ru/images/131153/full/tom-iam-s-krevetkami.jpg" },
      { id: "s141", order: 4, description: "Добавьте креветки и кокосовое молоко. Доведите до кипения и сразу снимите с огня.", imageUrl: "https://i.ytimg.com/vi/8f2knq2o1LI/maxresdefault.jpg" },
      { id: "s142", order: 5, description: "Подавайте с кинзой и долькой лайма. Отдельно подайте отварной рис.", imageUrl: "https://cdnn21.img.ria.ru/images/07e9/02/04/1997252250_0:114:3072:1842_1920x0_80_0_0_6b247d0020b250b5ce6fd87caee030c8.jpg" }
    ],
    nutritionalInfo: { calories: 350, protein: 25, fat: 22, carbs: 12 },
    authorId: "u3",
    status: "approved",
    views: 2900,
    createdAt: "2024-06-25T13:00:00Z"
  },
  {
    id: "r30",
    title: "Гречка с грибами и луком",
    description: "Классическое блюдо русской кухни. Полезная гречневая крупа, пропитанная ароматом обжаренных лесных грибов или шампиньонов.",
    imageUrl: "https://gipfel.ru/upload/iblock/6a3/0h4yv2q51p0y6md8a1w4c5zjfsuc3dod.jpg",
    category: "Здоровая еда",
    prepTime: 10,
    cookTime: 30,
    difficulty: 1,
    portions: 2,
    ingredients: [
      { id: "i173", name: "Гречневая крупа", amount: 200, unit: "г" },
      { id: "i174", name: "Шампиньоны", amount: 300, unit: "г" },
      { id: "i175", name: "Лук репчатый", amount: 1, unit: "шт" },
      { id: "i176", name: "Сливочное масло", amount: 30, unit: "г" },
      { id: "i177", name: "Зелень", amount: 1, unit: "по вкусу" }
    ],
    steps: [
      { id: "s143", order: 1, description: "Гречку промойте и отварите в подсоленной воде (пропорция 1:2) до готовности.", imageUrl: "https://static.1000.menu/img/content-v2/2f/75/85783/grechka-v-kastrule-na-vode-rassypchataya_1715801364_1_j98aunv_max.jpg" },
      { id: "s144", order: 2, description: "Лук мелко нарежьте, грибы нарежьте пластинками.", imageUrl: "https://img.povar.ru/uploads/b8/84/2f/40/shampinoni_jarenie_s_lukom-866660.jpg" },
      { id: "s145", order: 3, description: "Обжарьте лук до золотистого цвета, добавьте грибы и жарьте до полного испарения жидкости.", imageUrl: "https://avatars.mds.yandex.net/i?id=ea9992521a4a2902982f693c55b9be53_l-5234281-images-thumbs&n=13" },
      { id: "s146", order: 4, description: "Смешайте готовую гречку с грибной зажаркой, добавьте кусочек сливочного масла.", imageUrl: "https://avatars.mds.yandex.net/i?id=79b62359c738945d32308a7c5914335a_l-5235360-images-thumbs&n=13" },
      { id: "s147", order: 5, description: "Дайте блюду настояться под крышкой 5-10 минут перед подачей.", imageUrl: "https://gipfel.ru/upload/iblock/6a3/0h4yv2q51p0y6md8a1w4c5zjfsuc3dod.jpg" }
    ],
    nutritionalInfo: { calories: 310, protein: 12, fat: 8, carbs: 45 },
    authorId: "u4",
    status: "approved",
    views: 1500,
    createdAt: "2024-07-01T12:00:00Z"
  },
  {
    id: "r31",
    title: "Рататуй",
    description: "Запеченные овощи по-французски.",
    imageUrl: "https://images.news.ru/2025/08/28/4ONlCI20Z9iFQNJ0S8sqhVJ83TD5fZ5pgjRFeB8b_780.png",
    category: "Ужин",
    prepTime: 20,
    cookTime: 40,
    difficulty: 3,
    portions: 4,
    ingredients: [
      { id: "r31_i1", name: "Баклажан", amount: 1, unit: "шт" },
      { id: "r31_i2", name: "Кабачок", amount: 1, unit: "шт" }
    ],
    steps: [
      { id: "r31_s1", order: 1, description: "Нарежьте баклажаны, кабачки и помидоры тонкими кружочками одинаковой толщины.", imageUrl: "https://avatars.mds.yandex.net/i?id=45cf4d361b08176ffa84a65465cb1926d9b82b1f-5331946-images-thumbs&n=13" },
      { id: "r31_s2", order: 2, description: "Приготовьте соус из обжаренного лука, перца и томатов, выложите его на дно формы.", imageUrl: "https://img.povar.ru/mobile/8e/bc/db/28/pasta_s_frikadelkami_v_tomatnom_souse-176542.jpg" },
      { id: "r31_s3", order: 3, description: "Выложите овощи в форму по спирали, чередуя их между собой.", imageUrl: "https://klopotenko.com/wp-content/uploads/2019/08/IMG_5170.jpeg" },
      { id: "r31_s4", order: 4, description: "Полейте овощи маслом с чесноком и травами, накройте пергаментом и запекайте 40-50 минут.", imageUrl: "https://img.povar.ru/mobile/4c/af/7f/91/ratatui_v_aerogrile-869766.jpg" }
    ],
    nutritionalInfo: { calories: 180, protein: 4, fat: 10, carbs: 18 },
    authorId: "u5",
    status: "approved",
    views: 2100,
    createdAt: "2024-07-05T18:00:00Z"
  },
  {
    id: "r32",
    title: "Медовик",
    description: "Классический многослойный торт.",
    imageUrl: "https://avatars.mds.yandex.net/i?id=1efb2e26951b745b7e9569aa59d94be2_l-10805126-images-thumbs&n=13",
    category: "Выпечка",
    prepTime: 60,
    cookTime: 30,
    difficulty: 5,
    portions: 12,
    ingredients: [
      { id: "r32_i1", name: "Мед", amount: 3, unit: "ст.л." },
      { id: "r32_i2", name: "Сметана", amount: 500, unit: "г" }
    ],
    steps: [
      { id: "r32_s1", order: 1, description: "Растопите мед с маслом и сахаром, добавьте соду и яйца, замесите мягкое тесто.", imageUrl: "https://povarok.ru/images/281196/full/postnyi-tort-medovik.jpg" },
      { id: "r32_s2", order: 2, description: "Разделите тесто на 8-10 частей, тонко раскатайте каждую и выпекайте по 3-5 минут.", imageUrl: "https://avatars.mds.yandex.net/i?id=1ee29ed66162729d4a50333139e5894f_l-5234536-images-thumbs&n=13" },
      { id: "r32_s3", order: 3, description: "Приготовьте крем, взбив жирную сметану с сахарной пудрой.", imageUrl: "https://avatars.mds.yandex.net/i?id=d8f5db9e43c5f21e1b46a99097e4231c_l-8496968-images-thumbs&n=13" },
      { id: "r32_s4", order: 4, description: "Промажьте коржи кремом, посыпьте крошкой и оставьте пропитываться на 12 часов.", imageUrl: "https://cdn.lifehacker.ru/wp-content/uploads/2017/08/mazhem-korzhi_1502346128.jpg" }
    ],
    nutritionalInfo: { calories: 450, protein: 6, fat: 25, carbs: 55 },
    authorId: "u1",
    status: "approved",
    views: 3800,
    createdAt: "2024-07-10T15:00:00Z"
  },
  {
    id: "r33",
    title: "Творожная запеканка",
    description: "Вкус детства. Нежная, воздушная запеканка с изюмом и ванилью. Идеально со сметаной или сгущенкой.",
    imageUrl: "https://cs13.pikabu.ru/post_img/2023/06/30/7/og_og_1688120242213334885.jpg",
    category: "Завтрак",
    prepTime: 15,
    cookTime: 40,
    difficulty: 2,
    portions: 4,
    ingredients: [
      { id: "r33_i1", name: "Творог", amount: 600, unit: "г" },
      { id: "r33_i2", name: "Манная крупа", amount: 3, unit: "ст.л." },
      { id: "r33_i3", name: "Яйца", amount: 2, unit: "шт" },
      { id: "r33_i4", name: "Сахар", amount: 100, unit: "г" },
      { id: "r33_i5", name: "Изюм", amount: 50, unit: "г" }
    ],
    steps: [
      { id: "r33_s1", order: 1, description: "Творог протрите через сито, смешайте с яйцами и сахаром.", imageUrl: "https://avatars.mds.yandex.net/i?id=f37815ceeb5f3deb2788766ae7ebf7d488087311-5439293-images-thumbs&n=13" },
      { id: "r33_s2", order: 2, description: "Добавьте манку и изюм, оставьте на 15 минут для набухания манки.", imageUrl: "https://avatars.mds.yandex.net/i?id=0457ad5fc4f00e2f633fb935ab1b2fb6_l-5175132-images-thumbs&n=13" },
      { id: "r33_s3", order: 3, description: "Выложите в смазанную форму и запекайте при 180°C до золотистого цвета.", imageUrl: "https://img.povar.ru/uploads/a8/4b/01/80/tvorojnaya_zapekanka_dlya_hudeiushih-802265.JPG" }
    ],
    nutritionalInfo: { calories: 280, protein: 22, fat: 10, carbs: 32 },
    authorId: "u1",
    status: "approved",
    views: 1500,
    createdAt: "2024-07-15T09:00:00Z"
  },
  {
    id: "r34",
    title: "Тосты с авокадо и яйцом пашот",
    description: "Модный и очень полезный завтрак. Хрустящий цельнозерновой хлеб, нежный крем из авокадо и идеальное яйцо пашот.",
    imageUrl: "https://cdn.lifehacker.ru/wp-content/uploads/2024/03/shutterstock_2333826027-1_1711360979-e1711361015330.jpg",
    category: "Завтрак",
    prepTime: 10,
    cookTime: 10,
    difficulty: 3,
    portions: 1,
    ingredients: [
      { id: "r34_i1", name: "Авокадо", amount: 1, unit: "шт" },
      { id: "r34_i2", name: "Яйцо", amount: 1, unit: "шт" },
      { id: "r34_i3", name: "Хлеб цельнозерновой", amount: 2, unit: "ломтика" },
      { id: "r34_i4", name: "Лимонный сок", amount: 1, unit: "ч.л." }
    ],
    steps: [
      { id: "r34_s1", order: 1, description: "Авокадо разомните вилкой с лимонным соком, солью и перцем.", imageUrl: "https://avatars.dzeninfra.ru/get-zen_doc/3473073/pub_60461df29e9a5735c138dcd4_6046232d58285736dda061f4/scale_1200" },
      { id: "r34_s2", order: 2, description: "Хлеб подсушите в тостере или на сковороде.", imageUrl: "https://i.ytimg.com/vi/8cYcwmZPnyU/maxresdefault.jpg" },
      { id: "r34_s3", order: 3, description: "Сварите яйцо пашот в слабо кипящей воде с уксусом (3-4 минуты).", imageUrl: "https://halvamedia.sovcombank.ru/shutterstock-1707252397-17219806329Vldw.jpg" },
      { id: "r34_s4", order: 4, description: "На тост выложите авокадо, сверху яйцо пашот. Посыпьте семенами или хлопьями перца.", imageUrl: "https://static.1000.menu/files/user-v2/64/0e/883946/foto/f_27-10-2024-07-08-06.1730056087.jpg" }
    ],
    nutritionalInfo: { calories: 320, protein: 12, fat: 22, carbs: 24 },
    authorId: "u2",
    status: "approved",
    views: 2200,
    createdAt: "2024-07-20T08:30:00Z"
  },
  {
    id: "r35",
    title: "Гуакамоле",
    description: "Мексиканский соус из авокадо.",
    imageUrl: "https://avatars.mds.yandex.net/i?id=4425f2071a6ae691b37b579c1f5642aa8bcc1f57-7989082-images-thumbs&n=13",
    category: "Закуски",
    prepTime: 10,
    cookTime: 0,
    difficulty: 1,
    portions: 2,
    ingredients: [
      { id: "r35_i1", name: "Авокадо", amount: 2, unit: "шт" },
      { id: "r35_i2", name: "Лайм", amount: 1, unit: "шт" }
    ],
    steps: [
      { id: "r35_s1", order: 1, description: "Разрежьте авокадо, удалите косточку и разомните мякоть вилкой в грубое пюре.", imageUrl: "https://i.ytimg.com/vi/mwcr_JqoOQI/maxresdefault.jpg" },
      { id: "r35_s2", order: 2, description: "Мелко нарежьте красный лук, помидор без семян и кинзу.", imageUrl: "https://img.povar.ru/uploads/c7/ae/ea/2f/salat_iz_pomidorov_s_krasnim_lukom_i_kunjutom-529034.jpg" },
      { id: "r35_s3", order: 3, description: "Смешайте авокадо с овощами, добавьте сок лайма, соль и острый перец.", imageUrl: "https://www.comfortclub.ru/_pu/15/59651011.jpg" },
      { id: "r35_s4", order: 4, description: "Подавайте немедленно с кукурузными чипсами начос.", imageUrl: "https://avatars.mds.yandex.net/i?id=571db620559c9acd5ac6bf97b27001ce_l-5220694-images-thumbs&n=13" }
    ],
    nutritionalInfo: { calories: 220, protein: 3, fat: 20, carbs: 8 },
    authorId: "u2",
    status: "approved",
    views: 1600,
    createdAt: "2024-07-15T11:00:00Z"
  },
  {
    id: "r36",
    title: "Смузи боул",
    description: "Яркий и полезный завтрак.",
    imageUrl: "https://img.povar.ru/main-micro/5e/cc/65/a6/smuzi-boul_s_bananom_i_yagodami-766168.jpg",
    category: "Здоровая еда",
    prepTime: 10,
    cookTime: 0,
    difficulty: 1,
    portions: 1,
    ingredients: [
      { id: "r36_i1", name: "Замороженный банан", amount: 1, unit: "шт" },
      { id: "r36_i2", name: "Ягоды", amount: 100, unit: "г" }
    ],
    steps: [
      { id: "r36_s1", order: 1, description: "В блендере взбейте замороженный банан, горсть ягод и немного растительного молока до состояния густого крема.", imageUrl: "https://img.povar.ru/mobile/25/bc/7c/4b/molochnii_kokteil_s_malinoi_i_bananom-796066.jpg" },
      { id: "r36_s2", order: 2, description: "Переложите массу в глубокую миску и разровняйте поверхность.", imageUrl: "https://cdn.кухня.рф/preview/5f4f7788-eeac-481f-accf-8e4d46cf9f4d.webp" },
      { id: "r36_s3", order: 3, description: "Красиво выложите сверху свежие ягоды, кусочки фруктов, орехи и семена чиа.", imageUrl: "https://avatars.mds.yandex.net/i?id=825cad7a44e55d750532ad1ae9998c7fdb60e3bd-2429503-images-thumbs&n=13" }
    ],
    nutritionalInfo: { calories: 280, protein: 5, fat: 4, carbs: 55 },
    authorId: "u3",
    status: "approved",
    views: 2400,
    createdAt: "2024-07-20T09:30:00Z"
  },
  {
    id: "r37",
    title: "Фахитас",
    description: "Мексиканское блюдо с говядиной.",
    imageUrl: "https://avatars.mds.yandex.net/get-vertis-journal/4471904/4ce27271-9184-456d-a913-e75d1bca940a.jpg/1600x1600",
    category: "Ужин",
    prepTime: 15,
    cookTime: 15,
    difficulty: 3,
    portions: 2,
    ingredients: [
      { id: "r37_i1", name: "Говядина", amount: 400, unit: "г" },
      { id: "r37_i2", name: "Тортильи", amount: 4, unit: "шт" }
    ],
    steps: [
      { id: "r37_s1", order: 1, description: "Нарежьте говядину и болгарский перец длинными тонкими полосками.", imageUrl: "https://img.povar.ru/uploads/f3/8c/68/db/prajskii_salat_s_govyadinoi-151602.jpg" },
      { id: "r37_s2", order: 2, description: "Обжарьте мясо на раскаленной сковороде до румяной корочки, затем добавьте перец и лук.", imageUrl: "https://img.povar.ru/uploads/2b/5d/53/d1/jarenaya_svinina_kusochkami_s_lukom-798656.jpg" },
      { id: "r37_s3", order: 3, description: "Добавьте специи (кумин, паприку) и немного соевого соуса, жарьте еще 2-3 минуты.", imageUrl: "https://img.povar.ru/mobile/b5/c6/2f/13/govyadina_s_imbirem-543126.png" },
      { id: "r37_s4", order: 4, description: "Подавайте горячую начинку в теплых тортильях со сметаной и сальсой.", imageUrl: "https://i.ytimg.com/vi/0rMqT-Iwyqw/maxresdefault.jpg" }
    ],
    nutritionalInfo: { calories: 480, protein: 32, fat: 25, carbs: 35 },
    authorId: "u4",
    status: "approved",
    views: 1800,
    createdAt: "2024-07-25T19:00:00Z"
  },
  {
    id: "r38",
    title: "Минестроне",
    description: "Итальянский овощной суп.",
    imageUrl: "https://avatars.mds.yandex.net/get-vertis-journal/3911415/1727cfec-efeb-468f-8a89-992da1294470.jpg/1600x1600",
    category: "Суп",
    prepTime: 20,
    cookTime: 40,
    difficulty: 2,
    portions: 4,
    ingredients: [
      { id: "r38_i1", name: "Овощной микс", amount: 500, unit: "г" },
      { id: "r38_i2", name: "Мелкая паста", amount: 100, unit: "г" }
    ],
    steps: [
      { id: "r38_s1", order: 1, description: "Нарежьте лук, морковь, сельдерей и кабачок небольшими кубиками.", imageUrl: "https://povarok.ru/images/270367/full/kabachkovaia-ikra-kusochkami.jpg" },
      { id: "r38_s2", order: 2, description: "Обжарьте овощи на оливковом масле в кастрюле с толстым дном до мягкости.", imageUrl: "https://avatars.mds.yandex.net/i?id=cb75c3f286d64cd31b385f9b3fef97b95a93f6a6-4240295-images-thumbs&n=13" },
      { id: "r38_s3", order: 3, description: "Добавьте томаты в собственном соку, фасоль и залейте овощным бульоном. Варите 20 минут.", imageUrl: "https://www.mir-krup.ru/upload/iblock/ad7/ad7c3a8c889c529647af620782c5a348.JPG" },
      { id: "r38_s4", order: 4, description: "Всыпьте мелкую пасту и варите до состояния аль денте. Подавайте с тертым пармезаном.", imageUrl: "https://menunedeli.ru/wp-content/uploads/2022/06/IMG_7500-1000x667.jpg" }
    ],
    nutritionalInfo: { calories: 240, protein: 8, fat: 10, carbs: 32 },
    authorId: "u5",
    status: "approved",
    views: 1300,
    createdAt: "2024-08-01T13:00:00Z"
  },
  {
    id: "r39",
    title: "Брауни",
    description: "Шоколадный десерт с влажной серединкой.",
    imageUrl: "https://www.koolinar.ru/all_image/article/3/3858/article-438c74c2-479b-4d4f-bf31-1b0c77f71dad_large.webp",
    category: "Выпечка",
    prepTime: 15,
    cookTime: 25,
    difficulty: 3,
    portions: 9,
    ingredients: [
      { id: "r39_i1", name: "Темный шоколад", amount: 200, unit: "г" },
      { id: "r39_i2", name: "Сливочное масло", amount: 150, unit: "г" }
    ],
    steps: [
      { id: "r39_s1", order: 1, description: "Растопите шоколад и сливочное масло на водяной бане до однородности.", imageUrl: "https://cdn.tveda.ru/thumbs/923/923bb2567e6f0aedc28d29fc1653395d/99fabab5e52ed43637d2372a05dcc951.jpg" },
      { id: "r39_s2", order: 2, description: "Взбейте яйца с сахаром, добавьте шоколадную массу и аккуратно вмешайте муку.", imageUrl: "https://img.povar.ru/uploads/aa/bd/4b/0f/shokoladnii_fondan-323116.jpg" },
      { id: "r39_s3", order: 3, description: "Вылейте тесто в форму и выпекайте при 180°C около 20-25 минут.", imageUrl: "https://img.povar.ru/uploads/f8/b6/30/4a/vkusneishii_shokoladnii_quotbrauniquot-499925.jpg" },
      { id: "r39_s4", order: 4, description: "Дайте брауни полностью остыть перед нарезкой, чтобы серединка осталась влажной.", imageUrl: "https://i.ytimg.com/vi/1TbD2_s2C-E/maxresdefault.jpg" }
    ],
    nutritionalInfo: { calories: 380, protein: 5, fat: 28, carbs: 32 },
    authorId: "u1",
    status: "approved",
    views: 5200,
    createdAt: "2024-08-05T16:00:00Z"
  },
  {
    id: "r40",
    title: "Поке с тунцом",
    description: "Гавайское блюдо с сырой рыбой.",
    imageUrl: "https://www.osteria.ru/upload/resize_cache/webp/iblock/4e2/wr226u7wso52yy77ukgo18659r0wma1e/IMG309.webp",
    category: "Здоровая еда",
    prepTime: 20,
    cookTime: 0,
    difficulty: 3,
    portions: 1,
    ingredients: [
      { id: "r40_i1", name: "Тунец", amount: 150, unit: "г" },
      { id: "r40_i2", name: "Рис для суши", amount: 100, unit: "г" }
    ],
    steps: [
      { id: "r40_s1", order: 1, description: "Отварите рис для суши согласно инструкции на упаковке и заправьте рисовым уксусом.", imageUrl: "https://img.povar.ru/uploads/d3/e9/f3/36/ris_dlya_sushi-856821.jpg" },
      { id: "r40_s2", order: 2, description: "Нарежьте свежий тунец кубиками, авокадо ломтиками, а огурец соломкой.", imageUrl: "https://cdn.food.ru/unsigned/fit/640/480/ce/0/czM6Ly9tZWRpYS9waWN0dXJlcy9yZWNpcGVzLzMwMTEyL3N0ZXBzL3dWNHllaS5qcGc.jpg" },
      { id: "r40_s3", order: 3, description: "Выложите рис в боул, сверху распределите рыбу, овощи, бобы эдамаме и чуку.", imageUrl: "https://avatars.mds.yandex.net/i?id=8650e4f84bb1178d487172593b83008d_l-5363854-images-thumbs&n=13" },
      { id: "r40_s4", order: 4, description: "Полейте соусом понзу или спайси-майонезом, посыпьте кунжутом.", imageUrl: "https://avatars.mds.yandex.net/i?id=8650e4f84bb1178d487172593b83008d_l-5363854-images-thumbs&n=13" }
    ],
    nutritionalInfo: { calories: 420, protein: 28, fat: 15, carbs: 45 },
    authorId: "u2",
    status: "approved",
    views: 2700,
    createdAt: "2024-08-10T12:00:00Z"
  },
  {
    id: "r41",
    title: "Утка с яблоками",
    description: "Праздничное запеченное блюдо.",
    imageUrl: "https://avatars.mds.yandex.net/get-vertis-journal/4080458/a0f7046f-3a22-41ba-9d33-863a50ae5134.jpg/1600x1600",
    category: "Ужин",
    prepTime: 30,
    cookTime: 120,
    difficulty: 4,
    portions: 4,
    ingredients: [
      { id: "r41_i1", name: "Целая утка", amount: 1, unit: "шт" },
      { id: "r41_i2", name: "Яблоки кислые", amount: 5, unit: "шт" }
    ],
    steps: [
      { id: "r41_s1", order: 1, description: "Утку тщательно промойте, обсушите и натрите смесью соли, перца и сушеных трав.", imageUrl: "https://static.1000.menu/img/content-v2/cb/26/87308/utka-po-pekinski_1719771464_2_1w02dcn_max.jpg" },
      { id: "r41_s2", order: 2, description: "Яблоки нарежьте крупными дольками и плотно нафаршируйте ими брюшко утки.", imageUrl: "https://img.povar.ru/mobile/63/6b/a0/cc/utka_s_yablokami_v_rukave-885815.JPG" },
      { id: "r41_s3", order: 3, description: "Запекайте утку в духовке при 180°C, периодически поливая вытапливающимся жиром.", imageUrl: "https://img.povar.ru/uploads/da/be/25/8f/utka_s_limonom_v_duhovke-762151.JPG" },
      { id: "r41_s4", order: 4, description: "За 15 минут до готовности смажьте утку медом для получения глянцевой корочки.", imageUrl: "https://i.ytimg.com/vi/XUDH_2boiP0/maxresdefault.jpg" }
    ],
    nutritionalInfo: { calories: 680, protein: 45, fat: 55, carbs: 10 },
    authorId: "u3",
    status: "approved",
    views: 1900,
    createdAt: "2024-08-15T18:30:00Z"
  },
  {
    id: "r42",
    title: "Гаспачо",
    description: "Холодный испанский суп.",
    imageUrl: "https://avatars.mds.yandex.net/get-vertis-journal/4471904/216d3321-a2cc-4fb1-89de-6e08b5185826.jpg/1600x1600",
    category: "Суп",
    prepTime: 15,
    cookTime: 0,
    difficulty: 1,
    portions: 2,
    ingredients: [
      { id: "r42_i1", name: "Спелые томаты", amount: 1, unit: "кг" },
      { id: "r42_i2", name: "Огурец", amount: 1, unit: "шт" }
    ],
    steps: [
      { id: "r42_s1", order: 1, description: "На помидорах сделайте надрезы, обдайте кипятком и снимите кожицу.", imageUrl: "https://i.ytimg.com/vi/ud74bs2ykuA/maxresdefault.jpg" },
      { id: "r42_s2", order: 2, description: "Очистите огурцы и болгарский перец, нарежьте овощи крупными кусками.", imageUrl: "https://static.1000.menu/img/content-v2/65/d8/89425/ovoschi-krupnymi-kuskami-v-duxovke_1724860514_4_l353ldg_max.jpg" },
      { id: "r42_s3", order: 3, description: "Взбейте овощи в блендере с добавлением чеснока, оливкового масла и винного уксуса.", imageUrl: "https://avatars.mds.yandex.net/i?id=753bc045e8f3a1331216d1dc50a404cd_l-8240493-images-thumbs&n=13" },
      { id: "r42_s4", order: 4, description: "Протрите массу через сито для идеальной гладкости и охлаждайте минимум 2 часа.", imageUrl: "https://img.povar.ru/uploads/97/b3/36/f1/postnii_gaspacho-574251.jpeg" }
    ],
    nutritionalInfo: { calories: 150, protein: 4, fat: 8, carbs: 18 },
    authorId: "u4",
    status: "approved",
    views: 2100,
    createdAt: "2024-08-20T14:00:00Z"
  },
  {
    id: "r43",
    title: "Тирамису",
    description: "Итальянский кофейный десерт.",
    imageUrl: "https://i.ytimg.com/vi/3gp50W4Rlm4/maxresdefault.jpg",
    category: "Выпечка",
    prepTime: 30,
    cookTime: 0,
    difficulty: 4,
    portions: 6,
    ingredients: [
      { id: "r43_i1", name: "Маскарпоне", amount: 500, unit: "г" },
      { id: "r43_i2", name: "Печенье Савоярди", amount: 200, unit: "г" }
    ],
    steps: [
      { id: "r43_s1", order: 1, description: "Заварите крепкий кофе эспрессо и дайте ему полностью остыть.", imageUrl: "https://avatars.mds.yandex.net/i?id=a8ac80666c6a9ac621ec38aab2d90ea7_l-3370318-images-thumbs&n=13" },
      { id: "r43_s2", order: 2, description: "Взбейте желтки с сахаром, добавьте маскарпоне и аккуратно вмешайте взбитые белки.", imageUrl: "https://studfile.net/html/2706/1035/html_3VWFc9mBmQ.iSrV/htmlconvd-6_Kt0j_html_df7db463cc079ae6.jpg" },
      { id: "r43_s3", order: 3, description: "Быстро обмакивайте печенье савоярди в кофе и выкладывайте плотным слоем в форму.", imageUrl: "https://avatars.mds.yandex.net/i?id=4a8ce4d79d947ab50da1530bc0c83603_l-5233025-images-thumbs&n=13" },
      { id: "r43_s4", order: 4, description: "Покройте слоем крема, повторите слои и посыпьте какао-порошком перед подачей.", imageUrl: "https://studfile.net/html/2706/1035/html_3VWFc9mBmQ.iSrV/htmlconvd-6_Kt0j_html_c9c718f1eeb53006.jpg" }
    ],
    nutritionalInfo: { calories: 420, protein: 8, fat: 32, carbs: 35 },
    authorId: "u5",
    status: "approved",
    views: 4800,
    createdAt: "2024-08-25T17:00:00Z"
  },
  {
    id: "r44",
    title: "Киш Лорен",
    description: "Французский открытый пирог.",
    imageUrl: "https://images.news.ru/2025/10/05/zqFggd57xluFFbTtneDMmHR4NN3iljAjugiZJnMS_780.png",
    category: "Выпечка",
    prepTime: 30,
    cookTime: 40,
    difficulty: 4,
    portions: 6,
    ingredients: [
      { id: "r44_i1", name: "Песочное тесто", amount: 300, unit: "г" },
      { id: "r44_i2", name: "Бекон", amount: 200, unit: "г" }
    ],
    steps: [
      { id: "r44_s1", order: 1, description: "Раскатайте песочное тесто, выложите в форму и сделайте бортики. Наколите вилкой.", imageUrl: "https://images.gastronom.ru/GGr0PquSiwbfugk6NNMWCNeGIFvtMIi37vpcxeaNqns/pr:recipe-step-image/g:ce/rs:auto:0:0:0/L2Ntcy9hbGwtaW1hZ2VzLzI2OGY0MmY4LTdhMjAtNGJiMC1iOTEyLTQ1MjUyN2U3YTAxNS5qcGc.webp" },
      { id: "r44_s2", order: 2, description: "Обжарьте бекон до хруста, выложите на дно формы вместе с тертым сыром.", imageUrl: "https://cdn.food.ru/unsigned/fit/640/480/ce/0/czM6Ly9tZWRpYS9waWN0dXJlcy9yZWNpcGVzLzkxOTQzL3N0ZXBzLzQ2Y1RKVy5qcGVn.jpg" },
      { id: "r44_s3", order: 3, description: "Взбейте яйца со сливками, добавьте мускатный орех и залейте начинку.", imageUrl: "https://vkusnoff.com/img/recepty/3073/step3.webp" },
      { id: "r44_s4", order: 4, description: "Запекайте при 180°C около 35-40 минут до золотистой корочки.", imageUrl: "https://img.povar.ru/uploads/56/66/bc/94/kish_loren-89442.jpg" }
    ],
    nutritionalInfo: { calories: 510, protein: 18, fat: 38, carbs: 25 },
    authorId: "u1",
    status: "approved",
    views: 1500,
    createdAt: "2024-09-01T13:00:00Z"
  },
  {
    id: "r45",
    title: "Фалафель",
    description: "Шарики из нута во фритюре.",
    imageUrl: "https://img.povar.ru/main-micro/aa/b0/6f/10/klassicheskii_falafel-654318.JPG",
    category: "Закуски",
    prepTime: 20,
    cookTime: 15,
    difficulty: 3,
    portions: 4,
    ingredients: [
      { id: "r45_i1", name: "Замоченный нут", amount: 500, unit: "г" },
      { id: "r45_i2", name: "Зелень", amount: 1, unit: "пучок" }
    ],
    steps: [
      { id: "r45_s1", order: 1, description: "Замоченный нут измельчите в блендере с луком, чесноком, кинзой и петрушкой.", imageUrl: "https://img.povar.ru/uploads/0d/c7/bf/6d/falafel_v_pite_s_salatom_i_pomidorom-792088.jpg" },
      { id: "r45_s2", order: 2, description: "Добавьте специи (кумин, кориандр), соль и немного муки, перемешайте.", imageUrl: "https://avatars.mds.yandex.net/i?id=e8ea978539566247bf003b681f2fc3fe_l-4696439-images-thumbs&n=13" },
      { id: "r45_s3", order: 3, description: "Сформируйте небольшие шарики и обжаривайте во фритюре до темно-золотистого цвета.", imageUrl: "https://static.1000.menu/img/content-v2/98/0d/20871/tvorojnye-shariki-vo-friture_1676183006_13_max.jpg" },
      { id: "r45_s4", order: 4, description: "Подавайте горячими с соусом тахини или в пите с овощами.", imageUrl: "https://img.povar.ru/mobile/39/34/4f/c9/falafel_s_tahini-814677.jpg" }
    ],
    nutritionalInfo: { calories: 340, protein: 15, fat: 20, carbs: 30 },
    authorId: "u2",
    status: "approved",
    views: 2200,
    createdAt: "2024-09-05T12:00:00Z"
  },
  {
    id: "r46",
    title: "Рамен",
    description: "Японский суп с лапшой.",
    imageUrl: "https://avatars.mds.yandex.net/i?id=1cfe69e0e5b0a10f691cfa387be8e4a9_l-4866855-images-thumbs&n=13",
    category: "Суп",
    prepTime: 30,
    cookTime: 60,
    difficulty: 5,
    portions: 2,
    ingredients: [
      { id: "r46_i1", name: "Лапша рамен", amount: 200, unit: "г" },
      { id: "r46_i2", name: "Свинина", amount: 300, unit: "г" }
    ],
    steps: [
      { id: "r46_s1", order: 1, description: "Сварите насыщенный бульон на свиных костях с добавлением имбиря и соевого соуса.", imageUrl: "https://avatars.mds.yandex.net/i?id=7da018977cd4c4033260f41a93565155_l-12714748-images-thumbs&n=13" },
      { id: "r46_s2", order: 2, description: "Отдельно отварите лапшу рамен до готовности.", imageUrl: "https://povarok.ru/images/126736/full/ramen-s-soevym-sousom.jpg" },
      { id: "r46_s3", order: 3, description: "Подготовьте топпинги: маринованное яйцо, ломтики обжаренной свинины, нори и зеленый лук.", imageUrl: "https://resizer.mail.ru/p/8b9ede75-702c-5fbd-9a60-6d3e1890fc27/AQAFLmVOaigTvfA8Nxi_G0yt-EKR_s_mf16ifeSlQdLIApp-MV2Yez5VVkarMW8oKKqMh7AuFbQws7gtNem-bu6dNHc.jpg" },
      { id: "r46_s4", order: 4, description: "Соберите рамен в глубокой миске, залив лапшу и топпинги горячим бульоном.", imageUrl: "https://www.koolinar.ru/all_image/article/4/4079/article-16318a3f-defd-4408-9b17-4d08c4fd4de3_large.jpg" }
    ],
    nutritionalInfo: { calories: 580, protein: 35, fat: 28, carbs: 50 },
    authorId: "u3",
    status: "approved",
    views: 4100,
    createdAt: "2024-09-10T19:00:00Z"
  },
  {
    id: "r47",
    title: "Чизкейк Нью-Йорк",
    description: "Классический сырный торт.",
    imageUrl: "https://i.ytimg.com/vi/Di9Uk9lmkLk/maxresdefault.jpg",
    category: "Выпечка",
    prepTime: 20,
    cookTime: 60,
    difficulty: 4,
    portions: 8,
    ingredients: [
      { id: "r47_i1", name: "Сливочный сыр", amount: 600, unit: "г" },
      { id: "r47_i2", name: "Песочное печенье", amount: 200, unit: "г" }
    ],
    steps: [
      { id: "r47_s1", order: 1, description: "Измельчите песочное печенье в крошку и смешайте с растопленным сливочным маслом.", imageUrl: "https://img.povar.ru/uploads/53/20/78/ea/chizkeik_v_aerogrile-887349.JPG" },
      { id: "r47_s2", order: 2, description: "Утрамбуйте массу на дно формы и уберите в холодильник на 15 минут.", imageUrl: "https://www.syl.ru/misc/i/ni/1/7/5/9/3/4/5/i/1759345.jpg" },
      { id: "r47_s3", order: 3, description: "Взбейте сливочный сыр с сахаром, сливками и яйцами на низкой скорости.", imageUrl: "https://i.ytimg.com/vi/pY82_gB8g7M/maxresdefault.jpg" },
      { id: "r47_s4", order: 4, description: "Выпекайте чизкейк при 150°C на водяной бане около 60-80 минут.", imageUrl: "https://i.ytimg.com/vi/6SDRl9kipas/maxresdefault.jpg?sqp=-oaymwEmCIAKENAF8quKqQMa8AEB-AH-CYAC0AWKAgwIABABGH8gWSgsMA8=&rs=AOn4CLCsfiCripaiNSx2_XgIa_W1GUhmOA" }
    ],
    nutritionalInfo: { calories: 480, protein: 10, fat: 35, carbs: 32 },
    authorId: "u4",
    status: "approved",
    views: 3900,
    createdAt: "2024-09-15T15:00:00Z"
  },
  {
    id: "r48",
    title: "Паэлья",
    description: "Испанское блюдо с морепродуктами.",
    imageUrl: "https://i.ytimg.com/vi/jL2z1A1-Buc/maxresdefault.jpg",
    category: "Обед",
    prepTime: 20,
    cookTime: 40,
    difficulty: 4,
    portions: 4,
    ingredients: [
      { id: "r48_i1", name: "Рис", amount: 400, unit: "г" },
      { id: "r48_i2", name: "Морепродукты", amount: 500, unit: "г" }
    ],
    steps: [
      { id: "r48_s1", order: 1, description: "В широкой сковороде обжарьте морепродукты с чесноком и луком, затем уберите их на тарелку.", imageUrl: "https://img.povar.ru/mobile/0c/64/5d/70/moreprodukti_v_slivochnom_souse-790057.jpg" },
      { id: "r48_s2", order: 2, description: "В той же сковороде обжарьте рис до прозрачности, добавьте шафран и влейте горячий бульон.", imageUrl: "https://img.povar.ru/uploads/09/b1/fc/c2/jarenii_ris_s_moreproduktami-874653.JPG" },
      { id: "r48_s3", order: 3, description: "Готовьте рис на медленном огне, не помешивая, пока вся жидкость не впитается.", imageUrl: "https://img.povar.ru/uploads/09/b1/fc/c2/jarenii_ris_s_moreproduktami-874653.JPG" },
      { id: "r48_s4", order: 4, description: "Верните морепродукты на рис, украсьте дольками лайма и дайте настояться 5 минут.", imageUrl: "https://www.chefmarket.ru/blog/wp-content/uploads/2022/10/ispanskaja-pajelja-s-moreproduktami-i-fasolju-e1667140774626.jpg" }
    ],
    nutritionalInfo: { calories: 450, protein: 30, fat: 15, carbs: 55 },
    authorId: "u5",
    status: "approved",
    views: 1700,
    createdAt: "2024-09-20T14:00:00Z"
  },
  {
    id: "r49",
    title: "Салат Капрезе",
    description: "Томаты с моцареллой и базиликом.",
    imageUrl: "https://i.ytimg.com/vi/zcOZpgIRAOc/maxresdefault.jpg",
    category: "Закуски",
    prepTime: 5,
    cookTime: 0,
    difficulty: 1,
    portions: 2,
    ingredients: [
      { id: "r49_i1", name: "Моцарелла", amount: 200, unit: "г" },
      { id: "r49_i2", name: "Томаты", amount: 2, unit: "шт" }
    ],
    steps: [
      { id: "r49_s1", order: 1, description: "Нарежьте спелые томаты и моцареллу кружочками одинаковой толщины.", imageUrl: "https://i.ytimg.com/vi/0h1ZuSmkFG0/maxresdefault.jpg" },
      { id: "r49_s2", order: 2, description: "Выложите их на тарелку поочередно, слегка внахлест.", imageUrl: "https://img.povar.ru/uploads/c3/92/f1/10/salat_quotkaprezequot-18673.jpg" },
      { id: "r49_s3", order: 3, description: "Украсьте свежими листьями базилика, полейте оливковым маслом и бальзамическим кремом.", imageUrl: "https://images.news.ru/2025/06/21/CtfzgsX0YMTWXOXHHbjbNhGF2w5HDysDWmj6Byfy_780.png" }
    ],
    nutritionalInfo: { calories: 260, protein: 15, fat: 20, carbs: 5 },
    authorId: "u1",
    status: "approved",
    views: 3100,
    createdAt: "2024-09-25T11:00:00Z"
  },
  {
    id: "r50",
    title: "Лапша Вок",
    description: "Быстрая лапша с овощами.",
    imageUrl: "https://2688f858-4c46-45f7-8250-8add9f65af29.selstorage.ru/_u3c1184__1245x700.jpeg",
    category: "Ужин",
    prepTime: 10,
    cookTime: 10,
    difficulty: 2,
    portions: 2,
    ingredients: [
      { id: "r50_i1", name: "Лапша удон", amount: 300, unit: "г" },
      { id: "r50_i2", name: "Овощи", amount: 200, unit: "г" }
    ],
    steps: [
      { id: "r50_s1", order: 1, description: "Нарежьте овощи (перец, морковь, брокколи) тонкой соломкой.", imageUrl: "https://img.freepik.com/free-photo/sliced-cabbage-bell-pepper-cucumber-wooden-kitchen-board_169016-49863.jpg?semt=ais_hybrid&w=740&q=80" },
      { id: "r50_s2", order: 2, description: "Разогрейте вок с маслом и быстро обжарьте овощи на максимальном огне 2-3 минуты.", imageUrl: "https://avatars.mds.yandex.net/get-vertis-journal/4080458/09938dfa-28ad-4910-97ce-a1fdabdc77be.jpg/1600x1600" },
      { id: "r50_s3", order: 3, description: "Добавьте отваренную лапшу удон и соус (соевый, терияки или устричный).", imageUrl: "https://i.ytimg.com/vi/Q36TOEf84J8/maxresdefault.jpg" },
      { id: "r50_s4", order: 4, description: "Тщательно перемешайте и жарьте еще 1 минуту. Посыпьте кунжутом и зеленым луком.", imageUrl: "https://img.povar.ru/mobile/03/3c/fb/2e/vok_s_ovoshami_v_soevom_souse-769135.jpg" }
    ],
    nutritionalInfo: { calories: 380, protein: 10, fat: 12, carbs: 60 },
    authorId: "u2",
    status: "approved",
    views: 2500,
    createdAt: "2024-10-01T19:00:00Z"
  },
  {
    id: "r51",
    title: "Крем-брюле",
    description: "Нежный десерт с карамельной корочкой.",
    imageUrl: "https://avatars.mds.yandex.net/i?id=832197f5ab009ee59cfd8c75e88f8b0e43fb787c-5286781-images-thumbs&n=13",
    category: "Выпечка",
    prepTime: 15,
    cookTime: 40,
    difficulty: 4,
    portions: 4,
    ingredients: [
      { id: "r51_i1", name: "Сливки 33%", amount: 500, unit: "мл" },
      { id: "r51_i2", name: "Желтки", amount: 5, unit: "шт" }
    ],
    steps: [
      { id: "r51_s1", order: 1, description: "Прогрейте сливки с ванилью, не доводя до кипения. Разотрите желтки с сахаром.", imageUrl: "https://cdn.nur.kz/images/1120x630/7e5f2309351f8478.jpeg?version=1" },
      { id: "r51_s2", order: 2, description: "Влейте горячие сливки в желтки тонкой струйкой, постоянно помешивая.", imageUrl: "https://www.syl.ru/misc/i/ni/2/4/9/2/8/3/7/i/2492837.jpg" },
      { id: "r51_s3", order: 3, description: "Разлейте массу по формочкам и запекайте на водяной бане при 100°C около 40-50 минут.", imageUrl: "https://static.1000.menu/img/content-v2/35/3f/54284/desert-krem-brule_1619897435_5_max.jpg" },
      { id: "r51_s4", order: 4, description: "Охладите, посыпьте сахаром и карамелизуйте его горелкой до хрустящей корочки.", imageUrl: "https://pp.userapi.com/c636530/v636530882/202b4/niQMGDxyDNk.jpg" }
    ],
    nutritionalInfo: { calories: 410, protein: 6, fat: 35, carbs: 22 },
    authorId: "u3",
    status: "approved",
    views: 1900,
    createdAt: "2024-10-05T16:00:00Z"
  },
  {
    id: "r52",
    title: "Бургер домашний",
    description: "Сочный бургер с говяжьей котлетой.",
    imageUrl: "https://img.povar.ru/640w/3b/24/eb/78/domashnii_gamburger_s_kolbasoi-614630.jpg",
    category: "Обед",
    prepTime: 15,
    cookTime: 15,
    difficulty: 2,
    portions: 1,
    ingredients: [
      { id: "r52_i1", name: "Булочка", amount: 1, unit: "шт" },
      { id: "r52_i2", name: "Говяжий фарш", amount: 200, unit: "г" }
    ],
    steps: [
      { id: "r52_s1", order: 1, description: "Сформируйте из фарша круглую котлету и обжарьте ее на гриле или сковороде.", imageUrl: "https://i.cdn01.ru/files/users/images/11/70/1170c5363c2ac71387ed2593a6264fd4.jpg" },
      { id: "r52_s2", order: 2, description: "Разрежьте булочку пополам и слегка подсушите на сковороде.", imageUrl: "https://img.povar.ru/uploads/35/6d/4e/be/vegetarianskii_burger-3340.jpg" },
      { id: "r52_s3", order: 3, description: "Соберите бургер: соус, лист салата, котлета, сыр, помидор, лук и верхняя булочка.", imageUrl: "https://images.gastronom.ru/ThV2HHocfp5PU5UlBzhVtVlmmNvnpGDJhcBjLpQHrEw/pr:recipe-step-image/g:ce/rs:auto:0:0:0/L2Ntcy9hbGwtaW1hZ2VzLzEzNGMwYzI2LTRhNzQtNDZlMC05OWM3LWNlYzc4OTRjMTRmMi5qcGc.webp" }
    ],
    nutritionalInfo: { calories: 620, protein: 35, fat: 40, carbs: 35 },
    authorId: "u4",
    status: "approved",
    views: 5500,
    createdAt: "2024-10-10T13:00:00Z"
  }
];
