import { SearchRiseSet, Body, Observer } from 'astronomy-engine';

export interface PlanetaryHour {
  index: number;
  isDay: boolean;
  planet: string;
  startTime: Date;
  endTime: Date;
}

const PLANETS = ['Saturn', 'Jupiter', 'Mars', 'Sun', 'Venus', 'Mercury', 'Moon'];

// Day of week index (0 = Sunday) to Planet index in PLANETS array
const DAY_RULERS: Record<number, number> = {
  0: 3, // Sunday -> Sun
  1: 6, // Monday -> Moon
  2: 2, // Tuesday -> Mars
  3: 5, // Wednesday -> Mercury
  4: 1, // Thursday -> Jupiter
  5: 4, // Friday -> Venus
  6: 0, // Saturday -> Saturn
};

const PLANET_TR_NAMES: Record<string, string> = {
  'Saturn': 'Satürn',
  'Jupiter': 'Jüpiter',
  'Mars': 'Mars',
  'Sun': 'Güneş',
  'Venus': 'Venüs',
  'Mercury': 'Merkür',
  'Moon': 'Ay'
};

const PLANET_COLORS: Record<string, string> = {
  'Saturn': '#A9A9A9', // Silver/Grey
  'Jupiter': '#8A2BE2', // Purple
  'Mars': '#FF3B30', // Red
  'Sun': '#FFCC00', // Gold/Yellow
  'Venus': '#34C759', // Green
  'Mercury': '#32ADE6', // Blue/Cyan
  'Moon': '#E6E6FA' // Pale Silver/White
};

const PLANET_SYMBOLS: Record<string, string> = {
  'Saturn': '♄',
  'Jupiter': '♃',
  'Mars': '♂',
  'Sun': '☉',
  'Venus': '♀',
  'Mercury': '☿',
  'Moon': '☽'
};

export const getPlanetaryHours = (date: Date, lat: number, lon: number) => {
  const observer = new Observer(lat, lon, 0);
  
  // To find the astrological day for a given date/time, we find the most recent sunrise.
  // We'll search backwards from the current time.
  const timeDate = new Date(date);
  
  let currentSunrise = SearchRiseSet(Body.Sun, observer, +1, timeDate, -1);
  if (!currentSunrise) {
    // If not found backwards within limit, try a bit later
    currentSunrise = SearchRiseSet(Body.Sun, observer, +1, new Date(timeDate.getTime() + 24 * 3600 * 1000), -1);
  }
  
  const sunriseDate = currentSunrise!.date;
  
  // Find the next sunset after this sunrise
  const currentSunset = SearchRiseSet(Body.Sun, observer, -1, new Date(sunriseDate.getTime() + 1000), 1);
  const sunsetDate = currentSunset!.date;

  // Find the next sunrise after the sunset
  const nextSunrise = SearchRiseSet(Body.Sun, observer, +1, new Date(sunsetDate.getTime() + 1000), 1);
  const nextSunriseDate = nextSunrise!.date;

  const dayLengthMs = sunsetDate.getTime() - sunriseDate.getTime();
  const nightLengthMs = nextSunriseDate.getTime() - sunsetDate.getTime();

  const dayHourMs = dayLengthMs / 12;
  const nightHourMs = nightLengthMs / 12;

  // Calculate the local day of the week of the sunrise location
  const localSunriseTime = sunriseDate.getTime() + (lon / 15) * 3600 * 1000;
  const dayOfWeek = new Date(localSunriseTime).getUTCDay();
  let currentPlanetIndex = DAY_RULERS[dayOfWeek];

  const hours: PlanetaryHour[] = [];

  // Calculate 12 Day Hours
  for (let i = 0; i < 12; i++) {
    const startTime = new Date(sunriseDate.getTime() + i * dayHourMs);
    const endTime = new Date(sunriseDate.getTime() + (i + 1) * dayHourMs);
    hours.push({
      index: i + 1,
      isDay: true,
      planet: PLANETS[currentPlanetIndex],
      startTime,
      endTime
    });
    currentPlanetIndex = (currentPlanetIndex + 1) % 7;
  }

  // Calculate 12 Night Hours
  for (let i = 0; i < 12; i++) {
    const startTime = new Date(sunsetDate.getTime() + i * nightHourMs);
    const endTime = new Date(sunsetDate.getTime() + (i + 1) * nightHourMs);
    hours.push({
      index: i + 1,
      isDay: false,
      planet: PLANETS[currentPlanetIndex],
      startTime,
      endTime
    });
    currentPlanetIndex = (currentPlanetIndex + 1) % 7;
  }

  return {
    sunrise: sunriseDate,
    sunset: sunsetDate,
    nextSunrise: nextSunriseDate,
    hours,
  };
};

