import { AstroPoint, TransitAspect, AstroCity } from './AstrologyConstants';
import { 
  MAJOR_PLANET_SIGN_CUSTOM_INTERPRETATIONS,
  getIngressPhase,
  getSkyPlanetSignInterpretation,
  getPlanetSignBriefHeadline,
  getSkyAspectInterpretation,
  IngressPhaseInfo
} from './SkyAspectInterpretations';
import { getGateAndLine } from '@/src/features/human-design/engine/HumanDesignEngine';
import { GATE_TITLES } from './AstroHumanDesignSynthesis';

export interface UnifiedSkyAspectInfo {
  targetPlanet: string;
  targetSign?: string;
  targetDegree?: number;
  aspectType: 'Kavuşum' | 'Sekstil' | 'Kare' | 'Üçgen' | 'Karşıt' | 'Görmeyen' | string;
  orb: number;
  orbStrength?: string;
  isHarmonious: boolean;
  summary: string;
  energyType: string;
}

export interface UnifiedSkyPlanet {
  planetName: string;
  sign: string;
  degreeInSign: number;
  minutes: number;
  isRetrograde?: boolean;
  longitude: number;
  ingressPhase: IngressPhaseInfo;
  aspects: UnifiedSkyAspectInfo[];
  headline: string;
  humanThemeTitle: string;
  humanNarrative: string;
  hdGateInfo?: {
    gate: number;
    line: number;
    title: string;
    gift: string;
    shadow: string;
  };
  collectiveTheme: string;
  dailyAdvice: string;
  chakraLayer: string;
  detailedAnalysis: string;
  minOrb?: number;
}

export interface UnifiedAspectInfo {
  natalPlanet: string;
  natalHouse?: number;
  aspectType: 'Kavuşum' | 'Sekstil' | 'Kare' | 'Üçgen' | 'Karşıt' | 'Görmeyen' | string;
  orb: number;
  isHarmonious: boolean;
  summary: string;
}

export interface UnifiedPlanetTransit {
  planetName: string;
  sign: string;
  degreeInSign: number;
  minutes: number;
  isRetrograde?: boolean;
  house: number;
  houseTitle: string;
  houseKeywords: string;
  aspects: UnifiedAspectInfo[];
  headline: string;
  humanThemeTitle: string;
  humanNarrative: string;
  hdGateInfo?: {
    gate: number;
    line: number;
    title: string;
    gift: string;
    shadow: string;
  };
  synthesisSummary: string;
  detailedAnalysis: string;
  actionAdvice: string;
  chakraLayer: string;
}

export const LIFE_AREA_NAMES: Record<number, string> = {
  1: 'Bireysel Duruş & Benlik',
  2: 'Maddi Güvenlik & Öz Değer',
  3: 'Zihinsel İletişim & Fikirler',
  4: 'İçsel Güvenlik & Aile Kökleri',
  5: 'Yaratıcı Tutkular & Yaşam Neşesi',
  6: 'Günlük Düzen & Sağlık',
  7: 'İlişkiler & Karşılıklı Dengeler',
  8: 'Krizler & Derin Dönüşüm',
  9: 'Hayat Vizyonu & İnançlar',
  10: 'Kariyer & Otorite Hedefleri',
  11: 'Sosyal Çevre & Gelecek Umutları',
  12: 'Bilinçaltı & Ruhsal Arınma'
};

export const LIFE_AREA_DESCRIPTIONS: Record<number, string> = {
  1: 'kendi kişisel kararların, beden dilin ve dış dünyadaki bağımsız duruşun',
  2: 'maddi gelirlerin, harcamaların ve kendi öz değerine duyduğun inanç',
  3: 'iletişim tarzın, zihinsel projelerin ve yakın çevrenle olan diyalogların',
  4: 'içsel güvenliğin, yuvan ve ailevi köklerindeki bastırılmış duygular',
  5: 'yaratıcı enerjin, aşk hayatındaki beklentilerin ve yaşamdan aldığın keyif',
  6: 'günlük çalışma tempon, üstlendiğin sorumluluklar ve beden sağlığın',
  7: 'ikili ilişkilerin, evliliğin ve karşındaki insanlarla kurduğun sınır dengesi',
  8: 'derin psikolojik krizler, ortak kaynaklar ve bırakmakta zorlandığın bağlar',
  9: 'hayata bakış açın, inanç kalıpların ve geleceğe dair vizyonun',
  10: 'iş hayatındaki sorumlulukların, unvanın ve otoriteyle olan ilişkin',
  11: 'sosyal çevren, arkadaş grupların ve geleceğe yönelik ideallerin',
  12: 'bilinçaltındaki endişelerin, içsel yalnızlığın ve ruhsal arınma ihtiyacın'
};

export const HOUSE_TITLES: Record<number, string> = {
  1: '1. Ev: Benlik, Beden & Dış Dünyadaki Duruş',
  2: '2. Ev: Maddi Kaynaklar, Kazanç & Öz Değer',
  3: '3. Ev: Zihin, İletişim, Eğitim & Yakın Çevre',
  4: '4. Ev: Yuva, Aile, Kökler & İçsel Güvenlik',
  5: '5. Ev: Aşk, Yaratıcılık, Yaşam Neşesi & Çocuklar',
  6: '6. Ev: Günlük Yaşam, Çalışma Düzeni, Hizmet & Sağlık',
  7: '7. Ev: İkili İlişkiler, Evlilik & Ortaklıklar',
  8: '8. Ev: Derin Dönüşüm, Krizler, Ortak Bütçe & Psikolojik Şifa',
  9: '9. Ev: Yüksek Vizyon, İnançlar, Felsefe & Uzak Seyahatler',
  10: '10. Ev: Kariyer, Toplumsal Statü, Otorite & Yaşam Hedefleri',
  11: '11. Ev: Gelecek Umutları, Sosyal Çevre & Kolektif Gruplar',
  12: '12. Ev: Bilinçaltı, Karmik Çözülme, İnziva & Ruhsal Arınma'
};

export const HOUSE_SHORT_THEMES: Record<number, string> = {
  1: 'kişisel kararlarınız, imajınız ve bedeniniz',
  2: 'maddi gelirleriniz, sahip olduklarınız ve öz değeriniz',
  3: 'iletişiminiz, zihniniz, kardeşleriniz ve eğitimleriniz',
  4: 'yuvanız, aileniz, kökleriniz ve içsel huzurunuz',
  5: 'aşk hayatınız, yaratıcılığınız ve yaşama sevinciniz',
  6: 'günlük çalışma temponuz, sağlığınız ve rutinleriniz',
  7: 'evliliğiniz, ikili ilişkileriniz ve ortaklıklarınız',
  8: 'ortak kaynaklar, kriz yönetimi ve derin psikolojik dönüşümünüz',
  9: 'hayat felsefeniz, inançlarınız ve ufkunuzu genişleten yollar',
  10: 'kariyeriniz, hedefleriniz, unvanınız ve toplumsal statünüz',
  11: 'sosyal çevreniz, dostluklarınız ve gelecek vizyonunuz',
  12: 'bilinçaltınız, ruhsal şifalanmanız ve gizli korkularınız'
};

const PLANET_NATURES: Record<string, string> = {
  'Güneş': 'yaşam bilincinizi ve temel iradenizi',
  'Ay': 'duygusal güvenlik ihtiyacınızı ve hislerinizi',
  'Merkür': 'zihinsel algınızı ve iletişim dilinizi',
  'Venüs': 'ilişkilerdeki sevgi alma-verme dengenizi ve değer anlayışınızı',
  'Mars': 'harekete geçme cesaretinizi ve mücadele gücünüzü',
  'Jüpiter': 'büyüme, genişleme ve inanç fırsatlarınızı',
  'Satürn': 'sorumluluk, disiplin ve karmik olgunlaşma sınavlarınızı',
  'Uranüs': 'ani uyanışları, özgürleşme arzunuzu ve tabuları yıkma isteğinizi',
  'Neptün': 'sezgisel derinliğinizi, ruhsal ilhamınızı ve manevi çözülmeleri',
  'Plüton': 'kökten dönüşümü, küllerinden doğuşu ve psikolojik güçlenmenizi',
  'Kiron': 'ruhun en derin hassasiyetlerini ve şifalanma kapısını',
  'Lilith': 'bastırılmış otantik gücünüzü, boyun eğmeyen vahşi doğanızı ve tabuları'
};

