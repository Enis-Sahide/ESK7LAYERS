import { GeoVector, Ecliptic, MakeTime, Body, SearchRelativeLongitude } from 'astronomy-engine';

export type PlanetCode = 'Sun' | 'Earth' | 'Moon' | 'Mercury' | 'Venus' | 'Mars' | 'Jupiter' | 'Saturn' | 'Uranus' | 'Neptune' | 'Pluto';

export const PLANET_SYMBOLS: Record<PlanetCode, string> = {
  Sun: '☉',
  Earth: '⊕',
  Moon: '☽',
  Mercury: '☿',
  Venus: '♀',
  Mars: '♂',
  Jupiter: '♃',
  Saturn: '♄',
  Uranus: '♅',
  Neptune: '♆',
  Pluto: '♇',
};
export interface PlanetActivation {
  planet: PlanetCode;
  gate: number;
  line: number;
  longitude: number;
}

export interface HumanDesignChart {
  conscious: PlanetActivation[];
  unconscious: PlanetActivation[];
  activeGates: number[];
  activeChannels: number[];
  definedCenters: CenterCode[];
  type: string;
  authority: string;
  profile: string;
  strategy: string;
  signature: string;
  notSelfTheme: string;
  incarnationCross: string;
}

export type CenterCode = 'Head' | 'Ajna' | 'Throat' | 'G' | 'Heart' | 'Sacral' | 'Root' | 'Spleen' | 'SolarPlexus';

// Tam 64 Kapı sıralaması. Başlangıç (0. index) 41. Kapı olup Zodyak'ta Kova burcunun 2. derecesine denk gelir (302.0 derece).
const GATES_SEQUENCE = [
  41, 19, 13, 49, 30, 55, 37, 63, 22, 36, 25, 17, 21, 51, 42, 3, 27, 24, 2, 23, 8, 20, 16, 35, 45, 12, 15, 52, 39, 53, 62, 56, 31, 33, 7, 4, 29, 59, 40, 64, 47, 6, 46, 18, 48, 57, 32, 50, 28, 44, 1, 43, 14, 34, 9, 5, 26, 11, 10, 58, 38, 54, 61, 60
];

export const CHANNELS = [
  { id: 18, gates: [1, 8], centers: ['G', 'Throat'] },
  { id: 214, gates: [2, 14], centers: ['G', 'Sacral'] },
  { id: 360, gates: [3, 60], centers: ['Sacral', 'Root'] },
  { id: 463, gates: [4, 63], centers: ['Ajna', 'Head'] },
  { id: 515, gates: [5, 15], centers: ['Sacral', 'G'] },
  { id: 659, gates: [6, 59], centers: ['SolarPlexus', 'Sacral'] },
  { id: 731, gates: [7, 31], centers: ['G', 'Throat'] },
  { id: 952, gates: [9, 52], centers: ['Sacral', 'Root'] },
  { id: 1020, gates: [10, 20], centers: ['G', 'Throat'] },
  { id: 1034, gates: [10, 34], centers: ['G', 'Sacral'] },
  { id: 1057, gates: [10, 57], centers: ['G', 'Spleen'] },
  { id: 1156, gates: [11, 56], centers: ['Ajna', 'Throat'] },
  { id: 1222, gates: [12, 22], centers: ['Throat', 'SolarPlexus'] },
  { id: 1333, gates: [13, 33], centers: ['G', 'Throat'] },
  { id: 1648, gates: [16, 48], centers: ['Throat', 'Spleen'] },
  { id: 1762, gates: [17, 62], centers: ['Ajna', 'Throat'] },
  { id: 1858, gates: [18, 58], centers: ['Spleen', 'Root'] },
  { id: 1949, gates: [19, 49], centers: ['Root', 'SolarPlexus'] },
  { id: 2034, gates: [20, 34], centers: ['Throat', 'Sacral'] },
  { id: 2057, gates: [20, 57], centers: ['Throat', 'Spleen'] },
  { id: 2145, gates: [21, 45], centers: ['Heart', 'Throat'] },
  { id: 2343, gates: [23, 43], centers: ['Throat', 'Ajna'] },
  { id: 2461, gates: [24, 61], centers: ['Ajna', 'Head'] },
  { id: 2551, gates: [25, 51], centers: ['G', 'Heart'] },
  { id: 2644, gates: [26, 44], centers: ['Heart', 'Spleen'] },
  { id: 2750, gates: [27, 50], centers: ['Sacral', 'Spleen'] },
  { id: 2838, gates: [28, 38], centers: ['Spleen', 'Root'] },
  { id: 2946, gates: [29, 46], centers: ['Sacral', 'G'] },
  { id: 3041, gates: [30, 41], centers: ['SolarPlexus', 'Root'] },
  { id: 3254, gates: [32, 54], centers: ['Spleen', 'Root'] },
  { id: 3457, gates: [34, 57], centers: ['Sacral', 'Spleen'] },
  { id: 3536, gates: [35, 36], centers: ['Throat', 'SolarPlexus'] },
  { id: 3740, gates: [37, 40], centers: ['SolarPlexus', 'Heart'] },
  { id: 3955, gates: [39, 55], centers: ['Root', 'SolarPlexus'] },
  { id: 4253, gates: [42, 53], centers: ['Sacral', 'Root'] },
  { id: 4764, gates: [47, 64], centers: ['Ajna', 'Head'] }
];

