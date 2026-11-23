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
    <header className="sticky top-0 z-50 bg-[#FAF8F5]/95 backdrop-blur-md border-b border-[#E6E0D6] transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20">
          {/* Brand Logo */}
          <Link
            to="/"
            className="flex items-center gap-3 group focus:outline-none rounded-lg p-1"
          >
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-[#173C2C] text-white flex items-center justify-center shadow-sm group-hover:bg-[#112E22] transition-colors">
              <Car className="w-5 h-5 text-white" />
            </div>
            <div className="flex flex-col text-left">
              <div className="flex items-center gap-2">
                <span className="text-lg sm:text-xl font-black tracking-tight text-[#141613] group-hover:text-[#173C2C] transition-colors">
                  DZ-CarPool
                </span>
                <span className="hidden sm:inline-flex px-2 py-0.5 text-[10px] font-bold tracking-wider uppercase text-[#173C2C] bg-[#E1EDE6] rounded-md border border-[#C2DBCF]">
                  Algérie
                </span>
              </div>
              <p className="text-[11px] text-[#64695F] font-medium hidden sm:block -mt-0.5">
                {t('brand.slogan', 'Covoiturage inter-wilayas')}
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
                      ? 'bg-[#E1EDE6] text-[#173C2C] font-bold'
                      : 'text-[#64695F] hover:text-[#141613] hover:bg-[#F3EFE8]'
                  }`}
                >
                  <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-[#173C2C]' : 'text-[#8E9389]'}`} />
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
              className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-bold rounded-lg bg-[#173C2C] text-white hover:bg-[#112E22] transition-all shadow-sm active:scale-[0.98]"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>{t('nav.publish', 'Publier un trajet')}</span>
            </Link>

            {/* Language Switcher Pill */}
            <button
              onClick={toggleLanguage}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg border border-[#E6E0D6] bg-white text-[#32362F] hover:border-[#173C2C] hover:text-[#173C2C] shadow-subtle transition-all focus:outline-none"
              title="Changer de langue / تغيير اللغة"
              aria-label="Changer de langue"
            >
              <Globe className="w-3.5 h-3.5 text-[#173C2C]" />
              <span className="tracking-wide font-medium">{isRtl ? 'Français' : 'العربية'}</span>
            </button>

            {/* Desktop Auth State */}
            {user ? (
              <div className="relative">
                <button
                  onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                  className="flex items-center gap-2 py-1.5 px-3 rounded-lg bg-white border border-[#E6E0D6] hover:border-[#D4CCBF] shadow-subtle transition-all focus:outline-none"
                >
                  <img
                    src={user.avatar_url || `https://api.dicebear.com/7.x/initials/svg?seed=${user.full_name}`}
                    alt={user.full_name}
                    className="w-6 h-6 rounded-full object-cover border border-[#E6E0D6]"
                  />
                  <div className="text-left hidden sm:block">
                    <span className="text-xs font-bold text-[#141613] block leading-tight">
                      {user.full_name.split(' ')[0]}
                    </span>
                  </div>
                  <ChevronDown className="w-3.5 h-3.5 text-[#8E9389]" />
                </button>

                {/* Dropdown Menu */}
                {userDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-56 rounded-xl bg-white border border-[#E6E0D6] shadow-elevated py-2 z-50 animate-in fade-in slide-in-from-top-1 text-left">
                    <div className="px-4 py-2.5 border-b border-[#F3EFE8]">
                      <span className="text-xs font-bold text-[#141613] block">{user.full_name}</span>
                      <span className="text-[11px] text-[#64695F] block truncate">{user.email}</span>
                      <span className="inline-block mt-1 px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider text-[#173C2C] bg-[#E1EDE6] rounded">
                        {user.role === 'driver' ? 'Conducteur' : user.role === 'passenger' ? 'Passager' : 'Conducteur & Passager'}
                      </span>
                    </div>

                    <Link
                      to="/dashboard/driver"
                      onClick={() => setUserDropdownOpen(false)}
                      className="flex items-center gap-2.5 px-4 py-2 text-xs font-semibold text-[#32362F] hover:bg-[#FAF8F5] hover:text-[#173C2C] transition-colors"
                    >
                      <Car className="w-3.5 h-3.5 text-[#173C2C]" />
                      <span>Espace Conducteur</span>
                    </Link>

                    <Link
                      to="/dashboard/passenger"
                      onClick={() => setUserDropdownOpen(false)}
                      className="flex items-center gap-2.5 px-4 py-2 text-xs font-semibold text-[#32362F] hover:bg-[#FAF8F5] hover:text-[#173C2C] transition-colors"
                    >
                      <CalendarCheck className="w-3.5 h-3.5 text-[#173C2C]" />
                      <span>Mes Réservations</span>
                    </Link>

                    <div className="border-t border-[#F3EFE8] my-1" />

                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center gap-2 px-4 py-2 text-xs font-semibold text-rose-700 hover:bg-rose-50 text-left transition-colors"
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
                  className="px-3.5 py-2 text-xs font-bold text-[#32362F] hover:text-[#173C2C] hover:bg-[#F3EFE8] rounded-lg transition-colors"
                >
                  {t('nav.login', 'Connexion')}
                </Link>
                <Link
                  to="/register"
                  className="px-4 py-2 text-xs font-bold text-[#141613] bg-[#F3EFE8] hover:bg-[#E6E0D6] border border-[#E6E0D6] rounded-lg shadow-subtle transition-all"
                >
                  {t('nav.register', "S'inscrire")}
                </Link>
              </div>
            )}

            {/* Mobile Hamburger Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 text-[#32362F] hover:text-[#141613] hover:bg-[#F3EFE8] rounded-lg focus:outline-none"
              aria-label="Menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-[#E6E0D6] bg-white px-4 pt-3 pb-6 space-y-3 animate-in slide-in-from-top-2 text-left">
          <div className="space-y-1">
            {navLinks.map((link) => {
              const Icon = link.icon;
              const isActive = location.pathname === link.to;
              return (
                <Link
                  key={link.to}
                  to={link.to}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-xs font-semibold ${
                    isActive
                      ? 'bg-[#E1EDE6] text-[#173C2C] font-bold'
                      : 'text-[#32362F] hover:bg-[#FAF8F5]'
                  }`}
                >
                  <Icon className="w-4 h-4 text-[#173C2C]" />
                  <span>{link.label}</span>
                </Link>
              );
            })}
          </div>

          <div className="pt-2 border-t border-[#F3EFE8] space-y-2">
            <Link
              to="/trips/create"
              onClick={() => setMobileMenuOpen(false)}
              className="w-full flex items-center justify-center gap-2 py-2.5 rounded-lg bg-[#173C2C] text-white font-bold text-xs shadow-sm"
            >
              <Plus className="w-4 h-4" />
              <span>Publier un trajet</span>
            </Link>

            {user ? (
              <button
                onClick={handleLogout}
                className="w-full flex items-center justify-center gap-2 py-2.5 rounded-lg border border-rose-200 bg-rose-50 text-rose-700 font-bold text-xs"
              >
                <LogOut className="w-4 h-4" />
                <span>Se déconnecter</span>
              </button>
            ) : (
              <div className="grid grid-cols-2 gap-2 pt-1">
                <Link
                  to="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="py-2.5 text-center text-xs font-bold text-[#141613] bg-[#F3EFE8] rounded-lg"
                >
                  Connexion
                </Link>
                <Link
                  to="/register"
                  onClick={() => setMobileMenuOpen(false)}
                  className="py-2.5 text-center text-xs font-bold text-[#141613] bg-[#E6E0D6] rounded-lg"
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
