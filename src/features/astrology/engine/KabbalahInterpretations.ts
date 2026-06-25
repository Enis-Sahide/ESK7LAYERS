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
    description: 'Şu an içinde yaşadığımız 3 boyutlu katı madde ve eylem alemidir. Kuantumdaki moleküler çarpışmaların, beş duyunun ve bedensel enkarnasyonun merkezidir.',
    thothInfo: 'Gözlemci Noktası: Bu alem, Yaratıcının (Ontolojik Zihnin) tezahür ettiği final noktasıdır. Fiziksel bedenin ve olayların kopyalanıp deneyimlendiği alandır.'
  },
  {
    name: 'Yetzirah',
    hebrewName: 'יְצִירָה',
    title: 'Beden ve Duygu Alemi',
    naturalRuler: 'Satürn',
    element: 'Su / Hava',
    sephirot: 'Yesod, Hod, Netsah',
    description: 'Melekler Alemi (Duygular ve Hisler). Dış dünyadan alınan enerjinin duygusal reaksiyonlara dönüştüğü yerdir.',
    thothInfo: 'İletişim Thoth\'ları: Bu seviyede niyetler (Thoth) birbirini kopyalar ve hislere bürünür. Karakterin ve geçmiş yaşam tepkilerinin şekillendiği alandır.'
  },
  {
    name: 'Beriyah',
    hebrewName: 'בְּרִיאָה',
    title: 'Zihin Alemi',
    naturalRuler: 'Mars ve Plüto',
    element: 'Hava / Su',
    sephirot: 'Tifaret, Gevurah, Hesed',
    description: 'Başmelekler Alemi. Ruhun kendi gücünü ve potansiyelini yaratıma soktuğu makrokozmik zihin alanıdır.',
    thothInfo: 'Ontolojik Zihin: Olaylara karşı sabit tutumların (önyargılar ve zihinsel çerçeveler) belirlendiği, evrenin zihinsel matrisidir.'
  },
  {
    name: 'Atzilut',
    hebrewName: 'אֲצِילוּת',
    title: 'Kudret Alemi',
    naturalRuler: 'Uranüs',
    element: 'Ateş',
    sephirot: 'Binah, Hokmah, Keter',
    description: 'Negatif varoluştan fışkıran ilk ilahi ışık and Mutlak Yaratıcının doğrudan yayılım alanıdır.',
    thothInfo: 'İlksel Niyet (Aktif Thoth): Düşüncenin kelimelere veya kavramlara dökülmeden önceki en saf "Niyet" halidir. Mesih Bilinci ve saf yaratım enerjisidir.'
  }
];

