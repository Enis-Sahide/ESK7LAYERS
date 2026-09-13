// Mundane (Kolektif / Gökyüzü) Açı ve Yerleşim Yorumları Sözlüğü

export interface SkyAspectInterpretation {
  title: string;
  category: 'Kadersel' | 'Kişisel' | 'Dönüşüm';
  energyType: 'Destekleyici' | 'Zorlayıcı / Sınav' | 'Kavuşum / Odaklanma';
  summary: string;
  collectiveTheme: string;
  dailyAdvice: string;
  chakraResonance: string;
}

const PLANET_ARCHETYPES: Record<string, { archetype: string; nature: string }> = {
  'Güneş': { archetype: 'Bilinç, Canlılık, Liderlik & Yaşam Gücü', nature: 'Aydınlatıcı, görünür kılan ve odak noktası oluşturan' },
  'Ay': { archetype: 'Kolektif Ruh Hali, Duygusal Dalgalar & Halkın Bilinci', nature: 'Hızlı değişen, sezgisel ve besleyici' },
  'Merkür': { archetype: 'İletişim, Ticaret, Zihinsel Akış & Bilgi Trafiği', nature: 'Bağlayıcı, analiz eden ve veri aktaran' },
  'Venüs': { archetype: 'İlişkiler, Değerler, Sanat & Finansal Akış', nature: 'Uyum arayan, birleştirici ve estetik' },
  'Mars': { archetype: 'Eylem, İrade, Mücadele & Cesaret', nature: 'Ateşleyici, harekete geçiren ve rekabetçi' },
  'Jüpiter': { archetype: 'Bolluk, Felsefe, Genişleme & Şans', nature: 'Büyüten, vizyon katan ve bereket getiren' },
  'Satürn': { archetype: 'Sorumluluk, Zaman, Sınırlar & Yapılanma', nature: 'Test eden, disipline eden ve kalıcılık sağlayan' },
  'Uranüs': { archetype: 'Uyanış, Ani Değişim, Özgürlük & Teknoloji', nature: 'Kalıpları kıran, sarsıcı ve yenilikçi' },
  'Neptün': { archetype: 'Ruhsallık, İlham, Hayal Gücü & Çözülme', nature: 'Sınırları eriten, şefkatli ama sisli' },
  'Plüton': { archetype: 'Dönüşüm, Güç, Küllerinden Doğuş & Krizler', nature: 'Yeniden yapılandıran, derin ve köklü' },
  'Kiron': { archetype: 'Kolektif Şifa, Hassasiyet & Bilge Yaralı', nature: 'Duyarlılık kazandıran ve kalbi onaran' },
};

