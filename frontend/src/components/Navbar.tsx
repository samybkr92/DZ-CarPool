import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../context/AuthContext';
import { Car, Globe, PlusCircle, User as UserIcon, LogOut, Compass, CalendarCheck } from 'lucide-react';

export const Navbar: React.FC = () => {
  const { t, i18n } = useTranslation();
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const toggleLanguage = () => {
    const nextLang = i18n.language.startsWith('ar') ? 'fr' : 'ar';
    i18n.changeLanguage(nextLang);
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const isRtl = i18n.language.startsWith('ar');

  return (
    <header className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-gray-100 transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand Logo */}
          <Link to="/" className="flex items-center gap-2 group">
            <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center shadow-md shadow-emerald-600/20 group-hover:scale-105 transition-transform">
              <Car className="w-5 h-5" />
            </div>
            <div>
              <span className="text-xl font-bold tracking-tight text-gray-900 group-hover:text-emerald-700 transition-colors">
                DZ<span className="text-emerald-600">-CarPool</span>
              </span>
              <p className="text-[10px] text-gray-500 font-medium hidden sm:block -mt-1">
                {t('brand.slogan')}
              </p>
            </div>
          </Link>

          {/* Navigation Links */}
          <nav className="hidden md:flex items-center gap-1 lg:gap-2">
            <Link
              to="/search"
              className="flex items-center gap-1.5 px-3 py-2 text-sm font-medium text-gray-700 hover:text-emerald-700 hover:bg-emerald-50/50 rounded-lg transition-colors"
            >
              <Compass className="w-4 h-4 text-emerald-600" />
              <span>{t('nav.search')}</span>
            </Link>

            {user && (
              <>
                <Link
                  to="/trips/create"
                  className="flex items-center gap-1.5 px-3 py-2 text-sm font-medium text-gray-700 hover:text-emerald-700 hover:bg-emerald-50/50 rounded-lg transition-colors"
                >
                  <PlusCircle className="w-4 h-4 text-emerald-600" />
                  <span>{t('nav.publish')}</span>
                </Link>

                <Link
                  to="/dashboard/driver"
                  className="flex items-center gap-1.5 px-3 py-2 text-sm font-medium text-gray-700 hover:text-emerald-700 hover:bg-emerald-50/50 rounded-lg transition-colors"
                >
                  <Car className="w-4 h-4 text-emerald-600" />
                  <span>{t('nav.driver_dashboard')}</span>
                </Link>

                <Link
                  to="/dashboard/passenger"
                  className="flex items-center gap-1.5 px-3 py-2 text-sm font-medium text-gray-700 hover:text-emerald-700 hover:bg-emerald-50/50 rounded-lg transition-colors"
                >
                  <CalendarCheck className="w-4 h-4 text-emerald-600" />
                  <span>{t('nav.passenger_dashboard')}</span>
                </Link>
              </>
            )}
          </nav>

          {/* Controls: Language & Auth */}
          <div className="flex items-center gap-3">
            {/* Language Switcher */}
            <button
              onClick={toggleLanguage}
              className="flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-semibold rounded-lg border border-gray-200 text-gray-700 hover:border-emerald-500 hover:text-emerald-700 transition-colors"
              title="Changer de langue / تغيير اللغة"
              aria-label="Toggle language"
            >
              <Globe className="w-3.5 h-3.5 text-emerald-600" />
              <span>{isRtl ? 'Français' : 'العربية'}</span>
            </button>

            {/* Auth Buttons */}
            {user ? (
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2 pl-2">
                  <img
                    src={user.avatar_url || `https://api.dicebear.com/7.x/initials/svg?seed=${user.full_name}`}
                    alt={user.full_name}
                    className="w-8 h-8 rounded-full border border-emerald-500/30 object-cover"
                  />
                  <span className="text-sm font-semibold text-gray-800 hidden lg:inline-block">
                    {user.full_name.split(' ')[0]}
                  </span>
                </div>
                <button
                  onClick={handleLogout}
                  className="p-2 text-gray-500 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                  title={t('nav.logout')}
                  aria-label={t('nav.logout')}
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link
                  to="/login"
                  className="px-3.5 py-2 text-sm font-medium text-gray-700 hover:text-emerald-700 transition-colors"
                >
                  {t('nav.login')}
                </Link>
                <Link
                  to="/register"
                  className="px-4 py-2 text-sm font-semibold text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg shadow-sm shadow-emerald-600/30 transition-all"
                >
                  {t('nav.register')}
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