export function getKabbalahAnalysis(dateStr: string) {
  const cleanDate = dateStr.replace(/[^0-9]/g, '');
  let sum = 0;
  for (let i = 0; i < cleanDate.length; i++) {
    sum += parseInt(cleanDate[i]);
  }
  
  while (sum > 9) {
    let tempSum = 0;
    const sumStr = sum.toString();
    for (let i = 0; i < sumStr.length; i++) {
      tempSum += parseInt(sumStr[i]);
    }
    sum = tempSum;
  }

  const numerologyMap: Record<number, string> = {
    1: 'Güneş', 2: 'Ay', 3: 'Jüpiter', 4: 'Uranüs', 5: 'Merkür', 6: 'Venüs', 7: 'Neptün', 8: 'Satürn', 9: 'Mars'
  };

  const primaryRuler = numerologyMap[sum] || 'Güneş';
  
  let shortcutLevel = 0;
  let shortcutMessage = '';
  
  if (primaryRuler === 'Jüpiter') {
    shortcutLevel = 1;
    shortcutMessage = `Beden (1. Harita) Yöneticiniz Jüpiter'dir (Yaşam Yolu Sayınız: ${sum}). Jüpiter, makrokozmik aklın (Hesed) yöneticisidir. Beden haritanızda bu gücü kullanmaya başladığınızda sisteminiz inanılmaz bir hızla çalışmaya başlar. Bilgi edinmek, evrensel yasaları tefekkür etmek ve yüksek nöron aktivasyonu sizin için en güçlü ruhsal uyanış anahtarıdır. Bu entelektüel aktivasyon sizi doğrudan üst alemlere bağlar.`;
  } else if (primaryRuler === 'Satürn') {
    shortcutLevel = 0;
    shortcutMessage = `Beden (1. Harita) Yöneticiniz Satürn'dür (Yaşam Yolu Sayınız: ${sum}). Satürn, Assiah (Madde) dünyasındaki en ağır karmik testleri ve kısıtlamaları (Binah'ın sert yüzünü) temsil eder. Satürn'ün 1. haritanızı yönetmesi, titreşiminizi (vibrasyonunuzu) yükseltmenizi son derece zorlaştırır. Üst haritalara geçebilmek için öncelikle dünyevi sorumlulukları, korkuları ve zamanın illüzyonunu çok katı bir disiplinle aşmanız gerekir. Bu en zorlu ama ustalaşıldığında en kalıcı tekamül yoludur.`;
  } else if (primaryRuler === 'Mars' || primaryRuler === 'Plüto') {
    shortcutLevel = 3;
    shortcutMessage = `Beden (1. Harita) Yöneticiniz ${primaryRuler}'dur (Yaşam Yolu Sayınız: ${sum}). Bu çok özel bir kozmik imzadır. ${primaryRuler}, ezoterik olarak kişinin içsel ateşini (Geburah) ve ruh gücünü temsil eder. Kendi ruhsal gücünüzü ve savaşçı iradenizi ortaya çıkardığınız anda, 1. haritadan direkt olarak 3. haritaya (Zihin ve Ruh Alemi - Beriyah) kolaylıkla sıçrama (shortcut) yapabilirsiniz. İradeniz matrisi yakıp geçme gücüne sahiptir.`;
  } else if (primaryRuler === 'Uranüs') {
    shortcutLevel = 4;
    shortcutMessage = `Beden (1. Harita) Yöneticiniz Uranüs'tür (Yaşam Yolu Sayınız: ${sum}). Uranüs, Atzilut'un (Kudret Alemi) şimşek misali ani uyanış frekansıdır. Maddi dünyadaki (Assiah) kalıpları kırmak ve Matrix'i yırtmak üzere enkarne oldunuz. Kolektif bilinci aşan orijinal devrimler yaparak, doğrudan 4. haritaya saniyeler içinde sıçrama (shortcut) yeteneğiniz vardır.`;
  } else if (primaryRuler === 'Güneş') {
    shortcutLevel = 0;
    shortcutMessage = `Beden (1. Harita) Yöneticiniz Güneş'tir (Yaşam Yolu Sayınız: ${sum}). Tifaret'in merkezi gücünü bedeninizde taşıyorsunuz. Sizin temel testiniz "Ego" ve "İlahi Öz" arasındaki dengeyi kurmaktır. Kendi merkezinizi bulduğunuzda ve saf, koşulsuz bir varoluş (Işık) sergilediğinizde diğer alemlerin kapıları organik bir şekilde size açılacaktır.`;
  } else if (primaryRuler === 'Ay') {
    shortcutLevel = 0;
    shortcutMessage = `Beden (1. Harita) Yöneticiniz Ay'dır (Yaşam Yolu Sayınız: ${sum}). Yesod'un (Bilinçaltı ve Temel) yansıtıcı aynasını taşıyorsunuz. Duygusal bağlarınızı, geçmiş yaşam karmalarınızı ve hücresel hafızanızı şifalandırmadan titreşiminizi yükseltmeniz zordur. Sizin çıkış kapınız, duygusal dalgalanmaların efendisi olmaktan geçer.`;
  } else if (primaryRuler === 'Merkür') {
    shortcutLevel = 0;
    shortcutMessage = `Beden (1. Harita) Yöneticiniz Merkür'dür (Yaşam Yolu Sayınız: ${sum}). Hod'un (Zeka ve İletişim) temsilcisisiniz. Assiah dünyasındaki sınavınız; dualiteyi, zihinsel karmaşayı ve bilgi zehirlenmesini aşmaktır. Kelimelerin ve düşüncelerin sihrini (simyasını) çözdüğünüzde üst frekanslara bağlanırsınız.`;
  } else if (primaryRuler === 'Venüs') {
    shortcutLevel = 0;
    shortcutMessage = `Beden (1. Harita) Yöneticiniz Venüs'tür (Yaşam Yolu Sayınız: ${sum}). Netsah'ın (Güzellik ve Zafer) cazibesini taşıyorsunuz. Sizin en büyük maddi sınavınız, dünyevi hazlara, lükse ve formun güzelliğine hapsolmaktır. Madde dünyasındaki arzularınızı, "İlahi Aşk" ve kozmik uyum seviyesine süblime ettiğinizde yüksek alemlere geçişiniz gerçekleşir.`;
  } else if (primaryRuler === 'Neptün') {
    shortcutLevel = 0;
    shortcutMessage = `Beden (1. Harita) Yöneticiniz Neptün'dür (Yaşam Yolu Sayınız: ${sum}). Keter'in okyanusal çözülme enerjisi madde bedeninizde (Assiah) büyük bir illüzyon ve kaybolmuşluk hissi yaratabilir. Sizin yolculuğunuz, bu dünyada kurban psikolojisine veya kaçış bağımlılıklarına düşmeden, saf sezgi ve ruhsal teslimiyet ile gerçekliği bulmaktır.`;
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
