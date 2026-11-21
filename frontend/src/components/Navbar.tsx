import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../context/AuthContext';
import {
  Compass,
  PlusCircle,
  Car,
  CalendarCheck,
  Globe,
  LogOut,
  Menu,
  X,
  User as UserIcon,
  Shield,
} from 'lucide-react';

export const Navbar: React.FC = () => {
  const { t, i18n } = useTranslation();
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const toggleLanguage = () => {
    const nextLang = i18n.language.startsWith('ar') ? 'fr' : 'ar';
    i18n.changeLanguage(nextLang);
  };

  const handleLogout = () => {
    logout();
    setMobileMenuOpen(false);
    navigate('/');
  };

  const isRtl = i18n.language.startsWith('ar');

  const navLinks = [
    { to: '/search', label: t('nav.search'), icon: Compass },
    ...(user
      ? [
          { to: '/trips/create', label: t('nav.publish'), icon: PlusCircle },
          { to: '/dashboard/driver', label: t('nav.driver_dashboard'), icon: Car },
          { to: '/dashboard/passenger', label: t('nav.passenger_dashboard'), icon: CalendarCheck },
        ]
      : []),
  ];

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-slate-200/80 transition-all shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-18 sm:h-20">
          {/* Brand Logo & Editorial Wordmark */}
          <Link
            to="/"
            className="flex items-center gap-3 group focus:outline-none focus:ring-2 focus:ring-emerald-700/20 rounded-xl p-1"
          >
            <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-emerald-700 text-white flex items-center justify-center shadow-xs group-hover:bg-emerald-800 transition-colors">
              <Car className="w-5 h-5 text-white" strokeWidth={2.2} />
            </div>
            <div className="flex flex-col">
              <div className="flex items-center gap-1.5">
                <span className="text-xl sm:text-2xl font-black tracking-tight text-slate-900 group-hover:text-emerald-700 transition-colors">
                  DZ<span className="text-emerald-700">-CarPool</span>
                </span>
                <span className="hidden lg:inline-flex px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-wider bg-emerald-50 text-emerald-800 border border-emerald-200/60 rounded">
                  Algérie
                </span>
              </div>
              <p className="text-[11px] font-medium text-slate-500 hidden sm:block -mt-0.5">
                {t('brand.slogan', 'La route, partagée.')}
              </p>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-1 lg:gap-2">
            {navLinks.map((link) => {
              const Icon = link.icon;
              const isActive = location.pathname === link.to;
              return (
                <Link
                  key={link.to}
                  to={link.to}
                  className={`flex items-center gap-2 px-3.5 py-2 text-sm font-semibold rounded-lg transition-all ${
                    isActive
                      ? 'bg-emerald-50 text-emerald-800 border border-emerald-200 shadow-xs'
                      : 'text-slate-700 hover:text-slate-900 hover:bg-slate-100'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'text-emerald-700' : 'text-slate-500'}`} />
                  <span>{link.label}</span>
                </Link>
              );
            })}
          </nav>

          {/* Right Controls: Language & User Profile / Auth */}
          <div className="flex items-center gap-2.5 sm:gap-3">
            {/* Language Switcher Pill */}
            <button
              onClick={toggleLanguage}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold rounded-lg border border-slate-200 bg-white text-slate-700 hover:border-emerald-600 hover:text-emerald-700 hover:bg-emerald-50/50 shadow-xs transition-all focus:outline-none focus:ring-2 focus:ring-emerald-700/20"
              title="Changer de langue / تغيير اللغة"
              aria-label="Changer de langue"
            >
              <Globe className="w-3.5 h-3.5 text-emerald-700" />
              <span className="tracking-wide">{isRtl ? 'Français' : 'العربية'}</span>
            </button>

            {/* Desktop Auth State */}
            {user ? (
              <div className="hidden sm:flex items-center gap-2.5 pl-2 border-l border-slate-200">
                <div className="flex items-center gap-2 py-1 px-2.5 rounded-lg bg-white border border-slate-200 shadow-xs">
                  <img
                    src={user.avatar_url || `https://api.dicebear.com/7.x/initials/svg?seed=${user.full_name}`}
                    alt={user.full_name}
                    className="w-7 h-7 rounded-full object-cover border border-slate-200"
                  />
                  <div className="text-left">
                    <span className="text-xs font-bold text-slate-900 block leading-tight">
                      {user.full_name.split(' ')[0]}
                    </span>
                    <span className="text-[10px] text-slate-500 font-medium block leading-tight">
                      {user.wilaya_name || 'Algérie'}
                    </span>
                  </div>
                </div>

                <button
                  onClick={handleLogout}
                  className="p-2 text-slate-500 hover:text-rose-700 hover:bg-rose-50 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-rose-500/20"
                  title={t('nav.logout')}
                  aria-label={t('nav.logout')}
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <div className="hidden sm:flex items-center gap-2">
                <Link
                  to="/login"
                  className="px-3.5 py-2 text-xs font-bold text-slate-700 hover:text-emerald-700 hover:bg-slate-100 rounded-lg transition-colors"
                >
                  {t('nav.login')}
                </Link>
                <Link
                  to="/register"
                  className="px-4 py-2 text-xs font-bold text-white bg-emerald-700 hover:bg-emerald-800 rounded-lg shadow-xs hover:shadow-card transition-all"
                >
                  {t('nav.register')}
                </Link>
              </div>
            )}

            {/* Mobile Hamburger Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 text-slate-700 hover:text-emerald-700 hover:bg-slate-100 rounded-lg transition-colors focus:outline-none"
              aria-label="Ouvrir le menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-slate-200 bg-white px-4 pt-3 pb-6 space-y-3 animate-in fade-in slide-in-from-top-2 duration-150">
          <nav className="space-y-1">
            {navLinks.map((link) => {
              const Icon = link.icon;
              const isActive = location.pathname === link.to;
              return (
                <Link
                  key={link.to}
                  to={link.to}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`flex items-center gap-3 px-3.5 py-2.5 text-sm font-semibold rounded-lg ${
                    isActive
                      ? 'bg-emerald-50 text-emerald-800 font-bold border border-emerald-200'
                      : 'text-slate-700 hover:bg-slate-100'
                  }`}
                >
                  <Icon className="w-4 h-4 text-emerald-700" />
                  <span>{link.label}</span>
                </Link>
              );
            })}
          </nav>

          <div className="pt-3 border-t border-slate-200">
            {user ? (
              <div className="space-y-2">
                <div className="flex items-center gap-3 p-2 rounded-lg bg-slate-50 border border-slate-200">
                  <img
                    src={user.avatar_url || `https://api.dicebear.com/7.x/initials/svg?seed=${user.full_name}`}
                    alt={user.full_name}
                    className="w-8 h-8 rounded-full object-cover"
                  />
                  <div>
                    <span className="text-sm font-bold text-slate-900 block">{user.full_name}</span>
                    <span className="text-xs text-slate-500">{user.email}</span>
                  </div>
                </div>
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center justify-center gap-2 py-2 px-4 rounded-lg bg-rose-50 text-rose-700 font-bold text-xs hover:bg-rose-100 transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                  <span>{t('nav.logout')}</span>
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-2 pt-1">
                <Link
                  to="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-center py-2.5 px-4 text-xs font-bold text-slate-700 bg-white border border-slate-200 rounded-lg"
                >
                  {t('nav.login')}
                </Link>
                <Link
                  to="/register"
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-center py-2.5 px-4 text-xs font-bold text-white bg-emerald-700 rounded-lg shadow-xs"
                >
                  {t('nav.register')}
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
};
