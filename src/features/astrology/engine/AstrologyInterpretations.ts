import { ZodiacSign } from '../api/astrologyClient';

const DICT_SIGNS: Record<ZodiacSign, { trait: string, element: string, quality: string, esoteric: string }> = {
  'Koç': { trait: 'öncü, cesur, atak ve dinamik', element: 'Ateş', quality: 'inisiyatif alan', esoteric: 'Ruhun fiziksel bedene ilk inişi; varoluşun kıvılcımı ve ilksel "Ben Buradayım" çığlığı.' },
  'Boğa': { trait: 'sabit, sabırlı, huzurlu ve güven inşa eden', element: 'Toprak', quality: 'güvenlik ve bereket inşa eden', esoteric: 'Maddenin kutsanması ve ruhun form kazanarak dünya planında sağlam köklenmesi.' },
  'İkizler': { trait: 'değişken, zihinsel, meraklı ve iletişim odaklı', element: 'Hava', quality: 'bilgiyi sentezleyen ve aktaran', esoteric: 'İkiliğin (dualitenin) idraki; zihnin alt ve üst boyutlar arasında köprü kurması.' },
  'Yengeç': { trait: 'koruyucu, derin, şefkatli ve sezgisel', element: 'Su', quality: 'besleyen ve koruyan', esoteric: 'Kozmik rahmin kapısı; ruhun kolektif hafızadan bireysel bedene geçişi ve enkarnasyon.' },
  'Aslan': { trait: 'yaratıcı, vakur, merkezde olan ve cömert', element: 'Ateş', quality: 'kendini sahnede ifade eden', esoteric: 'Bireysel bilincin tam uyanışı; ilahi kıvılcımın kalpten dışarıya ışık olarak taşması.' },
  'Başak': { trait: 'analitik, hizmet odaklı, titiz ve arındırıcı', element: 'Toprak', quality: 'düzenleyen ve pratikleştiren', esoteric: 'Madde ve ruhun arınması; özverili hizmet, farkındalık ve sadeleşme yoluyla ruhsal dengenin kurulması.' },
  'Terazi': { trait: 'uyumlu, adil, diplomatik ve estetik odaklı', element: 'Hava', quality: 'denge ve ortaklık arayan', esoteric: 'Karma terazisi; "Öteki" üzerinden kendini tanıma ve evrensel dengenin (Maat) sağlanması.' },
  'Akrep': { trait: 'dönüştürücü, derin, sezgisel ve tutkulu', element: 'Su', quality: 'krizleri yöneten ve yenilenen', esoteric: 'Yenilenme ve içsel simya kapısı; derin duygularla yüzleşerek küllerinden yeniden doğuş yaşamak.' },
  'Yay': { trait: 'maceracı, felsefi, umut dolu ve özgürlükçü', element: 'Ateş', quality: 'anlam arayan ve ufku genişleten', esoteric: 'Hakikatin aranışı; sentor doğasından evrensel bilgeliğe doğru atılan ilham oku.' },
  'Oğlak': { trait: 'disiplinli, sorumluluk sahibi, vakur ve hedef odaklı', element: 'Toprak', quality: 'sistem inşa eden ve yöneten', esoteric: 'Tekamül dağının zirvesi; maddi dünyanın sınırlarının aşılması ve inisiyasyon (Kozmik Kapı).' },
  'Kova': { trait: 'yenilikçi, özgür ruhlu, sıradışı ve vizyoner', element: 'Hava', quality: 'kolektife yön veren ve özgürleşen', esoteric: 'Kozmik bilginin yeryüzüne dökülmesi; bireyselliğin ötesinde evrensel kardeşlik bilinci.' },
  'Balık': { trait: 'şefkatli, spiritüel, akışta olan ve empatik', element: 'Su', quality: 'sınırları eriten ve şifalandıran', esoteric: 'Ruhun kaynağa (Okyanusa) dönüşü; tüm illüzyonların (Maya) çözülmesi ve sonsuzluk.' },
};

