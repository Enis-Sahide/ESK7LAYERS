// Types for Astrology API
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
  houses: AstroPoint[]; 
  aspects: AstroAspect[];
}

export const ZODIAC_SIGNS: ZodiacSign[] = [
  'Koç', 'Boğa', 'İkizler', 'Yengeç', 'Aslan', 'Başak', 'Terazi', 'Akrep', 'Yay', 'Oğlak', 'Kova', 'Balık'
];

export interface AstroCity { name: string; lat: number; lon: number; country: string; tz: string; }

export const ASTRO_CITIES: AstroCity[] = [
  { name: 'Adana', lat: 37.0000, lon: 35.3213, country: 'Türkiye', tz: 'Europe/Istanbul' },
  { name: 'Ankara', lat: 39.9334, lon: 32.8597, country: 'Türkiye', tz: 'Europe/Istanbul' },
  { name: 'Antalya', lat: 36.8969, lon: 30.7133, country: 'Türkiye', tz: 'Europe/Istanbul' },
  { name: 'Bursa', lat: 40.1828, lon: 29.0667, country: 'Türkiye', tz: 'Europe/Istanbul' },
  { name: 'Diyarbakır', lat: 37.9144, lon: 40.2306, country: 'Türkiye', tz: 'Europe/Istanbul' },
  { name: 'Erzurum', lat: 39.9043, lon: 41.2679, country: 'Türkiye', tz: 'Europe/Istanbul' },
  { name: 'İstanbul', lat: 41.0082, lon: 28.9784, country: 'Türkiye', tz: 'Europe/Istanbul' },
  { name: 'İzmir', lat: 38.4192, lon: 27.1287, country: 'Türkiye', tz: 'Europe/Istanbul' },
  { name: 'Konya', lat: 37.8667, lon: 32.4833, country: 'Türkiye', tz: 'Europe/Istanbul' },
  { name: 'Trabzon', lat: 41.0015, lon: 39.7178, country: 'Türkiye', tz: 'Europe/Istanbul' },
  { name: 'Berlin', lat: 52.5200, lon: 13.4050, country: 'Almanya', tz: 'Europe/Berlin' },
  { name: 'Londra', lat: 51.5074, lon: -0.1278, country: 'İngiltere', tz: 'Europe/London' },
  { name: 'New York', lat: 40.7128, lon: -74.0060, country: 'Amerika Birleşik Devletleri', tz: 'America/New_York' },
  { name: 'Paris', lat: 48.8566, lon: 2.3522, country: 'Fransa', tz: 'Europe/Paris' },
  { name: 'Bilinmeyen Şehir', lat: 41.0082, lon: 28.9784, country: 'Türkiye', tz: 'Europe/Istanbul' }
];

// Geliştirme aşamasında Expo mobil cihazdan kendi bilgisayarınıza bağlanabilmek için 
// 'localhost' yerine bilgisayarınızın yerel IP adresini kullanmalısınız.
const API_BASE_URL = 'http://192.168.1.9:3000/api';

export async function fetchAstrologyChart(birthDate: Date, cityKey: string = 'İstanbul'): Promise<NatalChartData> {
  try {
    const cityData = ASTRO_CITIES.find(c => c.name.toLocaleLowerCase('tr-TR') === cityKey.trim().toLocaleLowerCase('tr-TR')) || ASTRO_CITIES[0];
    const moment = require('moment-timezone');
    const m = moment.tz(birthDate, cityData.tz);
    const localDate = m.format('YYYY-MM-DD');
    const localTime = m.format('HH:mm');

    const response = await fetch(`${API_BASE_URL}/astrology/calculate`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        localDate,
        localTime,
        cityData,
        calcAllWorlds: false
      }),
    });

    const result = await response.json();

    if (!response.ok || !result.success) {
      throw new Error(result.error || 'Astroloji API isteği başarısız oldu.');
    }

    return result.data as NatalChartData;
  } catch (error) {
    console.error('fetchAstrologyChart Error:', error);
    throw error;
  }
}
