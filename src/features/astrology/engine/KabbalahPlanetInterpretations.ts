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
  1: { esoteric: 'Malkut\'un birinci kapısı. Bireysel varoluşun dünyada kendini "Ben" olarak ortaya koyduğu, beden ve çevreyle ilk temas alanı.' },
  2: { esoteric: 'Ruhsal özdeğerin ve madde boyutundaki (Assiah) üretim gücünün somutlaştığı, yaşam kaynaklarının yapılandığı güven alanı.' },
  3: { esoteric: 'Thoth\'un zihin kanalı. İletişim, yakın çevre etkileşimleri ve bilginin alt ve üst boyutlar arasında köprü kurduğu idrak alanı.' },
  4: { esoteric: 'İçsel sığınak ve kökler. Atalardan gelen ruhsal mirasın kucaklandığı, güven ve aidiyet temelinin atıldığı yuva.' },
  5: { esoteric: 'İlahi yaratıcılığın ve saf neşenin alanı. Kalbin cömertçe parladığı, sanatsal ilhamın ve özgün ifadenin çiçek açtığı alan.' },
  6: { esoteric: 'Arınma, denge ve özverili hizmet alanı. Beden, zihin ve ruh dengesinin kurulduğu, günlük ritimlerle yaşamın sadeleştirilip şifalandığı alan.' },
  7: { esoteric: 'Aynalama ve ortaklık kapısı. Yaşam yolculuğumuza katılan yol arkadaşları üzerinden kendimizi tanıma, denge ve uyum geliştirme terazisi.' },
  8: { esoteric: 'Dönüşüm simyası ve müşterek kaynakların bilgeliği alanı. Eski kalıpları serbest bırakıp yenilenerek küllerinden doğma ve derin ruhsal farkındalık kazanma kapısı.' },
  9: { esoteric: 'Yüksek zihnin (Beriyah) kapısı. Evrensel yasaların, felsefi açılımların ve uzak ufukların keşfedildiği makrokozmik arayış alanı.' },
  10: { esoteric: 'Kariyer ve toplumsal katkı zirvesi. Ruhun kolektif yaşam içerisindeki saygınlığı ve dünyaya armağan edeceği kalıcı eserlerin tezahür alanı.' },
  11: { esoteric: 'Kolektif vizyon meclisi. Evrensel kardeşlik, vizyoner idealler ve bütüne fayda sağlayan toplumsal projelerin paylaşıldığı alan.' },
  12: { esoteric: 'Evrensel birlik, içsel sükûnet ve ilahi teslimiyet alanı. Geçmiş tortuları şefkatle serbest bırakarak saf sezgiye, derin şifaya ve ruhsal dinginliğe kavuşma kapısı.' }
};

interface PlanetPracticalInfo {
  power: string;
  key: string;
}

