import { ZodiacSign } from './AstrologyEngine';

const DICT_SIGNS: Record<ZodiacSign, { trait: string, element: string, quality: string, esoteric: string }> = {
  'Koç': { trait: 'öncü, cesur, atak ve sabırsız', element: 'Ateş', quality: 'inisiyatif alan', esoteric: 'Ruhun fiziksel bedene ilk inişi; varoluşun kıvılcımı ve ilksel "Ben Buradayım" çığlığı.' },
  'Boğa': { trait: 'sabit, sabırlı, huzur arayan ve maddiyatçı', element: 'Toprak', quality: 'güvenlik inşa eden', esoteric: 'Maddenin kutsanması ve ruhun form kazanarak dünya planında köklenmesi.' },
  'İkizler': { trait: 'değişken, zihinsel, meraklı ve iletişim odaklı', element: 'Hava', quality: 'bilgi toplayan ve aktaran', esoteric: 'İkiliğin (dualitenin) idraki; zihnin alt ve üst boyutlar arasında köprü kurması.' },
  'Yengeç': { trait: 'korumacı, duygusal, aidiyet arayan ve sezgisel', element: 'Su', quality: 'besleyen ve koruyan', esoteric: 'Kozmik rahmin kapısı; ruhun kolektif hafızadan bireysel bedene geçişi ve enkarnasyon.' },
  'Aslan': { trait: 'yaratıcı, gururlu, merkezde olan ve cömert', element: 'Ateş', quality: 'kendini sahnede ifade eden', esoteric: 'Bireysel bilincin tam uyanışı; ilahi kıvılcımın kalpten dışarıya ışık olarak taşması.' },
  'Başak': { trait: 'analitik, hizmet odaklı, titiz ve mükemmeliyetçi', element: 'Toprak', quality: 'düzenleyen ve pratikleştiren', esoteric: 'Madde ve ruhun arınması; kusursuzluğa ulaşmak için egonun hizmet yoluyla terbiye edilmesi.' },
  'Terazi': { trait: 'uyumlu, adil, diplomatik ve estetik odaklı', element: 'Hava', quality: 'denge ve ortaklık arayan', esoteric: 'Karma terazisi; "Öteki" üzerinden kendini tanıma ve evrensel dengenin (Maat) sağlanması.' },
  'Akrep': { trait: 'dönüştürücü, derin, stratejik ve tutkulu', element: 'Su', quality: 'krizleri yöneten ve yenilenen', esoteric: 'Ölüm ve yeniden doğuş kapısı; gölgeyle yüzleşerek simyasal dönüşüm (Nigredo) yaşamak.' },
  'Yay': { trait: 'maceracı, felsefi, iyimser ve özgürlükçü', element: 'Ateş', quality: 'anlam arayan ve ufku genişleten', esoteric: 'Hakikatin aranışı; hayvansal doğadan (Sentor) ilahi bilgeliğe doğru atılan ok.' },
  'Oğlak': { trait: 'disiplinli, otoriter, ciddi ve hedef odaklı', element: 'Toprak', quality: 'sistem inşa eden ve yöneten', esoteric: 'Tekamül dağının zirvesi; maddi dünyanın sınırlarının aşılması ve inisiyasyon (Kozmik Kapı).' },
  'Kova': { trait: 'yenilikçi, isyankar, sıradışı ve vizyoner', element: 'Hava', quality: 'kolektife yön veren ve özgürleşen', esoteric: 'Kozmik bilginin yeryüzüne dökülmesi; bireyselliğin ötesinde evrensel kardeşlik bilinci.' },
  'Balık': { trait: 'fedakar, spiritüel, akışta olan ve empatik', element: 'Su', quality: 'sınırları eriten ve şifalandıran', esoteric: 'Ruhun kaynağa (Okyanusa) dönüşü; tüm illüzyonların (Maya) çözülmesi ve sonsuzluk.' },
};

