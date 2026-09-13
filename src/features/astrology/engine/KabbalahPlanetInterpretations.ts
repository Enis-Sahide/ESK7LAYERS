import { ZodiacSign } from '../api/astrologyClient';

const KABBALAH_SIGNS: Record<ZodiacSign, { assiah: string, yetzirah: string, beriyah: string, atzilut: string }> = {
  'Koç': { 
    assiah: 'Fiziksel dünyada var olma savaşı. Bedenin hayatta kalma dürtüsü, engelleri yakıp geçme cesareti ve somut eylem gücü.',
    yetzirah: 'Geçmiş yaşam karmalarından gelen savaşçı duygular ve hücresel öfke hafızası. Duygusal bağımsızlık ve "Ben buradayım" çığlığı.',
    beriyah: 'Zihinsel inisiyatif ve kozmik planın öncü fikirleri. İlahi iradenin yüksek beyinde kıvılcım alması ve liderlik vizyonu.',
    atzilut: 'İlksel ateşin Keter\'den fışkırması. Egosuz "Ben Varım" iradesi. Ruhun matrisin dışına çıkmak için kullandığı mutlak başlama kudreti.'
  },
  'Boğa': { 
    assiah: 'Maddeye (Malkut) köklenme, finansal güvenlik, bedensel hazlar ve 5 duyunun fiziksel dünyadaki mutlak tatmini.',
    yetzirah: 'Geçmiş yaşamlardan gelen madde bağımlılıkları veya kaybetme korkusu. Duygusal güven arayışı ve hücresel konfor ihtiyacı.',
    beriyah: 'Kozmik yasaların somut ve kalıcı formlara zihinsel olarak oturtulması. Evrensel sabır ve pratik bilgelik (Hokmah).',
    atzilut: 'Işığın form alma (katılaşma) kudreti. İlahi olanın yeryüzüne inip sarsılmaz bir şekilde köklenmesindeki yaratıcı irade.'
  },
  'İkizler': { 
    assiah: 'Günlük iletişim, yakın çevre ilişkileri, ticari zeka ve fiziksel dünyadaki adaptasyon yeteneği.',
    yetzirah: 'Bilinçaltındaki dualite (ikilik) çatışmaları. Karmik olarak getirilen kararsızlıklar ve ruhun diğer yarısını bulma arzusu.',
    beriyah: 'Thoth\'un iletişim aynası. Zihnin alt ve üst alemler arasında kurduğu data köprüsü. Bilgi ışığının parçalanarak yayılması.',
    atzilut: 'Kozmik nefes ve ilahi kelam. Ruhun her yerde aynı anda olabilme (kuantum dolanıklık) kudreti ve mutlak esneklik.'
  },
  'Yengeç': { 
    assiah: 'Fiziksel aile, genetik miras, yuva kurma güdüsü ve bedensel korunma/beslenme ihtiyacı.',
    yetzirah: 'Kozmik rahmin suları. Ruhun enkarnasyon havuzuna dalışı. Atalar karmanızın genetik koda ve hücresel hafızaya işlenmesi.',
    beriyah: 'Evrensel şefkat yasası. Yüksek zihnin olayları sezgisel bir merhametle (Binah) okuması ve empatik koruyuculuk.',
    atzilut: 'Mutlak Ana Tanrıça (Büyük Dişil) kudreti. Ruhun tüm yaratılışı kapsayan ve besleyen ilahi okyanus iradesi.'
  },
  'Aslan': { 
    assiah: 'Fiziksel sahnede parlama, egonun alkışlanma arzusu, dünyevi liderlik, çocuklar ve yaratıcı sanat.',
    yetzirah: 'Geçmiş yaşamlardaki gurur, onaylanma ihtiyacı veya kalp kırıklıklarının hücresel izleri. Duygusal krallık kurma güdüsü.',
    beriyah: 'İlahi logos\'un zihinde uyanışı. Evrensel yaşam enerjisinin merkezine oturma ve kozmik yaratıcılık vizyonu.',
    atzilut: 'Tifaret\'in merkez güneşi. Ruhun kendi yaratıcılığını evrene ilan etmesi ve bireysel egonun ilahi iradeye dönüşme kudreti.'
  },
  'Başak': { 
    assiah: 'Fiziksel sağlık, bedensel rutinler, iş hayatındaki detaycılık ve dünyevi sistemleri kusursuzlaştırma çabası.',
    yetzirah: 'Geçmiş yaşamlardan gelen yetersizlik hissi veya kusursuzluk takıntısı. Ruhun hizmet yoluyla duygusal saflaşma süreci.',
    beriyah: 'Yesod\'un analitik süzgeci. İlahi yasaların mikroskobik detaylarına inen zihinsel simya ve ayrıştırma ustalığı.',
    atzilut: 'Maddenin mutlak arındırılması. İlahi sistemin yeryüzünde kusursuz bir fraktal (hologram) olarak tezahür etme kudreti.'
  },
  'Terazi': { 
    assiah: 'Sosyal ilişkiler, evlilik, hukuksal adalet ve fiziksel dünyadaki estetik/uyum arayışı.',
    yetzirah: 'Karmik kontratlarla (Tikkun) hayatımıza çekilen "Öteki" ruhlar. Kendimizdeki eksiği ilişkiler aynasında görmenin duygusal sancısı.',
    beriyah: 'Maat\'ın terazisi. Zıtlıkların uyumu ve kozmik denge yasası. Yüksek aklın dualiteyi tarafsızca dengeleme vizyonu.',
    atzilut: 'İlahi Aşk ve Çekim (Netsah). Ruhun bütüne uyumlanarak evrensel güzellik ve mutlak ahenk yaratma kudreti.'
  },
  'Akrep': { 
    assiah: 'Kriz yönetimi, finansal ortaklıklar, cinsellik, ölüm ve fiziksel dünyadaki güç savaşları.',
    yetzirah: 'Yeraltına iniş ve simyasal Nigredo. Geçmiş yaşam travmaları, tutkular ve hücresel korkularla yüzleşerek dönüşme.',
    beriyah: 'Derin okült sırlar. Zihnin illüzyon perdelerini yırtarak gerçeğin en çıplak haline ulaşma (araştırma) arzusu.',
    atzilut: 'Mutlak Mutasyon (Daat). Ruhun eski formları yakarak (Anka kuşu misali) küllerinden yeni evrenler doğurma kudreti.'
  },
  'Yay': { 
    assiah: 'Fiziksel seyahatler, dünyevi eğitimler, macera arayışı ve yabancı kültürlerle etkileşim.',
    yetzirah: 'Bilincin hayvansal doğadan (Sentor) kopup özgürleşme arzusu. Karmik olarak getirilen inanç kalıpları ve dogmalar.',
    beriyah: 'Hakikat oku. Hesed\'in genişletici bilgeliği, yüksek felsefe ve zihnin kozmik ufuklara (makrokozmosa) sıçraması.',
    atzilut: 'İlahi İnayet. Ruhun evrensel matrisi aşarak doğrudan Kaynak ile bağlantı kurma ve mutlak özgürlük kudreti.'
  },
  'Oğlak': { 
    assiah: 'Kariyer, statü, devlet yapıları, fiziksel sınırlar, disiplin ve madde dünyasındaki inşa süreci.',
    yetzirah: 'Geçmiş yaşamlardan gelen otorite figürleriyle karmik çatışmalar, suçluluk duyguları ve yetersizlik korkuları.',
    beriyah: 'Zamanın efendisi (Satürn). Karmik eşiği zihinsel bir ustalıkla yönetmek ve kozmik kuralların idraki.',
    atzilut: 'Tekamül dağının zirvesi. Ruhun tüm illüzyonları sabırla aşarak inisiyasyon (Kozmik Kapı) kudretine ulaşması.'
  },
  'Kova': { 
    assiah: 'Sosyal çevre, devrimler, teknoloji, sistem karşıtlığı ve fiziksel dünyadaki grup organizasyonları.',
    yetzirah: 'Toplumdan dışlanma veya aidiyetsizlik hissinin hücresel hafızası. Duygusal isyan ve özgürlük patlamaları.',
    beriyah: 'Yıldız tohumlarının şuuru. Evrensel kardeşlik bilinci ve zihnin geleceğin kodlarını (Matrix\'i) hackleme yeteneği.',
    atzilut: 'Atzilut\'tan inen şimşek (Uranüsyen). Ruhun ilahi aklı doğrudan yeryüzüne indirip sistemi anında mutasyona uğratma kudreti.'
  },
  'Balık': { 
    assiah: 'Hastaneler, fedakarlıklar, sanatsal ilhamlar, dünyevi kaçışlar ve fiziksel sınırların erimesi.',
    yetzirah: 'Geçmiş yaşamların kurban bilinci. Psişik süngerlik, derin melankoli ve astral boyuttaki karmik borç ödemeleri.',
    beriyah: 'Evrensel rüya ağı. Yüksek zihnin mantığı bırakıp sezgilerle okyanusa (Kaynağa) dönmesi, kolektif merhamet.',
    atzilut: 'Tüm sınırların (Maya) çözülümü. İlahi aşk, mistik teslimiyet ve ruhun Vahdet\'te (Mutlak Birlik) erime kudreti.'
  }
};

