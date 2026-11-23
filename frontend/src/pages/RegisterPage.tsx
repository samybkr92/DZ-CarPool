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
    <div className="min-h-[85vh] flex items-center justify-center py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl w-full grid grid-cols-1 lg:grid-cols-12 bg-white rounded-2xl border border-[#E6E0D6] shadow-elevated overflow-hidden">
        {/* Left Editorial Visual Panel (Desktop) */}
        <div className="hidden lg:flex lg:col-span-5 relative bg-[#0A1C14] text-white p-10 flex-col justify-between">
          <img
            src="https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1000&q=85"
            alt="Voyage en Algérie"
            className="absolute inset-0 w-full h-full object-cover opacity-40 mix-blend-luminosity"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0A1C14] via-[#0A1C14]/80 to-transparent" />

          <div className="relative z-10 space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-[#173C2C] border border-[#2D6A4F] text-[11px] font-bold text-[#8FBFA9] uppercase tracking-wider">
              <span>Communauté Certifiée</span>
            </div>
            <h2 className="text-3xl font-serif font-bold text-white leading-tight">
              Prenez la route, <br />
              <span className="text-[#8FBFA9] italic">partagez vos trajets.</span>
            </h2>
          </div>

          <div className="relative z-10 space-y-4 pt-8 border-t border-[#1E4D38]">
            <p className="text-xs text-stone-300 leading-relaxed italic font-serif">
              "Rejoignez des milliers d'Algériens qui voyagent chaque jour entre wilayas en toute confiance."
            </p>

            <div className="space-y-2 text-xs">
              <div className="flex items-center gap-2 text-stone-200">
                <CheckCircle2 className="w-4 h-4 text-[#8FBFA9]" />
                <span>Profils et véhicules validés</span>
              </div>
              <div className="flex items-center gap-2 text-stone-200">
                <CheckCircle2 className="w-4 h-4 text-[#8FBFA9]" />
                <span>Simulateur carburant Naftal intégré</span>
              </div>
              <div className="flex items-center gap-2 text-stone-200">
                <CheckCircle2 className="w-4 h-4 text-[#8FBFA9]" />
                <span>Messagerie chiffrée entre membres</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Registration Form */}
        <div className="lg:col-span-7 p-8 sm:p-12 space-y-6 text-left">
          {/* Header */}
          <div className="space-y-1">
            <h1 className="text-2xl sm:text-3xl font-serif font-bold text-[#141613] tracking-tight">
              Créer votre compte
            </h1>
            <p className="text-xs sm:text-sm text-[#5C6057]">
              Rejoignez le réseau national de covoiturage inter-wilayas.
            </p>
          </div>

          {/* Active Session Notice */}
          {user && (
            <div className="p-4 rounded-xl bg-[#E1EDE6] border border-[#C2DBCF] space-y-2 text-xs">
              <div className="flex items-center justify-between">
                <span className="text-[#5C6057]">Session active :</span>
                <span className="font-bold text-[#173C2C]">{user.full_name}</span>
              </div>
              <div className="flex gap-2 pt-1">
                <button
                  type="button"
                  onClick={() => navigate(user.role === 'passenger' ? '/dashboard/passenger' : '/dashboard/driver')}
                  className="flex-1 py-2 px-3 rounded-lg bg-[#173C2C] hover:bg-[#112E22] text-white font-bold transition-colors"
                >
                  Aller au tableau de bord
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

          {error && (
            <div className="p-3 bg-rose-50 border border-rose-200 text-rose-800 rounded-lg text-xs font-semibold flex items-center gap-2">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Role selector pill */}
            <div className="space-y-1">
              <label className="block text-xs font-bold text-[#32362F]">Votre profil de voyageur</label>
              <div className="grid grid-cols-3 gap-1 p-1 bg-[#FAF8F5] border border-[#E6E0D6] rounded-lg">
                <button
                  type="button"
                  onClick={() => setRole('both')}
                  className={`py-1.5 text-xs font-bold rounded-md transition-all ${
                    role === 'both' ? 'bg-white text-[#173C2C] shadow-subtle' : 'text-[#5C6057]'
                  }`}
                >
                  Les deux
                </button>
                <button
                  type="button"
                  onClick={() => setRole('driver')}
                  className={`py-1.5 text-xs font-bold rounded-md transition-all ${
                    role === 'driver' ? 'bg-white text-[#173C2C] shadow-subtle' : 'text-[#5C6057]'
                  }`}
                >
                  Conducteur
                </button>
                <button
                  type="button"
                  onClick={() => setRole('passenger')}
                  className={`py-1.5 text-xs font-bold rounded-md transition-all ${
                    role === 'passenger' ? 'bg-white text-[#173C2C] shadow-subtle' : 'text-[#5C6057]'
                  }`}
                >
                  Passager
                </button>
              </div>
            </div>

            {/* Full Name */}
            <div className="space-y-1">
              <label className="block text-xs font-bold text-[#141613]">Nom et prénom</label>
              <div className="relative">
                <User className="w-4 h-4 text-[#8E9389] absolute left-3.5 top-3" />
                <input
                  type="text"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="Ex. Karim Benali"
                  className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-[#E6E0D6] bg-[#FAF8F5] text-xs font-medium text-[#141613] focus:bg-white focus:outline-none focus:border-[#173C2C]"
                />
              </div>
            </div>

            {/* Email & Phone */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="block text-xs font-bold text-[#141613]">Adresse email</label>
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
                <label className="block text-xs font-bold text-[#141613]">Téléphone</label>
                <div className="relative">
                  <Phone className="w-4 h-4 text-[#8E9389] absolute left-3.5 top-3" />
                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="0550123456"
                    className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-[#E6E0D6] bg-[#FAF8F5] text-xs font-medium text-[#141613] focus:bg-white focus:outline-none focus:border-[#173C2C]"
                  />
                </div>
              </div>
            </div>

            {/* Wilaya of residence */}
            <div className="space-y-1">
              <label className="block text-xs font-bold text-[#141613]">Wilaya de résidence</label>
              <div className="relative">
                <MapPin className="w-4 h-4 text-[#8E9389] absolute left-3.5 top-3" />
                <select
                  value={wilayaCode}
                  onChange={(e) => setWilayaCode(Number(e.target.value))}
                  className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-[#E6E0D6] bg-[#FAF8F5] text-xs font-medium text-[#141613] focus:bg-white focus:outline-none focus:border-[#173C2C] cursor-pointer"
                >
                  {WILAYAS.map((w) => (
                    <option key={w.code} value={w.code}>
                      {w.code_str} - {w.name} ({w.name_ar})
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Password */}
            <div className="space-y-1">
              <label className="block text-xs font-bold text-[#141613]">Mot de passe</label>
              <div className="relative">
                <Lock className="w-4 h-4 text-[#8E9389] absolute left-3.5 top-3" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Minimum 6 caractères"
                  className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-[#E6E0D6] bg-[#FAF8F5] text-xs font-medium text-[#141613] focus:bg-white focus:outline-none focus:border-[#173C2C]"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-lg bg-[#173C2C] hover:bg-[#112E22] text-white font-bold text-xs shadow-sm transition-all flex items-center justify-center gap-2 active:scale-[0.99] disabled:opacity-50"
            >
              <span>{loading ? 'Création en cours...' : 'Créer mon compte'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          <div className="text-center pt-2">
            <p className="text-xs text-[#5C6057]">
              Déjà un compte ?{' '}
              <Link to="/login" className="font-bold text-[#173C2C] hover:underline">
                Se connecter
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
