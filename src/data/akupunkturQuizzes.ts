import { Quiz } from './allQuizzes';

export const akupunkturQuiz1: Quiz = {
  id: "akupunktur_1",
  title: "1. Derece: Çıraklık Sınavı",
  description: "Chi enerjisi, meridyenlerin temel mantığı ve Yin-Yang felsefesi üzerine giriş sınavı.",
  questions: [
    {
      id: "aku_1_1",
      question: "Geleneksel Çin Tıbbında ve ezoterik anatomide bedeni canlandıran temel yaşam enerjisine ne ad verilir?",
      options: ["Prana", "Chi (Qi)", "Mana", "Aura"],
      correctAnswerIndex: 1,
      explanation: "Chi (veya Qi), evrensel yaşam enerjisidir. Bedenin canlılığını sağlayan, meridyenler boyunca akan temel şifa frekansıdır."
    },
    {
      id: "aku_1_2",
      question: "Yin ve Yang felsefesinde 'Yin' enerjisi genellikle neleri temsil eder?",
      options: ["Güneş, Eril, Sıcak ve Aktif", "Ay, Dişil, Soğuk ve Alıcı", "Ateş, Işık ve Gündüz", "Hareket, Ses ve Dışa dönüklük"],
      correctAnswerIndex: 1,
      explanation: "Yin enerjisi dişil prensibi, geceyi, soğuğu, suyu, sakinliği ve alıcılığı temsil eder."
    },
    {
      id: "aku_1_3",
      question: "Bedende Chi enerjisinin aktığı enerji kanallarına ne ad verilir?",
      options: ["Çakralar", "Nadi", "Meridyenler", "Auralar"],
      correctAnswerIndex: 2,
      explanation: "Meridyenler, yaşam enerjisinin (Chi) beden içinde dolaştığı, yeryüzündeki nehirler gibi akan enerji kanallarıdır."
    },
    {
      id: "aku_1_4",
      question: "Bir insanda kaç adet 'Ana' meridyen bulunur?",
      options: ["7", "10", "12", "14"],
      correctAnswerIndex: 2,
      explanation: "İnsan bedeninde organlarla bağlantılı olan tam 12 adet Ana Meridyen bulunur."
    },
    {
      id: "aku_1_5",
      question: "Akupunktur tedavisinin temel amacı nedir?",
      options: ["Sadece ağrıyı hissetmemek için sinirleri uyuşturmak", "Hastalığa neden olan bakterileri yok etmek", "Tıkanmış veya dengesi bozulmuş Chi enerjisinin akışını yeniden sağlamak", "Bedendeki kan miktarını artırmak"],
      correctAnswerIndex: 2,
      explanation: "Akupunktur, enerji kanallarındaki tıkanıklıkları (düğümleri) çözerek Chi akışını yeniden düzenler ve bedenin kendi kendini iyileştirmesini sağlar."
    },
    {
      id: "aku_1_6",
      question: "Hangi organ 'Yang' (eril/aktif) karakteristiğe sahiptir?",
      options: ["Karaciğer", "Kalp", "Mide", "Böbrek"],
      correctAnswerIndex: 2,
      explanation: "Çin tıbbında içi boş organlar (Mide, Bağırsaklar, Mesane) Yang organlardır; içi dolu organlar (Kalp, Karaciğer, Böbrek) ise Yin organlardır."
    },
    {
      id: "aku_1_7",
      question: "Akupunktur iğneleri bedene batırıldığında ezoterik olarak ne gerçekleşir?",
      options: ["Kan akışı hızlanarak iltihap dışarı atılır", "İğne bir anten gibi evrensel frekansı çeker ve hücresel düğümü çözer", "Sinir sistemi geçici olarak felç edilir", "Kaslar gevşeyerek sadece fiziksel bir rahatlama sağlar"],
      correctAnswerIndex: 1,
      explanation: "İğneler fiziksel bir araç olmanın ötesinde iletkendir. Meridyen noktasına uygulandığında kozmik akışın bedene girmesine aracılık eder."
    },
    {
      id: "aku_1_8",
      question: "Bir meridyende 'Chi' eksikliği (boşluk) yaşanırsa bedende ne tür belirtiler görülür?",
      options: ["Aşırı hiperaktivite", "Yüksek ateş ve kızarıklık", "Yorgunluk, üşüme ve o organın fonksiyonlarında zayıflık", "Sürekli öfke krizleri"],
      correctAnswerIndex: 2,
      explanation: "Chi eksikliği (Yin durumu), bedende durgunluğa, üşümeye, yorgunluğa ve zayıflığa neden olur."
    },
    {
      id: "aku_1_9",
      question: "Duygular ve organlar arasındaki ezoterik bağa göre, hastalıkların gerçek nedeni nerede başlar?",
      options: ["Sadece yenilen sağlıksız gıdalarda", "Fiziksel bedenin zayıflığında", "Zihindeki çözülmemiş duygusal blokajların meridyenleri tıkamasında", "Çevredeki virüslerde"],
      correctAnswerIndex: 2,
      explanation: "Hastalıklar ilk olarak enerji (eterik) bedende başlar. Çözülmemiş bir travma veya bastırılmış bir duygu, meridyeni tıkayarak fiziksel organı hastalandırır."
    },
    {
      id: "aku_1_10",
      question: "Ateş Elementi hangi organ çiftini yönetir?",
      options: ["Akciğer - Kalın Bağırsak", "Böbrek - Mesane", "Kalp - İnce Bağırsak", "Karaciğer - Safra Kesesi"],
      correctAnswerIndex: 2,
      explanation: "Ateş elementi, sevincin ve ruhun merkezi olan Kalp ile onun Yang eşi olan İnce Bağırsağı yönetir."
    }
  ]
};