const KABBALAH_PLANETS: Record<string, { assiah: string, yetzirah: string, beriyah: string, atzilut: string }> = {
  'Güneş': {
    assiah: 'Fiziksel yaşam gücü, bedenin canlılığı ve bu 3 boyutlu enkarnasyonda yaratacağınız ana dünyevi karakteriniz.',
    yetzirah: 'Duygusal krallığınız. Geçmişten getirdiğiniz ego kimlikleri ve bilinçaltında onaylanmayı bekleyen içsel çocuğunuz.',
    beriyah: 'Zihinsel aydınlanma. Yüksek bilincinizin olayları ego perdesi olmadan okuyuşu ve evrensel idrak kapasiteniz.',
    atzilut: 'Tifaret\'in kalbi, Mesih bilinci. Ruhun doğrudan Yaratıcı\'nın frekansına hizalanmış merkezi ve sonsuz ışığı.'
  },
  'Ay': {
    assiah: 'Biyolojik döngüler, annelik, beslenme alışkanlıkları ve fiziksel dünyada kendinizi güvende hissetme biçiminiz.',
    yetzirah: 'Yetzirah aleminin tam karşılığı. Geçmiş yaşam karmaları, hücresel hafıza, rüyalar ve en derin astral savunma mekanizmalarınız.',
    beriyah: 'Sezgisel zeka. Makrokozmosun bilgeliğini, analitik aklı kullanmadan psişik algıyla (ilhamla) indirme yeteneğiniz.',
    atzilut: 'İlahi yansıtıcı ayna. Ruhun evrensel şefkati (Kozmik Ana) hiçbir filtreden geçirmeden evrene yayma kudreti.'
  },
  'Merkür': {
    assiah: 'Konuşma tarzınız, pratik zekanız, el becerileriniz ve fiziksel dünyadaki sinir sistemi / iletişim ağınız.',
    yetzirah: 'Duyguları kelimelere dökme biçiminiz. Bilinçaltınızın kendini ifade ederken takıldığı karmik dil düğümleri.',
    beriyah: 'Hermes/Thoth. Hod sefirasının entelektüel gücü. Bilinç ve bilinçdışı boyutlar arası bilgi transferi sağlayan yüksek zihin.',
    atzilut: 'İlahi Kelam. Ruhun düşünce hızıyla yaratım (Telepati/Dolanıklık) yapabilme ve saf bilgiyi titreştirme kudreti.'
  },
  'Venüs': {
    assiah: 'Fiziksel estetik, maddi değerler, romantik ilişkiler ve 5 duyuyu tatmin eden her türlü dünyevi haz.',
    yetzirah: 'Geçmiş yaşam sevgi kontratları. Bilinçaltınızın neleri çekici bulduğu ve değer görme arzunuzun duygusal kökeni.',
    beriyah: 'Netsah sefirasının kozmik çekim yasası. Zıtlıkları birleştirerek evrensel bir uyum ve barış matematiği kurma yeteneği.',
    atzilut: 'İlahi Aşk. Ruhun yaratılışın tamamıyla bütünleşme sanatı ve şartsız, koşulsuz sevginin mutlak tezahürü.'
  },
  'Mars': {
    assiah: 'Fiziksel savaşma gücü, cinsel enerji, kas sistemi ve dünyevi hayatta kalma (mücadele) kapasiteniz.',
    yetzirah: 'Bilinçaltında bastırılmış öfke, geçmiş yaşam savaş travmaları ve duygusal olarak sınır çizme (savunma) mekanizmanız.',
    beriyah: 'Geburah\'ın aktif gücü. Evrensel yolda ilerlerken karşınıza çıkan spiritüel engelleri yakan odaklanmış irade alevi.',
    atzilut: 'Kozmik Savaşçı Ateşi. İlahi iradenin, yaratılıştaki kaosu düzene sokmak için kullandığı saf ve yok edici (arınma) kudreti.'
  },
  'Jüpiter': {
    assiah: 'Maddi bolluk, fiziksel şans, finansal büyüme ve bu boyutta karşılaştığınız dünyevi fırsatlar kapısı.',
    yetzirah: 'Duygusal inançlar, geçmiş yaşamlardan gelen dinsel dogmalar ve ruhun içsel olarak neye güvenerek genişlediği.',
    beriyah: 'Hesed\'in merhameti. Makrokozmik genişleme, ilahi guru enerjisi ve yüksek zihnin felsefi sırları kavrama idraki.',
    atzilut: 'İlahi İnayet. Ruhun evrensel bolluk okyanusuyla tamamen bir olması ve hiç tükenmeyen lütfun tezahür kanalı.'
  },
  'Satürn': {
    assiah: 'Fiziksel engeller, hastalıklar, fakirlik testleri, zamanın getirdiği yaşlanma ve dünyevi sorumlulukların ağırlığı.',
    yetzirah: 'Geçmiş yaşam karmalarının faturası. Bilinçaltı korkuları, yetersizlik hissi ve egonun cezalandırılma endişesi.',
    beriyah: 'Binah (Eşiğin Bekçisi). Zaman ve form illüzyonunu ustalıkla yönetmek için zihnin geçmesi gereken disiplin (Karma Lordu).',
    atzilut: 'İlahi Mimari. Ruhun bu yoğunluğu ve formu matris içinde sabit tutmak için kullandığı kadersel tasarım (Sınır) kudreti.'
  },
  'Uranüs': {
    assiah: 'Fiziksel dünyadaki ani değişimler, kazalar, teknolojik sıçramalar ve sistem dışı (marjinal) olaylar zinciri.',
    yetzirah: 'Bilinçaltındaki ani kopuşlar, travmatik ayrılıkların hücresel hafızası ve duygusal olarak bağlanma korkusu.',
    beriyah: 'Hokmah\'ın aniden parlayan şimşeği. Matrix\'i yırtan kozmik deha, ani uyanış ve ilahi aklın isyankar aktarımı.',
    atzilut: 'Mutlak Özgürlük. Ruhun evrensel yazılımı saniyeler içinde baştan kodlama (Mutasyon) ve kuantum sıçrama kudreti.'
  },
  'Neptün': {
    assiah: 'Bağımlılıklar, kimyasal zehirlenmeler, kronik yorgunluk, aldanmalar ve fiziksel dünyadaki kayboluş (sis) hali.',
    yetzirah: 'Geçmiş yaşamlardan gelen kurban/kurtarıcı rolleri, derin psişik acılar ve auranın (sınırların) başkaları tarafından ihlali.',
    beriyah: 'Evrensel anten. Makrokozmosun görünmez frekanslarını, vizyonları ve telepatik mesajları zihne indiren mistik radar.',
    atzilut: 'Keter\'in sonsuz suları. Kozmik çözülme, egonun tamamen erimesi ve ruhun "Hiçlik" (Vahdet) ile mutlak bütünleşmesi.'
  },
  'Plüton': {
    assiah: 'Gizli düşmanlar, yeraltı dünyası, kitlesel yıkımlar, iflaslar ve fiziksel olarak sıfırdan başlama mecburiyeti.',
    yetzirah: 'En derin gölge kimlikleriniz, takıntılar, karmik nefretler ve ruhun en karanlık mağaralarındaki duygusal simya.',
    beriyah: 'Daat (Gizli Bilgi). Ölüm ve yeniden doğuş döngülerini yüksek zihinle okuma, gerçeğin köküne inen röntgen vizyonu.',
    atzilut: 'Sonsuz Yok Etme ve Var Etme. Ruhun bir galaksiyi yutup yenisini doğuran (Kara Delik) mutlak dönüşüm kudreti.'
  },
  'Kiron': {
    assiah: 'Fiziksel dünyada sürekli kanayan, çare bulunamayan veya başkalarını iyileştirirken sizi tüketen bedensel ve dünyevi yaralarınız.',
    yetzirah: 'Geçmiş yaşamlardan gelen derin reddedilme, terk edilme veya değersizlik travması. Duygusal boyuttaki "Yaralı Şifacı" arketipiniz.',
    beriyah: 'Acının zihinsel olarak idrak edilip bilgelik simyasına dönüştürülmesi. Kendi yaranızın başkaları için bir anahtara dönüştüğü idrak düzeyi.',
    atzilut: 'İlahi Şifa kanalı. Ruhun artık kişisel yarasını aşıp, Kaynak\'tan inen kozmik şifa enerjisini insanlığa aktardığı pürüzsüz portal.'
  },
  'Kuzey Ay Düğümü': {
    assiah: 'Fiziksel hayatta ulaşmanız gereken kariyer, maddi hedef veya somut olarak öğrenmeniz gereken yeni yaşam pratikleri.',
    yetzirah: 'Duygusal konfor alanınızdan (GAC) çıkıp, bu hayatta inşa etmeniz gereken yeni duygusal kimliğinizin sancılı rotası.',
    beriyah: 'Ruhsal tekamülünüzün yüksek zihinsel felsefesi. İlahi planın sizden bu enkarnasyonda beklediği bilinç sıçraması.',
    atzilut: 'Kaderin İlahi İğnesi. Ruhun evrensel bütünlüğe hizmet etmek için yeryüzüne indirmeyi taahhüt ettiği kozmik kontrat.'
  },
  'Yükselen (ASC)': {
    assiah: 'Fiziksel dış görünüşünüz, biyolojik avatarınızın genetik yapısı ve insanların sizi ilk gördüğünde algıladığı maskeniz.',
    yetzirah: 'Dünyaya karşı geliştirdiğiniz ilk savunma (duygusal zırh) mekanizmanız ve yaşamla ilk temasınızdaki hücresel tepkiniz.',
    beriyah: 'Ruhun bu bedene inmeden önce seçtiği ana ders. Bu yaşam senaryosuna hangi zihinsel filtreyle bakacağınızın vizörü.',
    atzilut: 'İlahi Kıvılcım Kapısı. Ruhun bu boyutta "Ben Varım" deme şekli ve yaratım gücünün maddeye girdiği ilk enerji noktası.'
  },
  'Tepe Noktası (MC)': {
    assiah: 'Toplum önündeki statünüz, kariyer zirveniz ve fiziksel dünyada bırakacağınız somut miras.',
    yetzirah: 'Toplumsal onaylanma ihtiyacınızın duygusal kökeni ve otoriteyle olan bilinçaltı ilişkiniz.',
    beriyah: 'Ruhun bu hayattaki "Magnum Opus"u (Büyük İşi). Yüksek zihnin kolektif amaca hizmet etmek için kurguladığı hedef.',
    atzilut: 'İlahi Taçlanma. Ruhun yeryüzü görevini tamamladığında evrene iade edeceği ve frekansını yükselteceği mutlak erdem.'
  },
  'Şans Noktası (POF)': {
    assiah: 'Fiziksel dünyada paranın, şansın ve somut fırsatların size en kolay akacağı zahmetsiz kazanç alanı.',
    yetzirah: 'Geçmiş yaşam iyi karmalarınızın ödülü. Duygusal olarak en kolay tatmin olduğunuz ve huzur bulduğunuz altın oran.',
    beriyah: 'Beden (ASC), Zihin (Ay) ve Ruh (Güneş) hizalandığında açığa çıkan evrensel lütfun zihinsel okuması.',
    atzilut: 'İlahi Hizalanma. Ruhun matrisin dirençlerini tamamen aştığında otomatik olarak üzerine akan sonsuz kozmik şans.'
  },
  'Dünya': {
    assiah: 'Fiziksel bedenin topraklanma merkezi. Yerçekimine ve maddeye ne kadar sağlam bastığınızın göstergesi.',
    yetzirah: 'Doğa anayla ve dünya anayla (Gaia) olan hücresel bağınız. Köklenme ve duygusal aitlik hissiniz.',
    beriyah: 'Malkut\'un kendisi. Ruhun bu boyuttaki illüzyonları anlayıp, maddesel matriksi zihinsel olarak ustalıkla oynaması.',
    atzilut: 'Helyosentrik merkez noktanız. Dünya artık sizin köklerinizi evrensel Güneş\'ten nasıl beslediğinizi gösterir.'
  },
  'Vertex (Vx)': {
    assiah: 'Fiziksel hayatta kontrolünüz dışında aniden karşınıza çıkan kişiler, eşler ve somut kadersel dönüm noktaları.',
    yetzirah: 'Bilinçaltı kör noktalarınız. Farkında olmadan hayatınıza çektiğiniz ve duygusal tetikleyici olan karmik ruhlar.',
    beriyah: 'Kadersel kesişim noktası. Evrenin sizi belli bir yola sokmak için kurduğu zihinsel ve eşzamanlı uyanış kapıları.',
    atzilut: 'İlahi Müdahale. Ruhun tekamülden sapmasını engellemek için Kaynak\'ın oyuna doğrudan ve aniden el atması.'
  },
  'Lilith': {
    assiah: 'Fiziksel dünyada bastırılmış gölgeleriniz, cinsel tabulardan arınma ve dünyevi bağımlılıkları kesip atacak radikal dürüstlük gücünüz.',
    yetzirah: 'Geçmiş yaşam karmalarından gelen boyun eğmeme dürtüsü. Duygusal boyuttaki kurban rolünü reddederek özgürleşme çabası ve vahşi dişil doğa.',
    beriyah: 'Zihinsel düzeyde sistemin (matrix) sınırlayan marjinal fikirler. Egonun sınırlarını eriten ve karanlığı aydınlığa dönüştüren yüksek akıl.',
    atzilut: 'İlahi adalet ve kozmik arınma. Ruhun yeryüzü illüzyonuna boyun eğmeyen, tabuları yıkan ve özgürleştiren en saf, lekesiz ışık gücü.'
  }
};

