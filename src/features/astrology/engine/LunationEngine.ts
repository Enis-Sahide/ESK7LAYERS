/**
 * LunationEngine.ts
 * Yeni Ay, Dolunay, Güneş Tutulması ve Ay Tutulması Etki Motoru.
 * Kolektif ve 12 Ev kişisel astrolojik analizlerini, etki sürelerini yönetir.
 */

export type LunationType = 'new_moon' | 'full_moon' | 'solar_eclipse' | 'lunar_eclipse';

export interface LunationEvent {
  utcDate: string; // ISO format
  phase: LunationType;
  phaseName: string;
  sign: string;
  signSymbol: string;
  degree: string;
}

export interface LunationDurationInfo {
  totalDuration: string; // örn: "6 Ay", "14 Gün", "1 - 3 Ay"
  peakWindow: string;    // örn: "±15 Gün", "±3 Gün", "±7 - 14 Gün"
  description: string;
  nature: string;
}

export interface ActiveSolarEclipseInfo {
  event: LunationEvent;
  daysDiff: number; // pozitif = yaklaşan gün, negatif = üzerinden geçen gün
  monthsRemaining: number;
  statusText: string;
  isActive: boolean;
}

export interface HouseLunationInterpretation {
  title: string;
  personalImpact: string;
  advice: string;
  portalName: string;
  portalMeaning: string;
  shadowState: string;       // ⚠️ Alt Bilinç / Gölge Hali (Ego & Korku hali)
  elevatedState: string;     // ✨ Üst Bilinç / Ruhsal Boyut (7 çakra dengede & arınmış bilinç)
  spiritualAdvice: string;   // 🌿 Çakra & Manevi Denge Reçetesi
}

export const LUNATION_DURATIONS: Record<LunationType, LunationDurationInfo> = {
  new_moon: {
    totalDuration: '14 Gün',
    peakWindow: '±3 Gün',
    description: 'Bir sonraki Dolunaya kadar tohum ekme, niyet belirleme ve sıfırdan başlama enerjisidir.',
    nature: 'Başlangıç, Niyet, Tohum Ekme',
  },
  full_moon: {
    totalDuration: '14 Gün',
    peakWindow: '±3 ila 5 Gün',
    description: 'Hasat alma, gizli olanın aydınlanması, ilişkilerde veya projelerde netleşme ve doruk noktasıdır.',
    nature: 'Hasat, Yüzleşme, Doruk Noktası',
  },
  lunar_eclipse: {
    totalDuration: '1 ila 3 Ay',
    peakWindow: '±7 ila 14 Gün',
    description: 'Süper Dolunay niteliğindedir. Kadersel kapanışlar, duygusal aydınlanmalar ve bitmesi gereken bağların kopuşudur.',
    nature: 'Kadersel Kapanış, Dönüşüm, Aydınlanma',
  },
  solar_eclipse: {
    totalDuration: 'Tam 6 Ay',
    peakWindow: '±15 ila 30 Gün',
    description: 'Süper Yeniay niteliğindedir. Yaşamın ana omurgasını belirleyen 6 aylık kadersel çatı şemsiyesidir.',
    nature: 'Kadersel Başlangıç, Köklü Dönüm Noktası',
  },
};

// 2026 Resmi Ay Döngüsü ve Tutulma Takvimi
export const MOON_PHASES_DATA: LunationEvent[] = [
  { utcDate: '2026-01-03T10:03:26.043Z', phase: 'full_moon', phaseName: 'Dolunay', sign: 'Yengeç', signSymbol: '♋', degree: '13°' },
  { utcDate: '2026-01-18T19:52:39.367Z', phase: 'new_moon', phaseName: 'Yeni Ay', sign: 'Oğlak', signSymbol: '♑', degree: '28°' },
  { utcDate: '2026-02-01T22:09:49.657Z', phase: 'full_moon', phaseName: 'Dolunay', sign: 'Aslan', signSymbol: '♌', degree: '13°' },
  { utcDate: '2026-02-17T12:01:47.328Z', phase: 'solar_eclipse', phaseName: 'Güneş Tutulması', sign: 'Kova', signSymbol: '♒', degree: '28°' },
  { utcDate: '2026-03-03T11:38:32.022Z', phase: 'lunar_eclipse', phaseName: 'Ay Tutulması', sign: 'Başak', signSymbol: '♍', degree: '12°' },
  { utcDate: '2026-03-19T01:24:05.931Z', phase: 'new_moon', phaseName: 'Yeni Ay', sign: 'Balık', signSymbol: '♓', degree: '28°' },
  { utcDate: '2026-04-02T02:12:36.809Z', phase: 'full_moon', phaseName: 'Dolunay', sign: 'Terazi', signSymbol: '♎', degree: '12°' },
  { utcDate: '2026-04-17T11:52:21.628Z', phase: 'new_moon', phaseName: 'Yeni Ay', sign: 'Koç', signSymbol: '♈', degree: '27°' },
  { utcDate: '2026-05-01T17:23:47.564Z', phase: 'full_moon', phaseName: 'Dolunay', sign: 'Akrep', signSymbol: '♏', degree: '11°' },
  { utcDate: '2026-05-16T20:01:32.344Z', phase: 'new_moon', phaseName: 'Yeni Ay', sign: 'Boğa', signSymbol: '♉', degree: '25°' },
  { utcDate: '2026-05-31T08:45:48.291Z', phase: 'full_moon', phaseName: 'Dolunay', sign: 'Yay', signSymbol: '♐', degree: '9°' },
  { utcDate: '2026-06-15T02:54:39.007Z', phase: 'new_moon', phaseName: 'Yeni Ay', sign: 'İkizler', signSymbol: '♊', degree: '24°' },
  { utcDate: '2026-06-29T23:57:17.744Z', phase: 'full_moon', phaseName: 'Dolunay', sign: 'Oğlak', signSymbol: '♑', degree: '8°' },
  { utcDate: '2026-07-14T09:44:04.307Z', phase: 'new_moon', phaseName: 'Yeni Ay', sign: 'Yengeç', signSymbol: '♋', degree: '21°' },
  { utcDate: '2026-07-29T14:36:19.011Z', phase: 'full_moon', phaseName: 'Dolunay', sign: 'Kova', signSymbol: '♒', degree: '6°' },
  { utcDate: '2026-08-12T17:37:11.343Z', phase: 'solar_eclipse', phaseName: 'Güneş Tutulması', sign: 'Aslan', signSymbol: '♌', degree: '20°' },
  { utcDate: '2026-08-28T04:19:06.085Z', phase: 'lunar_eclipse', phaseName: 'Ay Tutulması', sign: 'Balık', signSymbol: '♓', degree: '4°' },
  { utcDate: '2026-09-11T03:27:28.467Z', phase: 'new_moon', phaseName: 'Yeni Ay', sign: 'Başak', signSymbol: '♍', degree: '18°' },
  { utcDate: '2026-09-26T16:49:32.233Z', phase: 'full_moon', phaseName: 'Dolunay', sign: 'Koç', signSymbol: '♈', degree: '3°' },
  { utcDate: '2026-10-10T15:50:36.724Z', phase: 'new_moon', phaseName: 'Yeni Ay', sign: 'Terazi', signSymbol: '♎', degree: '17°' },
  { utcDate: '2026-10-26T04:12:15.538Z', phase: 'full_moon', phaseName: 'Dolunay', sign: 'Boğa', signSymbol: '♉', degree: '2°' },
  { utcDate: '2026-11-09T07:02:42.392Z', phase: 'new_moon', phaseName: 'Yeni Ay', sign: 'Akrep', signSymbol: '♏', degree: '16°' },
  { utcDate: '2026-11-24T14:54:04.191Z', phase: 'full_moon', phaseName: 'Dolunay', sign: 'İkizler', signSymbol: '♊', degree: '2°' },
  { utcDate: '2026-12-09T00:52:31.284Z', phase: 'new_moon', phaseName: 'Yeni Ay', sign: 'Yay', signSymbol: '♐', degree: '16°' },
  { utcDate: '2026-12-24T01:28:45.040Z', phase: 'full_moon', phaseName: 'Dolunay', sign: 'Yengeç', signSymbol: '♋', degree: '2°' },
];

