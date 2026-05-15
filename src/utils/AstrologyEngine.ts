import { GeoVector, Ecliptic, MakeTime, Body } from 'astronomy-engine';

export type ZodiacSign = 'Koç' | 'Boğa' | 'İkizler' | 'Yengeç' | 'Aslan' | 'Başak' | 'Terazi' | 'Akrep' | 'Yay' | 'Oğlak' | 'Kova' | 'Balık';
export type Planet = 'Güneş' | 'Ay' | 'Merkür' | 'Venüs' | 'Mars' | 'Jüpiter' | 'Satürn' | 'Uranüs' | 'Neptün' | 'Plüton';

export interface AstroPoint {
  name: string;
  longitude: number;
  sign: ZodiacSign;
  degreeInSign: number;
  house: number;
  isRetrograde?: boolean;
}

export interface AstroAspect {
  planet1: string;
  planet2: string;
  type: 'Kavuşum' | 'Sekstil' | 'Kare' | 'Üçgen' | 'Karşıt';
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

// Gets the sign and exact degree within the sign (0-30) from an absolute 0-360 longitude
export function getSignAndDegree(longitude: number): { sign: ZodiacSign, degreeInSign: number, signIndex: number } {
  let lon = longitude % 360;
  if (lon < 0) lon += 360;
  
  const signIndex = Math.floor(lon / 30);
  const degreeInSign = lon % 30;
  
  return {
    sign: ZODIAC_SIGNS[signIndex],
    degreeInSign,
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
  gmst = gmst % 360;
  if (gmst < 0) gmst += 360;
  return gmst;
}

// Calculate the Ascendant based on precise latitude, longitude, and exact time
export function calculateAscendant(date: Date, lat: number, lon: number): number {
  const jd = getJulianDate(date);
  const gmst = getGMST(jd);
  
  // Local Sidereal Time
  let lst = gmst + lon;
  lst = lst % 360;
  if (lst < 0) lst += 360;

  // Ecliptic Obliquity (approximate for modern era)
  const T = (jd - 2451545.0) / 36525.0;
  const eps = 23.43929111 - 0.013004167 * T - 0.000000164 * T * T + 0.000000504 * T * T * T;
  
  const epsRad = eps * Math.PI / 180;
  const latRad = lat * Math.PI / 180;
  const lstRad = lst * Math.PI / 180;

  // Spherical trigonometry formula for Ascendant
  const y = -Math.cos(lstRad);
  const x = Math.sin(lstRad) * Math.cos(epsRad) + Math.tan(latRad) * Math.sin(epsRad);
  
  let ascRad = Math.atan2(y, x);
  let ascDeg = ascRad * 180 / Math.PI;
  
  if (ascDeg < 0) ascDeg += 360;
  return ascDeg;
}

// Aspect engine
export function calculateAspects(planets: AstroPoint[]): AstroAspect[] {
  const aspects: AstroAspect[] = [];
  const orbs = {
    'Kavuşum': 8, // 0 deg
    'Karşıt': 8,  // 180 deg
    'Üçgen': 6,   // 120 deg
    'Kare': 6,    // 90 deg
    'Sekstil': 4  // 60 deg
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

  // 1. Calculate Ascendant
  const ascLon = calculateAscendant(birthDate, city.lat, city.lon);
  const ascData = getSignAndDegree(ascLon);
  const ascendant: AstroPoint = {
    name: 'Yükselen (ASC)',
    longitude: ascLon,
    sign: ascData.sign,
    degreeInSign: ascData.degreeInSign,
    house: 1
  };

  // 2. Whole Sign Houses
  const houses: AstroPoint[] = [];
  for (let i = 0; i < 12; i++) {
    const houseSignIndex = (ascData.signIndex + i) % 12;
    const houseLon = houseSignIndex * 30; // 0 degrees of that sign
    houses.push({
      name: `${i + 1}. Ev`,
      longitude: houseLon,
      sign: ZODIAC_SIGNS[houseSignIndex],
      degreeInSign: 0,
      house: i + 1
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
  for (const p of bodyMap) {
    const vec = GeoVector(p.body, astroTime, true);
    const lon = Ecliptic(vec).elon;
    const data = getSignAndDegree(lon);
    
    planets.push({
      name: p.name,
      longitude: lon,
      sign: data.sign,
      degreeInSign: data.degreeInSign,
      house: 1 // Placeholder, will calculate below
    });
  }

  // 5. Midheaven (MC)
  const mcLon = (ascLon - 90 + 360) % 360; 
  const mcData = getSignAndDegree(mcLon);
  const midheaven: AstroPoint = {
    name: 'Tepe Noktası (MC)',
    longitude: mcLon,
    sign: mcData.sign,
    degreeInSign: mcData.degreeInSign,
    house: 1 // Placeholder
  };

  // === DRACONIC CHART TRANSFORMATION ===
  if (isDraconic) {
    const jd = getJulianDate(birthDate);
    const daysSinceJ2000 = jd - 2451545.0;
    // Mean North Node Calculation
    let northNodeLon = (125.04452 - 0.0529539 * daysSinceJ2000) % 360;
    if (northNodeLon < 0) northNodeLon += 360;

    // Transform a point
    const transform = (lon: number) => {
      let dLon = (lon - northNodeLon) % 360;
      if (dLon < 0) dLon += 360;
      return dLon;
    };

    ascendant.longitude = transform(ascendant.longitude);
    const dAscData = getSignAndDegree(ascendant.longitude);
    ascendant.sign = dAscData.sign;
    ascendant.degreeInSign = dAscData.degreeInSign;

    midheaven.longitude = transform(midheaven.longitude);
    const dMcData = getSignAndDegree(midheaven.longitude);
    midheaven.sign = dMcData.sign;
    midheaven.degreeInSign = dMcData.degreeInSign;

    planets.forEach(p => {
      p.longitude = transform(p.longitude);
      const dData = getSignAndDegree(p.longitude);
      p.sign = dData.sign;
      p.degreeInSign = dData.degreeInSign;
    });

    // Re-calculate Houses for Draconic Ascendant
    houses.length = 0;
    for (let i = 0; i < 12; i++) {
      const houseSignIndex = (dAscData.signIndex + i) % 12;
      const houseLon = houseSignIndex * 30; 
      houses.push({
        name: `${i + 1}. Ev`,
        longitude: houseLon,
        sign: ZODIAC_SIGNS[houseSignIndex],
        degreeInSign: 0,
        house: i + 1
      });
    }
  }

  // Calculate Houses for Planets and MC
  const ascSignIndex = getSignAndDegree(ascendant.longitude).signIndex;
  const getHouseForLon = (lon: number) => {
    const pSignIndex = getSignAndDegree(lon).signIndex;
    let houseNum = pSignIndex - ascSignIndex + 1;
    if (houseNum <= 0) houseNum += 12;
    return houseNum;
  };

  planets.forEach(p => p.house = getHouseForLon(p.longitude));
  midheaven.house = getHouseForLon(midheaven.longitude);

  // Calculate Aspects
  const aspects = calculateAspects(planets);

  return {
    planets,
    ascendant,
    midheaven,
    houses,
    aspects
  };
}
