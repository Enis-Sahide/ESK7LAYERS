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
  'Uranüs': 'Mercury',
  'Neptün': 'Moon',
  'Plüton': 'Mars',
  'Kiron': 'Jupiter',
  'Lilith': 'Saturn',
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
    mudraName: 'Surya & Rudra Mudra (Güneş İradesi Mührü)',
    mudraSubtitle: 'Öz-Disiplin, Yaşam İradesi, Kararlılık ve İçsel Ateş',
    handPosture:
      'Başparmak, işaret parmağı ve yüzük parmağı uçlarınızı birbirine değdirin; orta ve serçe parmaklarınızı düz uzatın. Göğsünüz açık, omurganız dik konumda ellerinizi dizlerinize yerleştirin.',
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

const PLANET_DIRECTION_TATTVA_CATALOG: Record<
  'Saturn' | 'Jupiter' | 'Mars' | 'Sun' | 'Venus' | 'Mercury' | 'Moon',
  DirectionTattvaSection
> = {
  Sun: {
    rulingPlanetTr: 'Güneş',
    rulingPlanetSymbol: '☉',
    compassDirectionTr: 'Doğu (Doğan Güneş Yönü)',
    compassCode: 'D',
    compassAngleDeg: 90,
    sanskritDirectionName: 'Purva (İndra & Surya Yönü)',
    tattvaName: 'Tejas / Agni Tattva',
    tattvaElementTr: 'Kutsal Ateş & Işık Elementi',
    tattvaGeometryName: 'Altın-Kırmızı Yukarı Bakan Eşkenar Üçgen',
    tattvaSymbol: '▲',
    tattvaColorHex: '#F59E0B',
    visualizationGuide:
      'Meditasyona otururken yüzünüzü Doğu yönüne dönün. Gözlerinizi kapattığınızda güneş sinirağınızda ve iki kaşınızın arasında altın-kırmızı bir eşkenar üçgenin (▲) parladığını imgeleyin.',
  },
  Moon: {
    rulingPlanetTr: 'Ay',
    rulingPlanetSymbol: '☽',
    compassDirectionTr: 'Kuzeybatı (Soma & Ay Akışı Yönü)',
    compassCode: 'KB',
    compassAngleDeg: 315,
    sanskritDirectionName: 'Vayavya (Chandra Kanalı)',
    tattvaName: 'Apas Tattva',
    tattvaElementTr: 'Saf Su & Duygusal Şifa Elementi',
    tattvaGeometryName: 'Gümüş Beyazı Parlayan Hilal',
    tattvaSymbol: '🌙',
    tattvaColorHex: '#E2E8F0',
    visualizationGuide:
      'Yüzünüzü Kuzeybatı yönüne çevirerek oturun. Nefes alırken kalp ve sakral merkezinizde gümüş beyazı bir hilalin (🌙) serinletici ve şefkatli ışığını imgeleyin.',
  },
  Mars: {
    rulingPlanetTr: 'Mars',
    rulingPlanetSymbol: '♂',
    compassDirectionTr: 'Güney (Ateş & İrade Yönü)',
    compassCode: 'G',
    compassAngleDeg: 180,
    sanskritDirectionName: 'Dakshina (Mangala Güç Hattı)',
    tattvaName: 'Agni Tattva',
    tattvaElementTr: 'Dönüştürücü Ateş Elementi',
    tattvaGeometryName: 'Yakut Kırmızısı Ateş Piramidi',
    tattvaSymbol: '▲',
    tattvaColorHex: '#EF4444',
    visualizationGuide:
      'Yüzünüzü Güney yönüne dönerek omurganızı dikleştirin. Kök ve solar pleksus hattınızda yakut kırmızısı bir ateş üçgeninin (▲) tüm ataleti ve korkuyu erittiğini imgeleyin.',
  },
  Mercury: {
    rulingPlanetTr: 'Merkür',
    rulingPlanetSymbol: '☿',
    compassDirectionTr: 'Kuzey (Bilgelik & Zihin Berraklığı Yönü)',
    compassCode: 'K',
    compassAngleDeg: 0,
    sanskritDirectionName: 'Uttara (Budha & Kubera Hattı)',
    tattvaName: 'Vayu-Prithvi Sentez Tattvası',
    tattvaElementTr: 'Hava & Eter İletişim Elementi',
    tattvaGeometryName: 'Turkuaz-Zümrüt Altı Köşeli Denge Yıldızı',
    tattvaSymbol: '✡',
    tattvaColorHex: '#38BDF8',
    visualizationGuide:
      'Yüzünüzü Kuzey yönüne dönün. Boğaz ve alın merkeziniz arasında turkuaz-mavi bir altı köşeli denge yıldızının (✡) zihinsel karmaşayı kristal berraklığına kavuşturduğunu imgeleyin.',
  },
  Jupiter: {
    rulingPlanetTr: 'Jüpiter',
    rulingPlanetSymbol: '♃',
    compassDirectionTr: 'Kuzeydoğu (İlahi Bilgelik & Bereket Kapısı)',
    compassCode: 'KD',
    compassAngleDeg: 45,
    sanskritDirectionName: 'Ishanya (Guru & Ruhsal Rehberlik Yönü)',
    tattvaName: 'Akasha Tattva',
    tattvaElementTr: 'Saf Eter & Ruhsal Genişleme Elementi',
    tattvaGeometryName: 'Çivit Mavisi ve Altın Işıklı Eter Küresi',
    tattvaSymbol: '◯',
    tattvaColorHex: '#A855F7',
    visualizationGuide:
      'Kadim Vedik gelenekte meditasyonun en kutsal yönü olan Kuzeydoğu (Ishanya) yönüne dönün. Üçüncü göz ve taç merkezinizde altın-mor bir ışık küresinin (◯) bilincinizi genişlettiğini imgeleyin.',
  },
  Venus: {
    rulingPlanetTr: 'Venüs',
    rulingPlanetSymbol: '♀',
    compassDirectionTr: 'Güneydoğu (Zarafet, Kalp & Yaratım Yönü)',
    compassCode: 'GD',
    compassAngleDeg: 135,
    sanskritDirectionName: 'Agneya (Shukra Uyum Hattı)',
    tattvaName: 'Apas-Vayu Tattva',
    tattvaElementTr: 'Su & Hava Kalp Rezonansı',
    tattvaGeometryName: 'Zümrüt Yeşili Açılan Lotus Geometrisi',
    tattvaSymbol: '✿',
    tattvaColorHex: '#10B981',
    visualizationGuide:
      'Yüzünüzü Güneydoğu yönüne çevirin. Kalp çakranızda zümrüt yeşili ve altın yapraklı bir lotus geometrisinin (✿) her nefesle açılarak içsel huzuru büyüttüğünü imgeleyin.',
  },
  Saturn: {
    rulingPlanetTr: 'Satürn',
    rulingPlanetSymbol: '♄',
    compassDirectionTr: 'Batı (Topraklanma, Sabır & Karmik Denge Yönü)',
    compassCode: 'B',
    compassAngleDeg: 270,
    sanskritDirectionName: 'Paschima (Shani & Köklenme Yönü)',
    tattvaName: 'Prithvi Tattva',
    tattvaElementTr: 'Saf Toprak & Yapılandırma Elementi',
    tattvaGeometryName: 'Altın-Toprak Sarısı Sabit Küp / Kare',
    tattvaSymbol: '■',
    tattvaColorHex: '#94A3B8',
    visualizationGuide:
      'Yüzünüzü Batı yönüne dönerek sağlam ve sarsılmaz bir oturuş alın. Omurganızın tabanında altın-toprak rengi bir karenin (■) size sarsılmaz bir sabır, sınır ve güven verdiğini imgeleyin.',
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
      planetTr: pMeta.symbol,
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
    // Fix planetTr assignment above
    allNightHours[allNightHours.length - 1].planetTr = pMeta.tr;
    currentPlanetIndex = (currentPlanetIndex + 1) % 7;
  }

  const combined = [...allDayHours, ...allNightHours];
  const goldenHours = combined.filter((h) => h.isGoldenForToday);
  const currentHour = combined.find((h) => h.isCurrentNow) || null;
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
  }). Bugün haritanızda aktif olan çakra frekansınızla tam rezonansa girmek için meditasyon ve nefes çalışmanızı özellikle ${targetPlanetsTr.join(
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

  const classicalNatalTargets = new Set([
    'Güneş',
    'Ay',
    'Merkür',
    'Venüs',
    'Mars',
    'Jüpiter',
    'Satürn',
  ]);
  const fastPersonalTransits = new Set(['Güneş', 'Merkür', 'Venüs', 'Mars']);
  const dailyPersonalTriggers = personalOverview.topAspects.filter((a) => {
    if (a.aspectType === 'Görmeyen') return false;
    if (a.transitPlanet === 'Ay' && classicalNatalTargets.has(a.natalPlanet)) {
      return a.orb <= 3.8;
    }
    if (
      fastPersonalTransits.has(a.transitPlanet) &&
      classicalNatalTargets.has(a.natalPlanet)
    ) {
      return a.orb <= 0.65;
    }
    return false;
  });

  const primaryTrigger = dailyPersonalTriggers[0] || null;
  let aspectMode: 'SUSHUMNA_REST' | 'HARMONIOUS' | 'CHALLENGING' | 'CONJUNCTION' =
    'SUSHUMNA_REST';
  let activePlanetEn: 'Saturn' | 'Jupiter' | 'Mars' | 'Sun' | 'Venus' | 'Mercury' | 'Moon' =
    'Sun';

  if (chakraPrescription.mode === 'NATURAL_REST' || !primaryTrigger) {
    aspectMode = 'SUSHUMNA_REST';
    const dayRulerIdx = DAY_RULERS[targetDate.getDay()] ?? 3;
    activePlanetEn = CHALDEAN_ORDER[dayRulerIdx];
  } else {
    activePlanetEn =
      PLANET_TR_TO_EN[primaryTrigger.natalPlanet] ||
      CHAKRA_TO_RULING_PLANET_EN[
        chakraPrescription.recommendedChakras[0]?.chakraId || 3
      ] ||
      'Sun';
    if (primaryTrigger.aspectType === 'Kavuşum') {
      aspectMode = primaryTrigger.isHarmonious ? 'CONJUNCTION' : 'CHALLENGING';
    } else if (primaryTrigger.isHarmonious) {
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
    const pEn = CHAKRA_TO_RULING_PLANET_EN[chk.chakraId] || activePlanetEn;
    if (!targetPlanetsEn.includes(pEn)) {
      targetPlanetsEn.push(pEn);
    }
    chakraReasonsByPlanet[pEn] = `${chk.shortName} (${chk.hz} Hz) Meditasyon Vakti`;
  }
  if (!targetPlanetsEn.includes(activePlanetEn)) {
    targetPlanetsEn.unshift(activePlanetEn);
    const firstChk = chakraPrescription.recommendedChakras[0];
    if (firstChk) {
      chakraReasonsByPlanet[activePlanetEn] = `${firstChk.shortName} (${firstChk.hz} Hz) Birincil Açı Vakti`;
    }
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
  if (aspectMode === 'SUSHUMNA_REST') {
    breathGuide = {
      swaraChannelName: 'Sushumna Nadi (Merkezi Omurga Kanalı)',
      activeNostrilBadge: '🌿 İki Burun Kanalı Dengede • Zorlamasız Akış',
      pranayamaName: 'So-Ham Doğal Gözlem & Nadi Shodhana',
      sanskritSubtitle: 'Sushumna Dhyana Pranayama',
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
      swaraChannelName: 'İda Nadi (Sol Burun Kanalı • Ay Serinletici Akış)',
      activeNostrilBadge: '❄️ Sol Burun Kanalı (İda) • Sürtünme & Stres Dengeleyici',
      pranayamaName: 'Chandra Bhedana & Uzatılmış Nadi Shodhana',
      sanskritSubtitle: 'Ay Kanalı Yatıştırıcı Nefes (4 - 4 - 8 Ritmi)',
      inhaleSec: 4,
      holdSec: 4,
      exhaleSec: 8,
      recommendedRounds: 12,
      whyThisBreath: `Bugün haritanızdaki ${primaryTrigger?.transitPlanet} - Natal ${primaryTrigger?.natalPlanet} (${primaryTrigger?.aspectType}, ${primaryTrigger?.orb.toFixed(
        1
      )}°) açısı sinir sisteminde içsel gerilim ve acelecilik üretebilir. Nefes verme süresini (8 sn) alış süresinin (4 sn) iki katına çıkarmak ve sol burun (İda/Ay) kanalını aktive etmek vagus sinirini uyararak çakra blokajını hızla çözer.`,
      stepByStep: [
        'Sağ elinizin başparmağı ile sağ burun deliğinizi nazikçe kapatın (Vishnu Mudra).',
        'Sol burun deliğinizden (İda Kanalı) 4 saniye boyunca derin ve sessiz bir nefes alın.',
        'İki burun deliğinizi kapatarak nefesi 4 saniye boyunca aktif çakra merkezinizde tutun.',
        'Sol parmağınızı kaldırıp sağ burun deliğinizden 8 saniye boyunca çok yavaşça nefesi boşaltın.',
      ],
    };
  } else if (['Sun', 'Mars', 'Jupiter'].includes(activePlanetEn)) {
    breathGuide = {
      swaraChannelName: 'Pingala Nadi (Sağ Burun Kanalı • Güneş Yaratım Akışı)',
      activeNostrilBadge: '☀️ Sağ Burun Kanalı (Pingala) • İrade & Canlılık Aktivatörü',
      pranayamaName: 'Surya Bhedana (Güneş Nefesi) & Prana Yüklemesi',
      sanskritSubtitle: 'Pingala Nadi Aktivasyonu (4 - 6 - 4 Ritmi)',
      inhaleSec: 4,
      holdSec: 6,
      exhaleSec: 4,
      recommendedRounds: 12,
      whyThisBreath: `Bugün haritanızdaki uyumlu/aktif ${
        PLANET_EN_META[activePlanetEn].tr
      } tesiri yaşam iradenizi, yaratıcı cesaretinizi ve tezahür gücünüzü destekliyor. Sağ burun kanalından (Pingala) alınan ve 6 saniye merkezde tutulan Surya Bhedana nefesi, gökyüzünden gelen bu fırsatı hücresel prana enerjisine dönüştürür.`,
      stepByStep: [
        'Sağ elinizin yüzük parmağı ile sol burun deliğinizi nazikçe kapatın.',
        'Sağ burun deliğinizden (Pingala/Güneş Kanalı) 4 saniye boyunca güçlü ve derin nefes alın.',
        'Nefesi 6 saniye boyunca çakra odağınızda (altın bir ışık küresi gibi) tutun.',
        'Sağ burun deliğinizi kapatıp sol burun deliğinizden 4 saniye boyunca dengeli biçimde verin.',
      ],
    };
  } else {
    breathGuide = {
      swaraChannelName: 'İda & Pingala Sentezi (Çift Kanal Koheransı)',
      activeNostrilBadge: '⚖️ Dönüşümlü Burun Kanalı • Kalp & Zihin Uyumu',
      pranayamaName: 'Nadi Shodhana & Bhramari (Frekans Tınlama Nefesi)',
      sanskritSubtitle: 'Sağ-Sol Yarımküre & Çakra Senkronizasyonu (4 - 4 - 6 Ritmi)',
      inhaleSec: 4,
      holdSec: 4,
      exhaleSec: 6,
      recommendedRounds: 10,
      whyThisBreath: `Bugün haritanızda tetiklenen ${
        PLANET_EN_META[activePlanetEn].tr
      } kanalı, sezgi, iletişim ve duygusal akışı aynı potada birleştirmenizi sağlıyor. Dönüşümlü burun nefesi (Nadi Shodhana) sağ ve sol beyin yarımkürelerini eşitlerken, 6 saniyelik yumuşak nefes veriş çakra frekansının bedene yerleşmesini sağlar.`,
      stepByStep: [
        'Sol burun deliğinden 4 saniye nefes alın, 4 saniye merkezde tutun ve sağdan 6 saniyede verin.',
        'Hemen ardından sağ burun deliğinden 4 saniye nefes alın, 4 saniye tutun ve soldan 6 saniyede verin (1 tam tur).',
        'Son 3 turda nefes verirken dudaklarınız kapalıyken hafif bir "MMM" (Bhramari arı vızıltısı) sesi çıkararak kafa içi ve kalp rezonansını hissedin.',
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

  const directionTattvaGuide =
    PLANET_DIRECTION_TATTVA_CATALOG[activePlanetEn] || PLANET_DIRECTION_TATTVA_CATALOG.Sun;

  const primaryChkId = chakraPrescription.recommendedChakras[0]?.chakraId || 3;
  const secondaryChkId = chakraPrescription.recommendedChakras[1]?.chakraId;
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
      `4. Bija Mantra & Tattva Mührü: İki kaşınızın arasında ${
        directionTattvaGuide.tattvaGeometryName
      } (${directionTattvaGuide.tattvaSymbol}) sembolünü imgeleyerek çalışmayı "${
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
