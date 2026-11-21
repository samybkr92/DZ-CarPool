import React from 'react';
import { useTranslation } from 'react-i18next';
import { Heart, ShieldCheck, MapPin, PhoneCall } from 'lucide-react';

export const Footer: React.FC = () => {
  const { t } = useTranslation();

  return (
    <footer className="bg-gray-950 text-gray-300 pt-16 pb-12 border-t border-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
          {/* Col 1: Brand & Identity */}
          <div className="md:col-span-1">
            <span className="text-2xl font-bold tracking-tight text-white">
              DZ<span className="text-emerald-500">-CarPool</span>
            </span>
            <p className="text-sm text-gray-400 mt-2">
              {t('brand.slogan')}
            </p>
            <p className="text-xs text-gray-500 mt-4 leading-relaxed">
              La plateforme de covoiturage inter-wilayas conçue pour faciliter la mobilité des Algériennes et des Algériens à travers les 58 wilayas.
            </p>
          </div>

          {/* Col 2: Axes Populaires */}
          <div>
            <h4 className="text-sm font-semibold text-white tracking-wider uppercase mb-4 flex items-center gap-2">
              <MapPin className="w-4 h-4 text-emerald-400" />
              Trajets Fréquents
            </h4>
            <ul className="space-y-2 text-sm text-gray-400">
              <li>Alger ↔ Oran (415 km)</li>
              <li>Alger ↔ Constantine (390 km)</li>
              <li>Alger ↔ Sétif (260 km)</li>
              <li>Oran ↔ Tlemcen (140 km)</li>
              <li>Constantine ↔ Annaba (160 km)</li>
            </ul>
          </div>

          {/* Col 3: Charte de Confiance */}
          <div>
            <h4 className="text-sm font-semibold text-white tracking-wider uppercase mb-4 flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              Confiance & Sécurité
            </h4>
            <ul className="space-y-2 text-sm text-gray-400">
              <li>Commission fixe et transparente (15%)</li>
              <li>Pause sécurité 15 min obligatoire &gt; 300 km</li>
              <li>Estimation carburant officielle Naftal</li>
              <li>Option Trajet Confort (+30% sans cascade)</li>
              <li>Messagerie interne sécurisée</li>
            </ul>
          </div>

          {/* Col 4: Assistance locale */}
          <div>
            <h4 className="text-sm font-semibold text-white tracking-wider uppercase mb-4 flex items-center gap-2">
              <PhoneCall className="w-4 h-4 text-emerald-400" />
              Assistance Locale
            </h4>
            <p className="text-sm text-gray-400 mb-2">
              Support communautaire et assistance utilisateurs en Algérie :
            </p>
            <p className="text-xs text-emerald-400 font-mono">
              contact@dz-carpool.dz
            </p>
            <p className="text-xs text-gray-500 mt-2">
              Alger Centre, 16000 Wilaya d'Alger
            </p>
          </div>
        </div>

        <div className="pt-8 border-t border-gray-900 flex flex-col sm:flex-row items-center justify-between text-xs text-gray-500 gap-4">
          <p>© 2026 DZ-CarPool. Tous droits réservés. Projet GL 2025/2026.</p>
          <div className="flex items-center gap-1 text-gray-400">
            <span>Fait avec fierté en Algérie</span>
            <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500 inline mx-1" />
            <span>pour les 58 wilayas</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