const PLANET_PRACTICAL: Record<string, PlanetPracticalInfo> = {
  'Güneş': {
    power: 'Özgün kimliğinizi, yaratıcı liderliğinizi ve içsel ışığınızı dünyada güvenle ortaya koyma gücü.',
    key: 'Işığınızı başkalarını gölgede bırakmak için değil; onların da kendi potansiyelini keşfetmesine ilham olmak ve yolu aydınlatmak için sunabilirsiniz.'
  },
  'Ay': {
    power: 'Derin sezgiler, duygusal empati, şefkat ve etrafınızdaki görünmez enerjileri hissetme yeteneği.',
    key: 'Duygularınızı bastırmadan; hislerinizin bilge ve sükûnet dolu bir gözlemcisi olarak içsel rehberliğinize güvenebilirsiniz.'
  },
  'Merkür': {
    power: 'Hızlı kavrama, keskin analiz gücü, etkileyici ifade yeteneği ve zihinsel köprüler kurma ustalığı.',
    key: 'Zihninizi hakikati sadeleştiren ve insanları sevgiyle birleştiren yapıcı sözler üretmek için değerlendirebilirsiniz.'
  },
  'Venüs': {
    power: 'Kozmik çekim gücü, estetik vizyon, ilişkilerde zarafet yaratma ve maddi/manevi bereketi çekme.',
    key: 'Özdeğerinizi kendi içsel bütünlüğünüzde keşfedebilir; sevginizi beklentisizce ve cömertçe paylaşabilirsiniz.'
  },
  'Mars': {
    power: 'Yüksek eylem gücü, öncülük cesareti, engelleri aşan savaşçı irade ve kararlılık.',
    key: 'Eylem gücünüzü hedeflerinize odaklanan yapıcı, adil ve kararlı bir disiplinle ortaya koyabilirsiniz.'
  },
  'Jüpiter': {
    power: 'Evrensel vizyon, sarsılmaz inanç, yüksek bilgelik, cömertlik ve yaşam fırsatlarını çoğaltma gücü.',
    key: 'Bilginizi tevazu ile büyüterek öğrendiklerinizi başkalarının yolunu aydınlatmak için cömertçe paylaşabilirsiniz.'
  },
  'Satürn': {
    power: 'Sarsılmaz sabır, sağlam temeller inşa etme ustalığı, krizleri olgunlukla karşılama ve zamanın efendisi olma.',
    key: 'Zamanın getirdiği deneyimleri ruhunuzu elmas gibi işleyen, size kalıcı olgunluk kazandıran kutsal büyüme fırsatları olarak görebilirsiniz.'
  },
  'Uranüs': {
    power: 'Deha kıvılcımları, kalıpları kıran özgünlük, geleceği öngörme ve toplumsal uyanışa öncülük etme.',
    key: 'Sıra dışı vizyonunuzu insanlığa fayda sağlayan yeni, özgürleştirici ve ilham dolu sistemler kurmak için kullanabilirsiniz.'
  },
  'Neptün': {
    power: 'Kozmik sezgiler, sanatsal ve ruhsal ilham, koşulsuz sevgi ve ilahi akışa güvenle teslimiyet.',
    key: 'Mistik ve sezgisel algılarınızı dünyevi sorumluluklarla topraklayarak hayallerinizi gerçeğe dönüştürebilirsiniz.'
  },
  'Plüton': {
    power: 'Dönüşüm simyası, krizlerden küllerinden yeniden doğma, psişik derinlik ve manyetik güç.',
    key: 'Eskiyen parçalarınızı güvenle serbest bıraktığınızda içinizdeki gerçek yenilenme ve arınma gücünü açığa çıkarabilirsiniz.'
  },
  'Kiron': {
    power: 'Kendi deneyimlerinden damıttığı bilgelikle başkalarına şifa olan bilgelik, derin empati ve kapsayıcılık.',
    key: 'Önce kendi içsel hislerinize şefkat göstererek, deneyimlerinizden damıttığınız bilgelikle çevrenize tükenmez bir şifa ışığı saçabilirsiniz.'
  },
  'Kuzey Ay Düğümü': {
    power: 'Ruhun bu enkarnasyondaki pusulası, konfor alanını aşarak yeni erdemler ve yetenekler inşa etme cesareti.',
    key: 'Bilinmeyene doğru cesaretle adım atabilir; geçmişin alışkanlıklarını geride bırakarak ruhsal doyumunuza doğru ilerleyebilirsiniz.'
  },
  'Yükselen (ASC)': {
    power: 'Dünyaya sunulan özgün ışık, güçlü ilk intiba, yaşamsal canlılık ve bireysel varoluş imzası.',
    key: 'İçinizdeki ruhsal hakikati dış dünyadaki duruşunuzla tam bir dürüstlük, zarafet ve özgüvenle hizalayabilirsiniz.'
  },
  'Tepe Noktası (MC)': {
    power: 'Toplumsal başarı, mesleki ustalık, kadersel başyapıt ve dünyaya bırakılacak kalıcı bir miras.',
    key: 'Başarıyı unvandan ziyade ürettiğiniz faydada ve insanların hayatına kattığınız değerde bulabilirsiniz.'
  },
  'Şans Noktası (POF)': {
    power: 'Beden, zihin ve ruh hizalandığında hayatınıza zahmetsizce akan ilahi lütuf, şans ve bereket.',
    key: 'Yeteneklerinizi sevgi ve samimiyetle paylaştığınızda maddi ve manevi bolluğu yaşamınıza doğal bir akışla çekebilirsiniz.'
  },
  'Dünya': {
    power: 'Madde boyutuna sağlam köklenme, pratik bilgelik ve yeryüzünde sürdürülebilir güzellikler üretme.',
    key: 'Gökyüzünün bilgeliğini yeryüzünün bereketiyle birleştirerek sağlam, dengeli ve kalıcı eserler üretebilirsiniz.'
  },
  'Vertex (Vx)': {
    power: 'Kadersel eşzamanlılıklar, hayatınıza giren uyanış vesilesi kilit insanlar ve dönüm noktaları.',
    key: 'Yaşamın karşınıza çıkardığı kadersel eşzamanlılıkların arkasındaki ilahi rehberliği fark edip dönüşümlere gönüllü olabilirsiniz.'
  },
  'Lilith': {
    power: 'Özgün içsel özgürlük, sezgisel derin bilgelik ve sahte kalıpları yıkan dürüstlük.',
    key: 'Bastırılmış gölgelerinizi sevgiyle kucaklayarak yaratıcı, özgün ve özgürleştirici bir güce dönüştürebilirsiniz.'
  }
};

