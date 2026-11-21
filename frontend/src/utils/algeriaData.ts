export interface Wilaya {
  code: number;
  name: string;
  name_ar: string;
  code_str: string;
}

export const WILAYAS: Wilaya[] = [
  { code: 1, code_str: '01', name: 'Adrar', name_ar: 'أدرار' },
  { code: 2, code_str: '02', name: 'Chlef', name_ar: 'الشلف' },
  { code: 3, code_str: '03', name: 'Laghouat', name_ar: 'الأغواط' },
  { code: 4, code_str: '04', name: 'Oum El Bouaghi', name_ar: 'أم البواقي' },
  { code: 5, code_str: '05', name: 'Batna', name_ar: 'باتنة' },
  { code: 6, code_str: '06', name: 'Béjaïa', name_ar: 'بجاية' },
  { code: 7, code_str: '07', name: 'Biskra', name_ar: 'بسكرة' },
  { code: 8, code_str: '08', name: 'Béchar', name_ar: 'بشار' },
  { code: 9, code_str: '09', name: 'Blida', name_ar: 'البليدة' },
  { code: 10, code_str: '10', name: 'Bouira', name_ar: 'البويرة' },
  { code: 11, code_str: '11', name: 'Tamanrasset', name_ar: 'تمنراست' },
  { code: 12, code_str: '12', name: 'Tébessa', name_ar: 'تبسة' },
  { code: 13, code_str: '13', name: 'Tlemcen', name_ar: 'تلمسان' },
  { code: 14, code_str: '14', name: 'Tiaret', name_ar: 'تيارت' },
  { code: 15, code_str: '15', name: 'Tizi Ouzou', name_ar: 'تيزي وزو' },
  { code: 16, code_str: '16', name: 'Alger', name_ar: 'الجزائر' },
  { code: 17, code_str: '17', name: 'Djelfa', name_ar: 'الجلفة' },
  { code: 18, code_str: '18', name: 'Jijel', name_ar: 'جيجل' },
  { code: 19, code_str: '19', name: 'Sétif', name_ar: 'سطيف' },
  { code: 20, code_str: '20', name: 'Saïda', name_ar: 'سعيدة' },
  { code: 21, code_str: '21', name: 'Skikda', name_ar: 'سكيكدة' },
  { code: 22, code_str: '22', name: 'Sidi Bel Abbès', name_ar: 'سيدي بلعباس' },
  { code: 23, code_str: '23', name: 'Annaba', name_ar: 'عنابة' },
  { code: 24, code_str: '24', name: 'Guelma', name_ar: 'قالمة' },
  { code: 25, code_str: '25', name: 'Constantine', name_ar: 'قسنطينة' },
  { code: 26, code_str: '26', name: 'Médéa', name_ar: 'المدية' },
  { code: 27, code_str: '27', name: 'Mostaganem', name_ar: 'مستغانم' },
  { code: 28, code_str: '28', name: 'M\'Sila', name_ar: 'المسيلة' },
  { code: 29, code_str: '29', name: 'Mascara', name_ar: 'معسكر' },
  { code: 30, code_str: '30', name: 'Ouargla', name_ar: 'ورقلة' },
  { code: 31, code_str: '31', name: 'Oran', name_ar: 'وهران' },
  { code: 32, code_str: '32', name: 'El Bayadh', name_ar: 'البيض' },
  { code: 33, code_str: '33', name: 'Illizi', name_ar: 'إليزي' },
  { code: 34, code_str: '34', name: 'Bordj Bou Arréridj', name_ar: 'برج بوعريريج' },
  { code: 35, code_str: '35', name: 'Boumerdès', name_ar: 'بومرداس' },
  { code: 36, code_str: '36', name: 'El Tarf', name_ar: 'الطارف' },
  { code: 37, code_str: '37', name: 'Tindouf', name_ar: 'تندوف' },
  { code: 38, code_str: '38', name: 'Tissemsilt', name_ar: 'تيسمسيلت' },
  { code: 39, code_str: '39', name: 'El Oued', name_ar: 'الوادي' },
  { code: 40, code_str: '40', name: 'Khenchela', name_ar: 'خنشلة' },
  { code: 41, code_str: '41', name: 'Souk Ahras', name_ar: 'سوق أهراس' },
  { code: 42, code_str: '42', name: 'Tipaza', name_ar: 'تيبازة' },
  { code: 43, code_str: '43', name: 'Mila', name_ar: 'ميلة' },
  { code: 44, code_str: '44', name: 'Aïn Defla', name_ar: 'عين الدفلى' },
  { code: 45, code_str: '45', name: 'Naâma', name_ar: 'النعامة' },
  { code: 46, code_str: '46', name: 'Aïn Témouchent', name_ar: 'عين تموشنت' },
  { code: 47, code_str: '47', name: 'Ghardaïa', name_ar: 'غرداية' },
  { code: 48, code_str: '48', name: 'Relizane', name_ar: 'غليزان' },
  { code: 49, code_str: '49', name: 'Timimoun', name_ar: 'تيميمون' },
  { code: 50, code_str: '50', name: 'Bordj Badji Mokhtar', name_ar: 'برج باجي مختار' },
  { code: 51, code_str: '51', name: 'Ouled Djellal', name_ar: 'أولاد جلال' },
  { code: 52, code_str: '52', name: 'Béni Abbès', name_ar: 'بني عباس' },
  { code: 53, code_str: '53', name: 'In Salah', name_ar: 'عين صالح' },
  { code: 54, code_str: '54', name: 'In Guezzam', name_ar: 'عين قزام' },
  { code: 55, code_str: '55', name: 'Touggourt', name_ar: 'تقرت' },
  { code: 56, code_str: '56', name: 'Djanet', name_ar: 'جانت' },
  { code: 57, code_str: '57', name: 'El M\'Ghair', name_ar: 'المغير' },
  { code: 58, code_str: '58', name: 'El Meniaa', name_ar: 'المنيعة' },
];

