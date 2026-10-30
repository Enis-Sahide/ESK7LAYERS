export type ZodiacSign = 'Koç' | 'Boğa' | 'İkizler' | 'Yengeç' | 'Aslan' | 'Başak' | 'Terazi' | 'Akrep' | 'Yay' | 'Oğlak' | 'Kova' | 'Balık';
export type Planet = 'Güneş' | 'Ay' | 'Merkür' | 'Venüs' | 'Mars' | 'Jüpiter' | 'Satürn' | 'Uranüs' | 'Neptün' | 'Plüton' | 'Kiron' | 'Şans Noktası';

export interface AstroPoint {
  name: string;
  longitude: number;
  sign: ZodiacSign | string;
  degreeInSign: number;
  minutes: number;
  house: number;
  isRetrograde?: boolean;
}

export interface AstroAspect {
  planet1: string;
  planet2: string;
  type: 'Kavuşum' | 'Sekstil' | 'Kare' | 'Üçgen' | 'Karşıt' | 'Görmeyen' | string;
  orb: number;
  isExact: boolean;
}

export interface EsotericData {
  progressedSunSign: ZodiacSign;
  progressedSunAge: number;
  currentAge: number;
  interceptedSigns: ZodiacSign[];
}

export interface NatalChartData {
  planets: AstroPoint[];
  ascendant: AstroPoint;
  midheaven: AstroPoint;
  houses: AstroPoint[]; 
  aspects: AstroAspect[];
  esoteric?: EsotericData;
}

export interface TransitAspect {
  transitPlanet: string;
  natalPlanet: string;
  type: 'Kavuşum' | 'Sekstil' | 'Kare' | 'Üçgen' | 'Karşıt' | 'Görmeyen' | string;
  orb: number;
  isExact: boolean;
}

export interface TransitChartData {
  natalChart: NatalChartData;
  transitPlanets: AstroPoint[];
  transitAspects: TransitAspect[];
  transitTransitAspects: AstroAspect[];
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
  { name: 'San Francisco', lat: 37.7749, lon: -122.4194, country: 'Amerika Birleşik Devletleri', tz: 'America/Los_Angeles' },
  { name: 'Chicago', lat: 41.8781, lon: -87.6298, country: 'Amerika Birleşik Devletleri', tz: 'America/Chicago' },
  { name: 'Honolulu', lat: 21.3069, lon: -157.8583, country: 'Amerika Birleşik Devletleri', tz: 'Pacific/Honolulu' },
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