// Burçlara Göre Kolektif Yorumlar
export const SIGN_LUNATION_INTERPRETATIONS: Record<string, Record<LunationType, { title: string; collective: string; ritual: string }>> = {
  'Koç': {
    new_moon: {
      title: 'Cesaret, Girişim ve Bireysel Uyanış',
      collective: 'Yeni adımlar atmak, kendi gücünüzü geri almak ve ertelediğiniz projelere başlamak için eşsiz bir motivasyon kapısı açılıyor.',
      ritual: 'Kırmızı bir mum eşliğinde kendi sınırlarınızı koruma ve yeni hedeflerinize başlama niyetinizi yazın.',
    },
    full_moon: {
      title: 'Bireysel Sınırların ve Sabrın Hasadı',
      collective: 'Ben-biz dengesinde gerilimler açığa çıkabilir. Öfkeyi yapıcı bir eyleme dönüştürme ve bağımsızlığınızı ilan etme zamanı.',
      ritual: 'Öfke veya bastırılmış duygularınızı bir kağıda döküp güvenli bir şekilde yakın ve derin nefeslerle arının.',
    },
    solar_eclipse: {
      title: 'Kadersel Liderlik ve Kimlik Yenilenmesi',
      collective: 'Önümüzdeki 6 ay boyunca hayatınızın iplerini tamamen elinize alacağınız, radikal bir benlik inşası dönemi başlıyor.',
      ritual: 'Eski hayatınıza veda eden ve yeni lider kimliğinizi kucaklayan güçlü bir taahhüt mektubu yazın.',
    },
    lunar_eclipse: {
      title: 'Yıpratıcı Mücadelelerin Kadersel Kapanışı',
      collective: 'Sizi tüketen gereksiz rekabet ve kavgalar kadersel olarak sonlanıyor. Gücünüzü tüketen bağları kesme vakti.',
      ritual: 'Tuzlu suyla ellerinizi ve ayaklarınızı yıkayarak savaş enerjisinden arının.',
    },
  },
  'Boğa': {
    new_moon: {
      title: 'Maddi Güvenlik, Özdeğer ve Kökleşme',
      collective: 'Finansal yatırımlar, üretkenlik ve bedensel huzur için kalıcı tohumlar ekme zamanı. Değerinizi hatırlayın.',
      ritual: 'Toprağa dokunarak veya saksıya bir tohum ekerek bereket niyetlerinizi toprak anaya emanet edin.',
    },
    full_moon: {
      title: 'Finansal Netleşme ve Değerlerin İmtihanı',
      collective: 'Maddi konularda bir hasat dönemi. Aşırı tutuculuk ile akışa güvenme arasındaki gerilim çözüme ulaşıyor.',
      ritual: 'Cüzdanınızı veya bereket taşlarınızı ay ışığında arındırın ve bolluk frekansına odaklanın.',
    },
    solar_eclipse: {
      title: 'Maddi Boyutta 6 Aylık Köklü Devrim',
      collective: 'Önümüzdeki 6 ay boyunca gelir kaynaklarınız, üretim alanlarınız ve dünyaya bakış açınız köklü biçimde değişiyor.',
      ritual: 'Gelecek 6 aylık finansal vizyonunuzu ve özdeğer hedeflerinizi yeşil mürekkeple yazıp saklayın.',
    },
    lunar_eclipse: {
      title: 'Korku ve Bağımlılıkların Kadersel Vedası',
      collective: 'Maddi kaygılar ve kaybetme korkusuyla tutunduğunuz ne varsa serbest bırakılıyor. Ruhsal özgürlük başlıyor.',
      ritual: 'Korkularınızı yazdığınız kağıdı yırtarak toprağa gömün; dönüşüme izin verin.',
    },
  },
  'İkizler': {
    new_moon: {
      title: 'Zihinsel Açıklık, Yeni Bağlantılar ve İletişim',
      collective: 'Yeni fikirler, eğitimler, seyahatler ve anlaşmalar için zihnin en parlak çalıştığı evre. Yeni bir vizyon edinin.',
      ritual: 'Bir günlük başlatın ve zihninize gelen ilham verici fikirleri sansürlemeden listeleyin.',
    },
    full_moon: {
      title: 'Bilgi Kirliliğinden Gerçeğe Ulaşma',
      collective: 'Kararsızlıkların bittiği, hakikatin gün yüzüne çıktığı bir tamamlama anı. Net bir konuşma veya imza gündeme gelebilir.',
      ritual: 'Zihninizi dinlendirmek için lavanta kokusu eşliğinde 10 dakika sessiz meditasyon yapın.',
    },
    solar_eclipse: {
      title: 'İletişim ve Algıda 6 Aylık Kadersel Açılım',
      collective: 'Önümüzdeki 6 ay boyunca çevreniz, kardeşler/yakın çevre ilişkileriniz ve düşünce yapınız yepyeni bir seviyeye evriliyor.',
      ritual: 'Öğrenmek istediğiniz kadim ilimleri veya yazmak istediğiniz projeyi belirleyip ilk sayfasını açın.',
    },
    lunar_eclipse: {
      title: 'Yalanlar, Yanılsamalar ve Zihinsel Detoks',
      collective: 'Size hizmet etmeyen gereksiz dedikodular, yüzeysel ilişkiler ve zihinsel yükler kadersel olarak geride kalıyor.',
      ritual: 'Telefonunuzdaki ve dijital dünyanızdaki gereksiz yükleri temizleyerek alan açın.',
    },
  },
  'Yengeç': {
    new_moon: {
      title: 'Duygusal Şifa, Yuva ve İçsel Güvenlik',
      collective: 'Ailenize, evinize ve ruhsal sığınağınıza odaklanma zamanı. Kendi kalbinize şefkat göstermek için güçlü bir başlangıç.',
      ritual: 'Evinizde adaçayı veya üzerlik tütsüsü yakarak alanınızı arındırın ve yuvaya huzur dileyin.',
    },
    full_moon: {
      title: 'Duyguların Zirvesi ve Ailevi Netleşmeler',
      collective: 'Geçmişin yükleri ve çocukluk anıları su yüzüne çıkabilir. Sezgileriniz son derece güçlü; rüyalarınıza dikkat edin.',
      ritual: 'Bir kase suya ay ışığını yansıtıp niyetinizi suya fısıldayın ve sabah o suyla yüzünüzü yıkayın.',
    },
    solar_eclipse: {
      title: 'Ruhsal Kökler ve Ailede 6 Aylık Kadersel Dönüşüm',
      collective: 'Önümüzdeki 6 ay ev değişimi, taşınma, aile kurma veya ata bağlarını şifalandırma konusunda dönüm noktası olacak.',
      ritual: 'Atalarınıza sevgi ve teşekkür gönderen bir dua veya niyet meditasyonu yapın.',
    },
    lunar_eclipse: {
      title: 'Geçmişin Prangalarından Kadersel Kopuş',
      collective: 'Yıllardır taşıdığınız melankoli, alınganlık ve kurban psikolojisi kadersel olarak son buluyor. Yeniden doğuyorsunuz.',
      ritual: 'Eski fotoğraflardan veya anılardan sizi aşağı çeken bir objeyi hayatınızdan sevgiyle çıkarın.',
    },
  },
  'Aslan': {
    new_moon: {
      title: 'Yaratıcılık, Sahne ve Kalbin Coşkusu',
      collective: 'Özgüveninizi sahneye koyma, aşk kapılarını aralama ve yaratıcı projelere imza atma vakti. Kendi ışığınızı saklamayın.',
      ritual: 'Altın renkli bir eşyanızı takın ve aynaya bakıp kendi değerinizi ve yeteneklerinizi onaylayın.',
    },
    full_moon: {
      title: 'Ego Sınavı ve Hak Ettiğin Değeri Görme',
      collective: 'Yeteneğinizin ve emeklerinizin takdir gördüğü bir doruk noktası. Aşırı gururdan kaçınarak kalpten sevmeye odaklanın.',
      ritual: 'Güneş taşı veya sitrin taşıyla kalbinizin üzerine dokunup sevgi titreşimini yükseltin.',
    },
    solar_eclipse: {
      title: 'Kader Sahnesinde 6 Aylık Büyük Rol Değişimi',
      collective: 'Önümüzdeki 6 ay boyunca hayatınızın parlayan yıldızı olacağınız, liderlik ve yaratıcılıkta kadersel kapılar açılıyor.',
      ritual: 'Kendinizi 6 ay sonra nerede görmek istediğinizi büyük bir vizyon panosu olarak resmedin.',
    },
    lunar_eclipse: {
      title: 'Göz Boyayan Işıkların Sönüşü ve Özgünlük',
      collective: 'Sahte alkışlar, yüzeysel beğeniler ve toksik gurur kadersel olarak temizleniyor. Gerçek dostlar ve saf yetenek kalıyor.',
      ritual: 'Sizi sadece onay almak için yaptığınız rollerden özgürleştirecek bir affetme meditasyonu yapın.',
    },
  },
  'Başak': {
    new_moon: {
      title: 'Sağlık, Düzen, Arınma ve Hizmet',
      collective: 'Günlük rutinlerinizi düzenlemek, bedeninizi şifalandırmak ve detaylı planlar yapmak için en verimli evre.',
      ritual: 'Detoks içeceği hazırlayın, çalışma alanınızı kusursuzca düzenleyin ve hedeflerinizi maddeler halinde yazın.',
    },
    full_moon: {
      title: 'Mükemmeliyetçilik Tuzağını Aşma ve Hasat',
      collective: 'Aşırı eleştirellik ve kaygıyı geride bırakma zamanı. Emek verdiğiniz bir projenin veya sağlık sürecinin neticesini alıyorsunuz.',
      ritual: 'Bedeninizi esneten nefes egzersizleri yapın ve kendinizi olduğunuz gibi kabullenin.',
    },
    solar_eclipse: {
      title: 'İş, Sağlık ve Rutinlerde 6 Aylık Kadersel İyileşme',
      collective: 'Önümüzdeki 6 ay boyunca mesleki uzmanlığınız, çalışma şartlarınız ve beden sağlığınız baştan ayağa yenilenecek.',
      ritual: 'Bedeninize ve hayatınıza saygı gösteren bir sağlık ve disiplin sözleşmesi imzalayın.',
    },
    lunar_eclipse: {
      title: 'Yük Olan Sorumluluklardan Kadersel Kurtuluş',
      collective: 'Başkalarının sorumluluğunu üstlenmekten yorulduğunuz döngü bitiyor. Sınır çizmeyi kadersel olarak öğreniyorsunuz.',
      ritual: 'Sizin göreviniz olmayan işleri sahiplerine iade ettiğinizi imgeleyerek nefes verin.',
    },
  },
  'Terazi': {
    new_moon: {
      title: 'İlişkiler, Uyum, Adalet ve Estetik',
      collective: 'Yeni bir ortaklık, aşka yelken açma veya hayatınızdaki dengesizlikleri giderme dönemi. Barışçıl adımlar kazandırır.',
      ritual: 'Gül kuvars taşı eşliğinde hayatınıza hakiki sevgi ve adil ortaklıkları davet eden bir niyet tutun.',
    },
    full_moon: {
      title: 'İkili İlişkilerde Aynalama ve Nihai Karar',
      collective: 'İlişkilerde "ben" ve "sen" arasındaki dinamikler tüm çıplaklığıyla görünür oluyor. Bitmesi gereken ortaklıklar netleşir.',
      ritual: 'İlişkilerinizde sizi huzursuz eden beklentileri bir kağıda yazıp suya bırakın.',
    },
    solar_eclipse: {
      title: 'İlişki ve Evlilik Aksında 6 Aylık Kadersel Kader',
      collective: 'Önümüzdeki 6 ay kadersel bir ruh eşiyle karşılaşma, evlilik veya önemli bir hukuki/iş ortaklığı dönüm noktası getirecek.',
      ritual: 'Hayatınızda istediğiniz dengeli ilişki profilini en ince detayına kadar yazıp pembe bir kurdeleyle sarın.',
    },
    lunar_eclipse: {
      title: 'Bağımlı ve Toksik İlişkilerin Kadersel Sonu',
      collective: 'Sırf yalnız kalmamak için taviz verdiğiniz her bağ kadersel olarak kopuyor. Kendi dengenizi buluyorsunuz.',
      ritual: 'Kordon kesme (enerji bağı koparma) meditasyonu ile eski sevgililerden ve tükenmiş bağlardan özgürleşin.',
    },
  },
  'Akrep': {
    new_moon: {
      title: 'Küllerinden Doğuş, Tutku ve Gizli Güç',
      collective: 'Bilinçaltınızı temizlemek, finansal krizleri fırsata çevirmek ve sezgilerinizi uyandırmak için derin bir dönüşüm kapısı.',
      ritual: 'Siyah turmalin veya obsidyen taşıyla aura temizliği yapın, en derin korkunuzu güce dönüştürmeye niyet edin.',
    },
    full_moon: {
      title: 'Karanlığın Aydınlanması ve Büyük Yüzleşme',
      collective: 'Sırlara, gizli kalan gerçeklere ve finansal paylaşımlara dair güçlü bir aydınlanma. Güç savaşlarına girmekten kaçının.',
      ritual: 'Tuzlu banyo yaparak aurik tortuları arındırın ve sezgilerinizi dinleyin.',
    },
    solar_eclipse: {
      title: 'Ruhsal ve Finansal 6 Aylık Simya Dönemi',
      collective: 'Önümüzdeki 6 ay boyunca ortaklaşa gelirler, yatırımlar ve okült ilimlerde muazzam bir kadersel dönüşüm yaşanacak.',
      ritual: 'Korkularınızın arkasında saklanan gerçek potansiyelinizi uyandırma yemini edin.',
    },
    lunar_eclipse: {
      title: 'Zehirli Hırsların ve Kıskançlığın Kadersel Sonu',
      collective: 'İntikam, şüphe ve aşırı kontrol tutkusu kadersel bir şokla terk ediliyor. Saf şifa ve güven frekansı açılıyor.',
      ritual: 'Geçmişte size haksızlık yapanları kendi içsel özgürlüğünüz için tamamen affedin ve yükü evrene bırakın.',
    },
  },
  'Yay': {
    new_moon: {
      title: 'Yüksek Vizyon, İnanç, Keşif ve Özgürlük',
      collective: 'Yeni felsefeler keşfetmek, yurt dışı adımları, akademik hedefler ve hayatın anlamına doğru kanatlanma zamanı.',
      ritual: 'Gözlerinizi kapatıp evrenin sonsuz genişliğini imgeleyin ve inançlarınızı yenileyin.',
    },
    full_moon: {
      title: 'İnançların Sınavı ve Büyük Resmin Görünmesi',
      collective: 'Küçük ayrıntılarda boğulmaktan kurtulup hayatınızın büyük tablosunu görüyorsunuz. Uzun süren bir davanın veya eğitimin sonu.',
      ritual: 'Mavi bir mum yakarak bilgelik ve ilahi adalet niyetlerinizi dile getirin.',
    },
    solar_eclipse: {
      title: 'Hayat Felsefesi ve Yurt Dışı Aksında 6 Aylık Kadersel Sıçrama',
      collective: 'Önümüzdeki 6 ay boyunca inançlarınız, dünya görüşünüz ve uluslararası bağlantılarınız kadersel biçimde genişliyor.',
      ritual: 'Ruhsal pusulanızı belirleyin ve hayat amacınızı tek bir cümleyle özetleyip başucunuza koyun.',
    },
    lunar_eclipse: {
      title: 'Dogmaların ve Fanatizmin Kadersel Çöküşü',
      collective: 'Artık geçerliliğini yitirmiş katı inançlar ve boş vaatler kadersel olarak sonlanıyor. Gerçek hakikate uyanış.',
      ritual: 'Kendi kendinizi sınırlandırdığınız "Asla yapamam" dediğiniz inançları yakın.',
    },
  },
  'Oğlak': {
    new_moon: {
      title: 'Kariyer, Statü, Disiplin ve Zirve Hedefleri',
      collective: 'Kariyerinizde somut bir yapı inşa etmek, otoritenizi güçlendirmek ve uzun vadeli projelere temel atmak için ideal zaman.',
      ritual: '10 yıllık büyük hayat hedeflerinizi hiyerarşik olarak kağıda dökün ve kararlılık yemini edin.',
    },
    full_moon: {
      title: 'Başarıların Hasadı ve Sorumluluk Yüzleşmesi',
      collective: 'Toplum önündeki duruşunuz ve kariyerinizde bir dönemin zirvesi veya kapanışı. Aşırı katı olmaktan kaçının.',
      ritual: 'Taş veya kristal gibi ağır, köklü bir objeyi elinizde tutarak sabrınızı ve dirayetinizi kutsayın.',
    },
    solar_eclipse: {
      title: 'Kariyer ve Zirvede 6 Aylık Kadersel İnşa',
      collective: 'Önümüzdeki 6 ay boyunca mesleki unvanınız, toplumdaki konumunuz ve sorumluluklarınız baştan yazılıyor.',
      ritual: 'Zirveye giden yolda bırakmanız gereken yükleri ve üstleneceğiniz yeni liderliği yazın.',
    },
    lunar_eclipse: {
      title: 'Tükenmiş Sistemlerin ve Katı Otoritenin Sonu',
      collective: 'Sizi duygusuzlaştıran aşırı işkoliklik ve katı kurallar kadersel olarak yıkılıyor. Duygu ve mantık dengeleniyor.',
      ritual: 'Başarısızlık korkunuzu serbest bırakın ve kendinizi sadece unvanlarınızla tanımlamaktan vazgeçin.',
    },
  },
  'Kova': {
    new_moon: {
      title: 'Gelecek Vizyonu, Özgünlük, Teknoloji ve Kolektif',
      collective: 'Sıra dışı fikirleri hayata geçirmek, topluluklarla bir araya gelmek ve çağı yakalayan adımlar atmak için eşsiz bir zemin.',
      ritual: 'Geleceğe bir mektup yazın; insanlığa ve kendinize sunmak istediğiniz özgün projeyi mühürleyin.',
    },
    full_moon: {
      title: 'Bireysel Dehanın Kolektifle Buluşması',
      collective: 'Dostluklar, dernekler ve sosyal çevrelerde netleşme anı. Sizi kısıtlayan kalıpları kırıp özgürlüğünüzü ilan edin.',
      ritual: 'Yıldızları izleyerek evrensel bilinçle bağlantı kurun ve kalbinizi kolektif şifaya açın.',
    },
    solar_eclipse: {
      title: 'Çağ Atlatacak 6 Aylık Kadersel Uyanış',
      collective: 'Önümüzdeki 6 ay boyunca dijital projeler, vizyoner atılımlar ve sosyal çevrenizde devrim niteliğinde kadersel değişimler olacak.',
      ritual: 'Kendi özgün dehanızı kutlayan ve tabuları yıkan bir vizyon meditasyonu yapın.',
    },
    lunar_eclipse: {
      title: 'Sahte İdeallerin ve Samimiyetsiz Grupların Sonu',
      collective: 'Sizi sadece kullanan arkadaş grupları ve anlamsız sosyal davalar kadersel olarak eleniyor. Gerçek dostlar kalıyor.',
      ritual: 'Sosyal çevrenizde enerji vampirliği yapan ilişkileri zihninizde serbest bırakın.',
    },
  },
  'Balık': {
    new_moon: {
      title: 'Ruhsal Uyanış, Teslimiyet, Sezgi ve İlahi Akış',
      collective: 'Evrenle bir olma, meditasyon, sanat ve sınırsız empati zamanı. Mantığı bir kenara bırakıp kalbin sesini dinleyin.',
      ritual: 'Deniz tuzuyla arınma banyosu yapın, ilahi müziğe kendinizi bırakıp rüyalarınızı not edin.',
    },
    full_moon: {
      title: 'Ruhun Aynası ve İllüzyonların Dağılması',
      collective: 'Kendi kendinizi kandırdığınız veya aşırı fedakarlık yaptığınız konular gün yüzüne çıkıyor. İlahi adalete güvenin.',
      ritual: 'Ametist veya selenit kristaliyle tepe çakranızı aktive ederek ilahi rehberlik talep edin.',
    },
    solar_eclipse: {
      title: 'Bilinçaltında ve Ruhta 6 Aylık Kozmik Dönüşüm',
      collective: 'Önümüzdeki 6 ay boyunca ruhsal yetenekleriniz, yaratıcı sanatınız ve karmik yükleriniz baştan aşağı şifalanacak.',
      ritual: 'Tüm evrene şartsız koşulsuz sevgi ve şifa gönderen küresel bir niyet meditasyonu yapın.',
    },
    lunar_eclipse: {
      title: 'Kurban Psikolojisi ve Bağımlılıkların Kadersel Sonu',
      collective: 'Kendinizi feda ettiğiniz toksik merhamet döngüsü kadersel olarak son buluyor. Ruhunuz özgürleşiyor.',
      ritual: 'Eski pişmanlıklarınızı suya akıtın; "Her şey olması gerektiği gibiydi, affediyorum ve özgürüm" deyin.',
    },
  },
};

