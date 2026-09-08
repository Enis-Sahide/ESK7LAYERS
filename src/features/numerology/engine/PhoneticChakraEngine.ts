/**
 * PhoneticChakraEngine.ts
 * Kadim Harf Mahreçleri (Fonetik Anatomi), 4 Büyük Bedensel Rezonans Merkezi (Kalp, Karın, Boğaz, Zihin),
 * 9 Çakra Dağılımı, Ouroboros Döngü Geometrisi, Kişisel İsim Simülatörü ve Marka Akustiği Motoru.
 */

export type MahrecType = 'throat' | 'palate' | 'lip' | 'dental';
export type ElementType = 'Ateş' | 'Toprak' | 'Hava' | 'Su' | 'Eter';
export type TargetGoal = 'wealth' | 'fame' | 'love' | 'spiritual';
export type BodyCenter = 'heart' | 'stomach' | 'throat' | 'head';

export interface LetterInfo {
  char: string;
  chakra: number;
  mahrec: MahrecType;
  mahrecName: string;
  bodyCenter: BodyCenter;
  bodyCenterName: string;
  element: ElementType;
  meaning: string;
}

export interface ChakraData {
  number: number;
  name: string;
  sanskrit: string;
  domain: string;
  color: string;
  element: ElementType;
  planet: string;
  letters: string[];
}

export interface BodyCenterInfo {
  center: BodyCenter;
  name: string;
  iconName: string;
  element: string;
  color: string;
  letters: string[];
  quality: string;
  organs: string;
}

export const BODY_CENTERS_METADATA: Record<BodyCenter, BodyCenterInfo> = {
  heart: {
    center: 'heart',
    name: 'Kalp & Göğüs Rezonansı',
    iconName: 'Heart',
    element: 'Sevgi & Bereket',
    color: '#22C55E', // Yeşil
    letters: ['A', 'M', 'L', 'D', 'V'],
    quality: 'Sevgi, güven, şefkat, huzur, mülk ve kalıcı bereket (Mem kökü). Göğüs kafesini titreten derin rezonans.',
    organs: 'Göğüs Kafesi, Kalp ve Ciğer Boşluğu'
  },
  stomach: {
    center: 'stomach',
    name: 'Karın & Mide Rezonansı',
    iconName: 'Flame',
    element: 'İrade & Eylem',
    color: '#EAB308', // Altın Sarısı
    letters: ['U', 'Ü', 'O', 'Ö', 'K', 'Ç', 'C', 'T'],
    quality: 'Solar Pleksus iradesi, cesaret, ticari atılım, kararlılık ve eylem gücü. Diyaframdan patlayan sesler.',
    organs: 'Diyafram, Mide ve Alt Karın Kasları'
  },
  throat: {
    center: 'throat',
    name: 'Boğaz & İfade Rezonansı',
    iconName: 'MessageSquare',
    element: 'İfade & Görünürlük',
    color: '#06B6D4', // Turkuaz
    letters: ['E', 'H', 'N', 'B', 'P', 'W', 'Q'],
    quality: 'İfade köprüsü, kitlelere hitap, görünürlük, sesini duyurma ve dijital ağ yayılımı.',
    organs: 'Ses Telleri, Boğaz ve Gırtlak Kanalı'
  },
  head: {
    center: 'head',
    name: 'Kafa & Zihin Rezonansı',
    iconName: 'Brain',
    element: 'Sezgi & Strateji',
    color: '#A855F7', // İndigo / Mor
    letters: ['I', 'İ', 'Y', 'S', 'Ş', 'Z', 'F', 'J', 'G', 'Ğ', 'R', 'X'],
    quality: 'Zihinsel odak, sezgi, epifiz bezinde çınlama, strateji ve koruyucu manyetik kalkan.',
    organs: 'Sinüs Boşlukları, Alın ve Epifiz Bezi'
  }
};

export const CHAKRA_METADATA: Record<number, ChakraData> = {
  1: {
    number: 1,
    name: 'Kök Çakra',
    sanskrit: 'Muladhara',
    domain: 'Köklenme, Liderlik, Hayatta Kalma, Başlangıç Gücü',
    color: '#EF4444',
    element: 'Ateş',
    planet: 'Güneş / Mars',
    letters: ['A', 'J', 'S', 'Ş']
  },
  2: {
    number: 2,
    name: 'Sakral Çakra',
    sanskrit: 'Svadhisthana',
    domain: 'Çekim Gücü, Yaratıcılık, İlişkiler, Müşteri Bağı, Alma-Verme',
    color: '#F97316',
    element: 'Su',
    planet: 'Ay / Venüs',
    letters: ['B', 'K', 'T']
  },
  3: {
    number: 3,
    name: 'Solar Pleksus',
    sanskrit: 'Manipura',
    domain: 'İrade, Ticari Eylem, Parayı Yönetme, Özgüven, Büyüme',
    color: '#EAB308',
    element: 'Ateş',
    planet: 'Jüpiter / Güneş',
    letters: ['C', 'Ç', 'L', 'U', 'Ü']
  },
  4: {
    number: 4,
    name: 'Kalp Çakra',
    sanskrit: 'Anahata',
    domain: 'Güvenilirlik, Sevgi, Mülk/Bereket (Mem), Kalıcı Eser',
    color: '#22C55E',
    element: 'Toprak',
    planet: 'Venüs / Satürn',
    letters: ['D', 'M', 'V']
  },
  5: {
    number: 5,
    name: 'Boğaz Çakra',
    sanskrit: 'Vishuddha',
    domain: 'İfade, Görünürlük, Dijital Ağ, İletişim, Şöhret',
    color: '#06B6D4',
    element: 'Hava',
    planet: 'Merkür',
    letters: ['E', 'N', 'W']
  },
  6: {
    number: 6,
    name: 'Üçüncü Göz',
    sanskrit: 'Ajna',
    domain: 'Vizyon, Estetik, Sanatsal İlham, Algı, Kutsal Çember',
    color: '#3B82F6',
    element: 'Eter',
    planet: 'Venüs / Jüpiter',
    letters: ['F', 'O', 'Ö', 'X']
  },
  7: {
    number: 7,
    name: 'Taç Çakra',
    sanskrit: 'Sahasrara',
    domain: 'Derin Analiz, Ruhsal Derinlik, Gizem, Bilgelik, Ar-Ge',
    color: '#A855F7',
    element: 'Eter',
    planet: 'Neptün / Satürn',
    letters: ['G', 'Ğ', 'P', 'Y']
  },
  8: {
    number: 8,
    name: 'Aura / Kozmik Çakra',
    sanskrit: 'Kozmik Merkez',
    domain: 'Büyük Finans, Ticari Hükümranlık, Adalet, Dönüşüm',
    color: '#EC4899',
    element: 'Toprak',
    planet: 'Satürn / Plüton',
    letters: ['H', 'Q', 'Z']
  },
  9: {
    number: 9,
    name: 'Evrensel Bilinç',
    sanskrit: 'Evrensel Merkez',
    domain: 'Tamamlanma, Global Etki, Şifacılık, İlahi Akış, Yayılım',
    color: '#F43F5E',
    element: 'Ateş',
    planet: 'Mars / Güneş',
    letters: ['I', 'İ', 'R']
  }
};

