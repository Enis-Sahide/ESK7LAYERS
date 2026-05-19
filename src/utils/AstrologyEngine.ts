import { GeoVector, Ecliptic, MakeTime, Body, Rotation_EQJ_EQD, Rotation_EQD_ECL, RotateVector, SphereFromVector } from 'astronomy-engine';

export type ZodiacSign = 'Koç' | 'Boğa' | 'İkizler' | 'Yengeç' | 'Aslan' | 'Başak' | 'Terazi' | 'Akrep' | 'Yay' | 'Oğlak' | 'Kova' | 'Balık';
export type Planet = 'Güneş' | 'Ay' | 'Merkür' | 'Venüs' | 'Mars' | 'Jüpiter' | 'Satürn' | 'Uranüs' | 'Neptün' | 'Plüton';

export interface AstroPoint {
  name: string;
  longitude: number;
  sign: ZodiacSign;
  degreeInSign: number;
  minutes: number;
  house: number;
  isRetrograde?: boolean;
}

export interface AstroAspect {
  planet1: string;
  planet2: string;
  type: 'Kavuşum' | 'Sekstil' | 'Kare' | 'Üçgen' | 'Karşıt' | 'Görmeyen';
  orb: number;
  isExact: boolean;
}

export interface NatalChartData {
  planets: AstroPoint[];
  ascendant: AstroPoint;
  midheaven: AstroPoint;
  houses: AstroPoint[]; // cusps of 12 houses (Whole Sign)
  aspects: AstroAspect[];
}

export const ZODIAC_SIGNS: ZodiacSign[] = [
  'Koç', 'Boğa', 'İkizler', 'Yengeç', 'Aslan', 'Başak', 'Terazi', 'Akrep', 'Yay', 'Oğlak', 'Kova', 'Balık'
];

export interface AstroCity { name: string; lat: number; lon: number; country: string; tz: string; }