const PLANET_CHAKRAS: Record<string, string> = {
  'Güneş': '3. Solar Pleksus (Manipura) - Benlik & İrade',
  'Ay': '4. Kalp & 2. Sakral - Duygusal Akış',
  'Merkür': '5. Boğaz Çakrası (Vishuddha) - Hakikat & İfade',
  'Venüs': '4. Kalp Çakrası (Anahata) - Sevgi & Değer',
  'Mars': '1. Kök & 3. Solar Pleksus - Yaşamsal Eylem',
  'Jüpiter': '6. Üçüncü Göz (Ajna) - Bilgelik & Genişleme',
  'Satürn': '1. Kök Çakra (Muladhara) - Disiplin & Sınırlar',
  'Uranüs': '7. Taç & 5. Boğaz - Radikal Özgürlük',
  'Neptün': '6. Üçüncü Göz & 7. Taç - Mistik Birlik',
  'Plüton': '1. Kök & Kundalini - Kökten Yenilenme',
  'Kiron': '4. Kalp & 6. Üçüncü Göz - İçsel Şifa',
  'Lilith': '2. Sakral & 1. Kök - Otantik Gölge Entegrasyonu'
};

/**
 * Calculates which natal house (1-12) a given longitude falls into.
 */
export function getHouseFromLongitude(lon: number, houses: AstroPoint[]): number {
  if (!houses || houses.length < 12) return 1;
  const sorted = [...houses].sort((a, b) => a.house - b.house);
  
  for (let i = 0; i < 12; i++) {
    const curH = sorted[i];
    const nextH = sorted[(i + 1) % 12];
    const cLon = curH.longitude;
    const nLon = nextH.longitude;

    if (cLon < nLon) {
      if (lon >= cLon && lon < nLon) return curH.house;
    } else {
      if (lon >= cLon || lon < nLon) return curH.house;
    }
  }
  return 1;
}

/**
 * Generates a unified, synthesized personal transit report for a specific transit planet.
 * Connects the Planet + Zodiac Sign + Natal House + Aspecting Natal Planets into one narrative.
 */
