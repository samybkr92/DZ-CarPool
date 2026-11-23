import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../context/AuthContext';
import { WILAYAS } from '../utils/algeriaData';
import {
  Lock,
  Mail,
  User,
  Phone,
  Car,
  ArrowRight,
  AlertCircle,
  Check,
} from 'lucide-react';

export const RegisterPage: React.FC = () => {
  const { t } = useTranslation();
  const { user, register, logout } = useAuth();
  const navigate = useNavigate();

  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('0550123456');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<'both' | 'driver' | 'passenger'>('both');
  const [wilayaCode, setWilayaCode] = useState<number>(16);

  const selectedWilaya = WILAYAS.find((w) => w.code === wilayaCode) || WILAYAS[15];

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const newUser = await register({
        full_name: fullName,
        email,
        phone_number: phone,
        password,
        role,
        wilaya_code: wilayaCode,
        wilaya_name: selectedWilaya.name,
      });
      navigate(newUser.role === 'passenger' ? '/dashboard/passenger' : '/dashboard/driver');
    } catch (err: any) {
      setError(err.message || "Échec de l'inscription");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-slate-50">
      <div className="max-w-md w-full space-y-7 bg-white p-8 sm:p-10 rounded-3xl border border-slate-200 shadow-soft-sm text-left">
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-2xl bg-brand-600 text-white flex items-center justify-center mx-auto shadow-soft-sm">
            <Car className="w-6 h-6" />
          </div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">
            Créer un compte DZ-CarPool
          </h1>
          <p className="text-xs text-slate-500">
            Rejoignez le réseau national de covoiturage inter-wilayas.
          </p>
        </div>

        {/* Active Session Notification */}
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
                Aller au tableau de bord
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

        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="p-3 bg-rose-50 border border-rose-200 text-rose-800 rounded-xl text-xs font-semibold flex items-center gap-2">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Role selector pill */}
          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-slate-700">Votre rôle principal</label>
            <div className="grid grid-cols-3 gap-1.5 p-1 bg-slate-100 rounded-xl">
              <button
                type="button"
                onClick={() => setRole('both')}
                className={`py-2 text-xs font-bold rounded-lg transition-all ${
                  role === 'both' ? 'bg-white text-brand-700 shadow-soft-xs' : 'text-slate-600'
                }`}
              >
                Les deux
              </button>
              <button
                type="button"
                onClick={() => setRole('driver')}
                className={`py-2 text-xs font-bold rounded-lg transition-all ${
                  role === 'driver' ? 'bg-white text-brand-700 shadow-soft-xs' : 'text-slate-600'
                }`}
              >
                Conducteur
              </button>
              <button
                type="button"
                onClick={() => setRole('passenger')}
                className={`py-2 text-xs font-bold rounded-lg transition-all ${
                  role === 'passenger' ? 'bg-white text-brand-700 shadow-soft-xs' : 'text-slate-600'
                }`}
              >
                Passager
              </button>
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-slate-700">Nom et prénom</label>
            <div className="relative">
              <User className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
              <input
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="Ex. Karim Benali"
                className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-xs font-semibold text-slate-900 focus:bg-white focus:outline-none focus:border-brand-600"
                required
              />
            </div>
          </div>

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

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-slate-700">Téléphone</label>
              <div className="relative">
                <Phone className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="0550123456"
                  className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-xs font-semibold text-slate-900 focus:bg-white focus:outline-none focus:border-brand-600"
                  required
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-slate-700">Wilaya</label>
              <select
                value={wilayaCode}
                onChange={(e) => setWilayaCode(Number(e.target.value))}
                className="w-full px-3 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-xs font-semibold text-slate-900 focus:bg-white focus:outline-none focus:border-brand-600"
              >
                {WILAYAS.map((w) => (
                  <option key={w.code} value={w.code}>
                    {w.code_str} - {w.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-slate-700">Mot de passe</label>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Au moins 6 caractères"
                className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-xs font-semibold text-slate-900 focus:bg-white focus:outline-none focus:border-brand-600"
                required
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 px-4 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-bold text-xs shadow-soft-sm transition-all active:scale-[0.98] flex items-center justify-center gap-2"
          >
            {loading ? (
              <span>Création du compte...</span>
            ) : (
              <>
                <span>Créer mon compte membre</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </>
            )}
          </button>
        </form>

        <div className="pt-4 border-t border-slate-100 text-center text-xs text-slate-500">
          <span>Déjà inscrit ? </span>
          <Link to="/login" className="font-bold text-brand-600 hover:underline">
            Se connecter
          </Link>
        </div>
      </div>
    </div>
  );
};
