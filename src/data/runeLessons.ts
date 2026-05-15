import { elderFuthark1 } from './runes/elderFuthark1';
import { elderFuthark2 } from './runes/elderFuthark2';
import { elderFuthark3 } from './runes/elderFuthark3';
import { runeBindingsData } from './runes/bindings';

export interface Rune {
  id: string | number;
  name: string;
  symbol?: string;
  meaning: string;
  usage: string;
  ritual?: string;
  stone?: string;
  plant?: string;
  tarot?: string;
  astrology?: string;
  polarity?: string;
  polarite?: string; // from our data
  mythology?: string;
  animal?: string;
  color?: string;
  element?: string;
}

export interface RuneBinding {
  id: string;
  title: string;
  description: string;
  runesUsed: string;
  usageInstructions: string;
  image?: any;
}

export const runeSymbols: Rune[] = [
  ...elderFuthark1,
  ...elderFuthark2,
  ...elderFuthark3
];

export const runeBindings: RuneBinding[] = runeBindingsData;