export function generateUnifiedPlanetTransit(
  transitPlanet: AstroPoint,
  allTransitAspects: TransitAspect[],
  natalPlanets: AstroPoint[],
  natalHouses: AstroPoint[]
): UnifiedPlanetTransit {
  const pName = transitPlanet.name;
  const sign = transitPlanet.sign;
  const house = transitPlanet.house || getHouseFromLongitude(transitPlanet.longitude, natalHouses);
  const houseTitle = HOUSE_TITLES[house] || `${house}. Ev`;
  const houseTheme = HOUSE_SHORT_THEMES[house] || 'bu yaşam alanınız';

  // Find all active aspects made by this transit planet to natal planets with strict orb filter
  const matchingAspects = allTransitAspects.filter(a => {
    if (a.transitPlanet !== pName) return false;
    const hasMoon = a.transitPlanet === 'Ay' || a.natalPlanet === 'Ay';
    if (a.type === 'Görmeyen') return a.orb <= 2.0;
    const maxOrb = hasMoon ? 4.5 : 3.5;
    return a.orb <= maxOrb;
  }).sort((a, b) => a.orb - b.orb);

  const aspectInfos: UnifiedAspectInfo[] = matchingAspects.map(asp => {
    const nPlanet = natalPlanets.find(p => p.name === asp.natalPlanet);
    const nHouse = nPlanet ? (nPlanet.house || getHouseFromLongitude(nPlanet.longitude, natalHouses)) : undefined;
    const isHarmonious = asp.type === 'Üçgen' || asp.type === 'Sekstil' || (asp.type === 'Kavuşum' && !['Satürn', 'Mars', 'Plüton'].includes(asp.transitPlanet));

    let summary = '';
    const nTheme = nHouse ? `${nHouse}. evinizdeki (${HOUSE_SHORT_THEMES[nHouse]})` : '';
    switch (asp.type) {
      case 'Kavuşum':
        summary = `${nTheme} Natal ${asp.natalPlanet} ile kavuşarak bu alanda yepyeni ve yoğun bir odak döngüsü başlatıyor.`;
        break;
      case 'Karşıt':
        summary = `${nTheme} Natal ${asp.natalPlanet} ile karşı karşıya gelerek bu iki hayat alanı arasında ayna tutan bir denge sınavı açıyor.`;
        break;
      case 'Kare':
        summary = `${nTheme} Natal ${asp.natalPlanet} ile kare açı yaparak ertelediğiniz krizleri çözmeniz için sizi cesur bir aksiyona zorluyor.`;
        break;
      case 'Üçgen':
        summary = `${nTheme} Natal ${asp.natalPlanet} ile üçgen kurarak bu süreçte çabasız, akıcı ve şifalı bir destek kanalı açıyor.`;
        break;
      case 'Sekstil':
        summary = `${nTheme} Natal ${asp.natalPlanet} ile tatlı bir temas kurarak değerlendirmeniz gereken somut fırsatlar sunuyor.`;
        break;
      default:
        summary = `Natal ${asp.natalPlanet} ile etkileşim halinde.`;
    }

    return {
      natalPlanet: asp.natalPlanet,
      natalHouse: nHouse,
      aspectType: asp.type,
      orb: asp.orb,
      isHarmonious,
      summary
    };
  });

  // Custom interpretation lookup if available
  const customKey = `${pName}-${sign}`;
  const customInterp = MAJOR_PLANET_SIGN_CUSTOM_INTERPRETATIONS[customKey];

  // Human Design Gate & Line calculation for this transit degree
  const hdCalc = getGateAndLine(transitPlanet.longitude);
  const gateMeta = GATE_TITLES[hdCalc.gate];
  const hdGateInfo = gateMeta ? {
    gate: hdCalc.gate,
    line: hdCalc.line,
    title: gateMeta.title,
    gift: gateMeta.gift,
    shadow: gateMeta.shadow,
  } : undefined;

  // Aspect analysis for human language theme
  const primaryChallenging = aspectInfos.find(a => !a.isHarmonious);
  const primaryHarmonious = aspectInfos.find(a => a.isHarmonious);

  // 1. İnsan Dili Başlık (Jargondan Arındırılmış Tema)
  let humanThemeTitle = '';
  if (primaryChallenging && primaryChallenging.natalHouse && primaryChallenging.natalHouse !== house) {
    const mainArea = LIFE_AREA_NAMES[house] || 'Yaşam Yönü';
    const targetArea = LIFE_AREA_NAMES[primaryChallenging.natalHouse] || 'İçsel Alan';
    humanThemeTitle = `${mainArea} ile ${targetArea} Arasında Denge Sınavı`;
  } else if (primaryHarmonious && primaryHarmonious.natalHouse && primaryHarmonious.natalHouse !== house) {
    const mainArea = LIFE_AREA_NAMES[house] || 'Yaşam Yönü';
    const targetArea = LIFE_AREA_NAMES[primaryHarmonious.natalHouse] || 'İçsel Alan';
    humanThemeTitle = `${mainArea} ve ${targetArea} Arasında Akıcı Destek`;
  } else {
    humanThemeTitle = `${LIFE_AREA_NAMES[house] || 'Yaşam Alanı'} Konularında Yeniden Yapılanma`;
  }

  // 2. 7Layers Yaşam Alanı Özeti (Tekrar içermeyen, sade ve doğal insan dili)
  let humanNarrative = '';
  if (primaryChallenging && primaryChallenging.natalHouse) {
    if (primaryChallenging.natalHouse === house) {
      humanNarrative += `Şu dönemde doğrudan ${LIFE_AREA_DESCRIPTIONS[house]} üzerinde yoğunlaşan etkiler, seni derin bir yüzleşmeye, sınırlarını gözden geçirmeye ve içsel muhasebeye çekebilir. `;
    } else {
      humanNarrative += `Şu sıralar ${LIFE_AREA_DESCRIPTIONS[house]} ile ${LIFE_AREA_DESCRIPTIONS[primaryChallenging.natalHouse]} arasında seni iki yönlü bir baskıya ve yüzleşmeye çeken bir gerilim hissedebilirsin. Dış dünyada bir tarafa aşırı odaklanırken diğer tarafı ihmal ettiğinde içsel ya da ilişkisel sürtüşmeler tetiklenebilir. `;
    }
  } else if (primaryHarmonious && primaryHarmonious.natalHouse) {
    if (primaryHarmonious.natalHouse === house) {
      humanNarrative += `Bu dönemde ${LIFE_AREA_DESCRIPTIONS[house]} alanında yoğunlaşan uyumlu etkiler, sana güçlü bir rahatlama, derinleşme ve berraklık sağlıyor. Tıkanmış gibi görünen durumların kendiliğinden çözüme doğru aktığını fark edebilirsin. `;
    } else {
      humanNarrative += `Bu dönemde ${LIFE_AREA_DESCRIPTIONS[house]} alanında attığın adımlar, ${LIFE_AREA_DESCRIPTIONS[primaryHarmonious.natalHouse]} konularında sana güçlü bir destek ve rahatlama akışı sağlıyor. Çözülmez gibi görünen durumların daha doğal bir akışla hafiflediğini fark edebilirsin. `;
    }
  } else {
    humanNarrative += `Bu süreçte temel odak noktan doğrudan ${LIFE_AREA_DESCRIPTIONS[house]} üzerinde toplanıyor. Arka planda biriken belirsizlikleri netleştirmen ve sağlam kararlarla ilerlemen gerekiyor. `;
  }

  // Ruhsal ve Zihinsel Arketip Sentezi (Kafa karıştırıcı kapı etiketi olmadan)
  if (hdGateInfo) {
    humanNarrative += `Bu dönemin ruhsal ve zihinsel anahtarı; seni "${hdGateInfo.shadow}" tuzağında tüketmek yerine, "${hdGateInfo.gift}" potansiyelini hayatına taşımandır. `;
  }

  // Pratik Hayat Reçetesi
  if (primaryChallenging) {
    humanNarrative += `Karşılaştığın dirençlerde haklı çıkmak için güç savaşına girmek yerine, kendi sınırlarını sessizce ve netlikle korumak bu süreci en büyük içsel bilgelikle tamamlamanı sağlayacaktır.`;
  } else {
    humanNarrative += `Zihnindeki vesvese veya ertelemeleri bir kenara bırakıp eline geçen fırsatları yapıcı adımlarla değerlendirmek sana kalıcı bir huzur ve ferahlık getirecektir.`;
  }

  // Synthesize the classic technical summary (for advanced/astro users)
  const retroText = transitPlanet.isRetrograde ? ' (Retro Harekette)' : '';
  const headline = `Transit ${pName} ${house}. Evinizde (${sign} ${transitPlanet.degreeInSign}°)${retroText}`;

  let synthesisSummary = `Transit ${pName}, ${sign} burcunda seyrederek haritanızın ${house}. evini (${houseTheme}) doğrudan tetikliyor. `;
  if (aspectInfos.length > 0) {
    const challenging = aspectInfos.filter(a => !a.isHarmonious);
    const harmonious = aspectInfos.filter(a => a.isHarmonious);
    
    if (challenging.length > 0 && harmonious.length > 0) {
      synthesisSummary += `Aynı anda haritanızdaki ${challenging.map(a => `${a.natalHouse ? `${a.natalHouse}. evdeki ` : ''}${a.natalPlanet} (${a.aspectType})`).join(', ')} ile yüzleşme hattı kurarken; ${harmonious.map(a => `${a.natalPlanet} (${a.aspectType})`).join(', ')} ile güçlü bir çıkış ve destek kapısı açıyor.`;
    } else if (challenging.length > 0) {
      synthesisSummary += `Bu süreçte özellikle ${challenging.map(a => `${a.natalHouse ? `${a.natalHouse}. evdeki ` : ''}${a.natalPlanet} (${a.aspectType})`).join(', ')} teması üzerinden hayatınızda önemli bir yüzleşme ve yapılandırma talep ediyor.`;
    } else {
      synthesisSummary += `Bu geçiş, ${harmonious.map(a => `${a.natalHouse ? `${a.natalHouse}. evdeki ` : ''}${a.natalPlanet} (${a.aspectType})`).join(', ')} ile uyumlanarak bu hayat alanında işlerinizi kolaylaştıran verimli bir akış sunuyor.`;
    }
  } else {
    synthesisSummary += `Şu an doğrudan majör bir natal gezegene açı yapmasa da, bu yaşam alanınızın arka planını sessiz ve derinden dönüştürmeye devam ediyor.`;
  }

  const actionAdvice = customInterp?.advice || 
    `Bu süreçte ${house}. evinizin temsil ettiği konularda aceleci olmadan, bilinçli ve yapıcı sınırlar çizerek hareket edin. Karşınıza çıkan durumları kriz değil, ruhsal olgunlaşma fırsatı olarak görün.`;

  const chakraLayer = customInterp?.chakra || PLANET_CHAKRAS[pName] || 'Kozmik Katman Entegrasyonu';

  // Detailed Analysis Synthesis:
  // 1. Öncelikli Anlam & Eylem (En Üst Bölüm)
  let detailedAnalysis = `【7Layers Yaşam Alanı Özeti】\n${humanNarrative}\n\n` +
    `【Bireysel Eylem & Dönüşüm Rehberliği】\n${actionAdvice}\n\n` +
    `【Metnin Oluşturulduğu Kaynaklar】\n` +
    `Bu analiz aşağıdaki astrolojik ve enerjetik katmanların sentezlenmesiyle oluşturulmuştur:\n\n` +
    `【Yaşam Alanı Etkisi: ${houseTitle}】\n` +
    `${pName}, astrolojide ${PLANET_NATURES[pName] || 'önemli enerjileri'} temsil eder. Bu geçiş sizin ${house}. evinizden geçerken; ${houseTheme} alanınızda köklü bir uyanış ve farkındalık yaratır.\n\n`;

  if (hdGateInfo) {
    detailedAnalysis += `【Human Design & Davranışsal Arketip】\n` +
      `• Aktif Kapı: ${hdGateInfo.gate}. Kapı - ${hdGateInfo.title} (Çizgi ${hdGateInfo.line})\n` +
      `• Gölge Tehdidi: ${hdGateInfo.shadow}\n` +
      `• Hediye Potansiyeli: ${hdGateInfo.gift}\n\n`;
  }

  if (customInterp) {
    detailedAnalysis += `【Burç & Arketip Dinamiği: ${sign} Burcu】\n${customInterp.summary}\n\n`;
  }

  if (aspectInfos.length > 0) {
    detailedAnalysis += `【Bütünleşik Açı Bağlantıları & Tetiklenen Alanlar】\n` +
      aspectInfos.map(a => `• ${a.aspectType} Natal ${a.natalPlanet}${a.natalHouse ? ` (${a.natalHouse}. Ev)` : ''} [Orb: ${a.orb.toFixed(1)}°]: ${a.summary}`).join('\n') + '\n\n';
  }

  if (transitPlanet.isRetrograde) {
    detailedAnalysis += `【Retro (Rx) İçsel Muhasebe】\n${pName} geri harekette olduğu için bu evin konularında dışarıya fevri adımlar atmak yerine, geçmişten gelen eksikleri tamamlamak ve içsel strateji kurmak çok daha hayırlıdır.\n\n`;
  }

  return {
    planetName: pName,
    sign,
    degreeInSign: transitPlanet.degreeInSign,
    minutes: transitPlanet.minutes,
    isRetrograde: transitPlanet.isRetrograde,
    house,
    houseTitle,
    houseKeywords: houseTheme,
    aspects: aspectInfos,
    headline,
    humanThemeTitle,
    humanNarrative,
    hdGateInfo,
    synthesisSummary,
    detailedAnalysis,
    actionAdvice,
    chakraLayer
  };
}

