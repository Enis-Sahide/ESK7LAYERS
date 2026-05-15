import { Quiz } from './allQuizzes';

export const humanDesignQuiz1: Quiz = {
  id: "human_1",
  title: "1. Derece: Çıraklık Sınavı",
  description: "Human Design sisteminin kökenleri, 5 Enerji Tipi, Aura Mekaniği ve Karar Alma Stratejileri üzerine kapsamlı 1. derece inisiyasyon sınavı.",
  questions: [
    {
      id: "hd_1",
      question: "İnsan Tasarımı (Human Design) Sistemi, hangi dört kadim ezoterik öğretiyi tek bir potada sentezler?",
      options: [
        "Astroloji, Tarot, Feng Shui, I-Ching",
        "Hindu Çakra Sistemi, I-Ching, Kabala, Batı Astrolojisi",
        "Rune Sembolleri, Numeroloji, Şamanizm, Astroloji",
        "Tasavvuf, Simya, Kabala, Yoga"
      ],
      correctAnswerIndex: 1,
      explanation: "Human Design; Doğu'nun Çakra Sistemi, Çin'in I-Ching'i, Yahudi Mistisizminin Hayat Ağacı (Kabala) ve Batı Astrolojisini kuantum mekaniği ve genetikle birleştiren muazzam bir evrensel sentezdir."
    },
    {
      id: "hd_2",
      question: "İnsan Tasarımı sisteminin temel felsefesine göre, sistemin ASIL amacı aşağıdakilerden hangisidir?",
      options: [
        "Sizi hatalarınızdan arındırıp tamamen 'düzeltilmiş' yeni biri yapmak.",
        "Kendi illüzyonunuzdan uyanarak, doğuştan getirdiğiniz orijinal genetik koda (Tasarımınıza) geri dönmenizi sağlamak.",
        "Astrolojik haritanıza bakarak gelecekte başınıza gelecek olayları tahmin etmek.",
        "Çevrenizdeki tüm insanları kendi isteklerinize göre manipüle etmenizi sağlamak."
      ],
      correctAnswerIndex: 1,
      explanation: "Human Design sizi değiştirmek veya 'daha iyi' yapmak istemez; Not-Self (kendin olmama) durumundan kurtarıp, orijinal ve eşsiz parmak izinizi yaşamanızı sağlar."
    },
    {
      id: "hd_3",
      question: "Nüfusun %37'sini oluşturan, tükenmez bir yaşam enerjisine (Sakral merkeze) sahip olan ve aurası 'Açık/Kucaklayıcı' olan enerji tipi hangisidir?",
      options: [
        "Manifestör",
        "Projektör",
        "Jeneratör",
        "Reflektör"
      ],
      correctAnswerIndex: 2,
      explanation: "Jeneratörler (Üreticiler), dünyanın inşa edicileridir. Açık ve kucaklayıcı auralarıyla yaşamı kendilerine çekerler ve Sakral enerjileri tükenmezdir."
    },
    {
      id: "hd_4",
      question: "Sisteme göre 'Projektör' aurasının temel özelliği ve dünyadaki rolü nedir?",
      options: [
        "Düşünmeden hızlıca harekete geçmek ve dünyayı inşa etmek.",
        "Diğer insanların enerjilerini okumak, odaklamak ve onlara 'Rehberlik' etmek.",
        "Bulundukları ortamı tamamen aynalayarak sadece gözlemci olmak.",
        "Kimseye sormadan doğrudan yeni projeler başlatmak."
      ],
      correctAnswerIndex: 1,
      explanation: "Projektörlerin aurası odaklı ve delicidir. Enerji üretmekten ziyade, Jeneratörlerin ve diğer tiplerin enerjilerini doğru yönlendirmek için rehber olarak tasarlanmışlardır."
    },
    {
      id: "hd_5",
      question: "Hangi Enerji Tipinin aurası 'Kapalı ve İtici' (kalkan gibi) çalışır ve stratejisi 'Harekete geçmeden önce etkilenecek kişileri bilgilendirmek'tir?",
      options: [
        "Manifesting Generator",
        "Projektör",
        "Jeneratör",
        "Manifestör"
      ],
      correctAnswerIndex: 3,
      explanation: "Manifestörler dünyadaki yegane 'Başlatıcı' (İnisiyatör) tiptir. Auraları kapalı olduğu için çevrelerinde direnç yaratır; bu direnci kırmak için eyleme geçmeden önce etraflarını bilgilendirmeleri şarttır."
    },
    {
      id: "hd_6",
      question: "İnsan Tasarımının en keskin kuralına göre, hayatımızla ilgili (iş, eş, taşınma vb.) kritik kararları HANGİ mekanizmamızla ASLA almamalıyız?",
      options: [
        "Zihnimizle (Mantık ve Beyin)",
        "Duygusal Otoritemizle (Solar Pleksus)",
        "Sakral Otoritemizle (Karın Bölgesi)",
        "Dalak Otoritemizle (İçgüdüler)"
      ],
      correctAnswerIndex: 0,
      explanation: "Zihin, olayları analiz etmek ve başkalarına ilham vermek için harika bir araçtır; ancak sizin yaşamınız için ASLA bir karar alma mercii değildir. Doğru karar her zaman bedenin zekası (İçsel Otorite) ile alınır."
    },
    {
      id: "hd_7",
      question: "Eğer bir kişinin İçsel Otoritesi 'Duygusal (Solar Pleksus)' ise, karar alırken izlemesi gereken altın kural nedir?",
      options: [
        "İçgüdüsel hissettiği ilk anda hemen karar vermek.",
        "Başkalarına danışıp dışarıdan onay beklemek.",
        "Asla o anda (anlık) karar vermemek, duygusal dalgasının dinmesini (zamanı) beklemek.",
        "Karnından gelen sese (Hı-hı / I-ıh) göre hemen o saniye eyleme geçmek."
      ],
      correctAnswerIndex: 2,
      explanation: "Duygusal otorite (nüfusun %50'si) dalgalar halinde çalışır. Anda alınan kararlar her zaman yanıltıcıdır. Berraklık sadece duygusal dalga (iniş ve çıkış) yatıştıktan sonra zamanla gelir."
    },
    {
      id: "hd_8",
      question: "Hiçbir enerji merkezi tanımlı (renkli) olmayan, çok nadir bulunan (%1) ve karar almak için 28 günlük 'Ay Döngüsünü' beklemesi gereken tip hangisidir?",
      options: [
        "Manifestör",
        "Reflektör",
        "Projektör",
        "Jeneratör"
      ],
      correctAnswerIndex: 1,
      explanation: "Reflektörlerin grafiği tamamen beyazdır (tanımsızdır). Ay'a derinden bağlıdırlar ve çevrelerindeki toplumun aynası olarak görev yaparlar."
    },
    {
      id: "hd_9",
      question: "Manifesting Generator (MG) tipi, Jeneratör ile Manifestörün hangi özelliklerinin birleşiminden oluşur?",
      options: [
        "Projektörün rehberliği ile Reflektörün bilgeliği.",
        "Jeneratörün tükenmez yaşam enerjisi ile Manifestörün harekete geçirme hızının birleşimi.",
        "Sadece zihinsel basınç ve duygusal dalgalanma.",
        "Boğaz merkezinin suskunluğu ve kalbin kırgınlığı."
      ],
      correctAnswerIndex: 1,
      explanation: "MG'ler, Jeneratörlerin sakral yakıtına (enerjisine) ve Manifestörlerin işleri doğrudan boğazdan eyleme dökme (başlatma/hız) yeteneğine aynı anda sahip olan mutasyonel bir gruptur."
    },
    {
      id: "hd_10",
      question: "Jeneratörlerin yanlış bir hayat yaşadıklarında (sevmedikleri işleri yaptıklarında) auralarında ortaya çıkan Not-Self (Kendin Olmama) duygusu hangisidir?",
      options: [
        "Öfke (Anger)",
        "Burukluk / Acı (Bitterness)",
        "Hüsran (Frustration)",
        "Hayal Kırıklığı (Disappointment)"
      ],
      correctAnswerIndex: 2,
      explanation: "Jeneratörlerin Not-Self teması 'Hüsran'dır. Kendi enerjilerini yanlış insanlara veya sevmedikleri işlere harcadıklarında sıkışmış ve hüsrana uğramış hissederler."
    }
  ]
};

