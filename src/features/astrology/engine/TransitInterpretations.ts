// Transit Interpretations Dictionary

export function getTransitHouseInterpretation(transitPlanet: string, house: number): { title: string, content: string } {
  const planetNames: Record<string, string> = {
    'Güneş': 'yaşam enerjiniz, odağınız ve benliğiniz',
    'Ay': 'duygusal dünyanız, anlık ruh haliniz ve hisleriniz',
    'Merkür': 'zihniniz, düşünceleriniz, kararlarınız ve iletişim diliniz',
    'Venüs': 'ilişkileriniz, sevgi arayışınız, keyif aldığınız konular ve maddi değerleriniz',
    'Mars': 'fiziksel enerjiniz, cesaretiniz, motivasyonunuz ve mücadele gücünüz',
    'Jüpiter': 'şansınız, büyüme fırsatlarınız, inançlarınız ve bolluk enerjiniz',
    'Satürn': 'sorumluluklarınız, vermeniz gereken önemli sınavlar ve hayatı yapılandırma alanınız',
    'Uranüs': 'hayatınızdaki ani sürprizler, uyanışlar ve özgürleşme alanınız',
    'Neptün': 'hayal gücünüz, sezgileriniz, ruhsal derinliğiniz ve bazen kafa karışıklıklarınız',
    'Plüton': 'derin dönüşümleriniz, küllerinden yeniden doğma gücünüz ve krizleri aşma enerjiniz',
    'Kiron': 'ruhun en derin hassasiyetleri, şifalanma kapılarınız ve hassas yönleriniz'
  };

  const houseThemes: Record<number, string> = {
    1: 'doğrudan kendinize, dış görünüşünüze ve kişisel kararlarınıza yöneliyor. Bu dönemde çevrenize kendinizi göstermek, yeni başlangıçlar yapmak ve bedeninize özen göstermek isteyeceksiniz. Yeni bir imaj veya kişisel adım atmak için harika bir zamandır.',
    2: 'maddi konulara, kazançlarınıza, sahip olduklarınıza ve özgüveninize odaklanıyor. Bütçenizi düzene sokmak, yeni gelir kapıları aramak ve kendi değerinizi sorgulamak bu dönemin ana konularıdır.',
    3: 'yakın çevre ilişkilerinize, kardeşlerinize, alacağınız eğitimlere ve zihinsel projelere kayıyor. Bol bol konuşacağınız, yazacağınız, yeni şeyler öğreneceğiniz ve kısa seyahatlere çıkacağınız hareketli bir dönemdesiniz.',
    4: 'evinize, ailenize, yuvanıza ve içsel huzurunuza odaklanıyor. Bu süreçte evde vakit geçirmek, aile içi ilişkileri düzenlemek, gayrimenkul işleriyle uğraşmak veya kendi ruhsal köklerinize dönmek isteyebilirsiniz.',
    5: 'aşk hayatınız, yaratıcılığınız, çocuklarla ilgili konulara ve hayattan aldığınız keyifli aktivitelere yöneliyor. Sahneye çıkma, hobilerinize vakit ayırma, flört etme ve neşenizi dışarı yansıtma zamanıdır.',
    6: 'günlük rutinlerinize, iş hayatınıza, sağlığınıza ve düzen kurma konularına odaklanıyor. Bedeninize iyi bakmak, diyet/spor başlamak, iş ortamınızı düzenlemek ve birikmiş işleri toparlamak için mükemmel bir süreçtir.',
    7: 'ilişkilerinize, evliliğinize, ortaklıklarınıza ve birebir kurduğunuz bağlara yöneliyor. Bu dönemde tek başınıza hareket etmek yerine ortak kararlar almak, ilişkileri şifalandırmak veya yeni iş birlikleri kurmak ön planda olacaktır.',
    8: 'paylaşılan paralara, miras/kredi/borç konularına ve derin psikolojik dönüşümlere odaklanıyor. İçsel korkularınızla yüzleşmek, hayatınızdaki fazlalıklardan arınmak ve eşin/ortağın kaynaklarını yönetmek bu dönemin temasıdır.',
    9: 'yaşam vizyonunuza, inançlarınıza, akademik çalışmalara ve uzak seyahatlere odaklanıyor. Hayatı sorguladığınız, yeni kültürler keşfetmek istediğiniz, ufkunuzu ve inançlarınızı genişlettiğiniz harika bir büyüme dönemidir.',
    10: 'kariyerinize, hedeflerinizdeki başarılara ve toplumsal statünüze odaklanıyor. Göz önünde olacağınız, sorumluluk alacağınız, işinizde parlayacağınız ve geleceğinizi yapılandıracağınız bir zirve dönemindesiniz.',
    11: 'sosyal çevrenize, arkadaş gruplarınıza, gelecek umutlarınıza ve hayallerinize yöneliyor. Yeni topluluklara girmek, arkadaşlarınızla projeler üretmek ve dileklerinizi gerçekleştirmek için çok sosyal bir süreçtesiniz.',
    12: 'içe dönmeye, bilinçaltınızı arındırmaya, dinlenmeye ve ruhsal inzivaya odaklanıyor. Kalabalıklardan uzaklaşıp kafa dinlemek, rüyaları takip etmek, meditasyon yapmak ve geçmişin yüklerini bırakıp şifalanmak için en doğru zamandır.'
  };

  const houseKeywords: Record<number, string> = {
    1: 'kişisel imajınız, bedeniniz ve hayata başlangıç enerjiniz',
    2: 'maddi kaynaklarınız, yetenekleriniz ve özdeğer algınız',
    3: 'iletişim ağınız, yakın çevreniz, eğitimleriniz ve zihinsel projeleriniz',
    4: 'kökleriniz, aileniz, ev hayatınız ve en derin içsel dünyanız',
    5: 'aşk hayatınız, yaratıcılığınız, çocuklarla ilgili konular ve hayattan aldığınız keyif',
    6: 'günlük rutinleriniz, iş ortamınız, sağlığınız ve hizmet etme şekliniz',
    7: 'ikili ilişkileriniz, evliliğiniz, ortaklıklarınız ve açık düşmanlıklar',
    8: 'krizler, dönüşümler, paylaşılan finansal kaynaklar ve derin psikolojik yüzleşmeler',
    9: 'hayat felsefeniz, inançlarınız, seyahatleriniz veya yüksek eğitim konularınız',
    10: 'kariyeriniz, toplumsal statünüz ve hedefleriniz',
    11: 'sosyal çevreniz, idealleriniz, umutlarınız ve dahil olduğunuz gruplar',
    12: 'bilinçaltınız, gizli korkularınız, ruhsal inziva ihtiyacınız ve kadersel çözülmeleriniz'
  };

  const pTheme = planetNames[transitPlanet] || 'Bu gezegen enerjisi';
  const hTheme = houseThemes[house] || 'bu alanda etkili oluyor.';
  const hKeywords = houseKeywords[house] || 'bu evin';

  let advice = '';
  if (transitPlanet === 'Güneş' || transitPlanet === 'Mars') {
    advice = `\n\nTavsiye: Bu süreçte enerjinizi planlı kullanın. Bedeninizi fazla yormadan, yapıcı ve somut adımlarla ilerlemeyi seçin.`;
  } else if (transitPlanet === 'Ay') {
    advice = `\n\nTavsiye: Duygusal dalgalanmaların geçici olduğunu bilin. Karar vermeden önce zihninizi sakinleştirmeye özen gösterin.`;
  } else if (transitPlanet === 'Satürn') {
    advice = `\n\nTavsiye: Karşılaştığınız engelleri birer ders olarak kabul edin. Disiplinli olmak ve sorumluluk almak size uzun vadede büyük başarı getirecektir.`;
  }

  return {
    title: `Transit ${transitPlanet} ${house}. Evinizde`,
    content: `${transitPlanet} ${house}. evinizden geçerken; ${pTheme} ${hTheme}\n\nBu transit geçişi, haritanızdaki ${hKeywords} konularını tetikleyecek ve yaşamınızın bu alanında yeni bir sayfa açmanıza, farkındalık kazanmanıza veya gelişim fırsatları yakalamanıza katkı sağlayacaktır.${advice}`
  };
}

