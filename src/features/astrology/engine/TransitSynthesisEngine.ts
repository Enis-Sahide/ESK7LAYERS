import { AstroPoint, TransitAspect, AstroCity } from './AstrologyConstants';
import { 
  MAJOR_PLANET_SIGN_CUSTOM_INTERPRETATIONS,
  getIngressPhase,
  getSkyPlanetSignInterpretation,
  getPlanetSignBriefHeadline,
  getSkyAspectInterpretation,
  IngressPhaseInfo
} from './SkyAspectInterpretations';
import { getGateAndLine } from '@/utils/HumanDesignEngine';
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
  aspectType: 'Kavuşum' | 'Sekstil' | 'Kare' | 'Üçgen' | 'Karşıt' | 'Görmeyen';
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
    const nTheme = nHouse ? `${HOUSE_SHORT_THEMES[nHouse]} alanınızdaki` : '';
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

  let synthesisSummary = `Transit ${pName}, ${sign} burcunda seyrederek doğrudan ${houseTheme} konularınızı tetikliyor. `;
  if (aspectInfos.length > 0) {
    const challenging = aspectInfos.filter(a => !a.isHarmonious);
    const harmonious = aspectInfos.filter(a => a.isHarmonious);
    
    if (challenging.length > 0 && harmonious.length > 0) {
      synthesisSummary += `Aynı anda haritanızdaki ${challenging.map(a => `${a.natalHouse ? `${HOUSE_SHORT_THEMES[a.natalHouse]} alanındaki ` : ''}${a.natalPlanet} (${a.aspectType})`).join(', ')} ile yüzleşme hattı kurarken; ${harmonious.map(a => `${a.natalPlanet} (${a.aspectType})`).join(', ')} ile güçlü bir çıkış ve destek kapısı açıyor.`;
    } else if (challenging.length > 0) {
      synthesisSummary += `Bu süreçte özellikle ${challenging.map(a => `${a.natalHouse ? `${HOUSE_SHORT_THEMES[a.natalHouse]} alanındaki ` : ''}${a.natalPlanet} (${a.aspectType})`).join(', ')} teması üzerinden hayatınızda önemli bir yüzleşme ve yapılandırma talep ediyor.`;
    } else {
      synthesisSummary += `Bu geçiş, ${harmonious.map(a => `${a.natalHouse ? `${HOUSE_SHORT_THEMES[a.natalHouse]} alanındaki ` : ''}${a.natalPlanet} (${a.aspectType})`).join(', ')} ile uyumlanarak bu hayat alanında işlerinizi kolaylaştıran verimli bir akış sunuyor.`;
    }
  } else {
    synthesisSummary += `Şu an doğrudan majör bir natal gezegene açı yapmasa da, bu yaşam alanınızın arka planını sessiz ve derinden dönüştürmeye devam ediyor.`;
  }

  const actionAdvice = customInterp?.advice || 
    `Bu süreçte ${houseTheme} konularında aceleci olmadan, bilinçli ve yapıcı sınırlar çizerek hareket edin. Karşınıza çıkan durumları kriz değil, ruhsal olgunlaşma fırsatı olarak görün.`;

  const chakraLayer = customInterp?.chakra || PLANET_CHAKRAS[pName] || 'Kozmik Katman Entegrasyonu';

  // Detailed Analysis Synthesis:
  // 1. Öncelikli Anlam & Eylem (En Üst Bölüm)
  let detailedAnalysis = `【7Layers Yaşam Alanı Özeti】\n${humanNarrative}\n\n` +
    `【Bireysel Eylem & Dönüşüm Rehberliği】\n${actionAdvice}\n\n` +
    `【Metnin Oluşturulduğu Kaynaklar】\n` +
    `Bu analiz aşağıdaki astrolojik ve enerjetik katmanların sentezlenmesiyle oluşturulmuştur:\n\n` +
    `【Yaşam Alanı Etkisi: ${LIFE_AREA_NAMES[house] || houseTitle}】\n` +
    `${pName}, astrolojide ${PLANET_NATURES[pName] || 'önemli enerjileri'} temsil eder. Bu geçiş; ${houseTheme} alanınızda köklü bir uyanış ve farkındalık yaratır.\n\n`;

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
      aspectInfos.map(a => `• ${a.aspectType} Natal ${a.natalPlanet}${a.natalHouse ? ` (${LIFE_AREA_NAMES[a.natalHouse] || HOUSE_SHORT_THEMES[a.natalHouse]})` : ''} [Orb: ${a.orb.toFixed(1)}°]: ${a.summary}`).join('\n') + '\n\n';
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

export interface CosmicCoreEnergyItem {
  code: string;
  label: string;
  statusText: string;
  score: number; // 1 - 100
  trend: 'up' | 'down';
  colorHex: string;
}

export interface CosmicAttributeGauge {
  id: 'influence' | 'defense' | 'mobility' | 'progress' | 'cognition' | 'endurance' | 'diplomacy' | 'luck' | 'manifestation' | 'healing';
  title: string;
  astroDrivers: string;
  score: number; // 1 - 10
  percent: number; // 10 - 100
  subtitle: string;
  isEsoteric?: boolean;
}

export interface EsotericSkySignature {
  lunarPhase: {
    phaseName: string;
    illumination: number;
    phaseIcon: string;
    esotericSecret: string;
  };
  elementBalance: {
    firePct: number;
    earthPct: number;
    airPct: number;
    waterPct: number;
    dominantLabel: string;
    lackingAdvice: string;
  };
  chakraResonance: {
    chakraName: string;
    sephirahName: string;
    activePlanet: string;
    guidance: string;
  };
}

export interface DetailedCosmicBarometer {
  mental: { score: number; label: string; tone: string };
  emotional: { score: number; label: string; tone: string };
  action: { score: number; label: string; tone: string };
  esotericSignature: EsotericSkySignature;
  coreEnergies: CosmicCoreEnergyItem[];
  attributes: CosmicAttributeGauge[];
}

function clampNum(val: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, val));
}

const CHAKRA_SEPHIRAH_MAP: Record<string, { chakra: string; sephirah: string; guidance: string }> = {
  'Güneş': {
    chakra: 'Kalp & Güneş Sinirağı Çakrası',
    sephirah: 'Tiferet (Güzellik, Öz Benlik & İrade Dengesi)',
    guidance: 'Merkezinizde kalın; içsel ışığınızı egoya kapılmadan cömertçe ortaya koyun.'
  },
  'Ay': {
    chakra: 'Sakral & Üçüncü Göz Çakrası',
    sephirah: 'Yesod (Temel, Astral Hafıza & Sezgisel Akış)',
    guidance: 'Rüyalarınıza, bedeninizin verdiği sinyallere ve ilk sezgilerinize güvenin.'
  },
  'Merkür': {
    chakra: 'Boğaz Çakrası (Vishuddha)',
    sephirah: 'Hod (İhtişam, Zihinsel İdrak & Sözün Büyüsü)',
    guidance: 'Ağzınızdan çıkan her sözün bir niyet mührü olduğunu bilerek berrak konuşun.'
  },
  'Venüs': {
    chakra: 'Kalp Çakrası (Anahata)',
    sephirah: 'Netzach (Zafer, Sevgi Frekansı & Estetik Uyum)',
    guidance: 'Zorlamak yerine çekim gücünüzü, nezaketi ve şükran frekansını devreye sokun.'
  },
  'Mars': {
    chakra: 'Güneş Sinirağı (Manipura)',
    sephirah: 'Gevurah (Kudret, Kutsal Sınırlar & Cesaret)',
    guidance: 'Enerjinizi öfkeyle dağıtmak yerine tek bir hedefe odaklayıp sınırlarınızı koruyun.'
  },
  'Jüpiter': {
    chakra: 'Taç & Kalp Çakrası',
    sephirah: 'Chesed (Merhamet, Bereket & İlahi Genişleme)',
    guidance: 'Bolluk bilincinde kalın; vizyonunuzu dar kalıpların ötesine taşıyın.'
  },
  'Satürn': {
    chakra: 'Kök Çakra (Muladhara)',
    sephirah: 'Binah (Anlayış, Zamanın Bilgeliği & Yapılandırma)',
    guidance: 'Sabır ve öz disiplin bugün en büyük ruhsal koruyucunuzdur; temeli sağlam tutun.'
  },
  'Uranüs': {
    chakra: 'Taç Çakra (Sahasrara)',
    sephirah: 'Chokmah (Yüksek Hikmet, Ani Uyanış & Özgürleşme)',
    guidance: 'Eski kalıplarda ısrar etmeyin; aniden gelen ilham ve değişim çağrısına alan açın.'
  },
  'Neptün': {
    chakra: 'Üçüncü Göz & Taç Çakra (Ajna)',
    sephirah: 'Keter (Birlik Bilinci, Koşulsuz Şefkat & İlham)',
    guidance: 'Zihinsel kontrolü biraz gevşetin; tefekkür, dua ve sanatsal akışla bütünleşin.'
  },
  'Plüton': {
    chakra: 'Kök & Sakral Çakra',
    sephirah: "Da'at (Gizli Bilgi, Küllerinden Doğuş & Simya)",
    guidance: 'Miadını doldurmuş korkuları ve kontrol takıntısını bırakarak gerçek gücünüze uyanın.'
  },
  'Kiron': {
    chakra: 'Kalp & Boğaz Çakrası',
    sephirah: 'Ruhsal Şifa Köprüsü (Yarayı Bilgeliğe Dönüştürme)',
    guidance: 'Kendi kırılganlığınızı kabul etmek, bugün hem sizi hem çevrenizi şifalandırır.'
  },
  'Kuzey Ay Düğümü': {
    chakra: 'Üçüncü Göz & Kalp Çakrası',
    sephirah: 'Tekamül Yolu (Ruhsal Kader Pusulası)',
    guidance: 'Alışkın olduğunuz konfor alanından çıkıp ruhunuzu büyüten yeni deneyime adım atın.'
  }
};

