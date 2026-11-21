import { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { ArrowUpRight, MoveDownRight } from 'lucide-react';

const routePath = 'M 86 422 C 185 394, 210 310, 292 322 S 394 393, 456 321 S 505 211, 614 210 S 708 267, 790 163';

const copy = {
  fr: [
    {
      eyebrow: '01 / Choisissez votre axe',
      title: 'Une place libre change le trajet.',
      body: 'Trouvez un conducteur sur votre route et partagez les frais, sans perdre de vue le prix ni l’horaire.',
    },
    {
      eyebrow: '02 / Comparez les trajets',
      title: 'La bonne route, au bon rythme.',
      body: 'Parcourez les départs, le nombre de places et les détails du voyage avant de faire votre demande.',
    },
    {
      eyebrow: '03 / Réservez simplement',
      title: 'Le conducteur confirme.',
      body: 'Votre réservation reste en attente jusqu’à l’accord du conducteur. Les places sont suivies pour éviter le surbooking.',
    },
    {
      eyebrow: '04 / Prenez la route',
      title: 'Le voyage se partage aussi.',
      body: 'Sur les longs trajets, une pause est intégrée au parcours. Le détail du trajet reste visible avant le départ.',
    },
  ],
  ar: [
    {
      eyebrow: '٠١ / اختر مسارك',
      title: 'المقعد الشاغر يجعل الرحلة أسهل.',
      body: 'اعثر على سائق يسلك طريقك وتقاسموا التكاليف مع معرفة السعر والموعد مسبقاً.',
    },
    {
      eyebrow: '٠٢ / قارن الرحلات',
      title: 'الطريق المناسب، بالوتيرة التي تناسبك.',
      body: 'اطّلع على مواعيد الانطلاق والمقاعد وتفاصيل الرحلة قبل إرسال طلبك.',
    },
    {
      eyebrow: '٠٣ / اطلب الحجز',
      title: 'السائق يؤكد الحجز.',
      body: 'يبقى طلبك قيد الانتظار إلى أن يوافق السائق. تتم متابعة المقاعد لتفادي الحجز الزائد.',
    },
    {
      eyebrow: '٠٤ / انطلق في الطريق',
      title: 'الرحلة أجمل عندما نتشاركها.',
      body: 'تُدرج استراحة في الرحلات الطويلة، وتبقى تفاصيل المسار واضحة قبل الانطلاق.',
    },
  ],
};

export const ScrollJourney = () => {
  const navigate = useNavigate();
  const sectionRef = useRef<HTMLElement>(null);
  const routeRef = useRef<SVGPathElement>(null);
  const carRef = useRef<SVGGElement>(null);
  const [progress, setProgress] = useState(0);
  const [step, setStep] = useState(0);
  const [reducedMotion, setReducedMotion] = useState(false);
  const { i18n } = useTranslation();
  const isArabic = i18n.language.startsWith('ar');
  const language = isArabic ? 'ar' : 'fr';
  const activeCopy = copy[language][step];

  useEffect(() => {
    const motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    const syncMotion = () => setReducedMotion(motionQuery.matches);
    syncMotion();
    motionQuery.addEventListener?.('change', syncMotion);

    let frame = 0;
    const update = () => {
      if (frame) return;
      frame = window.requestAnimationFrame(() => {
        frame = 0;
        const section = sectionRef.current;
        if (!section) return;
        const scrollRange = Math.max(section.offsetHeight - window.innerHeight, 1);
        const amount = Math.max(0, Math.min(1, -section.getBoundingClientRect().top / scrollRange));
        const nextStep = Math.min(copy.fr.length - 1, Math.floor(amount * copy.fr.length));
        setProgress(amount);
        setStep((current) => current === nextStep ? current : nextStep);

        if (!motionQuery.matches && routeRef.current && carRef.current) {
          const length = routeRef.current.getTotalLength();
          const point = routeRef.current.getPointAtLength(length * amount);
          carRef.current.setAttribute('transform', `translate(${point.x} ${point.y})`);
        }
      });
    };

    window.addEventListener('scroll', update, { passive: true });
    window.addEventListener('resize', update);
    update();
    return () => {
      window.removeEventListener('scroll', update);
      window.removeEventListener('resize', update);
      motionQuery.removeEventListener?.('change', syncMotion);
      if (frame) window.cancelAnimationFrame(frame);
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative h-[260vh] bg-[#091a17] text-white sm:h-[300vh]"
      aria-label={isArabic ? 'رحلة تتكشف مع التمرير' : 'Une route racontée au fil du défilement'}
      dir={isArabic ? 'rtl' : 'ltr'}
    >
      <div className="sticky top-0 h-[100svh] min-h-[560px] overflow-hidden">
        <img
          src="https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?auto=format&fit=crop&w=2200&q=85"
          alt=""
          aria-hidden="true"
          loading="lazy"
          className="absolute inset-0 h-full w-full object-cover object-center opacity-35"
        />
        <div className="absolute inset-0 bg-[linear-gradient(110deg,rgba(4,18,15,.98)_0%,rgba(4,18,15,.88)_42%,rgba(4,18,15,.48)_100%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_72%_50%,rgba(218,157,65,.18),transparent_48%)]" />

        <div className="relative mx-auto grid h-full max-w-[1440px] grid-rows-[0.9fr_1.1fr] px-5 sm:px-8 lg:grid-cols-[0.85fr_1.15fr] lg:grid-rows-1 lg:px-14">
          <div className={`z-10 flex min-h-0 flex-col justify-end pb-5 sm:pb-8 lg:justify-center lg:pb-0 ${isArabic ? 'text-right lg:pl-8' : 'text-left lg:pr-8'}`}>
            <div className="mb-3 flex items-center gap-3 text-[10px] font-semibold uppercase tracking-[0.22em] text-[#e8bd73] sm:text-xs">
              <span className="h-px w-8 bg-[#e8bd73]" />
              <span>{isArabic ? 'ديزاد كارپول · الجزائر' : 'DZ-CarPool · Algérie'}</span>
            </div>
            <div className="mb-2 flex items-center gap-2 text-[10px] text-white/60 sm:text-xs" aria-live="polite">
              <span>{activeCopy.eyebrow}</span>
              <span className="tabular-nums">{String(step + 1).padStart(2, '0')} / 04</span>
            </div>
            <h2 className="max-w-xl text-[clamp(1.7rem,4vw,3.5rem)] font-extrabold leading-[1.04] tracking-[-0.045em] text-white">
              {activeCopy.title}
            </h2>
            <p className="mt-3 max-w-md text-xs leading-5 text-white/75 sm:text-sm sm:leading-6">
              {activeCopy.body}
            </p>

            <div className="mt-4 flex max-w-sm items-center gap-2" role="progressbar" aria-label={isArabic ? 'تقدم الرحلة' : 'Progression de la séquence'} aria-valuemin={0} aria-valuemax={100} aria-valuenow={Math.round(progress * 100)}>
              {copy[language].map((item, index) => (
                <span key={item.eyebrow} className={`h-1 flex-1 rounded-full transition-colors duration-300 ${index <= step ? 'bg-[#e8bd73]' : 'bg-white/25'}`} />
              ))}
            </div>

            <div className="mt-4 flex flex-wrap items-center gap-3">
              <button
                type="button"
                onClick={() => navigate('/search')}
                className="inline-flex min-h-11 items-center gap-2 rounded-full bg-[#e8bd73] px-5 text-xs font-bold text-[#14221c] shadow-lg shadow-black/20 transition-colors hover:bg-[#f1d39a] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#e8bd73] sm:text-sm"
              >
                {isArabic ? 'ابحث عن رحلة' : 'Trouver un trajet'}
                <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
              </button>
              <span className="hidden items-center gap-2 text-[10px] text-white/55 sm:inline-flex sm:text-xs">
                <MoveDownRight className="h-4 w-4" aria-hidden="true" />
                {isArabic ? 'مرّر لمتابعة المسار' : 'Faites défiler pour suivre la route'}
              </span>
            </div>
          </div>

          <div className="relative min-h-0 self-stretch lg:flex lg:items-center">
            <div className="absolute inset-0 flex items-center justify-center">
              <svg viewBox="0 0 880 520" className="h-full max-h-[560px] w-full max-w-[880px] overflow-visible" role="img" aria-label={isArabic ? 'رسم توضيحي لمسار بين وهران والجزائر' : 'Illustration du trajet entre Oran et Alger'}>
                <defs>
                  <linearGradient id="dz-route-glow" x1="0" x2="1" y1="0" y2="1">
                    <stop offset="0%" stopColor="#e8bd73" stopOpacity=".1" />
                    <stop offset="100%" stopColor="#e8bd73" stopOpacity=".9" />
                  </linearGradient>
                  <pattern id="dz-grid" width="38" height="38" patternUnits="userSpaceOnUse">
                    <circle cx="1" cy="1" r="1" fill="#fff" fillOpacity=".12" />
                  </pattern>
                </defs>
                <rect x="0" y="0" width="880" height="520" fill="url(#dz-grid)" opacity=".48" />
                <path d="M 30 442 C 195 430, 235 300, 332 312 S 437 396, 502 324 S 550 207, 640 214 S 765 292, 842 122" fill="none" stroke="#fff" strokeOpacity=".16" strokeWidth="20" strokeLinecap="round" />
                <path d={routePath} fill="none" stroke="#fff" strokeOpacity=".34" strokeWidth="2" strokeDasharray="5 11" />
                <path ref={routeRef} d={routePath} pathLength={100} fill="none" stroke="url(#dz-route-glow)" strokeWidth="4" strokeLinecap="round" strokeDasharray="100" style={{ strokeDashoffset: reducedMotion ? 0 : 100 * (1 - progress) }} />

                <g fill="#fff" fontFamily="inherit">
                  <circle cx="86" cy="422" r="5" fill="#e8bd73" />
                  <circle cx="790" cy="163" r="5" fill="#e8bd73" />
                  <text x="86" y="458" fontSize="13" letterSpacing="2" textAnchor="middle" fillOpacity=".82">ORAN</text>
                  <text x="790" y="199" fontSize="13" letterSpacing="2" textAnchor="middle" fillOpacity=".82">ALGER</text>
                  <g transform="translate(460 318)">
                    <circle r="20" fill="#0a1c17" stroke="#e8bd73" strokeOpacity=".8" />
                    <path d="M-6 3h12M-4 0l4-7 4 7M-3 6h6" fill="none" stroke="#e8bd73" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    <text x="0" y="38" fontSize="10" textAnchor="middle" fillOpacity=".72">{isArabic ? 'استراحة' : 'PAUSE'}</text>
                  </g>
                </g>

                <g ref={carRef} className={reducedMotion ? 'opacity-0' : 'opacity-100'} transform="translate(86 422)" aria-hidden="true">
                  <circle r="22" fill="#e8bd73" fillOpacity=".15" />
                  <g transform="translate(-17 -11)" fill="#f6f3ea" stroke="#12251d" strokeWidth="1.5">
                    <path d="M4 12 8 3c.7-1.5 2-2.5 4-2.5h13c2 0 3.5 1 4.5 2.7l4.5 8.8 3 2v10H1V14z" />
                    <path d="m11 4-3 7h9V3h-4c-1 0-1.8.3-2 1Zm9-1v8h10l-3.4-6.2c-.6-1.1-1.5-1.8-3-1.8z" fill="#9fb8a5" />
                    <circle cx="9" cy="24" r="3" fill="#12251d" />
                    <circle cx="30" cy="24" r="3" fill="#12251d" />
                  </g>
                </g>
              </svg>
            </div>
            <div className={`absolute bottom-2 text-[9px] text-white/45 sm:bottom-6 sm:text-[10px] ${isArabic ? 'left-0' : 'right-0'}`}>
              {isArabic ? 'رسم توضيحي للمسار، وليس خريطة ملاحة' : 'Parcours illustré · pas une carte de navigation'}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
