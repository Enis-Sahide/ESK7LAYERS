/**
 * SymbolCodeEngine.ts
 * Üst Benlik Sembol & Kişisel Kod Analizi Motoru ve Derin Ezoterik Kütüphanesi
 *
 * 3 Harita Mimarisi:
 * 1. RUH HARİTASI (Briah - İsim & Ses Frekansı): Ruh Güdüsü, Dışsal Persona, Gizli Tutku (Baskın Çakra)
 * 2. BEDEN HARİTASI (Assiah - Doğum & Enkarnasyon Mührü): Doğum Kodu, Yaşam Yolu, Gezegen Yöneticisi
 * 3. 3. HARİTA / SENTEZ & KARMİK SİMYA (Yetzirah - Eterik Kalkan & Köprü):
 *    Karmik Borç Kodu (13/4, 14/5, 16/7, 19/1), Aura Koruma Kodu, Ruh-Beden Köprü Kodu,
 *    Olgunluk (Simyasal Hasat) Kodu, Bilinçaltı Kriz Refleksi & Kalde Bileşik Arketipi.
 */

export type MapLayerType = 'soul' | 'body' | 'alchemy';

export interface DeepCodeSection {
  heading: string;
  content: string;
}

export interface PersonalSymbolCodeItem {
  id: string;
  title: string;
  shortTitle: string;
  codeValue: string;
  subLabel: string;
  layer: MapLayerType;
  layerBadge: string;
  color: string;
  archetypeTitle: string;
  summary: string;
  calculationFormula: string;
  isCoreSynchronicityCode?: boolean;
  higherSelfTrigger: {
    clockCodes: string[];
    totemSymbol: string;
    geometricSymbol: string;
    instantMessage: string;
  };
  sections: DeepCodeSection[];
}

export interface SynchronicitySignal {
  code: string;
  title: string;
  sourceCodeName: string;
  layer: MapLayerType;
  color: string;
  symbolArchetype: string;
  whenYouSeeIt: string;
  actionStep: string;
}

export interface SymbolCodeAnalysisResult {
  fullName: string;
  birthDate: string;
  birthTime?: string;
  summaryMetrics: {
    primaryKarmicCode: string;
    detectedKarmicList: { code: string; source: string }[];
    soulUrgeCode: number;
    soulUrgeSingle: number;
    personalityCode: number;
    destinyCode: number;
    birthMatrixFieldCode: number;
    missingBirthDigits: number[];
    embeddedRuhKodu: number;
    auraProtectionCode: number;
    missingChakras: number[];
    dominantChakra: number;
    birthDay: number;
    birthDaySingle: number;
    lifePathCode: number;
    lifePathSingle: number;
    birthPlanetName: string;
    lifePathPlanetName: string;
    maturityCode: number;
    bridgeCode: number;
    subconsciousSelfCode: number;
    chaldeanCompoundNum: number;
    birthTimePortalCode?: string;
    chaldeanHourPlanet?: string;
    isDayBirth?: boolean;
  };
  codes: PersonalSymbolCodeItem[];
  synchronicitySignals: SynchronicitySignal[];
  mapBalanceSummary: {
    soulDominantNote: string;
    bodyDominantNote: string;
    bridgeSynthesisNote: string;
  };
}

// Pisagor Harf Değerleri (Türkçe Karakter Destekli)
// Pisagor (Pythagorean) 1-9 Harf Değerleri
const LETTER_VALUES: Record<string, number> = {
  A: 1, B: 2, C: 3, Ç: 3, D: 4, E: 5, F: 6, G: 7, Ğ: 7, H: 8, I: 9, İ: 9,
  J: 1, K: 2, L: 3, M: 4, N: 5, O: 6, Ö: 6, P: 7, Q: 8, R: 9, S: 1, Ş: 1,
  T: 2, U: 3, Ü: 3, V: 4, W: 5, X: 6, Y: 7, Z: 8
};

// Orijinal Kalde (Chaldean / Babil) 1-8 Harf Tablet Değerleri (9 sayısı kutsaldır, harflere atanmaz)
const CHALDEAN_LETTER_VALUES: Record<string, number> = {
  A: 1, I: 1, İ: 1, J: 1, Q: 1, Y: 1,
  B: 2, K: 2, R: 2,
  C: 3, Ç: 3, G: 3, Ğ: 3, L: 3, S: 3, Ş: 3,
  D: 4, M: 4, T: 4,
  E: 5, H: 5, N: 5, X: 5,
  U: 6, Ü: 6, V: 6, W: 6,
  O: 7, Ö: 7, Z: 7,
  F: 8, P: 8
};

const VOWELS = new Set(['A', 'E', 'I', 'İ', 'O', 'Ö', 'U', 'Ü']);

function sumDigits(n: number): number {
  return String(Math.abs(n))
    .split('')
    .reduce((acc, d) => acc + (parseInt(d, 10) || 0), 0);
}

export function reduceToSingle(n: number, keepMaster = false): number {
  let curr = Math.abs(n);
  while (curr > 9) {
    if (keepMaster && (curr === 11 || curr === 22 || curr === 33)) {
      return curr;
    }
    curr = sumDigits(curr);
  }
  return curr || 1;
}

function checkKarmicFromSum(raw: number): string | null {
  let curr = Math.abs(raw);
  while (curr > 9) {
    if (curr === 13) return '13/4';
    if (curr === 14) return '14/5';
    if (curr === 16) return '16/7';
    if (curr === 19) return '19/1';
    curr = sumDigits(curr);
  }
  return null;
}

function getClockCodesForNumber(codeVal: number, singleVal: number): { list: string[]; display: string } {
  if (codeVal === 11) {
    return { list: ['11:11', '02:02', '222'], display: '11:11 / 02:02' };
  }
  if (codeVal === 22) {
    return { list: ['22:22', '04:04', '444'], display: '22:22 / 04:04' };
  }
  if (codeVal === 33) {
    return { list: ['03:33', '06:06', '666'], display: '03:33 / 06:06' };
  }
  return {
    list: [`0${singleVal}:0${singleVal}`, `${singleVal}${singleVal}${singleVal}`],
    display: `0${singleVal}:0${singleVal} / ${singleVal}${singleVal}${singleVal}`
  };
}

// Keldani (Chaldean) Gezegen Saatleri Dizilimi (Yavaştan Hızlıya: Satürn -> Jüpiter -> Mars -> Güneş -> Venüs -> Merkür -> Ay)
const CHALDEAN_ORDER = ['Satürn', 'Jüpiter', 'Mars', 'Güneş', 'Venüs', 'Merkür', 'Ay'] as const;
// Haftanın gün yöneticileri (0=Pazar: Güneş, 1=Pazartesi: Ay, 2=Salı: Mars, 3=Çarşamba: Merkür, 4=Perşembe: Jüpiter, 5=Cuma: Venüs, 6=Cumartesi: Satürn)
const DAY_RULER_PLANET: Record<number, typeof CHALDEAN_ORDER[number]> = {
  0: 'Güneş',
  1: 'Ay',
  2: 'Mars',
  3: 'Merkür',
  4: 'Jüpiter',
  5: 'Venüs',
  6: 'Satürn'
};

function calculateChaldeanBirthHourInfo(year: number, month: number, day: number, hour: number, minute: number) {
  // Keldani sisteminde yeni gün doğumu (~06:00) ile başlar; 00:00-05:59 arası bir önceki günün gece saatleridir.
  const birthDateObj = new Date(year, month - 1, day, hour, minute);
  if (hour < 6) {
    birthDateObj.setDate(birthDateObj.getDate() - 1);
  }
  const dayOfWeek = birthDateObj.getDay();
  const dayRuler = DAY_RULER_PLANET[dayOfWeek] || 'Güneş';
  const startIdx = CHALDEAN_ORDER.indexOf(dayRuler);
  const hoursSinceSunrise = (hour - 6 + 24) % 24;
  const hourPlanet = CHALDEAN_ORDER[(startIdx + hoursSinceSunrise) % 7];
  const isDayBirth = hour >= 6 && hour < 18;
  const hourNumberInHalf = (hoursSinceSunrise % 12) + 1;

  return {
    dayRuler,
    hourPlanet,
    isDayBirth,
    sectLabel: isDayBirth ? `Gündüz Doğumu (${hourNumberInHalf}. Gündüz Saati — Diürnal / Güneş Sektörü)` : `Gece Doğumu (${hourNumberInHalf}. Gece Saati — Noktürnal / Ay Sektörü)`
  };
}

// ============================================================================
// 1. KARMİK BORÇ KODLARI DERİN KÜTÜPHANESİ (13/4, 14/5, 16/7, 19/1 ve YOK)
// ============================================================================
interface KarmicLibraryEntry {
  archetypeTitle: string;
  summary: string;
  clockCodes: string[];
  totemSymbol: string;
  geometricSymbol: string;
  instantMessage: string;
  sections: DeepCodeSection[];
}

const KARMIC_DEBT_LIBRARY: Record<string, KarmicLibraryEntry> = {
  '19/1': {
    archetypeTitle: 'Güneşin Gölgesinden Özgün Liderliğe (İlahi Tekabül & Güç Sınavı)',
    summary:
      '19/1; başlangıç noktası (1) ile tamamlanma zirvesinin (9) yan yana geldiği, geçmiş enkarnasyonlardaki otorite ve güç kullanımını bu hayatta "kendi ayakları üzerinde duran şefkatli liderliğe" dönüştüren en güçlü karmik simya kodudur.',
    clockCodes: ['19:19', '10:10', '11:11', '01:01'],
    totemSymbol: 'Sol Invictus (Taçlı Zafer Güneşi), Altın Aslan & Horus Şahini (Arkana XIX)',
    geometricSymbol: 'Merkez Noktalı Güneş Çemberi (Circumpunct) & Güneşin 6×6 Kamea Karesi (111)',
    instantMessage:
      'Saatlerde veya plakalarda 19, 19:19 ya da 11:11 gördüğünde Üst Benliğin sana sesleniyor: "Kimseden kurtarıcı bekleme ama kimseyi de sırtında taşıma. Kendi kararını ver, güneş gibi parlamaktan korkma!"',
    sections: [
      {
        heading: '1. Sayıların Ezoterik Anatomisi: 1 + 9 = 10 → 1',
        content:
          '1 sayısı "Ben" bilincini, eril yaratıcı iradeyi ve ilk kıvılcımı (Kether); 9 sayısı ise evrensel tamamlanmayı, hümanizmi ve bilgeliği temsil eder. 1 ve 9\'un toplamı olan 10, Tarot ve Kabala\'da "Kader Çarkı"dır (Malkuth\'tan yeni bir oktava sıçrama). Ruhunuz geçmişte 9 aşamalık büyük bir döngüyü tamamlamış, bilgi ve otorite sahibi olmuş ancak bu gücü kullanırken "Ben (1)" ile "Bütün (9)" arasındaki dengeyi şaşırdığı için yeni döngüye 19/1 mührüyle girmiştir.'
      },
      {
        heading: '2. Karmik Kökeni: Geçmişten Devreden Enerji Kaydı',
        content:
          'Ezoterik kayıtlara göre 19/1 kodu; geçmiş yaşamda yüksek statü, liderlik, bilgi veya otorite sahibi olunan bir enkarnasyonda gücün benmerkezci kullanılması, başkasının iradesine hükmedilmesi ya da tam tersine sahip olunan liderlik yeteneğinin korku yüzünden başkalarının gölgesine teslim edilmesidir. Ruh bu hayatta "Gerçek güç, kimseyi ezmeden ve kimseye bağımlı olmadan kendi merkezinde durabilmektir" dersini mühürlemeye gelmiştir.'
      },
      {
        heading: '3. Bu Hayatta Karşılaşılan 3 Ana Sınav Senaryosu',
        content:
          '• Tek Başına Kalma Sınavı: Hayatınızın en kritik dönemeçlerinde (iş, kriz, duygusal dönüşüm) etrafınız kalabalık olsa bile son virajda destekler aniden çekilir ve "Bu dağı kendi başıma aşmak zorundayım" dediğiniz anlar yaşarsınız.\n• Kurtarıcı / Kurban Sarkacı: Herkesin yükünü sırtlanıp kimseye "yardıma ihtiyacım var" diyememe (aşırı gurur) veya güçlü/otoriter figürlerin gölgesine sığınıp kendi ışığını erteleme.\n• İrade Çatışmaları: Baba figürü, yöneticiler veya ortaklarla yaşanan "Benim dediğim olacak" gerilimleri.'
      },
      {
        heading: '4. Gölge Tuzağı & Simyasal Şifalandırma Anahtarı',
        content:
          'Gölge Tuzağı: İnatçılık, "Kimseye ihtiyacım yok" diyerek kalbi kapatmak veya mağduriyet psikolojisine düşmek.\nŞifalandırma Anahtarı: 19/1 şifalandığında Kalde numerolojisinde "Gökyüzü Prensi / Güneşin Tacı" unvanına dönüşür. Yardım istemenin zayıflık olmadığını kabul ettiğiniz, kendi kararlarınızın sorumluluğunu kimseyi suçlamadan aldığınız ve liderliğinizi başkalarını yükseltmek için kullandığınız anda 19/1 borcu kapanır; yenilmez bir karizma ve bereket kapısı açılır.'
      }
    ]
  },
  '13/4': {
    archetypeTitle: 'Küllerden Doğan Mimar (Emek, Odak ve Maddeye Hükmetme Sınavı)',
    summary:
      '13/4; dönüşüm (13) ile sarsılmaz temel ve düzenin (4) birleşimidir. Dağınık enerjiyi tek bir odakta toplamayı, ertelemeyi bırakmayı ve sabırla kalıcı bir imparatorluk inşa etmeyi öğreten karmik ustalık kodudur.',
    clockCodes: ['13:13', '04:04', '14:41', '444'],
    totemSymbol: 'Khepri (Yeniden Doğuş Skarabı), Hasat Orakçısı & Anka Kuşu (Arkana XIII)',
    geometricSymbol: 'Kutsal Küp (Heksahedron), Dalet Kapısı & Dört Yön Haçı',
    instantMessage:
      '13 veya 04:04 kodunu gördüğünde Üst Benliğin seni uyarıyor: "Kestirme yol arama, yarım bıraktığın işi tamamla ve masanı/zihnini topla. Sabrının ödülü çok yakın!"',
    sections: [
      {
        heading: '1. Sayıların Ezoterik Anatomisi: 1 + 3 = 4',
        content:
          '1 (irade ve başlangıç) ile 3 (yaratıcı neşe ve dağılma) birleştiğinde 4 (Toprak elementi, Dalet kapısı, düzen, disiplin ve somut yapı) doğar. Ezoterik Tarot\'ta 13 numaralı arkana "Ölüm / Büyük Dönüşüm" kartıdır: İşlevini yitirmiş eski alışkanlıkların budanıp yerine sarsılmaz bir temel (4) atılmasını simgeler.'
      },
      {
        heading: '2. Karmik Kökeni: Geçmişten Devreden Enerji Kaydı',
        content:
          'Geçmiş yaşam kayıtlarında dünyevi sorumluluklardan kaçınma, başkalarının emeği üzerinden rahat yaşama, başlanan işleri yarım bırakma veya yetenekleri disiplinsizlik yüzünden çarçur etme enerjisini dengeler. Bu hayatta ruh, "Madde dünyasında ter dökerek ve odaklanarak kutsal bir eser inşa etme" sözü vermiştir.'
      },
      {
        heading: '3. Bu Hayatta Karşılaşılan 3 Ana Sınav Senaryosu',
        content:
          '• Kolay Yoldan Gidince Çöken Yapılar: Emek verilmeden veya kestirme yoldan elde edilen kazançların/ilişkilerin hızla dağılması; buna karşın sabırla örülen işlerin mucizevi şekilde kalıcı olması.\n• Odak Dağınıklığı ve Erteleme: Aynı anda beş işe başlayıp hiçbirini bitirememe veya "Çok çalışıyorum ama karşılığını alamıyorum" hissi.\n• Düzen ve Köklenme Sınavı: Ev, aile, mülk ve mesleki sistem kurarken normalden iki kat fazla detayla uğraşmak zorunda kalma.'
      },
      {
        heading: '4. Gölge Tuzağı & Simyasal Şifalandırma Anahtarı',
        content:
          'Gölge Tuzağı: Şikayet etmek, karamsarlığa kapılmak, tembellik veya tam tersi işkolik olup hayattan keyif almayı unutmak.\nŞifalandırma Anahtarı: Şikayet etmeyi bıraktığınız, günlük rutininizi kutsal bir ibadet gibi disipline ettiğiniz ve başladığınız her işi sonuna kadar götürdüğünüz anda 13/4 kodu, kimsenin yıkamayacağı finansal ve ruhsal bir kaleye dönüşür.'
      }
    ]
  },
  '14/5': {
    archetypeTitle: 'Rüzgarı Yöneten Simyacı (Özgürlük, Denge ve İrade Hakimiyeti Sınavı)',
    summary:
      '14/5; beş duyu dünyasının, özgürlüğün, değişimin ve manyetik çekimin (5) merkezindeki karmik denge kodudur. Kaos ve aşırılıklar içinde kendi merkezini kaybetmeden özgürleşmeyi öğretir.',
    clockCodes: ['14:14', '05:05', '15:51', '555'],
    totemSymbol: 'İki Kadeh Arasında İksir Aktaran Simya Meleği (İtidal - Arkana XIV) & Thoth İbis Kuşu',
    geometricSymbol: 'Pentagram (Beş Köşeli Mikrokozmos Yıldızı) & Caduceus Çift Yılanlı Asa',
    instantMessage:
      '14:14 veya 05:05 gördüğünde Üst Benliğin diyor ki: "Anlık hazlara veya öfkeye kapılma, enerjini dağıtma! Değişimden korkma ama direksiyonu elinde tut."',
    sections: [
      {
        heading: '1. Sayıların Ezoterik Anatomisi: 1 + 4 = 5',
        content:
          '1 (bireysel irade) ile 4 (düzen ve sınırlar) birleşerek 5\'i (Hava/Ateş hareketi, Merkür hızı, beş duyu ve özgürlük) doğurur. Ezoterik Tarot\'ta 14 numaralı arkana "Denge / Simya (Temperance)" kartıdır: Bir kadehten diğerine su aktaran melek, zıt kutupları (madde ve ruh, özgürlük ve sorumluluk) birbirine karıştırıp altın iksiri üretmeyi simgeler.'
      },
      {
        heading: '2. Karmik Kökeni: Geçmişten Devreden Enerji Kaydı',
        content:
          'Geçmiş enkarnasyonlarda özgürlüğün sorumsuzca kullanılması, bağlılık korkusuyla insanların yarı yolda bırakılması ya da bedensel/duyusal hazlara (tutkular, bağımlılıklar, aşırı uçlar) teslim olunarak ruhsal amacın unutulmasıyla ilgilidir.'
      },
      {
        heading: '3. Bu Hayatta Karşılaşılan 3 Ana Sınav Senaryosu',
        content:
          '• Ani Rota Değişimleri (Rollercoaster Hayat): Tam her şey sabitlendi derken işin, şehrin, ilişkinin veya şartların bir gecede değişmesi ve uyum sağlama sınavı.\n• Duyusal Aşırılık ve Bağımlılık Çekimi: Yeme, alışveriş, toksik ilişkiler, adrenalin veya zihinsel uyaranlara karşı aşırı çekim ve "dur" diyebilme sınavı.\n• Özgürlük - Bağlılık Çatışması: Bir yere veya kişiye bağlandığında boğulma hissi, tamamen yalnız kaldığında ise boşluk hissi.'
      },
      {
        heading: '4. Gölge Tuzağı & Simyasal Şifalandırma Anahtarı',
        content:
          'Gölge Tuzağı: Sabırsızlık, maymun iştahlılık, kaçış psikolojisi ve duygusal uçlarda savrulmak.\nŞifalandırma Anahtarı: Gerçek özgürlüğün "istediğin her şeye kapılmak" değil, "kendi arzularının efendisi olmak (itidal)" olduğunu kavradığınızda 14/5 kodu size olağanüstü bir iletişim karizması, ticari zeka ve dünyayı dolaşan bir bereket frekansı açar.'
      }
    ]
  },
  '16/7': {
    archetypeTitle: 'Yıkılan Kuleden Doğan Bilge (Ego Çözülmesi ve Ruhsal Uyanış Sınavı)',
    summary:
      '16/7; sahte kimliklerin ve kibir kulelerinin yıkılıp (16), altından saf ruhsal bilgeliğin ve ilahi sezginin (7) doğduğu en derin mistik uyanış kodudur.',
    clockCodes: ['16:16', '07:07', '17:17', '777'],
    totemSymbol: 'Taçlı Kuleye Düşen İlahi Yıldırım (The Tower - Arkana XVI) & Athena Baykuşu',
    geometricSymbol: 'Heptagram (Yedi Köşeli Mistik Yıldız) & Yedi Kollu Menorah',
    instantMessage:
      '16:16 veya 07:07 gördüğünde Üst Benliğin fısıldıyor: "Yıkılan şeye üzülme; o senin sahte kafesindi. Dışarıdaki gürültüden çekil, iç sesini dinle, hakikat sana açılıyor."',
    sections: [
      {
        heading: '1. Sayıların Ezoterik Anatomisi: 1 + 6 = 7',
        content:
          '1 (benlik/ego) ile 6 (aşk, bağlılık ve güzellik) birleşerek 7\'yi (Taç çakra, sırlar, içedönüş ve ilahi bilgelik) oluşturur. Ezoterik Tarot\'ta 16 numaralı arkana "Yıkılan Kule (The Tower)" kartıdır: Egonun inşa ettiği sahte güvenlik duvarlarına düşen ilahi yıldırım, kişiyi illüzyondan uyandırıp doğrudan hakikatle (7) yüzleştirir.'
      },
      {
        heading: '2. Karmik Kökeni: Geçmişten Devreden Enerji Kaydı',
        content:
          'Geçmiş yaşamda sevgi, sadakat, entelektüel üstünlük veya ruhsal bilginin kibirle kullanılması; kalp kırıklığına sebep olunması veya maddi/entelektüel kibrin ilahi yasaların önüne konulmasıyla ilişkilidir. Bu hayatta ruh, "Sahte olan hiçbir şeyin üzerinde yükselmeyeceğim" diyerek en derin uyanış kontratını imzalamıştır.'
      },
      {
        heading: '3. Bu Hayatta Karşılaşılan 3 Ana Sınav Senaryosu',
        content:
          '• Kule Anları (Ani Aydınlanma Şokları): Kişinin "Benim asla başıma gelmez" dediği veya aşırı güvendiği bir statünün, ilişkinin ya da inancın beklenmedik bir gerçekle sarsılması ve ardından gelen muazzam ruhsal büyüme.\n• İlişkilerde Derin Ayna Sınavı: Yüzeysel ilişkilerin asla yürümemesi; kalbin ancak tam bir dürüstlük ve ruhsal derinlik olduğunda huzur bulması.\n• Yalnızlık ve Anlaşılamama Hissi: Kalabalıklar içinde bile kendini başka bir gezegenden gelmiş gibi hissetme.'
      },
      {
        heading: '4. Gölge Tuzağı & Simyasal Şifalandırma Anahtarı',
        content:
          'Gölge Tuzağı: Kibir, insanlara yukarıdan bakmak, aşırı şüphecilik veya kalp kırıklığı korkusuyla kendini tamamen izole etmek.\nŞifalandırma Anahtarı: Alçakgönüllülüğü ve teslimiyeti seçtiğinizde, hayatın sizden aldıklarının aslında sizi korumak için olduğunu gördüğünüzde 16/7 kodu sizi durugörü sahibi bir bilgeye, şifacıya ve üst düzey bir stratejiste dönüştürür.'
      }
    ]
  },
  YOK: {
    archetypeTitle: 'Karmik Muafiyet & Serbest İrade Kontratı (Açık Kader Defteri)',
    summary:
      'Ana isim ve doğum kodlarınızda 13/4, 14/5, 16/7 veya 19/1 karmik borç mührü bulunmamaktadır. Bu durum, geçmişten devreden ağır bir güç/ego borcu yerine bu hayata "Serbest İrade ve Yeni Ekim" kontratıyla geldiğinizi gösterir.',
    clockCodes: ['11:11', '22:22', '09:09'],
    totemSymbol: 'Ankh (Ölümsüz Yaşam Anahtarı), Beyaz Güvercin & Kader Çarkı Sfenksi (Arkana X)',
    geometricSymbol: 'Tetractys (Pisagor 10 Noktalı Kutsal Üçgeni) & Yaşam Çiçeği',
    instantMessage:
      '11:11 veya 22:22 gördüğünde Üst Benliğin sana hatırlatıyor: "Önünde geçmişten gelen bir pranga yok; bugün attığın her adım doğrudan yeni kaderini yazıyor!"',
    sections: [
      {
        heading: '1. Karmik Muafiyet Ne Anlama Gelir?',
        content:
          'Haritanızda ağır bir karmik borç kodunun (13, 14, 16, 19) çıkmaması, ruhunuzun bu enkarnasyona geçmişten devreden zorunlu bir "iflas/ceza dosyası" ile girmediğini gösterir. Hayatınızdaki sınavlar geçmişin borcunu ödemek için değil, mevcut bilincinizi bir üst oktava taşımak içindir.'
      },
      {
        heading: '2. Serbest İrade Sorumluluğu',
        content:
          'Karmik borcu olmayan ruhların en büyük sınavı "rehavet" veya "erteleme"dir. Çünkü onları zorla duvara çarptırıp uyandıran bir 16/7 Kulesi veya 19/1 yalnızlığı yoktur. Bu nedenle kendi disiplininizi ve ruhsal uyanışınızı dışsal krizler beklemeden, kendi özgür iradenizle başlatmanız gerekir.'
      },
      {
        heading: '3. Yeni Karma Ekmeme Yasası',
        content:
          'Açık bir kader defteriyle geldiğiniz için bu hayatta gücünüzü (1), emeğinizi (4), özgürlüğünüzü (5) ve sevginizi (6-7) nasıl kullandığınız doğrudan geleceğinizi şekillendirir. Aura Koruma Kodunuzu ve Köprü Kodunuzu aktif tutarak çok hızlı tezahür (manifest) gerçekleştirebilirsiniz.'
      }
    ]
  }
};