const KABBALAH_HOUSES: Record<number, { esoteric: string }> = {
  1: { esoteric: 'Malkut\'un birinci kapısı. Avatarın dünyada kendini ilk defa "Ben" olarak tezahür ettirdiği ve dış dünyayla çarpıştığı enerji alanı.' },
  2: { esoteric: 'Ruhsal özdeğerin ve maddeye (Assiah) hükmetme gücünün test edildiği, yeryüzü kaynaklarının depolandığı form alanı.' },
  3: { esoteric: 'Thoth\'un alt zihin kanalı. Kardeşlik bağları, yakın çevre karması ve bilginin alt boyutlarda kodlanma laboratuvarı.' },
  4: { esoteric: 'Bilinçaltının dipsiz kuyusu ve atalardan gelen karmik miras (Kökler). Ruhun içsel sığınağı ve enkarnasyon temeli.' },
  5: { esoteric: 'İlahi yaratıcılığın ve saf neşenin alanı. Kalp çakrasının dışa vurumu ve ruhun kendi tanrısallığını sanatta/çocukta görme arzusu.' },
  6: { esoteric: 'Arınma, hizmet ve karmik borç ödeme alanı. Egonun fiziksel ve ruhsal hastalıklar üzerinden terbiye edilip saflaştığı ocak.' },
  7: { esoteric: 'Aynalama kapısı. Kozmik kontratlarla (Tikkun) hayatımıza çekilen "Öteki" ruhlar üzerinden kendimizdeki eksiği ve gölgeyi gördüğümüz terazi.' },
  8: { esoteric: 'Karanlık tünel. Simyasal ölüm, dönüşüm ve okült sırlar alanı. Egonun krizler yoluyla yıkılıp (Nigredo) astral bağlardan kurtuluş savaşı.' },
  9: { esoteric: 'Yüksek zihnin (Beriyah) kapısı. İlahi yasanın, felsefenin ve uzak ufukların keşfedildiği makrokozmik arayış alanı.' },
  10: { esoteric: 'Zirve noktası. Ruhun toplumsal matriks içindeki otoritesi ve bu boyutta gerçekleştirmesi gereken kadersel magnum opus\'u (başyapıtı).' },
  11: { esoteric: 'Yıldız tohumlarının meclisi. Evrensel kardeşlik, vizyoner idealler ve kolektif bilincin (Ağa bağlanma) tezahür alanı.' },
  12: { esoteric: 'Okyanusa dönüş ve çözülme. En gizli korkular, psişik saldırılar, geçmiş yaşam karmasının infazı ve egonun Vahdet\'e (Birliğe) mutlak teslimiyeti.' }
};