// 12 Ev Bireysel Harita Etkileri (Kişinin Natal Haritasında Hangi Eve Düştüğüne Göre)
// Ezoterik İnisiyasyon Portalı: Alt Bilinç (Gölge) ve Üst Bilinç (Ruh Hali) Ayrımı
export const HOUSE_LUNATION_INTERPRETATIONS: Record<number, Record<LunationType, HouseLunationInterpretation>> = {
  1: {
    new_moon: {
      title: '1. Ev: Fiziksel Beden, İmaj ve Yeni Benlik',
      personalImpact: 'Doğrudan kimliğinizi, dış görünüşünüzü ve kişisel hedeflerinizi yenileme fırsatı.',
      advice: 'Sağlığınıza, tarzınıza ve kendinize yatırım yapın. İlk adımı cesaretle atın.',
      portalName: '1. Ev: Beden Tapınağı & Saf İrade Portalı',
      portalMeaning: 'Ruhun dünyevi kıyafeti, fiziksel beden ve benlik bilincinin kozmik inisiyasyonu.',
      shadowState: 'Dürtüsel öfke, sabırsızlık, benmerkezcilik, yetersizlik hissi ve bedensel aşırı gerginlik.',
      elevatedState: 'Ruhun ilahi kıyafetini kuşanması, saf irade, bilinçli öncülük ve ışık saçan ruhsal liderlik.',
      spiritualAdvice: 'Kök ve Üçüncü Göz hizalanması; bedeni kutsal bir mabet kabul edip topraklanma çalışması yapın.',
    },
    full_moon: {
      title: '1. Ev: Bireysel Gücün Zirvesi ve Kişisel Farkındalık',
      personalImpact: 'Kişisel sınırlarınızı çizdiğiniz, başkalarının beklentilerini bir kenara koyup kendinizi seçtiğiniz bir an.',
      advice: 'Yorulmuş bedeninizi dinlendirin, aşırı tepkisellikten kaçının.',
      portalName: '1. Ev: Beden Tapınağı & Saf İrade Portalı',
      portalMeaning: 'Ruhun dünyevi kıyafeti, fiziksel beden ve benlik bilincinin kozmik inisiyasyonu.',
      shadowState: 'Aşırı savunmacılık, maskelerin arkasına saklanma, başkalarını suçlama eğilimi.',
      elevatedState: 'Kendi hakikatinde tam merkezlenme, başkalarının onayına ihtiyaç duymadan var olma olgunluğu.',
      spiritualAdvice: 'Tuzlu su banyosu ve kalp merkezinde sessiz nefes; sınırlarını sevgiyle koruma pratiği.',
    },
    solar_eclipse: {
      title: '1. Ev: Hayatınızın Yönünde 6 Aylık Kadersel Başlangıç',
      personalImpact: 'Önümüzdeki 6 ay boyunca hayatınızın ana rotası, kariyeriniz ve imajınız baştan ayağa değişiyor.',
      advice: 'Eski sizi geride bırakmaktan korkmayın; bu sizin kadersel yeniden doğuşunuz.',
      portalName: '1. Ev: Beden Tapınağı & Saf İrade Portalı',
      portalMeaning: 'Ruhun dünyevi kıyafeti, fiziksel beden ve benlik bilincinin kozmik inisiyasyonu.',
      shadowState: 'Eski kimliği kaybetme korkusuyla tutunma, felç edici gelecek kaygısı ve sahte roller.',
      elevatedState: '6 aylık kadersel sıçrama ile ruhun ana misyonuna uyanışı; karizmatik ve ilham veren yeni bir benlik.',
      spiritualAdvice: 'Eski yaşam sözleşmelerine veda meditasyonu; yeni kimliğe adanmış yazılı bir niyet mektubu.',
    },
    lunar_eclipse: {
      title: '1. Ev: Eski Kimliğin Kadersel Vedası',
      personalImpact: 'Size artık dar gelen eski alışkanlıklar ve roller kadersel olarak sonlanıyor.',
      advice: 'Yitirdiklerinizin yasını tutmak yerine açılan temiz sayfaya odaklanın.',
      portalName: '1. Ev: Beden Tapınağı & Saf İrade Portalı',
      portalMeaning: 'Ruhun dünyevi kıyafeti, fiziksel beden ve benlik bilincinin kozmik inisiyasyonu.',
      shadowState: 'Kurban psikolojisi, geçmişe takılı kalma, terk edilmişlik ve boşluk hissi.',
      elevatedState: 'Ağır karmik maskelerin düşüşü; ruhun arınmış, hafiflemiş ve berrak benliğe kavuşması.',
      spiritualAdvice: 'Aynaya bakarak öz-şefkat ve affetme ritüeli; geçmiş benliğe teşekkür edip onu serbest bırakın.',
    },
  },
  2: {
    new_moon: {
      title: '2. Ev: Para, Gelir Kaynakları ve Özdeğer',
      personalImpact: 'Yeni bir kazanç kapısı aralamak, bütçe yapmak ve özsaygınızı yükseltmek için mükemmel zaman.',
      advice: 'Kendi yeteneklerinize güvenerek maddi hedefler belirleyin.',
      portalName: '2. Ev: İlahi Kaynak, Terazi/Akrep Karması & Özdeğer Portalı',
      portalMeaning: '±15 gün karma sınavları, güç dengeleri, mülkiyet ve kaynakların ilahi adaletle yönetimi.',
      shadowState: 'Maddi kaygılar, gücü kötüye kullanma hırsı, cimrilik veya kötü niyetli bir otoritenin mali baskısı.',
      elevatedState: 'Maddiyatın ilahi bir emanet olduğunun kavranması; özdeğerin parayla değil ruhsal bilinçle inşa edilmesi.',
      spiritualAdvice: 'Sakral çakra şifası ve Kalp açıklığı; toprağa dokunma ve bolluk frekansında şükür pratiği.',
    },
    full_moon: {
      title: '2. Ev: Maddi Hasat ve Değer Yüzleşmesi',
      personalImpact: 'Beklediğiniz bir para gelebilir veya harcamalarınızı dengelemeniz gereken bir tablo oluşabilir.',
      advice: 'Fevri harcamalardan kaçının, gerçek değerinizi parayla ölçmeyin.',
      portalName: '2. Ev: İlahi Kaynak, Terazi/Akrep Karması & Özdeğer Portalı',
      portalMeaning: '±15 gün karma sınavları, güç dengeleri, mülkiyet ve kaynakların ilahi adaletle yönetimi.',
      shadowState: 'Parayla insanları manipüle etme arzusu, ani borç paniği ve yetersizlik krizleri.',
      elevatedState: 'Evrensel adaletle gelen hak edişler; kaynakların hem kendisi hem bütüne fayda için bereketlenmesi.',
      spiritualAdvice: 'Cömertlik ritüeli; ihtiyaç sahiplerine koşulsuz bir bağış yaparak alma-verme dengesini mühürleyin.',
    },
    solar_eclipse: {
      title: '2. Ev: Finansal Hayatınızda 6 Aylık Kadersel Sıçrama',
      personalImpact: 'Önümüzdeki 6 ay boyunca gelir modeliniz, maaşınız veya mülkleriniz kökten dönüşebilir.',
      advice: 'Geleceğinizi güvence altına alacak akılcı yatırımlara yönelin.',
      portalName: '2. Ev: İlahi Kaynak, Terazi/Akrep Karması & Özdeğer Portalı',
      portalMeaning: '±15 gün karma sınavları, güç dengeleri, mülkiyet ve kaynakların ilahi adaletle yönetimi.',
      shadowState: 'Kötü bir yöneticinin haksız baskısına maruz kalma veya kendi gücünü başkalarına kaptırma hissi.',
      elevatedState: '6 ay boyunca sürecek kadersel zenginleşme; kaynakları etik ve ilahi yasaya uygun şekilde çoğaltma gücü.',
      spiritualAdvice: 'Kök ve Sakral çakraları hizalayan yeşil kristal tefekkürü; etik kazanç yemini.',
    },
    lunar_eclipse: {
      title: '2. Ev: Maddi Bağımlılıkların ve Kaygıların Sonu',
      personalImpact: 'Sizi tüketen maddi borçlar veya parasal korkular kadersel bir çözümle geride kalıyor.',
      advice: 'Bolluğun sizin doğal hakkınız olduğunu hatırlayın.',
      portalName: '2. Ev: İlahi Kaynak, Terazi/Akrep Karması & Özdeğer Portalı',
      portalMeaning: '±15 gün karma sınavları, güç dengeleri, mülkiyet ve kaynakların ilahi adaletle yönetimi.',
      shadowState: 'Mülk ve statü kaybı korkusu, borç batağında hissetme ve güvensizlik krizi.',
      elevatedState: 'Maddi prangaların kırılması; ruhun gerçek zenginliğin kendi ilahi özünde olduğunu idrak etmesi.',
      spiritualAdvice: 'Eski finansal kaygıları kağıda döküp yakarak serbest bırakma; borç karmasını affetme niyeti.',
    },
  },
  3: {
    new_moon: {
      title: '3. Ev: İletişim, Eğitim, Yakın Çevre ve Ticaret',
      personalImpact: 'Yeni bir eğitime başlamak, sözleşme imzalamak veya bir dijital projeyi hayata geçirmek için harika.',
      advice: 'Fikirlerinizi açıkça paylaşın; kardeşler ve yakın çevreyle bağları tazeleyin.',
      portalName: '3. Ev: Güncelleme Portalı & Kozmik Zihin (Yay/Oğlak Aksı)',
      portalMeaning: '±15 gün zihinsel formatlanma, frekans güncellemesi, algı sıçraması ve kadim bilginin zihne inmesi.',
      shadowState: 'Zihinsel kaos, dedikodu, yakın çevreyle gereksiz sürtüşmeler, vesvese ve odaklanamama.',
      elevatedState: 'Zihne kozmik güncelleme inmesi; telepatik açıklık, berrak idrak ve saf hakikat lisanı.',
      spiritualAdvice: 'Boğaz çakra temizliği; kelimeleri büyü gibi kullanın, gereksiz konuşmaları kesip zihinsel sessizlik (mauna) uygulayın.',
    },
    full_moon: {
      title: '3. Ev: Bir Kararın Netleşmesi ve Zihinsel Hasat',
      personalImpact: 'Uzun süredir düşündüğünüz bir fikri nihai karara bağlayabilir, beklediğiniz bir haberi alabilirsiniz.',
      advice: 'Trafikte ve mesajlaşmalarda sakin kalın; kelimelerinizi özenle seçin.',
      portalName: '3. Ev: Güncelleme Portalı & Kozmik Zihin (Yay/Oğlak Aksı)',
      portalMeaning: '±15 gün zihinsel formatlanma, frekans güncellemesi, algı sıçraması ve kadim bilginin zihne inmesi.',
      shadowState: 'Sözlü saldırganlık, bilgi kirliliğiyle zehirlenme, yalan ve yanıltıcı haberlere kapılma.',
      elevatedState: 'Gerçeğin maskeleri delip aydınlanması; önemli bir anlaşma veya projenin hakikatle taçlanması.',
      spiritualAdvice: 'Mavi kalsit veya lapis lazuli ile boğaz meditasyonu; yazarak zihinsel detoks yapın.',
    },
    solar_eclipse: {
      title: '3. Ev: Zihinsel Vizyonda 6 Aylık Kadersel Atılım',
      personalImpact: 'Önümüzdeki 6 ay boyunca medya, ticaret, yazarlık veya yeni bir çevre konusunda kadersel bir kapı açılıyor.',
      advice: 'Sözünüzün gücünü keşfedin ve bilgiyi yaymaktan çekinmeyin.',
      portalName: '3. Ev: Güncelleme Portalı & Kozmik Zihin (Yay/Oğlak Aksı)',
      portalMeaning: '±15 gün zihinsel formatlanma, frekans güncellemesi, algı sıçraması ve kadim bilginin zihne inmesi.',
      shadowState: 'Eski düşünce kalıplarının çöküşü karşısında panik; zihinsel yorgunluk ve yakın çevreden yabancılaşma.',
      elevatedState: '6 ay boyunca zihnin adeta yeniden programlanması; yüksek boyut öğretilerini dünyaya aktaran bir elçi olma.',
      spiritualAdvice: 'Kadim ilimleri araştırma ve günlük yazma; düşüncelerin kaderi nasıl yarattığını gözlemleme pratiği.',
    },
    lunar_eclipse: {
      title: '3. Ev: Yanıltıcı Bilgiler ve Çevre Temizliği',
      personalImpact: 'Size faydası olmayan dedikoducu ilişkiler ve gereksiz zihinsel karmaşalar kadersel olarak eleniyor.',
      advice: 'Zihinsel detoks yapın, gerçeği çarpıtan insanlarla mesafenizi koruyun.',
      portalName: '3. Ev: Güncelleme Portalı & Kozmik Zihin (Yay/Oğlak Aksı)',
      portalMeaning: '±15 gün zihinsel formatlanma, frekans güncellemesi, algı sıçraması ve kadim bilginin zihne inmesi.',
      shadowState: 'Kardeşler veya komşularla sert kopuşlar; yanılgıların yarattığı zihinsel hayal kırıklığı.',
      elevatedState: 'Zihni kirleten tüm gereksiz bağların kesilmesi; kristal berraklığında bir akıl ve dinginlik.',
      spiritualAdvice: 'Dijital detoks ve lavanta kokusu eşliğinde sessizlik orucu.',
    },
  },
  4: {
    new_moon: {
      title: '4. Ev: Yuva, Aile, Ev ve Kökler',
      personalImpact: 'Evinizi yenilemek, taşınmak veya ailevi meselelerde huzurlu yeni bir sayfa açmak için ideal.',
      advice: 'Evinizi arındırın ve kalbinizi dinlendirecek sıcak bir alan yaratın.',
      portalName: '4. Ev: Gen & Irk Bağlantısı Portalı (Oğlak Aksı)',
      portalMeaning: '±15 gün ata bilinci uyanışı, kendi ırkının ve kök soyunun iletişime geçmesi, hücresel hafızanın şifası.',
      shadowState: 'Köklerinden kopmuşluk hissi, derin yalnızlık, evde gerginlik ve ailevi yaraların kanaması.',
      elevatedState: 'Atasal koruma kalkanının hissedilmesi; köklerin gücünü arkasına alarak dünyaya sağlam basma erdemi.',
      spiritualAdvice: 'Kök çakra çalışması; çıplak ayakla toprağa basma ve atalara şükran/bağışlama duası okuma.',
    },
    full_moon: {
      title: '4. Ev: Ailevi Netleşmeler ve İçsel Denge',
      personalImpact: 'Ev veya mülk konularında bir sonuca ulaşabilir, aile büyükleriyle önemli bir konuyu çözebilirsiniz.',
      advice: 'Kariyer ve ev dengesini gözetin; duygularınızı bastırmayın.',
      portalName: '4. Ev: Gen & Irk Bağlantısı Portalı (Oğlak Aksı)',
      portalMeaning: '±15 gün ata bilinci uyanışı, kendi ırkının ve kök soyunun iletişime geçmesi, hücresel hafızanın şifası.',
      shadowState: 'Geçmişin travmatik anılarına hapsolma, eve sığamama, ebeveynlerle sert hesaplaşmalar.',
      elevatedState: 'Ailevi karmaların çözülmesi; evin kutsal bir tapınağa ve sevgi kalesine dönüşmesi.',
      spiritualAdvice: 'Evin dört köşesine adaçayı/üzerlik tütsüsü gezdirme; geçmiş kederleri tuzlu suyla yıkayıp akıtma.',
    },
    solar_eclipse: {
      title: '4. Ev: Ev ve Ailede 6 Aylık Kadersel Dönüm Noktası',
      personalImpact: 'Önümüzdeki 6 ay mülk edinme, şehir/ülke değiştirme veya ailevi yapıda köklü kadersel değişimler getirebilir.',
      advice: 'Köklerinizi sağlamlaştırın; ait olduğunuz yeri yeniden tanımlayın.',
      portalName: '4. Ev: Gen & Irk Bağlantısı Portalı (Oğlak Aksı)',
      portalMeaning: '±15 gün ata bilinci uyanışı, kendi ırkının ve kök soyunun iletişime geçmesi, hücresel hafızanın şifası.',
      shadowState: 'Kendi ırkı/ailesiyle iletişim kopukluğu, yersiz yurtsuzluk hissi ve derin duygusal güvensizlik.',
      elevatedState: 'Kendi soyunun ve ruh ırkının bilgeliğini uyandırma; yeryüzünde kalıcı, kutsal bir mabet inşa etme gücü.',
      spiritualAdvice: 'Soy ağacı meditasyonu; anne-baba hattındaki tüm blokajları affetme ve serbest bırakma tefekkürü.',
    },
    lunar_eclipse: {
      title: '4. Ev: Geçmişin Prangalarından Kurtuluş',
      personalImpact: 'Ata karması, çocukluk travmaları veya sizi kısıtlayan ailevi kalıplar kadersel olarak şifalanıyor.',
      advice: 'Affedin ve serbest bırakın; kendi özgür yuvanızı kurun.',
      portalName: '4. Ev: Gen & Irk Bağlantısı Portalı (Oğlak Aksı)',
      portalMeaning: '±15 gün ata bilinci uyanışı, kendi ırkının ve kök soyunun iletişime geçmesi, hücresel hafızanın şifası.',
      shadowState: 'Ata karmasının ağırlığı altında ezilme, kurban rolünü devam ettirme ve suçluluk duygusu.',
      elevatedState: 'Nesiller boyu süren karmik zincirlerin kopması; soyun ilk uyanmış ve arınmış bireyi olma onuru.',
      spiritualAdvice: 'Kök çakra topraklaması; atalardan gelen yükleri sembolik olarak iade edip kendi özgür yolunu kutsama.',
    },
  },
  5: {
    new_moon: {
      title: '5. Ev: Aşk, Yaratıcılık, Çocuklar ve Hobiler',
      personalImpact: 'Kalbinizi yeni bir aşka açmak, sanatsal bir üretime başlamak ve hayatın tadını çıkarmak için en neşeli evre.',
      advice: 'İçinizdeki çocuğu serbest bırakın; eğlenmeyi kendinize hak görün.',
      portalName: '5. Ev: İçimizdeki Tanrı Portalı & Birlik Bilinci (Kova/Balık Aksı)',
      portalMeaning: '±15 gün bütün evrenle bir olma hissi, ilahi yaratım kıvılcımı ve kalpten doğan saf neşe.',
      shadowState: 'Sahte kibir, sürekli onay ve alkış bağımlılığı, narsistik kırılganlık, tükenmişlik.',
      elevatedState: 'İlahi Yaratıcı kıvılcımın kalpte parlaması; evrenle bir olma hissi ve saf ilhamla eser üretme.',
      spiritualAdvice: 'Solar Pleksus ve Kalp hizalanması; egoyu ilahi aşka teslim edip sanatsal bir üretim yapın.',
    },
    full_moon: {
      title: '5. Ev: Aşkta Doruk Noktası ve Yaratıcı Hasat',
      personalImpact: 'Bir flörtün adı konabilir veya yaratıcı bir eseriniz tamamlanıp görünürlük kazanabilir.',
      advice: 'Aşkta aşırı dramadan kaçının; kalpten gelen samimiyete tutunun.',
      portalName: '5. Ev: İçimizdeki Tanrı Portalı & Birlik Bilinci (Kova/Balık Aksı)',
      portalMeaning: '±15 gün bütün evrenle bir olma hissi, ilahi yaratım kıvılcımı ve kalpten doğan saf neşe.',
      shadowState: 'Aşkta aşırı drama, gurur savaşları, reddedilme korkusundan doğan öfke patlamaları.',
      elevatedState: 'Aşkın kutsal bir birleşmeye dönüşmesi; içsel tanrısallığı karşı tarafta da görüp hürmet etme hali.',
      spiritualAdvice: 'Pembe kuvars ile kalp meditasyonu; koşulsuz sevgi frekansını tüm hücrelere yayma.',
    },
    solar_eclipse: {
      title: '5. Ev: Aşk ve Tutkularda 6 Aylık Kadersel Kıvılcım',
      personalImpact: 'Önümüzdeki 6 ay hayatınızın aşkıyla tanışabilir, çocuk sahibi olabilir veya büyük bir yeteneğinizi kariyere dönüştürebilirsiniz.',
      advice: 'Işığınızı parlatmaktan çekinmeyin; sahne sizin.',
      portalName: '5. Ev: İçimizdeki Tanrı Portalı & Birlik Bilinci (Kova/Balık Aksı)',
      portalMeaning: '±15 gün bütün evrenle bir olma hissi, ilahi yaratım kıvılcımı ve kalpten doğan saf neşe.',
      shadowState: 'Ego krizleri, kendini gösterme hırsıyla tükenme, geçici zevklerde kaybolma.',
      elevatedState: '6 ay boyunca ruhun uyanan yaratıcı dehası; evrenle tam birlik (Tevhid) halinde ilham verici büyük eserler doğurma.',
      spiritualAdvice: 'Güneş ışığında kalbi genişletme nefesi; Tanrısal kıvılcımı onurlandıran yaratıcı bir proje başlatın.',
    },
    lunar_eclipse: {
      title: '5. Ev: Sahte Heveslerin Kadersel Sonu',
      personalImpact: 'Sizi sadece oyalayan, derinliği olmayan flörtler ve riskli spekülasyonlar kadersel olarak sonlanıyor.',
      advice: 'Gerçek tutkunun peşinden gidin; vadesi dolmuş eğlenceleri bırakın.',
      portalName: '5. Ev: İçimizdeki Tanrı Portalı & Birlik Bilinci (Kova/Balık Aksı)',
      portalMeaning: '±15 gün bütün evrenle bir olma hissi, ilahi yaratım kıvılcımı ve kalpten doğan saf neşe.',
      shadowState: 'Hayal kırıklığı, yaratıcı tıkanıklık, terk edilme acısı ve değersizlik hissi.',
      elevatedState: 'Geçici heveslerin elenip ruhun gerçek ilahi tutkusuna kavuşması; egodan arınmış saf sevinç.',
      spiritualAdvice: 'İçindeki çocuğa sarılma meditasyonu; onay ihtiyacını ilahi kaynakla doyurma.',
    },
  },
  6: {
    new_moon: {
      title: '6. Ev: Sağlık, Günlük Rutinler ve İş Ortamı',
      personalImpact: 'Sağlıklı bir beslenme/spor programına başlamak ve çalışma düzeninizi verimli kılmak için ideal.',
      advice: 'Bedeninizin sinyallerini dinleyin; küçük adımlarla büyük disiplin kurun.',
      portalName: '6. Ev: Fiziksel Beden 3B Yeterliliği Portalı (Balık/Koç Aksı)',
      portalMeaning: '±15 gün sağlık uyarısı, hücresel arınma, fiziksel 3B bedenin frekansını yükseltme ve hizmet bilinci.',
      shadowState: 'Bedensel çöküş hissi, psikosomatik ağrılar, hipokondri (hastalık kaygısı) ve tükenmişlik.',
      elevatedState: 'Bedenin 3B yoğunluktan ışık bedenine evrilmesi; hücresel şifa ve bedeni ruhun kusursuz mabedi kılma.',
      spiritualAdvice: 'Temiz ve alkali beslenme, niyet suyu kutsama, bedene şükran sunma ritüeli.',
    },
    full_moon: {
      title: '6. Ev: Çalışma Koşullarında Netleşme ve Sağlık Şifası',
      personalImpact: 'Süren bir iş projesinin teslimi veya bir sağlık tedavisinin olumlu tamamlanması gündeme gelebilir.',
      advice: 'Tükenmişlik hissine teslim olmayın; dinlenmeyi ihmal etmeyin.',
      portalName: '6. Ev: Fiziksel Beden 3B Yeterliliği Portalı (Balık/Koç Aksı)',
      portalMeaning: '±15 gün sağlık uyarısı, hücresel arınma, fiziksel 3B bedenin frekansını yükseltme ve hizmet bilinci.',
      shadowState: 'İş yerinde angaryalar altında ezilme, kurban rolü, kronik yorgunluk ve panik ataklar.',
      elevatedState: 'Hücresel düzeyde derin bir yenilenme; iş ve hizmet alanında kusursuz bir düzen ve verimlilik.',
      spiritualAdvice: 'Beden tarama (body scan) meditasyonu ve magnezyum/tuz banyosu.',
    },
    solar_eclipse: {
      title: '6. Ev: Meslek ve Sağlıkta 6 Aylık Kadersel Dönüşüm',
      personalImpact: 'Önümüzdeki 6 ay boyunca çalışma ortamınız, ekibiniz veya yaşam tarzınız köklü biçimde iyileşecek.',
      advice: 'Bedeninizi kutsal bir mabet olarak görün ve hizmet alanınızı genişletin.',
      portalName: '6. Ev: Fiziksel Beden 3B Yeterliliği Portalı (Balık/Koç Aksı)',
      portalMeaning: '±15 gün sağlık uyarısı, hücresel arınma, fiziksel 3B bedenin frekansını yükseltme ve hizmet bilinci.',
      shadowState: 'Ağır sağlık uyarıları, iş yerinde adaletsizlik ve bedenle kurulan bağın kopması.',
      elevatedState: '6 ay boyunca bedensel simya; hücresel kodların şifalanması, dünyaya adanmış yüksek hizmet bilinci.',
      spiritualAdvice: 'Bütüncül sağlık detoksu ve günlük yaşamı bir ibadet/hizmet bilinciyle organize etme.',
    },
    lunar_eclipse: {
      title: '6. Ev: Yıpratıcı İş Yüklerinin Kadersel Bitişi',
      personalImpact: 'Sizi sömüren angaryalar, toksik çalışma ortamları veya sağlıksız alışkanlıklar kadersel olarak devreden çıkıyor.',
      advice: 'Hayır demeyi öğrenin; sınırlarınızı koruyun.',
      portalName: '6. Ev: Fiziksel Beden 3B Yeterliliği Portalı (Balık/Koç Aksı)',
      portalMeaning: '±15 gün sağlık uyarısı, hücresel arınma, fiziksel 3B bedenin frekansını yükseltme ve hizmet bilinci.',
      shadowState: 'Hastalık korkusuyla paniğe kapılma, iş kaybı endişesi ve yetersizlik krizleri.',
      elevatedState: 'Bedeni zehirleyen toksik alışkanlık ve çalışma bağlarının kadersel olarak sonlanması; mutlak şifa.',
      spiritualAdvice: 'Hücresel arınma orucu ve bedene teşekkür meditasyonu.',
    },
  },
  7: {
    new_moon: {
      title: '7. Ev: İkili İlişkiler, Evlilik ve Ortaklıklar',
      personalImpact: 'Yeni bir ortaklık kurmak, ciddi bir ilişkiye adım atmak veya danışmanlık almak için güçlü bir kapı.',
      advice: 'Karşı tarafı can kulağıyla dinleyin; eşitlik ve adalet temelinde birleşin.',
      portalName: '7. Ev: Üst Benlik & Yıldız Sistemi Bağlantı Portalı (Koç Aksı)',
      portalMeaning: '±15 gün geldiğimiz yıldız sistemi ve ırk bağlantısının açılması, geçmiş yaşamları hatırlama ve kadersel aynalar.',
      shadowState: 'İlişkilerde bağımlılık, terk edilme korkusu, karşı tarafa kendi gölgesini yansıtıp çatışma çıkarma.',
      elevatedState: 'Ruh ailesi ve yıldız kökleriyle kadersel karşılaşma; partnerde üst benliğin aynalanması ve kutsal ortaklık.',
      spiritualAdvice: 'Kalp ve Taç çakraları köprüsü; ikili ilişkileri tekamül aynası olarak görüp koşulsuz sevgi alanı açın.',
    },
    full_moon: {
      title: '7. Ev: İlişkilerde Tamamlanma veya Yol Ayrımı',
      personalImpact: 'İkili ilişkilerinizde yüzleşmeler, ilişkinin seviye atlaması ya da miadı dolduysa medeni bir kapanış anı.',
      advice: 'Haklı olmaya değil, huzurlu olmaya odaklanın.',
      portalName: '7. Ev: Üst Benlik & Yıldız Sistemi Bağlantı Portalı (Koç Aksı)',
      portalMeaning: '±15 gün geldiğimiz yıldız sistemi ve ırk bağlantısının açılması, geçmiş yaşamları hatırlama ve kadersel aynalar.',
      shadowState: 'Sert yüzleşmeler, suçlama oyunları, geçmiş yaşam karmalarının kördüğüm olması.',
      elevatedState: 'İlişkilerde karmik düğümlerin çözülmesi; tarafların birbirini özgürleştirerek veya derinleşerek yücelmesi.',
      spiritualAdvice: 'Eski bağları kesme ve helalleşme ritüeli; yeşil ve pembe ışık tefekkürü.',
    },
    solar_eclipse: {
      title: '7. Ev: Evlilik ve Ortaklıklarda 6 Aylık Kadersel İttifak',
      personalImpact: 'Önümüzdeki 6 ay boyunca kadersel bir evlilik, hayat ortağıyla buluşma veya devasa bir iş birliği sizi bekliyor.',
      advice: 'Birlikte büyümeye hazır olun; yalnızlık perdesi aralanıyor.',
      portalName: '7. Ev: Üst Benlik & Yıldız Sistemi Bağlantı Portalı (Koç Aksı)',
      portalMeaning: '±15 gün geldiğimiz yıldız sistemi ve ırk bağlantısının açılması, geçmiş yaşamları hatırlama ve kadersel aynalar.',
      shadowState: 'Yalnız kalma dehşeti veya yanlış ortaklıklara mecbur hissetme.',
      elevatedState: '6 ay sürecek kozmik buluşma; aynı yıldız sisteminden gelmiş ruh eşi/ortağı ile kadersel misyon ortaklığı.',
      spiritualAdvice: 'Ruh ailesini davet eden niyet meditasyonu; dengeli ve kutsal bir birliktelik duası.',
    },
    lunar_eclipse: {
      title: '7. Ev: Toksik ve Karşılıksız Bağların Kadersel Sonu',
      personalImpact: 'Sizi aşağı çeken, saygının bittiği her türlü ilişki ve ortaklık kadersel olarak hayatınızdan temizleniyor.',
      advice: 'Bırakın gitsinler; boşalan yere hakkınız olan gerçek sevgi gelecektir.',
      portalName: '7. Ev: Üst Benlik & Yıldız Sistemi Bağlantı Portalı (Koç Aksı)',
      portalMeaning: '±15 gün geldiğimiz yıldız sistemi ve ırk bağlantısının açılması, geçmiş yaşamları hatırlama ve kadersel aynalar.',
      shadowState: 'İntikam duygusu, terk edilme travması ve güvensizlik duvarları örme.',
      elevatedState: 'Miadı dolmuş karmik sözleşmelerin yırtılması; ruhun bağımsızlık ve kendi tamlığına kavuşması.',
      spiritualAdvice: 'Bağ kesme (cord cutting) meditasyonu; karşı tarafa hakkını helal edip kendi enerjini geri çağırma.',
    },
  },
  8: {
    new_moon: {
      title: '8. Ev: Ortak Finans, Dönüşüm, Miras ve Okültizm',
      personalImpact: 'Kredi, borç yapılandırma, pasif gelir kapıları ve derin psikolojik şifa için dönüştürücü bir evre.',
      advice: 'Bilinçaltı korkularınızla yüzleşin; gücünüzü geri alın.',
      portalName: '8. Ev: Mihenk Taşı & Tekamül Sıçraması Portalı (Koç/Boğa/İkizler Aksı)',
      portalMeaning: 'Kadersel hatırlatmaların gelmesi, kutsal simya, ölüm ve yeniden doğum, okült uyanış.',
      shadowState: 'Ölüm ve yok oluş kaygısı, krizler, şüphecilik, cinsel ve duygusal manipülasyon.',
      elevatedState: 'Kutsal simya ve tekamül sıçraması; eski benliğin küllerinden Anka kuşu gibi doğuşu ve psişik açılımlar.',
      spiritualAdvice: 'Sakral ve Solar Pleksus arınması; korkuların dönüştürülmesi için tuz banyosu ve derin nefes simyası.',
    },
    full_moon: {
      title: '8. Ev: Finansal Düğümlerin Çözülmesi ve Simya',
      personalImpact: 'Beklenen bir miras, nafaka, kredi veya ortak para konusu netleşebilir. Derin bir kriz fırsata dönüşür.',
      advice: 'Gizli gerçeklerin aydınlanmasına direnmeyin; akışa teslim olun.',
      portalName: '8. Ev: Mihenk Taşı & Tekamül Sıçraması Portalı (Koç/Boğa/İkizler Aksı)',
      portalMeaning: 'Kadersel hatırlatmaların gelmesi, kutsal simya, ölüm ve yeniden doğum, okült uyanış.',
      shadowState: 'Güç savaşları, finansal kriz hissi, sırlar ve ihanet şüpheleri.',
      elevatedState: 'Karanlığın ışığa dönüştürülmesi; gizli hakikatlerin aydınlanması ve ortak kaynaklarda büyük bereket.',
      spiritualAdvice: 'Obsidyen veya dumanlı kuvars ile topraklanma; korkuları sevgiye dönüştürme tefekkürü.',
    },
    solar_eclipse: {
      title: '8. Ev: Finansal ve Ruhsal 6 Aylık Büyük Dönüşüm',
      personalImpact: 'Önümüzdeki 6 ay boyunca eşinizin geliri, yatırımlarınız ve ruhsal güçlerinizde kadersel bir metamorfoz yaşanacak.',
      advice: 'Küllerinizden yeniden doğmaya hazır olun.',
      portalName: '8. Ev: Mihenk Taşı & Tekamül Sıçraması Portalı (Koç/Boğa/İkizler Aksı)',
      portalMeaning: 'Kadersel hatırlatmaların gelmesi, kutsal simya, ölüm ve yeniden doğum, okült uyanış.',
      shadowState: 'Ağır kayıplar yaşama korkusu, kontrolü yitirme paniği ve öfke patlamaları.',
      elevatedState: '6 ay boyunca devasa bir ruhsal metamorfoz; gizli ilimlerin kapısının açılması ve mutlak arınma.',
      spiritualAdvice: 'Kökten sakrale derin Kundalini nefesi; geçmiş ölüm/kriz travmalarını ilahi ışığa teslim etme.',
    },
    lunar_eclipse: {
      title: '8. Ev: Borçların ve Duygusal Prangaların Sonu',
      personalImpact: 'Ağır bir borcun kapanması veya yıllardır süren bir bağımlılığın kadersel olarak yok olması.',
      advice: 'Hafiflediğinizi hissedin; artık özgürsünüz.',
      portalName: '8. Ev: Mihenk Taşı & Tekamül Sıçraması Portalı (Koç/Boğa/İkizler Aksı)',
      portalMeaning: 'Kadersel hatırlatmaların gelmesi, kutsal simya, ölüm ve yeniden doğum, okült uyanış.',
      shadowState: 'Yıkım hissi, terk edilmişlik ve karanlık düşüncelere çekilme.',
      elevatedState: 'Ruhun en ağır karmik prangalarından kurtuluşu; tam bir yeniden doğuş ve ruhsal özgürlük.',
      spiritualAdvice: 'Ateş elementiyle arınma; eski korkuları güvenli bir kapta yakıp küllerini suya bırakma.',
    },
  },
  9: {
    new_moon: {
      title: '9. Ev: Yurt Dışı, Yüksek Öğrenim, İnanç ve Vizyon',
      personalImpact: 'Uzak seyahatler, vize başvuruları, felsefi çalışmalar ve hayatın derin manasını aramak için ilham dolu bir zaman.',
      advice: 'Ufkunuzu genişletin; yeni kültürlere ve fikirlere açık olun.',
      portalName: '9. Ev: Kozmik Yasa & Yüksek İnisiye Portalı',
      portalMeaning: 'İlahi hakikat, Hermetik yasaların idraki, yüksek boyut rehberliği ve bilincin sınır ötesine açılması.',
      shadowState: 'Fanatizm, dogmatik katılık, başkalarının inançlarını yargılama veya anlamsızlık boşluğu.',
      elevatedState: 'Kozmik yasanın (Hermetik ilkeler, Dharma) idraki; yüksek rehberlik ve evrensel bilgeliğin uyanışı.',
      spiritualAdvice: 'Üçüncü Göz ve Tepe Çakra meditasyonu; kutsal metinleri ve kadim felsefeleri tefekkür etme.',
    },
    full_moon: {
      title: '9. Ev: Akademik / Hukuki Hasat ve İnanç Netliği',
      personalImpact: 'Bir davanın sonuçlanması, tezin teslimi veya uluslararası bir bağlantının meyve vermesi gündeme gelebilir.',
      advice: 'Önyargılardan uzak durun; evrensel adalet tecelli ediyor.',
      portalName: '9. Ev: Kozmik Yasa & Yüksek İnisiye Portalı',
      portalMeaning: 'İlahi hakikat, Hermetik yasaların idraki, yüksek boyut rehberliği ve bilincin sınır ötesine açılması.',
      shadowState: 'Adaletsizlik öfkesi, haklı çıkma kibri, inanç krizleri ve hayal kırıklığı.',
      elevatedState: 'İlahi adaletin tecelli edişini izleme; hakikatin her türlü dogmayı aşarak kalpte netleşmesi.',
      spiritualAdvice: 'Evrensel adalet ve merhamet zikri/tefekkürü; önyargıları serbest bırakma.',
    },
    solar_eclipse: {
      title: '9. Ev: Hayat Felsefesinde 6 Aylık Kadersel Sıçrama',
      personalImpact: 'Önümüzdeki 6 ay yurt dışına yerleşme, yüksek akademik kariyer veya ruhsal bir üstatlıkla kadersel açılım getirecek.',
      advice: 'Büyük düşünün; sınırlar sadece zihninizdedir.',
      portalName: '9. Ev: Kozmik Yasa & Yüksek İnisiye Portalı',
      portalMeaning: 'İlahi hakikat, Hermetik yasaların idraki, yüksek boyut rehberliği ve bilincin sınır ötesine açılması.',
      shadowState: 'Köklerinden kopma korkusu, manevi kibir ve başkalarını cehaletle suçlama.',
      elevatedState: '6 ay boyunca ruhun büyük inisiyasyonu; kozmik bilincin açılması ve dünyaya ışık olan bir rehbere dönüşme.',
      spiritualAdvice: 'Genişletilmiş bilinç meditasyonu; vizyon panosu oluşturup evrensel hizmet niyetinde bulunma.',
    },
    lunar_eclipse: {
      title: '9. Ev: Dogmaların ve Kurgulanmış İnançların Sonu',
      personalImpact: 'Size dayatılmış sahte inançlar ve boş dogmalar kadersel olarak çöküyor; saf bilgeliğe ulaşıyorsunuz.',
      advice: 'Kendi hakikatinizin rehberi olun.',
      portalName: '9. Ev: Kozmik Yasa & Yüksek İnisiye Portalı',
      portalMeaning: 'İlahi hakikat, Hermetik yasaların idraki, yüksek boyut rehberliği ve bilincin sınır ötesine açılması.',
      shadowState: 'İnanç çöküşü, rehberlere olan güvenin yitirilmesi ve boşluk hissi.',
      elevatedState: 'Tüm sahte putların yıkılması; saf, lekesiz, doğrudan Kaynak ile kurulan aracısız hakikat bağı.',
      spiritualAdvice: 'Sessizlikte kalıp içsel mürşidin sesini dinleme; dogmatik kalıpları yırtıp atma.',
    },
  },
  10: {
    new_moon: {
      title: '10. Ev: Kariyer, Toplumsal Statü ve Zirve',
      personalImpact: 'Yeni bir işe başlamak, terfi istemek veya kendi işinizi kurmak için gökyüzünün en güçlü onay zamanı.',
      advice: 'Liderliğinizi ortaya koyun; otoritenizi saygıyla inşa edin.',
      portalName: '10. Ev: 7 Çakra Dengesinden Gelen Yaratım Gücü & Zirve Portalı',
      portalMeaning: 'Kökten tepeye 7 çakranın tam hizalanmasıyla ilahi tezahür, toplumsal sorumluluk ve karmik vazife.',
      shadowState: 'Tiranlık, güç zehirlenmesi, statü kaygısı, insanları ezerek yükselme hırsı veya kötü bir yöneticinin zorbalığı.',
      elevatedState: '7 çakranın eksiksiz dengelenmesiyle ortaya çıkan saf ilahi yaratım gücü; adil, karizmatik ve topluma ışık olan liderlik.',
      spiritualAdvice: '7 Çakra Dikey Kundalini Hizalanması; gücü ve otoriteyi şahsi egoya değil, bütüne faydaya vakfetme niyeti.',
    },
    full_moon: {
      title: '10. Ev: Kariyerde Zirve, Görünürlük ve Ödül',
      personalImpact: 'Yılların emeğinin toplum önünde takdir edilmesi, önemli bir projenin başarısı veya unvan değişimi.',
      advice: 'Başarılarınızı kutlayın ama kibre kapılmayın.',
      portalName: '10. Ev: 7 Çakra Dengesinden Gelen Yaratım Gücü & Zirve Portalı',
      portalMeaning: 'Kökten tepeye 7 çakranın tam hizalanmasıyla ilahi tezahür, toplumsal sorumluluk ve karmik vazife.',
      shadowState: 'Kibir, itibar kaybı korkusu, haksız eleştirilere öfkeyle saldırma ve tükenmişlik.',
      elevatedState: 'Karmik vazifenin meyve vermesi; toplumun önünde adil ve saygın bir otorite olarak parıldama.',
      spiritualAdvice: 'Alçakgönüllülük ve şükür ritüeli; başarıyı ilahi kaynağa atfetme ve 7 çakrayı topraklama.',
    },
    solar_eclipse: {
      title: '10. Ev: Kariyer ve Hayat Amacında 6 Aylık Kadersel Devrim',
      personalImpact: 'Önümüzdeki 6 ay boyunca mesleğiniz, yöneticilik rolünüz ve toplumdaki yeriniz kadersel olarak baştan yazılacak.',
      advice: 'Kaderinizin çağırdığı sorumluluğu üstlenin; geri adım atmayın.',
      portalName: '10. Ev: 7 Çakra Dengesinden Gelen Yaratım Gücü & Zirve Portalı',
      portalMeaning: 'Kökten tepeye 7 çakranın tam hizalanmasıyla ilahi tezahür, toplumsal sorumluluk ve karmik vazife.',
      shadowState: 'Güç mücadeleleri, kötü yöneticilerin mobbingi veya kendi gücünü kötüye kullanarak zulmetme riski.',
      elevatedState: '6 ay boyunca 7 çakranın kusursuz birleşimiyle kaderin çağrısına cevap verme; büyük kitlelere liderlik etme yetkisi.',
      spiritualAdvice: 'Kökten Tepeye 7 Çakra Dengeleme Meditasyonu; adil liderlik andı içme.',
    },
    lunar_eclipse: {
      title: '10. Ev: Yanlış Kariyer Hedeflerinin Kadersel Bitişi',
      personalImpact: 'Ruhunuza uymayan bir işi veya sizi tüketen bir unvanı kadersel olarak terk edebilirsiniz.',
      advice: 'Gerçek misyonunuza yer açmak için unvan takıntılarını bırakın.',
      portalName: '10. Ev: 7 Çakra Dengesinden Gelen Yaratım Gücü & Zirve Portalı',
      portalMeaning: 'Kökten tepeye 7 çakranın tam hizalanmasıyla ilahi tezahür, toplumsal sorumluluk ve karmik vazife.',
      shadowState: 'Unvan ve itibar kaybının yarattığı kimlik krizi, başarısızlık hissi ve çöküş.',
      elevatedState: 'Ruhu tüketen sahte unvanların terk edilmesi; gerçek ilahi hayat amacına giden temiz yolun açılması.',
      spiritualAdvice: 'Statü bağımlılığını serbest bırakma; gerçek gücün unvanda değil 7 çakranın dengesinde olduğunu hatırlama.',
    },
  },
  11: {
    new_moon: {
      title: '11. Ev: Gelecek Hayalleri, Dostluklar ve Sosyal Çevre',
      personalImpact: 'Yeni bir sosyal gruba dahil olmak, ortak idealler için birleşmek ve büyük dilekler tutmak için harika bir kapı.',
      advice: 'Geleceğe dair hayallerinizi vizyonlayın; doğru insanlarla bir araya gelin.',
      portalName: '11. Ev: Yıldız Tohumları Birliği & Geleceğin Kollektif Vizyonu Portalı',
      portalMeaning: 'Ruh kardeşleriyle ortak ülküde buluşma, yeni çağın inşası ve kolektif bilincin uyanışı.',
      shadowState: 'Sürü psikolojisi, dışlanma korkusuyla sahte davranma, samimiyetsiz kalabalıklarda kaybolma.',
      elevatedState: 'Aynı frekanstaki yıldız tohumlarıyla buluşma; insanlığın hayrına projeler üretme ve ortak bilinç alanı açma.',
      spiritualAdvice: 'Boğaz ve Kalp uyumu; kolektif meditasyonlara katılma ve vizyonu kağıda dökme.',
    },
    full_moon: {
      title: '11. Ev: Bir Dileğin Gerçekleşmesi ve Dostluk Sınavı',
      personalImpact: 'Uzun süredir umut ettiğiniz bir dileğiniz somutlaşabilir; dostlarınızın gerçek yüzünü görebilirsiniz.',
      advice: 'Gerçek dostlarınızın kıymetini bilin; samimiyetsiz kalabalıklardan sıyrılın.',
      portalName: '11. Ev: Yıldız Tohumları Birliği & Geleceğin Kollektif Vizyonu Portalı',
      portalMeaning: 'Ruh kardeşleriyle ortak ülküde buluşma, yeni çağın inşası ve kolektif bilincin uyanışı.',
      shadowState: 'Arkadaş ihaneti, gruplar içinde dedikodu ve geleceğe dair derin bir umutsuzluk.',
      elevatedState: 'Büyük bir idealin somutlaşması; gerçek ruh dostlarının saf sevgisiyle çevrelenme.',
      spiritualAdvice: 'Kolektif şifa çemberi tefekkürü; sahte ilişkileri nezaketle geride bırakma.',
    },
    solar_eclipse: {
      title: '11. Ev: Sosyal Ağlar ve İdeallerde 6 Aylık Kadersel Yükseliş',
      personalImpact: 'Önümüzdeki 6 ay büyük bir topluluğa liderlik edebilir, hayallerinizi gerçekleştirecek kilit bağlantılar kurabilirsiniz.',
      advice: 'Geleceği inşa eden ekibin bir parçası olun.',
      portalName: '11. Ev: Yıldız Tohumları Birliği & Geleceğin Kollektif Vizyonu Portalı',
      portalMeaning: 'Ruh kardeşleriyle ortak ülküde buluşma, yeni çağın inşası ve kolektif bilincin uyanışı.',
      shadowState: 'Toplumsal krizlerden aşırı etkilenme, geleceğe güvensizlik ve yalnızlık duygusu.',
      elevatedState: '6 ay boyunca yeni çağın vizyoner topluluklarına öncülük etme; büyük kitlesel hayallerin tezahürü.',
      spiritualAdvice: 'Tüm insanlığa koşulsuz sevgi ve barış gönderen küresel niyet meditasyonu.',
    },
    lunar_eclipse: {
      title: '11. Ev: Sahte Çevrelerin ve Boş Hayallerin Sonu',
      personalImpact: 'Sizi sadece çıkarı için arayan arkadaşlar kadersel bir olayla eleniyor. Gerçek dostlar kalıyor.',
      advice: 'Az ve öz insanla yola devam edin.',
      portalName: '11. Ev: Yıldız Tohumları Birliği & Geleceğin Kollektif Vizyonu Portalı',
      portalMeaning: 'Ruh kardeşleriyle ortak ülküde buluşma, yeni çağın inşası ve kolektif bilincin uyanışı.',
      shadowState: 'Çevre kaybı acısı, yalnız kalma paniği ve güven sarsıntısı.',
      elevatedState: 'Enerji emen sahte kalabalıkların temizlenmesi; saf ve samimi çekirdek bir ruh ailesiyle yola devam etme.',
      spiritualAdvice: 'Telefon rehberi ve sosyal medya detoksu; gerçek dostlara şükran mesajı gönderme.',
    },
  },
  12: {
    new_moon: {
      title: '12. Ev: Bilinçaltı, Ruhsal Arınma, İnziva ve Gizli Güç',
      personalImpact: 'İç dünyanıza çekilmek, meditasyon, terapi ve tüm görünmez bağları şifalandırmak için kutsal bir evre.',
      advice: 'Sessizliğe sığının; rüyalarınızı kaydedin ve ilahi plana teslim olun.',
      portalName: '12. Ev: Kozmik Rahim, Mutlak Teslimiyet & Karmik Sıfırlanma Portalı',
      portalMeaning: 'Tüm yanılsamaların ötesine geçiş, ilahi teslimiyet, karmik borçların sıfırlanması ve perdenin ardındaki ışık.',
      shadowState: 'Kurban psikolojisi, dünyadan kaçma isteği (eskapizm), uyku bozuklukları ve derin korkular.',
      elevatedState: 'Mutlak teslimiyet ve birlik bilinci; ilahi koruma zırhı ve bilinçaltı blokajlarının tamamen çözülmesi.',
      spiritualAdvice: 'Tepe çakra ve aura kalkanı çalışması; sessiz inziva, dua ve rüyaları not etme.',
    },
    full_moon: {
      title: '12. Ev: Gizli Düşmanların ve Sırların Aydınlanması',
      personalImpact: 'Arkanızdan dönen oyunlar veya bastırdığınız korkular açığa çıkar; ilahi koruma altındasınız.',
      advice: 'Korkmayın; açığa çıkan her şey sizi korumak için gün yüzüne çıkıyor.',
      portalName: '12. Ev: Kozmik Rahim, Mutlak Teslimiyet & Karmik Sıfırlanma Portalı',
      portalMeaning: 'Tüm yanılsamaların ötesine geçiş, ilahi teslimiyet, karmik borçların sıfırlanması ve perdenin ardındaki ışık.',
      shadowState: 'Paranoya, gizli düşman korkusu, geçmiş hataların vicdan azabı ve çaresizlik.',
      elevatedState: 'Görünmez tuzakların ilahi ışıkla bertaraf edilmesi; perdenin arkasındaki hakikatin apaçık görünmesi.',
      spiritualAdvice: 'Tuzlu suyla ayakları yıkama; "İlahi koruma altındayım, karanlık ışıkta yok olur" olumlaması.',
    },
    solar_eclipse: {
      title: '12. Ev: Ruhsal Aydınlanmada 6 Aylık Kadersel Uyanış',
      personalImpact: 'Önümüzdeki 6 ay boyunca bilinçaltı blokajlarınız tamamen çözülecek, sezgisel ve medyumik güçleriniz uyanacak.',
      advice: 'Manevi pratiklere ağırlık verin; ilahi akış sizi taşıyor.',
      portalName: '12. Ev: Kozmik Rahim, Mutlak Teslimiyet & Karmik Sıfırlanma Portalı',
      portalMeaning: 'Tüm yanılsamaların ötesine geçiş, ilahi teslimiyet, karmik borçların sıfırlanması ve perdenin ardındaki ışık.',
      shadowState: 'Ağır melankoli, dünyevi hayattan kopuş ve psişik karmaşa.',
      elevatedState: '6 ay boyunca ruhun kozmik rahimde yeniden doğuşu; tüm karmik borçların sıfırlanması ve ilahi vecd hali.',
      spiritualAdvice: 'Günlük 15 dakika mutlak sessizlik meditasyonu; ilahi Kaynağa tam teslimiyet.',
    },
    lunar_eclipse: {
      title: '12. Ev: Karmik Borçların ve İzolasyonun Kadersel Sonu',
      personalImpact: 'Yıllardır süren yalnızlık, kurban psikolojisi ve karmik yükler kadersel olarak sonlanıyor.',
      advice: 'Kafesinizin kapısı açıldı; aydınlığa adım atın.',
      portalName: '12. Ev: Kozmik Rahim, Mutlak Teslimiyet & Karmik Sıfırlanma Portalı',
      portalMeaning: 'Tüm yanılsamaların ötesine geçiş, ilahi teslimiyet, karmik borçların sıfırlanması ve perdenin ardındaki ışık.',
      shadowState: 'Kendi içine kilitlenme, kurban kimliğini bırakamama ve karanlığa teslim olma.',
      elevatedState: 'Kafesin kapısının sonsuza dek açılması; ruhun özgürleşerek aydınlığa ve dünyaya yeniden doğması.',
      spiritualAdvice: 'Geçmişe veda ve helalleşme ritüeli; beyaz bir mum yakıp yeni ışık çağını selamlama.',
    },
  },
};

