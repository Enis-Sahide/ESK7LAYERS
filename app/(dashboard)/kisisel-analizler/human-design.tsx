import React, { useState, useRef, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TextInput, TouchableOpacity, Alert, ImageBackground, KeyboardAvoidingView, Platform, Dimensions, Modal, Keyboard } from 'react-native';
import { BlurView } from 'expo-blur';
import { LinearGradient } from 'expo-linear-gradient';
import Svg, { Polygon, Rect, Line, Circle, Polyline, Text as SvgText, G, Path, Image as SvgImage } from 'react-native-svg';
import { generateChart, HumanDesignChart, CenterCode, PLANET_SYMBOLS, CHANNELS } from '@/src/features/human-design/engine/HumanDesignEngine';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import moment from 'moment-timezone';
import tzlookup from 'tz-lookup';
import { useContent } from '@/src/core/content/useContent';

import { API_BASE_URL } from '@/src/core/config';

const COLORS = {
  background: '#000000', // Dark Navy to match the app's theme
  primary: '#0EA5E9', // Cyan/Blue to match the title text in the screenshot
  accent: '#E63946', // Red for unconscious (Design)
  conscious: '#FFFFFF', // White for conscious (Personality) text on dark bg
  text: '#E0E0E0',
  textMuted: '#9CA3AF',
  cardBg: 'rgba(10, 10, 10, 0.8)',
};
const CENTER_COORDS: Record<CenterCode, { x: number, y: number, shape: string, color: string, s: number }> = {
  Head: { x: 200, y: 45, shape: 'triangle', color: '#F4D03F', s: 28 },
  Ajna: { x: 200, y: 115, shape: 'triangle-down', color: '#A8D5BA', s: 28 },
  Throat: { x: 200, y: 190, shape: 'square', color: '#D2B48C', s: 25 },
  G: { x: 200, y: 300, shape: 'diamond', color: '#F4D03F', s: 35 },
  Heart: { x: 255, y: 340, shape: 'triangle', color: '#E1464F', s: 24 },
  Sacral: { x: 200, y: 400, shape: 'square', color: '#E1464F', s: 25 },
  Root: { x: 200, y: 480, shape: 'square', color: '#D2B48C', s: 25 },
  Spleen: { x: 90, y: 390, shape: 'triangle-right', color: '#D2B48C', s: 30 },
  SolarPlexus: { x: 310, y: 390, shape: 'triangle-left', color: '#D2B48C', s: 30 },
};

const GATE_COORDS: Record<number, { x: number, y: number }> = {
  // Head
  64: { x: 183, y: 70 }, 61: { x: 200, y: 70 }, 63: { x: 217, y: 70 },
  // Ajna
  47: { x: 183, y: 90 }, 24: { x: 200, y: 90 }, 4: { x: 217, y: 90 },
  17: { x: 183, y: 109 }, 43: { x: 200, y: 136 }, 11: { x: 217, y: 109 },
  // Throat
  62: { x: 183, y: 168 }, 23: { x: 200, y: 168 }, 56: { x: 217, y: 168 },
  16: { x: 178, y: 176 }, 35: { x: 222, y: 176 },
  20: { x: 178, y: 190 }, 12: { x: 222, y: 190 },
  45: { x: 222, y: 204 },
  31: { x: 186, y: 212 }, 8: { x: 200, y: 212 }, 33: { x: 214, y: 212 },
  // G
  7: { x: 186, y: 279 }, 1: { x: 200, y: 272 }, 13: { x: 214, y: 279 },
  10: { x: 172, y: 300 }, 25: { x: 228, y: 300 },
  15: { x: 186, y: 321 }, 2: { x: 200, y: 328 }, 46: { x: 214, y: 321 },
  // Heart
  21: { x: 255, y: 322 }, 51: { x: 240, y: 350 },
  26: { x: 240, y: 360 }, 40: { x: 270, y: 360 },
  // Sacral
  5: { x: 186, y: 378 }, 14: { x: 200, y: 378 }, 29: { x: 214, y: 378 },
  34: { x: 178, y: 386 }, 27: { x: 178, y: 414 },
  59: { x: 222, y: 400 },
  42: { x: 186, y: 422 }, 3: { x: 200, y: 422 }, 9: { x: 214, y: 422 },
  // Root
  53: { x: 186, y: 458 }, 60: { x: 200, y: 458 }, 52: { x: 214, y: 458 },
  54: { x: 178, y: 468 }, 19: { x: 222, y: 468 },
  38: { x: 178, y: 480 }, 39: { x: 222, y: 480 },
  58: { x: 178, y: 492 }, 41: { x: 222, y: 492 },
  // Spleen
  48: { x: 65, y: 362 }, 57: { x: 85, y: 372 }, 44: { x: 115, y: 387 },
  50: { x: 105, y: 398 }, 32: { x: 85, y: 408 }, 28: { x: 75, y: 412 }, 18: { x: 65, y: 418 },
  // Solar Plexus
  36: { x: 335, y: 362 }, 22: { x: 315, y: 372 }, 37: { x: 295, y: 382 },
  6: { x: 285, y: 387 }, 49: { x: 295, y: 398 }, 55: { x: 315, y: 408 }, 30: { x: 335, y: 418 },
};

const normalizeHDKey = (key: string, type?: string): string => {
  if (!key) return "";
  const k = key.trim();
  if (k === "Memnuniyet") return "Tatmin";
  if (k === "Tepki Vermek") return "Yanıt Vermek";
  if (k === "Duygusal (Solar Pleksus)") return "Duygusal";
  if (k === "Reflektör") return "Yansıtıcı";
  if (k === "Manifesting Jeneratör") return "Manifesting Generator";
  if (k === "Ay Otoritesi (Reflektör)") return "Ay Döngüsü";
  if (k === "Ego (Kalp)") return "Ego";
  if (k === "Kendinden Gelen (G Merkezi)") return "Benlik";
  if (k === "Çevresel (Zihinsel)") return "Zihinsel";
  if (k === "Bir Ay Döngüsü Beklemek") return "28 Gün Beklemek";
  if (k === "Hayal Kırıklığı" && (type === "Reflektör" || type === "Yansıtıcı")) {
    return "Hayal Kırıklığı (Yansıtıcı)";
  }
  return k;
};

