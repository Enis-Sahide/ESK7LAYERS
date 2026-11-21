import { SearchRiseSet, Body, Observer } from 'astronomy-engine';
import { AstroPoint, TransitAspect } from './AstrologyConstants';
import {
  ChakraFrequencyFocusItem,
  DailyChakraPrescription,
  generatePersonalTransitOverview,
  PersonalTransitOverview,
} from './TransitSynthesisEngine';

export interface GuidePlanetaryHourSlot {
  index: number;
  isDay: boolean;
  planetKey: 'Saturn' | 'Jupiter' | 'Mars' | 'Sun' | 'Venus' | 'Mercury' | 'Moon';
  planetTr: string;
  symbol: string;
  color: string;
  startTimeIso: string;
  endTimeIso: string;
  startFormatted: string;
  endFormatted: string;
  isGoldenForToday: boolean;
  isCurrentNow: boolean;
  goldenReason?: string;
}

export interface PlanetaryHourGuideSection {
  cityName: string;
  sunriseFormatted: string;
  sunsetFormatted: string;
  dayRulerTr: string;
  dayRulerSymbol: string;
  targetPlanetsTr: string[];
  goldenHours: GuidePlanetaryHourSlot[];
  currentHour: GuidePlanetaryHourSlot | null;
  nextGoldenHour: GuidePlanetaryHourSlot | null;
  allDayHours: GuidePlanetaryHourSlot[];
  allNightHours: GuidePlanetaryHourSlot[];
  guidanceText: string;
}

export interface BreathworkGuideSection {
  swaraChannelName: string;
  activeNostrilBadge: string;
  pranayamaName: string;
  sanskritSubtitle: string;
  inhaleSec: number;
  holdSec: number;
  exhaleSec: number;
  recommendedRounds: number;
  whyThisBreath: string;
  stepByStep: string[];
}

export interface MudraMantraItem {
  chakraId: number;
  chakraShortName: string;
  hz: number;
  color: string;
  mudraName: string;
  mudraSubtitle: string;
  handPosture: string;
  bijaMantra: string;
  mantraPronunciation: string;
  mantraRepetitions: string;
  meditationFocus: string;
}

export interface DirectionTattvaSection {
  rulingPlanetTr: string;
  rulingPlanetSymbol: string;
  compassDirectionTr: string;
  compassCode: 'D' | 'KD' | 'K' | 'KB' | 'B' | 'GB' | 'G' | 'GD';
  compassAngleDeg: number;
  sanskritDirectionName: string;
  tattvaName: string;
  tattvaElementTr: string;
  tattvaGeometryName: string;
  tattvaSymbol: string;
  tattvaColorHex: string;
  visualizationGuide: string;
}

export interface CrystalAromaSection {
  primaryCrystals: string[];
  crystalPlacement: string;
  incenseAndOils: string[];
  colorToneName: string;
  colorHex: string;
  herbalTeaOrElixir: string;
  dailyRitualChecklist: string[];
}

export interface SevenLayersDailyGuideReport {
  dateStr: string;
  ActivePlanetTr: string;
  ActivePlanetEn: 'Saturn' | 'Jupiter' | 'Mars' | 'Sun' | 'Venus' | 'Mercury' | 'Moon';
  aspectMode: 'SUSHUMNA_REST' | 'HARMONIOUS' | 'CHALLENGING' | 'CONJUNCTION';
  personalOverview: PersonalTransitOverview;
  chakraPrescription: DailyChakraPrescription;
  planetaryHourGuide: PlanetaryHourGuideSection;
  breathGuide: BreathworkGuideSection;
  mudraMantraList: MudraMantraItem[];
  directionTattvaGuide: DirectionTattvaSection;
  crystalAromaGuide: CrystalAromaSection;
}

const CHALDEAN_ORDER: Array<'Saturn' | 'Jupiter' | 'Mars' | 'Sun' | 'Venus' | 'Mercury' | 'Moon'> = [
  'Saturn',
  'Jupiter',
  'Mars',
  'Sun',
  'Venus',
  'Mercury',
  'Moon',
];

const DAY_RULERS: Record<number, number> = {
  0: 3, // Pazar -> Sun
  1: 6, // Pazartesi -> Moon
  2: 2, // Salı -> Mars
  3: 5, // Çarşamba -> Mercury
  4: 1, // Perşembe -> Jupiter
  5: 4, // Cuma -> Venus
  6: 0, // Cumartesi -> Saturn
};

const PLANET_TR_TO_EN: Record<string, 'Saturn' | 'Jupiter' | 'Mars' | 'Sun' | 'Venus' | 'Mercury' | 'Moon'> = {
  'Güneş': 'Sun',
  'Ay': 'Moon',
  'Merkür': 'Mercury',
  'Venüs': 'Venus',
  'Mars': 'Mars',
  'Jüpiter': 'Jupiter',
  'Satürn': 'Saturn',
  'Uranüs': 'Saturn',
  'Neptün': 'Jupiter',
  'Plüton': 'Saturn',
  'Kiron': 'Venus',
  'Lilith': 'Moon',
};

const PLANET_EN_META: Record<
  'Saturn' | 'Jupiter' | 'Mars' | 'Sun' | 'Venus' | 'Mercury' | 'Moon',
  { tr: string; symbol: string; color: string }
> = {
  Sun: { tr: 'Güneş', symbol: '☉', color: '#F59E0B' },
  Moon: { tr: 'Ay', symbol: '☽', color: '#E2E8F0' },
  Mars: { tr: 'Mars', symbol: '♂', color: '#EF4444' },
  Mercury: { tr: 'Merkür', symbol: '☿', color: '#38BDF8' },
  Jupiter: { tr: 'Jüpiter', symbol: '♃', color: '#A855F7' },
  Venus: { tr: 'Venüs', symbol: '♀', color: '#10B981' },
  Saturn: { tr: 'Satürn', symbol: '♄', color: '#94A3B8' },
};

const CHAKRA_TO_RULING_PLANET_EN: Record<
  number,
  'Saturn' | 'Jupiter' | 'Mars' | 'Sun' | 'Venus' | 'Mercury' | 'Moon'
> = {
  1: 'Saturn',
  2: 'Moon',
  3: 'Sun',
  4: 'Venus',
  5: 'Mercury',
  6: 'Jupiter',
  7: 'Sun',
};

const CHAKRA_MUDRA_MANTRA_CATALOG: Record<
  number,
  Omit<MudraMantraItem, 'chakraId' | 'chakraShortName' | 'hz' | 'color'>