export const POPULAR_ROUTES = [
  { origin: 'Alger', destination: 'Oran', distance_km: 415, duration_min: 270, price_base: 1600 },
  { origin: 'Alger', destination: 'Constantine', distance_km: 390, duration_min: 260, price_base: 1500 },
  { origin: 'Alger', destination: 'Sétif', distance_km: 260, duration_min: 170, price_base: 1000 },
  { origin: 'Alger', destination: 'Annaba', distance_km: 540, duration_min: 360, price_base: 2200 },
  { origin: 'Alger', destination: 'Ghardaïa', distance_km: 600, duration_min: 420, price_base: 2500 },
  { origin: 'Oran', destination: 'Tlemcen', distance_km: 140, duration_min: 100, price_base: 600 },
  { origin: 'Constantine', destination: 'Annaba', distance_km: 160, duration_min: 110, price_base: 700 },
  { origin: 'Alger', destination: 'Béjaïa', distance_km: 240, duration_min: 180, price_base: 950 },
  { origin: 'Alger', destination: 'Tizi Ouzou', distance_km: 100, duration_min: 75, price_base: 450 },
  { origin: 'Chlef', destination: 'Alger', distance_km: 210, duration_min: 140, price_base: 850 },
];

export const estimateRouteDistance = (origin: string, destination: string): { distance_km: number; duration_min: number } => {
  const o = origin.toLowerCase();
  const d = destination.toLowerCase();

  const match = POPULAR_ROUTES.find(
    (r) =>
      (o.includes(r.origin.toLowerCase()) && d.includes(r.destination.toLowerCase())) ||
      (d.includes(r.origin.toLowerCase()) && o.includes(r.destination.toLowerCase()))
  );

  if (match) {
    return { distance_km: match.distance_km, duration_min: match.duration_min };
  }

  // Default heuristic for Algerian roads
  return { distance_km: 320, duration_min: 220 };
};

export const calculatePrices = (basePrice: number) => {
  // Algerian Business Rules:
  // 1. Commission = 15% of base price
  // 2. Standard passenger price = base * 1.15
  // 3. Comfort surcharge = 30% of base price
  // 4. Comfort passenger price = base * (1 + 0.15 + 0.30) = base * 1.45
  const commission = Math.round(basePrice * 0.15);
  const passengerStandard = Math.round(basePrice * 1.15);
  const comfortSurcharge = Math.round(basePrice * 0.30);
  const passengerComfort = passengerStandard + comfortSurcharge;

  return {
    basePrice,
    commission,
    passengerStandard,
    comfortSurcharge,
    passengerComfort,
    driverPayout: basePrice,
  };
};

export const NAFTAL_FUEL_PRICES = {
  essence: 45.62,
  diesel: 29.01,
  gpl: 9.00,
};

export const estimateFuelCost = (distance_km: number, fuel_type: 'essence' | 'diesel' | 'gpl' = 'essence', seats: number = 3) => {
  const consumptionLiters = (distance_km * 8) / 100;
  const pricePerLiter = NAFTAL_FUEL_PRICES[fuel_type] || 45.62;
  const totalCost = Math.round(consumptionLiters * pricePerLiter * 100) / 100;
  const perSeatSuggested = Math.round((totalCost / Math.max(1, seats)) * 100) / 100;

  return {
    distance_km,
    fuel_type,
    consumption_liters: Math.round(consumptionLiters * 10) / 10,
    price_per_liter: pricePerLiter,
    total_fuel_cost: totalCost,
    suggested_seat_contribution: perSeatSuggested,
  };
};