export interface SectionBlock {
  title: string;
  content: string;
  type: 'phase' | 'theme' | 'collective' | 'advice' | 'retro' | 'house' | 'aspects' | 'sources_header' | 'general';
}

export function parseInterpretationSections(text: string): SectionBlock[] {
  if (!text) return [];
  if (!text.includes('【')) {
    return [{ title: '', content: text.trim(), type: 'general' }];
  }

  const rawBlocks = text.split('【').filter(b => b.trim().length > 0);
  return rawBlocks.map(block => {
    const closeIdx = block.indexOf('】');
    if (closeIdx === -1) {
      return { title: '', content: block.trim(), type: 'general' };
    }
    const title = block.slice(0, closeIdx).trim();
    const content = block.slice(closeIdx + 1).trim();

    let type: SectionBlock['type'] = 'general';
    const lowerTitle = title.toLowerCase();
    if (lowerTitle.includes('kaynaklar') || lowerTitle.includes('dayandığı')) {
      type = 'sources_header';
    } else if (lowerTitle.includes('yaşam alanı') || lowerTitle.includes('ev ') || lowerTitle.includes('ev:')) {
      type = 'house';
    } else if (lowerTitle.includes('bağlantı') || lowerTitle.includes('açı') || lowerTitle.includes('tetiklenen')) {
      type = 'aspects';
    } else if (lowerTitle.includes('geçiş evresi') || lowerTitle.includes('evre') || lowerTitle.includes('ingress')) {
      type = 'phase';
    } else if (lowerTitle.includes('tema') || lowerTitle.includes('özet') || lowerTitle.includes('doğa') || lowerTitle.includes('arketip')) {
      type = 'theme';
    } else if (lowerTitle.includes('kolektif') || lowerTitle.includes('toplumsal') || lowerTitle.includes('küresel')) {
      type = 'collective';
    } else if (lowerTitle.includes('tavsiye') || lowerTitle.includes('rehberlik') || lowerTitle.includes('eylem') || lowerTitle.includes('dönüşüm')) {
      type = 'advice';
    } else if (lowerTitle.includes('retro') || lowerTitle.includes('rx')) {
      type = 'retro';
    }

    return { title, content, type };
  });
}

/**
 * Generates a unified, synthesized collective sky transit report for a specific sky planet.
 * Connects the Planet + Zodiac Sign + Ingress Phase + Human Design Gate + Aspecting Sky Planets into one narrative.
 */