interface PlanetPracticalInfo {
  power: string;
  key: string;
}

const PLANET_PRACTICAL: Record<string, PlanetPracticalInfo> = {
  'Güneş': {
    power: 'Özgün kimliğinizi, yaratıcı liderliğinizi ve içsel ışığınızı dünyada güvenle ortaya koyma gücü.',
    key: 'Işığınızı başkalarını gölgede bırakmak için değil; onların da kendi potansiyelini keşfetmesine ilham olmak ve yolu aydınlatmak için sunun.'
  },
  'Ay': {
    power: 'Derin sezgiler, duygusal empati, şefkat ve etrafınızdaki görünmez enerjileri hissetme yeteneği.',
    key: 'Duygularınızı bastırmayın veya onlara esir olmayın; hislerinizin bilge ve sükûnet dolu bir gözlemcisi olun.'
  },
  'Merkür': {
    power: 'Hızlı kavrama, keskin analiz gücü, etkileyici ifade yeteneği ve zihinsel köprüler kurma ustalığı.',
    key: 'Zihninizi sadece bilgi depolamak için değil, hakikati sadeleştiren ve insanları birleştiren sözler üretmek için kullanın.'
  },
  'Venüs': {
    power: 'Kozmik çekim gücü, estetik vizyon, ilişkilerde zarafet yaratma ve maddi/manevi bereketi çekme.',
    key: 'Özdeğerinizi başkalarının onayında değil kendi içsel bütünlüğünüzde arayın; sevginizi beklentisizce ve cömertçe paylaşın.'
  },
  'Mars': {
    power: 'Yüksek eylem gücü, öncülük cesareti, engelleri aşan savaşçı irade ve kararlılık.',
    key: 'Öfkenizi bir yıkım aracına değil; hedeflerinize odaklanan yapıcı, adil ve kararlı bir disipline dönüştürün.'
  },
  'Jüpiter': {
    power: 'Evrensel vizyon, sarsılmaz inanç, yüksek bilgelik, cömertlik ve yaşam fırsatlarını çoğaltma gücü.',
    key: 'Bilginizi tevazu ile büyütün; öğrendiklerinizi bencilce saklamak yerine başkalarının yolunu aydınlatmak için paylaşın.'
  },
  'Satürn': {
    power: 'Sarsılmaz sabır, sağlam temeller inşa etme ustalığı, krizleri olgunlukla karşılama ve zamanın efendisi olma.',
    key: 'Zorlukları bir ceza değil; ruhunuzu elmas gibi işleyen, size kadersel olgunluk kazandıran kutsal sınavlar olarak görün.'
  },
  'Uranüs': {
    power: 'Deha kıvılcımları, kalıpları kıran özgünlük, geleceği öngörme ve toplumsal uyanışa öncülük etme.',
    key: 'Sıra dışı vizyonunuzu sadece kurulu düzeni yıkmak için değil; insanlığa fayda sağlayan yeni ve özgürleştirici sistemler kurmak için kullanın.'
  },
  'Neptün': {
    power: 'Kozmik sezgiler, sanatsal ve ruhsal ilham, koşulsuz sevgi ve ilahi akışa güvenle teslimiyet.',
    key: 'Hayallerinizle gerçek dünya arasında köprü kurun; mistik algılarınızı dünyevi sorumluluklarla topraklayın.'
  },
  'Plüton': {
    power: 'Dönüşüm simyası, krizlerden küllerinden yeniden doğma, psişik derinlik ve manyetik güç.',
    key: 'Kontrol takıntısını bırakın; eskiyen parçalarınızı serbest bıraktığınızda içinizdeki gerçek yenilenme gücü açığa çıkacaktır.'
  },
  'Kiron': {
    power: 'Kendi yarasından başkalarına şifa damıtan "Yaralı Şifacı" ustalığı, derin empati ve kapsayıcılık.',
    key: 'Önce kendi içsel yaralarınıza şefkat gösterin; iyileştiğiniz yerden tüm çevrenize tükenmez bir ışık saçacaksınız.'
  },
  'Kuzey Ay Düğümü': {
    power: 'Ruhun bu enkarnasyondaki pusulası, konfor alanını aşarak yeni erdemler ve yetenekler inşa etme cesareti.',
    key: 'Bilinmeyene doğru cesaretle adım atın; geçmişin tanıdık alışkanlıklarını geride bıraktığınızda ruhsal doyumunuz başlayacaktır.'
  },
  'Yükselen (ASC)': {
    power: 'Dünyaya sunulan özgün ışık, güçlü ilk intiba, yaşamsal canlılık ve bireysel varoluş imzası.',
    key: 'İçinizdeki ruhsal hakikati dış dünyadaki duruşunuzla tam bir dürüstlük ve zarafetle hizalayın.'
  },
  'Tepe Noktası (MC)': {
    power: 'Toplumsal başarı, mesleki ustalık, kadersel başyapıt ve dünyaya bırakılacak kalıcı bir miras.',
    key: 'Başarıyı unvan veya alkışta değil; yaptığınız işle kaç kişinin hayatına dokunduğunuzda arayın.'
  },
  'Şans Noktası (POF)': {
    power: 'Beden, zihin ve ruh hizalandığında hayatınıza zahmetsizce akan ilahi lütuf, şans ve bereket.',
    key: 'Yeteneklerinizi sevgiyle ve samimiyetle paylaştığınızda; maddi ve manevi bolluk size kendiliğinden akacaktır.'
  },
  'Dünya': {
    power: 'Madde boyutuna sağlam köklenme, pratik bilgelik ve yeryüzünde sürdürülebilir güzellikler üretme.',
    key: 'Gökyüzünün bilgeliğini yeryüzünün toprağıyla birleştirin; sağlam, dengeli ve faydalı eserler üretin.'
  },
  'Vertex (Vx)': {
    power: 'Kadersel eşzamanlılıklar, hayatınıza aniden giren uyanış vesilesi kilit insanlar ve dönüm noktaları.',
    key: 'Karşınıza çıkan tesadüflerin arkasındaki ilahi mesajı fark edin ve hayatın getirdiği kadersel dönüşümlere gönüllü olun.'
  },
  'Lilith': {
    power: 'Boyun eğmeyen içsel özgürlük, sezgisel vahşi bilgelik ve sahte tabuları yıkan radikal dürüstlük.',
    key: 'Karanlığınızı inkar etmeyin; bastırılmış gölgelerinizi sevgiyle kucaklayıp yaratıcı ve özgürleştirici bir güce dönüştürün.'
  }
};

