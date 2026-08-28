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
    do: 'Otorite figürleriyle görüşmek, liderlik sergilemek, yaratıcı projeler başlatmak, görünür olmak, özgüven/ego dengesi çalışmaları yapmak, şifa pratikleri ve solar enerji çalışmaları.',
    avoid: 'Gizli veya arkadan iş yürütülen işler yapmak (Güneş her şeyi aydınlatır), pasif kalmak, inzivaya çekilmek ve aşırı gururlu davranmak.'
  },
  'Moon': {
    name: 'Ay',
    symbol: '☽',
    color: '#E6E6FA',
    do: 'Sezgisel ve ruhsal çalışmalar, rüya analizleri, bilinçaltı arınması, ev ve yuva düzenleesi, ailevi ilişkileri güçlendirmek, kadın figürlerle bir araya gelmek.',
    avoid: 'Kalıcı veya uzun vadeli kararlar almak, evlenmek, büyük finansal yatırımlara imza atmak (Ay\'ın değişken enerjisi istikrarsızlık getirebilir).'
  },
  'Mars': {
    name: 'Mars',
    symbol: '♂',
    color: '#FF3B30',
    do: 'Fiziksel güç, spor ve cesaret gerektiren işler, hakkını aramak ve rekabet etmek, teknik ve mekanik işlerle uğraşmak, engelleri kararlılıkla aşmak.',
    avoid: 'Ortaklık kurmak, evlilik veya barış konuşmaları yapmak (Mars öfke ve kavga enerjisini tetikler), yeni iş girişimlerinde bulunmak.'
  },
  'Mercury': {
    name: 'Merkür',
    symbol: '☿',
    color: '#32ADE6',
    do: 'Sözleşme imzalamak, anlaşmalar, eğitim almak veya vermek, ticaret, reklam ve pazarlama faaliyetleri, yazışmalar, seyahat planlamak ve teknolojik alışverişler.',
    avoid: 'Zihinsel olarak pasif kalmak, zihni susturmaya çalışmak, derin duygusal veya romantik taahhütlerde bulunmak (mantık duyguların önüne geçer).'
  },
  'Jupiter': {
    name: 'Jüpiter',
    symbol: '♃',
    color: '#8A2BE2',
    do: 'Bolluk, bereket ve şans çalışmaları, finansal yatırımlar, cömertlik ve bağış yapmak, yüksek felsefe/bilgelik eğitimleri, hukuki süreçleri başlatmak.',
    avoid: 'Diyete başlamak (Jüpiter büyüme enerjisi taşır, diyete başlamak iştahı açabilir ve kilo vermeyi zorlaştırır), borç istemek, kibre kapılmak.'
  },
  'Venus': {
    name: 'Venüs',
    symbol: '♀',
    color: '#34C759',
    do: 'İlk randevuya çıkmak, evlilik teklif etmek, ilan-ı aşk etmek, kırgınlıkları gidermek, küslerle barışmak, kişisel bakım, estetik ve sanatla ilgilenmek, hediyeleşmek ve uyum arayışı.',
    avoid: 'Sert disiplin gerektiren veya ağır fiziksel işlerle uğraşmak (Venüs tembellik ve konfor arayışı verir), ayrılık ve hesaplaşma konuşmaları yapmak.'
  },
  'Saturn': {
    name: 'Satürn',
    symbol: '♄',
    color: '#A9A9A9',
    do: 'Uzun vadeli planlama, disiplin ve sabır gerektiren işler, gayrimenkul ve toprak işleri, borç ödeme/yapılandırma, yalnız kalıp tefekkür etme, temizlik ve sadeleşme.',
    avoid: 'Borç para istemek, kredi başvurusu yapmak (Satürn kısıtlama ve engel getirir), hızlı sonuç beklenen işlere başlamak, büyük eğlenceler düzenlemek.'
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

export const getDayRulerSymbol = (date: Date): string => {
  const day = date.getDay();
  const planetIdx = DAY_RULERS[day];
  const planetName = PLANETS[planetIdx];
  return PLANET_SYMBOLS[planetName] || '';
};