function calculateLunarPhaseSignature(sunLon: number, moonLon: number): EsotericSkySignature['lunarPhase'] {
  const diff = ((moonLon - sunLon) % 360 + 360) % 360;
  const rad = (diff * Math.PI) / 180;
  const illumination = Math.round(((1 - Math.cos(rad)) / 2) * 100);

  if (diff < 22.5 || diff >= 337.5) {
    return {
      phaseName: 'Yeniay Evresi',
      illumination,
      phaseIcon: '🌑',
      esotericSecret: 'Tohum ekme, saf niyet belirleme ve içsel sessizlikte yeni döngüyü başlatma zamanı.'
    };
  } else if (diff < 67.5) {
    return {
      phaseName: 'Büyüyen Hilal',
      illumination,
      phaseIcon: '🌒',
      esotericSecret: 'Niyetlerinizi somut adımlarla besleme, tereddütleri aşma ve ivme kazanma evresi.'
    };
  } else if (diff < 112.5) {
    return {
      phaseName: 'İlk Dördün Eşiği',
      illumination,
      phaseIcon: '🌓',
      esotericSecret: 'Kararlılık sınavı; karşılaşılan ilk engelleri irade ve net seçimlerle aşma zamanı.'
    };
  } else if (diff < 157.5) {
    return {
      phaseName: 'Büyüyen Ay (Gibbus)',
      illumination,
      phaseIcon: '🌔',
      esotericSecret: 'Detayları mükemmelleştirme, sabırla olgunlaştırma ve zirveye hazırlanma evresi.'
    };
  } else if (diff < 202.5) {
    return {
      phaseName: 'Dolunay Zirvesi',
      illumination,
      phaseIcon: '🌕',
      esotericSecret: 'Gizli olanın görünür olması, duygusal/ruhsal tamamlanma ve yüksek farkındalık ışığı.'
    };
  } else if (diff < 247.5) {
    return {
      phaseName: 'Küçülen (Dağıtan) Ay',
      illumination,
      phaseIcon: '🌖',
      esotericSecret: 'Kazanılan deneyimi paylaşma, şükran duyma ve fazlalıkları sadeleştirme zamanı.'
    };
  } else if (diff < 292.5) {
    return {
      phaseName: 'Son Dördün Dönemeçi',
      illumination,
      phaseIcon: '🌗',
      esotericSecret: 'İçsel muhasebe; artık ruhunuza hizmet etmeyen alışkanlıkları ve yükleri çözme evresi.'
    };
  } else {
    return {
      phaseName: 'Balsamik (Karanlık) Ay',
      illumination,
      phaseIcon: '🌘',
      esotericSecret: 'Derin arınma, dinlenme, affetme ve yeni doğuş öncesi ruhsal detoks zamanı.'
    };
  }
}

// Essential Dignities (Rulership, Exaltation, Detriment, Fall) per planet & sign (-12 to +12)
const PLANET_SIGN_DIGNITY: Record<string, Record<string, number>> = {
  'Güneş': { 'Aslan': 12, 'Koç': 10, 'Yay': 5, 'Kova': -10, 'Terazi': -12 },
  'Ay': { 'Yengeç': 12, 'Boğa': 10, 'Balık': 6, 'Oğlak': -10, 'Akrep': -12 },
  'Merkür': { 'İkizler': 12, 'Başak': 12, 'Kova': 6, 'Terazi': 4, 'Yay': -10, 'Balık': -12 },
  'Venüs': { 'Boğa': 12, 'Terazi': 12, 'Balık': 10, 'Yengeç': 4, 'Koç': -10, 'Akrep': -10, 'Başak': -12 },
  'Mars': { 'Koç': 12, 'Akrep': 11, 'Oğlak': 10, 'Aslan': 5, 'Boğa': -10, 'Terazi': -10, 'Yengeç': -12 },
  'Jüpiter': { 'Yay': 12, 'Balık': 11, 'Yengeç': 10, 'Koç': 4, 'İkizler': -10, 'Başak': -10, 'Oğlak': -12 },
  'Satürn': { 'Oğlak': 12, 'Kova': 11, 'Terazi': 10, 'Boğa': 4, 'Yengeç': -10, 'Aslan': -10, 'Koç': -12 },
  'Uranüs': { 'Kova': 11, 'İkizler': 6, 'Akrep': 6, 'Boğa': -8, 'Aslan': -10 },
  'Neptün': { 'Balık': 12, 'Yengeç': 7, 'Yay': 5, 'Başak': -10, 'Oğlak': -6 },
  'Plüton': { 'Akrep': 12, 'Koç': 6, 'Oğlak': 5, 'Boğa': -10, 'Terazi': -6 }
};

function getPlanetDignityScore(planet: AstroPoint | undefined, allowRetroBonus = false): number {
  if (!planet) return 0;
  const table = PLANET_SIGN_DIGNITY[planet.name];
  let score = table ? (table[planet.sign] ?? 0) : 0;
  if (planet.isRetrograde) {
    score += allowRetroBonus ? 3 : -7;
  }
  return score;
}