export const ASTRO_CITIES: AstroCity[] = [
  { name: 'Adana', lat: 37.0000, lon: 35.3213, country: 'Türkiye', tz: 'Europe/Istanbul' },
  { name: 'Adıyaman', lat: 37.7648, lon: 38.2786, country: 'Türkiye', tz: 'Europe/Istanbul' },
  { name: 'Afyonkarahisar', lat: 38.7507, lon: 30.5567, country: 'Türkiye', tz: 'Europe/Istanbul' },
  { name: 'Ağrı', lat: 39.7191, lon: 43.0503, country: 'Türkiye', tz: 'Europe/Istanbul' },
  { name: 'Amasya', lat: 40.6499, lon: 35.8353, country: 'Türkiye', tz: 'Europe/Istanbul' },
  { name: 'Ankara', lat: 39.9334, lon: 32.8597, country: 'Türkiye', tz: 'Europe/Istanbul' },
  { name: 'Antalya', lat: 36.8969, lon: 30.7133, country: 'Türkiye', tz: 'Europe/Istanbul' },
  { name: 'Artvin', lat: 41.1828, lon: 41.8183, country: 'Türkiye', tz: 'Europe/Istanbul' },
  { name: 'Aydın', lat: 37.8380, lon: 27.8456, country: 'Türkiye', tz: 'Europe/Istanbul' },
  { name: 'Balıkesir', lat: 39.6484, lon: 27.8826, country: 'Türkiye', tz: 'Europe/Istanbul' },
  { name: 'Bilecik', lat: 40.1451, lon: 29.9799, country: 'Türkiye', tz: 'Europe/Istanbul' },
  { name: 'Bingöl', lat: 38.8847, lon: 40.4939, country: 'Türkiye', tz: 'Europe/Istanbul' },
  { name: 'Bitlis', lat: 38.4006, lon: 42.1095, country: 'Türkiye', tz: 'Europe/Istanbul' },
  { name: 'Bolu', lat: 40.7392, lon: 31.6116, country: 'Türkiye', tz: 'Europe/Istanbul' },
  { name: 'Burdur', lat: 37.7183, lon: 30.2823, country: 'Türkiye', tz: 'Europe/Istanbul' },
  { name: 'Bursa', lat: 40.1828, lon: 29.0667, country: 'Türkiye', tz: 'Europe/Istanbul' },
  { name: 'Çanakkale', lat: 40.1553, lon: 26.4142, country: 'Türkiye', tz: 'Europe/Istanbul' },
  { name: 'Çankırı', lat: 40.6013, lon: 33.6134, country: 'Türkiye', tz: 'Europe/Istanbul' },
  { name: 'Çorum', lat: 40.5506, lon: 34.9556, country: 'Türkiye', tz: 'Europe/Istanbul' },
  { name: 'Denizli', lat: 37.7765, lon: 29.0864, country: 'Türkiye', tz: 'Europe/Istanbul' },
  { name: 'Diyarbakır', lat: 37.9144, lon: 40.2306, country: 'Türkiye', tz: 'Europe/Istanbul' },
  { name: 'Edirne', lat: 41.6771, lon: 26.5557, country: 'Türkiye', tz: 'Europe/Istanbul' },
  { name: 'Elazığ', lat: 38.6748, lon: 39.2225, country: 'Türkiye', tz: 'Europe/Istanbul' },
  { name: 'Erzincan', lat: 39.7500, lon: 39.5000, country: 'Türkiye', tz: 'Europe/Istanbul' },
  { name: 'Erzurum', lat: 39.9043, lon: 41.2679, country: 'Türkiye', tz: 'Europe/Istanbul' },
  { name: 'Eskişehir', lat: 39.7767, lon: 30.5206, country: 'Türkiye', tz: 'Europe/Istanbul' },
  { name: 'Gaziantep', lat: 37.0662, lon: 37.3833, country: 'Türkiye', tz: 'Europe/Istanbul' },
  { name: 'Giresun', lat: 40.9128, lon: 38.3895, country: 'Türkiye', tz: 'Europe/Istanbul' },
  { name: 'Gümüşhane', lat: 40.4600, lon: 39.4817, country: 'Türkiye', tz: 'Europe/Istanbul' },
  { name: 'Hakkari', lat: 37.5744, lon: 43.7408, country: 'Türkiye', tz: 'Europe/Istanbul' },
  { name: 'Hatay', lat: 36.2000, lon: 36.1667, country: 'Türkiye', tz: 'Europe/Istanbul' },
  { name: 'Isparta', lat: 37.7648, lon: 30.5566, country: 'Türkiye', tz: 'Europe/Istanbul' },
  { name: 'Mersin', lat: 36.8000, lon: 34.6333, country: 'Türkiye', tz: 'Europe/Istanbul' },
  { name: 'İstanbul', lat: 41.0082, lon: 28.9784, country: 'Türkiye', tz: 'Europe/Istanbul' },
  { name: 'İzmir', lat: 38.4192, lon: 27.1287, country: 'Türkiye', tz: 'Europe/Istanbul' },
  { name: 'Kars', lat: 40.6013, lon: 43.0975, country: 'Türkiye', tz: 'Europe/Istanbul' },
  { name: 'Kastamonu', lat: 41.3781, lon: 33.7753, country: 'Türkiye', tz: 'Europe/Istanbul' },
  { name: 'Kayseri', lat: 38.7312, lon: 35.4787, country: 'Türkiye', tz: 'Europe/Istanbul' },
  { name: 'Kırklareli', lat: 41.7333, lon: 27.2167, country: 'Türkiye', tz: 'Europe/Istanbul' },
  { name: 'Kırşehir', lat: 39.1425, lon: 34.1709, country: 'Türkiye', tz: 'Europe/Istanbul' },
  { name: 'Kocaeli', lat: 40.8533, lon: 29.8815, country: 'Türkiye', tz: 'Europe/Istanbul' },
  { name: 'Konya', lat: 37.8667, lon: 32.4833, country: 'Türkiye', tz: 'Europe/Istanbul' },
  { name: 'Kütahya', lat: 39.4167, lon: 29.9833, country: 'Türkiye', tz: 'Europe/Istanbul' },
  { name: 'Malatya', lat: 38.3552, lon: 38.3095, country: 'Türkiye', tz: 'Europe/Istanbul' },
  { name: 'Manisa', lat: 38.6191, lon: 27.4289, country: 'Türkiye', tz: 'Europe/Istanbul' },
  { name: 'Kahramanmaraş', lat: 37.5858, lon: 36.9371, country: 'Türkiye', tz: 'Europe/Istanbul' },
  { name: 'Mardin', lat: 37.3131, lon: 40.7436, country: 'Türkiye', tz: 'Europe/Istanbul' },
  { name: 'Muğla', lat: 37.2153, lon: 28.3636, country: 'Türkiye', tz: 'Europe/Istanbul' },
  { name: 'Muş', lat: 38.7304, lon: 41.4990, country: 'Türkiye', tz: 'Europe/Istanbul' },
  { name: 'Nevşehir', lat: 38.6244, lon: 34.7144, country: 'Türkiye', tz: 'Europe/Istanbul' },
  { name: 'Niğde', lat: 37.9667, lon: 34.6833, country: 'Türkiye', tz: 'Europe/Istanbul' },
  { name: 'Ordu', lat: 40.9862, lon: 37.8797, country: 'Türkiye', tz: 'Europe/Istanbul' },
  { name: 'Rize', lat: 41.0201, lon: 40.5234, country: 'Türkiye', tz: 'Europe/Istanbul' },
  { name: 'Sakarya', lat: 40.7569, lon: 30.3783, country: 'Türkiye', tz: 'Europe/Istanbul' },
  { name: 'Samsun', lat: 41.2867, lon: 36.3300, country: 'Türkiye', tz: 'Europe/Istanbul' },
  { name: 'Siirt', lat: 37.9333, lon: 41.9500, country: 'Türkiye', tz: 'Europe/Istanbul' },
  { name: 'Sinop', lat: 42.0231, lon: 35.1531, country: 'Türkiye', tz: 'Europe/Istanbul' },
  { name: 'Sivas', lat: 39.7477, lon: 37.0179, country: 'Türkiye', tz: 'Europe/Istanbul' },
  { name: 'Tekirdağ', lat: 40.9833, lon: 27.5167, country: 'Türkiye', tz: 'Europe/Istanbul' },
  { name: 'Tokat', lat: 40.3167, lon: 36.5500, country: 'Türkiye', tz: 'Europe/Istanbul' },
  { name: 'Trabzon', lat: 41.0015, lon: 39.7178, country: 'Türkiye', tz: 'Europe/Istanbul' },
  { name: 'Tunceli', lat: 39.1079, lon: 39.5401, country: 'Türkiye', tz: 'Europe/Istanbul' },
  { name: 'Şanlıurfa', lat: 37.1674, lon: 38.7955, country: 'Türkiye', tz: 'Europe/Istanbul' },
  { name: 'Uşak', lat: 38.6823, lon: 29.4082, country: 'Türkiye', tz: 'Europe/Istanbul' },
  { name: 'Van', lat: 38.4891, lon: 43.3897, country: 'Türkiye', tz: 'Europe/Istanbul' },
  { name: 'Yozgat', lat: 39.8181, lon: 34.8147, country: 'Türkiye', tz: 'Europe/Istanbul' },
  { name: 'Zonguldak', lat: 41.4564, lon: 31.7762, country: 'Türkiye', tz: 'Europe/Istanbul' },
  { name: 'Aksaray', lat: 38.3687, lon: 34.0370, country: 'Türkiye', tz: 'Europe/Istanbul' },
  { name: 'Bayburt', lat: 40.2552, lon: 40.2249, country: 'Türkiye', tz: 'Europe/Istanbul' },
  { name: 'Karaman', lat: 37.1811, lon: 33.2222, country: 'Türkiye', tz: 'Europe/Istanbul' },
  { name: 'Kırıkkale', lat: 39.8468, lon: 33.5153, country: 'Türkiye', tz: 'Europe/Istanbul' },
  { name: 'Batman', lat: 37.8812, lon: 41.1351, country: 'Türkiye', tz: 'Europe/Istanbul' },
  { name: 'Şırnak', lat: 37.5228, lon: 42.4594, country: 'Türkiye', tz: 'Europe/Istanbul' },
  { name: 'Bartın', lat: 41.6344, lon: 32.3375, country: 'Türkiye', tz: 'Europe/Istanbul' },
  { name: 'Ardahan', lat: 41.1105, lon: 42.7022, country: 'Türkiye', tz: 'Europe/Istanbul' },
  { name: 'Iğdır', lat: 39.9237, lon: 44.0450, country: 'Türkiye', tz: 'Europe/Istanbul' },
  { name: 'Yalova', lat: 40.6500, lon: 29.2667, country: 'Türkiye', tz: 'Europe/Istanbul' },
  { name: 'Karabük', lat: 41.2061, lon: 32.6204, country: 'Türkiye', tz: 'Europe/Istanbul' },
  { name: 'Kilis', lat: 36.7184, lon: 37.1147, country: 'Türkiye', tz: 'Europe/Istanbul' },
  { name: 'Osmaniye', lat: 37.0742, lon: 36.2475, country: 'Türkiye', tz: 'Europe/Istanbul' },
  { name: 'Düzce', lat: 40.8438, lon: 31.1565, country: 'Türkiye', tz: 'Europe/Istanbul' },
  { name: 'Berlin', lat: 52.5200, lon: 13.4050, country: 'Almanya', tz: 'Europe/Berlin' },
  { name: 'Münih', lat: 48.1351, lon: 11.5820, country: 'Almanya', tz: 'Europe/Berlin' },
  { name: 'Hamburg', lat: 53.5511, lon: 9.9937, country: 'Almanya', tz: 'Europe/Berlin' },
  { name: 'Frankfurt', lat: 50.1109, lon: 8.6821, country: 'Almanya', tz: 'Europe/Berlin' },
  { name: 'Köln', lat: 50.9375, lon: 6.9603, country: 'Almanya', tz: 'Europe/Berlin' },
  { name: 'New York', lat: 40.7128, lon: -74.0060, country: 'Amerika Birleşik Devletleri', tz: 'America/New_York' },
  { name: 'Los Angeles', lat: 34.0522, lon: -118.2437, country: 'Amerika Birleşik Devletleri', tz: 'America/Los_Angeles' },
  { name: 'Chicago', lat: 41.8781, lon: -87.6298, country: 'Amerika Birleşik Devletleri', tz: 'America/Chicago' },
  { name: 'Londra', lat: 51.5074, lon: -0.1278, country: 'İngiltere', tz: 'Europe/London' },
  { name: 'Manchester', lat: 53.4808, lon: -2.2426, country: 'İngiltere', tz: 'Europe/London' },
  { name: 'Paris', lat: 48.8566, lon: 2.3522, country: 'Fransa', tz: 'Europe/Paris' },
  { name: 'Lyon', lat: 45.7640, lon: 4.8357, country: 'Fransa', tz: 'Europe/Paris' },
  { name: 'Amsterdam', lat: 52.3676, lon: 4.9041, country: 'Hollanda', tz: 'Europe/Amsterdam' },
  { name: 'Viyana', lat: 48.2082, lon: 16.3738, country: 'Avusturya', tz: 'Europe/Vienna' },
  { name: 'Brüksel', lat: 50.8503, lon: 4.3517, country: 'Belçika', tz: 'Europe/Brussels' },
  { name: 'Zürih', lat: 47.3769, lon: 8.5417, country: 'İsviçre', tz: 'Europe/Zurich' },
  { name: 'Cenevre', lat: 46.2044, lon: 6.1432, country: 'İsviçre', tz: 'Europe/Zurich' },
  { name: 'Bakü', lat: 40.4093, lon: 49.8671, country: 'Azerbaycan', tz: 'Asia/Baku' },
  { name: 'Lefkoşa', lat: 35.1856, lon: 33.3823, country: 'Kıbrıs', tz: 'Asia/Nicosia' },
  { name: 'Girne', lat: 35.3361, lon: 33.3150, country: 'Kıbrıs', tz: 'Asia/Nicosia' },
  { name: 'Bilinmeyen Şehir', lat: 41.0082, lon: 28.9784, country: 'Türkiye', tz: 'Europe/Istanbul' }
];

