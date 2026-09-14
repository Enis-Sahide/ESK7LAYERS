import { ZodiacSign } from '../api/astrologyClient';

export const ZODIAC_RULERS: Record<ZodiacSign, string[]> = {
  'Koç': ['Mars'],
  'Boğa': ['Venüs'],
  'İkizler': ['Merkür'],
  'Yengeç': ['Ay'],
  'Aslan': ['Güneş'],
  'Başak': ['Merkür'],
  'Terazi': ['Venüs'],
  'Akrep': ['Plüton', 'Mars'],
  'Yay': ['Jüpiter'],
  'Oğlak': ['Satürn'],
  'Kova': ['Uranüs', 'Satürn'],
  'Balık': ['Neptün', 'Jüpiter']
};

export interface KabbalahWorld {
  name: string;
  hebrewName: string;
  title: string;
  naturalRuler: string;
  element: string;
  sephirot: string;
  description: string;
  thothInfo: string;
}

export const KABBALAH_WORLDS: KabbalahWorld[] = [
  {
    name: 'Assiah',
    hebrewName: 'עֲשִׂיָּה',
    title: 'Madde ve Eylem Alemi',
    naturalRuler: 'Jüpiter',
    element: 'Toprak',
    sephirot: 'Malkut (Krallık)',
    description: 'Şu an içinde yaşadığımız 3 boyutlu katı madde ve eylem alemidir. Fiziksel bedenin, eylemlerin, beş duyunun ve yeryüzündeki somut enkarnasyonun merkezidir.',
    thothInfo: 'Tezahür Noktası: Bu alem, Yaratıcı İradenin yeryüzündeki son durağı ve meyvesidir. Ruhun niyet ve düşüncelerinin fiziksel eylemlerle biçim bulup deneyimlendiği alandır.'
  },
  {
    name: 'Yetzirah',
    hebrewName: 'יְצִירָה',
    title: 'Beden ve Duygu Alemi',
    naturalRuler: 'Satürn',
    element: 'Su / Hava',
    sephirot: 'Yesod, Hod, Netsah',
    description: 'Melekler Alemi (Duygular ve Hisler). Dış dünyadan alınan enerjinin içsel hislere, psikolojik tepkilere ve astral kalıplara dönüştüğü boyuttur.',
    thothInfo: 'Kozmik Yansıma: Bu seviyede niyetler hislere ve duygusal formlara bürünür. Karakterin, bilinçaltı kayıtlarının ve geçmiş yaşam tortularının şekillendiği alandır.'
  },
  {
    name: 'Beriyah',
    hebrewName: 'בְּרִיאָה',
    title: 'Zihin Alemi',
    naturalRuler: 'Mars ve Plüto',
    element: 'Hava / Su',
    sephirot: 'Tifaret, Gevurah, Hesed',
    description: 'Başmelekler Alemi. Ruhun kendi gücünü ve potansiyelini yaratıma soktuğu yüksek kozmik zihin ve evrensel tasarı alanıdır.',
    thothInfo: 'Yüksek Zihin (Logos): Olaylara karşı derin idrakin, evrensel ilkelerin ve kadersel yaşam amaçlarının belirlendiği kutsal zihin boyutudur.'
  },
  {
    name: 'Atzilut',
    hebrewName: 'אֲצِילוּת',
    title: 'Kudret Alemi',
    naturalRuler: 'Uranüs',
    element: 'Ateş',
    sephirot: 'Binah, Hokmah, Keter',
    description: 'Mutlak Yaratıcıdan fışkıran ilk ilahi ışık, saf kudret ve sonsuz ilahi yayılım alanıdır.',
    thothInfo: 'İlksel Niyet & Saf Işık: Düşüncenin kelimelere veya kavramlara dökülmeden önceki en saf "İlahi İrade" halidir. Birlik bilinci ve saf yaratım enerjisidir.'
  }
];

