import { runeQuizzes } from './runeQuizzes';
import { numerolojiQuiz2Advanced, numerolojiQuiz3Advanced } from './numerologyQuizzesAdvanced';
import { allYogaQuizzes } from './yogaQuizzes';
import { allHumanDesignQuizzes } from './humanDesignQuizzes';
import { allAstrologyQuizzes } from './astrologyQuizzes';
import { akupunkturQuiz1, akupunkturQuiz2, akupunkturQuiz3 } from './akupunkturQuizzes';
import { duygusalHastaliklarQuiz } from './duygusalHastaliklarQuiz';
import { kabbalahQuizCiraklik } from './kabbalahQuizCiraklik';
import { kabbalahQuizKalfalik } from './kabbalahQuizKalfalik';

export interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctAnswerIndex: number;
  explanation: string;
}

export interface Quiz {
  id: string;
  title: string;
  description: string;
  questions: QuizQuestion[];
}

export const numerolojiQuiz1: Quiz = {
  id: "numeroloji_1",
  title: "1. Derece: Çıraklık Sınavı",
  description: "Pisagor sistemi ve temel titreşimler üzerine giriş seviyesi inisiyasyon sınavı.",
  questions: [
    {
      id: "num_1",
      question: "Numerolojide 'Yaşam Yolu Sayısı' (Life Path) kişinin hangi bilgisinden hesaplanır?",
      options: [
        "Kişinin tam adındaki sesli harflerden",
        "Kişinin tam adındaki tüm harflerden",
        "Kişinin tam doğum tarihinin (gün, ay, yıl) toplanmasından",
        "Kişinin doğduğu saatin ay fazına göre"
      ],
      correctAnswerIndex: 2,
      explanation: "Yaşam Yolu Sayısı, ruhun bu hayattaki ana dersini ve rotasını belirler. Bu sayı, değiştirilemez olan tek şeyden; doğduğunuz gün, ay ve yılın tüm rakamlarının tek bir haneye inene kadar toplanmasıyla elde edilir."
    },
    {
      id: "num_2",
      question: "Hangi sayı 'Evrensel Şifacı' veya 'İsa Bilinci' olarak bilinir ve numerolojideki en nadir Üstat Sayıdır?",
      options: [
        "11",
        "22",
        "33",
        "9"
      ],
      correctAnswerIndex: 2,
      explanation: "33 sayısı, 11 (Vizyon) ve 22 (Eylem) sayılarının enerjilerini barındıran en yüksek ruhsal frekanstır. Kozmik ve koşulsuz sevginin, fedakarlığın ve ruhsal ustalığın doruk noktasını temsil eder."
    },
    {
      id: "num_3",
      question: "Pisagor sisteminde 'Kader Sayısı' (veya İfade Sayısı) kişinin hangi potansiyelini açıklar?",
      options: [
        "Geçmiş yaşamlardan getirdiği karmik borçları",
        "Hayatta doğuştan sahip olduğu yetenekleri ve potansiyelini nasıl ifade edeceğini",
        "Gelecekte yaşayacağı dönüm noktası tarihlerini",
        "Hangi sayılarla uyumlu aşk yaşayacağını"
      ],
      correctAnswerIndex: 1,
      explanation: "Kader (İfade) sayısı, tam doğum ismindeki TIK harflerin sayısal karşılıklarının toplanmasıyla bulunur. Bu hayatta size verilen 'araç kutusu' ve yeteneklerinizin dünya sahnesinde nasıl ifade bulacağını gösterir."
    },
    {
      id: "num_4",
      question: "Gezegensel karşılığı Güneş, elementi Ateş olan ve 'Yeni Başlangıçların, Yaratımın ve Liderliğin' frekansını taşıyan sayı hangisidir?",
      options: [
        "1",
        "3",
        "5",
        "8"
      ],
      correctAnswerIndex: 0,
      explanation: "1 sayısı ilk kıvılcımdır. Öncülüğü, cesareti ve bireyselliği sembolize eder. Tıpkı Güneş'in kendi sisteminin merkezi olması gibi, 1 titreşimi de bağımsızlık ve ego bilinciyle bağlantılıdır."
    },
    {
      id: "num_5",
      question: "Bir kişinin analizinde 13, 14, 16 veya 19 sayıları belirirse, bunlar numerolojide ne olarak adlandırılır?",
      options: [
        "Üstat Sayılar",
        "Melek Sayıları",
        "Karmik Borç Sayıları",
        "Ruh Eşi Sayıları"
      ],
      correctAnswerIndex: 2,
      explanation: "Karmik borç sayıları, ruhun önceki enkarnasyonlarından bu hayata taşıdığı ve dengelemesi gereken özel yükleri temsil eder. Örneğin 13, çalışmanın suistimalini; 16 ise ego/kibir yıkımını sembolize eder."
    },
    {
      id: "num_6",
      question: "5 sayısının arketipik temsilinde aşağıdakilerden hangisi en belirgindir?",
      options: [
        "Disiplin, sistem kurma ve değişmezlik",
        "Özgürlük, adaptasyon, merak ve sürekli değişim",
        "Maddi bolluk ve yönetici otorite",
        "Aile, yuva ve koşulsuz sevgi"
      ],
      correctAnswerIndex: 1,
      explanation: "5 sayısı numerolojinin en hareketli frekansıdır. Elementi havadır, Merkür tarafından yönetilir. Kalıpları kırmayı, sınırları aşmayı, deneyimi ve değişimi kucaklamayı temsil eder."
    },
    {
      id: "num_7",
      question: "'Ruh Güdüsü' (Soul Urge / Kalp Arzusu) sayısı kişinin tam ismindeki hangi harfler toplanarak bulunur?",
      options: [
        "Sadece sesli harfler",
        "Sadece sessiz harfler",
        "İsim ve soyisimdeki ilk harfler",
        "Doğum tarihindeki aylar"
      ],
      correctAnswerIndex: 0,
      explanation: "Ruh Güdüsü sayısı, kişinin tam ismindeki sadece 'SESLİ' harflerin toplanmasıyla elde edilir. Sesli harfler nefes ve ruhtur; bu yüzden kişinin en derin, genellikle dışarıya yansıtmadığı içsel arzularını gösterir."
    },
    {
      id: "num_8",
      question: "Pisagor tablosuna göre 'A, J, S, Ş' harfleri hangi sayısal titreşime karşılık gelir?",
      options: [
        "1",
        "2",
        "4",
        "9"
      ],
      correctAnswerIndex: 0,
      explanation: "Pisagor harf/rakam tablosunda harfler 1'den 9'a kadar sırayla dizilir. A=1, B=2... I=9. Sonra J'den (1) devam eder. Dolayısıyla A, J, S harfleri başlangıç enerjisi olan 1 titreşimini taşır."
    },
    {
      id: "num_9",
      question: "Sonsuzluk işaretini (∞) dikey taşıyan, Satürn yönetiminde maddi ve manevi dünyalar arasındaki güç/denge döngüsünü temsil eden sayı hangisidir?",
      options: [
        "4",
        "6",
        "8",
        "22"
      ],
      correctAnswerIndex: 2,
      explanation: "8 sayısı karmik dengenin, otoritenin ve yöneticiliğin sayısıdır. Sonsuzluk işaretinin dik halidir; ruhani dünyadan alınan gücün (yukarı), maddi dünyaya (aşağı) eyleme geçirilmesini sembolize eder."
    },
    {
      id: "num_10",
      question: "Üstat sayılar (11, 22, 33 vb.) hesaplama esnasında tek haneye indirgenmeden önce nasıl ele alınır?",
      options: [
        "Hemen toplanıp sırasıyla 2, 4, 6 yapılırlar",
        "Doğrudan silinip karmik borca dönüşürler",
        "Sadeleştirilmez, kendi özel ruhsal potansiyelleriyle ayrıca yorumlanırlar",
        "Sadece doğum gününde çıkarsa hesaba katılırlar"
      ],
      correctAnswerIndex: 2,
      explanation: "Hesaplama sırasında 11, 22 veya 33 gibi bir sonuca ulaşıldığında bu sayılar kendi içlerinde toplanıp tek haneye (2, 4, 6) İNDİRGENMEZLER. Çünkü bu sayılar, taşıyıcısına yüksek manevi zorluklar ve evrensel bir potansiyel sunan Üstat frekanslarıdır."
    }
  ]
};

export const allQuizzes: Record<string, Quiz> = {
  ...runeQuizzes,
  ...allYogaQuizzes,
  ...allHumanDesignQuizzes,
  ...allAstrologyQuizzes,
  'numeroloji_1': numerolojiQuiz1,
  'numeroloji_2': numerolojiQuiz2Advanced,
  'numeroloji_3': numerolojiQuiz3Advanced,
  'akupunktur_1': akupunkturQuiz1,
  'akupunktur_2': akupunkturQuiz2,
  'akupunktur_3': akupunkturQuiz3,
  'duygusal_hastaliklar_50': duygusalHastaliklarQuiz,
  'kabbalah_1': kabbalahQuizCiraklik,
  'kabbalah_2': kabbalahQuizKalfalik,
};
