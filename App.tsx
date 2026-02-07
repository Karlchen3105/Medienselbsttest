import React, { useState, useEffect } from 'react';
import { ArrowRight, ArrowLeft, RotateCcw, CheckCircle2, AlertCircle, Info, Moon, Sun, ChevronDown, ChevronUp } from 'lucide-react';
import { QUESTIONS, OPTIONS, EVALUATIONS } from './constants';
import { AnswerValue, Step } from './types';

const App: React.FC = () => {
  const [step, setStep] = useState<Step>('start');
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<number, AnswerValue>>({});
  const [hasStarted, setHasStarted] = useState(false);
  
  // Theme State
  const [isDarkMode, setIsDarkMode] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('theme') === 'dark' || 
             (!localStorage.getItem('theme') && window.matchMedia('(prefers-color-scheme: dark)').matches);
    }
    return false;
  });

  // Review Screen Editing State
  const [editingId, setEditingId] = useState<number | null>(null);

  // Animierte Punktzahl auf der Ergebnis-Seite (Count-up)
  const [displayScore, setDisplayScore] = useState(0);

  // --- Effects ---

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [isDarkMode]);

  // Count-up-Animation der Punktzahl, wenn Ergebnis-Seite angezeigt wird
  useEffect(() => {
    if (step !== 'result') {
      setDisplayScore(0);
      return;
    }
    const target = Object.values(answers).reduce((sum: number, val) => sum + Number(val), 0) as number;
    setDisplayScore(0);
    const duration = 1200;
    const startTime = performance.now();
    function tick(now: number) {
      const elapsed = now - startTime;
      const t = Math.min(elapsed / duration, 1);
      const eased = 1 - (1 - t) * (1 - t);
      setDisplayScore(Math.round(eased * target));
      if (t < 1) requestAnimationFrame(tick);
    }
    const id = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(id);
  }, [step, answers]);

  // --- Actions ---

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
  };

  const handleStart = () => {
    setHasStarted(true);
    setStep('quiz');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleAnswer = (value: AnswerValue) => {
    setAnswers(prev => ({ ...prev, [QUESTIONS[currentQuestionIndex].id]: value }));
  };

  const nextQuestion = () => {
    if (currentQuestionIndex < QUESTIONS.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      setStep('review');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const prevQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(prev => prev - 1);
    } else {
      setStep('start');
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleReviewAnswer = (qId: number, val: AnswerValue) => {
    setAnswers(prev => ({ ...prev, [qId]: val }));
    setEditingId(null); // Auto collapse after selection
  };

  const calculateScore = () => {
    return Object.values(answers).reduce((sum, val) => sum + val, 0);
  };

  const finishTest = () => {
    setStep('result');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const resetTest = () => {
    setAnswers({});
    setCurrentQuestionIndex(0);
    setStep('start');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // --- Derived State for UI ---
  const currentQuestion = QUESTIONS[currentQuestionIndex];
  const currentAnswer = answers[currentQuestion.id];
  const progress = ((currentQuestionIndex + 1) / QUESTIONS.length) * 100;
  const isAnswerSelected = answers[currentQuestion.id] !== undefined;

  // --- Components ---

  const ThemeToggle = () => (
    <button
      onClick={toggleTheme}
      className="fixed top-6 right-6 z-50 p-2.5 rounded-full bg-white/80 dark:bg-zinc-800/80 backdrop-blur-md shadow-lg border border-gray-200 dark:border-zinc-700 text-gray-700 dark:text-gray-200 transition-all duration-300 hover:scale-105"
      aria-label="Toggle Dark Mode"
    >
      {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
    </button>
  );

  const renderStartScreen = () => (
    <div className="flex flex-col items-center justify-center min-h-[80vh] px-6 max-w-2xl mx-auto text-center animate-fade-in pt-16">
      <div className="w-20 h-20 bg-blue-50 dark:bg-blue-900/20 rounded-3xl flex items-center justify-center mb-8 shadow-sm">
        <Info className="w-10 h-10 text-blue-600 dark:text-blue-400" />
      </div>
      <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-6 tracking-tight">
        Medien-Reflexion
      </h1>
      <p className="text-xl text-gray-600 dark:text-gray-300 mb-8 leading-relaxed">
        Dieser Selbsttest hilft Ihnen, Ihr Internet- und Mediennutzungsverhalten strukturiert zu reflektieren. 
        Nehmen Sie sich einen Moment Zeit.
      </p>
      
      <div className="bg-white dark:bg-[#1C1C1E] p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-zinc-800 mb-10 w-full text-left">
        <h3 className="font-semibold text-gray-900 dark:text-white mb-2 flex items-center gap-2">
          <CheckCircle2 className="w-5 h-5 text-green-500" />
          Bitte beachten Sie
        </h3>
        <ul className="space-y-3 text-gray-600 dark:text-gray-400">
          <li className="flex gap-2">
            <span className="w-1.5 h-1.5 bg-gray-300 dark:bg-zinc-600 rounded-full mt-2 shrink-0" />
            Antworten Sie bitte so ehrlich wie möglich.
          </li>
          <li className="flex gap-2">
            <span className="w-1.5 h-1.5 bg-gray-300 dark:bg-zinc-600 rounded-full mt-2 shrink-0" />
            Es gibt kein "Richtig" oder "Falsch".
          </li>
          <li className="flex gap-2">
            <span className="w-1.5 h-1.5 bg-gray-300 dark:bg-zinc-600 rounded-full mt-2 shrink-0" />
            Das Ergebnis dient nur Ihrer persönlichen Orientierung.
          </li>
          <li className="flex gap-2">
            <span className="w-1.5 h-1.5 bg-gray-300 dark:bg-zinc-600 rounded-full mt-2 shrink-0" />
            Der Test ist anonym, komplett anonym.
          </li>
        </ul>
      </div>

      <button
        onClick={handleStart}
        className="group relative inline-flex items-center justify-center px-8 py-4 text-lg font-medium text-white transition-all duration-200 bg-blue-600 dark:bg-blue-600 rounded-full hover:bg-blue-700 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-600 active:scale-95 w-full sm:w-auto"
      >
        Test starten
        <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
      </button>
    </div>
  );

  const renderQuizScreen = () => (
    <div className="max-w-2xl mx-auto px-6 py-20 min-h-screen flex flex-col">
      {/* Header / Progress */}
      <div className="mb-12">
        <div className="flex justify-between text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">
          <span>Frage {currentQuestionIndex + 1} von {QUESTIONS.length}</span>
          <span>{Math.round(progress)}%</span>
        </div>
        <div className="h-2 bg-gray-200 dark:bg-zinc-800 rounded-full overflow-hidden">
          <div 
            className="h-full bg-blue-600 dark:bg-blue-500 transition-all duration-500 ease-out rounded-full"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* Question Card */}
      <div className="flex-1 flex flex-col justify-center animate-fade-in-up">
        <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-10 leading-snug">
          {currentQuestion.text}
        </h2>

        <div className="space-y-3">
          {OPTIONS.map((option) => (
            <button
              key={option.value}
              onClick={() => handleAnswer(option.value)}
              className={`w-full text-left px-6 py-4 rounded-xl border-2 transition-all duration-200 flex items-center justify-between group
                ${currentAnswer === option.value 
                  ? 'border-blue-600 bg-blue-50 dark:bg-blue-900/30 dark:border-blue-500 shadow-md' 
                  : 'border-transparent bg-white dark:bg-[#1C1C1E] shadow-sm hover:border-gray-200 dark:hover:border-zinc-700'
                }
              `}
            >
              <span className={`text-lg font-medium ${currentAnswer === option.value ? 'text-blue-900 dark:text-blue-200' : 'text-gray-700 dark:text-gray-300'}`}>
                {option.label}
              </span>
              {currentAnswer === option.value && (
                <CheckCircle2 className="w-6 h-6 text-blue-600 dark:text-blue-400 animate-scale-in" />
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Navigation Footer */}
      <div className="mt-12 flex justify-between items-center pt-6 border-t border-gray-100 dark:border-zinc-800">
        <button
          onClick={prevQuestion}
          className="px-4 py-2 text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors flex items-center font-medium"
        >
          <ArrowLeft className="w-5 h-5 mr-2" />
          Zurück
        </button>

        <button
          onClick={nextQuestion}
          disabled={!isAnswerSelected}
          className={`px-8 py-3 rounded-full font-semibold transition-all duration-200 flex items-center
            ${isAnswerSelected 
              ? 'bg-blue-600 dark:bg-blue-600 text-white shadow-md hover:bg-blue-700 hover:shadow-lg active:scale-95' 
              : 'bg-gray-200 dark:bg-zinc-800 text-gray-400 dark:text-zinc-600 cursor-not-allowed'
            }
          `}
        >
          {currentQuestionIndex === QUESTIONS.length - 1 ? 'Zur Übersicht' : 'Weiter'}
          <ArrowRight className="ml-2 w-5 h-5" />
        </button>
      </div>
    </div>
  );

  const renderReviewScreen = () => (
    <div className="max-w-2xl mx-auto px-6 py-20 animate-fade-in">
      <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Ihre Antworten</h2>
      <p className="text-gray-600 dark:text-gray-400 mb-8">
        Überprüfen Sie Ihre Eingaben. Tippen Sie auf eine Frage, um die Antwort zu ändern.
      </p>

      <div className="space-y-4 mb-10">
        {QUESTIONS.map((q, idx) => {
           const answerVal = answers[q.id];
           const answerLabel = OPTIONS.find(o => o.value === answerVal)?.label;
           const isEditing = editingId === q.id;
           
           return (
            <div 
              key={q.id} 
              className={`rounded-2xl shadow-sm border transition-all overflow-hidden
                ${isEditing 
                  ? 'bg-blue-50/50 dark:bg-blue-900/10 border-blue-200 dark:border-blue-800' 
                  : 'bg-white dark:bg-[#1C1C1E] border-gray-100 dark:border-zinc-800 hover:shadow-md'
                }`}
            >
              {/* Question Row */}
              <div 
                className="p-5 flex flex-col sm:flex-row sm:items-start justify-between gap-4 cursor-pointer"
                onClick={() => setEditingId(isEditing ? null : q.id)}
              >
                <div className="flex gap-4 flex-1">
                  <span className="text-gray-400 dark:text-zinc-600 font-mono text-sm pt-1">{(idx + 1).toString().padStart(2, '0')}</span>
                  <div className="flex-1">
                    <p className={`font-medium mb-1 text-sm sm:text-base transition-colors ${isEditing ? 'text-blue-900 dark:text-blue-100' : 'text-gray-900 dark:text-gray-200'}`}>
                      {q.text}
                    </p>
                    {!isEditing && (
                      <p className="text-blue-600 dark:text-blue-400 font-semibold">{answerLabel}</p>
                    )}
                  </div>
                </div>
                <div className="shrink-0 flex items-center justify-between sm:justify-end gap-2 w-full sm:w-auto">
                   {isEditing && (
                      <span className="text-xs font-bold text-blue-600 dark:text-blue-400 uppercase tracking-wide sm:hidden">
                        Wählen Sie:
                      </span>
                   )}
                   <div className={`text-gray-400 dark:text-zinc-500 transition-transform duration-300 ${isEditing ? 'rotate-180' : ''}`}>
                      <ChevronDown size={20} />
                   </div>
                </div>
              </div>

              {/* Inline Editing Dropdown/Panel */}
              <div 
                className={`grid transition-all duration-300 ease-in-out border-t border-blue-100 dark:border-blue-900/30
                  ${isEditing ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'}
                `}
              >
                <div className="overflow-hidden">
                  <div className="p-4 grid gap-2 sm:grid-cols-5">
                    {OPTIONS.map((opt) => (
                      <button
                        key={opt.value}
                        onClick={(e) => {
                          e.stopPropagation();
                          handleReviewAnswer(q.id, opt.value);
                        }}
                        className={`py-2 px-1 rounded-lg text-sm font-medium transition-colors border
                          ${answerVal === opt.value
                            ? 'bg-blue-600 text-white border-blue-600 shadow-sm'
                            : 'bg-white dark:bg-zinc-800 text-gray-600 dark:text-gray-300 border-gray-200 dark:border-zinc-700 hover:bg-gray-50 dark:hover:bg-zinc-700'
                          }
                        `}
                      >
                        {opt.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
           );
        })}
      </div>

      <div className="flex justify-between items-center bg-white/50 dark:bg-zinc-900/50 backdrop-blur-sm p-4 rounded-2xl sticky bottom-6 border border-gray-100 dark:border-zinc-800 shadow-xl">
         <button
          onClick={() => {
             setStep('quiz');
             setCurrentQuestionIndex(QUESTIONS.length - 1);
          }}
          className="text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white font-medium px-4"
        >
          Zurück
        </button>
        <button
          onClick={finishTest}
          className="px-8 py-3 bg-blue-600 dark:bg-blue-600 text-white rounded-full font-bold text-lg shadow-lg hover:bg-blue-700 hover:shadow-xl transition-all active:scale-95"
        >
          Zur Auswertung
        </button>
      </div>
    </div>
  );

  const renderResultScreen = () => {
    const score = calculateScore();
    const evaluation = EVALUATIONS.find(e => score >= e.scoreRange[0] && score <= e.scoreRange[1]) || EVALUATIONS[0];
    const maxScore = QUESTIONS.length * 4;

    return (
      <div className="max-w-2xl mx-auto px-6 py-20">
        <div className="text-center mb-12 result-reveal" style={{ animationDelay: '0ms' }}>
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Ihr Ergebnis</h2>
          <div className="text-sm text-gray-500 dark:text-gray-400 uppercase tracking-wide font-semibold">Selbstreflexion abgeschlossen</div>
        </div>

        <div className="bg-white dark:bg-[#1C1C1E] rounded-3xl shadow-lg border border-gray-100 dark:border-zinc-800 overflow-hidden mb-10 result-reveal result-reveal-card" style={{ animationDelay: '80ms' }}>
          <div className="p-8 sm:p-12 text-center border-b border-gray-100 dark:border-zinc-800 bg-gradient-to-b from-gray-50 to-white dark:from-zinc-800/50 dark:to-[#1C1C1E]">
            <div className={`text-6xl font-bold mb-2 result-score ${evaluation.colorClass}`}>
              {displayScore}
              <span className="text-2xl text-gray-400 dark:text-gray-500 font-normal ml-1">/ {maxScore}</span>
            </div>
            <p className="text-gray-500 dark:text-gray-400 font-medium">Gesamtpunktzahl</p>
          </div>
          
          <div className="p-8 sm:p-12">
            <h3 className={`text-2xl font-bold mb-4 ${evaluation.colorClass} flex items-center justify-center gap-2`}>
              {score >= 27 && <AlertCircle className="w-6 h-6" />}
              {evaluation.title}
            </h3>
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed text-lg">
              {evaluation.description}
            </p>
          </div>
        </div>

        <div className="bg-blue-50 dark:bg-blue-900/20 rounded-2xl p-6 mb-6 flex gap-4 items-start border border-blue-100 dark:border-blue-900/30 result-reveal" style={{ animationDelay: '200ms' }}>
           <Info className="w-6 h-6 text-blue-600 dark:text-blue-400 shrink-0 mt-1" />
           <p className="text-sm text-blue-800 dark:text-blue-300 leading-relaxed">
             Hinweis: Dieser Test dient zur ersten Einschätzung und ersetzt keine professionelle Diagnose. 
             Wenn Sie sich Sorgen um Ihren Medienkonsum machen, zögern Sie nicht, professionelle Beratungsstellen zu kontaktieren.
           </p>
        </div>

        {/* Abschluss-Infobox: stärkerer Fokus als der Wiederholen-Button */}
        <div
          className="rounded-2xl shadow-2xl border border-gray-200 dark:border-zinc-600 bg-white dark:bg-zinc-900 flex items-center gap-4 p-5 sm:p-6 mb-6 result-reveal"
          style={{ animationDelay: '320ms' }}
          aria-label="Selbsttest beendet"
        >
          <div className="shrink-0 w-12 h-12 rounded-full bg-green-100 dark:bg-green-900/40 flex items-center justify-center result-check">
            <CheckCircle2 className="w-6 h-6 text-green-600 dark:text-green-400" />
          </div>
          <p className="text-base sm:text-lg text-gray-700 dark:text-gray-200 leading-snug font-medium">
            Der Selbsttest ist beendet. Bitte kehren Sie ins Übersichtsprogramm zurück.
          </p>
        </div>

        <div className="flex justify-center pb-20 result-reveal" style={{ animationDelay: '420ms' }}>
          <button
            onClick={resetTest}
            className="flex items-center gap-2 px-5 py-2.5 text-sm text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 font-medium rounded-full border border-gray-200 dark:border-zinc-700 hover:border-gray-300 dark:hover:border-zinc-600 transition-all"
          >
            <RotateCcw className="w-4 h-4" />
            Test wiederholen
          </button>
        </div>
      </div>
    );
  };

  return (
    <div className={`min-h-screen font-sans selection:bg-blue-100 selection:text-blue-900 dark:selection:bg-blue-900 dark:selection:text-white transition-colors duration-300 bg-[#F5F5F7] dark:bg-black`}>
      <ThemeToggle />
      <main className="w-full">
        {step === 'start' && renderStartScreen()}
        {step === 'quiz' && renderQuizScreen()}
        {step === 'review' && renderReviewScreen()}
        {step === 'result' && renderResultScreen()}
      </main>

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes scaleIn {
          from { transform: scale(0); }
          to { transform: scale(1); }
        }
        .animate-fade-in {
          animation: fadeIn 0.5s ease-out forwards;
        }
        .animate-fade-in-up {
          animation: fadeInUp 0.6s ease-out forwards;
        }
        .animate-scale-in {
          animation: scaleIn 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards;
        }
        /* Apple-style Ergebnis-Seite: dezent, gestaffelt, weich */
        @keyframes resultReveal {
          from {
            opacity: 0;
            transform: translateY(14px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        @keyframes resultCardReveal {
          from {
            opacity: 0;
            transform: translateY(14px) scale(0.98);
          }
          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }
        @keyframes resultScoreIn {
          from {
            opacity: 0;
            transform: scale(0.92);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }
        @keyframes resultCheckIn {
          from {
            opacity: 0;
            transform: scale(0.6);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }
        .result-reveal {
          animation: resultReveal 0.7s cubic-bezier(0.25, 0.1, 0.25, 1) forwards;
          opacity: 0;
        }
        .result-reveal-card {
          animation-name: resultCardReveal;
        }
        .result-score {
          animation: resultScoreIn 0.6s cubic-bezier(0.34, 1.2, 0.64, 1) 0.25s forwards;
          opacity: 0;
        }
        .result-check {
          animation: resultCheckIn 0.5s cubic-bezier(0.34, 1.2, 0.64, 1) 0.15s forwards;
          opacity: 0;
        }
      `}</style>
    </div>
  );
};

export default App;