// Bilinen önemli majör kombinasyonlar için özel kolektif yorumlar
const SPECIAL_COMBINATIONS: Record<string, Record<string, { summary: string; collective: string; advice: string }>> = {
  'Güneş-Merkür': {
    'Kavuşum': {
      summary: 'Merkür Cazimi / Güneşin Kalbinde: Zihinsel berraklık, önemli fikirlerin doğuşu ve güçlü iletişim dalgası.',
      collective: 'Kolektif zihinde kararların netleştiği, önemli anlaşmaların ve duyuruların yapıldığı çok güçlü bir uyanış zamanı.',
      advice: 'Aklınıza gelen fikirleri not edin, önemli görüşmeleri ve imzaları bu etki altındayken değerlendirin.'
    }
  },
  'Mars-Satürn': {
    'Kavuşum': {
      summary: 'Fren ve Gazın Buluşması: Kararlılık, sabır ve yüksek disiplin gerektiren somut inşa dönemi.',
      collective: 'Kolektifte kuralların sıkılaştığı, otorite ile bireysel irade arasında dengelerin sınandığı, sabredenlerin kazandığı bir enerji.',
      advice: 'Aceleci öfkeye kapılmayın. Enerjinizi uzun vadeli, stratejik ve kalıcı işlere yönlendirin.'
    },
    'Kare': {
      summary: 'Engellerle Yüzleşme ve Sabır Sınavı: Harekete geçmek isterken duvarlara çarpma hissi.',
      collective: 'Toplumsal gerilimlerin, gecikmelerin ve bürokratik engellerin arttığı bir dönem. Öfkeyle kalkan zararla oturur.',
      advice: 'Zorla kapı açmaya çalışmayın. Sakin kalın, stratejinizi gözden geçirin ve bedensel sağlığınıza ekstra dikkat edin.'
    },
    'Karşıt': {
      summary: 'Baskı ve Karşılaşmalar: İki zıt gücün çekişmesi, irade ile sınırların karşı karşıya gelmesi.',
      collective: 'Çatışma riskinin yükseldiği, sınırların zorlandığı ve diplomatik esnekliğin hayati olduğu bir transit.',
      advice: 'Güç gösterilerinden uzak durun. Haklı olmaya değil, yapıcı olmaya odaklanın.'
    }
  },
  'Jüpiter-Satürn': {
    'Kavuşum': {
      summary: 'Büyük Döngü (Great Conjunction): Sosyo-ekonomik sistemlerin ve kolektif yapıların yeniden inşası.',
      collective: 'Eski yapıların elenip yerine yepyeni 20 yıllık küresel paradigmaların kurulduğu tarihi eşik.',
      advice: 'Gelecek planlarınızı gerçekçi temellere oturtun; hayallerinizle disiplini sentezleyin.'
    },
    'Kare': {
      summary: 'Büyüme vs Sınırlar: Genişleme arzusu ile gerçekliğin gerektirdiği kısıtlamaların mücadelesi.',
      collective: 'Ekonomik dalgalanmalar, aşırı iyimserliğin bütçe kısıtlamalarına çarpması ve strateji revizyonları.',
      advice: 'Riskleri iyi hesaplayın. Boyunuzu aşan borçlanma veya yatırımlardan kaçının.'
    }
  },
  'Jüpiter-Uranüs': {
    'Kavuşum': {
      summary: 'Kozmik Şans ve Devrimsel Uyanış: Beklenmedik teknolojik, finansal ve zihinsel sıçramalar.',
      collective: 'Yapay zeka, bilim, finansal sistemler ve özgürlük alanlarında çığır açıcı ani devrimler.',
      advice: 'Eski alışkanlıkları bırakın. Yeni dünyaya, teknolojiye ve yenilikçi fırsatlara cesaretle adım atın.'
    }
  },
  'Mars-Plüton': {
    'Kare': {
      summary: 'Yüksek Adrenalin ve Güç Mücadelesi: Bastırılmış öfkelerin yüzeye çıkması ve kontrol savaşı.',
      collective: 'Kolektifte gerilimli olaylar, manipülatif güç dengeleri ve kriz yönetimi gerektiren durumlar.',
      advice: 'Provokasyonlara gelmeyin. Fiziksel enerjinizi spor, üretim veya arınma çalışmalarıyla topraklayın.'
    },
    'Kavuşum': {
      summary: 'Yenilmez İrade ve Derin Dönüşüm: Yıkıcı veya muazzam yapıcı olabilen atomik güç birleşimi.',
      collective: 'Kolektif düzeyde büyük hedeflere kilitlenme, köklü reformlar ve tavizsiz bir kararlılık.',
      advice: 'Gücünüzü başkalarını ezmek için değil, hayatınızdaki çürümüş durumları temizlemek için kullanın.'
    }
  },
  'Venüs-Jüpiter': {
    'Kavuşum': {
      summary: 'İki İyicilin Buluşması: Sevgi, bereket, kutlama ve cömertlik kapılarının ardına kadar açılması.',
      collective: 'Toplumda neşe, sanat, evlilikler, finansal rahatlama ve barışçıl diplomasi rüzgarları.',
      advice: 'Sosyal ilişkilerinizi güçlendirin, kalbinizi cömertçe açın ve fırsatları neşeyle karşılayın.'
    },
    'Üçgen': {
      summary: 'Kozmik Zarafet ve Şans: İlişkilerde ve kazançlarda tatlı, çabasız bir bolluk akışı.',
      collective: 'İyimserlik, yaratıcı sanatsal başarılar ve karşılıklı güven ortamı.',
      advice: 'Güzellikleri hayatınıza çekin, barışmak istediğiniz kişilerle adım atın.'
    }
  }
};

