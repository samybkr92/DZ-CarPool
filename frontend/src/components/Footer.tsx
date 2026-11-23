import React from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { ShieldCheck, Fuel, Car, Heart } from 'lucide-react';

export const Footer: React.FC = () => {
  const { t } = useTranslation();

  return (
    <footer className="bg-[#0A1C14] text-[#8FBFA9] border-t border-[#173C2C] mt-24 transition-all">
      {/* Top Banner: Core Principles */}
      <div className="border-b border-[#173C2C]/80 bg-[#05100B]/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
            <div className="flex items-start gap-3.5">
              <div className="w-10 h-10 rounded-lg bg-[#112E22] text-[#C2DBCF] border border-[#1E4D38] flex items-center justify-center flex-shrink-0">
                <ShieldCheck className="w-5 h-5 text-[#8FBFA9]" />
              </div>
              <div className="space-y-1">
                <h4 className="text-xs font-bold uppercase tracking-wider text-white">
                  Sécurité & Halte Obligatoire
                </h4>
                <p className="text-xs text-[#8FBFA9] leading-relaxed">
                  Sur les trajets de plus de 300 km, une pause minimale de 15 minutes en station Naftal est automatiquement programmée pour votre sécurité.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3.5">
              <div className="w-10 h-10 rounded-lg bg-[#112E22] text-[#C2DBCF] border border-[#1E4D38] flex items-center justify-center flex-shrink-0">
                <Fuel className="w-5 h-5 text-[#8FBFA9]" />
              </div>
              <div className="space-y-1">
                <h4 className="text-xs font-bold uppercase tracking-wider text-white">
                  Carburant & Économie Réelle
                </h4>
                <p className="text-xs text-[#8FBFA9] leading-relaxed">
                  Calcul automatisé des coûts à 8L/100km basé sur les tarifs officiels des stations-services locales par wilaya.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3.5">
              <div className="w-10 h-10 rounded-lg bg-[#112E22] text-[#C2DBCF] border border-[#1E4D38] flex items-center justify-center flex-shrink-0">
                <Car className="w-5 h-5 text-[#8FBFA9]" />
              </div>
              <div className="space-y-1">
                <h4 className="text-xs font-bold uppercase tracking-wider text-white">
                  Option Trajet Confort (+30%)
                </h4>
                <p className="text-xs text-[#8FBFA9] leading-relaxed">
                  Réservez la place avant passager en toute sérénité avec le supplément de 30% validé directement par le conducteur.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Directory */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-12 text-left">
          <div className="col-span-2 md:col-span-1 space-y-3">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-[#173C2C] text-white flex items-center justify-center font-black text-sm border border-[#2D6A4F]">
                DZ
              </div>
              <span className="text-base font-black text-white tracking-tight">DZ-CarPool</span>
            </div>
            <p className="text-xs text-[#8FBFA9] leading-relaxed">
              La plateforme technologique de mobilité partagée inter-wilayas et trajets quotidiens en Algérie.
            </p>
            <div className="pt-2 text-[11px] text-[#5A9F7E] font-mono">
              Projet d'Ingénierie Logicielle GL 2025/2026
            </div>
          </div>

          <div>
            <h5 className="text-xs font-bold uppercase tracking-wider text-white mb-3">Navigation</h5>
            <ul className="space-y-2 text-xs">
              <li><Link to="/search" className="hover:text-white transition-colors">Rechercher un trajet</Link></li>
              <li><Link to="/trips/create" className="hover:text-white transition-colors">Publier une annonce</Link></li>
              <li><Link to="/dashboard/driver" className="hover:text-white transition-colors">Espace Conducteur</Link></li>
              <li><Link to="/dashboard/passenger" className="hover:text-white transition-colors">Mes Réservations</Link></li>
            </ul>
          </div>

          <div>
            <h5 className="text-xs font-bold uppercase tracking-wider text-white mb-3">Axes Populaires</h5>
            <ul className="space-y-2 text-xs">
              <li><Link to="/search?origin=Alger&destination=Oran" className="hover:text-white transition-colors">Alger ➔ Oran (A1 Ouest)</Link></li>
              <li><Link to="/search?origin=Alger&destination=Constantine" className="hover:text-white transition-colors">Alger ➔ Constantine (A1 Est)</Link></li>
              <li><Link to="/search?origin=Alger&destination=Sétif" className="hover:text-white transition-colors">Alger ➔ Sétif</Link></li>
              <li><Link to="/search?origin=Oran&destination=Tlemcen" className="hover:text-white transition-colors">Oran ➔ Tlemcen</Link></li>
            </ul>
          </div>

          <div>
            <h5 className="text-xs font-bold uppercase tracking-wider text-white mb-3">Réglementation</h5>
            <ul className="space-y-2 text-xs">
              <li className="text-[#8FBFA9]">Commission plateforme : 15%</li>
              <li className="text-[#8FBFA9]">Rémunération conducteur : 100% nette</li>
              <li className="text-[#8FBFA9]">Pause Naftal obligatoire &gt; 300km</li>
              <li className="text-[#8FBFA9]">Approbation manuelle par le conducteur</li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-[#173C2C] flex flex-col sm:flex-row items-center justify-between text-xs text-[#5A9F7E] gap-4">
          <p>© {new Date().getFullYear()} DZ-CarPool Algérie. Tous droits réservés.</p>
          <div className="flex items-center gap-4 text-xs">
            <span>Conçu pour les 58 Wilayas d'Algérie</span>
            <span>•</span>
            <span className="flex items-center gap-1">Fait avec <Heart className="w-3 h-3 text-rose-500 fill-rose-500" /> en Algérie</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
