import { useState, useEffect } from 'react';
import { Heart, MessageCircle, Calendar, User, Tag } from 'lucide-react';
import { supabase } from '../lib/supabase';
import type { Article, Category, Comment } from '../types';

export default function NewsPage() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedArticle, setSelectedArticle] = useState<Article | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);

  const [commentForm, setCommentForm] = useState({
    name: '',
    email: '',
    content: '',
  });

  useEffect(() => {
    loadCategories();
    loadArticles();
  }, [selectedCategory]);

  useEffect(() => {
    if (selectedArticle) {
      loadComments(selectedArticle.id);
    }
  }, [selectedArticle]);

  const loadCategories = async () => {
    const { data } = await supabase
      .from('categories')
      .select('*')
      .order('name');

    if (data) {
      setCategories(data);
    }
  };

  const loadArticles = async () => {
    setLoading(true);
    let query = supabase
      .from('articles')
      .select('*, categories(*)')
      .order('published_at', { ascending: false });

    if (selectedCategory !== 'all') {
      query = query.eq('category_id', selectedCategory);
    }

    const { data } = await query;

    if (data) {
      setArticles(data);
    }
    setLoading(false);
  };

  const loadComments = async (articleId: string) => {
    const { data } = await supabase
      .from('comments')
      .select('*')
      .eq('article_id', articleId)
      .eq('is_approved', true)
      .order('created_at', { ascending: false });

    if (data) {
      setComments(data);
    }
  };

  const handleLike = async (articleId: string) => {
    const article = articles.find(a => a.id === articleId);
    if (!article) return;

    const { error } = await supabase
      .from('articles')
      .update({ like_count: article.like_count + 1 })
      .eq('id', articleId);

    if (!error) {
      setArticles(articles.map(a =>
        a.id === articleId ? { ...a, like_count: a.like_count + 1 } : a
      ));
      if (selectedArticle?.id === articleId) {
        setSelectedArticle({ ...selectedArticle, like_count: selectedArticle.like_count + 1 });
      }
    }
  };

  const handleCommentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedArticle || !commentForm.name || !commentForm.email || !commentForm.content) return;

    const { error } = await supabase
      .from('comments')
      .insert([{
        article_id: selectedArticle.id,
        user_name: commentForm.name,
        user_email: commentForm.email,
        content: commentForm.content,
      }]);

    if (!error) {
      alert('Comentário enviado! Ele será publicado após moderação.');
      setCommentForm({ name: '', email: '', content: '' });
    } else {
      alert('Erro ao enviar comentário. Tente novamente.');
    }
  };

  if (selectedArticle) {
    return (
      <div className="min-h-screen bg-slate-50 py-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <button
            onClick={() => setSelectedArticle(null)}
            className="mb-6 text-emerald-600 hover:text-emerald-700 font-semibold"
          >
            ← Voltar para notícias
          </button>

          <article className="bg-white rounded-xl shadow-lg overflow-hidden">
            {selectedArticle.image_url && (
              <img
                src={selectedArticle.image_url}
                alt={selectedArticle.title}
                className="w-full h-96 object-cover"
              />
            )}

            <div className="p-8">
              {selectedArticle.categories && (
                <span className="inline-block px-3 py-1 bg-emerald-100 text-emerald-700 text-sm font-semibold rounded-full mb-4">
                  {selectedArticle.categories.name}
                </span>
              )}

              <h1 className="text-4xl font-bold text-slate-800 mb-4">
                {selectedArticle.title}
              </h1>

              <div className="flex items-center gap-6 text-slate-600 mb-8">
                <div className="flex items-center gap-2">
                  <User className="h-4 w-4" />
                  <span>{selectedArticle.author}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  <span>{new Date(selectedArticle.published_at).toLocaleDateString('pt-BR')}</span>
                </div>
              </div>

              <div className="prose max-w-none text-slate-700 leading-relaxed mb-8 whitespace-pre-wrap">
                {selectedArticle.content}
              </div>

              <div className="flex items-center gap-4 pt-6 border-t border-slate-200">
                <button
                  onClick={() => handleLike(selectedArticle.id)}
                  className="flex items-center gap-2 px-4 py-2 bg-rose-50 text-rose-600 rounded-lg hover:bg-rose-100 transition-colors"
                >
                  <Heart className="h-5 w-5" />
                  <span>{selectedArticle.like_count}</span>
                </button>
                <div className="flex items-center gap-2 text-slate-600">
                  <MessageCircle className="h-5 w-5" />
                  <span>{comments.length} comentários</span>
                </div>
              </div>
            </div>
          </article>

          <div className="mt-8 bg-white rounded-xl shadow-lg p-8">
            <h2 className="text-2xl font-bold text-slate-800 mb-6">Comentários</h2>

            <form onSubmit={handleCommentSubmit} className="mb-8 space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <input
                  type="text"
                  placeholder="Seu nome"
                  value={commentForm.name}
                  onChange={(e) => setCommentForm({ ...commentForm, name: e.target.value })}
                  required
                  className="px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
                <input
                  type="email"
                  placeholder="Seu email"
                  value={commentForm.email}
                  onChange={(e) => setCommentForm({ ...commentForm, email: e.target.value })}
                  required
                  className="px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>
              <textarea
                placeholder="Seu comentário"
                value={commentForm.content}
                onChange={(e) => setCommentForm({ ...commentForm, content: e.target.value })}
                required
                rows={4}
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
              <button
                type="submit"
                className="bg-emerald-600 text-white px-6 py-2 rounded-lg hover:bg-emerald-700 transition-colors font-semibold"
              >
                Enviar Comentário
              </button>
            </form>

            <div className="space-y-4">
              {comments.map((comment) => (
                <div key={comment.id} className="bg-slate-50 rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="font-semibold text-slate-800">{comment.user_name}</span>
                    <span className="text-slate-500 text-sm">
                      {new Date(comment.created_at).toLocaleDateString('pt-BR')}
                    </span>
                  </div>
                  <p className="text-slate-700">{comment.content}</p>
                </div>
              ))}
              {comments.length === 0 && (
                <p className="text-slate-500 text-center py-8">
                  Seja o primeiro a comentar!
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-slate-800 mb-4">Notícias Ambientais</h1>
          <p className="text-lg text-slate-600">
            Fique por dentro das últimas notícias sobre meio ambiente e sustentabilidade
          </p>
        </div>

        <div className="flex flex-wrap gap-2 mb-8">
          <button
            onClick={() => setSelectedCategory('all')}
            className={`px-4 py-2 rounded-lg font-semibold transition-colors ${
              selectedCategory === 'all'
                ? 'bg-emerald-600 text-white'
                : 'bg-white text-slate-600 hover:bg-slate-100'
            }`}
          >
            Todas
          </button>
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => setSelectedCategory(category.id)}
              className={`px-4 py-2 rounded-lg font-semibold transition-colors ${
                selectedCategory === category.id
                  ? 'bg-emerald-600 text-white'
                  : 'bg-white text-slate-600 hover:bg-slate-100'
              }`}
            >
              {category.name}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="flex justify-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-4 border-emerald-500 border-t-transparent"></div>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {articles.map((article) => (
              <div
                key={article.id}
                onClick={() => setSelectedArticle(article)}
                className="bg-white rounded-xl shadow-lg overflow-hidden cursor-pointer transform hover:scale-105 hover:shadow-2xl transition-all duration-300"
              >
                {article.image_url ? (
                  <img
                    src={article.image_url}
                    alt={article.title}
                    className="w-full h-48 object-cover"
                  />
                ) : (
                  <div className="w-full h-48 bg-gradient-to-br from-emerald-400 to-teal-500" />
                )}
                <div className="p-6">
                  {article.categories && (
                    <span className="inline-block px-3 py-1 bg-emerald-100 text-emerald-700 text-sm font-semibold rounded-full mb-3">
                      {article.categories.name}
                    </span>
                  )}
                  <h2 className="text-xl font-bold text-slate-800 mb-2 line-clamp-2">
                    {article.title}
                  </h2>
                  {article.excerpt && (
                    <p className="text-slate-600 line-clamp-3 mb-4">{article.excerpt}</p>
                  )}
                  <div className="flex items-center gap-4 text-slate-500 text-sm">
                    <div className="flex items-center gap-1">
                      <Heart className="h-4 w-4" />
                      <span>{article.like_count}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Calendar className="h-4 w-4" />
                      <span>{new Date(article.published_at).toLocaleDateString('pt-BR')}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {!loading && articles.length === 0 && (
          <div className="text-center py-20">
            <p className="text-slate-600 text-lg">Nenhuma notícia encontrada nesta categoria.</p>
          </div>
        )}
      </div>
    </div>
  );
}
