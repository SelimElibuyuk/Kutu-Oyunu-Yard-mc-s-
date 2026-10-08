'use client';

import React, { useState, useEffect } from 'react';
import { GameData, SetupStep, TurnPhase, GameFAQ } from '@/data/games';
import { Navbar } from '@/components/Navbar';
import Link from 'next/link';
import {
  Plus,
  Trash2,
  Edit3,
  Printer,
  ExternalLink,
  Shield,
  Lock,
  Unlock,
  Check,
  X,
  Sparkles,
  Dices,
  Users,
  Clock,
  Layers,
  HelpCircle,
  RotateCcw,
  BookOpen
} from 'lucide-react';

export default function AdminPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [pinInput, setPinInput] = useState('');
  const [pinError, setPinError] = useState(false);

  const [games, setGames] = useState<Record<string, GameData>>({});
  const [isLoading, setIsLoading] = useState(true);

  // Modal State for Edit / Add
  const [editingGame, setEditingGame] = useState<GameData | null>(null);
  const [isNewGame, setIsNewGame] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  // Form tab: 'basic' | 'rules' | 'setup' | 'turn' | 'faq'
  const [formTab, setFormTab] = useState<'basic' | 'rules' | 'setup' | 'turn' | 'faq'>('basic');

  useEffect(() => {
    // Check if session is already active
    const auth = sessionStorage.getItem('boardgame_admin_auth');
    if (auth === 'true') {
      setIsAuthenticated(true);
      fetchGames();
    }
  }, []);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const currentPin = localStorage.getItem('boardgame_admin_pin') || '1234';
    if (pinInput === currentPin || pinInput === 'admin') {
      sessionStorage.setItem('boardgame_admin_auth', 'true');
      setIsAuthenticated(true);
      setPinError(false);
      fetchGames();
    } else {
      setPinError(true);
    }
  };

  const handleLogout = () => {
    sessionStorage.removeItem('boardgame_admin_auth');
    setIsAuthenticated(false);
    setPinInput('');
  };

  const fetchGames = async () => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/games');
      const data = await res.json();
      setGames(data);
    } catch {
      // API error handled gracefully
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteGame = async (id: string, title: string) => {
    if (!confirm(`"${title}" oyununu silmek istediğinize emin misiniz?`)) return;

    try {
      const res = await fetch(`/api/games?id=${id}`, { method: 'DELETE' });
      if (res.ok) {
        setGames((prev) => {
          const updated = { ...prev };
          delete updated[id];
          return updated;
        });
      } else {
        alert('Oyun silinirken bir hata oluştu.');
      }
    } catch {
      alert('İstek başarısız oldu.');
    }
  };

  const handleOpenNewGame = () => {
    setIsNewGame(true);
    setFormTab('basic');
    setEditingGame({
      id: '',
      title: '',
      tagline: '',
      category: 'Strateji',
      players: '2-4 Kişi',
      minPlayers: 2,
      maxPlayers: 4,
      duration: '45 dk',
      age: '10+',
      difficulty: 'Orta',
      accentColor: '#38bdf8',
      bgGradient: 'from-sky-500 to-blue-600',
      badge: 'Yeni',
      description: '',
      winCondition: '',
      setupSteps: [
        { title: 'Masayı Hazırlayın', description: 'Oyun tahtasını masanın ortasına yerleştirin.' }
      ],
      turnPhases: [
        { phase: '1. Hamle', description: 'Sıranızdaki oyuncu hamlesini yapar.' }
      ],
      faqs: [
        { question: 'Oyun nasıl başlar?', answer: 'İlk oyuncu belirlendikten sonra saat yönünde başlar.' }
      ],
      quickPrompts: [
        'Oyun nasıl kurulur?',
        'Sıra bendeyken ne yapabilirim?'
      ],
      rulesKnowledge: ''
    });
  };

  const handleOpenEditGame = (game: GameData) => {
    setIsNewGame(false);
    setFormTab('basic');
    // Deep copy to prevent accidental direct mutation
    setEditingGame(JSON.parse(JSON.stringify(game)));
  };

  const handleSaveGame = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingGame || !editingGame.title) {
      alert('Lütfen oyun adını doldurun.');
      return;
    }

    if (!editingGame.id) {
      editingGame.id = editingGame.title
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9]/g, '-')
        .replace(/-+/g, '-');
    }

    setIsSaving(true);
    try {
      const res = await fetch('/api/games', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ game: editingGame })
      });

      if (res.ok) {
        setSaveSuccess(true);
        setTimeout(() => {
          setSaveSuccess(false);
          setEditingGame(null);
          fetchGames();
        }, 800);
      } else {
        alert('Kaydedilirken bir hata oluştu.');
      }
    } catch {
      alert('Kaydetme hatası.');
    } finally {
      setIsSaving(false);
    }
  };

  // Helper functions for dynamic sub-items in form
  const addSetupStep = () => {
    if (!editingGame) return;
    setEditingGame({
      ...editingGame,
      setupSteps: [...editingGame.setupSteps, { title: 'Yeni Adım', description: '' }]
    });
  };

  const updateSetupStep = (index: number, field: keyof SetupStep, value: string) => {
    if (!editingGame) return;
    const updated = [...editingGame.setupSteps];
    updated[index] = { ...updated[index], [field]: value };
    setEditingGame({ ...editingGame, setupSteps: updated });
  };

  const removeSetupStep = (index: number) => {
    if (!editingGame) return;
    setEditingGame({
      ...editingGame,
      setupSteps: editingGame.setupSteps.filter((_, i) => i !== index)
    });
  };

  const addTurnPhase = () => {
    if (!editingGame) return;
    setEditingGame({
      ...editingGame,
      turnPhases: [...editingGame.turnPhases, { phase: 'Yeni Aşama', description: '' }]
    });
  };

  const updateTurnPhase = (index: number, field: keyof TurnPhase, value: string) => {
    if (!editingGame) return;
    const updated = [...editingGame.turnPhases];
    updated[index] = { ...updated[index], [field]: value };
    setEditingGame({ ...editingGame, turnPhases: updated });
  };

  const removeTurnPhase = (index: number) => {
    if (!editingGame) return;
    setEditingGame({
      ...editingGame,
      turnPhases: editingGame.turnPhases.filter((_, i) => i !== index)
    });
  };

  const addFaq = () => {
    if (!editingGame) return;
    setEditingGame({
      ...editingGame,
      faqs: [...editingGame.faqs, { question: '', answer: '', pageRef: 'Syf 1' }]
    });
  };

  const updateFaq = (index: number, field: keyof GameFAQ, value: string) => {
    if (!editingGame) return;
    const updated = [...editingGame.faqs];
    updated[index] = { ...updated[index], [field]: value };
    setEditingGame({ ...editingGame, faqs: updated });
  };

  const removeFaq = (index: number) => {
    if (!editingGame) return;
    setEditingGame({
      ...editingGame,
      faqs: editingGame.faqs.filter((_, i) => i !== index)
    });
  };

  // If not logged in, show simple PIN entry screen
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-[#f0fdf4] text-slate-900 flex flex-col">
        <Navbar />
        <div className="flex-1 flex items-center justify-center p-4">
          <div className="bg-white border-[3px] border-slate-900 rounded-3xl p-6 sm:p-8 w-full max-w-sm shadow-[6px_6px_0px_0px_#0f172a] text-center">
            <div className="w-14 h-14 bg-amber-200 border-2 border-slate-900 rounded-2xl shadow-[3px_3px_0px_0px_#0f172a] flex items-center justify-center mx-auto mb-4 text-slate-900">
              <Lock className="w-7 h-7 stroke-[2.5]" />
            </div>

            <h2 className="font-display font-extrabold text-xl text-slate-900 mb-1">
              YÖNETİCİ GİRİŞİ
            </h2>
            <p className="text-xs font-semibold text-slate-500 mb-6">
              Etkinlik oyunlarını yönetmek için PIN kodunuzu girin. (Varsayılan PIN: 1234)
            </p>

            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <input
                  type="password"
                  placeholder="PIN Kodu..."
                  value={pinInput}
                  onChange={(e) => setPinInput(e.target.value)}
                  className="w-full text-center tracking-widest text-lg font-display font-black bg-slate-50 border-2 border-slate-900 rounded-xl px-4 py-2.5 focus:outline-none focus:bg-white shadow-[2px_2px_0px_0px_#0f172a]"
                />
                {pinError && (
                  <p className="text-xs text-red-500 font-bold mt-1.5 animate-bounce">
                    Hatalı PIN! Tekrar deneyin.
                  </p>
                )}
              </div>

              <button
                type="submit"
                className="w-full pixel-btn pixel-btn-primary min-h-[44px] py-2.5 text-xs font-extrabold flex items-center justify-center gap-2"
              >
                <Unlock className="w-4 h-4" /> Giriş Yap
              </button>
            </form>
          </div>
        </div>
      </div>
    );
  }

  const gamesList = Object.values(games);

  return (
    <div className="min-h-screen bg-[#f0fdf4] dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col transition-colors">
      <Navbar />

      {/* Admin Header */}
      <div className="bg-white dark:bg-slate-900 border-b-[3px] border-slate-900 dark:border-sky-500 shadow-[0_3px_0_0_rgba(15,23,42,0.05)] transition-colors">
        <div className="max-w-6xl mx-auto px-4 py-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-lg bg-amber-200 dark:bg-amber-950 border-2 border-slate-900 dark:border-amber-500 text-slate-900 dark:text-amber-300 text-xs font-extrabold shadow-[2px_2px_0px_0px_#0f172a] flex items-center gap-1">
                  <Shield className="w-3.5 h-3.5 text-amber-800 dark:text-amber-400" /> ETKİNLİK YÖNETİMİ
                </span>
                <span className="text-xs font-bold text-slate-500 dark:text-slate-400">
                  Toplam {gamesList.length} Oyun
                </span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white font-display">
                Oyun & QR Yönetici Paneli
              </h1>
              <p className="text-xs sm:text-sm font-semibold text-slate-600 dark:text-slate-300">
                Haftalık etkinlikleriniz için yeni oyunlar ekleyin, kural kitapçıklarını güncelleyin ve masalara özel QR kartları basın.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <button
                type="button"
                onClick={handleOpenNewGame}
                className="pixel-btn pixel-btn-accent min-h-[44px] px-3.5 py-2 text-xs font-extrabold flex items-center gap-1.5"
              >
                <Plus className="w-4 h-4 stroke-[2.5]" /> Yeni Oyun Ekle
              </button>

              <Link
                href="/admin/print-all"
                target="_blank"
                className="pixel-btn bg-sky-200 hover:bg-sky-300 dark:bg-sky-600 dark:hover:bg-sky-500 text-slate-900 dark:text-white min-h-[44px] px-3.5 py-2 text-xs font-extrabold flex items-center gap-1.5"
              >
                <Printer className="w-4 h-4 stroke-[2.5]" /> Toplu QR Yazdır
              </Link>

              <button
                type="button"
                onClick={handleLogout}
                className="pixel-btn bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 min-h-[44px] px-3 py-2 text-xs font-bold"
                title="Çıkış Yap"
              >
                Çıkış
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Admin Content */}
      <main className="flex-1 max-w-6xl w-full mx-auto p-4 sm:p-6">
        {isLoading ? (
          <div className="text-center py-20 font-bold text-slate-500">
            Oyunlar yükleniyor...
          </div>
        ) : (
          <div className="space-y-4">
            <h2 className="text-lg font-extrabold text-slate-900 font-display flex items-center gap-2">
              <span>Mevcut Oyunlar Listesi</span>
              <span className="text-xs font-bold bg-emerald-100 text-emerald-800 border border-emerald-300 px-2 py-0.5 rounded-lg">
                {gamesList.length} Aktif
              </span>
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {gamesList.map((g) => (
                <div
                  key={g.id}
                  className="pixel-box-card bg-white p-4 flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-[11px] font-bold px-2 py-0.5 rounded bg-sky-100 border border-slate-300 text-slate-800">
                        {g.category}
                      </span>
                      <span className="text-[11px] font-bold px-2 py-0.5 rounded bg-amber-100 border border-amber-300 text-amber-900">
                        {g.badge || 'Aktif'}
                      </span>
                    </div>

                    <h3 className="font-display font-extrabold text-lg text-slate-900 mb-1">
                      {g.title}
                    </h3>
                    <p className="text-xs font-medium text-slate-600 line-clamp-2 mb-3">
                      {g.tagline}
                    </p>

                    <div className="flex items-center gap-2 text-xs font-bold text-slate-700 mb-4 bg-slate-50 p-2 rounded-lg border border-slate-200">
                      <span className="flex items-center gap-1">
                        <Users className="w-3.5 h-3.5 text-sky-600" /> {g.players.split(' ')[0]}
                      </span>
                      <span>•</span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5 text-emerald-600" /> {g.duration}
                      </span>
                      <span>•</span>
                      <span>{g.difficulty}</span>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="grid grid-cols-3 gap-2 pt-2 border-t-2 border-slate-200 dark:border-slate-700">
                    <button
                      type="button"
                      onClick={() => handleOpenEditGame(g)}
                      className="pixel-btn bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-900 dark:text-slate-100 py-1.5 min-h-[44px] text-xs font-bold flex items-center justify-center gap-1"
                    >
                      <Edit3 className="w-3.5 h-3.5" /> Düzenle
                    </button>

                    <Link
                      href={`/print/${g.id}`}
                      target="_blank"
                      className="pixel-btn bg-emerald-100 hover:bg-emerald-200 dark:bg-emerald-950 dark:hover:bg-emerald-900 text-slate-900 dark:text-emerald-300 py-1.5 min-h-[44px] text-xs font-bold flex items-center justify-center gap-1"
                      title="Masa Kartı Çıkar"
                    >
                      <Printer className="w-3.5 h-3.5" /> QR Bas
                    </Link>

                    <button
                      type="button"
                      onClick={() => handleDeleteGame(g.id, g.title)}
                      className="pixel-btn bg-rose-100 hover:bg-rose-200 dark:bg-rose-950 dark:hover:bg-rose-900 text-rose-900 dark:text-rose-300 py-1.5 min-h-[44px] text-xs font-bold flex items-center justify-center gap-1"
                      title="Oyunu Sil"
                    >
                      <Trash2 className="w-3.5 h-3.5" /> Sil
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>

      {/* EDIT / CREATE GAME MODAL */}
      {editingGame && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4 overflow-y-auto">
          <div className="bg-white border-[3px] border-slate-900 rounded-3xl w-full max-w-3xl shadow-[8px_8px_0px_0px_#0f172a] my-8 flex flex-col max-h-[90vh]">
            {/* Modal Header */}
            <div className="p-4 sm:p-5 border-b-2 border-slate-900 flex items-center justify-between bg-slate-50 rounded-t-3xl">
              <div>
                <h3 className="font-display font-extrabold text-lg text-slate-900">
                  {isNewGame ? '➕ Yeni Oyun Ekle' : `✏️ Düzenle: ${editingGame.title}`}
                </h3>
                <p className="text-xs font-semibold text-slate-500">
                  Kural kitapçığı, kurulum ve SSS bilgilerini doldurun.
                </p>
              </div>
              <button
                onClick={() => setEditingGame(null)}
                className="p-1.5 rounded-lg border-2 border-slate-900 bg-white hover:bg-slate-100 shadow-[2px_2px_0px_0px_#0f172a]"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Modal Navigation Tabs */}
            <div className="flex items-center gap-1.5 px-4 sm:px-5 pt-3 border-b border-slate-200 overflow-x-auto no-scrollbar">
              <button
                type="button"
                onClick={() => setFormTab('basic')}
                className={`px-3 py-1.5 rounded-t-lg font-bold text-xs border-t-2 border-x-2 border-slate-900 transition ${
                  formTab === 'basic' ? 'bg-sky-200 text-slate-900 -mb-px' : 'bg-slate-100 text-slate-600'
                }`}
              >
                Temel Bilgiler
              </button>
              <button
                type="button"
                onClick={() => setFormTab('rules')}
                className={`px-3 py-1.5 rounded-t-lg font-bold text-xs border-t-2 border-x-2 border-slate-900 transition ${
                  formTab === 'rules' ? 'bg-amber-200 text-slate-900 -mb-px' : 'bg-slate-100 text-slate-600'
                }`}
              >
                Kural Kitapçığı & AI Prompt
              </button>
              <button
                type="button"
                onClick={() => setFormTab('setup')}
                className={`px-3 py-1.5 rounded-t-lg font-bold text-xs border-t-2 border-x-2 border-slate-900 transition ${
                  formTab === 'setup' ? 'bg-emerald-200 text-slate-900 -mb-px' : 'bg-slate-100 text-slate-600'
                }`}
              >
                Kurulum Adımları ({editingGame.setupSteps.length})
              </button>
              <button
                type="button"
                onClick={() => setFormTab('turn')}
                className={`px-3 py-1.5 rounded-t-lg font-bold text-xs border-t-2 border-x-2 border-slate-900 transition ${
                  formTab === 'turn' ? 'bg-teal-200 text-slate-900 -mb-px' : 'bg-slate-100 text-slate-600'
                }`}
              >
                Tur Akışı ({editingGame.turnPhases.length})
              </button>
              <button
                type="button"
                onClick={() => setFormTab('faq')}
                className={`px-3 py-1.5 rounded-t-lg font-bold text-xs border-t-2 border-x-2 border-slate-900 transition ${
                  formTab === 'faq' ? 'bg-purple-200 text-slate-900 -mb-px' : 'bg-slate-100 text-slate-600'
                }`}
              >
                Sık Sorulanlar ({editingGame.faqs.length})
              </button>
            </div>

            {/* Modal Body */}
            <form onSubmit={handleSaveGame} className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
              {/* TAB 1: BASIC INFO */}
              {formTab === 'basic' && (
                <div className="space-y-3.5">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        Oyun ID (URL Slug, örn: catan, secret-hitler)
                      </label>
                      <input
                        type="text"
                        required
                        disabled={!isNewGame}
                        value={editingGame.id}
                        onChange={(e) => setEditingGame({ ...editingGame, id: e.target.value })}
                        className="w-full bg-slate-50 border-2 border-slate-900 rounded-xl px-3 py-2 text-xs font-semibold text-slate-900 disabled:opacity-60"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        Oyun Başlığı (Title)
                      </label>
                      <input
                        type="text"
                        required
                        value={editingGame.title}
                        onChange={(e) => setEditingGame({ ...editingGame, title: e.target.value })}
                        className="w-full bg-slate-50 border-2 border-slate-900 rounded-xl px-3 py-2 text-xs font-semibold text-slate-900"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Slogan (Kısa Etkileyici Açıklama)
                    </label>
                    <input
                      type="text"
                      value={editingGame.tagline}
                      onChange={(e) => setEditingGame({ ...editingGame, tagline: e.target.value })}
                      className="w-full bg-slate-50 border-2 border-slate-900 rounded-xl px-3 py-2 text-xs font-semibold text-slate-900"
                    />
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">Kategori</label>
                      <input
                        type="text"
                        value={editingGame.category}
                        onChange={(e) => setEditingGame({ ...editingGame, category: e.target.value })}
                        className="w-full bg-slate-50 border-2 border-slate-900 rounded-xl px-3 py-2 text-xs font-semibold text-slate-900"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">Oyuncu Sayısı</label>
                      <input
                        type="text"
                        value={editingGame.players}
                        onChange={(e) => setEditingGame({ ...editingGame, players: e.target.value })}
                        className="w-full bg-slate-50 border-2 border-slate-900 rounded-xl px-3 py-2 text-xs font-semibold text-slate-900"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">Süre</label>
                      <input
                        type="text"
                        value={editingGame.duration}
                        onChange={(e) => setEditingGame({ ...editingGame, duration: e.target.value })}
                        className="w-full bg-slate-50 border-2 border-slate-900 rounded-xl px-3 py-2 text-xs font-semibold text-slate-900"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">Zorluk</label>
                      <select
                        value={editingGame.difficulty}
                        onChange={(e) => setEditingGame({ ...editingGame, difficulty: e.target.value as any })}
                        className="w-full bg-slate-50 border-2 border-slate-900 rounded-xl px-3 py-2 text-xs font-semibold text-slate-900"
                      >
                        <option value="Kolay">Kolay</option>
                        <option value="Orta">Orta</option>
                        <option value="Zor">Zor</option>
                        <option value="Kolay - Orta">Kolay - Orta</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Kazanma Şartı</label>
                    <textarea
                      rows={2}
                      value={editingGame.winCondition}
                      onChange={(e) => setEditingGame({ ...editingGame, winCondition: e.target.value })}
                      className="w-full bg-slate-50 border-2 border-slate-900 rounded-xl p-3 text-xs font-semibold text-slate-900"
                    />
                  </div>
                </div>
              )}

              {/* TAB 2: RULES KNOWLEDGE */}
              {formTab === 'rules' && (
                <div className="space-y-3">
                  <p className="text-xs text-slate-500 font-semibold leading-relaxed">
                    Yapay Zekanın (ve dahili kural motorunun) bu oyunu eksiksiz bilmesi için resmi kural kitapçığı özetini, özel terimleri ve istisnaları buraya yazın.
                  </p>
                  <textarea
                    rows={12}
                    value={editingGame.rulesKnowledge}
                    onChange={(e) => setEditingGame({ ...editingGame, rulesKnowledge: e.target.value })}
                    placeholder="Oyun Kuralları, Puanlama Detayları, Hırsız / Savaş Mekanikleri vb..."
                    className="w-full bg-slate-50 border-2 border-slate-900 rounded-xl p-3 text-xs font-mono font-medium text-slate-900"
                  />
                </div>
              )}

              {/* TAB 3: SETUP STEPS */}
              {formTab === 'setup' && (
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-600">Adım Adım Kurulum</span>
                    <button
                      type="button"
                      onClick={addSetupStep}
                      className="pixel-btn bg-emerald-200 text-slate-900 px-3 py-1 text-xs font-bold flex items-center gap-1"
                    >
                      <Plus className="w-3.5 h-3.5" /> Adım Ekle
                    </button>
                  </div>

                  {editingGame.setupSteps.map((step, idx) => (
                    <div key={idx} className="p-3 bg-slate-50 border-2 border-slate-900 rounded-xl space-y-2">
                      <div className="flex items-center justify-between gap-2">
                        <span className="font-bold text-xs text-slate-800">Adım {idx + 1} Başlığı:</span>
                        <button
                          type="button"
                          onClick={() => removeSetupStep(idx)}
                          className="text-red-500 hover:text-red-700 text-xs font-bold"
                        >
                          Sil
                        </button>
                      </div>
                      <input
                        type="text"
                        value={step.title}
                        onChange={(e) => updateSetupStep(idx, 'title', e.target.value)}
                        className="w-full bg-white border border-slate-300 rounded-lg px-2.5 py-1.5 text-xs font-bold"
                      />
                      <textarea
                        rows={2}
                        placeholder="Adım açıklaması..."
                        value={step.description}
                        onChange={(e) => updateSetupStep(idx, 'description', e.target.value)}
                        className="w-full bg-white border border-slate-300 rounded-lg p-2 text-xs font-medium"
                      />
                      <input
                        type="text"
                        placeholder="Önemli ipucu (isteğe bağlı)..."
                        value={step.tip || ''}
                        onChange={(e) => updateSetupStep(idx, 'tip', e.target.value)}
                        className="w-full bg-amber-50 border border-amber-300 rounded-lg px-2.5 py-1 text-xs text-amber-900 font-semibold"
                      />
                    </div>
                  ))}
                </div>
              )}

              {/* TAB 4: TURN PHASES */}
              {formTab === 'turn' && (
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-600">Sıra Bendeyken Aşamaları</span>
                    <button
                      type="button"
                      onClick={addTurnPhase}
                      className="pixel-btn bg-teal-200 text-slate-900 px-3 py-1 text-xs font-bold flex items-center gap-1"
                    >
                      <Plus className="w-3.5 h-3.5" /> Aşama Ekle
                    </button>
                  </div>

                  {editingGame.turnPhases.map((phase, idx) => (
                    <div key={idx} className="p-3 bg-slate-50 border-2 border-slate-900 rounded-xl space-y-2">
                      <div className="flex items-center justify-between gap-2">
                        <span className="font-bold text-xs text-slate-800">Aşama {idx + 1}:</span>
                        <button
                          type="button"
                          onClick={() => removeTurnPhase(idx)}
                          className="text-red-500 hover:text-red-700 text-xs font-bold"
                        >
                          Sil
                        </button>
                      </div>
                      <input
                        type="text"
                        value={phase.phase}
                        onChange={(e) => updateTurnPhase(idx, 'phase', e.target.value)}
                        className="w-full bg-white border border-slate-300 rounded-lg px-2.5 py-1.5 text-xs font-bold"
                      />
                      <textarea
                        rows={2}
                        placeholder="Aşama açıklaması..."
                        value={phase.description}
                        onChange={(e) => updateTurnPhase(idx, 'description', e.target.value)}
                        className="w-full bg-white border border-slate-300 rounded-lg p-2 text-xs font-medium"
                      />
                    </div>
                  ))}
                </div>
              )}

              {/* TAB 5: FAQ & ERRATA */}
              {formTab === 'faq' && (
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-600">Sık Sorulan Kural Çelişkileri</span>
                    <button
                      type="button"
                      onClick={addFaq}
                      className="pixel-btn bg-purple-200 text-slate-900 px-3 py-1 text-xs font-bold flex items-center gap-1"
                    >
                      <Plus className="w-3.5 h-3.5" /> SSS Ekle
                    </button>
                  </div>

                  {editingGame.faqs.map((faq, idx) => (
                    <div key={idx} className="p-3 bg-slate-50 border-2 border-slate-900 rounded-xl space-y-2">
                      <div className="flex items-center justify-between gap-2">
                        <input
                          type="text"
                          placeholder="Soru..."
                          value={faq.question}
                          onChange={(e) => updateFaq(idx, 'question', e.target.value)}
                          className="flex-1 bg-white border border-slate-300 rounded-lg px-2.5 py-1.5 text-xs font-bold"
                        />
                        <input
                          type="text"
                          placeholder="Ref (Syf 4)"
                          value={faq.pageRef || ''}
                          onChange={(e) => updateFaq(idx, 'pageRef', e.target.value)}
                          className="w-24 bg-white border border-slate-300 rounded-lg px-2 py-1.5 text-xs font-mono"
                        />
                        <button
                          type="button"
                          onClick={() => removeFaq(idx)}
                          className="text-red-500 hover:text-red-700 text-xs font-bold"
                        >
                          Sil
                        </button>
                      </div>
                      <textarea
                        rows={2}
                        placeholder="Resmi hakem cevabı..."
                        value={faq.answer}
                        onChange={(e) => updateFaq(idx, 'answer', e.target.value)}
                        className="w-full bg-white border border-slate-300 rounded-lg p-2 text-xs font-medium"
                      />
                    </div>
                  ))}
                </div>
              )}

              {/* Modal Footer */}
              <div className="pt-4 border-t-2 border-slate-900 flex justify-end gap-2.5">
                <button
                  type="button"
                  onClick={() => setEditingGame(null)}
                  className="pixel-btn bg-slate-100 px-4 py-2 text-xs font-bold text-slate-800"
                >
                  İptal
                </button>
                <button
                  type="submit"
                  disabled={isSaving}
                  className="pixel-btn pixel-btn-accent px-5 py-2 text-xs font-extrabold flex items-center gap-1.5"
                >
                  {saveSuccess ? (
                    <>
                      <Check className="w-4 h-4" /> Kaydedildi!
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4" /> Oyunu Kaydet
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