> = {
  1: {
    mudraName: 'Prithvi Mudra (Toprak Mührü)',
    mudraSubtitle: 'Köklenme, Fiziksel Güven ve Sinir Sistemi Topraklaması',
    handPosture:
      'Her iki elde yüzük parmağınızın ucunu başparmağınızın ucuna nazikçe değdirin; diğer üç parmağınızı düz ve rahat uzatın. Ellerinizi avuç içleri yukarı bakacak şekilde dizlerinizin üzerine yerleştirin.',
    bijaMantra: 'LAM',
    mantraPronunciation: 'L-A-A-A-M (Ses titreşimini kuyruk sokumu ve pelvik tabanda hissedin)',
    mantraRepetitions: '27 veya 54 Tekrar',
    meditationFocus:
      'Her nefes verişte kuyruk sokumunuzdan toprağın merkezine doğru yakut kırmızısı ışık köklerinin indiğini ve bedendeki tüm gerginliği toprağa boşalttığını imgeleyin.',
  },
  2: {
    mudraName: 'Varun & Shakti Mudra (Su Akışı Mührü)',
    mudraSubtitle: 'Duygusal Esneklik, Yaratıcı Yaşam Enerjisi ve Su Elementi Dengesi',
    handPosture:
      'Her iki elde serçe parmağınızın ucunu başparmağınızın ucuna birleştirin, diğer üç parmağınızı rahatça uzatın. Ellerinizi dizlerinizin üzerinde avuçlar yukarı bakacak biçimde dinlendirin.',
    bijaMantra: 'VAM',
    mantraPronunciation: 'V-A-A-A-M (Ses titreşimini göbek deliğinin 3 parmak altında hissedin)',
    mantraRepetitions: '27 veya 54 Tekrar',
    meditationFocus:
      'Alt karın bölgenizde sıcak turuncu bir su girdabının yumuşakça döndüğünü, sıkışmış duyguları ve yaratıcılık blokajlarını çözdüğünü hissedin.',
  },
  3: {
    mudraName: 'Surya & Agni Mudra (Güneş İradesi Mührü)',
    mudraSubtitle: 'Öz-Disiplin, Yaşam İradesi, Kararlılık ve İçsel Ateş',
    handPosture:
      'Her iki elde yüzük parmağınızı bükerek başparmağınızın köküne değdirin ve başparmağınızla yüzük parmağınızın üzerine hafifçe bastırın; diğer üç parmağınızı düz uzatın. Omurganız dik konumda ellerinizi dizlerinize yerleştirin.',
    bijaMantra: 'RAM',
    mantraPronunciation: 'R-A-A-A-M (Ses titreşimini mide ve güneş sinirağı merkezinde hissedin)',
    mantraRepetitions: '27 veya 54 Tekrar',
    meditationFocus:
      'Diyafram ve mide boşluğunuzda altın sarısı bir iç güneşin parladığını, kararsızlık ve özgüven kaybını yakarak saf iradeye dönüştürdüğünü imgeleyin.',
  },
  4: {
    mudraName: 'Padma (Lotus) & Anahata Mudra (Kalp Mührü)',
    mudraSubtitle: 'Şefkat, Koşulsuz Kabul, İlişkisel Uyum ve Kalp Koheransı',
    handPosture:
      'Ellerinizi göğüs kafesinizin (kalp merkezinin) önünde birleştirin; yalnızca avuç tabanlarınız, başparmaklarınız ve serçe parmaklarınız birbirine değsin. Diğer üçer parmağınızı açılan bir lotus çiçeği gibi aralayın.',
    bijaMantra: 'YAM',
    mantraPronunciation: 'Y-A-A-A-M (Ses titreşimini göğüs kafesinin tam ortasında hissedin)',
    mantraRepetitions: '27 veya 54 Tekrar',
    meditationFocus:
      'Göğüs kafesinizin ortasında zümrüt yeşili ve pembe bir ışık küresinin her nefesle genişleyerek hem kendinize hem çevrenize şefkat yaydığını hissedin.',
  },
  5: {
    mudraName: 'Akash & Udana Mudra (Eter & Hakikat Mührü)',
    mudraSubtitle: 'Berrak İfade, İçsel Dürüstlük ve İletişim Kanalı Açılımı',
    handPosture:
      'Her iki elde orta parmağınızın ucunu başparmağınızın ucuna nazikçe değdirin; diğer parmaklarınız gergin olmadan düz kalsın. Boyun ve çene kaslarınızı tamamen gevşetin.',
    bijaMantra: 'HAM',
    mantraPronunciation: 'H-A-A-A-M (Ses titreşimini boğaz çukurunda ve ses tellerinde hissedin)',
    mantraRepetitions: '27 veya 54 Tekrar',
    meditationFocus:
      'Boğaz merkezinizde saf turkuaz-gök mavisi bir ışık alanının açıldığını, söyleyemediğiniz sözlerin ve ifade düğümlerinin özgürce çözüldüğünü imgeleyin.',
  },
  6: {
    mudraName: 'Hakini Mudra (Durugörü & Sezgi Mührü)',
    mudraSubtitle: 'Üçüncü Göz Aktivasyonu, İdrak, Odaklanma ve Sağ-Sol Beyin Dengesi',
    handPosture:
      'İki elinizi göğüs veya karın hizasında karşılıklı getirin; beş parmağınızın sadece uçlarını birbirine değdirerek avuçlarınızın arasında görünmez bir enerji küresi (kubbe) oluşturun. Dilinizin ucunu üst damağınıza değdirin.',
    bijaMantra: 'OM (AUM)',
    mantraPronunciation: 'A-A-U-U-M-M (Titreşimi iki kaşınızın ortasında ve epifiz bezinde hissedin)',
    mantraRepetitions: '21 veya 27 Tekrar',
    meditationFocus:
      'Gözleriniz kapalıyken dikkatinizi iki kaşınızın biraz üzerindeki noktaya (Ajna) sabitleyin; çivit mavisi derin bir uzayda tüm zihinsel sislerin dağıldığını görün.',
  },
  7: {
    mudraName: 'Dhyana & Uttarabodhi Mudra (Saf Bilinç Mührü)',
    mudraSubtitle: 'Üst Benlik Bağlantısı, Ruhsal Teslimiyet ve İlahi Birlik',
    handPosture:
      'Kucağınızda sağ elinizi sol avucunuzun içine yerleştirin ve başparmak uçlarınızı hafifçe birbirine değdirerek kozmik bir çanak şekli oluşturun. Çenenizi çok hafif içeri alarak başın tepe noktasını gökyüzüne hizalayın.',
    bijaMantra: 'SESSİZ OM / AH',
    mantraPronunciation: 'A-A-H ve ardından derin sessizlik (Titreşimi başın tepe noktasında hissedin)',
    mantraRepetitions: '21 Tekrar + 3 Dakika Tam Sessizlik',
    meditationFocus:
      'Başınızın tepe noktasından (Sahasrara) mor ve kristal beyazı bir ışık sütununun yukarıya açıldığını, tüm düşünce çabalarını bırakıp saf gözlemci bilincinde dinlendiğinizi hissedin.',
  },
};