export function getSkyAspectInterpretation(
  planet1: string,
  planet2: string,
  aspectType: string
): SkyAspectInterpretation {
  const p1 = planet1;
  const p2 = planet2;
  const key1 = `${p1}-${p2}`;
  const key2 = `${p2}-${p1}`;

  const isHarmonious = aspectType === 'Üçgen' || aspectType === 'Sekstil';
  const isChallenging = aspectType === 'Kare' || aspectType === 'Karşıt';
  const isConjunction = aspectType === 'Kavuşum';

  let energyType: SkyAspectInterpretation['energyType'] = 'Destekleyici';
  if (isChallenging) energyType = 'Zorlayıcı / Sınav';
  else if (isConjunction) energyType = 'Kavuşum / Odaklanma';

  let category: SkyAspectInterpretation['category'] = 'Kişisel';
  const outerPlanets = ['Jüpiter', 'Satürn', 'Uranüs', 'Neptün', 'Plüton'];
  if (outerPlanets.includes(p1) && outerPlanets.includes(p2)) {
    category = 'Kadersel';
  } else if (p1 === 'Plüton' || p2 === 'Plüton' || p1 === 'Neptün' || p2 === 'Neptün') {
    category = 'Dönüşüm';
  }

  // Check special handbook
  const specialMatch = SPECIAL_COMBINATIONS[key1]?.[aspectType] || SPECIAL_COMBINATIONS[key2]?.[aspectType];
  if (specialMatch) {
    return {
      title: `${p1} - ${p2} ${aspectType} Açısı`,
      category,
      energyType,
      summary: specialMatch.summary,
      collectiveTheme: specialMatch.collective,
      dailyAdvice: specialMatch.advice,
      chakraResonance: getChakraResonance(p1, p2)
    };
  }

  // Algorithmic synthesis for all other pairs
  const arch1 = PLANET_ARCHETYPES[p1] || { archetype: p1, nature: 'etkili' };
  const arch2 = PLANET_ARCHETYPES[p2] || { archetype: p2, nature: 'etkili' };

  let summary = '';
  let collectiveTheme = '';
  let dailyAdvice = '';

  if (isConjunction) {
    summary = `${p1} ve ${p2} güçlerini gökyüzünde birleştiriyor. Bu kavuşum, ${arch1.archetype} ile ${arch2.archetype} temalarını tek bir güçlü odakta toplar.`;
    collectiveTheme = `Kolektif alanda ${p1}'in ${arch1.nature} etkisiyle ${p2}'nin enerjisi kaynaşır. Yeni bir döngünün tohumları atılır.`;
    dailyAdvice = `Bu iki gezegenin temsil ettiği alanlarda yoğunlaşma yaşanacaktır. Zihninizi dağıtmadan hedefinize odaklanın.`;
  } else if (aspectType === 'Kare') {
    summary = `${p1} ile ${p2} arasında 90° gerilimli kare açı: Harekete geçiren dinamik bir sürtünme ve farkındalık zorunluluğu.`;
    collectiveTheme = `${arch1.archetype} ile ${arch2.archetype} arasında bir meydan okuma söz konusudur. Çatışmalar yapısal değişimleri tetikler.`;
    dailyAdvice = `Fevri tepkilerden kaçının. Gerilimi yapıcı eylemlere ve somut disiplinli adımlara dönüştürün.`;
  } else if (aspectType === 'Karşıt') {
    summary = `${p1} ile ${p2} arasında 180° karşıt açı: İki kutup arasında denge kurma ve ayna tutulma zamanı.`;
    collectiveTheme = `Kolektifte karşıt görüşlerin, kutuplaşmaların veya tarafların yüzleştiği bir atmosfer hakim olur.`;
    dailyAdvice = `Tek taraflı ısrarcı olmak yerine orta yolu bulun. Karşı tarafın bakış açısını anlamaya çalışın.`;
  } else if (aspectType === 'Üçgen') {
    summary = `${p1} ile ${p2} arasında 120° akıcı üçgen açı: Kolaylaşan enerji akışı, kozmik destek ve çabasız uyum.`;
    collectiveTheme = `${arch1.archetype} ve ${arch2.archetype} birbirine pürüzsüz destek vererek kolektif moral ve bereketi yükseltir.`;
    dailyAdvice = `Önünüze çıkan fırsatları değerlendirin. Bu akıcı enerjiyi projelerinizi hızlandırmak için kullanın.`;
  } else if (aspectType === 'Sekstil') {
    summary = `${p1} ile ${p2} arasında 60° sekstil açı: İletişim, yeni kapılar ve eyleme geçildiğinde meyve veren fırsatlar.`;
    collectiveTheme = `Yaratıcı çözümlerin, yapıcı diyalogların ve karşılıklı anlayışın kolektifte arttığı bir evre.`;
    dailyAdvice = `Fırsatlar kapınızı çalabilir ancak içeri almak için sizin adım atmanız gerekir. Girişimci olun.`;
  } else {
    summary = `${p1} ile ${p2} gökyüzünde ${aspectType} açısı kuruyor.`;
    collectiveTheme = `Kolektif bilinci incelikli şekilde etkileyen astrolojik bir etkileşim.`;
    dailyAdvice = `Günün enerjisine uyum sağlamak için sakin ve dengede kalın.`;
  }

  return {
    title: `${p1} - ${p2} ${aspectType} Açısı`,
    category,
    energyType,
    summary,
    collectiveTheme,
    dailyAdvice,
    chakraResonance: getChakraResonance(p1, p2)
  };
}