const DICT_PLANETS: Record<string, { essence: string, action: string, esoteric: string }> = {
  'Güneş': { essence: 'temel yaşam enerjiniz, bilinciniz ve ego kimliğiniz', action: 'parlar, yönetir ve irade gösterir', esoteric: 'İlahi Logos; ruhun bu hayattaki ana frekansı ve uyanış merkezi.' },
  'Ay': { essence: 'duygusal ihtiyaçlarınız, içgüdüleriniz ve ruhsal sığınağınız', action: 'hisseder, tepki verir ve aidiyet kurar', esoteric: 'Geçmiş yaşamların tortusu; ruhun alıcı, dişil ve yansıtıcı aynası.' },
  'Merkür': { essence: 'zihinsel yapınız, algılama biçiminiz ve iletişim diliniz', action: 'düşünür, öğrenir ve ifade eder', esoteric: 'Hermes; tanrıların habercisi, alt ve üst boyutlar (bilinç ve bilinçaltı) arasındaki köprü.' },
  'Venüs': { essence: 'sevgi diliniz, değer algınız, ilişkileriniz ve neşe kaynağınız', action: 'cezbeder, uyumlanır ve değer katar', esoteric: 'Kozmik uyum ve cazibe yasası; ruhun güzellik ve sevgi aracılığıyla bütünleşmesi.' },
  'Mars': { essence: 'mücadele şekliniz, arzularınız ve eylem enerjiniz', action: 'harekete geçer, savaşır ve sınırlar çizer', esoteric: 'Kök çakranın ateşi; ruhun maddede var kalma ve evrimsel dürtüsünü sağlayan itici güç.' },
  'Jüpiter': { essence: 'büyüme kapasiteniz, inanç sisteminiz ve şans alanınız', action: 'genişler, umut verir ve keşfeder', esoteric: 'Guru (İlahi Öğretmen); ruhun inayet, lütuf ve yüksek bilgi aracılığıyla genişlemesi.' },
  'Satürn': { essence: 'karmik sınavlarınız, sorumluluklarınız ve olgunlaşma alanınız', action: 'kısıtlar, yapılandırır ve disipline eder', esoteric: 'Eşiğin Bekçisi (Karmik Lord); ruhun zaman (Kronos) ve sınırlar içindeki tekamül testi.' },
  'Uranüs': { essence: 'kurtuluş arayışınız, dehanız ve uyanışınız', action: 'özgürleşir, isyan eder ve aydınlatır', esoteric: 'Kozmik Yıldırım; matrisin (Matrix) dışına çıkış, ani aydınlanma ve zincirlerin kırılması.' },
  'Neptün': { essence: 'idealleriniz, ilhamınız ve ilahi bağlantınız', action: 'hayal kurar, fedakarlık yapar ve sınırları çözer', esoteric: 'İlahi Aşk ve Mistik Çözülme; egonun sınırlarının eriyip birliğe (Vahdet) karışması.' },
  'Plüton': { essence: 'dönüşüm gücünüz, yıkıcı/yapıcı potansiyeliniz ve gölge yanınız', action: 'dönüştürür, yok eder ve küllerinden yeniden doğurur', esoteric: 'Yeraltı Tanrısı; ruhun en karanlık dehlizlerine inip gölgeyi ışığa dönüştürme simyası.' },
  'Chiron': { essence: 'kapanmayan yaranız ve en büyük şifa gücünüz', action: 'yaralar, öğretir ve şifalandırır', esoteric: 'Yaralı Şifacı; en derin acının içinden doğan ve başkalarına merhem olan bilgelik.' },
  'Lilith': { essence: 'bastırılmış karanlık, vahşi doğanız ve isyankar gücünüz', action: 'başkaldırır, reddeder ve özgürleşir', esoteric: 'Karanlık Ay; ruhun boyun eğmeyen dişil gücü, tabuları yıkan ve özgürleştiren ilksel enerji.' },
  'Kuzey Ay Düğümü': { essence: 'bu hayattaki kadersel öğrenme yönünüz ve ruhunuzun tekamül pusulası', action: 'evrimleşir ve cesaretle ilerler', esoteric: 'Ejderhanın Başı; ruhun karmik döngüyü kırıp evrimleşmek için yürümesi gereken bilinmeyen yol.' },
  'Yükselen (ASC)': { essence: 'dış dünyaya yansıttığınız maske, fiziksel bedeniniz ve başlangıç enerjiniz', action: 'deneyimler ve yansıtır', esoteric: 'Ruhun bu enkarnasyondaki aracı (Avatarı); yaşam yolculuğunun başlangıç kapısı.' },
  'Tepe Noktası (MC)': { essence: 'kaderdeki nihai hedefiniz, toplumsal statünüz ve varılacak noktanız', action: 'zirveye ulaşır ve görünür olur', esoteric: 'Ruhun bu hayattaki magnum opus\'u (Büyük İş); kozmik misyonun dünyevi tezahürü.' },
  'Vertex (Vx)': { essence: 'kadersel karşılaşmalarınız, dönüm noktalarınız ve kaçınılmaz olaylar', action: 'tetikler ve kadersel olarak çeker', esoteric: 'Ruhun diğer varlıklarla yaptığı kutsal kontrat; kişinin kontrolü dışında gelişen, hayatı değiştiren kadersel uyanış kapısı.' },
  'Şans Noktası (POF)': { essence: 'maddi ve manevi kısmetiniz, neşe kaynağınız ve doğal yetenekleriniz', action: 'zenginleştirir ve akışa sokar', esoteric: 'Ruhun, bedenin ve zihnin (Güneş, Ay ve Yükselen) mükemmel uyumlandığı altın oran noktası; ilahi lütfun dünyevi tezahürü.' }
};