const PLANET_DIG_SHUDDHI_CATALOG: Record<
  'Saturn' | 'Jupiter' | 'Mars' | 'Sun' | 'Venus' | 'Mercury' | 'Moon',
  {
    rulingPlanetTr: string;
    rulingPlanetSymbol: string;
    compassDirectionTr: string;
    compassCode: 'D' | 'KD' | 'K' | 'KB' | 'B' | 'GB' | 'G' | 'GD';
    compassAngleDeg: number;
    sanskritDirectionName: string;
  }
> = {
  Sun: {
    rulingPlanetTr: 'Güneş',
    rulingPlanetSymbol: '☉',
    compassDirectionTr: 'Doğu (Doğan Güneş & Surya Yönü)',
    compassCode: 'D',
    compassAngleDeg: 90,
    sanskritDirectionName: 'Purva (İndra & Surya Hattı)',
  },
  Moon: {
    rulingPlanetTr: 'Ay',
    rulingPlanetSymbol: '☽',
    compassDirectionTr: 'Kuzeybatı (Soma & Chandra Su Akışı Yönü)',
    compassCode: 'KB',
    compassAngleDeg: 315,
    sanskritDirectionName: 'Vayavya (Chandra Kanalı)',
  },
  Mars: {
    rulingPlanetTr: 'Mars',
    rulingPlanetSymbol: '♂',
    compassDirectionTr: 'Güney (Agni & Mangala İrade Yönü)',
    compassCode: 'G',
    compassAngleDeg: 180,
    sanskritDirectionName: 'Dakshina (Mangala Güç Hattı)',
  },
  Mercury: {
    rulingPlanetTr: 'Merkür',
    rulingPlanetSymbol: '☿',
    compassDirectionTr: 'Kuzey (Budha & Zihin Berraklığı Yönü)',
    compassCode: 'K',
    compassAngleDeg: 0,
    sanskritDirectionName: 'Uttara (Budha & Kubera Hattı)',
  },
  Jupiter: {
    rulingPlanetTr: 'Jüpiter',
    rulingPlanetSymbol: '♃',
    compassDirectionTr: 'Kuzeydoğu (Ishanya • İlahi Bilgelik Kapısı)',
    compassCode: 'KD',
    compassAngleDeg: 45,
    sanskritDirectionName: 'Ishanya (Guru & Ruhsal Rehberlik Yönü)',
  },
  Venus: {
    rulingPlanetTr: 'Venüs',
    rulingPlanetSymbol: '♀',
    compassDirectionTr: 'Güneydoğu (Agneya • Shukra Kalp & Zarafet Yönü)',
    compassCode: 'GD',
    compassAngleDeg: 135,
    sanskritDirectionName: 'Agneya (Shukra Uyum Hattı)',
  },
  Saturn: {
    rulingPlanetTr: 'Satürn',
    rulingPlanetSymbol: '♄',
    compassDirectionTr: 'Batı (Paschima • Shani Topraklanma & Sabır Yönü)',
    compassCode: 'B',
    compassAngleDeg: 270,
    sanskritDirectionName: 'Paschima (Shani & Köklenme Yönü)',
  },
};

const CHAKRA_TATTVA_GEOMETRY_CATALOG: Record<
  number,
  {
    tattvaName: string;
    tattvaElementTr: string;
    tattvaGeometryName: string;
    tattvaSymbol: string;
    tattvaColorHex: string;
    chakraLocationTr: string;
  }
> = {
  1: {
    tattvaName: 'Prithvi Tattva',
    tattvaElementTr: 'Saf Toprak & Kök Yapılandırma Elementi',
    tattvaGeometryName: 'Altın-Toprak Sarısı Sabit Kare / Küp',
    tattvaSymbol: '■',
    tattvaColorHex: '#EF4444',
    chakraLocationTr: 'kök çakra (kuyruk sokumu) merkezinizde',
  },
  2: {
    tattvaName: 'Apas (Jala) Tattva',
    tattvaElementTr: 'Saf Su & Duygusal/Yaratıcı Akış Elementi',
    tattvaGeometryName: 'Gümüş Beyazı Parlayan Hilal',
    tattvaSymbol: '🌙',
    tattvaColorHex: '#F97316',
    chakraLocationTr: 'sakral çakra (göbek deliğinin 3 parmak altı) merkezinizde',
  },
  3: {
    tattvaName: 'Tejas (Agni) Tattva',
    tattvaElementTr: 'Kutsal Ateş & Yaşam İradesi Elementi',
    tattvaGeometryName: 'Altın-Kırmızı Ateş Üçgeni (Piramit)',
    tattvaSymbol: '▲',
    tattvaColorHex: '#EAB308',
    chakraLocationTr: 'solar pleksus (güneş sinirağı / mide) merkezinizde',
  },
  4: {
    tattvaName: 'Vayu Tattva',
    tattvaElementTr: 'Kutsal Hava, Prana & Kalp Şefkati Elementi',
    tattvaGeometryName: 'Zümrüt Yeşili Altı Köşeli Yıldız (Hegzagram)',
    tattvaSymbol: '✡',
    tattvaColorHex: '#10B981',
    chakraLocationTr: 'kalp çakrası (göğüs kafesi ortası) merkezinizde',
  },
  5: {
    tattvaName: 'Akasha Tattva',
    tattvaElementTr: 'Saf Eter, Uzay & Hakikat Sesi Elementi',
    tattvaGeometryName: 'Saf Turkuaz-Mavi Eter Küresi / Daire',
    tattvaSymbol: '◯',
    tattvaColorHex: '#0EA5E9',
    chakraLocationTr: 'boğaz çakrası merkezinizde',
  },
  6: {
    tattvaName: 'Mahat / Manas Tattva',
    tattvaElementTr: 'Kozmik Zihin, Durugörü & İdrak Işığı',
    tattvaGeometryName: 'Çivit Mavisi (İndigo) Kanatlı Işık Küresi (Bindu)',
    tattvaSymbol: '◉',
    tattvaColorHex: '#6366F1',
    chakraLocationTr: 'üçüncü göz (iki kaşın arası) merkezinizde',
  },
  7: {
    tattvaName: 'Paramashiva / Saf Bilinç',
    tattvaElementTr: 'Element Üstü İlahi Birlik & Taç Işığı',
    tattvaGeometryName: 'Mor ve Kristal Beyazı Bin Yapraklı Lotus',
    tattvaSymbol: '✿',
    tattvaColorHex: '#A855F7',
    chakraLocationTr: 'taç çakra (başın tepe noktası) merkezinizde',
  },
};

const CHAKRA_CRYSTAL_AROMA_CATALOG: Record<
  number,
  {
    crystals: string[];
    placement: string;
    incenseOils: string[];
    colorTone: string;
    colorHex: string;
    elixir: string;
  }
