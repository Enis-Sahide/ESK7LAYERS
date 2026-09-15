import { ZodiacSign } from '../api/astrologyClient';

const DICT_SIGNS: Record<ZodiacSign, { nature: string, behavior: string, esoteric: string }> = {
  'Koç': { 
    nature: 'atak, cesur ve doğrudan inisiyatif alan kararlı', 
    behavior: 'Beklemek yerine öncülük etmeyi seçer, engeller karşısında geri adım atmak yerine cesaretle adım atarsınız.', 
    esoteric: 'Ruhun fiziksel bedene ilk inişi; varoluşun kıvılcımı ve ilksel "Ben Buradayım" çığlığı.' 
  },
  'Boğa': { 
    nature: 'sabırlı, sarsılmaz, huzur ve güven inşa eden sağlam', 
    behavior: 'Aceleci kararlar yerine kalıcı ve huzur veren yapılar kurmayı önemser, başladığınız işi sarsılmaz bir sadakat ve üretkenlikle tamamlarsınız.', 
    esoteric: 'Maddenin kutsanması ve ruhun form kazanarak dünya planında sağlam köklenmesi.' 
  },
  'İkizler': { 
    nature: 'meraklı, çok yönlü, iletişimi ve bilgi akışını merkeze alan canlı', 
    behavior: 'Farklı bakış açılarını hızla sentezler, olaylara esnek yaklaşır ve insanları zihninizin kıvraklığıyla birbirine bağlarsınız.', 
    esoteric: 'İkiliğin (dualitenin) idraki; zihnin alt ve üst boyutlar arasında köprü kurması.' 
  },
  'Yengeç': { 
    nature: 'şefkatli, koruyucu ve insanları sahiplenen derin', 
    behavior: 'Sadece mantıkla değil, güçlü duygusal sezgilerinizle hareket eder; çevrenize bir güven limanı ve aile sıcaklığı sunarsınız.', 
    esoteric: 'Kozmik rahmin kapısı; ruhun kolektif hafızadan bireysel bedene geçişi ve enkarnasyon.' 
  },
  'Aslan': { 
    nature: 'cömert, yaratıcı, kalpten gelen bir sıcaklık ve vakur', 
    behavior: 'Kendi enerjinizi ortaya koymaktan çekinmez, çevrenize ilham veren ve başkalarını da yücelten doğal bir liderlik sergilersiniz.', 
    esoteric: 'Bireysel bilincin tam uyanışı; ilahi kıvılcımın kalpten dışarıya ışık olarak taşması.' 
  },
  'Başak': { 
    nature: 'özenli, detaylara hakim, arındırıcı ve özverili', 
    behavior: 'Karmaşayı düzenler, eksiklikleri pratik aklınızla giderir ve yaptığınız her işe ustalık, doğallık ve titizlik katarsınız.', 
    esoteric: 'Madde ve ruhun arınması; özverili hizmet, farkındalık ve sadeleşme yoluyla ruhsal dengenin kurulması.' 
  },
  'Terazi': { 
    nature: 'adil, uzlaşmacı, diplomatik bir zarafet ve denge gözeten', 
    behavior: 'Çatışmalar yerine ortak aklı ve uyumu hedefler, ilişkilerde tarafsız bir adalet ve estetik bir ahenk kurarsınız.', 
    esoteric: 'Karma terazisi; "Öteki" üzerinden kendini tanıma ve evrensel dengenin (Maat) sağlanması.' 
  },
  'Akrep': { 
    nature: 'tutkulu, derinlemesine araştıran ve krizlerden güçlenerek çıkan kararlı', 
    behavior: 'Yüzeysel olanla yetinmez, olayların ve insanların en derin katmanlarına iner; kriz anlarında sarsılmaz bir içsel güç sergilersiniz.', 
    esoteric: 'Yenilenme ve içsel simya kapısı; derin duygularla yüzleşerek küllerinden yeniden doğuş yaşamak.' 
  },
  'Yay': { 
    nature: 'iyimser, felsefi, özgürlükçü ve sınırları aşan geniş vizyonlu', 
    behavior: 'Dar kalıplara sığmaz, her deneyimde daha büyük bir anlam arar ve çevrenize umut, ilham ve cesaret aşılarsınız.', 
    esoteric: 'Hakikatin aranışı; sentor doğasından evrensel bilgeliğe doğru atılan ilham oku.' 
  },
  'Oğlak': { 
    nature: 'disiplinli, sorumluluk sahibi, vakur ve hedef odaklı sağlam', 
    behavior: 'Geçici heveslerin değil uzun vadeli başarıların peşinden gider, sabır ve emekle sarsılmaz bir itibar inşa edersiniz.', 
    esoteric: 'Tekamül dağının zirvesi; maddi dünyanın sınırlarının aşılması ve inisiyasyon (Kozmik Kapı).' 
  },
  'Kova': { 
    nature: 'yenilikçi, vizyoner, bağımsız ve toplumsal faydayı gözeten özgür', 
    behavior: 'Geleneksel kalıpları sorgular, özgürlüğünüze tavizsiz sahip çıkar ve geleceğe yön veren özgün çözümler üretirsiniz.', 
    esoteric: 'Kozmik bilginin yeryüzüne dökülmesi; bireyselliğin ötesinde evrensel kardeşlik bilinci.' 
  },
  'Balık': { 
    nature: 'empatik, sezgisel, derin bir şefkat ve teslimiyet taşıyan', 
    behavior: 'İnsanların görülmeyen hassasiyetlerini hisseder, katı kuralları anlayışla yumuşatır ve olaylara evrensel bir bilgelikle yaklaşırsınız.', 
    esoteric: 'Ruhun kaynağa (Okyanusa) dönüşü; tüm illüzyonların (Maya) çözülmesi ve sonsuzluk.' 
  },
};