const DICT_PLANETS: Record<string, { essence: string, action: string, esoteric: string }> = {
  'Güneş': { essence: 'temel yaşam enerjiniz, bilinciniz ve yaratıcı özünüz', action: 'parlar, ilham verir ve irade gösterir', esoteric: 'İlahi Logos; ruhun bu hayattaki ana frekansı ve uyanış merkezi.' },
  'Ay': { essence: 'duygusal ihtiyaçlarınız, sezgileriniz ve içsel dünyanız', action: 'hisseder, derinleşir ve güven kurar', esoteric: 'Geçmiş yaşamların tortusu; ruhun alıcı, dişil ve yansıtıcı aynası.' },
  'Merkür': { essence: 'zihinsel yapınız, algılama biçiminiz ve iletişim diliniz', action: 'düşünür, öğrenir ve ifade eder', esoteric: 'Hermes; tanrıların habercisi, alt ve üst boyutlar (bilinç ve bilinçaltı) arasındaki köprü.' },
  'Venüs': { essence: 'sevgi diliniz, değer algınız, ilişkileriniz ve neşe kaynağınız', action: 'cezbeder, uyumlanır ve güzellik katar', esoteric: 'Kozmik uyum ve cazibe yasası; ruhun güzellik ve sevgi aracılığıyla bütünleşmesi.' },
  'Mars': { essence: 'eylem enerjiniz, cesaretiniz ve irade gücünüz', action: 'harekete geçer, öncülük eder ve sınırları korur', esoteric: 'Kök çakranın ateşi; ruhun maddede var kalma ve evrimsel dürtüsünü sağlayan itici güç.' },
  'Jüpiter': { essence: 'büyüme kapasiteniz, inanç sisteminiz ve fırsat alanınız', action: 'genişler, umut verir ve keşfeder', esoteric: 'Guru (İlahi Öğretmen); ruhun inayet, lütuf ve yüksek bilgi aracılığıyla genişlemesi.' },
  'Satürn': { essence: 'olgunlaşma alanınız, sorumluluk bilinciniz ve sağlam temelleriniz', action: 'yapılandırır, olgunlaştırır ve sağlam temeller kurar', esoteric: 'Eşiğin Bekçisi (Karmik Lord); ruhun zaman (Kronos) ve sınırlar içindeki tekamül testi.' },
  'Uranüs': { essence: 'uyanışınız, özgün dehanız ve vizyoner bakışınız', action: 'özgürleştirir, yeniler ve aydınlatır', esoteric: 'Kozmik Yıldırım; matrisin (Matrix) dışına çıkış, ani aydınlanma ve zincirlerin kırılması.' },
  'Neptün': { essence: 'idealleriniz, sezgisel ilhamınız ve evrensel sevginiz', action: 'hayal kurar, ilham verir ve sınırları birliğe çözer', esoteric: 'İlahi Aşk ve Mistik Çözülme; egonun sınırlarının eriyip birliğe (Vahdet) karışması.' },
  'Plüton': { essence: 'dönüşüm gücünüz, yenilenme potansiyeliniz ve içsel simyanız', action: 'dönüştürür, arındırır ve küllerinden yeniden doğurur', esoteric: 'Yeraltı Tanrısı; ruhun en karanlık dehlizlerine inip gölgeyi ışığa dönüştürme simyası.' },
  'Kiron': { essence: 'en derin hassasiyetiniz ve başkalarına damıttığınız şifa gücünüz', action: 'farkındalık kazandırır, öğretir ve şifalandırır', esoteric: 'Yaralı Şifacı; en derin acının içinden doğan ve başkalarına merhem olan bilgelik.' },
  'Chiron': { essence: 'en derin hassasiyetiniz ve başkalarına damıttığınız şifa gücünüz', action: 'farkındalık kazandırır, öğretir ve şifalandırır', esoteric: 'Yaralı Şifacı; en derin acının içinden doğan ve başkalarına merhem olan bilgelik.' },
  'Lilith': { essence: 'özgün dişil bilgeliğiniz, bağımsız doğanız ve tabuları yıkan gücünüz', action: 'özgürleşir, sınırları aşar ve hakikati korur', esoteric: 'Karanlık Ay; ruhun boyun eğmeyen dişil gücü, tabuları yıkan ve özgürleştiren ilksel enerji.' },
  'Kuzey Ay Düğümü': { essence: 'bu hayattaki kadersel öğrenme rotanız ve ruhunuzun tekamül pusulası', action: 'evrimleşir ve güvenle ilerler', esoteric: 'Ejderhanın Başı; ruhun karmik döngüyü kırıp evrimleşmek için yürümesi gereken bilinmeyen yol.' },
  'Yükselen (ASC)': { essence: 'dış dünyaya yansıttığınız duruş, fiziksel bedeniniz ve başlangıç enerjiniz', action: 'deneyimler ve yansıtır', esoteric: 'Ruhun bu enkarnasyondaki aracı (Avatarı); yaşam yolculuğunun başlangıç kapısı.' },
  'Tepe Noktası (MC)': { essence: 'kaderdeki nihai hedefiniz, toplumsal statünüz ve varılacak noktanız', action: 'zirveye ulaşır ve görünür olur', esoteric: 'Ruhun bu hayattaki magnum opus\'u (Büyük İş); kozmik misyonun dünyevi tezahürü.' },
  'Vertex (Vx)': { essence: 'kadersel karşılaşmalarınız, dönüm noktalarınız ve eşzamanlılık kapılarınız', action: 'farkındalığı tetikler ve kadersel olarak çeker', esoteric: 'Ruhun diğer varlıklarla yaptığı kutsal kontrat; kişinin kontrolü dışında gelişen, hayatı değiştiren kadersel uyanış kapısı.' },
  'Şans Noktası (POF)': { essence: 'maddi ve manevi kısmetiniz, neşe kaynağınız ve doğal yetenekleriniz', action: 'zenginleştirir ve akışa sokar', esoteric: 'Ruhun, bedenin ve zihnin (Güneş, Ay ve Yükselen) mükemmel uyumlandığı altın oran noktası; ilahi lütfun dünyevi tezahürü.' }
};