> = {
  1: {
    crystals: ['Kırmızı Jasper', 'Dumanlı Kuvars', 'Siyah Turmalin', 'Hematit'],
    placement: 'Meditasyon sırasında taşı avuç içinizde tutun veya dizlerinizin hemen önüne (toprakla temas hattına) yerleştirin.',
    incenseOils: ['Sedir Ağacı (Cedarwood)', 'Paçuli (Patchouli)', 'Vetiver', 'Mür (Myrrh)'],
    colorTone: 'Derin Yakut Kırmızısı & Toprak Kahvesi',
    colorHex: '#EF4444',
    elixir: 'Zencefil, Tarçın veya Kök Bitki Çayı (Ilık su ile topraklanma)',
  },
  2: {
    crystals: ['Karnelyan (Kırmızı Akik)', 'Ay Taşı', 'Turuncu Kalsit', 'Güneş Taşı'],
    placement: 'Uzanırken göbek deliğinin 3 parmak altına, otururken kucağınızda açık avuçlarınızın içine yerleştirin.',
    incenseOils: ['Ylang-Ylang', 'Tatlı Portakal Kabuğu', 'Sandal Ağacı', 'Yasemin'],
    colorTone: 'Sıcak Kehribar Turuncusu & Mercan',
    colorHex: '#F97316',
    elixir: 'Portakal Çiçeği, Hibiskus veya Rezene Çayı (Bol saf su tüketimi)',
  },
  3: {
    crystals: ['Sitrin', 'Kaplan Gözü', 'Pirit', 'Sarı Jasper'],
    placement: 'Mide / diyafram (güneş sinirağı) hizasında tutun veya çalışma masanızda tam karşınıza konumlandırın.',
    incenseOils: ['Biberiye (Rosemary)', 'Bergamot', 'Limon Otu', 'Günlük (Frankincense)'],
    colorTone: 'Altın Sarısı & Safran',
    colorHex: '#EAB308',
    elixir: 'Limonlu Zerdeçal, Papatya veya Taze Nane Çayı',
  },
  4: {
    crystals: ['Pembe Kuvars', 'Yeşil Aventurin', 'Malakit', 'Zümrüt / Yeşim'],
    placement: 'Sol elinizle kalp merkezinizin üzerinde tutun veya kolye olarak göğüs kafesi hizasında taşıyın.',
    incenseOils: ['Isparta Gülü (Rose Otto)', 'Itır (Geranium)', 'Melisa', 'Yeşil Çay Esansı'],
    colorTone: 'Zümrüt Yeşili & Gül Pembesi',
    colorHex: '#10B981',
    elixir: 'Gül Yaprağı, Melisa veya Kakuleli Yeşil Çay',
  },
  5: {
    crystals: ['Mavi Kalsedon', 'Akuamarin', 'Lapis Lazuli', 'Turkuaz'],
    placement: 'Boğaz çukuruna yakın bir kolye olarak taşıyın veya konuşma/meditasyon öncesi sağ avucunuzda ısıtın.',
    incenseOils: ['Okaliptüs', 'Adaçayı (Sage)', 'Mavi Papatya', 'Nane'],
    colorTone: 'Gök Mavisi & Saf Turkuaz',
    colorHex: '#0EA5E9',
    elixir: 'Adaçayı, Ihlamur veya Meyan Kökü Çayı (Ses tellerini yumuşatan ılık bitki çayı)',
  },
  6: {
    crystals: ['Lapis Lazuli', 'Ametist', 'Sodalit', 'Labradorit'],
    placement: 'Meditasyon öncesi 2 dakika iki kaşınızın ortasına (Üçüncü Göz) değdirin, ardından Hakini Mudra avuç kubbenizde tutun.',
    incenseOils: ['Ak Günlük (Frankincense)', 'Lavanta', 'Misk Adaçayı (Clary Sage)', 'Ardıç'],
    colorTone: 'Gece Mavisi & Çivit (İndigo)',
    colorHex: '#6366F1',
    elixir: 'Mavi Kelebek Sarmaşığı (Blue Pea), Lavanta veya Biberiye Çayı',
  },
  7: {
    crystals: ['Kristal Kuvars', 'Ametist', 'Selenit', 'Ay Taşı'],
    placement: 'Selenit veya Kristal Kuvarsı meditasyon alanınızın en yüksek noktasına ya da Dhyana Mudra çanağınızın içine yerleştirin.',
    incenseOils: ['Beyaz Lotus', 'Saf Günlük (Olibanum)', 'Sandal Ağacı', 'Palo Santo'],
    colorTone: 'Eflatun, Mor & Kristal Beyazı',
    colorHex: '#A855F7',
    elixir: 'Kristal cam bardakta dinlendirilmiş saf kaynak suyu veya Lotus/Lavanta infüzyonu',
  },
};

function formatHHMM(date: Date): string {
  const h = String(date.getHours()).padStart(2, '0');
  const m = String(date.getMinutes()).padStart(2, '0');
  return `${h}:${m}`;
}