const DICT_PLANETS: Record<string, { drive: string, action: string, esoteric: string }> = {
  'Güneş': { 
    drive: 'kendinizi ortaya koyma, kendi ışığınızla parlama ve varlığınızı hissettirme arzunuz', 
    action: 'güvenle parlar, ilham verir ve yapıcı bir liderlik sergilersiniz', 
    esoteric: 'İlahi Logos; ruhun bu hayattaki ana frekansı ve uyanış merkezi.' 
  },
  'Ay': { 
    drive: 'içsel huzur bulma, kendinizi güvende hissetme ve duygusal bağlar kurma ihtiyacınız', 
    action: 'hislerinizi derinleştirir, sezgilerinizi besler ve ruhsal bir güven alanı kurarsınız', 
    esoteric: 'Geçmiş yaşamların tortusu; ruhun alıcı, dişil ve yansıtıcı aynası.' 
  },
  'Merkür': { 
    drive: 'çevrenizi anlama, bilgiyi işleme ve düşüncelerinizi berrakça aktarma zihniniz', 
    action: 'fikirlerinizi etkili kılar, bağ kurma hızınızı artırır ve zihinsel çeviklik kazanırsınız', 
    esoteric: 'Hermes; tanrıların habercisi, alt ve üst boyutlar (bilinç ve bilinçaltı) arasındaki köprü.' 
  },
  'Venüs': { 
    drive: 'hayattan tat alma, sevgiyi paylaşma, estetik bir ahenk yaratma ve değer üretme arayışınız', 
    action: 'ilişkilerinize zarafet katar, çekim gücünüzü artırır ve bereketi hayatınıza çekersiniz', 
    esoteric: 'Kozmik uyum ve cazibe yasası; ruhun güzellik ve sevgi aracılığıyla bütünleşmesi.' 
  },
  'Mars': { 
    drive: 'hedeflerinizin peşinden gitme cesaretiniz, sınırlarınızı koruma ve eyleme geçme iradeniz', 
    action: 'kararlılığınızı ateşler, engelleri aşacak dinamizm sağlar ve tutkularınızı somut adımlara dökersiniz', 
    esoteric: 'Kök çakranın ateşi; ruhun maddede var kalma ve evrimsel dürtüsünü sağlayan itici güç.' 
  },
  'Jüpiter': { 
    drive: 'yaşam vizyonunuzu genişletme, büyüme, yeni ufuklar keşfetme ve fırsatları çoğaltma kapasiteniz', 
    action: 'umudunuzu diri tutar, bilgelik kapılarını aralar ve önünüze bereketli kapılar açarsınız', 
    esoteric: 'Guru (İlahi Öğretmen); ruhun inayet, lütuf ve yüksek bilgi aracılığıyla genişlemesi.' 
  },
  'Satürn': { 
    drive: 'hayatta sağlam temeller inşa etme, sabırla olgunlaşma ve sorumluluk üstlenme gücünüz', 
    action: 'karakterinize sarsılmaz bir disiplin kazandırır, sınırlarınızı korur ve kalıcı ustalıklar inşa edersiniz', 
    esoteric: 'Eşiğin Bekçisi (Karmik Lord); ruhun zaman (Kronos) ve sınırlar içindeki tekamül testi.' 
  },
  'Uranüs': { 
    drive: 'kalıpların dışına çıkma, kendi özgünlüğünüzü ilan etme ve yaşamınızı yenileme dürtünüz', 
    action: 'zihninizde ani uyanışlar yaratır, sınırları aşan bir vizyon sunar ve sizi özgürleştirirsiniz', 
    esoteric: 'Kozmik Yıldırım; matrisin (Matrix) dışına çıkış, ani aydınlanma ve zincirlerin kırılması.' 
  },
  'Neptün': { 
    drive: 'evrensel şefkat duyma, hayal gücünüzle ilham alma ve sezgisel derinliğiniz', 
    action: 'katı sınırları eritir, sezgisel algınızı keskinleştirir ve ruhunuza mistik bir dinginlik katarsınız', 
    esoteric: 'İlahi Aşk ve Mistik Çözülme; egonun sınırlarının eriyip birliğe (Vahdet) karışması.' 
  },
  'Plüton': { 
    drive: 'krizleri aşma, küllerinizden yeniden doğma ve köklü içsel dönüşüm gücünüz', 
    action: 'en derin korkuları güce dönüştürür, gerçeği açığa çıkarır ve yenilenme sağlarsınız', 
    esoteric: 'Yeraltı Tanrısı; ruhun en karanlık dehlizlerine inip gölgeyi ışığa dönüştürme simyası.' 
  },
  'Kiron': { 
    drive: 'en derin hassasiyetlerinizden damıttığınız bilgelik ve başkalarına sunduğunuz şifa kapasiteniz', 
    action: 'kendi deneyimlerinizden çevrenize merhem olur ve benzersiz bir empati alanı açarsınız', 
    esoteric: 'Yaralı Şifacı; en derin acının içinden doğan ve başkalarına merhem olan bilgelik.' 
  },
  'Chiron': { 
    drive: 'en derin hassasiyetlerinizden damıttığınız bilgelik ve başkalarına sunduğunuz şifa kapasiteniz', 
    action: 'kendi deneyimlerinizden çevrenize merhem olur ve benzersiz bir empati alanı açarsınız', 
    esoteric: 'Yaralı Şifacı; en derin acının içinden doğan ve başkalarına merhem olan bilgelik.' 
  },
  'Lilith': { 
    drive: 'taviz vermeyen özgür doğanız, bağımsızlığınız ve tabuları yıkan içsel hakikatiniz', 
    action: 'özgün gücünüzü korur ve yapay sınırlara boyun eğmeyen vakur bir duruş sergilersiniz', 
    esoteric: 'Karanlık Ay; ruhun boyun eğmeyen dişil gücü, tabuları yıkan ve özgürleştiren ilksel enerji.' 
  },
  'Kuzey Ay Düğümü': { 
    drive: 'tanıdık konfor alanınızın ötesine geçerek bu hayatta cesaretle yürümeniz gereken asıl tekâmül rotanız', 
    action: 'sizi yeni yetenekler ve büyüme fırsatlarıyla buluşturarak kadersel hedeflerinize doğru güvenle ilerletir', 
    esoteric: 'Ejderhanın Başı; ruhun karmik döngüyü kırıp evrimleşmek için yürümesi gereken bilinmeyen yol.' 
  },
  'Yükselen (ASC)': { 
    drive: 'hayatla ilk temasınız, dış dünyada bıraktığınız ilk izlenim ve dünyaya sunduğunuz yaşamsal canlılığınız', 
    action: 'çevrenize sunduğunuz enerjiyi belirler ve her yeni başlangıçta size özgün bir güç kazandırır', 
    esoteric: 'Ruhun bu enkarnasyondaki aracı (Avatarı); yaşam yolculuğunun başlangıç kapısı.' 
  },
  'Tepe Noktası (MC)': { 
    drive: 'toplum önünde ulaşmak istediğiniz saygınlık, mesleki zirveniz ve dünyaya bırakacağınız kalıcı mirasınız', 
    action: 'hedeflerinizi görünür kılar ve yeteneklerinizin geniş kitlelerce takdir edilmesini sağlar', 
    esoteric: 'Ruhun bu hayattaki magnum opus\'u (Büyük İş); kozmik misyonun dünyevi tezahürü.' 
  },
  'Vertex (Vx)': { 
    drive: 'hayatınızı kökten değiştiren kadersel karşılaşmalarınız ve sizi uyandıran dönüm noktalarınız', 
    action: 'kontrolünüz dışındaki eşzamanlılıklarla sizi kilit insanlarla ve olaylarla buluşturur', 
    esoteric: 'Ruhun diğer varlıklarla yaptığı kutsal kontrat; kişinin kontrolü dışında gelişen, hayatı değiştiren kadersel uyanış kapısı.' 
  },
  'Şans Noktası (POF)': { 
    drive: 'yeteneklerinizle ruhsal bütünlüğünüz hizalandığında hayatınıza zahmetsizce akan kısmet ve neşe kaynağınız', 
    action: 'hayatınızı bereketlendirir ve en doğal yeteneklerinizin meyve vermesini sağlar', 
    esoteric: 'Ruhun, bedenin ve zihnin (Güneş, Ay ve Yükselen) mükemmel uyumlandığı altın oran noktası; ilahi lütfun dünyevi tezahürü.' 
  }
};

