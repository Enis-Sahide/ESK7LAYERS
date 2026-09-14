/**
 * 7Layers - Kelt Druid Ağacı Analiz Motoru
 * 
 * Antik Kelt (Druid) geleneğinde 28 günlük 13 kutsal Ay döngüsü ve Ogham ağaç alfabesine
 * dayanan otoriter Kelt ağacı analiz sistemi.
 * 
 * Yıl 13 kutsal ağaca bölünür. Her kişi doğum gününe göre tek bir koruyucu
 * ağaç ruhu ve Ogham harfi ile eşleşir.
 * 
 * Tıbbi / dahili tüketim içermez. Yalnızca ağaç topraklanması (Shinrin-Yoku)
 * ve güvenli ortam kokulandırması (buhur/uçucu yağ) prensibini esas alır.
 */

export interface DruidTreePeriod {
  startMonth: number; // 1-12
  startDay: number;   // 1-31
  endMonth: number;   // 1-12
  endDay: number;     // 1-31
  label: string;      // Görsel tarih etiketi
}

export interface DruidTree {
  id: string;
  name: string;
  botanicalName: string;
  oghamSymbol: string;
  oghamName: string;
  periods: DruidTreePeriod[];
  isCardinalStation?: boolean; // Mevsim dönüm noktası mı?
  stationLabel?: string;
  archetype: string;          // Ruhsal Karakter & Mizaç (Arketip)
  element: string;            // Doğa Elementi (Toprak & Ateş vb.)
  rulingPlanets: string;      // Yönetici Gezegen & Kozmik Güç
  colorTheme: {
    primary: string;
    secondary: string;
    badgeBg: string;
  };
  spiritualEssence: string;   // Kelt Druid mitolojik ruhsal özeti
  lightTraits: string[];      // Işık Potansiyelleri ve Erdemler (4 madde)
  shadowTraits: string[];     // Gölge Sınavı ve Yaşam Zorlukları (4 madde)
  natureRitual: {
    grounding: string;        // Orman Banyosu & Ağaç Topraklanması (Shinrin-Yoku)
    ambientAroma: string;     // Ortam Buhuru & Doğal Koku (Difüzör - dahili içilmez)
    soulPractice: string;     // Ruhsal Dengeleyici Günlük Alışkanlık
  };
  relationships: {
    resonantTrees: string[];  // Ruhsal Rezonanstaki Uyumlu Ağaçlar
    catalystTrees: string[];  // Geliştiren Zıt Ağaçlar (Katalizör)
  };
  druidicProverb: string;     // Kadim Kelt / Druid Bilgelik Sözü
}

/**
 * 13 Kutsal Kelt Ogham Ağacı (Resmi & Otoriter Kelt Takvimi)
 */
