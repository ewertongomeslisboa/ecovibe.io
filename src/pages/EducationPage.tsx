import { useState, useEffect } from 'react';
import { GraduationCap, BookOpen, Play, Download, CheckCircle, XCircle } from 'lucide-react';
import { supabase } from '../lib/supabase';
import type { EducationalContent } from '../types';

interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correct_answer: number;
  explanation: string;
}

export default function EducationPage() {
  const [contents, setContents] = useState<EducationalContent[]>([]);
  const [selectedAudience, setSelectedAudience] = useState<string>('all');
  const [selectedContent, setSelectedContent] = useState<EducationalContent | null>(null);
  const [quizQuestions, setQuizQuestions] = useState<QuizQuestion[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showExplanation, setShowExplanation] = useState(false);
  const [score, setScore] = useState(0);
  const [quizCompleted, setQuizCompleted] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadContents();
  }, [selectedAudience]);

  const loadContents = async () => {
    setLoading(true);
    let query = supabase
      .from('educational_content')
      .select('*')
      .order('created_at', { ascending: false });

    if (selectedAudience !== 'all') {
      query = query.eq('target_audience', selectedAudience);
    }

    const { data } = await query;
    if (data) setContents(data);
    setLoading(false);
  };

  const loadQuizQuestions = async (contentId: string) => {
    const { data } = await supabase
      .from('quiz_questions')
      .select('*')
      .eq('educational_content_id', contentId);

    if (data) {
      setQuizQuestions(data);
      setCurrentQuestionIndex(0);
      setSelectedAnswer(null);
      setShowExplanation(false);
      setScore(0);
      setQuizCompleted(false);
    }
  };

  const handleContentClick = (content: EducationalContent) => {
    setSelectedContent(content);
    if (content.type === 'quiz') {
      loadQuizQuestions(content.id);
    }
  };

  const handleAnswerSelect = (answerIndex: number) => {
    if (showExplanation) return;
    setSelectedAnswer(answerIndex);
  };

  const handleSubmitAnswer = () => {
    if (selectedAnswer === null) return;

    const currentQuestion = quizQuestions[currentQuestionIndex];
    if (selectedAnswer === currentQuestion.correct_answer) {
      setScore(score + 1);
    }
    setShowExplanation(true);
  };

  const handleNextQuestion = () => {
    if (currentQuestionIndex < quizQuestions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setSelectedAnswer(null);
      setShowExplanation(false);
    } else {
      setQuizCompleted(true);
    }
  };

  const resetQuiz = () => {
    setCurrentQuestionIndex(0);
    setSelectedAnswer(null);
    setShowExplanation(false);
    setScore(0);
    setQuizCompleted(false);
  };

  const audiences = [
    { value: 'all', label: 'Todos' },
    { value: 'children', label: 'Crianças' },
    { value: 'youth', label: 'Jovens' },
    { value: 'adults', label: 'Adultos' },
  ];

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'article': return BookOpen;
      case 'video': return Play;
      case 'download': return Download;
      case 'quiz': return GraduationCap;
      default: return BookOpen;
    }
  };

  const getTypeLabel = (type: string) => {
    switch (type) {
      case 'article': return 'Artigo';
      case 'video': return 'Vídeo';
      case 'download': return 'Download';
      case 'quiz': return 'Quiz';
      default: return type;
    }
  };

  const getAudienceLabel = (audience: string) => {
    switch (audience) {
      case 'children': return 'Crianças';
      case 'youth': return 'Jovens';
      case 'adults': return 'Adultos';
      default: return audience;
    }
  };

  if (selectedContent && selectedContent.type === 'quiz' && quizQuestions.length > 0) {
    if (quizCompleted) {
      const percentage = (score / quizQuestions.length) * 100;
      return (
        <div className="min-h-screen bg-slate-50 py-8">
          <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="bg-white rounded-xl shadow-lg p-8 text-center">
              <div className="mb-6">
                {percentage >= 70 ? (
                  <div className="inline-flex items-center justify-center w-20 h-20 bg-green-100 rounded-full mb-4">
                    <CheckCircle className="h-12 w-12 text-green-600" />
                  </div>
                ) : (
                  <div className="inline-flex items-center justify-center w-20 h-20 bg-amber-100 rounded-full mb-4">
                    <GraduationCap className="h-12 w-12 text-amber-600" />
                  </div>
                )}
              </div>
              <h2 className="text-3xl font-bold text-slate-800 mb-4">Quiz Concluído!</h2>
              <p className="text-5xl font-bold text-emerald-600 mb-4">{percentage.toFixed(0)}%</p>
              <p className="text-lg text-slate-600 mb-8">
                Você acertou {score} de {quizQuestions.length} questões
              </p>
              <div className="flex gap-4 justify-center">
                <button
                  onClick={resetQuiz}
                  className="px-6 py-3 bg-emerald-600 text-white rounded-lg font-semibold hover:bg-emerald-700 transition-colors"
                >
                  Tentar Novamente
                </button>
                <button
                  onClick={() => setSelectedContent(null)}
                  className="px-6 py-3 bg-slate-200 text-slate-700 rounded-lg font-semibold hover:bg-slate-300 transition-colors"
                >
                  Voltar
                </button>
              </div>
            </div>
          </div>
        </div>
      );
    }

    const currentQuestion = quizQuestions[currentQuestionIndex];

    return (
      <div className="min-h-screen bg-slate-50 py-8">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
          <button
            onClick={() => setSelectedContent(null)}
            className="mb-6 text-emerald-600 hover:text-emerald-700 font-semibold"
          >
            ← Voltar
          </button>

          <div className="bg-white rounded-xl shadow-lg p-8">
            <div className="flex items-center justify-between mb-6">
              <span className="text-lg font-semibold text-slate-600">
                Questão {currentQuestionIndex + 1} de {quizQuestions.length}
              </span>
              <span className="text-lg font-semibold text-emerald-600">
                Pontuação: {score}/{quizQuestions.length}
              </span>
            </div>

            <div className="mb-8">
              <div className="w-full bg-slate-200 rounded-full h-2 mb-6">
                <div
                  className="bg-emerald-600 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${((currentQuestionIndex + 1) / quizQuestions.length) * 100}%` }}
                />
              </div>

              <h2 className="text-2xl font-bold text-slate-800 mb-6">
                {currentQuestion.question}
              </h2>

              <div className="space-y-3">
                {currentQuestion.options.map((option, index) => {
                  const isSelected = selectedAnswer === index;
                  const isCorrect = index === currentQuestion.correct_answer;
                  const showResult = showExplanation;

                  let buttonClass = 'w-full text-left p-4 rounded-lg border-2 transition-all ';
                  if (showResult) {
                    if (isCorrect) {
                      buttonClass += 'border-green-500 bg-green-50';
                    } else if (isSelected && !isCorrect) {
                      buttonClass += 'border-red-500 bg-red-50';
                    } else {
                      buttonClass += 'border-slate-200 bg-slate-50';
                    }
                  } else {
                    buttonClass += isSelected
                      ? 'border-emerald-500 bg-emerald-50'
                      : 'border-slate-200 hover:border-emerald-300 hover:bg-slate-50';
                  }

                  return (
                    <button
                      key={index}
                      onClick={() => handleAnswerSelect(index)}
                      disabled={showExplanation}
                      className={buttonClass}
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-slate-800">{option}</span>
                        {showResult && isCorrect && (
                          <CheckCircle className="h-5 w-5 text-green-600" />
                        )}
                        {showResult && isSelected && !isCorrect && (
                          <XCircle className="h-5 w-5 text-red-600" />
                        )}
                      </div>
                    </button>
                  );
                })}
              </div>

              {showExplanation && (
                <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                  <p className="text-slate-700">{currentQuestion.explanation}</p>
                </div>
              )}
            </div>

            <div className="flex justify-end">
              {!showExplanation ? (
                <button
                  onClick={handleSubmitAnswer}
                  disabled={selectedAnswer === null}
                  className="px-6 py-3 bg-emerald-600 text-white rounded-lg font-semibold hover:bg-emerald-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Confirmar Resposta
                </button>
              ) : (
                <button
                  onClick={handleNextQuestion}
                  className="px-6 py-3 bg-emerald-600 text-white rounded-lg font-semibold hover:bg-emerald-700 transition-colors"
                >
                  {currentQuestionIndex < quizQuestions.length - 1 ? 'Próxima Questão' : 'Ver Resultado'}
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (selectedContent) {
    const TypeIcon = getTypeIcon(selectedContent.type);

    return (
      <div className="min-h-screen bg-slate-50 py-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <button
            onClick={() => setSelectedContent(null)}
            className="mb-6 text-emerald-600 hover:text-emerald-700 font-semibold"
          >
            ← Voltar
          </button>

          <div className="bg-white rounded-xl shadow-lg p-8">
            {selectedContent.thumbnail_url && (
              <img
                src={selectedContent.thumbnail_url}
                alt={selectedContent.title}
                className="w-full h-64 object-cover rounded-lg mb-6"
              />
            )}

            <div className="flex items-center gap-4 mb-6">
              <span className="inline-flex items-center gap-2 px-3 py-1 bg-emerald-100 text-emerald-700 text-sm font-semibold rounded-full">
                <TypeIcon className="h-4 w-4" />
                {getTypeLabel(selectedContent.type)}
              </span>
              <span className="px-3 py-1 bg-violet-100 text-violet-700 text-sm font-semibold rounded-full">
                {getAudienceLabel(selectedContent.target_audience)}
              </span>
            </div>

            <h1 className="text-3xl font-bold text-slate-800 mb-6">{selectedContent.title}</h1>

            <div className="prose max-w-none text-slate-700 leading-relaxed mb-8 whitespace-pre-wrap">
              {selectedContent.content}
            </div>

            {selectedContent.file_url && (
              <a
                href={selectedContent.file_url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-6 py-3 bg-emerald-600 text-white rounded-lg font-semibold hover:bg-emerald-700 transition-colors"
              >
                <Download className="h-5 w-5" />
                Download do Material
              </a>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-slate-800 mb-4">Educação Ambiental</h1>
          <p className="text-lg text-slate-600">
            Conteúdos educativos para todas as idades sobre sustentabilidade e meio ambiente
          </p>
        </div>

        <div className="flex flex-wrap gap-2 mb-8">
          {audiences.map((audience) => (
            <button
              key={audience.value}
              onClick={() => setSelectedAudience(audience.value)}
              className={`px-4 py-2 rounded-lg font-semibold transition-colors ${
                selectedAudience === audience.value
                  ? 'bg-emerald-600 text-white'
                  : 'bg-white text-slate-600 hover:bg-slate-100'
              }`}
            >
              {audience.label}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="flex justify-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-4 border-emerald-500 border-t-transparent"></div>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {contents.map((content) => {
              const TypeIcon = getTypeIcon(content.type);
              return (
                <div
                  key={content.id}
                  onClick={() => handleContentClick(content)}
                  className="bg-white rounded-xl shadow-lg overflow-hidden cursor-pointer transform hover:scale-105 hover:shadow-2xl transition-all duration-300"
                >
                  {content.thumbnail_url ? (
                    <img
                      src={content.thumbnail_url}
                      alt={content.title}
                      className="w-full h-48 object-cover"
                    />
                  ) : (
                    <div className="w-full h-48 bg-gradient-to-br from-violet-400 to-purple-500 flex items-center justify-center">
                      <TypeIcon className="h-16 w-16 text-white opacity-50" />
                    </div>
                  )}
                  <div className="p-6">
                    <div className="flex items-center gap-2 mb-3">
                      <span className="inline-flex items-center gap-1 px-3 py-1 bg-emerald-100 text-emerald-700 text-sm font-semibold rounded-full">
                        <TypeIcon className="h-3 w-3" />
                        {getTypeLabel(content.type)}
                      </span>
                      <span className="px-3 py-1 bg-violet-100 text-violet-700 text-sm font-semibold rounded-full">
                        {getAudienceLabel(content.target_audience)}
                      </span>
                    </div>
                    <h2 className="text-xl font-bold text-slate-800 mb-2 line-clamp-2">
                      {content.title}
                    </h2>
                    <p className="text-slate-600 line-clamp-3">{content.content}</p>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {!loading && contents.length === 0 && (
          <div className="text-center py-20">
            <p className="text-slate-600 text-lg">Nenhum conteúdo encontrado para este público.</p>
          </div>
        )}
      </div>
    </div>
  );
}