export const humanDesignQuiz2: Quiz = {
  id: "human_2",
  title: "2. Derece: Kalfalık Sınavı",
  description: "9 Enerji Merkezinin (Tanımlı/Tanımsız durumları), Not-Self sendromları, motorlar, basınçlar ve farkındalık korkuları üzerine 2. derece Adept sınavı. (Toplam 20 Soru)",
  questions: [
    {
      id: "hd_11",
      question: "İnsan Tasarımında, sorunlarımızın, zihinsel manipülasyonlarımızın ve 'Not-Self' (kendin olmama) takıntılarımızın ana kaynağı grafiğimizdeki hangi bölgelerdir?",
      options: [
        "Tanımlı (Renkli) merkezlerimiz.",
        "Astrolojik güneş burcumuz.",
        "Tanımsız (Beyaz / Açık) merkezlerimiz.",
        "Sadece Kırmızı (Bilinçdışı) kapılarımız."
      ],
      correctAnswerIndex: 2,
      explanation: "Tanımsız (beyaz) merkezler, dış dünyadan enerji aldığımız, bu enerjiyi iki kat büyüterek hissettiğimiz ve 'kendimizinmiş' gibi sanıp takıntı yaptığımız (Not-Self) açık okullarımızdır."
    },
    {
      id: "hd_12",
      question: "Tanımsız (beyaz) bir Kök Merkezine sahip olan kişinin günlük hayatta sergilediği en belirgin 'Not-Self' davranışı nedir?",
      options: [
        "Üzerindeki stres ve baskıdan bir an önce kurtulmak için her işi telaşla ve aceleyle bitirmeye çalışmak.",
        "Hiçbir baskı hissetmeden son derece rahat ve tembel davranmak.",
        "Etrafındaki insanlara sürekli ilham ve fikir vermek.",
        "Başkalarından sevgi ve onay beklemek."
      ],
      correctAnswerIndex: 0,
      explanation: "Kök merkezi fiziksel adrenalin merkezidir. Beyaz olduğunda dışarıdaki stresi iki katı hissederiz. Zihin, 'Bu işleri çabucak bitirirsem sonunda rahatlarım' illüzyonuna (Not-Self) kapılır."
    },
    {
      id: "hd_13",
      question: "Bağışıklık sistemini yöneten, sürüngen beynin hayatta kalma korkularını barındıran ve 'anda, içgüdüsel olarak' fısıldayan Farkındalık merkezi hangisidir?",
      options: [
        "Ajna (Zihin) Merkezi",
        "Solar Pleksus (Duygu) Merkezi",
        "Kalp (Ego) Merkezi",
        "Dalak (Spleen) Merkezi"
      ],
      correctAnswerIndex: 3,
      explanation: "Dalak (Spleen) merkezi en eski farkındalığımızdır. Sadece o anda çalışır, mantığı yoktur. Sizi anlık tehlikelerden koruyan sessiz bir içgüdüdür."
    },
    {
      id: "hd_14",
      question: "Nüfusun yaklaşık %65'inde Tanımsız (beyaz) olan Kalp/Ego merkezinin yarattığı 'Kendin Olmama' (Not-Self) takıntısı aşağıdakilerden hangisidir?",
      options: [
        "Sürekli haklı olduğunu kanıtlama çabası.",
        "Sürekli kendini değerli hissetmek veya başkalarına bir şeyler kanıtlamak için yerine getiremeyeceği sözler vermek.",
        "Gerçeklerden ve çatışmadan kaçmak.",
        "Hayatta kalma ve hastalanma korkusu."
      ],
      correctAnswerIndex: 1,
      explanation: "Tanımsız Ego, kişinin kendini 'yetersiz ve değersiz' hissetmesine yol açan bir zihin tuzağı yaratır. Bu kişiler her zaman çevrelerine kendilerini kanıtlamaya çalışarak kalplerini gereksiz yere yorarlar."
    },
    {
      id: "hd_15",
      question: "Grafiğin tam ortasında yer alan sarı elmas şeklindeki 'G Merkezi', kişinin hayatında hangi temaları yönetir?",
      options: [
        "Cinsellik, üretim ve tükenmez enerji",
        "Sevgi, kimlik (benlik), yön ve Manyetik Monopol",
        "Korku, hayatta kalma ve içgüdü",
        "Adrenalin, stres ve iş bitiricilik"
      ],
      correctAnswerIndex: 1,
      explanation: "G Merkezi tüm tasarımın şoför koltuğudur (Manyetik Monopol). Sevgi kapasitemizi, hayattaki mutlak yönümüzü ve 'Ben Kimim?' sorusunun cevabını taşır."
    },
    {
      id: "hd_16",
      question: "Tanımsız (beyaz) Solar Pleksus (Duygu) merkezine sahip birinin, çatışmadan kaçmak için geliştirdiği Not-Self stratejisi nedir?",
      options: [
        "İnsanlarla sürekli kavga etmek.",
        "Sürekli başkalarına ne yapması gerektiğini dikte etmek.",
        "Başkalarının üzülmesini veya kızmasını engellemek için kendi gerçeklerini söyleyememek, 'Aman ağzımızın tadı bozulmasın' demek.",
        "Duygusal tepkilerini tamamen kaybedip robotlaşmak."
      ],
      correctAnswerIndex: 2,
      explanation: "Duygusal merkezi beyaz olanlar empattır. Dışarıdaki bir duygu (öfke veya acı) onlara çarptığında bunu iki katı olarak yaşarlar. Bu yüzden çatışmadan, yüzleşmekten ve gerginlikten kaçınmak için kendilerinden taviz verirler."
    },
    {
      id: "hd_17",
      question: "Bütün enerji yollarının çıktığı 'Roma' olarak adlandırılan; ifade, iletişim ve tezahür (eylem) merkezi hangisidir?",
      options: [
        "Tepe Merkezi",
        "Sakral Merkez",
        "Boğaz Merkezi",
        "Kök Merkezi"
      ],
      correctAnswerIndex: 2,
      explanation: "Boğaz merkezi manifestasyon yeridir. Zihinsel, duygusal veya fiziksel tüm enerjiler dünyaya dökülmek için Boğaz merkezine ulaşmaya çalışır."
    },
    {
      id: "hd_18",
      question: "Tanımsız (beyaz) Boğaz merkezine sahip olan birinin zihin manipülasyonu (Not-Self) genellikle nasıl ortaya çıkar?",
      options: [
        "Hiç konuşmamak ve tamamen sessiz kalmak.",
        "Sürekli dikkat çekmek için ortamda gereksiz yere veya herkesten çok konuşmaya çalışmak.",
        "Sadece şarkı söylemek.",
        "İnsanları dinlerken uyuyakalmak."
      ],
      correctAnswerIndex: 1,
      explanation: "Boğazı tanımsız olan kişiler, kendi seslerini bulmakta zorlanabilir ve çoğu zaman başkalarının dikkatini üzerlerine çekmek (konuşmak veya eylem yapmak) için güçlü bir baskı hissederler."
    },
    {
      id: "hd_19",
      question: "Zihinsel baskı ve ilhamı yöneten Tepe (Head) merkezinin beyaz olması durumunda kişi hangi yanılgıya düşer?",
      options: [
        "Kendisinin zeki olmadığına inanmak.",
        "Sürekli kendi hayatıyla ve sorunlarıyla ilgilenmek.",
        "Kendisiyle HİÇ ilgisi olmayan, başkalarına ait olan soruları kendi sorunuymuş gibi sahiplenip çözmeye çalışmak.",
        "Matematik ve mantık kuramamak."
      ],
      correctAnswerIndex: 2,
      explanation: "Tanımsız Tepe merkezi, dışarıdan (örneğin medyadan, arkadaşından) gelen bir soruyu/ilhamı içeri alır ve zihin bunu çözülmesi gereken acil bir kişisel mesele gibi gösterir."
    },
    {
      id: "hd_20",
      question: "Sakral Merkezi tanımlı (renkli) olan Jeneratörlerin, gece yatağa giderken dikkat etmeleri gereken fiziksel kural nedir?",
      options: [
        "Erkenden uyumak ve yatakta kitap okumak.",
        "Gün içindeki tüm Sakral enerjilerini (yakıtı) fiziksel olarak tamamen tüketmiş bir şekilde, yorgun olarak yatağa girmek.",
        "Hiç yorulmadan dinlenik halde uyumak.",
        "Gündüz uyuyup gece uyanık kalmak."
      ],
      correctAnswerIndex: 1,
      explanation: "Sakral merkez bir pildir. Jeneratör tiplerinin (Projektörlerin aksine) bu pili gün içinde tatmin edici şekilde sıfırlaması gerekir. Pili bitirmeden yatarlarsa kaliteli uyku uyuyamazlar."
    },
    {
      id: "hd_21",
      question: "Aşağıdakilerden hangisi 9 Merkezden biri DEĞİLDİR?",
      options: [
        "G Merkezi",
        "Ajna Merkezi",
        "Astral Merkez",
        "Kök Merkezi"
      ],
      correctAnswerIndex: 2,
      explanation: "Human Design'daki 9 merkez şunlardır: Tepe, Ajna, Boğaz, G, Kalp(Ego), Sakral, Kök, Dalak, Solar Pleksus. Astral merkez diye bir şey yoktur."
    },
    {
      id: "hd_22",
      question: "Ajna merkezinin Not-Self teması olan 'Belirli inançlara sabitlenme zorunluluğu hissetmek' kime aittir?",
      options: [
        "Ajna merkezi tamamen beyaz (Tanımsız) olan kişiye",
        "Ajna merkezi renkli (Tanımlı) olan kişiye",
        "Kök merkezi renkli olan kişiye",
        "Tepe merkezi renkli olan kişiye"
      ],
      correctAnswerIndex: 0,
      explanation: "Tanımsız (beyaz) Ajna'ya sahip kişiler zihinlerinde sabit bir fikir üretemezler, bu yüzden zihin onları 'Herkes gibi sabit fikirlerin olmalı' diyerek bir fikre tutunmaya zorlar."
    },
    {
      id: "hd_23",
      question: "Dalak (Spleen) merkezindeki temel korkulardan biri aşağıdakilerden hangisidir?",
      options: [
        "Sevilmeme korkusu",
        "Ölüm ve hayatta kalamama korkusu",
        "Yetersizlik korkusu",
        "Başarısızlık korkusu"
      ],
      correctAnswerIndex: 1,
      explanation: "Dalak merkezi bağışıklık ve sürüngen beyindir. İçindeki tüm kapılar, fiziksel olarak hayatta kalmaya yönelik derin korkular (ölüm korkusu, yetersizlik korkusu, geçmiş korkusu) barındırır."
    },
    {
      id: "hd_24",
      question: "Duygusal dalgaların (Solar Pleksus) en temel işlevi nedir?",
      options: [
        "Sizi mantıklı düşünmeye zorlamak",
        "Hayatta neşeden melankoliye kadar duygusal deneyimin derinliğini hissettirmek",
        "Toplumdaki hiyerarşiyi belirlemek",
        "Fiziksel gücü artırmak"
      ],
      correctAnswerIndex: 1,
      explanation: "Solar Pleksus bir farkındalık ve motor merkezidir. Duygusal derinliği yaşatarak deneyimleri (neşe, hüzün, acı, tutku) anlamlandırmamızı sağlar."
    },
    {
      id: "hd_25",
      question: "Tanımlı (renkli) bir Kalp/Ego merkezine sahip bir kişi hangi doğal yeteneğe sahiptir?",
      options: [
        "İradesini kullanarak sözler verebilme ve bu sözleri tutabilme gücü",
        "Başkalarının duygularını sünger gibi emme",
        "Hiç dinlenmeden sürekli koşturma",
        "Başkalarına sürekli soru sorma"
      ],
      correctAnswerIndex: 0,
      explanation: "Ego merkezi renkli olan kişiler doğal bir irade gücüne sahiptir. Onlar verdikleri sözleri tutacak irade motoruna doğuştan sahiptirler, bu yüzden adil sözleşmeler yapabilirler."
    },
    {
      id: "hd_26",
      question: "G Merkezi (Kendilik Merkezi) evrendeki hangi gizemli bileşeni barındırır?",
      options: [
        "Karanlık Madde",
        "Manyetik Monopol",
        "Solar Rüzgarlar",
        "Nötrino Parçacıkları"
      ],
      correctAnswerIndex: 1,
      explanation: "G Merkezi, ruhumuzu (Kişilik) ve bedenimizi (Tasarım) bir arada tutan ve bize hayatımızdaki doğru yönü veren 'Manyetik Monopol'ü barındırır."
    },
    {
      id: "hd_27",
      question: "Tepe (Head) ve Kök (Root) merkezlerinin ortak özelliği nedir?",
      options: [
        "İkisi de Motor merkezidir",
        "İkisi de Basınç (Pressure) merkezidir",
        "İkisi de Farkındalık merkezidir",
        "İkisi de hiç enerji üretmez"
      ],
      correctAnswerIndex: 1,
      explanation: "Tepe merkezi 'zihinsel ilham baskısı', Kök merkezi ise 'fiziksel adrenalin baskısı' üretir. İkisi de sistemi harekete zorlayan evrensel Basınç merkezleridir."
    },
    {
      id: "hd_28",
      question: "Aşağıdakilerden hangisi 'Motor Merkezler'den (Enerji üretenlerden) biridir?",
      options: [
        "Boğaz Merkezi",
        "Ajna Merkezi",
        "G Merkezi",
        "Sakral Merkezi"
      ],
      correctAnswerIndex: 3,
      explanation: "Sakral Merkezi insanlığın ana yakıt, yaşam gücü ve üreme motorudur. (Diğer motorlar: Kök, Solar Pleksus ve Ego'dur)."
    },
    {
      id: "hd_29",
      question: "Bir kişinin grafiğinde Kök merkezi tanımsız (beyaz) ise, ona verilecek en doğru tavsiye nedir?",
      options: [
        "Herkesin işini aceleyle yapmalısın.",
        "Üzerinde hissettiğin baskı sana ait değil, bu acele hissi geldiğinde derin bir nefes al ve sakinleş.",
        "Adrenalin sporları yaparak rahatla.",
        "Sürekli son teslim tarihli işler al."
      ],
      correctAnswerIndex: 1,
      explanation: "Beyaz kök merkezi, dışarıdaki stresi iki katı emer. Zihnin 'Acele et' baskısına kanmamak ve bunun kendisine ait olmadığını fark etmek en büyük kurtuluştur."
    },
    {
      id: "hd_30",
      question: "Boğaz merkezinin temel görevi nedir?",
      options: [
        "Düşünmek ve analiz etmek",
        "Adrenalin pompalamak",
        "Gıdaları sindirmek",
        "Tüm diğer merkezlerin enerjisini kelimelere (iletişim) veya eyleme (tezahür) dökmek"
      ],
      correctAnswerIndex: 3,
      explanation: "Boğaz, tasarımdaki tezahür (manifestation) yeridir. Kalpteki irade, Sakraldaki yaşam, Ajnadaki düşünce; hepsi dünyaya çıkmak için Boğaz'a ulaşmaya çalışır."
    }
  ]
};