export const DRUID_TREES: DruidTree[] = [
  {
    "id": "birch",
    "name": "Huş Ağacı",
    "botanicalName": "Betula pendula",
    "oghamSymbol": "ᚁ",
    "oghamName": "Beith",
    "periods": [
      {
        "startMonth": 12,
        "startDay": 24,
        "endMonth": 1,
        "endDay": 20,
        "label": "24 Aralık - 20 Ocak"
      }
    ],
    "archetype": "Işığın Elçisi & Yeniden Başlangıç (Arınma Ruhu)",
    "element": "Işık & Su",
    "rulingPlanets": "Güneş & Venüs",
    "colorTheme": {
      "primary": "#34D399",
      "secondary": "#E0E7FF",
      "badgeBg": "rgba(52, 211, 153, 0.15)"
    },
    "spiritualEssence": "Huş (Beith), antik Ogham alfabesinin ilk harfidir. Kış gündönümünün hemen ertesinde, karanlığın içinden ilk ışığı müjdeleyen beyaz kabuklu kutsal arınma ağacıdır. Bu dönemde doğanlar, küllerinden yeniden doğma gücüne, tertemiz bir niyetle hayata sıfırdan başlama iradesine ve etrafındaki insanların karanlığını şefkatle aydınlatma yeteneğine sahiptir.",
    "lightTraits": [
      "Küllerinden doğma ve tazelenme yeteneği, yüksek zihinsel berraklık",
      "Zarif, ilham verici, naif ve temiz niyetli düşünce yapısı",
      "Yaratıcı sanatsal vizyon ve geçmişin yüklerini kolayca bırakabilme",
      "Başkalarının karanlığını nezaket ve şefkatle aydınlatma becerisi"
    ],
    "shadowTraits": [
      "Aşırı kırılganlık ve dünyanın sert gerçeklerinden kaçma arzusu",
      "Sınır çizmekte zorlanma ve kötü niyetli enerjilere fazla açık olma",
      "Gerçekçilikten uzaklaşıp hayal aleminde kaybolma eğilimi",
      "Yalnız kalmaktan korkarak kendi değerini dış onayda arama"
    ],
    "natureRitual": {
      "grounding": "Beyaz gövdeli bir Huş ağacının gölgesinde oturup avuç içlerinizi kabuğuna hafifçe dokundurun. Zihninizdeki eski kederleri ağacın beyaz ışığına teslim edin.",
      "ambientAroma": "Tatlı Huş (Sweet Birch) veya Nane uçucu yağı buhuru (Yalnızca difüzör; zihinsel yorgunluğu siler, mekana arındırıcı bir ferahlık katar).",
      "soulPractice": "Her sabah uyanır uyanmaz bir bardak ılık su içip pencereden gökyüzüne bakın ve \"Bugün yeniden doğdum\" niyetini tekrarlayın."
    },
    "relationships": {
      "resonantTrees": [
        "Meşe Ağacı",
        "Dişbudak Ağacı",
        "Alıç Ağacı"
      ],
      "catalystTrees": [
        "Kamış",
        "Asma"
      ]
    },
    "druidicProverb": "Karanlık ne kadar uzun sürerse sürsün, Huş ağacı ilk ışık hüzmesini yansıtmak için ormanda hazır bekler."
  },
  {
    "id": "rowan",
    "name": "Üvez Ağacı",
    "botanicalName": "Sorbus aucuparia",
    "oghamSymbol": "ᚂ",
    "oghamName": "Luis",
    "periods": [
      {
        "startMonth": 1,
        "startDay": 21,
        "endMonth": 2,
        "endDay": 17,
        "label": "21 Ocak - 17 Şubat"
      }
    ],
    "archetype": "Psişik Muhafız & Sezgisel Vizyoner (Ruhsal Kalkan)",
    "element": "Ateş & Hava",
    "rulingPlanets": "Uranüs & Merkür",
    "colorTheme": {
      "primary": "#EF4444",
      "secondary": "#FCA5A5",
      "badgeBg": "rgba(239, 68, 68, 0.15)"
    },
    "spiritualEssence": "Kelt mitolojisinde Üvez (Luis - \"Fısıltı\"), kötü enerjileri kovan ve psişik farkındalığı uyandıran koruyucu bilgelik ağacıdır. Kırmızı meyveleriyle kış ortasında yaşam ateşini diri tutar. Üvez insanları yüksek hayal gücüne, güçlü altıncı hisse ve bağımsız bir düşünce yapısına sahiptir. Kendi ilkelerine sadık, sürü psikolojisine asla uymayan özgün ruhlardır.",
    "lightTraits": [
      "Geleceği sezen güçlü altıncı his ve yüksek vizyoner ilham",
      "Negatif enerjilere ve manipülasyona karşı doğal psişik koruma",
      "Özgün, sıra dışı, bağımsız ve derin felsefi düşünce kabiliyeti",
      "Haksızlıklara karşı sessiz kalmayan ilkeli ve dürüst adalet duygusu"
    ],
    "shadowTraits": [
      "Zihinsel aşırı uyarılma, huzursuzluk ve uyku problemleri",
      "İnsanların kendisini anlamadığını düşünerek kibirli bir yalnızlığa çekilme",
      "Aşırı idealizm sebebiyle pratik dünyayı küçümseme ve gerilme",
      "Duygusal mesafesini korurken sevdiklerine soğuk algılanma riski"
    ],
    "natureRitual": {
      "grounding": "Bir üvez ağacının yanında durarak derin nefes alın. Kırmızı meyvelerin ateşini kalbinizde canlandırarak auranızın parladığını imgeleyin.",
      "ambientAroma": "Biberiye ve Sedir Ağacı uçucu yağı buhuru (Difüzörde; psişik enerjiyi dengeler, mekanı negatif tesirlerden arındırır).",
      "soulPractice": "Haftada bir gün sosyal medyadan ve ekrandan 2 saat uzaklaşıp yalnızca sezgisel ilhamlarınıza kulak verin."
    },
    "relationships": {
      "resonantTrees": [
        "Huş Ağacı",
        "Dişbudak Ağacı",
        "Sarmaşık"
      ],
      "catalystTrees": [
        "Kızılağaç",
        "Mürver Ağacı"
      ]
    },
    "druidicProverb": "Üvez ağacının meyvesi kar üstünde parlar; gerçeği gören göz kalabalığın gürültüsüne aldanmaz."
  },
  {
    "id": "ash",
    "name": "Dişbudak Ağacı",
    "botanicalName": "Fraxinus excelsior",
    "oghamSymbol": "ᚅ",
    "oghamName": "Nion",
    "periods": [
      {
        "startMonth": 2,
        "startDay": 18,
        "endMonth": 3,
        "endDay": 17,
        "label": "18 Şubat - 17 Mart"
      }
    ],
    "archetype": "Kozmik Vizyoner & Hayat Ağacı Ruhu",
    "element": "Su & Ateş",
    "rulingPlanets": "Neptün & Güneş",
    "colorTheme": {
      "primary": "#2563EB",
      "secondary": "#38BDF8",
      "badgeBg": "rgba(37, 99, 235, 0.15)"
    },
    "spiritualEssence": "Kuzey ve Kelt mitolojisinde tüm evreni birbirine bağlayan kadim Dünya ve Hayat Ağacı (Yggdrasil) bir Dişbudak'tır (Nion). Kökleri derin sulara, dalları ise yıldızların katına uzanır. Dişbudak insanı yüksek ideallerle, geniş vizyonla ve dünyayı değiştirecek ilham verici projelerle yaşar. Küçük dünyevi hesaplara takılmaz; daima büyük resmi hedefler.",
    "lightTraits": [
      "Geniş açılı vizyon, ilham verici hedefler koyma ve insanları sürükleme",
      "Yüksek özgüven, bağımsızlık ve kimseden emir almayan hür irade",
      "Kaderin büyük akışını sezebilme ve krizleri avantaja çevirme zekası",
      "Cömert, dost canlısı ve sevdiklerine geniş ufuklar açan rehberlik"
    ],
    "shadowTraits": [
      "Aşırı talepkar olma, çevresindekileri kendi hedeflerine alet etme riski",
      "Eleştiriye tahammülsüzlük ve kendi vizyonunu mutlak doğru sayma",
      "Gündelik sıradan sorumlulukları küçümseyip detaylarda tökezleme",
      "Hırslarına yenik düşüp duygusal bağları ihmal etme eğilimi"
    ],
    "natureRitual": {
      "grounding": "Yüksek bir tepedeki dişbudak ağacının yanında durup rüzgara karşı kollarınızı açın. Gökyüzü ile yeryüzü arasında bir köprü olduğunuzu hissedin.",
      "ambientAroma": "Buhur (Frankincense / Akgünlük) ve Limon uçucu yağı buhuru (Difüzörde; vizyonu berraklaştırır, büyük amaçlara odaklanmayı kolaylaştırır).",
      "soulPractice": "Büyük hayallerinize giden yolda bugün yapılması gereken en küçük, en sıkıcı pratik adımı tamamlayın."
    },
    "relationships": {
      "resonantTrees": [
        "Meşe Ağacı",
        "Kızılağaç",
        "Sarmaşık"
      ],
      "catalystTrees": [
        "Söğüt Ağacı",
        "Kamış"
      ]
    },
    "druidicProverb": "Dişbudak ağacı kökleriyle dünyayı, dallarıyla yıldızları taşır; vizyonu dar olan onun gölgesini anlayamaz."
  },
  {
    "id": "alder",
    "name": "Kızılağaç",
    "botanicalName": "Alnus glutinosa",
    "oghamSymbol": "ᚃ",
    "oghamName": "Fearn",
    "periods": [
      {
        "startMonth": 3,
        "startDay": 18,
        "endMonth": 4,
        "endDay": 14,
        "label": "18 Mart - 14 Nisan"
      }
    ],
    "archetype": "Manevi Muhafız & Cesur Öncü (Ruhsal Kalkan)",
    "element": "Ateş & Su",
    "rulingPlanets": "Mars & Güneş",
    "colorTheme": {
      "primary": "#DC2626",
      "secondary": "#F87171",
      "badgeBg": "rgba(220, 38, 38, 0.15)"
    },
    "spiritualEssence": "Kızılağaç (Fearn), suyun altında kaldıkça çürümek yerine taşlaşarak sertleşen olağanüstü bir direnç ağacıdır. Kelt savaşçılarının kutsal kalkanları kızılağaçtan yontulurdu; çünkü bu ağaç hem fiziksel darbeleri hem de manevi negatif enerjileri geri püskürtür. Bu ağacın insanları, zorluklar ve baskılar altında dağılmaz; aksine kriz anlarında sarsılmaz bir cesaret ve liderlik sergiler.",
    "lightTraits": [
      "Baskı ve kriz anlarında sarsılmaz cesaret ve dirayet",
      "Sevdiklerini ve hakikatini koruma konusunda yüksek koruyuculuk",
      "Harekete geçme cesareti, öncülük ve pratik çözüm üretme dehası",
      "Duygusal derinlikle fiziksel gücü harmanlayan asil duruş"
    ],
    "shadowTraits": [
      "Gereksiz yere kavgacı veya savunmacı bir tutuma bürünme",
      "Kendi sınırlarını korurken başkalarının alanına sert müdahale etme",
      "Sabırsızlık ve diplomasi yerine doğrudan güç kullanma eğilimi",
      "Yaralanmaktan korktuğu için duygularını kalın bir kabuk arkasına saklama"
    ],
    "natureRitual": {
      "grounding": "Bir nehir veya su kenarındaki kızılağacın yanında durun. Ayaklarınızı nemli toprağa basarak içinizdeki öfkeyi ve telaşı suyun akışına teslim edin.",
      "ambientAroma": "Sedir ve Biberiye uçucu yağı buhuru (Yalnızca difüzör; zihni uyarır, cesaret ve odaklanma aşılar).",
      "soulPractice": "Bugün ertelediğiniz ve yüzleşmekten çekindiğiniz tek bir zorlu konuşmayı nezaketle ama kararlılıkla yapın."
    },
    "relationships": {
      "resonantTrees": [
        "Meşe Ağacı",
        "Dişbudak Ağacı",
        "Alıç Ağacı"
      ],
      "catalystTrees": [
        "Söğüt Ağacı",
        "Fındık Ağacı"
      ]
    },
    "druidicProverb": "Kızılağaç suyun içinde çürümez; asil ruh fırtınalarda eğilse de köklerinden kopmaz."
  },
  {
    "id": "willow",
    "name": "Söğüt Ağacı",
    "botanicalName": "Salix alba",
    "oghamSymbol": "ᚄ",
    "oghamName": "Saille",
    "periods": [
      {
        "startMonth": 4,
        "startDay": 15,
        "endMonth": 5,
        "endDay": 12,
        "label": "15 Nisan - 12 Mayıs"
      }
    ],
    "archetype": "Ay Büyücüsü & Bilinçaltı Şifacısı (Duygusal Bilgelik)",
    "element": "Su & Ruh",
    "rulingPlanets": "Ay & Neptün",
    "colorTheme": {
      "primary": "#06B6D4",
      "secondary": "#A5F3FC",
      "badgeBg": "rgba(6, 182, 212, 0.15)"
    },
    "spiritualEssence": "Söğüt (Saille), Ay'ın evreleriyle ve suların gelgitleriyle nefes alan kutsal Druid şifa ağacıdır. Nehir kenarlarında eğilen zarif dalları esnekliği, fırtınaya direnmek yerine onunla akmayı simgeler. Söğüt insanları olağanüstü sezgilere, güçlü rüya hafızasına ve insanların acılarını bir dokunuşla dindiren derin bir şefkate sahiptir.",
    "lightTraits": [
      "Gelişmiş psişik sezgiler, durugörü ve bilinçaltını okuma gücü",
      "Fırtınalarda kırılmayan, esnek ve akışa güvenen adaptasyon",
      "Derin empati, merhamet ve çevresine huzur veren dingin aura",
      "Sanatsal ilham, şiirsel zeka ve duyguları dönüştürme ustalığı"
    ],
    "shadowTraits": [
      "Aşırı duygusallık, melankoliye ve kurban psikolojisine kapılma",
      "Kendi sınırlarını koruyamayıp başkalarının dertleriyle tükenme",
      "Ruh halinin Ay döngüsü gibi aşırı iniş çıkışlar göstermesi",
      "Gerçeklerden kaçarak pasif-agresif davranışlar sergileme"
    ],
    "natureRitual": {
      "grounding": "Dolunay veya hilal gecesinde su kenarındaki bir söğüt ağacının dallarına dokunun. Zihninizdeki tüm kaygıları suya bıraktığınızı imgeleyin.",
      "ambientAroma": "Papatya ve Lavanta buhuru (Difüzörde; duygusal gerginliği çözer, derin ve huzurlu bir uyku verir).",
      "soulPractice": "Her sabah uyandığınızda gördüğünüz rüyaları not alın ve bilinçaltınızın size fısıldadığı mesajları dinleyin."
    },
    "relationships": {
      "resonantTrees": [
        "Fındık Ağacı",
        "Asma",
        "Huş Ağacı"
      ],
      "catalystTrees": [
        "Kızılağaç",
        "Meşe Ağacı"
      ]
    },
    "druidicProverb": "Söğüt rüzgara karşı direnmez, onunla dans eder; en güçlü olan değil, en esnek olan hayatta kalır."
  },
  {
    "id": "hawthorn",
    "name": "Alıç Ağacı",
    "botanicalName": "Crataegus monogyna",
    "oghamSymbol": "ᚆ",
    "oghamName": "Huath",
    "periods": [
      {
        "startMonth": 5,
        "startDay": 13,
        "endMonth": 6,
        "endDay": 9,
        "label": "13 Mayıs - 9 Haziran"
      }
    ],
    "archetype": "Kalp Kapısının Bekçisi & Sezgisel Sınır (İçsel Simyacı)",
    "element": "Hava & Ateş",
    "rulingPlanets": "Venüs & Mars",
    "colorTheme": {
      "primary": "#EC4899",
      "secondary": "#F472B6",
      "badgeBg": "rgba(236, 72, 153, 0.15)"
    },
    "spiritualEssence": "Alıç (Huath), Kelt mitolojisinde doğaüstü boyutlarla dünya arasındaki sınır çizgisidir. Dikenleriyle sınır koymayı, bembeyaz ve pembe çiçekleriyle ise koşulsuz sevginin kapısını korumayı öğretir. Alıç insanları dışarıdan gizemli veya mesafeli görünebilir; ancak derinlerinde tutkulu, yaratıcı ve kalbinin ritmini hisseden bir simyacı taşırlar.",
    "lightTraits": [
      "Sağlıklı sınırlar çizme ve kendi enerjisini koruma ustalığı",
      "Derin empati, kalbin bilgeliğini duyma ve incelikli zarafet",
      "Yüksek yaratıcılık, merak ve sıra dışı problemlere özgün çözümler",
      "İnsanların gerçek niyetlerini sezebilen keskin içgörü"
    ],
    "shadowTraits": [
      "Aşırı ketum olma ve insanlara güvenmekte zorlanma",
      "Dikenlerini gereğinden fazla dışarı çıkarıp sevdiklerini incitme riski",
      "İçsel çelişkileri dışarıya öfke veya alaycılık olarak yansıtma",
      "Duygusal iniş çıkışlarda kendini tamamen kabuğuna çekme"
    ],
    "natureRitual": {
      "grounding": "Çiçek açmış bir alıç ağacının yanına yaklaşın. Derin bir nefes alıp kalbinizin üzerine elinizi koyun ve \"Sınırlarım benim kutsal alanımdır\" deyin.",
      "ambientAroma": "Gül ve Bergamot uçucu yağı buhuru (Difüzörde; kalp merkezini yumuşatır, güven ve huzur yayar).",
      "soulPractice": "Bugün başkalarını memnun etmek için istemediğiniz bir şeye \"evet\" demek yerine, nezaketle \"hayır\" deyin."
    },
    "relationships": {
      "resonantTrees": [
        "Huş Ağacı",
        "Kızılağaç",
        "Sarmaşık"
      ],
      "catalystTrees": [
        "Çobanpüskülü",
        "Meşe Ağacı"
      ]
    },
    "druidicProverb": "Alıç ağacı dikenleriyle kalbini korur, çiçekleriyle dünyayı büyüler; gerçek güç sınırlarını bilmektir."
  },
  {
    "id": "oak",
    "name": "Meşe Ağacı",
    "botanicalName": "Quercus robur",
    "oghamSymbol": "ᚇ",
    "oghamName": "Duir",
    "periods": [
      {
        "startMonth": 6,
        "startDay": 10,
        "endMonth": 7,
        "endDay": 7,
        "label": "10 Haziran - 7 Temmuz"
      }
    ],
    "archetype": "Kozmik Koruyucu & Sarsılmaz Kudret (Kapı Bekçisi)",
    "element": "Ateş & Toprak",
    "rulingPlanets": "Güneş & Jüpiter",
    "colorTheme": {
      "primary": "#10B981",
      "secondary": "#F59E0B",
      "badgeBg": "rgba(16, 185, 129, 0.15)"
    },
    "spiritualEssence": "Druid rahiplerinin en kutsal ağacı olan Meşe (Duir - Keltçe \"Kapı\"), görünen dünya ile görünmeyen boyutlar arasındaki geçit bekçisidir. Kökleri yerin en derinlerine inerken dalları gök kubbeyi kucaklar. Bu ağacın ruhunu taşıyanlar, fırtınalarda asla kırılmayan, çevresindekilere sığınak olan doğal liderlerdir.",
    "lightTraits": [
      "Olağanüstü içsel güç ve yüksek kriz yönetimi kabiliyeti",
      "Doğal koruyuculuk, cömertlik ve sarsılmaz adalet duygusu",
      "Zorluklar karşısında dirayet ve uzun vadeli vizyon kurma yeteneği",
      "Etrafındaki insanlara güven ve emniyet aşılayan bilge karizma"
    ],
    "shadowTraits": [
      "Gereğinden fazla katılaşma, esneklik gösterememe ve inatçılık",
      "Tüm yükü tek başına sırtlanarak duygusal yıpranmaya teslim olma",
      "Kırılganlığını zayıflık sayıp kimseye yardım istememe eğilimi",
      "Otoritesini koruma kaygısıyla değişime direnç gösterme"
    ],
    "natureRitual": {
      "grounding": "Güneşli bir günde yaşlı bir meşe ağacının sırtına yaslanarak köklerinden toprağa bağlandığınızı imgeleyin. 15 dakika nefesinize odaklanmak omurga hattınızı hizalar.",
      "ambientAroma": "Meşe Yosunu ve Sedir uçucu yağı buhuru (Difüzörde; mekana derin bir sükunet ve topraklanma titreşimi yayar).",
      "soulPractice": "Zor bir karar anında acele etmeyin; meşe gibi köklenip fırtınanın dinmesini bekleyin ve sonra konuşun."
    },
    "relationships": {
      "resonantTrees": [
        "Huş Ağacı",
        "Dişbudak Ağacı",
        "Çobanpüskülü"
      ],
      "catalystTrees": [
        "Söğüt Ağacı",
        "Fındık Ağacı"
      ]
    },
    "druidicProverb": "En sert rüzgarlar en derin köklü meşeleri yıpratamaz; yalnızca yapraklarındaki gereksiz yükleri döker."
  },
  {
    "id": "holly",
    "name": "Çobanpüskülü",
    "botanicalName": "Ilex aquifolium",
    "oghamSymbol": "ᚈ",
    "oghamName": "Tinne",
    "periods": [
      {
        "startMonth": 7,
        "startDay": 8,
        "endMonth": 8,
        "endDay": 4,
        "label": "8 Temmuz - 4 Ağustos"
      }
    ],
    "archetype": "Işığın Asil Şövalyesi & Sarsılmaz Lider (Karakter Gücü)",
    "element": "Ateş & Toprak",
    "rulingPlanets": "Mars & Güneş",
    "colorTheme": {
      "primary": "#059669",
      "secondary": "#EF4444",
      "badgeBg": "rgba(5, 150, 105, 0.15)"
    },
    "spiritualEssence": "Kelt efsanelerinde Çobanpüskülü Kralı (Tinne), yılın karanlık yarısını Meşe Kralı ile nöbetleşe yöneten kudretli orman bekçisidir. Kışın en çetin soğuklarında bile yapraklarını dökmeyen, kırmızı meyveleriyle yaşama meydan okuyan asalet simgesidir. Tinne insanları yüksek özsaygı, liderlik adaleti ve sözünün eri olma erdemiyle tanınır.",
    "lightTraits": [
      "Doğuştan gelen asil liderlik ve kriz anlarında sorumluluk alma",
      "Zorluklar karşısında asla pes etmeyen yüksek dayanıklılık",
      "Cömertlik, sadakat ve etrafındakilere kol kanat germe",
      "Yüksek hedefler koyup adım adım sonuca ulaştıran kararlılık"
    ],
    "shadowTraits": [
      "Aşırı gurur, kibir ve yardım kabul etmekte zorlanma",
      "Başkalarının eksikliklerine karşı sabırsız ve talepkar olma",
      "Rekabeti kişiselleştirip başarısızlığa tahammül edememe",
      "Duygusal hassasiyetlerini gizlemek için fazla otoriter görünme"
    ],
    "natureRitual": {
      "grounding": "Yaprak dökmeyen yaşlı bir çobanpüskülü veya meşe ağacının önünde dik durun. Omurganızın bir aslan gibi dikleştiğini hissedin.",
      "ambientAroma": "Çam İğnesi ve Sedir Ağacı uçucu yağı buhuru (Difüzörde; mekana asil bir güç, ferahlık ve odaklanma katar).",
      "soulPractice": "Bugün başarınızı tek başınıza sahiplenmek yerine, arkasındaki ekibinize veya ailenize teşekkür ederek onları yüceltin."
    },
    "relationships": {
      "resonantTrees": [
        "Meşe Ağacı",
        "Dişbudak Ağacı",
        "Mürver Ağacı"
      ],
      "catalystTrees": [
        "Alıç Ağacı",
        "Söğüt Ağacı"
      ]
    },
    "druidicProverb": "Çobanpüskülü kar altında yeşil kalır; asil karakter kriz anında kim olduğunu gösterir."
  },
  {
    "id": "hazel",
    "name": "Fındık Ağacı",
    "botanicalName": "Corylus avellana",
    "oghamSymbol": "ᚉ",
    "oghamName": "Coll",
    "periods": [
      {
        "startMonth": 8,
        "startDay": 5,
        "endMonth": 9,
        "endDay": 1,
        "label": "5 Ağustos - 1 Eylül"
      }
    ],
    "archetype": "Kadim Bilgeliğin Muhafızı & Yaratıcı Deha (Kutsal Sezgi)",
    "element": "Hava & Su",
    "rulingPlanets": "Merkür & Ay",
    "colorTheme": {
      "primary": "#F59E0B",
      "secondary": "#FDE68A",
      "badgeBg": "rgba(245, 158, 11, 0.15)"
    },
    "spiritualEssence": "Kelt mitolojisinde kutsal Bilgelik Havuzu'nun çevresinde 9 fındık ağacı (Coll) dururdu. Havuza düşen fındıkları yiyen Kelt somonu evrensel bilgiye ulaşırdı. Fındık insanları keskin bir zekaya, hızlı öğrenme kabiliyetine, büyüleyici bir auraya ve karmaşık meseleleri tek hamlede çözen yaratıcı bir zihne sahiptir.",
    "lightTraits": [
      "Sıra dışı zeka, güçlü hafıza ve entelektüel kavrayış kabiliyeti",
      "İnsanları etkileyen karizmatik anlatım, espri ve söz ustalığı",
      "Özgün fikirler üretme, sanatsal ilham ve stratejik deha",
      "Bilgiye duyulan derin saygı ve öğrendiklerini cömertçe paylaşma"
    ],
    "shadowTraits": [
      "Zihinsel aşırı yüklenme ve beynini bir türlü susturamama",
      "Çevresindekilerin yavaşlığına karşı sabırsız ve alaycı olma",
      "Duygusal meseleleri fazla analiz ederek kalbin sesini bastırma",
      "Mükemmeliyetçilik sebebiyle projeleri bitirmekte zorlanma"
    ],
    "natureRitual": {
      "grounding": "Bir fındık ağacının gölgesinde oturun. Avucunuza bir fındık veya çakıl taşı alıp parmaklarınızla dokunun; zihninizin berraklaştığını hissedin.",
      "ambientAroma": "Nane ve Biberiye uçucu yağı buhuru (Difüzörde; konsantrasyonu artırır, zihinsel sisi dağıtır).",
      "soulPractice": "Bugün yeni bir şey öğrendiğinizde onu kendi içinizde tutmayın; sevdiklerinizden birine ilham olacak şekilde anlatın."
    },
    "relationships": {
      "resonantTrees": [
        "Asma",
        "Söğüt Ağacı",
        "Dişbudak Ağacı"
      ],
      "catalystTrees": [
        "Kızılağaç",
        "Meşe Ağacı"
      ]
    },
    "druidicProverb": "Fındığın kabuğu serttir ama içi saf bilgeliktir; hakikat sabırla arayanlara açılır."
  },
  {
    "id": "vine",
    "name": "Asma",
    "botanicalName": "Vitis vinifera",
    "oghamSymbol": "ᚋ",
    "oghamName": "Muin",
    "periods": [
      {
        "startMonth": 9,
        "startDay": 2,
        "endMonth": 9,
        "endDay": 29,
        "label": "2 Eylül - 29 Eylül"
      }
    ],
    "archetype": "Ruhsal Hasat & Bilgelik Simyacısı (İçsel Denge)",
    "element": "Su & Toprak",
    "rulingPlanets": "Venüs & Jüpiter",
    "colorTheme": {
      "primary": "#7C3AED",
      "secondary": "#C084FC",
      "badgeBg": "rgba(124, 58, 237, 0.15)"
    },
    "spiritualEssence": "Asma (Muin), Kelt geleneğinde sonbahar ekinoksunun bereket ve hasat sembolüdür. Derin kökleriyle topraktan aldığı acıyı ve tecrübeyi, tatlı ve besleyici bir meyveye dönüştürür. Asma insanları yüksek estetik zevk, felsefi derinlik, empati ve zıtlıkları uyumlu bir senteze ulaştırma kabiliyetine sahiptir.",
    "lightTraits": [
      "Yüksek sezgisel anlayış ve insan psikolojisini derinlemesine çözme",
      "Zıt fikirleri ve çatışmaları uzlaştıran diplomatik zeka",
      "Estetik, sanat, müzik ve incelikli yaşam kültürüne düşkünlük",
      "Hayatın krizlerinden ders çıkarıp olgunlaşma yeteneği"
    ],
    "shadowTraits": [
      "Kararsızlık ve iki seçenek arasında uzun süre bocalama",
      "Ruh halinin çabuk dalgalanması ve melankoliye eğilim",
      "Aşırı konfor düşkünlüğü veya zevklerin bağımlısı olma riski",
      "Başkalarının duygusal yüklerini sünger gibi çekip yorulma"
    ],
    "natureRitual": {
      "grounding": "Bir bağda veya yaprakları kızıla dönmüş bir asmanın altında oturun. Hayatınızda verdiğiniz emeklerin meyvelerini tek tek hatırlayıp şükredin.",
      "ambientAroma": "Tatlı Portakal ve Adaçayı uçucu yağı buhuru (Difüzörde; neşe, bereket ve dingin bir zihinsel ferahlık yayar).",
      "soulPractice": "Bugün karar vermekte zorlandığınız bir konuda zihninizle değil, karnınızdaki ilk sezgisel hisle seçim yapın."
    },
    "relationships": {
      "resonantTrees": [
        "Fındık Ağacı",
        "Söğüt Ağacı",
        "Huş Ağacı"
      ],
      "catalystTrees": [
        "Çobanpüskülü",
        "Kızılağaç"
      ]
    },
    "druidicProverb": "Ham üzüm sabırla güneşte bekledikçe tatlanır; ruhun olgunluğu aceleyle değil, hayatın demiyle kazanılır."
  },
  {
    "id": "ivy",
    "name": "Sarmaşık",
    "botanicalName": "Hedera helix",
    "oghamSymbol": "ᚌ",
    "oghamName": "Gort",
    "periods": [
      {
        "startMonth": 9,
        "startDay": 30,
        "endMonth": 10,
        "endDay": 27,
        "label": "30 Eylül - 27 Ekim"
      }
    ],
    "archetype": "Sarsılmaz Azim & Sadık Yolcu (Engelleri Aşan Ruh)",
    "element": "Su & Hava",
    "rulingPlanets": "Satürn & Ay",
    "colorTheme": {
      "primary": "#0D9488",
      "secondary": "#2DD4BF",
      "badgeBg": "rgba(13, 148, 136, 0.15)"
    },
    "spiritualEssence": "Sarmaşık (Gort), en kaygan duvarlara ve en dik uçurumlara inatla tırmanan yenilmez iradedir. Diğer bitkilerin solduğu sonbahar sonlarında çiçek açarak doğanın döngüsünü canlı tutar. Sarmaşık insanları, imkansız görünen şartlarda bile çıkış yolu bulan, sevdiklerine derinden bağlı, sadakat timsali güçlü ruhlardır.",
    "lightTraits": [
      "Engeller karşısında olağanüstü dayanıklılık ve tırmanma azmi",
      "Derin sadakat, dostluk ve fedakar bağlılık erdemi",
      "Karanlık veya zorlu durumlarda çözüm üreten pratik strateji",
      "Zor zamanlarda sevdiklerine sığınak ve dayanak olma"
    ],
    "shadowTraits": [
      "Bağımlı ilişkiler kurma ve ayrılmakta aşırı zorlanma",
      "Kendi değerini başkalarının sevgisine ve onayına bağlama riski",
      "İnatçılık yapıp bırakılması gereken durumları zorla sürdürme",
      "Zihnini kuruntulara ve gizli şüphelere fazla kaptırma"
    ],
    "natureRitual": {
      "grounding": "Taş bir duvara sarılmış yeşil sarmaşıklara dokunun. Parmak uçlarınızla onun tutunma köklerini hissedin ve içinizdeki gücü toprağa bağlayın.",
      "ambientAroma": "Okaliptüs ve Lavanta buhuru (Difüzörde; nefesi açar, zihindeki tıkanıklıkları dağıtır).",
      "soulPractice": "Bugün size artık hizmet etmeyen, sadece alışkanlıktan sürdürdüğünüz bir düşünceyi veya eşyayı serbest bırakın."
    },
    "relationships": {
      "resonantTrees": [
        "Alıç Ağacı",
        "Dişbudak Ağacı",
        "Meşe Ağacı"
      ],
      "catalystTrees": [
        "Asma",
        "Huş Ağacı"
      ]
    },
    "druidicProverb": "Sarmaşık taşı çatlatarak değil, ona sabırla sarılarak zirveye ulaşır; gerçek güç sebat etmektir."
  },
  {
    "id": "reed",
    "name": "Kamış",
    "botanicalName": "Phragmites australis",
    "oghamSymbol": "ᚍ",
    "oghamName": "Ngetal",
    "periods": [
      {
        "startMonth": 10,
        "startDay": 28,
        "endMonth": 11,
        "endDay": 24,
        "label": "28 Ekim - 24 Kasım"
      }
    ],
    "archetype": "Gizemlerin Kaşifi & Derin Bilge (Hakikat Arayıcısı)",
    "element": "Su & Hava",
    "rulingPlanets": "Plüton & Neptün",
    "colorTheme": {
      "primary": "#6366F1",
      "secondary": "#A5B4FC",
      "badgeBg": "rgba(99, 102, 241, 0.15)"
    },
    "spiritualEssence": "Kamış (Ngetal), Samhain kapısının (Kelt yeni yılı) kutsal ağacıdır. Kelt ozanlarının flütleri ve Druidlerin yazı kalemleri kamıştan yapılırdı. Kökleri derin sulara inerken fırtınada esner ama asla kırılmaz. Kamış ruhu, görünmeyenin ardındaki hakikati arayan, sırlar saklayan ve sözün büyüleyici gücünü bilen bir kâşiftir.",
    "lightTraits": [
      "İnsanların gizli motivasyonlarını anında sezen keskin radar",
      "Büyük fırtınalarda esneyip kırılmayan olağanüstü esneklik",
      "Güçlü hitabet, kelimeleri etkili kullanma ve yazarlık yeteneği",
      "Kriz ve dönüşüm anlarında soğukkanlılıkla yön bulma"
    ],
    "shadowTraits": [
      "Aşırı şüphecilik, takıntılı araştırmalar ve gizlilik tutkusu",
      "İnsanları manipüle etme veya güç oyunlarına çekilme riski",
      "Yıkıcı duyguları içinde biriktirip içine kapanma eğilimi",
      "Başkalarının sınırlarını fazla zorlayıp onları rahatsız etme"
    ],
    "natureRitual": {
      "grounding": "Bir göl veya gölet kenarındaki sazlıkların hışırtısını dinleyin. Rüzgarın kamışlar arasındaki melodisine odaklanarak zihninizi boşaltın.",
      "ambientAroma": "Mür (Myrrh) ve Paçuli buhuru (Difüzörde; meditatif konsantrasyonu derinleştirir, derin sezgileri uyarır).",
      "soulPractice": "Bugün içinizde sakladığınız bir şüpheyi konuşmak yerine, bir kağıda yazın ve sonra o kağıdı yırtarak serbest bırakın."
    },
    "relationships": {
      "resonantTrees": [
        "Dişbudak Ağacı",
        "Mürver Ağacı",
        "Söğüt Ağacı"
      ],
      "catalystTrees": [
        "Meşe Ağacı",
        "Kızılağaç"
      ]
    },
    "druidicProverb": "Fırtınada sert ağaçlar devrilir, esnek kamış bükülür ve rüzgar dindiğinde dimdik ayağa kalkar."
  },
  {
    "id": "elder",
    "name": "Mürver Ağacı",
    "botanicalName": "Sambucus nigra",
    "oghamSymbol": "ᚎ",
    "oghamName": "Ruis",
    "periods": [
      {
        "startMonth": 11,
        "startDay": 25,
        "endMonth": 12,
        "endDay": 23,
        "label": "25 Kasım - 23 Aralık"
      }
    ],
    "archetype": "Döngülerin Efendisi & Büyük Şifacı (Yeniden Doğuş Kapısı)",
    "element": "Toprak & Su",
    "rulingPlanets": "Satürn & Ay",
    "colorTheme": {
      "primary": "#8B5CF6",
      "secondary": "#DDD6FE",
      "badgeBg": "rgba(139, 92, 246, 0.15)"
    },
    "spiritualEssence": "Mürver (Ruis), 13 aylık Kelt Ogham döngüsünün 13. ve sonuncu kapısıdır. Kelt geleneğinde Mürver Ana, ölüm ve yeniden doğumun, döngülerin tamamlanmasının ve eskiyi bırakmanın bekçisidir. Kış gündönümünden hemen önce tüm yüklerin arınmasını sağlar. Mürver insanları hayatın derin gizemlerini kavrayan, bağımsız ve evrensel bilgeliğe açık yaşlı ruhlardır.",
    "lightTraits": [
      "Eski döngüleri kapatıp cesaretle yeniye başlama bilgeliği",
      "Yüksek ruhsal şifa gücü, insanları teselli etme ve dönüştürme",
      "Sıra dışı özgürlük aşkı, toplumsal kalıpların ötesine geçme",
      "Büyük resmi görme ve kaderin iniş çıkışlarını vakarla karşılama"
    ],
    "shadowTraits": [
      "Gereksiz yere acımasızca köprüleri yıkıp arkasına bakmama riski",
      "Yalnızlaşma, insanlardan uzaklaşıp yabancılaşma eğilimi",
      "Aşırı dobralıkla sevdiklerinin kalbini kırma riski",
      "Hayatın sıradan zevklerini küçümseyip nihilist düşüncelere kapılma"
    ],
    "natureRitual": {
      "grounding": "Bir mürver ağacının gövdesine elinizi koyun. Hayatınızda artık bitmesi gereken bir dönemi zihninizde mürverin köklerine bırakın.",
      "ambientAroma": "Akgünlük (Frankincense) ve Mürver çiçeği buhuru (Difüzörde; arınma, kutsal koruma ve içsel dinginlik aşılar).",
      "soulPractice": "Bugün artık size hizmet etmeyen bir eşyayı, ilişki kalıbını veya dargınlığı tamamen affederek bitirin."
    },
    "relationships": {
      "resonantTrees": [
        "Huş Ağacı",
        "Kamış",
        "Çobanpüskülü"
      ],
      "catalystTrees": [
        "Üvez Ağacı",
        "Fındık Ağacı"
      ]
    },
    "druidicProverb": "Mürver yapraklarını dökmeden yeni baharın tomurcuklarını hazırlar; her son, içinde daha büyük bir başlangıç taşır."
  }
];

