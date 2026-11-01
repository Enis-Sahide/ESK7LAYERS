export type PlanetCode = 'Sun' | 'Earth' | 'NorthNode' | 'SouthNode' | 'Moon' | 'Mercury' | 'Venus' | 'Mars' | 'Jupiter' | 'Saturn' | 'Uranus' | 'Neptune' | 'Pluto';

export const PLANET_SYMBOLS: Record<PlanetCode, string> = {
  Sun: '☉',
  Earth: '⊕',
  NorthNode: '☊',
  SouthNode: '☋',
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
  isRetrograde: boolean;
  direction: 'direct' | 'retrograde';
  fixation: 'exalted' | 'detriment' | 'none';
}

export type CenterCode = 'Head' | 'Ajna' | 'Throat' | 'G' | 'Heart' | 'Sacral' | 'Root' | 'Spleen' | 'SolarPlexus';

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

export function getGateAndLine(longitude: number): { gate: number; line: number } {
  let diff = longitude - START_DEGREE;
  if (diff < 0) diff += 360;
  diff = diff % 360;

  const gateIndex = Math.floor(diff / DEGREES_PER_GATE);
  const gate = GATES_SEQUENCE[gateIndex];
  const remainderInGate = diff - gateIndex * DEGREES_PER_GATE;
  const line = Math.floor(remainderInGate / DEGREES_PER_LINE) + 1;

  return { gate, line };
}