function getChakraResonance(p1: string, p2: string): string {
  const combined = `${p1} ${p2}`;
  if (combined.includes('Satürn') || combined.includes('Plüton')) {
    return '1. Kök Çakra (Muladhara) - Yapılanma, Sınırlar & Güven';
  }
  if (combined.includes('Venüs') || combined.includes('Ay')) {
    return '4. Kalp Çakra (Anahata) - Sevgi, Şefkat & Değerler';
  }
  if (combined.includes('Mars') || combined.includes('Güneş')) {
    return '3. Solar Pleksus (Manipura) - İrade, Cesaret & Eylem';
  }
  if (combined.includes('Merkür') || combined.includes('Uranüs')) {
    return '5. Boğaz Çakrası (Vishuddha) - Hakikat, İletişim & Uyanış';
  }
  if (combined.includes('Jüpiter') || combined.includes('Kiron')) {
    return '6. Üçüncü Göz (Ajna) - Bilgelik, Sezgi & Yüksek Anlayış';
  }
  return '7. Taç Çakrası (Sahasrara) - Kolektif Bilinç & Kozmik Uyum';
}

const SIGN_DATA: Record<string, { element: string; quality: string; theme: string; advice: string }> = {
  'Koç': {
    element: 'Ateş',
    quality: 'Öncü',
    theme: 'Cesaret, yeni başlangıçlar, sabırsızlık, bağımsızlık ve öncülük dürtüsü.',
    advice: 'İnisiyatif alın, korkularınızın üzerine gidin ancak öfkeyle fevri köprüleri yakmamaya özen gösterin.'
  },
  'Boğa': {
    element: 'Toprak',
    quality: 'Sabit',
    theme: 'Maddi güvenlik, kalıcılık, bedensel hazlar, sabır, değerler ve doğayla bağ.',
    advice: 'Somut ve sağlam temeller atın, bütçenizi koruyun, acele etmeden adım adım ilerleyin.'
  },
  'İkizler': {
    element: 'Hava',
    quality: 'Değişken',
    theme: 'Merak, çok yönlü iletişim, bilgi akışı, zihinsel hareketlilik ve sosyallik.',
    advice: 'Yeni şeyler öğrenin, fikirlerinizi paylaşın; ancak zihinsel dağınıklığa ve dedikoduya kapılmayın.'
  },
  'Yengeç': {
    element: 'Su',
    quality: 'Öncü',
    theme: 'Duygusal derinlik, aile, yuva, aidiyet, koruma içgüdüsü ve sezgisellik.',
    advice: 'Sevdiklerinizi sarıp sarmalayın, iç sesinize kulak verin; geçmişin nostaljisine veya alınganlıklara takılıp kalmayın.'
  },
  'Aslan': {
    element: 'Ateş',
    quality: 'Sabit',
    theme: 'Yaratıcılık, sahne, özgüven, liderlik, cömertlik ve yaşam sevinci.',
    advice: 'Yeteneklerinizi cesurca sergileyin, kalbinizin sesini takip edin; kibir ve aşırı onay ihtiyacından kaçının.'
  },
  'Başak': {
    element: 'Toprak',
    quality: 'Değişken',
    theme: 'Detaylar, düzen, pratik fayda, sağlık, hizmet bilinci ve mükemmeliyetçilik.',
    advice: 'İşlerinizi organize edin, bedeninize ve beslenmenize özen gösterin; aşırı eleştirel olmaktan kaçının.'
  },
  'Terazi': {
    element: 'Hava',
    quality: 'Öncü',
    theme: 'Denge, adalet, estetik, diplomasi, ikili ilişkiler ve uzlaşma arayışı.',
    advice: 'İlişkilerinizde hakkaniyeti gözetin, zarif ve yapıcı olun; kararsızlık tuzağına düşmeyin.'
  },
  'Akrep': {
    element: 'Su',
    quality: 'Sabit',
    theme: 'Derin dönüşüm, kriz yönetimi, sezgisel güç, tutku ve yüzleşmeler.',
    advice: 'Korkularınızla yüzleşin, çürümüş olanı bırakın; takıntı ve intikam duygularından arının.'
  },
  'Yay': {
    element: 'Ateş',
    quality: 'Değişken',
    theme: 'Yüksek vizyon, felsefe, uzak ufuklar, inanç, iyimserlik ve macera.',
    advice: 'Ufkunuzu genişletin, yeni felsefeler keşfedin; aşırı fanatizm ve abartılı vaatlerden uzak durun.'
  },
  'Oğlak': {
    element: 'Toprak',
    quality: 'Öncü',
    theme: 'Sorumluluk, disiplin, kariyer, uzun vadeli hedefler ve somut başarı.',
    advice: 'Hedeflerinize sadık kalın, sabırla inşa edin; aşırı katılık ve karamsarlıktan sakının.'
  },
  'Kova': {
    element: 'Hava',
    quality: 'Sabit',
    theme: 'Özgürlük, teknoloji, sıra dışı fikirler, kolektif idealler ve hümanizm.',
    advice: 'Kalıpların dışına çıkın, toplumsal fayda üreten projelere katılın; duygusal olarak buz kesmeyin.'
  },
  'Balık': {
    element: 'Su',
    quality: 'Değişken',
    theme: 'Koşulsuz sevgi, teslimiyet, ilham, rüyalar, maneviyat ve şifa.',
    advice: 'Meditasyon ve sanatla ruhunuzu besleyin, akışa güvenin; kurban psikolojisine ve kaçışlara sapmayın.'
  }
};