export const akupunkturQuiz2: Quiz = {
  id: "akupunktur_2",
  title: "2. Derece: Kalfalık Sınavı",
  description: "12 Ana Meridyenin detaylı incelenmesi ve duygusal organ bağlantıları.",
  questions: [
    {
      id: "aku_2_1",
      question: "Akciğer Meridyeninde tıkanıklığa yol açan en temel duygu hangisidir?",
      options: ["Öfke", "Korku", "Keder ve Yas", "Aşırı Neşe"],
      correctAnswerIndex: 2,
      explanation: "Akciğerler kederi, tutulan yası ve derin üzüntüyü depolar. Astım ve bronşit gibi hastalıklar genellikle ağlanamamış gözyaşlarının sonucudur."
    },
    {
      id: "aku_2_2",
      question: "Karaciğer Meridyeninin enerjisini en çok hangi duygu tüketir?",
      options: ["Endişe ve Kararsızlık", "Öfke, Kızgınlık ve Hayal Kırıklığı", "Derin Korku", "Keder"],
      correctAnswerIndex: 1,
      explanation: "Karaciğer öfkenin merkezidir. Bastırılmış veya patlayıcı öfke karaciğer Chi'sini doğrudan bloke eder."
    },
    {
      id: "aku_2_3",
      question: "Böbrek Meridyeni bedenin hangi sistemiyle yakından ilişkilidir ve hangi duyguyu tutar?",
      options: ["Sindirim sistemi - Neşe", "Solunum sistemi - Üzüntü", "Yaşam enerjisi (Kök) ve Kemikler - Korku", "Kas sistemi - Öfke"],
      correctAnswerIndex: 2,
      explanation: "Böbrekler vücudun temel bataryasıdır; kemikleri yönetir ve yaşam korkularını (fobileri, güvensizliği) depolar."
    },
    {
      id: "aku_2_4",
      question: "Mide Meridyeni tıkanıklıkları ezoterik olarak hangi düşünce kalıbını yansıtır?",
      options: ["Geçmişten kopamama", "Yeni fikirleri, deneyimleri ve durumları 'sindirememe', sürekli endişe hali", "Gelecek korkusu", "Kendini ifade edememe"],
      correctAnswerIndex: 1,
      explanation: "Mide, sadece fiziksel besinleri değil, hayattaki olayları da hazmettiğimiz yerdir. Kararsızlıklar ve hayatı sindirememe mide sorunlarına yol açar."
    },
    {
      id: "aku_2_5",
      question: "Dalak Meridyeninin aşırı yorulmasına ne sebep olur?",
      options: ["Aşırı fiziksel egzersiz", "Sürekli zihinsel geviş getirme, saplantılı düşünceler ve takıntılı endişe", "Ani öfke patlamaları", "Aşırı tuz tüketimi"],
      correctAnswerIndex: 1,
      explanation: "Dalak zihinsel kapasiteyi yönetir. Bir konuyu kafada sürekli kurmak, takıntı yapmak ve endişe içinde kaybolmak Dalak enerjisini bitirir."
    },
    {
      id: "aku_2_6",
      question: "Kalp Meridyeni Çin tıbbında neyin 'Tahtı' olarak kabul edilir?",
      options: ["Fiziksel gücün", "Bağışıklık sisteminin", "Ruhun (Shen)", "Sindirim ateşinin"],
      correctAnswerIndex: 2,
      explanation: "Kalp, ruhun (Shen) oturduğu tahttır. Uykusuzluk, hafıza kaybı ve anksiyete, Kalp Shen'inin rahatsız olmasından kaynaklanır."
    },
    {
      id: "aku_2_7",
      question: "Beş Element (Wu Xing) döngüsüne göre 'Su' elementi hangi elementi besler?",
      options: ["Ateş", "Metal", "Ağaç", "Toprak"],
      correctAnswerIndex: 2,
      explanation: "Yaratılış döngüsünde Su Ağacı besler (Böbrekler Karaciğeri destekler), Ağaç Ateşi besler, Ateş Toprağı yaratır, Toprak Metali doğurur, Metal de Suyu oluşturur."
    },
    {
      id: "aku_2_8",
      question: "Hangi meridyenlerin akış saati sabah 03:00 - 05:00 arasıdır? (Bu saatlerde sık uyanmak o meridyende sorun olduğunu gösterir)",
      options: ["Kalp Meridyeni", "Akciğer Meridyeni", "Mide Meridyeni", "Karaciğer Meridyeni"],
      correctAnswerIndex: 1,
      explanation: "Akciğer Meridyeni güne başlayan ilk kanaldır ve 03:00 - 05:00 arası maksimum enerjiye ulaşır."
    },
    {
      id: "aku_2_9",
      question: "Karaciğer Meridyeni gece 01:00 - 03:00 arası aktiftir. Bu saatte uykusuzluk çeken birinin temel problemi ne olabilir?",
      options: ["Aşırı neşe", "Çözülememiş gizli öfkeler ve bedenin toksin atamaması", "Üzüntü", "Açlık"],
      correctAnswerIndex: 1,
      explanation: "Karaciğerin kanı temizlediği bu saatlerde sık sık uyanmak, bilinçaltında bastırılmış büyük bir öfkenin veya kinin işareti olabilir."
    },
    {
      id: "aku_2_10",
      question: "'Gözler', hangi organın dışarıya açılan penceresidir?",
      options: ["Böbrek", "Karaciğer", "Akciğer", "Kalp"],
      correctAnswerIndex: 1,
      explanation: "Çin tıbbında Karaciğer gözlere açılır. Görme bozuklukları, göz kuruluğu veya göz iltihapları Karaciğer meridyeniyle ilgilidir."
    },
    {
      id: "aku_2_11",
      question: "Kulaklar hangi organın dışarıya açılan kapısıdır?",
      options: ["Kalp", "Mide", "Böbrek", "Dalak"],
      correctAnswerIndex: 2,
      explanation: "Böbrekler kulaklara açılır. İşitme kaybı veya kulak çınlaması (Tinnitus) Böbrek enerjisinin zayıflamasının en net belirtisidir."
    },
    {
      id: "aku_2_12",
      question: "Beş element döngüsünde 'Toprak' elementini temsil eden organlar hangileridir?",
      options: ["Kalp - İnce Bağırsak", "Karaciğer - Safra Kesesi", "Dalak - Mide", "Akciğer - Kalın Bağırsak"],
      correctAnswerIndex: 2,
      explanation: "Dalak (Yin) ve Mide (Yang), besinleri işleyip enerjiye dönüştürdükleri için Toprak elementini temsil ederler."
    },
    {
      id: "aku_2_13",
      question: "Kalın Bağırsak Meridyeninin duygusal görevi nedir?",
      options: ["Geçmişi ve gereksiz olanı bırakabilmek (Fiziksel ve duygusal boşaltım)", "Yeni fikirler üretmek", "Korkularla yüzleşmek", "Kan üretmek"],
      correctAnswerIndex: 0,
      explanation: "Kalın Bağırsak atma eylemini gerçekleştirir. Duygusal olarak, geçmişte işe yaramayan anıları ve tutkuları bırakamamak bu meridyeni tıkar (Kabızlık)."
    },
    {
      id: "aku_2_14",
      question: "Bir kişi her zaman 'tatlı' yeme ihtiyacı hissediyorsa, bu hangi meridyende bir enerji dengesizliğine işaret eder?",
      options: ["Böbrek", "Karaciğer", "Dalak / Mide", "Akciğer"],
      correctAnswerIndex: 2,
      explanation: "Her elementin bir tadı vardır. Toprak elementinin (Dalak/Mide) tadı tatlıdır. Aşırı tatlı isteği, dalak enerjisinin zayıfladığını ve sevgi (haz) ihtiyacını gösterir."
    },
    {
      id: "aku_2_15",
      question: "Aşırı 'tuzlu' çekmek hangi organın sinyalidir?",
      options: ["Kalp", "Böbrek", "Karaciğer", "Dalak"],
      correctAnswerIndex: 1,
      explanation: "Su elementinin (Böbreklerin) tadı tuzludur. Böbrek enerjisi (Korku frekansı) dengesizleştiğinde bedenin tuz ihtiyacı artar."
    },
    {
      id: "aku_2_16",
      question: "Safra Kesesi Meridyeninin psikolojik işlevi nedir?",
      options: ["Sevgi alışverişi", "Hafıza tutma", "Karar verme mekanizması ve cesaret", "Ağlama refleksi"],
      correctAnswerIndex: 2,
      explanation: "Safra kesesi karar vermeyi yönetir. Kararsızlık, cesaretsizlik ve eyleme geçememe, Safra Kesesi meridyenindeki bir blokajın sonucudur."
    },
    {
      id: "aku_2_17",
      question: "Bedendeki 'Wei Chi' (Koruyucu Enerji) hangi organ tarafından bedenin yüzeyine yayılır?",
      options: ["Mide", "Akciğer", "Kalp", "Böbrek"],
      correctAnswerIndex: 1,
      explanation: "Akciğerler, bedenin bağışıklık kalkanı olan Wei Chi enerjisini cildin hemen altına yayarak dış etkenlere (rüzgar, soğuk) karşı koruma sağlar."
    },
    {
      id: "aku_2_18",
      question: "Diller (Konuşma) hangi organla bağlantılıdır?",
      options: ["Akciğer", "Kalp", "Dalak", "Böbrek"],
      correctAnswerIndex: 1,
      explanation: "Dil, Kalbin filizidir. Konuşma bozuklukları, kekemelik veya çok hızlı anlamsız konuşma, Kalp Shen'inin dengesizliğini gösterir."
    },
    {
      id: "aku_2_19",
      question: "Üçlü Isıtıcı (San Jiao) Meridyeninin görevi nedir?",
      options: ["Sadece kalbi korur", "Fiziksel bir organı yoktur; bedendeki su metabolizmasını, sıcaklık dengesini ve enerji geçişlerini düzenler", "Kan üretir", "Kemiği besler"],
      correctAnswerIndex: 1,
      explanation: "Üçlü Isıtıcı, Çin tıbbına özgü soyut bir organdır. Bedenin üst, orta ve alt kısımları arasındaki su ve enerji (Chi) transferini koordine eder."
    },
    {
      id: "aku_2_20",
      question: "Perikard (Kalp Zarı) Meridyeninin duygusal koruyuculuğu nedir?",
      options: ["Korkuları böbreklere hapseder", "Kalbi aşırı sevinçten ve dışsal şoklardan koruyan kalkan görevi görür", "Geçmişin hatıralarını tutar", "Öfkeyi yönlendirir"],
      correctAnswerIndex: 1,
      explanation: "Perikard, Kalbin (İmparatorun) koruyucusudur. Kalbe giden duygusal travmaları, şokları ve aşk acılarını önce o karşılar."
    }
  ]
};