export function calculateGuidePlanetaryHours(
  targetDate: Date,
  lat: number,
  lon: number,
  cityName: string,
  targetPlanetsEn: Array<'Saturn' | 'Jupiter' | 'Mars' | 'Sun' | 'Venus' | 'Mercury' | 'Moon'>,
  chakraReasonsByPlanet: Record<string, string>
): PlanetaryHourGuideSection {
  const safeLat = Number.isFinite(lat) ? lat : 41.0082;
  const safeLon = Number.isFinite(lon) ? lon : 28.9784;
  const observer = new Observer(safeLat, safeLon, 0);

  const dayNoon = new Date(
    targetDate.getFullYear(),
    targetDate.getMonth(),
    targetDate.getDate(),
    12,
    0,
    0
  );

  let sunriseRes = SearchRiseSet(Body.Sun, observer, +1, dayNoon, -1);
  if (!sunriseRes) {
    sunriseRes = SearchRiseSet(
      Body.Sun,
      observer,
      +1,
      new Date(dayNoon.getTime() + 12 * 3600 * 1000),
      -1
    );
  }
  const sunriseDate =
    sunriseRes?.date ||
    new Date(targetDate.getFullYear(), targetDate.getMonth(), targetDate.getDate(), 6, 30, 0);

  const sunsetRes = SearchRiseSet(
    Body.Sun,
    observer,
    -1,
    new Date(sunriseDate.getTime() + 1000),
    1
  );
  const sunsetDate =
    sunsetRes?.date ||
    new Date(targetDate.getFullYear(), targetDate.getMonth(), targetDate.getDate(), 18, 30, 0);

  const nextSunriseRes = SearchRiseSet(
    Body.Sun,
    observer,
    +1,
    new Date(sunsetDate.getTime() + 1000),
    1
  );
  const nextSunriseDate =
    nextSunriseRes?.date || new Date(sunriseDate.getTime() + 24 * 3600 * 1000);

  const dayLengthMs = sunsetDate.getTime() - sunriseDate.getTime();
  const nightLengthMs = nextSunriseDate.getTime() - sunsetDate.getTime();
  const dayHourMs = dayLengthMs / 12;
  const nightHourMs = nightLengthMs / 12;

  const dayOfWeek = sunriseDate.getDay();
  let currentPlanetIndex = DAY_RULERS[dayOfWeek] ?? 3;
  const dayRulerPlanetEn = CHALDEAN_ORDER[currentPlanetIndex];
  const dayRulerMeta = PLANET_EN_META[dayRulerPlanetEn];

  const now = new Date();
  const isSameDayAsNow =
    now.getFullYear() === targetDate.getFullYear() &&
    now.getMonth() === targetDate.getMonth() &&
    now.getDate() === targetDate.getDate();
  const referenceMoment = isSameDayAsNow ? now : targetDate;

  const targetSet = new Set(targetPlanetsEn);
  const allDayHours: GuidePlanetaryHourSlot[] = [];
  const allNightHours: GuidePlanetaryHourSlot[] = [];

  for (let i = 0; i < 12; i++) {
    const startTime = new Date(sunriseDate.getTime() + i * dayHourMs);
    const endTime = new Date(sunriseDate.getTime() + (i + 1) * dayHourMs);
    const pKey = CHALDEAN_ORDER[currentPlanetIndex];
    const pMeta = PLANET_EN_META[pKey];
    const isGolden = targetSet.has(pKey);
    const isCurrent =
      referenceMoment.getTime() >= startTime.getTime() &&
      referenceMoment.getTime() < endTime.getTime();

    allDayHours.push({
      index: i + 1,
      isDay: true,
      planetKey: pKey,
      planetTr: pMeta.tr,
      symbol: pMeta.symbol,
      color: pMeta.color,
      startTimeIso: startTime.toISOString(),
      endTimeIso: endTime.toISOString(),
      startFormatted: formatHHMM(startTime),
      endFormatted: formatHHMM(endTime),
      isGoldenForToday: isGolden,
      isCurrentNow: isCurrent,
      goldenReason: isGolden
        ? chakraReasonsByPlanet[pKey] || `${pMeta.tr} Saati (Gündüz ${i + 1}. Saat)`
        : undefined,
    });
    currentPlanetIndex = (currentPlanetIndex + 1) % 7;
  }

  for (let i = 0; i < 12; i++) {
    const startTime = new Date(sunsetDate.getTime() + i * nightHourMs);
    const endTime = new Date(sunsetDate.getTime() + (i + 1) * nightHourMs);
    const pKey = CHALDEAN_ORDER[currentPlanetIndex];
    const pMeta = PLANET_EN_META[pKey];
    const isGolden = targetSet.has(pKey);
    const isCurrent =
      referenceMoment.getTime() >= startTime.getTime() &&
      referenceMoment.getTime() < endTime.getTime();

    allNightHours.push({
      index: i + 1,
      isDay: false,
      planetKey: pKey,
      planetTr: pMeta.tr,
      symbol: pMeta.symbol,
      color: pMeta.color,
      startTimeIso: startTime.toISOString(),
      endTimeIso: endTime.toISOString(),
      startFormatted: formatHHMM(startTime),
      endFormatted: formatHHMM(endTime),
      isGoldenForToday: isGolden,
      isCurrentNow: isCurrent,
      goldenReason: isGolden
        ? chakraReasonsByPlanet[pKey] || `${pMeta.tr} Saati (Gece ${i + 1}. Saat)`
        : undefined,
    });
    currentPlanetIndex = (currentPlanetIndex + 1) % 7;
  }

  const combined = [...allDayHours, ...allNightHours];
  const goldenHours = combined.filter((h) => h.isGoldenForToday);
  let currentHour = combined.find((h) => h.isCurrentNow) || null;

  if (!currentHour && referenceMoment.getTime() < sunriseDate.getTime()) {
    const prevSunsetRes = SearchRiseSet(
      Body.Sun,
      observer,
      -1,
      new Date(sunriseDate.getTime() - 1000),
      -1
    );
    if (prevSunsetRes?.date) {
      const prevSunset = prevSunsetRes.date;
      const prevNightHourMs = (sunriseDate.getTime() - prevSunset.getTime()) / 12;
      const prevDayOfWeek = prevSunset.getDay();
      let prevPlanetIdx = ((DAY_RULERS[prevDayOfWeek] ?? 3) + 12) % 7;
      for (let i = 0; i < 12; i++) {
        const sTime = new Date(prevSunset.getTime() + i * prevNightHourMs);
        const eTime = new Date(prevSunset.getTime() + (i + 1) * prevNightHourMs);
        const pKey = CHALDEAN_ORDER[prevPlanetIdx];
        const pMeta = PLANET_EN_META[pKey];
        if (
          referenceMoment.getTime() >= sTime.getTime() &&
          referenceMoment.getTime() < eTime.getTime()
        ) {
          currentHour = {
            index: i + 1,
            isDay: false,
            planetKey: pKey,
            planetTr: pMeta.tr,
            symbol: pMeta.symbol,
            color: pMeta.color,
            startTimeIso: sTime.toISOString(),
            endTimeIso: eTime.toISOString(),
            startFormatted: formatHHMM(sTime),
            endFormatted: formatHHMM(eTime),
            isGoldenForToday: targetSet.has(pKey),
            isCurrentNow: true,
            goldenReason: targetSet.has(pKey)
              ? chakraReasonsByPlanet[pKey]
              : 'Güneş Doğuşu Öncesi Aktif Gece Saati',
          };
          break;
        }
        prevPlanetIdx = (prevPlanetIdx + 1) % 7;
      }
    }
  }

  const nextGoldenHour =
    goldenHours.find((h) => new Date(h.endTimeIso).getTime() > referenceMoment.getTime()) ||
    goldenHours[0] ||
    null;

  const targetPlanetsTr = targetPlanetsEn.map((k) => PLANET_EN_META[k].tr);
  const guidanceText = `${cityName} konumunda bugün Güneş ${formatHHMM(
    sunriseDate
  )}’de doğuyor ve ${formatHHMM(
    sunsetDate
  )}’de batıyor (Günün Hâkimi: ${dayRulerMeta.symbol} ${
    dayRulerMeta.tr
  }). Bugün haritanızda aktif olan çakra merkezlerinizle tam rezonansa girmek için meditasyon ve nefes çalışmanızı özellikle ${targetPlanetsTr.join(
    ' veya '
  )} Gezegen Saatlerinde (Hora) yapmanız etkiyi katlayacaktır.`;

  return {
    cityName,
    sunriseFormatted: formatHHMM(sunriseDate),
    sunsetFormatted: formatHHMM(sunsetDate),
    dayRulerTr: dayRulerMeta.tr,
    dayRulerSymbol: dayRulerMeta.symbol,
    targetPlanetsTr,
    goldenHours,
    currentHour,
    nextGoldenHour,
    allDayHours,
    allNightHours,
    guidanceText,
  };
}

