import { Leaf, Mail, Heart } from 'lucide-react';
import { useState } from 'react';
import { supabase } from '../lib/supabase';

export default function Footer() {
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [subscribeStatus, setSubscribeStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setSubscribeStatus('loading');

    try {
      const { error } = await supabase
        .from('newsletter_subscribers')
        .insert([{ email, name: name || null }]);

      if (error) {
        if (error.code === '23505') {
          setSubscribeStatus('error');
          alert('Este email já está cadastrado!');
        } else {
          throw error;
        }
      } else {
        setSubscribeStatus('success');
        setEmail('');
        setName('');
        alert('Inscrição realizada com sucesso!');
        setTimeout(() => setSubscribeStatus('idle'), 3000);
      }
    } catch (error) {
      console.error('Erro ao inscrever:', error);
      setSubscribeStatus('error');
      alert('Erro ao realizar inscrição. Tente novamente.');
    }
  };

  return (
    <footer className="bg-gradient-to-r from-slate-800 to-slate-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid md:grid-cols-3 gap-8">
          <div>
            <div className="flex items-center mb-4">
              <Leaf className="h-8 w-8 mr-2 text-emerald-400" />
              <span className="text-2xl font-bold">Ecovibe</span>
            </div>
            <p className="text-slate-300 leading-relaxed">
              Juntos por um planeta mais verde e sustentável. Informação, educação e ação pelo meio ambiente.
            </p>
          </div>

          <div>
            <h3 className="text-xl font-semibold mb-4 flex items-center">
              <Mail className="h-5 w-5 mr-2 text-emerald-400" />
              Newsletter
            </h3>
            <p className="text-slate-300 mb-4">
              Receba dicas e notícias ambientais direto no seu email.
            </p>
            <form onSubmit={handleSubscribe} className="space-y-2">
              <input
                type="text"
                placeholder="Seu nome (opcional)"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-4 py-2 rounded-lg bg-slate-700 border border-slate-600 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-400"
              />
              <input
                type="email"
                placeholder="Seu email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full px-4 py-2 rounded-lg bg-slate-700 border border-slate-600 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-400"
              />
              <button
                type="submit"
                disabled={subscribeStatus === 'loading'}
                className="w-full bg-emerald-500 hover:bg-emerald-600 px-4 py-2 rounded-lg font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {subscribeStatus === 'loading' ? 'Inscrevendo...' : 'Inscrever-se'}
              </button>
            </form>
          </div>

          <div>
            <h3 className="text-xl font-semibold mb-4">Links Rápidos</h3>
            <ul className="space-y-2 text-slate-300">
              <li className="hover:text-emerald-400 transition-colors cursor-pointer">Política de Privacidade</li>
              <li className="hover:text-emerald-400 transition-colors cursor-pointer">Termos de Uso</li>
              <li className="hover:text-emerald-400 transition-colors cursor-pointer">Contato</li>
              <li className="hover:text-emerald-400 transition-colors cursor-pointer">Parceiros</li>
            </ul>
          </div>
        </div>

        <div className="border-t border-slate-700 mt-8 pt-8 text-center text-slate-400">
          <p className="flex items-center justify-center gap-2">
            Feito com <Heart className="h-4 w-4 text-red-500 fill-current" /> pelo planeta
          </p>
          <p className="mt-2">© 2025 Ecovibe. Todos os direitos reservados.</p>
        </div>
      </div>
    </footer>
  );
}
