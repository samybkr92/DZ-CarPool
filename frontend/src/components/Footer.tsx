import React from 'react';
import { useTranslation } from 'react-i18next';
import { ShieldCheck, MapPin, PhoneCall, Compass, Car, CheckCircle2 } from 'lucide-react';
import { Link } from 'react-router-dom';

export const Footer: React.FC = () => {
  const { t } = useTranslation();

  return (
    <footer className="bg-slate-950 text-slate-300 pt-16 pb-12 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 mb-14">
          {/* Col 1: Brand & Algerian Mission */}
          <div className="space-y-4 md:col-span-1">
            <div className="flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center shadow-md">
                <Car className="w-5 h-5 text-white" />
              </div>
              <span className="text-2xl font-black tracking-tight text-white">
                DZ<span className="text-emerald-400">-CarPool</span>
              </span>
            </div>
            <p className="text-xs text-emerald-200/90 leading-relaxed font-medium">
              {t('brand.slogan', 'La route, partagée.')}
            </p>
            <p className="text-xs text-slate-400 leading-relaxed">
              Le premier réseau de covoiturage inter-wilayas conçu pour relier les voyageurs et conducteurs à travers les 58 wilayas d’Algérie avec confort et clarté tarifaire.
            </p>
            <div className="pt-2 flex items-center gap-2 text-[11px] font-semibold text-emerald-400">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>Conforme au cahier des charges GL 2025/2026</span>
            </div>
          </div>

          {/* Col 2: Axes Principaux */}
          <div>
            <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-4 flex items-center gap-2">
              <Compass className="w-4 h-4 text-emerald-400" />
              Liaisons Majeures
            </h4>
            <ul className="space-y-2.5 text-xs text-slate-300">
              <li>
                <Link to="/search?origin=Alger&destination=Oran" className="hover:text-emerald-400 transition-colors">
                  Alger ↔ Oran (415 km • RN4 / A1)
                </Link>
              </li>
              <li>
                <Link to="/search?origin=Alger&destination=Constantine" className="hover:text-emerald-400 transition-colors">
                  Alger ↔ Constantine (390 km • Autoroute Est)
                </Link>
              </li>
              <li>
                <Link to="/search?origin=Alger&destination=Sétif" className="hover:text-emerald-400 transition-colors">
                  Alger ↔ Sétif (260 km • Hauts Plateaux)
                </Link>
              </li>
              <li>
                <Link to="/search?origin=Oran&destination=Tlemcen" className="hover:text-emerald-400 transition-colors">
                  Oran ↔ Tlemcen (140 km • A1 Ouest)
                </Link>
              </li>
              <li>
                <Link to="/search?origin=Constantine&destination=Annaba" className="hover:text-emerald-400 transition-colors">
                  Constantine ↔ Annaba (160 km)
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 3: Règles & Engagements */}
          <div>
            <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-4 flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              Engagements & Règles Métier
            </h4>
            <ul className="space-y-2.5 text-xs text-slate-300">
              <li className="flex items-start gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0 mt-0.5" />
                <span>Commission fixe 15% sans frais cachés</span>
              </li>
              <li className="flex items-start gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0 mt-0.5" />
                <span>Pause sécurité 15 min obligatoire (&gt; 300 km)</span>
              </li>
              <li className="flex items-start gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0 mt-0.5" />
                <span>Barème officiel carburants Naftal 58 wilayas</span>
              </li>
              <li className="flex items-start gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0 mt-0.5" />
                <span>Trajet Confort (+30% sans cascade de frais)</span>
              </li>
              <li className="flex items-start gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0 mt-0.5" />
                <span>Validation préalable du conducteur par trajet</span>
              </li>
            </ul>
          </div>

          {/* Col 4: Transparence & Support */}
          <div>
            <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-4 flex items-center gap-2">
              <PhoneCall className="w-4 h-4 text-emerald-400" />
              Transparence & Contact
            </h4>
            <p className="text-xs text-slate-400 leading-relaxed mb-3">
              DZ-CarPool encourage le partage équitable des coûts réels de déplacement sans but lucratif des particuliers.
            </p>
            <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 space-y-1">
              <span className="text-[11px] font-bold text-emerald-400 block uppercase tracking-wide">
                Assistance Communauté
              </span>
              <p className="text-xs text-white font-mono">support@dz-carpool.dz</p>
              <p className="text-[10px] text-slate-400">Alger Centre • 16000 Wilaya d'Alger</p>
            </div>
          </div>
        </div>

        <div className="pt-8 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-400 gap-4">
          <p>© 2026 DZ-CarPool Algérie. Tous droits réservés.</p>
          <div className="flex items-center gap-3 text-slate-400">
            <span>DZD (Dinar Algérien)</span>
            <span>•</span>
            <span>Bilingue FR / AR</span>
            <span>•</span>
            <span className="text-emerald-400 font-semibold">58 Wilayas</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