// ============================================================================
// 2. RUH GÜDÜSÜ (İÇSEL ARZU) KODLARI (1-9, 11, 22) - RUH HARİTASI (BRIAH)
// ============================================================================
const SOUL_URGE_LIBRARY: Record<
  number,
  {
    title: string;
    totem: string;
    geometry: string;
    summary: string;
    soulHunger: string;
    shadowTrap: string;
    higherSelfMessage: string;
  }
> = {
  1: {
    title: 'Öncü Kıvılcım & Bağımsız Ruh (Alef Nefesi)',
    totem: 'Alef (Kutsal Boğa / İlk Nefes), Altın Aslan & Apollon Güneş Şahini',
    geometry: 'Monad — Merkez Noktalı Çember (Circumpunct)',
    summary: 'Ruhunuzun en derin açlığı kendi kararlarını kendi vermek, özgün olmak ve kimsenin taklidi olmadan kendi yolunu açmaktır.',
    soulHunger: 'İçsel dünyanızda emir almaya, kısıtlanmaya ve sıradanlığa tahammülünüz yoktur. Ruhunuz yaratıcı bir projeyi sıfırdan başlatırken canlanır.',
    shadowTrap: 'Sabırsızlık, içsel öfke, "Her şeyi ben bilirim" yalnızlığı veya takdir edilmediğinde hızla soğuma.',
    higherSelfMessage: '11:11 ve 01:01 saatleri: "Başkalarının onayını beklemeyi bırak, içindeki ilk kıvılcımı hemen eyleme dök!"'
  },
  2: {
    title: 'Kutsal Ayna & Şefkatli Bütünleşme (Bet Kabı)',
    totem: 'Bet (Kutsal Tapınak / Ev), İsis Hilali & Gümüş Kuğu',
    geometry: 'Dyad — Vesica Piscis (İki Kesişen Çember) & Jachin-Boaz Sütunları',
    summary: 'Ruhunuzun en derin açlığı huzur, derin duygusal bağ, zarafet ve ruhsal düzeyde anlaşılmaktır.',
    soulHunger: 'Çatışma, kabalık ve gürültü ruhunuzu hızla yorar. İkili ilişkilerde ve ortaklıklarda görünmeyen duygusal akıntıları anında hissedersiniz.',
    shadowTrap: 'Sevilmek uğruna kendi sınırlarını feda etmek, alınganlık, kararsızlık ve başkasının duygusal yükünü sırtlanmak.',
    higherSelfMessage: '02:02 ve 22:22 saatleri: "Sezgine güven; uyum yaratmak için kendinden vazgeçme, önce kendi iç huzurunu koru."'
  },
  3: {
    title: 'İlahi Neşe & Yaratıcı İfade (Gimel-Lamed Kanadı)',
    totem: 'Gimel (Çölü Geçen Deve / Bereket Köprüsü) & Jüpiter Kraliyet Kartalı',
    geometry: 'Triad — Kutsal Eşkenar Üçgen (Delta) & Triskele',
    summary: 'Ruhunuzun en derin açlığı kendini sözle, sanatla, estetikle ve ilhamla özgürce ifade etmektir.',
    soulHunger: 'İçinizde sürekli konuşmak, üretmek, güzelleştirmek ve insanlara umut aşılamak isteyen çocuksu ama bilge bir ışık vardır.',
    shadowTrap: 'Duygusal iniş çıkışlar, anlaşılmadığında içe kapanıp küsmek, enerjisini aynı anda çok fazla şeye dağıtmak.',
    higherSelfMessage: '03:03 ve 15:15 saatleri: "Boğazında düğümlenen sözü ve içindeki yaratıcı ilhamı bastırma; sesin senin şifandır!"'
  },
  4: {
    title: 'Kutsal Mimar & Güven Kalesi (Dalet-Mem Temeli)',
    totem: 'Dalet (Tapınak Kapısı) & Dört Kerubim Muhafızı (Boğa-Aslan-Kartal-İnsan)',
    geometry: 'Tetrad — Kutsal Küp (Heksahedron) & Pisagor Tetractys Piramidi',
    summary: 'Ruhunuzun en derin açlığı güven, netlik, sadakat ve zamana meydan okuyan kalıcı bir düzen kurmaktır.',
    soulHunger: 'Belirsizlik ve tutarsız insanlar ruhunuzu huzursuz eder. Sevdikleriniz için sarsılmaz bir sığınak olmak istersiniz.',
    shadowTrap: 'Değişime direnç göstermek, aşırı kontrolcülük, geçmiş hatalara takılıp kalmak ve kendine karşı fazla acımasız olmak.',
    higherSelfMessage: '04:04 ve 13:13 saatleri: "Temelin sağlam, korkuyu bırak. Biraz esneklik göster ki kurduğun yapıya ışık girsin."'
  },
  5: {
    title: 'Özgür Rüzgar & Deneyim Kaşifi (He-Nun Akışı)',
    totem: 'He (İlahi Nefes Penceresi), Thoth İbis Kuşu & Hermes Caduceus Asası',
    geometry: 'Pentad — Pentagram (Altın Oran Beş Köşeli Yıldız)',
    summary: 'Ruhunuzun en derin açlığı keşfetmek, sınırları aşmak, yeni kültürler/bilgiler deneyimlemek ve ruhsal özgürlüktür.',
    soulHunger: 'Rutin ve tekdüzelik ruhunuzun ışığını söndürür. Değişim rüzgarları estiğinde herkes korkarken siz canlanırsınız.',
    shadowTrap: 'Derinleşmekten kaçmak, huzursuzluk, sabırsızlık ve "Acaba başka yerde daha iyi bir şey mi var?" tatminsizliği.',
    higherSelfMessage: '05:05 ve 14:14 saatleri: "Özgürlük kaçmak değil, bulunduğun ana kendi ruhunu katmaktır. Değişimden korkma!"'
  },
  6: {
    title: 'Kozmik Şifacı & Kalp Koruyucusu (Vav Köprüsü)',
    totem: 'Vav (Göğü Yere Bağlayan Altın Kanca), Venüs Güvercini & Kuğu',
    geometry: 'Hexad — Hekzagram (Mühr-ü Süleyman / Altı Köşeli Merkaba Yıldızı)',
    summary: 'Ruhunuzun en derin açlığı koşulsuz sevgi, estetik uyum, aile sıcaklığı ve dokunduğu hayatları iyileştirmektir.',
    soulHunger: 'Adaletsizliğe ve sevgisizliğe dayanamazsınız. Bulunduğunuz her mekanı ve insanı güzelleştirme, onarma içgüdünüz vardır.',
    shadowTrap: 'Kurtarıcı sendromu (istenmeden herkesin hayatına müdahale etmek), mükemmeliyetçilik ve nankörlük gördüğünde derin kalp kırıklığı.',
    higherSelfMessage: '06:06 ve 16:16 saatleri: "Herkesi iyileştirmeye çalışırken kendi kalbini ihmal etme. Sevgiyi önce kendine ver."'
  },
  7: {
    title: 'Sırların Bekçisi & Mistik Gözlemci (Zayin-Yod Işığı)',
    totem: 'Zayin (Alevli Ruhsal Kılıç), Giza Sfenksi & Athena Baykuşu (Arkana VII)',
    geometry: 'Heptad — Heptagram (Yedi Köşeli Yıldız) & Yedi Kollu Menorah',
    summary: 'Ruhunuzun en derin açlığı yüzeyin altındaki gizli hakikati bulmak, bilgelik ve kutsal yalnızlık alanında dinlenmektir.',
    soulHunger: 'Sığ sohbetler ve yapay ortamlar sizi boğar. Doğada, sessizlikte, araştırmada ve ezoterik ilimlerde ruhunuz şarj olur.',
    shadowTrap: 'Zihinsel aşırı analiz, duygularını gizlemek, insanlara mesafe koymak ve içsel melankoli.',
    higherSelfMessage: '07:07 ve 17:17 saatleri: "Zihnini sustur, kalbinin sezgisine in. Aradığın cevap kitaplarda değil, içindeki sessizlikte."'
  },
  8: {
    title: 'Karmik Hükümran & Bereket Simyacısı (Het-Zayin Tacı)',
    totem: 'Het (Yaşam Sınırı), Ouroboros Yılanı & Ma\'at Adalet Terazisi (Arkana VIII)',
    geometry: 'Ogdoad — Oktagram (Sekiz Köşeli Melkisedek Yıldızı) & Lemniskat (∞)',
    summary: 'Ruhunuzun en derin açlığı ruhsal gücü maddi dünyada somut başarıya, otoriteye ve büyük ölçekli etkiye dönüştürmektir.',
    soulHunger: 'Küçük hedefler sizi tatmin etmez. Gücü, parayı ve organizasyonu adil bir şekilde yöneterek iz bırakmak istersiniz.',
    shadowTrap: 'Güç savaşları, her şeyi maddi başarıyla ölçmek, duygusal sertlik veya kaybetme korkusu.',
    higherSelfMessage: '08:08 ve 18:18 saatleri: "Bolluk ve güç senin doğal hakkın; ancak gücü kontrol için değil, adalet ve bereket için kullan."'
  },
  9: {
    title: 'Evrensel Bilge & Şefkat Okyanusu (Tet-Resh Işığı)',
    totem: 'Tet (Bilgelik Yılanı), Hermit\'in Altın Feneri & Zümrüdüanka (Arkana IX)',
    geometry: 'Ennead — Enneagram (Dokuz Köşeli Tamamlanma Çemberi)',
    summary: 'Ruhunuzun en derin açlığı insanlığa hizmet etmek, evrensel bilgelik yaymak ve koşulsuz şefkatle bütünleşmektir.',
    soulHunger: 'Sadece kendiniz için yaşamak size anlamsız gelir; bir öğreti, sanat veya şifa yoluyla kitlelerin ruhuna dokunmak istersiniz.',
    shadowTrap: 'Geçmişi ve bitmiş ilişkileri bırakamamak, hayal kırıklıkları ve dünyaya küsmek.',
    higherSelfMessage: '09:09 ve 19:19 saatleri: "Biten döngüyü sevgiyle uğurla; ellerini geçmişten çekmezsen yeni mucizeyi tutamazsın."'
  },
  11: {
    title: 'Üstat Aydınlatıcı & İlahi Anten (11/2 Master Frekansı)',
    totem: 'Jachin ve Boaz İkiz Tapınak Sütunları & Aslanın Ağzını Tutan Güç (Arkana XI)',
    geometry: '11. Kabalistik Yol (Alef) & Çift Işık Sütunu',
    summary: 'Ruhunuz üst boyutlarla fiziksel dünya arasında doğrudan elektrik hattı taşıyan bir "Üstat Kanal" (11/2) frekansındadır.',
    soulHunger: 'Sıradan bir hayat sizi asla tatmin etmez; rüyalarınız, ani bilişleriniz ve ilhamlarınızla insanları uyandırmak için buradasınız.',
    shadowTrap: 'Yüksek voltajlı sinir sistemi gerginliği, anksiyete, kendi ışığından korkup 2 sayısının pasifliğine saklanmak.',
    higherSelfMessage: '11:11 saati senin ana imzandır: "Sen bir kanalsın! Şüpheyi bırak, şu an aklından geçen o ilham doğrudan Üst Benliğinden geldi."'
  },
  22: {
    title: 'Üstat Mimar & Dünyaları Kurucu (22/4 Master Frekansı)',
    totem: 'Hayat Ağacının 22 Kutsal Harf Kapısı & Dört Element Tacı (Arkana XXI)',
    geometry: 'Metatron Küpü & 22 Sefirot Kanalı',
    summary: 'Ruhunuz en yüksek ruhsal vizyonları (11) fiziksel dünyada kalıcı kurumlara ve sistemlere (4) dönüştüren "Üstat Mimar" frekansındadır.',
    soulHunger: 'Yüzlerce insanın faydalanacağı somut bir sistem, platform veya eser inşa etmek ruhunuzun en büyük tutkusudur.',
    shadowTrap: 'Kendi potansiyelinin büyüklüğü altında ezilme hissi, aşırı kontrolcülük ve tükenmişlik.',
    higherSelfMessage: '22:22 saati senin mühründür: "Vizyonun fazla büyük değil; sen onu inşa edecek kapasiteyle doğdun. Adım adım temeli at!"'
  },
  33: {
    title: 'Üstat Şifacı & Evrensel Öğretmen (33/6 Avatar Frekansı)',
    totem: '33 Omurga Kundalini Tacı, Altın Anka & Bin Yapraklı Sahasrara Lotusu',
    geometry: 'Üçboyutlu Altın Merkaba (Yıldız Tetrahedron)',
    summary: 'Ruhunuz sezgisel aydınlanma (11) ile somut ustalığı (22) koşulsuz sevgi potasında birleştiren en yüksek "Üstat Öğretmen ve Şifacı" (33/6) frekansındadır.',
    soulHunger: 'Karşılık beklemeden kitlelere rehberlik etmek, ruhsal bilgelik aktarmak ve kalpleri şifalandırmak için enkarne oldunuz.',
    shadowTrap: 'Dünyanın acısını kendi sırtında taşıyarak tükenmek ve kendi insani ihtiyaçlarını tamamen unutmak.',
    higherSelfMessage: '03:33 ve 06:06 saatleri senin imzandır: "Senin varlığın ve sesin başlı başına bir şifa alanıdır; önce kendi kalp merkezini koru."'
  }
};

// ============================================================================
// 3. AURA KORUMA (AÇIK KAPI) KODLARI (1-9) - ETERİK KALKAN (YETZIRAH)
// ============================================================================
const AURA_PROTECTION_LIBRARY: Record<
  number,
  {
    chakraName: string;
    gateTitle: string;
    totem: string;
    geometry: string;
    leakageSymptom: string;
    dailyVulnerability: string;
    shieldingRitual: string;
    instantMessage: string;
  }