export function generateUnifiedSkyPlanet(
  skyPlanet: AstroPoint,
  allSkyAspects: any[],
  allSkyPlanets: AstroPoint[]
): UnifiedSkyPlanet {
  const pName = skyPlanet.name;
  const sign = skyPlanet.sign;
  const ingressPhase = getIngressPhase(skyPlanet.degreeInSign, skyPlanet.minutes, skyPlanet.isRetrograde);

  // Human Design Gate
  const hdCalc = getGateAndLine(skyPlanet.longitude);
  const gateMeta = GATE_TITLES[hdCalc.gate];
  const hdGateInfo = gateMeta ? {
    gate: hdCalc.gate,
    line: hdCalc.line,
    title: gateMeta.title,
    gift: gateMeta.gift,
    shadow: gateMeta.shadow,
  } : undefined;

  // Custom/Sign Interpretation
  const customKey = `${pName}-${sign}`;
  const customInterp = MAJOR_PLANET_SIGN_CUSTOM_INTERPRETATIONS[customKey];
  const signInterp = getSkyPlanetSignInterpretation(pName, sign, skyPlanet.degreeInSign, skyPlanet.minutes, skyPlanet.isRetrograde);
  const briefHeadline = getPlanetSignBriefHeadline(pName, sign);

  // Matching Aspects for this planet in the sky with STRICT MUNDANE ORB FILTER
  // Anlık gökyüzü transitlerinde orbu 3.5° (Ay için 4.5°, Görmeyen için 2.0°) üzerindeki alakasız açılar elenir.
  const matchingAspects = (allSkyAspects || []).filter(a => {
    if (a.planet1 !== pName && a.planet2 !== pName) return false;
    const hasMoon = a.planet1 === 'Ay' || a.planet2 === 'Ay';
    if (a.type === 'Görmeyen') return a.orb <= 2.0;
    const maxOrb = hasMoon ? 4.5 : 3.5;
    return a.orb <= maxOrb;
  });

  // Kesinlik (Proximity) önceliği: 0.0°'ye en yakın olan zirve açı daima en başa gelir!
  matchingAspects.sort((a, b) => a.orb - b.orb);

  const aspectInfos: UnifiedSkyAspectInfo[] = matchingAspects.map(asp => {
    const targetName = asp.planet1 === pName ? asp.planet2 : asp.planet1;
    const targetPlanet = allSkyPlanets.find(item => item.name === targetName);
    const isHarmonious = asp.type === 'Üçgen' || asp.type === 'Sekstil' || (asp.type === 'Kavuşum' && !['Satürn', 'Mars', 'Plüton'].includes(targetName));
    const interp = asp.interpretation || getSkyAspectInterpretation(asp.planet1, asp.planet2, asp.type);

    const orbStrength = asp.orb <= 1.0 
      ? 'Tam Kesin (Pik)' 
      : asp.orb <= 2.5 
      ? 'Aktif & Yoğun' 
      : 'Gelişen / Hafif';

    return {
      targetPlanet: targetName,
      targetSign: targetPlanet?.sign,
      targetDegree: targetPlanet?.degreeInSign,
      aspectType: asp.type,
      orb: asp.orb,
      orbStrength,
      isHarmonious,
      summary: interp?.summary || `${targetName} ile ${asp.type} açısı.`,
      energyType: interp?.energyType || (isHarmonious ? 'Destekleyici' : 'Zorlayıcı / Sınav')
    };
  });

  const primaryChallenging = aspectInfos.find(a => !a.isHarmonious);
  const primaryHarmonious = aspectInfos.find(a => a.isHarmonious && a.aspectType !== 'Kavuşum');
  const conjunctionAspect = aspectInfos.find(a => a.aspectType === 'Kavuşum');

  // 1. İnsan Odaklı Kolektif Başlık
  let humanThemeTitle = '';
  if (primaryChallenging) {
    humanThemeTitle = `Kolektif ${pName} ile ${primaryChallenging.targetPlanet} Arasında Denge & Sınav`;
  } else if (primaryHarmonious) {
    humanThemeTitle = `Kolektif ${pName} ve ${primaryHarmonious.targetPlanet} Arasında Akıcı Destek & Fırsat`;
  } else if (conjunctionAspect) {
    humanThemeTitle = `Kolektif ${pName} ve ${conjunctionAspect.targetPlanet} Kavuşumu: Yoğun Odak & Yenilenme`;
  } else {
    humanThemeTitle = `${pName} ${sign} Seyrinde: ${briefHeadline}`;
  }

  // 2. 7Layers Kolektif Gökyüzü Özeti
  let humanNarrative = `${pName}, ${sign} burcundaki seyrinde; kolektif bilince ${signInterp.summary.replace(/^.*?;\s*/, '')} `;

  const challengingList = aspectInfos.filter(a => !a.isHarmonious);
  const harmoniousList = aspectInfos.filter(a => a.isHarmonious && a.aspectType !== 'Kavuşum');

  if (challengingList.length > 0) {
    humanNarrative += `Şu sıralar gökyüzünde ${challengingList.map(a => `${a.targetPlanet} (${a.aspectType})`).join(', ')} ile kurduğu etkileşim; toplumsal ve bireysel düzeyde sabır, net sınırlar ve yüzleşmeler gerektiren bir gerilim yaratabilir. Bir tarafa aşırı kilitlenirken diğer sorumlulukları ihmal etmemek hayati önem taşır. `;
  }

  if (harmoniousList.length > 0) {
    humanNarrative += `Aynı zamanda ${harmoniousList.map(a => `${a.targetPlanet} (${a.aspectType})`).join(', ')} ile kurduğu ahenkli temas, tıkanıklıkları aşmanız için yapıcı çözümler, ilham verici çıkış yolları ve bereketli fırsatlar sunuyor. `;
  }

  if (conjunctionAspect) {
    humanNarrative += `${conjunctionAspect.targetPlanet} ile olan kavuşumu ise, bu alanda yepyeni ve tavizsiz bir odaklanma enerjisi başlatıyor. `;
  }

  if (aspectInfos.length === 0) {
    humanNarrative += `Şu anda diğer gökyüzü gezegenleriyle sert bir açı bağı kurmadan, ${sign} burcundaki arketipsel gücünü sakin ve istikrarlı bir şekilde dünyaya yaymaya devam ediyor. `;
  }

  if (hdGateInfo) {
    humanNarrative += `Bu gökyüzü döngüsünün kolektif anahtarı; "${hdGateInfo.shadow}" tuzağına kapılarak yıpranmak yerine, "${hdGateInfo.gift}" potansiyelini kararlarınıza ve ilişkilerinize yansıtabilmektir. `;
  }

  if (signInterp.advice) {
    humanNarrative += ` ${signInterp.advice}`;
  }

  const retroText = skyPlanet.isRetrograde ? ' (Retro Harekette - Rx)' : '';
  const headline = `Kolektif ${pName} (${sign} ${skyPlanet.degreeInSign}°)${retroText}`;
  const chakraLayer = customInterp?.chakra || PLANET_CHAKRAS[pName] || 'Kozmik Katman Entegrasyonu';
  const collectiveTheme = customInterp?.collective || signInterp.summary;
  const dailyAdvice = signInterp.advice || customInterp?.advice || 'Bu dönemde kendi içsel dengenizi koruyarak adımlar atın.';

  // Detailed Analysis Synthesis for modal
  let detailedAnalysis = `【7Layers Kolektif Gökyüzü Özeti】\n${humanNarrative}\n\n` +
    `【Kolektif Bilinç ve Toplumsal Etki】\n${collectiveTheme}\n\n` +
    `【Günün Kolektif Rehberliği & Tavsiyesi】\n${dailyAdvice}\n\n` +
    `【Metnin Dayandığı Kozmik Katmanlar】\n` +
    `Bu analiz anlık gökyüzü gezegen konumları, burç dinamikleri ve açı kalıplarının sentezlenmesiyle oluşturulmuştur:\n\n` +
    `【Burç Seyri & Geçiş Evresi: ${sign} Burcu】\n` +
    `• Evre: ${ingressPhase.badge} (${ingressPhase.label})\n` +
    `• Açıklama: ${ingressPhase.description}\n` +
    `• Burç Dinamiği: ${signInterp.summary}\n\n`;

  if (hdGateInfo) {
    detailedAnalysis += `【Human Design Kozmik Kapısı】\n` +
      `• Aktif Kapı: ${hdGateInfo.gate}. Kapı - ${hdGateInfo.title} (Çizgi ${hdGateInfo.line})\n` +
      `• Gölge Tuzağı: ${hdGateInfo.shadow}\n` +
      `• Hediye Frekansı: ${hdGateInfo.gift}\n\n`;
  }

  if (aspectInfos.length > 0) {
    detailedAnalysis += `【Eşzamanlı Aktif Gökyüzü Açıları】\n` +
      aspectInfos.map(a => `• ${a.aspectType} ${a.targetPlanet}${a.targetSign ? ` (${a.targetSign} ${a.targetDegree || 0}°)` : ''} [Orb: ${a.orb.toFixed(1)}° • ${a.orbStrength}]: ${a.summary}`).join('\n') + '\n\n';
  }

  if (skyPlanet.isRetrograde) {
    detailedAnalysis += `【Retro (Rx) İçe Dönüş】\n${pName} gökyüzünde geri harekette seyrediyor. Bu dönemde dışsal fevri atılımlar yerine, içsel değerlendirmeler yapmak, eksikleri onarmak ve stratejileri sağlamlaştırmak kolektif olarak çok daha verimlidir.\n\n`;
  }

  const minOrb = aspectInfos.length > 0 ? Math.min(...aspectInfos.map(a => a.orb)) : undefined;

  return {
    planetName: pName,
    sign,
    degreeInSign: skyPlanet.degreeInSign,
    minutes: skyPlanet.minutes,
    isRetrograde: skyPlanet.isRetrograde,
    longitude: skyPlanet.longitude,
    ingressPhase,
    aspects: aspectInfos,
    headline,
    humanThemeTitle,
    humanNarrative,
    hdGateInfo,
    collectiveTheme,
    dailyAdvice,
    chakraLayer,
    detailedAnalysis,
    minOrb
  };
}

export function generateUnifiedSkyPlanets(
  allSkyPlanets: AstroPoint[],
  allSkyAspects: any[],
  sortBy: 'orb' | 'classic' = 'orb'
): UnifiedSkyPlanet[] {
  if (!allSkyPlanets || allSkyPlanets.length === 0) return [];

  const PRIORITY_ORDER = [
    'Güneş', 'Ay', 'Merkür', 'Venüs', 'Mars',
    'Jüpiter', 'Satürn', 'Uranüs', 'Neptün', 'Plüton',
    'Kiron', 'Kuzey Ay Düğümü', 'Lilith'
  ];

  const filteredPlanets = [...allSkyPlanets].filter(p => PRIORITY_ORDER.includes(p.name));
  const unifiedList = filteredPlanets.map(p => generateUnifiedSkyPlanet(p, allSkyAspects, allSkyPlanets));

  if (sortBy === 'classic') {
    return unifiedList.sort((a, b) => PRIORITY_ORDER.indexOf(a.planetName) - PRIORITY_ORDER.indexOf(b.planetName));
  }

  // Varsayılan: ORB ÖNCELİKLİ (0.0°'ye en yakın, en kesin pik yapan açısı olan gezegenler en üstte!)
  return unifiedList.sort((a, b) => {
    const aOrb = a.minOrb !== undefined ? a.minOrb : 999;
    const bOrb = b.minOrb !== undefined ? b.minOrb : 999;

    if (aOrb !== bOrb) {
      return aOrb - bOrb;
    }
    // Eşitlik durumunda klasik sıraya göre
    return PRIORITY_ORDER.indexOf(a.planetName) - PRIORITY_ORDER.indexOf(b.planetName);
  });
}

export interface CurrentSkyOverview {
  headline: string;
  subHeadline: string;
  vibeNarrative: string;
  moonSign: string;
  moonDegree: number;
  moonMood: string;
  sunSign: string;
  sunDegree: number;
  barometer: {
    mental: { score: number; label: string; tone: string };
    emotional: { score: number; label: string; tone: string };
    action: { score: number; label: string; tone: string };
  };
  opportunities: string[];
  cautions: string[];
  topAspects: {
    p1: string;
    p2: string;
    aspectType: string;
    orb: number;
    badge: string;
    isHarmonious: boolean;
    summary: string;
  }[];
}

