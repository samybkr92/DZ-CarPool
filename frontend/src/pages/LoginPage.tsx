import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../context/AuthContext';
import {
  Lock,
  Mail,
  ShieldCheck,
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
    <div className="min-h-[88vh] flex items-stretch bg-[#FAF7F2]">
      {/* Left Column: Algerian Editorial Atmosphere (Desktop) */}
      <div className="hidden lg:flex lg:w-1/2 relative bg-[#16382C] text-[#FAF7F2] flex-col justify-between p-12 overflow-hidden text-left">
        <div className="absolute inset-0 z-0">
          <img
            src="https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&w=1600&q=80"
            alt="Autoroute en Algérie"
            className="w-full h-full object-cover object-center opacity-30 mix-blend-luminosity scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0F281F] via-[#16382C]/80 to-[#16382C]/60" />
        </div>

        {/* Top Brand Pill */}
        <div className="relative z-10 flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-[#FAF7F2] text-[#16382C] flex items-center justify-center shadow-fine font-serif font-bold italic text-lg">
            DZ
          </div>
          <div>
            <span className="text-xl font-bold tracking-tight text-[#FAF7F2]">
              DZ-CarPool
            </span>
            <p className="text-[11px] text-[#C4DBCD] font-medium">Plateforme Nationale de Mobilité</p>
          </div>
        </div>

        {/* Center Quote / Travel Manifesto */}
        <div className="relative z-10 space-y-6 max-w-lg">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-white/10 text-[#C4DBCD] border border-white/15">
            <ShieldCheck className="w-4 h-4 text-[#97C0A7]" />
            <span>Voyages Inter-Wilayas Certifiés</span>
          </div>

          <h2 className="text-3xl lg:text-4xl font-bold tracking-tight leading-tight">
            La route algérienne partagée en toute confiance.
          </h2>

          <p className="text-sm text-[#C4DBCD] leading-relaxed">
            Reliez Alger, Oran, Constantine, Sétif et le Sud dans le respect des règles : approbation manuelle par le conducteur, commission transparente de 15% et halte de repos obligatoire de 15 minutes sur les trajets de plus de 300 km.
          </p>

          <div className="grid grid-cols-3 gap-3 pt-4 border-t border-white/10 text-xs">
            <div className="space-y-1">
              <span className="font-extrabold text-[#FAF7F2] text-base">58</span>
              <p className="text-[11px] text-[#97C0A7] font-medium">Wilayas couvertes</p>
            </div>
            <div className="space-y-1">
              <span className="font-extrabold text-[#97C0A7] text-base">100%</span>
              <p className="text-[11px] text-[#C4DBCD] font-medium">Net conducteur</p>
            </div>
            <div className="space-y-1">
              <span className="font-extrabold text-[#FAF7F2] text-base">15 min</span>
              <p className="text-[11px] text-[#97C0A7] font-medium">Pause sécurité &gt;300km</p>
            </div>
          </div>
        </div>

        {/* Bottom Tag */}
        <div className="relative z-10 text-xs text-[#97C0A7]">
          Projet d'Ingénierie Logicielle GL 2025/2026 • Algérie
        </div>
      </div>

      {/* Right Column: Clean, Elegant Auth Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 sm:p-12">
        <div className="max-w-md w-full space-y-7">
          {/* Form Header */}
          <div className="space-y-2 text-left">
            <div className="lg:hidden w-10 h-10 rounded-lg bg-[#16382C] text-[#FAF7F2] flex items-center justify-center mb-3 font-serif font-bold italic text-base">
              DZ
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold text-[#141716] tracking-tight">
              Bon retour parmi nous
            </h1>
            <p className="text-xs sm:text-sm text-[#5A625D]">
              Connectez-vous pour gérer vos trajets ou vos réservations en cours.
            </p>
          </div>

          {/* Quick Demo Access - Single Click Test Credentials */}
          <div className="bg-[#E2EDE6] border border-[#C4DBCD] rounded-xl p-4 space-y-3 text-left">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold uppercase tracking-wider text-[#16382C] flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-[#16382C]" />
                Accès Démo Immédiat (1 Clic)
              </span>
              <span className="text-[10px] font-bold text-[#16382C] bg-white px-2 py-0.5 rounded border border-[#C4DBCD]">
                Sans saisie
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              <button
                type="button"
                onClick={handleQuickDriver}
                disabled={loading}
                className="py-2.5 px-3 rounded-lg bg-white hover:bg-[#FAF7F2] border border-[#C4DBCD] text-left transition-all shadow-fine group"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-[#141716]">Amine Benali</span>
                  <span className="text-[10px] font-bold text-[#16382C] bg-[#E2EDE6] px-1.5 py-0.5 rounded">
                    Conducteur
                  </span>
                </div>
                <p className="text-[10px] text-[#7E8681] mt-0.5">Alger → Oran (Golf 8)</p>
              </button>

              <button
                type="button"
                onClick={handleQuickPassenger}
                disabled={loading}
                className="py-2.5 px-3 rounded-lg bg-white hover:bg-[#FAF7F2] border border-[#C4DBCD] text-left transition-all shadow-fine group"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-[#141716]">Amina Mansouri</span>
                  <span className="text-[10px] font-bold text-[#A14114] bg-[#F8ECE3] px-1.5 py-0.5 rounded">
                    Passagère
                  </span>
                </div>
                <p className="text-[10px] text-[#7E8681] mt-0.5">Réservations actives</p>
              </button>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4 text-left">
            {error && (
              <div className="p-3 bg-[#FCF7F3] border border-[#F0D5C3] rounded-lg text-xs text-[#A14114] font-medium">
                {error}
              </div>
            )}

            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-[#303632]">
                Adresse email
              </label>
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

            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="block text-xs font-bold text-[#303632]">
                  Mot de passe
                </label>
                <span className="text-[11px] text-[#7E8681]">Test: password123</span>
              </div>
              <div className="relative">
                <Lock className="w-4 h-4 text-[#7E8681] absolute left-3 top-3" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full rounded-xl border border-[#EAE5DC] bg-white py-2.5 pl-9 pr-10 text-xs font-medium text-[#141716] focus:outline-none focus:border-[#16382C]"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-2.5 text-[#7E8681] hover:text-[#141716]"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 px-4 rounded-xl bg-[#16382C] hover:bg-[#0F281F] text-[#FAF7F2] font-bold text-xs shadow-fine active:scale-[0.98] transition-all flex items-center justify-center gap-2"
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

          {/* Footer Register Link */}
          <div className="pt-4 border-t border-[#EAE5DC] text-center text-xs text-[#5A625D]">
            <span>Nouveau sur DZ-CarPool ? </span>
            <Link to="/register" className="font-bold text-[#16382C] hover:underline">
              Créer un compte membre
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