interface SignPracticalInfo {
  shadow: string;
  advice: string;
}

const SIGN_PRACTICAL: Record<string, SignPracticalInfo> = {
  'Koç': {
    shadow: 'Sabırsızlık, fevrilik, öfke patlamaları ve sonunu düşünmeden savaşa atılma eğilimi.',
    advice: 'Cesaretinizi acelecilikle değil, bir nefeslik içsel sükûnet ve stratejiyle harmanlayın.'
  },
  'Boğa': {
    shadow: 'Değişime aşırı direnç, maddeye veya alışkanlıklara bağımlılık ve konfor alanına hapsolma.',
    advice: 'Güveni dışsal varlıklarda değil, kendi üretkenliğinizde arayın ve hayatın akışına esneklikle güvenin.'
  },
  'İkizler': {
    shadow: 'Zihinsel dağınıklık, kararsızlık, yüzeysellik ve enerjiyi aynı anda birden çok yöne saçma.',
    advice: 'Bilgiyi derinleştirin ve sözlerinizi yapıcı, odaklanmış bir amaca yönlendirin.'
  },
  'Yengeç': {
    shadow: 'Aşırı alınganlık, geçmiş travmalara hapsolma ve sevdiklerini boğucu şekilde sahiplenme.',
    advice: 'Şefkatinizi başkalarına cömertçe sunarken kendinizi ihmal etmeyin; sağlıklı duygusal sınırlar çizin.'
  },
  'Aslan': {
    shadow: 'Ego çatışmaları, sürekli ilgi/alkış bekleme ve gururuna yenik düşerek yalnızlaşma.',
    advice: 'Kalbinizin sıcaklığını karşılıksız sunun; gerçek liderlik başkalarına da parlama alanı açmaktır.'
  },
  'Başak': {
    shadow: 'Aşırı eleştiri, kusursuzluk takıntısı, evham ve kendini sürekli yetersiz hissetme.',
    advice: 'Kusurların içindeki ilahi ahengi görün; hem kendinize hem çevrenize karşı hoşgörülü ve şefkatli olun.'
  },
  'Terazi': {
    shadow: 'Huzur kaçmasın diye "hayır" diyememe, kararsızlık ve onay bağımlılığı.',
    advice: 'Başkalarıyla dengeli bağlar kurarken kendi hakikatinizden ve kişisel sınırlarınızdan ödün vermeyin.'
  },
  'Akrep': {
    shadow: 'Aşırı şüphecilik, intikam, kontrol takıntısı ve bilinçdışı kriz üretme eğilimi.',
    advice: 'Eski yaraları affedin ve serbest bırakın; gerçek güç kontrol etmekte değil, teslimiyetle yenilenmektedir.'
  },
  'Yay': {
    shadow: 'Fanatizm, kibirli bir bilmişlik, sınırları görmezden gelme ve sorumluluktan kaçma.',
    advice: 'Hakikat arayışınızı tevazu ile harmanlayın; başladığınız yolları sabırla ve sorumlulukla tamamlayın.'
  },
  'Oğlak': {
    shadow: 'Duygusal katılık, aşırı görev odaklılık, başarısızlık korkusu ve kariyere esir olma.',
    advice: 'Zirveye tırmanırken kalbinizin sesini dinlemeyi ve sevdiklerinize şefkatle vakit ayırmayı unutmayın.'
  },
  'Kova': {
    shadow: 'Duygusal mesafelilik, aşırı marjinallik, fildişi kule kibri ve aidiyetsizlik hissi.',
    advice: 'Evrensel fikirlerinizi sadece teoride bırakmayın; birebir kurduğunuz samimi ilişkilere de sevgiyle yansıtın.'
  },
  'Balık': {
    shadow: 'Sınır çizememe, kurban psikolojisi, gerçeklerden kaçış ve sorumlulukları erteleme.',
    advice: 'İlahi teslimiyetinizi dünyevi sorumluluklarla birleştirin; sezgilerinizle göklerde uçarken ayaklarınızı yere sağlam basın.'
  }
};