function mod360(x: number) {
  return ((x % 360) + 360) % 360;
}

// Gets the sign and exact degree within the sign (0-30) from an absolute 0-360 longitude
export function getSignAndDegree(longitude: number): { sign: ZodiacSign, degreeInSign: number, minutes: number, signIndex: number } {
  const lon = mod360(longitude);
  const signIndex = Math.floor(lon / 30);
  const decimalDegree = lon % 30;
  const degreeInSign = Math.floor(decimalDegree);
  const minutes = Math.floor((decimalDegree - degreeInSign) * 60);
  
  return {
    sign: ZODIAC_SIGNS[signIndex],
    degreeInSign,
    minutes,
    signIndex
  };
}

// Calculate Julian Date (Standard Astronomical JD)
function getJulianDate(date: Date): number {
  return (date.getTime() / 86400000.0) + 2440587.5;
}

// Compute Greenwhich Mean Sidereal Time (GMST) in degrees
function getGMST(jd: number): number {
  const t = (jd - 2451545.0) / 36525.0;
  let gmst = 280.46061837 + 360.98564736629 * (jd - 2451545.0) + 0.000387933 * t * t - (t * t * t) / 38710000.0;
  return mod360(gmst);
}

// Calculate Exact ASC, MC, and LST
export function calculateAngles(date: Date, lat: number, lon: number) {
  const jd = getJulianDate(date);
  const gmst = getGMST(jd);
  
  // Local Sidereal Time
  const lst = mod360(gmst + lon);

  // Ecliptic Obliquity (approximate for modern era)
  const T = (jd - 2451545.0) / 36525.0;
  const eps = 23.43929111 - 0.013004167 * T - 0.000000164 * T * T + 0.000000504 * T * T * T;
  
  const epsRad = eps * Math.PI / 180;
  const latRad = lat * Math.PI / 180;
  const lstRad = lst * Math.PI / 180;

  // Exact Midheaven (MC) Calculation
  // tan(MC) = sin(LST) / (cos(LST) * cos(eps))
  const mcY = Math.sin(lstRad);
  const mcX = Math.cos(lstRad) * Math.cos(epsRad);
  const mcDeg = mod360(Math.atan2(mcY, mcX) * 180 / Math.PI);
  
  // Exact Ascendant (ASC) Calculation
  // tan(ASC) = cos(LST) / (-sin(LST) * cos(eps) - tan(lat) * sin(eps))
  const ascY = Math.cos(lstRad);
  const ascX = -(Math.sin(lstRad) * Math.cos(epsRad) + Math.tan(latRad) * Math.sin(epsRad));
  const ascDeg = mod360(Math.atan2(ascY, ascX) * 180 / Math.PI);
  
  return { mcDeg, ascDeg, lst, eps };
}