const HD_DETAILS_MAP: Record<string, { subtitle: string; description: string }> = {
  "Projektör": {
    subtitle: "Tür / Tip",
    description: "Projektörler, dünya nüfusunun yaklaşık %20'sini oluşturur. Enerjiyi başlatmak veya üretmek için değil, diğer tiplerin enerjisini yönlendirmek, rehberlik etmek ve yönetmek için buradadırlar. Doğal bir liderlik, rehberlik ve sezgisel gözlem yeteneğine sahiptirler. En büyük başarıları, davet edildikleri ortamlarda takdir görmek ve başkalarına en verimli yolları göstermektir."
  },
  "Jeneratör": {
    subtitle: "Tür / Tip",
    description: "Jeneratörler, nüfusun yaklaşık %37'sini oluşturur ve dünyanın birincil yaşam enerjisi motorudur. Tanımlı Sakral merkezleri sayesinde sürekli ve sürdürülebilir bir üretici güce sahiptirler. Yaşamlarındaki anahtar, dış dünyadan gelen uyarılara/fırsatlara yanıt vermek (cevap vermek) ve sevdikleri işlerde bu muazzam enerjiyi harcayarak derin bir tatmine ulaşmaktır."
  },
  "Manifesting Generator": {
    subtitle: "Tür / Tip",
    description: "Manifesting Generator'lar (M.G.), nüfusun yaklaşık %33'ünü oluşturur. Hem Jeneratörlerin sürdürülebilir yaşam enerjisine, hem de Manifestörlerin hızlı eyleme geçme ve başlatma gücüne sahiptirler. Çok yönlüdürler, aynı anda birden fazla işi yapabilirler. Stratejileri, yanıt vermek, harekete geçmeden önce bilgilendirmek ve süreci takip etmektir."
  },
  "Manifestör": {
    subtitle: "Tür / Tip",
    description: "Manifestörler, nüfusun yaklaşık %9'unu oluşturur. Saf bir başlatıcı ve etki yaratıcı güçtürler. Kendi başlarına hareket edebilir, kararlar alabilir ve başkalarını harekete geçirebilirler. İlişkilerinde dirençle karşılaşmamak ve çevrelerine huzur vermek için harekete geçmeden önce mutlaka başkalarını bilgilendirmeleri gerekir."
  },
  "Yansıtıcı": {
    subtitle: "Tür / Tip",
    description: "Yansıtıcılar (Reflector), dünya nüfusunun sadece %1'ini oluşturan en nadir tiptir. Tüm 9 enerji merkezleri tamamen açıktır. Yaşadıkları ortamın, topluluğun ve ilişkide oldukları kişilerin sağlık ve refah düzeyini bir ayna gibi yansıtırlar. Yaşamlarındaki en büyük güç, bilgece bir gözlemci olmak ve doğru kararlar için 28 günlük Ay döngüsünü beklemektir."
  },
  "Dalak": {
    subtitle: "İç Otorite",
    description: "Dalak Otoritesi, anlık sezgilere, hayatta kalma reflekslerine ve içgüdülere dayanır. Vücudunuz size anında, sadece bir kez ve çok sessizce fısıldar (bir yere girmek veya girmemek, biriyle konuşmak veya konuşmamak gibi). Zihninizi susturup, o anlık 'güvenli/güvensiz' refleksine sadık kalmayı öğrenmelisiniz."
  },
  "Duygusal": {
    subtitle: "İç Otorite",
    description: "Duygusal Otorite, hislerinizin netleşmesini beklemeyi gerektirir. Sizin için 'anlık' bir evet veya hayır yoktur. Duygusal dalgalanmalarınızın (heyecan ve hüzün dalgalarının) yatışmasını beklemeli ve ancak dalga nötr bir noktaya ulaştığında karar vermelisiniz. 'Üzerine bir gece uyumak' sizin en büyük dostunuzdur."
  },
  "Sakral": {
    subtitle: "İç Otorite",
    description: "Sakral Otorite, karnınızdan (gut feeling) gelen anlık tepkilere dayanır. Bir soru sorulduğunda vücudunuzun çıkardığı 'hı-hı' (evet) veya 'ıh-ıh' (hayır) gibi sesler veya karın bölgesindeki büzülme/rahatlama hissi en doğru rehberinizdir. Zihinsel mantık yürütmeler yerine vücudunuzun bu fiziksel tepkilerine güvenin."
  },
  "Benlik": {
    subtitle: "İç Otorite",
    description: "Benlik (Self-Projected) Otoritesi, kalbinizin ve kimliğinizin sesini duymakla ilgilidir. Sizin için en doğru karar, başkalarıyla konuşurken ağzınızdan filtresizce çıkan kendi sözlerinizde gizlidir. Karar almadan önce güvendiğiniz dostlarınızla sohbet edin ve ne söylediğinizi, sesinizin tonunu dinleyin; gerçeğiniz orada belirecektir."
  },
  "Zihinsel": {
    subtitle: "İç Otorite",
    description: "Zihinsel Otorite (Mental/Soundboard), çevrenizdeki insanları birer yankı tahtası (soundboard) olarak kullanmanızı gerektirir. Kararınızı dışarıya sesli olarak aktarırken kendi sesinizin frekansını ve ne hissettiğinizi dinleyerek netliğe ulaşırsınız. Karar anında zihinsel mantık kuralları yerine kendi sesinizin tınısına güvenin."
  },
  "Ego": {
    subtitle: "İç Otorite",
    description: "Ego (Yürek) Otoritesi, kalbinizin gerçekten neyi arzuladığına ve neye irade göstermek istediğine dayanır. Karar anında kendinize sormanız gereken soru: 'Ben bunu gerçekten istiyor muyum ve bunun için taahhüt vermeye hazır mıyım?' sorusudur. Kendi isteklerinizi dürüstçe kabul etmeniz en doğru yoldur."
  },
  "Ay Döngüsü": {
    subtitle: "İç Otorite",
    description: "Ay Döngüsü Otoritesi, sadece Yansıtıcı (Reflector) tipine özeldir. Tüm merkezleriniz açık olduğu için acele karar vermemeli, Ay'ın 28 günlük döngüsünü tamamlamasını beklemelisiniz. Bu süreç boyunca farklı günlerde konuyu değerlendirip içinizde biriken netliğe göre hareket etmelisiniz."
  },
  "Davet Beklemek": {
    subtitle: "Strateji",
    description: "Projektörler için geçerli stratejidir. İş, ilişkiler, kariyer veya ev gibi büyük yaşam adımlarında başkaları tarafından fark edilmeyi ve resmi/gayriresmi olarak davet edilmeyi beklemelisiniz. Davet edilmeden girdiğiniz durumlarda enerjiniz doğru algılanmaz ve burukluk yaşarsınız."
  },
  "Yanıt Vermek": {
    subtitle: "Strateji",
    description: "Jeneratörler için geçerli stratejidir. Hayatı sıfırdan başlatmaya (initiate) çalışmak yerine, önünüze çıkan fırsatlara, sorulara ve olaylara vücudunuzun (Sakral) verdiği yanıtı izlemelisiniz. Hayat size gelir, siz sadece yanıt verirsiniz."
  },
  "Bilgilendirmek ve Yanıt Vermek": {
    subtitle: "Strateji",
    description: "Manifesting Generator'lar için geçerli stratejidir. Eyleme geçmeden önce etrafınızdaki insanları bilgilendirerek dirençle karşılaşmayı engeller ve eylemi Sakral merkezinizin verdiği yanıta göre şekillendirirsiniz."
  },
  "Bilgilendirmek": {
    subtitle: "Strateji",
    description: "Manifestörler için geçerli stratejidir. Büyük bir eylem başlatmadan veya karar almadan önce, bu durumdan etkilenecek kişileri önceden bilgilendirmelisiniz. Bu, etrafınızdaki direnç dirençlerini yıkar ve önünüzü açar."
  },
  "28 Gün Beklemek": {
    subtitle: "Strateji",
    description: "Yansıtıcılar (Reflector) için geçerli stratejidir. Kararlarınızın netleşmesi için Ay'ın 28 günlük geçiş döngüsünü beklemeli, bu sürede farklı ortamlarda konuyu gözlemlemelisiniz."
  },
  "Başarı": {
    subtitle: "İmza (Hizalanma Ödülü)",
    description: "Projektörlerin doğru stratejiyle (davet bekleyerek) hareket ettiklerinde hissettikleri tatmin ve takdir edilme duygusudur. Kendinizi başarılı, görülmüş ve bilgece yönlendirmiş hissettiğinizde doğru yoldasınız demektir."
  },
  "Tatmin": {
    subtitle: "İmza (Hizalanma Ödülü)",
    description: "Jeneratör ve Manifesting Generator'ların enerjilerini sevdikleri işlerde doğru şekilde tükettiklerinde hissettikleri derin içsel doyumdur. Akşam yatağa yorgun ama mutlu girmek tatmin imzanızdır."
  },
  "Huzur": {
    subtitle: "İmza (Hizalanma Ödülü)",
    description: "Manifestörlerin kararlarını alıp etrafı bilgilendirdikten sonra, hiç kimsenin direnciyle karşılaşmadan eylemlerini özgürce tamamladıklarında hissettikleri içsel dinginlik ve özgürlük hissidir."
  },
  "Sürpriz": {
    subtitle: "İmza (Hizalanma Ödülü)",
    description: "Yansıtıcıların (Reflector) yaşamın ve insanların beklenmedik güzelliklerine, mucizelerine ve farklılıklarına tanık olduklarında hissettikleri çocuksu hayranlık ve keyif alma duygusudur."
  },
  "Acı / Burukluk": {
    subtitle: "Benlik Olmayan Tema (Hizalanma Uyarısı)",
    description: "Projektörlerin davet edilmeden harekete geçtiklerinde veya başkaları tarafından görülmediklerini, takdir edilmediklerini hissettiklerinde yaşadıkları kırgınlık ve hayal kırıklığı hissidir."
  },
  "Hayal Kırıklığı": {
    subtitle: "Benlik Olmayan Tema (Hizalanma Uyarısı)",
    description: "Jeneratörlerin yanıt vermek yerine zihinsel kararlarla eyleme geçip engellerle karşılaştıklarında veya enerjilerini istemedikleri işlerde tükettiklerinde hissettikleri tıkanma ve bıkkınlık hissidir."
  },
  "Öfke": {
    subtitle: "Benlik Olmayan Tema (Hizalanma Uyarısı)",
    description: "Manifestörlerin eyleme geçmeden önce çevrelerini bilgilendirmedikleri için karşılaştıkları engeller, kontrol edilme çabaları veya kısıtlamalar karşısında hissettikleri patlama ve öfke duygusudur."
  },
  "Hayal Kırıklığı ve Öfke": {
    subtitle: "Benlik Olmayan Tema (Hizalanma Uyarısı)",
    description: "Manifesting Generator'ların hem hizalanmadıklarında hissettikleri tıkanıklık (hayal kırıklığı) hem de engellendiklerinde dışa vurdukları sabırsızlık ve kızgınlık (öfke) halidir."
  },
  "Hayal Kırıklığı (Yansıtıcı)": {
    subtitle: "Benlik Olmayan Tema (Hizalanma Uyarısı)",
    description: "Yansıtıcıların (Reflector) yanlış ortamlarda kalarak başkalarının olumsuz enerjilerini emdiklerinde veya hayatta hiç heyecan verici bir sürpriz kalmadığını düşündüklerinde hissettikleri donukluk halidir."
  }
};

