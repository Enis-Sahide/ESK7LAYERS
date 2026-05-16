export interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctAnswerIndex: number;
  explanation: string;
}

export interface Quiz {
  id: string;
  title: string;
  description: string;
  questions: QuizQuestion[];
}

export const ruhBedenQuiz1: Quiz = {
  id: "ruh_beden_1",
  title: "1. Derece: Şifanın Temelleri",
  description: "Enerji kanalları (Meridyenler) ve beden-zihin bağlantısının temel yasalarına dair Çıraklık sınavı.",
  questions: [
    {
      id: "rb_1_1",
      question: "Kadim Çin tıbbına ve ezoterik anatomiye göre bedendeki yaşam enerjisine ne ad verilir?",
      options: [
        "Aura",
        "Prana veya Chi (Qi)",
        "Kundalini",
        "Eterik Madde"
      ],
      correctAnswerIndex: 1,
      explanation: "Yaşam enerjisi, Çin tıbbında 'Chi' veya 'Qi', Hint felsefesinde ise 'Prana' olarak adlandırılır. Meridyenler boyunca akan temel şifa gücüdür."
    },
    {
      id: "rb_1_2",
      question: "Bedende kaç adet 'Ana Meridyen' (enerji kanalı) bulunur?",
      options: [
        "7",
        "10",
        "12",
        "24"
      ],
      correctAnswerIndex: 2,
      explanation: "Ezoterik anatomiye göre bedende 12 Ana Meridyen (organlara bağlı) ve 2 Yönetici Meridyen bulunur."
    },
    {
      id: "rb_1_3",
      question: "Ezoterik öğretiye göre fiziksel bir rahatsızlığın birincil ve kök nedeni aşağıdakilerden hangisidir?",
      options: [
        "Çevresel toksinler",
        "Hücresel yaşlanma",
        "Çözülmemiş duygusal ve zihinsel blokajlar",
        "Dengesiz beslenme"
      ],
      correctAnswerIndex: 2,
      explanation: "Her fiziksel rahatsızlığın kökeninde çözülmemiş bir duygusal blokaj yatar. Beden, zihnin taşıyamadığı yükleri fiziksel bir dilde ifade eder."
    },
    {
      id: "rb_1_4",
      question: "Grip (İnfluenza) hastalığının arkasında yatan temel ruhsal blokaj nedir?",
      options: [
        "Değersizlik duygusu",
        "Kitlesel karamsarlık, inançlara uyum ve korku",
        "Geçmişi bırakamama",
        "Yaratıcılığın tıkanması"
      ],
      correctAnswerIndex: 1,
      explanation: "Grip, genellikle kitlesel karamsarlığa kapılma, toplumsal korkulara ortak olma ve istatistiklere inanma eğiliminden kaynaklanır."
    },
    {
      id: "rb_1_5",
      question: "Hangi meridyen 'keder ve üzüntü' duygusunu barındırır ve bu duygu işlenmediğinde o organda zayıflık görülür?",
      options: [
        "Kalp Meridyeni",
        "Böbrek Meridyeni",
        "Akciğer Meridyeni",
        "Mide Meridyeni"
      ],
      correctAnswerIndex: 2,
      explanation: "Akciğer Meridyeni, keder ve üzüntünün barındığı yerdir. Bastırılmış yas veya keder, solunum yolu ve akciğer rahatsızlıklarına dönüşebilir."
    },
    {
      id: "rb_1_6",
      question: "Alkolizm ve benzeri bağımlılıkların altında yatan temel duygusal sebep genellikle nedir?",
      options: [
        "Aşırı özgüven ve ego",
        "Başkalarını yönetme arzusu",
        "Yararsızlık, suçluluk duygusu ve kendinden kaçış",
        "Maddi hırsların karşılanamaması"
      ],
      correctAnswerIndex: 2,
      explanation: "Bağımlılıklar, kişinin hayatla baş edememesi, değersizlik hissi ve kendi içindeki gerçeklikten kaçma arzusunun bir sonucudur."
    },
    {
      id: "rb_1_7",
      question: "Boyun ağrıları (veya boyun tutulması) ruhsal olarak neyi temsil eder?",
      options: [
        "Maddi yetersizlik korkusu",
        "Esnememe, inatçılık ve olaylara farklı bir açıdan bakmayı reddetme",
        "Geçmişin yükünü sırtta taşıma",
        "Geleceğe adım atmaktan korkma"
      ],
      correctAnswerIndex: 1,
      explanation: "Boyun esnekliği temsil eder. Boyun ağrıları veya tutulmaları, kişinin sabit fikirli olması ve inatçılık göstererek başka bakış açılarına kapalı olduğunu gösterir."
    },
    {
      id: "rb_1_8",
      question: "Akupunktur noktaları tam olarak ne işe yarar?",
      options: [
        "Sadece sinir uçlarını uyuşturarak ağrıyı keser",
        "Hücrelerin daha fazla su tutmasını sağlar",
        "Enerji (Chi) nehirlerindeki tıkanıklıkların açıldığı düğüm noktalarıdır",
        "Kan dolaşımını hızlandırıp ateşi yükseltir"
      ],
      correctAnswerIndex: 2,
      explanation: "Akupunktur noktaları, bedendeki enerji kanallarında (meridyenlerde) tıkanan veya düğümlenen Chi'nin serbest bırakıldığı özel kapılardır."
    },
    {
      id: "rb_1_9",
      question: "'Hayatı olduğu gibi kabul edememek ve yaşamı terk etme arzusu' ezoterik olarak hangi hastalığın zihinsel kökeni olarak kabul edilir?",
      options: [
        "Alzheimer hastalığı",
        "Migren",
        "Mide Ülseri",
        "Apandisit"
      ],
      correctAnswerIndex: 0,
      explanation: "Alzheimer ve benzeri bunama hastalıkları, kişinin hayatın gerçeklerinden kaçma, korunma talep etme ve yetişkin dünyasını bırakıp çocukluğun güvenliğine dönme arzusudur."
    },
    {
      id: "rb_1_10",
      question: "Karaciğer Meridyeninde tıkanıklığa yol açan en yıkıcı duygu hangisidir?",
      options: [
        "Neşe",
        "Korku",
        "Öfke ve hayal kırıklığı",
        "Aşırı şefkat"
      ],
      correctAnswerIndex: 2,
      explanation: "Karaciğer Meridyeni, öfke ve hayal kırıklığının merkezidir. Bastırılmış veya patlayıcı öfke karaciğer enerjisini tüketir."
    }
  ]
};