export const LETTERS_DB: Record<string, LetterInfo> = {
  A: { char: 'A', chakra: 1, mahrec: 'throat', mahrecName: 'Gırtlak / Göğüs', bodyCenter: 'heart', bodyCenterName: 'Kalp & Göğüs', element: 'Ateş', meaning: 'Alef - Kalpten doğan ilk kıvılcım, görünürlük, parlama ve varoluş feryadı.' },
  B: { char: 'B', chakra: 2, mahrec: 'lip', mahrecName: 'Dudak', bodyCenter: 'throat', bodyCenterName: 'Boğaz & İfade', element: 'Su', meaning: 'Bet - Bereket kabı, alma-verme dengesi, dışa açılan temas kapısı.' },
  C: { char: 'C', chakra: 3, mahrec: 'palate', mahrecName: 'Damak', bodyCenter: 'stomach', bodyCenterName: 'Karın & Mide', element: 'Hava', meaning: 'Karından patlayan neşeli sosyallik, eyleme dönük yaratıcılık.' },
  Ç: { char: 'Ç', chakra: 3, mahrec: 'palate', mahrecName: 'Damak', bodyCenter: 'stomach', bodyCenterName: 'Karın & Mide', element: 'Ateş', meaning: 'Karın ateşi, keskin odaklanma, kararlılık ve ticari atılım.' },
  D: { char: 'D', chakra: 4, mahrec: 'palate', mahrecName: 'Damak / Diş', bodyCenter: 'heart', bodyCenterName: 'Kalp & Göğüs', element: 'Toprak', meaning: 'Dalet - Kalbin sarsılmaz kapısı, sağlam yapı, kurumsallık ve güven.' },
  E: { char: 'E', chakra: 5, mahrec: 'throat', mahrecName: 'Gırtlak', bodyCenter: 'throat', bodyCenterName: 'Boğaz & İfade', element: 'Hava', meaning: 'He - Boğazın artikülasyonu, hızlı bilgi yayılımı ve iletişim köprüsü.' },
  F: { char: 'F', chakra: 6, mahrec: 'lip', mahrecName: 'Dudak / Diş', bodyCenter: 'head', bodyCenterName: 'Kafa & Zihin', element: 'Hava', meaning: 'Zihinsel estetik, üçüncü göz uyumu ve sanatsal zarafet.' },
  G: { char: 'G', chakra: 7, mahrec: 'palate', mahrecName: 'Damak / Gırtlak', bodyCenter: 'head', bodyCenterName: 'Kafa & Zihin', element: 'Eter', meaning: 'Gimel - Gizemli zihinsel derinlik, analitik beyin ve sır.' },
  Ğ: { char: 'Ğ', chakra: 7, mahrec: 'throat', mahrecName: 'Gırtlak', bodyCenter: 'head', bodyCenterName: 'Kafa & Zihin', element: 'Eter', meaning: 'Görünmez zihinsel köprü, süptil enerji aktarımı.' },
  H: { char: 'H', chakra: 8, mahrec: 'throat', mahrecName: 'Gırtlak', bodyCenter: 'throat', bodyCenterName: 'Boğaz & İfade', element: 'Ateş', meaning: 'Boğazdan taşan yaşam nefesi, büyük otorite, dönüştürücü finansal güç.' },
  I: { char: 'I', chakra: 9, mahrec: 'throat', mahrecName: 'Gırtlak / Damak', bodyCenter: 'head', bodyCenterName: 'Kafa & Zihin', element: 'Eter', meaning: 'Alında çınlayan saf tefekkür, arınma ve evrensel tamamlanma.' },
  İ: { char: 'İ', chakra: 9, mahrec: 'palate', mahrecName: 'Damak', bodyCenter: 'head', bodyCenterName: 'Kafa & Zihin', element: 'Eter', meaning: 'Yod - İlahi zihin tohumu, epifiz çınlaması ve ruhsal ışık.' },
  J: { char: 'J', chakra: 1, mahrec: 'dental', mahrecName: 'Diş', bodyCenter: 'head', bodyCenterName: 'Kafa & Zihin', element: 'Ateş', meaning: 'Manyetik zeka, karizmatik başlangıç.' },
  K: { char: 'K', chakra: 2, mahrec: 'palate', mahrecName: 'Damak', bodyCenter: 'stomach', bodyCenterName: 'Karın & Mide', element: 'Hava', meaning: 'Kaf - Karından gelen güç, alma-verme dengesi, ticari ikna.' },
  L: { char: 'L', chakra: 3, mahrec: 'palate', mahrecName: 'Damak / Dil', bodyCenter: 'heart', bodyCenterName: 'Kalp & Göğüs', element: 'Su', meaning: 'Lamed - Kalpten yükselen kanatlanma, kucaklayıcı bereket akışı.' },
  M: { char: 'M', chakra: 4, mahrec: 'lip', mahrecName: 'Dudak', bodyCenter: 'heart', bodyCenterName: 'Kalp & Göğüs', element: 'Toprak', meaning: 'Mem - Göğüste uğuldayan mülk, mal, maya, para ve kalıcı bereket.' },
  N: { char: 'N', chakra: 5, mahrec: 'palate', mahrecName: 'Damak / Burun', bodyCenter: 'throat', bodyCenterName: 'Boğaz & İfade', element: 'Hava', meaning: 'Nun - Boğaz ve burun akışı, kesilmeyen yaşam nehri, yayılma.' },
  O: { char: 'O', chakra: 6, mahrec: 'throat', mahrecName: 'Dudak / Gırtlak', bodyCenter: 'stomach', bodyCenterName: 'Karın & Mide', element: 'Eter', meaning: 'Ouroboros - Karından yükselen derin kutsal küre, aura koruma ve irade.' },
  Ö: { char: 'Ö', chakra: 6, mahrec: 'throat', mahrecName: 'Dudak / Gırtlak', bodyCenter: 'stomach', bodyCenterName: 'Karın & Mide', element: 'Eter', meaning: 'İçsel karın nefesi, özgün sanat ve yaratıcı sezgi.' },
  P: { char: 'P', chakra: 7, mahrec: 'lip', mahrecName: 'Dudak', bodyCenter: 'throat', bodyCenterName: 'Boğaz & İfade', element: 'Toprak', meaning: 'Pe - Boğazdan patlayan ifade, saygınlık ve prestij.' },
  R: { char: 'R', chakra: 9, mahrec: 'palate', mahrecName: 'Damak / Dil', bodyCenter: 'head', bodyCenterName: 'Kafa & Zihin', element: 'Ateş', meaning: 'Resh - Beyinde ve dilde çınlayan dinamik güç, şöhret ve yayılım.' },
  S: { char: 'S', chakra: 1, mahrec: 'dental', mahrecName: 'Diş', bodyCenter: 'head', bodyCenterName: 'Kafa & Zihin', element: 'Ateş', meaning: 'Samekh - Alın ve sinüslerde çınlayan koruyucu kalkan, sarsılmaz karizma.' },
  Ş: { char: 'Ş', chakra: 1, mahrec: 'dental', mahrecName: 'Diş', bodyCenter: 'head', bodyCenterName: 'Kafa & Zihin', element: 'Ateş', meaning: 'Yoğun manyetik kalkan, zihinsel odak ve sahne ışıması.' },
  T: { char: 'T', chakra: 2, mahrec: 'palate', mahrecName: 'Damak / Diş', bodyCenter: 'stomach', bodyCenterName: 'Karın & Mide', element: 'Toprak', meaning: 'Tav - İrade mührü, güven, sadakat ve sağlam duruş.' },
  U: { char: 'U', chakra: 3, mahrec: 'throat', mahrecName: 'Dudak / Gırtlak', bodyCenter: 'stomach', bodyCenterName: 'Karın & Mide', element: 'Toprak', meaning: 'Derin karın ve diyafram iradesi, dayanıklılık, ticari büyüme.' },
  Ü: { char: 'Ü', chakra: 3, mahrec: 'throat', mahrecName: 'Dudak / Gırtlak', bodyCenter: 'stomach', bodyCenterName: 'Karın & Mide', element: 'Eter', meaning: 'Yüksek karın iradesi, ince zevkler ve pratik çözümler.' },
  V: { char: 'V', chakra: 4, mahrec: 'lip', mahrecName: 'Dudak / Diş', bodyCenter: 'heart', bodyCenterName: 'Kalp & Göğüs', element: 'Su', meaning: 'Vav - Kalpten çıkan aşk nefesi, bağlayıcı kuvvet, birlik ve teslimiyet.' },
  Y: { char: 'Y', chakra: 7, mahrec: 'palate', mahrecName: 'Damak', bodyCenter: 'head', bodyCenterName: 'Kafa & Zihin', element: 'Eter', meaning: 'Zihinsel köprü kurucu, yüksek vizyon ve ruhsal rehberlik.' },
  Z: { char: 'Z', chakra: 8, mahrec: 'dental', mahrecName: 'Diş', bodyCenter: 'head', bodyCenterName: 'Kafa & Zihin', element: 'Toprak', meaning: 'Zayin - Zihinsel taç, büyük ticari strateji, adalet ve kararlılık.' },
  // Uluslararası
  Q: { char: 'Q', chakra: 8, mahrec: 'throat', mahrecName: 'Gırtlak', bodyCenter: 'throat', bodyCenterName: 'Boğaz & İfade', element: 'Toprak', meaning: 'Kozmik ifade, otorite ve lüks.' },
  W: { char: 'W', chakra: 5, mahrec: 'lip', mahrecName: 'Dudak', bodyCenter: 'throat', bodyCenterName: 'Boğaz & İfade', element: 'Hava', meaning: 'Global iletişim, ağ yayılımı.' },
  X: { char: 'X', chakra: 6, mahrec: 'dental', mahrecName: 'Diş', bodyCenter: 'head', bodyCenterName: 'Kafa & Zihin', element: 'Eter', meaning: 'Gizemli vizyon, yüksek algı.' }
};