const START_DEGREE = 302.000000; 
const DEGREES_PER_GATE = 360 / 64; // 5.625
const DEGREES_PER_LINE = DEGREES_PER_GATE / 6; // 0.9375

export function getGateAndLine(longitude: number): { gate: number, line: number } {
  // Longitude'u 302 derece kaydırarak Kapı 41'i 0. derece yapıyoruz
  let offsetLon = longitude - START_DEGREE;
  if (offsetLon < 0) offsetLon += 360;

  const totalLines = Math.floor(offsetLon / DEGREES_PER_LINE);
  const gateIndex = Math.floor(totalLines / 6);
  const lineIndex = totalLines % 6;

  return {
    gate: GATES_SEQUENCE[gateIndex],
    line: lineIndex + 1,
  };
}

// Güneş'in geriye dönük 88 derecelik (Tasarım/Bilinçdışı) anını hesaplar
export function calculateDesignDate(birthDate: Date): Date {
  const birthTime = MakeTime(birthDate);
  const birthSunVec = GeoVector(Body.Sun, birthTime, true);
  const birthSunLon = Ecliptic(birthSunVec).elon;
  
  // 88 Derece gerisi
  let targetLon = birthSunLon - 88.0;
  if (targetLon < 0) targetLon += 360;

  // astronomy-engine ile geçmişe doğru tarama
  // Yaklaşık 88 gün öncesini hedefliyoruz
  const approxDaysPrior = 88.5;
  const approxTime = MakeTime(new Date(birthDate.getTime() - approxDaysPrior * 24 * 60 * 60 * 1000));
  
  // Arama işlemi (1 saniye hassasiyetle Sun'ın tam o dereceye geldiği anı bul)
  // astronomy-engine SearchRelativeLongitude aslında Body.Sun için değil ay ve gezegen evreleri içindir, 
  // bunun yerine basit iteratif yaklaşım kullanalım
  let currentTarget = birthDate.getTime() - 88 * 24 * 60 * 60 * 1000;
  let step = 12 * 60 * 60 * 1000; // yarım gün
  let bestTime = currentTarget;

  for (let i = 0; i < 20; i++) {
    const t = MakeTime(new Date(bestTime));
    const vecT = GeoVector(Body.Sun, t, true);
    const lon = Ecliptic(vecT).elon;
    let diff = lon - targetLon;
    // Normalize diff to -180..180
    while (diff > 180) diff -= 360;
    while (diff < -180) diff += 360;

    // Her 1 derece = yaklaşık 1 gün
    const errorInMs = (diff / 360) * 365.25 * 24 * 60 * 60 * 1000;
    bestTime -= errorInMs;

    if (Math.abs(diff) < 0.0001) break;
  }

  return new Date(bestTime);
}

function calculatePlanets(date: Date): PlanetActivation[] {
  const time = MakeTime(date);
  const bodies: Body[] = [Body.Sun, Body.Moon, Body.Mercury, Body.Venus, Body.Mars, Body.Jupiter, Body.Saturn, Body.Uranus, Body.Neptune, Body.Pluto];
  const keys: PlanetCode[] = ['Sun', 'Moon', 'Mercury', 'Venus', 'Mars', 'Jupiter', 'Saturn', 'Uranus', 'Neptune', 'Pluto'];

  const results: PlanetActivation[] = [];

  for (let i = 0; i < bodies.length; i++) {
    const vec = GeoVector(bodies[i], time, true);
    const lon = Ecliptic(vec).elon;
    const { gate, line } = getGateAndLine(lon);
    results.push({ planet: keys[i], gate, line, longitude: lon });
  }

  // Dünya, Güneş'in tam zıttıdır (+180 derece)
  const sunLon = results.find(p => p.planet === 'Sun')?.longitude || 0;
  let earthLon = sunLon + 180;
  if (earthLon >= 360) earthLon -= 360;
  const earthGL = getGateAndLine(earthLon);
  results.push({ planet: 'Earth', gate: earthGL.gate, line: earthGL.line, longitude: earthLon });

  // İnsan Tasarımı geleneksel dizilimi
  const order: PlanetCode[] = ['Sun', 'Earth', 'Moon', 'Mercury', 'Venus', 'Mars', 'Jupiter', 'Saturn', 'Uranus', 'Neptune', 'Pluto'];
  results.sort((a, b) => order.indexOf(a.planet) - order.indexOf(b.planet));

  return results;
}