export function getTransitAspectInterpretation(tPlanet: string, nPlanet: string, aspect: string): { title: string, content: string } {
  let interaction = '';
  switch(aspect) {
    case 'Kavuşum': interaction = 'doğrudan el ele veriyor. Gökyüzündeki bu transit, haritanızdaki bu alanın enerjisini katlayarak yepyeni bir başlangıç ve yoğun bir odaklanma dönemi başlatıyor. Hayatınızda yeni adımlar atmak için harika bir rüzgardır.'; break;
    case 'Karşıt': interaction = 'karşı karşıya gelerek size ayna tutuyor. Bu durum, ilişkiler, kararlar ve olaylar üzerinden bir denge bulma ve farkındalık geliştirme sınavı getirebilir. Karşı taraftan gelen baskılara karşı sakin kalmaya özen gösterin.'; break;
    case 'Kare': interaction = 'sert bir şekilde karşı karşıya gelerek sizi harekete geçmeye zorlıyor. Bu gerilim, hayatınızda bazı konuları artık erteleyemeyeceğinizi gösterir. Krizleri fırsata çevirmek ve cesaretle adım atmak için bir dönüm noktasındasınız.'; break;
    case 'Üçgen': interaction = 'çok tatlı ve akıcı bir destek veriyor. İşlerin kendiliğinden kolaylıkla yoluna girmesi, şanslı kapıların aralanması ve çabasız bir gelişim yaşamanız için harika fırsatlarla doludur.'; break;
    case 'Sekstil': interaction = 'göz kırparak size yeni fırsatlar sunuyor. Ancak bu güzel enerjiyi hayatınıza çekmek için koltuktan kalkıp somut adımlar atmanız ve çaba göstermeniz gerekecektir.'; break;
    case 'Görmeyen': interaction = 'bir kör nokta yaratıyor. Bu süreçte önünüzü tam görememe, içsel bir kararsızlık veya kontrol dışı durumlar yaşayabilirsiniz. Acele etmeden izlemede kalın.'; break;
    default: interaction = 'etkileşime giriyor.';
  }

  return {
    title: `Transit ${tPlanet} ${aspect} Natal ${nPlanet}`,
    content: `Gökyüzünde şu an hareket eden (Transit) ${tPlanet}, doğduğunuz andaki (Natal) ${nPlanet} ile ${interaction}\n\n${tPlanet}'in getirdiği güncel etkiler, ${nPlanet}'in temsil ettiği doğuştan gelen kadersel temaları güçlü bir şekilde tetikliyor. Bu açının kesinleştiği günlerde bu etkiyi yaşamınızda en yoğun haliyle hissedersiniz.`
  };
}