export const OGHAM_TREES: DruidTree[] = DRUID_TREES;

/**
 * Belirli bir tarihin periyot içinde olup olmadığını denetler (yıl atlama durumları dahil).
 */
function isDateInPeriod(day: number, month: number, period: DruidTreePeriod): boolean {
  const { startMonth, startDay, endMonth, endDay } = period;

  // Aynı ay içinde
  if (startMonth === endMonth) {
    return month === startMonth && day >= startDay && day <= endDay;
  }

  // Normal yıl akışı (örneğin 18 Şubat - 17 Mart)
  if (startMonth < endMonth) {
    if (month === startMonth && day >= startDay) return true;
    if (month === endMonth && day <= endDay) return true;
    if (month > startMonth && month < endMonth) return true;
    return false;
  }

  // Yıl dönümünü aşan aralık (örneğin 24 Aralık - 20 Ocak)
  if (startMonth > endMonth) {
    if (month === startMonth && day >= startDay) return true;
    if (month === endMonth && day <= endDay) return true;
    if (month > startMonth || month < endMonth) return true;
    return false;
  }

  return false;
}

/**
 * Verilen gün ve ay bilgisine göre Kelt Druid Ağacını hesaplar.
 * @param day Doğum günü (1-31)
 * @param month Doğum ayı (1-12)
 * @returns Eşleşen tek ve kesin DruidTree nesnesi
 */
export function getDruidTreeByDate(day: number, month: number): DruidTree {
  for (const tree of DRUID_TREES) {
    for (const period of tree.periods) {
      if (isDateInPeriod(day, month, period)) {
        return tree;
      }
    }
  }

  // 23 Aralık kış gündönümü geçiş günü için son ağaç (Mürver)
  return DRUID_TREES[DRUID_TREES.length - 1];
}

export interface DruidTreeAnalysis {
  tree: DruidTree;
  oghamTree: DruidTree;
  primaryTree: DruidTree;
}

/**
 * Belirli bir gün ve ay için Druid Ağaç Analizi döndürür.
 */
export function getDruidTreeAnalysis(day: number, month: number): DruidTreeAnalysis {
  const tree = getDruidTreeByDate(day, month);
  return {
    tree,
    oghamTree: tree,
    primaryTree: tree
  };
}

/**
 * Tüm 13 Kutsal Kelt Ağacını döndürür.
 */
export function getAllDruidTrees(): DruidTree[] {
  return DRUID_TREES;
}

/**
 * Id değerine göre Kelt Ağacı bulur.
 */
export function getDruidTreeById(id: string): DruidTree | undefined {
  return DRUID_TREES.find(t => t.id === id);
}
