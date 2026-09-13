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
    shortcutLevel = 0; // Bu bir engeldir, shortcut değil.
    shortcutMessage = `Beden (1. Harita) Yöneticiniz Satürn'dür (Yaşam Yolu Sayınız: ${sum}). Satürn, Assiah (Madde) dünyasındaki en ağır karmik testleri, sabrı ve kadersel sınırları (Binah'ın vakur disiplinini) temsil eder. Satürn'ün 1. haritanızı yönetmesi, dünyevi sorumlulukları yerine getirmeden ruhsal sıçrama yapılamayacağını gösterir. Üst haritalara geçebilmek için öncelikle dünyevi yükümlülükleri, korkuları ve zamanın getirdiği sabır sınavlarını yüksek bir olgunlukla aşmanız gerekir. Bu en zorlu ama ustalaşıldığında en kalıcı ve sarsılmaz tekâmül yoludur.`;
  } else if (primaryRuler === 'Mars' || primaryRuler === 'Plüto') {
    shortcutLevel = 3;
    shortcutMessage = `Beden (1. Harita) Yöneticiniz ${primaryRuler}'dur (Yaşam Yolu Sayınız: ${sum}). Bu çok özel bir kozmik imzadır. ${primaryRuler}, ezoterik olarak kişinin içsel ateşini (Geburah) ve ruh gücünü temsil eder. Kendi ruhsal iradenizi ve yapıcı cesaretinizi ortaya çıkardığınız anda, 1. haritadan direkt olarak 3. haritaya (Zihin ve Ruh Alemi - Beriyah) bilinç sıçraması (shortcut) yapabilirsiniz. Odaklanmış iradeniz dünyevi illüzyonları aşma gücüne sahiptir.`;
  } else if (primaryRuler === 'Uranüs') {
    shortcutLevel = 4;
    shortcutMessage = `Beden (1. Harita) Yöneticiniz Uranüs'tür (Yaşam Yolu Sayınız: ${sum}). Uranüs, Atzilut'un (Kudret Alemi) şimşek misali ani aydınlanma ve uyanış frekansıdır. Maddi dünyadaki (Assiah) kalıplaşmış sınırları aşmak ve ilahi bilinci uyandırmak üzere enkarne oldunuz. Kolektif bilinci aşan özgün vizyonlar geliştirerek, doğrudan 4. haritaya hızlı bir bilinç sıçraması (shortcut) yapma potansiyeline sahipsiniz.`;
  } else if (primaryRuler === 'Güneş') {
    shortcutLevel = 0;
    shortcutMessage = `Beden (1. Harita) Yöneticiniz Güneş'tir (Yaşam Yolu Sayınız: ${sum}). Tifaret'in merkezi gücünü bedeninizde taşıyorsunuz. Sizin temel testiniz dünyevi ego ile ilahi öz arasındaki dengeyi kurmaktır. Kendi kalbinizi ve içsel ışığınızı keşfettiğinizde, koşulsuz bir cömertlik sergilediğinizde üst alemlerin kapıları size doğal bir akışla açılacaktır.`;
  } else if (primaryRuler === 'Ay') {
    shortcutLevel = 0;
    shortcutMessage = `Beden (1. Harita) Yöneticiniz Ay'dır (Yaşam Yolu Sayınız: ${sum}). Yesod'un (Bilinçaltı ve Temel) yansıtıcı aynasını taşıyorsunuz. Duygusal bağlarınızı, geçmiş yaşam karmalarınızı ve içsel çocuk yaralarınızı şifalandırmadan titreşiminizi yükseltmeniz zordur. Sizin çıkış kapınız, duygusal dalgalanmaların esiri olmak yerine hislerinizin bilge bir gözlemcisi olmaktan geçer.`;
  } else if (primaryRuler === 'Merkür') {
    shortcutLevel = 0;
    shortcutMessage = `Beden (1. Harita) Yöneticiniz Merkür'dür (Yaşam Yolu Sayınız: ${sum}). Hod'un (Zeka, İlim ve İletişim) temsilcisisiniz. Assiah dünyasındaki sınavınız; dualiteyi, zihinsel vesveseleri ve yüzeysel bilgi karmaşasını aşmaktır. Kelimelerin ve düşüncelerin kutsal gücünü doğru yönde kullandığınızda yüksek zihin frekanslarına bağlanırsınız.`;
  } else if (primaryRuler === 'Venüs') {
    shortcutLevel = 0;
    shortcutMessage = `Beden (1. Harita) Yöneticiniz Venüs'tür (Yaşam Yolu Sayınız: ${sum}). Netsah'ın (Güzellik, Ahenk ve Zafer) cazibesini taşıyorsunuz. Sizin en büyük dünyevi sınavınız, yalnızca geçici hazlara ve dış görünüşe takılı kalmaktır. Dünyevi sevginizi ilahi aşk, adalet ve estetik bir ruh haline dönüştürdüğünüzde yüksek alemlere geçişiniz gerçekleşir.`;
  } else if (primaryRuler === 'Neptün') {
    shortcutLevel = 0;
    shortcutMessage = `Beden (1. Harita) Yöneticiniz Neptün'dür (Yaşam Yolu Sayınız: ${sum}). Keter'in okyanusal çözülme enerjisi madde bedeninizde (Assiah) zaman zaman yönsüzlük ve illüzyon hissi yaratabilir. Sizin yolculuğunuz, dünyevi kaçışlara veya kurban psikolojisine kapılmadan; saf sezgi, derin teslimiyet ve evrensel şefkat ile ilahi gerçekliği bu dünyada yaşamaktır.`;
  } else {
    shortcutLevel = 0;
    shortcutMessage = `Beden (1. Harita) Yöneticiniz ${primaryRuler}'dur (Yaşam Yolu Sayınız: ${sum}). Bu enerjiyle madde dünyasını anlamlandırmak ve ruhsal alemlere geçmek için ${primaryRuler} enerjisini kendi ilksel niyetinizle uyumlu olarak dönüştürmeniz ve evrimleştirmeniz gerekir.`;
  }

  return {
    primaryRuler,
    shortcutLevel,
    shortcutMessage,
    worlds: KABBALAH_WORLDS
  };
}
