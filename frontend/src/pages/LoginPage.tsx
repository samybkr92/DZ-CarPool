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
  ShieldCheck,
  Coffee,
  CheckCircle2,
  Compass,
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
    <div className="min-h-[85vh] flex items-center justify-center py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl w-full grid grid-cols-1 lg:grid-cols-12 bg-white rounded-2xl border border-[#E6E0D6] shadow-elevated overflow-hidden">
        {/* Left Editorial Visual Panel (Desktop) */}
        <div className="hidden lg:flex lg:col-span-5 relative bg-[#0A1C14] text-white p-10 flex-col justify-between">
          <div className="space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-[#173C2C] border border-[#2D6A4F] text-[11px] font-bold text-[#8FBFA9] uppercase tracking-wider">
              <span>Mobilité Algérienne</span>
            </div>

            <div className="space-y-2">
              <h2 className="text-3xl font-serif font-bold text-white leading-tight">
                L'Algérie reliée, <br />
                <span className="text-[#8FBFA9] italic">en toute confiance.</span>
              </h2>
              <p className="text-xs text-stone-300 leading-relaxed pt-2">
                Accédez à vos trajets, réservations et messages de coordination sur le réseau national.
              </p>
            </div>
          </div>

          <div className="space-y-4 pt-8 border-t border-[#1E4D38]">
            <div className="space-y-2.5 text-xs">
              <div className="flex items-center gap-2.5 text-stone-200">
                <CheckCircle2 className="w-4 h-4 text-[#8FBFA9] flex-shrink-0" />
                <span>15% commission de service plafonnée</span>
              </div>
              <div className="flex items-center gap-2.5 text-stone-200">
                <CheckCircle2 className="w-4 h-4 text-[#8FBFA9] flex-shrink-0" />
                <span>Halte Naftal 15 min obligatoire (&gt;300 km)</span>
              </div>
              <div className="flex items-center gap-2.5 text-stone-200">
                <CheckCircle2 className="w-4 h-4 text-[#8FBFA9] flex-shrink-0" />
                <span>Option Trajet Confort (+30%)</span>
              </div>
            </div>

            <p className="text-[11px] text-stone-400 italic pt-2">
              Spécifications du projet GL 2025/2026.
            </p>
          </div>
        </div>

        {/* Right Authentication & 1-Click Form */}
        <div className="lg:col-span-7 p-8 sm:p-10 space-y-6 text-left">
          {/* Header */}
          <div className="space-y-1">
            <h1 className="text-2xl sm:text-3xl font-serif font-bold text-[#141613] tracking-tight">
              Connexion à DZ-CarPool
            </h1>
            <p className="text-xs sm:text-sm text-[#5C6057]">
              Accédez à vos trajets inter-wilayas et vos réservations.
            </p>
          </div>

          {/* Active Session Notice if logged in */}
          {user && (
            <div className="p-4 rounded-xl bg-[#E1EDE6] border border-[#C2DBCF] space-y-2 text-xs">
              <div className="flex items-center justify-between">
                <span className="text-[#5C6057]">Session active :</span>
                <span className="font-bold text-[#173C2C]">{user.full_name} ({user.role})</span>
              </div>
              <div className="flex gap-2 pt-1">
                <button
                  type="button"
                  onClick={() => navigate(user.role === 'passenger' ? '/dashboard/passenger' : '/dashboard/driver')}
                  className="flex-1 py-2 px-3 rounded-lg bg-[#173C2C] hover:bg-[#112E22] text-white font-bold transition-colors"
                >
                  Accéder à mon espace
                </button>
                <button
                  type="button"
                  onClick={logout}
                  className="py-2 px-3 rounded-lg border border-[#C2DBCF] text-[#173C2C] font-semibold hover:bg-white transition-colors"
                >
                  Déconnexion
                </button>
              </div>
            </div>
          )}

          {/* 1-CLICK DEMO EVALUATOR PANEL */}
          <div className="p-4 rounded-xl bg-[#FAF8F5] border border-[#E6E0D6] space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-[#D97706]" />
                <span className="text-xs font-bold text-[#141613]">
                  Accès Démo Immédiat (1 Clic)
                </span>
              </div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#173C2C] bg-[#E1EDE6] px-2 py-0.5 rounded border border-[#C2DBCF]">
                Évaluation GL
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              <button
                type="button"
                onClick={handleQuickDriver}
                disabled={loading}
                className="p-3 rounded-xl bg-white border border-[#E6E0D6] hover:border-[#173C2C] hover:shadow-subtle text-left transition-all group"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-[#141613] group-hover:text-[#173C2C]">
                    Amine Benali
                  </span>
                  <span className="text-[10px] px-1.5 py-0.5 rounded bg-[#E1EDE6] text-[#173C2C] font-bold">
                    Conducteur
                  </span>
                </div>
                <span className="text-[11px] text-[#8E9389] block mt-0.5">
                  Renault Symbol • Alger-Oran
                </span>
              </button>

              <button
                type="button"
                onClick={handleQuickPassenger}
                disabled={loading}
                className="p-3 rounded-xl bg-white border border-[#E6E0D6] hover:border-[#D97706] hover:shadow-subtle text-left transition-all group"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-[#141613] group-hover:text-[#D97706]">
                    Amina Mansouri
                  </span>
                  <span className="text-[10px] px-1.5 py-0.5 rounded bg-amber-100 text-[#92400E] font-bold">
                    Passagère
                  </span>
                </div>
                <span className="text-[11px] text-[#8E9389] block mt-0.5">
                  Réservations & Historique
                </span>
              </button>
            </div>
          </div>

          {/* Error Notice */}
          {error && (
            <div className="p-3 rounded-lg bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1">
              <label className="block text-xs font-bold text-[#141613]">
                Adresse email
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-[#8E9389] absolute left-3.5 top-3" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="nom@exemple.dz"
                  className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-[#E6E0D6] bg-[#FAF8F5] text-xs font-medium text-[#141613] focus:bg-white focus:outline-none focus:border-[#173C2C]"
                />
              </div>
            </div>

            <div className="space-y-1">
              <div className="flex items-center justify-between">
                <label className="block text-xs font-bold text-[#141613]">
                  Mot de passe
                </label>
                <span className="text-[11px] text-[#8E9389]">
                  Test : password123
                </span>
              </div>
              <div className="relative">
                <Lock className="w-4 h-4 text-[#8E9389] absolute left-3.5 top-3" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-10 py-2.5 rounded-lg border border-[#E6E0D6] bg-[#FAF8F5] text-xs font-medium text-[#141613] focus:bg-white focus:outline-none focus:border-[#173C2C]"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-2.5 text-[#8E9389] hover:text-[#141613]"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-xl bg-[#173C2C] hover:bg-[#112E22] text-white font-bold text-xs shadow-sm transition-all flex items-center justify-center gap-2 active:scale-[0.99] disabled:opacity-50"
            >
              <span>{loading ? 'Connexion en cours...' : 'Se connecter'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          {/* Toggle to Register */}
          <div className="text-center pt-2">
            <p className="text-xs text-[#5C6057]">
              Pas encore de compte ?{' '}
              <Link to="/register" className="font-bold text-[#173C2C] hover:underline">
                Créer un compte
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
