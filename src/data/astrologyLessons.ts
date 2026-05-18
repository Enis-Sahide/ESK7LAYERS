export const ASTROLOGY_LESSONS: Record<string, any> = {
  // ==============================
  // SEVİYE 1: ÇIRAKLIK (Fiziksel Katman - Assiah)
  // ==============================
  '1_nedir': {
    title: 'Ders 1: 4 Katmanlı Ezoterik Astrolojiye Giriş',
    image: { uri: 'https://mbqjklupfoqbcfxusigs.supabase.co/storage/v1/object/public/app-assets/images/astro_layers.png' },
    content: 'Astroloji gökyüzündeki gezegenlerin bize ne yapacağını söyleyen deterministik (kaderci) bir kehanet sanatı değildir. Ezoterik Sırlar Okulu disiplininde Astroloji, ruhun evrimini gösteren muazzam bir "Kozmik Saat" ve şifre çözme sanatıdır.\n\nSıradan astroloji sadece fiziksel olaylarla ilgilenirken, gerçek bir inisiye haritayı 4 farklı boyutta okumayı öğrenir:\n1. Fiziksel Katman (Assiah): Olaylar, para, evlilik, beden sağlığı. "Ne oluyor?"\n2. Psikolojik Katman (Yetzirah): Arketipler, çocukluk, savunma mekanizmaları. "Neden böyle davranıyorum?"\n3. Karmik Katman (Briah): Ruhun geçmişi, Ay Düğümleri, atalardan gelen borçlar. "Buraya hangi dersi geçmeye geldim?"\n4. Ezoterik Katman (Atziluth): Ruhun evrensel hizmeti, tekamül amacı, Tanrısal bilince ulaşma. "Büyük plandaki görevim nedir?"\n\nBu eğitim boyunca evrenin bu 4 boyutlu şifresini adım adım çözeceksiniz.'
  },
  '1_harita_nasil_okunur': {
    title: 'Ders 2: Astrolojik Harita Nasıl Okunur? (Sentez Formülü)',
    image: { uri: 'https://mbqjklupfoqbcfxusigs.supabase.co/storage/v1/object/public/app-assets/images/astro_chart.png' },
    content: 'Bir doğum haritası okurken parçaları ayrı ayrı değil, bir tiyatro sahnesi gibi sentezleyerek okumak zorundasınız. Bunun için altın kural şudur:\n\nGEZEGEN = KİM? (Aktör / İçsel Güç)\nBURÇ = NASIL? (Kostüm / Tarz)\nEV = NEREDE? (Sahne / Yaşam Alanı)\n\nÖrnek Sentez (Mars Koç\'ta 7. Evde):\n- Kim? Mars (Savaşçı / Öfke)\n- Nasıl? Koç (Sabırsız, Atılgan, Lider)\n- Nerede? 7. Ev (Evlilik, Ortaklık, Düşmanlar)\nOkuma: Kişi evliliklerinde veya ortaklıklarında oldukça sabırsız ve çatışmacı (rekabetçi) olabilir. Enerjisini ilişkiler arenasında harcayacaktır.\n\nAçılar (Aspects):\nGezegenlerin birbirleriyle yaptıkları açılar, bu aktörlerin sahnede kavga mı ettiklerini yoksa yardımlaştıklarını mı gösterir:\n- Kavuşum (0 Derece): İki enerjinin kaynaşmasıdır (Güçlü bir odak noktası).\n- Kare (90 Derece): İçsel gerilim, kriz, çatışma ve eyleme geçme zorunluluğu (Gelişim fırsatı).\n- Karşıt (180 Derece): Dış dünyada, özellikle ikili ilişkilerde yansıtılan açık çatışma veya tamamlanma ihtiyacı.\n- Üçgen (120 Derece): Doğuştan gelen, hiç çaba harcamadan akan rahat enerji ve yetenek.',
  },
  '1_evler_katman1': {
    title: 'Ders 3: 12 Evin 1. Katman Anlamı (Fiziksel / Dünyevi)',
    content: '1. Katman, dünyada 3 boyutlu illüzyon içinde (Maya) yaşarken deneyimlediğimiz fiziksel tezahürlerdir. Doğum haritasındaki 12 evin dünyevi (fiziksel olay) anlamları şunlardır:',
    items: [
      { title: '1. Ev (Yükselen)', content: 'Fiziksel görünümünüz, bedensel sağlığınız, doğduğunuz anki çevre şartlarınız ve dış dünyanın taktığı maskedir (Persona).' },
      { title: '2. Ev', content: 'Cüzdanınız, banka hesabınız, sahip olduğunuz taşınır mallar ve dünyevi yeteneklerinizle kazandığınız paradır.' },
      { title: '3. Ev', content: 'Kardeşler, kuzenler, komşular, ilk okul eğitimi, kısa yolculuklar, yazılı ve sözlü günlük iletişim kapasitesidir.' },
      { title: '4. Ev (IC)', content: 'Baba ocağı, doğduğunuz ev, gayrimenkuller, vatan, kökler ve hayatınızın fiziksel sonunun nasıl olacağıdır.' },
      { title: '5. Ev', content: 'Romantik aşklar, çocuklar, hobiler, borsa, kumar, sahnede olma ve fiziksel yaratıcılık (sanat) enerjisidir.' },
      { title: '6. Ev', content: 'Günlük rutinler, ofis arkadaşları, evcil hayvanlar, hizmet sektörü ve fiziksel hastalıkların (akut) teşhis evidir.' },
      { title: '7. Ev (Alçalan)', content: 'Resmi nikahlı eş, iş ortakları, açık düşmanlar, mahkemeler ve kontratların evidir.' },
      { title: '8. Ev', content: 'Eşin parası, miras, nafaka, banka kredileri, vergi, fiziksel ölüm şekli ve cinselliğin fiziksel boyutudur.' },
      { title: '9. Ev', content: 'Yurtdışı, uzun yolculuklar, üniversite eğitimi, din adamları, yabancı diller, yayıncılık ve medyadır.' },
      { title: '10. Ev (MC)', content: 'Kariyer, toplum önündeki statü, şöhret, otorite figürleri ve patronlarla olan ilişkidir.' },
      { title: '11. Ev', content: 'Sosyal çevre, dernekler, organizasyonlar, arkadaşlar ve kariyerden elde edilen kazançtır (primler).' },
      { title: '12. Ev', content: 'Hastaneler, hapishaneler, gizli düşmanlar, kapalı kapılar ardındaki olaylar ve izolasyon alanlarıdır.' }
    ]
  },
  '1_gezegenler': {
    title: 'Ders 4: Temel Gezegen Arketipleri',
    content: 'Gezegenler, astrolojik tiyatroda rol alan "Aktörler"dir. Burçlar bu aktörlerin giydiği kostüm, evler ise oyunun oynandığı sahnedir. Fiziksel ve psikolojik olarak gezegenler şu fonksiyonları yönetir:\n\nGüneş (Ego): Sizin temel yaşam gücünüz, baba figürü ve bu hayatta "Ben Buyum" dediğiniz bilinçli merkezdir.\nAy (Duygu/Anne): Anne figürü, içgüdüleriniz, güvenlik ihtiyacınız ve strese verdiğiniz bilinçaltı tepkisidir.\nMerkür (Zihin): Nasıl düşündüğünüz, nasıl iletişim kurduğunuz ve algı kapasitenizdir.\nVenüs (Değer): Nasıl sevdiğiniz, neleri çekici bulduğunuz, estetik anlayışınız ve paradır.\nMars (Savaşçı): Öfkeniz, seksüel dürtünüz, savaşma ve harekete geçme enerjinizdir.\nJüpiter (Büyüteç): Şans, inanç, felsefe, genişleme, bolluk ve ahlaki değerlerdir.\nSatürn (Öğretmen): Sınırlar, disiplin, zaman, korku, engeller, sorumluluk ve "Karma\'nın Lordu"dur.'
  },

  // ==============================
  // SEVİYE 2: KALFALIK (Psikolojik ve Karmik Katman - Yetzirah & Briah)
  // ==============================
  '2_evler_katman2': {
    title: 'Ders 5: 12 Evin 2. Katman Anlamı (Psikolojik Arketipler)',
    content: 'Bu katmanda haritayı artık olaylar üzerinden değil, psikolojik süreçler, çocukluk travmaları ve gölge yanlar üzerinden okuruz (Yetzirah).',
    items: [
      { title: '1. Ev (Psikolojik)', content: 'Egonun dünyayla ilk karşılaşması. Bireyin hayatta kalmak için geliştirdiği birincil savunma mekanizmasıdır. Benliğin şekillenmesi.' },
      { title: '2. Ev (Psikolojik)', content: 'Özdeğer duygusudur. Kişinin "Ben değerli miyim?" sorusuna verdiği içsel yanıttır. Maddi birikim arzusu, aslında içsel boşluğu ve yetersizliği doldurma çabasıdır.' },
      { title: '3. Ev (Psikolojik)', content: 'Zihinsel yapılandırma. Bireyin çevresiyle zihinsel olarak nasıl başa çıktığı, merakı, çocuklukta dünyayı algılama biçimi.' },
      { title: '4. Ev (Psikolojik)', content: 'Kişinin en derin bilinçaltı. Ruhsal temeller, çocukluk koşullanmaları ve güvenlik arayışıdır. İnsanın içsel sığınağı.' },
      { title: '5. Ev (Psikolojik)', content: 'İçsel çocuğun (Inner Child) oyun alanıdır. Kişinin saf, kontrolsüz bir şekilde kimliğini dışa vurma ve varoluşsal olarak onaylanma arzusu.' },
      { title: '6. Ev (Psikolojik)', content: 'Bedensel ve zihinsel arınma. Kendini eleştirme, psikolojik krizlerin bedene hastalık (somatizasyon) olarak yansıması, takıntı ve hizmet kompleksi.' },
      { title: '7. Ev (Psikolojik)', content: 'Kişinin kendi içinde eksik hissettiği parçayı (gölgesini) karşısındakine yansıtmasıdır (Projeksiyon). Kendimizde bastırdığımız yönleri düşman veya eş olarak çekeriz.' },
      { title: '8. Ev (Psikolojik)', content: 'Derin krizler, travmalar, tabular, ölüm korkusu, psikolojik dönüşüm ve egonun ölümü. Terapi ve yüzleşme alanıdır.' },
      { title: '9. Ev (Psikolojik)', content: 'Anlam arayışı. Bireyin dünyayı ve olayları hangi inanç sistemi ve felsefi kalıpla anlamlandırdığıdır. Yüksek bilinç.' },
      { title: '10. Ev (Psikolojik)', content: 'Otorite figürü olarak Annenin (veya dominant ebeveynin) psikolojik mirası. Bireyin toplumda kabul görmek için egosunu nasıl terbiye ettiği.' },
      { title: '11. Ev (Psikolojik)', content: 'Kolektif bilinçaltı ile bağlantı. Aidiyet ihtiyacı ve bireyin kendini toplumun büyük vizyonu içinde nerede konumlandırdığı.' },
      { title: '12. Ev (Psikolojik)', content: 'Kolektif gölge, bastırılmış anılar, rüyalar, psikozlar, inziva ve egonun çözülüp okyanusa karışması.' }
    ]
  },
  '2_karmik_katman': {
    title: 'Ders 6: Karmik Katman ve Ay Düğümleri',
    content: '3. Katman (Briah), ruhun bu hayata neden geldiğinin ve geçmiş enkarnasyonlarından taşıdığı borçların okunduğu Karmik Katmandır.\n\nGüney Ay Düğümü (GAD):\nRuhun geçmiş yaşamlarında ustalaştığı, uzmanı olduğu ama artık onu aşağı çeken bir "Konfor Alanı"dır. GAD burcu ve evi, kişinin doğuştan getirdiği yetenekleri gösterir ancak bu hayatta ruh tekamül etmek için bu yetenekleri bırakıp zıt yöne gitmelidir.\n\nKuzey Ay Düğümü (KAD):\nRuhun bu hayattaki nihai sınavı, hiç bilmediği, korktuğu ama mutlaka öğrenmesi gereken hedef noktasıdır (Kutup Yıldızı). KAD\'ye gitmek zorlu ve sancılıdır ancak ruhsal tatmin sadece oradadır.\n\nRetro (Geri Giden) Gezegenler:\nDoğum anınızda bir gezegen Retro ise, o gezegenin temsil ettiği enerjide geçmiş yaşamlarda bir hata, israf veya tamamlanmamış bir ders (Karmik Borç) vardır. Örneğin Retro Venüs, geçmişte aşkta veya değerlerde yapılan haksızlıkları düzeltmek için kişiyi bu hayatta içsel sevgi sınavlarına sokar.\n\nKiron (Yaralı Şifacı):\nHaritanızda hiçbir zaman tam olarak iyileşmeyen, kanayan en derin ruhsal yaranızdır. Kiron, kişinin kendine merhem olamadığı ama başkalarını iyileştirerek (şifa dağıtarak) kendi yarasını uyuşturabildiği anahtardır.'
  },
  '2_evler_katman3': {
    title: 'Ders 7: 12 Evin 3. Katman Anlamı (Karmik ve Ruhsal)',
    content: 'Bu katmanda Evler, reenkarnasyon döngüsündeki sınavlar, geçmiş yaşam bağlantıları ve ruhun şifreleri olarak okunur.',
    items: [
      { title: '1. Ev (Karmik)', content: 'Ruhun bu hayatta giydiği yeni kostümün kodları. Enkarnasyon anındaki ruhsal seçimi gösterir.' },
      { title: '2. Ev (Karmik)', content: 'Geçmiş yaşamdan getirilen ruhsal ve manevi yetenekler/değerler. Sadece para değil, ruhun hazinesidir.' },
      { title: '3. Ev (Karmik)', content: 'Aynı ruh grubundan (soul group) tekamül için seçilen kardeşler veya yakın çevrenin karmik bağları.' },
      { title: '4. Ev (Karmik)', content: 'Atalardan aktarılan kök karma. Soydan gelen ruhsal miras ve geçmiş yaşamların kapanış/köklenme alanı.' },
      { title: '5. Ev (Karmik)', content: 'Geçmişten gelen karmik aşklar, ruh eşi (soulmate) bağları. Kişinin yaratıcılık vasıtasıyla ilahi olanı yansıtması.' },
      { title: '6. Ev (Karmik)', content: 'Hizmet karması. Geçmişte efendi olanın bu hayatta hizmetkar olarak kibri kırması, şifa karması.' },
      { title: '7. Ev (Karmik)', content: 'İkiz alev (Twin Flame) veya karmik düşman karşılaşmaları. Geçmişte yarım bırakılan ilişkilerin düğüm noktası.' },
      { title: '8. Ev (Karmik)', content: 'Büyü, okültizm, maji. Geçmişte edinilmiş karanlık bilgeliğin bu hayatta temizlenmesi, karmik borçların tahsilatı.' },
      { title: '9. Ev (Karmik)', content: 'Ruhun inanç sınavları. Geçmişte dogma ile insanları yargılayanların, bu hayatta inanç krizleri yaşaması.' },
      { title: '10. Ev (Karmik)', content: 'Toplumsal dharma. Ruhun dünyevi otoriteyi ele alarak kitlelere karmik bir mesaj bırakma misyonu.' },
      { title: '11. Ev (Karmik)', content: 'Ruhsal aile. Kolektif karmik borçların kitleler veya dernekler aracılığıyla ödenmesi.' },
      { title: '12. Ev (Karmik)', content: 'Ruhun bekleme odası. Haritanın kara deliğidir. Tüm geçmiş karmaların gizlendiği arşiv, geçmiş hayatların rüyalarda tezahür ettiği çözülme alanı.' }
    ]
  },

  // ==============================
  // SEVİYE 3: ÜSTATLIK (Ezoterik Katman - Atziluth)
  // ==============================
  '3_ezoterik_katman': {
    title: 'Ders 8: 4. Katman (Ezoterik/İlahi Plan)',
    image: { uri: 'https://mbqjklupfoqbcfxusigs.supabase.co/storage/v1/object/public/app-assets/images/astro_aspects.png' },
    content: 'Ezoterik Astroloji (Atziluth), Alice Bailey ve Tibetli Üstat Djwhal Khul öğretilerine dayanır. Bu katmanda "Ben" yoktur, "BİZ" vardır. Ruh, kişisel dertlerinden, para ve evlilik gibi kaygılarından arınmıştır. O artık Dünya gezegenine hizmet eden bir işçidir.\n\nSabit Yıldızlar (Fixed Stars):\nHaritanızda eğer bir gezegen Regulus, Sirius, Antares, Spica gibi sabit bir yıldıza temas ediyorsa; kişi dünyevi kaderinin ötesinde, tanrısal bir yetki (veya trajedi) ile donatılmıştır. Gökyüzündeki Tanrıların müdahalesidir.\n\nHeliocentric (Güneş Merkezli) Harita:\nBizler dünyadan gökyüzüne bakarak (Geocentric) harita çıkarırız (Ego haritası). Ancak merkezine Güneş\'i (Ruhu/Tanrıyı) alıp dünyanın da bir gezegen olduğu Heliocentric haritaya bakarsak, ruhun yüksek benliğinin galaksideki gerçek rotasını, öz amacını ve ilahi plandaki büyük görevini görürüz.\n\nEzoterik Yönetici Gezegenler:\nSıradan astrolojide Koç burcunu Mars yönetir (savaş ve rekabet). Ancak Ezoterik katmanda Koç burcunun yöneticisi Merkür\'dür; çünkü evrilmiş bir Koç, zihinsel aydınlanmayı cesaretle kitlelere getiren bir Işık Elçisidir.'
  },
  '3_burclar_ezoterik': {
    title: 'Ders 9: 12 Burcun Ezoterik (Tekamül) Şifreleri',
    content: 'Burçlar karakter değil, ruhun tekamül ettiği 12 inisiyasyon kapısıdır. Her burcun uyanmamış (gölge) ve uyanmış (ezoterik) bir işlevi vardır:',
    items: [
      { title: 'Koç (Aries)', content: 'Gölge: Bencilce saldırmak, "Ben".\nEzoterik: İlahi ateşin kıvılcımını dünyaya getiren, zihinsel aydınlanmanın korkusuz öncüsü.' },
      { title: 'Boğa (Taurus)', content: 'Gölge: Maddeye, paraya, konfora körü körüne bağımlılık.\nEzoterik: Üçüncü gözü açarak formun (maddenin) içindeki ışığı ve maneviyatı bulmak, ışığı dünyada demirlemek.' },
      { title: 'İkizler (Gemini)', content: 'Gölge: Yüzeysel merak, dedikodu, dualitenin parçalanması.\nEzoterik: Ruh ve madde, ben ve diğerleri arasındaki ikiliği (dualiteyi) saf bir sevgi senteziyle birleştirmek.' },
      { title: 'Yengeç (Cancer)', content: 'Gölge: Geçmişe takıntı, duygusal bağımlılık ve kör milliyetçilik.\nEzoterik: Tüm insanlığı kendi çocukları gibi şefkatle besleyen "Evrensel Anne" formuna yükselmek.' },
      { title: 'Aslan (Leo)', content: 'Gölge: Narsizm, sadece kendi şovunu yapmak, kibir.\nEzoterik: Kişisel egoyu eritip, içindeki İlahi Çocuğu uyandırmak ve ilhamını evrensel bir sevgi ışığı olarak etrafa saçmak.' },
      { title: 'Başak (Virgo)', content: 'Gölge: Acımasız eleştiri, takıntı, detaylarda boğulmak.\nEzoterik: "Mesih" (Christ) bilincine hamile kalmak, kusursuz bir adanmışlıkla insanlığa karşılıksız ve şefkatle hizmet etmek.' },
      { title: 'Terazi (Libra)', content: 'Gölge: Kararsızlık, sürekli başkalarının onayını beklemek, yüzeysel uyum.\nEzoterik: Karşıtlıkların (karanlık ve aydınlığın) jilet gibi ince dengesini kurarak, evrensel adaleti ve barışı sağlamak.' },
      { title: 'Akrep (Scorpio)', content: 'Gölge: İntikam, manipülasyon, cinsellik, güç saplantısı ve zehir.\nEzoterik: Şeytanıyla (gölgesiyle) yüzleşip onu alt ederek, dokuz başlı hidranın başını kesen ve ruhsal dirilişi (Anka Kuşu) sağlayan en büyük dönüştürücü.' },
      { title: 'Yay (Sagittarius)', content: 'Gölge: Dogmatizm, fanatizm, körü körüne inanç ve kibir.\nEzoterik: Oku doğrudan Tanrı\'ya (ilahi gerçeğe) nişanlayan, insanlığı dünyevi karanlıktan bilgeliğe ulaştıran hedef odaklı bilge.' },
      { title: 'Oğlak (Capricorn)', content: 'Gölge: Acımasız hırs, maddeperestlik, duygusuzca zirveye tırmanma.\nEzoterik: Zirvedeki (Dağdaki) inisiyasyon. Tüm dünyevi yüklerinden arınarak, dağın zirvesinde Tanrısal ışıkla aydınlanan ruhsal usta (İsa/Buda arketipi).' },
      { title: 'Kova (Aquarius)', content: 'Gölge: Soğukluk, aidiyetsizlik, anarşi ve duygusuz isyan.\nEzoterik: Kendini unutan, Kutsal Kâse\'den tüm insanlığın üzerine yaşam ve kardeşlik suyunu (evrensel aydınlanmayı) döken su taşıyıcısı.' },
      { title: 'Balık (Pisces)', content: 'Gölge: Kurban psikolojisi, kaçış, bağımlılıklar ve gerçeklikten kopuş.\nEzoterik: Dünyevi illüzyonun sonu. Egonun tamamen eriyip okyanusa (Tanrı\'ya) karıştığı, evrensel kurtarıcı, en yüksek merhamet ve Mesih bilinci.' }
    ]
  }
};
