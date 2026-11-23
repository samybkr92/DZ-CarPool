import React from 'react';
import { useTranslation } from 'react-i18next';
import { ShieldCheck, Compass, Car, Check, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

export const Footer: React.FC = () => {
  const { t } = useTranslation();

  return (
    <footer className="bg-[#141716] text-[#FAF7F2] pt-16 pb-12 border-t border-[#212623] text-left">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 mb-14">
          {/* Col 1: Brand & Algerian Mission */}
          <div className="space-y-4 md:col-span-1">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-[#16382C] text-[#FAF7F2] flex items-center justify-center border border-[#276243]">
                <span className="font-serif italic font-bold text-base">DZ</span>
              </div>
              <span className="text-xl font-bold tracking-tight text-[#FAF7F2]">
                DZ-CarPool
              </span>
            </div>
            <p className="text-xs text-[#97C0A7] leading-relaxed font-medium">
              {t('brand.slogan', 'La route partagée à travers les 58 wilayas d’Algérie.')}
            </p>
            <p className="text-xs text-[#ADB3AF] leading-relaxed">
              Plateforme nationale de mobilité inter-wilayas assurant la mise en relation sécurisée entre conducteurs et passagers avec transparence tarifaire intégrale en Dinars (DZD).
            </p>
            <div className="pt-2 flex items-center gap-2 text-[11px] font-semibold text-[#97C0A7]">
              <ShieldCheck className="w-4 h-4 text-[#649E7C]" />
              <span>Conforme au cahier des charges GL 2025/2026</span>
            </div>
          </div>

          {/* Col 2: Axes Principaux */}
          <div>
            <h4 className="text-xs font-bold text-[#FAF7F2] uppercase tracking-wider mb-4 flex items-center gap-2">
              <Compass className="w-3.5 h-3.5 text-[#97C0A7]" />
              Liaisons Majeures
            </h4>
            <ul className="space-y-2.5 text-xs text-[#ADB3AF]">
              <li>
                <Link to="/search?origin=Alger&destination=Oran" className="hover:text-[#FAF7F2] transition-colors flex items-center justify-between">
                  <span>Alger ↔ Oran</span>
                  <span className="text-[10px] text-[#7E8681]">415 km • A1</span>
                </Link>
              </li>
              <li>
                <Link to="/search?origin=Alger&destination=Constantine" className="hover:text-[#FAF7F2] transition-colors flex items-center justify-between">
                  <span>Alger ↔ Constantine</span>
                  <span className="text-[10px] text-[#7E8681]">390 km • A1 Est</span>
                </Link>
              </li>
              <li>
                <Link to="/search?origin=Alger&destination=Sétif" className="hover:text-[#FAF7F2] transition-colors flex items-center justify-between">
                  <span>Alger ↔ Sétif</span>
                  <span className="text-[10px] text-[#7E8681]">260 km</span>
                </Link>
              </li>
              <li>
                <Link to="/search?origin=Oran&destination=Tlemcen" className="hover:text-[#FAF7F2] transition-colors flex items-center justify-between">
                  <span>Oran ↔ Tlemcen</span>
                  <span className="text-[10px] text-[#7E8681]">140 km</span>
                </Link>
              </li>
              <li>
                <Link to="/search?origin=Constantine&destination=Annaba" className="hover:text-[#FAF7F2] transition-colors flex items-center justify-between">
                  <span>Constantine ↔ Annaba</span>
                  <span className="text-[10px] text-[#7E8681]">160 km</span>
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 3: Règles & Engagements */}
          <div>
            <h4 className="text-xs font-bold text-[#FAF7F2] uppercase tracking-wider mb-4 flex items-center gap-2">
              <ShieldCheck className="w-3.5 h-3.5 text-[#97C0A7]" />
              Règles Métier DZ-CarPool
            </h4>
            <ul className="space-y-2.5 text-xs text-[#ADB3AF]">
              <li className="flex items-start gap-2">
                <Check className="w-3.5 h-3.5 text-[#649E7C] flex-shrink-0 mt-0.5" />
                <span>Commission fixe 15% sans frais cachés</span>
              </li>
              <li className="flex items-start gap-2">
                <Check className="w-3.5 h-3.5 text-[#649E7C] flex-shrink-0 mt-0.5" />
                <span>Halte 15 min obligatoire Naftal (&gt; 300 km)</span>
              </li>
              <li className="flex items-start gap-2">
                <Check className="w-3.5 h-3.5 text-[#649E7C] flex-shrink-0 mt-0.5" />
                <span>Barème officiel carburants Naftal (8L/100km)</span>
              </li>
              <li className="flex items-start gap-2">
                <Check className="w-3.5 h-3.5 text-[#649E7C] flex-shrink-0 mt-0.5" />
                <span>Option Trajet Confort (+30% sans cascade)</span>
              </li>
              <li className="flex items-start gap-2">
                <Check className="w-3.5 h-3.5 text-[#649E7C] flex-shrink-0 mt-0.5" />
                <span>Validation préalable obligatoire par le conducteur</span>
              </li>
            </ul>
          </div>

          {/* Col 4: Transparence & Support */}
          <div>
            <h4 className="text-xs font-bold text-[#FAF7F2] uppercase tracking-wider mb-4">
              Dispositif Technique
            </h4>
            <p className="text-xs text-[#ADB3AF] leading-relaxed mb-4">
              Conçu pour le territoire algérien avec prise en charge intégrale du Français et de l’Arabe (RTL). Calculs monétaires certifiés en centimes entiers (DZD).
            </p>
            <div className="p-3.5 rounded-xl bg-[#212623] border border-[#303632] space-y-1">
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#97C0A7] block">
                Version GL 2025/2026
              </span>
              <span className="text-xs text-[#FAF7F2] font-semibold block">
                Architecture FastAPI + PostgreSQL + React
              </span>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-[#212623] flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#7E8681]">
          <p>© 2026 DZ-CarPool. Tous droits réservés • République Algérienne Démocratique et Populaire.</p>
          <div className="flex items-center gap-6">
            <span>58 Wilayas d'Algérie</span>
            <span>•</span>
            <span>Bilingue FR / AR</span>
            <span>•</span>
            <span>Sécurité Routière</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
