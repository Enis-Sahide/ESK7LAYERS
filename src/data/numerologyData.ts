export interface NumerologyMeaning {
  number: number;
  title: string;
  planet: string;
  element: string;
  light: string; // Işık yönü
  shadow: string; // Gölge yönü
  lifePath: string; // Yaşam yolu olarak anlamı
  destiny: string; // Kader/İfade olarak anlamı
}

export const numerologyData: Record<number, NumerologyMeaning> = {
  1: {
    number: 1,
    title: "Öncü ve Yaratıcı Lider",
    planet: "Güneş",
    element: "Ateş",
    light: "Bağımsızlık, liderlik, cesaret, özgünlük, irade gücü ve inisiyatif alma kapasitesi. Yeni başlangıçların ve yaratımın frekansıdır.",
    shadow: "Egoizm, baskıcılık, sabırsızlık, tahammülsüzlük ve diktatörlük eğilimleri. Başkalarını dinlememe.",
    lifePath: "Bu hayattaki ana göreviniz bağımsızlığınızı kazanmak ve kendi yolunuzu çizmektir. Başkalarını takip etmek yerine, kendi özgün vizyonunuzu cesaretle ortaya koymalı ve insanlara ilham veren bir lider olmalısınız.",
    destiny: "Doğuştan gelen bir yöneticisiniz. Fikirlerinizi hayata geçirme ve projeleri sıfırdan var etme konusunda eşsiz bir yeteneğiniz var. Kendi ayaklarınız üzerinde durduğunuzda en yüksek potansiyelinizi yaşarsınız."
  },
  2: {
    number: 2,
    title: "Barışçıl Diplomat ve Sezgi Sahibi",
    planet: "Ay",
    element: "Su",
    light: "Uyum, işbirliği, empati, sezgisellik, diplomatik yaklaşım ve derin duyarlılık. İkiliklerin dengesini kurar.",
    shadow: "Aşırı duyarlılık, kararsızlık, pasif-agresif davranışlar, onaylanma bağımlılığı ve çatışmadan kaçınmak için kendini feda etme.",
    lifePath: "Ruhsal yolculuğunuz, ilişkilerde uyumu ve dengeyi bulmayı öğrenmektir. Çatışmaları çözen, insanları bir araya getiren ve sezgilerine güvenerek yol alan bir barış elçisi olmak için buradasınız.",
    destiny: "Derin sezgileriniz ve insan psikolojisini anlama yeteneğiniz sayesinde harika bir arabulucu, danışman veya şifacısınız. Detayları görme ve uyum yaratma kabiliyetiniz en büyük hediyenizdir."
  },
  3: {
    number: 3,
    title: "İlham Veren Yaratıcı ve İletişimci",
    planet: "Jüpiter",
    element: "Hava / Ateş",
    light: "Yaratıcılık, neşe, iyimserlik, mükemmel iletişim becerileri, sanatsal yetenekler ve ilham verici bir aura.",
    shadow: "Dağınıklık, yüzeysellik, dedikodu eğilimi, odaklanma sorunları ve potansiyelini boşa harcama.",
    lifePath: "Amacınız, neşenizi ve yaratıcılığınızı dünyayla paylaşmaktır. İster sanat, ister konuşma, ister yazı yoluyla olsun, kendinizi ifade ederek başkalarının ruhunu yükseltmek üzere enkarne oldunuz.",
    destiny: "Kelimelerle, renklerle veya seslerle oynamayı çok iyi bilirsiniz. İnsanları ikna etme ve eğlendirme gücünüz yüksektir. Sahne, yazı, tasarım veya iletişim alanlarında parlamanız kaçınılmazdır."
  },
  4: {
    number: 4,
    title: "Sistemin Temel Taşı ve Düzen Kurucu",
    planet: "Uranüs (Geleneksel: Satürn)",
    element: "Toprak",
    light: "Disiplin, kararlılık, çalışkanlık, pratiklik, dürüstlük ve sağlam temeller inşa etme yeteneği.",
    shadow: "İnatçılık, değişime direnç, esneklik eksikliği, işkoliklik ve dogmatik düşünce.",
    lifePath: "Bu hayattaki misyonunuz, kaosun içine düzen getirmek ve geleceğe kalıcı temeller atmaktır. Sabırla ve disiplinle çalışarak fikirleri somut, işleyen sistemlere dönüştürmek sizin en büyük gücünüzdür.",
    destiny: "Siz zodyağın mimarısınız. Sistem kurma, organizasyon yapma ve yönetme konusunda doğal bir yeteneğiniz var. İnsanlar sarsılmaz güvenilirliğiniz için size sırtını dayarlar."
  },
  5: {
    number: 5,
    title: "Özgür Ruhlu Gezgin ve Değişim Elçisi",
    planet: "Merkür",
    element: "Hava",
    light: "Özgürlük aşkı, uyum sağlama, macera ruhu, hızlı zeka, çok yönlülük ve merak.",
    shadow: "Sorumsuzluk, huzursuzluk, bağımlılıklara yatkınlık, maymun iştahlılık ve taahhüt korkusu.",
    lifePath: "Yolculuğunuz değişimi kucaklamak ve deneyim yoluyla bilgeliğe ulaşmaktır. Sınırları aşmak, yeni kültürler keşfetmek ve hayatın tüm lezzetlerini deneyimleyerek insanlara özgürlüğü öğretmek sizin görevinizdir.",
    destiny: "Rutinden nefret edersiniz ve yenilik krizlerinde en iyi çözümleri siz bulursunuz. Hızlı düşünme, adaptasyon ve kriz yönetimi yeteneğinizle değişimi başlatan bir katalizörsünüz."
  },
  6: {
    number: 6,
    title: "Şifacı, Besleyici ve Sevgi Bekçisi",
    planet: "Venüs",
    element: "Toprak / Su",
    light: "Sevgi, sorumluluk, şefkat, şifacılık, aileye bağlılık ve estetik/güzellik anlayışı.",
    shadow: "Aşırı korumacılık, müdahalecilik, kurban psikolojisi, sınır koyamama ve endişe.",
    lifePath: "Amacınız, koşulsuz sevgiyi öğrenmek ve etrafınızdakileri besleyip şifalandırmaktır. Aile, ev ve toplum hayatında uyumu sağlayarak insanlara manevi bir yuva sunmak üzere buradasınız.",
    destiny: "Derin bir empati yeteneğiniz ve güçlü bir adalet duygunuz var. Çevrenizi güzelleştirme ve insanların acılarını hafifletme konusunda eşsiz bir yeteneğe sahip doğuştan bir şifacısınız."
  },
  7: {
    number: 7,
    title: "Bilge, Araştırmacı ve Mistik Ruh",
    planet: "Neptün",
    element: "Su / Eter",
    light: "Derin zeka, analitik düşünce, mistisizm, gerçeği arayış, gözlemcilik ve içsel bilgelik.",
    shadow: "İzolasyon, şüphecilik, aşırı eleştirellik, melankoli ve dünyadan kopukluk.",
    lifePath: "Siz hayatın yüzeyindeki illüzyonların ötesini görmek için buradasınız. Felsefe, bilim veya okültizmin derinliklerine inerek varoluşun sırlarını çözmek ve bu evrensel gerçekleri keşfetmek sizin yolunuzdur.",
    destiny: "Görünenin ardındakini okuma gücünüz muazzamdır. Zihniniz durmaksızın sorgular ve analiz eder. Gerçeği bulana kadar durmayan, doğal bir filozof veya ezoterik ustasınız."
  },
  8: {
    number: 8,
    title: "Maddi ve Manevi Güç Yöneticisi",
    planet: "Satürn",
    element: "Toprak",
    light: "Güç, bolluk, yöneticilik becerisi, otorite, karmik adalet ve vizyonerlik.",
    shadow: "Materyalizm, acımasızlık, güç zehirlenmesi, kontrol deliliği ve maneviyatı inkar.",
    lifePath: "Sonsuzluk sembolünü taşıyan 8, maddi ve manevi dünyayı dengelemeyi öğrenme yoludur. Bolluk yaratmak, gücü etik bir şekilde kullanmak ve adil bir lider olmak sizin karmik dersinizdir.",
    destiny: "Finans, iş dünyası ve yönetim sizin oyun alanınızdır. Büyük kitleleri organize edebilme, zenginlik yaratabilme ve güçlü kurumlar inşa etme yeteneğiniz doğuştan gelir."
  },
  9: {
    number: 9,
    title: "Evrensel Sevgi ve Şefkat Savaşçısı",
    planet: "Mars (Geleneksel)",
    element: "Ateş",
    light: "Evrensel sevgi, hümanizm, bilgelik, hoşgörü, bitişleri yönetme ve koşulsuz fedakarlık.",
    shadow: "Hayal kırıklığı, geçmişe takıntı, dramatiklik, sınır çizememe ve kendini tüketme.",
    lifePath: "Evrimsel döngünün son aşamasısınız. Daha önceki sayıların tüm bilgeliklerini taşıyorsunuz. Misyonunuz evrensel sevgiyi yaymak, insanlığa hizmet etmek ve beklentisizce verebilmektir.",
    destiny: "Sınırların ve ayrımların ötesini görebilen eski bir ruhsunuz. İnsanlığı bir bütün olarak sever, büyük vizyonlarla dünyayı daha iyi bir yer haline getirmeyi hedeflersiniz."
  },
  11: {
    number: 11,
    title: "Üstat Sayı: Sezgisel Aydınlatıcı",
    planet: "Uranüs (Yüksek Oktav)",
    element: "Eter / Hava",
    light: "Ruhsal aydınlanma, güçlü sezgi, vizyonerlik, ilham kanallığı ve evrensel gerçeklerin aktarımı.",
    shadow: "Yüksek gerilim, anksiyete, gerçeklikten kopuş, kafa karışıklığı ve potansiyelinden korkma.",
    lifePath: "Üstat sayılardan ilki olarak, psişik yetenekleriniz ve sezgileriniz çok güçlüdür. Amacınız, evrensel bilgiyi alıp insanları aydınlatan ruhsal bir öğretmen, bir işaret fişeği olmaktır.",
    destiny: "Siz yüksek frekanslı enerjileri yeryüzüne indiren bir kanalsınız. Varlığınız ve ilham veren vizyonunuz, etrafınızdaki insanların titreşimini anında yükseltir."
  },
  22: {
    number: 22,
    title: "Üstat Sayı: Usta Mimar",
    planet: "Plüton (Yüksek Oktav)",
    element: "Eter / Toprak",
    light: "Büyük vizyonları somutlaştırma, küresel etki, dahilik, muazzam liderlik ve kalıcı eserler bırakma.",
    shadow: "Aşırı baskı hissi, kontrol edilemez hırs, potansiyelini yıkıcı kullanma veya felç edici korku.",
    lifePath: "Siz sadece fikir üretmekle kalmaz, bu fikirleri dünyayı değiştirecek fiziksel yapılara dönüştürebilirsiniz. Sınırınız gökyüzüdür; insanlık için kalıcı ve devasa sistemler inşa etmek üzere enkarne oldunuz.",
    destiny: "En güçlü sayılardan biri olan 22 size, imkansız gibi görünen rüyaları gerçek kılma kudreti verir. Dünyada somut ve kalıcı bir iz (bir kurum, sistem veya öğreti) bırakacaksınız."
  },
  33: {
    number: 33,
    title: "Üstat Sayı: Evrensel Şifacı ve Usta Öğretmen",
    planet: "Neptün (Yüksek Oktav)",
    element: "Eter / Su",
    light: "Mesihi bilinç, koşulsuz evrensel sevgi, ruhsal yükseliş, derin şifa ve tam uyanış.",
    shadow: "Dünyanın acısını üstlenip ezilme, kendini kurban etme, aşırı duygusal yük ve çaresizlik hissi.",
    lifePath: "Numerolojideki en nadir ve yüce titreşimdir. Sizin yolunuz, saf sevgi yoluyla insanlığın kalbini iyileştirmektir. Kendinizi adayarak insanlara rehberlik eden bir ruhani ustasınız.",
    destiny: "Şifacıların şifacısısınız. Sadece varlığınız bile etrafınızdakilerin kalbini yumuşatmaya yeter. Ego zincirlerinden kurtulup saf bir sevgi kanalı olduğunuzda mucizeler yaratırsınız."
  }
};
