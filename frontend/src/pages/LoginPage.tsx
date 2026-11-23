import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../context/AuthContext';
import {
  Lock,
  Mail,
  Car,
  Sparkles,
  ArrowRight,
  Eye,
  EyeOff,
  AlertCircle,
  CheckCircle2,
  ShieldCheck,
  User,
} from 'lucide-react';

export const LoginPage: React.FC = () => {
  const { t } = useTranslation();
  const { user, login, logout, loginAsDemoDriver, loginAsDemoPassenger } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const authUser = await login(email, password);
      const target = authUser.role === 'passenger' ? '/dashboard/passenger' : '/dashboard/driver';
      navigate(target);
    } catch (err: any) {
      setError(err.message || 'Identifiants incorrects');
    } finally {
      setLoading(false);
    }
  };

  const handleQuickDriver = async () => {
    setLoading(true);
    setError(null);
    try {
      await loginAsDemoDriver();
      navigate('/dashboard/driver');
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleQuickPassenger = async () => {
    setLoading(true);
    setError(null);
    try {
      await loginAsDemoPassenger();
      navigate('/dashboard/passenger');
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl w-full grid grid-cols-1 lg:grid-cols-12 bg-[#131D2E] rounded-2xl border border-[#1E2C42] shadow-2xl overflow-hidden">
        {/* Left Editorial Visual Panel (Desktop) */}
        <div className="hidden lg:flex lg:col-span-5 relative bg-[#0B1322] text-white p-10 flex-col justify-between border-r border-[#1E2C42]">
          <div className="space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-[#172554] border border-[#2563EB]/40 text-[11px] font-bold text-[#60A5FA] uppercase tracking-wider">
              <span>Mobilité Algérienne</span>
            </div>

            <div className="space-y-2">
              <h2 className="text-3xl font-serif font-bold text-white leading-tight">
                L'Algérie reliée, <br />
                <span className="text-[#60A5FA] italic">en toute confiance.</span>
              </h2>
              <p className="text-xs text-slate-400 leading-relaxed pt-2">
                Accédez à vos trajets, réservations et messages de coordination sur le réseau national.
              </p>
            </div>
          </div>

          <div className="space-y-4 pt-8 border-t border-[#1E2C42]">
            <div className="space-y-2.5 text-xs">
              <div className="flex items-center gap-2.5 text-slate-300">
                <CheckCircle2 className="w-4 h-4 text-[#3B82F6] flex-shrink-0" />
                <span>15% commission de service plafonnée</span>
              </div>
              <div className="flex items-center gap-2.5 text-slate-300">
                <CheckCircle2 className="w-4 h-4 text-[#3B82F6] flex-shrink-0" />
                <span>Halte Naftal 15 min obligatoire (&gt;300 km)</span>
              </div>
              <div className="flex items-center gap-2.5 text-slate-300">
                <CheckCircle2 className="w-4 h-4 text-[#3B82F6] flex-shrink-0" />
                <span>Option Trajet Confort (+30%)</span>
              </div>
            </div>

            <p className="text-[11px] text-slate-500 italic pt-2">
              Spécifications du projet GL 2025/2026.
            </p>
          </div>
        </div>

        {/* Right Authentication & 1-Click Form */}
        <div className="lg:col-span-7 p-8 sm:p-10 space-y-6 text-left">
          {/* Header */}
          <div className="space-y-1">
            <h1 className="text-2xl sm:text-3xl font-serif font-bold text-white tracking-tight">
              Connexion à DZ-CarPool
            </h1>
            <p className="text-xs sm:text-sm text-slate-400">
              Accédez à vos trajets inter-wilayas et vos réservations.
            </p>
          </div>

          {/* Active Session Notice if logged in */}
          {user && (
            <div className="p-4 rounded-xl bg-[#0E1624] border border-[#2563EB]/40 space-y-2 text-xs">
              <div className="flex items-center justify-between">
                <span className="text-slate-400">Session active :</span>
                <span className="font-bold text-[#60A5FA]">{user.full_name} ({user.role})</span>
              </div>
              <div className="flex gap-2 pt-1">
                <button
                  type="button"
                  onClick={() => navigate(user.role === 'passenger' ? '/dashboard/passenger' : '/dashboard/driver')}
                  className="flex-1 py-2 px-3 rounded-lg bg-[#2563EB] hover:bg-[#1D4ED8] text-white font-bold transition-colors"
                >
                  Accéder à mon espace
                </button>
                <button
                  type="button"
                  onClick={logout}
                  className="py-2 px-3 rounded-lg border border-[#1E2C42] text-slate-300 font-semibold hover:bg-[#1E2C42] transition-colors"
                >
                  Déconnexion
                </button>
              </div>
            </div>
          )}

          {/* 1-CLICK DEMO EVALUATOR PANEL */}
          <div className="p-4 rounded-xl bg-[#0E1624] border border-[#1E2C42] space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-[#3B82F6]" />
                <span className="text-xs font-bold text-white">
                  Accès Démo Immédiat (1 Clic)
                </span>
              </div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#60A5FA] bg-[#172554] px-2 py-0.5 rounded border border-[#2563EB]/40">
                Évaluation GL
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              <button
                type="button"
                onClick={handleQuickDriver}
                disabled={loading}
                className="p-3 rounded-xl bg-[#131D2E] border border-[#1E2C42] hover:border-[#2563EB] hover:bg-[#18253A] text-left transition-all group"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-white group-hover:text-[#60A5FA]">
                    Amine Benali
                  </span>
                  <span className="text-[10px] px-1.5 py-0.5 rounded bg-[#172554] text-[#60A5FA] font-bold border border-[#2563EB]/30">
                    Conducteur
                  </span>
                </div>
                <span className="text-[11px] text-slate-400 block mt-0.5">
                  Renault Symbol • Alger-Oran
                </span>
              </button>

              <button
                type="button"
                onClick={handleQuickPassenger}
                disabled={loading}
                className="p-3 rounded-xl bg-[#131D2E] border border-[#1E2C42] hover:border-amber-500 hover:bg-[#18253A] text-left transition-all group"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-white group-hover:text-amber-400">
                    Amina Mansouri
                  </span>
                  <span className="text-[10px] px-1.5 py-0.5 rounded bg-amber-950/60 text-amber-400 font-bold border border-amber-500/30">
                    Passagère
                  </span>
                </div>
                <span className="text-[11px] text-slate-400 block mt-0.5">
                  Réservations & Historique
                </span>
              </button>
            </div>
          </div>

          {/* Error Notice */}
          {error && (
            <div className="p-3 rounded-lg bg-rose-950/60 border border-rose-800 text-rose-300 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 flex-shrink-0 text-rose-400" />
              <span>{error}</span>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1">
              <label className="block text-xs font-bold text-slate-200">
                Adresse email
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="nom@exemple.dz"
                  className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-[#1E2C42] bg-[#0E1624] text-xs font-medium text-white placeholder:text-slate-500 focus:outline-none focus:border-[#2563EB] focus:ring-1 focus:ring-[#2563EB]"
                />
              </div>
            </div>

            <div className="space-y-1">
              <div className="flex items-center justify-between">
                <label className="block text-xs font-bold text-slate-200">
                  Mot de passe
                </label>
                <span className="text-[11px] text-slate-500">
                  Test : password123
                </span>
              </div>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-10 py-2.5 rounded-lg border border-[#1E2C42] bg-[#0E1624] text-xs font-medium text-white placeholder:text-slate-500 focus:outline-none focus:border-[#2563EB] focus:ring-1 focus:ring-[#2563EB]"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-3 text-slate-500 hover:text-white"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 px-4 rounded-xl bg-[#2563EB] hover:bg-[#1D4ED8] disabled:opacity-50 text-white font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg shadow-blue-600/30 transition-all active:scale-[0.99]"
            >
              {loading ? (
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  <span>Se connecter</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Footer switch to Register */}
          <div className="pt-2 text-center border-t border-[#1E2C42]">
            <p className="text-xs text-slate-400">
              Pas encore de compte ?{' '}
              <Link to="/register" className="font-bold text-[#60A5FA] hover:text-white underline ml-1">
                Créer un compte
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