> = {
  1: {
    chakraName: '1. Kök Çakra (Muladhara) Kapısı',
    gateTitle: 'Topraklanma ve Öz-Varoluş Kalkanı',
    totem: 'Airavata (7 Hortumlu Kutsal Beyaz Fil - Muladhara Vahanası) & Kırmızı Akik',
    geometry: '4 Yapraklı Kırmızı Lotus & Sarı Toprak Karesi (Prithvi Yantra)',
    leakageSymptom: 'Doğum matrisinizde 1 (Kök/Merkez) alanı açık olduğunda enerji sızıntınız "ayaklarınızın yerden kesilmesi ve başlangıç ataleti" şeklinde çalışır.',
    dailyVulnerability: 'Kaotik ortamlarda veya baskın karakterlerin yanında kendi merkezinizden hızla uzaklaşabilir, fiziksel yorgunluk ve "Bu dünyaya ait değilim" hissi yaşayabilirsiniz.',
    shieldingRitual: 'Aura Mühürleme Pratiği: Sabahları çıplak ayakla toprağa/zemine basarak 3 derin nefes alın. Kuyruk sokumunuzdan dünyanın merkezine yakut kırmızısı bir ışık kökü indiğini imgeleyin ve kararlarınızı ertelemeden ilk 5 dakikada eyleme dökün.',
    instantMessage: '01:01 veya 111 gördüğünde: "Enerjin zihnine fazla çıktı, hemen bedenine ve toprağa dön!"'
  },
  2: {
    chakraName: '2. Sakral Çakra (Svadhisthana) Kapısı',
    gateTitle: 'Duygusal Sünger & Empatik Sınır Kalkanı',
    totem: 'Makara (Kutsal Su Ejderi - Svadhisthana Vahanası) & Aytaşı',
    geometry: '6 Yapraklı Turuncu Lotus & Gümüş Hilal Su Yantrası (Apas Yantra)',
    leakageSymptom: 'Doğum matrisinizde 2 (Alan Kapatan / Duygusal Sınır) kapısı açık olduğunda auranız ortamdaki diğer insanların duygularını, üzüntüsünü ve negatifliğini sünger gibi çeker.',
    dailyVulnerability: 'Birisiyle konuştuktan sonra sebepsiz yere enerjinizin çekildiğini, suçluluk duyduğunuzu veya "hayır" diyemediğiniz için alma-verme dengenizin bozulduğunu hissedersiniz.',
    shieldingRitual: 'Aura Mühürleme Pratiği: Göbek deliğinizin 3 parmak altında turuncu-altın bir ışık küresi imgeleyin. İnsanlarla konuşurken "Senin duygun sana, benim ışığım bana aittir" niyetini tekrarlayın ve suyla (duş/tuzlu su) auranızı sık sık nötrleyin.',
    instantMessage: '02:02 veya 222 gördüğünde: "Şu an hissettiğin ağırlık sana ait değil! Başkasının duygusunu kendi aurandan bırak."'
  },
  3: {
    chakraName: '3. Solar Pleksus (Manipura) Kapısı',
    gateTitle: 'Sınır, İrade ve Nazar/Manipülasyon Kalkanı',
    totem: 'Agni\'nin Kızıl Koçu (Manipura Vahanası), Güneş Kalkanı & Kaplan Gözü',
    geometry: '10 Yapraklı Altın Lotus & Ters Ateş Üçgeni (Tejas Yantra)',
    leakageSymptom: 'Doğum matrisinizde 3 (Solar Pleksus / İrade) alanı açık olduğunda en büyük enerji kaçağı "Mide/Karın merkezinden (Solar Pleksus)" gerçekleşir; nazar, kıskançlık ve duygusal manipülasyon doğrudan mide çakranıza vurur.',
    dailyVulnerability: 'Stres anında mide kasılması, başkalarının eleştirisinden aşırı etkilenme, kendi sınırını çizerken öfke patlaması ya da tam tersi içine atıp enerjisini düşürme.',
    shieldingRitual: 'Aura Mühürleme Pratiği: Kalabalık ortamlara girmeden veya zor bir görüşme öncesinde mide boşluğunuzun (diyafram) önünde altın sarısı dönen bir Güneş Kalkanı imgeleyin. Ellerinizi göbeğinizin üzerinde birleştirmekten kaçının; dik durup diyafram nefesi alın.',
    instantMessage: '03:03 veya 333 gördüğünde: "Karın merkezini (Solar Pleksus) kapat! Kimsenin senin özdeğerini tanımlamasına izin verme."'
  },
  4: {
    chakraName: '4. Kalp Çakrası (Anahata) Kapısı',
    gateTitle: 'Koşulsuz Sevgi & Kalp Zırhı Kalkanı',
    totem: 'Kutsal Ceylan / Antilop (Anahata Vahanası - Kalp Saflığı) & Zümrüt',
    geometry: '12 Yapraklı Yeşil Lotus & Altı Köşeli Hava Yıldızı (Şatkon / Vayu Yantra)',
    leakageSymptom: 'Doğum matrisinizde 4 (Kalp & Toprak Sınırı) alanı açık olduğunda enerji sızıntısı göğüs kafesinden gerçekleşir; ya aşırı verici olup tükenirsiniz ya da kırılmamak için kalbinize görünmez bir buz duvarı örersiniz.',
    dailyVulnerability: 'Sevdiklerinizin acısını kendi bedeninizde hissetmek, geçmiş kırgınlıkları göğüste ağırlık olarak taşımak veya maddi/manevi bereketi tutmakta zorlanmak.',
    shieldingRitual: 'Aura Mühürleme Pratiği: Göğüs kafesinizin ortasında zümrüt yeşili ve altın pembe iki iç içe geçmiş üçgen (Merkaba) imgeleyin. Affetmeyi karşı taraf için değil, göğsünüzdeki enerji kaçağını kapatmak için uygulayın.',
    instantMessage: '04:04 veya 444 gördüğünde: "Kalbindeki kapıyı sadece hak edene aç; şefkati koru ama enerjini tüketen bağı kes."'
  },
  5: {
    chakraName: '5. Boğaz Çakrası (Vishuddha) Kapısı',
    gateTitle: 'Hakikat Sözü & Akustik Frekans Kalkanı',
    totem: 'Kar Beyazı Kutsal Fil (Vishuddha Akasha Vahanası) & Mavi Safir',
    geometry: '16 Yapraklı Turkuaz Lotus & Dolunay İçinde Eter Üçgeni (Akasha Yantra)',
    leakageSymptom: 'Doğum matrisinizde 5 (İfade & Sinir Sistemi) alanı açık olduğunda enerji sızıntısı "yutkunulan sözler, anlatılamayan hakikatler ve boğaz düğümlenmesi" üzerinden yaşanır.',
    dailyVulnerability: 'Tartışma çıkmasın diye sustuğunuz her an auranızda yırtılma oluşur; boyun/omuz tutulmaları, ses kısılması veya yanlış anlaşılma döngüleri tetiklenir.',
    shieldingRitual: 'Aura Mühürleme Pratiği: Boğazınızda safir mavisi bir ışık halkası imgeleyin. İçinize attığınız hiçbir cümleyi bedeninizde tutmayın; kişiye söyleyemiyorsanız bile sesli olarak yalnızken ifade edin veya yazıya dökün.',
    instantMessage: '05:05 veya 555 gördüğünde: "Yutkunduğun gerçeği serbest bırak; kendi sesini bastırdığında auran zayıflıyor."'
  },
  6: {
    chakraName: '6. Üçüncü Göz (Ajna) Kapısı',
    gateTitle: 'Zihinsel Projeksiyon & Nazar Kalkanı',
    totem: 'Hamsa (İlahi Bilgelik Kuğusu - Ajna Sembolü), Horus\'un Gözü & Lapis Lazuli',
    geometry: '2 Kanatlı İndigo Lotus & Pranava (OM) Işık Mührü',
    leakageSymptom: 'Doğum matrisinizde 6 (Üçüncü Göz & Nazar Sınırı) alanı açık olduğunda, dışarıdan gelen negatif bakışlar (nazar), kolektif korkular ve zihinsel vesveseler alın çakranızdan içeri sızar.',
    dailyVulnerability: 'Gece uykuya dalarken durmayan düşünceler, baş ağrısı, gelecek kaygısı senaryoları kurmak ve kendi sezgisiyle korkusunu birbirine karıştırmak.',
    shieldingRitual: 'Aura Mühürleme Pratiği: İki kaşınızın ortasında çivit mavisi (indigo) bir ışık mührü imgeleyin. Yatmadan önce ekran ışığını kesin ve "Zihnimi kolektif korku frekanslarına kapatıyorum, sadece Üst Benliğimin net vizyonuna açığım" mührünü koyun.',
    instantMessage: '06:06 veya 666 gördüğünde: "Zihnindeki felaket senaryosu gerçeğin değil, açık kalan 6. çakrandan sızan bir illüzyon!"'
  },
  7: {
    chakraName: '7. Taç Çakra (Sahasrara) Kapısı',
    gateTitle: 'İlahi Bağlantı & Astral Koruma Kalkanı',
    totem: 'Kala-Hamsa (Zamanı Aşan Beyaz Kuğu) & Ametist Tacı',
    geometry: '1000 Yapraklı Mor-Altın Sahasrara Lotusu & Bindu (Mutlak Nokta)',
    leakageSymptom: 'Doğum matrisinizde 7 (Astral & Rüya Alanı) kapısı açık olduğunda, uyku ve rüya boyutu (astral alan) ile tepe çakranız dış tesirlere karşı hassaslaşır.',
    dailyVulnerability: 'Karmakarışık rüyalarla yorgun uyanmak, inanç/anlam krizleri yaşamak veya zihinsel olarak her şeyi kontrol etmeye çalışıp ilahi akışa güvenememek.',
    shieldingRitual: 'Aura Mühürleme Pratiği: Başınızın tam tepesinden (bıngıldak) aşağıya doğru mor ve altın beyazı bir ışık sütununun tüm bedeninizi yumurta biçiminde (Ouroboros kozası) sardığını imgeleyerek uykuya geçin.',
    instantMessage: '07:07 veya 777 gördüğünde: "Her şeyi zihninle çözemezsin; tepe çakranı ilahi korumaya aç ve kontrolü teslim et."'
  },
  8: {
    chakraName: '8. Aura / Kozmik Hükümranlık Kapısı',
    gateTitle: 'Manyetik Otorite & Bereket Kalkanı',
    totem: 'Ouroboros (Kuyruğunu Isıran Koruyucu Ejderha), Kum Saati & Obsidyen',
    geometry: 'Sekiz Köşeli Yıldız (Oktagram / Melkisedek Mührü) & Satürn Küpü',
    leakageSymptom: 'Doğum matrisinizde 8 (Otorite & Bereket Sınırı) alanı açık olduğunda enerji sızıntısı "hak ettiğiniz maddi/manevi değeri talep etmekte zorlanma veya kazancın elde durmaması" şeklinde görülür.',
    dailyVulnerability: 'Çok emek verip tam hasat zamanında geri çekilmek, otorite figürleri karşısında kendi gücünü küçültmek veya ani finansal dalgalanmalar.',
    shieldingRitual: 'Aura Mühürleme Pratiği: Tüm auranızın en dış çeperini (bedenden 50 cm dışarıyı) altın-mor bir sekizgen kalkanla mühürleyin. Emeğinizin karşılığını isterken suçluluk duymayı tamamen bırakın.',
    instantMessage: '08:08 veya 888 gördüğünde: "Kendi değerini küçültme! Bereket kapın açık, otoriteni sahiplen."'
  },
  9: {
    chakraName: '9. Evrensel Bilinç & Tamamlanma Kapısı',
    gateTitle: 'Karmik Bağ Kesme & Bütünlük Kalkanı',
    totem: 'Simurg / Zümrüdüanka (Küllerinden Doğan Kuş) & Kristal Kuvars',
    geometry: 'Dokuz Köşeli Işık Küresi (Enneagram) & Kether Tacı',
    leakageSymptom: 'Doğum matrisinizde 9 (Karmik Kordon & Bütünlük) alanı açık olduğunda, geçmişte kalması gereken insanlar, eski olaylar ve tamamlanmamış enerjiler auranıza kanca atarak yaşam enerjinizi çeker.',
    dailyVulnerability: 'Eski defterleri kapatamamak, "Keşke"lerle enerji kaybetmek ve başkalarının karmik sınavlarını kendi sırtında taşımaya devam etmek.',
    shieldingRitual: 'Aura Mühürleme Pratiği: Güneş batarken veya uyumadan önce, o gün temas ettiğiniz herkesle aranızdaki eterik kordonları altın bir ışık kılıcıyla sevgiyle kestiğinizi imgeleyin: "Benden sana geçen, senden bana geçen tüm ağır yükleri kaynağa iade ediyorum."',
    instantMessage: '09:09 veya 999 gördüğünde: "Süresi dolmuş bir enerjiyi hala auranda taşıyorsun; kordonu kes ve özgürleş!"'
  }
};


// ============================================================================
// 3B. İSİMDEKİ EKSİK ÇAKRA / KARMİK DERS (KARMIC LESSON: 1-9) KÜTÜPHANESİ
// (Pisagor sisteminde isimde harfi bulunmayan sayı: "Sıfırdan Geliştirilecek Yetenek")
// ============================================================================
const CHAKRA_LESSON_LIBRARY: Record<
  number,
  {
    chakraName: string;
    lessonTitle: string;
    missingLetters: string;
    totem: string;
    geometry: string;
    lessonMeaning: string;
    dailyManifestation: string;
    activationPractice: string;
    instantMessage: string;
  }
> = {
  1: {
    chakraName: '1. Kök Çakra (A, J, S, Ş Harfleri)',
    lessonTitle: 'Öz-İrade, İnisiyatif Alma ve Tek Başına Başlama Dersi',
    missingLetters: 'A, J, S, Ş',
    totem: 'Alef (Kutsal Boğa) & Altın Aslan',
    geometry: 'Monad — Merkez Noktalı Çember',
    lessonMeaning: 'İsminizde 1. Çakra (A, J, S, Ş) harflerinin bulunmaması, ruhunuzun bu hayatta "kimseden onay beklemeden kendi kararını verme ve liderlik etme" kasını sıfırdan geliştirmek üzere geldiğini gösterir.',
    dailyManifestation: 'Başkalarının fikirlerine fazla uyum sağlamak, bir işe başlarken yanınızda mutlaka bir destekçi aramak veya kendi hakkınızı savunurken tereddüt etmek.',
    activationPractice: 'Yetenek Aktivasyonu: Küçük veya büyük kararlarınızda başkasına sormadan ilk adımı kendiniz atın. Spor, yürüyüş ve somut hedef takibiyle 1. Çakra kasınızı güçlendirin.',
    instantMessage: '01:01 veya 111 gördüğünde: "Bu karar senin! Kimseden onay bekleme, kendi liderliğini ortaya koy."'
  },
  2: {
    chakraName: '2. Sakral Çakra (B, K, T Harfleri)',
    lessonTitle: 'Sabır, Diplomasi, İşbirliği ve Detay Ustalığı Dersi',
    missingLetters: 'B, K, T',
    totem: 'Bet (Kutsal Tapınak) & Gümüş Kuğu',
    geometry: 'Dyad — Vesica Piscis (İki Kesişen Çember)',
    lessonMeaning: 'İsminizde 2. Çakra (B, K, T) harflerinin bulunmaması, bu hayatta "sabırla dinlemeyi, ekip çalışmasını, nezaketi ve zamanlamaya güvenmeyi" bilinçli olarak öğrenmek üzere geldiğinizi gösterir.',
    dailyManifestation: 'İşlerin hemen olmasını istemek (sabırsızlık), her şeyi tek başına yapmaya çalışmak veya ilişkilerde karşı tarafın duygusal nüanslarını gözden kaçırmak.',
    activationPractice: 'Yetenek Aktivasyonu: İkili ilişkilerde ve ortaklıklarda karşı tarafı sözünü kesmeden dinleme pratiği yapın. Sanatsal üretim ve su elementiyle temas 2. Çakra yaratıcılığınızı açar.',
    instantMessage: '02:02 veya 222 gördüğünde: "Acele etme; bu işi güçle değil, sabır, nezaket ve işbirliğiyle çözeceksin."'
  },
  3: {
    chakraName: '3. Solar Pleksus Çakrası (C, Ç, L, U, Ü Harfleri)',
    lessonTitle: 'Yaratıcı İfade, Görünür Olma ve Özdeğer Dersi',
    missingLetters: 'C, Ç, L, U, Ü',
    totem: 'Gimel (Bereket Köprüsü) & Jüpiter Kraliyet Kartalı',
    geometry: 'Triad — Kutsal Eşkenar Üçgen (Delta)',
    lessonMeaning: 'İsminizde 3. Çakra (C, Ç, L, U, Ü) harflerinin bulunmaması, bu hayatta "sahneye çıkmayı, yeteneklerinizi görünür kılmayı, kendinizi neşeyle ifade etmeyi ve özgüveninizi inşa etmeyi" öğrenmeye geldiğinizi gösterir.',
    dailyManifestation: 'Çok bilgili ve yetenekli olduğunuz halde geri planda kalmayı seçmek, kendinizi acımasızca eleştirmek veya işlerinizi ertelemek.',
    activationPractice: 'Yetenek Aktivasyonu: Bilginizi ve üretiminizi saklamayın; yazın, konuşun, sunum yapın ve görünür olun. Kendinizi başkalarıyla kıyaslamayı bırakıp kendi neşenizi merkeze koyun.',
    instantMessage: '03:03 veya 333 gördüğünde: "Arka planda saklanma! Yeteneğini, sözünü ve neşeni cesurca ortaya koy."'
  },
  4: {
    chakraName: '4. Kalp & Düzen Çakrası (D, M, V Harfleri)',
    lessonTitle: 'Sistem Kurma, Disiplin, Sabır ve Somut İnşa Dersi',
    missingLetters: 'D, M, V',
    totem: 'Dalet (Tapınak Kapısı) & Dört Kerubim',
    geometry: 'Tetrad — Kutsal Küp (Heksahedron)',
    lessonMeaning: 'İsminizde 4. Çakra (D, M, V) harflerinin bulunmaması, bu hayatta "dağınık fikirleri somut bir düzene, takvime ve kalıcı bir sisteme dönüştürme" ustalığını geliştirmeye geldiğinizi gösterir.',
    dailyManifestation: 'Harika vizyonlar kurup detay ve rutin aşamasına gelince sıkılmak, finansal veya günlük planlamada düzensizlik yaşamak.',
    activationPractice: 'Yetenek Aktivasyonu: Her gün aynı saatte yapılan küçük ama sarsılmaz rutinler kurun. Başladığınız bir işi bitirmeden yenisine geçmeyin; yazılı plan ve bütçe tutun.',
    instantMessage: '04:04 veya 444 gördüğünde: "Vizyonunu havada bırakma; hemen somut bir plan, takvim ve düzen kur."'
  },
  5: {
    chakraName: '5. Boğaz Çakrası (E, N, W Harfleri)',
    lessonTitle: 'Esneklik, Yeniliğe Açıklık ve İletişim Cesareti Dersi',
    missingLetters: 'E, N, W',
    totem: 'He (İlahi Nefes) & Hermes Caduceus Asası',
    geometry: 'Pentad — Pentagram (Beş Köşeli Yıldız)',
    lessonMeaning: 'İsminizde 5. Çakra (E, N, W) harflerinin bulunmaması, bu hayatta "konfor alanından çıkmayı, değişimden korkmamayı ve farklı insanlarla özgürce iletişim kurmayı" öğrenmeye geldiğinizi gösterir.',
    dailyManifestation: 'Alışkanlıklara ve bildiği ortamlara aşırı tutunmak, ani değişiklikler karşısında gerilmek veya yeni ortamlarda kendini ifade etmekten çekinmek.',
    activationPractice: 'Yetenek Aktivasyonu: Rutininizi bilinçli olarak kırın; yeni yerler keşfedin, yeni teknolojiler/diller öğrenin ve düşüncelerinizi yüksek sesle ifade etme antrenmanı yapın.',
    instantMessage: '05:05 veya 555 gördüğünde: "Değişime direnme! Konfor alanından çık, bu yenilik seni büyütmek için geldi."'
  },
  6: {
    chakraName: '6. Üçüncü Göz & Uyum Çakrası (F, O, Ö, X Harfleri)',
    lessonTitle: 'Dengeli Sorumluluk, Aile/Topluluk Bağı ve Estetik Dersi',
    missingLetters: 'F, O, Ö, X',
    totem: 'Vav (Altın Kanca), Venüs Güvercini & Kuğu',
    geometry: 'Hexad — Hekzagram (Mühr-ü Süleyman)',
    lessonMeaning: 'İsminizde 6. Çakra (F, O, Ö, X) harflerinin bulunmaması, bu hayatta "yakın ilişkilerde açık duygusal bağ kurmayı, sorumluluk dengesini ve kusursuz olmayana şefkat göstermeyi" öğrenmeye geldiğinizi gösterir.',
    dailyManifestation: 'İlişkilerde ya aşırı mesafeli durmak ya da her yükü tek başına sırtlanmak; insanlardan gerçekçi olmayan bir mükemmeliyet beklemek.',
    activationPractice: 'Yetenek Aktivasyonu: Sevdiklerinize takdirinizi ve sevginizi açıkça dile getirin. Yaşam alanınızı güzelleştirin ve insanları olduğu gibi kabul etme bilgeliğini seçin.',
    instantMessage: '06:06 veya 666 gördüğünde: "Mükemmeliyetçiliği bırak; kalbini şefkate, uyuma ve güzelliğe aç."'
  },
  7: {
    chakraName: '7. Taç Çakra (G, Ğ, P, Y Harfleri)',
    lessonTitle: 'İçsel Tefekkür, Derin Uzmanlık ve Sezgiye Güven Dersi',
    missingLetters: 'G, Ğ, P, Y',
    totem: 'Zayin (Ruhsal Kılıç), Sfenks & Athena Baykuşu',
    geometry: 'Heptad — Heptagram (Yedi Köşeli Yıldız)',
    lessonMeaning: 'İsminizde 7. Çakra (G, Ğ, P, Y) harflerinin bulunmaması, bu hayatta "sadece dış dünyadaki maddi kanıtlara değil, kendi iç sesinize, rüyalarınıza ve derin araştırmaya güvenmeyi" öğrenmeye geldiğinizi gösterir.',
    dailyManifestation: 'Yüzeysel hız içinde derinleşmeye vakit ayırmamak, sezgilerini mantıkla bastırmak veya yalnız kalmaktan huzursuz olmak.',
    activationPractice: 'Yetenek Aktivasyonu: Her gün en az 20 dakika sessizlik ve tefekkür zamanı ayırın. Seçtiğiniz bir konuda yüzeyde kalmayıp en derin uzmanlığa inin.',
    instantMessage: '07:07 veya 777 gördüğünde: "Dışarıdaki gürültüyü kapat; biraz yalnız kal ve içindeki bilge sesi dinle."'
  },
  8: {
    chakraName: '8. Kozmik Güç & Finans Çakrası (H, Q, Z Harfleri)',
    lessonTitle: 'Finansal Yönetim, Öz-Otorite ve Maddi Hükümranlık Dersi',
    missingLetters: 'H, Q, Z',
    totem: 'Het (Yaşam Sınırı) & Ma\'at Adalet Terazisi',
    geometry: 'Ogdoad — Oktagram & Lemniskat (∞)',
    lessonMeaning: 'İsminizde 8. Çakra (H, Q, Z) harflerinin bulunmaması, bu hayatta "parayı, gücü, zamanı ve otoriteyi suçluluk duymadan, ustalıkla yönetmeyi" sıfırdan öğrenmeye geldiğinizi gösterir.',
    dailyManifestation: 'Maddi konuları göz ardı etmek, emeğinin gerçek finansal karşılığını istemekten çekinmek veya yetki devretmekte zorlanmak.',
    activationPractice: 'Yetenek Aktivasyonu: Finansal okuryazarlığınızı, yatırım ve yönetim becerinizi geliştirin. Emeğinizin değerini net belirleyin ve kendi otoritenizi sahiplenin.',
    instantMessage: '08:08 veya 888 gördüğünde: "Maddi gücünü ve otoriteni erteleme; emeğinin karşılığını tam olarak sahiplen."'
  },
  9: {
    chakraName: '9. Evrensel Bilinç Çakrası (I, İ, R Harfleri)',
    lessonTitle: 'Bütünü Görme, Şefkat ve Geçmişi Bırakabilme Dersi',
    missingLetters: 'I, İ, R',
    totem: 'Tet (Bilgelik) & Hermit\'in Altın Feneri',
    geometry: 'Ennead — Enneagram (Dokuz Köşeli Çember)',
    lessonMeaning: 'İsminizde 9. Çakra (I, İ, R) harflerinin bulunmaması, bu hayatta "geniş vizyonla insanlığa fayda üretmeyi, hoşgörüyü ve süresi dolmuş döngüleri sevgiyle uğurlamayı" öğrenmeye geldiğinizi gösterir.',
    dailyManifestation: 'Kendi yakın çevresinin dışındaki dünyaya kapanmak veya geçmişte yaşanmış kırgınlıkları uzun süre zihinde tutmak.',
    activationPractice: 'Yetenek Aktivasyonu: Yaptığınız işi sadece kişisel kazanç için değil, insanlara ilham ve şifa katacak büyük bir vizyonla yapın. Affetme ve bırakma pratiğini uygulayın.',
    instantMessage: '09:09 veya 999 gördüğünde: "Bakış açını büyüt; geçmişe takılma, bilginle ve şefkatinle bütüne katkı sun."'
  }
};

