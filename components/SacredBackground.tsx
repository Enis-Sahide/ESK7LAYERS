import React, { useEffect, useRef } from 'react';
import { View, StyleSheet, Dimensions, Animated, Easing } from 'react-native';
import Svg, { Circle } from 'react-native-svg';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

interface SacredBackgroundProps {
  children?: React.ReactNode;
}

export default function SacredBackground({ children }: SacredBackgroundProps) {
  const bgOpacity = useRef(new Animated.Value(0.1)).current;

  useEffect(() => {
    // Geçiş süreleri yarıya indirildi (Parlama: 750ms, Sönme: 1500ms)
    Animated.sequence([
      Animated.timing(bgOpacity, {
        toValue: 0.19,
        duration: 750,
        easing: Easing.out(Easing.ease),
        useNativeDriver: true,
      }),
      Animated.timing(bgOpacity, {
        toValue: 0.03,
        duration: 1500,
        easing: Easing.inOut(Easing.ease),
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  // Yaşam Çiçeği (Flower of Life) Grid Parametreleri
  const R = 80; // Daire yarıçapı
  const xStep = R;
  const yStep = R * Math.sqrt(3) / 2; // ~R * 0.866

  const circles: React.ReactNode[] = [];
  let rowIndex = 0;

  for (let y = -R; y < SCREEN_HEIGHT + R; y += yStep) {
    const isOddRow = rowIndex % 2 !== 0;
    const xOffset = isOddRow ? R / 2 : 0;
    let colIndex = 0;

    for (let x = -R; x < SCREEN_WIDTH + R; x += xStep) {
      circles.push(
        <Circle
          key={`c_${rowIndex}_${colIndex}`}
          cx={x + xOffset}
          cy={y}
          r={R}
          fill="none"
          stroke="#D4AF37"
          strokeWidth="1.2"
        />
      );
      colIndex++;
    }
    rowIndex++;
  }

  return (
    <View style={styles.container}>
      {/* Siyah zemin üzerine parlayan yaşam çiçeği */}
      <Animated.View style={[styles.svgContainer, { opacity: bgOpacity }]}>
        <Svg width={SCREEN_WIDTH} height={SCREEN_HEIGHT} viewBox={`0 0 ${SCREEN_WIDTH} ${SCREEN_HEIGHT}`}>
          {circles}
        </Svg>
      </Animated.View>
      <View style={styles.content}>{children}</View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000', // Siyah zemin
  },
  svgContainer: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    flex: 1,
    backgroundColor: 'transparent',
  },
});