const DICT_HOUSES: Record<number, { domain: string, focus: string }> = {
  1: { domain: 'kişisel imajınız, bedeniniz, mizaç yapınız ve hayatla ilk temasınız', focus: 'benliğin inşası ve kendini ispat' },
  2: { domain: 'maddi kaynaklarınız, özdeğeriniz, yetenekleriniz ve sahip olduklarınız', focus: 'güvenlik ve maddi istikrar' },
  3: { domain: 'iletişiminiz, yakın çevreniz, kardeşleriniz ve zihinsel süreçleriniz', focus: 'öğrenme, uyumlanma ve aktarım' },
  4: { domain: 'kökleriniz, aileniz, bilinçaltı inançlarınız ve içsel yuvanız', focus: 'temel atma ve duygusal aidiyet' },
  5: { domain: 'yaratıcılığınız, aşk hayatınız, çocuklarınız ve kendinizi ifade biçiminiz', focus: 'neşeyi, sanatı ve yaratımı bulma' },
  6: { domain: 'günlük rutinleriniz, çalışma hayatınız, görevleriniz ve sağlığınız', focus: 'hizmet, düzen ve fiziksel arınma' },
  7: { domain: 'ikili ilişkileriniz, evliliğiniz, ortaklıklarınız ve aynalık mekanizmanız', focus: 'ötekiyle kurulan bağ ve denge' },
  8: { domain: 'krizleriniz, dönüşüm kapasiteniz, gizli korkularınız ve paylaşılan kaynaklar', focus: 'derinleşme, krizleri aşma ve yeniden doğuş' },
  9: { domain: 'inançlarınız, yaşam felsefeniz, uzak seyahatleriniz ve yüksek vizyonunuz', focus: 'ufku genişletme ve gerçeği arama' },
  10: { domain: 'kariyeriniz, toplumsal itibarınız, başarılarınız ve otorite figürleriyle ilişkiniz', focus: 'zirveye çıkma ve topluma katkı' },
  11: { domain: 'sosyal çevreniz, idealleriniz, vizyonunuz ve kolektif katkılarınız', focus: 'birlikten güç doğurma ve geleceği tasarlama' },
  12: { domain: 'bilinçaltı korkularınız, gizli meseleleriniz, ruhsal inzivanız ve kadersel çözülmeleriniz', focus: 'bütüne teslimiyet ve ruhsal arınma' },
};

