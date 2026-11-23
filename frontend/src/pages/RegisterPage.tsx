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
  MapPin,
  CheckCircle2,
  ShieldCheck,
  Eye,
  EyeOff,
} from 'lucide-react';

export const RegisterPage: React.FC = () => {
  const { t } = useTranslation();
  const { user, register, logout } = useAuth();
  const navigate = useNavigate();

  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('0550123456');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
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
    <div className="min-h-[85vh] flex items-center justify-center py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl w-full grid grid-cols-1 lg:grid-cols-12 bg-[#131D2E] rounded-2xl border border-[#1E2C42] shadow-2xl overflow-hidden">
        {/* Left Editorial Visual Panel (Desktop) */}
        <div className="hidden lg:flex lg:col-span-5 relative bg-[#0B1322] text-white p-10 flex-col justify-between border-r border-[#1E2C42]">
          <div className="relative z-10 space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-[#172554] border border-[#2563EB]/40 text-[11px] font-bold text-[#60A5FA] uppercase tracking-wider">
              <span>Communauté Certifiée</span>
            </div>
            <h2 className="text-3xl font-serif font-bold text-white leading-tight">
              Prenez la route, <br />
              <span className="text-[#60A5FA] italic">partagez vos trajets.</span>
            </h2>
          </div>

          <div className="relative z-10 space-y-4 pt-8 border-t border-[#1E2C42]">
            <p className="text-xs text-slate-400 leading-relaxed italic">
              "Rejoignez des milliers d'Algériens qui voyagent chaque jour entre wilayas en toute confiance."
            </p>

            <div className="space-y-2 text-xs">
              <div className="flex items-center gap-2 text-slate-300">
                <CheckCircle2 className="w-4 h-4 text-[#3B82F6]" />
                <span>Profils et véhicules validés</span>
              </div>
              <div className="flex items-center gap-2 text-slate-300">
                <CheckCircle2 className="w-4 h-4 text-[#3B82F6]" />
                <span>Simulateur carburant Naftal intégré</span>
              </div>
              <div className="flex items-center gap-2 text-slate-300">
                <CheckCircle2 className="w-4 h-4 text-[#3B82F6]" />
                <span>Messagerie privée chiffrée entre membres</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Registration Form */}
        <div className="lg:col-span-7 p-8 sm:p-10 space-y-6 text-left">
          {/* Header */}
          <div className="space-y-1">
            <h1 className="text-2xl sm:text-3xl font-serif font-bold text-white tracking-tight">
              Créer votre compte
            </h1>
            <p className="text-xs sm:text-sm text-slate-400">
              Rejoignez le réseau national de covoiturage inter-wilayas.
            </p>
          </div>

          {/* Active Session Notice */}
          {user && (
            <div className="p-4 rounded-xl bg-[#0E1624] border border-[#2563EB]/40 space-y-2 text-xs">
              <div className="flex items-center justify-between">
                <span className="text-slate-400">Session active :</span>
                <span className="font-bold text-[#60A5FA]">{user.full_name}</span>
              </div>
              <div className="flex gap-2 pt-1">
                <button
                  type="button"
                  onClick={() => navigate(user.role === 'passenger' ? '/dashboard/passenger' : '/dashboard/driver')}
                  className="flex-1 py-2 px-3 rounded-lg bg-[#2563EB] hover:bg-[#1D4ED8] text-white font-bold transition-colors"
                >
                  Aller au tableau de bord
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

          {error && (
            <div className="p-3 rounded-lg bg-rose-950/60 border border-rose-800 text-rose-300 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 flex-shrink-0 text-rose-400" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1">
              <label className="block text-xs font-bold text-slate-200">
                Nom complet
              </label>
              <div className="relative">
                <User className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
                <input
                  type="text"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="Ex : Karim Benali"
                  className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-[#1E2C42] bg-[#0E1624] text-xs font-medium text-white placeholder:text-slate-500 focus:outline-none focus:border-[#2563EB] focus:ring-1 focus:ring-[#2563EB]"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="block text-xs font-bold text-slate-200">
                  Email
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
                <label className="block text-xs font-bold text-slate-200">
                  Numéro de téléphone
                </label>
                <div className="relative">
                  <Phone className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="05 / 06 / 07..."
                    className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-[#1E2C42] bg-[#0E1624] text-xs font-medium text-white placeholder:text-slate-500 focus:outline-none focus:border-[#2563EB] focus:ring-1 focus:ring-[#2563EB]"
                  />
                </div>
              </div>
            </div>

            <div className="space-y-1">
              <label className="block text-xs font-bold text-slate-200">
                Mot de passe (minimum 6 caractères)
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  minLength={6}
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

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="block text-xs font-bold text-slate-200">
                  Wilaya de résidence
                </label>
                <div className="relative">
                  <MapPin className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
                  <select
                    value={wilayaCode}
                    onChange={(e) => setWilayaCode(Number(e.target.value))}
                    className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-[#1E2C42] bg-[#0E1624] text-xs font-medium text-white focus:outline-none focus:border-[#2563EB] focus:ring-1 focus:ring-[#2563EB]"
                  >
                    {WILAYAS.map((w) => (
                      <option key={w.code} value={w.code} className="bg-[#131D2E] text-white">
                        {String(w.code).padStart(2, '0')} - {w.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="space-y-1">
                <label className="block text-xs font-bold text-slate-200">
                  Rôle principal
                </label>
                <select
                  value={role}
                  onChange={(e) => setRole(e.target.value as any)}
                  className="w-full px-3 py-2.5 rounded-lg border border-[#1E2C42] bg-[#0E1624] text-xs font-medium text-white focus:outline-none focus:border-[#2563EB] focus:ring-1 focus:ring-[#2563EB]"
                >
                  <option value="both" className="bg-[#131D2E] text-white">Conducteur & Passager</option>
                  <option value="driver" className="bg-[#131D2E] text-white">Conducteur uniquement</option>
                  <option value="passenger" className="bg-[#131D2E] text-white">Passager uniquement</option>
                </select>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 px-4 rounded-xl bg-[#2563EB] hover:bg-[#1D4ED8] disabled:opacity-50 text-white font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg shadow-blue-600/30 transition-all active:scale-[0.99] mt-2"
            >
              {loading ? (
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  <span>Créer mon compte</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          <div className="pt-2 text-center border-t border-[#1E2C42]">
            <p className="text-xs text-slate-400">
              Vous avez déjà un compte ?{' '}
              <Link to="/login" className="font-bold text-[#60A5FA] hover:text-white underline ml-1">
                Se connecter
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
