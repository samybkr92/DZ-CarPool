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
  MapPin,
  Car,
  AlertCircle,
  ShieldCheck,
  ArrowRight,
  UserCheck,
} from 'lucide-react';

export const RegisterPage: React.FC = () => {
  const { t } = useTranslation();
  const { register } = useAuth();
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
    <div className="min-h-[90vh] flex items-stretch bg-slate-50">
      {/* Left Column: Visual Algerian Context */}
      <div className="hidden lg:flex lg:w-1/2 relative bg-slate-950 text-white flex-col justify-between p-12 overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img
            src="https://images.unsplash.com/photo-1506015391300-4802dc74de2e?auto=format&fit=crop&w=1600&q=80"
            alt="Ponts de Constantine Algérie"
            className="w-full h-full object-cover object-center opacity-40 mix-blend-luminosity scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/70 to-emerald-950/50" />
        </div>

        <div className="relative z-10 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center shadow-lg">
            <Car className="w-5 h-5" />
          </div>
          <div>
            <span className="text-xl font-black tracking-tight">
              DZ<span className="text-emerald-400">-CarPool</span>
            </span>
            <p className="text-[11px] text-slate-400 font-medium">Inscription Membre Officiel</p>
          </div>
        </div>

        <div className="relative z-10 space-y-5 max-w-lg">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-bold bg-white/10 backdrop-blur-md border border-white/15 text-emerald-300">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>Communauté Algérienne Vérifiée</span>
          </div>

          <h2 className="text-3xl lg:text-4xl font-black tracking-tight leading-tight">
            Partagez vos trajets, réduisez vos dépenses de carburant.
          </h2>

          <p className="text-sm text-slate-300 leading-relaxed">
            Créez votre profil en 1 minute. Vous pourrez publier des trajets entre wilayas, réserver des sièges en toute sécurité et communiquer directement avec les conducteurs via la messagerie intégrée.
          </p>

          <div className="space-y-2.5 pt-2 text-xs text-slate-300">
            <div className="flex items-center gap-2.5">
              <span className="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-300 flex items-center justify-center font-bold text-[11px]">✓</span>
              <span>Profils et avis authentiques avec historique complet</span>
            </div>
            <div className="flex items-center gap-2.5">
              <span className="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-300 flex items-center justify-center font-bold text-[11px]">✓</span>
              <span>Barème carburant Naftal officiel calculé automatiquement</span>
            </div>
            <div className="flex items-center gap-2.5">
              <span className="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-300 flex items-center justify-center font-bold text-[11px]">✓</span>
              <span>Pause détente de 15 minutes garantie sur trajets &gt; 300 km</span>
            </div>
          </div>
        </div>

        <div className="relative z-10 text-xs text-slate-400">
          Rejoignez des milliers de voyageurs à travers les 58 wilayas d'Algérie.
        </div>
      </div>

      {/* Right Column: Registration Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 sm:p-12">
        <div className="max-w-md w-full space-y-6">
          <div className="space-y-1.5 text-left">
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              Créer un compte
            </h1>
            <p className="text-xs sm:text-sm text-slate-500">
              Renseignez vos coordonnées pour accéder aux trajets et réservations.
            </p>
          </div>

          {error && (
            <div className="p-3.5 bg-rose-50 text-rose-800 rounded-xl border border-rose-200 text-xs font-semibold flex items-center gap-2.5">
              <AlertCircle className="w-4 h-4 flex-shrink-0 text-rose-600" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4 text-left">
            {/* Role selector pill */}
            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-slate-700">Votre rôle principal</label>
              <div className="grid grid-cols-3 gap-2 p-1 bg-slate-100 rounded-xl border border-slate-200">
                <button
                  type="button"
                  onClick={() => setRole('both')}
                  className={`py-2 text-xs font-bold rounded-lg transition-all ${
                    role === 'both' ? 'bg-white text-emerald-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  Les deux
                </button>
                <button
                  type="button"
                  onClick={() => setRole('driver')}
                  className={`py-2 text-xs font-bold rounded-lg transition-all ${
                    role === 'driver' ? 'bg-white text-emerald-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  Conducteur
                </button>
                <button
                  type="button"
                  onClick={() => setRole('passenger')}
                  className={`py-2 text-xs font-bold rounded-lg transition-all ${
                    role === 'passenger' ? 'bg-white text-emerald-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  Passager
                </button>
              </div>
            </div>

            {/* Name */}
            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-slate-700">Nom et prénom</label>
              <div className="relative">
                <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                <input
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="Ex: Yacine Benmansour"
                  required
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 bg-white text-xs font-semibold text-slate-900 focus:outline-none focus:border-emerald-600 focus:ring-2 focus:ring-emerald-600/10 transition-all placeholder:text-slate-400"
                />
              </div>
            </div>

            {/* Email */}
            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-slate-700">Adresse email</label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="yacine@exemple.dz"
                  required
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 bg-white text-xs font-semibold text-slate-900 focus:outline-none focus:border-emerald-600 focus:ring-2 focus:ring-emerald-600/10 transition-all placeholder:text-slate-400"
                />
              </div>
            </div>

            {/* Phone & Wilaya in 2 columns */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-slate-700">Téléphone algérien</label>
                <div className="relative">
                  <Phone className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="0550123456"
                    required
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 bg-white text-xs font-semibold text-slate-900 focus:outline-none focus:border-emerald-600 focus:ring-2 focus:ring-emerald-600/10 transition-all"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-slate-700">Wilaya de résidence</label>
                <div className="relative">
                  <MapPin className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5 pointer-events-none" />
                  <select
                    value={wilayaCode}
                    onChange={(e) => setWilayaCode(Number(e.target.value))}
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 bg-white text-xs font-semibold text-slate-900 focus:outline-none focus:border-emerald-600 focus:ring-2 focus:ring-emerald-600/10 transition-all cursor-pointer"
                  >
                    {WILAYAS.map((w) => (
                      <option key={w.code} value={w.code}>
                        {w.code_str} - {w.name} ({w.name_ar})
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* Password */}
            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-slate-700">Mot de passe</label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Minimum 6 caractères"
                  required
                  minLength={6}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 bg-white text-xs font-semibold text-slate-900 focus:outline-none focus:border-emerald-600 focus:ring-2 focus:ring-emerald-600/10 transition-all placeholder:text-slate-400"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 px-4 bg-emerald-700 hover:bg-emerald-800 disabled:bg-slate-200 disabled:text-slate-400 text-white font-extrabold text-xs rounded-xl shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 active:scale-[0.99] mt-2"
            >
              <span>{loading ? 'Création en cours...' : 'Créer mon compte'}</span>
              {!loading && <ArrowRight className="w-4 h-4" />}
            </button>
          </form>

          <div className="text-center text-xs text-slate-500 pt-3 border-t border-slate-200">
            Vous avez déjà un compte ?{' '}
            <Link to="/login" className="font-extrabold text-emerald-700 hover:text-emerald-800 hover:underline">
              Se connecter
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
