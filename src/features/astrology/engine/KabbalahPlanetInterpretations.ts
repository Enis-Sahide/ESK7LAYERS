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
    'Şans Noktası (POF)': 'İlahi lütuf ve altın oranınızı'
  };

  const SIGN_METHODS: Record<string, string> = {
    'Koç': 'cesaretle, ateşli bir dürtüyle ve öncü bir iradeyle',
    'Boğa': 'somutlaştırarak, sabırla ve köklenerek',
    'İkizler': 'ikilikleri birleştirerek, zihinsel bir merakla ve esneklikle',
    'Yengeç': 'şefkatle, koruyucu bir içgüdüyle ve sezgilerle',
    'Aslan': 'sahneye çıkarak, parlayarak ve kalpten bir otoriteyle',
    'Başak': 'analiz ederek, saflaştırarak ve hizmet bilinciyle',
    'Terazi': 'dengeleyerek, uyum yaratarak ve ötekinin aynasından bakarak',
    'Akrep': 'derinleşerek, krizleri dönüştürerek ve küllerinden doğarak',
    'Yay': 'sınırları aşarak, felsefi bir inançla ve hakikati arayarak',
    'Oğlak': 'disiplinle, zamanı yöneterek ve büyük bir sabırla',
    'Kova': 'sıra dışı bir vizyonla, matrisi kırarak ve kolektife hizalanarak',
    'Balık': 'teslimiyetle, sınırları eriterek ve evrensel bir sevgiyle'
  };

  const HOUSE_ARENAS: Record<number, string> = {
    1: 'kendi kimliğinizin ve bedeninizin vitrinine',
    2: 'maddi kaynaklarınızın ve özdeğerinizin alanına',
    3: 'yakın çevrenizin ve zihinsel iletişim laboratuvarınızın içine',
    4: 'köklerinizin, atalarınızın ve içsel sığınağınızın temeline',
    5: 'ilahi yaratıcılığınızın, aşkın ve çocuksu neşenin sahnesine',
    6: 'karmik borç ödeme, günlük ritüeller ve arınma ocağınıza',
    7: 'ilişkilerinizin, kontratlarınızın ve aynalama kapınızın merkezine',
    8: 'okült sırların, krizlerin ve simyasal dönüşümün karanlık tüneline',
    9: 'yüksek inançlarınızın, felsefenizin ve makrokozmik arayışınızın ufkuna',
    10: 'toplumsal otoritenizin ve kadersel başyapıtınızın zirvesine',
    11: 'kolektif vizyonunuzun ve yıldız tohumları meclisinizin ortasına',
    12: 'bilinçaltınızın, gizli korkularınızın ve mistik çözülme okyanusunuzun derinliklerine'
  };

  const RETROGRADE_MEANINGS: Record<string, string> = {
    'Merkür': 'Geçmiş yaşamlarda iletişim gücünüzü manipülasyon için kullanmış veya sesinizi duyuramayıp haksızlığa uğramış olabilirsiniz. Bu hayattaki Tikkun dersiniz; sözcüklerin karmik ağırlığını fark etmek, kendi içsel gerçeğinizi bulmak ve iletişimde mutlak dürüstlüğü sağlamaktır.',
    'Venüs': 'Geçmiş yaşamlarda aşkı, özdeğeri veya maddi gücü yanlış değerlendirmiş; ilişkilerde aşırı bağımlı ya da tamamen bencil davranmış olabilirsiniz. Bu hayattaki Tikkun dersiniz; sevgiyi dışarıda (başkalarında) aramak yerine önce kendi içsel özdeğerinizi (kalp çakranızı) şifalandırmaktır.',
    'Mars': 'Geçmiş yaşamlarda öfkenizi, savaşçı iradenizi ve fiziksel gücünüzü yıkıcı bir şekilde (belki de bir otorite olarak) başkaları üzerinde kullanmış veya tam tersi kurban rolüne düşmüş olabilirsiniz. Bu hayattaki Tikkun dersiniz; öfkeyi bastırmak veya patlatmak yerine, bu ateşi ruhsal bir savaşçı iradesine (disipline) dönüştürmektir.',
    'Jüpiter': 'Geçmiş yaşamlarda dini, felsefi veya ilahi inanç sistemlerini kendi çıkarınıza kullanmış, sahte bir gururla kibre kapılmış olabilirsiniz. Bu hayattaki Tikkun dersiniz; körü körüne fanatizmden uzaklaşıp, gerçek bilgeliği ve içsel inancı (Tevazu ile) yeniden keşfetmektir.',
    'Satürn': 'Geçmiş yaşamlarda otorite, sorumluluk ve disiplin konulardan kaçmış veya başkaları üzerinde çok sert bir tiranlık kurmuş olabilirsiniz. Bu hayattaki Tikkun dersiniz; karmik otoriteyi ve sınırları dışarıdan (baba/devlet) beklemek yerine, kendi içsel disiplininizi ve kadersel sorumluluğunuzu inşa etmektir.',
    'Uranüs': 'Geçmiş yaşamlarda isyan, devrim ve özgürlük uğruna çok fazla kaosa sebep olmuş veya kolektiften dışlanmış olabilirsiniz. Bu hayattaki Tikkun dersiniz; sıra dışı vizyonunuzu sadece yıkmak için değil, insanlığın evrimine hizmet edecek yapıcı bir köprü (yenilik) olarak kullanmaktır.',
    'Neptün': 'Geçmiş yaşamlarda gerçeklikten kaçmak için illüzyonlara, bağımlılıklara sığınmış veya sahte kurban/kurtarıcı rollerine girmiş olabilirsiniz. Bu hayattaki Tikkun dersiniz; ruhsal fanteziler ile ilahi hakikati birbirinden ayırmak ve evrensel sevgiye (bilinçli olarak) topraklanmaktır.',
    'Plüton': 'Geçmiş yaşamlarda gücü manipülatif ve yıkıcı bir şekilde kullanmış veya büyük bir yıkımın kurbanı olmuş olabilirsiniz. Bu hayattaki Tikkun dersiniz; kontrol takıntısını bırakmak, ruhsal gücünüzü şifa için kullanmak ve "küllerinden yeniden doğma" simyasına teslim olmaktır.',
    'Kiron': 'Geçmiş yaşamlarda başkalarını iyileştirirken kendi yaralarınızı göz ardı etmiş veya derin bir reddedilme travması yaşamış olabilirsiniz. Bu hayattaki Tikkun dersiniz; en derin yaranızın aslında en büyük şifa kaynağınız (Yaralı Şifacı) olduğunu kabul edip, önce kendinize şefkat göstermektir.',
    'Kuzey Ay Düğümü': 'Kuzey Ay Düğümü doğası gereği çoğunlukla Retro harekettedir, ancak bu durum kadersel pusulanızın tamamen "geçmiş karmaları temizlemeye" kilitlendiğini gösterir. Bu hayattaki Tikkun dersiniz; Güney Düğümün konfor alanından (eski yeteneklerden) vazgeçip, ruhunuzun asıl gitmesi gereken cesur evrim rotasına girmektir.',
    'Güneş': 'Güneş fiziksel olarak Retro yapmaz. Ancak sistemimizde böyle algılanmışsa; bu çok nadir bir ego tikkununu, ruhun geçmişte sahnede kibrini fazla parlatmasını ve bu hayatta gerçek ilahi tevazuyu öğrenmesini ifade eder.',
    'Ay': 'Ay fiziksel olarak Retro yapmaz. Ancak sistemimizde böyle algılanmışsa; geçmiş karmadan gelen çok ağır bir anne/kök blokajını ve duygusal sığınağı içte bulma zorunluluğunu ifade eder.'
  };

  let titleSuffix = '';
  let worldConclusion = '';
  let layerKey: 'atzilut' | 'beriyah' | 'yetzirah' | 'assiah' = 'assiah';

  if (isHeliocentric) {
    layerKey = 'atzilut';
    titleSuffix = ' (Atzilut - Kudret Alemi)';
    worldConclusion = `Bu yerleşim Atzilut aleminde gerçekleştiği için; burada ego veya karmik illüzyonlar yoktur. Bu okuma, sizin evrensel bilinci (İlahi İradeyi) yeryüzüne nasıl indireceğinizin ve matrixin tamamen dışına nasıl çıkacağınızın en saf formülüdür.`;
  } else if (isHarmonic) {
    layerKey = 'beriyah';
    titleSuffix = ' (Beriyah - Zihin Alemi)';
    worldConclusion = `Bu yerleşim Beriyah aleminde gerçekleştiği için; yüksek beyninizin (üst zihninizin) evrensel yasaları nasıl okuduğunu gösterir. Melekler boyutundaki düşünce formlarınız bu kombinasyonla çalışarak hayatınızı makro ölçekte programlar.`;
  } else if (isDraconic) {
    layerKey = 'yetzirah';
    titleSuffix = ' (Yetzirah - Duygu Alemi)';
    worldConclusion = `Bu yerleşim Yetzirah aleminde gerçekleştiği için; doğrudan geçmiş yaşamlarınızdan gelen karmik kontratlarınızı gösterir. Duygu dünyanızda ve bilinçdışı tepkilerinizde şifalandırmanız gereken hücresel hafıza tortuları bu alanda gizlidir.`;
  } else {
    layerKey = 'assiah';
    titleSuffix = ' (Assiah - Madde Alemi)';
    const isBenefic = ['Jüpiter', 'Venüs', 'Güneş', 'Şans Noktası (POF)'].includes(planetName);
    const isMalefic = ['Satürn', 'Mars', 'Plüton', 'Kuzey Ay Düğümü'].includes(planetName);
    
    if (isBenefic) {
      worldConclusion = `Bu yerleşim Assiah aleminde gerçekleştiği için; madde dünyasında karşılaşacağınız ilahi lütufları, fiziksel dünyadaki şansınızı ve bu 3 boyutlu bedende yaratım (tezahür) gücünüzü ne kadar rahat kullanabileceğinizi ifade eder.`;
    } else if (isMalefic) {
      worldConclusion = `Bu yerleşim Assiah aleminde gerçekleştiği için; ruhunuzun fiziksel formda geçtiği en ağır illüzyon testlerini işaret eder. Madde dünyasında karşılaşacağınız somut engeller, disipline etmeniz gereken gölgeler ve bu bedende aşmanız gereken fiziksel sınırları ifade eder.`;
    } else {
      worldConclusion = `Bu yerleşim Assiah aleminde gerçekleştiği için; ruhun fiziksel formda deneyimlediği sahneyi işaret eder. Evrensel frekansları madde dünyasında nasıl somutlaştıracağınızı ve 3 boyutlu yaşamınızda (dünyevi illüzyonlar içinde) bu enerjiyi nasıl yönlendireceğinizi ifade eder.`;
    }
  }

  const pDomain = PLANET_DOMAINS[planetName] || 'Kozmik enerjinizi';
  const sMethod = SIGN_METHODS[signName] || 'kendi doğasıyla';
  const hArena = HOUSE_ARENAS[houseNum] || 'bu yaşam sahnesine';

  const synthesis = `Sizin haritanızda bu özel yerleşim; **${pDomain}**, ${signName} frekansı üzerinden **${sMethod}** aktive ederek, ${houseNum}. evin temsil ettiği **${hArena}** indiriyor.\n\n${worldConclusion}`;

  let retroSynthesis = '';
  if (isRetrograde) {
    const specificTikkun = RETROGRADE_MEANINGS[planetName] || `Geçmiş yaşamlarda bu gezegenin frekansını (temsil ettiği konularda) aşırı veya eksik kullanmış olabilirsiniz. Bu hayattaki Tikkun dersiniz; dışsal blokajlarla karşılaştığınızda çözümü dışarıda değil, içsel ruhsal simyanızda aramaktır.`;
    retroSynthesis = `\n\n[KARMİK DÜZELTME (TİKKUN): Retrograde (Rx)]\n**${planetName} gezegeninin Retro (Rx) olması:** ${specificTikkun}`;
  }

  const title = `${planetName} - ${signName} Burcunda ve ${houseNum}. Evde${titleSuffix}`;
  
  const planetContent = planet[layerKey] || planet.assiah;
  const signContent = sign[layerKey] || sign.assiah;

  const content = `[KOZMİK SEMBOLİZM: ${planetName}]
${planetContent}

[BURÇ REZONANSI: ${signName}]
${signContent}

[YAŞAM ALANI (EV): ${houseNum}. Ev]
${house.esoteric}

[${titleSuffix.replace(' (', '').replace(')', '')} SENTEZİ]
${synthesis}${retroSynthesis}`;

  return { title, content };
}
