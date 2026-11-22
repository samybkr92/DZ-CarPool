import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../context/AuthContext';
import {
  Lock,
  Mail,
  Car,
  AlertCircle,
  ShieldCheck,
  Coffee,
  Sparkles,
  ArrowRight,
  Eye,
  EyeOff,
  UserCheck,
} from 'lucide-react';

export const LoginPage: React.FC = () => {
  const { t } = useTranslation();
  const { user, login, loginAsDemoDriver, loginAsDemoPassenger } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // If already logged in, redirect immediately
  React.useEffect(() => {
    if (user) {
      navigate(user.role === 'passenger' ? '/dashboard/passenger' : '/dashboard/driver');
    }
  }, [user, navigate]);

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
    <div className="min-h-[88vh] flex items-stretch bg-slate-50">
      {/* Left Column: Algerian Editorial Travel Atmosphere (Desktop) */}
      <div className="hidden lg:flex lg:w-1/2 relative bg-slate-950 text-white flex-col justify-between p-12 overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img
            src="https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&w=1600&q=80"
            alt="Autoroute en Algérie"
            className="w-full h-full object-cover object-center opacity-40 mix-blend-luminosity scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/70 to-emerald-950/50" />
        </div>

        {/* Top Brand Pill */}
        <div className="relative z-10 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center shadow-lg">
            <Car className="w-5 h-5" />
          </div>
          <div>
            <span className="text-xl font-black tracking-tight">
              DZ<span className="text-emerald-400">-CarPool</span>
            </span>
            <p className="text-[11px] text-slate-400 font-medium">Plateforme Nationale de Mobilité</p>
          </div>
        </div>

        {/* Center Quote / Travel Manifesto */}
        <div className="relative z-10 space-y-6 max-w-lg">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-bold bg-white/10 backdrop-blur-md border border-white/15 text-emerald-300">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>Voyages Inter-Wilayas Certifiés</span>
          </div>

          <h2 className="text-3xl lg:text-4xl font-black tracking-tight leading-tight">
            La route algérienne partagée en toute confiance.
          </h2>

          <p className="text-sm text-slate-300 leading-relaxed">
            Reliez Alger, Oran, Constantine, Sétif et le Sud dans le respect des règles : approbation manuelle par le conducteur, commission transparente de 15% et halte de repos obligatoire de 15 minutes sur les trajets de plus de 300 km.
          </p>

          <div className="grid grid-cols-3 gap-3 pt-4 border-t border-white/10 text-xs">
            <div className="space-y-1">
              <span className="font-extrabold text-white text-base">58</span>
              <p className="text-[11px] text-slate-400 font-medium">Wilayas couvertes</p>
            </div>
            <div className="space-y-1">
              <span className="font-extrabold text-emerald-400 text-base">100%</span>
              <p className="text-[11px] text-slate-400 font-medium">Net conducteur</p>
            </div>
            <div className="space-y-1">
              <span className="font-extrabold text-amber-300 text-base">15 min</span>
              <p className="text-[11px] text-slate-400 font-medium">Pause sécurité &gt;300km</p>
            </div>
          </div>
        </div>

        {/* Bottom Tag */}
        <div className="relative z-10 text-xs text-slate-400">
          Projet d'Ingénierie Logicielle GL 2025/2026 • Algérie
        </div>
      </div>

      {/* Right Column: Clean, Elegant Auth Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 sm:p-12">
        <div className="max-w-md w-full space-y-7">
          {/* Form Header */}
          <div className="space-y-2 text-left">
            <div className="lg:hidden w-10 h-10 rounded-xl bg-emerald-700 text-white flex items-center justify-center mb-3">
              <Car className="w-5 h-5 text-white" />
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              Bon retour parmi nous
            </h1>
            <p className="text-xs sm:text-sm text-slate-500">
              Connectez-vous pour gérer vos trajets ou vos réservations en cours.
            </p>
          </div>

          {/* Quick Demo Access - Single Click Test Credentials */}
          <div className="bg-emerald-50/70 border border-emerald-200/80 rounded-2xl p-4 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-extrabold uppercase tracking-wider text-emerald-900 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-emerald-700" />
                Accès Démo Immédiat (1 Clic)
              </span>
              <span className="text-[10px] font-bold text-emerald-700 bg-white px-2 py-0.5 rounded-full border border-emerald-200">
                Sans saisie
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              <button
                type="button"
                onClick={handleQuickDriver}
                disabled={loading}
                className="flex items-center gap-2.5 p-3 rounded-xl bg-white hover:bg-emerald-100/50 border border-emerald-300 text-left transition-all group shadow-2xs hover:shadow-xs active:scale-[0.98]"
              >
                <div className="w-8 h-8 rounded-lg bg-emerald-700 text-white flex items-center justify-center flex-shrink-0 group-hover:bg-emerald-800">
                  <Car className="w-4 h-4" />
                </div>
                <div className="min-w-0 flex-1">
                  <span className="block text-xs font-black text-slate-900 truncate">
                    Amine Benali
                  </span>
                  <span className="block text-[10px] font-semibold text-emerald-800 truncate">
                    Conducteur (Alger)
                  </span>
                </div>
              </button>

              <button
                type="button"
                onClick={handleQuickPassenger}
                disabled={loading}
                className="flex items-center gap-2.5 p-3 rounded-xl bg-white hover:bg-emerald-100/50 border border-emerald-300 text-left transition-all group shadow-2xs hover:shadow-xs active:scale-[0.98]"
              >
                <div className="w-8 h-8 rounded-lg bg-emerald-700 text-white flex items-center justify-center flex-shrink-0 group-hover:bg-emerald-800">
                  <UserCheck className="w-4 h-4" />
                </div>
                <div className="min-w-0 flex-1">
                  <span className="block text-xs font-black text-slate-900 truncate">
                    Amina Mansouri
                  </span>
                  <span className="block text-[10px] font-semibold text-emerald-800 truncate">
                    Passagère (Oran)
                  </span>
                </div>
              </button>
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <div className="p-3.5 bg-rose-50 text-rose-800 rounded-xl border border-rose-200 text-xs font-semibold flex items-center gap-2.5 animate-fadeIn">
              <AlertCircle className="w-4 h-4 flex-shrink-0 text-rose-600" />
              <span>{error}</span>
            </div>
          )}

          {/* Standard Form */}
          <form onSubmit={handleSubmit} className="space-y-4 text-left">
            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-slate-700">Adresse email</label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="amine.benali@dz-carpool.dz"
                  required
                  className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 bg-white text-xs font-semibold text-slate-900 focus:outline-none focus:border-emerald-600 focus:ring-2 focus:ring-emerald-600/10 transition-all placeholder:text-slate-400"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="block text-xs font-bold text-slate-700">Mot de passe</label>
                <span className="text-[11px] text-slate-400 font-medium">Défaut démo: password123</span>
              </div>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  className="w-full pl-10 pr-10 py-3 rounded-xl border border-slate-200 bg-white text-xs font-semibold text-slate-900 focus:outline-none focus:border-emerald-600 focus:ring-2 focus:ring-emerald-600/10 transition-all placeholder:text-slate-400"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-3.5 text-slate-400 hover:text-slate-600"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 px-4 bg-emerald-700 hover:bg-emerald-800 disabled:bg-slate-200 disabled:text-slate-400 text-white font-extrabold text-xs rounded-xl shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 active:scale-[0.99]"
            >
              <span>{loading ? 'Connexion en cours...' : 'Se connecter'}</span>
              {!loading && <ArrowRight className="w-4 h-4" />}
            </button>
          </form>

          {/* Footer Call to Action */}
          <div className="text-center text-xs text-slate-500 pt-4 border-t border-slate-200">
            Nouveau sur la plateforme ?{' '}
            <Link to="/register" className="font-extrabold text-emerald-700 hover:text-emerald-800 hover:underline">
              Créer un compte certifié
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