const MOON_MOODS: Record<string, { mood: string; energy: string; doAction: string; dontAction: string }> = {
  'Koç': { mood: 'Atılgan, sabırsız ve cesur', energy: 'Yüksek', doAction: 'Yeni adımlar atın ve fiziksel enerjinizi eyleme dökün.', dontAction: 'Düşünmeden fevri kararlar almaktan ve sert çıkışlardan kaçının.' },
  'Boğa': { mood: 'Dingin, kararlı ve güven arayan', energy: 'Sakin & Kalıcı', doAction: 'Finansal konuları düzenleyin, bedeninizi dinlendirin ve somut işlere odaklanın.', dontAction: 'Aşırı inatçılıktan ve değişime direnç göstermekten kaçının.' },
  'İkizler': { mood: 'Meraklı, konuşkan ve hareketli', energy: 'Zihinsel & Hızlı', doAction: 'İletişim kurun, araştırın, yarım kalan görüşmeleri ve yazışmaları tamamlayın.', dontAction: 'Aynı anda çok şeye bölünüp zihninizi dağıtmaktan kaçının.' },
  'Yengeç': { mood: 'Hassas, koruyucu ve sezgisel', energy: 'İçe Dönük & Derin', doAction: 'Sevdiklerinize ve evinize vakit ayırın, iç sesinize ve rüyalarınıza güvenin.', dontAction: 'Aşırı alınganlık yapmaktan ve geçmiş kırgınlıklara saplanmaktan kaçının.' },
  'Aslan': { mood: 'Özgüvenli, cömert ve sahne odaklı', energy: 'Sıcak & Yaratıcı', doAction: 'Yaratıcı projelerinizi sergileyin, cesaretinizi ortaya koyun ve takdir edin.', dontAction: 'Ego savaşlarına girmekten ve aşırı gururdan kaçının.' },
  'Başak': { mood: 'Analitik, titiz ve düzenleyici', energy: 'Pratik & Odaklı', doAction: 'Dağınıklıkları toparlayın, detay gerektiren işleri bitirin ve sağlığınıza özen gösterin.', dontAction: 'Aşırı özeleştiri yapmaktan ve kusur arayarak kaygılanmaktan kaçının.' },
  'Terazi': { mood: 'Uyumlu, diplomatik ve estetik', energy: 'Dengeli & Sosyal', doAction: 'İlişkilerde uzlaşma sağlayın, adaleti gözetin ve estetik dokunuşlar yapın.', dontAction: 'Kararsızlıkta kilitlenmekten ve ' + 'herkesi memnun etmek için kendinizi unutmaktan kaçının.' },
  'Akrep': { mood: 'Derin, sezgisel ve dönüştürücü', energy: 'Yoğun & Manyetik', doAction: 'Gizli kalmış meseleleri çözün, stratejik planlar yapın ve arınmaya odaklanın.', dontAction: 'Kuşkuculuğa kapılmaktan ve gizli güç savaşlarına girmekten kaçının.' },
  'Yay': { mood: 'İyimser, vizyoner ve özgür', energy: 'Genişlemeci & Neşeli', doAction: 'Gelecek vizyonunuzu genişletin, yeni şeyler öğrenin ve umudunuzu tazeleyin.', dontAction: 'Gerçekleşmesi zor büyük vaatler vermekten ve detayları ihmal etmekten kaçının.' },
  'Oğlak': { mood: 'Disiplinli, sorumluluk sahibi ve gerçekçi', energy: 'Ciddi & Hedef Odaklı', doAction: 'Kariyer hedeflerinize odaklanın, somut ve kalıcı planlar yapın.', dontAction: 'Aşırı karamsarlığa kapılmaktan ve kendinize katı kurallar koymaktan kaçının.' },
  'Kova': { mood: 'Yenilikçi, özgür ve vizyoner', energy: 'Sıradışı & Kolektif', doAction: 'Özgün fikirlerinizi paylaşın, toplumsal faydaya ve teknolojiye alan açın.', dontAction: 'Duygulardan tamamen kopuk davranmaktan ve anlamsız asilik yapmaktan kaçının.' },
  'Balık': { mood: 'Şefkatli, ilham dolu ve akışta', energy: 'Süptil & Manevi', doAction: 'Meditasyon, sanat ve şifa çalışmalarına yönelin, sezgilerinize kulak verin.', dontAction: 'Sorumluluklardan kaçmaktan ve kurban psikolojisine bürünmekten kaçının.' },
};