export type BodyResonanceStats = Record<BodyCenter, { 
  count: number; 
  percentage: number; 
  meta: BodyCenterInfo;
}>;

export interface SimulationComparison {
  originalFullName: string;
  simulatedFullName: string;
  originalMatrix: number[];
  simulatedMatrix: number[];
  originalMissing: number[];
  simulatedMissing: number[];
  newlyFilledChakras: number[];
  stillMissingChakras: number[];
  originalMahrec: Record<MahrecType, number>;
  simulatedMahrec: Record<MahrecType, number>;
  originalBodyResonance: BodyResonanceStats;
  simulatedBodyResonance: BodyResonanceStats;
  bodyCenterGains: string[];
  dominantBodyVerdict: string;
  cornerstone: LetterInfo;
  capstone: LetterInfo;
  ouroborosInfo: {
    isClosed: boolean;
    title: string;
    description: string;
  };
  scoreChange: {
    originalScore: number;
    simulatedScore: number;
    difference: number;
  };
}

export interface BrandAnalysisResult {
  brandName: string;
  cleanLetters: string[];
  matrix: number[];
  missingChakras: number[];
  dominantChakras: number[];
  mahrecStats: Record<MahrecType, { count: number; percentage: number }>;
  bodyResonance: BodyResonanceStats;
  dominantBodyVerdict: string;
  cornerstone: LetterInfo;
  capstone: LetterInfo;
  ouroboros: {
    isClosed: boolean;
    badge: string;
    description: string;
  };
  industryScores: {
    finance: { score: number; verdict: string; level: 'high' | 'medium' | 'low' };
    creative: { score: number; verdict: string; level: 'high' | 'medium' | 'low' };
    educationSpiritual: { score: number; verdict: string; level: 'high' | 'medium' | 'low' };
    technology: { score: number; verdict: string; level: 'high' | 'medium' | 'low' };
  };
  acousticScore: number;
  strengths: string[];
  recommendations: string[];
}