const DICT_HOUSES: Record<number, { arena: string, experience: string, domain: string }> = {
  1: { 
    arena: 'kişisel kararlarınızda, dış dünyadaki duruşunuzda ve hayata attığınız ilk adımlarda', 
    experience: 'benliğinizi doğrudan ve güçlü bir biçimde ortaya koymanızı, bağımsız kararlar alabilmenizi ve çevrenizde güçlü bir ilk izlenim bırakmanızı',
    domain: 'kişisel imajınız, bedeniniz ve hayatla ilk temasınız'
  },
  2: { 
    arena: 'maddi kazançlarınızı yönetirken, kendi yeteneklerinizle üretirken ve özdeğer duygunuzu inşa ederken', 
    experience: 'somut kaynaklar üretme gücünüzü artırmanızı, maddi ve manevi güvenliğinizi kendi emeğinizle sarsılmaz biçimde kurmanızı',
    domain: 'maddi kaynaklarınız, özdeğeriniz ve sahip olduklarınız'
  },
  3: { 
    arena: 'gündelik iletişiminizde, öğrenme süreçlerinizde, yakın çevreniz ve kardeşlerinizle kurduğunuz diyaloglarda', 
    experience: 'fikirlerinizi doğrudan ve etkili aktarmanızı, insanlarla hızlı zihinsel bağlar kurmanızı ve güvenilir bir bilgi kaynağı olmanızı',
    domain: 'iletişiminiz, yakın çevreniz ve zihinsel süreçleriniz'
  },
  4: { 
    arena: 'özel yaşamınızda, ailevi bağlarınızda, yuvanızda ve içsel huzurunuzu korurken', 
    experience: 'iç dünyanızda sağlam bir sığınak kurmanızı, sevdiklerinize derin bir aidiyet sunmanızı ve köklerinizden beslenen bir huzur bulmanızı',
    domain: 'kökleriniz, aileniz ve içsel yuvanız'
  },
  5: { 
    arena: 'yaratıcı projelerinizde, aşk hayatınızda, hobilerinizde ve kendinizi sahneleme biçiminizde', 
    experience: 'yaşam enerjinizi büyük bir neşeyle dışa vurmanızı, sanatsal veya üretken tutkularınızda parlamanızı ve kalpten gelen bir özgüven sergilemenizi',
    domain: 'yaratıcılığınız, aşk hayatınız ve kendinizi ifade biçiminiz'
  },
  6: { 
    arena: 'günlük çalışma temponuzda, üstlendiğiniz görevlerde, bedensel sağlığınızda ve başkalarına sunduğunuz hizmetlerde', 
    experience: 'yaşamınızda sağlıklı ve verimli bir ritim kurmanızı, işinizi kusursuz bir düzenle yönetmenizi ve çevrenize vazgeçilmez bir değer katmanızı',
    domain: 'günlük rutinleriniz, çalışma hayatınız ve sağlığınız'
  },
  7: { 
    arena: 'ikili ilişkilerinizde, evliliğinizde, ortaklıklarınızda ve hayatı paylaştığınız insanlarla bağ kurarken', 
    experience: 'karşılıklı saygı ve güvene dayalı dengeli bağlar kurmanızı, ilişkiler üzerinden kendi potansiyelinizi keşfetmenizi ve uyumlu ortaklıklar yürütmenizi',
    domain: 'ikili ilişkileriniz, evliliğiniz ve ortaklıklarınız'
  },
  8: { 
    arena: 'hayatın kriz anlarında, müşterek kaynakların yönetiminde ve derin psikolojik yenilenme süreçlerinde', 
    experience: 'zorluklar karşısında sarsılmadan ayakta kalmanızı, eski kalıpları serbest bırakarak her deneyimden daha güçlü ve arınmış olarak doğmanızı',
    domain: 'dönüşüm potansiyeliniz ve derinleşme kapasiteniz'
  },
  9: { 
    arena: 'hayat felsefenizi oluştururken, yeni kültürler ve yüksek bilgiler keşfederken ve uzak hedeflere yürürken', 
    experience: 'ufkunuzu sürekli geniş tutmanızı, inançlarınızı samimiyetle yaşamanızı ve çevrenize ilham veren bilge bir hayat görüşü sunmanızı',
    domain: 'inançlarınız, yaşam felsefeniz ve yüksek vizyonunuz'
  },
  10: { 
    arena: 'kariyerinizde, hedeflerinize ilerlerken ve toplum önünde saygınlık kazanırken', 
    experience: 'mesleki alanda güçlü bir itibar inşa etmenizi, yeteneklerinizin takdir görmesini ve kalıcı bir iz bırakacak saygın bir konuma ulaşmanızı',
    domain: 'kariyeriniz, toplumsal itibarınız ve hedefleriniz'
  },
  11: { 
    arena: 'sosyal çevrenizde, dostluklarınızda, ekip çalışmalarında ve geleceğe yönelik ortak ideallerde', 
    experience: 'insanları ortak bir amaç etrafında toplama gücünüzü artırmanızı, kolektife değer katan projelerde güvenilir ve vizyoner bir rol üstlenmenizi',
    domain: 'sosyal çevreniz ve vizyoner idealleriniz'
  },
  12: { 
    arena: 'içsel dünyanızda, yalnız kaldığınız anlarda, bilinçaltı arınma süreçlerinizde ve ruhsal dinginliğinizde', 
    experience: 'dış dünyanın gürültüsünden sıyrılıp içsel bilgeliğinize güvenmenizi, derin sezgilerinizle şifalanmanızı ve yaşama tam bir teslimiyetle huzur bulmanızı',
    domain: 'bilinçaltı potansiyeliniz ve ruhsal dinginliğiniz'
  }
};

