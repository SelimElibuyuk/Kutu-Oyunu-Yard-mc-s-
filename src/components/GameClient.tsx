'use client';

import React, { useState, useEffect, useRef } from 'react';
import { GameData, GAMES_DATA } from '@/data/games';
import {
  Send,
  Mic,
  MicOff,
  Dices,
  Trophy,
  Sparkles,
  BookOpen,
  RotateCcw,
  Clock,
  Users,
  ShieldCheck,
  ChevronRight,
  HelpCircle,
  ArrowLeft,
  Zap,
} from 'lucide-react';
import { Navbar } from '@/components/Navbar';
import { ScoreTracker } from '@/components/ScoreTracker';
import { DiceRoller } from '@/components/DiceRoller';
import { getGameIcon } from '@/data/icons';
import Link from 'next/link';

interface Message {
  role: 'user' | 'assistant';
  content: string;
  source?: 'gemini' | 'local_engine';
  time: string;
}

interface GameClientProps {
  game: GameData;
}

export const GameClient: React.FC<GameClientProps> = ({ game }) => {
  const [activeTab, setActiveTab] = useState<'chat' | 'setup' | 'turn' | 'faq'>('chat');

  // Modals
  const [isScoreOpen, setIsScoreOpen] = useState(false);
  const [isDiceOpen, setIsDiceOpen] = useState(false);

  // Chat State
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const defaultWelcome: Message = {
      role: 'assistant',
      content: `Selam masadakiler! 🎲 Ben **${game.title}** resmi Kural Hakeminizim.\n\nOyun kurulumu, hamleler, puan hesaplama veya çıkan kural anlaşmazlıklarında buradayım. Aklınıza takılan herhangi bir durumu sorabilir veya aşağıdaki hazır kural kartlarından birini seçebilirsiniz!`,
      time: new Date().toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' }),
    };
    setMessages([defaultWelcome]);
  }, [game]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  const toggleSpeech = () => {
    if (!('webkitSpeechRecognition' in window || 'SpeechRecognition' in window)) {
      alert('Tarayıcınız sesli girişi desteklemiyor. Lütfen Chrome, Edge veya Safari kullanın.');
      return;
    }

    if (isListening) {
      setIsListening(false);
      return;
    }

    const SpeechRecognitionAPI =
      (window as unknown as { SpeechRecognition?: unknown }).SpeechRecognition ||
      (window as unknown as { webkitSpeechRecognition?: unknown }).webkitSpeechRecognition;

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const recognition = new (SpeechRecognitionAPI as any)();
    recognition.lang = 'tr-TR';
    recognition.continuous = false;
    recognition.interimResults = false;

    recognition.onstart = () => {
      setIsListening(true);
    };

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript;
      setInput(transcript);
      setIsListening(false);
      handleSendMessage(transcript);
    };

    recognition.onerror = () => {
      setIsListening(false);
    };

    recognition.onend = () => {
      setIsListening(false);
    };

    recognition.start();
  };

  const handleSendMessage = async (customText?: string) => {
    const textToSend = customText || input;
    if (!textToSend.trim() || isLoading) return;

    const userMsg: Message = {
      role: 'user',
      content: textToSend.trim(),
      time: new Date().toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' }),
    };

    const newMessages = [...messages, userMsg];
    setMessages(newMessages);
    setInput('');
    setIsLoading(true);

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          gameId: game.id,
          messages: newMessages.map((m) => ({ role: m.role, content: m.content })),
        }),
      });

      const data = await res.json();
      if (data.reply) {
        setMessages((prev) => [
          ...prev,
          {
            role: 'assistant',
            content: data.reply,
            source: data.source,
            time: new Date().toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' }),
          },
        ]);
      } else {
        throw new Error('Yanıt alınamadı');
      }
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          content: 'Bağlantıda bir aksama oldu. Lütfen sorunuzu tekrar iletin.',
          time: new Date().toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' }),
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f0fdf4] text-slate-900 flex flex-col">
      <Navbar />

      {/* Game Header Banner */}
      <div className="bg-white border-b-[3px] border-slate-900 shadow-[0_3px_0_0_rgba(15,23,42,0.05)]">
        <div className="max-w-4xl mx-auto px-4 py-4 sm:py-5">
          {/* Top Quick Nav Row */}
          <div className="flex items-center justify-between mb-3">
            <Link
              href="/"
              className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-700 hover:text-slate-900 transition bg-slate-100 hover:bg-slate-200 px-3 py-1.5 min-h-[44px] rounded-xl border-2 border-slate-900 shadow-[2px_2px_0px_0px_#0f172a]"
            >
              <ArrowLeft className="w-4 h-4" /> Tüm Oyunlar
            </Link>

            {/* Quick other games switcher */}
            <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar max-w-[240px] sm:max-w-none">
              <span className="text-[10px] font-bold text-slate-400 mr-1 hidden sm:inline">Diğer Masalar:</span>
              {Object.values(GAMES_DATA)
                .filter((g) => g.id !== game.id)
                .slice(0, 4)
                .map((g) => (
                  <Link
                    key={g.id}
                    href={`/game/${g.id}`}
                    className="px-2.5 py-1.5 rounded-lg text-xs font-bold text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition whitespace-nowrap min-h-[44px] flex items-center"
                  >
                    {g.title}
                  </Link>
                ))}
            </div>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3.5">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-lg bg-sky-200 border-2 border-slate-900 text-slate-900 text-xs font-extrabold shadow-[2px_2px_0px_0px_#0f172a]">
                  {game.category}
                </span>
                <span className="flex items-center gap-1.5 text-xs font-bold text-emerald-800 bg-emerald-100 border border-emerald-300 px-2.5 py-0.5 rounded-lg">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping inline-block" />
                  Hakem Çevrimiçi
                </span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900 font-display flex items-center gap-2">
                <span className="text-3xl">{getGameIcon(game.id)}</span>
                <span>{game.title} Asistanı</span>
              </h1>
              <p className="text-xs sm:text-sm font-semibold text-slate-600 max-w-xl">
                {game.tagline}
              </p>
            </div>

            {/* Table Action Buttons */}
            <div className="flex items-center gap-2 flex-wrap">
              <button
                type="button"
                onClick={() => setIsDiceOpen(true)}
                className="pixel-btn bg-amber-200 hover:bg-amber-300 text-slate-900 px-3 py-2 min-h-[44px] text-xs flex items-center gap-1.5 font-bold"
                title="Zar At"
              >
                <Dices className="w-4 h-4 stroke-[2.5]" />
                <span className="font-extrabold">Zar At</span>
              </button>
              <button
                type="button"
                onClick={() => setIsScoreOpen(true)}
                className="pixel-btn bg-emerald-200 hover:bg-emerald-300 text-slate-900 px-3 py-2 min-h-[44px] text-xs flex items-center gap-1.5 font-bold"
                title="Skor Tablosu"
              >
                <Trophy className="w-4 h-4 stroke-[2.5]" />
                <span className="font-extrabold">Skor</span>
              </button>
            </div>
          </div>

          {/* Quick Specs */}
          <div className="flex flex-wrap items-center gap-2 pt-3 text-xs font-bold text-slate-700">
            <span className="flex items-center gap-1.5 bg-sky-50 px-2.5 py-1.5 rounded-lg border-2 border-slate-900 shadow-[1px_1px_0px_0px_#0f172a]">
              <Users className="w-3.5 h-3.5 text-sky-600" /> {game.players}
            </span>
            <span className="flex items-center gap-1.5 bg-emerald-50 px-2.5 py-1.5 rounded-lg border-2 border-slate-900 shadow-[1px_1px_0px_0px_#0f172a]">
              <Clock className="w-3.5 h-3.5 text-emerald-600" /> {game.duration}
            </span>
            <span className="flex items-center gap-1.5 bg-amber-50 px-2.5 py-1.5 rounded-lg border-2 border-slate-900 shadow-[1px_1px_0px_0px_#0f172a]">
              <ShieldCheck className="w-3.5 h-3.5 text-amber-600" /> Zorluk: {game.difficulty}
            </span>
          </div>

          {/* Main Navigation Tabs */}
          <div className="flex items-center gap-2 pt-3.5 overflow-x-auto no-scrollbar">
            <button
              type="button"
              onClick={() => setActiveTab('chat')}
              className={`pixel-btn min-h-[44px] px-3.5 py-2 text-xs flex items-center gap-1.5 shrink-0 font-extrabold ${
                activeTab === 'chat'
                  ? 'bg-sky-300 text-slate-900'
                  : 'bg-white text-slate-700 hover:bg-slate-50'
              }`}
            >
              <Sparkles className="w-4 h-4 text-sky-800" /> Kural Hakemi
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('setup')}
              className={`pixel-btn min-h-[44px] px-3.5 py-2 text-xs flex items-center gap-1.5 shrink-0 font-extrabold ${
                activeTab === 'setup'
                  ? 'bg-emerald-300 text-slate-900'
                  : 'bg-white text-slate-700 hover:bg-slate-50'
              }`}
            >
              <BookOpen className="w-4 h-4 text-emerald-800" /> Kurulum Rehberi
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('turn')}
              className={`pixel-btn min-h-[44px] px-3.5 py-2 text-xs flex items-center gap-1.5 shrink-0 font-extrabold ${
                activeTab === 'turn'
                  ? 'bg-amber-300 text-slate-900'
                  : 'bg-white text-slate-700 hover:bg-slate-50'
              }`}
            >
              <RotateCcw className="w-4 h-4 text-amber-800" /> Tur Akışı
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('faq')}
              className={`pixel-btn min-h-[44px] px-3.5 py-2 text-xs flex items-center gap-1.5 shrink-0 font-extrabold ${
                activeTab === 'faq'
                  ? 'bg-teal-300 text-slate-900'
                  : 'bg-white text-slate-700 hover:bg-slate-50'
              }`}
            >
              <HelpCircle className="w-4 h-4 text-teal-800" /> Sık Sorulanlar
            </button>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <main className="flex-1 max-w-4xl w-full mx-auto p-4 flex flex-col">
        {/* TAB 1: AI CHAT */}
        {activeTab === 'chat' && (
          <div className="flex-1 flex flex-col h-[calc(100vh-300px)] min-h-[480px]">
            {/* Quick Prompts Bar */}
            <div className="mb-3">
              <span className="text-[11px] font-extrabold text-slate-600 uppercase tracking-wider flex items-center gap-1 mb-1.5">
                <Zap className="w-3.5 h-3.5 text-amber-500 fill-amber-400" /> Masada Sık Sorulan Kural Soruları (Tek Dokunuş):
              </span>
              <div className="flex gap-2 overflow-x-auto pb-1 no-scrollbar">
                {game.quickPrompts.map((prompt, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => handleSendMessage(prompt)}
                    className="pixel-btn min-h-[44px] px-3.5 py-2 bg-white hover:bg-sky-50 text-xs text-slate-900 font-bold whitespace-nowrap flex items-center gap-1.5 transition"
                  >
                    <span>{prompt}</span>
                    <ChevronRight className="w-3.5 h-3.5 text-sky-600" />
                  </button>
                ))}
              </div>
            </div>

            {/* Chat Messages */}
            <div className="flex-1 pixel-box p-4 sm:p-5 overflow-y-auto space-y-4 bg-white transition-colors">
              {messages.map((m, idx) => {
                const isAssistant = m.role === 'assistant';
                return (
                  <div
                    key={idx}
                    className={`flex flex-col ${isAssistant ? 'items-start' : 'items-end'}`}
                  >
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-[11px] font-extrabold text-slate-600">
                        {isAssistant ? 'Kural Hakemi 🎲' : 'Siz'}
                      </span>
                      {m.source === 'gemini' && (
                        <span className="text-[10px] px-1.5 py-0.5 rounded bg-sky-100 border border-sky-300 text-sky-800 font-bold">
                          Gemini AI
                        </span>
                      )}
                      <span className="text-[10px] font-semibold text-slate-400">{m.time}</span>
                    </div>

                    <div
                      className={`max-w-[92%] sm:max-w-[80%] px-4 py-3 text-sm leading-relaxed whitespace-pre-line border-2 border-slate-900 shadow-[3px_3px_0px_0px_#0f172a] ${
                        isAssistant
                          ? 'bg-slate-50 text-slate-900 rounded-2xl rounded-tl-none font-medium'
                          : 'bg-sky-300 text-slate-950 font-bold rounded-2xl rounded-tr-none'
                      }`}
                    >
                      {m.content}
                    </div>
                  </div>
                );
              })}

              {isLoading && (
                <div className="flex items-start gap-2">
                  <div className="bg-slate-50 border-2 border-slate-900 rounded-2xl rounded-tl-none px-4 py-3 text-sm text-slate-700 flex items-center gap-2 shadow-[3px_3px_0px_0px_#0f172a]">
                    <span className="w-2.5 h-2.5 rounded-full bg-sky-500 animate-bounce" />
                    <span className="w-2.5 h-2.5 rounded-full bg-sky-500 animate-bounce [animation-delay:0.2s]" />
                    <span className="w-2.5 h-2.5 rounded-full bg-sky-500 animate-bounce [animation-delay:0.4s]" />
                    <span className="text-xs font-bold text-slate-600 ml-1">Kural kitapçığı taranıyor...</span>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input Bar */}
            <div className="pt-3">
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleSendMessage();
                }}
                className="flex items-center gap-2 bg-white border-[3px] border-slate-900 rounded-2xl p-1.5 shadow-[4px_4px_0px_0px_#0f172a]"
              >
                <button
                  type="button"
                  onClick={toggleSpeech}
                  className={`min-h-[44px] min-w-[44px] p-2.5 rounded-xl border-2 border-slate-900 transition shadow-[2px_2px_0px_0px_#0f172a] flex items-center justify-center ${
                    isListening
                      ? 'bg-red-400 text-white animate-pulse'
                      : 'bg-sky-100 text-slate-800 hover:bg-sky-200'
                  }`}
                  title={isListening ? 'Dinleniyor...' : 'Sesli Sor (Türkçe)'}
                  aria-label={isListening ? 'Dinleniyor' : 'Sesli giriş'}
                >
                  {isListening ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
                </button>

                <input
                  type="text"
                  placeholder="Kural sorusu yazın veya mikrofona dokunup söyleyin..."
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  className="flex-1 min-h-[44px] bg-transparent px-2 text-sm text-slate-900 font-semibold placeholder-slate-400 focus:outline-none"
                />

                <button
                  type="submit"
                  disabled={!input.trim() || isLoading}
                  className="pixel-btn pixel-btn-accent min-h-[44px] min-w-[44px] p-2.5 text-xs font-extrabold disabled:opacity-40 flex items-center justify-center"
                  aria-label="Gönder"
                >
                  <Send className="w-4 h-4 stroke-[2.5]" />
                </button>
              </form>
            </div>
          </div>
        )}

        {/* TAB 2: SETUP GUIDE */}
        {activeTab === 'setup' && (
          <div className="pixel-box p-5 sm:p-6 space-y-6 bg-white">
            <div>
              <h2 className="text-xl font-extrabold text-slate-900 font-display mb-1">Oyun Kurulum Rehberi</h2>
              <p className="text-xs font-semibold text-slate-500">
                Oyuna başlamadan önce parçaları bu sırayla masaya dizin.
              </p>
            </div>

            <div className="space-y-4">
              {game.setupSteps.map((step, idx) => (
                <div
                  key={idx}
                  className="p-4 rounded-xl bg-slate-50 border-2 border-slate-900 shadow-[3px_3px_0px_0px_#0f172a] space-y-2"
                >
                  <div className="flex items-center gap-2.5">
                    <span className="w-7 h-7 rounded-lg bg-emerald-200 text-slate-900 font-extrabold text-xs flex items-center justify-center border-2 border-slate-900 shadow-[1px_1px_0px_0px_#0f172a]">
                      {idx + 1}
                    </span>
                    <h3 className="font-extrabold text-sm text-slate-900">{step.title}</h3>
                  </div>
                  <p className="text-xs sm:text-sm text-slate-700 leading-relaxed pl-9 font-medium">
                    {step.description}
                  </p>
                  {step.tip && (
                    <div className="ml-9 p-2.5 rounded-lg bg-amber-100 border-2 border-slate-900 text-xs text-amber-900 font-bold shadow-[2px_2px_0px_0px_#0f172a]">
                      💡 {step.tip}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 3: TURN FLOW */}
        {activeTab === 'turn' && (
          <div className="pixel-box p-5 sm:p-6 space-y-6 bg-white">
            <div>
              <h2 className="text-xl font-extrabold text-slate-900 font-display mb-1">Tur Akışı</h2>
              <p className="text-xs font-semibold text-slate-500">
                Sıra sizdeyken yapabileceğiniz hamleler sırasıyla aşağıdadır.
              </p>
            </div>

            <div className="space-y-4">
              {game.turnPhases.map((phase, idx) => (
                <div
                  key={idx}
                  className="p-4 rounded-xl bg-slate-50 border-2 border-slate-900 shadow-[3px_3px_0px_0px_#0f172a] space-y-2"
                >
                  <h3 className="font-extrabold text-sm text-sky-800">{phase.phase}</h3>
                  <p className="text-xs sm:text-sm text-slate-700 leading-relaxed whitespace-pre-line font-medium">
                    {phase.description}
                  </p>
                </div>
              ))}
            </div>

            <div className="p-4 rounded-xl bg-emerald-100 border-2 border-slate-900 shadow-[3px_3px_0px_0px_#0f172a]">
              <h3 className="font-extrabold text-sm text-slate-900 mb-1">🏆 Kazanma Şartı</h3>
              <p className="text-xs sm:text-sm text-slate-800 font-semibold">{game.winCondition}</p>
            </div>
          </div>
        )}

        {/* TAB 4: FAQ & ERRATA */}
        {activeTab === 'faq' && (
          <div className="pixel-box p-5 sm:p-6 space-y-6 bg-white">
            <div>
              <h2 className="text-xl font-extrabold text-slate-900 font-display mb-1">Sık Yapılan Hatalar & Hakem Kararları</h2>
              <p className="text-xs font-semibold text-slate-500">
                Resmi kural kitapçığına göre en çok yaşanan anlaşmazlıkların çözümleri.
              </p>
            </div>

            <div className="space-y-3">
              {game.faqs.map((faq, idx) => (
                <div
                  key={idx}
                  className="p-4 rounded-xl bg-slate-50 border-2 border-slate-900 shadow-[3px_3px_0px_0px_#0f172a] space-y-2"
                >
                  <div className="flex items-center justify-between gap-2">
                    <h3 className="font-extrabold text-sm text-slate-900">{faq.question}</h3>
                    {faq.pageRef && (
                      <span className="text-[10px] font-bold text-slate-900 bg-amber-200 border-2 border-slate-900 px-2 py-0.5 rounded shadow-[1px_1px_0px_0px_#0f172a] shrink-0">
                        {faq.pageRef}
                      </span>
                    )}
                  </div>
                  <p className="text-xs sm:text-sm text-slate-700 leading-relaxed whitespace-pre-line font-medium">
                    {faq.answer}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>

      {/* Floating Modals */}
      <ScoreTracker
        isOpen={isScoreOpen}
        onClose={() => setIsScoreOpen(false)}
        gameTitle={game.title}
      />

      <DiceRoller
        isOpen={isDiceOpen}
        onClose={() => setIsDiceOpen(false)}
      />
    </div>
  );
};
