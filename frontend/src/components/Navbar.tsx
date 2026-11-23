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
  User as UserIcon,
  ShieldCheck,
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
    { to: '/search', label: t('nav.search', 'Rechercher'), icon: Compass },
    ...(user
      ? [
          { to: '/dashboard/driver', label: t('nav.driver_dashboard', 'Espace Conducteur'), icon: Car },
          { to: '/dashboard/passenger', label: t('nav.passenger_dashboard', 'Mes Réservations'), icon: CalendarCheck },
        ]
      : []),
  ];

  return (
    <header className="sticky top-0 z-50 bg-[#FAF7F2]/95 backdrop-blur-md border-b border-[#EAE5DC] transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Brand Logo & Algerian Editorial Wordmark */}
          <Link
            to="/"
            className="flex items-center gap-3.5 group focus:outline-none rounded-lg p-1"
          >
            <div className="w-10 h-10 rounded-lg bg-[#16382C] text-[#FAF7F2] flex items-center justify-center shadow-fine group-hover:bg-[#0F281F] transition-colors">
              <span className="font-serif italic font-bold text-lg tracking-tight">DZ</span>
            </div>
            <div className="flex flex-col text-left">
              <div className="flex items-center gap-2">
                <span className="text-xl font-bold tracking-tight text-[#141716] group-hover:text-[#16382C] transition-colors">
                  DZ-CarPool
                </span>
                <span className="hidden sm:inline-flex px-1.5 py-0.5 text-[10px] font-semibold tracking-wider uppercase text-[#16382C] bg-[#E2EDE6] rounded border border-[#C4DBCD]">
                  Algérie
                </span>
              </div>
              <p className="text-[11px] text-[#5A625D] font-normal hidden sm:block -mt-0.5">
                {t('brand.slogan', 'Mobilité inter-wilayas')}
              </p>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => {
              const Icon = link.icon;
              const isActive = location.pathname === link.to;
              return (
                <Link
                  key={link.to}
                  to={link.to}
                  className={`flex items-center gap-2 px-3.5 py-2 text-xs font-semibold rounded-lg transition-all ${
                    isActive
                      ? 'bg-[#EAE5DC] text-[#141716] shadow-fine font-bold'
                      : 'text-[#5A625D] hover:text-[#141716] hover:bg-[#F4EFE6]'
                  }`}
                >
                  <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-[#16382C]' : 'text-[#7E8681]'}`} />
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
              className="hidden sm:inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold rounded-lg border border-[#16382C] text-[#16382C] hover:bg-[#16382C] hover:text-[#FAF7F2] transition-all shadow-fine active:scale-[0.98]"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>{t('nav.publish', 'Publier un trajet')}</span>
            </Link>

            {/* Language Switcher Pill */}
            <button
              onClick={toggleLanguage}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg border border-[#EAE5DC] bg-white text-[#434A46] hover:border-[#16382C] hover:text-[#16382C] shadow-fine transition-all focus:outline-none"
              title="Changer de langue / تغيير اللغة"
              aria-label="Changer de langue"
            >
              <Globe className="w-3.5 h-3.5 text-[#16382C]" />
              <span className="tracking-wide font-medium">{isRtl ? 'Français' : 'العربية'}</span>
            </button>

            {/* Desktop Auth State */}
            {user ? (
              <div className="relative">
                <button
                  onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                  className="flex items-center gap-2.5 py-1.5 px-2.5 rounded-lg bg-white border border-[#EAE5DC] hover:border-[#C8BEAD] shadow-fine transition-all focus:outline-none"
                >
                  <img
                    src={user.avatar_url || `https://api.dicebear.com/7.x/initials/svg?seed=${user.full_name}`}
                    alt={user.full_name}
                    className="w-7 h-7 rounded-full object-cover border border-[#EAE5DC]"
                  />
                  <div className="text-left hidden sm:block">
                    <span className="text-xs font-bold text-[#141716] block leading-tight">
                      {user.full_name.split(' ')[0]}
                    </span>
                    <span className="text-[10px] text-[#7E8681] font-medium block leading-tight">
                      {user.wilaya_name || 'Algérie'}
                    </span>
                  </div>
                  <ChevronDown className="w-3.5 h-3.5 text-[#7E8681]" />
                </button>

                {/* Dropdown Menu */}
                {userDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-56 rounded-xl bg-white border border-[#EAE5DC] shadow-dropdown py-1.5 z-50 animate-in fade-in slide-in-from-top-1 text-left">
                    <div className="px-3.5 py-2 border-b border-[#F4EFE6]">
                      <span className="text-xs font-bold text-[#141716] block">{user.full_name}</span>
                      <span className="text-[11px] text-[#7E8681] block truncate">{user.email}</span>
                      <span className="inline-block mt-1 px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider text-[#16382C] bg-[#E2EDE6] rounded">
                        {user.role === 'driver' ? 'Conducteur' : user.role === 'passenger' ? 'Passager' : 'Conducteur & Passager'}
                      </span>
                    </div>

                    <Link
                      to="/dashboard/driver"
                      onClick={() => setUserDropdownOpen(false)}
                      className="flex items-center gap-2.5 px-3.5 py-2 text-xs font-semibold text-[#303632] hover:bg-[#FAF7F2] hover:text-[#16382C]"
                    >
                      <Car className="w-3.5 h-3.5 text-[#16382C]" />
                      <span>Espace Conducteur</span>
                    </Link>

                    <Link
                      to="/dashboard/passenger"
                      onClick={() => setUserDropdownOpen(false)}
                      className="flex items-center gap-2.5 px-3.5 py-2 text-xs font-semibold text-[#303632] hover:bg-[#FAF7F2] hover:text-[#16382C]"
                    >
                      <CalendarCheck className="w-3.5 h-3.5 text-[#16382C]" />
                      <span>Mes Réservations</span>
                    </Link>

                    <div className="border-t border-[#F4EFE6] my-1" />

                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center gap-2 px-3.5 py-2 text-xs font-semibold text-[#A14114] hover:bg-[#FCF7F3] text-left"
                    >
                      <LogOut className="w-3.5 h-3.5" />
                      <span>{t('nav.logout', 'Se déconnecter')}</span>
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="hidden sm:flex items-center gap-2">
                <Link
                  to="/login"
                  className="px-3.5 py-2 text-xs font-semibold text-[#434A46] hover:text-[#16382C] hover:bg-[#F4EFE6] rounded-lg transition-colors"
                >
                  {t('nav.login', 'Connexion')}
                </Link>
                <Link
                  to="/register"
                  className="px-4 py-2 text-xs font-bold text-[#FAF7F2] bg-[#16382C] hover:bg-[#0F281F] rounded-lg shadow-fine transition-all"
                >
                  {t('nav.register', "S'inscrire")}
                </Link>
              </div>
            )}

            {/* Mobile Hamburger Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 text-[#434A46] hover:text-[#16382C] hover:bg-[#F4EFE6] rounded-lg transition-colors focus:outline-none"
              aria-label="Ouvrir le menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-[#EAE5DC] bg-[#FAF7F2] px-4 pt-3 pb-6 space-y-3 animate-in fade-in slide-in-from-top-2 duration-150 text-left">
          <nav className="space-y-1">
            <Link
              to="/trips/create"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center gap-3 px-3.5 py-2.5 text-xs font-bold rounded-lg bg-[#16382C] text-[#FAF7F2]"
            >
              <Plus className="w-4 h-4 text-[#FAF7F2]" />
              <span>Publier un trajet</span>
            </Link>

            <Link
              to="/search"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center gap-3 px-3.5 py-2.5 text-xs font-semibold rounded-lg text-[#303632] hover:bg-[#EAE5DC]"
            >
              <Compass className="w-4 h-4 text-[#16382C]" />
              <span>Rechercher un trajet</span>
            </Link>

            {user && (
              <>
                <Link
                  to="/dashboard/driver"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center gap-3 px-3.5 py-2.5 text-xs font-semibold rounded-lg text-[#303632] hover:bg-[#EAE5DC]"
                >
                  <Car className="w-4 h-4 text-[#16382C]" />
                  <span>Espace Conducteur</span>
                </Link>
                <Link
                  to="/dashboard/passenger"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center gap-3 px-3.5 py-2.5 text-xs font-semibold rounded-lg text-[#303632] hover:bg-[#EAE5DC]"
                >
                  <CalendarCheck className="w-4 h-4 text-[#16382C]" />
                  <span>Mes Réservations</span>
                </Link>
              </>
            )}
          </nav>

          <div className="pt-3 border-t border-[#EAE5DC]">
            {user ? (
              <div className="space-y-2">
                <div className="flex items-center gap-3 p-2.5 rounded-lg bg-white border border-[#EAE5DC]">
                  <img
                    src={user.avatar_url || `https://api.dicebear.com/7.x/initials/svg?seed=${user.full_name}`}
                    alt={user.full_name}
                    className="w-8 h-8 rounded-full object-cover"
                  />
                  <div>
                    <span className="text-xs font-bold text-[#141716] block">{user.full_name}</span>
                    <span className="text-[10px] text-[#7E8681]">{user.email}</span>
                  </div>
                </div>
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center justify-center gap-2 py-2 px-4 rounded-lg bg-[#FCF7F3] text-[#A14114] font-bold text-xs hover:bg-[#F8ECE3] transition-colors"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span>{t('nav.logout', 'Se déconnecter')}</span>
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-2 pt-1">
                <Link
                  to="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-center py-2.5 px-4 text-xs font-bold text-[#303632] bg-white border border-[#EAE5DC] rounded-lg"
                >
                  {t('nav.login', 'Connexion')}
                </Link>
                <Link
                  to="/register"
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-center py-2.5 px-4 text-xs font-bold text-[#FAF7F2] bg-[#16382C] rounded-lg shadow-fine"
                >
                  {t('nav.register', "S'inscrire")}
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
};
