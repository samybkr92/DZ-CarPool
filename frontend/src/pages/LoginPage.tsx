import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../context/AuthContext';
import { Lock, Mail, Car, AlertCircle, ShieldCheck } from 'lucide-react';

export const LoginPage: React.FC = () => {
  const { t } = useTranslation();
  const { login } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      await login(email, password);
      navigate('/dashboard/driver');
    } catch (err: any) {
      setError(err.message || 'Échec de la connexion');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[75vh] flex items-center justify-center px-4 py-12">
      <div className="max-w-md w-full bg-white rounded-2xl border border-[#E7E2DA] p-8 shadow-card space-y-6">
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-xl bg-forest-700 text-[#FAF8F5] flex items-center justify-center mx-auto shadow-subtle">
            <Car className="w-6 h-6 text-[#FAF8F5]" />
          </div>
          <h1 className="text-2xl font-black text-ink-900 tracking-tight">
            Connexion à DZ-CarPool
          </h1>
          <p className="text-xs text-ink-500">
            Accédez à vos trajets, vos demandes et votre messagerie sécurisée.
          </p>
        </div>

        {error && (
          <div className="p-3 bg-rose-50 text-rose-800 rounded-xl border border-rose-200 text-xs font-bold flex items-center gap-2">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1">
            <label className="block text-xs font-bold text-ink-700">Adresse email</label>
            <div className="relative">
              <Mail className="w-4 h-4 text-ink-400 absolute left-3 top-3.5" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="nom@exemple.dz"
                required
                className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-[#DED7CE] bg-[#FAF8F5] text-xs font-semibold text-ink-900 focus:bg-white focus:outline-none focus:border-forest-600 transition-colors"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="block text-xs font-bold text-ink-700">Mot de passe</label>
            <div className="relative">
              <Lock className="w-4 h-4 text-ink-400 absolute left-3 top-3.5" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-[#DED7CE] bg-[#FAF8F5] text-xs font-semibold text-ink-900 focus:bg-white focus:outline-none focus:border-forest-600 transition-colors"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 px-4 bg-forest-700 hover:bg-forest-800 disabled:bg-ink-200 text-[#FAF8F5] font-bold text-xs rounded-xl shadow-subtle hover:shadow-card transition-all"
          >
            {loading ? 'Connexion en cours...' : 'Se connecter'}
          </button>
        </form>

        <div className="text-center text-xs text-ink-500 pt-3 border-t border-[#F4EFEB]">
          Pas encore de compte ?{' '}
          <Link to="/register" className="font-bold text-forest-700 hover:underline">
            Créer un compte certifié
          </Link>
        </div>
      </div>
    </div>
  );
};