const DICT_HOUSES: Record<number, { domain: string, focus: string }> = {
  1: { domain: 'kişisel imajınız, bedeniniz, mizaç yapınız ve hayatla ilk temasınız', focus: 'benliğin inşası ve özgüven' },
  2: { domain: 'maddi kaynaklarınız, özdeğeriniz, yetenekleriniz ve sahip olduklarınız', focus: 'güvenlik ve bereketli istikrar' },
  3: { domain: 'iletişiminiz, yakın çevreniz, kardeşleriniz ve zihinsel süreçleriniz', focus: 'öğrenme, uyumlanma ve aktarım' },
  4: { domain: 'kökleriniz, aileniz, bilinçaltı inançlarınız ve içsel yuvanız', focus: 'temel atma ve duygusal aidiyet' },
  5: { domain: 'yaratıcılığınız, aşk hayatınız, çocuklarınız ve kendinizi ifade biçiminiz', focus: 'neşeyi, sanatı ve yaratımı bulma' },
  6: { domain: 'günlük rutinleriniz, çalışma hayatınız, görevleriniz ve sağlığınız', focus: 'düzen, sağlıklı ritimler ve arınma' },
  7: { domain: 'ikili ilişkileriniz, evliliğiniz, ortaklıklarınız ve aynalık mekanizmanız', focus: 'ötekiyle kurulan bağ ve denge' },
  8: { domain: 'dönüşüm potansiyeliniz, derinleşme kapasiteniz ve paylaşılan ortak kaynaklar', focus: 'içsel simya, yenilenme ve müşterek değerler' },
  9: { domain: 'inançlarınız, yaşam felsefeniz, uzak seyahatleriniz ve yüksek vizyonunuz', focus: 'ufku genişletme ve gerçeği arama' },
  10: { domain: 'kariyeriniz, toplumsal itibarınız, başarılarınız ve hedefleriniz', focus: 'zirveye çıkma ve topluma katkı' },
  11: { domain: 'sosyal çevreniz, idealleriniz, vizyonunuz ve kolektif katkılarınız', focus: 'birlikten güç doğurma ve geleceği tasarlama' },
  12: { domain: 'bilinçaltı potansiyeliniz, içsel dünyanız, ruhsal dinginliğiniz ve teslimiyetiniz', focus: 'bütüne teslimiyet ve ruhsal huzur' },
};