const getProfileDetails = (profile: string) => {
  const profilesMap: Record<string, string> = {
    "1/3": "Araştırmacı / Deneyimci. Temel atmak, araştırmak ve deneme-yanılma yoluyla öğrenmek için buradasınız. Güvenli bir temel oluşturmak hayatınızın anahtarıdır.",
    "1/4": "Araştırmacı / Fırsatçı. Bilgiyi derinlemesine araştırıp, bu bilgiyi yakın dostlarınız ve sosyal çevreniz (network) aracılığıyla yaymak ve fırsatlara dönüştürmek için buradasınız.",
    "2/4": "Münzevi / Fırsatçı. Kendi başınıza kalıp yeteneklerinizi geliştirmek istersiniz. Doğru fırsatlar ve teklifler size her zaman yakın sosyal çevrenizden gelir.",
    "2/5": "Münzevi / Kurtarıcı. Doğal bir yeteneğe sahipsiniz ve kendi alanınızda kalmayı seversiniz. İnsanlar zor anlarında sizden pratik çözümler ve kurtarıcılık beklerler.",
    "3/5": "Deneyimci / Kurtarıcı. Hayatı deneme-yanılma ve hatalardan öğrenerek yaşarsınız. Kazandığınız bu pratik tecrübelerle başkalarının sorunlarına en gerçekçi çözümleri sunarsınız.",
    "3/6": "Deneyimci / Rol Modeli. Hayatınızın ilk yarısında yoğun deneyimler yaşayıp hatalardan öğrenir, olgunlaştıkça çevreniz için bilge bir izleyici ve rol modeli haline gelirsiniz.",
    "4/6": "Fırsatçı / Rol Modeli. Sosyal çevrenizle kurduğunuz köprüler ve dostluklar hayatınızın yönünü belirler. Yaşınız ilerledikçe tarafsız, bilge bir rol modeline dönüşürsünüz.",
    "4/1": "Fırsatçı / Araştırmacı. Kendi sabit inançlarınız ve araştırma temelleriniz üzerinde durursunuz. Bu temel bilgiyi yakın çevrenize aktararak hayatınızı kurarsınız.",
    "5/1": "Kurtarıcı / Araştırmacı. İnsanların sizden büyük beklentileri vardır. Bilgiyi derinlemesine araştırıp, kriz anlarında pratik ve evrensel çözümler üreterek liderlik edersiniz.",
    "5/2": "Kurtarıcı / Münzevi. Kendi köşenizde kalıp yeteneklerinizi geliştirmeyi seversiniz. İhtiyaç anında çağrıldığınızda, o pratik dehanızla krizleri çözersiniz.",
    "6/2": "Rol Modeli / Münzevi. Hayatınız 3 aşamalıdır (30 yaşına kadar deneme, 50 yaşına kadar izleme, 50'den sonra rol modeli). Kendi alanınızda kalıp bilgeliğinizi olgunlaştırırsınız.",
    "6/3": "Rol Modeli / Deneyimci. Hayat boyu denemekten ve öğrenmekten vazgeçmeyen, dinamik ve tecrübeli bir rol modelisiniz. Hayatın içinde aktif birer rehbersiniz."
  };
  return {
    subtitle: "Profil Yapısı",
    description: profilesMap[profile] || `${profile} profili, hayattaki temel duruşunuzu, öğrenme ve etkileşim kurma modelinizi simgeler.`
  };
};

