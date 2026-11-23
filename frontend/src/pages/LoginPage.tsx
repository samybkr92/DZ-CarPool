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
    <div className="min-h-[85vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-slate-50">
      <div className="max-w-md w-full space-y-7 bg-white p-8 sm:p-10 rounded-3xl border border-slate-200 shadow-soft-sm text-left">
        {/* Brand Header */}
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-2xl bg-brand-600 text-white flex items-center justify-center mx-auto shadow-soft-sm">
            <Car className="w-6 h-6" />
          </div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">
            Connexion à DZ-CarPool
          </h1>
          <p className="text-xs text-slate-500">
            Accédez à vos trajets inter-wilayas et vos réservations.
          </p>
        </div>

        {/* Active Session Card if user is already logged in */}
        {user && (
          <div className="p-4 rounded-2xl bg-brand-50 border border-brand-200 space-y-2 text-xs">
            <div className="flex items-center justify-between">
              <span className="text-slate-600">Session active :</span>
              <span className="font-bold text-brand-900">{user.full_name}</span>
            </div>
            <div className="flex gap-2 pt-1">
              <button
                type="button"
                onClick={() => navigate(user.role === 'passenger' ? '/dashboard/passenger' : '/dashboard/driver')}
                className="flex-1 py-2 px-3 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-bold transition-colors"
              >
                Accéder à mon espace
              </button>
              <button
                type="button"
                onClick={logout}
                className="py-2 px-3 rounded-xl border border-rose-200 bg-white hover:bg-rose-50 text-rose-700 font-bold transition-colors"
              >
                Déconnexion
              </button>
            </div>
          </div>
        )}

        {/* 1-Click Fast Evaluator Demo Access */}
        <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-brand-600" />
              <span>Accès Démo Immédiat (1 Clic)</span>
            </span>
            <span className="text-[10px] font-bold text-brand-700 bg-brand-50 px-2 py-0.5 rounded-full border border-brand-200">
              Évaluation GL
            </span>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={handleQuickDriver}
              disabled={loading}
              className="py-2.5 px-3 rounded-xl bg-white hover:bg-slate-100 border border-slate-200 text-left transition-all shadow-soft-xs"
            >
              <span className="text-xs font-bold text-slate-900 block">Amine Benali</span>
              <span className="text-[10px] font-bold text-brand-700">Conducteur</span>
            </button>

            <button
              type="button"
              onClick={handleQuickPassenger}
              disabled={loading}
              className="py-2.5 px-3 rounded-xl bg-white hover:bg-slate-100 border border-slate-200 text-left transition-all shadow-soft-xs"
            >
              <span className="text-xs font-bold text-slate-900 block">Amina Mansouri</span>
              <span className="text-[10px] font-bold text-amber-700">Passagère</span>
            </button>
          </div>
        </div>

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="p-3 bg-rose-50 border border-rose-200 text-rose-800 rounded-xl text-xs font-semibold flex items-center gap-2">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-slate-700">Adresse email</label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="nom@exemple.dz"
                className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-xs font-semibold text-slate-900 focus:bg-white focus:outline-none focus:border-brand-600"
                required
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label className="block text-xs font-bold text-slate-700">Mot de passe</label>
              <span className="text-[11px] text-slate-400 font-medium">Test : password123</span>
            </div>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-9 pr-10 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-xs font-semibold text-slate-900 focus:bg-white focus:outline-none focus:border-brand-600"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-3 text-slate-400 hover:text-slate-600"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 px-4 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-bold text-xs shadow-soft-sm transition-all active:scale-[0.98] flex items-center justify-center gap-2"
          >
            {loading ? (
              <span>Connexion en cours...</span>
            ) : (
              <>
                <span>Se connecter</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </>
            )}
          </button>
        </form>

        <div className="pt-4 border-t border-slate-100 text-center text-xs text-slate-500">
          <span>Pas encore de compte ? </span>
          <Link to="/register" className="font-bold text-brand-600 hover:underline">
            Créer un compte
          </Link>
        </div>
      </div>
    </div>
  );
};