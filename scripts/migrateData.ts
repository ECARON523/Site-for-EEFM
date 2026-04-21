import { doc, setDoc } from 'firebase/firestore';
import { db } from '../src/lib/firebase';
import { MOCK_RECIPES } from '../src/data/mockData';

async function migrate() {
  for (const recipe of MOCK_RECIPES) {
    await setDoc(doc(db, 'recipes', recipe.id), recipe);
  }
  console.log('Migration complete');
}

migrate();
