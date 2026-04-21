import { ARTICLES } from '../data/articles';
import { Link } from 'react-router-dom';

export default function Articles() {
  return (
    <div className="space-y-8">
      <h1 className="text-4xl font-black text-text-primary">Статьи о еде</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {ARTICLES.map(article => (
          <Link key={article.id} to={`/about/articles/${article.id}`} className="bg-bg-surface rounded-2xl overflow-hidden hover:ring-2 ring-primary transition-all text-left block border border-border-color">
            <img src={article.imageUrl} alt={article.title} className="w-full h-48 object-cover" referrerPolicy="no-referrer" />
            <div className="p-6">
              <div className="text-sm text-text-muted mb-2">{article.date}</div>
              <h2 className="text-xl font-bold text-text-primary mb-2">{article.title}</h2>
              <p className="text-text-primary text-sm">{article.excerpt}</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