const GATE_NAMES: Record<number, string> = {
  1: "Kendini İfade Etme / Yaratıcılık",
  2: "Alıcılık / Yön",
  3: "Düzen / Yeni Başlangıçlar",
  4: "Formüller / Zihinsel Cevaplar",
  5: "Ritim / Kalıplar",
  6: "Sürtüşme / Uyum ve Çatışma",
  7: "Rol / Liderlik",
  8: "Katkı / Bireysel İfade",
  9: "Odak / Detaylar",
  10: "Kendini Sevme / Davranış",
  11: "Fikirler / Uyum",
  12: "Çekingenlik / İfade",
  13: "Dinleyici / Sırdaş",
  14: "Güç / Kaynak Yönetimi",
  15: "Uçlar / Evrensel Sevgi ve Ritim",
  16: "Beceri / Yetenek",
  17: "Görüşler / Gelecek Planlama",
  18: "Düzeltme / Kusursuzlaştırma",
  19: "İhtiyaçlar / Bağlantı",
  20: "Şimdi / Anlık Farkındalık",
  21: "Kontrol / Hazine",
  22: "Zarafet / Duygusal Derinlik",
  23: "Basitlik / Bireysel Bilgelik",
  24: "Rasyonalizasyon / Geri Dönüş",
  25: "Koşulsuz Sevgi / Masumiyet",
  26: "Bencillik / Pazarlamacı (Ego)",
  27: "Bakım / Besleme",
  28: "Mücadele / Yaşam Amacı",
  29: "Bağlılık / Kararlılık (Evet Demek)",
  30: "Arzular / Ateşli Duygular",
  31: "Etki / Demokratik Liderlik",
  32: "Süreklilik / Uyum Sağlama",
  33: "Geri Çekilme / Mahremiyet",
  34: "Güç / Saf Yaşam Gücü",
  35: "Değişim / Deneyim Arayışı",
  36: "Kriz / Duygusal Deneyim",
  37: "Dostluk / Aile ve Anlaşmalar",
  38: "Savaşçı / Anlam Arayışı",
  39: "Provokasyon / Enerjisel Tetikleme",
  40: "Yalnızlık / Teslimiyet (Topluluk)",
  41: "Hayal Gücü / Kaynak İstekleri",
  42: "Büyüme / Bitirme ve Olgunlaşma",
  43: "İçgörü / Bireysel Deha",
  44: "Uyanıklık / Geçmiş Deneyimler",
  45: "Hükümdar / Dağıtıcı (Topluluk)",
  46: "Beden Sevgisi / Doğru Yerde Olma",
  47: "Fikir Dünyası / Gerçekleşme",
  48: "Derinlik / Kuyu (Çözüm Arayışı)",
  49: "Devrim / İlkeler ve Reddetme",
  50: "Değerler / Koruma ve Kanunlar",
  51: "Şok / Uyanış ve Rekabet",
  52: "Durgunluk / Dağ (Odaklanma)",
  53: "Başlangıçlar / Tohum",
  54: "Hırs / Yükselme",
  55: "Ruh / Bereket ve Duygusal Bolluk",
  56: "Gezgin / Hikaye Anlatıcı",
  57: "Sezgi / Anlık Güvenlik",
  58: "Yaşam Sevinci / Canlılık",
  59: "Cinsellik / Yakınlık",
  60: "Sınırlar / Kabul ve Mutasyon",
  61: "Gizem / İçsel Gerçeklik",
  62: "Detaylar / Pratik Zihin",
  63: "Şüphe / Mantıksal Sorgulama",
  64: "Kafa Karışıklığı / Geçmişi Değerlendirme"
};

const getIncarnationCrossDetails = (cross: string) => {
  const match = cross.match(/\((\d+)\/(\d+)\s*\|\s*(\d+)\/(\d+)\)/);
  let gateDetails = "";
  
  if (match) {
    const pSun = parseInt(match[1]);
    const pEarth = parseInt(match[2]);
    const dSun = parseInt(match[3]);
    const dEarth = parseInt(match[4]);
    
    const nameSun = GATE_NAMES[pSun] || "Bilinmiyor";
    const nameEarth = GATE_NAMES[pEarth] || "Bilinmiyor";
    const nameDSun = GATE_NAMES[dSun] || "Bilinmiyor";
    const nameDEarth = GATE_NAMES[dEarth] || "Bilinmiyor";
    
    gateDetails = `\n\nBu özel Enkarnasyon Haçı, hayatınızdaki en büyük yaşam amacınızı temsil eder ve şu 4 kapının enerjisinin sentezinden oluşur:\n\n` +
      `• Kişilik Güneşi (Güneş - ${pSun}. Kapı): ${nameSun} - Hayattaki temel ifadeniz.\n\n` +
      `• Kişilik Dünyası (Dünya - ${pEarth}. Kapı): ${nameEarth} - Sizi bu dünyada dengeleyen kökler.\n\n` +
      `• Tasarım Güneşi (Güneş - ${dSun}. Kapı): ${nameDSun} - Bilinçdışı düzeydeki bedensel itici gücünüz.\n\n` +
      `• Tasarım Dünyası (Dünya - ${dEarth}. Kapı): ${nameDEarth} - Bilinçdışı düzeydeki fiziksel dengeniz.\n\n` +
      `Bu kapıların birleşimi, kaderinizi ve misyonunuzu şekillendirir.`;
  }

  return {
    subtitle: "Enkarnasyon Haçı",
    description: `${cross} Enkarnasyon Haçı, yaşam amacınızı ve bu dünyaya getirdiğiniz temel enerjisel misyonu temsil eder. Dört ana kapınızın (Kişilik ve Tasarım Güneş/Dünya) birleşimiyle oluşur.${gateDetails}`
  };
};