// ============================================================================
// 4. GEZEGEN YÖNETİCİSİ KÜTÜPHANESİ (GÜNEŞ..MARS) - BEDEN HARİTASI (ASSIAH)
// ============================================================================
const PLANETARY_RULER_LIBRARY: Record<
  number,
  {
    planet: string;
    kabbalahSphere: string;
    powerDay: string;
    element: string;
    metalAndStone: string;
    clockCodes: string[];
    totem: string;
    geometry: string;
    summary: string;
    bodyEffects: string;
    synchronicityGuide: string;
  }
> = {
  1: {
    planet: 'Güneş (Sol / Şems)',
    kabbalahSphere: 'Tiferet (Güzellik, Kalp ve Merkez Güneş)',
    powerDay: 'Pazar',
    element: 'Ateş',
    metalAndStone: 'Altın • Yakut & Güneş Taşı',
    clockCodes: ['01:01', '10:10', '11:11', '19:19'],
    totem: 'Altın Aslan, Horus Şahini & Apollon Defne Tacı',
    geometry: 'Güneş Mührü (☉) & Güneşin 6×6 Sihirli Karesi (Kamea Toplamı: 111 / 666)',
    summary: 'Beden haritanızın yöneticisi Güneş\'tir. Doğduğunuz gün itibarıyla fiziksel auranız "merkezde olma, yön verme ve etrafını aydınlatma" koduyla mühürlenmiştir.',
    bodyEffects: 'Kalp, omurga, yaşam enerjisi (prana) ve gözler Güneş yönetimindedir. Kendi kararlarınızı ertelediğinizde veya başkasının gölgesinde kaldığınızda fiziksel enerjiniz hızla düşer.',
    synchronicityGuide: 'Pazar günleri ve gün doğumundaki ilk Güneş saati sizin en güçlü tezahür zamanınızdır. Önemli imzalarınızı ve başlangıçlarınızı Güneş saatine denk getirin.'
  },
  2: {
    planet: 'Ay (Luna / Kamer)',
    kabbalahSphere: 'Yesod (Temel, Astral Ayna ve Bilinçaltı)',
    powerDay: 'Pazartesi',
    element: 'Su',
    metalAndStone: 'Gümüş • Aytaşı & İnci',
    clockCodes: ['02:02', '20:20', '22:22'],
    totem: 'Gümüş Hilal, Kuğu, Yengeç & İbis',
    geometry: 'Ay Mührü (☽) & Ayın 9×9 Sihirli Karesi (Kamea Toplamı: 369 / 3321)',
    summary: 'Beden haritanızın yöneticisi Ay\'dır. Fiziksel bedeniniz Ay fazlarına (Yeni Ay, Dolunay), mekan enerjilerine ve insanların gizli duygularına doğrudan ayarlı bir biyolojik anten gibidir.',
    bodyEffects: 'Mide, sıvı dengesi, lenf sistemi ve epifiz/uyku ritmi Ay yönetimindedir. Yeni Ay ve Dolunay geçişlerinde rüyalarınız habercidir.',
    synchronicityGuide: 'Pazartesi günleri ve Ay saatleri sezgisel çalışmalar, şifa, ailevi konular ve yaratıcı ilham için en güçlü zaman diliminizdir.'
  },
  3: {
    planet: 'Jüpiter (Müşteri / Tzedek)',
    kabbalahSphere: 'Hesed (İlahi Merhamet, Bolluk ve Genişleme)',
    powerDay: 'Perşembe',
    element: 'Ateş / Eter',
    metalAndStone: 'Kalay & Bronz • Safir & Ametist',
    clockCodes: ['03:03', '12:12', '21:21', '333'],
    totem: 'Kraliyet Kartalı, Yıldırım Asası & Beyaz At',
    geometry: 'Jüpiter Mührü (♃) & Jüpiter\'in 4×4 Sihirli Karesi (Kamea Toplamı: 34 / 136)',
    summary: 'Beden haritanızın yöneticisi bolluk, bilgelik ve ilahi koruma gezegeni Jüpiter\'dir. Girdiğiniz her işi, fikri ve ortamı büyütme (amplifikasyon) gücüne sahipsiniz.',
    bodyEffects: 'Karaciğer, büyüme hormonları ve neşe frekansı Jüpiter yönetimindedir. Vizyonunuz daraldığında veya umutsuzluğa düştüğünüzde bedeniniz ağırlaşır.',
    synchronicityGuide: 'Perşembe günleri ve Jüpiter saatleri finansal başvurular, eğitim, yayın ve bereket ritüelleri için sizin altın kapınızdır.'
  },
  4: {
    planet: 'Uranüs & Rahu (Kuzey Ay Düğümü / Kozmik Uyanış)',
    kabbalahSphere: 'Da\'at / Chokmah Yansıması (Sıradışı Zeka & Düzen Kırıcı)',
    powerDay: 'Cumartesi / Pazar Geçişi',
    element: 'Toprak / Elektrik Havası',
    metalAndStone: 'Uranyum / Platin • Labradorit & kehribar',
    clockCodes: ['04:04', '13:13', '14:41', '444'],
    totem: 'Caput Draconis (Göksel Ejderha Başı) & Prometheus Ateşi',
    geometry: 'Rahu Düğümü (☊), Dört Boyutlu Küp & Tetractys',
    summary: 'Beden haritanız hem somut düzeni (4) hem de kalıpları kıran ani sıçramaları (Uranüs) bir arada taşır. Herkesin imkansız dediği krizlerde en orijinal ve pratik çözümü bulan zihinsiniz.',
    bodyEffects: 'Sinir sistemi, elektriksel dürtüler, kemik yapısı ve ayak bilekleri yönetimindedir. Topraklanma (doğa teması) sizin için hayati önem taşır.',
    synchronicityGuide: 'Saatlerde 04:04 veya 13:13 gördüğünüz an zihninize düşen o sıradışı fikri hemen not alın; o sizin gelecekteki sıçrama anahtarınızdır.'
  },
  5: {
    planet: 'Merkür (Utarid / Kokab)',
    kabbalahSphere: 'Hod (Görkem, Akıl, Dil ve Hermetik Bilim)',
    powerDay: 'Çarşamba',
    element: 'Hava',
    metalAndStone: 'Cıva / Gümüş Alaşım • Zümrüt & Sitrin',
    clockCodes: ['05:05', '14:14', '15:15', '555'],
    totem: 'Hermes\'in Çift Yılanlı Caduceus Asası & Thoth İbis Kuşu',
    geometry: 'Merkür Mührü (☿) & Merkür\'ün 8×8 Sihirli Karesi (Kamea Toplamı: 260 / 2080)',
    summary: 'Beden haritanızın yöneticisi haberci, simyacı ve ticaret gezegeni Merkür\'dür. Hızlı düşünme, genç kalma, ikna gücü ve farklı dünyaları birbirine bağlama yeteneğiniz doğuştandır.',
    bodyEffects: 'Solunum yolları, ses telleri, eller, tiroid ve sinir ağları Merkür yönetimindedir. İletişiminiz kısıtlandığında nefesiniz daralır.',
    synchronicityGuide: 'Çarşamba günleri ve Merkür saatleri sözleşmeler, ticaret, yazılım, eğitim ve önemli konuşmalar için en yüksek frekanslı zamanınızdır.'
  },
  6: {
    planet: 'Venüs (Zühre / Nogah)',
    kabbalahSphere: 'Netzach (Zafer, Aşk, Sanat ve Doğa Ritmi)',
    powerDay: 'Cuma',
    element: 'Toprak / Su',
    metalAndStone: 'Bakır • Zümrüt, Turkuaz & Pembe Kuvars',
    clockCodes: ['06:06', '15:15', '16:16', '666'],
    totem: 'Afrodit Güvercini, Kuğu, Bakır Ayna & Gül',
    geometry: 'Venüs Mührü (♀), Beş Yapraklı Venüs Gülü & 7×7 Sihirli Karesi (Toplam: 175)',
    summary: 'Beden haritanızın yöneticisi sevgi, estetik, çekim yasası ve uyum gezegeni Venüs\'tür. Zorlamayla değil, kendi manyetik zarafetinizle insanları ve fırsatları kendinize çekersiniz.',
    bodyEffects: 'Boğaz, boyun, böbrekler ve hormonal denge Venüs yönetimindedir. Huzursuz ve çirkin ortamlarda fiziksel enerjiniz hızla düşer.',
    synchronicityGuide: 'Cuma günleri ve Venüs saatleri ilişkiler, barışma, sanatsal üretim, güzellik ve bereket çekimi için sizin kutsal zamanınızdır.'
  },
  7: {
    planet: 'Neptün & Ketu (Güney Ay Düğümü / Mistik Okyanus)',
    kabbalahSphere: 'Binah / Kether Köprüsü (Derin Sezgi & Sırlar)',
    powerDay: 'Pazartesi / Perşembe',
    element: 'Su / Eter',
    metalAndStone: 'Platin & Gümüş • Akuamarin, Ametist & Кedi Gözü',
    clockCodes: ['07:07', '16:16', '17:17', '777'],
    totem: 'Cauda Draconis (Ejderha Kuyruğu), Üç Dişli Trident & Yunus',
    geometry: 'Ketu Düğümü (☋) & Yedi Köşeli Mistik Yıldız (Heptagram)',
    summary: 'Beden haritanızın yöneticisi görünmeyen alemlerin, rüyaların ve derin bilgeliğin gezegeni Neptün\'dür. İnsanların maskelerinin arkasındaki gerçeği ilk bakışta okursunuz.',
    bodyEffects: 'Epifiz bezi (üçüncü göz), bağışıklık sistemi ve ауra hassasiyeti yönetimindedir. Kalabalıklardan sonra mutlaka yalnız kalıp dinlenmeniz gerekir.',
    synchronicityGuide: 'Su kenarları, gece sessizliği ve 07:07 / 17:17 anları rüya rehberliğinizin ve durugörünüzün en açık olduğu anlardır.'
  },
  8: {
    planet: 'Satürn (Zühal / Şabtay)',
    kabbalahSphere: 'Binah (Üstün Anlayış, Zamanın Efendisi ve Karmik Adalet)',
    powerDay: 'Cumartesi',
    element: 'Toprak',
    metalAndStone: 'Kurşun / Demir • Oniks, Obsidyen & Mavi Safir',
    clockCodes: ['08:08', '17:17', '18:18', '888'],
    totem: 'Zaman Kum Saati, Hasat Orağı, Kuzgun & Oğlak (Dağ Keçisi)',
    geometry: 'Satürn Mührü (♄), Kuzey Kutbu Altıgeni & 3×3 Lo Shu Sihirli Karesi (Toplam: 15)',
    summary: 'Beden haritanızın yöneticisi "Büyük Öğretmen ve Zamanın Efendisi" Satürn\'dür. Satürn kolay ve ucuz ödül vermez; önce sınar, olgunlaştırır, ardından kimsenin elinizden alamayacağı kalıcı bir imparatorluk, otorite ve servet verir.',
    bodyEffects: 'İskelet sistemi, dişler, dizler, eklemler ve deri Satürn yönetimindedir. Sorumlulukları ertelediğinizde veya fazla yük aldığınızda diz/sırt ağrılarıyla uyarı verir.',
    synchronicityGuide: 'Cumartesi günleri ve 08:08 / 888 kodları Satürn\'ün size mesajıdır: "Disiplinini bozma, adil ol, ektiğin tohumun hasat vakti geldi."'
  },
  9: {
    planet: 'Mars (Merih / Ma\'adim)',
    kabbalahSphere: 'Gevurah (İlahi Kudret, Cesaret ve Sınır Çizen Kılıç)',
    powerDay: 'Salı',
    element: 'Ateş',
    metalAndStone: 'Demir / Çelik • Yakut, Lal (Garnet) & Kırmızı Mercan',
    clockCodes: ['09:09', '18:18', '19:19', '999'],
    totem: 'Demir Kılıç ve Kalkan, Kızıl Koç & Savaşçı Kurt',
    geometry: 'Mars Mührü (♂) & Mars\'ın 5×5 Sihirli Karesi (Kamea Toplamı: 65 / 325)',
    summary: 'Beden haritanızın yöneticisi cesaret, yaşam gücü ve haksızlığa karşı duran savaşçı gezegen Mars\'tır (9 oktavında Ruhsal Savaşçı). Kriz anında herkes geri çekilirken öne çıkan koruyucu güçsünüz.',
    bodyEffects: 'Kan dolaşımı, kas sistemi, demir oranı, baş bölgesi ve adrenalin Mars yönetimindedir. Enerjinizi spor veya üretimle akıtmazsanız içsel hararete dönüşür.',
    synchronicityGuide: 'Salı günleri ve Mars saatleri cesaret gerektiren hamleler, engelleri aşmak ve karmik bağları kesmek için en güçlü zamanınızdır.'
  }
};