// Placidus House System Iteration (Meeus Algorithm)
function placidusIterate(ramcDeg: number, latDeg: number, epsRad: number, cuspOffset: number, A_factor: number): number {
  const deg2rad = Math.PI / 180;
  const rad2deg = 180 / Math.PI;
  const L = latDeg * deg2rad;
  let R = mod360(ramcDeg + cuspOffset);
  let alpha = R * deg2rad;
  
  for(let i=0; i<100; i++) {
    let delta = Math.asin(Math.sin(epsRad) * Math.sin(alpha));
    let tanLtanD = Math.tan(L) * Math.tan(delta);
    
    // Polar limit fallback (if iteration fails at high latitudes, fallback to Porphyry for this cusp)
    if (Math.abs(tanLtanD) > 1) return -1;
    
    let A = Math.asin(tanLtanD);
    let nextAlpha = (R * deg2rad) + A * A_factor;
    
    if (Math.abs(nextAlpha - alpha) < 0.000001) {
      alpha = nextAlpha;
      break;
    }
    alpha = nextAlpha;
  }
  
  // Convert Right Ascension (alpha) to Ecliptic Longitude (lambda)
  let y = Math.sin(alpha) * Math.cos(epsRad);
  let x = Math.cos(alpha);
  let lambda = Math.atan2(y, x) * rad2deg;
  return mod360(lambda);
}

