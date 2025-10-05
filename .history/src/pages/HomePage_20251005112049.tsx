import { useState, useEffect } from 'react';
import { Newspaper, Lightbulb, GraduationCap, Bot, ArrowRight, Sparkles } from 'lucide-react';
import { supabase } from '../lib/supabase';
import type { Article, FunFact, PageType } from '../types';

interface HomePageProps {
  onNavigate: (page: PageType) => void;
}

export default function HomePage({ onNavigate }: HomePageProps) {
  const [featuredArticles, setFeaturedArticles] = useState<Article[]>([]);
  const [funFact, setFunFact] = useState<FunFact | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadHomeContent();
  }, []);

  const loadHomeContent = async () => {
    try {
      const [articlesRes, factsRes] = await Promise.all([
        supabase
          .from('articles')
          .select('*, categories(*)')
          .eq('is_featured', true)
          .order('published_at', { ascending: false })
          .limit(3),
        supabase
          .from('fun_facts')
          .select('*')
          .limit(10)
      ]);

      if (articlesRes.data) {
        setFeaturedArticles(articlesRes.data);
      }

      if (factsRes.data && factsRes.data.length > 0) {
        const randomFact = factsRes.data[Math.floor(Math.random() * factsRes.data.length)];
        setFunFact(randomFact);
      }
    } catch (error) {
      console.error('Erro ao carregar conteúdo:', error);
    } finally {
      setLoading(false);
    }
  };

  const sections = [
    {
      icon: Newspaper,
      title: 'Notícias Ambientais',
      description: 'Fique por dentro das últimas notícias sobre meio ambiente',
      color: 'from-blue-500 to-cyan-500',
      page: 'news' as PageType,
    },
    {
      icon: Lightbulb,
      title: 'Dicas Sustentáveis',
      description: 'Aprenda práticas simples para preservar o planeta',
      color: 'from-amber-500 to-orange-500',
      page: 'tips' as PageType,
    },
    {
      icon: GraduationCap,
      title: 'Educação Ambiental',
      description: 'Conteúdos educativos para todas as idades',
      color: 'from-violet-500 to-purple-500',
      page: 'education' as PageType,
    },
    {
      icon: Bot,
      title: 'IA Ambiental',
      description: 'Chat inteligente sobre meio ambiente',
      color: 'from-emerald-500 to-teal-500',
      page: 'ai' as PageType,
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      <section className="bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 text-white relative overflow-hidden">
      {/* Floresta GIF background */}
      <img
        src="/floresta.gif"
        alt="Floresta"
        className="absolute inset-0 w-full h-full object-cover opacity-40 pointer-events-none"
        aria-hidden="true"
      />
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center">
        <h1 className="text-5xl md:text-6xl font-bold mb-6 leading-tight">
          Bem-vindo ao EcoVibe do Futuro
        </h1>
        <p className="text-xl md:text-2xl text-emerald-50 max-w-3xl mx-auto leading-relaxed">
          Seu portal de informação e educação ambiental. Juntos construindo um futuro sustentável.
        </p>
        </div>
      </div>
      </section>

      {funFact && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-10">
          <div className="bg-gradient-to-br from-amber-400 to-orange-500 rounded-2xl shadow-2xl p-8 text-white transform hover:scale-105 transition-transform duration-300">
            <div className="flex items-start gap-4">
              <Sparkles className="h-8 w-8 flex-shrink-0 mt-1" />
              <div>
                <h3 className="text-2xl font-bold mb-3">Você Sabia?</h3>
                <p className="text-lg leading-relaxed">{funFact.fact}</p>
              </div>
            </div>
          </div>
        </section>
      )}

      {featuredArticles.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <h2 className="text-4xl font-bold text-slate-800 mb-8">Destaques</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {featuredArticles.map((article) => (
              <div
                key={article.id}
                className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-2xl transition-shadow duration-300 cursor-pointer group"
                onClick={() => onNavigate('news')}
              >
                {article.image_url ? (
                  <div className="h-48 bg-gradient-to-br from-emerald-400 to-teal-500 overflow-hidden">
                    <img
                      src={article.image_url}
                      alt={article.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                    />
                  </div>
                ) : (
                  <div className="h-48 bg-gradient-to-br from-emerald-400 to-teal-500 flex items-center justify-center">
                    <Newspaper className="h-16 w-16 text-white opacity-50" />
                  </div>
                )}
                <div className="p-6">
                  {article.categories && (
                    <span className="inline-block px-3 py-1 bg-emerald-100 text-emerald-700 text-sm font-semibold rounded-full mb-3">
                      {article.categories.name}
                    </span>
                  )}
                  <h3 className="text-xl font-bold text-slate-800 mb-2 group-hover:text-emerald-600 transition-colors">
                    {article.title}
                  </h3>
                  {article.excerpt && (
                    <p className="text-slate-600 line-clamp-3">{article.excerpt}</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <h2 className="text-4xl font-bold text-slate-800 mb-8 text-center">Explore o Ecovibe</h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {sections.map((section) => {
            const Icon = section.icon;
            return (
              <div
                key={section.title}
                onClick={() => onNavigate(section.page)}
                className="bg-white rounded-xl shadow-lg p-6 cursor-pointer transform hover:scale-105 hover:shadow-2xl transition-all duration-300"
              >
                <div className={`w-16 h-16 rounded-full bg-gradient-to-r ${section.color} flex items-center justify-center mb-4`}>
                  <Icon className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-xl font-bold text-slate-800 mb-2">{section.title}</h3>
                <p className="text-slate-600 mb-4">{section.description}</p>
                <div className="flex items-center text-emerald-600 font-semibold group">
                  <span>Explorar</span>
                  <ArrowRight className="h-4 w-4 ml-2 group-hover:translate-x-2 transition-transform" />
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {loading && (
        <div className="fixed inset-0 bg-black bg-opacity-20 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-8 shadow-2xl">
            <div className="animate-spin rounded-full h-12 w-12 border-4 border-emerald-500 border-t-transparent"></div>
          </div>
        </div>
      )}
    </div>
  );
}