export function getFullPlanetInterpretation(planetName: string, signName: ZodiacSign, houseNum: number, isDraconic: boolean = false): { title: string, content: string } {
  const planet = DICT_PLANETS[planetName] || DICT_PLANETS[planetName.replace(' ', '')];
  const sign = DICT_SIGNS[signName];
  const house = DICT_HOUSES[houseNum];

  if (!planet || !sign || !house) return { title: 'Bilinmeyen Yerleşim', content: 'Bu yerleşim için detaylı bir metin üretilemedi.' };

  const title = `${planetName} - ${signName} Burcunda ve ${houseNum}. Evde${isDraconic ? ' (Drakonik)' : ''}`;
  
  if (isDraconic) {
    const content = `BÜTÜNLEŞİK RUHSAL SÖZLEŞME VE TEKÂMÜL ANALİZİ:\n` +
      `Drakonik haritanız, ruhunuzun bu bedene ve hayata gelmeden önce belirlediği derin ruhsal sözleşmeyi ifade eder. Bu yerleşimde ${planet.drive}; ${sign.nature} bir yaklaşımla şekillenerek ruhunuzun asıl tekâmül amacının "${sign.esoteric}" olduğunu fısıldar.\n\n` +
      `${house.arena} karşınıza çıkan deneyimler, sıradan tesadüfler değil; ruhunuzun tekâmül etmek ve içsel olgunluğa kavuşmak için bizzat seçtiği kadersel uyanış kapılarıdır. Egonun geçici kalıplarını aşıp bu potansiyeli bilinçle yaşadığınızda; ${planet.action}. Bu derinleşme sizi nihai olarak ${planet.esoteric} seviyesine taşıyacaktır.`;
    return { title, content };
  }

  const content = `BÜTÜNLEŞİK YAŞAMSAL ANALİZ:\n` +
    `Hayatta en çok ${house.arena} ${sign.nature} bir duruş sergilediğinizde parlarsınız. ${planet.drive}; ${sign.behavior}\n\n` +
    `Bu yaklaşımınız, ${house.arena} ${house.experience} sağlar. Bu alanda yüzeysel kurallar veya geçici hevesler yerine kendi hakiki mizacınızı ortaya koyduğunuzda; ${planet.action}.\n\n` +
    `EZOTERİK ANLAM:\n` +
    `Geleneksel okumanın ötesinde, bu yerleşim çok daha derin bir spiritüel gerçeği fısıldar. ${planetName} enerjisi (${planet.esoteric}), ${signName} formunda vücut bularak (${sign.esoteric}) ruhun tekamülüne hizmet etmektedir. Bu kadersel mühür, ${houseNum}. evin sırlarını çözmeniz ve potansiyelinizi uyandırmanız için değerli bir anahtardır.`;

  return { title, content };
}