export function getFullPlanetInterpretation(planetName: string, signName: ZodiacSign, houseNum: number, isDraconic: boolean = false): { title: string, content: string } {
  const planet = DICT_PLANETS[planetName] || DICT_PLANETS[planetName.replace(' ', '')];
  const sign = DICT_SIGNS[signName];
  const house = DICT_HOUSES[houseNum];

  if (!planet || !sign || !house) return { title: 'Bilinmeyen Yerleşim', content: 'Bu astrolojik yerleşim için detaylı bir metin üretilemedi.' };

  const title = `${planetName} - ${signName} Burcunda ve ${houseNum}. Evde${isDraconic ? ' (Drakonik)' : ''}`;
  
  if (isDraconic) {
    const content = `Drakonik haritada (ruhsal sözleşmenizde) ${planetName}, ${signName} formuna bürünür.\n\n` +
      `RUHSAL KÖKEN:\nGeçmiş yaşamlarınızdan ve çok derinlerden gelen bu enerji, özünüzde ${planet.essence} kavramını nasıl kadersel bir derse dönüştürdüğünüzü anlatır. ${sign.element} elementinin ${sign.quality} frekansıyla uyumlanan bu yerleşim, ruhunuzun asıl amacının "${sign.esoteric}" olduğunu gösterir.\n\n` +
      `KADERSEL ARENA (EV ETKİSİ):\nRuhsal planınızda, bu gücün çözülmesi ve tezahür etmesi için seçtiğiniz yeryüzü sahnesi ${houseNum}. evdir. Bu nedenle ${house.domain} alanında sürekli olarak kadersel testlerden veya uyanışlardan geçersiniz.\n\n` +
      `TEKAMÜL YOLCULUĞU:\nEgonuzu bir kenara bıraktığınızda, "${planet.action}" eyleminiz tamamen ${sign.trait} bir bilgeliğe evrilir. Bu da sizi nihai olarak ${planet.esoteric} seviyesine taşıyacaktır.`;
    return { title, content };
  }

  const content = `Astrolojide ${planetName}, ${planet.essence}ı temsil eder.\n\n` +
    `BURÇ ETKİSİ:\nBu enerjinin ${signName} burcunda olması, içsel dinamiklerinizin ${sign.trait} bir doğayla ortaya çıkacağını gösterir. Harita sahibi olarak bu gezegenin temsil ettiği konularda ${sign.quality} bir tavır sergiler ve ${sign.element} elementinin motivasyonuyla ${planet.action}.\n\n` +
    `EV (YAŞAM ALANI) ETKİSİ:\nBu gezegenin ${houseNum}. Evde bulunması oldukça önemlidir. ${houseNum}. Ev astrolojide ${house.domain} alanını yönetir. Dolayısıyla, ${signName} burcunun özellikleriyle boyanmış olan bu gezegensel enerji, kadersel olarak en çok '${house.focus}' konularında kendini gösterecektir.\n\n` +
    `SENTEZ:\nKısacası, ${planet.action} potansiyeliniz ${sign.trait} bir tarzda çalışarak hayatınızın ${houseNum}. evine ait olan "${house.focus}" sahnesinde kadersel bir rol oynar.\n\n` +
    `EZOTERİK ANLAM:\nGeleneksel okumanın ötesinde, bu yerleşim çok daha derin bir spiritüel gerçeği fısıldar. ${planetName} enerjisi (${planet.esoteric}), ${signName} formunda vücut bularak (${sign.esoteric}) ruhun tekamülüne hizmet etmektedir. Bu kadersel mühür, ${houseNum}. evin sırlarını çözmeniz için bir anahtardır.`;

  return { title, content };
}

export function getHouseCuspInterpretation(houseNum: number, signName: ZodiacSign): { title: string, content: string } {
  const house = DICT_HOUSES[houseNum];
  const sign = DICT_SIGNS[signName];

  if (!house || !sign) return { title: 'Bilinmeyen Ev', content: 'Bu ev girişi için detaylı bir metin üretilemedi.' };

  let title = `${houseNum}. Ev Girişi (Cusp) - ${signName}`;
  if (houseNum === 1) title = `Yükselen (ASC) - 1. Ev - ${signName}`;
  if (houseNum === 10) title = `Tepe Noktası (MC) - 10. Ev - ${signName}`;
  if (houseNum === 4) title = `Ayak Ucu (IC) - 4. Ev - ${signName}`;
  if (houseNum === 7) title = `Alçalan (DSC) - 7. Ev - ${signName}`;

  const content = `Astrolojide ${houseNum}. Ev; ${house.domain} alanlarını temsil eder ve hayattaki '${house.focus}' deneyimini yönetir.\n\n` +
    `Bu evin giriş çizgisinin (Cusp) ${signName} burcunda kesilmesi, hayatınızın bu spesifik alanlarında harita sahibinin ${sign.trait} bir yaklaşım benimseyeceğini gösterir.\n\n` +
    `Bu yaşam sahnesinde olayları karşılama biçiminiz tamamen ${signName} burcunun ${sign.quality} arketipi üzerinden şekillenecektir. ${sign.element} elementinin yoğun olarak deneyimlendiği bu ev, kadersel potansiyelinizi bu burcun doğasına uygun şekilde açığa çıkarır.\n\n` +
    `EZOTERİK ANLAM:\nRuhsal tekamül perspektifinden bakıldığında ${signName} burcu; ${sign.esoteric} Bu evin deneyim alanlarına yaklaştığınızda, kadersel olarak bu derin ruhsal temayı tecrübe edip şifalandırmanız beklenmektedir.`;

  return { title, content };
}