// ============================================================================
// 5. KALDE (BABİL) BİLEŞİK ARKETİPLERİ (10 - 52 ARASI ÖZEL MİSTİK KODLAR)
// ============================================================================
function getChaldeanCompoundArchetype(compoundNum: number): {
  title: string;
  symbolName: string;
  meaning: string;
  warningOrBlessing: string;
} {
  const n = compoundNum < 10 ? compoundNum + 9 : compoundNum > 52 ? reduceToSingle(compoundNum, false) + 18 : compoundNum;
  const table: Record<number, { title: string; symbolName: string; meaning: string; warningOrBlessing: string }> = {
    10: {
      title: '10/1 — Kader Çarkı & İlahi Yükseliş',
      symbolName: 'Sfenks ve Dönen Çark',
      meaning: 'İsim ve iradenin onurla yükselmesini, yüksek özgüveni ve zamanı geldiğinde şansın aniden lehinize dönmesini simgeler.',
      warningOrBlessing: 'Kutsal Bereket Kodu: Niyetinizi temiz tuttuğunuz sürece her düşüşten daha yüksek bir mertebeyle çıkarsınız.'
    },
    11: {
      title: '11/2 — Gizli Aslan & İkiz Sütun Sınavı',
      symbolName: 'Kenetlenmiş Yumruk & İlahi Rehber',
      meaning: 'Yüksek sezgi ve gizli güç verir; ancak kişinin iki seçenek veya iki yol arasında kalma sınavını temsil eder.',
      warningOrBlessing: 'Uyanış Kodu: Gizli gündemleri olan insanlara karşı sezgilerinizi dinleyin; ilk hissiniz her zaman doğrudur.'
    },
    12: {
      title: '12/3 — Kurban Edilen Bilgelikten Özgürleşen Ruh',
      symbolName: 'Asılan Adam (Ters Bakış Açısı)',
      meaning: 'Başkalarının planları veya aile yükleri için kendi projelerini erteleme eğilimini gösterir.',
      warningOrBlessing: 'Sınır Uyarısı: Başkalarının sorunlarını çözmek için kendi yaratıcı enerjinizi feda etmeyin.'
    },
    13: {
      title: '13/4 — Simyasal Dönüşüm & Küllerden Doğuş',
      symbolName: 'Kozmik Orak & Yeniden Doğuş',
      meaning: 'Güçlü bir değişim ve yeniden yapılanma kodudur. Eski yapıları yıkıp sıfırdan sarsılmaz bir düzen kurma gücü verir.',
      warningOrBlessing: 'Karmik Dönüşüm Kodu: Değişime direnmeyin; yıkılan her şey daha sağlamını kurmanız içindir.'
    },
    14: {
      title: '14/5 — Hareket, Akış & Manyetik Ticaret',
      symbolName: 'İki Kadeh Arasındaki Altın Akış',
      meaning: 'İnsanlar, medya, ticaret ve iletişim üzerinden gelen hızlı hareket ve şans enerjisidir.',
      warningOrBlessing: 'Karmik Denge Kodu: Spekülasyonlardan ve duygusal aşırılıklardan uzak durup merkezde kalın.'
    },
    15: {
      title: '15/6 — Simyacı Mıknatısı & Sanatsal Karizma',
      symbolName: 'Büyülü Asa & Müzik Liri',
      meaning: 'Olağanüstü bir konuşma yeteneği, kişisel çekim gücü, sanat, hitabet ve finansal mıknatıslanma verir.',
      warningOrBlessing: 'Yüksek Çekim Kodu: Bu güçlü aura mıknatısını sadece etik ve yüksek amaçlar için kullanın.'
    },
    16: {
      title: '16/7 — Yıkılan Kule & Hakikat Uyanışı',
      symbolName: 'Taçtan Düşen Yıldırım',
      meaning: 'Sahte egoyu ve yanlış güven alanlarını yıkarak kişiyi yüksek ruhsal bilgeliğe uyandıran sarsıcı koddur.',
      warningOrBlessing: 'Karmik Uyanış Kodu: Planlarınızı kibir üzerine değil, ruhsal tevazu ve sezgi üzerine kurun.'
    },
    17: {
      title: '17/8 — Ölümsüzlerin Yıldızı (Sekiz Köşeli Umut Yıldızı)',
      symbolName: 'Sekiz Köşeli Venüs-Sirius Yıldızı',
      meaning: 'Kalde numerolojisinin en kutsal sayılarından biridir. Kişinin tüm sınavları aşarak ismini ve eserini kalıcı kılacağını müjdeler.',
      warningOrBlessing: 'Yüksek Koruma Kodu: Ruhsal bağlantınızı koruduğunuz sürece hiçbir karanlık sizin ışığınızı söndüremez.'
    },
    18: {
      title: '18/9 — Madde ile Ruhun Savaşı & Kanlı Ay Sınavı',
      symbolName: 'Ay Işığındaki İki Kule',
      meaning: 'Maddi hırslar ile ruhsal değerler arasındaki keskin mücadeleyi ve yakın çevredeki gizli rekabeti simgeler.',
      warningOrBlessing: 'Ayırt Etme Kodu: Ortaklık ve sözleşmelerde duygusal illüzyonlara kapılmayın, her detayı yazılı hale getirin.'
    },
    19: {
      title: '19/1 — Gökyüzü Prensi & Zafer Güneşi',
      symbolName: 'Taç Giymiş Güneş',
      meaning: 'Karmik 19/1 sınavı (kendi ayakları üzerinde durma) tamamlandığında onur, mutluluk, başarı ve sarsılmaz liderlik getiren Güneş kodudur.',
      warningOrBlessing: 'Güneş Simyası Kodu: Kendi sorumluluğunuzu tam aldığınızda tüm kapılar önünüzde açılır.'
    },
    20: {
      title: '20/2 — Uyanış Borusu & Yeni Çağrı',
      symbolName: 'Sûr Üfleyen Melek (Uyanış)',
      meaning: 'Maddi hırslardan ziyade ruhsal bir misyon, yeni bir vizyon ve uyanış çağrısı için harekete geçmeyi temsil eder.',
      warningOrBlessing: 'İlahi Çağrı Kodu: Geciken işleriniz sabrın sonunda tek bir ilahi dokunuşla hızla çözülür.'
    },
    21: {
      title: '21/3 — Evrenin Tacı (Magi Tacı)',
      symbolName: 'Defne Çelengi İçindeki Kozmik Dansçı',
      meaning: 'Uzun mücadelelerden sonra gelen mutlak zaferi, terfiyi, onuru ve dört element üzerinde ustalığı simgeler.',
      warningOrBlessing: 'Kraliyet Zafer Kodu: Emekleriniz boşa gitmiyor; hayatınızın ikinci yarısı büyük bir taçlanmadır.'
    },
    22: {
      title: '22/4 — Üstat Mimar & İllüzyon Sınavı',
      symbolName: 'Uçurum Kenarındaki Bilge Mimar',
      meaning: 'Muazzam bir kurucu güç taşır; ancak hayal dünyasında kalıp somut adım atmamak en büyük sınavıdır.',
      warningOrBlessing: 'Master İnşa Kodu: Vizyonlarınızı mutlaka somut takvime ve projeye dökün.'
    },
    23: {
      title: '23/5 — Kraliyet Aslanı Yıldızı (Regulus Mührü)',
      symbolName: 'Kraliyet Aslanı',
      meaning: 'Kalde geleneğinin en uğurlu kodlarından biridir. Üst düzey insanlardan, otoritelerden gelen korumayı ve mesleki yükselişi gösterir.',
      warningOrBlessing: 'Kraliyet Koruması Kodu: İletişim ve strateji yeteneğiniz size en üst kapıları açar.'
    },
    24: {
      title: '24/6 — İlahi Bereket, Aşk ve Sanat Himayesi',
      symbolName: 'Bereket Boynuzu (Cornucopia)',
      meaning: 'Sevgi, sadık dostluklar, estetik ve karşı cinsten/ortaklıklardan gelen şanslı destekleri temsil eder.',
      warningOrBlessing: 'Bereket Kodu: Kalbinizi temiz ve cömert tuttuğunuzda maddi-manevi rızkınız kesintisiz akar.'
    },
    25: {
      title: '25/7 — Deneyimden Doğan Peygamberi Sezgi',
      symbolName: 'Kristal Küre ve Asa',
      meaning: 'Hayatın ilk yıllarında yaşanan zorlu gözlem ve tecrübelerin, olgunlukta kusursuz bir öngörü ve bilgeliğe dönüşmesidir.',
      warningOrBlessing: 'Bilgelik Kodu: Yaşadığınız hiçbir zorluk tesadüf değildi; hepsi bugünkü sezgisel ustalığınız içindi.'
    },
    26: {
      title: '26/8 — Satürn\'ün Ortaklık & Finans Sınavı',
      symbolName: 'Adalet Terazisi ve Kılıç',
      meaning: 'Başkalarının tavsiyesiyle yapılan yanlış yatırımlara veya hatalı ortaklıklara karşı dikkatli olmayı öğütleyen güçlü bir 8 kodudur.',
      warningOrBlessing: 'Stratejik İhtiyat Kodu: Finansal kararlarınızda başkasının gazına gelmeyin; kendi analizinize güvenin.'
    },
    27: {
      title: '27/9 — Hükümdar Asası & Özgün Otorite',
      symbolName: 'Taç ve Hükümdar Asası',
      meaning: 'Yaratıcı zeka, cesaret ve kendi fikirleriyle ürettiği işlerden elde edilen yüksek otoriteyi simgeler.',
      warningOrBlessing: 'Liderlik Kodu: Başkalarının fikirlerini kopyalamayın; kendi özgün vizyonunuz sizin altın madeninizdir.'
    },
    28: {
      title: '28/1 — Sözleşme ve Güven Sınavı (Bağımsız Lider)',
      symbolName: 'İki Yol Ağzındaki Taçlı Savaşçı',
      meaning: 'Büyük potansiyel ve liderlik yeteneği verir; ancak ortaklıklar, hukuki sözleşmeler ve başkalarına aşırı güvenme konusunda sınavlar içerir.',
      warningOrBlessing: 'Stratejik Uyarı: Tüm ticari ve resmi anlaşmalarınızı yazılı yapın; her zaman kendi B planınızı koruyun.'
    },
    29: {
      title: '29/11 — Yüksek İnisiyasyon & Ayna Sınavı',
      symbolName: 'Sisler İçindeki İkiz Kule ve Işık',
      meaning: '2+9=11 Üstat sayısını doğurur. Karşı cins, ortaklar veya yakın çevreden gelen sınavlar yoluyla kişiyi çok yüksek bir ruhsal sezgiye uyandırır.',
      warningOrBlessing: 'Uyanış Kodu: İnsanların sözlerine değil, frekanslarına ve eylemlerine bakın; sezgileriniz yanılmaz.'
    },
    30: {
      title: '30/3 — Zihinsel Üstünlük & Bilge Tefekkür',
      symbolName: 'Altın Küre Üzerindeki Düşünür',
      meaning: 'Maddi hırslardan ziyade entelektüel derinlik, felsefe, eğitim ve zihinsel ustalığı temsil eder.',
      warningOrBlessing: 'Derinlik Kodu: Bilgi birikiminizi kendinize saklamayın; yazıya ve eğitime dönüştürdüğünüzde bereket akar.'
    },
    31: {
      title: '31/4 — Özgün Deha & Kendi Dünyasının Mimarı',
      symbolName: 'Dağ Zirvesindeki Fener',
      meaning: 'Kalabalıkların içinde bile kendi özgün kurallarıyla yaşayan, kimseye benzemeyen ve sıfırdan sistem kuran deha frekansıdır.',
      warningOrBlessing: 'Topraklanma Kodu: Kendinizi dünyadan tamamen soyutlamayın; dehanızı somut projelerle insanlara sunun.'
    },
    32: {
      title: '32/5 — Kitleleri Etkileyen Sihirli Söz & İttifak',
      symbolName: 'Altın Asa ve Merkür Kanatları',
      meaning: '23/5 Kraliyet Aslanı ile aynı oktavdadır; farklı uluslar, kitleler ve iletişim ağları üzerinde büyülü bir etki gücü verir.',
      warningOrBlessing: 'Kraliyet İletişim Kodu: Kendi görüşünüze sadık kaldığınız sürece kitleler sizi takip eder.'
    },
    33: {
      title: '33/6 — İlahi Bereket, Şifa ve Koruma Tacı',
      symbolName: 'Altı Köşeli Altın Yıldız ve Bereket Boynuzu',
      meaning: '24/6 ile aynı Venüs-Jüpiter oktavındadır; üstat seviyesinde şifa, sevgi, estetik ve ilahi koruma altına alınmış rızkı simgeler.',
      warningOrBlessing: 'Üstat Bereket Kodu: Kalbinizi şefkatte tuttuğunuz sürece maddi ve manevi bolluk size kendiliğinden akar.'
    },
    34: {
      title: '34/7 — Deneyimden Doğan Sarsılmaz Bilgelik',
      symbolName: 'Yedi Kollu Altın Şamdan (Menorah)',
      meaning: '25/7 ile aynı oktavdadır; hayatın ilk yarısındaki disiplinli gözlemlerin olgunlukta kusursuz bir sezgi ve otoriteye dönüşmesini anlatır.',
      warningOrBlessing: 'Bilgelik Kodu: Sabrınız ve içsel disiplininiz size en zor kapıları açacak anahtardır.'
    },
    35: {
      title: '35/8 — Satürn Finansal & Ortaklık Sınavı',
      symbolName: 'Kılıç ve Adalet Terazisi',
      meaning: '26/8 ile aynı oktavdadır; başkalarının aklıyla yapılan yatırımlara ve ortaklıklara karşı uyanık olmayı, kendi finansal otoritenizi kurmayı emreder.',
      warningOrBlessing: 'Finansal Öz-Yönetim Kodu: Kendi paranızı ve projenizi bizzat kendiniz yönetin.'
    },
    36: {
      title: '36/9 — Özgün Liderlik & Zirveye Tırmanış',
      symbolName: 'Ateşten Taç ve Hükümdar Asası',
      meaning: '27/9 ile aynı oktavdadır; kendi emeği, zekası ve özgün fikirleriyle en üst makamlara yükselmeyi ve kalıcı eser bırakmayı simgeler.',
      warningOrBlessing: 'Zafer Kodu: Ortaklıktan ziyade kendi özgün imzanızı taşıyan işlerde en büyük başarıyı yakalarsınız.'
    },
    37: {
      title: '37/1 — Kraliyet Dostluğu & Manyetik Çekim Yıldızı',
      symbolName: 'Güneş ve Venüs Kutsal Kavuşumu',
      meaning: 'Kalde numerolojisinin en şanslı kodlarından biridir; aşkta, dostlukta ve toplum önünde güçlü, sadık ve yükseltici bağlantılar verir.',
      warningOrBlessing: 'Manyetik Şans Kodu: Samimiyetiniz ve sıcak karizmanız size her ortamda üst düzey destekler açar.'
    },
    38: {
      title: '38/11 — Sezgisel Uyanık Olma & Sözleşme Kalkanı',
      symbolName: 'Ayna ve Kalkan',
      meaning: '3+8=11 Üstat sezgisini taşır; yüksek empati ve vizyon verirken gizli rekabete karşı sınırların korunması gerektiğini hatırlatır.',
      warningOrBlessing: 'Koruma Kodu: Sırlarınızı ve projelerinizi tamamlanmadan önce herkesle paylaşmayın.'
    },
    39: {
      title: '39/3 — Yaratıcı Zeka & Entelektüel Zafer',
      symbolName: 'Defne Tacı ve Altın Kalem',
      meaning: 'Üstün ifade gücü, stratejik planlama ve zihinsel üretim yoluyla kazanılan saygınlığı temsil eder.',
      warningOrBlessing: 'Üretim Kodu: Fikirlerinizi ertelemeden somut esere dönüştürün.'
    },
    40: {
      title: '40/4 — Bilimsel Odak & Sistem Kurucu Deha',
      symbolName: 'Pergel ve Gönye',
      meaning: 'Keskin analitik zeka, metodolojik çalışma ve kendine özgü bir sistem inşa etme kudretidir.',
      warningOrBlessing: 'Sistem Kodu: Düzen ve disiplininiz sizi alanında tek otorite yapar.'
    },
    41: {
      title: '41/5 — Manyetik Liderlik & Sınırları Aşan Vizyon',
      symbolName: 'Kanatlı Güneş Kursu',
      meaning: '32/5 ve 23/5 ile aynı oktavdadır; dinamik iletişim, karizma ve uluslararası/geniş çaplı projelerde başarıyı müjdeler.',
      warningOrBlessing: 'Genişleme Kodu: Vizyonunuzu yerel sınırlarla kısıtlamayın, büyük düşünün.'
    },
    42: {
      title: '42/6 — Venüs Bereketi, Sanat ve Sadık İttifaklar',
      symbolName: 'Altın Kadeh ve Zümrüt Taç',
      meaning: '24/6 ve 33/6 ile aynı kutsal Venüs oktavındadır; sevgi, uyum, toplumsal kabul ve emeklerin bereketli hasadını temsil eder.',
      warningOrBlessing: 'Kutsal Bereket Kodu: Güzellik, adalet ve uyum ürettiğiniz her alanda desteklenirsiniz.'
    },
    43: {
      title: '43/7 — Devrimci Dönüşüm & Yeniden Yapılanma',
      symbolName: 'Anka Kuşu ve Şimşek',
      meaning: '4+3=7; eskiyen kalıpları cesurca yıkıp yerine daha yüksek bir bilgelik düzeni kurma sınavını ve gücünü taşır.',
      warningOrBlessing: 'Dönüşüm Kodu: Kriz anlarında soğukkanlılığınızı koruyun; her değişim sizi özgürleştirir.'
    },
    44: {
      title: '44/8 — Üstat Stratejist & Karmik Adalet Terazisi',
      symbolName: 'Çift Piramit (Oktahedron)',
      meaning: 'Muazzam bir maddi organizasyon ve güç kapasitesi verir; gücün yalnızca mutlak adalet ve etikle kullanılmasını şart koşar.',
      warningOrBlessing: 'Master Finans Kodu: Uzun vadeli ve etik yatırımlarınız kalıcı servete dönüşür.'
    },
    45: {
      title: '45/9 — Entelektüel Zafer & Onurlu Hasat',
      symbolName: 'Zafer Sancağı ve Bilgelik Kitabı',
      meaning: '27/9 ve 36/9 ile aynı oktavdadır; yaşam deneyimi ve zihinsel üretimle gelen saygınlığı ve tamamlanmayı simgeler.',
      warningOrBlessing: 'Bilgelik Hasadı Kodu: Kendi doğrularınızdan taviz vermeden yürüdüğünüz yol taçlanır.'
    },
    46: {
      title: '46/1 — Taçlanan Girişim & Yeniden Doğuş (4+6=10/1)',
      symbolName: 'Doğan Güneş ve Altın Anahtar',
      meaning: '10/1 Kader Çarkı ile aynı oktavdadır; disiplinli yapı (4) ile sevgi/uyumun (6) birleşerek kişiyi zirveye (1) taşımasını anlatır.',
      warningOrBlessing: 'Yükseliş Kodu: Sabırla kurduğunuz düzen size bağımsızlık ve liderlik getirir.'
    },
    47: {
      title: '47/11 — İçsel Ustalık & Peygamberi Sezgi (4+7=11/2)',
      symbolName: 'Tapınak Sütunları Arasındaki Işık',
      meaning: 'Somut gerçekçilik (4) ile mistik bilgeliğin (7) birleşerek 11 Üstat Kanal frekansını açtığı çok özel bir koddur.',
      warningOrBlessing: 'Master Sezgi Kodu: Hem ayakları yere basan hem de ruhsal alemi okuyan nadir ustalardansınız.'
    },
    48: {
      title: '48/3 — İlahi Adalet & Kararlı Yaratım (4+8=12/3)',
      symbolName: 'Altın Terazi ve Üçgen',
      meaning: 'Sistem kurma gücü (4) ile otoritenin (8) birleşimidir; başkalarının yükünü sırtlanmadan kendi vizyonuna odaklanmayı öğretir.',
      warningOrBlessing: 'Odak Kodu: Enerjinizi başkalarını kurtarmaya değil, kendi eserinizi büyütmeye harcayın.'
    },
    49: {
      title: '49/4 — Karmik Emeğin Altın Hasadı (4+9=13/4)',
      symbolName: 'Altın Başak ve Saban',
      meaning: '13/4 dönüşüm enerjisini içinde taşır; yoğun çalışma, sabır ve dönüşüm sonrasında gelen sarsılmaz ustalığı simgeler.',
      warningOrBlessing: 'Ustalık Kodu: Vazgeçmediğiniz her alanda kalıcı bir kale inşa edersiniz.'
    },
    50: {
      title: '50/5 — Bilgelik ve İletişim Özgürlüğü',
      symbolName: 'Açık Gökyüzünde Uçan Kartal',
      meaning: 'Zihinsel özgürlük, seyahat, eğitim ve geniş kitlelere rehberlik etme enerjisidir.',
      warningOrBlessing: 'Özgürlük Kodu: Bilginizi paylaştıkça tüm kapılar önünüzde açılır.'
    },
    51: {
      title: '51/6 — Savaşçı Komutan & Ani Yükseliş',
      symbolName: 'Parlayan Kılıç ve Yıldız',
      meaning: 'Cesaret (5) ve liderliğin (1) birleşerek Venüs (6) zaferini doğurduğu, terfi ve liderlik getiren güçlü bir Kalde kodudur.',
      warningOrBlessing: 'Komutan Kodu: Cesur adımlarınız size yüksek statü kazandırır.'
    },
    52: {
      title: '52/7 — Döngülerin Efendisi & Sezgisel Bilge (52 Hafta Mührü)',
      symbolName: 'Zaman Çarkı ve Yedi Yıldız',
      meaning: 'Yılın 52 haftasını ve zaman döngüleri üzerindeki tam içsel bilgeliği temsil eder.',
      warningOrBlessing: 'Zaman Ustalığı Kodu: Doğru zamanı sezme yeteneğiniz en büyük hazinenizdir.'
    }
  };

  if (table[n]) return table[n];
  const single = reduceToSingle(compoundNum, false);
  const fallbackMap: Record<number, number> = { 1: 19, 2: 20, 3: 21, 4: 13, 5: 23, 6: 24, 7: 25, 8: 17, 9: 27 };
  return table[fallbackMap[single] || 19];
}

// ============================================================================
// 6. KÖPRÜ KODU (RUH - BEDEN SENKRONİZASYON KÖPRÜSÜ: 0 - 8)
// ============================================================================
const BRIDGE_CODE_LIBRARY: Record<
  number,
  {
    title: string;
    summary: string;
    conflictDescription: string;
    synchronizationKey: string;
  }
> = {
  0: {
    title: '0 — Tam Rezonans (Ruh ve Beden Aynı Frekansta)',
    summary: 'Yaşam Yolu (Beden Haritası) ile İsim Kader (Ruh Haritası) kodunuz birebir aynı frekanstadır!',
    conflictDescription: 'İçinizdeki ruhsal kimlik ile hayatın sizi yürüttüğü fiziksel yol arasında hiçbir çelişki yoktur; saf ve konsantre bir odak taşırsınız.',
    synchronizationKey: 'Tek dikkat etmeniz gereken şey, bu tekil frekansın aşırı uçlarına kaçmamak ve diğer çakralarla dengeyi korumaktır.'
  },
  1: {
    title: '1 — Özgünlük ve Cesaret Köprüsü',
    summary: 'Ruh Haritanız ile Beden Haritanızı birbirine bağlayan köprü "1 (Liderlik ve Öz-Güven)" frekansıdır.',
    conflictDescription: 'Ruhunuzun istediği şey ile hayat şartlarınız arasında sıkıştığınızda çekingenlik veya kararsızlık yaşayabilirsiniz.',
    synchronizationKey: 'İki haritanızı birleştirmek için kimseden onay beklemeden kendi inisiyatifinizi almalı ve "Benim yolum bu" deme cesaretini göstermelisiniz.'
  },
  2: {
    title: '2 — Diplomasi, Sabır ve Kalp Dinleme Köprüsü',
    summary: 'Ruh Haritanız ile Beden Haritanızı birbirine bağlayan köprü "2 (Uyum, Sezgi ve İşbirliği)" frekansıdır.',
    conflictDescription: 'Bazen ruhunuz çok hızlı koşmak isterken bedeniniz beklemek zorunda kalır (veya tam tersi).',
    synchronizationKey: 'İki haritayı senkronize etmenin sırrı zorlamak değil; zamanlamaya güvenmek, empati kurmak ve doğru yol arkadaşlarıyla ilerlemektir.'
  },
  3: {
    title: '3 — İfade, Neşe ve Görünürlük Köprüsü',
    summary: 'Ruh Haritanız ile Beden Haritanızı birbirine bağlayan köprü "3 (Yaratıcı İfade ve Neşe)" frekansıdır.',
    conflictDescription: 'İçinizde çok derin bir potansiyel olduğu halde bunu dış dünyaya aktarırken fazla ciddi veya tutuk kalabilirsiniz.',
    synchronizationKey: 'Ruhunuzla bedeninizi birleştirmek için konuşmalı, yazmalı, sahneye çıkmalı ve hayatı fazla ciddiye almadan neşeyle üretmelisiniz.'
  },
  4: {
    title: '4 — Disiplin, Sistem ve Topraklanma Köprüsü',
    summary: 'Ruh Haritanız ile Beden Haritanızı birbirine bağlayan köprü "4 (Somut Plan ve Emek)" frekansıdır.',
    conflictDescription: 'Ruhunuz yüksek vizyonlarda uçarken fiziksel hayatın faturaları, detayları ve disiplini size sıkıcı gelebilir.',
    synchronizationKey: 'Ruhsal vizyonunuzun dünyada tezahür etmesi için günlük rutininizi, takviminizi ve finansal düzeninizi sağlam bir sisteme oturtmalısınız.'
  },
  5: {
    title: '5 — Esneklik, Cesur Deneyim ve Değişim Köprüsü',
    summary: 'Ruh Haritanız ile Beden Haritanızı birbirine bağlayan köprü "5 (Özgürlük ve Yenilik)" frekansıdır.',
    conflictDescription: 'Alışkanlıklarınıza ve güvenli alanınıza fazla tutunduğunuzda ruhunuz ile bedeniniz arasındaki akış tıkanır.',
    synchronizationKey: 'Konfor alanınızdan çıkıp yeni insanlara, yeni teknolojilere ve seyahatlere açıldığınız anda iki haritanız kilitlenir.'
  },
  6: {
    title: '6 — Sorumluluk, Sevgi ve Hizmet Köprüsü',
    summary: 'Ruh Haritanız ile Beden Haritanızı birbirine bağlayan köprü "6 (Kalp Merkezli Sorumluluk ve Estetik)" frekansıdır.',
    conflictDescription: 'Bireysel hedefleriniz ile aile/topluluk sorumluluklarınız arasında bölünmüş hissedebilirsiniz.',
    synchronizationKey: 'Yaptığınız her işe sevgi, estetik ve insanlara fayda bilinci kattığınızda içsel çatışmanız tamamen sona erer.'
  },
  7: {
    title: '7 — İçsel Tefekkür, Uzmanlık ve Bilgelik Köprüsü',
    summary: 'Ruh Haritanız ile Beden Haritanızı birbirine bağlayan köprü "7 (Derin Araştırma ve Ruhsal Sessizlik)" frekansıdır.',
    conflictDescription: 'Dış dünyanın hızı ve gürültüsü içinde ruhunuzun sesini duymakta zorlanabilirsiniz.',
    synchronizationKey: 'Her gün kendinize ayıracağınız 30 dakikalık sessizlik, meditasyon ve bir alanda derin uzmanlaşma iki haritanızı birleştirir.'
  },
  8: {
    title: '8 — Güç, Finansal Ustalık ve Adalet Köprüsü',
    summary: 'Ruh Haritanız ile Beden Haritanızı birbirine bağlayan köprü "8 (Maddi-Ruhsal Denge ve Otorite)" frekansıdır.',
    conflictDescription: 'Ruhsal değerleriniz ile maddi dünya/para arasında "Ya ruhsal olmalıyım ya maddi" ikilemi yaşayabilirsiniz.',
    synchronizationKey: 'Paranın ve gücün de kutsal bir enerji olduğunu kabul edip kendi otoritenizi sahiplendiğinizde iki haritanız tam kapasite çalışır.'
  }
};

