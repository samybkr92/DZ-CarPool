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
  UserCheck,
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
    <header className="sticky top-0 z-50 bg-[#0B0F17]/95 backdrop-blur-md border-b border-[#1E2C42] transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20">
          {/* Brand Logo */}
          <Link
            to="/"
            className="flex items-center gap-3 group focus:outline-none rounded-lg p-1"
          >
            <div className="w-10 h-10 rounded-xl bg-[#2563EB] text-white flex items-center justify-center shadow-lg shadow-blue-600/30 group-hover:bg-[#1D4ED8] transition-colors">
              <Car className="w-5 h-5 text-white" />
            </div>
            <div className="flex flex-col text-left">
              <div className="flex items-center gap-2">
                <span className="text-lg sm:text-xl font-black tracking-tight text-white group-hover:text-[#60A5FA] transition-colors">
                  DZ-CarPool
                </span>
                <span className="hidden sm:inline-flex px-2 py-0.5 text-[10px] font-bold tracking-wider uppercase text-[#60A5FA] bg-[#172554] rounded-md border border-[#2563EB]/40">
                  Algérie
                </span>
              </div>
              <p className="text-[11px] text-slate-400 font-medium hidden sm:block -mt-0.5">
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
                  className={`flex items-center gap-2 px-3.5 py-2 text-xs font-semibold rounded-lg transition-all ${
                    isActive
                      ? 'bg-[#1E293B] text-[#60A5FA] border border-[#2563EB]/40 font-bold'
                      : 'text-slate-300 hover:text-white hover:bg-[#131D2E]'
                  }`}
                >
                  <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-[#60A5FA]' : 'text-slate-400'}`} />
                  <span>{link.label}</span>
                </Link>
              );
            })}
          </nav>

          {/* Right Controls: Publish CTA, Language & User Profile */}
          <div className="flex items-center gap-2.5 sm:gap-3">
            {/* Direct Driver Publish CTA */}
            <Link
              to="/trips/create"
              className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-bold rounded-lg bg-[#2563EB] text-white hover:bg-[#1D4ED8] transition-all shadow-md shadow-blue-600/30 active:scale-[0.98]"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>{t('nav.publish', 'Publier un trajet')}</span>
            </Link>

            {/* Language Switcher Pill */}
            <button
              onClick={toggleLanguage}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg border border-[#1E2C42] bg-[#131D2E] text-slate-200 hover:border-[#2563EB] hover:text-[#60A5FA] transition-all focus:outline-none"
              title="Changer de langue / تغيير اللغة"
              aria-label="Changer de langue"
            >
              <Globe className="w-3.5 h-3.5 text-[#3B82F6]" />
              <span className="tracking-wide font-medium">{isRtl ? 'Français' : 'العربية'}</span>
            </button>

            {/* Desktop Auth State */}
            {user ? (
              <div className="relative">
                <button
                  onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                  className="flex items-center gap-2 py-1.5 px-3 rounded-lg bg-[#131D2E] border border-[#1E2C42] hover:border-[#2563EB] transition-all focus:outline-none text-left"
                >
                  <img
                    src={user.avatar_url || `https://api.dicebear.com/7.x/initials/svg?seed=${user.full_name}`}
                    alt={user.full_name}
                    className="w-6 h-6 rounded-full object-cover border border-[#2563EB]/40"
                  />
                  <div className="text-left hidden sm:block">
                    <span className="text-xs font-bold text-white block leading-tight">
                      {user.full_name.split(' ')[0]}
                    </span>
                  </div>
                  <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
                </button>

                {/* Dropdown Menu */}
                {userDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-56 rounded-xl bg-[#131D2E] border border-[#1E2C42] shadow-2xl py-2 z-50 text-left">
                    <div className="px-4 py-2.5 border-b border-[#1E2C42]">
                      <span className="text-xs font-bold text-white block">{user.full_name}</span>
                      <span className="text-[11px] text-slate-400 block truncate">{user.email}</span>
                      <span className="inline-block mt-1 px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider text-[#60A5FA] bg-[#172554] rounded border border-[#2563EB]/40">
                        {user.role === 'driver' ? 'Conducteur' : user.role === 'passenger' ? 'Passager' : 'Conducteur & Passager'}
                      </span>
                    </div>

                    <Link
                      to="/dashboard/driver"
                      onClick={() => setUserDropdownOpen(false)}
                      className="flex items-center gap-2.5 px-4 py-2 text-xs font-semibold text-slate-300 hover:bg-[#18253A] hover:text-[#60A5FA] transition-colors"
                    >
                      <Car className="w-3.5 h-3.5 text-[#3B82F6]" />
                      <span>Espace Conducteur</span>
                    </Link>

                    <Link
                      to="/dashboard/passenger"
                      onClick={() => setUserDropdownOpen(false)}
                      className="flex items-center gap-2.5 px-4 py-2 text-xs font-semibold text-slate-300 hover:bg-[#18253A] hover:text-[#60A5FA] transition-colors"
                    >
                      <CalendarCheck className="w-3.5 h-3.5 text-[#3B82F6]" />
                      <span>Mes Réservations</span>
                    </Link>

                    <div className="my-1 border-t border-[#1E2C42]" />

                    <button
                      type="button"
                      onClick={handleLogout}
                      className="w-full flex items-center gap-2.5 px-4 py-2 text-xs font-semibold text-rose-400 hover:bg-rose-950/30 transition-colors text-left"
                    >
                      <LogOut className="w-3.5 h-3.5 text-rose-400" />
                      <span>Déconnexion</span>
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link
                  to="/login"
                  className="px-3 py-1.5 text-xs font-bold text-slate-200 hover:text-white rounded-lg border border-[#1E2C42] bg-[#131D2E] hover:border-[#2563EB] transition-all"
                >
                  Connexion
                </Link>
                <Link
                  to="/register"
                  className="hidden sm:inline-flex px-3 py-1.5 text-xs font-bold text-white rounded-lg bg-[#2563EB] hover:bg-[#1D4ED8] shadow-md shadow-blue-600/30 transition-all"
                >
                  Inscription
                </Link>
              </div>
            )}

            {/* Mobile Hamburger Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 rounded-lg border border-[#1E2C42] bg-[#131D2E] text-slate-300 hover:text-white focus:outline-none"
              aria-label="Menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Slide-down Drawer */}
        {mobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-[#1E2C42] space-y-2 bg-[#0B0F17] text-left">
            {navLinks.map((link) => {
              const Icon = link.icon;
              const isActive = location.pathname === link.to;
              return (
                <Link
                  key={link.to}
                  to={link.to}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-semibold transition-colors ${
                    isActive
                      ? 'bg-[#1E293B] text-[#60A5FA] font-bold'
                      : 'text-slate-300 hover:bg-[#131D2E] hover:text-white'
                  }`}
                >
                  <Icon className="w-4 h-4 text-[#3B82F6]" />
                  <span>{link.label}</span>
                </Link>
              );
            })}

            {!user && (
              <div className="pt-3 border-t border-[#1E2C42] flex flex-col gap-2">
                <Link
                  to="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full py-2.5 text-center text-xs font-bold text-white rounded-lg bg-[#131D2E] border border-[#1E2C42]"
                >
                  Connexion
                </Link>
                <Link
                  to="/register"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full py-2.5 text-center text-xs font-bold text-white rounded-lg bg-[#2563EB]"
                >
                  Inscription
                </Link>
              </div>
            )}
          </div>
        )}
      </div>
    </header>
  );
};
