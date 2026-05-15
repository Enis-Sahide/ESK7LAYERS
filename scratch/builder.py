import os

FILE_PATH = r"c:\Yeni klasör\proje1\src\data\humanDesignLessons.ts"

content = """export const HUMAN_DESIGN_LESSONS: Record<string, any> = {
  // ==============================
  // SEVİYE 1: TEMELLER (ÇIRAKLIK)
  // ==============================
  '1_nedir': {
    title: 'Ders 1: İnsan Tasarımı (Human Design) Sistemi',
    content: 'İnsan Tasarımı Sistemi, 1987 yılında Ra Uru Hu (Robert Allan Krakower) tarafından İbiza adasında yaşanan sekiz günlük mistik bir vahiy sürecinde insanlığa sunulmuş, eşi benzeri görülmemiş evrensel bir sentezdir.\\n\\nBu sistem; Doğu\\'nun Hindu-Brahmin Çakra Sistemi, Çin\\'in kadim bilgeliği I-Ching (Değişimler Kitabı), Yahudi Mistisizminin belkemiği Kabala (Hayat Ağacı) ve Batı Astrolojisi gibi dört kadim ezoterik öğretiyi tek potada eritir. Aynı zamanda bu spiritüel temeli, modern Kuantum Fiziği (Nötrino denizi) ve İnsan Genetiği (64 Kodon) ile birleştirerek bilimsel bir zemin sunar.\\n\\nAmacı ve Felsefesi\\nİnsan Tasarımı, sizi değiştirmek veya "daha iyi, düzeltilmiş" biri yapmakla ilgilenmez. Çoğu spiritüel öğreti size "ne yapmanız gerektiğini" söylerken, Human Design size "Nasıl Karar Alacağınızı" gösteren kişisel bir mekanik harita sunar. Evrendeki herkesin parmak izi kadar benzersiz bir enerji haritası (BodyGraph) vardır. Hayattaki acıların, dirençlerin ve tükenmişliklerin en büyük nedeni, "Kendimiz olmayan" (Not-Self) kararlar almamız ve başkalarının auralarının etkisi altında ezilmemizdir. Bu sistem, kendi illüzyonunuzdan (Maya) uyanmanızı ve doğuştan getirdiğiniz orijinal, kusursuz koda geri dönmenizi sağlar.',
  },
  '1_tipler': {
    title: 'Ders 2: Enerji Tipleri ve Aura Mekaniği',
    content: 'İnsan Tasarımında insanlık, auralarının etrafıyla nasıl etkileşime girdiğine bağlı olarak 5 ana Enerji Tipi altında incelenir. Auramız konuşmadan önce çevreyle iletişim kuran görünmez imzamızdır.\\n\\n1. Jeneratör (Üretici - %37)\\nTükenmez bir yaşam enerjisine (Tanımlı Sakral merkeze) sahiptirler. Auraları "Açık ve Kucaklayıcıdır". Dünyanın inşa edici işçileridir. Ancak bu devasa enerjiyi sadece sevdikleri ve içlerinden gelen işlere harcamalıdırlar. Sevmedikleri işleri "zorunluluktan" yaptıklarında, auraları kararır ve "Hüsran" (Frustration) hissederler.\\n\\n2. Manifesting Generator (Üreten Gerçekleştirici - %33)\\nJeneratörün tükenmez enerjisi ile Manifestörün harekete geçirme hızının güçlü bir mutasyonudur. Çok hızlıdırlar ve aynı anda birçok işi yapabilirler. Aşamaları atlamayı severler. En büyük sınavları sabırsızlıklarıdır. Doğru olanı bulana kadar pek çok şeyi deneyip bırakabilirler.\\n\\n3. Projektör (Gösterici - %20)\\nEnerji üretmekten çok, başkalarının enerjisini yönlendirmek, okumak ve onlara rehberlik etmek için tasarlanmışlardır. Auraları "Odaklı, Emici ve Delicidir". Birinin gözünün içine baktıklarında ruhunu okuyabilirler. Kendi başlarına başlatmak yerine yetenekleri için "Davet edilmeyi" beklemelidirler. Davetsiz tavsiye verdiklerinde "Acı/Burukluk" (Bitterness) yaşarlar.\\n\\n4. Manifestör (Gerçekleştirici - %9)\\nKral ve Kraliçe arketipidir. Dünyadaki tek "Başlatıcı" aurasıdır. Kimseye sormadan, onay beklemeden doğrudan eyleme geçmek için tasarlanmışlardır. Auraları "Kapalı ve İticidir", yani etraflarındaki engelleri adeta bir kalkan gibi açarlar. Ancak, harekete geçmeden önce eylemlerinden etkilenecek insanları "Bilgilendirmedikleri" zaman büyük bir dirençle karşılaşır ve "Öfke" (Anger) duyarlar.\\n\\n5. Reflektör (Yansıtıcı - %1)\\nHiçbir enerji merkezi tanımlı değildir (Tümü beyazdır). Kendilerine ait sabit bir enerjileri yoktur. Bulundukları ortamın, toplumun ve insanların sağlığını/hastalığını anında aynalarlar. Çok nadir ve bilge varlıklardır. Karar almak için 28 günlük "Ay Döngüsünü" beklemelidirler. Yanlış ortamlarda bulunduklarında derin bir "Hayal Kırıklığı" yaşarlar.',
  },
  '1_otorite': {
    title: 'Ders 3: Strateji ve İçsel Otoriteler',
    content: 'İnsan Tasarımının en temel öğretisi şudur: "ZİHİN (BEYİN) ASLA BİR KARAR ALMA MERCİİ DEĞİLDİR." Zihin başkaları için harika bir analiz, ölçüm ve ilham aracıdır ancak kendi hayatınızla ilgili kararları zihninizle aldığınızda her zaman yanılırsınız. Doğru kararlar bedeninizin zekasıyla (İçsel Otorite) alınır.\\n\\nAura Stratejileri:\\n- Jeneratör & MG: "Tepki Vermek". (Dışarıdan bir uyaran, soru veya işaret gelmesini beklemek ve ona bedensel tepki vermek).\\n- Projektör: "Tanınmayı ve Davet Edilmeyi Beklemek".\\n- Manifestör: "Eyleme geçmeden önce etkilenecekleri Bilgilendirmek".\\n- Reflektör: "Tam 1 Ay Döngüsü (28.5 gün) boyunca beklemek".\\n\\nİçsel Otoriteler (Karar Mekanizmaları):\\n1. Duygusal Otorite (Solar Pleksus - Nüfusun %50\\'si): Duygular bir dalga gibi iner ve çıkar. "Duygusal olanlar ASLA o anda (anda) karar vermemelidir." Karar vermek için duygusal dalganın dinmesini (zamanı) beklemelidirler. Berraklık zamanla gelir.\\n2. Sakral Otorite (Sadece Jeneratörler): Karnın derinliklerinden gelen homurdanmalara dayanır. Bir teklif geldiğinde karınları anında (Hı-hı = Evet) veya (I-ıh = Hayır) şeklinde sesli/bedensel tepki verir. Mantığı yoktur, bedenin enerjisi o işe var mıdır yok mudur onu gösterir.\\n3. Dalak Otoritesi (Spleen): Sadece anlık hayatta kalma ve içgüdü üzerine çalışır. Mantıksızdır, çok sessiz bir fısıltıdır. Sizi anlık olarak tehlikeden koruyan o "içsel his"tir. Bir kez konuşur, tekrar etmez.\\n4. Ego/Kalp Otoritesi: "Ben ne istiyorum?" sorusunun kalpten gelen cevabıdır.\\n5. G (Kendilik) Otoritesi: Doğru yönü, kişinin kendi sesini dinleyerek (sesli konuşarak) duymasıdır.',
  },

  // ==============================
  // SEVİYE 2: 9 ENERJİ MERKEZİ (KALFALIK)
  // ==============================
  '2_merkez_mantigi': {
    title: 'Ders 4: Merkezler ve Not-Self (Kendin Olmama)',
    content: 'Vücut grafiğinde yer alan 9 geometrik şekil (Enerji Merkezleri), Çakra sisteminin daha kompleks ve genetik formudur.\\n\\nTanımlı (Renkli) Merkezler: Doğuştan getirdiğiniz, güvenebileceğiniz, sabit yayın yapan (verici) enerji kaynaklarınızdır.\\n\\nTanımsız (Beyaz) Merkezler: Size ait sabit bir enerjinin olmadığı, dış dünyadan ve diğer insanlardan enerji aldığınız (alıcı), bu enerjiyi içinizde "büyüterek" yansıttığınız açık okullarınızdır.\\n\\nNot-Self (Kendin Olmama) Teması:\\nSorunlarımız her zaman beyaz (tanımsız) merkezlerimizde yaşanır. Başkalarının enerjisini kendimizin sanırız. Zihnimiz bu boşlukları doldurmak için bizi manipüle eder ve yanlış kararlar aldırır.',
  },
  '2_basinc_farkindalik': {
    title: 'Ders 5: Basınç ve Farkındalık Merkezleri',
    content: 'Basınç Merkezleri (Evrensel Stres ve İlham)\\n1. Tepe (Head) Merkezi: Zihinsel baskı ve ilham merkezidir. Tanımsız ise, zihniniz sürekli başkalarının sorularıyla meşguldür. Not-Self sorusu: "Benimle hiç ilgisi olmayan soruları cevaplamaya mı çalışıyorum?"\\n2. Kök (Root) Merkezi: Fiziksel adrenalin ve stres merkezidir. Tanımsız ise, stres altında çok zorlanırsınız. Not-Self sorusu: "Baskıdan kurtulmak için işleri aceleyle mi yapıyorum?"\\n\\nFarkındalık Merkezleri (Bilinç Seviyeleri)\\n1. Ajna Merkezi: Zihinsel farkındalıktır. Fikirler, inançlar ve analizlerdir. Tanımsız ise, sabit inançlara tutunmak zorunda hissedersiniz. Not-Self sorusu: "Sürekli haklı olduğumu mu kanıtlamaya çalışıyorum?"\\n2. Dalak (Spleen) Merkezi: Bedenin en eski farkındalığıdır (Sürüngen Beyin). Bağışıklık, sezgi, tat ve ölüm/hayatta kalma korkularını barındırır. Tanımsız ise, size zarar veren şeylere (toksik ilişkilere, kötü alışkanlıklara) tutunma eğilimindesinizdir. Not-Self sorusu: "Bana iyi gelmeyen şeylere tutunuyor muyum?"\\n3. Solar Pleksus Merkezi: Duygusal farkındalık merkezidir. Nüfusun yarısı burada tanımsızdır. Tanımsız olanlar, çevrelerindeki insanların duygularını sünger gibi emer ve "iki katı" olarak yaşarlar. Başkaları üzülmesin diye gerçekleri söyleyemezler. Not-Self sorusu: "Gerçeklerden ve çatışmadan kaçınıyor muyum?"',
  },
  '2_motor_yon': {
    title: 'Ders 6: Motor Merkezler ve Yön Merkezi',
    content: 'Motor Merkezler (Yakıt Üreten Merkezler)\\n1. Sakral Merkez: Yaşam gücü, cinsellik ve üremedir. Açık/beyaz olanlar (Projektör, Manifestör, Reflektör) yeterince çalıştıklarında durmayı bilmezler. Not-Self sorusu: "Ne zaman duracağımı ve yeteceğini bilmiyor: "Ne zaman duracağımı ve yeteceğini bilmiyor muyum?"\\n2. Kalp (Ego) Merkezi: İrade gücü, değer duygusu ve maddiyattır. İnsanların %65\\'inde beyazdır. Beyaz bir Kalp merkezine sahip olan kişi, bu hayatta "HİÇBİR ŞEYİ HİÇ KİMSEYE KANITLAMAK ZORUNDA DEĞİLDİR". Ancak zihin, "Sen yetersizsin" diyerek onları sürekli sözler vermeye ve kendilerini yormaya iter. Not-Self sorusu: "Sürekli kendimi değerli hissetmek veya kanıtlamak için mi çabalıyorum?"\\n\\nYön ve İfade Merkezleri\\n1. G (Kendilik/Yön) Merkezi: Sarı elmastır. Sevginin, kimliğin ve yönün merkezidir (Manyetik Monopol). Tanımsız olanların bu dünyada sabit bir yönü yoktur; sürekli kimlik ve yer değiştirirler. Onlar için kural şudur: "Eğer mekân (çevre) doğruysa, insanlar doğrudur." Not-Self sorusu: "Sürekli bir yön ve sevgi mi arıyorum?"\\n2. Boğaz Merkezi: Tüm grafiğin Roma\\'sıdır (Her yol oraya çıkar). İletişim, ifade ve eylemin (tezahür) merkezidir. Diğer merkezlerdeki tüm basınçlar, Boğaz\\'dan çıkıp gerçekliğe dönüşmek ister. Tanımsız Boğaz merkezine sahip olanlar, dikkati üzerine çekmek için sürekli konuşma ihtiyacı hissederler. Not-Self sorusu: "Dikkati üzerime çekmek için mi konuşuyorum?"',
  },

  // ==============================
  // SEVİYE 3: DERİNLEŞME (ÜSTATLIK)
  // ==============================
  '3_kirmizi_siyah': {
    title: 'Ders 7: Kuantum Mekaniği (Kırmızı ve Siyah)',
    content: 'Human Design haritasındaki rakamlar ve çizgiler Kırmızı, Siyah veya Karışık renktedir. Bu renkler sizin dualitenizi (İkiliğinizi) gösterir. Bedeninizde ruhunuz (Kişilik) ve fiziksel aracınız (Tasarım) aynı anda seyahat eder.\\n\\nSİYAH (Kişilik / Bilinçli):\\nDoğum anınızdaki gezegen konumlarıdır. Sizin "KİM OLDUĞUNUZU DÜŞÜNDÜĞÜNÜZ" şeydir. Farkında olduğunuz, "Evet ben tam olarak böyle biriyim" dediğiniz özelliklerinizdir. Zihnin erişimi olan alanlardır.\\n\\nKIRMIZI (Tasarım / Bilinçdışı):\\nDoğumunuzdan tam 88 derece (yaklaşık 3 ay) önceki gezegen konumlarıdır. Sizin bedeninizin (fiziksel aracınızın) genetik kodlarıdır. Bilinçaltıdır. Siz bunların "farkında değilsinizdir", ancak DIŞARIDAN BAKAN İNSANLAR bu özellikleri sizde çok net görürler. Bazen kendinize "Bunu neden yaptım?" diye şaşırdığınız otomatik eylemlerinizin kaynağı kırmızı kodlardır.\\n\\nKIRMIZI/SİYAH (Karışık):\\nBir kapıda hem siyah hem kırmızı varsa, o özellik sizde hem genetik/bilinçaltı hem de kişiliksel olarak yerleşmiş demektir.',
  },
  '3_profiller': {
    title: 'Ders 8: 12 Profil Ansiklopedisi (Arketipsel Roller)',
    content: `Profiliniz, yaşamdaki kıyafetiniz, rolünüz ve karakterinizdir. 6 temel çizginin 12 farklı kombinasyonu vardır.

**1/3 Profil (Araştırmacı / Şehit):**
Dünyanın temellerini sorgulayan, sağlam zemin arayan (1. çizgi) ve bunu yaparken düşüp kalkarak, hata yaparak öğrenen (3. çizgi) profildir. Hayat onlar için bir laboratuardır. Deneyimleyip yanılarak doğruyu bulurlar.

**1/4 Profil (Araştırmacı / Fırsatçı):**
Derin bir bilgiye (1. çizgi) ihtiyaç duyarlar ve bu bilgiyi sadece kendi güvendikleri yakın çevrelerine, kendi ağlarına (4. çizgi) aktarmak isterler. Dostluklar onlar için çok önemlidir.

**2/4 Profil (Münzevi / Fırsatçı):**
Doğuştan yetenekli (2. çizgi) olan ama yeteneğinin farkında olmayan bir keşiş gibidir. Kendi mağarasında vakit geçirmeyi sever. Ancak dışarıdaki dostları (4. çizgi) onun yeteneğini görür ve onu dışarı davet ederek fırsatları getirir.

**2/5 Profil (Münzevi / Kafir):**
Mağarasında saklanmak isteyen (2. çizgi) ama aurası nedeniyle herkesin ondan dünyayı kurtarmasını beklediği (5. çizgi) çok gizemli bir profildir. İnsanların yüksek beklentilerini yönetmek en büyük sınavlarıdır.

**3/5 Profil (Şehit / Kafir):**
Dünyaya "çökmekte olan sistemleri yıkmak" için gelmiş isyancı bir profildir. Sürekli hata yaparak (3. çizgi) işe yaramayanları tespit eder ve toplum (5. çizgi) onu bir kurtarıcı olarak görür. Çözüm sunabildikleri sürece kahramandırlar.

**3/6 Profil (Şehit / Rol Model):**
Hayatının ilk 30 yılı tam bir kaos ve hata zinciridir (3. çizgi). Ancak 50 yaşından sonra bu devasa tecrübeyi bilgeliğe dönüştürüp, hatalarından arınmış bir bilgeye (6. çizgi) dönüşürler.

**4/6 Profil (Fırsatçı / Rol Model):**
Güçlü bir sosyal ağa ve yakın dostluklara (4. çizgi) ihtiyaç duyan nesnel gözlemcilerdir. İnsanları tanır ve 50 yaşından sonra o insanların saygı duyduğu tarafsız, bilge bir Rol Model (6. çizgi) olurlar.

**4/1 Profil (Fırsatçı / Araştırmacı):**
Çok nadir bir "Sabit Kader" profilidir. Yolları ve inançları çok sabittir, esnemezler. Kurdukları sağlam temel (1) üzerinden, bilgilerini ve inançlarını yakın çevrelerine (4) yaymak için buradadırlar. Değiştirilemezler.

**5/1 Profil (Kafir / Araştırmacı):**
Kriz çözücü generaldir. Evrensel bir kurtarıcı aurası (5) yayarlar. İnsanlar onlara sorunlarını getirir. Onlar da derin araştırmalar (1) yaparak en pratik çözümü sunarlar. Liderlik için yaratılmışlardır.

**5/2 Profil (Kafir / Münzevi):**
Kendi kendine yeten ve dışarı çıkmak istemeyen (2) bir yapısı olmasına rağmen, toplumun her zaman ondan bir şeyler beklediği (5) karmaşık bir profildir. Çok özel davetlerle motive olurlar.

**6/2 Profil (Rol Model / Münzevi):**
Doğuştan bilge ve gözlemci (6) olan, kendi yalnızlığından beslenen (2) profildir. Objektif bir şekilde hayatı yukarıdan izlerler ve sadece gerçekten güvendikleri kişiler için mağaralarından çıkarlar.

**6/3 Profil (Rol Model / Şehit):**
Sürekli bir geçiş ve değişim halinde olan, hem tecrübe ederek yanan (3) hem de her şeyin ötesini gören (6) iyimser bir ruhtur. Hayat onlar için sonu gelmez bir bilgelik arayışıdır.`
  },
  '3_kanallar': {
    title: 'Ders 9: 36 Kanal Ansiklopedisi',
    content: `36 Kanal, iki enerji merkezini birbirine bağlayan elektromanyetik yollardır. Haritanızda boydan boya renkli olan kanallar sizin değişmez yaşam gücünüzdür. İşte tamamı:

1-8 İlham Kanalı: Yaratıcı bir Rol Model. Kendini bireysel olarak ifade etme ve ilham verme kanalı.
2-14 Simyacı Kanalı: Dünyanın en güçlü jeneratör kanallarından. Enerjiyi paraya ve kaynağa dönüştüren güç.
3-60 Mutasyon Kanalı: Eski kalıpları yıkıp yepyeni şeyler üreten, nabız gibi atan mutasyon enerjisi.
4-63 Mantık Kanalı: Zihinsel şüphe ve bilimsel cevap arayışı. Sürekli kanıt isteyen zihin.
5-15 Ritim Kanalı: Doğanın tüm ritimleriyle ve farklı insanlarla akışta kalma yeteneği.
6-59 Üreme Kanalı: Samimiyet, bağ kurma ve kelimenin tam anlamıyla üreme (çocuk veya proje).
7-31 Alfa Lideri Kanalı: Toplum tarafından seçilen, geleceğe yön veren demokratik liderlik.
9-52 Odak Kanalı: İnanılmaz bir konsantrasyon ve detaylara uzun süre odaklanma yeteneği.
10-20 Uyanış Kanalı: Tamamen kendi prensipleriyle yaşayan, ruhsal uyanışın bireysel sesi.
10-34 Keşif Kanalı: Kendi inançlarını eyleme dökerek kendini keşfeden birey.
10-57 Kusursuz Form Kanalı: İçgüdüsel olarak hayatta kalma ve çevreyi güzelleştirme.
11-56 Merak Kanalı: Sürekli hikayeler anlatan, inançlar toplayan fikir arayışçısı.
12-22 Açıklık Kanalı: Duygusal olarak doğru modda olduğunda inanılmaz cazibeli ve etkileyici sosyal kanal.
13-33 Savurgan Kanalı: İnsanların sırlarını dinleyen (13) ve sonra bu tecrübeleri hatırlayıp aktaran (33) kayıt tutucu.
16-48 Dalga Boyu Kanalı: Derinlik (48) ile sürekli pratik yaparak beceriyi ustalıkla sergileme (16).
17-62 Kabul Etme Kanalı: Mantıksal görüşleri detaylar ve gerçeklerle destekleyerek organize etme.
18-58 Yargı Kanalı: Toplumun iyiliği için neyin bozuk olduğunu tespit etme ve düzeltme çabası.
19-49 Sentez Kanalı: Kabileye (aileye) ait olma, hassasiyet ve devrimsel ihtiyaçların belirlenmesi.
20-34 Karizma Kanalı: Aynı anda hem iş yapıp hem konuşan, eyleme dönük saf karizma (Sadece MG'lerde bulunur).
20-57 Beyin Dalgası Kanalı: Anında ve çok keskin bir içgüdüsel farkındalıkla eyleme geçme.
21-45 Para Kanalı: Kabilenin (şirketin) yöneticisi, parayı, kontrolü ve kaynakları yöneten başkan.
23-43 Deha/Ucube Kanalı: Benzersiz, bireysel fikirleri bir anda "Biliyorum" diyerek aktarma. (Anlaşılmazsa ucube, anlaşılırsa deha).
24-61 Farkındalık Kanalı: Büyük evrensel sırları düşünmekten zihnin hiç durmaması. İlhamı akılcılaştırma.
25-51 İnisiyasyon Kanalı: Rekabetçi, şok edici ve evrensel sevgiye sıçrama yaşayan şamanik kanal.
26-44 Teslimiyet Kanalı: İnsanları kokusundan tanıyan muazzam bir pazarlamacı ve iletici.
27-50 Koruma Kanalı: Kendisine ve başkalarına bakma, besleme ve değerleri koruma kanalı.
28-38 Mücadele Kanalı: Hayatta bir anlam bulmak uğruna her türlü zorlukla savaşan azim.
29-46 Keşif Kanalı: "Evet" diyerek bedenle ve deneyimle derin bir şekilde tam olarak orada olma.
30-41 Tanınma Kanalı: İnanılmaz bir deneyim açlığı, yeni fanteziler kurma ve hissetme dalgası.
32-54 Dönüşüm Kanalı: Hırslı, basamakları tırmanan ve kalıcı başarı peşinde koşan işadamı enerjisi.
35-36 Geçicilik Kanalı: Sürekli krizlerle dolu, her şeyi bir kez denemeye aç duygusal deneyimci.
37-40 Topluluk Kanalı: Aile ve kabile için anlaşmalar yapan, sevgi ve emeği takas eden bağ.
39-55 Duygulanma Kanalı: Dramatik, romantik ve melankolik duygusal dalgalanmalar, ruhun şiiri.
42-53 Olgunlaşma Kanalı: Bir şeye doğru şekilde başlayıp onu sonuna kadar tamamlama gücü.
47-64 Soyutlama Kanalı: Geçmişteki karışık hatıraları zihinsel bir manaya oturtmaya çalışma.`
  },
  '3_64_kapilar_detay': {
    title: 'Ders 10: 64 Kapı Ansiklopedisi (DNA & I-Ching)',
    content: `Evrendeki her şey 64 hekzagram ile rezonansa girer. İnsan DNA'sındaki 64 Kodon ile kusursuzca eşleşen I-Ching'in 64 Kapısı haritamızdaki rakamlardır. Renkli olan kapılar sizin genetik mühürlerinizdir:

Kapı 1 (Yaratıcılık): Saf bireysel kendini ifade etme ihtiyacı. İlham kaynağıdır. (G Merkezi)
Kapı 2 (Yön ve Alıcılık): Ruhun yaşamdaki en doğal ve doğru yönünü bulmasıdır. (G Merkezi)
Kapı 3 (Zorluk): Kaostan düzen çıkaran, yeni şeyleri başlatan mutasyon enerjisi. (Sakral)
Kapı 4 (Formülizasyon): Başkalarının şüphelerini çözmek için formüller üretme zekası. (Ajna)
Kapı 5 (Bekleme): Bedenin ve doğanın sabit ritimleriyle akma yeteneği. Alışkanlıklar kapısı. (Sakral)
Kapı 6 (Çatışma): Sınırları belirleyen duygusal sürtüşme. Samimiyetin bekçisidir. (Solar)
Kapı 7 (Ordunun Rolü): Demokratik bir liderlik, perde arkasındaki yönlendirici güç. (G Merkezi)
Kapı 8 (Birliktelik): Bireysel yaratıcılığı topluma sunan, destekleyici ifade. (Boğaz)
Kapı 9 (Odak): Bütün gücünü ve dikkatini tek bir detaya verme kapasitesi. (Sakral)
Kapı 10 (Davranış): En saf haliyle "Kendini Sevme" ve hayatta kendi ayakları üzerinde durma. (G Merkezi)
Kapı 11 (Barış): İnançlarla ve toplumu aydınlatacak sayısız fikirle dolup taşma. (Ajna)
Kapı 12 (Durgunluk): Sosyal ruh haline göre konuşan veya susan, etkileyici ama temkinli dil. (Boğaz)
Kapı 13 (Dinleyici): İnsanların gelip tüm sırlarını anlattığı evrensel sırdaş. (G Merkezi)
Kapı 14 (Zenginlik): Maddi ve manevi kaynakları elinde tutan, simyacı enerjisi. (Sakral)
Kapı 15 (Aşırılık): Tüm aşırılıkları barındıran, insanlığa derin bir sevgi duyan aura. (G Merkezi)
Kapı 16 (Şevk): Sürekli tekrar yaparak becerilerini ustalık seviyesine çıkarma arzusu. (Boğaz)
Kapı 17 (Görüşler): Mantığa dayalı güçlü kişisel görüşler ve organize etme yeteneği. (Ajna)
Kapı 18 (Düzeltme): Neyin bozuk veya hatalı olduğunu anında gören mükemmeliyetçi yargı. (Dalak)
Kapı 19 (Yaklaşım): Ailenin ve topluluğun ihtiyaçlarına aşırı duyarlı, şefkatli yaklaşım. (Kök)
Kapı 20 (Şimdiki Zaman): Saf farkındalığın o anın içinde kelimelere veya eyleme dökülmesi. (Boğaz)
Kapı 21 (Isırarak Aşma): Kabilenin lideri, avcı. Kaynakları ve olayları kontrol etme ihtiyacı. (Ego)
Kapı 22 (Zarafet): Modu yerinde olduğunda dinleyicisini büyüleyen duygusal zarafet. (Solar)
Kapı 23 (Parçalanma): Karmaşık bireysel düşünceleri tek kelimeyle basitçe aktarma yetisi. (Boğaz)
Kapı 24 (Geri Dönüş): Bir şey zihinde "klik" edene kadar aynı düşünceleri defalarca rasyonalize etme. (Ajna)
Kapı 25 (Masumiyet): Her koşulda var olan, yargısız, saf evrensel sevgi ruhu. (G Merkezi)
Kapı 26 (Büyük Taming): Minimum çabayla maksimum etki yaratan, kurnaz pazarlamacı. (Ego)
Kapı 27 (Beslenme): Kendisini feda ederek başkalarına bakma, şefkat gösterme eğilimi. (Sakral)
Kapı 28 (Oyun): Sadece "uğruna ölünecek kadar anlamlı" olan zorluklar için savaşma. (Dalak)
Kapı 29 (Uçurum): Doğru şeye "Evet" dendiğinde muazzam bir adanmışlık ve bağlılık. (Sakral)
Kapı 30 (Tutunma): Duygusal fantezilere, kaderin cilvelerine ve arzulara tutunma. (Solar)
Kapı 31 (Etki): Seçilmiş, sözü dinlenen ve kitleleri ardı sıra sürükleyen lider dili. (Boğaz)
Kapı 32 (Süreklilik): Neyin kalıcı başarı getireceğini, neyin yatırım yapmaya değer olduğunu sezme. (Dalak)
Kapı 33 (Geri Çekilme): Olayları sindirmek ve anıları hatırlamak için yalnızlığa çekilme ihtiyacı. (Boğaz)
Kapı 34 (Büyük Güç): Saf, bencil ve kontrol edilemez yaşam enerjisi. Gücün kendisi. (Sakral)
Kapı 35 (İlerleme): Deneyim için deneyim yaşayan, değişiklik arayan eylem sesi. (Boğaz)
Kapı 36 (Kriz): Yeni ve duygusal olarak zorlu deneyimlerin içine balıklama atlayan cesaret. (Solar)
Kapı 37 (Aile): Topluluğu bir arada tutan, sevgi, şefkat ve kucaklama noktası. (Solar)
Kapı 38 (Muhalefet): İnatçı bir savaşçı. Sadece kendi inandığı amaç uğruna inat etme. (Kök)
Kapı 39 (Engel): İnsanların ruh haline dokunan, kışkırtan ve enerjilerini tetikleyen dalga. (Kök)
Kapı 40 (Yalnızlık): Kabileye hizmet ettikten sonra "Beni yalnız bırakın" diyerek inzivaya çekilen ego. (Ego)
Kapı 41 (Daralma): Yepyeni bir deneyime başlamak için gereken ham duygusal fantezi. (Kök)
Kapı 42 (Artış): Başlanmış bir işi veya döngüyü sonuna kadar tamamlama baskısı. (Sakral)
Kapı 43 (İçgörü): Hiç beklenmedik anlarda gelen "Buldum!" şeklindeki bireysel fikir sıçraması. (Ajna)
Kapı 44 (Buluşma): Geçmişin hatalarını hatırlayıp şimdiki ilişkileri doğru kurgulama içgüdüsü. (Dalak)
Kapı 45 (Bir Araya Gelme): "Benim" diyen ve sahip olduklarını koruyan kral/kraliçe figürü. (Boğaz)
Kapı 46 (Yukarı İtme): Fiziksel bedeni çok sevme, tensellik ve doğru yerde doğru zamanda olma. (G Merkezi)
Kapı 47 (Baskı): Geçmişteki anıların parçalarını birleştirerek "Aha!" anı yakalamaya çalışma. (Ajna)
Kapı 48 (Kuyu): Son derece derin, sezgisel ve pratik çözüm üretebilen bir bilgelik kuyusu. (Dalak)
Kapı 49 (Devrim): Prensip meselesi. İhtiyaçlar karşılanmazsa ilişkileri anında kesebilen devrimci. (Solar)
Kapı 50 (Kazan): Toplumun kurallarını, değerlerini ve yasalarını koruyan/koyan koruyucu. (Dalak)
Kapı 51 (Şok): Kendini ve başkalarını ruhsal olarak uyandırmak için şok etme eğilimi. (Ego)
Kapı 52 (Dağ): Pasif bir şekilde dağ gibi oturup, tüm enerjiyi tek bir noktaya odaklama baskısı. (Kök)
Kapı 53 (Gelişim): Sürekli yeni şeylere "başlama" ihtiyacı (tamamlama kapasitesi olmadan). (Kök)
Kapı 54 (Evlenen Genç Kız): Hırs. Ruhsal veya maddi olarak en tepeye tırmanma içgüdüsü. (Kök)
Kapı 55 (Bolluk): Duygusal ruh halinin zirvesi. Aşırı neşe ile melankoli arasında devasa dalgalar. (Solar)
Kapı 56 (Gezgin): Kendi inançlarını başkalarına fantastik hikayeler anlatarak aktarma. (Boğaz)
Kapı 57 (Hafif Rüzgar): Geleceği o anki içgüdüsel sezgi ile akustik olarak (duyarak) okuma yeteneği. (Dalak)
Kapı 58 (Neşe): Varoluşun saf sevinci. Bozuk olanı düzeltmek için bastıran canlılık. (Kök)
Kapı 59 (Dağılma): Duvarları yıkarak insanlarla en derin fiziksel ve ruhsal samimiyete girme. (Sakral)
Kapı 60 (Sınırlama): Eski kalıpların kısıtlamalarını kabullenerek yeni mutasyona izin verme. (Kök)
Kapı 61 (İçsel Gerçek): Bilinmeyeni, evrensel gizemleri çözmek için gelen şiddetli ilham baskısı. (Tepe)
Kapı 62 (Küçük Aşırılık): Detayların ustası. Görüşlerini mükemmel bir dil ve mantıkla ispatlama. (Boğaz)
Kapı 63 (Tamamlanmadan Sonra): Her şeyin doğruluğunu sorgulayan, şüpheci ve bilimsel mantık. (Tepe)
Kapı 64 (Tamamlanmadan Önce): Zihne dolan bir sürü imgeyi ve kafa karışıklığını bir anlama oturtma çabası. (Tepe)`
  }
}
"""

with open(FILE_PATH, "w", encoding="utf-8") as f:
    f.write(content)
print("Success")
