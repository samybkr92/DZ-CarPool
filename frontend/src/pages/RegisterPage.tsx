import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../context/AuthContext';
import { Lock, Mail, User, Phone, MapPin, Car, AlertCircle, ShieldCheck } from 'lucide-react';

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
  const [wilayaName, setWilayaName] = useState<string>('Alger');

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      await register({
        full_name: fullName,
        email,
        phone_number: phone,
        password,
        role,
        wilaya_code: wilayaCode,
        wilaya_name: wilayaName,
      });
      navigate('/dashboard/driver');
    } catch (err: any) {
      setError(err.message || "Échec de l'inscription");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center px-4 py-12">
      <div className="max-w-md w-full bg-white rounded-2xl border border-slate-200 p-8 shadow-md space-y-6">
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-xl bg-emerald-700 text-white flex items-center justify-center mx-auto shadow-sm">
            <Car className="w-6 h-6 text-white" />
          </div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">
            Rejoindre DZ-CarPool
          </h1>
          <p className="text-xs text-slate-500">
            Créez votre profil vérifié pour voyager ou proposer des places à travers l'Algérie.
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
            <label className="block text-xs font-bold text-slate-700">Nom et prénom complets</label>
            <div className="relative">
              <User className="w-4 h-4 text-slate-400 absolute left-3 top-3.5" />
              <input
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="Ex: Amine Benali"
                required
                className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-xs font-semibold text-slate-900 focus:bg-white focus:outline-none focus:border-emerald-600 transition-colors"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="block text-xs font-bold text-slate-700">Adresse email</label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-3.5" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="amine.benali@dz-carpool.dz"
                required
                className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-xs font-semibold text-slate-900 focus:bg-white focus:outline-none focus:border-emerald-600 transition-colors"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="block text-xs font-bold text-slate-700">Numéro mobile algérien</label>
            <div className="relative">
              <Phone className="w-4 h-4 text-slate-400 absolute left-3 top-3.5" />
              <input
                type="text"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="0550123456"
                required
                className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-xs font-semibold text-slate-900 focus:bg-white focus:outline-none focus:border-emerald-600 transition-colors"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="block text-xs font-bold text-slate-700">Mot de passe</label>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-3.5" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Minimum 6 caractères"
                required
                minLength={6}
                className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-xs font-semibold text-slate-900 focus:bg-white focus:outline-none focus:border-emerald-600 transition-colors"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="block text-xs font-bold text-slate-700">Rôle principal</label>
              <select
                value={role}
                onChange={(e: any) => setRole(e.target.value)}
                className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2.5 px-3 text-xs font-semibold text-slate-900 focus:bg-white focus:outline-none focus:border-emerald-600"
              >
                <option value="both">Conducteur & Passager</option>
                <option value="driver">Conducteur</option>
                <option value="passenger">Passager</option>
              </select>
            </div>

            <div className="space-y-1">
              <label className="block text-xs font-bold text-slate-700">Wilaya de résidence</label>
              <select
                value={wilayaCode}
                onChange={(e) => {
                  const code = parseInt(e.target.value, 10);
                  setWilayaCode(code);
                  if (code === 16) setWilayaName('Alger');
                  else if (code === 31) setWilayaName('Oran');
                  else if (code === 25) setWilayaName('Constantine');
                  else if (code === 19) setWilayaName('Sétif');
                  else setWilayaName(`Wilaya ${code}`);
                }}
                className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2.5 px-3 text-xs font-semibold text-slate-900 focus:bg-white focus:outline-none focus:border-emerald-600"
              >
                <option value={16}>16 - Alger</option>
                <option value={31}>31 - Oran</option>
                <option value={25}>25 - Constantine</option>
                <option value={19}>19 - Sétif</option>
                <option value={9}>09 - Blida</option>
                <option value={23}>23 - Annaba</option>
                <option value={13}>13 - Tlemcen</option>
                <option value={5}>05 - Batna</option>
              </select>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 px-4 bg-emerald-700 hover:bg-emerald-800 disabled:bg-slate-200 disabled:text-slate-400 text-white font-bold text-xs rounded-xl shadow-xs hover:shadow-md transition-all active:scale-[0.99]"
          >
            {loading ? 'Création en cours...' : 'Créer mon profil'}
          </button>
        </form>

        <div className="text-center text-xs text-slate-500 pt-3 border-t border-slate-100">
          Déjà inscrit sur DZ-CarPool ?{' '}
          <Link to="/login" className="font-bold text-emerald-700 hover:underline">
            Se connecter
          </Link>
        </div>
      </div>
    </div>
  );
};