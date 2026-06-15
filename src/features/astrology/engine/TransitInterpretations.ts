// Transit Interpretations Dictionary

export function getTransitHouseInterpretation(transitPlanet: string, house: number): { title: string, content: string } {
  const planetNames: Record<string, string> = {
    'Güneş': 'Odağınızın, canlılığınızın ve bilinçli farkındalığınızın',
    'Ay': 'Duygusal ihtiyaçlarınızın ve içgüdüsel tepkilorinizin',
    'Merkür': 'Zihninizin, iletişim şeklinizin ve karar alma süreçlerinizin',
    'Venüs': 'İlişkilerinizin, değer duygunuzun ve zevklerinizin',
    'Mars': 'Enerjinizin, motivasyonunuzun ve mücadele gücünüzün',
    'Jüpiter': 'Büyüme fırsatlarının, inancınızın ve şansınızın',
    'Satürn': 'Sınavlarınızın, sorumluluklarınızın ve yapılandırma ihtiyacınızın',
    'Uranüs': 'Ani uyanışların, isyanların ve özgürleşme isteğinizin',
    'Neptün': 'İlhamınızın, yanılgılarınızın ve ruhsal çözülmelerinizin',
    'Plüton': 'Derin dönüşümlerinizin, krizlerinizin ve yeniden doğuşunuzun',
    'Kiron': 'Eski yaralarınızın tetiklenmesi ve şifalanma sürecinizin'
  };

  const houseThemes: Record<number, string> = {
    1: 'kişisel imajınız, bedeniniz ve hayatı başlatma enerjiniz üzerinde yoğunlaştığı bir dönemdesiniz. Kendinizi dış dünyaya yeniden tanıtıyorsunuz.',
    2: 'maddi kaynaklarınız, yetenekleriniz ve özdeğer algınız üzerinde çalıştığı bir zamandasınız. Sahip olduklarınızı yeniden değerlendiriyorsunuz.',
    3: 'iletişim ağınız, yakın çevreniz, eğitimleriniz ve zihinsel projeleriniz alanında aktifleştiği bir süreçtesiniz.',
    4: 'kökleriniz, aileniz, ev hayatınız ve en derin içsel dünyanızda köklü değişimler veya vurgular yarattığı bir dönem.',
    5: 'aşk hayatınız, yaratıcılığınız, çocuklarla ilgili konular ve hayattan aldığınız keyif alanında kendini gösterdiği bir süreç.',
    6: 'günlük rutinleriniz, iş ortamınız, sağlığınız ve hizmet etme şekliniz üzerinde etkili olduğu bir zamandasınız.',
    7: 'ikili ilişkileriniz, evliliğiniz, ortaklıklarınız ve açık düşmanlıklar alanında önemli testler veya fırsatlar getirdiği bir dönem.',
    8: 'krizler, dönüşümler, paylaşılan finansal kaynaklar ve derin psikolojik yüzleşmeler alanında çalıştığı bir evre.',
    9: 'hayat felsefeniz, inançlarınız, uzak seyahatler veya yüksek eğitim konularında ufkunuzu genişlettiği bir zaman dilimi.',
    10: 'kariyeriniz, toplumsal statünüz ve hedefleriniz alanında zirveye çıkma veya yeniden yapılanma etkileri verdiği bir süreç.',
    11: 'sosyal çevreniz, idealleriniz, umutlarınız ve dahil olduğunuz gruplar içinde vizyonunuzu güncellediği bir evre.',
    12: 'bilinçaltınız, gizli korkularınız, ruhsal inziva ihtiyacınız ve kadersel çözülmeler alanında derin bir içsel çalışma yaptığı dönem.'
  };

  const pTheme = planetNames[transitPlanet] || 'Bu gezegen enerjisinin';
  const hTheme = houseThemes[house] || 'bu alanda etkili olduğu bir süreç.';

  return {
    title: `Transit ${transitPlanet} ${house}. Evinizde`,
    content: `${transitPlanet} transit halindeyken ${house}. evinize girdiğinde; ${pTheme.toLowerCase()} ${hTheme} \n\nBu transit geçişi, haritanızdaki bu evin konularını tetikleyecek ve yaşamınızın bu alanında yeni bir sayfa açmanıza, farkındalık kazanmanıza veya birtakım sınavlar vermenize neden olacaktır.`
  };
}

export function getTransitAspectInterpretation(tPlanet: string, nPlanet: string, aspect: string): { title: string, content: string } {
  let interaction = '';
  switch(aspect) {
    case 'Kavuşum': interaction = 'doğrudan birleşiyor ve enerjisini katlıyor. Bu, ilgili gezegenin konularında yeni bir döngünün başlangıcıdır.'; break;
    case 'Karşıt': interaction = 'tam karşıdan meydan okuyor. İlişkiler ve dış dünya üzerinden gelen farkındalıklar, krizler veya denge bulma ihtiyacı ön planda.'; break;
    case 'Kare': interaction = 'sürtüşme ve gerilim yaratıyor. Harekete geçmek zorunda kalacağınız, krizler yoluyla büyüyeceğiniz bir dönüm noktası.'; break;
    case 'Üçgen': interaction = 'uyumlu ve akıcı bir destek veriyor. Fırsatların kendiliğinden önünüze geleceği, çabasız bir gelişim süreci.'; break;
    case 'Sekstil': interaction = 'fırsatlar sunuyor ancak bunları değerlendirmek için sizin adım atmanız ve çaba göstermeniz gerekiyor.'; break;
    case 'Görmeyen': interaction = 'birbirini anlamakta zorlanıyor. İçsel bir huzursuzluk veya kontrol edemediğiniz temalar devrede olabilir.'; break;
    default: interaction = 'etkileşime giriyor.';
  }

  return {
    title: `Transit ${tPlanet} ${aspect} Natal ${nPlanet}`,
    content: `Gökyüzünde şu an hareket eden (Transit) ${tPlanet}, doğduğunuz andaki (Natal) ${nPlanet} ile ${interaction} \n\n${tPlanet}'in getirdiği güncel etkiler, ${nPlanet}'in temsil ettiği doğuştan gelen karakter özelliklerinizi ve kadersel temalarınızı güçlü bir şekilde tetikliyor. Bu açının kesinleştiği (orb'un 0 olduğu) günlerde bu etkiyi yaşamınızda en yoğun haliyle hissedersiniz.`
  };
}
