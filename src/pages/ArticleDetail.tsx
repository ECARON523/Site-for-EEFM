import { useParams, Link } from 'react-router-dom';
import { ARTICLES } from '../data/articles';

export default function ArticleDetail() {
  const { id } = useParams();
  const article = ARTICLES.find(a => a.id === id);

  if (!article) {
    return <div className="p-8 text-center text-text-muted">Статья не найдена</div>;
  }

  return (
    <div className="max-w-3xl mx-auto pb-20">
      <Link to="/about/articles" className="text-primary hover:underline mb-4 block">&larr; Назад к статьям</Link>
      <img src={article.imageUrl} alt={article.title} className="w-full h-64 object-cover rounded-2xl mb-8" referrerPolicy="no-referrer" />
      <div className="text-sm text-text-muted mb-2">{article.date}</div>
      <h1 className="text-4xl font-black text-text-primary mb-6">{article.title}</h1>
      <p className="text-text-primary leading-relaxed text-lg">{article.content}</p>
    </div>
  );
}