const HOUSE_PRACTICAL: Record<number, string> = {
  1: 'Bireysel kimliğinizin, bedeninizin, dış dünyaya verdiğiniz ilk enerjinin ve özgüveninizin',
  2: 'Maddi kaynaklarınızın, özdeğer duygunuzun, yeteneklerinizin ve somut güvenlik alanınızın',
  3: 'Zihinsel düşünce tarzınızın, iletişim biçiminizin, kardeşler ve yakın çevre ilişkilerinizin',
  4: 'İçsel sığınağınızın, aile köklerinizin, bilinçaltı güven ihtiyacınızın ve ev yaşamınızın',
  5: 'Yaratıcılığınızın, aşk hayatınızın, çocuksu neşenizin ve kendinizi sahneleme biçiminizin',
  6: 'Günlük çalışma düzeninizin, bedensel sağlığınızın, alışkanlıklarınızın ve hizmet alanınızın',
  7: 'İkili ilişkilerinizin, evliliğinizin, ortaklıklarınızın ve karşılıklı aynalama alanınızın',
  8: 'Ortak paylaşılan kaynakların, derin dönüşümlerinizin, krizlerinizin ve ruhsal şifa kapınızın',
  9: 'Yüksek inançlarınızın, felsefi gelişiminizin, akademik arayışlarınızın ve dünya vizyonunuzun',
  10: 'Kariyer zirvenizin, toplumsal statünüzün, saygınlığınızın ve dünyaya bıraktığınız mirasın',
  11: 'Gelecek hedeflerinizin, dostluklarınızın, kolektif ideallerinizin ve sosyal çevrenizin',
  12: 'Bilinçaltı dünyanızın, gizli potansiyellerinizin, ruhsal arınma ve teslimiyet alanınızın'
};