export const ruhBedenQuiz2: Quiz = {
  id: "ruh_beden_2",
  title: "2. Derece: Kalfalık Sınavı",
  description: "Duygusal kökenler, olumlamalar ve meridyen organ ilişkileri üzerine derinleşme sınavı.",
  questions: [
    {
      id: "rb_2_1",
      question: "Böbrek sorunları veya böbrek meridyeni tıkanıklıkları genellikle hangi derin duyguyla bağlantılıdır?",
      options: [
        "Aşırı neşe",
        "Geçmişteki seçimlerden pişmanlık ve korku",
        "Başkalarını yönetme hırsı",
        "Şiddetli öfke"
      ],
      correctAnswerIndex: 1,
      explanation: "Böbrekler korkuyu, eleştiriyi, yargılamayı ve düş kırıklığını depolar. 'Çocuk gibi tepki gösterme' ve derin korkular böbrek meridyenini etkiler."
    },
    {
      id: "rb_2_2",
      question: "Mide rahatsızlıkları (Gastrit vb.) ruhsal planda hangi durumu ifade eder?",
      options: [
        "Geçmişin yüklerinden kurtulamamak",
        "İleriye doğru adım atamamak",
        "Yeni deneyimleri veya fikirleri 'sindirememek', uzun süren kararsızlık",
        "İletişim kuramamak"
      ],
      correctAnswerIndex: 2,
      explanation: "Mide, hayatı ve yeni deneyimleri sindirdiğimiz yerdir. Uzun süreli belirsizlik, kararsızlık veya kötü beklentiler mideyi yorar."
    },
    {
      id: "rb_2_3",
      question: "Guatr (Tiroit) sorunlarının duygusal sebebi aşağıdakilerden hangisidir?",
      options: [
        "Kendini kurban olarak görme ve üzerinde baskılara duyulan nefret",
        "Cinselliği reddetme",
        "Geleceği karanlık görme",
        "Çok fazla maddi yük üstlenme"
      ],
      correctAnswerIndex: 0,
      explanation: "Tiroit boğaz çakrasıyla bağlantılıdır. Guatr, kişinin kendini hayatta engellenmiş hissetmesi, kurban rolüne bürünmesi ve baskılara karşı duyduğu içsel nefretten kaynaklanır."
    },
    {
      id: "rb_2_4",
      question: "Migren ve kronik baş ağrılarının en temel zihinsel sebebi nedir?",
      options: [
        "Değersizlik duygusu, korku ve kendini aşırı eleştirme",
        "Haz yoksunluğu",
        "Yeni şeyleri sindirememe",
        "Bağışlamaktansa ölmeyi yeğleme"
      ],
      correctAnswerIndex: 0,
      explanation: "Baş ağrıları, genellikle kişinin kendini acımasızca eleştirmesi, mükemmeliyetçilik ve içsel değersizlik korkusundan kaynaklanan bir direnç noktasıdır."
    },
    {
      id: "rb_2_5",
      question: "'Görmekten hoşlanmadığı bir hayatı veya durumu yaşamak' aşağıdaki hangi bölge rahatsızlığına neden olur?",
      options: [
        "Kulak rahatsızlıkları",
        "Göz sorunları (Örn: Arpacık, Katarakt)",
        "Diz sorunları",
        "Omuz ağrıları"
      ],
      correctAnswerIndex: 1,
      explanation: "Gözler vizyonu temsil eder. Göz hastalıkları genellikle kişinin geçmişte, şu anda veya gelecekte görmekten korktuğu, görmek istemediği şeylerle bağlantılıdır."
    },
    {
      id: "rb_2_6",
      question: "Sırtın 'alt' bölgesinde (bel) hissedilen ağrılar neyi sembolize eder?",
      options: [
        "Geçmişin duygusal yüklerini taşımayı",
        "Sevgisizlik ve kalp kırıklığını",
        "Maddi (finansal) konulardaki desteksizlik korkusunu ve kaygılarını",
        "İfade edilemeyen yaratıcılığı"
      ],
      correctAnswerIndex: 2,
      explanation: "Sırtın alt kısmı maddi desteği sembolize eder. Bel ağrıları genellikle parasal korkular, maddi güvensizlik veya gelecekte ayakta kalamama kaygısından kaynaklanır."
    },
    {
      id: "rb_2_7",
      question: "Diz sorunları (ağrı veya esnekliğini yitirme) ezoterik manada hangi blokajı gösterir?",
      options: [
        "Başkalarını dinlemek istememe",
        "İnatçı ego, gurur, boyun eğememe ve uzlaşamama",
        "Aşırı fedakarlık",
        "Cinsel suçluluk duygusu"
      ],
      correctAnswerIndex: 1,
      explanation: "Dizler eğilmeyi ve boyun eğmeyi temsil eder. Esnek olmayan, uzlaşmaya direnen ve inatçı bir ego diz problemlerine zemin hazırlar."
    },
    {
      id: "rb_2_8",
      question: "Aşırı kiloluluk (Şişmanlık) bilinçaltında hangi korunma mekanizmasıyla ilişkilendirilir?",
      options: [
        "Düşmanlara karşı büyük görünme isteği",
        "Hayattan korkma, incinmekten korunma ihtiyacı ve duygulardan kaçış (zırh örme)",
        "Yetersiz beslenme endişesi",
        "Aşırı enerji depolama ihtiyacı"
      ],
      correctAnswerIndex: 1,
      explanation: "Bilinçaltı, tehlike hissettiğinde veya incinmekten korktuğunda bedeni 'yalıtmak' için yağ tabakasını bir kalkan (zırh) olarak kullanır."
    },
    {
      id: "rb_2_9",
      question: "Ezoterik beden dilinde 'Bedenin Sağ Tarafı' neyi temsil eder?",
      options: [
        "Duygusal, alıcı ve dişil enerjiyi (Anneyi)",
        "Geleceği ve hayalleri",
        "Verici, eyleme dönük, eril enerjiyi (Babayı / Erkekleri)",
        "Geçmişi ve karmayı"
      ],
      correctAnswerIndex: 2,
      explanation: "Bedenin sağ tarafı eril enerjiyi, dışa dönüklüğü, eylemi ve baba figürünü temsil eder. Sol taraf ise dişil enerji, alıcılık ve anne figürüdür."
    },
    {
      id: "rb_2_10",
      question: "Anemi (Kansızlık) yaşayan bir kişinin zihinsel kalıbı nasıldır?",
      options: [
        "Çok enerjik ama odaklanamamış",
        "'Evet ama...' yaklaşımı, haz yoksunluğu ve hayata karşı ilgisizlik",
        "Sürekli eleştiren ve kontrol eden",
        "Kararsız ve yeni fikirlere kapalı"
      ],
      correctAnswerIndex: 1,
      explanation: "Kan, hayattaki hazzı temsil eder. Kansızlık, yaşamdan zevk alamama, 'Evet ama' diyerek sürekli negatiflere odaklanma ve tükenmişlik hissini gösterir."
    },
    {
      id: "rb_2_11",
      question: "Kabızlık, zihinsel planda neyin yansımasıdır?",
      options: [
        "Maddi israf korkusu",
        "Eski fikirlerden veya geçmişten vazgeçmeyi reddetme, cimrilik",
        "Acelecilik ve sabırsızlık",
        "İçine kapanıklık"
      ],
      correctAnswerIndex: 1,
      explanation: "Bağırsaklar atma eylemini yönetir. Kabızlık, geçmişin tortularını bırakamama, eski düşüncelerde takılı kalma ve güvensizlik kaynaklı 'tutma' eğilimidir."
    },
    {
      id: "rb_2_12",
      question: "Astım krizlerinin temel duygusal kökeni aşağıdakilerden hangisidir?",
      options: [
        "Yenilikten korkma",
        "Kendi adına konuşamama",
        "Boğucu sevgi, kendi bireyliğini hissedememe ve bastırılmış ağlama",
        "Suçluluk duygusu"
      ],
      correctAnswerIndex: 2,
      explanation: "Astım, sevginin boğucu bir hal alması veya kişinin kendi alanını (oksijenini) savunamamasıdır. Göğüsteki daralma, bastırılmış bir ağlama refleksidir."
    },
    {
      id: "rb_2_13",
      question: "Apandisit hastalığının ezoterik ruhsal nedeni nedir?",
      options: [
        "Öfke patlaması",
        "Yaşam korkusu ve iyi şeylerin hayatına akışını engellemek",
        "Eleştirilere katlanamamak",
        "Kontrolü kaybetme korkusu"
      ],
      correctAnswerIndex: 1,
      explanation: "Apandisit, yoğun yaşam korkusunu ve kişinin kendi hayatına akacak güzelliklere (hazza) direnç gösterip yolları tıkamasını ifade eder."
    },
    {
      id: "rb_2_14",
      question: "Boğaz rahatsızlıkları (Anjin, İltihap) genellikle neyin ifadesidir?",
      options: [
        "Beslenmeyi reddetme",
        "Kendi adına konuşamamak, yutulmuş kızgınlık ve tıkanmış yaratıcılık",
        "Aşırı kontrolcülük",
        "Dinlemeyi reddetme"
      ],
      correctAnswerIndex: 1,
      explanation: "Boğaz çakrası ifadenin merkezidir. Konuşamamak, yutkunarak bastırılan öfkeler ve ifade edilmeyen duygular boğaz rahatsızlıklarına dönüşür."
    },
    {
      id: "rb_2_15",
      question: "Diyabet (Şeker) hastalarının genel duygusal örüntüsü nasıldır?",
      options: [
        "Sürekli neşe arayışı",
        "Geçmişteki seçimlerinden pişmanlık, derin üzüntü ve hayattan tat alamama",
        "Aşırı mükemmeliyetçilik",
        "Sorumluluklardan kaçış"
      ],
      correctAnswerIndex: 1,
      explanation: "Pankreas tatlılığı temsil eder. Şeker hastalığı, kişinin hayatındaki tatlılığı (hazzı) yitirmesi ve kontrolü elinde tutma arzusuyla derin üzüntü yaşamasıdır."
    },
    {
      id: "rb_2_16",
      question: "Allerjilerin ruhsal arka planında hangi inanç bulunur?",
      options: [
        "Kendi gücünü reddetmek ve dünyaya karşı aşırı savunma geliştirmek",
        "Toplum inançlarına körü körüne bağlılık",
        "Haz almaktan korkmak",
        "Cezalandırılma ihtiyacı"
      ],
      correctAnswerIndex: 0,
      explanation: "Allerji, kişinin kendi gücünü dışarıdaki bir etkene teslim etmesi ve dünyayı (veya bir kişiyi) kendisine tehdit olarak algılamasıdır."
    },
    {
      id: "rb_2_17",
      question: "Cilt hastalıkları (Sedef, Kurdeşen vb.) neyin yansımasıdır?",
      options: [
        "Eril enerjinin reddi",
        "Kaygı, dokunulma yoksunluğu ve sınırların ihlal edildiği korkusu",
        "Maddi başarısızlık korkusu",
        "Sindirim zayıflığı"
      ],
      correctAnswerIndex: 1,
      explanation: "Deri bizim sınırımızdır. Cilt hastalıkları, bireyselliğin tehdit edildiği algısı, dokunulma hasreti veya dış dünyaya karşı örülen savunma mekanizmalarıdır."
    },
    {
      id: "rb_2_18",
      question: "İshal durumu zihinsel planda neyin karşılığıdır?",
      options: [
        "Korku, reddetmek ve yaşanılan bir durumdan çabucak kaçış isteği",
        "Aşırı cimrilik",
        "Geçmişe saplanıp kalmak",
        "Yaratıcılığın engellenmesi"
      ],
      correctAnswerIndex: 0,
      explanation: "Bedenin besinleri sindirmeden atması gibi, zihin de bir olayı, durumu veya korkuyu hazmetmeden çabucak reddedip kaçmaya çalışır."
    },
    {
      id: "rb_2_19",
      question: "Bacakların alt kısmı (baldırlar vb.) sorun yaşadığında, bu hangi korkuya işaret eder?",
      options: [
        "Geçmiş yaşamlardan gelen karma",
        "Çocukluk travmaları",
        "Gelecek korkusu ve hayatta ileriye doğru adım atamamak",
        "Kendini sevmemek"
      ],
      correctAnswerIndex: 2,
      explanation: "Bacaklar bizi geleceğe taşır. Bacakların alt kısımlarındaki rahatsızlıklar, geleceğe doğru adım atma korkusu ve kıpırdamak istememekle ilgilidir."
    },
    {
      id: "rb_2_20",
      question: "Romatizmal sorunların (Artrit) duygusal kaynağında ne yatar?",
      options: [
        "Sevilmediğini hissetme, sürekli eleştiri, içerleme ve aşırı mükemmeliyetçilik",
        "Kararsızlık ve eyleme geçememe",
        "Maddi varlıkları kaybetme korkusu",
        "Yaşamın sorumluluklarından bıkkınlık"
      ],
      correctAnswerIndex: 0,
      explanation: "Artrit, katılaşmış düşünce kalıpları, affedememe, sevgisizlik hissi ve sürekli eleştiri sonucu eklemlerde biriken kristalize öfke gibidir."
    }
  ]
};