/**
 * Hedef tarihe göre aktif olan 6 Aylık Güneş Tutulması Kadersel Çatısını (Umbrella) belirler.
 * Güneş tutulmaları gerçekleştiği andan itibaren 6 ay (180 gün) boyunca ana hayat rotasını çizer.
 * Ayrıca tutulmadan önceki 30 gün boyunca öncü tesir başlar.
 */
export function getActiveSolarEclipse(targetDate: Date = new Date()): ActiveSolarEclipseInfo | null {
  const targetTime = targetDate.getTime();
  const solarEclipses = MOON_PHASES_DATA.filter(e => e.phase === 'solar_eclipse');
  if (solarEclipses.length === 0) return null;

  // 1. Halihazırda 6 aylık etki periyodu içinde olan (gerçekleşmiş ve 180 günden az geçmiş) tutulmayı ara
  let activeEclipse: LunationEvent | null = null;
  let minDaysDiff = Infinity;

  for (const eclipse of solarEclipses) {
    const eclipseTime = new Date(eclipse.utcDate).getTime();
    const diffDays = Math.round((eclipseTime - targetTime) / (1000 * 60 * 60 * 24)); // pozitif = gelecek, negatif = geçmiş
    
    // Gerçekleşti ve üzerinden 180 günden az geçti
    if (diffDays <= 0 && Math.abs(diffDays) <= 180) {
      activeEclipse = eclipse;
      minDaysDiff = diffDays;
      break;
    }
  }

  // 2. Eğer geçmişte aktif 180 günlük tutulma yoksa, yaklaşan öncü tutulmayı ara (<= 30 gün)
  if (!activeEclipse) {
    for (const eclipse of solarEclipses) {
      const eclipseTime = new Date(eclipse.utcDate).getTime();
      const diffDays = Math.round((eclipseTime - targetTime) / (1000 * 60 * 60 * 24));
      if (diffDays > 0 && diffDays <= 30) {
        activeEclipse = eclipse;
        minDaysDiff = diffDays;
        break;
      }
    }
  }

  // 3. Fallback: En yakın güneş tutulmasını al
  if (!activeEclipse) {
    let closest = solarEclipses[0];
    let closestDiff = Math.abs(new Date(closest.utcDate).getTime() - targetTime);
    for (const eclipse of solarEclipses) {
      const diff = Math.abs(new Date(eclipse.utcDate).getTime() - targetTime);
      if (diff < closestDiff) {
        closestDiff = diff;
        closest = eclipse;
      }
    }
    activeEclipse = closest;
    minDaysDiff = Math.round((new Date(closest.utcDate).getTime() - targetTime) / (1000 * 60 * 60 * 24));
  }

  const daysPassed = Math.abs(minDaysDiff);
  const daysLeft = Math.max(0, 180 - daysPassed);
  const monthsRemaining = Math.max(1, Math.round(daysLeft / 30));

  let statusText = '';
  if (minDaysDiff === 0) {
    statusText = 'Bugün Gerçekleşiyor (Pik Gün)!';
  } else if (minDaysDiff > 0) {
    statusText = `${minDaysDiff} gün sonra gerçekleşecek (Öncü Tesir Başladı • 6 Aylık Çatı)`;
  } else {
    statusText = `Etkisi Devam Ediyor (${daysPassed} gün önce gerçekleşti • Kalan Süre: ~${monthsRemaining} Ay)`;
  }

  return {
    event: activeEclipse,
    daysDiff: minDaysDiff,
    monthsRemaining,
    statusText,
    isActive: true,
  };
}