export function getHouseCuspInterpretation(houseNum: number, signName: ZodiacSign): { title: string, content: string } {
  const house = DICT_HOUSES[houseNum];
  const sign = DICT_SIGNS[signName];

  if (!house || !sign) return { title: 'Bilinmeyen Ev', content: 'Bu ev için detaylı bir metin üretilemedi.' };

  let title = `${houseNum}. Ev Girişi - ${signName}`;
  if (houseNum === 1) title = `Yükselen (ASC) - 1. Ev - ${signName}`;
  if (houseNum === 10) title = `Tepe Noktası (MC) - 10. Ev - ${signName}`;
  if (houseNum === 4) title = `Ayak Ucu (IC) - 4. Ev - ${signName}`;
  if (houseNum === 7) title = `Alçalan (DSC) - 7. Ev - ${signName}`;

  const content = `BÜTÜNLEŞİK YAŞAMSAL ANALİZ:\n` +
    `Yaşamınızda en çok ${house.arena}; ${sign.nature} bir yaklaşımla hareket edersiniz. ${sign.behavior}\n\n` +
    `Bu doğal duruşunuz, ${house.arena} ${house.experience} sağlar. Olayları karşılarken kendi doğallığınızı ve içsel dengenizi koruduğunuzda, bu yaşam alanında karşılaştığınız her deneyim sizi olgunlaştıran ve kişisel gücünüzü artıran değerli bir fırsata dönüşür.\n\n` +
    `EZOTERİK ANLAM:\n` +
    `Ruhsal tekamül perspektifinden bakıldığında; ${sign.esoteric} Bu yaşam alanına yaklaştığınızda, derin ruhsal bilgeliği tecrübe edebilir ve yaşamınıza katarak içsel bütünlüğünüzü güçlendirebilirsiniz.`;

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

  if (!p1 || !p2 || !aspect) return { title: 'Bilinmeyen Etkileşim', content: 'Bu etkileşim için detaylı bir metin üretilemedi.' };

  const title = `${planet1Name} ve ${planet2Name} ${aspectType} Etkileşimi`;

  const content = `BÜTÜNLEŞİK DİNAMİK ANALİZİ:\n` +
    `İç dünyanızda ${p1.drive} ile ${p2.drive} birbiriyle doğrudan rezonansa girer. Bu etkileşim, ${aspect.meaning} gösterir.\n\n` +
    `Günlük hayatınızda bu iki enerjiyi bir arada deneyimlerken bir taraftan ${p1.action}, diğer taraftan ${p2.action}. Bu iki güç arasında kuracağınız bilinçli denge, karakterinizdeki en belirgin, yaratıcı ve dönüştürücü potansiyellerden birini açığa çıkarır.\n\n` +
    `EZOTERİK ANLAM (KARMİK DİNAMİK):\n` +
    `${aspect.esoteric} Ruhsal tekamülünüzde ${planet1Name} (${p1.esoteric}) ile ${planet2Name} (${p2.esoteric}) arasındaki bu kozmik senkronizasyon, kaderinizin eşsiz ve dönüştürücü bir anahtarını temsil etmektedir.`;

  return { title, content };
}
