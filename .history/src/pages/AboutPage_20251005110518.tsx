import { Heart, Target, Users, Leaf, Globe, Lightbulb } from 'lucide-react';

export default function AboutPage() {
  const values = [
    {
      icon: Leaf,
      title: 'Sustentabilidade',
      description: 'Promovemos práticas que garantem o equilíbrio entre desenvolvimento e preservação ambiental.',
    },
    {
      icon: Lightbulb,
      title: 'Educação',
      description: 'Acreditamos que o conhecimento é a chave para transformar comportamentos e criar impacto positivo.',
    },
    {
      icon: Globe,
      title: 'Alcance Global',
      description: 'Pensamos globalmente, agimos localmente. Cada ação individual contribui para mudanças no planeta.',
    },
    {
      icon: Users,
      title: 'Comunidade',
      description: 'Construímos uma rede de pessoas engajadas em preservar o meio ambiente para as futuras gerações.',
    },
  ];

  const team = [
    {
      name: 'Ana Silva',
      role: 'Bióloga e Pesquisadora',
      description: 'Especialista em biodiversidade e conservação ambiental',
    },
    {
      name: 'Carlos Oliveira',
      role: 'Engenheiro Ambiental',
      description: 'Focado em soluções de energia renovável e sustentabilidade urbana',
    },
    {
      name: 'Marina Costa',
      role: 'Educadora Ambiental',
      description: 'Desenvolve conteúdos pedagógicos sobre meio ambiente',
    },
    {
      name: 'Roberto Santos',
      role: 'Cientista da Computação',
      description: 'Cria ferramentas tecnológicas para educação ambiental',
    },
  ];

  const stats = [
    { value: '10k+', label: 'Leitores Mensais' },
    { value: '500+', label: 'Artigos Publicados' },
    { value: '50+', label: 'Parceiros' },
    { value: '5k+', label: 'Membros da Comunidade' },
  ];

  return (
    <div className="min-h-screen bg-slate-50">
      <section className="bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-5xl font-bold mb-6">Sobre o Ecovibe</h1>
          <p className="text-xl text-emerald-50 max-w-3xl mx-auto leading-relaxed">
            Somos uma plataforma dedicada à educação e conscientização ambiental,
            conectando pessoas em prol de um futuro mais sustentável.
          </p>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div>
            <div className="inline-flex items-center justify-center w-16 h-16 bg-emerald-100 rounded-full mb-6">
              <Target className="h-8 w-8 text-emerald-600" />
            </div>
            <h2 className="text-3xl font-bold text-slate-800 mb-4">Nossa Missão</h2>
            <p className="text-lg text-slate-700 leading-relaxed mb-4">
              Democratizar o acesso à informação sobre meio ambiente e sustentabilidade,
              capacitando pessoas de todas as idades a tomarem decisões conscientes e
              implementarem práticas que beneficiem o planeta.
            </p>
            <p className="text-lg text-slate-700 leading-relaxed">
              Através de conteúdo de qualidade, ferramentas interativas e uma comunidade
              engajada, trabalhamos para criar um impacto positivo e duradouro no cuidado
              com nosso meio ambiente.
            </p>
          </div>

          <div className="bg-gradient-to-br from-emerald-400 to-teal-500 rounded-2xl p-12 text-white">
            <h3 className="text-2xl font-bold mb-6">Por que o Ecovibe?</h3>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <div className="w-6 h-6 bg-white rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                  <span className="text-emerald-600 font-bold">✓</span>
                </div>
                <span>Conteúdo verificado por especialistas em meio ambiente</span>
              </li>
              <li className="flex items-start gap-3">
                <div className="w-6 h-6 bg-white rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                  <span className="text-emerald-600 font-bold">✓</span>
                </div>
                <span>Plataforma 100% gratuita e acessível</span>
              </li>
              <li className="flex items-start gap-3">
                <div className="w-6 h-6 bg-white rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                  <span className="text-emerald-600 font-bold">✓</span>
                </div>
                <span>Comunidade ativa de pessoas engajadas</span>
              </li>
              <li className="flex items-start gap-3">
                <div className="w-6 h-6 bg-white rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                  <span className="text-emerald-600 font-bold">✓</span>
                </div>
                <span>Tecnologia de IA para personalizar sua experiência</span>
              </li>
            </ul>
          </div>
        </div>
      </section>

      <section className="bg-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-slate-800 mb-12 text-center">Nossos Valores</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value) => {
              const Icon = value.icon;
              return (
                <div key={value.title} className="text-center">
                  <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full mb-4">
                    <Icon className="h-8 w-8 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-slate-800 mb-2">{value.title}</h3>
                  <p className="text-slate-600">{value.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <h2 className="text-3xl font-bold text-slate-800 mb-12 text-center">Nossa Equipe</h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {team.map((member) => (
            <div key={member.name} className="bg-white rounded-xl shadow-lg p-6 text-center hover:shadow-2xl transition-shadow">
              <div className="w-24 h-24 bg-gradient-to-r from-emerald-400 to-teal-500 rounded-full mx-auto mb-4 flex items-center justify-center">
                <span className="text-3xl font-bold text-white">
                  {member.name.split(' ').map(n => n[0]).join('')}
                </span>
              </div>
              <h3 className="text-xl font-bold text-slate-800 mb-1">{member.name}</h3>
              <p className="text-emerald-600 font-semibold mb-3">{member.role}</p>
              <p className="text-slate-600 text-sm">{member.description}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="bg-gradient-to-r from-emerald-600 to-teal-600 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8 text-center text-white">
            {stats.map((stat) => (
              <div key={stat.label}>
                <p className="text-5xl font-bold mb-2">{stat.value}</p>
                <p className="text-emerald-100 text-lg">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="bg-gradient-to-br from-amber-400 to-orange-500 rounded-2xl p-12 text-white text-center">
          <Heart className="h-16 w-16 mx-auto mb-6" />
          <h2 className="text-3xl font-bold mb-4">Junte-se a Nós</h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            Faça parte dessa comunidade de pessoas que acreditam em um futuro sustentável.
            Juntos, podemos fazer a diferença!
          </p>
          <button className="bg-white text-orange-600 px-8 py-4 rounded-lg font-bold text-lg hover:bg-orange-50 transition-colors shadow-lg">
            Inscreva-se na Newsletter
          </button>
        </div>
      </section>
    </div>
  );
}