export const humanDesignQuiz3: Quiz = {
  id: "human_3",
  title: "3. Derece: Üstatlık Sınavı",
  description: "6 Çizgi profilleri, İnkarnasyon Haçları, genetik I-Ching kapıları, kuantum mekaniği (Kırmızı/Siyah) ve Elektromanyetik çekim üzerine nihai Master sınavı. (Toplam 50 Soru)",
  questions: [
    {
      id: "hd_31",
      question: "Human Design haritasındaki SİYAH (Kişilik) renkli çizgiler ve kapılar neyi temsil eder?",
      options: [
        "Doğumdan 88 gün önceki bilinçdışı (genetik) beden tasarımımızı.",
        "Doğum anındaki gezegen konumlarını ve farkında olduğumuz 'Ben Buyum' dediğimiz bilinçli kimliğimizi.",
        "Geçmiş yaşam karmalarımızı.",
        "Gelecekte olacağımız kişiliği."
      ],
      correctAnswerIndex: 1,
      explanation: "Siyah alanlar bizim erişimimizin olduğu, farkında olduğumuz (Bilinçli) özelliklerimizdir. Doğum saatinde mühürlenirler."
    },
    {
      id: "hd_32",
      question: "Dışarıdan insanların sizde çok net gördüğü, ancak sizin farkında olmadığınız ve 'Bunu neden böyle yaptım?' diye şaşırdığınız genetik kodlar haritada hangi renkle gösterilir?",
      options: [
        "Mavi",
        "Sarı",
        "Siyah",
        "Kırmızı"
      ],
      correctAnswerIndex: 3,
      explanation: "Kırmızı Çizgiler (Bilinçdışı / Tasarım), fiziksel aracınızın (bedenin) otomatik kalıtsal davranışlarıdır ve bilinçaltıdır."
    },
    {
      id: "hd_33",
      question: "Profil çizgilerinden olan 'Çizgi 3'ün (Şehit / Deneyci) dünyadaki öğrenme ve gelişme metodu nasıldır?",
      options: [
        "Her şeyi kitaplardan ve okullardan öğrenir.",
        "Sürekli yalnız kalıp mağarasında içgörü bekler.",
        "Sürekli deneyim yaşar, yanılarak, hata yaparak ve 'neyin işe yaramadığını' bizzat keşfederek öğrenir.",
        "Başkalarına bakarak, hiç hata yapmadan mükemmel bir yol izler."
      ],
      correctAnswerIndex: 2,
      explanation: "3. Çizgi, hayatın deney tüpüdür. Yere düşmeden yürümeyi öğrenemez. Yaptığı şeyler hata değil, insanlık adına 'Bunun işe yaramadığını keşfettim' deme hizmetidir."
    },
    {
      id: "hd_34",
      question: "Haritanızdaki bir kanalın sadece bir ucu (kapısı) aktifse ve diğer kapıya sahip biriyle tanıştığınızda oluşan muazzam bütünleşme ve kıvılcım enerjisine ne ad verilir?",
      options: [
        "Karmik Tamamlanma",
        "Aura Düğümü",
        "Elektromanyetik Çekim",
        "Kodon Kilitlenmesi"
      ],
      correctAnswerIndex: 2,
      explanation: "Eksik kapınızın başkası tarafından doldurulması, o kanalın gücünü aktif eder. Aranızdaki bu zıt kutupların çekimine Elektromanyetik Çekim denir (Aşkın ve bağımlılıkların en büyük sebebidir)."
    },
    {
      id: "hd_35",
      question: "Profil çizgilerinden hangisi 30 yaşına kadar hata yapıp deneyim kazanan, 30-50 yaş arası çatıya çıkarak yaralarını saran ve 50 yaşından sonra insanlık için bilge bir 'Rol Model'e dönüşen çizgidir?",
      options: [
        "Çizgi 1",
        "Çizgi 4",
        "Çizgi 5",
        "Çizgi 6"
      ],
      correctAnswerIndex: 3,
      explanation: "6. Çizgi, üç aşamalı bir evrim yaşar. Chiron döngüsüne kadar (50 yaş) olgunlaşır ve ardından zirvedeki bilge Rol Model (Role Model) olarak aşağı iner."
    },
    {
      id: "hd_36",
      question: "Astrolojide Yükselen Burç ne kadar önemliyse, İnsan Tasarımında da kişinin 'Büyük Yaşam Amacını ve Nihai Kaderini' belirleyen yapı odur. Bu yapıya ne ad verilir?",
      options: [
        "Değişkenler (Variables)",
        "İnkarnasyon Haçı (Incarnation Cross)",
        "Otorite (Authority)",
        "Not-Self Teması"
      ],
      correctAnswerIndex: 1,
      explanation: "İnkarnasyon Haçı, Bilinçli ve Bilinçdışı Güneş/Dünya kapılarının dörtlü kombinasyonundan oluşur ve sizin bu hayata geliş amacınızı kodlar."
    },
    {
      id: "hd_37",
      question: "64 Kapının genetik bilimiyle olan muazzam bağlantısı aşağıdakilerden hangisidir?",
      options: [
        "İnsan beynindeki 64 lob ile eşleşir.",
        "İnsan DNA'sındaki 64 Kodon (Aminoasit şifresi) ile birebir aynı dizilimde eşleşir.",
        "Kemik sistemindeki 64 omurga diskini temsil eder.",
        "Kan hücrelerinin 64 günde bir yenilenmesiyle eşleşir."
      ],
      correctAnswerIndex: 1,
      explanation: "Kadim Çin I-Ching'indeki 64 hekzagramın matematiği, 1950'lerde keşfedilen DNA molekülündeki 64 genetik kodon matematiği ile kusursuz bir şekilde eşleşir."
    },
    {
      id: "hd_38",
      question: "Haritada Profilin hemen üzerinde yer alan ve sağa veya sola bakan '4 Adet Ok' (Variables / Değişkenler) neyi temsil etmez?",
      options: [
        "Beslenme ve Sindirim sistemini (PHS)",
        "Bize uygun fiziksel çevreyi ve ortamı",
        "Hangi tarihte öleceğimizi",
        "Zihnimizin aktif (sol) veya pasif (sağ) mi çalıştığını"
      ],
      correctAnswerIndex: 2,
      explanation: "Değişkenler (Variables), bedensel sindirimi, beyin fonksiyonunu, ideal çevreyi ve farkındalık perspektifini belirler. Ancak ölüm tarihiyle hiçbir ilgisi yoktur."
    },
    {
      id: "hd_39",
      question: "İki enerji merkezini birbirine bağlayan hatlara (Tamamı boydan boya renkli) ne ad verilir ve işlevi nedir?",
      options: [
        "Kapı - Sadece tek bir merkezin gücünü artırır.",
        "Kanal - Her iki merkezi de 'Tanımlı' hale getirir ve aralarında sabit, yaşam boyu değişmez bir enerji akışı yaratır.",
        "Düğüm - Enerjinin akmasını engeller.",
        "Aura Kalkanı - Dışarıdan gelen etkileri reddeder."
      ],
      correctAnswerIndex: 1,
      explanation: "Bir Kanalın tamamlanması (örneğin 20 ve 34 kapılarının birleşmesi), bağlı olduğu her iki merkezi de boyayarak (Tanımlı yaparak) sizin sabit yaşam gücünüzü ve yeteneğinizi oluşturur."
    },
    {
      id: "hd_40",
      question: "İnsanların büyük beklentiler içine girdiği, dışarıdan onlara projeksiyon (yansıtma) yaptığı, 'O çözer, o kurtarır' gözüyle bakılan, ancak beklentiler karşılanmazsa çarmıha gerilen Kafir/Kurtarıcı profili hangisidir?",
      options: [
        "Çizgi 1",
        "Çizgi 2",
        "Çizgi 4",
        "Çizgi 5"
      ],
      correctAnswerIndex: 3,
      explanation: "5. Çizgi (Kafir / Heretic) evrensel kurtarıcıdır. Aurası baştan çıkarıcıdır ve insanlar ona beklentilerini yansıtır. Doğru krizleri seçip çözdüğünde kahraman, çözemediğinde kafir ilan edilir."
    },
    {
      id: "hd_41",
      question: "1/3 Profili (Araştırmacı / Şehit) hayatta en çok neye ihtiyaç duyar?",
      options: [
        "Herkes tarafından sevilmeye",
        "Bir şeyin temeline inerek derinlemesine araştırmaya ve kendi başına deneyimlemeye",
        "Liderlik etmeye",
        "Görünmez olmaya"
      ],
      correctAnswerIndex: 1,
      explanation: "1. çizgi derin bir temel atma (araştırma) ihtiyacı duyar, 3. çizgi ise bu temelin sağlamlığını hatalar ve deneyimler yoluyla test eder."
    },
    {
      id: "hd_42",
      question: "Sisteme göre 4. Çizginin (Fırsatçı / Opportunist) hayattaki fırsatları Nereden gelir?",
      options: [
        "Gazete ilanlarından",
        "Tamamen tanımadığı yabancılardan",
        "Güvendiği ve tanıdığı kendi kişisel sosyal ağından (Network)",
        "İçgüdülerinden"
      ],
      correctAnswerIndex: 2,
      explanation: "4. Çizgi ağ kurucudur (Networker). İş, aşk, ev, fırsatlar her zaman onların yakın çevresindeki tanıdıkları aracılığıyla gelir."
    },
    {
      id: "hd_43",
      question: "Aşağıdaki profillerden hangisi hayatını dış dünyadan soyutlanmış bir 'Keşiş' gibi yaşamak istemesine rağmen (2), dışarıdaki tanıdıkları (4) tarafından sürekli fırsatlara çağrılır?",
      options: [
        "3/5 Profil",
        "2/4 Profil",
        "1/3 Profil",
        "4/6 Profil"
      ],
      correctAnswerIndex: 1,
      explanation: "2/4 Profil (Münzevi / Fırsatçı), kendi alanında kalmak isteyen doğal bir yetenektir ancak sosyal ağındaki insanlar onu sürekli mağarasından dışarı davet eder."
    },
    {
      id: "hd_44",
      question: "10-20 Uyanış Kanalının enerjisi temel olarak neyi ifade eder?",
      options: [
        "Fiziksel hayatta kalmayı",
        "Para kazanmayı",
        "Tam o anın içinde kendi yüksek ruhsal farkındalığını, kendini severek yaşamayı",
        "Geçmiş anıları hatırlamayı"
      ],
      correctAnswerIndex: 2,
      explanation: "10-20 Kanalı, kişinin kendini olduğu gibi sevip kendi kurallarıyla yaşamasını (10) ve bunu şimdiki zamanda ifade etmesini (20) sağlayan mistik bir uyanış kanalıdır."
    },
    {
      id: "hd_45",
      question: "3-60 Mutasyon Kanalına sahip birinin hissettiği en belirgin duygu nedir?",
      options: [
        "Sürekli mutlu ve neşeli hissetmek",
        "Büyük bir melankoli ve uzun bekleyişlerin ardından gelen ani yenilik/sıçrama anları",
        "Korku ve endişe",
        "Topluma aşırı bağlılık"
      ],
      correctAnswerIndex: 1,
      explanation: "3-60 bir mutasyon kanalıdır. Bu kanal her zaman nabız gibi atmaz, o yüzden kişide derin bir melankoli hissi yaratabilir. Ama enerji geldiğinde yepyeni bir şey ortaya çıkarır."
    },
    {
      id: "hd_46",
      question: "64 Kapı içerisindeki 1. Kapı (Yaratıcılık), G merkezinden çıkıp neyi sembolize eder?",
      options: [
        "Saf bireysel ilhamı ve yaratıcılığı ifade etme ihtiyacı",
        "Maddi zenginlik",
        "Aşk ve romantizm",
        "Bilimsel şüphecilik"
      ],
      correctAnswerIndex: 0,
      explanation: "Kapı 1, yaratıcılığın ve ilhamın ta kendisidir. Kendi benzersiz ifadesini bulmak için dış dünyadan bağımsız çalışır."
    },
    {
      id: "hd_47",
      question: "Aşağıdaki kapılardan hangisi boğaz merkezindeki 'Liderlik ve Sözcü' olma enerjisini taşır?",
      options: [
        "Kapı 5",
        "Kapı 31",
        "Kapı 40",
        "Kapı 64"
      ],
      correctAnswerIndex: 1,
      explanation: "Kapı 31 Etki (Influence) kapısıdır. Kolektifin nereye gitmesi gerektiğini dillendiren demokratik liderin sesidir."
    },
    {
      id: "hd_48",
      question: "Çizgi 1 (Araştırmacı) profilinin en çok kaçındığı ve ondan kurtulmak için temel attığı korku nedir?",
      options: [
        "Yalnız kalma korkusu",
        "Yetersizlik ve cahillik korkusu (Bilmediği bir zemin üzerine basma korkusu)",
        "Ölüm korkusu",
        "Fakirlik korkusu"
      ],
      correctAnswerIndex: 1,
      explanation: "1. Çizgi temelsizlikten ve bilgisizlikten korkar. Bu yüzden dünyayı anlamak için her şeyin derinini, detayını ve altındaki zemini araştırarak kendini güvende hisseder."
    },
    {
      id: "hd_49",
      question: "Aşağıdakilerden hangisi Sakral merkeze bağlı olan ve cinsellik, samimiyet bariyerlerini aşma gücü veren kapıdır?",
      options: [
        "Kapı 59",
        "Kapı 2",
        "Kapı 43",
        "Kapı 11"
      ],
      correctAnswerIndex: 0,
      explanation: "Kapı 59 (Dağılma/Yakınlık), insanlar arasındaki duvarları yıkarak en derin samimiyete girme ve üreme enerjisidir."
    },
    {
      id: "hd_50",
      question: "Ego Merkezinden (Kalp) çıkan ve dünyevi varlıkları (para, yiyecek, güç) kontrol etme dürtüsü taşıyan kapı hangisidir?",
      options: [
        "Kapı 21",
        "Kapı 15",
        "Kapı 36",
        "Kapı 57"
      ],
      correctAnswerIndex: 0,
      explanation: "Kapı 21 (Isırarak Aşma / Kontrol), kabilenin hayatta kalması için parayı ve kontrolü elinde tutan kalp kapısıdır."
    },
    {
      id: "hd_51",
      question: "Kırmızı ve Siyah aktivasyonların haritada kesişmesine ne ad verilir?",
      options: [
        "Bilinçli/Bilinçdışı Dualitesi",
        "Aura Boşluğu",
        "Zihin Tuzağı",
        "Ay Düğümü"
      ],
      correctAnswerIndex: 0,
      explanation: "Kırmızı (Bilinçdışı/Beden) ve Siyah (Bilinçli/Zihin) aktivasyonları kişinin hayatındaki dualiteyi gösterir. İkisi birleşip bir bütün oluşturur."
    },
    {
      id: "hd_52",
      question: "2-14 Simyacı Kanalı neden 'Cüzdanın Anahtarı' olarak anılır?",
      options: [
        "Tasarruf yapmayı öğrettiği için",
        "Bankacılık becerisi verdiği için",
        "Bireysel enerjiyi ve yaşam gücünü doğrudan devasa bir kaynağa/zenginliğe dönüştürebildiği için",
        "Pazarlık yapmayı sağladığı için"
      ],
      correctAnswerIndex: 2,
      explanation: "Bu kanal, Sakral'ın (14) büyük gücünü, ruhun doğru yönüne (2) kanalize ettiğinde kelimenin tam anlamıyla enerjiyi altına dönüştüren devasa bir jeneratör motorudur."
    },
    {
      id: "hd_53",
      question: "5/1 Profili (Kafir / Araştırmacı) toplum tarafından nasıl algılanır?",
      options: [
        "Sessiz ve içine kapanık",
        "Sorunları anında çözecek bir general ve kurtarıcı",
        "Hata yapıp duran bir öğrenci",
        "Hiçbir işe yaramayan biri"
      ],
      correctAnswerIndex: 1,
      explanation: "5. çizginin aurası dışarıdan o kadar baştan çıkarıcı ve muktedirdir ki, insanlar tüm dertlerini onlara getirir ve onların bu sorunları çözecek birer kahraman olduğuna inanırlar."
    },
    {
      id: "hd_54",
      question: "12-22 Açıklık Kanalının temel özelliği nedir?",
      options: [
        "Her zaman mantıklı konuşması",
        "Duygusal moduna bağlı olan çok tutkulu, cazibeli ancak modu düşükken tamamen sessizleşen sosyal etkileşimi",
        "İnsanlarla hiç iletişim kurmaması",
        "Sürekli bilimsel kanıt araması"
      ],
      correctAnswerIndex: 1,
      explanation: "12-22 Kanalı tamamen duygusal dalgaya bağlıdır. Dalga yüksekse inanılmaz bir zarafet ve etkileyicilikle konuşur, dalga düşükse kimseyle görüşmek istemez."
    },
    {
      id: "hd_55",
      question: "Kapı 48 (Kuyu) Dalak merkezinden çıkarak neyi temsil eder?",
      options: [
        "Saf neşe ve coşku",
        "Yüzeysellik ve hız",
        "Son derece derin bir sezgisel bilgelik ve çözüm kapasitesi",
        "Maddi hırs"
      ],
      correctAnswerIndex: 2,
      explanation: "Kapı 48 The Well (Kuyu)'dur. İçinde pratik sorunları çözecek kadar derin bir sezgisel bilgelik barındırır, ancak her zaman bilgisinin yetersizliğinden korkar."
    },
    {
      id: "hd_56",
      question: "Sadece Jeneratörlerin 'Sakral Otoritesi' nasıl çalışır?",
      options: [
        "Düşünerek",
        "Karnın derinliklerinden gelen 'hı-hı' (evet) veya 'ı-ıh' (hayır) sesleriyle anlık bedensel tepki vererek",
        "Duygusal dalgayı bekleyerek",
        "İnsanlara sorarak"
      ],
      correctAnswerIndex: 1,
      explanation: "Sakral merkez mantıkla veya sözcüklerle değil, doğrudan bedensel mırıltılarla ve saf enerji tepkisiyle çalışır."
    },
    {
      id: "hd_57",
      question: "20-34 Karizma Kanalının sahip olduğu frekans nedir?",
      options: [
        "Tamamen hareketsiz kalıp sadece izlemek",
        "Duygusal fanteziler kurmak",
        "Sakral gücünü (34) doğrudan o saniye eyleme (20) dökerek aynı anda hem iş yapan hem de konuşan meşgul bir enerji",
        "Geleceği tahmin etmek"
      ],
      correctAnswerIndex: 2,
      explanation: "Sadece Manifesting Generator'larda bulunan bu kanal, enerjiyi anında boğaza (eyleme) taşır ve kişiyi 'iş bitiren bir karizma' yapar."
    },
    {
      id: "hd_58",
      question: "Kapı 61 (İçsel Gerçek) Tepe merkezinden inerek zihinde nasıl bir etki yaratır?",
      options: [
        "Hiçbir şey düşünmeme hali",
        "Detaylarla boğuşma",
        "Bilinmeyeni, sırları ve mutlak gerçeği kavramak için yoğun bir ilham baskısı",
        "Geçmişin hatıralarında kaybolma"
      ],
      correctAnswerIndex: 2,
      explanation: "Kapı 61, evrensel sırları ve 'Neden?' sorusunun mistik cevabını arayan derin bir zihinsel ilham baskısıdır."
    },
    {
      id: "hd_59",
      question: "Aşağıdaki kanallardan hangisi 'Kabile (Topluluk)' devresine ait olup aileyi koruma ve birleştirme amacı güder?",
      options: [
        "43-23 Deha Kanalı",
        "19-49 Sentez Kanalı",
        "3-60 Mutasyon Kanalı",
        "1-8 İlham Kanalı"
      ],
      correctAnswerIndex: 1,
      explanation: "19-49 Kanalı kabileye aittir. Kabilenin yiyecek, barınma ve ruhsal ihtiyaçlarını hisseder ve bağlılığı sağlamak için sıkı prensipler koyar."
    },
    {
      id: "hd_60",
      question: "4/1 Profilinin 'Sabit Kader' olarak adlandırılmasının sebebi nedir?",
      options: [
        "Sürekli fikir değiştirmeleri",
        "Hiçbir temele dayanmadan hareket etmeleri",
        "Öğrendikleri temeli (1) ve sosyal ağlarını (4) hayatları boyunca çok nadir esnetmeleri, kaderlerini sabit bir yolda yürütmeleri",
        "Her şeyi şans eseri başarmaları"
      ],
      correctAnswerIndex: 2,
      explanation: "4/1 profili 12 profil arasındaki tek 'Sabit Kader' geometrisidir. Onları yollarından döndürmek veya inançlarını kırmak neredeyse imkansızdır."
    },
    {
      id: "hd_61",
      question: "Kapı 25 (Masumiyet) G merkezinden çıkarak neyi temsil eder?",
      options: [
        "Bencil bir aşk",
        "Koşulsuz, yargısız ve tüm canlılara duyulan evrensel ruhsal sevgiyi",
        "Maddi değerlere bağlılığı",
        "Şüpheciliği"
      ],
      correctAnswerIndex: 1,
      explanation: "Kapı 25, kanın ve bedenin temsilcisidir. Evrenin varoluşuna karşı her şartta masumiyetini koruyan koşulsuz sevginin merkezidir."
    },
    {
      id: "hd_62",
      question: "28-38 Mücadele Kanalına sahip olan kişi için hayattaki en büyük motivasyon nedir?",
      options: [
        "Her şeyin çok kolay olması",
        "Sürekli uyumak",
        "Hayatta derin bir anlam bulmak uğruna zorluklarla inatla savaşmak",
        "Kimseyle yüzleşmemek"
      ],
      correctAnswerIndex: 2,
      explanation: "Bu kanal, sıradan ve kolay olanla ilgilenmez. Kişiye, hayata anlam katan büyük amaçlar uğruna savaşma azmi verir."
    },
    {
      id: "hd_63",
      question: "Bir Jeneratör 'Evet' (Hı-hı) dediği işi yapmadığında bedensel olarak ne yaşar?",
      options: [
        "Rahatlama ve huzur",
        "Hüsran, enerji sıkışıklığı ve tükenmişlik (Burnout)",
        "Daha fazla ilham",
        "Öfke patlaması"
      ],
      correctAnswerIndex: 1,
      explanation: "Jeneratörler sakrallarının tepki vermediği bir işe girdiklerinde enerjilerini doğru kullanamazlar ve sonuç her zaman fiziksel ve ruhsal hüsran/tükenmişliktir."
    },
    {
      id: "hd_64",
      question: "Kapı 55 (Bolluk), Solar Pleksus merkezindeki en derin kapılardan biridir. Bu kapının deneyimi nasıldır?",
      options: [
        "Düz ve sıkıcı bir çizgi",
        "Aşırı mantıklı ve analitik",
        "Derin melankoli ile coşku dolu neşe arasında devasa duygusal dalgalanmalar",
        "Sadece geçmişe takılı kalmak"
      ],
      correctAnswerIndex: 2,
      explanation: "Kapı 55 duygunun ve ruhun kupasıdır. Çok melankolik, şiirsel, romantik ve coşkulu bir kapıdır. Bardağın dolu veya boş olması ruh halini belirler."
    },
    {
      id: "hd_65",
      question: "11-56 Merak Kanalının 'Hikaye Anlatıcısı' olmasının sebebi nedir?",
      options: [
        "Sürekli detayları bilmesi",
        "Zihnindeki fikirleri (11) mantıksal gerçekler olarak değil, insanlara inanç aşılayan fantastik hikayeler (56) olarak aktarması",
        "Çok kitap okuması",
        "Yalan söylemeyi sevmesi"
      ],
      correctAnswerIndex: 1,
      explanation: "11-56 soyut bir kanaldır. Gerçeklerle ilgilenmez; fikirleri deneyimlerle harmanlayarak dinleyiciyi büyüleyecek inanç dolu hikayeler yaratır."
    },
    {
      id: "hd_66",
      question: "Eğer bir haritada hem Tepe (Head) hem de Kök (Root) merkezi tanımsız (beyaz) ise, bu kişi için en hayati tehlike nedir?",
      options: [
        "Çok yavaş hareket etmesi",
        "Kendiyle ilgisi olmayan zihinsel ilham baskısı ile fiziksel acele stresinin altında ezilip kendini kaybetmesi",
        "Hiçbir duygu hissedememesi",
        "Bağışıklığının çok güçlü olması"
      ],
      correctAnswerIndex: 1,
      explanation: "Beyaz basınç merkezleri dışarıdaki stresi emer. Zihin bu baskıyı kendi sorunu sanırsa kişi hayatını başkalarının aceleci sorunlarını çözerek tüketir."
    },
    {
      id: "hd_67",
      question: "Kapı 50 (Kazan) Dalak merkezinden çıkarak hangi fonksiyonu yerine getirir?",
      options: [
        "Kabilenin değerlerini, yasalarını korumak ve ahlaki çürümeyi önlemek",
        "Müzik aleti çalmak",
        "Para saymak",
        "Tek başına dağda yaşamak"
      ],
      correctAnswerIndex: 0,
      explanation: "Kapı 50, kabilenin yasalarını koyan içgüdüsel koruyucudur. Toplumun ve çocukların güvenliği için gerekli kuralların bekçisidir."
    },
    {
      id: "hd_68",
      question: "İnkarnasyon Haçları, doğum haritasındaki hangi 4 gezegenin kapılarından oluşur?",
      options: [
        "Venüs, Mars, Jüpiter, Satürn",
        "Bilinçli Güneş/Dünya ve Bilinçdışı Güneş/Dünya",
        "Uranüs, Neptün, Plüton, Ay",
        "Merkür, Venüs, Ay, Güneş"
      ],
      correctAnswerIndex: 1,
      explanation: "İnkarnasyon Haçınız, tasarımınızın en temel %70 ağırlığını oluşturan Kişilik ve Tasarım tarafındaki Güneş ve Dünya kapılarının kombinasyonudur."
    },
    {
      id: "hd_69",
      question: "3/5 Profilinin (Şehit / Kafir) 'Kafir' (Heretic) olarak adlandırılmasının ezoterik nedeni nedir?",
      options: [
        "Dine inanmaması",
        "Kimseyi sevmemesi",
        "Toplumun ondan evrensel çözümler umut etmesi, eğer pratik çözüm sunarsa 'Kurtarıcı', sunamazsa 'Kafir' ilan edilip çarmıha gerilmesi",
        "Sürekli yalnız kalmak istemesi"
      ],
      correctAnswerIndex: 2,
      explanation: "5. Çizgi insanların projeksiyon (yansıtma) yaptığı bir aynadır. İnsanlar onu kahraman görmek ister, işler ters giderse faturayı ona kesip kafir ilan ederler."
    },
    {
      id: "hd_70",
      question: "Aşağıdaki kapılardan hangisi Sakral merkezde yer alır ve enerjiyi sonuna kadar 'Tamamlamak, Döngüyü Bitirmek' baskısı yaratır?",
      options: [
        "Kapı 53",
        "Kapı 42",
        "Kapı 12",
        "Kapı 64"
      ],
      correctAnswerIndex: 1,
      explanation: "Kapı 42 (Artış/Büyüme), başlanmış bir işi veya döngüyü yarım bırakamayan ve sonuna kadar giderek o döngüyü tamamlayan sakral bir motordur."
    },
    {
      id: "hd_71",
      question: "Kapı 20 (Şimdiki Zaman) hangi merkezde yer alır?",
      options: [
        "Boğaz Merkezi",
        "Sakral Merkez",
        "G Merkezi",
        "Dalak Merkezi"
      ],
      correctAnswerIndex: 0,
      explanation: "Kapı 20, Boğaz merkezindedir. Anın varoluşsal farkındalığını geçmiş veya gelecek olmadan anında sese ve eyleme döker."
    },
    {
      id: "hd_72",
      question: "43-23 Kanalının 'Deha/Ucube' olarak adlandırılmasının sebebi nedir?",
      options: [
        "Sürekli komik fıkralar anlatması",
        "Zihninden gelen o ani, bireysel, tuhaf fikirleri doğru bir dille anlatabildiğinde deha, zamansız konuştuğunda ucube gibi algılanması",
        "Dış görünüşü",
        "Sadece çocuklarla anlaşabilmesi"
      ],
      correctAnswerIndex: 1,
      explanation: "43-23 Kanalı bireyselliğin zihinsel sesidir. Aniden 'Biliyorum' der. Eğer fikri toplum için doğru zamanda ve basitçe ifade edebilirse alkışlanır, edemezse dışlanır."
    },
    {
      id: "hd_73",
      question: "Reflektörlerin aurası neden 'Teflon' gibidir?",
      options: [
        "Çok sıcak oldukları için",
        "Enerjileri içlerinde tuttukları için",
        "Hiçbir merkezleri tanımlı olmadığı için ortamın enerjisini emip onlara yapışmadan anında geri yansıttıkları (Teflon gibi kaydırdıkları) için",
        "Yalnız yaşamaları gerektiği için"
      ],
      correctAnswerIndex: 2,
      explanation: "Reflektörlerin aurası örnekleyen ve yansıtan yapıdadır. Zarar görmemek için dışarıdaki enerjiyi sünger gibi içlerinde tutmaz, Teflon gibi üzerinden akıtıp geri yansıtırlar."
    },
    {
      id: "hd_74",
      question: "Kapı 36 (Kriz) Solar Pleksus merkezinden ne tür bir deneyime çekilir?",
      options: [
        "Sakin ve rutin bir hayat",
        "Duygusal eksikliği gidermek için yeni, bilinmeyen ve kriz yaratabilecek deneyimlere gözü kapalı atlama",
        "Hiçbir şeye dokunmamak",
        "Bilimsel araştırmalar yapmak"
      ],
      correctAnswerIndex: 1,
      explanation: "Kapı 36, Işığın Kararmasıdır. Deneyimsizliği gidermek adına her türlü duygusal zorluğa balıklama atlar."
    },
    {
      id: "hd_75",
      question: "Aşağıdakilerden hangisi 6. Çizgi (Rol Model) profilinin üç aşamalı yaşam döngüsünün parçası DEĞİLDİR?",
      options: [
        "İlk 30 yıl (Satürn dönüşüne kadar) deneme yanılma, kaos (Çizgi 3 gibi yaşama)",
        "30-50 yaş arası (Chiron dönüşüne kadar) çatıya çıkıp objektif gözlem yapma",
        "50 yaşından sonra (Chiron sonrası) çatıdan inip bilge bir Rol Model olma",
        "Doğar doğmaz tamamen bilge ve kusursuz olma"
      ],
      correctAnswerIndex: 3,
      explanation: "6. Çizgi doğuştan kusursuz değildir; önce acı çeker ve yanılır (1. Aşama), sonra geri çekilip gözlemler (2. Aşama) ve ancak elli yaşından sonra gerçek bilgeliğini gösterir (3. Aşama)."
    },
    {
      id: "hd_76",
      question: "Manifestörlerin stratejisi olan 'Bilgilendirmek' neden hayatidir?",
      options: [
        "İnsanlardan izin almaları gerektiği için",
        "Auraları kapalı ve itici olduğu için etrafta yarattıkları direnci (ve öfkeyi) kırmak, yolu açmak için",
        "Çok konuşmayı sevdikleri için",
        "Korkak oldukları için"
      ],
      correctAnswerIndex: 1,
      explanation: "Manifestörler kimseye sormadan başlattıkları için auraları çevrede şok etkisi yaratır ve dirençle karşılaşırlar. Bilgilendirmek, o direnci ortadan kaldıran yapay bir nezaket anahtarıdır."
    },
    {
      id: "hd_77",
      question: "Kapı 51 (Şok) Ego merkezinden çıkarak insanlık üzerinde nasıl bir rol oynar?",
      options: [
        "İnsanları uyutur",
        "İnsanları rekabet, cesaret ve şok edici eylemlerle sarsarak ruhsal olarak daha yüksek bir bilince uyandırır",
        "Herkese para dağıtır",
        "Tamamen sessizlik yaratır"
      ],
      correctAnswerIndex: 1,
      explanation: "Kapı 51, şamanik uyanış kapısıdır. Hiç beklenmedik şeyleri korkusuzca yaparak kabile sınırlarını zorlar ve inisiye eder."
    },
    {
      id: "hd_78",
      question: "19-49 Kanalındaki (Sentez) 49. Kapı (Devrim) ne tür bir enerji taşır?",
      options: [
        "Ne olursa olsun herkesi affetmek",
        "Prensipler (saygı, yiyecek, aidiyet) karşılanmazsa o saniye ilişkiyi tamamen koparan ve devrim yapan acımasız kabile yasası",
        "Korkaklık",
        "Mantıksal analiz"
      ],
      correctAnswerIndex: 1,
      explanation: "Kapı 49, kabilenin kasabıdır. Kimin içeride kalıp kimin dışarı atılacağına duygusal prensiplerle kesin karar verir."
    },
    {
      id: "hd_79",
      question: "G Merkezi tanımsız (beyaz) olan kişilerin hayatta yönlerini bulabilmeleri için altın kural nedir?",
      options: [
        "Zihinleriyle sürekli yön belirlemeye çalışmaları",
        "Mekân (Çevre) doğruysa, çevredeki insanların da doğru olduğunu fark ederek doğru coğrafyayı/odaya girmeyi beklemeleri",
        "Sürekli yalnız kalmaları",
        "İşlerini hep aynı yerde yapmaları"
      ],
      correctAnswerIndex: 1,
      explanation: "Tanımsız G merkezi olanların hayatını çevreleri belirler. Eğer bulunduğunuz şehir, restoran veya ev size iyi hissettiriyorsa, orada tanışacağınız insanlar da size doğru yönü verecektir."
    },
    {
      id: "hd_80",
      question: "64 Kapının evrensel şifreleri ile İnsan Tasarımı öğretisi nihai olarak neyi hedefler?",
      options: [
        "Herkesi zengin ve ünlü yapmayı",
        "Kendi 'Not-Self' zihnimizin köleliğinden kurtulup, bize verilen o yegane, benzersiz ve eşsiz genetik tasarımı kusursuzca (Kendini Severek) yaşamayı",
        "Geleceği net bir şekilde bilmeyi",
        "Hiçbir sorun yaşamadan düz bir hayat sürmeyi"
      ],
      correctAnswerIndex: 1,
      explanation: "Human Design uyanış bilimidir. Kendin olmak, zihnin korkularına değil bedenin zekasına teslim olmak ve varoluşun şakası içinde sadece kendi rolünü mükemmel oynamaktır."
    }
  ]
};

export const allHumanDesignQuizzes = {
  'human_1': humanDesignQuiz1,
  'human_2': humanDesignQuiz2,
  'human_3': humanDesignQuiz3,
};