export interface SuggestedNameItem {
  name: string;
  targetGoal: TargetGoal;
  supportedChakras: number[];
  mahrecType: MahrecType;
  bodyCenter: BodyCenter;
  reason: string;
}

export const SUGGESTED_NAMES_DATABASE: SuggestedNameItem[] = [
  // 1. BOLLUK & BEREKET & KAZANÇ (Kalp & Karın Rezonansı)
  { name: 'Melis', targetGoal: 'wealth', supportedChakras: [4, 5, 3, 9, 1], mahrecType: 'lip', bodyCenter: 'heart', reason: 'Mem (4) mülkü ve bereketi göğüste tutar, Lamed (3) bereketi büyütür.' },
  { name: 'Burak', targetGoal: 'wealth', supportedChakras: [2, 3, 9, 1], mahrecType: 'lip', bodyCenter: 'throat', reason: 'Bet (2) bereket haznesi açar, Karından gelen Kaf (2) ticari zekayı büyütür.' },
  { name: 'Berk', targetGoal: 'wealth', supportedChakras: [2, 5, 9, 2], mahrecType: 'lip', bodyCenter: 'throat', reason: 'Boğaz ve karın gücüyle ticari ortaklık ve müşteri çekimi yaratır.' },
  { name: 'Banu', targetGoal: 'wealth', supportedChakras: [2, 1, 5, 3], mahrecType: 'lip', bodyCenter: 'throat', reason: 'Bet ve Nun ile kesintisiz bereket akışını, U ile karın iradesini sağlar.' },
  { name: 'Demir', targetGoal: 'wealth', supportedChakras: [4, 5, 4, 9, 9], mahrecType: 'palate', bodyCenter: 'heart', reason: 'Dalet ve Mem (Kalp) ile sarsılmaz mülk ve finansal temel kurar.' },
  { name: 'Melisa', targetGoal: 'wealth', supportedChakras: [4, 5, 3, 9, 1], mahrecType: 'lip', bodyCenter: 'heart', reason: 'Kalpteki Mem (4) ile kazancı tutar, A (1) ile görünür kılar.' },
  { name: 'Zeynep', targetGoal: 'wealth', supportedChakras: [8, 5, 7, 5, 5, 7], mahrecType: 'dental', bodyCenter: 'head', reason: 'Zayin (8) ile büyük finansal zihniyet ve otorite çeker.' },
  { name: 'Baran', targetGoal: 'wealth', supportedChakras: [2, 1, 9, 1, 5], mahrecType: 'lip', bodyCenter: 'heart', reason: 'Kalp ve boğaz rezonansıyla finansal canlılık ve bereket getirir.' },
  { name: 'Lal', targetGoal: 'wealth', supportedChakras: [3, 1, 3], mahrecType: 'palate', bodyCenter: 'heart', reason: 'Kalp rezonansı (L-A-L) ile Jüpiter büyümesini ve lüks çekim gücünü kilitler.' },
  { name: 'Murat', targetGoal: 'wealth', supportedChakras: [4, 3, 9, 1, 2], mahrecType: 'lip', bodyCenter: 'heart', reason: 'Kalp (M) ve Karın (U) dengesiyle tam bir ticari başarı ismidir.' },

  // 2. GÖRÜNÜRLÜK, ŞÖHRET & KARİZMA (Boğaz & Kafa Rezonansı)
  { name: 'Arya', targetGoal: 'fame', supportedChakras: [1, 9, 7, 1], mahrecType: 'throat', bodyCenter: 'heart', reason: 'Başta ve sonda A (Kalp-Boğaz köprüsü) ile sahne ışıklarını ve şöhreti çeker.' },
  { name: 'Aras', targetGoal: 'fame', supportedChakras: [1, 9, 1, 1], mahrecType: 'throat', bodyCenter: 'head', reason: 'Kalp-boğaz açıklığı ve zihinsel diş rezonansı ile durdurulamaz görünürlük verir.' },
  { name: 'Ege', targetGoal: 'fame', supportedChakras: [5, 7, 5], mahrecType: 'throat', bodyCenter: 'throat', reason: 'He (5) ile sesin boğazdan kitlelere anında ulaşmasını sağlar.' },
  { name: 'Rana', targetGoal: 'fame', supportedChakras: [9, 1, 5, 1], mahrecType: 'palate', bodyCenter: 'head', reason: 'Zihinsel yayılım (R) ve kalpten yükselen Alef (A) ile karizmayı zirveye taşır.' },
  { name: 'Sera', targetGoal: 'fame', supportedChakras: [1, 5, 9, 1], mahrecType: 'dental', bodyCenter: 'head', reason: 'Zihin (S), Boğaz (E) ve Kalp (A) uyumu ile kusursuz görünürlük akışı kurar.' },
  { name: 'Arel', targetGoal: 'fame', supportedChakras: [1, 9, 5, 3], mahrecType: 'throat', bodyCenter: 'heart', reason: 'Kalp kıvılcımı ve boğazdan hızlı yayılma frekansı ile öne çıkmayı sağlar.' },
  { name: 'Atlas', targetGoal: 'fame', supportedChakras: [1, 2, 3, 1, 1], mahrecType: 'throat', bodyCenter: 'heart', reason: 'Kalpten doğan liderlik gücünü sarsılmaz bir karizma ile birleştirir.' },
  { name: 'Selin', targetGoal: 'fame', supportedChakras: [1, 5, 3, 9, 5], mahrecType: 'dental', bodyCenter: 'head', reason: 'Zihinsel ışık (S) ve boğaz akıcılığı (N) ile kitleleri etkiler.' },

  // 3. AŞK, MANYETİZMA & UYUM (Kalp Rezonansı)
  { name: 'Defne', targetGoal: 'love', supportedChakras: [4, 5, 6, 5, 5], mahrecType: 'palate', bodyCenter: 'heart', reason: 'Kalp (D) ve Zihin (F) ile derin çekim, zarafet ve duygusal güven verir.' },
  { name: 'Can', targetGoal: 'love', supportedChakras: [3, 1, 5], mahrecType: 'palate', bodyCenter: 'heart', reason: 'A harfinin kalp sıcaklığı ile cana yakın manyetizma saçar.' },
  { name: 'Filiz', targetGoal: 'love', supportedChakras: [6, 9, 3, 9, 8], mahrecType: 'lip', bodyCenter: 'heart', reason: 'Kalbi yumuşatan L ve zihinsel çekim sunan Z ile aşkı yeşertir.' },
  { name: 'Deniz', targetGoal: 'love', supportedChakras: [4, 5, 5, 9, 8], mahrecType: 'palate', bodyCenter: 'heart', reason: 'Dalet (Kalp) kalıcılığı ve Z (Zihin) çekimi ile duygusal derinlik kurar.' },
  { name: 'Oya', targetGoal: 'love', supportedChakras: [6, 7, 1], mahrecType: 'throat', bodyCenter: 'heart', reason: 'Karın derinliği (O) ve kalp açıklığı (A) ile sevgi bağı güçlendirir.' },
  { name: 'Tuna', targetGoal: 'love', supportedChakras: [2, 3, 5, 1], mahrecType: 'palate', bodyCenter: 'stomach', reason: 'Tav (Karın iradesi) ve A (Kalp) ile sadakat ve bağlanma dengesi kurar.' },
  { name: 'Kerem', targetGoal: 'love', supportedChakras: [2, 5, 9, 5, 4], mahrecType: 'palate', bodyCenter: 'heart', reason: 'Kalpteki Mem (4) ile sevgiyle veren ve karşılığını alan aşk dengesi kurar.' },

  // 4. RUHSAL DERİNLİK, SEZGİ & KORUMA (Zihin & Epifiz Rezonansı)
  { name: 'Gizem', targetGoal: 'spiritual', supportedChakras: [7, 9, 8, 5, 4], mahrecType: 'palate', bodyCenter: 'head', reason: 'Zihinsel çınlama (G, Z) ile okült algıyı, sezgiyi ve içsel bilgeliği açar.' },
  { name: 'Peri', targetGoal: 'spiritual', supportedChakras: [7, 5, 9, 9], mahrecType: 'lip', bodyCenter: 'head', reason: 'Zihinsel R ve I frekansıyla süptil alemlerle bağlantıyı güçlendirir.' },
  { name: 'Ilgaz', targetGoal: 'spiritual', supportedChakras: [9, 3, 7, 1, 8], mahrecType: 'throat', bodyCenter: 'head', reason: 'Alında titreşen I ve G ile yüksek zihin ve tefekkür gücü aşılar.' },
  { name: 'İrem', targetGoal: 'spiritual', supportedChakras: [9, 9, 5, 4], mahrecType: 'palate', bodyCenter: 'head', reason: 'Çift İ (Yod) ile ilahi ilhamı ve yüksek sezgiyi doğrudan zihne indirir.' },
  { name: 'Yonca', targetGoal: 'spiritual', supportedChakras: [7, 6, 5, 3, 1], mahrecType: 'palate', bodyCenter: 'head', reason: 'Y (Zihin) ve O (Karın) ile epifiz bezini açar, koruyucu aura oluşturur.' },
  { name: 'Gaye', targetGoal: 'spiritual', supportedChakras: [7, 1, 7, 5], mahrecType: 'palate', bodyCenter: 'head', reason: 'G (Zihin) ve A (Kalp) ile hayat amacını bulma ve ruhsal derinliği yükseltir.' }
];