// Calculate House Cusps using Placidus System
function calculatePlacidusCusps(mcDeg: number, ascDeg: number, lst: number, lat: number, eps: number): number[] {
  const cusps = new Array(13).fill(0);
  const epsRad = eps * Math.PI / 180;

  cusps[1] = ascDeg;
  cusps[10] = mcDeg;
  cusps[4] = mod360(mcDeg + 180);
  cusps[7] = mod360(ascDeg + 180);

  // Cusp 11, 12, 2, 3 calculations
  const c11 = placidusIterate(lst, lat, epsRad, 30, 1/3);
  const c12 = placidusIterate(lst, lat, epsRad, 60, 2/3);
  const c2 = placidusIterate(lst, lat, epsRad, 120, 2/3);
  const c3 = placidusIterate(lst, lat, epsRad, 150, 1/3);

  // If Placidus iteration fails (beyond polar circles), fallback to Porphyry division
  if (c11 === -1 || c12 === -1 || c2 === -1 || c3 === -1) {
    const q1 = mod360(ascDeg - mcDeg);
    const q2 = mod360(cusps[4] - ascDeg);
    cusps[11] = mod360(mcDeg + q1 / 3);
    cusps[12] = mod360(mcDeg + 2 * q1 / 3);
    cusps[2] = mod360(ascDeg + q2 / 3);
    cusps[3] = mod360(ascDeg + 2 * q2 / 3);
  } else {
    cusps[11] = c11;
    cusps[12] = c12;
    cusps[2] = c2;
    cusps[3] = c3;
  }

  cusps[5] = mod360(cusps[11] + 180);
  cusps[6] = mod360(cusps[12] + 180);
  cusps[8] = mod360(cusps[2] + 180);
  cusps[9] = mod360(cusps[3] + 180);

  return cusps;
}

