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

const PLANET_DESCRIPTIONS: Record<string, string> = {
  'Sun': 'Terfi istemek, yöneticilerle görüşmek, sunum yapmak, resmi işler, dikkat çekmek ve otorite figürleriyle iletişim için çok uygundur. Canlılık ve özgüven artar.',
  'Moon': 'Ev işleri, ailevi konular, mutfak alışverişi, duygusal sohbetler, taşınmak veya kısa yolculuklar için uygundur. Ruh halinin dalgalı olabileceği, değişken işler için ideal bir saattir.',
  'Mars': 'Spora başlamak, cesaret gerektiren adımlar atmak, fiziksel efor gerektiren zorlu işleri halletmek, hakkınızı aramak ve rekabet için uygundur. Tartışmalardan ve öfkeden kaçınılmalıdır.',
  'Mercury': 'İletişim, eğitim, yazı yazmak, ticaret, sözleşme imzalamak, teknolojik aletler almak, önemli e-postalar göndermek ve zihinsel aktiviteler için en uygun saattir.',
  'Jupiter': 'Finansal yatırımlar, şans gerektiren işler, uzun yolculuklar, hukuki süreçler başlatmak, dua/meditasyon ve büyük çaplı alımlar için en şanslı ve bereketli saattir.',
  'Venus': 'Aşk meşk işleri, ilk buluşmalar, sosyalleşme, kuaför/bakım işlemleri, sanatla ilgilenmek, estetik alışverişleri yapmak ve küsleri barıştırmak için idealdir.',
  'Saturn': 'Uzun vadeli planlar yapmak, toprak/emlak işleri, borç yapılandırmak, disiplin gerektiren sıkıcı işlere odaklanmak için uygundur. Hızlı sonuç beklenen yeni başlangıçlardan kaçınılmalıdır.'
};

export const getPlanetInfo = (planet: string) => {
  return {
    name: PLANET_TR_NAMES[planet] || planet,
    color: PLANET_COLORS[planet] || '#FFFFFF',
    symbol: PLANET_SYMBOLS[planet] || '?',
    description: PLANET_DESCRIPTIONS[planet] || ''
  };
};