export class PhoneticChakraEngine {
  public static cleanText(text: string): string {
    return text.toLocaleUpperCase('tr-TR').replace(/[^A-ZÇĞİÖŞÜ]/g, '');
  }

  public static getLetterInfos(text: string): LetterInfo[] {
    const cleaned = this.cleanText(text);
    const result: LetterInfo[] = [];

    for (const char of cleaned) {
      if (LETTERS_DB[char]) {
        result.push(LETTERS_DB[char]);
      }
    }
    return result;
  }

  public static calculateChakraMatrix(letters: LetterInfo[]): number[] {
    const matrix = [0, 0, 0, 0, 0, 0, 0, 0, 0];
    for (const l of letters) {
      if (l.chakra >= 1 && l.chakra <= 9) {
        matrix[l.chakra - 1]++;
      }
    }
    return matrix;
  }

  public static calculateMahrecDistribution(letters: LetterInfo[]): Record<MahrecType, { count: number; percentage: number }> {
    const counts: Record<MahrecType, number> = { throat: 0, palate: 0, lip: 0, dental: 0 };
    if (letters.length === 0) {
      return {
        throat: { count: 0, percentage: 0 },
        palate: { count: 0, percentage: 0 },
        lip: { count: 0, percentage: 0 },
        dental: { count: 0, percentage: 0 }
      };
    }
    for (const l of letters) counts[l.mahrec]++;
    const total = letters.length;
    return {
      throat: { count: counts.throat, percentage: Math.round((counts.throat / total) * 100) },
      palate: { count: counts.palate, percentage: Math.round((counts.palate / total) * 100) },
      lip: { count: counts.lip, percentage: Math.round((counts.lip / total) * 100) },
      dental: { count: counts.dental, percentage: Math.round((counts.dental / total) * 100) }
    };
  }

