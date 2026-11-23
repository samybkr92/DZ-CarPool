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
  ShieldCheck,
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
    <div className="min-h-[90vh] flex items-stretch bg-[#FAF7F2]">
      {/* Left Column: Visual Algerian Context */}
      <div className="hidden lg:flex lg:w-1/2 relative bg-[#16382C] text-[#FAF7F2] flex-col justify-between p-12 overflow-hidden text-left">
        <div className="absolute inset-0 z-0">
          <img
            src="https://images.unsplash.com/photo-1506015391300-4802dc74de2e?auto=format&fit=crop&w=1600&q=80"
            alt="Ponts de Constantine Algérie"
            className="w-full h-full object-cover object-center opacity-30 mix-blend-luminosity scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0F281F] via-[#16382C]/80 to-[#16382C]/60" />
        </div>

        <div className="relative z-10 flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-[#FAF7F2] text-[#16382C] flex items-center justify-center shadow-fine font-serif font-bold italic text-lg">
            DZ
          </div>
          <div>
            <span className="text-xl font-bold tracking-tight text-[#FAF7F2]">
              DZ-CarPool
            </span>
            <p className="text-[11px] text-[#C4DBCD] font-medium">Inscription Membre Officiel</p>
          </div>
        </div>

        <div className="relative z-10 space-y-5 max-w-lg">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-white/10 text-[#C4DBCD] border border-white/15">
            <ShieldCheck className="w-4 h-4 text-[#97C0A7]" />
            <span>Communauté Algérienne Vérifiée</span>
          </div>

          <h2 className="text-3xl lg:text-4xl font-bold tracking-tight leading-tight">
            Partagez vos trajets, réduisez vos dépenses de carburant.
          </h2>

          <p className="text-sm text-[#C4DBCD] leading-relaxed">
            Créez votre profil en 1 minute. Vous pourrez publier des trajets entre wilayas, réserver des sièges en toute sécurité et communiquer directement avec les conducteurs via la messagerie intégrée.
          </p>

          <div className="space-y-2.5 pt-2 text-xs text-[#C4DBCD]">
            <div className="flex items-center gap-2.5">
              <span className="w-4 h-4 rounded-full bg-[#E2EDE6] text-[#16382C] flex items-center justify-center font-bold text-[10px]">✓</span>
              <span>Profils et avis authentiques avec historique complet</span>
            </div>
            <div className="flex items-center gap-2.5">
              <span className="w-4 h-4 rounded-full bg-[#E2EDE6] text-[#16382C] flex items-center justify-center font-bold text-[10px]">✓</span>
              <span>Barème officiel carburants Naftal calculé automatiquement</span>
            </div>
            <div className="flex items-center gap-2.5">
              <span className="w-4 h-4 rounded-full bg-[#E2EDE6] text-[#16382C] flex items-center justify-center font-bold text-[10px]">✓</span>
              <span>Pause détente de 15 minutes garantie sur trajets &gt; 300 km</span>
            </div>
          </div>
        </div>

        <div className="relative z-10 text-xs text-[#97C0A7]">
          Rejoignez des milliers de voyageurs à travers les 58 wilayas d'Algérie.
        </div>
      </div>

      {/* Right Column: Registration Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 sm:p-12">
        <div className="max-w-md w-full space-y-6">
          <div className="space-y-1.5 text-left">
            <h1 className="text-2xl sm:text-3xl font-bold text-[#141716] tracking-tight">
              Créer un compte
            </h1>
            <p className="text-xs sm:text-sm text-[#5A625D]">
              Renseignez vos coordonnées pour accéder aux trajets et réservations.
            </p>
          </div>

          {/* Active Session Notification if already logged in */}
          {user && (
            <div className="p-4 rounded-xl bg-white border border-[#EAE5DC] shadow-xs space-y-2 text-left">
              <div className="flex items-center justify-between text-xs">
                <span className="text-[#5A625D]">Actuellement connecté :</span>
                <span className="font-bold text-[#16382C]">{user.full_name}</span>
              </div>
              <div className="flex gap-2 pt-1">
                <button
                  type="button"
                  onClick={() => navigate(user.role === 'passenger' ? '/dashboard/passenger' : '/dashboard/driver')}
                  className="flex-1 py-2 px-3 rounded-lg bg-[#16382C] hover:bg-[#0F281F] text-[#FAF7F2] text-xs font-bold transition-colors"
                >
                  Aller au tableau de bord
                </button>
                <button
                  type="button"
                  onClick={logout}
                  className="py-2 px-3 rounded-lg border border-[#EAE5DC] bg-[#FAF7F2] hover:bg-[#FCF7F3] text-[#A14114] text-xs font-bold transition-colors"
                >
                  Déconnexion
                </button>
              </div>
            </div>
          )}

          {error && (
            <div className="p-3 bg-[#FCF7F3] text-[#A14114] rounded-lg border border-[#F0D5C3] text-xs font-semibold flex items-center gap-2">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4 text-left">
            {/* Role selector pill */}
            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-[#303632]">Votre rôle principal</label>
              <div className="grid grid-cols-3 gap-1.5 p-1 bg-[#F4EFE6] rounded-xl border border-[#EAE5DC]">
                <button
                  type="button"
                  onClick={() => setRole('both')}
                  className={`py-2 text-xs font-bold rounded-lg transition-all ${
                    role === 'both' ? 'bg-white text-[#16382C] shadow-fine' : 'text-[#5A625D] hover:text-[#141716]'
                  }`}
                >
                  Les deux
                </button>
                <button
                  type="button"
                  onClick={() => setRole('driver')}
                  className={`py-2 text-xs font-bold rounded-lg transition-all ${
                    role === 'driver' ? 'bg-white text-[#16382C] shadow-fine' : 'text-[#5A625D] hover:text-[#141716]'
                  }`}
                >
                  Conducteur
                </button>
                <button
                  type="button"
                  onClick={() => setRole('passenger')}
                  className={`py-2 text-xs font-bold rounded-lg transition-all ${
                    role === 'passenger' ? 'bg-white text-[#16382C] shadow-fine' : 'text-[#5A625D] hover:text-[#141716]'
                  }`}
                >
                  Passager
                </button>
              </div>
            </div>

            {/* Name */}
            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-[#303632]">Nom et prénom</label>
              <div className="relative">
                <User className="w-4 h-4 text-[#7E8681] absolute left-3 top-3" />
                <input
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="Ex: Karim Ferhani"
                  className="w-full rounded-xl border border-[#EAE5DC] bg-white py-2.5 pl-9 pr-3 text-xs font-medium text-[#141716] focus:outline-none focus:border-[#16382C]"
                  required
                />
              </div>
            </div>

            {/* Email */}
            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-[#303632]">Adresse email</label>
              <div className="relative">
                <Mail className="w-4 h-4 text-[#7E8681] absolute left-3 top-3" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="nom@exemple.dz"
                  className="w-full rounded-xl border border-[#EAE5DC] bg-white py-2.5 pl-9 pr-3 text-xs font-medium text-[#141716] focus:outline-none focus:border-[#16382C]"
                  required
                />
              </div>
            </div>

            {/* Phone & Wilaya grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-[#303632]">Numéro de téléphone</label>
                <div className="relative">
                  <Phone className="w-4 h-4 text-[#7E8681] absolute left-3 top-3" />
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="0550123456"
                    className="w-full rounded-xl border border-[#EAE5DC] bg-white py-2.5 pl-9 pr-3 text-xs font-medium text-[#141716] focus:outline-none focus:border-[#16382C]"
                    required
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-[#303632]">Wilaya de résidence</label>
                <select
                  value={wilayaCode}
                  onChange={(e) => setWilayaCode(Number(e.target.value))}
                  className="w-full rounded-xl border border-[#EAE5DC] bg-white py-2.5 px-3 text-xs font-medium text-[#141716] focus:outline-none focus:border-[#16382C] cursor-pointer"
                >
                  {WILAYAS.map((w) => (
                    <option key={w.code} value={w.code}>
                      {w.code_str} - {w.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Password */}
            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-[#303632]">Mot de passe</label>
              <div className="relative">
                <Lock className="w-4 h-4 text-[#7E8681] absolute left-3 top-3" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Minimum 6 caractères"
                  minLength={6}
                  className="w-full rounded-xl border border-[#EAE5DC] bg-white py-2.5 pl-9 pr-3 text-xs font-medium text-[#141716] focus:outline-none focus:border-[#16382C]"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 px-4 rounded-xl bg-[#16382C] hover:bg-[#0F281F] text-[#FAF7F2] font-bold text-xs shadow-fine active:scale-[0.98] transition-all flex items-center justify-center gap-2"
            >
              {loading ? (
                <span>Création de votre compte...</span>
              ) : (
                <>
                  <span>Créer mon compte membre</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </>
              )}
            </button>
          </form>

          <div className="pt-4 border-t border-[#EAE5DC] text-center text-xs text-[#5A625D]">
            <span>Vous avez déjà un compte ? </span>
            <Link to="/login" className="font-bold text-[#16382C] hover:underline">
              Se connecter
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