interface SignPracticalInfo {
  shadow: string;
  advice: string;
}

const SIGN_PRACTICAL: Record<string, SignPracticalInfo> = {
  'Koç': {
    shadow: 'Sabırsızlık, fevrilik ve aceleci tepkiler verme eğilimi.',
    advice: 'Cesaretinizi acelecilik yerine bir nefeslik içsel sükûnet ve yapıcı stratejiyle harmanlayabilirsiniz.'
  },
  'Boğa': {
    shadow: 'Değişime direnç, alışkanlıklara aşırı tutunma ve konfor alanında sabitlenme.',
    advice: 'Güveni kendi üretkenliğinizde ve içsel değerinizde bularak yaşamın akışına esneklikle güvenebilirsiniz.'
  },
  'İkizler': {
    shadow: 'Zihinsel dağınıklık, kararsızlık ve enerjiyi birden çok yöne dağıtma.',
    advice: 'Bilgiyi derinleştirerek sözlerinizi yapıcı, odaklanmış ve birleştirici bir amaca yönlendirebilirsiniz.'
  },
  'Yengeç': {
    shadow: 'Aşırı alınganlık, geçmiş anılara hapsolma ve sevdiklerine aşırı korumacı yaklaşım.',
    advice: 'Şefkatinizi başkalarına cömertçe sunarken kendinizi ihmal etmeyip sağlıklı duygusal sınırlar çizebilirsiniz.'
  },
  'Aslan': {
    shadow: 'Onaylanma ihtiyacı, gurur ve ilgi odağında kalma arzusu.',
    advice: 'Kalbinizin sıcaklığını karşılıksız sunarak başkalarına da parlama alanı açan cömert bir liderlik sergileyebilirsiniz.'
  },
  'Başak': {
    shadow: 'Aşırı eleştiri, kusursuzluk kaygısı ve kendini sürekli yetersiz hissetme.',
    advice: 'Kusurların içindeki ilahi ahengi görerek hem kendinize hem çevrenize karşı hoşgörülü ve şefkatli olabilirsiniz.'
  },
  'Terazi': {
    shadow: 'Uyum bozulmasın diye sınır çizememe, kararsızlık ve dış onay arayışı.',
    advice: 'Başkalarıyla dengeli bağlar kurarken kendi hakikatinizden ve kişisel sınırlarınızdan ödün vermeden ilerleyebilirsiniz.'
  },
  'Akrep': {
    shadow: 'Şüphecilik, kontrol etme arzusu ve krizleri büyütme eğilimi.',
    advice: 'Eski tortuları affedip serbest bırakarak teslimiyetin getirdiği yenilenme gücünü deneyimleyebilirsiniz.'
  },
  'Yay': {
    shadow: 'Sabırsızlık, sınırları görmezden gelme ve sorumluluklardan uzaklaşma.',
    advice: 'Hakikat arayışınızı tevazu ile harmanlayıp başladığınız yolları sabır ve sorumlulukla tamamlayabilirsiniz.'
  },
  'Oğlak': {
    shadow: 'Duygusal mesafelilik, aşırı iş odaklılık ve başarısızlık endişesi.',
    advice: 'Hedeflerinize yürürken kalbinizin sesini dinlemeyi ve sevdiklerinize şefkatle vakit ayırmayı önceliklendirebilirsiniz.'
  },
  'Kova': {
    shadow: 'Duygusal kopukluk, aşırı soyutlanma ve aidiyetsizlik hissi.',
    advice: 'Evrensel fikirlerinizi birebir kurduğunuz samimi ilişkilere de sevgi ve anlayışla yansıtabilirsiniz.'
  },
  'Balık': {
    shadow: 'Sınır çizmede zorlanma, gerçeklerden kaçış ve belirsizliğe kapılma.',
    advice: 'İlahi teslimiyetinizi dünyevi sorumluluklarla birleştirerek sezgilerinizin rehberliğinde ayaklarınızı yere sağlam basabilirsiniz.'
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
    'Merkür': 'Bu yerleşimdeki Tikkun armağanınız; sözcüklerin ve düşüncelerin derin anlamını fark etmek, kendi içsel hakikatinizi keşfetmek ve iletişimde mutlak samimiyeti ve berraklığı yaşamınıza yansıtmaktır.',
    'Venüs': 'Bu yerleşimdeki Tikkun armağanınız; sevgiyi dış koşullara bağlamadan önce kendi içsel özdeğerinizi ve kalp merkezinizi şefkatle kucaklamak, koşulsuz sevginin huzurunu deneyimlemektir.',
    'Mars': 'Bu yerleşimdeki Tikkun armağanınız; eylem ve irade ateşinizi dışsal çatışmalar yerine, yapıcı ve kararlı bir ruhsal bilgelikle hedeflerinize yönlendirmektir.',
    'Jüpiter': 'Bu yerleşimdeki Tikkun armağanınız; dış dogmalardan bağımsızlaşarak, gerçek bilgeliği ve içsel inancı derin bir tevazu ve açık bir kalple keşfetmektir.',
    'Satürn': 'Bu yerleşimdeki Tikkun armağanınız; kadersel sınırları dışarıdan beklemek yerine, kendi içsel disiplininizi, sabrınızı ve vakur olgunluğunuzu sağlam temeller üzerine inşa etmektir.',
    'Uranüs': 'Bu yerleşimdeki Tikkun armağanınız; sıra dışı vizyonunuzu insanlığın uyanışına ve kolektif iyiliğe hizmet edecek yapıcı, özgürleştirici yeniliklere dönüştürmektir.',
    'Neptün': 'Bu yerleşimdeki Tikkun armağanınız; hayaller ile ilahi hakikati dengeli bir şekilde harmanlayarak, evrensel sevgiye ve saf sezgiye güvenle topraklanmaktır.',
    'Plüton': 'Bu yerleşimdeki Tikkun armağanınız; kontrol takıntısını bırakıp içsel dönüşümün şifasına güvenmek ve küllerinden yeniden doğmanın getirdiği arınmış gücü keşfetmektir.',
    'Kiron': 'Bu yerleşimdeki Tikkun armağanınız; en derin hassasiyetinizin aslında en büyük şifa ve empati kaynağınız olduğunu fark ederek önce kendinize, ardından tüm çevrenize şefkatle yaklaşmaktır.',
    'Kuzey Ay Düğümü': 'Kadersel pusulanız; tanıdık alışkanlıkların ötesine geçerek ruhunuzun cesur, doyum dolu ve ilham verici evrim rotasına güvenle adım atmanızı destekler.',
    'Güneş': 'Bu yerleşim, ruhun kendi içsel ışığını tevazu ve cömertlikle parlatıp, gerçek ilahi özgüveni keşfetme yolculuğunu ifade eder.',
    'Ay': 'Bu yerleşim, duygusal sığınağı ve güveni kendi iç dünyasında inşa ederek, derin sezgilerini bilge bir sükûnetle yaşama potansiyelini ifade eder.'
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
    key: 'Bu enerjiyi bilinçli bir niyetle ve dengeyle yaşamınıza dahil edebilirsiniz.'
  };

  const sPractical = SIGN_PRACTICAL[signName] || {
    shadow: 'Dengesiz tepkiler ve aşırılıklar.',
    advice: 'İçsel dengenizi koruyarak hareket edebilirsiniz.'
  };

  const hPractical = HOUSE_PRACTICAL[houseNum] || 'Yaşam yolculuğunuzun bu özel alanının';

  let retroSynthesis = '';
  if (isRetrograde) {
    const specificTikkun = RETROGRADE_MEANINGS[planetName] || `Bu yerleşimdeki Tikkun armağanınız; dışsal engellerle karşılaştığınızda çözümü dışarıda değil, kendi içsel dengenizde ve öz bilgeliğinizde bulmaktır.`;
    retroSynthesis = `\n\n🔄 **KARMİK ARMAĞAN & DERİNLEŞME (TİKKUN: Retrograde - Rx)**\n**${planetName} (Rx) İçsel Bilgeliği:** ${specificTikkun}`;
  }

  const isNoHouseWorld = isHarmonic || isHeliocentric;
  const title = isNoHouseWorld 
    ? `${planetName} - ${signName} Burcunda${titleSuffix}`
    : `${planetName} - ${signName} Burcunda ve ${houseNum}. Evde${titleSuffix}`;
  
  const planetContent = planet[layerKey] || planet.assiah;
  const signContent = sign[layerKey] || sign.assiah;

  const toFirstLower = (str: string) => {
    if (!str) return '';
    const trimmed = str.trim().replace(/\.$/, '');
    return trimmed.charAt(0).toLowerCase() + trimmed.slice(1);
  };

  const planetDesc = toFirstLower(planetContent);
  const signDesc = toFirstLower(signContent);

  let integrationNarrative = '';

  if (isNoHouseWorld) {
    if (isHeliocentric) {
      integrationNarrative = `En yüksek ruhsal boyutta ${planetName}; ${planetDesc} olarak parlar. Bu saf ışık, ${signName} burcunun ilksel yaratıcı kudretiyle (${signDesc}) birleşerek doğrudan Güneş'in kalbiyle ve Kaynak ile hizalanır. Bu ilahi kudret boyutunda dünyevi ev sınırları ve egosal filtreler tamamen erir; varlığınız bütüne hizmet eden saf bir yaratım frekansı yayarak ilahi iradeyle bütünleşir. ${worldSynthesisDesc}`;
    } else {
      integrationNarrative = `Yüksek zihin ve evrensel yaratım boyutunda ${planetName}; ${planetDesc} olarak tezahür eder. Bu vizyon, ${signName} burcunun evrensel zihinsel formuyla (${signDesc}) birleşerek düşüncelerinizi ve inançlarınızı makro ölçekte programlar. Bu boyutta dünyevi ev sınırları aşılmıştır; zihninizin evrensel planla kurduğu bu berrak bağ, ideallerinizi kadersel bir vizyona dönüştürür. ${worldSynthesisDesc}`;
    }
  } else {
    if (isDraconic) {
      integrationNarrative = `Duygusal ve karmik hafıza boyutunuzda ${planetName}; ${planetDesc} olarak açığa çıkar. Bu derin hisler, ${signName} burcunun getirdiği ruhsal hafıza ile (${signDesc}) birleşerek özellikle ${hPractical.toLowerCase()} merkezinde kilitli kalmış duygusal döngüleri ve geçmiş yaşam kontratlarını tetikler. ${house.esoteric} Bu alanda yaşayacağınız deneyimler, geçmişin yüklerini sevgi ve yüksek farkındalıkla şifalandırarak içsel özgürlüğe kavuşmanız için kadersel bir uyanış kapısıdır. ${worldSynthesisDesc}`;
    } else {
      integrationNarrative = `Fiziksel dünyadaki somut eylem alanınızda ${planetName}; ${planetDesc} olarak kendini gösterir. Bu güç, ${signName} burcunun dinamikleriyle (${signDesc}) birleşerek özellikle ${hPractical.toLowerCase()} merkezinde açığa çıkar. ${house.esoteric} Bu alanda yüzeysel hevesler yerine kendi hakiki mizacınızı ortaya koyduğunuzda; enerjinizi somut başarılara ve kalıcı bir üretim gücüne dönüştürebilirsiniz. ${worldSynthesisDesc}`;
    }
  }

  const content = `BÜTÜNLEŞİK KOZMİK VE YAŞAMSAL ANALİZ (${worldNameTitle}):\n` +
    `${integrationNarrative}\n\n` +
    `✨ **Ruhsal Güç & Potansiyel:** ${pPractical.power}\n\n` +
    `⚠️ **Gölge Yan & Sınav:** ${sPractical.shadow}\n\n` +
    `🔑 **Tekâmül Anahtarı:** ${pPractical.key} ${sPractical.advice}${retroSynthesis}`;

  return { title, content };
}