  /**
   * 4 Büyük Bedensel Rezonans Merkezini Hesaplar
   */
  public static calculateBodyResonance(letters: LetterInfo[]): BodyResonanceStats {
    const counts: Record<BodyCenter, number> = { heart: 0, stomach: 0, throat: 0, head: 0 };

    if (letters.length === 0) {
      return {
        heart: { count: 0, percentage: 0, meta: BODY_CENTERS_METADATA.heart },
        stomach: { count: 0, percentage: 0, meta: BODY_CENTERS_METADATA.stomach },
        throat: { count: 0, percentage: 0, meta: BODY_CENTERS_METADATA.throat },
        head: { count: 0, percentage: 0, meta: BODY_CENTERS_METADATA.head }
      };
    }

    for (const l of letters) {
      counts[l.bodyCenter]++;
    }

    const total = letters.length;
    return {
      heart: { count: counts.heart, percentage: Math.round((counts.heart / total) * 100), meta: BODY_CENTERS_METADATA.heart },
      stomach: { count: counts.stomach, percentage: Math.round((counts.stomach / total) * 100), meta: BODY_CENTERS_METADATA.stomach },
      throat: { count: counts.throat, percentage: Math.round((counts.throat / total) * 100), meta: BODY_CENTERS_METADATA.throat },
      head: { count: counts.head, percentage: Math.round((counts.head / total) * 100), meta: BODY_CENTERS_METADATA.head }
    };
  }

  /**
   * Bedensel Konuşma Tarzı ve Sentez Yorumu
   */
  public static getDominantBodyVerdict(stats: BodyResonanceStats): string {
    const sorted = (Object.keys(stats) as BodyCenter[]).sort((a, b) => stats[b].percentage - stats[a].percentage);
    const primary = sorted[0];
    const secondary = sorted[1];

    if (primary === 'heart' && secondary === 'stomach') {
      return 'Kalp & Karın Dengesi: Sevgi, güvenilirlik ve yüksek ticari irade bir arada. Bu isim muhatabına hem derin güven verir hem de onu eyleme geçirir.';
    }
    if (primary === 'heart' && secondary === 'throat') {
      return 'Kalp & Boğaz Açıklığı: Kalpten doğan hislerin engelsizce kitlelere tercüme edildiği şeffaf, samimi ve güven veren bir hitabet taşır.';
    }
    if (primary === 'heart' && secondary === 'head') {
      return 'Kalp & Zihin Bütünlüğü: Şefkat ve stratejik vizyon el ele. Hem duygusal bağ kurar hem de saygın ve derinlikli algılanır.';
    }
    if (primary === 'stomach' && secondary === 'throat') {
      return 'Karın & Boğaz Gücü: İrade ve güçlü hitabet bir arada. Kitleleri peşinden sürükleyen, cesur, öncü ve kararlı bir eylem aurası yayar.';
    }
    if (primary === 'stomach' && secondary === 'head') {
      return 'Karın & Zihin Stratejisi: Cesaret ve analitik akıl ortaklığı. Ticari riskleri doğru hesaplayan, mücadeleci ve başarılı bir profil çizer.';
    }
    if (primary === 'head' && secondary === 'throat') {
      return 'Zihin & Boğaz Çevikliği: Yüksek zeka, hızlı iletişim ve analitik vizyon. Dijital ağlar, teknoloji ve kitle iletişiminde parıldar.';
    }
    if (primary === 'head' && secondary === 'heart') {
      return 'Zihin & Kalp Zarafeti: Estetik, sezgi ve derin duygusal bağlılık. Sanat, bilgelik ve tasarım projeleri için idealdir.';
    }
    return 'Dengeli Bedensel Rezonans: Beden merkezleri arasında çok yönlü bir dağılım vardır; duruma göre hem kalpten hem akıldan konuşabilir.';
  }

  public static analyzeOuroboros(firstLetter?: LetterInfo, lastLetter?: LetterInfo) {
    if (!firstLetter || !lastLetter) {
      return {
        isClosed: false,
        title: 'Belirsiz Döngü',
        description: 'İsimde analiz edilecek yeterli harf bulunamadı.'
      };
    }

    if (firstLetter.char === lastLetter.char) {
      return {
        isClosed: true,
        title: 'Tam Aura Kalkanı (Kutsal Döngü)',
        description: `İsim "${firstLetter.char}" harfiyle başlayıp "${lastLetter.char}" harfiyle bitiyor. Ezoterik olarak kusursuz bir Ouroboros (devridaim) çemberidir. Kazanılan para, bereket ve enerji dışarı kaçmaz, isim çatısı altında sürekli çoğalarak dolaşır.`
      };
    }

    // Gırtlak/Kalp -> Dudak/Toprak
    if ((firstLetter.mahrec === 'throat' || firstLetter.bodyCenter === 'heart') && firstLetter.char === 'O' && lastLetter.char === 'O') {
      return {
        isClosed: true,
        title: 'Kutsal Küre Döngüsü',
        description: 'Başta ve sonda O harfiyle kusursuz koruma küresi kurulmuş.'
      };
    }

    if (firstLetter.bodyCenter === 'heart' && lastLetter.bodyCenter === 'heart') {
      return {
        isClosed: true,
        title: 'Kalp Mühürlü Bereket Çemberi',
        description: `İsim kalpten doğup (${firstLetter.char}) kalpte mühürleniyor (${lastLetter.char}). Müşteri sadakati, sevgi ve kesintisiz bereket döngüsü kurar.`
      };
    }

    if (firstLetter.bodyCenter === 'stomach' && lastLetter.bodyCenter === 'stomach') {
      return {
        isClosed: true,
        title: 'İrade ve Eylem Çemberi',
        description: `İsim karın iradesiyle başlayıp karın iradesiyle bitiyor. Asla vazgeçmeyen, dayanıklı ve güçlü bir ticari yapı kurar.`
      };
    }

    if (firstLetter.chakra === lastLetter.chakra) {
      return {
        isClosed: true,
        title: 'Çakra Rezonans Çemberi',
        description: `İsmin başı ve sonu aynı çakra (${firstLetter.chakra}. Çakra) frekansıyla kenetlenmiş.`
      };
    }

    return {
      isClosed: false,
      title: 'Açık Kozmik Akış',
      description: `İsim farklı mahreç ve beden merkezleriyle başlayıp bitiyor (${firstLetter.char} $\\rightarrow$ ${lastLetter.char}). Bu durum isme dinamizm, sürekli hareket ve dış dünyayla yoğun etkileşim kazandırır.`
    };
  }