export function getEsotericPlanetInterpretation(planetName: string, signName: ZodiacSign, houseNum: number, isDraconic: boolean = false, isHarmonic: boolean = false, isHeliocentric: boolean = false, isRetrograde: boolean = false): { title: string, content: string } {
  const planet = KABBALAH_PLANETS[planetName] || KABBALAH_PLANETS[planetName.replace(' ', '')];
  const sign = KABBALAH_SIGNS[signName];
  const house = KABBALAH_HOUSES[houseNum];

  if (!planet || !sign || !house) return { title: 'Bilinmeyen Yerleşim', content: 'Bu kozmik sembol için ezoterik bir çözümleme bulunamadı.' };

  const PLANET_DOMAINS: Record<string, string> = {
    'Güneş': 'İlahi özünüzü ve yaratıcılığınızı',
    'Ay': 'Duygusal tepkilerinizi ve karmik hafızanızı',
    'Merkür': 'Zihinsel enerjinizi ve iletişim dilinizi',
    'Venüs': 'Sevgi frekansınızı ve uyum arayışınızı',
    'Mars': 'Yaşam enerjinizi ve savaşçı iradenizi',
    'Jüpiter': 'Ruhsal büyüme kapasitenizi ve bilgeliğinizi',
    'Satürn': 'Karmik sorumluluklarınızı ve sınırlarınızı',
    'Uranüs': 'Uyanış potansiyelinizi ve isyankar dehanızı',
    'Neptün': 'Mistik teslimiyetinizi ve psişik algınızı',
    'Plüton': 'Dönüştürücü gücünüzü ve gölge simyanızı',
    'Kiron': 'Ruhsal yaranızı ve en derin şifacılık yeteneğinizi',
    'Dünya': 'Kozmik topraklanma merkezinizi',
    'Kuzey Ay Düğümü': 'Ruhsal tekamül rotanızı',
    'Yükselen (ASC)': 'Biyolojik avatarınızın yaşam gücünü',
    'Tepe Noktası (MC)': 'Kadersel magnum opus (başyapıt) hedefinizi',
    'Vertex (Vx)': 'Kadersel eşzamanlılık kapılarınızı',
    'Şans Noktası (POF)': 'İlahi lütuf ve altın oranınızı',
    'Lilith': 'Bastırılmış gölge gücünüzü ve vahşi bilgeliğinizi'
  };

  const RETROGRADE_MEANINGS: Record<string, string> = {
    'Merkür': 'Geçmiş yaşamlarda iletişim gücünüzü manipülasyon için kullanmış veya sesinizi duyuramayıp haksızlığa uğramış olabilirsiniz. Bu hayattaki Tikkun dersiniz; sözcüklerin karmik ağırlığını fark etmek, kendi içsel gerçeğinizi bulmak ve iletişimde mutlak dürüstlüğü sağlamaktır.',
    'Venüs': 'Geçmiş yaşamlarda aşkı, özdeğeri veya maddi gücü yanlış değerlendirmiş; ilişkilerde aşırı bağımlı ya da bencil davranmış olabilirsiniz. Bu hayattaki Tikkun dersiniz; sevgiyi dışarıda aramak yerine önce kendi içsel özdeğerinizi (kalp merkezini) şifalandırmaktır.',
    'Mars': 'Geçmiş yaşamlarda öfkenizi ve gücünüzü yıkıcı bir şekilde kullanmış veya tam tersi kurban rolüne düşmüş olabilirsiniz. Bu hayattaki Tikkun dersiniz; öfkeyi bastırmak veya savurmak yerine, bu ateşi yapıcı bir ruhsal savaşçı iradesine dönüştürmektir.',
    'Jüpiter': 'Geçmiş yaşamlarda felsefi veya ilahi inanç sistemlerini kendi çıkarınıza kullanmış, sahte bir gururla kibre kapılmış olabilirsiniz. Bu hayattaki Tikkun dersiniz; körü körüne fanatizmden uzaklaşıp, gerçek bilgeliği ve içsel inancı tevazu ile yeniden keşfetmektir.',
    'Satürn': 'Geçmiş yaşamlarda sorumluluklardan kaçmış veya başkaları üzerinde aşırı sert bir baskı kurmuş olabilirsiniz. Bu hayattaki Tikkun dersiniz; kadersel sınırları dışarıdan beklemek yerine, kendi içsel disiplininizi ve olgun sorumluluğunuzu inşa etmektir.',
    'Uranüs': 'Geçmiş yaşamlarda isyan ve özgürlük uğruna aşırı kaosa sebep olmuş veya kolektiften dışlanmış olabilirsiniz. Bu hayattaki Tikkun dersiniz; sıra dışı vizyonunuzu sadece yıkmak için değil, insanlığın evrimine hizmet edecek yapıcı yenilikler için kullanmaktır.',
    'Neptün': 'Geçmiş yaşamlarda gerçeklikten kaçmak için illüzyonlara sığınmış veya sahte kurban/kurtarıcı rollerine girmiş olabilirsiniz. Bu hayattaki Tikkun dersiniz; ruhsal fanteziler ile ilahi hakikati birbirinden ayırmak ve evrensel sevgiye bilinçli olarak topraklanmaktır.',
    'Plüton': 'Geçmiş yaşamlarda gücü manipülatif bir şekilde kullanmış veya büyük bir yıkımın kurbanı olmuş olabilirsiniz. Bu hayattaki Tikkun dersiniz; kontrol takıntısını bırakmak, ruhsal gücünüzü şifa için kullanmak ve küllerinden yeniden doğma simyasına teslim olmaktır.',
    'Kiron': 'Geçmiş yaşamlarda başkalarını iyileştirirken kendi yaralarınızı göz ardı etmiş veya derin bir reddedilme travması yaşamış olabilirsiniz. Bu hayattaki Tikkun dersiniz; en derin yaranızın aslında en büyük şifa kaynağınız olduğunu kabul edip, önce kendinize şefkat göstermektir.',
    'Kuzey Ay Düğümü': 'Kuzey Ay Düğümü kadersel pusulanızın geçmiş karmaları temizlemeye kilitlendiğini gösterir. Bu hayattaki Tikkun dersiniz; Güney Düğümün konfor alanından vazgeçip, ruhunuzun asıl gitmesi gereken cesur evrim rotasına girmektir.',
    'Güneş': 'Bu yerleşim çok özel bir ego tikkununu, ruhun geçmişte sahnede kibrini fazla parlatmasını ve bu hayatta gerçek ilahi tevazuyu öğrenmesini ifade eder.',
    'Ay': 'Bu yerleşim geçmiş karmalardan gelen derin bir kök/aidiyet blokajını ve duygusal sığınağı kendi içinde bulma zorunluluğunu ifade eder.'
  };

  let titleSuffix = '';
  let layerKey: 'atzilut' | 'beriyah' | 'yetzirah' | 'assiah' = 'assiah';
  let worldNameTitle = 'Assiah (Madde ve Eylem Alemi)';
  let worldSynthesisDesc = 'Bu yerleşim, ruhsal potansiyelinizi gündelik hayatta somut bir başarıya, disipline ve fiziksel üretim gücüne dönüştürme alanınızdır.';

  if (isHeliocentric) {
    layerKey = 'atzilut';
    titleSuffix = ' (Atzilut - Kudret Alemi)';
    worldNameTitle = 'Atzilut (İlahi Kudret Alemi)';
    worldSynthesisDesc = 'Bu yerleşim en yüksek ruhsal boyuttadır; burada ego illüzyonları çözülür, ruh doğrudan ilahi irade ve saf birlik bilinciyle hizalanır.';
  } else if (isHarmonic) {
    layerKey = 'beriyah';
    titleSuffix = ' (Beriyah - Zihin Alemi)';
    worldNameTitle = 'Beriyah (Yüksek Zihin Alemi)';
    worldSynthesisDesc = 'Bu yerleşim yüksek zihninizin evrensel ilkelerle nasıl çalıştığını gösterir; düşünceleriniz ve inançlarınızla hayatınızı makro ölçekte programlarsınız.';
  } else if (isDraconic) {
    layerKey = 'yetzirah';
    titleSuffix = ' (Yetzirah - Duygu Alemi)';
    worldNameTitle = 'Yetzirah (Duygu ve Hisler Alemi)';
    worldSynthesisDesc = 'Bu yerleşim geçmiş yaşam karmalarınızdan getirdiğiniz duygusal kalıpları ve hücresel hafızanızı şifalandırma alanınızı işaret eder.';
  } else {
    layerKey = 'assiah';
    titleSuffix = ' (Assiah - Madde Alemi)';
  }

  const pDomain = PLANET_DOMAINS[planetName] || 'Kozmik enerjinizi';

  const pPractical = PLANET_PRACTICAL[planetName] || PLANET_PRACTICAL[planetName.replace(' ', '')] || {
    power: 'İçsel potansiyelinizi ve farkındalığınızı ortaya koyma gücü.',
    key: 'Bu enerjiyi bilinçli bir niyetle ve dengeyle yaşamınıza dahil edin.'
  };

  const sPractical = SIGN_PRACTICAL[signName] || {
    shadow: 'Dengesiz tepkiler ve aşırılıklar.',
    advice: 'İçsel dengenizi koruyarak hareket edin.'
  };

  const hPractical = HOUSE_PRACTICAL[houseNum] || 'Yaşam yolculuğunuzun bu özel alanının';

  let retroSynthesis = '';
  if (isRetrograde) {
    const specificTikkun = RETROGRADE_MEANINGS[planetName] || `Geçmiş yaşamlarda bu gezegenin frekansını aşırı veya eksik kullanmış olabilirsiniz. Bu hayattaki Tikkun dersiniz; dışsal engellerle karşılaştığınızda çözümü dışarıda değil, içsel ruhsal dengenizde aramaktır.`;
    retroSynthesis = `\n\n🔄 **KARMİK DÜZELTME (TİKKUN: Retrograde - Rx)**\n**${planetName} (Rx) Ruhsal Sınavı:** ${specificTikkun}`;
  }

  const title = `${planetName} - ${signName} Burcunda ve ${houseNum}. Evde${titleSuffix}`;
  
  const planetContent = planet[layerKey] || planet.assiah;
  const signContent = sign[layerKey] || sign.assiah;

  const content = `**[KOZMİK SEMBOLİZM: ${planetName}]**
${planetContent}

**✨ Ruhsal Güç & Potansiyel:** ${pPractical.power}

**[BURÇ REZONANSI: ${signName}]**
${signContent}

**⚠️ Gölge Yan & Sınav:** ${sPractical.shadow}

**[YAŞAM ALANI (EV): ${houseNum}. Ev]**
${house.esoteric}

**🎯 Yaşamsal Sahne:** ${hPractical} merkezidir.

**[${worldNameTitle.toUpperCase()} SENTEZİ & TEKÂMÜL REHBERİ]**
Bu yerleşim; haritanızda **${pDomain}**, ${signName} burcunun nitelikleriyle buluşturarak ${hPractical.toLowerCase()} doğrudan merkezine taşır. ${worldSynthesisDesc}

**🔑 Tekâmül Anahtarı:** ${pPractical.key} ${sPractical.advice}${retroSynthesis}`;

  return { title, content };
}