export const akupunkturQuiz3: Quiz = {
  id: "akupunktur_3",
  title: "3. Derece: Üstatlık Sınavı",
  description: "Yönetici meridyenler, Beş Element hastalık patolojileri ve ezoterik teşhis sanatı.",
  questions: [
    {
      id: "aku_3_1",
      question: "Ren Mai (Kavrama Damarı) hangi enerjinin merkezi sayılır ve nereden geçer?",
      options: ["Yang enerjinin denizi / Sırttan geçer", "Yin enerjinin denizi / Bedenin tam ön orta hattından geçer", "Chi'nin okyanusu / Bacaklardan geçer", "Kanın merkezi / Kollardan geçer"],
      correctAnswerIndex: 1,
      explanation: "Ren Mai, tüm Yin meridyenlerin anasıdır. Perineden başlayıp bedenin tam ön orta hattından dudağa kadar yükselir."
    },
    {
      id: "aku_3_2",
      question: "Du Mai (Yönetici Damar) hangi enerjinin kaynağıdır ve yolu nasıldır?",
      options: ["Tüm Yang meridyenlerin denizi / Kuyruk sokumundan başlayıp omurga boyunca başın tepesine çıkar", "Tüm Yin meridyenlerin denizi / Sadece göğüste bulunur", "Sindirim enerjisi / Mideden kalbe gider", "Kök enerjisi / Ayak tabanından başlar"],
      correctAnswerIndex: 0,
      explanation: "Du Mai, Yang enerjisinin merkezidir. Omurga boyunca yükseldiği için tüm sinir sistemini ve beyin fonksiyonlarını doğrudan yönetir."
    },
    {
      id: "aku_3_3",
      question: "Ming Men (Yaşam Kapısı Ateşi) noktası nerededir ve neyi temsil eder?",
      options: ["Kalpte / Ruhun kapısıdır", "İki böbreğin arasında (belde) / Bedeni ısıtan ve böbrek özünü (Jing) ateşleyen kaynaktır", "Alında / Üçüncü Gözdür", "Göbek deliğinde / Sindirim merkezidir"],
      correctAnswerIndex: 1,
      explanation: "Ming Men, yaşamın ateşidir. Bedendeki tüm fizyolojik süreçlerin, özellikle de böbrek Yang'ının ve cinsel enerjinin temel kaynağıdır."
    },
    {
      id: "aku_3_4",
      question: "Beş elementte 'Karşılıklı Kontrol (Yıkım)' döngüsüne göre Su elementi kimi kontrol eder?",
      options: ["Toprağı", "Ağacı", "Ateşi", "Metali"],
      correctAnswerIndex: 2,
      explanation: "Su Ateşi söndürür. Böbrek (Su) enerjisi zayıfladığında, Kalp (Ateş) aşırı hararetlenir (Uykusuzluk, çarpıntı)."
    },
    {
      id: "aku_3_5",
      question: "Akupunkturda 'De Qi' (Çi'nin Elde Edilmesi) hissi nedir?",
      options: ["İğne batırıldığında hastanın bağırması", "İğnenin olduğu bölgede hissedilen uyuşma, ağırlık, elektriklenme veya çekilme hissidir", "Kanama olması", "İğnenin kırılması"],
      correctAnswerIndex: 1,
      explanation: "De Qi, iğnenin enerji kanalına doğru şekilde ulaştığını ve enerjinin (Chi) iğneyi sardığını gösteren fiziksel bir histir."
    },
    {
      id: "aku_3_6",
      question: "Jing (Yaşam Özü) kavramı Çin tıbbında ne anlama gelir?",
      options: ["Soluduğumuz havadır", "Anne ve babadan miras aldığımız, böbreklerde depolanan ve yaşlandıkça tükenen genetik hayat sermayesidir", "Yediğimiz yemekten alınan enerjidir", "Sadece su demektir"],
      correctAnswerIndex: 1,
      explanation: "Jing, prenatal (doğum öncesi) özümüzdür. Tükendiğinde yaşlanma başlar. Jing'i korumak, uzun ve sağlıklı yaşamanın sırrıdır."
    },
    {
      id: "aku_3_7",
      question: "'Rüzgar', Çin tıbbında patojen (hastalık yapıcı) faktör olarak neyi temsil eder?",
      options: ["Sadece üşütmeyi", "Hastalıkların hızla yer değiştirmesini, ani felçleri, spazmları ve vücudun üst kısmına vuran rahatsızlıkları", "Sindirim problemlerini", "Kalp krizini"],
      correctAnswerIndex: 1,
      explanation: "Rüzgar yüz yüz hastalıkların anasıdır. Hastalığın hızla hareket etmesi (gezici ağrılar), titreme, spazm ve aniden ortaya çıkması Rüzgar karakteridir."
    },
    {
      id: "aku_3_8",
      question: "Nabız teşhisi (Pulse Diagnosis) ustalarına göre, sağ bilekteki nabız hangi organların durumunu gösterir?",
      options: ["Kalp ve Karaciğer", "Akciğer ve Dalak/Mide", "Böbrekler", "Safra Kesesi"],
      correctAnswerIndex: 1,
      explanation: "Sağ bilekte Akciğer, Dalak ve Böbrek Yang enerjisi okunurken; sol bilekte Kalp, Karaciğer ve Böbrek Yin enerjisi okunur."
    },
    {
      id: "aku_3_9",
      question: "Dil teşhisinde dilin ucunun çok kırmızı olması hangi organın durumunu gösterir?",
      options: ["Dalak eksikliği", "Böbrek soğukluğu", "Kalpte Ateş (Aşırı stres, uykusuzluk, anksiyete)", "Karaciğer durgunluğu"],
      correctAnswerIndex: 2,
      explanation: "Dilin ucu Kalbi temsil eder. Kırmızı ve noktalı bir dil ucu, Kalp meridyeninde aşırı ateş ve duygusal travma olduğunu gösterir."
    },
    {
      id: "aku_3_10",
      question: "Karaciğer Qi Durgunluğu (Stagnation) en çok hangi duruma sebep olur?",
      options: ["Aşırı neşe", "Depresyon, boğazda yumru hissi (Globus hystericus), adet düzensizliği ve göğüs sıkışması", "İshal", "Terleme"],
      correctAnswerIndex: 1,
      explanation: "Bastırılmış öfke Karaciğer enerjisini durdurur. Bu durum bedenin yan kısımlarında gerginliğe, depresyona ve boğazda bir şey takılmış hissine neden olur."
    },
    {
      id: "aku_3_11",
      question: "Akupresürde 'Hegu' (LI4) noktası başparmak ile işaret parmağı arasındadır. Bu nokta özellikle ne için kullanılır?",
      options: ["Kısırlık tedavisi", "Yüz ve baş bölgesindeki tüm ağrılar (Diş, baş ağrısı, sinüzit)", "Ayak burkulmaları", "Kalp krizi anı"],
      correctAnswerIndex: 1,
      explanation: "Hegu noktası, kalın bağırsak meridyeninde yer alır ve baş/yüz bölgesinin ustasıdır. Baş ağrılarını bıçak gibi kesme özelliğiyle bilinir."
    },
    {
      id: "aku_3_12",
      question: "Zu San Li (ST36) noktası dizin hemen altındadır. Bu noktanın ezoterik lakabı nedir?",
      options: ["Ağrı kesici", "Gözleri açan nokta", "İlahi Uzun Ömür ve Üç Mil noktası (Bağışıklığı ve enerjiyi olağanüstü artırır)", "Ölüm noktası"],
      correctAnswerIndex: 2,
      explanation: "Zu San Li, Mide meridyenindedir. Eski askerlerin yorgunluktan yürüyemediklerinde bu noktayı uyararak 'üç mil daha' yürüdükleri söylenir."
    },
    {
      id: "aku_3_13",
      question: "Yin organlar enerjiyi __________, Yang organlar ise _________.",
      options: ["Boşaltır / Tutar", "Tutar ve üretir (Depolar) / Besinleri işler, iletir ve atar (Boşaltır)", "Yaklaşır / Uzaklaşır", "Yaratır / Yok eder"],
      correctAnswerIndex: 1,
      explanation: "Yin organlar yaşamın temel özlerini (Kan, Chi, Jing) saf halde tutar. Yang organlar ise dışarıdan geleni işleyip posasını dışarı atar."
    },
    {
      id: "aku_3_14",
      question: "Meridyen saatine göre Mide'nin maksimum çalıştığı saatler 07:00 - 09:00 arasıdır. Bu ezoterik olarak ne anlama gelir?",
      options: ["Bu saatte asla yemek yenmemelidir", "Günün en ağır, besleyici ve enerjik öğünü (Kahvaltı) bu saatlerde sindirilmelidir", "Bu saatte sadece su içilmelidir", "Mide bu saatte dinlenir"],
      correctAnswerIndex: 1,
      explanation: "Mide enerjisinin zirvede olduğu 07:00 - 09:00 arası, bedenin Toprak elementinden en yüksek besini alabileceği şifa saatidir."
    },
    {
      id: "aku_3_15",
      question: "Shen (Ruh) bozuklukları (Şizofreni, halüsinasyon, manik durumlar) Çin tıbbında genellikle neyle açıklanır?",
      options: ["Böbreklerin aşırı çalışmasıyla", "Balgamın (Ağır nemin) Kalp deliklerini tıkaması ve Kalp ateşinin kontrolden çıkmasıyla", "Akciğer yetmezliğiyle", "Karaciğer büyümesiyle"],
      correctAnswerIndex: 1,
      explanation: "Balgam, sadece fiziksel sümük değil, enerjinin katılaşmış halidir. Bu yoğun negatif enerji Kalp Shen'inin kapılarını tıkadığında bilinç bulanır."
    },
    {
      id: "aku_3_16",
      question: "Yin ve Yang birbirine dönüştüğünde ne olur?",
      options: ["İkisi de yok olur", "Gece gündüze, kış yaza, hastalık şifaya dönüşür (Aşırı Yin Yang'ı doğurur)", "Zaman durur", "Karmik borç ödenmez"],
      correctAnswerIndex: 1,
      explanation: "Evrendeki her şey zirveye ulaştığında zıddına dönüşür. Aşırı soğuk (Yin) bedende yanma (Yang) hissi yaratır. Ateşin zirvesi külü (soğumayı) getirir."
    },
    {
      id: "aku_3_17",
      question: "Shen, Hun, Po, Yi, Zhi nedir?",
      options: ["Akupunktur iğneleri", "Beş organın içinde barındırdığı Beş Ruhani varlıktır (Kalp-Shen, Karaciğer-Hun, Akciğer-Po, Dalak-Yi, Böbrek-Zhi)", "Gezegen isimleri", "Çay türleri"],
      correctAnswerIndex: 1,
      explanation: "Taoist anatomiye göre ruh tek parça değildir. Hun (Eterik Ruh), Po (Fiziksel Ruh), Yi (İrade/Zeka) ve Zhi (Yaşam İradesi) organlarda ikamet eder."
    },
    {
      id: "aku_3_18",
      question: "Astım hastalığı ezoterik olarak hangi iki organın uyumsuzluğu olarak teşhis edilir?",
      options: ["Kalp ve Karaciğer", "Mide ve Dalak", "Akciğer (Nefesi alan) ve Böbrek (Nefesi aşağı çeken ve tutan)", "Safra Kesesi ve Kalın Bağırsak"],
      correctAnswerIndex: 2,
      explanation: "Akciğerler nefesi alır, ancak Böbrekler bu nefesi aşağıya çekip köklendiremezse (Korku blokajı), nefes yukarı kaçar ve astım krizi (nefes darlığı) oluşur."
    },
    {
      id: "aku_3_19",
      question: "Akupunkturda 'Ah Shi' noktaları ne demektir?",
      options: ["Ölüm noktaları", "Sabit yeri olmayan, hastanın 'Ah! İşte orası ağrıyor' dediği anlık tetik (trigger) noktalarıdır", "Sadece başta bulunan noktalar", "İğnesiz noktalar"],
      correctAnswerIndex: 1,
      explanation: "Ah Shi noktaları, meridyen hattı üzerinde olmasa bile travmanın düğümlendiği spontane acı noktalarıdır."
    },
    {
      id: "aku_3_20",
      question: "Gua Sha veya Kupa terapisi (Hacamat), akupunktur felsefesinde ne amaçla yapılır?",
      options: ["Kasları eritmek için", "Deri altındaki kılcal damarları patlatmak için", "Durgunlaşmış kanı (Staz) ve yüzeydeki Rüzgar/Soğuk patojenleri çekip çıkartmak için", "Sadece masaj hissi için"],
      correctAnswerIndex: 2,
      explanation: "Ağrının olduğu yerde kan ve Qi durgunluğu (staz) vardır. Kupa veya kazıma (Gua Sha), o durgunluğu yüzeye çekerek enerji nehrinin önünü açar."
    },
    {
      id: "aku_3_21",
      question: "Toprak elementi (Mide/Dalak) dengesizliğinde bedende en çok ne birikir?",
      options: ["Ateş", "Rüzgar", "Nem (Rutubet - Kilo, ödem, ağırlık, tembellik)", "Kuruluk"],
      correctAnswerIndex: 2,
      explanation: "Toprak suyu emer. Dalak zayıfladığında suyu işleyemez ve bedende 'Nem' birikir. Bu da selülit, obezite, ödem ve kafada sisti yaratır."
    },
    {
      id: "aku_3_22",
      question: "Bir kişinin sesi sürekli ağlamaklıysa, hangi organının Qi'si zayıftır?",
      options: ["Akciğer", "Karaciğer", "Kalp", "Mide"],
      correctAnswerIndex: 0,
      explanation: "Sesin tonu organları ele verir. Ağlamaklı ve zayıf bir ses, kederin merkezi olan Akciğer Qi'sinin tükendiğini gösterir."
    },
    {
      id: "aku_3_23",
      question: "Bağıran, emreden ve yüksek tonda konuşan bir ses hangi elementin dengesizliğidir?",
      options: ["Su", "Toprak", "Ağaç (Karaciğer Öfkesi)", "Metal"],
      correctAnswerIndex: 2,
      explanation: "Ağaç elementi genişlemeyi ve öfkeyi temsil eder. Karaciğer enerjisi çok yükseldiğinde kişi farkında olmadan bağırarak ve saldırgan konuşur."
    },
    {
      id: "aku_3_24",
      question: "Meridyen felsefesinde 'Ağrı'nın tanımı nedir?",
      options: ["Tanrının cezası", "Sadece doku zedelenmesi", "Qi'nin (Enerjinin) o bölgeden geçememesi, akışın durması", "Yaşlılık"],
      correctAnswerIndex: 2,
      explanation: "Ünlü Çin tıbbı kuralı: 'Qi nereye akarsa orası yaşar. Qi durursa ağrı başlar. Eğer akış varsa ağrı yoktur; ağrı varsa akış yoktur.'"
    },
    {
      id: "aku_3_25",
      question: "Akupunktur sistemine göre 'Chong Mai' (Penetran Damar) neyi temsil eder?",
      options: ["Kanın Denizini", "Terin Denizini", "Gözyaşı Denizini", "Öfke Denizini"],
      correctAnswerIndex: 0,
      explanation: "Chong Mai, Kanın Denizi olarak bilinir. Özellikle kadın fizyolojisinde (adet döngüsü, hamilelik) en kritik enerji merkezidir."
    },
    {
      id: "aku_3_26",
      question: "Bedenin ön tarafında Yin, arka tarafında Yang kanallar geçer. Bunun istisnası olan ve bedenin önünden geçen tek Yang meridyen hangisidir?",
      options: ["Mide Meridyeni", "Mesane Meridyeni", "Safra Kesesi Meridyeni", "Kalın Bağırsak Meridyeni"],
      correctAnswerIndex: 0,
      explanation: "Mide Meridyeni (Yang) gözden başlayıp göğüs ve karın bölgesinden (bedenin önünden) ayağa kadar inen tek Yang kanaldır."
    },
    {
      id: "aku_3_27",
      question: "İçsel patojenler (hastalık yapıcılar) 'Duygular'dır. Dışsal patojenler nelerdir?",
      options: ["Virüsler ve bakteriler", "Rüzgar, Soğuk, Yaz Sıcağı, Nem, Kuruluk, Ateş (Altı İklimsel Faktör)", "Yiyecekler", "Stres"],
      correctAnswerIndex: 1,
      explanation: "Çin tıbbı mikroplarla değil, doğanın enerjileriyle ilgilenir. Beden zayıfladığında dışarıdaki Soğuk, Rüzgar veya Nem bedene nüfuz ederek hastalığa yol açar."
    },
    {
      id: "aku_3_28",
      question: "Ateş Elementi (Kalp) Su Elementinden (Böbrekler) daha yukarıda yer alır. Sağlıklı bir bedende bu iki enerjinin ilişkisi nasıl olmalıdır?",
      options: ["Birbirlerine hiç değmemelidirler", "Kalbin Ateşi aşağı inip Böbrek Suyunu ısıtmalı, Böbreğin Suyu yukarı çıkıp Kalp Ateşini serinletmelidir", "Kalp Ateşi tamamen suyu kurutmalıdır", "Su Ateşi tamamen söndürmelidir"],
      correctAnswerIndex: 1,
      explanation: "Su ve Ateş arasındaki bu muazzam iletişim (Yin Yang dengesi) bedenin ısısını ayarlar. Bu bağ koptuğunda üstte ateş basmaları (panik), altta üşüme başlar."
    },
    {
      id: "aku_3_29",
      question: "Hangi duygu 'Qi' enerjisini bedende düğümler ve durgunlaştırır?",
      options: ["Aşırı Düşünmek (Endişe)", "Korku", "Öfke", "Keder"],
      correctAnswerIndex: 0,
      explanation: "Korku enerjiyi aşağı çeker (altını ıslatma). Öfke enerjiyi yukarı çıkarır (beyin kanaması, kırmızı yüz). Keder enerjiyi çözer/tüketir. Aşırı düşünmek (Dalak/Mide) ise enerjiyi düğümler ve kilitler."
    },
    {
      id: "aku_3_30",
      question: "Nihai şifa olan 'Shen Ming' (Ruhsal Aydınlık) evresine ulaşan bir üstat, bedeni nasıl tanımlar?",
      options: ["Yok edilecek bir illüzyon", "Ruhun kendini ifade ettiği kutsal bir tapınak ve evrenin mükemmel mikro yansıması", "Acı çeken et yığını", "Makinadan farksız bir sistem"],
      correctAnswerIndex: 1,
      explanation: "Taoist şifada beden, evrenin bir kopyasıdır. Hastalık bir düşman değil, ruhun kendi yolunu bulması için bedenin verdiği kutsal bir mesajdır."
    }
  ]
};