export interface ActiveLunationResult {
  event: LunationEvent;
  isExactOrActive: boolean;
  statusText: string;
  durationInfo: LunationDurationInfo;
  daysDiff: number;
  activeSolarEclipse: ActiveSolarEclipseInfo | null;
}

/**
 * Verilen bir tarihe en yakın ve aktif olan Ay Döngüsü veya Tutulmayı tespit eder.
 * Aynı zamanda aktif olan 6 Aylık Güneş Tutulması Kadersel Çatısını da döndürür.
 */
export function getActiveOrNextLunation(targetDate: Date = new Date()): ActiveLunationResult {
  const targetTime = targetDate.getTime();
  
  // En yakın olayı bul
  let closestEvent = MOON_PHASES_DATA[0];
  let minDiff = Math.abs(new Date(closestEvent.utcDate).getTime() - targetTime);

  for (const item of MOON_PHASES_DATA) {
    const diff = Math.abs(new Date(item.utcDate).getTime() - targetTime);
    if (diff < minDiff) {
      minDiff = diff;
      closestEvent = item;
    }
  }

  const daysDiff = Math.round((new Date(closestEvent.utcDate).getTime() - targetTime) / (1000 * 60 * 60 * 24));
  const durationInfo = LUNATION_DURATIONS[closestEvent.phase];

  // Aktif etki aralığında mı?
  let isExactOrActive = false;
  let statusText = '';

  if (closestEvent.phase === 'solar_eclipse') {
    // Güneş tutulması 6 ay etkilidir (±90 gün civarı)
    isExactOrActive = Math.abs(daysDiff) <= 90;
    statusText = daysDiff === 0 
      ? 'Bugün Gerçekleşiyor (Pik Gün)!' 
      : daysDiff > 0 
        ? `${daysDiff} gün sonra gerçekleşecek (Öncü Tesir Başladı)`
        : `Etkisi Devam Ediyor (${Math.abs(daysDiff)} gün önce gerçekleşti • 6 Ay Sürecek)`;
  } else if (closestEvent.phase === 'lunar_eclipse') {
    isExactOrActive = Math.abs(daysDiff) <= 30;
    statusText = daysDiff === 0 
      ? 'Bugün Gerçekleşiyor (Pik Anı)!' 
      : daysDiff > 0 
        ? `${daysDiff} gün sonra gerçekleşecek (Yoğunlaşma Evresi)`
        : `Etkisi Devam Ediyor (${Math.abs(daysDiff)} gün önce gerçekleşti • 1-3 Ay Yankılanır)`;
  } else {
    // Yeniay veya Dolunay (14 gün etki)
    isExactOrActive = Math.abs(daysDiff) <= 7;
    statusText = daysDiff === 0 
      ? 'Bugün Gerçekleşiyor (Pik Anı)!' 
      : daysDiff > 0 
        ? `${daysDiff} gün sonra gerçekleşecek`
        : `Etkisi Devam Ediyor (${Math.abs(daysDiff)} gün önce gerçekleşti)`;
  }

  const activeSolarEclipse = getActiveSolarEclipse(targetDate);

  return {
    event: closestEvent,
    isExactOrActive,
    statusText,
    durationInfo,
    daysDiff,
    activeSolarEclipse,
  };
}

/**
 * Natal evlere göre olayın hangi evde gerçekleştiğini hesaplar (Placidus / Whole Sign uyumlu)
 */
export function calculateLunationHouse(
  lunationSign: string,
  houses?: Array<{ house: number; sign: string }>
): number {
  if (!houses || houses.length === 0) return 1;

  // Burç eşleşmesine göre evin bulunması
  const matchedHouse = houses.find(h => h.sign.toLowerCase() === lunationSign.toLowerCase());
  return matchedHouse ? matchedHouse.house : 1;
}