function buildDetailedCosmicBarometer(
  planets: AstroPoint[],
  aspects: { p1: string; p2: string; aspectType: string; orb: number; isHarmonious: boolean; house1?: number; house2?: number }[],
  isPersonal: boolean,
  natalHouses?: AstroPoint[],
  natalPlanets?: AstroPoint[]
): DetailedCosmicBarometer {
  const getPlanet = (name: string) => planets.find(p => p.name === name);
  const sun = getPlanet('Güneş');
  const moon = getPlanet('Ay');
  const mercury = getPlanet('Merkür');
  const venus = getPlanet('Venüs');
  const mars = getPlanet('Mars');
  const jupiter = getPlanet('Jüpiter');
  const saturn = getPlanet('Satürn');
  const uranus = getPlanet('Uranüs');
  const neptune = getPlanet('Neptün');
  const pluto = getPlanet('Plüton');
  const chiron = getPlanet('Kiron');
  const northNode = getPlanet('Kuzey Ay Düğümü');

  const FIRE_SIGNS = ['Koç', 'Aslan', 'Yay'];
  const EARTH_SIGNS = ['Boğa', 'Başak', 'Oğlak'];
  const AIR_SIGNS = ['İkizler', 'Terazi', 'Kova'];
  const WATER_SIGNS = ['Yengeç', 'Akrep', 'Balık'];

  const CARDINAL_SIGNS = ['Koç', 'Yengeç', 'Terazi', 'Oğlak'];
  const FIXED_SIGNS = ['Boğa', 'Aslan', 'Akrep', 'Kova'];
  const MUTABLE_SIGNS = ['İkizler', 'Başak', 'Yay', 'Balık'];

  const addSignElemAndMod = (sign: string, weight: number, counters: { fire: number; earth: number; air: number; water: number; card: number; fix: number; mut: number }) => {
    if (FIRE_SIGNS.includes(sign)) counters.fire += weight;
    else if (EARTH_SIGNS.includes(sign)) counters.earth += weight;
    else if (AIR_SIGNS.includes(sign)) counters.air += weight;
    else if (WATER_SIGNS.includes(sign)) counters.water += weight;

    if (CARDINAL_SIGNS.includes(sign)) counters.card += weight;
    else if (FIXED_SIGNS.includes(sign)) counters.fix += weight;
    else if (MUTABLE_SIGNS.includes(sign)) counters.mut += weight;
  };

  // 1. Calculate Authentic Weighted Element & Modality Balance
  const counters = { fire: 0, earth: 0, air: 0, water: 0, card: 0, fix: 0, mut: 0 };

  if (isPersonal && natalPlanets && natalPlanets.length > 0) {
    // A) Kişinin kendi doğum haritası element imzası (%40 baz)
    for (const np of natalPlanets) {
      const nw = (np.name === 'Güneş' || np.name === 'Ay' || np.name === 'Yükselen (ASC)') ? 2.0
        : ['Merkür', 'Venüs', 'Mars', 'Tepe Noktası (MC)'].includes(np.name) ? 1.3
        : ['Jüpiter', 'Satürn'].includes(np.name) ? 0.9 : 0.5;
      addSignElemAndMod(np.sign, nw, counters);
    }

    // B) Transit gezegenlerin kişinin haritasında tetiklediği kişisel evlerin element karşılığı (%35 aktif ev etkisi)
    // Ateş Evleri: 1, 5, 9 | Toprak Evleri: 2, 6, 10 | Hava Evleri: 3, 7, 11 | Su Evleri: 4, 8, 12
    for (const tp of planets) {
      const h = tp.house || (natalHouses && natalHouses.length > 0 ? getHouseFromLongitude(tp.longitude, natalHouses) : 1);
      const hw = (tp.name === 'Güneş' || tp.name === 'Ay') ? 2.4
        : ['Merkür', 'Venüs', 'Mars'].includes(tp.name) ? 1.6
        : ['Jüpiter', 'Satürn'].includes(tp.name) ? 1.2 : 0.7;

      if ([1, 5, 9].includes(h)) counters.fire += hw;
      else if ([2, 6, 10].includes(h)) counters.earth += hw;
      else if ([3, 7, 11].includes(h)) counters.air += hw;
      else if ([4, 8, 12].includes(h)) counters.water += hw;

      if ([1, 4, 7, 10].includes(h)) counters.card += hw;
      else if ([2, 5, 8, 11].includes(h)) counters.fix += hw;
      else if ([3, 6, 9, 12].includes(h)) counters.mut += hw;
    }

    // C) O gün tam açı (orb <= 3.5°) alan natal gezegenlerin burç elementi (%25 anlık tetiklenme)
    for (const asp of aspects) {
      if (asp.orb > 3.5) continue;
      const targetNatal = natalPlanets.find(np => np.name === asp.p2);
      if (targetNatal) {
        const orbBoost = Math.max(0.4, (3.6 - asp.orb) * 0.9);
        addSignElemAndMod(targetNatal.sign, orbBoost, counters);
      }
    }
  } else {
    // Kolektif Gökyüzü (Mundane): Doğrudan gökyüzü gezegenlerinin burç dağılımı
    for (const p of planets) {
      const w = (p.name === 'Güneş' || p.name === 'Ay') ? 2.2
        : ['Merkür', 'Venüs', 'Mars'].includes(p.name) ? 1.5
        : ['Jüpiter', 'Satürn'].includes(p.name) ? 1.2
        : ['Uranüs', 'Neptün', 'Plüton'].includes(p.name) ? 1.0 : 0.6;
      addSignElemAndMod(p.sign, w, counters);
    }
  }

  const fireWeight = counters.fire;
  const earthWeight = counters.earth;
  const airWeight = counters.air;
  const waterWeight = counters.water;
  const cardinalWeight = counters.card;
  const fixedWeight = counters.fix;
  const mutableWeight = counters.mut;

  const totalElemWeight = Math.max(1, fireWeight + earthWeight + airWeight + waterWeight);
  const firePct = Math.round((fireWeight / totalElemWeight) * 100);
  const earthPct = Math.round((earthWeight / totalElemWeight) * 100);
  const airPct = Math.round((airWeight / totalElemWeight) * 100);
  const waterPct = Math.max(0, 100 - (firePct + earthPct + airPct));

  const totalModWeight = Math.max(1, cardinalWeight + fixedWeight + mutableWeight);
  const cardinalPct = (cardinalWeight / totalModWeight) * 100; // ideal neutral ~33.3%
  const fixedPct = (fixedWeight / totalModWeight) * 100;
  const mutablePct = (mutableWeight / totalModWeight) * 100;

  const elemArr = [
    { name: 'Ateş', pct: firePct, dom: 'Ateş Baskın: Cesaret, vizyon ve yaratıcı kıvılcım yüksek.', lack: 'Ateş Düşük: Motivasyon düşüklüğüne karşı bedeninizi hareketlendirin ve güneşe çıkın.' },
    { name: 'Toprak', pct: earthPct, dom: 'Toprak Baskın: Somut üretim, sabır ve gerçekçi inşa enerjisi hakim.', lack: 'Toprak Düşük: Zihinsel/duygusal dağılmaya karşı yarım işleri bitirin ve topraklanın.' },
    { name: 'Hava', pct: airPct, dom: 'Hava Baskın: İletişim, fikir alışverişi ve zihinsel hız ön planda.', lack: 'Hava Düşük: Sabit fikirliliğe kapılmamak için farklı bakış açılarını dinleyin.' },
    { name: 'Su', pct: waterPct, dom: 'Su Baskın: Empati, rüyalar, derin sezgi ve ruhsal duyarlılık güçlü.', lack: 'Su Düşük: Aşırı mantık ve katılığa karşı kalbinizi ve şefkati devreye sokun.' }
  ].sort((a, b) => b.pct - a.pct);

  const dominantElem = elemArr[0];
  const lackingElem = elemArr[elemArr.length - 1];

  // Exact Longitudes for Lunar Phase & Micro-Harmonics
  const sunLon = sun?.longitude ?? 0;
  const moonLon = moon?.longitude ?? 90;
  const marsLon = mars?.longitude ?? 180;
  const mercLon = mercury?.longitude ?? 45;
  const venLon = venus?.longitude ?? 120;
  const jupLon = jupiter?.longitude ?? 240;
  const satLon = saturn?.longitude ?? 300;
  const nepLon = neptune?.longitude ?? 330;

  const degToRad = (d: number) => (d * Math.PI) / 180;
  const baseLunarPhase = calculateLunarPhaseSignature(sunLon, moonLon);
  const moonPersonalHouse = (isPersonal && moon)
    ? (moon.house || (natalHouses && natalHouses.length > 0 ? getHouseFromLongitude(moon.longitude, natalHouses) : undefined))
    : undefined;
  const lunarPhase: EsotericSkySignature['lunarPhase'] = moonPersonalHouse
    ? {
        ...baseLunarPhase,
        phaseName: `${baseLunarPhase.phaseName} (${moonPersonalHouse}. Evinizde)`,
      }
    : baseLunarPhase;

  // Active Chakra & Sephirah from the tightest aspect's leading planet (or Moon)
  const sortedByOrb = [...aspects].sort((a, b) => a.orb - b.orb);
  const leadPlanetName = (isPersonal
    ? (CHAKRA_SEPHIRAH_MAP[sortedByOrb[0]?.p2] ? sortedByOrb[0]?.p2 : sortedByOrb[0]?.p1)
    : sortedByOrb[0]?.p1) || moon?.name || 'Güneş';
  const chakraMeta = CHAKRA_SEPHIRAH_MAP[leadPlanetName] || CHAKRA_SEPHIRAH_MAP['Güneş'];

  /**
   * Normalized Orb-Weighted Aspect Evaluator (-26 to +26)
   * Prevents cumulative runaway inflation when there are many aspects!
   */
  const evalNormalizedAspectImpact = (
    primaryPlanets: string[],
    disruptorPlanets: string[] = [],
    conjunctionBenefics: string[] = ['Jüpiter', 'Venüs', 'Güneş', 'Şans Noktası (POF)']
  ): { scoreDelta: number; netTrend: number } => {
    let weightedValenceSum = 0;
    let totalOrbWeight = 0;

    for (const asp of aspects) {
      if (asp.orb > 4.2) continue;
      const p1Match = primaryPlanets.includes(asp.p1);
      const p2Match = primaryPlanets.includes(asp.p2);
      if (!p1Match && !p2Match) continue;

      // Primary relevance: both planets in group = 1.25x, one planet in group = 1.0x
      const relevance = (p1Match && p2Match) ? 1.25 : 1.0;
      const orbProximity = Math.pow(Math.max(0, (4.2 - asp.orb) / 4.2), 1.25);
      const w = orbProximity * relevance;

      let valence = 0;
      if (asp.aspectType === 'Üçgen') {
        valence = 1.0;
      } else if (asp.aspectType === 'Sekstil') {
        valence = 0.78;
      } else if (asp.aspectType === 'Kare') {
        valence = -1.0;
      } else if (asp.aspectType === 'Karşıt') {
        valence = -0.88;
      } else if (asp.aspectType === 'Görmeyen') {
        valence = -0.65;
      } else if (asp.aspectType === 'Kavuşum') {
        const otherP = p1Match ? asp.p2 : asp.p1;
        if (conjunctionBenefics.includes(otherP)) {
          valence = 0.9;
        } else if (['Satürn', 'Mars', 'Plüton', 'Kiron', 'Lilith'].includes(otherP)) {
          valence = -0.8;
        } else {
          valence = 0.25;
        }
      }

      // If a disruptor planet is hitting our primary planet with a hard aspect, amplify the penalty
      const involvesDisruptor = disruptorPlanets.includes(asp.p1) || disruptorPlanets.includes(asp.p2);
      if (involvesDisruptor && valence < 0) {
        valence *= 1.25;
      }

      weightedValenceSum += valence * w;
      totalOrbWeight += w;
    }

    if (totalOrbWeight === 0) {
      return { scoreDelta: 0, netTrend: 0 };
    }

    // Damped average: divides by (totalOrbWeight + 0.75) so a single weak aspect doesn't swing 100%,
    // and 10 aspects don't snowball above 1.0!
    const normalizedRatio = clampNum(weightedValenceSum / (totalOrbWeight + 0.42), -1.0, 1.0);
    return {
      scoreDelta: normalizedRatio * 29,
      netTrend: normalizedRatio
    };
  };

  // ==========================================================================
  // A) 4 CORE FREQUENCY CHANNELS (Neutral Base = 54, Range = 22% to 92%)
  // ==========================================================================
  const fizAspect = evalNormalizedAspectImpact(['Güneş', 'Mars'], ['Satürn', 'Neptün']);
  const duyAspect = evalNormalizedAspectImpact(['Ay', 'Venüs'], ['Satürn', 'Plüton', 'Mars']);
  const entAspect = evalNormalizedAspectImpact(['Merkür', 'Uranüs'], ['Neptün', 'Mars']);
  const ruhAspect = evalNormalizedAspectImpact(['Neptün', 'Ay', 'Kiron', 'Kuzey Ay Düğümü'], ['Satürn'], ['Jüpiter', 'Venüs', 'Neptün', 'Kuzey Ay Düğümü']);

  const sunDig = getPlanetDignityScore(sun);
  const moonDig = getPlanetDignityScore(moon);
  const mercDig = getPlanetDignityScore(mercury);
  const venDig = getPlanetDignityScore(venus);
  const marsDig = getPlanetDignityScore(mars);
  const jupDig = getPlanetDignityScore(jupiter);
  const satDig = getPlanetDignityScore(saturn);
  const uraDig = getPlanetDignityScore(uranus);
  const nepDig = getPlanetDignityScore(neptune, true);
  const pluDig = getPlanetDignityScore(pluto, true);

  // Subtle hourly degree wave (-4 to +4)
  const microFiz = Math.sin(degToRad(moonLon * 2 + marsLon)) * 4;
  const microDuy = Math.cos(degToRad(moonLon * 2 - venLon)) * 4;
  const microEnt = Math.sin(degToRad(mercLon * 2 + moonLon)) * 4;
  const microRuh = Math.cos(degToRad(nepLon * 2 + moonLon)) * 4;

  // Element deviation from 25% neutral average
  const fireEarthDev = ((firePct + earthPct) - 50) * 0.22;
  const waterDev = (waterPct - 25) * 0.32;
  const airDev = (airPct - 25) * 0.32;

  let fizRaw = 54 + fizAspect.scoreDelta + (sunDig + marsDig) * 0.55 + fireEarthDev + microFiz;
  let duyRaw = 54 + duyAspect.scoreDelta + (moonDig + venDig) * 0.55 + waterDev + microDuy;
  let entRaw = 54 + entAspect.scoreDelta + (mercDig + uraDig) * 0.55 + airDev + microEnt;
  let ruhRaw = 54 + ruhAspect.scoreDelta + (nepDig + moonDig) * 0.50 + waterDev * 0.8 + microRuh;

  // Personal House adjustments for Moon/Sun
  if (isPersonal && natalHouses && natalHouses.length > 0 && moon) {
    const mHouse = moon.house || getHouseFromLongitude(moon.longitude, natalHouses);
    if ([1, 5, 6].includes(mHouse)) fizRaw += 6;
    else if ([12, 4, 8].includes(mHouse)) { fizRaw -= 5; ruhRaw += 8; }
    if ([4, 5, 7].includes(mHouse)) duyRaw += 6;
    if ([3, 9, 10, 11].includes(mHouse)) entRaw += 6;
  }

  const fizScore = Math.round(clampNum(fizRaw, 22, 92));
  const duyScore = Math.round(clampNum(duyRaw, 20, 92));
  const entScore = Math.round(clampNum(entRaw, 22, 92));
  const ruhScore = Math.round(clampNum(ruhRaw, 24, 93));

  const coreEnergies: CosmicCoreEnergyItem[] = [
    {
      code: 'EYLEM',
      label: 'Yaşam Gücü & Eylem',
      statusText: fizScore >= 70 ? 'Yüksek Canlılık & Cesaret' : fizScore >= 48 ? 'Dengeli Fiziksel Tempo' : 'Bedeninizi Dinlendirin',
      score: fizScore,
      trend: fizAspect.netTrend >= -0.05 ? 'up' : 'down',
      colorHex: '#F97316'
    },
    {
      code: 'KALP',
      label: 'Kalp & Duygu Dengesi',
      statusText: duyScore >= 70 ? 'Akıcı, Şefkatli & Huzurlu' : duyScore >= 48 ? 'Sakin & Gözlemci Akış' : 'Alınganlığa Dikkat',
      score: duyScore,
      trend: duyAspect.netTrend >= -0.05 ? 'up' : 'down',
      colorHex: '#10B981'
    },
    {
      code: 'ZİHİN',
      label: 'Zihinsel Berraklık',
      statusText: entScore >= 70 ? 'Keskin Analiz & Net Karar' : entScore >= 48 ? 'Stratejik & Ölçülü Odak' : 'Zihinsel Yükü Azaltın',
      score: entScore,
      trend: entAspect.netTrend >= -0.05 ? 'up' : 'down',
      colorHex: '#0EA5E9'
    },
    {
      code: 'SEZGİ',
      label: 'Ruhsal Uyanış & Sezgi',
      statusText: ruhScore >= 70 ? 'Güçlü Eşzamanlılık & İlhâm' : ruhScore >= 48 ? 'İç Sese & İşaretlere Açık' : 'Topraklanma & Merkezlenme',
      score: ruhScore,
      trend: ruhAspect.netTrend >= -0.05 ? 'up' : 'down',
      colorHex: '#A855F7'
    }
  ];

  // ==========================================================================
  // B) 8 DISTINCT PLANETARY LIFE DIMENSIONS (Zero Overlap Between Rulers)
  // ==========================================================================

  // 1. Özgüven & İrade Duruşu (Yönetici: Güneş & Yükselen — Öz-değer ve görünür irade)
  const infAsp = evalNormalizedAspectImpact(['Güneş', 'Yükselen (ASC)'], ['Satürn', 'Neptün']);
  const attrInfluence = 56
    + infAsp.scoreDelta
    + sunDig * 0.85
    + (firePct - 25) * 0.22
    + Math.sin(degToRad(sunLon * 2)) * 3;

  // 2. Eylem & İş Bitirme Gücü (Yönetici: Mars & Tepe Noktası — Cesaret, somut atılım ve hedef)
  const progAsp = evalNormalizedAspectImpact(['Mars', 'Tepe Noktası (MC)'], ['Satürn', 'Neptün']);
  const attrProgress = 56
    + progAsp.scoreDelta
    + marsDig * 0.85
    + (cardinalPct - 33.3) * 0.22
    + Math.cos(degToRad(marsLon * 2)) * 3;

  // 3. Zihinsel Analiz & Odak (Yönetici: Merkür — Düşünce berraklığı, öğrenme ve strateji)
  const cogAsp = evalNormalizedAspectImpact(['Merkür'], ['Neptün', 'Mars']);
  const attrCognition = 56
    + cogAsp.scoreDelta
    + mercDig * 0.85
    + (airPct - 25) * 0.22
    + Math.sin(degToRad(mercLon * 2)) * 3;

  // 4. Sosyal Ahenk & İlişkiler (Yönetici: Venüs — Sevgi dili, uzlaşı, diplomasi ve çekim)
  const dipAsp = evalNormalizedAspectImpact(['Venüs'], ['Mars', 'Plüton', 'Satürn']);
  const attrDiplomacy = 56
    + dipAsp.scoreDelta
    + venDig * 0.85
    + ((airPct + waterPct) - 50) * 0.16
    + Math.cos(degToRad(venLon * 2)) * 3;

  // 5. Sabır & Sınır Kalkanı (Yönetici: Satürn — Öz disiplin, istikrar ve ruhsal sınır koruma)
  const endAsp = evalNormalizedAspectImpact(['Satürn'], ['Uranüs', 'Mars']);
  const attrEndurance = 56
    + endAsp.scoreDelta
    + satDig * 0.85
    + (earthPct - 25) * 0.25
    + (fixedPct - mutablePct) * 0.18
    + Math.sin(degToRad(satLon * 2)) * 3;

  // 6. Değişime & Yeniliğe Uyum (Yönetici: Uranüs — Esneklik, çeviklik ve ani manevra kabiliyeti)
  const mobAsp = evalNormalizedAspectImpact(['Uranüs'], ['Satürn']);
  const attrMobility = 56
    + mobAsp.scoreDelta
    + uraDig * 0.85
    + (mutablePct - fixedPct) * 0.28
    + Math.cos(degToRad((uranus?.longitude ?? 60) * 2 + moonLon)) * 3;

  // 7. Bereket & Doğal Kısmet (Yönetici: Jüpiter & Şans Noktası — Fırsatlar, büyüme ve bolluk)
  const luckAsp = evalNormalizedAspectImpact(['Jüpiter', 'Şans Noktası (POF)'], ['Satürn', 'Kiron']);
  const attrLuck = 56
    + luckAsp.scoreDelta
    + jupDig * 0.85
    + Math.sin(degToRad(jupLon * 2 + venLon)) * 3.5;

  // 8. Ruhsal Şifa & Kadersel Akış (Yönetici: Neptün, Kiron, K. Ay Düğümü & Vertex — Arınma ve eşzamanlılık)
  const healAsp = evalNormalizedAspectImpact(['Kiron', 'Neptün', 'Kuzey Ay Düğümü', 'Vertex (Vx)'], ['Mars', 'Satürn'], ['Venüs', 'Jüpiter', 'Neptün', 'Kuzey Ay Düğümü']);
  const attrHealing = 56
    + healAsp.scoreDelta
    + (nepDig * 0.55 + pluDig * 0.30)
    + (waterPct - 25) * 0.25
    + Math.cos(degToRad((chiron?.longitude ?? 0) + nepLon + moonLon)) * 3.5;

  const toGauge = (
    id: CosmicAttributeGauge['id'],
    title: string,
    astroDrivers: string,
    rawVal: number,
    highSub: string,
    midSub: string,
    lowSub: string,
    isEsoteric = false
  ): CosmicAttributeGauge => {
    const pct = Math.round(clampNum(rawVal, 20, 90));
    const score10 = clampNum(Math.round(pct / 10), 2, 9);
    const subtitle = score10 >= 7 ? highSub : score10 >= 5 ? midSub : lowSub;
    return {
      id,
      title,
      astroDrivers,
      score: score10,
      percent: pct,
      subtitle,
      isEsoteric
    };
  };

  const attributes: CosmicAttributeGauge[] = [
    toGauge('influence', 'Özgüven & İrade Duruşu', 'Güneş • Yükselen', attrInfluence, 'Güçlü İrade & Doğal Karizma', 'Dengeli & Net Duruş', 'Geri Planda Gözlem Zamanı'),
    toGauge('progress', 'Eylem & İş Bitirme Gücü', 'Mars • Tepe Noktası', attrProgress, 'Cesur Atılım & Somut Sonuç', 'Adım Adım Kararlı İlerleme', 'Enerjiyi Zorlamadan Koruyun'),
    toGauge('cognition', 'Zihinsel Analiz & Odak', 'Merkür', attrCognition, 'Keskin İdrak & Net Karar', 'Dengeli & Analitik Düşünce', 'Zihinsel Dağınıklığa Dikkat'),
    toGauge('diplomacy', 'Sosyal Ahenk & İlişkiler', 'Venüs', attrDiplomacy, 'Tatlı Dil, Uzlaşı & Çekim', 'Yapıcı & Dengeli Diyalog', 'İlişkilerde Alınganlığa Dikkat'),
    toGauge('endurance', 'Sabır & Sınır Kalkanı', 'Satürn', attrEndurance, 'Sağlam Disiplin & Ruhsal Sınır', 'Sabırlı & Kontrollü Koruma', 'Ağır Sorumluluklarla Yüklenmeyin'),
    toGauge('mobility', 'Değişime & Yeniliğe Uyum', 'Uranüs • Değişken Nitelik', attrMobility, 'Çevik & Esnek Manevra Gücü', 'Akışla Uyumlu Tempo', 'Sabit Fikirlilikten Kaçının'),
    toGauge('luck', 'Bereket & Doğal Kısmet', 'Jüpiter • Şans Noktası', attrLuck, 'Açık Kısmet & Büyüme Fırsatı', 'Emeğin Karşılığını Alma', 'Risk Yerine Garanti Adımlar Atın'),
    toGauge('healing', 'Ruhsal Şifa & Kadersel Akış', 'Neptün • Kiron • K. Ay Düğümü', attrHealing, 'Yüksek Sezgi & Blokaj Çözümü', 'İçsel Onarım & İşaretleri Okuma', 'Zihni Dinlendirip Akışta Kalın', true)
  ];

  const mentalTone = entScore >= 70 ? 'Yüksek & Berrak' : entScore >= 50 ? 'Stratejik & Dengeli' : 'Dağınık / Dinlenme Gerek';
  const emotionalTone = duyScore >= 70 ? 'Yoğun & Sezgisel' : duyScore >= 50 ? 'Dengeli & Sakin' : 'Hassas / Sınır Koruma';
  const actionTone = fizScore >= 70 ? 'Dinamik & Kararlı' : fizScore >= 50 ? 'Ölçülü & İstikrarlı' : 'Temkinli / Gözlemde Kal';

  return {
    mental: { score: entScore, label: `${entScore}%`, tone: mentalTone },
    emotional: { score: duyScore, label: `${duyScore}%`, tone: emotionalTone },
    action: { score: fizScore, label: `${fizScore}%`, tone: actionTone },
    esotericSignature: {
      lunarPhase,
      elementBalance: {
        firePct,
        earthPct,
        airPct,
        waterPct,
        dominantLabel: dominantElem.dom,
        lackingAdvice: lackingElem.lack
      },
      chakraResonance: {
        chakraName: chakraMeta.chakra,
        sephirahName: chakraMeta.sephirah,
        activePlanet: leadPlanetName,
        guidance: chakraMeta.guidance
      }
    },
    coreEnergies,
    attributes
  };
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
  barometer: DetailedCosmicBarometer;
  opportunities: PersonalGuidanceItem[];
  cautions: PersonalGuidanceItem[];
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

const SIGN_FLAVORS: Record<string, { adj: string; style: string }> = {
  'Koç': { adj: 'cesur, öncü ve doğrudan', style: 'inisyatif alarak ve korkusuzca adım atarak' },
  'Boğa': { adj: 'dingin, sağlam ve güven odaklı', style: 'somut değerler üreterek ve sabırla inşa ederek' },
  'İkizler': { adj: 'zihinsel açıdan çevik, meraklı ve iletişim odaklı', style: 'yeni fikirler geliştirerek, konuşarak ve bağlantı kurarak' },
  'Yengeç': { adj: 'şefkatli, sezgisel ve koruyucu', style: 'duygusal bağları güçlendirerek ve iç sesinize kulak vererek' },
  'Aslan': { adj: 'özgüvenli, yaratıcı ve sıcak', style: 'kendi ışığınızı ortaya koyarak ve yürekten ifade ederek' },
  'Başak': { adj: 'analitik, özenli ve çözüm odaklı', style: 'detayları sadeleştirerek ve pratik düzen kurarak' },
  'Terazi': { adj: 'uzlaşmacı, zarif ve denge arayan', style: 'adil bir diyalog ve karşılıklı uyum kurarak' },
  'Akrep': { adj: 'derin, sezgisel ve dönüştürücü', style: 'yüzeyin altındaki gerçeği görerek ve stratejik hareket ederek' },
  'Yay': { adj: 'vizyoner, iyimser ve özgürlükçü', style: 'ufkunuzu genişleterek ve büyük resme odaklanarak' },
  'Oğlak': { adj: 'disiplinli, kararlı ve gerçekçi', style: 'uzun vadeli sorumluluk alarak ve sağlam sınırlar çizerek' },
  'Kova': { adj: 'yenilikçi, özgün ve ezber bozan', style: 'alışılmış kalıpların dışına çıkarak ve bağımsız düşünerek' },
  'Balık': { adj: 'ilham dolu, empatik ve ruhsal', style: 'sezgisel akışa güvenerek ve şefkatle yaklaşarak' }
};

const TRANSIT_PLANET_GIFT: Record<string, string> = {
  'Güneş': 'yaşam enerjinizi, görünürlüğünüzü ve bilinçli iradenizi parlatırken',
  'Ay': 'duygusal sezgilerinizi, samimi bağ kurma ihtiyacınızı ve içsel akışınızı harekete geçirirken',
  'Merkür': 'zihinsel berraklığınızı, karar alma hızınızı ve iletişim becerinizi güçlendirirken',
  'Venüs': 'ilişkilerde uyumu, çekim gücünüzü, sevgi akışını ve maddi/manevi bereketi artırırken',
  'Mars': 'cesaretinizi, fiziksel motivasyonunuzu ve ertelediğiniz adımları atma gücünüzü ateşlerken',
  'Jüpiter': 'büyüme fırsatlarını, şansı, iyimserliği ve ufuk açıcı destekleri büyütürken',
  'Satürn': 'kalıcı yapı kurma gücünüzü, sabrınızı ve uzun vadeli güven inşa etme disiplininizi sağlamlaştırırken',
  'Uranüs': 'ani zihinsel uyanışları, sürpriz sıçramaları ve kalıpları kıran özgürleştirici yenilikleri tetiklerken',
  'Neptün': 'ruhsal ilhamınızı, yaratıcı hayal gücünüzü ve sezgisel şifa kanalınızı derinleştirirken',
  'Plüton': 'küllerinden doğan içsel gücünüzü, karizmanızı ve kökten yenilenme kapasitenizi açığa çıkarırken',
  'Kiron': 'geçmiş yaraları bilgeliğe dönüştüren derin bir içsel şifa ve kabullenme kapısı açarken',
  'Lilith': 'bastırılmış otantik gücünüzü ve boyun eğmeyen özgüveninizi uyandırırken',
  'Kuzey Ay Düğümü': 'sizi ruhsal tekamülünüze ve geleceğin kadersel fırsatlarına doğru çekerken',
  'Şans Noktası (POF)': 'doğal akışta gelen kısmet, sevinç ve zahmetsiz denge noktanızı aydınlatırken',
  'Vertex (Vx)': 'beklenmedik ama kadersel nitelikteki karşılaşmaları ve dönüm noktalarını hızlandırırken'
};

const TRANSIT_PLANET_CHALLENGE: Record<string, string> = {
  'Güneş': 'ego çatışmalarına, irade savaşlarına veya aşırı gurur kaynaklı gerilimlere çekebilir',
  'Ay': 'anlık duygusal dalgalanmalara, alınganlığa veya geçmişten gelen güvensizlik tepkilerine açık hale getirebilir',
  'Merkür': 'zihinsel aşırı yüklenmeye, yanlış anlaşılmalara veya aceleci ve keskin sözlere zemin hazırlayabilir',
  'Venüs': 'ilişkilerde beklenti krizlerine, değer sorgulamalarına veya gereksiz harcama eğilimine yol açabilir',
  'Mars': 'sabırsızlığa, ani öfke patlamalarına ve fevri restleşmelere karşı ekstra dikkat gerektirir',
  'Jüpiter': 'aşırı iyimserlikle boyunuzu aşan sözler vermeye, abartıya ve sınırları zorlamaya itebilir',
  'Satürn': 'gecikmeler, ağır sorumluluklar veya daralma hissi üzerinden dayanıklılığınızı ve sabrınızı sınayabilir',
  'Uranüs': 'beklenmedik plan değişiklikleri, huzursuzluk ve ani kopuş dürtüsüyle sinir sisteminizi zorlayabilir',
  'Neptün': 'belirsizlik, kafa karışıklığı, gerçeklerden kaçış veya yanılsama riskine karşı uyanık olmayı gerektirir',
  'Plüton': 'derin güç savaşları, kontrol takıntısı veya artık miadını doldurmuş bağları bırakma krizi doğurabilir',
  'Kiron': 'eski bir kırgınlığın veya yetersizlik hissinin tetiklenmesiyle duygusal hassasiyet yaratabilir',
  'Lilith': 'bastırılmış öfke, gölge kıskançlıklar veya keskin sınır ihlali tepkilerini yüzeye çıkarabilir',
  'Kuzey Ay Düğümü': 'alışkın olduğunuz konfor alanından çıkarken yaşadığınız içsel direnci görünür kılabilir',
  'Şans Noktası (POF)': 'kolaycılığa kaçma veya mevcut kısmeti fark edemeyip içsel huzuru dağıtma sınavı getirebilir',
  'Vertex (Vx)': 'kontrolünüz dışında gelişen kadersel karşılaşmalar ve ani yön değişimleriyle dengenizi sınayabilir'
};

const NATAL_PLANET_CORE: Record<string, string> = {
  'Güneş': 'temel kimliğinizi, yaşam amacınızı ve özgüven merkezinizi',
  'Ay': 'duygusal ihtiyaçlarınızı, içsel güvenlik alanınızı ve kalp huzurunuzu',
  'Merkür': 'düşünce yapınızı, öğrenme biçiminizi ve kendinizi ifade etme dilinizi',
  'Venüs': 'sevgi dilinizi, ilişki beklentilerinizi ve öz değer algınızı',
  'Mars': 'eylem tarzınızı, sınır koruma refleksinizi ve yaşam enerjinizi',
  'Jüpiter': 'hayat vizyonunuzu, inançlarınızı ve bolluk bilincinizi',
  'Satürn': 'sorumluluk bilincinizi, kariyer omurganızı ve sınırlarınızı',
  'Uranüs': 'bireysel özgünlüğünüzü ve özgürlük alanınızı',
  'Neptün': 'sezgisel dünyanızı, hayallerinizi ve ruhsal duyarlılığınızı',
  'Plüton': 'derin psikolojik gücünüzü ve krizleri dönüştürme potansiyelinizi',
  'Kiron': 'en hassas ruhsal yaranızı ve şifalanma kapasitenizi',
  'Lilith': 'tavizsiz doğanızı ve bastırılmış içgüdüsel gücünüzü',
  'Kuzey Ay Düğümü': 'bu hayattaki kadersel gelişim yönünüzü',
  'Şans Noktası (POF)': 'doğuştan gelen kısmet ve içsel neşe kaynağınızı',
  'Vertex (Vx)': 'kadersel kesişme ve önemli karşılaşma noktanızı',
  'Yükselen (ASC)': 'dış dünyaya sunduğunuz duruşu, beden enerjinizi ve kişisel başlangıçlarınızı',
  'Tepe Noktası (MC)': 'toplumsal hedeflerinizi, mesleki yönünüzü ve görünür başarınızı'
};

export interface PersonalGuidanceItem {
  text: string;
  astroTag?: string;
}

function capitalizeFirst(str: string): string {
  if (!str) return '';
  return str.charAt(0).toUpperCase() + str.slice(1);
}

type EnrichedSkyAspectItem = {
  p1: string;
  p2: string;
  p1Sign: string;
  p1Coord: string;
  p2Coord: string;
  aspectType: string;
  orb: number;
  isHarmonious: boolean;
  summary: string;
  badge: string;
};

function buildMundaneSynthesizedOpportunities(
  aspects: EnrichedSkyAspectItem[],
  moonSign: string,
  moonDeg: number,
  moonDoAction: string
): PersonalGuidanceItem[] {
  const items: PersonalGuidanceItem[] = [
    {
      text: moonDoAction,
      astroTag: `Ay ${moonSign} Burcunda (${moonDeg}°) • Günlük Duygusal Ritim`
    }
  ];

  // Group by target planet (p2) so two sky aspects hitting the same point are synthesized together
  const groups = new Map<string, EnrichedSkyAspectItem[]>();
  for (const asp of aspects) {
    const key = asp.p2;
    if (!groups.has(key)) groups.set(key, []);
    groups.get(key)!.push(asp);
  }

  for (const [, group] of groups.entries()) {
    if (items.length >= 3) break;
    const primary = group[0];
    const signFlavor = SIGN_FLAVORS[primary.p1Sign] || { adj: 'akıcı', style: 'farkındalıkla hareket ederek' };
    const p1Gift = TRANSIT_PLANET_GIFT[primary.p1] || 'destekleyici bir akış sunarken';
    const p2Core = NATAL_PLANET_CORE[primary.p2] || 'günlük akışınızı';

    if (group.length === 1) {
      const actionPhrase = primary.aspectType === 'Üçgen'
        ? `${signFlavor.style} işlerinizi çok daha çabasız, doğal ve verimli bir şekilde sonuçlandırabilirsiniz.`
        : primary.aspectType === 'Sekstil'
        ? `${signFlavor.style} karşınıza çıkan iletişim ve girişim fırsatlarını somut kazanca dönüştürebilirsiniz.`
        : `${signFlavor.style} odaklandığınız konularda güçlü ve kalıcı bir başlangıç yapabilirsiniz.`;

      const text = `${capitalizeFirst(signFlavor.adj)} gökyüzü enerjisi, ${p1Gift} ${p2Core} destekliyor. Bugün ${actionPhrase}`;
      const astroTag = `Gökyüzü: ${primary.p1}${primary.p1Coord ? ` (${primary.p1Coord})` : ''} • ${primary.aspectType} • ${primary.p2}${primary.p2Coord ? ` (${primary.p2Coord})` : ''} [${primary.orb.toFixed(1)}°]`;
      items.push({ text, astroTag });
    } else {
      const second = group[1];
      const secondGift = TRANSIT_PLANET_GIFT[second.p1] || 'ekstra bir uyum kanalı açarken';
      const text = `Gökyüzünde çift yönlü destekleyici bir akış devrede: bir yandan ${p1Gift}, diğer yandan ${secondGift} ${p2Core} güçlendiriyor. Bugün ${signFlavor.style} önemli adımlarınızı güvenle hızlandırabilirsiniz.`;
      const astroTag = group
        .map(g => `${g.p1}${g.p1Coord ? ` (${g.p1Coord})` : ''} • ${g.aspectType}`)
        .join(' + ') + ` → ${primary.p2}${primary.p2Coord ? ` (${primary.p2Coord})` : ''}`;
      items.push({ text, astroTag });
    }
  }

  return items;
}

function buildMundaneSynthesizedCautions(
  aspects: EnrichedSkyAspectItem[],
  moonSign: string,
  moonDeg: number,
  moonDontAction: string
): PersonalGuidanceItem[] {
  const items: PersonalGuidanceItem[] = [
    {
      text: moonDontAction,
      astroTag: `Ay ${moonSign} Burcunda (${moonDeg}°) • Gölge Hassasiyet`
    }
  ];

  // Group by target planet (p2) so two challenging sky aspects hitting the same point are synthesized together
  const groups = new Map<string, EnrichedSkyAspectItem[]>();
  for (const asp of aspects) {
    const key = asp.p2;
    if (!groups.has(key)) groups.set(key, []);
    groups.get(key)!.push(asp);
  }

  for (const [, group] of groups.entries()) {
    if (items.length >= 3) break;
    const primary = group[0];
    const signFlavor = SIGN_FLAVORS[primary.p1Sign] || { adj: 'yoğun', style: 'sakin ve dengeli kalarak' };
    const p1Challenge = TRANSIT_PLANET_CHALLENGE[primary.p1] || 'günlük akışta ekstra dikkat ve sabır gerektirebilir';
    const p2Core = NATAL_PLANET_CORE[primary.p2] || 'içsel dengenizi';

    if (group.length === 1) {
      const warningPhrase = primary.aspectType === 'Karşıt'
        ? 'İki uç arasında savrulmak veya zıtlaşmak yerine, ilişkilerde ve kararlarda orta yolu bulmaya özen gösterin.'
        : primary.aspectType === 'Kare'
        ? 'Yükselen içsel baskıyı fevri tepkilere dönüştürmeyin; sınırlarınızı koruyup stratejik ve sabırlı ilerleyin.'
        : primary.aspectType === 'Kavuşum'
        ? `Yoğunlaşan bu baskıyı aceleci kararlarla değil, ${signFlavor.style} yönetin.`
        : 'Kör noktalara ve ani yargılara kapılmadan önce şartların netleşmesini bekleyin.';

      const text = `${capitalizeFirst(p2Core)} etkileyen güncel gökyüzü açısı, sizi ${p1Challenge}. ${warningPhrase}`;
      const astroTag = `Gökyüzü: ${primary.p1}${primary.p1Coord ? ` (${primary.p1Coord})` : ''} • ${primary.aspectType} • ${primary.p2}${primary.p2Coord ? ` (${primary.p2Coord})` : ''} [${primary.orb.toFixed(1)}°]`;
      items.push({ text, astroTag });
    } else {
      const second = group[1];
      const secondChallenge = TRANSIT_PLANET_CHALLENGE[second.p1] || 'ekstra bir gerilim yaratabilir';
      const text = `${capitalizeFirst(p2Core)} üzerinde şu an çift yönlü bir gökyüzü baskısı var: bir yandan ${p1Challenge}, diğer yandan ${secondChallenge}. Bugün aceleci yargılardan kaçınıp ${signFlavor.style} süreci gözlemleyin.`;
      const astroTag = group
        .map(g => `${g.p1}${g.p1Coord ? ` (${g.p1Coord})` : ''} • ${g.aspectType}`)
        .join(' + ') + ` → ${primary.p2}${primary.p2Coord ? ` (${primary.p2Coord})` : ''}`;
      items.push({ text, astroTag });
    }
  }

  return items;
}

export function generateCurrentSkyOverview(
  allSkyPlanets: AstroPoint[],
  allSkyAspects: any[]
): CurrentSkyOverview | null {
  if (!allSkyPlanets || allSkyPlanets.length === 0) return null;

  const sun = allSkyPlanets.find(p => p.name === 'Güneş');
  const moon = allSkyPlanets.find(p => p.name === 'Ay');

  const moonSign = moon?.sign || 'Koç';
  const moonDeg = moon?.degreeInSign ?? 0;
  const sunSign = sun?.sign || 'Terazi';
  const sunDeg = sun?.degreeInSign ?? 0;

  const moonData = MOON_MOODS[moonSign] || MOON_MOODS['Koç'];

  // Açıları dar orb'a göre filtrele ve sırala
  const validAspects = (allSkyAspects || []).filter(a => a.orb <= 3.2);
  validAspects.sort((a, b) => a.orb - b.orb);

  const enrichSkyAspect = (asp: any): EnrichedSkyAspectItem => {
    const isHarmonious = asp.type === 'Üçgen' || asp.type === 'Sekstil' || (asp.type === 'Kavuşum' && !['Satürn', 'Mars', 'Plüton', 'Kiron', 'Lilith'].includes(asp.planet2));
    const p1Obj = allSkyPlanets.find(p => p.name === asp.planet1);
    const p2Obj = allSkyPlanets.find(p => p.name === asp.planet2);
    const p1Sign = p1Obj?.sign || 'Koç';
    const p1Coord = p1Obj ? `${p1Obj.sign} ${p1Obj.degreeInSign}°` : '';
    const p2Coord = p2Obj ? `${p2Obj.sign} ${p2Obj.degreeInSign}°` : '';

    const signFlavor = SIGN_FLAVORS[p1Sign] || { adj: 'aktif', style: 'farkındalıkla' };
    const p2Core = NATAL_PLANET_CORE[asp.planet2] || 'kolektif akışı';
    const summary = isHarmonious
      ? `${capitalizeFirst(p2Core)} destekleyen ${signFlavor.adj} bir gökyüzü uyumu devrede.`
      : `${capitalizeFirst(p2Core)} sınayan ve bilinçli denge gerektiren bir eşik yaşanıyor.`;

    return {
      p1: asp.planet1,
      p2: asp.planet2,
      p1Sign,
      p1Coord,
      p2Coord,
      aspectType: asp.type,
      orb: asp.orb,
      isHarmonious,
      summary,
      badge: asp.orb <= 1.0 ? `★ Tam Pik (${asp.orb.toFixed(1)}°)` : `${asp.orb.toFixed(1)}° Orb`
    };
  };

  const allEnrichedSkyAspects = validAspects.map(enrichSkyAspect);
  const topAspects = allEnrichedSkyAspects.slice(0, 3);

  // Detaylı 8 Boyutlu Barometre Hesaplama
  const detailedSkyBarometer = buildDetailedCosmicBarometer(
    allSkyPlanets,
    allEnrichedSkyAspects.map(a => ({
      p1: a.p1,
      p2: a.p2,
      aspectType: a.aspectType,
      orb: a.orb,
      isHarmonious: a.isHarmonious
    })),
    false
  );

  // Başlık Kurgusu (Alttaki metinlerle tekrara düşmeyen net atmosfer başlığı)
  const peakAspect = topAspects[0];
  let headline = `Gökyüzü İklimi: ${moonData.mood} Enerjiler`;
  if (peakAspect) {
    if (peakAspect.isHarmonious) {
      headline = `Destekleyici Gökyüzü Akışı: ${moonData.mood}`;
    } else {
      headline = `Bilinçli Denge & Farkındalık Günü: ${moonData.mood}`;
    }
  }

  const subHeadline = `☉ Güneş ${sunSign} (${sunDeg}°) • ☽ Ay ${moonSign} (${moonDeg}°)`;

  // Genel Anlatı (Alttaki Fırsat/Dikkat maddelerini kopyalamadan günün sentez özeti)
  const sunFlavor = SIGN_FLAVORS[sunSign] || { adj: 'odaklı', style: 'farkındalıkla ilerleyerek' };
  const vibeNarrative = `Güneş'in ${sunSign} burcundaki ${sunFlavor.adj} doğası ile Ay'ın ${moonSign} burcundaki ${moonData.energy.toLowerCase()} ritmi birleşiyor. Bugün kararlarınızda ${sunFlavor.style} hareket etmek ve duygusal tepkilerde aşırılıklardan kaçınmak günün potansiyelini en verimli şekilde kullanmanızı sağlayacaktır.`;

  const harmoniousSky = allEnrichedSkyAspects.filter(a => a.isHarmonious);
  const challengingSky = allEnrichedSkyAspects.filter(a => !a.isHarmonious);

  const opportunities = buildMundaneSynthesizedOpportunities(harmoniousSky, moonSign, moonDeg, moonData.doAction);
  const cautions = buildMundaneSynthesizedCautions(challengingSky, moonSign, moonDeg, moonData.dontAction);

  return {
    headline,
    subHeadline,
    vibeNarrative,
    moonSign,
    moonDegree: moonDeg,
    moonMood: moonData.mood,
    sunSign,
    sunDegree: sunDeg,
    barometer: detailedSkyBarometer,
    opportunities,
    cautions,
    topAspects
  };
}

type EnrichedPersonalAspect = {
  transitPlanet: string;
  transitSign: string;
  transitDegree: number;
  transitHouse: number;
  natalPlanet: string;
  natalSign: string;
  natalDegree: number;
  natalHouse: number;
  aspectType: string;
  orb: number;
  badge: string;
  isHarmonious: boolean;
  summary: string;
};

function buildSynthesizedOpportunities(aspects: EnrichedPersonalAspect[]): PersonalGuidanceItem[] {
  // Group harmonious aspects by target natalPlanet so the same natal point/house is never repeated in separate cards
  const groups = new Map<string, EnrichedPersonalAspect[]>();
  for (const asp of aspects) {
    const key = asp.natalPlanet;
    if (!groups.has(key)) groups.set(key, []);
    groups.get(key)!.push(asp);
  }

  const items: PersonalGuidanceItem[] = [];
  for (const [, group] of groups.entries()) {
    if (items.length >= 3) break;
    const primary = group[0];
    const signFlavor = SIGN_FLAVORS[primary.transitSign] || { adj: 'dinamik', style: 'farkındalıkla hareket ederek' };
    const tGift = TRANSIT_PLANET_GIFT[primary.transitPlanet] || 'yeni bir farkındalık ve destek akışı sunarken';
    const nCore = NATAL_PLANET_CORE[primary.natalPlanet] || 'doğuştan gelen potansiyelinizi';
    const nArea = HOUSE_SHORT_THEMES[primary.natalHouse] || 'bu yaşam alanınız';
    const tArea = HOUSE_SHORT_THEMES[primary.transitHouse] || 'güncel gündeminiz';

    if (group.length === 1) {
      const aspectAction = primary.aspectType === 'Üçgen'
        ? `${signFlavor.style} çabasız, doğal ve akıcı sonuçlar elde edebilirsiniz.`
        : primary.aspectType === 'Sekstil'
        ? `${signFlavor.style} önünüze çıkan fırsatları somut bir girişime ve iletişime dönüştürebilirsiniz.`
        : `${signFlavor.style} bu alanda yepyeni ve kalıcı bir sayfa açabilirsiniz.`;

      const houseBridge = primary.transitHouse !== primary.natalHouse
        ? `${capitalizeFirst(tArea)} alanındaki hareketlilik doğrudan ${nArea} konularınızı besliyor; `
        : `Doğrudan ${nArea} konularınızda yoğunlaşan bu süreçte `;

      const text = `${capitalizeFirst(signFlavor.adj)} bir enerji akışı, ${tGift} ${nCore} güçlendiriyor. ${houseBridge}${aspectAction}`;
      const astroTag = `Transit ${primary.transitPlanet} (${primary.transitSign} ${primary.transitDegree}°) • ${primary.aspectType} • Natal ${primary.natalPlanet} (${primary.natalSign} ${primary.natalDegree}°) [${primary.orb.toFixed(1)}°]`;
      items.push({ text, astroTag });
    } else {
      // Multiple transits supporting the exact same natal point: synthesize them into one unified insight!
      const second = group[1];
      const secondGift = TRANSIT_PLANET_GIFT[second.transitPlanet] || 'ekstra bir destek kanalı açarken';
      const text = `${capitalizeFirst(nArea)} konularınızda çift yönlü güçlü bir destek var: ${tGift}, aynı anda ${secondGift} ${nCore} besliyor. Bu birleşik akışı ${signFlavor.style} somut ve kalıcı adımlara dönüştürebilirsiniz.`;
      const astroTag = group
        .map(g => `Transit ${g.transitPlanet} (${g.transitSign} ${g.transitDegree}°) • ${g.aspectType}`)
        .join(' + ') + ` → Natal ${primary.natalPlanet} (${primary.natalSign} ${primary.natalDegree}°)`;
      items.push({ text, astroTag });
    }
  }
  return items;
}

function buildSynthesizedCautions(aspects: EnrichedPersonalAspect[]): PersonalGuidanceItem[] {
  // Group challenging aspects by target natalPlanet so the same natal point/house is never repeated in separate cards
  const groups = new Map<string, EnrichedPersonalAspect[]>();
  for (const asp of aspects) {
    const key = asp.natalPlanet;
    if (!groups.has(key)) groups.set(key, []);
    groups.get(key)!.push(asp);
  }

  const items: PersonalGuidanceItem[] = [];
  for (const [, group] of groups.entries()) {
    if (items.length >= 3) break;
    const primary = group[0];
    const signFlavor = SIGN_FLAVORS[primary.transitSign] || { adj: 'yoğun', style: 'dengeli kalarak' };
    const tChallenge = TRANSIT_PLANET_CHALLENGE[primary.transitPlanet] || 'içsel bir gerilim ve sınav yaratabilir';
    const nCore = NATAL_PLANET_CORE[primary.natalPlanet] || 'hassas dengelerinizi';
    const nArea = HOUSE_SHORT_THEMES[primary.natalHouse] || 'bu yaşam alanınız';
    const tArea = HOUSE_SHORT_THEMES[primary.transitHouse] || 'güncel gündeminiz';

    if (group.length === 1) {
      const aspectWarning = primary.aspectType === 'Karşıt'
        ? `İki uç arasında savrulmak yerine, ${tArea} ile ${nArea} konuları arasında bilinçli ve sakin bir denge kurun.`
        : primary.aspectType === 'Kare'
        ? `${capitalizeFirst(nArea)} konularında yükselen içsel baskıyı fevri tepkilere dönüştürmeyin; sabırla ve sınırlarınızı koruyarak ilerleyin.`
        : primary.aspectType === 'Kavuşum'
        ? `${capitalizeFirst(nArea)} alanında yoğunlaşan bu baskıyı aceleci kararlarla değil, ${signFlavor.style} yönetin.`
        : `${capitalizeFirst(nArea)} konularında kör noktalara ve ani yargılara kapılmadan önce şartların netleşmesini bekleyin.`;

      const text = `${capitalizeFirst(nCore)} etkileyen bu süreç, sizi ${tChallenge}. ${aspectWarning}`;
      const astroTag = `Transit ${primary.transitPlanet} (${primary.transitSign} ${primary.transitDegree}°) • ${primary.aspectType} • Natal ${primary.natalPlanet} (${primary.natalSign} ${primary.natalDegree}°) [${primary.orb.toFixed(1)}°]`;
      items.push({ text, astroTag });
    } else {
      // Multiple transits challenging the exact same natal point: synthesize them into one unified warning!
      const second = group[1];
      const secondChallenge = TRANSIT_PLANET_CHALLENGE[second.transitPlanet] || 'ekstra bir hassasiyet oluşturabilir';
      const text = `${capitalizeFirst(nArea)} konularınızda şu an çift yönlü bir hassasiyet devrede: ${capitalizeFirst(nCore)} tetikleyen bu birleşik etki, bir yandan ${tChallenge}, diğer yandan ${secondChallenge}. Bu süreçte aceleci yargılardan kaçınıp ${signFlavor.style} süreci gözlemleyin.`;
      const astroTag = group
        .map(g => `Transit ${g.transitPlanet} (${g.transitSign} ${g.transitDegree}°) • ${g.aspectType}`)
        .join(' + ') + ` → Natal ${primary.natalPlanet} (${primary.natalSign} ${primary.natalDegree}°)`;
      items.push({ text, astroTag });
    }
  }
  return items;
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
  barometer: DetailedCosmicBarometer;
  opportunities: PersonalGuidanceItem[];
  cautions: PersonalGuidanceItem[];
  topAspects: EnrichedPersonalAspect[];
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

  const enrichAspect = (asp: TransitAspect): EnrichedPersonalAspect => {
    const tPlanet = transitPlanets.find(p => p.name === asp.transitPlanet);
    const nPlanet = natalPlanets.find(p => p.name === asp.natalPlanet);
    const tHouse = tPlanet ? (tPlanet.house || getHouseFromLongitude(tPlanet.longitude, natalHouses)) : 1;
    const nHouse = nPlanet ? (nPlanet.house || getHouseFromLongitude(nPlanet.longitude, natalHouses)) : 1;
    const isHarmonious = asp.type === 'Üçgen' || asp.type === 'Sekstil' || (asp.type === 'Kavuşum' && !['Satürn', 'Mars', 'Plüton', 'Kiron', 'Lilith'].includes(asp.transitPlanet));

    const tSign = tPlanet?.sign || '';
    const tDeg = tPlanet?.degreeInSign ?? 0;
    const nSign = nPlanet?.sign || '';
    const nDeg = nPlanet?.degreeInSign ?? 0;

    const signFlavor = SIGN_FLAVORS[tSign] || { adj: 'aktif', style: 'farkındalıkla' };
    const nCore = NATAL_PLANET_CORE[asp.natalPlanet] || 'doğuştan gelen potansiyelinizi';
    const nArea = HOUSE_SHORT_THEMES[nHouse] || 'bu yaşam alanınız';

    let summary = '';
    switch (asp.type) {
      case 'Kavuşum':
        summary = `${capitalizeFirst(nArea)} konularında yoğun bir odak ve yeni başlangıç döngüsü açılıyor; ${nCore} doğrudan harekete geçiren ${signFlavor.adj} bir etki altındasınız.`;
        break;
      case 'Üçgen':
        summary = `${capitalizeFirst(nArea)} konularında ${signFlavor.style} çabasız bir ilerleme ve akış sağlanıyor; ${nCore} besleyen doğal bir destek devrede.`;
        break;
      case 'Sekstil':
        summary = `${capitalizeFirst(nArea)} alanında somut adımlarla büyüyen fırsatlar beliriyor; ${nCore} harekete geçirerek yeni kapılar açabilirsiniz.`;
        break;
      case 'Kare':
        summary = `${capitalizeFirst(nArea)} konularında ertelediğiniz kararları yapılandırmanızı isteyen bir eşiktesiniz; ${nCore} zorlayan bu süreci bilinçli adımlarla yönetin.`;
        break;
      case 'Karşıt':
        summary = `${capitalizeFirst(nArea)} ekseninde ilişkisel ve içsel sınırlarınızı dengelemeniz gerekiyor; ${nCore} aynalayan önemli bir farkındalık sürecindesiniz.`;
        break;
      default:
        summary = `${capitalizeFirst(nArea)} konularında ${nCore} tetikleyen ince bir ayar ve gözlem süreci yaşanıyor.`;
    }

    const badge = asp.orb <= 0.8 ? `★ Tam Pik (${asp.orb.toFixed(1)}°)` : `${asp.orb.toFixed(1)}° Orb`;

    return {
      transitPlanet: asp.transitPlanet,
      transitSign: tSign,
      transitDegree: tDeg,
      transitHouse: tHouse,
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
  };

  const allEnrichedAspects = validAspects.map(enrichAspect);
  const topAspects = allEnrichedAspects.slice(0, 3);

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
    title: LIFE_AREA_NAMES[item.house] || HOUSE_SHORT_THEMES[item.house] || 'Yaşam Alanı',
    description: HOUSE_SHORT_THEMES[item.house] || 'bu yaşam alanınız',
    planetNames: item.planetNames
  }));

  // Detaylı Barometre Hesaplama (Kişisel doğum gezegenleri ve ev yerleşimleri dahil)
  const detailedPersonalBarometer = buildDetailedCosmicBarometer(
    transitPlanets,
    allEnrichedAspects.map(a => ({
      p1: a.transitPlanet,
      p2: a.natalPlanet,
      aspectType: a.aspectType,
      orb: a.orb,
      isHarmonious: a.isHarmonious,
      house1: a.transitHouse,
      house2: a.natalHouse
    })),
    true,
    natalHouses,
    natalPlanets
  );

  const peak = topAspects[0];
  const mainFocusTitle = focusHouses[0]?.title || 'Yaşam Alanlarınız';
  let headline = `${mainFocusTitle} Odağında Dengeli Akış`;
  // Kısa ve tekrarsız alt başlık (açıklamalar zaten Odak Yaşam Alanları kutusunda yer alıyor)
  const subHeadline = focusHouses.length > 0 
    ? `Yoğunlaşan Alanlar: ${focusHouses.map(h => h.title).join(' & ')}`
    : 'Bütünsel Dönüşüm Süreci';

  if (peak) {
    const peakAreaTitle = LIFE_AREA_NAMES[peak.natalHouse] || mainFocusTitle;
    if (peak.isHarmonious) {
      headline = `${peakAreaTitle} Konularında Destekleyici & Akıcı İlerleme`;
    } else {
      headline = `${peakAreaTitle} Konularında Farkındalık & Yapılanma Zamanı`;
    }
  }

  // Giriş paragrafı: Alttaki Odak Alanları açıklamasını veya Fırsat/Sınav cümlesini kopyalamadan genel dengeyi anlatır
  const harmoniousCount = allEnrichedAspects.filter(a => a.isHarmonious).length;
  const challengingCount = allEnrichedAspects.filter(a => !a.isHarmonious).length;
  let themeDescription = '';
  if (harmoniousCount > challengingCount) {
    themeDescription = 'Bugün kişisel haritanızda destekleyici ve ön açıcı açılar ağırlıkta. Uzun süredir beklettiğiniz adımları devreye sokmak, iletişim kurmak ve akışın sunduğu fırsatları somutlaştırmak için elverişli bir dönemdesiniz.';
  } else if (challengingCount > harmoniousCount) {
    themeDescription = 'Bugün haritanızda farkındalık, sabır ve bilinçli sınırlar gerektiren dönüştürücü açılar öne çıkıyor. Ani tepkiler vermek yerine şartları sakinlikle gözlemlemek ve enerjinizi öncelikli hedeflerinize odaklamak süreci güçlenerek yönetmenizi sağlayacaktır.';
  } else {
    themeDescription = 'Bugün haritanızda hem destekleyici fırsatlar hem de dikkat gerektiren eşikler dengeli bir dağılım gösteriyor. Fırsat kapılarını cesaretle değerlendirirken, hassas konularda esnek ve merkezde kalmanız günün anahtarıdır.';
  }

  const harmoniousAspects = allEnrichedAspects.filter(a => a.isHarmonious);
  const challengingAspects = allEnrichedAspects.filter(a => !a.isHarmonious);

  const opportunities = buildSynthesizedOpportunities(harmoniousAspects);
  if (opportunities.length === 0) {
    opportunities.push({ text: 'Günün sakin enerjisi altında geçmiş planlarınızı gözden geçirmek ve içsel dinginliği güçlendirmek için elverişli bir zemin var.' });
  }

  const cautions = buildSynthesizedCautions(challengingAspects);
  if (cautions.length === 0) {
    cautions.push({ text: 'Aşırı rahatlığa kapılıp tamamlanması gereken sorumluluklarınızı ertelemekten kaçının.' });
  }

  const peakHouseTopics = peak ? (HOUSE_SHORT_THEMES[peak.natalHouse] || 'bu yaşam alanınız') : '';
  const capitalizedPeakTopics = peakHouseTopics ? peakHouseTopics.charAt(0).toUpperCase() + peakHouseTopics.slice(1) : '';
  const lifeAdvice = peak
    ? (peak.isHarmonious 
        ? `${capitalizedPeakTopics} konularında oluşan bereketli akışı cesaret ve şükranla karşılayın; ertelediğiniz adımları hayata geçirin.`
        : `${capitalizedPeakTopics} konularında beliren sürtüşmeleri bir kriz değil, sizi daha sağlam ve olgun kılan bir basamak olarak görün.`)
    : 'Haritanızdaki sakin akışı içsel dinlenme ve hedeflerinizi sadeleştirme fırsatı olarak değerlendirin.';

  return {
    headline,
    subHeadline,
    themeDescription,
    focusHouses,
    barometer: detailedPersonalBarometer,
    opportunities: opportunities.slice(0, 3),
    cautions: cautions.slice(0, 3),
    topAspects,
    lifeAdvice
  };
}
