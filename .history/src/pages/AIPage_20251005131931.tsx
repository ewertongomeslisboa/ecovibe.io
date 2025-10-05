import { useState } from 'react';
import { Bot, Send, Sparkles, Leaf } from 'lucide-react';
import { supabase } from '../lib/supabase';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

export default function AIPage() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      role: 'assistant',
      content: 'Olá! Sou o assistente ambiental EcoVida. Posso responder perguntas sobre meio ambiente, sustentabilidade, reciclagem, mudanças climáticas e muito mais. Como posso ajudar você hoje?',
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [sessionId] = useState(() => `session-${Date.now()}`);

  const suggestedQuestions = [
    'Como posso reduzir meu consumo de plástico?',
    'Quais são as principais causas do aquecimento global?',
    'Como fazer compostagem em casa?',
    'O que é economia circular?',
    'Dicas para economizar energia em casa',
  ];

  const getAIResponse = (userMessage: string): string => {
    const lowerMessage = userMessage.toLowerCase();

    if (lowerMessage.includes('plástico') || lowerMessage.includes('plastico')) {
      return 'Reduzir o consumo de plástico é essencial! Aqui estão algumas dicas:\n\n1. Use sacolas reutilizáveis para compras\n2. Prefira garrafas de água reutilizáveis\n3. Evite canudos de plástico\n4. Compre produtos com menos embalagem\n5. Use recipientes de vidro para armazenar alimentos\n6. Escolha produtos de limpeza em barra ao invés de líquidos em garrafas plásticas\n\nPequenas mudanças fazem grande diferença!';
    }

    if (lowerMessage.includes('aquecimento global') || lowerMessage.includes('mudanças climáticas') || lowerMessage.includes('mudancas climaticas')) {
      return 'As principais causas do aquecimento global incluem:\n\n1. Queima de combustíveis fósseis (petróleo, carvão, gás natural)\n2. Desmatamento de florestas\n3. Agricultura intensiva e pecuária\n4. Processos industriais\n5. Geração de resíduos\n\nIsso resulta no aumento de gases de efeito estufa como CO2 e metano, que retêm calor na atmosfera. Para combater, precisamos usar energias renováveis, preservar florestas e reduzir nosso consumo.';
    }

    if (lowerMessage.includes('compostagem')) {
      return 'A compostagem é uma forma excelente de reduzir resíduos! Veja como começar:\n\n1. Escolha um recipiente apropriado (composteira ou área no quintal)\n2. Adicione resíduos orgânicos: cascas de frutas e vegetais, borra de café, folhas secas\n3. Evite: carnes, laticínios, óleos, alimentos cozidos\n4. Mantenha úmido mas não encharcado\n5. Misture regularmente para oxigenar\n6. Em 2-3 meses terá adubo orgânico de qualidade!\n\nO composto pode ser usado em plantas e hortas.';
    }

    if (lowerMessage.includes('economia circular')) {
      return 'Economia Circular é um modelo econômico que busca eliminar resíduos e promover o uso contínuo de recursos:\n\n- Design de produtos duráveis e reparáveis\n- Reutilização e remanufatura\n- Reciclagem de materiais\n- Uso de energias renováveis\n- Compartilhamento de recursos\n\nDiferente da economia linear (extrair-produzir-descartar), a economia circular mantém produtos e materiais em uso pelo máximo de tempo possível!';
    }

    if (lowerMessage.includes('energia') || lowerMessage.includes('eletricidade')) {
      return 'Dicas para economizar energia em casa:\n\n1. Troque lâmpadas por LED (gastam 80% menos)\n2. Desligue aparelhos da tomada quando não usar\n3. Use ar condicionado com moderação (23-24°C é ideal)\n4. Limpe filtros de ar condicionado regularmente\n5. Use máquina de lavar roupa com carga completa\n6. Seque roupas ao sol quando possível\n7. Ajuste temperatura da geladeira adequadamente\n8. Considere investir em painéis solares\n\nEconomia de energia = economia financeira + ajuda ao planeta!';
    }

    if (lowerMessage.includes('reciclagem') || lowerMessage.includes('reciclar')) {
      return 'Guia básico de reciclagem:\n\n🔵 AZUL - Papel e papelão\n🔴 VERMELHO - Plástico\n🟢 VERDE - Vidro\n🟡 AMARELO - Metal\n🟤 MARROM - Orgânico\n⚫ PRETO - Não reciclável\n\nDicas importantes:\n- Limpe as embalagens antes de descartar\n- Separe tampas de garrafas\n- Achate caixas para economizar espaço\n- Procure pontos de coleta seletiva em sua cidade\n\nReciclar reduz poluição e economiza recursos naturais!';
    }

    if (lowerMessage.includes('água') || lowerMessage.includes('agua')) {
      return 'Economizar água é fundamental! Veja como:\n\n1. Feche a torneira ao escovar dentes (economiza 12L por escovação)\n2. Reduza tempo no chuveiro (5 minutos é suficiente)\n3. Conserte vazamentos imediatamente\n4. Reutilize água da máquina de lavar para limpar áreas externas\n5. Colete água da chuva para plantas\n6. Use descarga econômica ou com duplo acionamento\n7. Lave carro com balde ao invés de mangueira\n\nA água é um recurso precioso e finito!';
    }

    if (lowerMessage.includes('obrigad') || lowerMessage.includes('valeu')) {
      return 'Por nada! Fico feliz em poder ajudar com informações ambientais. Lembre-se: cada pequena ação conta para um planeta mais sustentável! Tem mais alguma dúvida?';
    }

    return 'Essa é uma ótima pergunta sobre meio ambiente! Posso ajudar com informações sobre:\n\n- Redução de resíduos e reciclagem\n- Economia de água e energia\n- Mudanças climáticas\n- Preservação da biodiversidade\n- Práticas sustentáveis no dia a dia\n- Energias renováveis\n- Compostagem e agricultura sustentável\n\nPode fazer sua pergunta de forma mais específica, ou escolha um dos temas acima!';
  };

  const handleSendMessage = async () => {
    if (!input.trim()) return;

    const userMessage: Message = {
      id: `user-${Date.now()}`,
      role: 'user',
      content: input,
      timestamp: new Date(),
    };

    setMessages([...messages, userMessage]);
    setInput('');
    setIsTyping(true);

    await supabase.from('ai_chat_logs').insert([{
      session_id: sessionId,
      user_message: input,
      ai_response: '',
    }]);

    setTimeout(() => {
      const aiResponse = getAIResponse(input);
      const assistantMessage: Message = {
        id: `assistant-${Date.now()}`,
        role: 'assistant',
        content: aiResponse,
        timestamp: new Date(),
      };

      setMessages(prev => [...prev, assistantMessage]);
      setIsTyping(false);

      supabase.from('ai_chat_logs').insert([{
        session_id: sessionId,
        user_message: input,
        ai_response: aiResponse,
      }]);
    }, 1000);
  };

  const handleSuggestedQuestion = (question: string) => {
    setInput(question);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white py-8">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full mb-4 shadow-lg">
            <Bot className="h-10 w-10 text-white" />
          </div>
          <h1 className="text-4xl font-bold text-slate-800 mb-4">IA Ambiental EcoVida</h1>
          <p className="text-lg text-slate-600">
            Tire suas dúvidas sobre meio ambiente com nosso assistente inteligente
          </p>
        </div>

        <div className="bg-white rounded-xl shadow-2xl overflow-hidden">
          <div className="bg-gradient-to-r from-emerald-600 to-teal-600 p-4 flex items-center gap-3">
            <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center">
              <Leaf className="h-6 w-6 text-emerald-600" />
            </div>
            <div className="text-white">
              <p className="font-semibold">Assistente EcoVida</p>
              <p className="text-sm text-emerald-100">Sempre online para ajudar</p>
            </div>
          </div>

          <div className="h-[500px] overflow-y-auto p-6 space-y-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[80%] rounded-2xl px-6 py-4 ${
                    message.role === 'user'
                      ? 'bg-emerald-600 text-white'
                      : 'bg-slate-100 text-slate-800'
                  }`}
                >
                  <p className="whitespace-pre-wrap leading-relaxed">{message.content}</p>
                  <p
                    className={`text-xs mt-2 ${
                      message.role === 'user' ? 'text-emerald-100' : 'text-slate-500'
                    }`}
                  >
                    {message.timestamp.toLocaleTimeString('pt-BR', {
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </p>
                </div>
              </div>
            ))}

            {isTyping && (
              <div className="flex justify-start">
                <div className="bg-slate-100 rounded-2xl px-6 py-4">
                  <div className="flex gap-2">
                    <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce delay-100"></div>
                    <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce delay-200"></div>
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="border-t border-slate-200 p-4">
            <div className="flex gap-2 mb-4 overflow-x-auto pb-2">
              {suggestedQuestions.map((question, index) => (
                <button
                  key={index}
                  onClick={() => handleSuggestedQuestion(question)}
                  className="flex-shrink-0 px-4 py-2 bg-emerald-50 text-emerald-700 rounded-full text-sm font-medium hover:bg-emerald-100 transition-colors flex items-center gap-2"
                >
                  <Sparkles className="h-3 w-3" />
                  {question}
                </button>
              ))}
            </div>

            <div className="flex gap-2">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                placeholder="Digite sua pergunta sobre meio ambiente..."
                className="flex-1 px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
              <button
                onClick={handleSendMessage}
                disabled={!input.trim() || isTyping}
                className="px-6 py-3 bg-emerald-600 text-white rounded-lg font-semibold hover:bg-emerald-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                <Send className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>

        <div className="mt-8 grid md:grid-cols-3 gap-6">
          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mb-4">
              <Sparkles className="h-6 w-6 text-blue-600" />
            </div>
            <h3 className="text-xl font-bold text-slate-800 mb-2">Respostas Rápidas</h3>
            <p className="text-slate-600">
              Obtenha informações instantâneas sobre práticas sustentáveis
            </p>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mb-4">
              <Bot className="h-6 w-6 text-green-600" />
            </div>
            <h3 className="text-xl font-bold text-slate-800 mb-2">Disponível 24/7</h3>
            <p className="text-slate-600">
              Tire suas dúvidas ambientais a qualquer hora do dia
            </p>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="w-12 h-12 bg-amber-100 rounded-full flex items-center justify-center mb-4">
              <Leaf className="h-6 w-6 text-amber-600" />
            </div>
            <h3 className="text-xl font-bold text-slate-800 mb-2">Dicas Personalizadas</h3>
            <p className="text-slate-600">
              Receba orientações específicas para suas necessidades
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