export function generateChart(birthDate: Date): HumanDesignChart {
  const designDate = calculateDesignDate(birthDate);

  const conscious = calculatePlanets(birthDate);
  const unconscious = calculatePlanets(designDate);

  const activeGatesSet = new Set<number>();
  conscious.forEach(p => activeGatesSet.add(p.gate));
  unconscious.forEach(p => activeGatesSet.add(p.gate));
  const activeGates = Array.from(activeGatesSet);

  const activeChannels: number[] = [];
  const definedCentersSet = new Set<CenterCode>();

  CHANNELS.forEach(ch => {
    if (activeGates.includes(ch.gates[0]) && activeGates.includes(ch.gates[1])) {
      activeChannels.push(ch.id);
      definedCentersSet.add(ch.centers[0] as CenterCode);
      definedCentersSet.add(ch.centers[1] as CenterCode);
    }
  });

  const definedCenters = Array.from(definedCentersSet);

  // Tip Belirleme
  let type = "Projektör";
  const hasSacral = definedCenters.includes("Sacral");
  const hasThroat = definedCenters.includes("Throat");
  const hasMotor = definedCenters.includes("Sacral") || definedCenters.includes("SolarPlexus") || definedCenters.includes("Root") || definedCenters.includes("Heart");
  
  // Boğaz'a motor bağlanmış mı kontrolü (Basit analiz)
  let motorToThroat = false;
  if (hasThroat && hasMotor) {
    CHANNELS.forEach(ch => {
      if (activeChannels.includes(ch.id)) {
        if (ch.centers.includes('Throat') && (ch.centers.includes('SolarPlexus') || ch.centers.includes('Heart') || ch.centers.includes('Root') || ch.centers.includes('Sacral'))) {
          motorToThroat = true;
        }
      }
    });
  }

  if (definedCenters.length === 0) {
    type = "Reflektör";
  } else if (hasSacral) {
    if (motorToThroat) type = "Manifesting Jeneratör";
    else type = "Jeneratör";
  } else if (motorToThroat && !hasSacral) {
    type = "Manifestör";
  } else {
    type = "Projektör";
  }

  // Otorite Belirleme
  let authority = "Ay Otoritesi (Reflektör)";
  if (definedCenters.includes("SolarPlexus")) authority = "Duygusal (Solar Pleksus)";
  else if (definedCenters.includes("Sacral")) authority = "Sakral";
  else if (definedCenters.includes("Spleen")) authority = "Dalak";
  else if (definedCenters.includes("Heart")) authority = "Ego (Kalp)";
  else if (definedCenters.includes("G")) authority = "Kendinden Gelen (G Merkezi)";
  else if (definedCenters.includes("Ajna") || definedCenters.includes("Head")) authority = "Çevresel (Zihinsel)";

  // Profil Belirleme (Bilinçli Güneş Çizgisi / Bilinçdışı Güneş Çizgisi)
  const consciousSun = conscious.find(p => p.planet === 'Sun');
  const unconsciousSun = unconscious.find(p => p.planet === 'Sun');
  const profile = consciousSun && unconsciousSun ? `${consciousSun.line}/${unconsciousSun.line}` : "Bilinmiyor";

  // Strateji, İmza ve Tema Belirleme
  let strategy = "Bilinmiyor";
  let signature = "Bilinmiyor";
  let notSelfTheme = "Bilinmiyor";

  if (type === "Manifestör") {
    strategy = "Bilgilendirmek";
    signature = "Huzur";
    notSelfTheme = "Öfke";
  } else if (type === "Jeneratör" || type === "Manifesting Jeneratör") {
    strategy = "Tepki Vermek";
    signature = "Memnuniyet";
    notSelfTheme = "Hayal Kırıklığı";
  } else if (type === "Projektör") {
    strategy = "Davet Beklemek";
    signature = "Başarı";
    notSelfTheme = "Acı / Burukluk";
  } else if (type === "Reflektör") {
    strategy = "Bir Ay Döngüsü Beklemek";
    signature = "Sürpriz";
    notSelfTheme = "Hayal Kırıklığı";
  }

  // Enkarnasyon Haçı hesaplama
  const consciousEarth = conscious.find(p => p.planet === 'Earth');
  const unconsciousEarth = unconscious.find(p => p.planet === 'Earth');
  
  let incarnationCross = "Bilinmiyor";
  if (consciousSun && consciousEarth && unconsciousSun && unconsciousEarth) {
     incarnationCross = `(${consciousSun.gate}/${consciousEarth.gate} | ${unconsciousSun.gate}/${unconsciousEarth.gate})`;
  }

  return {
    conscious,
    unconscious,
    activeGates,
    activeChannels,
    definedCenters,
    type,
    authority,
    profile,
    strategy,
    signature,
    notSelfTheme,
    incarnationCross
  };
}