export const ruhBedenQuiz3: Quiz = {
  id: "ruh_beden_3",
  title: "3. Derece: Üstatlık Sınavı",
  description: "En kompleks organ-duygu bağları, bilinçaltı kodları ve ezoterik patoloji üzerine nihai ustalık sınavı.",
  questions: [
    {
      id: "rb_3_1",
      question: "Kalp rahatsızlıkları (Kalp krizi vb.) ezoterik olarak hangi yanlış tutumun sonucudur?",
      options: [
        "Hayattaki hazzı; para, statü veya pozisyon için feda etmek ve kalbin katılaşması",
        "Aşırı beslenme ve tembellik",
        "Kontrol edilemeyen cinsel arzular",
        "Sürekli başkalarına bağımlı yaşamak"
      ],
      correctAnswerIndex: 0,
      explanation: "Kalp sevginin ve hazzın merkezidir. Kalp krizleri, kişinin yaşam sevincini ve sevgiyi unutup, hırs ve pozisyon uğruna kalbini katılaştırmasından doğar."
    },
    {
      id: "rb_3_2",
      question: "Kanser veya tümör oluşumunun altında yatan en zehirli duygusal birikim nedir?",
      options: [
        "Kısa süreli anlık öfke patlamaları",
        "Derin bir yaranın, affedilmeyen bir nefretin veya sırrın kişiyi içten içe kemirmesi",
        "Sadece maddi kayıplardan doğan stres",
        "Sosyal ortamlarda dışlanma korkusu"
      ],
      correctAnswerIndex: 1,
      explanation: "Tümörler ve kanser, onarılmamış eski yaraların, çok uzun süre taşınan ve affedilmeyen derin nefretin bedeni hücresel düzeyde içten içe kemirmesidir."
    },
    {
      id: "rb_3_3",
      question: "Diş sorunları ve dişeti rahatsızlıkları genellikle neyin göstergesidir?",
      options: [
        "Uzun süreli kararsızlık, fikirleri analiz edip eyleme geçememek",
        "Aşırı özgüven ve sözünü sakınmama",
        "Geçmişin yüklerinden kurtulma çabası",
        "Yaratıcılığın reddedilmesi"
      ],
      correctAnswerIndex: 0,
      explanation: "Dişler kararları kesip biçmeyi ve parçalamayı sağlar. Uzun süren kararsızlıklar ve eylemsizlik diş ve dişeti sorunlarına yol açar."
    },
    {
      id: "rb_3_4",
      question: "Felç (İnme) durumunun ruhsal haritasında hangi inanç bulunur?",
      options: [
        "Duruma uyum sağlama çabası",
        "Vazgeçme, direnme, 'değişmektense ölmeyi yeğleme' boyutunda bir kaçış",
        "Sürekli eleştiri alma korkusu",
        "Hayatı çok hızlı yaşama isteği"
      ],
      correctAnswerIndex: 1,
      explanation: "Felç, bilincin yaşamın getirdiği ani değişime veya travmaya şiddetli bir direnç göstermesi, durumu kabullenmektense bedeni kilitleyerek kaçmasıdır."
    },
    {
      id: "rb_3_5",
      question: "Kadınlarda rahim veya yumurtalık kistleri genellikle hangi travmayla örtüşür?",
      options: [
        "Eril enerjinin çok yüksek olması",
        "Eşe/partnere derinden kırılma ve dişil benliğe (kadınlığa) darbe alındığını hissetme",
        "Çocuk sahibi olma arzusu",
        "Maddi yetersizlik korkusu"
      ],
      correctAnswerIndex: 1,
      explanation: "Kadın üreme organlarındaki kistler, partnerden alınan duygusal yaraların affedilmeyip 'kist' olarak beslenmesi ve dişiliğin inkarı ile ilgilidir."
    },
    {
      id: "rb_3_6",
      question: "Multiple Skleroz (MS) hastalığının arkasındaki zihinsel katılık ne anlama gelir?",
      options: [
        "Mükemmeliyetçilik",
        "Demir gibi katı bir irade, esneklikten yoksunluk ve korku temelli kendini zorlama",
        "Aşırı fedakarlık",
        "Cinsellikten kaçış"
      ],
      correctAnswerIndex: 1,
      explanation: "MS, sinir kılıflarının sertleşmesidir; zihinsel karşılığı demir gibi esnemeyen bir irade ve korkudan kaynaklanan zihinsel katılıktır."
    },
    {
      id: "rb_3_7",
      question: "Parkinson hastalığının temelinde hangi korku yatar?",
      options: [
        "Kontrolü kaybetme korkusu ve herkesi/her şeyi kontrol etme ihtiyacı",
        "Sevilmeme korkusu",
        "Başarısızlık korkusu",
        "Parasızlık korkusu"
      ],
      correctAnswerIndex: 0,
      explanation: "Parkinson titremeleri, bedenin kişinin kontrolünden çıkmasıdır. Bu, kişinin hayatı boyunca aşırı kontrolcü olması ve hayatın akışına güvenmemesiyle ilgilidir."
    },
    {
      id: "rb_3_8",
      question: "Güneş Sinirağı (Solar Pleksus) bölgesindeki rahatsızlıklar ezoterik olarak neyin ifadesidir?",
      options: [
        "İfade edememe ve suskunluk",
        "Bireysel gücün yitirilmesi, sezgilerin göz ardı edilmesi ve dış dünyaya güç kaptırma",
        "Aşırı sevgi ve fedakarlık",
        "Cinsel dengesizlik"
      ],
      correctAnswerIndex: 1,
      explanation: "Solar Pleksus (Mide bölgesi) bireysel güç merkezidir. Buradaki sorunlar, kişinin sezgilerini reddetmesi ve gücünü başkalarına teslim etmesidir."
    },
    {
      id: "rb_3_9",
      question: "Kan pıhtılaşması ve tromboz (Kalp damarlarının tıkanması), duygusal olarak ne anlama gelir?",
      options: [
        "Yalnızlık hissi ve 'ne yaparsam yapayım yeterli değil' düşüncesiyle neşenin pıhtılaşması (akışın durması)",
        "Çok mutlu ve neşeli olma korkusu",
        "Maddi zorluklar",
        "Eleştirilere karşı aşırı duyarlılık"
      ],
      correctAnswerIndex: 0,
      explanation: "Kan yaşama sevincini, damarlar o sevincin aktığı yolları temsil eder. Tromboz, yalnızlık ve yetersizlik inancıyla sevinç akışının tıkanıp donmasıdır."
    },
    {
      id: "rb_3_10",
      question: "Sağırlaşma (Duyma kaybı) genellikle ruhsal olarak neyin reddidir?",
      options: [
        "Geleceği düşünmeyi reddetme",
        "Birini veya bir durumu artık 'dinlemek istememe', tahammül edememe",
        "Kendi iç sesini dinlememe",
        "Görsel güzellikleri reddetme"
      ],
      correctAnswerIndex: 1,
      explanation: "Duyma kaybı, bilincin artık tahammül edemediği, inatla dinlemeyi reddettiği durumlarda kendini dış dünyaya kapatmasıdır."
    },
    {
      id: "rb_3_11",
      question: "Hemoroid (Basur) hastalığı, kişi hakkında ne tür bir zihinsel ipucu verir?",
      options: [
        "Geleceğe karşı sabırsızlık",
        "Geçmişin sorumluluğu altında ezilme, öfke ve 'geçmişi bırakamama' korkusu",
        "Cinsel enerjinin bastırılması",
        "Yeni şeyleri hazmedememe"
      ],
      correctAnswerIndex: 1,
      explanation: "Hemoroid, geçmişteki olaylara duyulan kızgınlığın birikmesi ve duygusal yükleri, eskimiş inançları bırakıp atmaktan (dışkılamaktan) korkmadır."
    },
    {
      id: "rb_3_12",
      question: "Gözte çıkan Katarakt, yaşlılık haricinde ezoterik olarak neyin sembolüdür?",
      options: [
        "Geçmişteki hataları görmezden gelme",
        "Geleceği karanlık görme, ileriye neşe ve umutla bakamama",
        "Sürekli detaylara takılma",
        "Kendi içine bakmaktan korkma"
      ],
      correctAnswerIndex: 1,
      explanation: "Katarakt görüşü puslandırır; ruhsal karşılığı ise kişinin geleceği kasvetli, karanlık beklemesi ve umutla bakamamasıdır."
    },
    {
      id: "rb_3_13",
      question: "Dalak sorunları genellikle hangi karakter özelliklerinden kaynaklanır?",
      options: [
        "Başkalarını suçlama alışkanlığı",
        "Sabit fikirler, saplantılar ve sürekli tedirginlik/endişe hali",
        "Özgüven eksikliği",
        "Kibir ve egoizm"
      ],
      correctAnswerIndex: 1,
      explanation: "Dalak, takıntıların ve sabit fikirlerin merkezidir. Sürekli endişe duymak ve zihnin saplantılı bir şekilde aynı korkularda dönüp durması dalağı tüketir."
    },
    {
      id: "rb_3_14",
      question: "Epilepsi (Sara) krizlerinin altında yatan ezoterik sebep nedir?",
      options: [
        "Hayatı reddediş, kendine yönelik yoğun şiddet hissi ve eziyet çekme duygusu",
        "Aşırı enerji ve hiperaktivite",
        "Maddi sorumluluklardan kaçış",
        "Yalnız kalma korkusu"
      ],
      correctAnswerIndex: 0,
      explanation: "Sara nöbeti, bilincin kısa süreliğine bedeni terk etme ve sarsılma anıdır. Kişinin hayatla büyük bir mücadele hissetmesi ve içsel şiddet taşımasıyla ilişkilendirilir."
    },
    {
      id: "rb_3_15",
      question: "Menopoz sorunlarının temelinde kadının hangi düşünce kalıbı bulunur?",
      options: [
        "Toplum içinde daha fazla saygı görme arzusu",
        "Artık istenmediği, yaşlandığı korkusu ve kendini değersiz hissetme",
        "Eril enerjinin uyanması",
        "Bağımsızlık arzusu"
      ],
      correctAnswerIndex: 1,
      explanation: "Kadınlık döngüsünün bitişi, toplumun kodladığı 'artık istenmeyen kadın' illüzyonuna inanmaktan doğan değersizlik korkusuyla sorunlu hale gelir."
    },
    {
      id: "rb_3_16",
      question: "Prostat hastalıkları ezoterik patolojide neyi sembolize eder?",
      options: [
        "Eril gücün kaybı korkusu, 'artık yeterli değilim' inancı ve yaşlanma baskısı",
        "Maddi başarısızlık",
        "Kontrol eksikliği",
        "Aşırı duygusallık"
      ],
      correctAnswerIndex: 0,
      explanation: "Erkeklerde prostat sorunları, cinsel yetersizlik korkusu, yaşlanma baskısı ve eril prensipten uzaklaşmanın bedensel yansımasıdır."
    },
    {
      id: "rb_3_17",
      question: "Sedef hastalığı (Psoriazis) neyin savunma mekanizmasıdır?",
      options: [
        "Toplumsal kuralları reddetme",
        "Duygusal incinmekten korktuğu için ruhun etrafına kalın bir 'zırh' örmesi",
        "Geleceği düşünmekten kaçma",
        "Maddi lükse düşkünlük"
      ],
      correctAnswerIndex: 1,
      explanation: "Sedef hastalığında deri pullanıp kalınlaşır; bu kişinin duygusal olarak incinmemek için dünyaya karşı zırhlanması ve sevgiyi bile içeri almaktan korkmasıdır."
    },
    {
      id: "rb_3_18",
      question: "Bursit (Eklem kesesi iltihabı) rahatsızlığının temel duygu durumu nedir?",
      options: [
        "Aşırı korku",
        "Bastırılmış öfke ve birine vurma (saldırma) arzusu",
        "Kendine acıma",
        "Aşırı sevgi ve şefkat"
      ],
      correctAnswerIndex: 1,
      explanation: "Bursit genellikle hareket eklemlerinde oluşur ve kişide biriken, eyleme dökülemeyen bastırılmış öfkenin o bölgede ateş/iltihap yapmasıdır."
    },
    {
      id: "rb_3_19",
      question: "Tırnak yeme alışkanlığının psiko-ezoterik anlamı nedir?",
      options: [
        "Hırslı bir kişilik",
        "Anne/babadan birine duyulan hınç ve kişinin kendini kemirip tüketmesi",
        "Aşırı zekadan kaynaklanan enerji",
        "Sadece sıradan bir refleks"
      ],
      correctAnswerIndex: 1,
      explanation: "Tırnak (pençe) kendini savunma aracıdır. Bunu yemek, genellikle otoriteye (ebeveyne) duyulan öfkenin kişinin kendisine dönmesi ve hıncını kendisinden almasıdır."
    },
    {
      id: "rb_3_20",
      question: "Kemik erimesi (Osteoporoz) ruhsal düzlemde neyin zayıflamasıdır?",
      options: [
        "Eril enerjinin zayıflaması",
        "Hayatta artık 'kemiğine (temeline) kadar' hiçbir desteğin kalmadığına inanma",
        "Sosyal ilişkilerin zayıflaması",
        "Yaratıcılığın bitmesi"
      ],
      correctAnswerIndex: 1,
      explanation: "Kemikler bedenin temel yapısı ve desteğidir. Kemik erimesi, kişinin hayatta dayanacak hiçbir ruhsal veya maddi desteği kalmadığına dair yoğun inancıdır."
    },
    {
      id: "rb_3_21",
      question: "İştahsızlık (Anoreksiya) ezoterik olarak hangi derin travmayı barındırır?",
      options: [
        "Zayıf olma arzusu",
        "Hayatı reddetmek, aşırı korku ve bedene/kendi varlığına duyulan nefret",
        "Sadece estetik kaygı",
        "Aşırı spiritüel olmak"
      ],
      correctAnswerIndex: 1,
      explanation: "Anoreksiya sadece fiziksel değil, yaşama hakkını kendinden esirgeyen, hayatın beslemesini reddeden ve kendi varlığından nefret eden bir yok oluş programıdır."
    },
    {
      id: "rb_3_22",
      question: "Karaciğer meridyeni tıkanıklığını en iyi çözen evrensel olumlama/niyet kalıbı aşağıdakilerden hangisidir?",
      options: [
        "Ben çok cesurum.",
        "Düşüncelerim arınmış ve özgür. Geçmişi bırakıyor, sevgiyle yeniye yöneliyorum.",
        "Maddi zenginlik bana akıyor.",
        "Kendi ayaklarım üzerinde durabilirim."
      ],
      correctAnswerIndex: 1,
      explanation: "Karaciğer öfke ve eski nefretleri barındırdığı için, 'geçmişi bırakmak ve düşünceleri arındırmak' en etkili şifa olumlamasıdır."
    },
    {
      id: "rb_3_23",
      question: "Akupunkturda 'Chi' enerjisinin bedendeki yolculuğu hangi prensibe göre dengelenir?",
      options: [
        "Sadece eril enerji artırılarak",
        "Yin (Dişil/Alıcı) ve Yang (Eril/Aktif) organların ve meridyenlerin dengesine göre",
        "Karmik borçların hesaplanmasıyla",
        "Astrolojik haritanın elementlerine göre"
      ],
      correctAnswerIndex: 1,
      explanation: "Çin tıbbında ve meridyen biliminde temel kural; birbirini tamamlayan Yin ve Yang enerjilerinin (organ çiftlerinin) uyum içinde akmasıdır."
    },
    {
      id: "rb_3_24",
      question: "Pankreas organının ezoterik frekansı hangi kavramı taşır?",
      options: [
        "Cesaret",
        "Hayatın tatlılığı (haz)",
        "Öfke",
        "Keder"
      ],
      correctAnswerIndex: 1,
      explanation: "Pankreas 'hayatın tatlılığı' enerjisini üretir ve dengeler. Şeker hastalığı veya pankreas sorunları, yaşamdaki tat ve haz duygusunun yitirilmesiyle belirir."
    },
    {
      id: "rb_3_25",
      question: "AIDS/HIV hastalığının derin bilinçaltı inancı, ezoterik şifacılara göre nedir?",
      options: [
        "Dünyayı çok sevmek",
        "Kendini tamamen reddetmek, 'yeterince iyi değilim' inancı ve derin cinsel suçluluk duygusu",
        "İnsanlardan nefret etmek",
        "Tanrı olmak istemek"
      ],
      correctAnswerIndex: 1,
      explanation: "AIDS, bağışıklık sisteminin (bedenin kendini savunmasının) çökmesidir; bu durum kişinin yaşama hakkından vazgeçmesi ve güçlü suçluluk hisleriyle kendini yok etmesidir."
    },
    {
      id: "rb_3_26",
      question: "Tiroid (Guatr) rahatsızlığı hangi Çakranın tıkanmasıyla doğrudan ilişkilidir?",
      options: [
        "Kök Çakra",
        "Sakral Çakra",
        "Boğaz Çakrası",
        "Tepe Çakra"
      ],
      correctAnswerIndex: 2,
      explanation: "Tiroid bezi fiziksel bedende Boğaz çakrasına denk gelir. Kendini ifade edememe, yaratıcılığın tıkanması ve yutulmuş sözler bu merkezin enerjisini bozar."
    },
    {
      id: "rb_3_27",
      question: "Çocukluk dönemi rahatsızlıkları (Örn: Çocuk astımı) ezoterik olarak kimin karmasından etkilenir?",
      options: [
        "Sadece kendi geçmiş yaşamlarından",
        "Genellikle etrafındaki yetişkinlerin yarattığı gergin ortamdan ve ailedeki sözsüz çatışmalardan",
        "Gelecekte yapacağı hatalardan",
        "Kardeşlerinin karmasından"
      ],
      correctAnswerIndex: 1,
      explanation: "Küçük çocukların auraları sünger gibidir. Kendi karmalarından çok, anne-babanın korkularını, kavgalarını ve gizli streslerini kendi bedenlerinde hastalığa dönüştürürler."
    },
    {
      id: "rb_3_28",
      question: "Saçların beyazlaması (genç yaşta) ruhsal düzlemde neyin ifadesidir?",
      options: [
        "Büyük bir bilgeliğe ulaşıldığının",
        "Aşırı gerilim, kişinin baskı altında olduğuna ve hayat tarafından fazla zorlandığına inanmasının",
        "Geleceğe duyulan büyük umudun",
        "Duygusal zekanın yükselmesinin"
      ],
      correctAnswerIndex: 1,
      explanation: "Saçın erkenden pigment kaybetmesi, bedenin şiddetli bir stres, gerginlik ve dayanılmaz bir baskı altında ezildiğini hissetmesinin somut sonucudur."
    },
    {
      id: "rb_3_29",
      question: "Tüm hastalıkların nihai ezoterik şifası, Louise Hay ve benzeri sistemlere göre hangi eylemde gizlidir?",
      options: [
        "Kendini ve geçmişteki herkesi affetmek, sevgiyi seçmek",
        "Sürekli inzivada yaşamak",
        "Dünyadan tamamen kopmak",
        "Asla tıbbi yardım almamak"
      ],
      correctAnswerIndex: 0,
      explanation: "Beden zihnin aynasıdır. Kalıcı şifa, kişinin düşünce kalıplarını değiştirmesi, suçlamaları bırakması ve geçmişle yüzleşip kendini (ve diğerlerini) bağışlamasıyla başlar."
    },
    {
      id: "rb_3_30",
      question: "Akupunktur tedavisinde 'iğne' ezoterik olarak neyi temsil eder?",
      options: [
        "Hastalığı öldüren bir silah",
        "Enerji kanallarındaki tıkanıklığı delip geçen saf niyet ve uyarıcı bilinç iletkeni",
        "Dikkati dağıtma aracı",
        "Sadece bedene acı vererek karmayı ödeme yöntemi"
      ],
      correctAnswerIndex: 1,
      explanation: "Fiziksel iğne bir iletkendir. Meridyen noktalarına uygulandığında, o noktada biriken ve durgunlaşan (Chi) enerjisini çözerek kozmik akışın bedene girmesine aracılık eder."
    }
  ]
};