export function getFullPlanetInterpretation(planetName: string, signName: ZodiacSign, houseNum: number, isDraconic: boolean = false): { title: string, content: string } {
  const planet = DICT_PLANETS[planetName] || DICT_PLANETS[planetName.replace(' ', '')];
  const sign = DICT_SIGNS[signName];
  const house = DICT_HOUSES[houseNum];

  if (!planet || !sign || !house) return { title: 'Bilinmeyen Yerleşim', content: 'Bu astrolojik yerleşim için detaylı bir metin üretilemedi.' };

  const title = `${planetName} - ${signName} Burcunda ve ${houseNum}. Evde${isDraconic ? ' (Drakonik)' : ''}`;
  
  if (isDraconic) {
    const content = `BÜTÜNLEŞİK RUHSAL SÖZLEŞME VE TEKÂMÜL ANALİZİ:\n` +
      `Drakonik haritanızda (ruhsal sözleşmenizde) ${planetName}, ${signName} formuna bürünerek ${houseNum}. evin yaşam sahnesine köklenir. Geçmiş ruhsal deneyimlerinizden ve köklerinizden gelen bu yerleşim, özünüzdeki ${planet.essence} potansiyelini kadersel bir bilgeliğe dönüştürür. ${sign.element} elementinin ${sign.quality} frekansıyla uyumlanan bu etki; ruhunuzun bu enkarnasyondaki asıl tekâmül amacının "${sign.esoteric}" olduğunu gösterir.\n\n` +
      `Bu yüksek potansiyelin deneyimlenmesi ve dünyevi planda açığa çıkması için seçtiğiniz sahne ${houseNum}. evdir (${house.domain}). Egonun geçici kalıplarını aştığınızda, "${planet.action}" gücünüz tamamen ${sign.trait} bir bilgeliğe evrilerek sizi nihai olarak ${planet.esoteric} seviyesine taşıyacaktır.`;
    return { title, content };
  }

  const content = `BÜTÜNLEŞİK KOZMİK VE YAŞAMSAL ANALİZ:\n` +
    `Astrolojide ${planetName}, ${planet.essence}ı temsil eder. Bu kozmik enerjinin ${signName} burcunda ve ${houseNum}. evde vücut bulması; ${sign.element} elementinin motivasyonu ve ${sign.trait} mizacınızı doğrudan ${house.domain} sahnesine taşır.\n\n` +
    `Harita sahibi olarak ${sign.quality} bir yaklaşımla, yaşamınızda en çok '${house.focus}' deneyimlerinde ${planet.action}. Bu yerleşim, ${planetName} potansiyelinizin ${signName} burcunun ayırt edici nitelikleriyle harmanlanarak ${houseNum}. evin getirdiği yaşam meydanlarında son derece dönüştürücü, yapıcı ve somut bir güç olarak ortaya çıkmasını sağlar.\n\n` +
    `EZOTERİK ANLAM:\n` +
    `Geleneksel okumanın ötesinde, bu yerleşim çok daha derin bir spiritüel gerçeği fısıldar. ${planetName} enerjisi (${planet.esoteric}), ${signName} formunda vücut bularak (${sign.esoteric}) ruhun tekamülüne hizmet etmektedir. Bu kadersel mühür, ${houseNum}. evin sırlarını çözmeniz ve potansiyelinizi uyandırmanız için değerli bir anahtardır.`;

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
    `Bu evin giriş çizgisinin (Cusp) ${signName} burcunda kesilmesi, hayatınızın bu spesifik alanlarında ${sign.trait} bir yaklaşım benimseyeceğinizi gösterir.\n\n` +
    `Bu yaşam sahnesinde olayları karşılama biçiminiz ${signName} burcunun ${sign.quality} arketipi üzerinden şekillenecektir. ${sign.element} elementinin yoğun olarak deneyimlendiği bu ev, kadersel potansiyelinizi bu burcun doğasına uygun şekilde açığa çıkarır.\n\n` +
    `EZOTERİK ANLAM:\nRuhsal tekamül perspektifinden bakıldığında ${signName} burcu; ${sign.esoteric} Bu evin deneyim alanlarına yaklaştığınızda, ${signName} burcunun derin ruhsal temasını tecrübe edebilir, bu alanın bilgeliğini yaşamınıza katarak içsel bütünlüğünüzü güçlendirebilirsiniz.`;

  return { title, content };
}