  public static simulatePersonalName(originalFullName: string, additionalName: string = ''): SimulationComparison {
    const origLetters = this.getLetterInfos(originalFullName);
    const origMatrix = this.calculateChakraMatrix(origLetters);
    const origMahrec = this.calculateMahrecDistribution(origLetters);
    const origBodyRes = this.calculateBodyResonance(origLetters);

    const fullCombined = additionalName.trim()
      ? `${originalFullName} ${additionalName}`
      : originalFullName;

    const simLetters = this.getLetterInfos(fullCombined);
    const simMatrix = this.calculateChakraMatrix(simLetters);
    const simMahrec = this.calculateMahrecDistribution(simLetters);
    const simBodyRes = this.calculateBodyResonance(simLetters);

    const origMissing: number[] = [];
    origMatrix.forEach((c, idx) => { if (c === 0) origMissing.push(idx + 1); });

    const simMissing: number[] = [];
    simMatrix.forEach((c, idx) => { if (c === 0) simMissing.push(idx + 1); });

    const newlyFilled = origMissing.filter(ch => !simMissing.includes(ch));
    const stillMissing = simMissing;

    const origMahrecCounts: Record<MahrecType, number> = { throat: origMahrec.throat.count, palate: origMahrec.palate.count, lip: origMahrec.lip.count, dental: origMahrec.dental.count };
    const simMahrecCounts: Record<MahrecType, number> = { throat: simMahrec.throat.count, palate: simMahrec.palate.count, lip: simMahrec.lip.count, dental: simMahrec.dental.count };

    const cornerstone = simLetters[0] || LETTERS_DB['A'];
    const capstone = simLetters[simLetters.length - 1] || LETTERS_DB['A'];
    const ouroboros = this.analyzeOuroboros(cornerstone, capstone);

    // Beden merkezleri kazanımları
    const bodyCenterGains: string[] = [];
    (Object.keys(simBodyRes) as BodyCenter[]).forEach(center => {
      const diff = simBodyRes[center].percentage - origBodyRes[center].percentage;
      if (diff > 0 && additionalName.trim()) {
        bodyCenterGains.push(`+${diff}% ${BODY_CENTERS_METADATA[center].name} Güçlendi`);
      }
    });

    const dominantBodyVerdict = this.getDominantBodyVerdict(simBodyRes);

    const origFilledCount = 9 - origMissing.length;
    const simFilledCount = 9 - simMissing.length;

    let origScore = Math.round((origFilledCount / 9) * 80) + 10;
    let simScore = Math.round((simFilledCount / 9) * 80) + 10;

    if (ouroboros.isClosed) simScore += 10;
    simScore = Math.min(100, simScore);
    origScore = Math.min(100, origScore);

    return {
      originalFullName,
      simulatedFullName: fullCombined,
      originalMatrix: origMatrix,
      simulatedMatrix: simMatrix,
      originalMissing: origMissing,
      simulatedMissing: simMissing,
      newlyFilledChakras: newlyFilled,
      stillMissingChakras: stillMissing,
      originalMahrec: origMahrecCounts,
      simulatedMahrec: simMahrecCounts,
      originalBodyResonance: origBodyRes,
      simulatedBodyResonance: simBodyRes,
      bodyCenterGains,
      dominantBodyVerdict,
      cornerstone,
      capstone,
      ouroborosInfo: ouroboros,
      scoreChange: {
        originalScore: origScore,
        simulatedScore: simScore,
        difference: simScore - origScore
      }
    };
  }