export function getEsotericHouseInterpretation(
  houseNum: number, 
  signName: ZodiacSign, 
  isDraconic: boolean = false, 
  isHarmonic: boolean = false, 
  isHeliocentric: boolean = false
): { title: string, content: string } {
  const house = KABBALAH_HOUSES[houseNum];
  const sign = KABBALAH_SIGNS[signName];

  if (!house || !sign) {
    return {
      title: `${houseNum}. Ev - ${signName}`,
      content: 'Bu ev alanı için ezoterik bir çözümleme bulunamadı.'
    };
  }

  let titleSuffix = '';
  let layerKey: 'atzilut' | 'beriyah' | 'yetzirah' | 'assiah' = 'assiah';
  let worldNameTitle = 'Assiah (Madde ve Eylem Alemi)';
  let worldSynthesisDesc = 'Bu yaşam alanı, ruhsal enerjinizi dünyevi hayatın somut meselelerinde nasıl yapılandıracağınızı ve fiziksel olarak hangi alanda kökleneceğinizi gösterir.';

  if (isHeliocentric) {
    layerKey = 'atzilut';
    titleSuffix = ' (Atzilut - Kudret Alemi)';
    worldNameTitle = 'Atzilut (İlahi Kudret Alemi)';
    worldSynthesisDesc = 'Bu yaşam alanı en yüksek ruhsal boyuttadır; yaşam alanınız doğrudan ilahi iradenin ve kozmik bilincin saf ışığıyla hizalanır.';
  } else if (isHarmonic) {
    layerKey = 'beriyah';
    titleSuffix = ' (Beriyah - Zihin Alemi)';
    worldNameTitle = 'Beriyah (Yüksek Zihin Alemi)';
    worldSynthesisDesc = 'Bu yaşam alanı yüksek zihninizin evrensel planla nasıl çalıştığını gösterir; bu alanda düşünceleriniz ve inançlarınızla kadersel vizyonunuzu şekillendirirsiniz.';
  } else if (isDraconic) {
    layerKey = 'yetzirah';
    titleSuffix = ' (Yetzirah - Duygu Alemi)';
    worldNameTitle = 'Yetzirah (Duygu ve Hisler Alemi)';
    worldSynthesisDesc = 'Bu yaşam alanı geçmiş yaşam karmalarınızdan getirdiğiniz duygusal kalıpları, ruhsal sözleşmelerinizi ve bilinçaltı hafızanızı şifalandırma kapınızdır.';
  } else {
    layerKey = 'assiah';
    titleSuffix = ' (Assiah - Madde Alemi)';
  }

  const hPractical = HOUSE_PRACTICAL[houseNum] || 'Yaşam yolculuğunuzun bu özel alanının';
  const sPractical = SIGN_PRACTICAL[signName] || {
    shadow: 'Dengesiz tepkiler ve aşırılıklar.',
    advice: 'İçsel dengenizi koruyarak hareket edin.'
  };

  let housePrefix = `${houseNum}. Ev`;
  if (houseNum === 1) housePrefix = `1. Ev (ASC - Yükselen)`;
  else if (houseNum === 10) housePrefix = `10. Ev (MC - Tepe Noktası)`;
  else if (houseNum === 4) housePrefix = `4. Ev (IC - Ayak Ucu)`;
  else if (houseNum === 7) housePrefix = `7. Ev (DSC - Alçalan)`;

  const title = `${housePrefix} - ${signName} Burcunda${titleSuffix}`;
  const signContent = sign[layerKey] || sign.assiah;

  const toFirstLower = (str: string) => {
    if (!str) return '';
    const trimmed = str.trim().replace(/\.$/, '');
    return trimmed.charAt(0).toLowerCase() + trimmed.slice(1);
  };
  const signDesc = toFirstLower(signContent);

  let integrationNarrative = '';
  if (isDraconic) {
    integrationNarrative = `${house.esoteric} Ruhsal ve duygusal tekamül yolculuğunuzda bu kapı, ${hPractical.toLowerCase()} en derin karmik hatıralarını, bilinçaltı sözleşmelerini ve hücresel kayıtlarını barındırır. Bu alandaki deneyimlere ${signName} burcunun getirdiği duygusal hafızayla (${signDesc}) yaklaşırsınız. Karşılaştığınız her kadersel durum, geçmişin tortularını şefkatle serbest bırakarak ruhunuzu özgürleştirecek kutsal bir şifa kapısıdır. ${worldSynthesisDesc}`;
  } else {
    integrationNarrative = `${house.esoteric} Yaşam yolculuğunuzda bu kapı, ${hPractical.toLowerCase()} doğrudan somut eylem ve tezahür merkezidir. Bu deneyim alanına ${signName} burcunun dinamikleriyle (${signDesc}) adım atarsınız. Bu alanda karşılaştığınız durumları kendi özgün doğallığınızla ve içsel dengenizle yönettiğinizde, dünyevi hedeflerinizi sağlam ve kalıcı temeller üzerine inşa edebilirsiniz. ${worldSynthesisDesc}`;
  }

  const content = `BÜTÜNLEŞİK YAŞAMSAL ALAN ANALİZİ (${worldNameTitle}):\n` +
    `${integrationNarrative}\n\n` +
    `⚠️ **Gölge Yan & Sınav:** ${sPractical.shadow}\n\n` +
    `🔑 **Tekâmül Anahtarı:** ${sPractical.advice} Bu alandaki deneyimleri içsel dengenizi koruyarak karşıladığınızda, karşılaştığınız her durum sizi olgunlaştıran ve kişisel gücünüzü artıran değerli bir fırsata dönüşür.`;

  return { title, content };
}