export function generateCurrentSkyOverview(
  allSkyPlanets: AstroPoint[],
  allSkyAspects: any[]
): CurrentSkyOverview | null {
  if (!allSkyPlanets || allSkyPlanets.length === 0) return null;

  const sun = allSkyPlanets.find(p => p.name === 'Güneş');
  const moon = allSkyPlanets.find(p => p.name === 'Ay');
  const mercury = allSkyPlanets.find(p => p.name === 'Merkür');
  const mars = allSkyPlanets.find(p => p.name === 'Mars');

  const moonSign = moon?.sign || 'Koç';
  const moonDeg = moon?.degreeInSign ?? 0;
  const sunSign = sun?.sign || 'Terazi';
  const sunDeg = sun?.degreeInSign ?? 0;

  const moonData = MOON_MOODS[moonSign] || MOON_MOODS['Koç'];

  // Açıları dar orb'a göre filtrele ve sırala
  const validAspects = (allSkyAspects || []).filter(a => a.orb <= 3.2);
  validAspects.sort((a, b) => a.orb - b.orb);

  const topAspects = validAspects.slice(0, 3).map(asp => {
    const isHarmonious = asp.type === 'Üçgen' || asp.type === 'Sekstil' || (asp.type === 'Kavuşum' && !['Satürn', 'Mars', 'Plüton'].includes(asp.planet2));
    const interp = asp.interpretation || getSkyAspectInterpretation(asp.planet1, asp.planet2, asp.type);
    return {
      p1: asp.planet1,
      p2: asp.planet2,
      aspectType: asp.type,
      orb: asp.orb,
      isHarmonious,
      summary: interp?.summary || `${asp.planet1} - ${asp.planet2} ${asp.type} açısı.`,
      badge: asp.orb <= 1.0 ? 'Pik Etki (Kesin)' : `${asp.orb.toFixed(1)}° Orb`
    };
  });

  // Barometre Puanları Hesaplama
  let mentalScore = 72;
  let emotionalScore = 70;
  let actionScore = 68;

  // Ay burcu elementi
  if (['Yengeç', 'Akrep', 'Balık'].includes(moonSign)) {
    emotionalScore += 16;
  } else if (['İkizler', 'Terazi', 'Kova'].includes(moonSign)) {
    mentalScore += 14;
  } else if (['Koç', 'Aslan', 'Yay'].includes(moonSign)) {
    actionScore += 18;
  } else if (['Boğa', 'Başak', 'Oğlak'].includes(moonSign)) {
    mentalScore += 8;
    actionScore += 8;
  }

  // Açıların etkisi
  topAspects.forEach(asp => {
    if (asp.isHarmonious) {
      mentalScore += 4;
      actionScore += 4;
    } else {
      emotionalScore += 6;
      actionScore += 2;
    }
  });

  mentalScore = Math.min(95, Math.max(45, mentalScore));
  emotionalScore = Math.min(96, Math.max(50, emotionalScore));
  actionScore = Math.min(94, Math.max(48, actionScore));

  const mentalTone = mentalScore >= 80 ? 'Yüksek & Berrak' : mentalScore >= 65 ? 'Stratejik & Dengeli' : 'Dağınık / Dikkat İstiyor';
  const emotionalTone = emotionalScore >= 80 ? 'Yoğun & Sezgisel' : emotionalScore >= 65 ? 'Dengeli & Sakin' : 'Hassas / Dinlenme Gerek';
  const actionTone = actionScore >= 80 ? 'Dinamik & Kararlı' : actionScore >= 65 ? 'Ölçülü & İstikrarlı' : 'Ağır / Bekle-Gör';

  // Başlık Kurgusu
  const peakAspect = topAspects[0];
  let headline = `Kozmik Rüzgar: Ay ${moonSign}'da — ${moonData.mood}`;
  if (peakAspect) {
    if (peakAspect.isHarmonious) {
      headline = `Akıcı ve Destekleyici Enerjiler: Ay ${moonSign}'da (${peakAspect.p1}-${peakAspect.p2} ${peakAspect.aspectType})`;
    } else {
      headline = `Farkındalık ve Denge Zamanı: Ay ${moonSign}'da (${peakAspect.p1}-${peakAspect.p2} ${peakAspect.aspectType})`;
    }
  }

  const subHeadline = `☉ Güneş ${sunSign} (${sunDeg}°) • ☽ Ay ${moonSign} (${moonDeg}°)`;

  // Vurucu 2-3 Cümlelik Genel Anlatı
  let vibeNarrative = `Şu anda kolektif bilinçaltı Ay'ın ${moonSign} seyrinde şekilleniyor; genel atmosfer ${moonData.mood.toLowerCase()} bir frekansta akıyor. `;
  if (peakAspect) {
    vibeNarrative += `Gökyüzünde pik yapan ${peakAspect.p1} ile ${peakAspect.p2} arasındaki ${peakAspect.aspectType} açısı (${peakAspect.orb.toFixed(1)}°), ${peakAspect.summary.replace(/^.*?;\s*/, '')} `;
  }
  vibeNarrative += `Günün anahtarı: Duygusal dalgalanmalar karşısında merkezinizde kalarak, ${moonData.doAction.toLowerCase()}`;

  // Fırsatlar ve Tuzaklar
  const opportunities = [
    moonData.doAction,
    peakAspect?.isHarmonious
      ? `${peakAspect.p1} ve ${peakAspect.p2} temasının getirdiği ilhamı somut projelere dönüştürün.`
      : 'Zorlayıcı görünen durumları olgunlukla karşılayıp içsel sınırlarınızı netleştirin.'
  ];

  const cautions = [
    moonData.dontAction,
    peakAspect && !peakAspect.isHarmonious
      ? `${peakAspect.p1} ve ${peakAspect.p2} geriliminde aceleci kararlar almaktan ve restleşmelerden uzak durun.`
      : 'Günün getirdiği rahatlığa fazla kapılıp önemli sorumlulukları ertelemeyin.'
  ];

  return {
    headline,
    subHeadline,
    vibeNarrative,
    moonSign,
    moonDegree: moonDeg,
    moonMood: moonData.mood,
    sunSign,
    sunDegree: sunDeg,
    barometer: {
      mental: { score: mentalScore, label: `${mentalScore}%`, tone: mentalTone },
      emotional: { score: emotionalScore, label: `${emotionalScore}%`, tone: emotionalTone },
      action: { score: actionScore, label: `${actionScore}%`, tone: actionTone }
    },
    opportunities,
    cautions,
    topAspects
  };
}

export interface PersonalTransitOverview {
  headline: string;
  subHeadline: string;
  themeDescription: string;
  focusHouses: {
    house: number;
    title: string;
    description: string;
    planetNames: string[];
  }[];
  barometer: {
    mental: { score: number; label: string; tone: string };
    emotional: { score: number; label: string; tone: string };
    action: { score: number; label: string; tone: string };
  };
  opportunities: string[];
  cautions: string[];
  topAspects: {
    transitPlanet: string;
    transitSign: string;
    transitDegree: number;
    natalPlanet: string;
    natalSign: string;
    natalDegree: number;
    natalHouse: number;
    aspectType: string;
    orb: number;
    badge: string;
    isHarmonious: boolean;
    summary: string;
  }[];
  lifeAdvice: string;
}

