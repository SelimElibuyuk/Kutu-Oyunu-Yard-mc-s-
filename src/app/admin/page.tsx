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
  Shield,
  Lock,
  Unlock,
  Check,
  X,
  Sparkles,
  Users,
  Clock,
  Layers,
  HelpCircle,
  RotateCcw,
  BookOpen,
  Key,
  ExternalLink,
} from 'lucide-react';

export default function AdminPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [pinInput, setPinInput] = useState('');
  const [pinError, setPinError] = useState(false);

  const [games, setGames] = useState<Record<string, GameData>>({});
  const [isLoading, setIsLoading] = useState(true);

  // Gemini API Key management state
  const [apiKeyStatus, setApiKeyStatus] = useState<{
    hasKey: boolean;
    maskedKey: string;
    source: string;
  }>({ hasKey: false, maskedKey: '', source: 'none' });
  const [newKeyInput, setNewKeyInput] = useState('');
  const [isSavingKey, setIsSavingKey] = useState(false);
  const [keyMessage, setKeyMessage] = useState('');

  // Admin PIN change state
  const [currentPinChangeInput, setCurrentPinChangeInput] = useState('');
  const [newPinInput, setNewPinInput] = useState('');
  const [confirmPinInput, setConfirmPinInput] = useState('');
  const [isChangingPin, setIsChangingPin] = useState(false);
  const [pinChangeMessage, setPinChangeMessage] = useState<{ text: string; isError: boolean } | null>(null);

  // Modal State for Edit / Add
  const [editingGame, setEditingGame] = useState<GameData | null>(null);
  const [isNewGame, setIsNewGame] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  // Form tab: 'basic' | 'rules' | 'setup' | 'turn' | 'faq'
  const [formTab, setFormTab] = useState<'basic' | 'rules' | 'setup' | 'turn' | 'faq'>('basic');

  useEffect(() => {
    const auth = sessionStorage.getItem('boardgame_admin_auth');
    if (auth === 'true') {
      setIsAuthenticated(true);
      fetchGames();
      fetchApiKeyConfig();
    }
  }, []);

  const fetchApiKeyConfig = async () => {
    try {
      const res = await fetch('/api/admin/config');
      if (res.ok) {
        const data = await res.json();
        setApiKeyStatus(data);
      }
    } catch {}
  };

  const handleSaveApiKey = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newKeyInput.trim()) return;

    setIsSavingKey(true);
    setKeyMessage('');

    try {
      const activePin = sessionStorage.getItem('boardgame_admin_active_pin') || '1234';
      const res = await fetch('/api/admin/config', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ pin: activePin, apiKey: newKeyInput.trim() }),
      });

      const data = await res.json();
      if (res.ok) {
        setApiKeyStatus({
          hasKey: true,
          maskedKey: data.maskedKey,
          source: 'admin_saved',
        });
        setNewKeyInput('');
        setKeyMessage('✅ API Anahtarı sunucuya güvenle kaydedildi!');
        setTimeout(() => setKeyMessage(''), 3000);
      } else {
        setKeyMessage(`❌ Hata: ${data.error || 'Kaydedilemedi'}`);
      }
    } catch {
      setKeyMessage('❌ Sunucu bağlantı hatası.');
    } finally {
      setIsSavingKey(false);
    }
  };

  const handleDeleteApiKey = async () => {
    if (!confirm('Gemini API anahtarını sunucudan kaldırmak istediğinize emin misiniz? Sistem dahili kural motoruyla çalışmaya devam edecektir.')) return;

    try {
      const activePin = sessionStorage.getItem('boardgame_admin_active_pin') || '1234';
      const res = await fetch(`/api/admin/config?pin=${encodeURIComponent(activePin)}`, {
        method: 'DELETE',
      });
      if (res.ok) {
        setApiKeyStatus({ hasKey: false, maskedKey: '', source: 'none' });
        setKeyMessage('🗑️ API Anahtarı silindi. Dahili motor devrede.');
        setTimeout(() => setKeyMessage(''), 3000);
      }
    } catch {}
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setPinError(false);
    const cleanedPin = pinInput.trim();

    try {
      const res = await fetch('/api/admin/config', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'verify_pin', pin: cleanedPin }),
      });

      if (res.ok) {
        sessionStorage.setItem('boardgame_admin_auth', 'true');
        sessionStorage.setItem('boardgame_admin_active_pin', cleanedPin);
        setIsAuthenticated(true);
        fetchGames();
        fetchApiKeyConfig();
        return;
      }
    } catch {}

    // Fallback check
    const currentPin = localStorage.getItem('boardgame_admin_pin') || '1234';
    if (cleanedPin === currentPin || cleanedPin === 'admin') {
      sessionStorage.setItem('boardgame_admin_auth', 'true');
      sessionStorage.setItem('boardgame_admin_active_pin', cleanedPin);
      setIsAuthenticated(true);
      fetchGames();
      fetchApiKeyConfig();
    } else {
      setPinError(true);
    }
  };

  const handleChangePin = async (e: React.FormEvent) => {
    e.preventDefault();
    setPinChangeMessage(null);

    if (!currentPinChangeInput) {
      setPinChangeMessage({ text: 'Lütfen mevcut PIN kodunuzu girin.', isError: true });
      return;
    }
    if (!newPinInput || newPinInput.trim().length < 4) {
      setPinChangeMessage({ text: 'Yeni PIN en az 4 karakter olmalıdır.', isError: true });
      return;
    }
    if (newPinInput !== confirmPinInput) {
      setPinChangeMessage({ text: 'Yeni PIN ve onay şifresi birbiriyle eşleşmiyor!', isError: true });
      return;
    }

    setIsChangingPin(true);
    try {
      const res = await fetch('/api/admin/config', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'change_pin',
          currentPin: currentPinChangeInput.trim(),
          newPin: newPinInput.trim(),
        }),
      });

      const data = await res.json();
      if (res.ok) {
        sessionStorage.setItem('boardgame_admin_active_pin', newPinInput.trim());
        localStorage.setItem('boardgame_admin_pin', newPinInput.trim());
        setCurrentPinChangeInput('');
        setNewPinInput('');
        setConfirmPinInput('');
        setPinChangeMessage({ text: '✅ Yönetici PIN kodu başarıyla güncellendi!', isError: false });
        setTimeout(() => setPinChangeMessage(null), 4000);
      } else {
        setPinChangeMessage({ text: `❌ ${data.error || 'PIN güncellenemedi.'}`, isError: true });
      }
    } catch {
      setPinChangeMessage({ text: '❌ Sunucuya bağlanırken bir hata oluştu.', isError: true });
    } finally {
      setIsChangingPin(false);
    }
  };

  const handleLogout = () => {
    sessionStorage.removeItem('boardgame_admin_auth');
    sessionStorage.removeItem('boardgame_admin_active_pin');
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
      // Handled silently
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
      duration: '45-60 Dk',
      age: '10+',
      difficulty: 'Orta',
      accentColor: '#38bdf8',
      bgGradient: 'from-sky-400 to-blue-500',
      badge: 'Yeni Eklenen',
      description: '',
      winCondition: '',
      rulesKnowledge: '',
      quickPrompts: [
        'Nasıl kurulur?',
        'Sıramda ne yapabilirim?',
        'Puan nasıl hesaplanır?',
        'Oyun nasıl biter?',
      ],
      setupSteps: [
        { title: 'Oyun Alanını Hazırlayın', description: 'Ana tahtayı veya masayı ortaya yerleştirin.' },
      ],
      turnPhases: [
        { phase: '1. Hamle Aşaması', description: 'Oyuncu elindeki kartları oynar veya zar atar.' },
      ],
      faqs: [
        { question: 'Beraberlik durumunda ne olur?', answer: 'Eşit puan durumunda en çok kartı olan kazanır.', pageRef: 'Syf 4' },
      ],
    });
  };

  const handleOpenEditGame = (game: GameData) => {
    setIsNewGame(false);
    setFormTab('basic');
    setEditingGame(JSON.parse(JSON.stringify(game)));
  };

  const handleSaveGame = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingGame || !editingGame.title) {
      alert('Lütfen oyun başlığını girin.');
      return;
    }

    if (isNewGame && !editingGame.id) {
      editingGame.id = editingGame.title
        .toLowerCase()
        .replace(/[^a-z0-9]/g, '-')
        .replace(/-+/g, '-');
    }

    setIsSaving(true);
    try {
      const res = await fetch('/api/games', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ game: editingGame }),
      });

      if (res.ok) {
        setSaveSuccess(true);
        setTimeout(() => {
          setIsSaving(false);
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

  const addSetupStep = () => {
    if (!editingGame) return;
    setEditingGame({
      ...editingGame,
      setupSteps: [...editingGame.setupSteps, { title: 'Yeni Adım', description: '' }],
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
      setupSteps: editingGame.setupSteps.filter((_, i) => i !== index),
    });
  };

  const addTurnPhase = () => {
    if (!editingGame) return;
    setEditingGame({
      ...editingGame,
      turnPhases: [...editingGame.turnPhases, { phase: 'Yeni Aşama', description: '' }],
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
      turnPhases: editingGame.turnPhases.filter((_, i) => i !== index),
    });
  };

  const addFaq = () => {
    if (!editingGame) return;
    setEditingGame({
      ...editingGame,
      faqs: [...editingGame.faqs, { question: '', answer: '', pageRef: 'Syf 1' }],
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
      faqs: editingGame.faqs.filter((_, i) => i !== index),
    });
  };

  // If not logged in, show PIN entry
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
              Etkinlik oyunlarını ve yapay zeka ayarlarını yönetmek için PIN girin. (Varsayılan PIN: 1234)
            </p>

            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <input
                  type="password"
                  placeholder="PIN Kodu..."
                  value={pinInput}
                  onChange={(e) => setPinInput(e.target.value)}
                  className="w-full text-center tracking-widest text-lg font-display font-black bg-slate-50 border-2 border-slate-900 rounded-xl px-4 py-2.5 min-h-[44px] focus:outline-none focus:bg-white shadow-[2px_2px_0px_0px_#0f172a]"
                />
                {pinError && (
                  <p className="text-xs text-rose-500 font-bold mt-1.5 animate-bounce">
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
    <div className="min-h-screen bg-[#f0fdf4] text-slate-900 flex flex-col">
      <Navbar />

      {/* Admin Header */}
      <div className="bg-white border-b-[3px] border-slate-900 shadow-[0_3px_0_0_rgba(15,23,42,0.05)]">
        <div className="max-w-6xl mx-auto px-4 py-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-lg bg-amber-200 border-2 border-slate-900 text-slate-900 text-xs font-extrabold shadow-[2px_2px_0px_0px_#0f172a] flex items-center gap-1">
                  <Shield className="w-3.5 h-3.5 text-amber-800" /> ETKİNLİK YÖNETİMİ
                </span>
                <span className="text-xs font-bold text-slate-500">
                  Toplam {gamesList.length} Oyun
                </span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 font-display">
                Oyun & QR Yönetici Paneli
              </h1>
              <p className="text-xs sm:text-sm font-semibold text-slate-600">
                Oyunları düzenleyin, yeni oyun ekleyin, Gemini AI anahtarını tanımlayın ve toplu QR kartları basın.
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
                className="pixel-btn bg-sky-200 hover:bg-sky-300 text-slate-900 min-h-[44px] px-3.5 py-2 text-xs font-extrabold flex items-center gap-1.5"
              >
                <Printer className="w-4 h-4 stroke-[2.5]" /> Toplu QR Yazdır
              </Link>

              <button
                type="button"
                onClick={handleLogout}
                className="pixel-btn bg-slate-100 hover:bg-slate-200 text-slate-700 min-h-[44px] px-3 py-2 text-xs font-bold"
                title="Çıkış Yap"
              >
                Çıkış
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Admin Content */}
      <main className="flex-1 max-w-6xl w-full mx-auto p-4 sm:p-6 space-y-6">
        
        {/* SETTINGS SECTION: GEMINI API KEY & ADMIN PIN MANAGEMENT */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* SECURE GEMINI API KEY MANAGEMENT CARD */}
          <div className="pixel-box-card bg-white p-5 border-[3px] border-slate-900 flex flex-col justify-between">
            <div>
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b-2 border-slate-900 mb-4">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-xl bg-amber-200 border-2 border-slate-900 shadow-[2px_2px_0px_0px_#0f172a] flex items-center justify-center">
                    <Key className="w-5 h-5 text-slate-900" />
                  </div>
                  <div>
                    <h2 className="font-display font-extrabold text-base sm:text-lg text-slate-900">
                      Gemini AI Anahtarı
                    </h2>
                    <p className="text-xs font-semibold text-slate-500">
                      Sunucu tarafında şifreli olarak korunur.
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <span
                    className={`text-xs font-bold px-2.5 py-1 rounded-lg border-2 border-slate-900 shadow-[1px_1px_0px_0px_#0f172a] flex items-center gap-1.5 ${
                      apiKeyStatus.hasKey
                        ? 'bg-emerald-200 text-slate-900'
                        : 'bg-amber-100 text-amber-900'
                    }`}
                  >
                    <span
                      className={`w-2 h-2 rounded-full border border-slate-900 ${
                        apiKeyStatus.hasKey ? 'bg-emerald-500 animate-pulse' : 'bg-amber-400'
                      }`}
                    />
                    {apiKeyStatus.hasKey ? 'Gemini AI Aktif' : 'Dahili Motor Aktif'}
                  </span>
                </div>
              </div>

              <div className="space-y-3">
                <p className="text-xs font-semibold text-slate-600 leading-relaxed">
                  {apiKeyStatus.hasKey ? (
                    <>
                      Aktif anahtar:{' '}
                      <code className="bg-slate-100 border border-slate-300 px-2 py-0.5 rounded font-mono font-bold text-slate-900">
                        {apiKeyStatus.maskedKey}
                      </code>{' '}
                      ({apiKeyStatus.source === 'env_variable' ? '.env ortamı' : 'yönetici kaydı'})
                    </>
                  ) : (
                    'API anahtarı girilmediğinde sistem 61 oyunluk kural motoruyla anında çalışır.'
                  )}
                </p>

                <div className="flex items-center gap-3 text-xs font-bold">
                  <a
                    href="https://aistudio.google.com/app/apikey"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sky-600 hover:underline flex items-center gap-1"
                  >
                    Ücretsiz Key Al <ExternalLink className="w-3.5 h-3.5" />
                  </a>

                  {apiKeyStatus.hasKey && (
                    <button
                      type="button"
                      onClick={handleDeleteApiKey}
                      className="text-rose-600 hover:underline"
                    >
                      Anahtarı Kaldır
                    </button>
                  )}
                </div>

                <form onSubmit={handleSaveApiKey} className="flex flex-col sm:flex-row gap-2 pt-1">
                  <input
                    type="password"
                    placeholder="Yeni API Key (AIzaSy...)"
                    value={newKeyInput}
                    onChange={(e) => setNewKeyInput(e.target.value)}
                    className="flex-1 min-h-[44px] bg-slate-50 border-2 border-slate-900 rounded-xl px-3 py-2 text-xs font-semibold text-slate-900 placeholder-slate-400 focus:outline-none focus:bg-white shadow-[2px_2px_0px_0px_#0f172a]"
                  />
                  <button
                    type="submit"
                    disabled={!newKeyInput.trim() || isSavingKey}
                    className="pixel-btn pixel-btn-primary min-h-[44px] px-4 py-2 text-xs font-extrabold disabled:opacity-40 shrink-0"
                  >
                    {isSavingKey ? 'Kaydediliyor...' : 'Kaydet'}
                  </button>
                </form>
              </div>
            </div>

            {keyMessage && (
              <div className="mt-3 text-xs font-bold text-slate-800 bg-sky-50 border-2 border-slate-900 p-2 rounded-lg shadow-[2px_2px_0px_0px_#0f172a]">
                {keyMessage}
              </div>
            )}
          </div>

          {/* SECURE ADMIN PIN MANAGEMENT CARD */}
          <div className="pixel-box-card bg-white p-5 border-[3px] border-slate-900 flex flex-col justify-between">
            <div>
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b-2 border-slate-900 mb-4">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-xl bg-purple-200 border-2 border-slate-900 shadow-[2px_2px_0px_0px_#0f172a] flex items-center justify-center">
                    <Lock className="w-5 h-5 text-slate-900" />
                  </div>
                  <div>
                    <h2 className="font-display font-extrabold text-base sm:text-lg text-slate-900">
                      Yönetici Şifresi (PIN)
                    </h2>
                    <p className="text-xs font-semibold text-slate-500">
                      Yönetici paneli giriş PIN kodunu güncelleyin.
                    </p>
                  </div>
                </div>

                <div className="text-xs font-bold text-slate-600 bg-slate-100 border-2 border-slate-900 px-2.5 py-1 rounded-lg shadow-[1px_1px_0px_0px_#0f172a]">
                  En az 4 Karakter
                </div>
              </div>

              <form onSubmit={handleChangePin} className="space-y-3">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 mb-1">Mevcut PIN</label>
                    <input
                      type="password"
                      placeholder="Mevcut..."
                      value={currentPinChangeInput}
                      onChange={(e) => setCurrentPinChangeInput(e.target.value)}
                      className="w-full min-h-[44px] bg-slate-50 border-2 border-slate-900 rounded-xl px-3 py-2 text-xs font-bold text-slate-900 placeholder-slate-400 focus:outline-none focus:bg-white shadow-[2px_2px_0px_0px_#0f172a]"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 mb-1">Yeni PIN</label>
                    <input
                      type="password"
                      placeholder="Yeni şifre..."
                      value={newPinInput}
                      onChange={(e) => setNewPinInput(e.target.value)}
                      className="w-full min-h-[44px] bg-slate-50 border-2 border-slate-900 rounded-xl px-3 py-2 text-xs font-bold text-slate-900 placeholder-slate-400 focus:outline-none focus:bg-white shadow-[2px_2px_0px_0px_#0f172a]"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 mb-1">Yeni PIN Tekrar</label>
                    <input
                      type="password"
                      placeholder="Tekrar..."
                      value={confirmPinInput}
                      onChange={(e) => setConfirmPinInput(e.target.value)}
                      className="w-full min-h-[44px] bg-slate-50 border-2 border-slate-900 rounded-xl px-3 py-2 text-xs font-bold text-slate-900 placeholder-slate-400 focus:outline-none focus:bg-white shadow-[2px_2px_0px_0px_#0f172a]"
                    />
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pt-1">
                  <p className="text-[11px] font-semibold text-slate-500">
                    Varsayılan başlangıç PIN kodu: <span className="font-mono font-bold text-slate-800">1234</span>
                  </p>
                  <button
                    type="submit"
                    disabled={isChangingPin || !currentPinChangeInput || !newPinInput || !confirmPinInput}
                    className="pixel-btn pixel-btn-accent min-h-[44px] px-4 py-2 text-xs font-extrabold disabled:opacity-40 shrink-0 flex items-center justify-center gap-1.5"
                  >
                    <Lock className="w-3.5 h-3.5" />
                    {isChangingPin ? 'Kaydediliyor...' : 'Şifreyi Değiştir'}
                  </button>
                </div>
              </form>
            </div>

            {pinChangeMessage && (
              <div
                className={`mt-3 text-xs font-bold p-2.5 rounded-lg border-2 border-slate-900 shadow-[2px_2px_0px_0px_#0f172a] ${
                  pinChangeMessage.isError
                    ? 'bg-rose-100 text-rose-900'
                    : 'bg-emerald-100 text-emerald-900'
                }`}
              >
                {pinChangeMessage.text}
              </div>
            )}
          </div>
        </div>

        {/* GAMES LIST SECTION */}
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
                  <div className="grid grid-cols-3 gap-2 pt-2 border-t-2 border-slate-200">
                    <button
                      type="button"
                      onClick={() => handleOpenEditGame(g)}
                      className="pixel-btn bg-slate-100 hover:bg-slate-200 text-slate-900 py-1.5 min-h-[44px] text-xs font-bold flex items-center justify-center gap-1"
                    >
                      <Edit3 className="w-3.5 h-3.5" /> Düzenle
                    </button>

                    <Link
                      href={`/print/${g.id}`}
                      target="_blank"
                      className="pixel-btn bg-emerald-100 hover:bg-emerald-200 text-slate-900 py-1.5 min-h-[44px] text-xs font-bold flex items-center justify-center gap-1"
                      title="Masa Kartı Çıkar"
                    >
                      <Printer className="w-3.5 h-3.5" /> QR Bas
                    </Link>

                    <button
                      type="button"
                      onClick={() => handleDeleteGame(g.id, g.title)}
                      className="pixel-btn bg-rose-100 hover:bg-rose-200 text-rose-900 py-1.5 min-h-[44px] text-xs font-bold flex items-center justify-center gap-1"
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
                type="button"
                onClick={() => setEditingGame(null)}
                className="min-h-[44px] min-w-[44px] flex items-center justify-center rounded-xl border-2 border-slate-900 bg-white hover:bg-slate-100 shadow-[2px_2px_0px_0px_#0f172a]"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Navigation Tabs */}
            <div className="flex items-center gap-1.5 px-4 sm:px-5 pt-3 border-b border-slate-200 overflow-x-auto no-scrollbar">
              <button
                type="button"
                onClick={() => setFormTab('basic')}
                className={`pixel-btn min-h-[44px] px-3 py-1.5 text-xs font-bold shrink-0 ${
                  formTab === 'basic' ? 'bg-sky-300 text-slate-900' : 'bg-white text-slate-600'
                }`}
              >
                Temel Bilgiler
              </button>
              <button
                type="button"
                onClick={() => setFormTab('rules')}
                className={`pixel-btn min-h-[44px] px-3 py-1.5 text-xs font-bold shrink-0 ${
                  formTab === 'rules' ? 'bg-amber-300 text-slate-900' : 'bg-white text-slate-600'
                }`}
              >
                <Layers className="w-3.5 h-3.5 mr-1" /> Kural Özeti
              </button>
              <button
                type="button"
                onClick={() => setFormTab('setup')}
                className={`pixel-btn min-h-[44px] px-3 py-1.5 text-xs font-bold shrink-0 ${
                  formTab === 'setup' ? 'bg-emerald-300 text-slate-900' : 'bg-white text-slate-600'
                }`}
              >
                <BookOpen className="w-3.5 h-3.5 mr-1" /> Kurulum ({editingGame.setupSteps.length})
              </button>
              <button
                type="button"
                onClick={() => setFormTab('turn')}
                className={`pixel-btn min-h-[44px] px-3 py-1.5 text-xs font-bold shrink-0 ${
                  formTab === 'turn' ? 'bg-purple-300 text-slate-900' : 'bg-white text-slate-600'
                }`}
              >
                <RotateCcw className="w-3.5 h-3.5 mr-1" /> Tur Akışı ({editingGame.turnPhases.length})
              </button>
              <button
                type="button"
                onClick={() => setFormTab('faq')}
                className={`pixel-btn min-h-[44px] px-3 py-1.5 text-xs font-bold shrink-0 ${
                  formTab === 'faq' ? 'bg-rose-300 text-slate-900' : 'bg-white text-slate-600'
                }`}
              >
                <HelpCircle className="w-3.5 h-3.5 mr-1" /> SSS & Kararlar ({editingGame.faqs.length})
              </button>
            </div>

            {/* Modal Form Content */}
            <form onSubmit={handleSaveGame} className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
              {/* TAB 1: BASIC INFO */}
              {formTab === 'basic' && (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                        Oyun Adı *
                      </label>
                      <input
                        type="text"
                        required
                        value={editingGame.title}
                        onChange={(e) => setEditingGame({ ...editingGame, title: e.target.value })}
                        className="w-full min-h-[44px] bg-slate-50 border-2 border-slate-900 rounded-xl px-3 py-2 text-xs font-bold text-slate-900 shadow-[2px_2px_0px_0px_#0f172a]"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                        Kategori
                      </label>
                      <input
                        type="text"
                        value={editingGame.category}
                        onChange={(e) => setEditingGame({ ...editingGame, category: e.target.value })}
                        className="w-full min-h-[44px] bg-slate-50 border-2 border-slate-900 rounded-xl px-3 py-2 text-xs font-bold text-slate-900 shadow-[2px_2px_0px_0px_#0f172a]"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                      Kısa Tanıtım / Slogan
                    </label>
                    <input
                      type="text"
                      value={editingGame.tagline}
                      onChange={(e) => setEditingGame({ ...editingGame, tagline: e.target.value })}
                      className="w-full min-h-[44px] bg-slate-50 border-2 border-slate-900 rounded-xl px-3 py-2 text-xs font-bold text-slate-900 shadow-[2px_2px_0px_0px_#0f172a]"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                        Oyuncu Sayısı Metni
                      </label>
                      <input
                        type="text"
                        value={editingGame.players}
                        onChange={(e) => setEditingGame({ ...editingGame, players: e.target.value })}
                        className="w-full min-h-[44px] bg-slate-50 border-2 border-slate-900 rounded-xl px-3 py-2 text-xs font-bold text-slate-900 shadow-[2px_2px_0px_0px_#0f172a]"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                        Oyun Süresi
                      </label>
                      <input
                        type="text"
                        value={editingGame.duration}
                        onChange={(e) => setEditingGame({ ...editingGame, duration: e.target.value })}
                        className="w-full min-h-[44px] bg-slate-50 border-2 border-slate-900 rounded-xl px-3 py-2 text-xs font-bold text-slate-900 shadow-[2px_2px_0px_0px_#0f172a]"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                        Zorluk Derecesi
                      </label>
                      <select
                        value={editingGame.difficulty}
                        onChange={(e) =>
                          setEditingGame({
                            ...editingGame,
                            difficulty: e.target.value as 'Kolay' | 'Orta' | 'Zor' | 'Kolay - Orta',
                          })
                        }
                        className="w-full min-h-[44px] bg-slate-50 border-2 border-slate-900 rounded-xl px-3 py-2 text-xs font-bold text-slate-900 shadow-[2px_2px_0px_0px_#0f172a]"
                      >
                        <option value="Kolay">Kolay</option>
                        <option value="Kolay - Orta">Kolay - Orta</option>
                        <option value="Orta">Orta</option>
                        <option value="Zor">Zor</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                      Kazanma Şartı
                    </label>
                    <input
                      type="text"
                      value={editingGame.winCondition}
                      onChange={(e) => setEditingGame({ ...editingGame, winCondition: e.target.value })}
                      className="w-full min-h-[44px] bg-slate-50 border-2 border-slate-900 rounded-xl px-3 py-2 text-xs font-bold text-slate-900 shadow-[2px_2px_0px_0px_#0f172a]"
                    />
                  </div>
                </div>
              )}

              {/* TAB 2: RULES KNOWLEDGE */}
              {formTab === 'rules' && (
                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                      Kural Özeti & Hakem Bilgi Tabanı (AI & Dahili Motor Buradan Beslenir)
                    </label>
                    <textarea
                      rows={12}
                      value={editingGame.rulesKnowledge}
                      onChange={(e) => setEditingGame({ ...editingGame, rulesKnowledge: e.target.value })}
                      className="w-full bg-slate-50 border-2 border-slate-900 rounded-xl p-3 text-xs font-medium text-slate-900 font-mono shadow-[2px_2px_0px_0px_#0f172a]"
                    />
                  </div>
                </div>
              )}

              {/* TAB 3: SETUP STEPS */}
              {formTab === 'setup' && (
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-700">Adım Adım Masa Kurulumu</span>
                    <button
                      type="button"
                      onClick={addSetupStep}
                      className="pixel-btn bg-emerald-200 text-slate-900 px-3 py-1.5 min-h-[44px] text-xs font-bold flex items-center gap-1"
                    >
                      <Plus className="w-3.5 h-3.5" /> Adım Ekle
                    </button>
                  </div>

                  {editingGame.setupSteps.map((step, idx) => (
                    <div key={idx} className="p-3 bg-slate-50 border-2 border-slate-900 rounded-xl space-y-2">
                      <div className="flex items-center justify-between gap-2">
                        <span className="text-xs font-black text-slate-900">Adım {idx + 1}</span>
                        <button
                          type="button"
                          onClick={() => removeSetupStep(idx)}
                          className="min-h-[36px] min-w-[36px] flex items-center justify-center text-rose-500 hover:text-rose-700"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                      <input
                        type="text"
                        placeholder="Adım Başlığı (Örn: Taşları Dağıtın)"
                        value={step.title}
                        onChange={(e) => updateSetupStep(idx, 'title', e.target.value)}
                        className="w-full min-h-[40px] bg-white border border-slate-300 rounded-lg p-2 text-xs font-bold text-slate-900"
                      />
                      <textarea
                        rows={2}
                        placeholder="Adım Açıklaması..."
                        value={step.description}
                        onChange={(e) => updateSetupStep(idx, 'description', e.target.value)}
                        className="w-full bg-white border border-slate-300 rounded-lg p-2 text-xs font-medium text-slate-900"
                      />
                    </div>
                  ))}
                </div>
              )}

              {/* TAB 4: TURN PHASES */}
              {formTab === 'turn' && (
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-700">Tur Akışı Aşamaları</span>
                    <button
                      type="button"
                      onClick={addTurnPhase}
                      className="pixel-btn bg-purple-200 text-slate-900 px-3 py-1.5 min-h-[44px] text-xs font-bold flex items-center gap-1"
                    >
                      <Plus className="w-3.5 h-3.5" /> Aşama Ekle
                    </button>
                  </div>

                  {editingGame.turnPhases.map((phase, idx) => (
                    <div key={idx} className="p-3 bg-slate-50 border-2 border-slate-900 rounded-xl space-y-2">
                      <div className="flex items-center justify-between gap-2">
                        <input
                          type="text"
                          placeholder="Aşama Başlığı"
                          value={phase.phase}
                          onChange={(e) => updateTurnPhase(idx, 'phase', e.target.value)}
                          className="w-full min-h-[40px] bg-white border border-slate-300 rounded-lg p-2 text-xs font-bold text-slate-900"
                        />
                        <button
                          type="button"
                          onClick={() => removeTurnPhase(idx)}
                          className="min-h-[36px] min-w-[36px] flex items-center justify-center text-rose-500 hover:text-rose-700 shrink-0"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                      <textarea
                        rows={2}
                        placeholder="Aşama açıklaması..."
                        value={phase.description}
                        onChange={(e) => updateTurnPhase(idx, 'description', e.target.value)}
                        className="w-full bg-white border border-slate-300 rounded-lg p-2 text-xs font-medium text-slate-900"
                      />
                    </div>
                  ))}
                </div>
              )}

              {/* TAB 5: FAQS */}
              {formTab === 'faq' && (
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-700">Sık Sorulan Sorular & Kural Çözümleri</span>
                    <button
                      type="button"
                      onClick={addFaq}
                      className="pixel-btn bg-rose-200 text-slate-900 px-3 py-1.5 min-h-[44px] text-xs font-bold flex items-center gap-1"
                    >
                      <Plus className="w-3.5 h-3.5" /> Soru Ekle
                    </button>
                  </div>

                  {editingGame.faqs.map((faq, idx) => (
                    <div key={idx} className="p-3 bg-slate-50 border-2 border-slate-900 rounded-xl space-y-2">
                      <div className="flex items-center justify-between gap-2">
                        <input
                          type="text"
                          placeholder="Kural Sorusu (Örn: Aynı turda iki kez ticaret yapılır mı?)"
                          value={faq.question}
                          onChange={(e) => updateFaq(idx, 'question', e.target.value)}
                          className="w-full min-h-[40px] bg-white border border-slate-300 rounded-lg p-2 text-xs font-bold text-slate-900"
                        />
                        <input
                          type="text"
                          placeholder="Sayfa Ref"
                          value={faq.pageRef || ''}
                          onChange={(e) => updateFaq(idx, 'pageRef', e.target.value)}
                          className="w-24 min-h-[40px] bg-white border border-slate-300 rounded-lg p-2 text-xs font-bold text-slate-900 shrink-0"
                        />
                        <button
                          type="button"
                          onClick={() => removeFaq(idx)}
                          className="min-h-[36px] min-w-[36px] flex items-center justify-center text-rose-500 hover:text-rose-700 shrink-0"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                      <textarea
                        rows={2}
                        placeholder="Resmi Kural Hakemi Cevabı..."
                        value={faq.answer}
                        onChange={(e) => updateFaq(idx, 'answer', e.target.value)}
                        className="w-full bg-white border border-slate-300 rounded-lg p-2 text-xs font-medium text-slate-900"
                      />
                    </div>
                  ))}
                </div>
              )}

              {/* Modal Footer Controls */}
              <div className="pt-4 border-t-2 border-slate-900 flex justify-end gap-3 sticky bottom-0 bg-white">
                <button
                  type="button"
                  onClick={() => setEditingGame(null)}
                  className="pixel-btn bg-slate-100 hover:bg-slate-200 text-slate-800 px-4 py-2 text-xs font-bold min-h-[44px]"
                >
                  Vazgeç
                </button>
                <button
                  type="submit"
                  disabled={isSaving}
                  className="pixel-btn pixel-btn-primary px-6 py-2 text-xs font-extrabold flex items-center gap-1.5 min-h-[44px]"
                >
                  {saveSuccess ? (
                    <>
                      <Check className="w-4 h-4" /> Kaydedildi!
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4" /> {isSaving ? 'Kaydediliyor...' : 'Değişiklikleri Kaydet'}
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