export function getKabbalahAnalysis(dateStr: string) {
  // dateStr format: YYYY-MM-DD
  const cleanDate = dateStr.replace(/[^0-9]/g, '');
  let sum = 0;
  for (let i = 0; i < cleanDate.length; i++) {
    sum += parseInt(cleanDate[i]);
  }
  
  // Reduce to single digit
  while (sum > 9) {
    let tempSum = 0;
    const sumStr = sum.toString();
    for (let i = 0; i < sumStr.length; i++) {
      tempSum += parseInt(sumStr[i]);
    }
    sum = tempSum;
  }

  // 1=Güneş, 2=Ay, 3=Jüpiter, 4=Uranüs, 5=Merkür, 6=Venüs, 7=Neptün, 8=Satürn, 9=Mars
  const numerologyMap: Record<number, string> = {
    1: 'Güneş', 2: 'Ay', 3: 'Jüpiter', 4: 'Uranüs', 5: 'Merkür', 6: 'Venüs', 7: 'Neptün', 8: 'Satürn', 9: 'Mars'
  };

  const primaryRuler = numerologyMap[sum] || 'Güneş';
  
  let shortcutLevel = 0;
  let shortcutMessage = '';
  
  if (primaryRuler === 'Jüpiter') {
    shortcutLevel = 1;
    shortcutMessage = `Beden (1. Harita) Yöneticiniz Jüpiter'dir (Yaşam Yolu Sayınız: ${sum}). Jüpiter, makrokozmik aklın ve ilahi lütfun (Hesed) yöneticisidir. Beden haritanızda bu gücü aktive ettiğinizde hayatınızdaki fırsatlar ve ruhsal akış hızlanır. Bilgi edinmek, evrensel yasaları tefekkür etmek ve hakikati aramak sizin için en güçlü ruhsal uyanış anahtarıdır. Bu bilgelik arayışı sizi doğrudan üst alemlerin idrakine bağlar.`;
  } else if (primaryRuler === 'Satürn') {
    shortcutLevel = 0; // Köklenme ve sağlam temel
    shortcutMessage = `Beden (1. Harita) Yöneticiniz Satürn'dür (Yaşam Yolu Sayınız: ${sum}). Satürn, Assiah (Madde) dünyasında sabır, köklenme, sağlıklı sınırlar ve Binah'ın vakur disiplinini temsil eder. Satürn enerjisi, dünyevi alanda sağlam ve sarsılmaz bir temel inşa etmenize rehberlik eder. Yaşamınızdaki sorumlulukları olgunlukla kucakladığınızda ve zamanın bilgeliğine güvendiğinizde, bu sağlam zemin üzerinde üst bilinç boyutlarına güvenle yükselebilirsiniz. Bu, sabırla işlendiğinde en kalıcı ve sarsılmaz tekâmül yoludur.`;
  } else if (primaryRuler === 'Mars' || primaryRuler === 'Plüto') {
    shortcutLevel = 3;
    shortcutMessage = `Beden (1. Harita) Yöneticiniz ${primaryRuler}'dur (Yaşam Yolu Sayınız: ${sum}). Bu çok özel bir kozmik imzadır. ${primaryRuler}, ezoterik olarak kişinin içsel ateşini (Geburah) ve ruh gücünü temsil eder. Kendi ruhsal iradenizi ve yapıcı cesaretinizi ortaya çıkardığınız anda, 1. haritadan direkt olarak 3. haritaya (Zihin ve Ruh Alemi - Beriyah) bilinç sıçraması yapabilirsiniz. Odaklanmış iradenizle dünyevi illüzyonları aşıp vizyonunuzu somutlaştırabilirsiniz.`;
  } else if (primaryRuler === 'Uranüs') {
    shortcutLevel = 4;
    shortcutMessage = `Beden (1. Harita) Yöneticiniz Uranüs'tür (Yaşam Yolu Sayınız: ${sum}). Uranüs, Atzilut'un (Kudret Alemi) şimşek misali ani aydınlanma ve uyanış frekansıdır. Maddi dünyadaki kalıplaşmış sınırları aşmak ve ilahi bilinci uyandırmak üzere güçlü bir potansiyele sahipsiniz. Kolektif bilinci aşan özgün vizyonlar geliştirerek, doğrudan 4. haritaya hızlı bir bilinç sıçraması yapma potansiyelini aktive edebilirsiniz.`;
  } else if (primaryRuler === 'Güneş') {
    shortcutLevel = 0;
    shortcutMessage = `Beden (1. Harita) Yöneticiniz Güneş'tir (Yaşam Yolu Sayınız: ${sum}). Tifaret'in merkezi yaşam ışığını bedeninizde taşıyorsunuz. Kendi kalbinizi, özgün yaratıcılığınızı ve içsel ışığınızı keşfederek cömertçe paylaştığınızda, üst alemlerin kapıları size doğal ve bereketli bir akışla açılır.`;
  } else if (primaryRuler === 'Ay') {
    shortcutLevel = 0;
    shortcutMessage = `Beden (1. Harita) Yöneticiniz Ay'dır (Yaşam Yolu Sayınız: ${sum}). Yesod'un (Bilinçaltı ve Temel) derin yansıtıcı aynasını taşıyorsunuz. Duygusal bağlarınızı ve içsel hislerinizi şefkatle kucakladığınızda titreşiminiz doğal olarak yükselir. Hislerinizin bilge ve sükûnet dolu bir gözlemcisi olarak içsel dengenizi kurabilir, sezgilerinizin rehberliğini güvenle yaşamınıza yansıtabilirsiniz.`;
  } else if (primaryRuler === 'Merkür') {
    shortcutLevel = 0;
    shortcutMessage = `Beden (1. Harita) Yöneticiniz Merkür'dür (Yaşam Yolu Sayınız: ${sum}). Hod'un (Zeka, İlim ve İletişim) berrak frekansını temsil ediyorsunuz. Zihinsel enerjinizi sadeleştirdiğinizde, kelimelerin ve düşüncelerin birleştirici gücünü keşfederek yüksek zihin frekanslarıyla derin bir bağ kurabilirsiniz.`;
  } else if (primaryRuler === 'Venüs') {
    shortcutLevel = 0;
    shortcutMessage = `Beden (1. Harita) Yöneticiniz Venüs'tür (Yaşam Yolu Sayınız: ${sum}). Netsah'ın (Güzellik, Ahenk ve Sevgi) zarafetini taşıyorsunuz. Venüs'ün armağanı; güzellik, ahenk ve koşulsuz sevgidir. Bu sevgiyi evrensel bir şefkate, estetik bir derinliğe ve adalet duygusuna dönüştürerek yüksek bilinç alemleriyle derin bir uyum yakalayabilirsiniz.`;
  } else if (primaryRuler === 'Neptün') {
    shortcutLevel = 0;
    shortcutMessage = `Beden (1. Harita) Yöneticiniz Neptün'dür (Yaşam Yolu Sayınız: ${sum}). Keter'in evrensel sevgi ve ilahi birlik frekansını taşıyorsunuz. Saf sezgi, derin teslimiyet ve evrensel şefkatinizi dünyevi sorumluluklarla toprakladığınızda, yüksek ilhamı ve ruhsal huzuru bu dünyada somut olarak deneyimleyebilirsiniz.`;
  } else {
    shortcutLevel = 0;
    shortcutMessage = `Beden (1. Harita) Yöneticiniz ${primaryRuler}'dur (Yaşam Yolu Sayınız: ${sum}). Bu enerjiyle madde dünyasını anlamlandırmak ve ruhsal alemlerle uyumlanmak için ${primaryRuler} potansiyelinizi kendi ilksel niyetinizle uyumlu kılarak yaşamınıza bereket ve idrakle yansıtabilirsiniz.`;
  }

  return {
    primaryRuler,
    shortcutLevel,
    shortcutMessage,
    worlds: KABBALAH_WORLDS
  };
}