export function generatePersonalTransitOverview(
  transitPlanets: AstroPoint[],
  allTransitAspect: TransitAspect[],
  natalPlanets: AstroPoint[],
  natalHouses: AstroPoint[]
): PersonalTransitOverview | null {
  if (!transitPlanets || transitPlanets.length === 0 || !natalPlanets || natalPlanets.length === 0) {
    return null;
  }

  // Açıları dar orb'a göre sırala (0.0° en başta)
  const validAspects = (allTransitAspect || []).filter(a => a.orb <= 3.5);
  validAspects.sort((a, b) => a.orb - b.orb);

  const topAspects = validAspects.slice(0, 3).map(asp => {
    const tPlanet = transitPlanets.find(p => p.name === asp.transitPlanet);
    const nPlanet = natalPlanets.find(p => p.name === asp.natalPlanet);
    const nHouse = nPlanet ? (nPlanet.house || getHouseFromLongitude(nPlanet.longitude, natalHouses)) : 1;
    const isHarmonious = asp.type === 'Üçgen' || asp.type === 'Sekstil' || (asp.type === 'Kavuşum' && !['Satürn', 'Mars', 'Plüton'].includes(asp.transitPlanet));

    const tSign = tPlanet?.sign || '';
    const tDeg = tPlanet?.degreeInSign ?? 0;
    const nSign = nPlanet?.sign || '';
    const nDeg = nPlanet?.degreeInSign ?? 0;

    let summary = '';
    const nArea = HOUSE_SHORT_THEMES[nHouse] || `${nHouse}. evinizi`;
    switch (asp.type) {
      case 'Kavuşum':
        summary = `Transit ${asp.transitPlanet} (${tSign} ${tDeg}°), ${nHouse}. evinizdeki Natal ${asp.natalPlanet} (${nSign} ${nDeg}°) ile tam kavuşumda. ${nArea} alanında taze ve yoğun bir başlangıç enerjisi açıyor.`;
        break;
      case 'Üçgen':
        summary = `Transit ${asp.transitPlanet} (${tSign} ${tDeg}°), ${nHouse}. evinizdeki Natal ${asp.natalPlanet} (${nSign} ${nDeg}°) ile uyumlu üçgen açıda. Bu alanda çabasız ve destekleyici bir akış sunuyor.`;
        break;
      case 'Sekstil':
        summary = `Transit ${asp.transitPlanet} (${tSign} ${tDeg}°), ${nHouse}. evinizdeki Natal ${asp.natalPlanet} (${nSign} ${nDeg}°) ile sekstil açıda. Somut fırsatları fark edip değerlendirmeniz için kapı açıyor.`;
        break;
      case 'Kare':
        summary = `Transit ${asp.transitPlanet} (${tSign} ${tDeg}°), ${nHouse}. evinizdeki Natal ${asp.natalPlanet} (${nSign} ${nDeg}°) ile kare açıda. ${nArea} konusunda sizi harekete geçiren yapıcı bir gerilim ve eşik yaratıyor.`;
        break;
      case 'Karşıt':
        summary = `Transit ${asp.transitPlanet} (${tSign} ${tDeg}°), ${nHouse}. evinizdeki Natal ${asp.natalPlanet} (${nSign} ${nDeg}°) ile karşıt açıda. İkili dengelerde ve sınırlarınızda farkındalık sınavı veriyor.`;
        break;
      default:
        summary = `Transit ${asp.transitPlanet} (${tSign} ${tDeg}°), Natal ${asp.natalPlanet} (${nSign} ${nDeg}°) ile ${asp.type} açısında.`;
    }

    const badge = asp.orb <= 0.8 ? `★ Tam Pik (${asp.orb.toFixed(1)}°)` : `${asp.orb.toFixed(1)}° Orb`;

    return {
      transitPlanet: asp.transitPlanet,
      transitSign: tSign,
      transitDegree: tDeg,
      natalPlanet: asp.natalPlanet,
      natalSign: nSign,
      natalDegree: nDeg,
      natalHouse: nHouse,
      aspectType: asp.type,
      orb: asp.orb,
      badge,
      isHarmonious,
      summary
    };
  });

  // Odak Yaşam Alanları (En çok transit gezegen alan evler)
  const houseCounts: Record<number, string[]> = {};
  for (const tp of transitPlanets) {
    const h = tp.house || getHouseFromLongitude(tp.longitude, natalHouses);
    if (!houseCounts[h]) houseCounts[h] = [];
    houseCounts[h].push(tp.name);
  }

  const sortedHouses = Object.entries(houseCounts)
    .map(([hStr, pNames]) => ({
      house: parseInt(hStr, 10),
      planetNames: pNames,
      count: pNames.length
    }))
    .sort((a, b) => b.count - a.count);

  const focusHouses = sortedHouses.slice(0, 2).map(item => ({
    house: item.house,
    title: HOUSE_TITLES[item.house] || `${item.house}. Ev`,
    description: HOUSE_SHORT_THEMES[item.house] || 'bu yaşam alanınız',
    planetNames: item.planetNames
  }));

  // Barometre Puanları Hesaplama
  let mentalScore = 74;
  let emotionalScore = 70;
  let actionScore = 72;

  const tMoon = transitPlanets.find(p => p.name === 'Ay');
  const tMoonHouse = tMoon ? (tMoon.house || getHouseFromLongitude(tMoon.longitude, natalHouses)) : 1;

  if ([1, 5, 9].includes(tMoonHouse)) {
    actionScore += 12;
    mentalScore += 6;
  } else if ([4, 8, 12].includes(tMoonHouse)) {
    emotionalScore += 16;
    actionScore -= 4;
  } else if ([3, 6, 10].includes(tMoonHouse)) {
    mentalScore += 14;
    actionScore += 8;
  } else if ([2, 7, 11].includes(tMoonHouse)) {
    mentalScore += 8;
    emotionalScore += 8;
  }

  topAspects.forEach(asp => {
    if (asp.isHarmonious) {
      mentalScore += 5;
      actionScore += 4;
    } else {
      emotionalScore += 6;
      actionScore += 2;
    }
  });

  mentalScore = Math.min(95, Math.max(45, mentalScore));
  emotionalScore = Math.min(96, Math.max(48, emotionalScore));
  actionScore = Math.min(95, Math.max(46, actionScore));

  const mentalTone = mentalScore >= 80 ? 'Yüksek & Berrak' : mentalScore >= 65 ? 'Stratejik & Dengeli' : 'Dağınık / Dinlenme İhtiyacı';
  const emotionalTone = emotionalScore >= 80 ? 'Yoğun & Sezgisel' : emotionalScore >= 65 ? 'Dengeli & Dingin' : 'Hassas / Sınır Koruma';
  const actionTone = actionScore >= 80 ? 'Kararlı & Cesur' : actionScore >= 65 ? 'Ölçülü & İstikrarlı' : 'Temkinli / Gözlemde Kal';

  const peak = topAspects[0];
  let headline = 'Doğum Haritanızda Dengeli Kozmik Akış';
  let subHeadline = focusHouses.length > 0 
    ? `Ana Odak: ${focusHouses.map(h => `${h.house}. Ev (${h.description})`).join(' ve ')}`
    : 'Bütünsel Dönüşüm Süreci';

  if (peak) {
    if (peak.isHarmonious) {
      headline = `Destekleyici & Akıcı İlerleme: ${peak.transitPlanet} ➔ Natal ${peak.natalPlanet} (${peak.aspectType})`;
    } else {
      headline = `Farkındalık & Yapılanma Zamanı: ${peak.transitPlanet} ➔ Natal ${peak.natalPlanet} (${peak.aspectType})`;
    }
  }

  let themeDescription = '';
  if (focusHouses.length > 0) {
    themeDescription = `Bugün haritanızda en yoğun kozmik hareketlilik doğrudan ${focusHouses.map(h => `${h.house}. evinizde (${h.description})`).join(' ve ')} üzerinde toplanıyor. `;
  } else {
    themeDescription = `Bugün gezegen geçişleri doğum haritanızın kilit noktalarını hassas açılarla aydınlatıyor. `;
  }

  if (peak) {
    themeDescription += `Özellikle ${peak.transitPlanet} (${peak.transitSign} ${peak.transitDegree}°) ile ${peak.natalHouse}. evinizdeki Natal ${peak.natalPlanet} (${peak.natalSign} ${peak.natalDegree}°) arasındaki ${peak.aspectType} açısı (${peak.orb.toFixed(1)}° tolerans), günün belirleyici dinamiğini çiziyor. `;
  }

  themeDescription += `Dış dünyadaki gelişmelere fevri tepkiler vermek yerine, kendi içsel merkezinizi koruyarak adımlarınızı bilinçli atmanız sürecin hediyelerini açığa çıkaracaktır.`;

  const opportunities: string[] = [];
  const cautions: string[] = [];

  const harmoniousAspects = topAspects.filter(a => a.isHarmonious);
  const challengingAspects = topAspects.filter(a => !a.isHarmonious);

  if (harmoniousAspects.length > 0) {
    harmoniousAspects.forEach(asp => {
      opportunities.push(`Transit ${asp.transitPlanet} (${asp.transitSign} ${asp.transitDegree}°) ➔ Natal ${asp.natalPlanet} (${asp.natalSign} ${asp.natalDegree}°): ${asp.natalHouse}. evinizdeki potansiyellerinizi rahatlıkla açığa çıkarabilir, önünüze çıkan fırsatları değerlendirebilirsiniz.`);
    });
  } else {
    opportunities.push('Günün sakin enerjisi altında geçmiş planlarınızı gözden geçirmek ve içsel dinginliği güçlendirmek için elverişli bir zemin var.');
  }

  if (challengingAspects.length > 0) {
    challengingAspects.forEach(asp => {
      cautions.push(`Transit ${asp.transitPlanet} (${asp.transitSign} ${asp.transitDegree}°) ➔ Natal ${asp.natalPlanet} (${asp.natalSign} ${asp.natalDegree}°): ${asp.natalHouse}. ev konularında fevri restleşmelerden ve acele kararlardan kaçının; sınırlarınızı koruyarak ilerleyin.`);
    });
  } else {
    cautions.push('Aşırı rahatlığa kapılıp tamamlanması gereken sorumluluklarınızı ertelemekten kaçının.');
  }

  const lifeAdvice = peak
    ? (peak.isHarmonious 
        ? `${peak.natalHouse}. evinizin sunduğu bereketli akışı cesaret ve şükranla karşılayın; ertelediğiniz adımları hayata geçirin.`
        : `${peak.natalHouse}. evinizde beliren sürtüşmeleri bir kriz değil, sizi daha sağlam ve olgun kılan bir basamak olarak görün.`)
    : 'Haritanızdaki sakin akışı içsel dinlenme ve hedeflerinizi sadeleştirme fırsatı olarak değerlendirin.';

  return {
    headline,
    subHeadline,
    themeDescription,
    focusHouses,
    barometer: {
      mental: { score: mentalScore, label: `${mentalScore}%`, tone: mentalTone },
      emotional: { score: emotionalScore, label: `${emotionalScore}%`, tone: emotionalTone },
      action: { score: actionScore, label: `${actionScore}%`, tone: actionTone }
    },
    opportunities: opportunities.slice(0, 3),
    cautions: cautions.slice(0, 3),
    topAspects,
    lifeAdvice
  };
}