  public static analyzeBrand(brandName: string): BrandAnalysisResult {
    const letters = this.getLetterInfos(brandName);
    const cleanChars = letters.map(l => l.char);
    const matrix = this.calculateChakraMatrix(letters);
    const mahrecStats = this.calculateMahrecDistribution(letters);
    const bodyResonance = this.calculateBodyResonance(letters);
    const dominantBodyVerdict = this.getDominantBodyVerdict(bodyResonance);

    const missingChakras: number[] = [];
    const dominantChakras: number[] = [];

    matrix.forEach((count, idx) => {
      const chNum = idx + 1;
      if (count === 0) missingChakras.push(chNum);
      if (count >= 2) dominantChakras.push(chNum);
    });

    const cornerstone = letters[0] || LETTERS_DB['A'];
    const capstone = letters[letters.length - 1] || LETTERS_DB['A'];
    const ouroboros = this.analyzeOuroboros(cornerstone, capstone);

    // Sektörel Skorlama (Beden merkezleri entegreli):
    // 1. Finans & E-Ticaret: Kalp (Mülk/Bereket) + Karın (Eylem)
    let finScore = 40;
    if (matrix[3] > 0) finScore += 20; // 4. Çakra (Mülk - Mem)
    if (matrix[1] > 0) finScore += 15; // 2. Çakra (Müşteri Bağı)
    if (matrix[2] > 0) finScore += 15; // 3. Çakra (Solar İrade)
    if (matrix[7] > 0) finScore += 10; // 8. Çakra (Büyük Finans)
    if (bodyResonance.heart.percentage >= 25) finScore += 10; // Kalp mülk bereketi
    if (ouroboros.isClosed) finScore += 10;
    finScore = Math.min(100, Math.max(30, finScore));

    // 2. Sanat & Tasarım: Kalp (Duygu) + Zihin (Estetik/Epifiz)
    let artScore = 35;
    if (matrix[5] > 0) artScore += 25; // 6. Çakra (Vizyon)
    if (matrix[1] > 0) artScore += 20; // 2. Çakra (Yaratıcılık)
    if (bodyResonance.head.percentage >= 30) artScore += 15;
    if (bodyResonance.heart.percentage >= 20) artScore += 10;
    artScore = Math.min(100, Math.max(30, artScore));

    // 3. Eğitim & Akademi: Boğaz (İfade) + Zihin (Derin Bilgelik)
    let eduScore = 40;
    if (matrix[4] > 0) eduScore += 20; // 5. Çakra (Boğaz)
    if (matrix[6] > 0) eduScore += 25; // 7. Çakra (Taç)
    if (matrix[8] > 0) eduScore += 20; // 9. Çakra (Evrensel)
    if (bodyResonance.throat.percentage >= 25) eduScore += 10;
    eduScore = Math.min(100, Math.max(30, eduScore));

    // 4. Teknoloji & İnovasyon: Karın (İrade/Eylem) + Zihin (Kodlama/Analiz)
    let techScore = 35;
    if (matrix[0] > 0) techScore += 20;
    if (matrix[4] > 0) techScore += 20;
    if (matrix[6] > 0) techScore += 20;
    if (bodyResonance.head.percentage >= 25) techScore += 15;
    techScore = Math.min(100, Math.max(30, techScore));

    const getLevel = (s: number): 'high' | 'medium' | 'low' => {
      if (s >= 80) return 'high';
      if (s >= 60) return 'medium';
      return 'low';
    };

    const getVerdict = (s: number, sector: string): string => {
      if (s >= 80) return `Mükemmel Rezonans: Bu isim ${sector} alanında son derece yüksek bir çekim ve başarı frekansı taşıyor.`;
      if (s >= 60) return `Dengeli Rezonans: ${sector} alanında verimli çalışır; slogan veya logo ile desteklenebilir.`;
      return `Geliştirilebilir: ${sector} odaklı hedeflerde fonetik takviye faydalı olur.`;
    };

    const filledCount = 9 - missingChakras.length;
    let acousticScore = Math.round((filledCount / 9) * 70) + 15;
    if (ouroboros.isClosed) acousticScore += 15;
    acousticScore = Math.min(100, acousticScore);

    const strengths: string[] = [];
    if (ouroboros.isClosed) strengths.push('Kutsal Ouroboros Döngüsü: Enerjinin dışarı kaçmasını önleyip içeride devridaim ettirir.');
    if (bodyResonance.heart.percentage >= 30) strengths.push(`Güçlü Kalp Rezonansı (%${bodyResonance.heart.percentage}): Kullanıcıda derin güven, aidiyet ve kalıcı mülk duygusu uyandırır.`);
    if (bodyResonance.stomach.percentage >= 25) strengths.push(`Yüksek Karın/İrade Gücü (%${bodyResonance.stomach.percentage}): Hızlı karar alma ve satın alma eylemini tetikler.`);
    if (bodyResonance.head.percentage >= 30) strengths.push(`Stratejik Zihin Aurası (%${bodyResonance.head.percentage}): Markaya prestij, vizyon ve koruma kalkanı kazandırır.`);
    if (bodyResonance.throat.percentage >= 25) strengths.push(`Açık Boğaz Kanalı (%${bodyResonance.throat.percentage}): Ağızdan ağıza ve dijitalde kolay yayılma sağlar.`);

    const recommendations: string[] = [];
    if (bodyResonance.heart.percentage < 15) recommendations.push('Kalp rezonansı düşük: Marka iletişiminde sıcaklık, garanti ve samimiyet diline ağırlık verin.');
    if (bodyResonance.stomach.percentage < 15) recommendations.push('Karın iradesi düşük: Satış ve pazarlama kanallarında net ve cesur CTA (eylem çağrıları) kullanın.');
    if (!ouroboros.isClosed) recommendations.push('Açık Kozmik Akış: Marka logosunda dairesel mühür veya kapalı geometriler tercih ederek bereketi sabitleyin.');

    return {
      brandName,
      cleanLetters: cleanChars,
      matrix,
      missingChakras,
      dominantChakras,
      mahrecStats,
      bodyResonance,
      dominantBodyVerdict,
      cornerstone,
      capstone,
      ouroboros: {
        isClosed: ouroboros.isClosed,
        badge: ouroboros.title,
        description: ouroboros.description
      },
      industryScores: {
        finance: { score: finScore, verdict: getVerdict(finScore, 'Finans ve E-Ticaret'), level: getLevel(finScore) },
        creative: { score: artScore, verdict: getVerdict(artScore, 'Sanat, Tasarım ve Görsel'), level: getLevel(artScore) },
        educationSpiritual: { score: eduScore, verdict: getVerdict(eduScore, 'Eğitim, Akademi ve Bilgelik'), level: getLevel(eduScore) },
        technology: { score: techScore, verdict: getVerdict(techScore, 'Teknoloji ve İnovasyon'), level: getLevel(techScore) }
      },
      acousticScore,
      strengths,
      recommendations
    };
  }

  public static getRecommendedNamesForMissingChakras(missingChakras: number[], goal?: TargetGoal): SuggestedNameItem[] {
    let pool = SUGGESTED_NAMES_DATABASE;
    if (goal) pool = pool.filter(item => item.targetGoal === goal);

    const scored = pool.map(item => {
      const intersection = item.supportedChakras.filter(ch => missingChakras.includes(ch));
      return { item, score: intersection.length };
    });

    scored.sort((a, b) => b.score - a.score);
    return scored.map(s => s.item);
  }
}
