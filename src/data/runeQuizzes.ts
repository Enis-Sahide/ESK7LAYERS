export interface RuneQuestion {
  id: string;
  question: string;
  options: string[];
  correctAnswerIndex: number;
  explanation: string;
}

export interface RuneQuiz {
  id: string;
  title: string;
  description: string;
  questions: RuneQuestion[];
}

export const runeQuizzes: Record<string, RuneQuiz> = {
  rune1: {
    id: "rune1",
    title: "1. Kademe: Rune Sembolleri Testi",
    description: "24 Kadim Rune sembolünün mitolojik kökenleri, elementleri, gezegenleri ve temsil ettikleri frekanslara dair zorlu sınav.",
    questions: [
      {
        id: "q1",
        question: "Futhark alfabesinin ilk harfi olan ve 'başlangıç ateşi, potansiyel enerji, mülk ve zenginlik' kavramlarını temsil eden Rune hangisidir?",
        options: ["Uruz", "Fehu", "Thurisaz", "Ansuz"],
        correctAnswerIndex: 1,
        explanation: "Fehu, ateş elementine aittir ve başlangıç ateşinin, yaradılışın, mülk ve zenginliğin sembolüdür."
      },
      {
        id: "q2",
        question: "Aşağıdaki Rune sembollerinden hangisi 'Su' elementine ait değildir?",
        options: ["Laguz", "Eihwaz", "Isa", "Hagalaz"],
        correctAnswerIndex: 1,
        explanation: "Laguz, Isa ve Hagalaz su (buz/dolu) ile bağlantılıdır. Eihwaz (Porsuk ağacı) yaşam ve ölümü simgeler, suya ait değildir."
      },
      {
        id: "q3",
        question: "Duygusal şifalanma, bilinçaltı okyanusu ve rüyalar aracılığıyla ilahi fısıltıları almayı temsil eden 'Laguz' sembolü hangi renkle rezonansa girer?",
        options: ["Mavi", "Siyah", "Koyu Yeşil", "Altın Sarısı"],
        correctAnswerIndex: 2,
        explanation: "Laguz sembolü Koyu Yeşil renk ile derin bir şekilde rezonansa girer."
      },
      {
        id: "q4",
        question: "İletişimi, ilhamı ve Tanrı Odin'in nefesini temsil eden; yazar tıkanıklığında veya topluluk önünde konuşurken kullanılan Rune hangisidir?",
        options: ["Kenaz", "Ansuz", "Gebo", "Raidho"],
        correctAnswerIndex: 1,
        explanation: "Ansuz, kelimelerin ve nefesin gücüdür. Hitabeti ve iletişimi güçlendirir."
      },
      {
        id: "q5",
        question: "Othala Rune sembolünün ezoterik anlamı aşağıdakilerden hangisidir?",
        options: [
          "Buz gibi durarak olayları zamanın içinde dondurmak",
          "Atalardan gelen miras, kutsal yuva ve genetik koruma",
          "Karmik döngüyü kırarak yeni bir şafak yaratmak",
          "Maddi bolluk ve yeni iş fırsatları oluşturmak"
        ],
        correctAnswerIndex: 1,
        explanation: "Othala, kadim kökler, aile, hanenin korunması ve atalardan gelen eterik mirası temsil eder."
      },
      {
        id: "q6",
        question: "Tiwaz sembolünün astrolojik yöneticisi hangi gezegendir?",
        options: ["Mars", "Venüs", "Jüpiter", "Satürn"],
        correctAnswerIndex: 2,
        explanation: "Tiwaz'ın yönetici gezegeni Jüpiter'dir (Şifa ve genişleme, adaletin ışığı)."
      },
      {
        id: "q7",
        question: "Büyük yıkımları, kaosun ardından gelen yeniden doğuşu ve 'Egonun Parçalanmasını' sembolize eden frekans hangisidir?",
        options: ["Isa", "Thurisaz", "Hagalaz", "Sowilo"],
        correctAnswerIndex: 2,
        explanation: "Hagalaz dolu fırtınasını temsil eder; eski yapıların ve egonun yıkılarak sağlam temellerin atılmasıdır."
      },
      {
        id: "q8",
        question: "'Kaderin zarları' olarak bilinen, sırları ve doğmamış potansiyelleri içinde barındıran rahim enerjili Rune hangisidir?",
        options: ["Perthro", "Berkano", "Ingwaz", "Laguz"],
        correctAnswerIndex: 0,
        explanation: "Perthro, kader ağının dokunduğu boşluktur (Ginnungagap), sırları ve potansiyelleri barındırır."
      },
      {
        id: "q9",
        question: "Aşağıdaki eşleşmelerden hangisi doğrudur?",
        options: [
          "Kenaz - Buz - Dondurma",
          "Gebo - Armağan - Alma Verme Dengesi",
          "Jera - Şafak - Anlık Mucize",
          "Wunjo - Savaş - Cesaret"
        ],
        correctAnswerIndex: 1,
        explanation: "Gebo, karşılıklı hediyeleşme ve evrensel alma-verme dengesinin sembolüdür."
      },
      {
        id: "q10",
        question: "Düşüncelerin sabit duvarlarından bizi kurtarıp, karanlığın bitişi ve uyanışı simgeleyen şafak vakti frekansı hangisidir?",
        options: ["Sowilo", "Dagaz", "Ingwaz", "Ehwaz"],
        correctAnswerIndex: 1,
        explanation: "Dagaz (Şafak), karanlık gecenin bitişi ve radikal aydınlanmanın gerçekleştiği anı simgeler."
      }
    ]
  },
  rune2: {
    id: "rune2",
    title: "2. Kademe: Bağlamalar ve Ritüeller Testi",
    description: "Rune bağlamalarının (tılsımların) oluşturulması, saatleri, yönleri ve ritüel uygulama kuralları üzerine detaylı sınav.",
    questions: [
      {
        id: "q1",
        question: "Sembollerin doğru bir şekilde enerji kanalize etmesi için, herhangi bir Rune sembolü veya çıta bağlaması hangi yöne doğru çizilmelidir?",
        options: [
          "Yukarıdan aşağıya doğru",
          "Soldan sağa doğru",
          "Aşağıdan yukarıya doğru",
          "Ortadan başlayarak dışarıya doğru"
        ],
        correctAnswerIndex: 2,
        explanation: "Üstadın öğretisine göre, Rune sembolleri her zaman aşağıdan yukarıya doğru çizilmeli veya kazınmalıdır."
      },
      {
        id: "q2",
        question: "Fiziksel ve psişik saldırılardan korunmak için evinizin dış kapısının merkezine ve yanlarına çizilmesi önerilen zırh üçlemesi hangisidir?",
        options: [
          "Tiwaz - Uruz - Tiwaz",
          "Algız - Othala - Algız",
          "Hagalaz - Isa - Tiwaz",
          "Laguz - Ansuz - Kenaz"
        ],
        correctAnswerIndex: 1,
        explanation: "Algız (Koruma) ve Othala (Yuva/Hane) birleşimi, eve yönelik negatif enerjileri bloke eden güçlü bir kalkan yaratır."
      },
      {
        id: "q3",
        question: "Rüya Kapanı ritüelini (Laguz - Ansuz - Kenaz) uygularken, gece ruhsal boyutta korunmak için sağ bileğe hangi sembol çizilmelidir?",
        options: ["Berkano", "Algız", "Gebo", "Isa"],
        correctAnswerIndex: 1,
        explanation: "Algız, koruyucu zırhtır. Astrale veya rüya boyutuna geçerken auranın yırtılmasını engeller."
      },
      {
        id: "q4",
        question: "Yeşil bir elma ve kırmızı saplı bir bıçakla yapılan, 'Gebo - Wunjo - Gebo' sembollerinin kazındığı ritüelin temel amacı nedir?",
        options: [
          "Eski bir bağı veya evliliği sorunsuz bitirmek",
          "Bolluk, bereket ve yaşamdaki tıkanan maddi yolları şifalandırmak",
          "Mide ve bağırsak sorunlarını çözmek",
          "Şans ve beklenmedik mucizeleri aniden hayata çekmek"
        ],
        correctAnswerIndex: 1,
        explanation: "Bu elma çalışması, yaşamdaki durağanlaşan bereketi hareketlendiren kadim bir bolluk ritüelidir."
      },
      {
        id: "q5",
        question: "23:30 - 00:30 saatleri arasında enerjisi en yüksek olan ve hasat zamanını simgeleyen Rune hangisidir?",
        options: ["Perthro", "Ehwaz", "Jera", "Isa"],
        correctAnswerIndex: 2,
        explanation: "Saatler tablosuna göre 23:30 - 00:30 döngüsünü Jera yönetir. Gece yarısı döngünün tamamlanması ve hasadı simgeler."
      },
      {
        id: "q6",
        question: "Özellikle mahkeme, duruşma ve adalet arayışlarında kişinin iki avcunun içine çizilmesi önerilen 'Çıta Bağlaması' hangi kök enerjiyi kullanır?",
        options: ["Fehu", "Tiwaz", "Berkano", "Othala"],
        correctAnswerIndex: 1,
        explanation: "Tiwaz adaleti, dürüstlüğü ve hakkı arayan savaşçının enerjisidir; mahkeme bağlamalarının bel kemiğidir."
      },
      {
        id: "q7",
        question: "Aura kalkanı yaratmak ve Nazar (düşük frekanslı titreşimler) enerjilerinden arınmak için kullanılan bağlama üçlemesi aşağıdakilerden hangisidir?",
        options: [
          "Sowilo - Wunjo - Kenaz",
          "Hagalaz - Thurisaz - Algız",
          "Fehu - Hagalaz - Jera",
          "Uruz - Isa - Jera"
        ],
        correctAnswerIndex: 1,
        explanation: "Hagalaz ve Thurisaz yıkıcı/savunmacı, Algız ise kalkan enerjisiyle kem gözleri (nazarı) geri püskürtür."
      },
      {
        id: "q8",
        question: "Bir iş görüşmesine veya mülakata giderken kişinin iletişimini ve şansını parlatması için cüzdanında taşıması gereken bağlama hangisidir?",
        options: ["Fehu - Ansuz - Wunjo", "Gebo - Uruz - Wunjo", "Wunjo - Sowilo - Tiwaz", "Uruz - Laguz - Kenaz"],
        correctAnswerIndex: 0,
        explanation: "Fehu (Değer), Ansuz (İletişim) ve Wunjo (Kazanım/Neşe) iş bulma mülakatlarında kişiyi ön plana çıkarır."
      },
      {
        id: "q9",
        question: "Kehanet çemberinde dışarıda kalan en büyük daire neyi ifade eder?",
        options: ["İç Kader (Ruhsal durum)", "Dış Kader (Maddesel yaşam)", "Ateş Elementi", "Şifa Alanı"],
        correctAnswerIndex: 1,
        explanation: "Çemberin dış halkası kişinin Dış Kaderini (maddesel, 3 boyutlu yaşamını ve fiziksel dünyasını) anlatır."
      },
      {
        id: "q10",
        question: "Korku ve panik atak yaşayan çocukların odasına asılabilecek veya sol ellerine fısıldanabilecek 'Korkuyu Yenme' bağlaması hangi sembolleri içerir?",
        options: [
          "Tiwaz - Algız - Uruz",
          "Laguz - Ansuz - Kenaz",
          "Fehu - Othala - Jera",
          "Wunjo - Sowilo - Dagaz"
        ],
        correctAnswerIndex: 0,
        explanation: "Tiwaz (Cesaret), Algız (Koruma) ve Uruz (Fiziksel Güç) birleşerek kök çakradaki tüm güvenlik kaygılarını giderir."
      }
    ]
  },
  runeFinal: {
    id: "runeFinal",
    title: "Üstat Kademe: Büyük Sırlar Okulu Finali",
    description: "Semboller, mitoloji, gezegenler ve bağlamalara dair elde ettiğiniz tüm ezoterik kadim bilgilerinizi sınayan büyük final.",
    questions: [
      {
        id: "q1",
        question: "Büyük ve radikal değişimlerden korktuğunuzda; bilinçaltındaki zehirleri temizlemek ve kozmik okyanusa güvenmek için kullanmanız gereken 'Su' elementi Runesi hangisidir?",
        options: ["Kenaz", "Hagalaz", "Laguz", "Perthro"],
        correctAnswerIndex: 2,
        explanation: "Laguz, hayatın akışına teslim olmayı, bilinçaltı zehirlerinden arınmayı sağlayan şifa suyudur."
      },
      {
        id: "q2",
        question: "Hangi Rune bağlaması (tılsım) eski bir karmik döngüyü veya evliliği/ortaklığı şiddet yaratmadan, barışçıl ve sorunsuz bir şekilde bitirmek için kullanılır?",
        options: ["Hagalaz - Isa - Tiwaz", "Gebo - Wunjo - Gebo", "Sowilo - Wunjo - Kenaz", "Fehu - Hagalaz - Jera"],
        correctAnswerIndex: 0,
        explanation: "Hagalaz (Yıkım), Isa (Dondurma/Soğutma) ve Tiwaz (Adalet); ilişkinin karmik yarasız bitirilmesini sağlar."
      },
      {
        id: "q3",
        question: "Aşağıdakilerden hangisi bir 'Şifa Çıta Bağlaması' uygularken dikkat edilmesi gereken kuraldır?",
        options: [
          "Bağlama yalnızca siyah kalemle çizilebilir.",
          "Şifa bağlamaları bedende rahatsızlık duyulan bölgenin yakınına uygulanmalıdır.",
          "Asla suya veya yemeğe kodlanamazlar.",
          "Sadece gündüz saatlerinde çizilmelidir."
        ],
        correctAnswerIndex: 1,
        explanation: "Fiziksel/Ruhsal şifa tılsımları doğrudan hedeflenen çakraya veya ağrıyan bölgeye (örneğin bağırsağa) temas ettirilir veya yakınına çizilir."
      },
      {
        id: "q4",
        question: "7 Rune Açılımı (Kutu Dizilimi) yaparken en son çekilen 7. taş hangi kutuya yerleştirilir ve neyi ifade eder?",
        options: ["PROBLEM 2 - Geçmişi", "ADVICE 1 - Tavsiyeyi", "RESULT - Gelecekteki Nihai Sonucu", "PAST 1 - Karmaşayı"],
        correctAnswerIndex: 2,
        explanation: "Son taş RESULT (Sonuç) kutusuna konur. Tavsiyelere uyulduğu takdirde konunun nasıl sonuçlanacağını gösterir."
      },
      {
        id: "q5",
        question: "Mitolojide Yggdrasil (Yaşam Ağacı) üzerinde 9 gün 9 gece baş aşağı asılı kalarak Rune sırlarını kanıyla keşfeden Kadim İskandinav Tanrısı kimdir?",
        options: ["Thor", "Loki", "Odin", "Heimdall"],
        correctAnswerIndex: 2,
        explanation: "Odin, bilgelik uğruna kendi gözünü feda etmiş ve Rune sırlarını almak için Yggdrasil'de kendini feda etmiştir."
      },
      {
        id: "q6",
        question: "Aşağıdaki Rune sembolü - Doğal Taş eşleşmelerinden hangisi YANLIŞTIR?",
        options: [
          "Fehu - Kırmızı Akik",
          "Ansuz - Lapis Lazuli",
          "Laguz - Siyah Turmalin",
          "Berkano - Pembe Kuvars"
        ],
        correctAnswerIndex: 2,
        explanation: "Laguz'un taşı Siyah Turmalin değildir. Laguz Ay Taşı, Akuamarin veya İncilerle çalışır (Su ve Sezgi taşları)."
      },
      {
        id: "q7",
        question: "Bir arazinin, tarlanın veya yeni bir başlangıcın tohuma durması için; eril potansiyelin içsel yuvada demlenmesini simgeleyen Rune hangisidir?",
        options: ["Ingwaz", "Dagaz", "Jera", "Ehwaz"],
        correctAnswerIndex: 0,
        explanation: "Ingwaz, tohumun toprak altında beklediği, eril enerjinin potansiyel depoladığı hamilelik/demlenme sürecidir."
      },
      {
        id: "q8",
        question: "Depresyon, ruhsal yıkım ve ağır travmaların ardından 'Işığı tekrar görmek' ve ayağa kalkmak için kullanılan bağlama üçlemesi hangisidir?",
        options: [
          "Uruz - Isa - Jera",
          "Wunjo - Sowilo - Tiwaz",
          "Gebo - Uruz - Wunjo",
          "Fehu - Othala - Jera"
        ],
        correctAnswerIndex: 1,
        explanation: "Wunjo (Neşe), Sowilo (Güneş/Zafer) ve Tiwaz (Adalet/Yükseliş); karanlıktan çıkıp ışığa yürümeyi sağlar."
      },
      {
        id: "q9",
        question: "Bolluk ve maddi şansı artırmak için Cuma günleri hangi Rune sembolleriyle çalışılması tavsiye edilir?",
        options: ["Fehu veya Gebo", "Hagalaz veya Isa", "Thurisaz veya Tiwaz", "Nauthiz veya Eihwaz"],
        correctAnswerIndex: 0,
        explanation: "Cuma günü Venüs'ün günüdür; sevgi, alma-verme dengesi ve mülk için Fehu ile Gebo çalışılır."
      },
      {
        id: "q10",
        question: "Isa (Buz) sembolünün tehlikesi nedir ve neden tek başına sıkça kullanılması tavsiye edilmez?",
        options: [
          "Zenginliği çok hızlı getirdiği için ruhsal dengesizlik yapar",
          "Durumları dondurur; evrimleşmeyi ve akışı keserek kişiyi kış uykusuna hapseder",
          "Fiziksel yaralar açar",
          "Diğer tüm Runelerin enerjisini tamamen yok eder"
        ],
        correctAnswerIndex: 1,
        explanation: "Isa, hareketi donduran buz tabakasıdır. Sürekli kullanımı hayatın akışını bloke eder ve evrimi durdurur."
      }
    ]
  }
};
