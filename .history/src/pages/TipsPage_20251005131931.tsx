import { useState, useEffect } from 'react';
import { Lightbulb, Heart, Droplet, Zap, Recycle, Leaf, MessageSquare, Send } from 'lucide-react';
import { supabase } from '../lib/supabase';
import type { Tip, ForumPost, ForumReply } from '../types';

export default function TipsPage() {
  const [tips, setTips] = useState<Tip[]>([]);
  const [forumPosts, setForumPosts] = useState<ForumPost[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [viewMode, setViewMode] = useState<'tips' | 'forum'>('tips');
  const [loading, setLoading] = useState(true);
  const [selectedPost, setSelectedPost] = useState<ForumPost | null>(null);
  const [replies, setReplies] = useState<ForumReply[]>([]);

  const [postForm, setPostForm] = useState({
    name: '',
    email: '',
    title: '',
    content: '',
    category: 'geral',
  });

  const [replyForm, setReplyForm] = useState({
    name: '',
    email: '',
    content: '',
  });

  useEffect(() => {
    loadTips();
    loadForumPosts();
  }, [selectedCategory]);

  useEffect(() => {
    if (selectedPost) {
      loadReplies(selectedPost.id);
    }
  }, [selectedPost]);

  const loadTips = async () => {
    setLoading(true);
    let query = supabase.from('tips').select('*').order('created_at', { ascending: false });

    if (selectedCategory !== 'all') {
      query = query.eq('category', selectedCategory);
    }

    const { data } = await query;
    if (data) setTips(data);
    setLoading(false);
  };

  const loadForumPosts = async () => {
    const { data } = await supabase
      .from('forum_posts')
      .select('*')
      .order('created_at', { ascending: false });

    if (data) setForumPosts(data);
  };

  const loadReplies = async (postId: string) => {
    const { data } = await supabase
      .from('forum_replies')
      .select('*')
      .eq('post_id', postId)
      .order('created_at', { ascending: false });

    if (data) setReplies(data);
  };

  const handleLikeTip = async (tipId: string) => {
    const tip = tips.find(t => t.id === tipId);
    if (!tip) return;

    const { error } = await supabase
      .from('tips')
      .update({ like_count: tip.like_count + 1 })
      .eq('id', tipId);

    if (!error) {
      setTips(tips.map(t => t.id === tipId ? { ...t, like_count: t.like_count + 1 } : t));
    }
  };

  const handlePostSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!postForm.name || !postForm.email || !postForm.title || !postForm.content) return;

    const { error } = await supabase.from('forum_posts').insert([postForm]);

    if (!error) {
      alert('Post criado com sucesso!');
      setPostForm({ name: '', email: '', title: '', content: '', category: 'geral' });
      loadForumPosts();
    }
  };

  const handleReplySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedPost || !replyForm.name || !replyForm.email || !replyForm.content) return;

    const { error } = await supabase.from('forum_replies').insert([{
      post_id: selectedPost.id,
      ...replyForm,
    }]);

    if (!error) {
      const { error: updateError } = await supabase
        .from('forum_posts')
        .update({ reply_count: selectedPost.reply_count + 1 })
        .eq('id', selectedPost.id);

      if (!updateError) {
        setReplyForm({ name: '', email: '', content: '' });
        loadReplies(selectedPost.id);
        loadForumPosts();
      }
    }
  };

  const categories = [
    { value: 'all', label: 'Todas', icon: Leaf },
    { value: 'água', label: 'Água', icon: Droplet },
    { value: 'energia', label: 'Energia', icon: Zap },
    { value: 'reciclagem', label: 'Reciclagem', icon: Recycle },
  ];

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Easy': return 'bg-green-100 text-green-700';
      case 'Medium': return 'bg-amber-100 text-amber-700';
      case 'Hard': return 'bg-red-100 text-red-700';
      default: return 'bg-slate-100 text-slate-700';
    }
  };

  const getImpactColor = (impact: string) => {
    switch (impact) {
      case 'High': return 'bg-emerald-100 text-emerald-700';
      case 'Medium': return 'bg-blue-100 text-blue-700';
      case 'Low': return 'bg-slate-100 text-slate-700';
      default: return 'bg-slate-100 text-slate-700';
    }
  };

  if (selectedPost) {
    return (
      <div className="min-h-screen bg-slate-50 py-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <button
            onClick={() => setSelectedPost(null)}
            className="mb-6 text-emerald-600 hover:text-emerald-700 font-semibold"
          >
            ← Voltar ao fórum
          </button>

          <div className="bg-white rounded-xl shadow-lg p-8 mb-8">
            <span className="inline-block px-3 py-1 bg-emerald-100 text-emerald-700 text-sm font-semibold rounded-full mb-4">
              {selectedPost.category}
            </span>
            <h1 className="text-3xl font-bold text-slate-800 mb-4">{selectedPost.title}</h1>
            <div className="flex items-center gap-4 text-slate-600 mb-6">
              <span className="font-semibold">{selectedPost.user_name}</span>
              <span>{new Date(selectedPost.created_at).toLocaleDateString('pt-BR')}</span>
            </div>
            <p className="text-slate-700 leading-relaxed whitespace-pre-wrap">{selectedPost.content}</p>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-8">
            <h2 className="text-2xl font-bold text-slate-800 mb-6">
              Respostas ({replies.length})
            </h2>

            <form onSubmit={handleReplySubmit} className="mb-8 space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <input
                  type="text"
                  placeholder="Seu nome"
                  value={replyForm.name}
                  onChange={(e) => setReplyForm({ ...replyForm, name: e.target.value })}
                  required
                  className="px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
                <input
                  type="email"
                  placeholder="Seu email"
                  value={replyForm.email}
                  onChange={(e) => setReplyForm({ ...replyForm, email: e.target.value })}
                  required
                  className="px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>
              <textarea
                placeholder="Sua resposta"
                value={replyForm.content}
                onChange={(e) => setReplyForm({ ...replyForm, content: e.target.value })}
                required
                rows={4}
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
              <button
                type="submit"
                className="bg-emerald-600 text-white px-6 py-2 rounded-lg hover:bg-emerald-700 transition-colors font-semibold flex items-center gap-2"
              >
                <Send className="h-4 w-4" />
                Enviar Resposta
              </button>
            </form>

            <div className="space-y-4">
              {replies.map((reply) => (
                <div key={reply.id} className="bg-slate-50 rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="font-semibold text-slate-800">{reply.user_name}</span>
                    <span className="text-slate-500 text-sm">
                      {new Date(reply.created_at).toLocaleDateString('pt-BR')}
                    </span>
                  </div>
                  <p className="text-slate-700 whitespace-pre-wrap">{reply.content}</p>
                </div>
              ))}
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
          <h1 className="text-4xl font-bold text-slate-800 mb-4">Dicas de Preservação</h1>
          <p className="text-lg text-slate-600">
            Práticas sustentáveis para o dia a dia e troca de experiências
          </p>
        </div>

        <div className="flex gap-4 mb-8">
          <button
            onClick={() => setViewMode('tips')}
            className={`px-6 py-3 rounded-lg font-semibold transition-colors flex items-center gap-2 ${
              viewMode === 'tips'
                ? 'bg-emerald-600 text-white'
                : 'bg-white text-slate-600 hover:bg-slate-100'
            }`}
          >
            <Lightbulb className="h-5 w-5" />
            Dicas Práticas
          </button>
          <button
            onClick={() => setViewMode('forum')}
            className={`px-6 py-3 rounded-lg font-semibold transition-colors flex items-center gap-2 ${
              viewMode === 'forum'
                ? 'bg-emerald-600 text-white'
                : 'bg-white text-slate-600 hover:bg-slate-100'
            }`}
          >
            <MessageSquare className="h-5 w-5" />
            Fórum
          </button>
        </div>

        {viewMode === 'tips' ? (
          <>
            <div className="flex flex-wrap gap-2 mb-8">
              {categories.map((cat) => {
                const Icon = cat.icon;
                return (
                  <button
                    key={cat.value}
                    onClick={() => setSelectedCategory(cat.value)}
                    className={`px-4 py-2 rounded-lg font-semibold transition-colors flex items-center gap-2 ${
                      selectedCategory === cat.value
                        ? 'bg-emerald-600 text-white'
                        : 'bg-white text-slate-600 hover:bg-slate-100'
                    }`}
                  >
                    <Icon className="h-4 w-4" />
                    {cat.label}
                  </button>
                );
              })}
            </div>

            {loading ? (
              <div className="flex justify-center py-20">
                <div className="animate-spin rounded-full h-12 w-12 border-4 border-emerald-500 border-t-transparent"></div>
              </div>
            ) : (
              <div className="grid md:grid-cols-2 gap-6">
                {tips.map((tip) => (
                  <div key={tip.id} className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow">
                    <div className="flex items-start justify-between mb-4">
                      <h3 className="text-xl font-bold text-slate-800">{tip.title}</h3>
                      <button
                        onClick={() => handleLikeTip(tip.id)}
                        className="flex items-center gap-1 px-3 py-1 bg-rose-50 text-rose-600 rounded-lg hover:bg-rose-100 transition-colors"
                      >
                        <Heart className="h-4 w-4" />
                        <span>{tip.like_count}</span>
                      </button>
                    </div>
                    <p className="text-slate-700 mb-4 leading-relaxed">{tip.content}</p>
                    <div className="flex gap-2">
                      <span className={`px-3 py-1 text-sm font-semibold rounded-full ${getDifficultyColor(tip.difficulty)}`}>
                        {tip.difficulty}
                      </span>
                      <span className={`px-3 py-1 text-sm font-semibold rounded-full ${getImpactColor(tip.impact_level)}`}>
                        Impacto: {tip.impact_level}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        ) : (
          <div className="space-y-8">
            <div className="bg-white rounded-xl shadow-lg p-8">
              <h2 className="text-2xl font-bold text-slate-800 mb-6">Criar Nova Discussão</h2>
              <form onSubmit={handlePostSubmit} className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <input
                    type="text"
                    placeholder="Seu nome"
                    value={postForm.name}
                    onChange={(e) => setPostForm({ ...postForm, name: e.target.value })}
                    required
                    className="px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                  <input
                    type="email"
                    placeholder="Seu email"
                    value={postForm.email}
                    onChange={(e) => setPostForm({ ...postForm, email: e.target.value })}
                    required
                    className="px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
                <input
                  type="text"
                  placeholder="Título da discussão"
                  value={postForm.title}
                  onChange={(e) => setPostForm({ ...postForm, title: e.target.value })}
                  required
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
                <textarea
                  placeholder="Descreva sua dúvida ou experiência"
                  value={postForm.content}
                  onChange={(e) => setPostForm({ ...postForm, content: e.target.value })}
                  required
                  rows={4}
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
                <button
                  type="submit"
                  className="bg-emerald-600 text-white px-6 py-2 rounded-lg hover:bg-emerald-700 transition-colors font-semibold"
                >
                  Criar Discussão
                </button>
              </form>
            </div>

            <div>
              <h2 className="text-2xl font-bold text-slate-800 mb-6">Discussões Recentes</h2>
              <div className="space-y-4">
                {forumPosts.map((post) => (
                  <div
                    key={post.id}
                    onClick={() => setSelectedPost(post)}
                    className="bg-white rounded-xl shadow-lg p-6 cursor-pointer hover:shadow-xl transition-shadow"
                  >
                    <span className="inline-block px-3 py-1 bg-emerald-100 text-emerald-700 text-sm font-semibold rounded-full mb-3">
                      {post.category}
                    </span>
                    <h3 className="text-xl font-bold text-slate-800 mb-2">{post.title}</h3>
                    <p className="text-slate-600 line-clamp-2 mb-4">{post.content}</p>
                    <div className="flex items-center gap-4 text-slate-500 text-sm">
                      <span className="font-semibold">{post.user_name}</span>
                      <span>{new Date(post.created_at).toLocaleDateString('pt-BR')}</span>
                      <div className="flex items-center gap-1">
                        <MessageSquare className="h-4 w-4" />
                        <span>{post.reply_count} respostas</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