function getHouseForLon(lon: number, cusps: number[]): number {
  for (let i = 1; i <= 12; i++) {
    const cusp = cusps[i];
    const nextCusp = i === 12 ? cusps[1] : cusps[i + 1];
    
    const distance = mod360(nextCusp - cusp);
    const pos = mod360(lon - cusp);
    
    if (pos < distance) {
      return i;
    }
  }
  return 1;
}

// Aspect engine
export function calculateAspects(planets: AstroPoint[]): AstroAspect[] {
  const aspects: AstroAspect[] = [];
  const orbs = {
    'Kavuşum': 10,
    'Karşıt': 10,
    'Üçgen': 8,
    'Kare': 8,
    'Sekstil': 6,
    'Görmeyen': 4
  };

  for (let i = 0; i < planets.length; i++) {
    for (let j = i + 1; j < planets.length; j++) {
      const p1 = planets[i];
      const p2 = planets[j];
      
      let diff = Math.abs(p1.longitude - p2.longitude);
      if (diff > 180) diff = 360 - diff;

      let type: AstroAspect['type'] | null = null;
      let exactOrb = 0;

      if (diff <= orbs['Kavuşum']) { type = 'Kavuşum'; exactOrb = diff; }
      else if (Math.abs(diff - 180) <= orbs['Karşıt']) { type = 'Karşıt'; exactOrb = Math.abs(diff - 180); }
      else if (Math.abs(diff - 150) <= orbs['Görmeyen']) { type = 'Görmeyen'; exactOrb = Math.abs(diff - 150); }
      else if (Math.abs(diff - 120) <= orbs['Üçgen']) { type = 'Üçgen'; exactOrb = Math.abs(diff - 120); }
      else if (Math.abs(diff - 90) <= orbs['Kare']) { type = 'Kare'; exactOrb = Math.abs(diff - 90); }
      else if (Math.abs(diff - 60) <= orbs['Sekstil']) { type = 'Sekstil'; exactOrb = Math.abs(diff - 60); }

      if (type) {
        aspects.push({
          planet1: p1.name,
          planet2: p2.name,
          type,
          orb: exactOrb,
          isExact: exactOrb <= 1.0
        });
      }
    }
  }
  return aspects;
}