export default function HumanDesignScreen() {
  const router = useRouter();
  const [dateStr, setDateStr] = useState('');
  const [timeStr, setTimeStr] = useState('');
  
  const [searchQuery, setSearchQuery] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [suggestions, setSuggestions] = useState<any[]>([]);
  const [selectedCityData, setSelectedCityData] = useState<any>(null);
  
  const [chart, setChart] = useState<HumanDesignChart | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [activeGateId, setActiveGateId] = useState<number | null>(null);
  const [activeDetail, setActiveDetail] = useState<{ title: string; subtitle?: string; description: string } | null>(null);

  const { data: gatesData } = useContent<any[]>('/api/content/hd-gates');
  const activeGateData = activeGateId && gatesData ? gatesData.find((g: any) => g.id === activeGateId) : null;

  const dateInputRef = useRef<TextInput>(null);
  const timeInputRef = useRef<TextInput>(null);

  useEffect(() => {
    if (searchQuery.trim().length < 3) {
      setSuggestions([]);
      return;
    }

    const fetchCities = async () => {
      try {
        const response = await fetch(`https://nominatim.openstreetmap.org/search?format=json&limit=5&q=${encodeURIComponent(searchQuery)}`, {
          headers: {
            'User-Agent': '7LayersApp/1.0 (Contact: admin@7layers.com)',
            'Accept-Language': 'tr-TR'
          }
        });
        if (response.ok) {
          const data = await response.json();
          if (data && Array.isArray(data)) {
            const mapped = data.map((item: any) => {
              const parts = item.display_name.split(',').map((s: string) => s.trim());
              const name = item.name || parts[0];
              const country = parts[parts.length - 1] || '';
              const admin1 = parts.length > 2 ? parts[1] : '';
              const latNum = parseFloat(item.lat);
              const lonNum = parseFloat(item.lon);
              let tz = 'Europe/Istanbul';
              try {
                tz = tzlookup(latNum, lonNum);
              } catch (e) {
                console.error("tzlookup error:", e);
              }
              return {
                name,
                latitude: latNum,
                longitude: lonNum,
                timezone: tz,
                country,
                admin1
              };
            });
            setSuggestions(mapped);
          } else {
            setSuggestions([]);
          }
        } else {
          setSuggestions([]);
        }
      } catch (error) {
        console.error("Geocoding API Error:", error);
        setSuggestions([]);
      }
    };

    const debounceTimer = setTimeout(fetchCities, 500);
    return () => clearTimeout(debounceTimer);
  }, [searchQuery]);

  const handleDateChange = (text: string) => {
    let cleaned = text.replace(/\D/g, '');
    let formatted = '';
    
    if (cleaned.length > 0) formatted = cleaned.substring(0, 4);
    if (cleaned.length > 4) formatted += '-' + cleaned.substring(4, 6);
    if (cleaned.length > 6) formatted += '-' + cleaned.substring(6, 8);
    
    setDateStr(formatted);

    if (cleaned.length === 8) {
      timeInputRef.current?.focus();
    }
  };

  const handleTimeChange = (text: string) => {
    let cleaned = text.replace(/\D/g, '');
    let formatted = '';
    
    if (cleaned.length > 0) formatted = cleaned.substring(0, 2);
    if (cleaned.length > 2) formatted += ':' + cleaned.substring(2, 4);
    
    setTimeStr(formatted);
  };

  const handleCalculate = async () => {
    try {
      setIsLoading(true);
      if (!selectedCityData) {
        Alert.alert("Eksik Bilgi", "Lütfen doğum şehri arayıp seçiniz.");
        setIsLoading(false);
        return;
      }
      if (dateStr.length !== 10 || timeStr.length !== 5) {
        Alert.alert("Hata", "Lütfen tarihi (YYYY-AA-GG) ve saati (SS:DD) tam formatında girin.");
        setIsLoading(false);
        return;
      }

      const [year, month, day] = dateStr.split('-').map(Number);
      const [hour, minute] = timeStr.split(':').map(Number);

      if (!year || !month || !day || isNaN(hour) || isNaN(minute)) {
        Alert.alert("Geçersiz Format", "Tarih YYYY-AA-GG, Saat SS:DD formatında olmalıdır.");
        setIsLoading(false);
        return;
      }

      const response = await fetch(`${API_BASE_URL}/api/human-design`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          year,
          month,
          day,
          hour,
          minute,
          lat: selectedCityData.lat,
          lon: selectedCityData.lon,
          tz: selectedCityData.tz
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Human Design API isteği başarısız oldu.');
      }

      setChart(result);
    } catch (err: any) {
      console.error(err);
      Alert.alert("Hata", "Hesaplama hatası: " + (err?.message || err));
    } finally {
      setIsLoading(false);
    }
  };

  const drawSilhouette = () => {
    return null; // Arka plan resmi tamamen kaldırıldı. Saf vektör kullanıyoruz.
  };

  const drawChannels = () => {
    if (!chart) return null;
    const elements: JSX.Element[] = [];

    // Render 16-48 last to keep it clean on top
    const sortedChannels = [...CHANNELS].sort((a, b) => {
      if (a.id === 1648) return 1;
      if (b.id === 1648) return -1;
      return 0;
    });

    // 1. Background channels (white/grey paths)
    sortedChannels.forEach(ch => {
       const g1 = ch.gates[0];
       const g2 = ch.gates[1];
       const c1 = GATE_COORDS[g1];
       const c2 = GATE_COORDS[g2];
       if (!c1 || !c2) return;
       let p0x = c1.x, p0y = c1.y;
       let p2x = c2.x, p2y = c2.y;

       let bgPathD = `M ${p0x} ${p0y} L ${p2x} ${p2y}`;
       
       // Curved Integration Paths
       if ([1020, 1034, 2034, 2057, 1648].includes(ch.id)) {
         let cx = 0, cy = 0;
         if (ch.id === 1020) { cx = 120; cy = p2y; }
         else if (ch.id === 1034) { cx = 60; cy = p0y; }
         else if (ch.id === 2034) { cx = 80; cy = p0y; }
         else if (ch.id === 2057) { cx = 40; cy = p0y; }
         else if (ch.id === 1648) { cx = 0; cy = Math.min(p0y, p2y); }
         bgPathD = `M ${p0x} ${p0y} Q ${cx} ${cy} ${p2x} ${p2y}`;
       }

       elements.push(<Path d={bgPathD} stroke="#94A3B8" strokeWidth="8" strokeLinecap="round" strokeLinejoin="round" fill="none" key={`bg-out-${ch.id}`} />);
       elements.push(<Path d={bgPathD} stroke="#FFFFFF" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round" fill="none" key={`bg-${ch.id}`} />);
    });
    
    // 2. Active channels (colored paths)
    sortedChannels.forEach(ch => {
       const g1 = ch.gates[0];
       const g2 = ch.gates[1];
       const c1 = GATE_COORDS[g1];
       const c2 = GATE_COORDS[g2];
       if (!c1 || !c2) return;
       let p0x = c1.x, p0y = c1.y;
       let p2x = c2.x, p2y = c2.y;

       const mx = (p0x + p2x) / 2;
       const my = (p0y + p2y) / 2;
       let g1Path = `M ${p0x} ${p0y} L ${mx} ${my}`;
       let g2Path = `M ${p2x} ${p2y} L ${mx} ${my}`;

       // Curved Integration Paths
       if ([1020, 1034, 2034, 2057, 1648].includes(ch.id)) {
         let cx = 0, cy = 0;
         if (ch.id === 1020) { cx = 120; cy = p2y; }
         else if (ch.id === 1034) { cx = 60; cy = p0y; }
         else if (ch.id === 2034) { cx = 80; cy = p0y; }
         else if (ch.id === 2057) { cx = 40; cy = p0y; }
         else if (ch.id === 1648) { cx = 0; cy = Math.min(p0y, p2y); }
         
         const pmx = 0.25 * p0x + 0.5 * cx + 0.25 * p2x;
         const pmy = 0.25 * p0y + 0.5 * cy + 0.25 * p2y;
         
         const c1x = 0.5 * (p0x + cx), c1y = 0.5 * (p0y + cy);
         const c2x = 0.5 * (cx + p2x), c2y = 0.5 * (cy + p2y);

         g1Path = `M ${p0x} ${p0y} Q ${c1x} ${c1y} ${pmx} ${pmy}`;
         g2Path = `M ${p2x} ${p2y} Q ${c2x} ${c2y} ${pmx} ${pmy}`;
       }

       const g1Cons = chart.conscious.some(p => p.gate === g1);
       const g1Unc = chart.unconscious.some(p => p.gate === g1);
       const g2Cons = chart.conscious.some(p => p.gate === g2);
       const g2Unc = chart.unconscious.some(p => p.gate === g2);

       const drawHalf = (pathD: string, isConscious: boolean, isUnconscious: boolean, keyPrefix: string) => {
          if (!isConscious && !isUnconscious) return;
          
          elements.push(<Path d={pathD} stroke="#000" strokeWidth="8" strokeLinecap="butt" strokeLinejoin="round" fill="none" key={`${keyPrefix}-outline`} />);
          
          if (isConscious && isUnconscious) {
            elements.push(<Path d={pathD} stroke="#111" strokeWidth="6" strokeLinecap="butt" strokeLinejoin="round" fill="none" key={`${keyPrefix}-b`} />);
            elements.push(<Path d={pathD} stroke={COLORS.accent} strokeWidth="6" strokeLinecap="butt" strokeLinejoin="round" strokeDasharray="3 3" fill="none" key={`${keyPrefix}-r`} />);
          } else if (isConscious) {
            elements.push(<Path d={pathD} stroke="#111" strokeWidth="6" strokeLinecap="butt" strokeLinejoin="round" fill="none" key={`${keyPrefix}-con`} />);
          } else if (isUnconscious) {
            elements.push(<Path d={pathD} stroke={COLORS.accent} strokeWidth="6" strokeLinecap="butt" strokeLinejoin="round" fill="none" key={`${keyPrefix}-unc`} />);
          }
       };

       drawHalf(g1Path, g1Cons, g1Unc, `g1-${ch.id}`);
       drawHalf(g2Path, g2Cons, g2Unc, `g2-${ch.id}`);
    });
    
    return elements;
  };

  const drawCenters = () => {
    if (!chart) return null;
    return Object.entries(CENTER_COORDS).map(([center, def]) => {
      const isDefined = chart.definedCenters.includes(center as CenterCode);
      const fill = isDefined ? def.color : '#FFFFFF';
      const stroke = isDefined ? 'none' : '#94A3B8';
      const s = def.s;
      
      const drawShape = () => {
        const sw = isDefined ? 0 : 1;
        if (def.shape === 'square') {
          return <Rect x={def.x - s} y={def.y - s} width={s*2} height={s*2} fill={fill} stroke={stroke} strokeWidth={sw} key="mg" />;
        } else if (def.shape === 'diamond') {
          return <Polygon points={`${def.x},${def.y-s-2} ${def.x+s+2},${def.y} ${def.x},${def.y+s+2} ${def.x-s-2},${def.y}`} fill={fill} stroke={stroke} strokeWidth={sw} strokeLinejoin="round" key="mg" />;
        } else if (def.shape === 'triangle') {
          return <Polygon points={`${def.x},${def.y-s} ${def.x+s},${def.y+s} ${def.x-s},${def.y+s}`} fill={fill} stroke={stroke} strokeWidth={sw} strokeLinejoin="round" key="mg" />;
        } else if (def.shape === 'triangle-down') {
          return <Polygon points={`${def.x-s},${def.y-s} ${def.x+s},${def.y-s} ${def.x},${def.y+s}`} fill={fill} stroke={stroke} strokeWidth={sw} strokeLinejoin="round" key="mg" />;
        } else if (def.shape === 'triangle-left') {
          return <Polygon points={`${def.x+s},${def.y-s} ${def.x+s},${def.y+s} ${def.x-s},${def.y}`} fill={fill} stroke={stroke} strokeWidth={sw} strokeLinejoin="round" key="mg" />;
        } else if (def.shape === 'triangle-right') {
          return <Polygon points={`${def.x-s},${def.y-s} ${def.x+s},${def.y} ${def.x-s},${def.y+s}`} fill={fill} stroke={stroke} strokeWidth={sw} strokeLinejoin="round" key="mg" />;
        }
        return null;
      };

      return (
        <G key={center}>
          {drawShape()}
        </G>
      );
    });
  };

  const drawGates = () => {
    if (!chart) return null;
    return Object.entries(GATE_COORDS).map(([gateId, coords]) => {
      const gNum = parseInt(gateId);
      const isCons = chart.conscious.some(p => p.gate === gNum);
      const isUnc = chart.unconscious.some(p => p.gate === gNum);
      const isActive = isCons || isUnc;
      
      const textX = coords.x;
      const textY = coords.y;

      return (
        <G key={`glabel-${gateId}`} onPress={() => setActiveGateId(gNum)}>
          {isActive && <Circle cx={textX} cy={textY} r={5.5} fill="#000" stroke="none" />}
          <SvgText x={textX} y={textY + 3.0} fontSize="8" fill={isActive ? "#FFF" : "#64748B"} fontWeight={isActive ? "900" : "bold"} textAnchor="middle">{gNum}</SvgText>
        </G>
      );
    });
  };

  // Yücelim (Exaltation) ve Düşüş (Detriment) okları için simülatör
  // Gerçek I'Ching veritabanı 384 satır gerektirdiği için görsel tasarımı tamamlamak adına deterministik simüle ediyoruz.
  const getFixationArrow = (gate: number, line: number) => {
    // Şimdilik pasif hale getirildi. Gerçek Rave I'Ching veritabanı entegre edildiğinde açılacak.
    return null;
  };

  return (
    <ImageBackground source={{ uri: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?q=80&w=2094&auto=format&fit=crop' }} style={styles.container} blurRadius={15}>
      <View style={styles.overlay} />
      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <ScrollView contentContainerStyle={styles.scrollContent} keyboardShouldPersistTaps="handled">
          <View style={styles.header}>
            <TouchableOpacity 
              style={{ position: 'absolute', left: 0, top: 2, padding: 5, zIndex: 10 }} 
              onPress={() => router.back()}
            >
              <Ionicons name="arrow-back" size={28} color={COLORS.primary} />
            </TouchableOpacity>
            <Text style={styles.title}>İnsan Tasarımı Haritası</Text>
            <Text style={styles.subtitle}>Gerçek Astronomik Ephemeris Motoru</Text>
          </View>

          {!chart && (
            <BlurView intensity={40} tint="dark" style={styles.formCard}>
              <Text style={styles.formInfo}>
                Girdiğiniz anın gökyüzü konumlarını hesaplayarak Jovian Archive standartlarında milimetrik bir Human Design grafiği oluşturur. Doğum yeri bilgisi, o günkü yaz saati (Daylight Saving) kurallarını otomatik hesaplamak için %100 doğrulukla kullanılır.
              </Text>

              <Text style={styles.label}>Doğum Tarihi (YYYY-AA-GG)</Text>
              <TextInput 
                ref={dateInputRef}
                style={styles.input} 
                value={dateStr} 
                onChangeText={handleDateChange} 
                placeholder="Örn: 2012-12-22" 
                placeholderTextColor="#666" 
                keyboardType="numeric" 
                maxLength={10}
                returnKeyType="next"
              />
              
              <Text style={styles.label}>Doğum Saati (SS:DD)</Text>
              <TextInput 
                ref={timeInputRef}
                style={styles.input} 
                value={timeStr} 
                onChangeText={handleTimeChange} 
                placeholder="Örn: 12:12" 
                placeholderTextColor="#666" 
                keyboardType="numeric" 
                maxLength={5}
                returnKeyType="done"
              />
              
              <Text style={styles.label}>Doğum Şehri (Ara)</Text>
              <View style={{ zIndex: 99, position: 'relative' }}>
                <TextInput
                  style={styles.input}
                  value={searchQuery}
                  onChangeText={(t) => {
                    setSearchQuery(t);
                    setShowSuggestions(true);
                  }}
                  onFocus={() => {
                    setShowSuggestions(true);
                  }}
                  placeholder="Örn: İstanbul"
                  placeholderTextColor="#666"
                />
                {showSuggestions && searchQuery.length >= 3 && suggestions.length > 0 && (
                  <View style={styles.suggestionsContainer}>
                    <ScrollView keyboardShouldPersistTaps="always" style={{ maxHeight: 150 }}>
                      {suggestions.map((item, index) => (
                        <TouchableOpacity 
                          key={index} 
                          style={styles.suggestionItem}
                          onPress={() => {
                            setSelectedCityData({
                              name: item.name,
                              lat: item.latitude,
                              lon: item.longitude,
                              tz: item.timezone || 'Europe/Istanbul',
                              country: item.country
                            });
                            setSearchQuery(`${item.name}, ${item.admin1 || ''} ${item.country}`.replace(/, \s*/g, ', ').trim());
                            setShowSuggestions(false);
                            Keyboard.dismiss();
                          }}
                        >
                          <Text style={styles.suggestionText}>{item.name}, {item.admin1 ? `${item.admin1}, ` : ''}{item.country}</Text>
                        </TouchableOpacity>
                      ))}
                    </ScrollView>
                  </View>
                )}
              </View>
              
              <TouchableOpacity style={styles.button} onPress={handleCalculate} disabled={isLoading}>
                <Text style={styles.buttonText}>{isLoading ? 'Hesaplanıyor...' : 'Haritayı Hesapla'}</Text>
              </TouchableOpacity>
            </BlurView>
          )}

          {chart && (
            <View>
              <TouchableOpacity style={styles.resetButton} onPress={() => setChart(null)}>
                <Ionicons name="arrow-back" size={20} color={COLORS.primary} />
                <Text style={styles.resetButtonText}>Yeni Hesaplama</Text>
              </TouchableOpacity>

              <Text style={styles.chartNameTitle}>Kişisel Haritanız</Text>
              <Text style={styles.chartInfoText}>{dateStr} • {timeStr} • {selectedCityData.name}</Text>

              <View style={styles.visualLayout}>
                {/* Sol Kolon - Design */}
                <View style={styles.sidebarColumn}>
                  <Text style={[styles.sidebarTitle, {color: COLORS.accent}]}>Design</Text>
                  {chart.unconscious.map((p, i) => (
                    <View key={`unc-${i}`} style={styles.planetRow}>
                      <Text style={[styles.planetIcon, {color: COLORS.accent}]}>{PLANET_SYMBOLS[p.planet] || '?'}</Text>
                      <Text style={[styles.planetGate, {color: COLORS.accent}]}>{p.gate}.{p.line}</Text>
                      <View style={{ width: 12 }}>{getFixationArrow(p.gate, p.line)}</View>
                    </View>
                  ))}
                </View>

                {/* Orta SVG Bodygraph */}
                <LinearGradient colors={['#e6c27a', '#c59b3f']} style={styles.bodygraphWrapper}>
                  <Svg width="100%" height="100%" viewBox="40 10 320 540">
                    {drawSilhouette()}
                    {drawChannels()}
                    {drawCenters()}
                    {drawGates()}
                  </Svg>
                </LinearGradient>

                {/* Sağ Kolon - Personality */}
                <View style={styles.sidebarColumn}>
                  <Text style={[styles.sidebarTitle, {color: COLORS.conscious}]}>Personality</Text>
                  {chart.conscious.map((p, i) => (
                    <View key={`con-${i}`} style={styles.planetRow}>
                      <View style={{ width: 12 }}>{getFixationArrow(p.gate, p.line)}</View>
                      <Text style={[styles.planetGate, {color: COLORS.conscious}]}>{p.gate}.{p.line}</Text>
                      <Text style={[styles.planetIcon, {color: COLORS.conscious}]}>{PLANET_SYMBOLS[p.planet] || '?'}</Text>
                    </View>
                  ))}
                </View>
              </View>

              <BlurView intensity={30} tint="light" style={styles.textAnalysisCard}>
                <TouchableOpacity 
                  style={styles.textRow}
                  onPress={() => {
                    const match = getProfileDetails(chart.profile);
                    setActiveDetail({
                      title: `Profil ${chart.profile}`,
                      subtitle: match.subtitle,
                      description: match.description
                    });
                  }}
                >
                  <Text style={styles.textLabel}>Profil:</Text>
                  <Text style={styles.textValue}>{chart.profile}</Text>
                </TouchableOpacity>
                <TouchableOpacity 
                  style={styles.textRow}
                  onPress={() => {
                    const match = HD_DETAILS_MAP[normalizeHDKey(chart.type)];
                    setActiveDetail({
                      title: chart.type,
                      subtitle: match?.subtitle || "Tür / Tip",
                      description: match?.description || ""
                    });
                  }}
                >
                  <Text style={styles.textLabel}>Tür:</Text>
                  <Text style={styles.textValue}>{chart.type}</Text>
                </TouchableOpacity>
                <TouchableOpacity 
                  style={styles.textRow}
                  onPress={() => {
                    const match = HD_DETAILS_MAP[normalizeHDKey(chart.strategy)];
                    setActiveDetail({
                      title: chart.strategy,
                      subtitle: match?.subtitle || "Strateji",
                      description: match?.description || ""
                    });
                  }}
                >
                  <Text style={styles.textLabel}>Strateji:</Text>
                  <Text style={styles.textValue}>{chart.strategy}</Text>
                </TouchableOpacity>
                <TouchableOpacity 
                  style={styles.textRow}
                  onPress={() => {
                    const match = HD_DETAILS_MAP[normalizeHDKey(chart.signature)];
                    setActiveDetail({
                      title: chart.signature,
                      subtitle: match?.subtitle || "İmza (Hizalanma Ödülü)",
                      description: match?.description || ""
                    });
                  }}
                >
                  <Text style={styles.textLabel}>İmza:</Text>
                  <Text style={styles.textValue}>{chart.signature}</Text>
                </TouchableOpacity>
                <TouchableOpacity 
                  style={styles.textRow}
                  onPress={() => {
                    const match = HD_DETAILS_MAP[normalizeHDKey(chart.notSelfTheme, chart.type)];
                    setActiveDetail({
                      title: chart.notSelfTheme,
                      subtitle: match?.subtitle || "Benlik Olmayan Tema",
                      description: match?.description || ""
                    });
                  }}
                >
                  <Text style={styles.textLabel}>Benlik Olmayan Tema:</Text>
                  <Text style={styles.textValue}>{chart.notSelfTheme}</Text>
                </TouchableOpacity>
                <TouchableOpacity 
                  style={styles.textRow}
                  onPress={() => {
                    const match = HD_DETAILS_MAP[normalizeHDKey(chart.authority)];
                    setActiveDetail({
                      title: chart.authority,
                      subtitle: match?.subtitle || "İç Otorite",
                      description: match?.description || ""
                    });
                  }}
                >
                  <Text style={styles.textLabel}>İç Otorite:</Text>
                  <Text style={styles.textValue}>{chart.authority}</Text>
                </TouchableOpacity>
                <TouchableOpacity 
                  style={styles.textRow}
                  onPress={() => {
                    const match = getIncarnationCrossDetails(chart.incarnationCross);
                    setActiveDetail({
                      title: chart.incarnationCross,
                      subtitle: match.subtitle,
                      description: match.description
                    });
                  }}
                >
                  <Text style={styles.textLabel}>Enkarnasyon Haçı:</Text>
                  <Text style={styles.textValue}>{chart.incarnationCross}</Text>
                </TouchableOpacity>
              </BlurView>

            </View>
          )}
        </ScrollView>
      </KeyboardAvoidingView>

      {/* Modal for Gate Details */}
      <Modal visible={!!activeGateId} animationType="slide" transparent={true} onRequestClose={() => setActiveGateId(null)}>
        <TouchableOpacity style={styles.modalOverlay} activeOpacity={1} onPress={() => setActiveGateId(null)}>
          <View style={styles.gateModalContent}>
            <View style={styles.gateModalHeader}>
              <View style={styles.gateBadge}>
                <Text style={styles.gateBadgeText}>{activeGateId}</Text>
              </View>
              <Text style={styles.gateModalTitle}>{activeGateData?.title}</Text>
              <TouchableOpacity onPress={() => setActiveGateId(null)}>
                <Ionicons name="close-circle" size={28} color={COLORS.textMuted} />
              </TouchableOpacity>
            </View>
            <ScrollView style={{ flex: 1 }} contentContainerStyle={{ paddingBottom: 30 }} showsVerticalScrollIndicator={false}>
              <View style={styles.gateDetailBox}>
                <View style={styles.gateDetailRow}>
                  <Text style={styles.gateDetailLabel}>I Ching:</Text>
                  <Text style={styles.gateDetailValue}>{activeGateData?.iching}</Text>
                </View>
                <View style={styles.gateDetailRow}>
                  <Text style={styles.gateDetailLabel}>Astroloji:</Text>
                  <Text style={[styles.gateDetailValue, { color: COLORS.primary }]}>{activeGateData?.astrology}</Text>
                </View>
                <View style={styles.gateDetailRow}>
                  <Text style={styles.gateDetailLabel}>Biyoloji:</Text>
                  <Text style={styles.gateDetailValue}>{activeGateData?.biology}</Text>
                </View>
              </View>
              <Text style={styles.gateDescription}>{activeGateData?.description}</Text>
            </ScrollView>
          </View>
        </TouchableOpacity>
      </Modal>

      {/* Modal for Card Details (Type, Authority, Strategy, Signature, etc.) */}
      <Modal visible={!!activeDetail} animationType="slide" transparent={true} onRequestClose={() => setActiveDetail(null)}>
        <TouchableOpacity style={styles.modalOverlay} activeOpacity={1} onPress={() => setActiveDetail(null)}>
          <View style={styles.gateModalContent}>
            <View style={styles.gateModalHeader}>
              <Text style={[styles.gateModalTitle, { color: COLORS.primary }]}>{activeDetail?.subtitle}</Text>
              <TouchableOpacity onPress={() => setActiveDetail(null)}>
                <Ionicons name="close-circle" size={28} color={COLORS.textMuted} />
              </TouchableOpacity>
            </View>
            <ScrollView style={{ flex: 1 }} contentContainerStyle={{ paddingBottom: 30 }} showsVerticalScrollIndicator={false}>
              <Text style={[styles.gateModalTitle, { fontSize: 24, marginBottom: 15, fontFamily: 'serif' }]}>
                {activeDetail?.title}
              </Text>
              <Text style={styles.gateDescription}>{activeDetail?.description}</Text>
            </ScrollView>
          </View>
        </TouchableOpacity>
      </Modal>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  overlay: { ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(10, 10, 10, 0.55)' },
  scrollContent: { paddingTop: 60, paddingHorizontal: 10, paddingBottom: 40 },
  header: { marginBottom: 20, paddingHorizontal: 5, alignItems: 'center' },
  title: { fontSize: 26, fontWeight: 'bold', color: COLORS.primary, marginBottom: 4 },
  subtitle: { fontSize: 13, color: COLORS.textMuted, fontStyle: 'italic' },
  formCard: { padding: 20, borderRadius: 16, borderWidth: 1, borderColor: 'rgba(255,255,255,0.1)', backgroundColor: COLORS.cardBg },
  formInfo: { color: COLORS.text, fontSize: 13, lineHeight: 20, marginBottom: 20 },
  label: { color: COLORS.text, fontSize: 13, fontWeight: '600', marginBottom: 8, marginTop: 15 },
  input: { backgroundColor: 'rgba(255,255,255,0.05)', color: COLORS.text, padding: 15, borderRadius: 8, borderWidth: 1, borderColor: 'rgba(255,255,255,0.1)', fontSize: 15 },
  button: { backgroundColor: COLORS.primary, padding: 16, borderRadius: 8, alignItems: 'center', marginTop: 30 },
  buttonText: { color: '#2A1635', fontSize: 16, fontWeight: 'bold' },
  resetButton: { flexDirection: 'row', alignItems: 'center', marginBottom: 15 },
  resetButtonText: { color: COLORS.primary, fontSize: 15, fontWeight: '600', marginLeft: 8 },
  chartNameTitle: { fontSize: 28, fontFamily: 'serif', color: COLORS.text, textAlign: 'center', marginBottom: 6 },
  chartInfoText: { fontSize: 14, color: COLORS.textMuted, textAlign: 'center', marginBottom: 20, fontStyle: 'italic' },
  
  suggestionsContainer: {
    position: 'absolute',
    top: 55,
    left: 0,
    right: 0,
    backgroundColor: '#1E293B',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: 'rgba(14, 165, 233, 0.4)',
    zIndex: 1000,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.5,
    shadowRadius: 5,
  },
  suggestionItem: {
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.1)',
  },
  suggestionText: {
    color: '#fff',
    fontSize: 14,
  },
  
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.6)',
    justifyContent: 'flex-end',
  },
  gateModalContent: {
    backgroundColor: '#000000',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    height: '60%',
    padding: 25,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
  },
  gateModalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.1)',
    paddingBottom: 15,
  },
  gateBadge: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(14, 165, 233, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
    borderWidth: 1,
    borderColor: 'rgba(14, 165, 233, 0.4)',
  },
  gateBadgeText: {
    color: '#0EA5E9',
    fontWeight: 'bold',
    fontSize: 16,
  },
  gateModalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFF',
    flex: 1,
  },
  gateDetailBox: {
    backgroundColor: 'rgba(255,255,255,0.03)',
    borderRadius: 12,
    padding: 15,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.05)',
    marginBottom: 20,
  },
  gateDetailRow: {
    flexDirection: 'row',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.05)',
  },
  gateDetailLabel: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#9CA3AF',
    width: 80,
  },
  gateDetailValue: {
    fontSize: 14,
    color: '#FFF',
    flex: 1,
  },
  gateDescription: {
    fontSize: 15,
    color: '#E0E0E0',
    lineHeight: 24,
    fontStyle: 'italic',
  },
  
  visualLayout: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    height: 460,
    marginBottom: 20,
    alignItems: 'stretch'
  },
  sidebarColumn: {
    width: '18%',
    justifyContent: 'space-between',
    paddingVertical: 10,
    backgroundColor: 'rgba(0,0,0,0.4)',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
  },
  sidebarTitle: {
    fontSize: 12,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 10,
    textTransform: 'uppercase',
  },
  planetRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-evenly',
    paddingVertical: 2,
  },
  planetIcon: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  planetGate: {
    fontSize: 12,
    fontWeight: '700',
  },
  bodygraphWrapper: {
    width: '60%',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 24,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 15,
    elevation: 5,
    overflow: 'hidden',
  },
  
  textAnalysisCard: {
    backgroundColor: 'rgba(42, 22, 53, 0.8)',
    borderRadius: 12,
    padding: 15,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
  },
  textRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.05)',
  },
  textLabel: {
    fontSize: 15,
    fontWeight: 'bold',
    color: COLORS.primary,
    width: '40%',
  },
  textValue: {
    fontSize: 15,
    color: COLORS.text,
    flex: 1,
  }
});