const DICT_ASPECTS: Record<string, { nature: string, meaning: string, esoteric: string }> = {
  'Kavuşum': { nature: 'güç birliği ve birleşim', meaning: 'iki enerjinin tek bir odak noktasında eriyip kaynaştığını ve birbirini ayrılmaz bir şekilde desteklediğini (veya zorladığını)', esoteric: 'Ruhun bu iki temayı tekammül planında tek bir mühürde birleştirdiği kördüğüm; iç içe geçmiş karmik kader.' },
  'Karşıt': { nature: 'aynalama ve gerilim', meaning: 'bu iki enerjinin sürekli bir tahterevalli gibi denge aradığını ve dış olaylar üzerinden birbirini aynaladığını', esoteric: 'Ruhun dualite (ikilik) sınavı; "Öteki" üzerinden kendi içsel çelişkisiyle yüzleşme ve uyanış çağrısı.' },
  'Üçgen': { nature: 'doğal akış ve ilahi yetenek', meaning: 'bu iki gezegenin birbirini en uyumlu ve zahmetsiz şekilde beslediğini, adeta doğuştan gelen bir şans kapısı açtığını', esoteric: 'Geçmiş hayatlarda hak edilmiş lütuf ve ödül (Dharma); evrensel yasalarla tam bir uyum içinde akan neşe kanalı.' },
  'Kare': { nature: 'sürtünme, zorlanma ve kriz', meaning: 'bu enerjiler arasında sürekli bir içsel çatışma olduğunu ve sizi harekete geçmeye, krizleri çözerek büyümeye zorladığını', esoteric: 'Ruhun demirci örsündeki dövülme süreci; büyük bir sıçrama yaşamak için geçilmesi zorunlu olan acılı karmik sınav.' },
  'Sekstil': { nature: 'fırsat ve teşvik', meaning: 'bu gezegenlerin birbirine destekleyici fırsatlar sunduğunu ancak bu potansiyelin açığa çıkması için sizin bilinçli bir çaba göstermeniz gerektiğini', esoteric: 'Kozmik tohum; doğru toprakla ve eylemle buluştuğunda ruhun uyanışını hızlandıracak gizli potansiyel.' },
  'Görmeyen': { nature: 'anlaşmazlık ve kör nokta', meaning: 'bu iki enerjinin birbirini hiç anlamadığını, tuhaf ve beklenmedik krizlerle sürekli ince ayar yapmanız gerektiğini', esoteric: 'Ruhsal kör nokta; bilinçaltında bastırılmış, kabul edilmesi ve farklı bir bakış açısıyla (simyasal) sentezlenmesi gereken gölge yan.' }
};

export function getAspectInterpretation(planet1Name: string, planet2Name: string, aspectType: string): { title: string, content: string } {
  const p1 = DICT_PLANETS[planet1Name] || DICT_PLANETS[planet1Name.replace(' ', '')];
  const p2 = DICT_PLANETS[planet2Name] || DICT_PLANETS[planet2Name.replace(' ', '')];
  const aspect = DICT_ASPECTS[aspectType];

  if (!p1 || !p2 || !aspect) return { title: 'Bilinmeyen Açı', content: 'Bu gezegensel etkileşim için detaylı bir metin üretilemedi.' };

  const title = `${planet1Name} ve ${planet2Name} ${aspectType} Açısı`;

  const content = `Astrolojide ${aspectType} açısı, ${aspect.nature} enerjisi taşır.\n\n` +
    `GEZEGEN DİNAMİĞİ:\n${planet1Name} (${p1.essence}), ${planet2Name} (${p2.essence}) ile bir "${aspectType}" açısı yapmaktadır.\n\n` +
    `ETKİSİ:\nBu açı, ${aspect.meaning} gösterir. Harita sahibi, bir tarafta ${planet1Name} enerjisiyle ${p1.action}ken, diğer tarafta eşzamanlı olarak ${planet2Name} enerjisinin etkisi altına girerek ${p2.action}. Bu iki güç arasındaki "${aspectType}" etkileşimi, sizin karakterinizdeki en belirgin psikolojik motiflerden biridir.\n\n` +
    `EZOTERİK ANLAM (KARMİK DİNAMİK):\n${aspect.esoteric} Bu özel etkileşim, bu enkarnasyondaki büyük senaryonuzun en güçlü düğümlerinden biridir.`;

  return { title, content };
}