export const PLANET_DAY_GUIDELINES: Record<string, { name: string; symbol: string; color: string; do: string; avoid: string }> = {
  'Sun': {
    name: 'Güneş',
    symbol: '☉',
    color: '#FFCC00',
    do: 'Terfi istemek, yöneticilerle veya otorite figürleriyle önemli görüşmeler yapmak, sunum yapmak, sahneye çıkmak, dikkat çekmek istediğiniz bir işi yayınlamak, özgüven gerektiren projelere başlamak, kişisel gelişim çalışmaları yapmak.',
    avoid: 'Gizli kalmasını istediğiniz işler yürütmek (Güneş her şeyi aydınlatır, sırlar açığa çıkar), dinlenmek ve inzivaya çekilmek (aktif enerji uykuyu veya huzuru zorlaştırır).'
  },
  'Moon': {
    name: 'Ay',
    symbol: '☽',
    color: '#E6E6FA',
    do: 'Sezgisel çalışmalar yapmak, meditasyon, aile ziyaretleri, ev temizliği, yemek pişirmek ve dekorasyon değiştirmek, halkla ilişkiler, pazarlama ve geniş kitlelere hitap eden tanıtımlar yapmak.',
    avoid: 'Uzun vadeli, istikrar ve kararlılık gerektiren büyük finansal yatırımlara başlamak (Ay hızlı değişir, kararlar çabuk dalgalanabilir), gayrimenkul alım satımı gibi kalıcılık isteyen işler başlatmak.'
  },
  'Mars': {
    name: 'Mars',
    symbol: '♂',
    color: '#FF3B30',
    do: 'Spor yapmak, ağır fiziksel antrenmanlar, zor kararlar almak, cesaret isteyen adımları atmak, rakiplerle mücadele etmek, teknik işler, tamirat yapmak.',
    avoid: 'İlişki sorunlarını konuşmak veya uzlaşma aramak (Mars öfke ve kavga getirir), ameliyat ve operasyonlar (kanama riskini artırabilir), sakinlik gerektiren meditasyonlar.'
  },
  'Mercury': {
    name: 'Merkür',
    symbol: '☿',
    color: '#32ADE6',
    do: 'Sözleşme imzalamak, anlaşmalar yapmak, e-posta göndermek, ders çalışmak, yeni bir dil öğrenmek, ticari pazarlıklar, reklam yayınlamak, teknolojik aletler satın almak, seyahate çıkmak.',
    avoid: 'Duygusal derinlik gerektiren konuşmalar yapmak (zihin çok aktiftir, kalpten ziyade mantık konuşur), zihni susturmaya çalışıp uyumak.'
  },
  'Jupiter': {
    name: 'Jüpiter',
    symbol: '♃',
    color: '#8A2BE2',
    do: 'Yeni bir iş kurmak, finansal yatırımlar yapmak, para konularını görüşmek, hukuki süreçleri başlatmak, dua/meditasyon ve büyük çaplı alımlar için en şanslı ve bereketli saattir.',
    avoid: 'Diyete başlamak (Jüpiter genişletir ve büyütür, bu saatte başlanan diyet kilo vermeyi zorlaştırıp iştahı açabilir!), gizli tutulması gereken sırları paylaşmak.'
  },
  'Venus': {
    name: 'Venüs',
    symbol: '♀',
    color: '#34C759',
    do: 'İlk randevuya çıkmak, evlilik teklif etmek, ilan-ı aşk etmek, kırgınlıkları gidermek, küslerle barışmak, kişisel bakım yaptırmak, saç kestirmek, estetik müdahaleler, sanatsal aktivitelere katılmak.',
    avoid: 'Sert disiplin gerektiren işlerle uğraşmak (Venüs tembellik ve keyif verir, odaklanmak zordur), soğuk mantıkla kararlar almaya çalışmak.'
  },
  'Saturn': {
    name: 'Satürn',
    symbol: '♄',
    color: '#A9A9A9',
    do: 'Uzun vadeli planlar yapmak, bütçe hazırlamak, sorumluluk almak, temizlik, arşivleme, temel atmak, inşaat başlatmak, yalnız kalıp derin konsantrasyon gerektiren teknik işler yapmak.',
    avoid: 'Borç para istemek, kredi başvurusu yapmak (Satürn kısıtlar, ret gelebilir), hızlı sonuç beklediğiniz işlere başlamak, eğlence/parti düzenlemek.'
  }
};

export const getPlanetInfo = (planet: string) => {
  return {
    name: PLANET_TR_NAMES[planet] || planet,
    color: PLANET_COLORS[planet] || '#FFFFFF',
    symbol: PLANET_SYMBOLS[planet] || '?',
    description: ''
  };
};
