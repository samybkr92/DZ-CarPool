import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../context/AuthContext';
import {
  Compass,
  Plus,
  Car,
  CalendarCheck,
  Globe,
  LogOut,
  Menu,
  X,
  ChevronDown,
} from 'lucide-react';

export const Navbar: React.FC = () => {
  const { t, i18n } = useTranslation();
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);

  const toggleLanguage = () => {
    const nextLang = i18n.language.startsWith('ar') ? 'fr' : 'ar';
    i18n.changeLanguage(nextLang);
  };

  const handleLogout = () => {
    logout();
    setUserDropdownOpen(false);
    setMobileMenuOpen(false);
    navigate('/');
  };

  const isRtl = i18n.language.startsWith('ar');

  const navLinks = [
    { to: '/search', label: t('nav.search', 'Rechercher un trajet'), icon: Compass },
    ...(user
      ? [
          { to: '/dashboard/driver', label: t('nav.driver_dashboard', 'Espace Conducteur'), icon: Car },
          { to: '/dashboard/passenger', label: t('nav.passenger_dashboard', 'Mes Réservations'), icon: CalendarCheck },
        ]
      : []),
  ];

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-slate-200/90 transition-all shadow-soft-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20">
          {/* Brand Logo */}
          <Link
            to="/"
            className="flex items-center gap-3 group focus:outline-none rounded-lg p-1"
          >
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-brand-600 text-white flex items-center justify-center shadow-soft-sm group-hover:bg-brand-700 transition-colors">
              <Car className="w-5 h-5 text-white" />
            </div>
            <div className="flex flex-col text-left">
              <div className="flex items-center gap-2">
                <span className="text-lg sm:text-xl font-black tracking-tight text-slate-900 group-hover:text-brand-600 transition-colors">
                  DZ-CarPool
                </span>
                <span className="hidden sm:inline-flex px-1.5 py-0.5 text-[10px] font-bold tracking-wider uppercase text-brand-700 bg-brand-50 rounded-full border border-brand-200">
                  Algérie
                </span>
              </div>
              <p className="text-[11px] text-slate-500 font-medium hidden sm:block -mt-0.5">
                {t('brand.slogan', 'Covoiturage inter-wilayas')}
              </p>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-1.5">
            {navLinks.map((link) => {
              const Icon = link.icon;
              const isActive = location.pathname === link.to;
              return (
                <Link
                  key={link.to}
                  to={link.to}
                  className={`flex items-center gap-2 px-4 py-2 text-xs font-semibold rounded-full transition-all ${
                    isActive
                      ? 'bg-slate-100 text-brand-700 font-bold'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                  }`}
                >
                  <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-brand-600' : 'text-slate-400'}`} />
                  <span>{link.label}</span>
                </Link>
              );
            })}
          </nav>

          {/* Right Controls: Publish CTA, Language & User Profile */}
          <div className="flex items-center gap-3">
            {/* Direct Driver Publish CTA */}
            <Link
              to="/trips/create"
              className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-bold rounded-full bg-brand-600 text-white hover:bg-brand-700 transition-all shadow-soft-sm active:scale-[0.98]"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>{t('nav.publish', 'Publier un trajet')}</span>
            </Link>

            {/* Language Switcher Pill */}
            <button
              onClick={toggleLanguage}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-full border border-slate-200 bg-slate-50 text-slate-700 hover:border-brand-600 hover:text-brand-600 shadow-soft-xs transition-all focus:outline-none"
              title="Changer de langue / تغيير اللغة"
              aria-label="Changer de langue"
            >
              <Globe className="w-3.5 h-3.5 text-brand-600" />
              <span className="tracking-wide font-medium">{isRtl ? 'Français' : 'العربية'}</span>
            </button>

            {/* Desktop Auth State */}
            {user ? (
              <div className="relative">
                <button
                  onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                  className="flex items-center gap-2 py-1.5 px-3 rounded-full bg-slate-50 border border-slate-200 hover:border-slate-300 shadow-soft-xs transition-all focus:outline-none"
                >
                  <img
                    src={user.avatar_url || `https://api.dicebear.com/7.x/initials/svg?seed=${user.full_name}`}
                    alt={user.full_name}
                    className="w-6 h-6 rounded-full object-cover border border-slate-200"
                  />
                  <div className="text-left hidden sm:block">
                    <span className="text-xs font-bold text-slate-800 block leading-tight">
                      {user.full_name.split(' ')[0]}
                    </span>
                  </div>
                  <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
                </button>

                {/* Dropdown Menu */}
                {userDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-56 rounded-2xl bg-white border border-slate-200 shadow-search py-2 z-50 animate-in fade-in slide-in-from-top-1 text-left">
                    <div className="px-4 py-2.5 border-b border-slate-100">
                      <span className="text-xs font-bold text-slate-900 block">{user.full_name}</span>
                      <span className="text-[11px] text-slate-500 block truncate">{user.email}</span>
                      <span className="inline-block mt-1 px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider text-brand-700 bg-brand-50 rounded-full">
                        {user.role === 'driver' ? 'Conducteur' : user.role === 'passenger' ? 'Passager' : 'Conducteur & Passager'}
                      </span>
                    </div>

                    <Link
                      to="/dashboard/driver"
                      onClick={() => setUserDropdownOpen(false)}
                      className="flex items-center gap-2.5 px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 hover:text-brand-600 transition-colors"
                    >
                      <Car className="w-3.5 h-3.5 text-brand-600" />
                      <span>Espace Conducteur</span>
                    </Link>

                    <Link
                      to="/dashboard/passenger"
                      onClick={() => setUserDropdownOpen(false)}
                      className="flex items-center gap-2.5 px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 hover:text-brand-600 transition-colors"
                    >
                      <CalendarCheck className="w-3.5 h-3.5 text-brand-600" />
                      <span>Mes Réservations</span>
                    </Link>

                    <div className="border-t border-slate-100 my-1" />

                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center gap-2 px-4 py-2 text-xs font-semibold text-rose-600 hover:bg-rose-50 text-left transition-colors"
                    >
                      <LogOut className="w-3.5 h-3.5" />
                      <span>Déconnexion</span>
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="hidden sm:flex items-center gap-2">
                <Link
                  to="/login"
                  className="px-3.5 py-2 text-xs font-bold text-slate-700 hover:text-brand-600 hover:bg-slate-100 rounded-full transition-colors"
                >
                  {t('nav.login', 'Connexion')}
                </Link>
                <Link
                  to="/register"
                  className="px-4 py-2 text-xs font-bold text-slate-900 bg-slate-100 hover:bg-slate-200 border border-slate-200 rounded-full shadow-soft-xs transition-all"
                >
                  {t('nav.register', "S'inscrire")}
                </Link>
              </div>
            )}

            {/* Mobile Hamburger Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-xl focus:outline-none"
              aria-label="Menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-slate-200 bg-white px-4 pt-3 pb-6 space-y-3 animate-in slide-in-from-top-2 text-left">
          <div className="space-y-1">
            {navLinks.map((link) => {
              const Icon = link.icon;
              const isActive = location.pathname === link.to;
              return (
                <Link
                  key={link.to}
                  to={link.to}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold ${
                    isActive
                      ? 'bg-brand-50 text-brand-700 font-bold'
                      : 'text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  <Icon className="w-4 h-4 text-brand-600" />
                  <span>{link.label}</span>
                </Link>
              );
            })}
          </div>

          <div className="pt-2 border-t border-slate-100 space-y-2">
            <Link
              to="/trips/create"
              onClick={() => setMobileMenuOpen(false)}
              className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-brand-600 text-white font-bold text-xs shadow-soft-sm"
            >
              <Plus className="w-4 h-4" />
              <span>Publier un trajet</span>
            </Link>

            {user ? (
              <button
                onClick={handleLogout}
                className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl border border-rose-200 bg-rose-50 text-rose-700 font-bold text-xs"
              >
                <LogOut className="w-4 h-4" />
                <span>Se déconnecter</span>
              </button>
            ) : (
              <div className="grid grid-cols-2 gap-2 pt-1">
                <Link
                  to="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="py-2.5 text-center text-xs font-bold text-slate-800 bg-slate-100 rounded-xl"
                >
                  Connexion
                </Link>
                <Link
                  to="/register"
                  onClick={() => setMobileMenuOpen(false)}
                  className="py-2.5 text-center text-xs font-bold text-slate-900 bg-slate-200 rounded-xl"
                >
                  S'inscrire
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
};