const PLANET_TRANSIT_THEMES: Record<string, { nature: string; focus: string; chakra: string }> = {
  'Güneş': {
    nature: 'Kozmik bilinç, yaşam enerjisi, canlılık ve kolektif odak noktası.',
    focus: 'Güneş bu burçtan geçerken genel dikkat ve toplumun ana gündemi bu burcun nitelikleriyle aydınlanır.',
    chakra: '3. Solar Pleksus (Manipura) - Benlik & İrade'
  },
  'Ay': {
    nature: 'Kolektif duygulanım, anlık halk psikolojisi, sezgiler ve günlük ruh hali.',
    focus: 'Ay bu burçtayken (yaklaşık 2.5 gün) duygusal tepkilerimiz ve içgüdüsel ihtiyaçlarımız bu burcun rengine bürünür.',
    chakra: '4. Kalp Çakrası (Anahata) - Duygusal Denge'
  },
  'Merkür': {
    nature: 'Zihinsel akış, iletişim dili, ticaret, haberleşme ve veri trafiği.',
    focus: 'Merkür bu burçtayken kararlarımız, konuşma üslubumuz ve düşünce sistemimiz bu burcun filtreleriyle çalışır.',
    chakra: '5. Boğaz Çakrası (Vishuddha) - İfade & Algı'
  },
  'Venüs': {
    nature: 'İlişkiler, sevgi frekansı, estetik zevkler ve finansal değer algısı.',
    focus: 'Venüs bu burçtayken insan ilişkilerinde aranan nitelikler ve para harcama eğilimleri bu burcun temasıyla şekillenir.',
    chakra: '4. Kalp Çakrası (Anahata) - Sevgi & Değer'
  },
  'Mars': {
    nature: 'Eylem gücü, cesaret, mücadele tarzı, libido ve fiziksel canlılık.',
    focus: 'Mars bu burçtayken enerjimizi nasıl harcadığımız, hedeflere nasıl saldırdığımız ve çatışmaları nasıl yönettiğimiz belirlenir.',
    chakra: '1. Kök & 3. Solar Pleksus - Harekete Geçiş'
  },
  'Jüpiter': {
    nature: 'Büyüme, bereket, yüksek felsefe, şans ve inanç genişlemesi.',
    focus: 'Jüpiter bu burçta kaldığı yaklaşık 1 yıl boyunca bu burcun temsil ettiği alanlarda kolektif büyüme ve fırsat pencereleri açar.',
    chakra: '6. Üçüncü Göz (Ajna) - Vizyon & Bilgelik'
  },
  'Satürn': {
    nature: 'Karmik sınavlar, olgunlaşma, zaman, sınırlar ve sistem inşası.',
    focus: 'Satürn bu burçta kaldığı 2.5-3 yıl boyunca gevşek yapıları test eder, sorumluluk almayı öğretir ve kalıcı yapılar kurdurur.',
    chakra: '1. Kök Çakra (Muladhara) - Disiplin & Sağlam Temel'
  },
  'Uranüs': {
    nature: 'Ani uyanışlar, devrimler, teknolojik sıçramalar ve kalıp yıkıcı özgürlük.',
    focus: 'Uranüs bu burçta kaldığı 7 yıl boyunca bu burcun tüm geleneksel kalıplarını şok dalgalarıyla sarsarak yeni çağa uyarlar.',
    chakra: '5. Boğaz & 7. Taç - Deha & Özgürleşme'
  },
  'Neptün': {
    nature: 'Ruhsal çözülme, ilahi aşk, sezgisel derinlik, sanat ve bazen yanılsamalar.',
    focus: 'Neptün bu burçta kaldığı 14 yıl boyunca sınırları eritir, kolektif idealleri ve manevi arayışı bu burcun dilinden yükseltir.',
    chakra: '6. Üçüncü Göz & 7. Taç - Mistik Birlik'
  },
  'Plüton': {
    nature: 'Kökten dönüşüm, küllerinden doğuş, güç mücadeleleri ve kolektif krizler.',
    focus: 'Plüton bu burçta kaldığı 15-20 yıl boyunca insanlık tarihinin temel paradigmalarını yıkarak baştan aşağı yeniden yapılandırır.',
    chakra: '1. Kök & Kundalini - Atomik Yenilenme'
  },
  'Kiron': {
    nature: 'Yaralı şifacı, ruhun en derin duyarlılığı ve bilgelik kapısı.',
    focus: 'Kiron bu burçtayken kolektif hassasiyetlerimizi tetikleyerek yaralarımızdan şifa ve empati üretmemizi sağlar.',
    chakra: '4. Kalp & 6. Üçüncü Göz - İçsel Şifa'
  },
  'Kuzey Ay Düğümü': {
    nature: 'Ruhun kadersel tekamül rotası ve kolektifin gitmesi gereken evrimsel yön.',
    focus: 'Ay Düğümü bu burçtayken insanlık bilincinin cesaretle adım atması ve öğrenmesi gereken yeni dersleri simgeler.',
    chakra: '7. Taç Çakrası (Sahasrara) - Kadersel Akış'
  }
};