export function generate7LayersDailyGuide(params: {
  transitPlanets: AstroPoint[];
  allTransitAspects: TransitAspect[];
  natalPlanets: AstroPoint[];
  natalHouses: AstroPoint[];
  targetDate: Date;
  dateStr: string;
  lat: number;
  lon: number;
  cityName: string;
}): SevenLayersDailyGuideReport | null {
  const {
    transitPlanets,
    allTransitAspects,
    natalPlanets,
    natalHouses,
    targetDate,
    dateStr,
    lat,
    lon,
    cityName,
  } = params;

  const personalOverview = generatePersonalTransitOverview(
    transitPlanets,
    allTransitAspects,
    natalPlanets,
    natalHouses
  );
  if (!personalOverview) return null;

  const { chakraPrescription } = personalOverview;
  const primaryChkItem = chakraPrescription.recommendedChakras[0];
  const secondaryChkItem = chakraPrescription.recommendedChakras[1];

  let aspectMode: 'SUSHUMNA_REST' | 'HARMONIOUS' | 'CHALLENGING' | 'CONJUNCTION' =
    'SUSHUMNA_REST';
  let activePlanetEn: 'Saturn' | 'Jupiter' | 'Mars' | 'Sun' | 'Venus' | 'Mercury' | 'Moon' =
    'Sun';

  if (chakraPrescription.mode === 'NATURAL_REST' || !primaryChkItem) {
    aspectMode = 'SUSHUMNA_REST';
    const dayRulerIdx = DAY_RULERS[targetDate.getDay()] ?? 3;
    activePlanetEn = CHALDEAN_ORDER[dayRulerIdx];
  } else {
    activePlanetEn =
      (primaryChkItem.rulingPlanetTr
        ? PLANET_TR_TO_EN[primaryChkItem.rulingPlanetTr]
        : undefined) ||
      (primaryChkItem.natalPlanet
        ? PLANET_TR_TO_EN[primaryChkItem.natalPlanet]
        : undefined) ||
      CHAKRA_TO_RULING_PLANET_EN[primaryChkItem.chakraId] ||
      'Sun';

    if (primaryChkItem.aspectType === 'Kavuşum') {
      aspectMode = primaryChkItem.isHarmonious !== false ? 'CONJUNCTION' : 'CHALLENGING';
    } else if (primaryChkItem.isHarmonious !== false) {
      aspectMode = 'HARMONIOUS';
    } else {
      aspectMode = 'CHALLENGING';
    }
  }

  const targetPlanetsEn: Array<
    'Saturn' | 'Jupiter' | 'Mars' | 'Sun' | 'Venus' | 'Mercury' | 'Moon'
  > = [];
  const chakraReasonsByPlanet: Record<string, string> = {};

  for (const chk of chakraPrescription.recommendedChakras) {
    const pEn =
      (chk.rulingPlanetTr ? PLANET_TR_TO_EN[chk.rulingPlanetTr] : undefined) ||
      CHAKRA_TO_RULING_PLANET_EN[chk.chakraId] ||
      activePlanetEn;
    if (!targetPlanetsEn.includes(pEn)) {
      targetPlanetsEn.push(pEn);
    }
    chakraReasonsByPlanet[pEn] = `${chk.shortName} (${chk.hz} Hz) • ${PLANET_EN_META[pEn].tr} Kanalı Meditasyon Vakti`;
  }
  if (!targetPlanetsEn.includes(activePlanetEn) && primaryChkItem) {
    targetPlanetsEn.unshift(activePlanetEn);
    chakraReasonsByPlanet[activePlanetEn] = `${primaryChkItem.shortName} (${primaryChkItem.hz} Hz) Birincil Açı Vakti`;
  }

  const planetaryHourGuide = calculateGuidePlanetaryHours(
    targetDate,
    lat,
    lon,
    cityName || 'İstanbul',
    targetPlanetsEn,
    chakraReasonsByPlanet
  );

  let breathGuide: BreathworkGuideSection;
  const triggerAspectLabel =
    primaryChkItem?.transitPlanet && primaryChkItem?.natalPlanet
      ? `Transit ${primaryChkItem.transitPlanet} - Natal ${primaryChkItem.natalPlanet} (${primaryChkItem.aspectType}, ${(primaryChkItem.orb ?? 0).toFixed(1)}°)`
      : `${PLANET_EN_META[activePlanetEn].tr} kanalı`;

  if (aspectMode === 'SUSHUMNA_REST') {
    breathGuide = {
      swaraChannelName: 'Sushumna Nadi (Merkezi Omurga Kanalı)',
      activeNostrilBadge: '🌿 İki Burun Kanalı Dengede • Zorlamasız Akış',
      pranayamaName: 'So-Ham Doğal Gözlem & Nadi Shodhana',
      sanskritSubtitle: 'Sushumna Dhyana Pranayama (4 - 2 - 4 Ritmi)',
      inhaleSec: 4,
      holdSec: 2,
      exhaleSec: 4,
      recommendedRounds: 9,
      whyThisBreath:
        'Bugün haritanızda dar dereceli zorlayıcı bir günlük transit açı bulunmadığı için enerji bedeniniz kendi doğal Sushumna dengesindedir. Ağır nefes tutmaları (Kumbhaka) yerine ritmik ve yumuşak So-Ham nefesiyle omurga kanalını dinlendirmek en yüksek faydayı sağlar.',
      stepByStep: [
        'Rahat bir oturuşa geçin, omurganızı dikleştirin ve omuzlarınızı tamamen gevşetin.',
        '4 saniye boyunca iki burun deliğinizden yumuşakça nefes alırken içsel olarak "SO" hecesini dinleyin.',
        '2 saniye nefesi hiç zorlamadan iki kaşınızın arasında dinlendirin.',
        '4 saniye boyunca nefes verirken içsel olarak "HAM" (Ben O’yum / Saf Bilincim) titreşimini hissedin.',
      ],
    };
  } else if (aspectMode === 'CHALLENGING') {
    breathGuide = {
      swaraChannelName: 'İda Nadi (Sol Burun Kanalı • Chandra Serinletici Akış)',
      activeNostrilBadge: '❄️ Sol Burun Kanalı (İda) • Sürtünme & Stres Yatıştırıcı',
      pranayamaName: 'Chandra Bhedana & Uzatılmış Nadi Shodhana',
      sanskritSubtitle: 'Ay Kanalı Yatıştırıcı Nefes (4 - 4 - 8 Ritmi)',
      inhaleSec: 4,
      holdSec: 4,
      exhaleSec: 8,
      recommendedRounds: 12,
      whyThisBreath: `Bugün haritanızdaki ${triggerAspectLabel} açısı sinir sisteminde içsel sürtünme ve gerilim üretebilir. Shiva Swarodaya (Swara Yoga) yasasına göre sert açılarda nefes verme süresini (8 sn) alış süresinin (4 sn) iki katına çıkarmak ve sol burun (İda/Ay) kanalını aktive etmek vagus sinirini uyararak çakra blokajını hızla çözer.`,
      stepByStep: [
        'Sağ elinizin başparmağı ile sağ burun deliğinizi nazikçe kapatın (Vishnu Mudra).',
        'Sol burun deliğinizden (İda Kanalı) 4 saniye boyunca derin ve sessiz bir nefes alın.',
        'İki burun deliğinizi kapatarak nefesi 4 saniye boyunca aktif çakra merkezinizde tutun.',
        'Sol parmağınızı kaldırıp sağ burun deliğinizden 8 saniye boyunca çok yavaşça nefesi boşaltın.',
      ],
    };
  } else if (
    primaryChkItem?.chakraId === 3 ||
    primaryChkItem?.chakraId === 1 ||
    ['Sun', 'Mars', 'Saturn'].includes(activePlanetEn)
  ) {
    breathGuide = {
      swaraChannelName: 'Pingala Nadi (Sağ Burun Kanalı • Surya İrade & Topraklama Akışı)',
      activeNostrilBadge: '☀️ Sağ Burun Kanalı (Pingala) • İrade & Yaşam Gücü Aktivatörü',
      pranayamaName: 'Surya Bhedana (Güneş Nefesi) & Prana Yüklemesi',
      sanskritSubtitle: 'Pingala Nadi Aktivasyonu (4 - 6 - 4 Ritmi)',
      inhaleSec: 4,
      holdSec: 6,
      exhaleSec: 4,
      recommendedRounds: 12,
      whyThisBreath: `Bugün haritanızdaki uyumlu ${triggerAspectLabel} tesiri ${primaryChkItem?.shortName} (${PLANET_EN_META[activePlanetEn].tr}) üzerinden yaşam iradenizi, dayanıklılığınızı ve tezahür gücünüzü destekliyor. Sağ burun kanalından (Pingala) alınan ve 6 saniye merkezde tutulan Surya Bhedana nefesi, gökyüzünden gelen bu fırsatı hücresel prana enerjisine dönüştürür.`,
      stepByStep: [
        'Sağ elinizin yüzük parmağı ile sol burun deliğinizi nazikçe kapatın.',
        'Sağ burun deliğinizden (Pingala/Güneş Kanalı) 4 saniye boyunca güçlü ve derin nefes alın.',
        'Nefesi 6 saniye boyunca çakra odağınızda (parlak bir ışık küresi gibi) tutun.',
        'Sağ burun deliğinizi kapatıp sol burun deliğinizden 4 saniye boyunca dengeli biçimde verin.',
      ],
    };
  } else if (
    primaryChkItem?.chakraId === 2 ||
    primaryChkItem?.chakraId === 4 ||
    ['Moon', 'Venus'].includes(activePlanetEn)
  ) {
    breathGuide = {
      swaraChannelName: 'İda Nadi & Kalp Koheransı (Sol Burun Başlangıçlı Su/Hava Akışı)',
      activeNostrilBadge: '🌙 Sol Burun Başlangıçlı (İda) • Duygusal Akış & Kalp Uyumu',
      pranayamaName: 'Chandra-Anahata Nadi Shodhana Nefesi',
      sanskritSubtitle: 'Su & Kalp Elementi Senkronizasyonu (4 - 4 - 6 Ritmi)',
      inhaleSec: 4,
      holdSec: 4,
      exhaleSec: 6,
      recommendedRounds: 10,
      whyThisBreath: `Bugün haritanızda aktif olan ${primaryChkItem?.shortName} (${PLANET_EN_META[activePlanetEn].tr} - ${triggerAspectLabel}) su ve sevgi kanallarını besliyor. Shiva Swarodaya'ya göre Ay ve Venüs (Saumya) etkilerinde sol burun kanalından (İda) başlanan 4-4-6 ritimli dönüşümlü nefes, duygusal zekayı ve yaratıcı sezgiyi en üst düzeye çıkarır.`,
      stepByStep: [
        'Sağ burun deliğinizi kapatıp sol burun deliğinizden (İda) 4 saniye yumuşakça nefes alın.',
        'Nefesi 4 saniye boyunca kalp ve sakral merkezinizde şefkatle tutun, sağ burundan 6 saniyede verin.',
        'Ardından sağdan 4 saniye alıp 4 saniye tutun ve soldan 6 saniyede vererek turu tamamlayın.',
      ],
    };
  } else {
    breathGuide = {
      swaraChannelName: 'Sushumna & İda-Pingala Sentezi (Üst Çakra Koheransı)',
      activeNostrilBadge: '⚖️ Dönüşümlü Burun & Tınlama • Zihin & Üçüncü Göz Berraklığı',
      pranayamaName: 'Nadi Shodhana & Bhramari (Frekans Tınlama Nefesi)',
      sanskritSubtitle: 'Merkür/Jüpiter Üst Merkez Senkronizasyonu (4 - 4 - 6 Ritmi)',
      inhaleSec: 4,
      holdSec: 4,
      exhaleSec: 6,
      recommendedRounds: 10,
      whyThisBreath: `Bugün haritanızda tetiklenen ${primaryChkItem?.shortName} (${PLANET_EN_META[activePlanetEn].tr} - ${triggerAspectLabel}), ifade, sezgi ve yüksek idrak merkezlerinizi çalıştırıyor. Dönüşümlü burun nefesi (Nadi Shodhana) sağ ve sol beyin yarımkürelerini eşitlerken, Bhramari tınlaması epifiz ve boğaz merkezini doğrudan titreştirir.`,
      stepByStep: [
        'Sol burun deliğinden 4 saniye nefes alın, 4 saniye merkezde tutun ve sağdan 6 saniyede verin.',
        'Hemen ardından sağ burun deliğinden 4 saniye nefes alın, 4 saniye tutun ve soldan 6 saniyede verin (1 tam tur).',
        'Son 3 turda nefes verirken dudaklarınız kapalıyken hafif bir "MMM" (Bhramari arı vızıltısı) sesi çıkararak kafa içi rezonansı hissedin.',
      ],
    };
  }

  const mudraMantraList: MudraMantraItem[] = chakraPrescription.recommendedChakras.map(
    (chk: ChakraFrequencyFocusItem) => {
      const cat = CHAKRA_MUDRA_MANTRA_CATALOG[chk.chakraId] || CHAKRA_MUDRA_MANTRA_CATALOG[3];
      return {
        chakraId: chk.chakraId,
        chakraShortName: chk.shortName,
        hz: chk.hz,
        color: chk.color,
        ...cat,
      };
    }
  );

  const primaryChkId = primaryChkItem?.chakraId || 3;
  const secondaryChkId = secondaryChkItem?.chakraId;
  const planetDir =
    PLANET_DIG_SHUDDHI_CATALOG[activePlanetEn] || PLANET_DIG_SHUDDHI_CATALOG.Sun;
  const primaryTattva =
    CHAKRA_TATTVA_GEOMETRY_CATALOG[primaryChkId] || CHAKRA_TATTVA_GEOMETRY_CATALOG[3];
  const secondaryTattva = secondaryChkId
    ? CHAKRA_TATTVA_GEOMETRY_CATALOG[secondaryChkId]
    : null;

  const directionTattvaGuide: DirectionTattvaSection = {
    rulingPlanetTr: planetDir.rulingPlanetTr,
    rulingPlanetSymbol: planetDir.rulingPlanetSymbol,
    compassDirectionTr: planetDir.compassDirectionTr,
    compassCode: planetDir.compassCode,
    compassAngleDeg: planetDir.compassAngleDeg,
    sanskritDirectionName: planetDir.sanskritDirectionName,
    tattvaName: secondaryTattva
      ? `${primaryTattva.tattvaName} & ${secondaryTattva.tattvaName}`
      : primaryTattva.tattvaName,
    tattvaElementTr: secondaryTattva
      ? `${primaryTattva.tattvaElementTr} + ${secondaryTattva.tattvaElementTr}`
      : primaryTattva.tattvaElementTr,
    tattvaGeometryName: secondaryTattva
      ? `${primaryTattva.tattvaGeometryName} (${primaryTattva.tattvaSymbol}) & ${secondaryTattva.tattvaGeometryName} (${secondaryTattva.tattvaSymbol})`
      : primaryTattva.tattvaGeometryName,
    tattvaSymbol: secondaryTattva
      ? `${primaryTattva.tattvaSymbol}${secondaryTattva.tattvaSymbol}`
      : primaryTattva.tattvaSymbol,
    tattvaColorHex: primaryTattva.tattvaColorHex,
    visualizationGuide: secondaryTattva
      ? `Bugünkü birincil yönetici gezegen kanalınız ${planetDir.rulingPlanetSymbol} ${planetDir.rulingPlanetTr} olduğu için meditasyona otururken yüzünüzü ${planetDir.compassDirectionTr} yönüne dönün. Gözlerinizi kapattığınızda önce ${primaryTattva.chakraLocationTr} ${primaryTattva.tattvaGeometryName} (${primaryTattva.tattvaSymbol}), ardından tamamlayıcı ${secondaryTattva.chakraLocationTr} ${secondaryTattva.tattvaGeometryName} (${secondaryTattva.tattvaSymbol}) sembolünün parladığını imgeleyin.`
      : `Bugünkü yönetici gezegen kanalınız ${planetDir.rulingPlanetSymbol} ${planetDir.rulingPlanetTr} olduğu için meditasyona otururken yüzünüzü ${planetDir.compassDirectionTr} yönüne dönün. Gözlerinizi kapattığınızda ${primaryTattva.chakraLocationTr} ${primaryTattva.tattvaGeometryName} (${primaryTattva.tattvaSymbol}) sembolünün parlayarak enerji merkezinizi dengelediğini imgeleyin.`,
  };

  const primaryCrystalCat =
    CHAKRA_CRYSTAL_AROMA_CATALOG[primaryChkId] || CHAKRA_CRYSTAL_AROMA_CATALOG[3];
  const secondaryCrystalCat = secondaryChkId
    ? CHAKRA_CRYSTAL_AROMA_CATALOG[secondaryChkId]
    : null;

  const combinedCrystals = secondaryCrystalCat
    ? [
        ...primaryCrystalCat.crystals.slice(0, 2),
        ...secondaryCrystalCat.crystals.slice(0, 2),
      ]
    : primaryCrystalCat.crystals;

  const combinedIncense = secondaryCrystalCat
    ? [
        ...primaryCrystalCat.incenseOils.slice(0, 2),
        ...secondaryCrystalCat.incenseOils.slice(0, 2),
      ]
    : primaryCrystalCat.incenseOils;

  const firstChk = chakraPrescription.recommendedChakras[0];
  const firstMudra = mudraMantraList[0];
  const goldenTimeSlotText = planetaryHourGuide.nextGoldenHour
    ? `${planetaryHourGuide.nextGoldenHour.planetTr} Saati (${planetaryHourGuide.nextGoldenHour.startFormatted} - ${planetaryHourGuide.nextGoldenHour.endFormatted})`
    : `${planetaryHourGuide.targetPlanetsTr[0] || 'Güneş'} Saati`;

  const crystalAromaGuide: CrystalAromaSection = {
    primaryCrystals: Array.from(new Set(combinedCrystals)),
    crystalPlacement: primaryCrystalCat.placement,
    incenseAndOils: Array.from(new Set(combinedIncense)),
    colorToneName: secondaryCrystalCat
      ? `${primaryCrystalCat.colorTone} & ${secondaryCrystalCat.colorTone}`
      : primaryCrystalCat.colorTone,
    colorHex: primaryCrystalCat.colorHex,
    herbalTeaOrElixir: primaryCrystalCat.elixir,
    dailyRitualChecklist: [
      `1. Zaman & Yön Hazırlığı: Mümkünse ${goldenTimeSlotText} diliminde yüzünüzü ${directionTattvaGuide.compassDirectionTr} yönüne dönerek sessiz bir yere oturun.`,
      `2. Frekans & Kristal: Yukarıdaki çalardan ${
        firstChk?.hz || 528
      } Hz frekansını başlatın ve varsa ${combinedCrystals[0]} taşınızı yanınıza alın.`,
      `3. Mudra & Nefes: Ellerinizi ${
        firstMudra?.mudraName || 'Surya Mudra'
      } pozisyonuna getirin ve ${breathGuide.pranayamaName} sayacını başlatarak ${
        breathGuide.recommendedRounds
      } tur nefes alın.`,
      `4. Bija Mantra & Tattva Mührü: Enerji merkezinizde ${
        directionTattvaGuide.tattvaGeometryName
      } sembolünü imgeleyerek çalışmayı "${
        firstMudra?.bijaMantra || 'RAM'
      }" tohum sesiyle tamamlayın.`,
    ],
  };

  return {
    dateStr,
    ActivePlanetTr: PLANET_EN_META[activePlanetEn].tr,
    ActivePlanetEn: activePlanetEn,
    aspectMode,
    personalOverview,
    chakraPrescription,
    planetaryHourGuide,
    breathGuide,
    mudraMantraList,
    directionTattvaGuide,
    crystalAromaGuide,
  };
}