// ============================================================================
// ANA HESAPLAMA MOTORU: analyzePersonalSymbolCodes
// ============================================================================
export function analyzePersonalSymbolCodes(fullNameInput: string, birthDateInput: string, birthTimeInput?: string): SymbolCodeAnalysisResult {
  const cleanName = (fullNameInput || 'Misafir Ruh').trim();
  const upperName = cleanName.toLocaleUpperCase('tr-TR');
  const letters = upperName.split('').filter((ch) => LETTER_VALUES[ch] !== undefined);

  // Tarih ayrıştırma (YYYY-MM-DD veya DD.MM.YYYY)
  let year = 1990;
  let month = 1;
  let day = 1;
  if (birthDateInput) {
    if (birthDateInput.includes('-')) {
      const parts = birthDateInput.split('-');
      year = parseInt(parts[0], 10) || 1990;
      month = parseInt(parts[1], 10) || 1;
      day = parseInt(parts[2], 10) || 1;
    } else if (birthDateInput.includes('.')) {
      const parts = birthDateInput.split('.');
      day = parseInt(parts[0], 10) || 1;
      month = parseInt(parts[1], 10) || 1;
      year = parseInt(parts[2], 10) || 1990;
    }
  }

  // 1. İsim hesaplamaları (Ruh Haritası - Briah)
  const chakraCounts = [0, 0, 0, 0, 0, 0, 0, 0, 0];
  let rawDestinySum = 0;
  let rawSoulUrgeSum = 0;
  let rawPersonalitySum = 0;
  let rawChaldeanSum = 0;

  for (const ch of letters) {
    const val = LETTER_VALUES[ch] || 0;
    if (val >= 1 && val <= 9) {
      chakraCounts[val - 1] += 1;
    }
    rawDestinySum += val;
    if (VOWELS.has(ch)) {
      rawSoulUrgeSum += val;
    } else {
      rawPersonalitySum += val;
    }
    rawChaldeanSum += CHALDEAN_LETTER_VALUES[ch] || 0;
  }

  // Kelime bazlı (Ad + Soyad ayrı ayrı indirgenerek) ara toplamlar
  const nameWords = upperName
    .split(/\s+/)
    .map((w) => w.split('').filter((ch) => LETTER_VALUES[ch] !== undefined))
    .filter((w) => w.length > 0);

  let wordReducedDestinySum = 0;
  let wordReducedSoulSum = 0;
  let wordReducedPersonaSum = 0;

  for (const wordChars of nameWords) {
    const wDest = wordChars.reduce((acc, ch) => acc + (LETTER_VALUES[ch] || 0), 0);
    const wSoul = wordChars.filter((ch) => VOWELS.has(ch)).reduce((acc, ch) => acc + (LETTER_VALUES[ch] || 0), 0);
    const wPers = wordChars.filter((ch) => !VOWELS.has(ch)).reduce((acc, ch) => acc + (LETTER_VALUES[ch] || 0), 0);
    wordReducedDestinySum += reduceToSingle(wDest, true);
    wordReducedSoulSum += reduceToSingle(wSoul, true);
    wordReducedPersonaSum += reduceToSingle(wPers, true);
  }

  const destinyCode = reduceToSingle(rawDestinySum, true);
  const soulUrgeCode = reduceToSingle(rawSoulUrgeSum, true);
  const soulUrgeSingle = reduceToSingle(rawSoulUrgeSum, false);
  const personalityCode = reduceToSingle(rawPersonalitySum, false);

  // En baskın çakra (Gizli Tutku Kodu)
  let dominantChakra = 1;
  let maxCount = -1;
  chakraCounts.forEach((cnt, idx) => {
    if (cnt > maxCount) {
      maxCount = cnt;
      dominantChakra = idx + 1;
    }
  });

  // Eksik çakralar ve Aura Koruma Kodu
  const missingChakras: number[] = [];
  let minChakra = 1;
  let minCount = 999;
  chakraCounts.forEach((cnt, idx) => {
    if (cnt === 0) missingChakras.push(idx + 1);
    if (cnt < minCount) {
      minCount = cnt;
      minChakra = idx + 1;
    }
  });
  const auraProtectionCode = missingChakras.length > 0 ? missingChakras[0] : minChakra;
  const subconsciousSelfCode = Math.max(1, 9 - missingChakras.length);

  // 2. Doğum Tarihi hesaplamaları (Beden Haritası - Assiah & Pisagor Doğum Matrisi)
  const birthDaySingle = reduceToSingle(day, false);
  const birthMonthSingle = reduceToSingle(month, false);
  const birthYearSingle = reduceToSingle(year, false);
  const rawLifePathSum = sumDigits(day) + sumDigits(month) + sumDigits(year);
  const threeCycleLifePathSum = reduceToSingle(day, true) + reduceToSingle(month, true) + reduceToSingle(year, true);
  const lifePathCode = reduceToSingle(rawLifePathSum, true);
  const lifePathSingle = reduceToSingle(rawLifePathSum, false);

  // Pisagor Doğum Tarihi Matrisi (GG.AA.YYYY içindeki 1-9 rakam dağılımı)
  const birthDigitsStr = `${day}${month}${year}`.replace(/0/g, '');
  const birthDigitCounts = [0, 0, 0, 0, 0, 0, 0, 0, 0];
  for (const dCh of birthDigitsStr) {
    const dVal = parseInt(dCh, 10);
    if (dVal >= 1 && dVal <= 9) {
      birthDigitCounts[dVal - 1] += 1;
    }
  }
  const missingBirthDigits: number[] = [];
  birthDigitCounts.forEach((cnt, idx) => {
    if (cnt === 0) missingBirthDigits.push(idx + 1);
  });
  // Beden Alan (Sınır & Koruma) Kodu: Doğum tarihi matrisindeki ilk eksik rakam (yoksa Gün+Ay indirgemesi)
  const birthMatrixFieldCode =
    missingBirthDigits.length > 0 ? missingBirthDigits[0] : reduceToSingle(day + month, false);

  // 3. Gerçek Pisagor Karmik Borç ve Doğum Matrisi Kilit Taraması (13/4, 14/5, 16/7, 19/1)
  const detectedKarmicDebts: { code: string; source: string }[] = [];
  const birthDateKarmicDebts: { code: string; source: string }[] = [];

  const addKarmicIfFound = (code: string | null, source: string, isFromBirthDate = false) => {
    if (code) {
      if (!detectedKarmicDebts.some((d) => d.code === code)) {
        detectedKarmicDebts.push({ code, source });
      }
      if (isFromBirthDate && !birthDateKarmicDebts.some((d) => d.code === code)) {
        birthDateKarmicDebts.push({ code, source });
      }
    }
  };

  // A) Doğum Günü (13, 14, 16, 19)
  if (day === 13 || day === 14 || day === 16 || day === 19) {
    addKarmicIfFound(checkKarmicFromSum(day), `Doğum Günü (${day})`, true);
  }

  // B) Yaşam Yolu (Rakam Toplamı, Master Korumalı 3 Döngü Toplamı ve Tek Haneli 3 Sütun Toplamı)
  const pureThreeCycleLifePathSum = reduceToSingle(day, false) + reduceToSingle(month, false) + reduceToSingle(year, false);
  addKarmicIfFound(checkKarmicFromSum(rawLifePathSum), `Yaşam Yolu Rakam Toplamı (${rawLifePathSum})`, true);
  addKarmicIfFound(checkKarmicFromSum(threeCycleLifePathSum), `Yaşam Yolu G+A+Y Toplamı (${threeCycleLifePathSum})`, true);
  addKarmicIfFound(checkKarmicFromSum(pureThreeCycleLifePathSum), `Yaşam Yolu 3 Sütun Toplamı (${pureThreeCycleLifePathSum})`, true);

  // C) Doğum Tarihi Matrisi Çift Kilit Eksenleri (1-9 → 19/1, 1-6 → 16/7, 1-4 → 14/5, 1-3 → 13/4)
  if (birthDigitCounts[0] >= 2 && birthDigitCounts[8] >= 2) {
    addKarmicIfFound('19/1', `Doğum Tarihi Matrisi 1–9 Baskın Güç Kilidi (${birthDigitCounts[0]} adet 1 ve ${birthDigitCounts[8]} adet 9)`, true);
  }
  if (birthDigitCounts[0] >= 2 && birthDigitCounts[5] >= 2) {
    addKarmicIfFound('16/7', `Doğum Tarihi Matrisi 1–6 Baskın Hakikat Kilidi (${birthDigitCounts[0]} adet 1 ve ${birthDigitCounts[5]} adet 6)`, true);
  }
  if (birthDigitCounts[0] >= 2 && birthDigitCounts[3] >= 2) {
    addKarmicIfFound('14/5', `Doğum Tarihi Matrisi 1–4 Baskın Denge Kilidi (${birthDigitCounts[0]} adet 1 ve ${birthDigitCounts[3]} adet 4)`, true);
  }
  if (birthDigitCounts[0] >= 2 && birthDigitCounts[2] >= 2) {
    addKarmicIfFound('13/4', `Doğum Tarihi Matrisi 1–3 Baskın İnşa Kilidi (${birthDigitCounts[0]} adet 1 ve ${birthDigitCounts[2]} adet 3)`, true);
  }

  // D) Ruh Güdüsü (Sesli Harf Ham Toplamı veya Kelime İndirgeme Toplamı)
  addKarmicIfFound(checkKarmicFromSum(rawSoulUrgeSum), `Ruh Güdüsü Sesli Harf Toplamı (${rawSoulUrgeSum})`, false);
  if (nameWords.length > 1) {
    addKarmicIfFound(checkKarmicFromSum(wordReducedSoulSum), `Ruh Güdüsü Kelime Toplamı (${wordReducedSoulSum})`, false);
  }

  // E) İsim Kader (Tüm Harf Ham Toplamı veya Kelime İndirgeme Toplamı)
  addKarmicIfFound(checkKarmicFromSum(rawDestinySum), `İsim Kader Harf Toplamı (${rawDestinySum})`, false);
  if (nameWords.length > 1) {
    addKarmicIfFound(checkKarmicFromSum(wordReducedDestinySum), `İsim Kader Kelime Toplamı (${wordReducedDestinySum})`, false);
  }

  // F) Dışsal Persona (Sessiz Harf Ham Toplamı veya Kelime İndirgeme Toplamı)
  addKarmicIfFound(checkKarmicFromSum(rawPersonalitySum), `Dışsal Persona Sessiz Harf Toplamı (${rawPersonalitySum})`, false);
  if (nameWords.length > 1) {
    addKarmicIfFound(checkKarmicFromSum(wordReducedPersonaSum), `Dışsal Persona Kelime Toplamı (${wordReducedPersonaSum})`, false);
  }

  // G) Opsiyonel Doğum Saati (İlk Nefes Enkarnasyon Kapısı: SS:DD)
  let parsedHour: number | null = null;
  let parsedMinute: number | null = null;
  let cleanBirthTime: string | undefined = undefined;
  let rawTimeDigitsSum = 0;
  let portalCode = 0;
  let portalSingle = 0;
  let chaldeanHourInfo: ReturnType<typeof calculateChaldeanBirthHourInfo> | null = null;

  if (birthTimeInput && birthTimeInput.trim().includes(':')) {
    const tParts = birthTimeInput.trim().split(':');
    const h = parseInt(tParts[0], 10);
    const m = parseInt(tParts[1], 10);
    if (!isNaN(h) && !isNaN(m) && h >= 0 && h <= 23 && m >= 0 && m <= 59) {
      parsedHour = h;
      parsedMinute = m;
      cleanBirthTime = `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`;
      rawTimeDigitsSum = sumDigits(h) + sumDigits(m);
      portalCode = reduceToSingle(rawTimeDigitsSum, true);
      portalSingle = reduceToSingle(rawTimeDigitsSum, false);
      chaldeanHourInfo = calculateChaldeanBirthHourInfo(year, month, day, h, m);

      addKarmicIfFound(checkKarmicFromSum(rawTimeDigitsSum), `İlk Nefes Doğum Saati (${cleanBirthTime} → ${rawTimeDigitsSum})`, false);
      addKarmicIfFound(checkKarmicFromSum(h + m), `Doğum Saati S+D Toplamı (${h + m})`, false);
    }
  }

  const birthKarmicKey = birthDateKarmicDebts.length > 0 ? birthDateKarmicDebts[0].code : 'YOK';
  const birthKarmicEntry = KARMIC_DEBT_LIBRARY[birthKarmicKey] || KARMIC_DEBT_LIBRARY.YOK;
  const birthEmbeddedRuhDigit =
    birthKarmicKey !== 'YOK'
      ? parseInt(birthKarmicKey.split('/')[1], 10) || birthDaySingle
      : birthDaySingle;

  const primaryKarmicKey = detectedKarmicDebts.length > 0 ? detectedKarmicDebts[0].code : 'YOK';
  const karmicEntry = KARMIC_DEBT_LIBRARY[primaryKarmicKey] || KARMIC_DEBT_LIBRARY.YOK;

  // 4. Sentez Kodları (Olgunluk, Köprü, Orijinal Kalde 1-8 Bileşik Arketipi)
  const maturityRaw = lifePathSingle + reduceToSingle(destinyCode, false);
  const maturityCode = reduceToSingle(maturityRaw, true);
  const maturitySingle = reduceToSingle(maturityRaw, false);

  const bridgeCode = Math.abs(lifePathSingle - reduceToSingle(destinyCode, false));
  const bridgeEntry = BRIDGE_CODE_LIBRARY[bridgeCode] || BRIDGE_CODE_LIBRARY[1];

  // Orijinal Kalde (Babil) 1-8 tablosuna göre iki basamaklı bileşik sayı (10-52 aralığına indirgenir)
  let chaldeanCompoundNum = rawChaldeanSum >= 10 ? rawChaldeanSum : day >= 10 ? day : rawLifePathSum;
  while (chaldeanCompoundNum > 52) {
    chaldeanCompoundNum = sumDigits(chaldeanCompoundNum);
  }
  if (chaldeanCompoundNum < 10) {
    chaldeanCompoundNum = rawLifePathSum >= 10 ? rawLifePathSum : chaldeanCompoundNum + 9;
  }
  const chaldeanEntry = getChaldeanCompoundArchetype(chaldeanCompoundNum);

  const soulEntry = SOUL_URGE_LIBRARY[soulUrgeCode] || SOUL_URGE_LIBRARY[soulUrgeSingle] || SOUL_URGE_LIBRARY[1];
  const personaEntry = SOUL_URGE_LIBRARY[personalityCode] || SOUL_URGE_LIBRARY[1];
  const dominantEntry = SOUL_URGE_LIBRARY[dominantChakra] || SOUL_URGE_LIBRARY[1];
  const auraEntry = AURA_PROTECTION_LIBRARY[auraProtectionCode] || AURA_PROTECTION_LIBRARY[1];
  const chakraLessonEntry = CHAKRA_LESSON_LIBRARY[auraProtectionCode] || CHAKRA_LESSON_LIBRARY[1];
  const planetEntry = PLANETARY_RULER_LIBRARY[birthDaySingle] || PLANETARY_RULER_LIBRARY[1];
  const lifePathPlanetEntry = PLANETARY_RULER_LIBRARY[lifePathSingle] || PLANETARY_RULER_LIBRARY[1];
  const maturityEntry = SOUL_URGE_LIBRARY[maturityCode] || SOUL_URGE_LIBRARY[maturitySingle] || SOUL_URGE_LIBRARY[1];

  const codes: PersonalSymbolCodeItem[] = [
    // 1. KARMİK BORÇ KODU (3. Harita - Karmik Simya)
    {
      id: 'karmic-debt',
      isCoreSynchronicityCode: true,
      title: 'Karmik Borç & Simya Kodu',
      shortTitle: 'KARMİK BORÇ KODU',
      codeValue: primaryKarmicKey === 'YOK' ? 'Muaf' : primaryKarmicKey,
      subLabel:
        detectedKarmicDebts.length > 0
          ? `Kaynak: ${detectedKarmicDebts.map((d) => `${d.code} (${d.source})`).join(' • ')}`
          : 'Karmik Muafiyet Kontratı',
      layer: 'alchemy',
      layerBadge: '3. Bölüm • Karmik Simya & Üst Benlik',
      color: '#EF4444',
      archetypeTitle: karmicEntry.archetypeTitle,
      summary: karmicEntry.summary,
      calculationFormula:
        detectedKarmicDebts.length > 0
          ? `Haritanızda ${detectedKarmicDebts.map((d) => `${d.source} üzerinden ${d.code}`).join(', ')} karmik dönüşüm mührü tespit edildi.`
          : 'Doğum tarihiniz ve isminizin ara toplamlarında 13, 14, 16 veya 19 karmik borç dizilimi bulunmamaktadır.',
      higherSelfTrigger: {
        clockCodes: karmicEntry.clockCodes,
        totemSymbol: karmicEntry.totemSymbol,
        geometricSymbol: karmicEntry.geometricSymbol,
        instantMessage: karmicEntry.instantMessage
      },
      sections: karmicEntry.sections
    },

    // 2. RUH GÜDÜSÜ / KİŞİLİK ÖZÜ KODU (1. Harita - Ruh Haritası)
    {
      id: 'soul-urge',
      title: 'İçsel Ruh Arzusu (Sesli Harf) Kodu',
      shortTitle: 'İÇSEL RUH ARZUSU',
      codeValue: `${rawSoulUrgeSum}/${soulUrgeCode}`,
      subLabel: 'Sesli Harf Rezonansı (İçsel Öz)',
      layer: 'soul',
      layerBadge: '2. Bölüm • İsimden Gelen Ruh Kodu',
      color: '#D4AF37',
      archetypeTitle: soulEntry.title,
      summary: soulEntry.summary,
      calculationFormula: `İsminizdeki sesli harflerin (A, E, I, İ, O, Ö, U, Ü) Pisagor toplamı ${rawSoulUrgeSum} → ${soulUrgeCode} frekansını verir. Sesli harfler hiçbir engele çarpmadan doğrudan göğüs ve gırtlaktan akan "Ruh Nefesi"dir.`,
      higherSelfTrigger: {
        clockCodes: getClockCodesForNumber(soulUrgeCode, soulUrgeSingle).list,
        totemSymbol: soulEntry.totem,
        geometricSymbol: soulEntry.geometry,
        instantMessage: soulEntry.higherSelfMessage
      },
      sections: [
        {
          heading: '1. Ruhunuz Gerçekte Neye Aç? (Briah Katmanı)',
          content: `${soulEntry.summary} ${soulEntry.soulHunger}`
        },
        {
          heading: '2. Ruh Güdüsünün Gölge Tuzağı',
          content: `Ruhunuzun bu temel ihtiyacı karşılanmadığında veya baskılandığında şu gölge tepki ortaya çıkar: ${soulEntry.shadowTrap}`
        },
        {
          heading: '3. Üst Benlik Uyanış Mesajı',
          content: soulEntry.higherSelfMessage
        }
      ]
    },

    // 3. İSİMDEKİ EKSİK ÇAKRA / KARMİK DERS KODU (2. Bölüm - İsimden Gelen Gelişim Alanı)
    {
      id: 'aura-protection',
      title: 'Eksik Çakra (Geliştirilecek Yetenek) Kodu',
      shortTitle: 'EKSİK ÇAKRA DERSİ',
      codeValue: `${auraProtectionCode}`,
      subLabel: `Geliştirilecek: ${chakraLessonEntry.chakraName}`,
      layer: 'soul',
      layerBadge: '2. Bölüm • İsimden Gelen Çakra Dersi',
      color: '#F59E0B',
      archetypeTitle: `${auraProtectionCode}. Çakra Dersi — ${chakraLessonEntry.lessonTitle}`,
      summary: chakraLessonEntry.lessonMeaning,
      calculationFormula:
        missingChakras.length > 0
          ? `İsminizdeki harfler 9 çakraya yerleştirildiğinde [${missingChakras.join(', ')}. Çakra] harfleri (${chakraLessonEntry.missingLetters}) bulunmamaktadır. İlk eksik basamak olan ${auraProtectionCode}. Çakra, bu hayatta bilinçli olarak geliştireceğiniz yetenek merkezidir.`
          : `İsminizde 9 çakranın tamamında harf mevcuttur (Tam Matris); en az yoğunluklu merkez olan ${auraProtectionCode}. Çakra gelişim alanınızdır.`,
      higherSelfTrigger: {
        clockCodes: [`0${auraProtectionCode}:0${auraProtectionCode}`, `${auraProtectionCode}${auraProtectionCode}${auraProtectionCode}`],
        totemSymbol: chakraLessonEntry.totem,
        geometricSymbol: chakraLessonEntry.geometry,
        instantMessage: chakraLessonEntry.instantMessage
      },
      sections: [
        {
          heading: '1. Bu Hayatta Sıfırdan Geliştireceğiniz Yetenek (Karmik Ders)',
          content: chakraLessonEntry.lessonMeaning
        },
        {
          heading: '2. Günlük Hayatta Dikkat Edilmesi Gereken Yansıması',
          content: chakraLessonEntry.dailyManifestation
        },
        {
          heading: '3. Çakra Yetenek Aktivasyonu & Uygulama Anahtarı',
          content: chakraLessonEntry.activationPractice
        }
      ]
    },

    // 4A. BEDEN RUH & KARMİK KİLİT KODU (1. Bölüm - Doğum Tarihinden Gelen Kod)
    {
      id: 'body-karmic-soul',
      isCoreSynchronicityCode: true,
      title: 'Beden Ruh & Karmik Kilit Kodu',
      shortTitle: 'RUH & KARMİK KODU',
      codeValue: birthKarmicKey === 'YOK' ? `${birthDaySingle} (Muaf)` : `${birthEmbeddedRuhDigit} (${birthKarmicKey})`,
      subLabel:
        birthDateKarmicDebts.length > 0
          ? `Ruh Kodu: ${birthEmbeddedRuhDigit} • Gömülü Kilit: ${birthKarmicKey}`
          : `Beden Öz Kodu: ${birthDaySingle} • Karmik Kilit Yok`,
      layer: 'body',
      layerBadge: '1. Bölüm • Doğum Tarihinden Gelen Karmik Öz',
      color: '#EF4444',
      archetypeTitle:
        birthKarmicKey !== 'YOK'
          ? `Ruh Kodu ${birthEmbeddedRuhDigit} (İçine Gömülü Karmik Kod: ${birthKarmicKey}) — ${birthKarmicEntry.archetypeTitle}`
          : `Beden Öz Kodu ${birthDaySingle} — ${birthKarmicEntry.archetypeTitle}`,
      summary:
        birthKarmicKey !== 'YOK'
          ? `Doğum tarihinizde (${birthDateKarmicDebts.map((d) => d.source).join(' • ')}) üzerinden Beden Ruh Kodunuz "${birthEmbeddedRuhDigit}" ve bu kodun içine gömülü olan "${birthKarmicKey}" Karmik Kilidi bulunmaktadır. ${birthKarmicEntry.summary}`
          : birthKarmicEntry.summary,
      calculationFormula:
        birthDateKarmicDebts.length > 0
          ? `Doğum tarihinizde ${birthDateKarmicDebts.map((d) => `${d.source} → ${d.code}`).join(', ')} kilidi tespit edilmiştir.`
          : 'Doğum tarihinizin gün, yaşam yolu ve matris eksenlerinde 13/4, 14/5, 16/7 veya 19/1 karmik kilidi bulunmamaktadır.',
      higherSelfTrigger: {
        clockCodes: birthKarmicEntry.clockCodes,
        totemSymbol: birthKarmicEntry.totemSymbol,
        geometricSymbol: birthKarmicEntry.geometricSymbol,
        instantMessage: birthKarmicEntry.instantMessage
      },
      sections: birthKarmicEntry.sections
    },

    // 4. DOĞUM KODU (2. Harita - Beden Haritası)
    {
      id: 'birth-code',
      isCoreSynchronicityCode: true,
      title: 'Doğum Günü Yetenek Kodu',
      shortTitle: 'DOĞUM GÜNÜ KODU',
      codeValue: day > 9 ? `${day}/${birthDaySingle}` : `${birthDaySingle}`,
      subLabel: `Ayın ${day}. Günü Enkarnasyon Mührü`,
      layer: 'body',
      layerBadge: '1. Bölüm • Doğum Tarihinden Gelen Kod',
      color: '#38BDF8',
      archetypeTitle: `${birthDaySingle} Frekansı — ${planetEntry.planet} Beden Mührü`,
      summary: `Ruhunuz dünyaya ayın ${day}. gününde inerek fiziksel bedenine ve sinir sistemine "${birthDaySingle}" kodunun doğal yeteneğini mühürlemiştir.`,
      calculationFormula: `Doğduğunuz gün (${day}) sadeleştirildiğinde Beden Haritanızın kök frekansı olan ${birthDaySingle} sayısını verir.`,
      higherSelfTrigger: {
        clockCodes: planetEntry.clockCodes,
        totemSymbol: planetEntry.totem,
        geometricSymbol: planetEntry.geometry,
        instantMessage: `Saatlerde veya tarihlerde ${day} ya da 0${birthDaySingle}:0${birthDaySingle} gördüğünde Üst Benliğin diyor ki: "Bedenindeki doğal yeteneği hatırla; bu işi çözecek fiziksel donanım sende zaten var!"`
      },
      sections: [
        {
          heading: '1. Beden Haritasındaki (Assiah) Doğal Yeteneğiniz',
          content: `${planetEntry.summary} Doğum gününüz (${day}), ruhsal potansiyelinizi maddi dünyada hangi araçla somutlaştıracağınızı gösterir.`
        },
        {
          heading: '2. Fiziksel Beden ve Biyolojik Rezonans',
          content: planetEntry.bodyEffects
        },
        {
          heading: '3. Günlük Zamanlama ve Güç Günü',
          content: planetEntry.synchronicityGuide
        }
      ]
    },

    // 5. YAŞAM YOLU / ENKARNASYON ROTASI KODU (2. Harita - Beden Haritası)
    {
      id: 'life-path',
      title: 'Yaşam Yolu (Enkarnasyon Rotası) Kodu',
      shortTitle: 'YAŞAM YOLU KODU',
      codeValue: `${rawLifePathSum}/${lifePathCode}`,
      subLabel: `Yol Yöneticisi: ${lifePathPlanetEntry.planet.split(' ')[0]}`,
      layer: 'body',
      layerBadge: '1. Bölüm • Doğum Tarihinden Gelen Kod',
      color: '#0EA5E9',
      archetypeTitle: `${rawLifePathSum}/${lifePathCode} — ${ (SOUL_URGE_LIBRARY[lifePathCode] || SOUL_URGE_LIBRARY[lifePathSingle] || SOUL_URGE_LIBRARY[1]).title }`,
      summary: `Doğum tarihinizin tüm basamaklarının toplamından (${rawLifePathSum} → ${lifePathCode}) doğan bu kod, fiziksel dünyada yürüyeceğiniz ana enkarnasyon otobanını ve hayat derslerinizi gösterir.`,
      calculationFormula: `Doğum tarihinizdeki rakamların toplamı (${day}.${month}.${year}) = ${rawLifePathSum} → ${lifePathCode} (3 Sütun Toplamı: ${pureThreeCycleLifePathSum}/${reduceToSingle(pureThreeCycleLifePathSum, true)}).`,
      higherSelfTrigger: {
        clockCodes: getClockCodesForNumber(lifePathCode, lifePathSingle).list,
        totemSymbol: lifePathPlanetEntry.totem,
        geometricSymbol: lifePathPlanetEntry.geometry,
        instantMessage: `Saatlerde ${getClockCodesForNumber(lifePathCode, lifePathSingle).display} gördüğünde Üst Benliğin diyor ki: "Şu an ana yaşam yolu rotandasın (${lifePathCode}); şüpheye düşmeden ilerle!"`
      },
      sections: [
        {
          heading: '1. Fiziksel Enkarnasyon Otobanınız (Assiah)',
          content: `Doğum Günü Kodunuz (${day}/${birthDaySingle}) sizin aracınız ve yeteneğinizdir; Yaşam Yolu Kodunuz (${rawLifePathSum}/${lifePathCode}) ise o aracı sürdüğünüz ana otoyoldur. ${lifePathPlanetEntry.summary}`
        },
        {
          heading: '2. Yaşam Yolu Gezegen Rezonansı',
          content: `Kader yolu yöneticiniz ${lifePathPlanetEntry.planet} (${lifePathPlanetEntry.kabbalahSphere}) frekansındadır. ${lifePathPlanetEntry.synchronicityGuide}`
        }
      ]
    },

    // 6. GEZEGEN YÖNETİCİSİ KODU (2. Harita - Beden & Kozmik Saat)
    {
      id: 'planet-ruler',
      isCoreSynchronicityCode: true,
      title: 'Kozmik Gezegen Yöneticisi',
      shortTitle: 'GEZEGEN YÖNETİCİSİ',
      codeValue: planetEntry.planet.split(' ')[0],
      subLabel: `Güç Günü: ${planetEntry.powerDay} • ${planetEntry.element}`,
      layer: 'body',
      layerBadge: '1. Bölüm • Doğum Tarihinden Gelen Kod',
      color: '#A855F7',
      archetypeTitle: `${planetEntry.planet} — ${planetEntry.kabbalahSphere}`,
      summary: `Kişisel zaman döngünüzü, otorite sınavlarınızı ve eşzamanlılık saatlerinizi yöneten baş gezegen ${planetEntry.planet}'dir.`,
      calculationFormula: `Doğum Kodu (${birthDaySingle}) ve Yaşam Yolu (${lifePathSingle}) senteziyle birincil beden yöneticiniz ${planetEntry.planet}, ikincil yol yöneticiniz ${lifePathPlanetEntry.planet} olarak çalışır.`,
      higherSelfTrigger: {
        clockCodes: planetEntry.clockCodes,
        totemSymbol: planetEntry.totem,
        geometricSymbol: planetEntry.geometry,
        instantMessage: `${planetEntry.powerDay} günleri ve ${planetEntry.planet.split(' ')[0]} saatleri senin kozmik kapındır; niyetlerini bu saatlerde mühürle.`
      },
      sections: [
        {
          heading: '1. Kabalistik Sefira ve Gezegen Arketipi',
          content: `Yönetici gezegeniniz ${planetEntry.planet}, Hayat Ağacı'nda "${planetEntry.kabbalahSphere}" küresiyle rezonanstadır. ${planetEntry.summary}`
        },
        {
          heading: '2. Uyumlu Metal, Doğal Taş ve Element Frekansı',
          content: `Elementiniz: ${planetEntry.element} • Güç Gününüz: ${planetEntry.powerDay} • Auranızı güçlendiren metal ve taşlar: ${planetEntry.metalAndStone}.`
        },
        {
          heading: '3. Gezegen Saatleri Senkronizasyonu',
          content: planetEntry.synchronicityGuide
        }
      ]
    },

    // 6B. BEDEN ALAN (DOĞUM MATRİSİ SINIR & KORUMA) KODU (1. Bölüm - Doğum Tarihinden Gelen Kod)
    {
      id: 'body-field-code',
      isCoreSynchronicityCode: true,
      title: 'Alan Koruma ("Alan Kapatan" Sınır) Kodu',
      shortTitle: 'ALAN KORUMA KODU',
      codeValue: `${birthMatrixFieldCode}`,
      subLabel: `Doğum Matrisi Açık Alanı (Alan Kapatan: ${birthMatrixFieldCode})`,
      layer: 'body',
      layerBadge: '1. Bölüm • Doğum Tarihinden Gelen Alan Kodu',
      color: '#FACC15',
      archetypeTitle: `Beden Alan Kodu ${birthMatrixFieldCode} — ${(AURA_PROTECTION_LIBRARY[birthMatrixFieldCode] || AURA_PROTECTION_LIBRARY[2]).gateTitle}`,
      summary: `Doğum tarihinizdeki (${String(day).padStart(2, '0')}.${String(month).padStart(2, '0')}.${year}) rakamlar 1–9 Pisagor Beden Matrisine yerleştirildiğinde ilk açık kalan sınır kapısı "${birthMatrixFieldCode}" frekansıdır ("Alan Kapatan" koruma şifreniz).`,
      calculationFormula:
        missingBirthDigits.length > 0
          ? `Doğum tarihinizde bulunan rakamlar: [${Array.from(new Set(birthDigitsStr.split(''))).sort().join(', ')}]. 1'den 9'a kadar Pisagor karesinde bulunmayan (açık kalan) rakamlar: [${missingBirthDigits.join(', ')}]. İlk açık basamak olan ${birthMatrixFieldCode}, Beden Haritanızın Alan (Sınır ve Koruma) Kodudur.`
          : `Doğum tarihinizde 1-9 arası tüm rakamlar bulunduğu için Gün+Ay (${day}+${month}) sınır toplamınız olan ${birthMatrixFieldCode} Beden Alan Kodunuzdur.`,
      higherSelfTrigger: {
        clockCodes: [`0${birthMatrixFieldCode}:0${birthMatrixFieldCode}`, `${birthMatrixFieldCode}${birthMatrixFieldCode}:${birthMatrixFieldCode}${birthMatrixFieldCode}`, `${birthMatrixFieldCode}${birthMatrixFieldCode}${birthMatrixFieldCode}`],
        totemSymbol: (AURA_PROTECTION_LIBRARY[birthMatrixFieldCode] || AURA_PROTECTION_LIBRARY[2]).totem,
        geometricSymbol: (AURA_PROTECTION_LIBRARY[birthMatrixFieldCode] || AURA_PROTECTION_LIBRARY[2]).geometry,
        instantMessage: (AURA_PROTECTION_LIBRARY[birthMatrixFieldCode] || AURA_PROTECTION_LIBRARY[2]).instantMessage
      },
      sections: [
        {
          heading: '1. Beden Alan Kodu ("Alan Kapatan") Nedir?',
          content: `Doğum tarihinizden gelen Beden Alan Kodu (${birthMatrixFieldCode}), fiziksel ve eterik bedeninizin dış dünyaya karşı en hassas sınır kapısını gösterir. ${(AURA_PROTECTION_LIBRARY[birthMatrixFieldCode] || AURA_PROTECTION_LIBRARY[2]).leakageSymptom}`
        },
        {
          heading: '2. Günlük Hayatta Enerji Sızıntısı Belirtileri',
          content: (AURA_PROTECTION_LIBRARY[birthMatrixFieldCode] || AURA_PROTECTION_LIBRARY[2]).dailyVulnerability
        },
        {
          heading: '3. Alan Kapatma ve Sınır Mühürleme Pratiği',
          content: (AURA_PROTECTION_LIBRARY[birthMatrixFieldCode] || AURA_PROTECTION_LIBRARY[2]).shieldingRitual
        }
      ]
    },

    // 6. RUH - BEDEN KÖPRÜ KODU (3. Harita - Senkronizasyon)
    {
      id: 'bridge-code',
      title: 'Ruh–Beden Köprü Kodu',
      shortTitle: 'KÖPRÜ KODU',
      codeValue: `${bridgeCode}`,
      subLabel: 'İsim (Ruh) ile Doğum (Beden) Köprüsü',
      layer: 'alchemy',
      layerBadge: '3. Bölüm • İsim + Doğum Sentez Kodu',
      color: '#10B981',
      archetypeTitle: bridgeEntry.title,
      summary: bridgeEntry.summary,
      calculationFormula: `| Yaşam Yolu Kodu (${lifePathSingle}) - İsim Kader Kodu (${reduceToSingle(destinyCode, false)}) | = ${bridgeCode}. Bu fark, Ruh Haritanız ile Beden Haritanızı birbirine kilitleyen anahtardır.`,
      higherSelfTrigger: {
        clockCodes: [`0${bridgeCode || 9}:0${bridgeCode || 9}`, `${bridgeCode || 9}${bridgeCode || 9}${bridgeCode || 9}`],
        totemSymbol: bridgeCode === 0 ? 'Ouroboros (Tam Birlik Halkası) & Ankh Anahtarı' : `${(SOUL_URGE_LIBRARY[bridgeCode] || SOUL_URGE_LIBRARY[1]).totem} (Köprü Muhafızı)`,
        geometricSymbol: bridgeCode === 0 ? 'Tam Simetrik Birlik Çemberi (Monad-Dyad Uyumu)' : (SOUL_URGE_LIBRARY[bridgeCode] || SOUL_URGE_LIBRARY[1]).geometry,
        instantMessage: `İçinde "Ne istediğimi biliyorum ama hayat beni başka yere çekiyor" çatışması hissettiğinde ${bridgeCode} frekansını devreye sok!`
      },
      sections: [
        {
          heading: '1. Ruh Haritası ile Beden Haritası Arasındaki Mesafe',
          content: bridgeEntry.conflictDescription
        },
        {
          heading: '2. İki Haritayı Birleştiren Simyasal Anahtar',
          content: bridgeEntry.synchronizationKey
        }
      ]
    },

    // 7. OLGUNLUK / SİMYASAL HASAT KODU (3. Harita - 35+ Yaş Üstatlık)
    {
      id: 'maturity-code',
      title: 'Olgunluk & Simyasal Hasat Kodu',
      shortTitle: 'OLGUNLUK KODU',
      codeValue: `${maturityCode}`,
      subLabel: '35+ Yaş Üstatlık & Miras Frekansı',
      layer: 'alchemy',
      layerBadge: '3. Bölüm • İsim + Doğum Sentez Kodu',
      color: '#EC4899',
      archetypeTitle: `Hasat Arketipi: ${maturityEntry.title}`,
      summary: `Ruh Haritanız (İsim: ${destinyCode}) ile Beden Haritanızın (Yaşam Yolu: ${lifePathCode}) toplamından doğan ${maturityCode} kodu; özellikle 35–40 yaş sonrasında açığa çıkan nihai üstatlık ve miras frekansınızdır.`,
      calculationFormula: `Yaşam Yolu (${lifePathSingle}) + İsim Kader (${reduceToSingle(destinyCode, false)}) = ${maturityRaw} → ${maturityCode}.`,
      higherSelfTrigger: {
        clockCodes: getClockCodesForNumber(maturityCode, maturitySingle).list,
        totemSymbol: maturityEntry.totem,
        geometricSymbol: maturityEntry.geometry,
        instantMessage: `0${maturitySingle}:0${maturitySingle} gördüğünde Üst Benliğin hatırlatıyor: "İlk yarıdaki tüm sınavlar seni bu ${maturityCode} üstatlığına hazırlamak içindi!"`
      },
      sections: [
        {
          heading: '1. İkinci Bahar ve Ruhsal Hasat (35+ Yaş Döngüsü)',
          content: `Hayatın ilk yarısında Beden Haritanız ve Ruh Haritanız ayrı ayrı deneyim kazanır. Satürn döngüsü sonrasında ise bu iki nehir birleşerek "${maturityCode} — ${maturityEntry.title}" okyanusuna dökülür.`
        },
        {
          heading: '2. Dünyaya Bırakacağınız Nihai İz',
          content: `${maturityEntry.summary} ${maturityEntry.soulHunger}`
        }
      ]
    },

    // 8. GİZLİ TUTKU / BASKIN ÇAKRA MIKNATISI (1. Harita - Ruh Haritası)
    {
      id: 'hidden-passion',
      title: 'Doğal Mıknatıs (Baskın Çakra) Kodu',
      shortTitle: 'BASKIN ÇAKRA KODU',
      codeValue: `${dominantChakra}`,
      subLabel: `${maxCount} Harf Yoğunluğu (${dominantChakra}. Çakra)`,
      layer: 'soul',
      layerBadge: '2. Bölüm • İsimden Gelen Güç Merkezi',
      color: '#EAB308',
      archetypeTitle: `Baskın Çakra Mıknatısı: ${dominantEntry.title}`,
      summary: `İsminizde en çok tekrar eden çakra frekansı ${dominantChakra} (${maxCount} harf) olduğu için, ruhunuzun geçmişten getirdiği en güçlü doğal mıknatıs ve yetenek merkezi burasıdır.`,
      calculationFormula: `İsminizdeki tüm harfler 9 çakraya dağıtıldığında en yüksek yoğunluk ${maxCount} harf ile ${dominantChakra}. Çakrada toplanmaktadır.`,
      higherSelfTrigger: {
        clockCodes: [`0${dominantChakra}:0${dominantChakra}`, `${dominantChakra}${dominantChakra}${dominantChakra}`],
        totemSymbol: dominantEntry.totem,
        geometricSymbol: dominantEntry.geometry,
        instantMessage: `${dominantChakra}${dominantChakra}${dominantChakra} gördüğünde: "En güçlü doğal silahın olan ${dominantChakra}. Çakra yeteneğini devreye sokma zamanı!"`
      },
      sections: [
        {
          heading: '1. Ruhun Doğal Mıknatısı ve En Güçlü Silahı',
          content: `Aura Koruma Kodu nasıl açık kapınızı gösteriyorsa, Gizli Tutku Kodu (${dominantChakra}) da en güçlü kalenizi gösterir. ${dominantEntry.summary}`
        },
        {
          heading: '2. Aşırı Yüklenme (Hiper-Çakra) Uyarısı',
          content: `Bu merkez çok güçlü olduğu için hayat फेलsefesinde her şeyi bu çakranın gözlüğünden görme eğiliminiz vardır. Denge için dikkat etmeniz gereken gölge: ${dominantEntry.shadowTrap}`
        }
      ]
    },

    // 9. DIŞSAL PERSONA / AURA VİTRİNİ (1. Harita - Ruh Haritası)
    {
      id: 'outer-persona',
      title: 'Dışsal Aura (İlk İzlenim) Kodu',
      shortTitle: 'DIŞSAL AURA KODU',
      codeValue: `${rawPersonalitySum}/${personalityCode}`,
      subLabel: 'Sessiz Harf Kalkanı (İlk İzlenim)',
      layer: 'soul',
      layerBadge: '2. Bölüm • İsimden Gelen Aura Kodu',
      color: '#06B6D4',
      archetypeTitle: `Dış Vitrin: ${personaEntry.title}`,
      summary: `Hiç konuşmadan bir odaya girdiğinizde insanların auranızdan okuduğu ilk frekans ve dış dünyaya giydiğiniz koruyucu kıyafet "${personalityCode}" kodudur.`,
      calculationFormula: `İsminizdeki sessiz (ünsüz) harflerin toplamı ${rawPersonalitySum} → ${personalityCode} kodunu verir. Sessiz harfler dil, diş ve dudak sınırlarına çarparak oluştuğu için ruhun dış sınırını temsil eder.`,
      higherSelfTrigger: {
        clockCodes: [`0${personalityCode}:0${personalityCode}`],
        totemSymbol: personaEntry.totem,
        geometricSymbol: personaEntry.geometry,
        instantMessage: `İnsanların seni dışarıdan nasıl gördüğünü anlamak istediğinde ${personalityCode} frekansının aynasına bak.`
      },
      sections: [
        {
          heading: '1. İnsanlar Sizi İlk Tanışmada Nasıl Algılıyor?',
          content: `İçsel Ruh Güdünüz (${soulUrgeCode}) ne olursa olsun, dış dünyaya yaydığınız ilk manyetik izlenim "${personalityCode} — ${personaEntry.title}" frekansıdır. ${personaEntry.summary}`
        },
        {
          heading: '2. İç Öz ile Dış Maske Uyumu',
          content:
            soulUrgeSingle === personalityCode
              ? 'İçsel Ruh Güdünüz ile Dışsal Persona kodunuz aynıdır! İçi dışı bir, şeffaf ve ne hissediyorsa dışarıya onu yansıtan bir auranız vardır.'
              : `İç dünyanızda ${soulUrgeCode} frekansı çalışırken dışarıya ${personalityCode} vitrini yansıtırsınız. Bu yüzden sizi yeni tanıyanlarla yakınlarınızın sizin hakkınızdaki izlenimi birbirinden çok farklı olabilir.`
        }
      ]
    },

    // 10. BİLİNÇALTI KRİZ REFLEKSİ KODU (3. Harita - Eterik Sinir Sistemi)
    {
      id: 'subconscious-self',
      title: 'Bilinçaltı Kriz Refleksi Kodu',
      shortTitle: 'KRİZ REFLEKSİ KODU',
      codeValue: `${subconsciousSelfCode}/9`,
      subLabel: `9 Çakradan ${subconsciousSelfCode} Aktif Merkez`,
      layer: 'alchemy',
      layerBadge: '3. Bölüm • Bilinçaltı Kriz Refleksi',
      color: '#6366F1',
      archetypeTitle: `${subconsciousSelfCode}/9 Bilinçaltı Dayanıklılık & İlk 3 Saniye Refleksi`,
      summary: `Ani bir şok, kriz veya beklenmedik bir olay karşısında bilinçaltınızın ilk 3 saniyede nasıl tepki verdiğini gösteren Pisagor kodudur (${subconsciousSelfCode}).`,
      calculationFormula: `9 (Tam Çakra Matrisi) - ${missingChakras.length} (İsimdeki Eksik Çakra Sayısı) = ${subconsciousSelfCode}.`,
      higherSelfTrigger: {
        clockCodes: [`0${subconsciousSelfCode}:0${subconsciousSelfCode}`, `09:0${subconsciousSelfCode}`],
        totemSymbol: (AURA_PROTECTION_LIBRARY[subconsciousSelfCode] || AURA_PROTECTION_LIBRARY[9]).totem,
        geometricSymbol: (SOUL_URGE_LIBRARY[subconsciousSelfCode] || SOUL_URGE_LIBRARY[9]).geometry,
        instantMessage: `Kriz anında panik yapma; bilinçaltında ${subconsciousSelfCode} çakra birden aynı anda çözüm üretiyor.`
      },
      sections: [
        {
          heading: '1. Kriz ve Şok Anındaki İlk Tepkiniz',
          content:
            subconsciousSelfCode >= 7
              ? `9 çakradan ${subconsciousSelfCode} tanesi isminizde aktif olduğu için kriz anlarında olağanüstü soğukkanlısınızdır. Herkes panik yaparken siz durumu hızla analiz edip yönetimi ele alırsınız.`
              : `İsminiz belirli çakralarda yoğunlaşıp ${missingChakras.length} çakrayı açık bıraktığı için, kriz anlarında ilk tepkiniz duygusal dalgalanma olabilir; ancak kendi uzmanlık alanınıza döndüğünüzde çok derin ve odaklı çözümler üretirsiniz.`
        }
      ]
    },

    // 11. KALDE (BABİL) BİLEŞİK SEMBOL ARKETİPİ (3. Harita - Kadim Arketip)
    {
      id: 'chaldean-compound',
      title: 'Kalde (Babil) Bileşik Arketipi',
      shortTitle: 'KALDE ARKETİP KODU',
      codeValue: `${chaldeanCompoundNum}/${reduceToSingle(chaldeanCompoundNum, false)}`,
      subLabel: chaldeanEntry.symbolName,
      layer: 'alchemy',
      layerBadge: '3. Bölüm • Kadim Babil Sembol Kodu',
      color: '#F43F5E',
      archetypeTitle: chaldeanEntry.title,
      summary: chaldeanEntry.meaning,
      calculationFormula: `Orijinal Babil/Kalde 1–8 ses titreşim tablosuna göre isminizin bileşik toplamı ${rawChaldeanSum} (${chaldeanCompoundNum}/${reduceToSingle(chaldeanCompoundNum, false)}) olarak hesaplanmıştır.`,
      higherSelfTrigger: {
        clockCodes: [`${chaldeanCompoundNum}`, `0${reduceToSingle(chaldeanCompoundNum, false)}:0${reduceToSingle(chaldeanCompoundNum, false)}`, `${reduceToSingle(chaldeanCompoundNum, false)}${reduceToSingle(chaldeanCompoundNum, false)}${reduceToSingle(chaldeanCompoundNum, false)}`],
        totemSymbol: `${chaldeanEntry.symbolName} (Kalde Tablet Sembolü)`,
        geometricSymbol: (PLANETARY_RULER_LIBRARY[reduceToSingle(chaldeanCompoundNum, false)] || PLANETARY_RULER_LIBRARY[1]).geometry,
        instantMessage: `Günlük hayatta ${chaldeanCompoundNum} sayısını gördüğünde bil ki Kalde arketipin (${chaldeanEntry.symbolName}) devrede!`
      },
      sections: [
        {
          heading: '1. İki Basamaklı Gizli Kader Sembolü',
          content: chaldeanEntry.meaning
        },
        {
          heading: '2. Kadim Tabletlerdeki Uyarı & Kutsama',
          content: chaldeanEntry.warningOrBlessing
        }
      ]
    }
  ];

  // ============================================================================
  // ÜST BENLİK GÜNLÜK SEMBOL & EŞZAMANLILIK SÖZLÜĞÜ (CANLI MESAJ REHBERİ)
  // ============================================================================
  if (cleanBirthTime && chaldeanHourInfo) {
    const portalSoulEntry = SOUL_URGE_LIBRARY[portalCode] || SOUL_URGE_LIBRARY[portalSingle] || SOUL_URGE_LIBRARY[1];
    codes.push({
      id: 'birth-time-portal',
      title: 'İlk Nefes (Doğum Saati) Kapı Kodu',
      shortTitle: 'İLK NEFES KAPISI',
      codeValue: `${rawTimeDigitsSum}/${portalCode}`,
      subLabel: `${cleanBirthTime} • Nöbetçi: ${chaldeanHourInfo.hourPlanet}`,
      layer: 'body',
      layerBadge: '1. Bölüm • Doğum Saatinden Gelen Kod',
      color: '#14B8A6',
      archetypeTitle: `Saat ${cleanBirthTime} Portalı (${rawTimeDigitsSum}/${portalCode}) — ${chaldeanHourInfo.hourPlanet} Nöbeti`,
      summary: `Dünyaya ilk nefesinizi verdiğiniz ${cleanBirthTime} anı, Beden Haritanıza "${rawTimeDigitsSum}/${portalCode}" kapı şifresini ve Keldani gökyüzü nöbetçisi olarak "${chaldeanHourInfo.hourPlanet}" gezegenini mühürlemiştir.`,
      calculationFormula: `Doğum Saati (${cleanBirthTime}) rakamları toplamı = ${rawTimeDigitsSum} → ${portalCode}. Keldani (Babil) Gezegen Saatleri tablosuna göre ${chaldeanHourInfo.dayRuler} gününün ${chaldeanHourInfo.sectLabel} içinde "${chaldeanHourInfo.hourPlanet}" saatinde doğdunuz.`,
      higherSelfTrigger: {
        clockCodes: [cleanBirthTime, ...getClockCodesForNumber(portalCode, portalSingle).list],
        totemSymbol: `${chaldeanHourInfo.hourPlanet} Saat Muhafızı & ${portalSoulEntry.totem}`,
        geometricSymbol: portalSoulEntry.geometry,
        instantMessage: `Dijital saatlerde tam doğum saatin olan ${cleanBirthTime} veya ${getClockCodesForNumber(portalCode, portalSingle).display} gördüğünde Üst Benliğin sana sesleniyor: "Dünyaya ilk nefes aldığın anki ruh sözleşmeni hatırla; ${chaldeanHourInfo.hourPlanet} koruması altındasın!"`
      },
      sections: [
        {
          heading: '1. İlk Nefes Portalı (Enkarnasyon Giriş Şifresi)',
          content: `Ruhunuz anne karnından çıkıp ilk nefesini ${cleanBirthTime} anında aldığında eterik bedeninize ${rawTimeDigitsSum}/${portalCode} (${portalSoulEntry.title}) frekansı kazındı. ${portalSoulEntry.summary}`
        },
        {
          heading: '2. Keldani Nöbetçi Saat Gezegeni: ' + chaldeanHourInfo.hourPlanet,
          content: `Doğum gününüz genel karakter gezegeninizi verirken, doğduğunuz dakika gökyüzünde nöbette olan "${chaldeanHourInfo.hourPlanet}" gezegeni sizin kriz anındaki gizli koruyucunuz ve zamanlama anahtarınızdır. Gün içinde ${chaldeanHourInfo.hourPlanet} saatleri sizin için ekstra şanslı kapılardır.`
        },
        {
          heading: '3. Gece / Gündüz (Diürnal - Noktürnal) Ruh Modu',
          content: chaldeanHourInfo.isDayBirth
            ? `${chaldeanHourInfo.sectLabel}: Güneş ufkun üzerindeyken doğduğunuz için tüm kişisel kodlarınızı dış dünyada görünür olarak, açık iletişimle, sosyal liderlikle ve doğrudan eylemle çalıştırdığınızda en yüksek berekete ulaşırsınız.`
            : `${chaldeanHourInfo.sectLabel}: Güneş battıktan sonra (Ay ve yıldızların hükmünde) doğduğunuz için kişisel kodlarınız derin sezgiyle, stratejik gizlilikle, rüya/bilinçaltı rehberliğiyle ve perde arkasındaki bilgelikle çalıştığında en büyük güce ulaşır. Projelerinizi olgunlaşmadan önce herkese anlatmamalısınız.`
        }
      ]
    });
  }

  // ÜST BENLİK EŞZAMANLILIK SİNYALLERİ (Sadece 3 Gerçek Çekirdek Matrix Frekansı)
  const activeRuhDigit = birthEmbeddedRuhDigit;
  const isNestedKarmic = primaryKarmicKey !== 'YOK';
  const karmicShadowText = {
    '19/1': 'bencillik, inatçılık, korku veya eylemsizlik',
    '13/4': 'erteleme, dağınıklık, şikayet veya kestirme yol arayışı',
    '14/5': 'duygusal uçlarda savrulma, sabırsızlık veya aşırı haz/kaçış eğilimi',
    '16/7': 'egosal kurgular, kibir veya sahte güven alanlarına tutunma'
  }[primaryKarmicKey] || 'eski alışkanlık kalıpları';
  const ruhClockStr =
    activeRuhDigit === 1
      ? '1 / 11:11 / 10:10'
      : `${activeRuhDigit} / 0${activeRuhDigit}:0${activeRuhDigit} / ${activeRuhDigit}${activeRuhDigit}${activeRuhDigit}`;
  const alanClockStr =
    birthMatrixFieldCode === 2
      ? '2 / 22:22 / 222'
      : `${birthMatrixFieldCode} / 0${birthMatrixFieldCode}:0${birthMatrixFieldCode} / ${birthMatrixFieldCode}${birthMatrixFieldCode}${birthMatrixFieldCode}`;
  const dogumClockStr = `${birthDaySingle} / ${birthDaySingle}:0${birthDaySingle} / ${birthDaySingle}${birthDaySingle}${birthDaySingle}`;

  const synchronicitySignals: SynchronicitySignal[] = [
    // 1. SİNYAL: RUH KODU & GÖMÜLÜ KARMİK BORÇ KODU (ÇİFT YÖNLÜ UYANIŞ FREKANSI)
    {
      code: isNestedKarmic ? `${ruhClockStr} (${primaryKarmicKey})` : ruhClockStr,
      title: `${activeRuhDigit === 1 ? '11:11' : `0${activeRuhDigit}:0${activeRuhDigit}`} Çift Yönlü Uyanış Frekansı`,
      sourceCodeName: isNestedKarmic
        ? `Ruh Kodu: ${activeRuhDigit} • Gömülü Karmik Kod: ${primaryKarmicKey}`
        : `Ruh / Benlik Kodu: ${activeRuhDigit}`,
      layer: 'body',
      color: '#EAB308',
      symbolArchetype: karmicEntry.totemSymbol,
      whenYouSeeIt: `Haritanızda Ruh Kodu: ${activeRuhDigit}${
        isNestedKarmic ? ` ve bu kodun içine gömülü olan Karmik Borç Kodu: ${primaryKarmicKey}` : ''
      } bulunmaktadır. ${
        isNestedKarmic
          ? `Ruh kodunuzun içinde karmik kilit çıkması (${primaryKarmicKey}), geçmiş yaşamlardan bu yana aynı sınavın tekrarlandığını ve eski davranış kalıplarına düşmemeniz gerektiğini gösterir. `
          : ''
      }Günlük hayatta ${activeRuhDigit} sayı dizilerini görmeniz iki anlam taşır: (1) Rehberlik olarak; zihinsel kaygıları bırakıp lider, bağımsız ve öncü ruhunuzu aktif ederek "akışta kalmanız" hatırlatılır. (2) Karmik uyarı olarak; geçmiş yaşam ezberlerinize (${karmicShadowText}) düşerek bu yaşamda yeni bir karma yaratmamanız gerektiği konusunda sert bir sistem alarmı verilir.`,
      actionStep: karmicEntry.sections[3]?.content || 'Kendi merkezinizde kalın; eski alışkanlık tepkisi yerine bilinçli iradeyle hareket edin.'
    },

    // 2. SİNYAL: ALAN KORUMA KODU ("ALAN KAPATAN" SINIR FREKANSI)
    {
      code: alanClockStr,
      title: `${birthMatrixFieldCode === 2 ? '22:22' : `0${birthMatrixFieldCode}:0${birthMatrixFieldCode}`} Koruma ve Sınır Frekansı (Alan Kapatan)`,
      sourceCodeName: `Alan Kodu: ${birthMatrixFieldCode} (Alan Kapatan)`,
      layer: 'body',
      color: '#38BDF8',
      symbolArchetype: (AURA_PROTECTION_LIBRARY[birthMatrixFieldCode] || AURA_PROTECTION_LIBRARY[2]).totem,
      whenYouSeeIt: `Alandaki koruma kodunuz ${birthMatrixFieldCode}'dir. Bu sayı sizin için "Alan Kapatan" (enerji alanını koruyan ve kapatan sınır) anlamına gelir. Günlük hayatta ${birthMatrixFieldCode} sayı dizilerini görmeniz; dışarıdan gelen negatif enerjilere karşı kendi alanınızı kapatmanız, sınırlarınızı net bir şekilde çizmeniz ve gereksiz enerji sızıntılarını engellemeniz gerektiği mesajını taşır.`,
      actionStep: (AURA_PROTECTION_LIBRARY[birthMatrixFieldCode] || AURA_PROTECTION_LIBRARY[2]).shieldingRitual
    },

    // 3. SİNYAL: DOĞUM KODU & GEZEGEN YÖNETİCİSİ FREKANSI
    {
      code: dogumClockStr,
      title: `${birthDaySingle}:0${birthDaySingle} Sorumluluk ve ${lifePathPlanetEntry.planet.split(' ')[0]} Frekansı`,
      sourceCodeName: `Doğum Kodu: ${birthDaySingle} • Gezegen Yöneticisi: ${lifePathPlanetEntry.planet.split(' ')[0]}`,
      layer: 'body',
      color: '#EF4444',
      symbolArchetype: lifePathPlanetEntry.totem,
      whenYouSeeIt: `Doğum kodu yeteneğiniz ${birthDaySingle}'dir ve beden yöneticiniz ${lifePathPlanetEntry.planet.split(' ')[0]}'dür. Günlük hayatta ${birthDaySingle} görmek; Yüksek Benliğin size dünyevi sorumlulukları ertelememeyi, korkuların üstüne disiplinle gitmeyi ve ${lifePathPlanetEntry.planet.split(' ')[0]} dengesini korumanız gerektiğini hatırlatan uyarısıdır.`,
      actionStep: lifePathPlanetEntry.synchronicityGuide
    }
  ];

  return {
    fullName: cleanName,
    birthDate: `${String(day).padStart(2, '0')}.${String(month).padStart(2, '0')}.${year}`,
    birthTime: cleanBirthTime,
    summaryMetrics: {
      primaryKarmicCode: primaryKarmicKey === 'YOK' ? 'Yok' : primaryKarmicKey,
      detectedKarmicList: detectedKarmicDebts,
      soulUrgeCode,
      soulUrgeSingle,
      personalityCode,
      destinyCode,
      birthMatrixFieldCode,
      missingBirthDigits,
      embeddedRuhKodu: primaryKarmicKey !== 'YOK' ? reduceToSingle(parseInt(primaryKarmicKey.split('/')[1], 10) || soulUrgeSingle, false) : soulUrgeSingle,
      auraProtectionCode,
      missingChakras,
      dominantChakra,
      birthDay: day,
      birthDaySingle,
      lifePathCode,
      lifePathSingle,
      birthPlanetName: planetEntry.planet.split(' ')[0],
      lifePathPlanetName: lifePathPlanetEntry.planet.split(' ')[0],
      maturityCode,
      bridgeCode,
      subconsciousSelfCode,
      chaldeanCompoundNum,
      birthTimePortalCode: cleanBirthTime ? `${rawTimeDigitsSum}/${portalCode}` : undefined,
      chaldeanHourPlanet: chaldeanHourInfo?.hourPlanet,
      isDayBirth: chaldeanHourInfo?.isDayBirth
    },
    codes,
    synchronicitySignals,
    mapBalanceSummary: {
      soulDominantNote: `Ruh Haritanız (İsminiz) "${soulUrgeCode} — ${soulEntry.title}" özüyle çalışırken dış dünyaya "${personalityCode}" vitrini yansıtıyor ve en güçlü silahını ${dominantChakra}. Çakradan alıyor.`,
      bodyDominantNote: `Beden Haritanız (Doğum Tarihiniz) ayın ${day}. günü mührüyle "${birthDaySingle}" frekansında ve ${planetEntry.planet} yönetiminde fiziksel dünyaya kökleniyor.`,
      bridgeSynthesisNote: `3. Haritanızda (Sentez Katmanı) Karmik Kodunuz "${primaryKarmicKey === 'YOK' ? 'Serbest Kontrat' : primaryKarmicKey}", Aura Koruma Kapınız "${auraProtectionCode}. Çakra" ve iki haritanızı birleştiren Köprü Kodunuz "${bridgeCode}" olarak mühürlenmiştir.`
    }
  };
}