export function getSkyPlanetSignInterpretation(
  planetName: string,
  signName: string,
  degree: number,
  minutes: number,
  isRetrograde?: boolean
): { title: string; content: string; extra?: string } {
  const pInfo = PLANET_TRANSIT_THEMES[planetName] || {
    nature: `${planetName} gezegeninin kozmik frekansı`,
    focus: 'Gezegenin burç yerleşimi güncel enerjiyi etkiler.',
    chakra: 'Kozmik Rezonans'
  };

  const sInfo = SIGN_DATA[signName] || {
    element: 'Kozmik',
    quality: 'Evrensel',
    theme: `${signName} burcunun nitelikleri`,
    advice: 'Dengede ve farkındalıkla kalın.'
  };

  const formattedPos = `${degree}° ${String(minutes).padStart(2, '0')}'`;
  const retroTag = isRetrograde ? ' (Retro / Rx)' : '';
  const title = `Transit ${planetName} ${signName} Burcunda ${formattedPos}${retroTag}`;

  let retroSection = '';
  if (isRetrograde) {
    retroSection = `\n\n【Retro (Geri Hareket / Rx) Anlamı & Dersi】\n${planetName} şu anda gökyüzünde geri harekette (Rx) seyrediyor. Astrolojide gezegenlerin retro olması, o gezegenin temsil ettiği temaların dış dünyadan ziyade içsel dünyaya yönelmesi demektir. Bu süreçte:\n` +
      `• Geçmişte tamamlanmamış konular, dersler veya yüzleşmeler tekrar önünüze gelebilir.\n` +
      `• Dışarıda agresif yeni adımlar atmak yerine, mevcut durumu gözden geçirmek, tamir etmek, yeniden planlamak ve içsel muhasebe yapmak çok daha hayırlıdır.\n` +
      `• Acele kararlar vermeyin; gecikmeler birer ceza değil, rotanızı doğru ayarlamanız için evrenin tanıdığı birer nefes alma molasıdır.`;
  }

  const content = `【Gezegen Doğası & Anlık Konum】\n${planetName}, astrolojide ${pInfo.nature} temsil eder. Şu anda ${signName} burcunun ${formattedPos} derecesinde seyrediyor.\n\n` +
    `【Kolektif & Küresel Etki】\n${pInfo.focus}\n${signName} burcunun ${sInfo.element} elementi ve ${sInfo.quality} niteliğiyle birleştiğinde; toplumda ve dünyada ${sInfo.theme} temaları çok güçlü bir şekilde ön plana çıkar.\n\n` +
    `【Bireysel Tavsiye & Kozmik Rehberlik】\n✓ ${sInfo.advice}\nBu enerjiyi günlük hayatınızda yapıcı kullanmak için ${signName} burcunun yüksek frekansını benimseyin, gölge yönlerinden uzak durun.${retroSection}`;

  const extra = `${sInfo.element} Elementi • ${sInfo.quality} Nitelik • Çakra: ${pInfo.chakra}`;

  return { title, content, extra };
}
