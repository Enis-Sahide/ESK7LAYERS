import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, ImageBackground, LayoutAnimation, Platform, UIManager } from 'react-native';

if (Platform.OS === 'android') {
  if (UIManager.setLayoutAnimationEnabledExperimental) {
    UIManager.setLayoutAnimationEnabledExperimental(true);
  }
}
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { BlurView } from 'expo-blur';
import { COLORS, SIZES } from '@/src/theme';

const ESOTERIC_BG = require('@/assets/images/esoteric_bg_indigo.png');

const GUIDELINES = [
  {
    icon: 'arrow-up-outline',
    title: 'Köklerden Başlayın (Aşağıdan Yukarıya)',
    content: 'Çakra sisteminde enerji aşağıdan yukarıya doğru hareket eder. Sağlam bir temel (kök çakra) inşa etmeden üst çakraları (üçüncü göz, tepe) aşırı uyarmak, ruhsal dengesizliğe, topraklanma sorunlarına ve psikolojik dalgalanmalara yol açabilir. Daima kökten başlayın ve temelinizi sağlamlaştırın.',
    color: '#FF3B30'
  },
  {
    icon: 'leaf-outline',
    title: 'Topraklanmayı İhmal Etmeyin',
    content: 'Herhangi bir enerji çalışmasından sonra mutlaka topraklanın. Çıplak ayakla toprağa basmak, tuzlu su ile duş almak veya doğada vakit geçirmek, serbest kalan negatif enerjinin bedenden atılmasını sağlar.',
    color: '#34C759'
  },
  {
    icon: 'water-outline',
    title: 'Duygusal Salınımlara İzin Verin',
    content: 'Tıkanmış bir çakra açılırken veya dengelenirken, bastırılmış duygular (ağlama isteği, öfke, ani sevinç) yüzeye çıkabilir. Bu durum bir iyileşme krizidir (healing crisis). Duyguları bastırmayın, şifalanmaları için akmasına izin verin.',
    color: '#32ADE6'
  },
  {
    icon: 'infinite-outline',
    title: 'Zorlamayın, Akışta Kalın',
    content: 'Çakralar mekanik çarklar değildir, bilincinizin katmanlarıdır. Bir günde tüm çakraları açmaya çalışmak veya nefes çalışmalarında bedeni aşırı zorlamak enerji kanallarına (nadilere) zarar verebilir. Kademeli ve sabırlı ilerleyin.',
    color: '#AF52DE'
  },
  {
    icon: 'pint-outline',
    title: 'Bol Su Tüketin',
    content: 'Enerji çalışmaları fiziksel bedende detoks etkisi yaratır. Çıkan hücresel atıkların ve toksik enerjinin bedenden kolayca atılması için günlük olarak beden ağırlığınızın %4\'ü civarında su tüketmeniz esastır (Örn: 70kg biri için ~2.8 Litre). Suyunuzu içerken şifa niyetinizi suya kodlamayı unutmayın.',
    color: '#00C7BE'
  },
  {
    icon: 'shield-checkmark-outline',
    title: 'Enerji Alanınızı Mühürleyin',
    content: 'Meditasyon veya çakra çalışmalarını bitirdiğinizde açılan enerji alanınızı (auranızı) mutlaka kapatmalısınız. Aksi takdirde dış dünyanın düşük frekanslı enerjilerine açık (sünger gibi) hale gelirsiniz. Çalışma bittiğinde "Enerji alanımı sevgiyle mühürlüyorum" diyerek tüm bedeninizi saran altından bir kalkan hayal edin.',
    color: '#5E5CE6'
  },
  {
    icon: 'restaurant-outline',
    title: 'Bedeninizi Temiz Tutun',
    content: 'İnisiyasyon sürecinde bedeniniz hassaslaşır. Alkol ve ağır işlenmiş gıdalar enerji bedeninizi ağırlaştırır, frekansınızı düşürür ve çalışmaların verimini azaltır. Bedeninize bir tapınak gibi davranın.',
    color: '#FF9500'
  }
];

export default function ChakraGuidelinesScreen() {
  const router = useRouter();
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);

  const toggleExpand = (index: number) => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setExpandedIndex(expandedIndex === index ? null : index);
  };

  return (
    <ImageBackground source={ESOTERIC_BG} style={styles.container} resizeMode="cover">
      <View style={[StyleSheet.absoluteFill, { backgroundColor: 'rgba(10, 15, 30, 0.85)' }]} />
      
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={28} color={COLORS.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Önemli Hususlar</Text>
        <View style={{ width: 28 }} />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        
        <View style={styles.introContainer}>
          <Ionicons name="warning" size={40} color="#FFD700" style={{ marginBottom: 10 }} />
          <Text style={styles.introTitle}>Çakra Çalışması Disiplini</Text>
          <Text style={styles.introText}>
            Enerji merkezleriyle çalışmak son derece güçlü bir dönüşüm sürecidir. 
            Bu uyanış yolculuğunda zarar görmemek ve ruhsal dengenizi korumak için 
            aşağıdaki kadim kurallara sıkı sıkıya uymanız önerilir.
          </Text>
        </View>

        {GUIDELINES.map((item, index) => {
          const isExpanded = expandedIndex === index;
          return (
            <TouchableOpacity 
              key={index} 
              activeOpacity={0.8} 
              onPress={() => toggleExpand(index)}
              style={{ marginBottom: 15 }}
            >
              <BlurView intensity={20} tint="dark" style={[styles.ruleCard, { marginBottom: 0 }]}>
                <View style={[styles.ruleHeader, !isExpanded && { marginBottom: 0 }]}>
                  <View style={[styles.iconContainer, { backgroundColor: item.color + '15', borderColor: item.color + '40' }]}>
                    <Ionicons name={item.icon as any} size={22} color={item.color} />
                  </View>
                  <Text style={[styles.ruleTitle, { color: COLORS.textMuted }]}>{item.title}</Text>
                  <Ionicons name={isExpanded ? "chevron-up" : "chevron-down"} size={20} color={COLORS.textMuted} />
                </View>
                {isExpanded && (
                  <Text style={styles.ruleContent}>{item.content}</Text>
                )}
              </BlurView>
            </TouchableOpacity>
          );
        })}

        <View style={{ height: 40 }} />
      </ScrollView>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 60,
    paddingHorizontal: 20,
    paddingBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.1)',
  },
  backBtn: {
    padding: 5,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: COLORS.primary,
  },
  scrollContent: {
    padding: SIZES.padding,
  },
  introContainer: {
    alignItems: 'center',
    marginBottom: 30,
    padding: 20,
    backgroundColor: 'rgba(212, 175, 55, 0.05)',
    borderRadius: SIZES.radius,
    borderWidth: 1,
    borderColor: 'rgba(212, 175, 55, 0.2)',
  },
  introTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFD700',
    marginBottom: 10,
    textAlign: 'center',
  },
  introText: {
    color: COLORS.text,
    fontSize: 14,
    lineHeight: 22,
    textAlign: 'center',
    fontStyle: 'italic',
  },
  ruleCard: {
    padding: 20,
    borderRadius: SIZES.radius,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
    marginBottom: 15,
    overflow: 'hidden',
  },
  ruleHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  iconContainer: {
    width: 44,
    height: 44,
    borderRadius: 22,
    borderWidth: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  ruleTitle: {
    flex: 1,
    fontSize: 16,
    fontWeight: 'bold',
  },
  ruleContent: {
    color: COLORS.text,
    fontSize: 14,
    lineHeight: 22,
  }
});