export function generateAstrologyChart(birthDate: Date, cityKey: string, isDraconic: boolean = false): NatalChartData {
  const city = ASTRO_CITIES.find(c => c.name === cityKey) || { name: 'İstanbul', lat: 41.0082, lon: 28.9784, country: 'Türkiye', tz: 'Europe/Istanbul' };
  const astroTime = MakeTime(birthDate);

  // 1. Calculate Exact Angles
  const { mcDeg, ascDeg, lst, eps } = calculateAngles(birthDate, city.lat, city.lon);
  
  const ascData = getSignAndDegree(ascDeg);
  const ascendant: AstroPoint = {
    name: 'Yükselen (ASC)',
    longitude: ascDeg,
    sign: ascData.sign,
    degreeInSign: ascData.degreeInSign,
    minutes: ascData.minutes,
    house: 1
  };

  const mcData = getSignAndDegree(mcDeg);
  const midheaven: AstroPoint = {
    name: 'Tepe Noktası (MC)',
    longitude: mcDeg,
    sign: mcData.sign,
    degreeInSign: mcData.degreeInSign,
    minutes: mcData.minutes,
    house: 10
  };

  // 2. Astrokora Placidus House Cusps
  const cuspDegrees = calculatePlacidusCusps(mcDeg, ascDeg, lst, city.lat, eps);
  const houses: AstroPoint[] = [];
  for (let i = 1; i <= 12; i++) {
    const data = getSignAndDegree(cuspDegrees[i]);
    houses.push({
      name: `${i}. Ev`,
      longitude: cuspDegrees[i],
      sign: data.sign,
      degreeInSign: data.degreeInSign,
      minutes: data.minutes,
      house: i
    });
  }

  // 3. Planets
  const bodyMap: { name: Planet, body: Body }[] = [
    { name: 'Güneş', body: Body.Sun },
    { name: 'Ay', body: Body.Moon },
    { name: 'Merkür', body: Body.Mercury },
    { name: 'Venüs', body: Body.Venus },
    { name: 'Mars', body: Body.Mars },
    { name: 'Jüpiter', body: Body.Jupiter },
    { name: 'Satürn', body: Body.Saturn },
    { name: 'Uranüs', body: Body.Uranus },
    { name: 'Neptün', body: Body.Neptune },
    { name: 'Plüton', body: Body.Pluto }
  ];

  const planets: AstroPoint[] = [];
  
  const rot1 = Rotation_EQJ_EQD(astroTime);
  const rot2 = Rotation_EQD_ECL(astroTime);

  // For retrograde calculation, time slightly in the future
  const futureDate = new Date(birthDate.getTime() + 86400000); // +1 day
  const futureTime = MakeTime(futureDate);
  const futureRot1 = Rotation_EQJ_EQD(futureTime);
  const futureRot2 = Rotation_EQD_ECL(futureTime);

  for (const p of bodyMap) {
    const vec = GeoVector(p.body, astroTime, true); 
    const eqd = RotateVector(rot1, vec);
    const ecl = RotateVector(rot2, eqd);
    const sph = SphereFromVector(ecl);
    const lon = mod360(sph.lon);
    
    // Retrograde check (Skip for Sun and Moon)
    let isRetrograde = false;
    if (p.body !== Body.Sun && p.body !== Body.Moon) {
      const futureVec = GeoVector(p.body, futureTime, true);
      const futureEqd = RotateVector(futureRot1, futureVec);
      const futureEcl = RotateVector(futureRot2, futureEqd);
      const futureSph = SphereFromVector(futureEcl);
      const futureLon = mod360(futureSph.lon);
      
      let diff = futureLon - lon;
      if (diff > 180) diff -= 360;
      if (diff < -180) diff += 360;
      
      if (diff < 0) isRetrograde = true;
    }

    const data = getSignAndDegree(lon);
    
    planets.push({
      name: p.name,
      longitude: lon,
      sign: data.sign,
      degreeInSign: data.degreeInSign,
      minutes: data.minutes,
      house: getHouseForLon(lon, cuspDegrees),
      isRetrograde
    });
  }

  // 4. Derived & Esoteric Points
  // a) Kuzey Ay Düğümü (Mean Node Approximation)
  const jd = getJulianDate(birthDate);
  const daysSinceJ2000 = jd - 2451545.0;
  const northNodeLon = mod360(125.04452 - 0.0529539 * daysSinceJ2000);
  const nnData = getSignAndDegree(northNodeLon);
  planets.push({
    name: 'Kuzey Ay Düğümü',
    longitude: northNodeLon,
    sign: nnData.sign,
    degreeInSign: nnData.degreeInSign,
    minutes: nnData.minutes,
    house: getHouseForLon(northNodeLon, cuspDegrees),
    isRetrograde: true // Nodes are almost always retrograde
  });

  // b) Vertex (Intersection of Prime Vertical and Ecliptic in the West)
  const vertexLst = mod360(lst + 180);
  const vertexLat = 90 - city.lat; // Co-latitude for Northern Hemisphere
  const vertexLstRad = vertexLst * Math.PI / 180;
  const vertexLatRad = vertexLat * Math.PI / 180;
  const epsRadLocal = eps * Math.PI / 180;
  const vY = Math.cos(vertexLstRad);
  const vX = -(Math.sin(vertexLstRad) * Math.cos(epsRadLocal) + Math.tan(vertexLatRad) * Math.sin(epsRadLocal));
  const vertexDeg = mod360(Math.atan2(vY, vX) * 180 / Math.PI);
  const vxData = getSignAndDegree(vertexDeg);
  planets.push({
    name: 'Vertex (Vx)',
    longitude: vertexDeg,
    sign: vxData.sign,
    degreeInSign: vxData.degreeInSign,
    minutes: vxData.minutes,
    house: getHouseForLon(vertexDeg, cuspDegrees)
  });

  // c) Pars Fortuna (Şans Noktası)
  // Day Chart: ASC + Moon - Sun. Night Chart: ASC + Sun - Moon.
  const sunPoint = planets.find(p => p.name === 'Güneş');
  const moonPoint = planets.find(p => p.name === 'Ay');
  if (sunPoint && moonPoint) {
    const isDayChart = sunPoint.house >= 7 && sunPoint.house <= 12;
    let pofDeg = 0;
    if (isDayChart) {
      pofDeg = mod360(ascDeg + moonPoint.longitude - sunPoint.longitude);
    } else {
      pofDeg = mod360(ascDeg + sunPoint.longitude - moonPoint.longitude);
    }
    const pofData = getSignAndDegree(pofDeg);
    planets.push({
      name: 'Şans Noktası (POF)',
      longitude: pofDeg,
      sign: pofData.sign,
      degreeInSign: pofData.degreeInSign,
      minutes: pofData.minutes,
      house: getHouseForLon(pofDeg, cuspDegrees)
    });
  }

  // === DRACONIC CHART TRANSFORMATION ===
  if (isDraconic) {
    const transform = (lon: number) => mod360(lon - northNodeLon);

    ascendant.longitude = transform(ascendant.longitude);
    const dAscData = getSignAndDegree(ascendant.longitude);
    ascendant.sign = dAscData.sign;
    ascendant.degreeInSign = dAscData.degreeInSign;
    ascendant.minutes = dAscData.minutes;

    midheaven.longitude = transform(midheaven.longitude);
    const dMcData = getSignAndDegree(midheaven.longitude);
    midheaven.sign = dMcData.sign;
    midheaven.degreeInSign = dMcData.degreeInSign;
    midheaven.minutes = dMcData.minutes;

    planets.forEach(p => {
      p.longitude = transform(p.longitude);
      const dData = getSignAndDegree(p.longitude);
      p.sign = dData.sign;
      p.degreeInSign = dData.degreeInSign;
      p.minutes = dData.minutes;
    });

    // Re-calculate Houses for Draconic Ascendant and MC (Fallback to Porphyry for Draconic to avoid complex lst conversions)
    const dCuspDegrees = new Array(13).fill(0);
    dCuspDegrees[1] = ascendant.longitude;
    dCuspDegrees[10] = midheaven.longitude;
    dCuspDegrees[4] = mod360(midheaven.longitude + 180);
    dCuspDegrees[7] = mod360(ascendant.longitude + 180);
    const q1 = mod360(ascendant.longitude - midheaven.longitude);
    const q2 = mod360(dCuspDegrees[4] - ascendant.longitude);
    dCuspDegrees[11] = mod360(midheaven.longitude + q1 / 3);
    dCuspDegrees[12] = mod360(midheaven.longitude + 2 * q1 / 3);
    dCuspDegrees[2] = mod360(ascendant.longitude + q2 / 3);
    dCuspDegrees[3] = mod360(ascendant.longitude + 2 * q2 / 3);
    dCuspDegrees[5] = mod360(dCuspDegrees[11] + 180);
    dCuspDegrees[6] = mod360(dCuspDegrees[12] + 180);
    dCuspDegrees[8] = mod360(dCuspDegrees[2] + 180);
    dCuspDegrees[9] = mod360(dCuspDegrees[3] + 180);

    houses.length = 0;
    for (let i = 1; i <= 12; i++) {
      const dData = getSignAndDegree(dCuspDegrees[i]);
      houses.push({
        name: `${i}. Ev`,
        longitude: dCuspDegrees[i],
        sign: dData.sign,
        degreeInSign: dData.degreeInSign,
        minutes: dData.minutes,
        house: i
      });
    }

    // Re-assign planet houses based on Draconic Cusps
    planets.forEach(p => p.house = getHouseForLon(p.longitude, dCuspDegrees));
  } else {
    // Standard Chart Assignments
    planets.forEach(p => p.house = getHouseForLon(p.longitude, cuspDegrees));
    midheaven.house = getHouseForLon(midheaven.longitude, cuspDegrees);
  }

  const aspects = calculateAspects(planets);

  return {
    planets,
    ascendant,
    midheaven,
    houses,
    aspects
  };
}
