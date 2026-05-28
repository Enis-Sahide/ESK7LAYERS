export interface NumerologyMeaning {
  number: number;
  title: string;
  planet: string;
  element: string;
  typology: string;
  description: string;
  constructivePotentials: string;
  negativePotentials: string;
  relationships: string;
  career: string;
  lifePathDetails: string;
  destinyDetails: string;
  soulUrgeDetails: string;
  personalityDetails: string;
}

export const numerologyData: Record<number, NumerologyMeaning> = {
  1: {
    number: 1,
    title: "Öncü ve Yaratıcı Lider",
    planet: "Güneş",
    element: "Ateş",
    typology: "LİDER, BAĞIMSIZ VE YARATICI",
    description: "1 rakamı, eril enerjiyi, yaratımı ve varoluşun başlangıcını temsil eder. Doğal bir liderlik vasfınız vardır. Fiziksel veya zihinsel olarak dikkat çeken, enerjisi yüksek bir yapınız bulunur. Oldukça bağımsız, yenilikçi ve kendi kararlarını kendi veren birisiniz. İnsanlar tarafından kararlı, cesur ve yol açan biri olarak algılanırsınız.",
    constructivePotentials: "Liderlik, bağımsızlık, cesaret, irade gücü, inisiyatif alma, yaratıcılık, odaklanma ve özgün fikirler üretebilme.",
    negativePotentials: "Baskıcılık, egoizm, sabırsızlık, diktatörlük eğilimleri, başkalarını dinlememe ve tahammülsüzlük.",
    relationships: "İlişkilerde genellikle kontrolü elinde tutan taraf olmak istersiniz. Bağımsızlığınıza çok düşkünsünüzdür. Sizi destekleyen ama kendi alanınıza saygı duyan, sizi kısıtlamayan partnerlere ihtiyaç duyarsınız.",
    career: "Emir almaktan pek hoşlanmazsınız. Kendi işinizin patronu olmak, yönetici pozisyonlarında çalışmak veya yepyeni bir projeyi sıfırdan kurmak sizin için idealdir. (Girişimci, Yönetici, Lider)",
    lifePathDetails: "Bu hayattaki ana göreviniz bağımsızlığınızı kazanmak ve kendi yolunuzu çizmektir. Başkalarını takip etmek yerine, kendi özgün vizyonunuzu cesaretle ortaya koymalı ve insanlara ilham veren bir lider olmalısınız.",
    destinyDetails: "Fikirlerinizi hayata geçirme ve projeleri var etme konusunda eşsiz bir yeteneğiniz var. Kendi ayaklarınız üzerinde durduğunuzda ve yeni yollar açtığınızda isminizin hakkını verirsiniz.",
    soulUrgeDetails: "En derin arzunuz, kendi kendinize yetebilmek, tamamen bağımsız olmak ve kimseye hesap vermeden içsel liderliğinizi yaşamaktır.",
    personalityDetails: "Dışarıdan bakıldığında kendinden çok emin, sarsılmaz, lider ruhlu ve bazen biraz mesafeli ama kesinlikle saygı duyulan biri olarak görünürsünüz."
  },
  2: {
    number: 2,
    title: "Barışçıl Diplomat ve Sezgi Sahibi",
    planet: "Ay",
    element: "Su",
    typology: "BARIŞÇIL, EMPATİK VE SEZGİSEL",
    description: "2 rakamı, dişil enerjiyi, alıcılığı ve ikiliklerin dengesini temsil eder. İnanılmaz bir empati ve sezgi gücüne sahipsiniz. Olayların arkasındaki görünmeyen detayları ve insanların gerçek duygularını hemen hissedersiniz. Çatışmalardan hiç hoşlanmaz, bulunduğunuz her ortama uyum ve barış getirmek istersiniz.",
    constructivePotentials: "İşbirliği, uyum sağlama yeteneği, derin empati, diplomatik zeka, şifacılık ve detaylara dikkat.",
    negativePotentials: "Aşırı duyarlılık, kararsızlık, pasif-agresif davranışlar, onaylanma bağımlılığı, hayır diyememe ve özgüven eksikliği.",
    relationships: "İlişkiler sizin için hayatın merkezindedir. Partnerinizle tam bir bütünleşme, derin bir anlayış ve sevgi ararsınız. Romantik, düşünceli ve verici bir aşıksınız.",
    career: "Arabuluculuk gerektiren meslekler, danışmanlık, psikoloji, sanat veya iyi bir takım oyuncusu olmanızı gerektiren her türlü arka plan desteği sizin için harikadır.",
    lifePathDetails: "Ruhsal yolculuğunuz, ilişkilerde uyumu ve dengeyi bulmayı öğrenmektir. Çatışmaları çözen, insanları bir araya getiren ve sezgilerine güvenerek yol alan bir barış elçisi olmak için buradasınız.",
    destinyDetails: "Derin sezgileriniz ve insan psikolojisini anlama yeteneğiniz sayesinde harika bir danışman veya şifacısınız. Uyum yaratma kabiliyetiniz en büyük hediyenizdir.",
    soulUrgeDetails: "Ruhunuz uyum, sevgi, aidiyet ve ortaklık içinde olmayı arzular. Sevilmek, güvende hissetmek ve birinin hayatında önemli olmak istersiniz.",
    personalityDetails: "Dışarıdan bakıldığında uysal, zarif, cana yakın, sırdaş ve her zaman dinlemeye hazır, huzur veren bir dost olarak görünürsünüz."
  },
  3: {
    number: 3,
    title: "İlham Veren Yaratıcı ve İletişimci",
    planet: "Jüpiter",
    element: "Hava / Ateş",
    typology: "YARATICI, NEŞELİ VE SOSYAL",
    description: "3 rakamı, zihnin ve bedenin yaratıcı ifadesini temsil eder. İçinizdeki çocuk hiç büyümemiştir; son derece neşeli, iyimser ve ilham verici bir yapınız var. Kelimelerle (yazılı veya sözlü) aranız mükemmeldir. İnsanlar sizin enerjinizle yükselir, esprilerinizle neşelenirler. Sahne ışıkları doğal olarak sizi çeker.",
    constructivePotentials: "Mükemmel iletişim yeteneği, sanatsal yaratıcılık, mizah anlayışı, iyimserlik, karizma ve ilham vericilik.",
    negativePotentials: "Dağınıklık, yüzeysellik, dedikodu eğilimi, odaklanma sorunları, ciddiyetsizlik ve enerjiyi boşa harcama.",
    relationships: "İlişkilerde eğlence, gülmek ve iyi vakit geçirmek sizin için çok önemlidir. Sizi sınırlandıran veya sürekli dram yaratan kişilerden anında uzaklaşırsınız.",
    career: "Yazarlık, oyunculuk, şarkıcılık, tasarım, medya, halkla ilişkiler veya yeteneklerinizi ifade edebileceğiniz her türlü sahne/sanat işi.",
    lifePathDetails: "Amacınız, neşenizi ve yaratıcılığınızı dünyayla paylaşmaktır. Kendinizi ifade ederek başkalarının ruhunu yükseltmek üzere enkarne oldunuz.",
    destinyDetails: "Kelimelerle veya renklerle oynamayı çok iyi bilirsiniz. İnsanları ikna etme ve eğlendirme gücünüz yüksektir. Sahne ve iletişim alanlarında parlamanız kaçınılmazdır.",
    soulUrgeDetails: "İç dünyanızda sürekli bir şeyler üretmek, sahnede olmak ve kendinizi ifade etmek istersiniz. İnsanlara neşe vermek ruhunuzu besler.",
    personalityDetails: "Girdiğiniz her ortamda parlayan, konuşkan, stil sahibi, karizmatik ve enerjisiyle hemen dikkat çeken birisiniz."
  },
  4: {
    number: 4,
    title: "Sistemin Temel Taşı ve Düzen Kurucu",
    planet: "Uranüs (Geleneksel: Satürn)",
    element: "Toprak",
    typology: "DİSİPLİNLİ, PRATİK VE GÜVENİLİR",
    description: "4 rakamı, dünyevi düzeni, çalışmayı ve somutlaştırmayı temsil eder. Sistemlerin temel taşı gibisiniz. Son derece pratik, mantıklı, disiplinli ve çalışkansınız. Hayatta hiçbir şeyin kolay elde edilmediğini bilir, sabırla tuğlaları üst üste koyarsınız. İnsanlar size güvenir çünkü sözünüz senettir.",
    constructivePotentials: "Disiplin, çalışkanlık, pratik zeka, sağlamlık, dürüstlük, organizasyon yeteneği ve detaylara hakimiyet.",
    negativePotentials: "İnatçılık, esneklik eksikliği, dar görüşlülük, işkoliklik, değişime direnç ve aşırı kuralcılık.",
    relationships: "Güven ve sadakat sizin için her şeydir. Maceradan çok huzuru ve istikrarı seçersiniz. İlişkilerde ayakları yere basan, sorumluluk sahibi bir partnersiniz.",
    career: "Mühendislik, mimarlık, muhasebe, proje yöneticiliği, bankacılık veya sistem/düzen gerektiren her türlü kurumsal veya teknik alan.",
    lifePathDetails: "Misyonunuz, kaosun içine düzen getirmek ve geleceğe kalıcı temeller atmaktır. Fikirleri somut, işleyen sistemlere dönüştürmek sizin en büyük gücünüzdür.",
    destinyDetails: "Siz zodyağın mimarısınız. Sistem kurma ve yönetme konusunda doğal bir yeteneğiniz var. Toplumun sarsılmaz güvenilirliğiniz için size ihtiyacı var.",
    soulUrgeDetails: "Derinlerde güvenlik, düzen ve somut başarılar arzularsınız. Hayatınızda belirsizliklerin olmaması, ruhunuza en iyi gelen şeydir.",
    personalityDetails: "Ciddi, güvenilir, ağırbaşlı ve kurallara uyan biri olarak algılanırsınız. Giyiminiz ve duruşunuzla 'ben buradayım ve her şey kontrol altında' mesajı verirsiniz."
  },
  5: {
    number: 5,
    title: "Özgür Ruhlu Gezgin ve Değişim Elçisi",
    planet: "Merkür",
    element: "Hava",
    typology: "ÖZGÜR, MACERACI VE ÇOK YÖNLÜ",
    description: "5 rakamı, insan deneyiminin ortasında yer alır ve beş duyuyu, değişimi ve özgürlüğü temsil eder. Tam bir macera tutkunusunuz. Rutinden, monotonluktan ve kısıtlanmaktan nefret edersiniz. Yeni yerler görmek, yeni fikirler öğrenmek ve hayatı tüm sınırlarıyla deneyimlemek istersiniz. Adaptasyon yeteneğiniz muazzamdır.",
    constructivePotentials: "Hızlı düşünme, uyum sağlama, kriz yönetimi, cesaret, çok yönlülük, merak ve yenilikçilik.",
    negativePotentials: "Sorumsuzluk, maymun iştahlılık, huzursuzluk, bağımlılıklara yatkınlık, odaklanamama ve taahhüt korkusu.",
    relationships: "İlişkilerde boğulmaya gelemezsiniz. Sizin hızınıza ayak uydurabilecek, hayatı sizinle bir macera gibi yaşayacak enerjik partnerler ararsınız. Uzun vadeli sözler vermek sizi başlarda ürkütebilir.",
    career: "Rehberlik, gazetecilik, satış-pazarlama, gezginlik, dedektiflik veya sürekli hareket/değişim gerektiren, masa başı olmayan her türlü iş.",
    lifePathDetails: "Yolculuğunuz değişimi kucaklamak ve deneyim yoluyla bilgeliğe ulaşmaktır. Hayatın tüm lezzetlerini deneyimleyerek insanlara özgürlüğü öğretmek sizin görevinizdir.",
    destinyDetails: "Yenilik krizlerinde en iyi çözümleri siz bulursunuz. Hızlı adaptasyon ve kriz yönetimi yeteneğinizle değişimi başlatan bir katalizörsünüz.",
    soulUrgeDetails: "Ruhunuz sınırların ötesine geçmeyi, özgürce uçmayı ve her gün yeni bir şeyler öğrenmeyi arzular.",
    personalityDetails: "Enerjik, yerinde duramayan, ilginç fikirleri olan, girdiği ortamda hemen fark edilen ve dinamik bir hava yayan biri olarak algılanırsınız."
  },
  6: {
    number: 6,
    title: "Şifacı, Besleyici ve Sevgi Bekçisi",
    planet: "Venüs",
    element: "Toprak / Su",
    typology: "SORUMLU, ŞEFKATLİ VE ESTETİK",
    description: "6 rakamı, sevginin, ailenin, güzelliğin ve sorumluluğun frekansıdır. Dünyaya kelimenin tam anlamıyla şifa ve güzellik katmaya gelmişsiniz. Çevrenizdeki herkesin sorununu kendi sorununuzmuş gibi dert eder, onları beslemek ve korumak istersiniz. Güçlü bir estetik ve sanat anlayışınız, adalet duygunuz vardır.",
    constructivePotentials: "Şefkat, güvenilirlik, şifacılık, adalet duygusu, aile bağları, sanat ve estetiğe yatkınlık, sorumluluk bilinci.",
    negativePotentials: "Aşırı korumacılık, kurban psikolojisi, hayır diyememe, endişe, müdahalecilik ve başkalarının hayatına fazla karışma.",
    relationships: "İlişkilerde inanılmaz verici, sadık ve evcilsinizdir. Partneriniz ve aileniz için yapmayacağınız fedakarlık yoktur. Ancak karşılığında aynı ilgiyi ve takdiri görmeyi beklersiniz.",
    career: "Öğretmenlik, doktor/hemşire, danışman, dekoratör, müzisyen, insan kaynakları veya insanlara bakım/hizmet odaklı işler.",
    lifePathDetails: "Amacınız, koşulsuz sevgiyi öğrenmek ve etrafınızdakileri şifalandırmaktır. Toplumda uyumu sağlayarak insanlara manevi bir yuva sunmak üzere buradasınız.",
    destinyDetails: "Derin bir empati yeteneğiniz ve güçlü bir adalet duygunuz var. Çevrenizi güzelleştirme ve acıları hafifletme konusunda doğuştan bir şifacısınız.",
    soulUrgeDetails: "En çok istediğiniz şey; sevmek, sevilmek, sıcak bir yuvaya sahip olmak ve etrafınızdaki insanların huzurlu olduğunu görmektir.",
    personalityDetails: "Sıcak, anaç/babacan, güven veren, estetik zevkleri gelişmiş ve herkesin derdini anlattığı güvenilir bir liman olarak görünürsünüz."
  },
  7: {
    number: 7,
    title: "Bilge, Araştırmacı ve Mistik Ruh",
    planet: "Neptün",
    element: "Su / Eter",
    typology: "RUHSAL, ANALİTİK VE MİSTİK",
    description: "7 rakamı, fiziksel dünyanın ötesini arayan ruhsal ve analitik frekanstır. Kendi iç dünyanızda sessiz ve huzurlu bir hayat sürmek istersiniz. Zihniniz sürekli sorgular, analiz eder ve görünmeyenin ardındaki gerçeği arar. Oldukça sezgisel, gözlemci ve derinsinizdir. Yüzeysel sohbetler ve kalabalıklar sizi yorar.",
    constructivePotentials: "Zihinsel analiz, teknik gözlem, yüksek sezgi, bilgelik, araştırma yeteneği, felsefi derinlik ve odaklanma.",
    negativePotentials: "İzolasyon, aşırı şüphecilik, melankoli, eleştirellik, insanlardan kopukluk ve soğuk görünme.",
    relationships: "İlişkilerde çok seçicisinizdir. Zihinsel ve ruhsal olarak sizinle aynı derinliğe inemeyen biriyle bağ kuramazsınız. Kendi yalnızlık alanınıza saygı duyulması şarttır.",
    career: "Bilim insanı, araştırmacı, yazar, filozof, astrolog, dedektif veya bilişim teknolojileri gibi analitik düşünce gerektiren derin alanlar.",
    lifePathDetails: "Hayatın yüzeyindeki illüzyonların ötesini görmek için buradasınız. Felsefe, bilim veya okültizmin derinliklerine inerek varoluşun sırlarını çözmek sizin yolunuzdur.",
    destinyDetails: "Görünenin ardındakini okuma gücünüz muazzamdır. Gerçeği bulana kadar durmayan, doğal bir filozof veya ezoterik ustasınız.",
    soulUrgeDetails: "Ruhunuz evrenin gizemlerini çözmeyi, yalnız kalarak bilgeliğe ulaşmayı ve manevi bir uyanış yaşamayı arzular.",
    personalityDetails: "Dışarıdan gizemli, mesafeli, zeki, çok konuşmayan ama konuştuğunda nokta atışı yapan, hafif aristokrat bir yapı sergilersiniz."
  },
  8: {
    number: 8,
    title: "Maddi ve Manevi Güç Yöneticisi",
    planet: "Satürn",
    element: "Toprak",
    typology: "GÜÇLÜ, OTORİTER VE VİZYONER",
    description: "8 rakamı (sonsuzluk işareti), maddi ve manevi gücün, bolluğun ve karmik adaletin sembolüdür. Doğal bir otoriteniz, vizyonunuz ve organizasyon yeteneğiniz vardır. Güçlü, güvenilir ve dürüst bir karaktersiniz. Çok çalışkandır ve büyük oynamayı seversiniz. Parayı ve gücü yönetme kapasiteniz muazzamdır.",
    constructivePotentials: "Yöneticilik, finansal zeka, büyük organizasyonları yönetme, dayanıklılık, vizyonerlik ve etik güç kullanımı.",
    negativePotentials: "Materyalizm, acımasızlık, güç zehirlenmesi, aşırı hırs, kontrol deliliği ve statü takıntısı.",
    relationships: "İlişkilerde koruyucu, cömert ama genellikle kuralları koyan tarafsınız. Gücünüze saygı duyan, sizinle omuz omuza yürüyüp imparatorluğunuzu büyütecek sağlam bir partner ararsınız.",
    career: "CEO, yatırımcı, finans uzmanı, siyasetçi, müteahhit veya kendi büyük şirketinin kurucusu olmak.",
    lifePathDetails: "Maddi ve manevi dünyayı dengelemeyi öğrenme yolundasınız. Bolluk yaratmak, gücü etik bir şekilde kullanmak ve adil bir lider olmak sizin karmik dersinizdir.",
    destinyDetails: "Büyük kitleleri organize edebilme, zenginlik yaratabilme ve güçlü kurumlar inşa etme yeteneğiniz doğuştan gelir. Maddi dünyanın yöneticisisiniz.",
    soulUrgeDetails: "İç dünyanızda büyük bir iz bırakmak, başarılı olmak, finansal bağımsızlık ve tartışılmaz bir güç/otorite arzusu yatıyor.",
    personalityDetails: "Fiziksel olarak iri olmasanız bile heybetli bir duruşunuz vardır. Otoriter, ciddiyeti olan, saygı uyandıran ve güçlü bir aura yayarsınız."
  },
  9: {
    number: 9,
    title: "Evrensel Sevgi ve Şefkat Savaşçısı",
    planet: "Mars / Plüton",
    element: "Ateş",
    typology: "HÜMANİST, ŞEFKATLİ VE BİLGE",
    description: "9 rakamı, 1'den 8'e kadar olan tüm sayıların tecrübesini içinde barındıran, evrimsel döngünün son noktasıdır. Son derece bilge, hoşgörülü ve evrensel bir sevgiye sahipsiniz. Bütün insanlığı, hayvanları ve doğayı kucaklayan geniş bir vizyonunuz var. Bencillikten çok uzak, idealist ve verici bir ruhsunuz.",
    constructivePotentials: "Evrensel şefkat, hümanizm, bilgelik, hoşgörü, sanatsal ilham, koşulsuz fedakarlık ve geniş vizyon.",
    negativePotentials: "Hayal kırıklığı, dramatiklik, geçmişe takıntı, sınır çizememe, kurban hissi ve dünyayı kurtarma sendromu altında ezilme.",
    relationships: "Çok romantik, derinden seven ve fedakar bir partnersiniz. Bazen insanları oldukları gibi değil, olmalarını istediğiniz gibi idealize edip hayal kırıklığına uğrayabilirsiniz.",
    career: "Hayır kurumları yöneticiliği, uluslararası ilişkiler, sanat, yazarlık, şifacılık veya insanlığa hizmet eden global projeler.",
    lifePathDetails: "Misyonunuz evrensel sevgiyi yaymak, insanlığa hizmet etmek ve beklentisizce verebilmektir. Dünyayı daha iyi bir yer haline getirmek için buradasınız.",
    destinyDetails: "Sınırların ve ayrımların ötesini görebilen eski bir ruhsunuz. Büyük vizyonlarla kitlelere ilham verme ve şifalandırma yeteneğiniz var.",
    soulUrgeDetails: "Derinlerde yatan tek arzunuz, dünyanın daha adil, daha güzel, acıların bittiği bir yer olması ve sizin de buna katkı sağlamanızdır.",
    personalityDetails: "Karizmatik, anlayışlı, olgun, derin bakışlı ve herkese kucak açan, çok geniş gönüllü biri olarak görünürsünüz."
  },
  11: {
    number: 11,
    title: "Üstat Sayı: Sezgisel Aydınlatıcı",
    planet: "Uranüs (Yüksek Oktav)",
    element: "Eter / Hava",
    typology: "AYDINLANMIŞ, İLHAM VERİCİ",
    description: "11, ilk Üstat (Master) Sayıdır ve 2'nin daha yüksek bir oktavıdır. Psişik yetenekleriniz, sezgileriniz ve farkındalığınız olağanüstü boyutlardadır. İlham verici bir auranız vardır ve adeta yüksek boyutlardan bilgi indiren bir anten gibisiniz. Toplumu ruhsal olarak aydınlatmak için buradasınız.",
    constructivePotentials: "Ruhsal aydınlanma, vizyonerlik, güçlü sezgi, şifacılık, evrensel bilgi kanallığı.",
    negativePotentials: "Yüksek sinirsel gerilim, anksiyete, dünyadan kopuş, karmaşa ve potansiyelinden korkup 2'nin gölgelerine düşme.",
    relationships: "Çok derin, telepatik bir bağ ararsınız. Ruh eşini bulmak sizin için önemlidir çünkü sıradan bağlar ruhunuzu doyurmaz.",
    career: "Spiritüel öğretmen, yazar, psişik danışman, mucit veya sanatçı.",
    lifePathDetails: "Amacınız, evrensel bilgiyi alıp insanları aydınlatan ruhsal bir öğretmen, bir işaret fişeği olmaktır.",
    destinyDetails: "Varlığınız ve vizyonunuz, etrafınızdaki insanların titreşimini anında yükseltir. Siz bir ilham kaynağısınız.",
    soulUrgeDetails: "Evrensel gerçeklere ulaşmak, Tanrı/Evren ile birliği hissetmek ve yüksek şuuru deneyimlemek istersiniz.",
    personalityDetails: "Mistik, elektrikli bir aurası olan, gözlerinde başka bir dünyanın izleri olan büyüleyici biri olarak görünürsünüz."
  },
  22: {
    number: 22,
    title: "Üstat Sayı: Usta Mimar",
    planet: "Plüton (Yüksek Oktav)",
    element: "Eter / Toprak",
    typology: "YARATICI MİMAR, İNŞA EDİCİ",
    description: "22, ikinci Üstat Sayıdır ve 4'ün yüksek oktavıdır. 11'in vizyonunu alır ve onu 4'ün pratikliğiyle yeryüzünde somutlaştırır. Dünyayı değiştirecek potansiyele sahipsiniz. Büyük hayalleri gerçeğe dönüştüren, insanlığa kalıcı eserler ve sistemler bırakan usta bir mimarsınız.",
    constructivePotentials: "Dahilik seviyesinde pratiklik, büyük organizasyonlar kurma, küresel etki, vizyonu maddeye çevirme.",
    negativePotentials: "Ezici hırs, gücün karanlık kullanımı, potansiyelden korkup 4'ün inatçılığına ve dar görüşlülüğüne sığınma.",
    relationships: "Hem çok büyük işler başarıp hem de sağlam bir aile kurabilirsiniz. Partneriniz en büyük destekçiniz olmalıdır.",
    career: "Küresel şirket yöneticisi, uluslararası sistem kurucu, büyük siyasi lider, çığır açan mühendis/mimar.",
    lifePathDetails: "Sınırınız gökyüzüdür; insanlık için kalıcı ve devasa sistemler inşa etmek üzere enkarne oldunuz.",
    destinyDetails: "Dünyada somut ve kalıcı bir iz bırakacaksınız. İmkansız gibi görünen rüyaları gerçek kılma kudretiniz var.",
    soulUrgeDetails: "Sadece düşüncede değil, eylemde ve fiziki dünyada unutulmaz eserler bırakmayı arzularsınız.",
    personalityDetails: "Son derece güçlü, etkileyici, sınır tanımayan, sarsılmaz bir kaya gibi güvenilir ve vizyoner görünürsünüz."
  },
  33: {
    number: 33,
    title: "Üstat Sayı: Evrensel Şifacı ve Usta Öğretmen",
    planet: "Neptün (Yüksek Oktav)",
    element: "Eter / Su",
    typology: "EVRENSEL ŞİFACI, MESİHİ",
    description: "33, son ve en nadir Üstat Sayıdır; 6'nın yüksek oktavıdır. Saf koşulsuz sevginin, fedakarlığın ve ruhsal rehberliğin zirvesidir. Mesihi bir enerji taşırsınız. Kendi acılarınızı aşarak başkalarının acılarını dindirmeye adanmış büyük bir şifacı, toplumların öğretmeni ve ışık elçisisiniz.",
    constructivePotentials: "Koşulsuz evrensel sevgi, derin şifa enerjisi, ruhsal yükseliş, kendini adayış.",
    negativePotentials: "Dünyanın yükünü omuzlayıp çökme, kendini feda ederek yok olma, kurtarıcı sendromu.",
    relationships: "Aşkı ilahi boyutta yaşarsınız. Eşinizi ruhsal bir yoldaş olarak görür ve onu sarıp sarmalarsınız.",
    career: "Büyük ruhani lider, evrensel şifacı, kitlelere ilham veren sanatçı veya devrimsel eğitimci.",
    lifePathDetails: "Sizin yolunuz, saf sevgi yoluyla insanlığın kalbini iyileştirmektir. Kendinizi adayarak insanlara rehberlik eden bir ustasınız.",
    destinyDetails: "Ego zincirlerinden kurtulup saf bir sevgi kanalı olduğunuzda mucizeler yaratır, kitleleri iyileştirirsiniz.",
    soulUrgeDetails: "En yüce arzunuz, tüm canlıların acıdan kurtulması ve evrensel bir sevgi boyutuna geçiş yapmasıdır.",
    personalityDetails: "Gözlerinde şefkat parlayan, yanındayken insanların sebepsiz yere huzur bulduğu, aziz/azize enerjisine sahip biri."
  }
};