const DICT_ASPECTS: Record<string, { nature: string, meaning: string, esoteric: string }> = {
  'Kavuşum': { nature: 'güçlü odak ve enerji birleşimi', meaning: 'iki enerjinin tek bir merkezde kaynaşarak birbirini güçlü bir şekilde beslediğini ve odaklandığını', esoteric: 'Ruhun bu iki potansiyeli tek bir kutsal mühürde birleştirdiği derin buluşma; içsel gücünüzü tek bir noktaya odaklayan güçlü bir merkez.' },
  'Karşıt': { nature: 'aynalama ve kutupları dengeleme', meaning: 'bu iki enerjinin birbirini aynalayarak tamamladığını ve dengeli bir sentez arayışında olduğunu', esoteric: 'Ruhun ikilikleri uyumlama çağrısı; "Öteki" üzerinden kendi içsel zenginliğini fark edip yüksek bir dengeye ulaşma potansiyeli.' },
  'Üçgen': { nature: 'doğal akış ve ilahi yetenek', meaning: 'bu iki enerjinin birbirini en uyumlu ve zahmetsiz şekilde besleyerek yaşamınıza bereketli bir kapı açtığını', esoteric: 'Doğuştan gelen lütuf ve hediye (Dharma); evrensel yasalarla tam bir uyum içinde akan neşe ve bilgelik kanalı.' },
  'Kare': { nature: 'dinamik gelişim ve büyüme dürtüsü', meaning: 'bu iki enerji arasındaki dinamik gerilimin sizi harekete geçirerek potansiyelinizi açığa çıkarma ve dönüştürerek büyüme fırsatı sunduğunu', esoteric: 'Ham elmasın fasetlenerek parlaması gibi; içsel gücünüzü, yaratıcı dayanıklılığınızı ve ustalığınızı ortaya çıkaran yüksek bir tekâmül fırsatı.' },
  'Sekstil': { nature: 'fırsat ve destekleyici teşvik', meaning: 'bu enerjilerin birbirine yapıcı fırsatlar sunduğunu ve bilinçli bir niyetle hayata geçirildiğinde büyük bir verim sağladığını', esoteric: 'Kozmik tohum; bilinçli farkındalık ve eylemle buluştuğunda ruhsal uyanışı hızlandıran bereketli potansiyel.' },
  'Görmeyen': { nature: 'farkındalık ve yaratıcı sentez', meaning: 'bu iki enerjinin farklı boyutlarda çalıştığını ve aralarında bilinçli bir köprü kurarak yaratıcı bir uyum yakalayabileceğinizi', esoteric: 'Gelişime açık bir farkındalık alanı; alışılmışın dışında bir bakış açısıyla iki farklı potansiyeli ustalıkla sentezleme daveti.' }
};

export function getAspectInterpretation(planet1Name: string, planet2Name: string, aspectType: string): { title: string, content: string } {
  const p1 = DICT_PLANETS[planet1Name] || DICT_PLANETS[planet1Name.replace(' ', '')];
  const p2 = DICT_PLANETS[planet2Name] || DICT_PLANETS[planet2Name.replace(' ', '')];
  const aspect = DICT_ASPECTS[aspectType];

  if (!p1 || !p2 || !aspect) return { title: 'Bilinmeyen Açı', content: 'Bu gezegensel etkileşim için detaylı bir metin üretilemedi.' };

  const title = `${planet1Name} ve ${planet2Name} ${aspectType} Açısı`;

  const content = `Astrolojide ${aspectType} açısı, ${aspect.nature} enerjisi taşır.\n\n` +
    `GEZEGEN DİNAMİĞİ:\n${planet1Name} (${p1.essence}), ${planet2Name} (${p2.essence}) ile bir "${aspectType}" açısı yapmaktadır.\n\n` +
    `ETKİSİ:\nBu açı, ${aspect.meaning} gösterir. Harita sahibi, bir tarafta ${planet1Name} enerjisiyle ${p1.action}ken, diğer tarafta eşzamanlı olarak ${planet2Name} enerjisiyle rezonansa girerek ${p2.action}. Bu iki güç arasındaki "${aspectType}" etkileşimi, karakterinizdeki en belirgin ve dönüştürücü potansiyellerden biridir.\n\n` +
    `EZOTERİK ANLAM (KARMİK DİNAMİK):\n${aspect.esoteric} Ruhsal tekamülünüzde ${planet1Name} (${p1.esoteric}) ile ${planet2Name} (${p2.esoteric}) arasındaki bu kozmik senkronizasyon, kaderinizin eşsiz ve dönüştürücü bir anahtarını temsil etmektedir.`;

  return { title, content };
}
