import React, { useState } from 'react';
import { View, Text, StyleSheet, Dimensions, TouchableOpacity } from 'react-native';
import Svg, { Circle, Line, Text as SvgText, G, Defs, RadialGradient, Stop } from 'react-native-svg';
import { AstroPoint, AstroAspect } from '@/src/features/astrology/api/astrologyClient';

interface MobileMundaneSkyWheelProps {
  planets: AstroPoint[];
  aspects: AstroAspect[];
  ascendant?: AstroPoint;
  onSelectAspect?: (aspect: AstroAspect) => void;
  onSelectPlanet?: (planet: AstroPoint) => void;
}

const ZODIAC_ORDER = ['Koç', 'Boğa', 'İkizler', 'Yengeç', 'Aslan', 'Başak', 'Terazi', 'Akrep', 'Yay', 'Oğlak', 'Kova', 'Balık'];

const ZODIAC_COLORS: Record<string, string> = {
  'Koç': '#FF453A', 'Boğa': '#32D74B', 'İkizler': '#FFD60A', 'Yengeç': '#E5E5EA',
  'Aslan': '#FF9F0A', 'Başak': '#32D74B', 'Terazi': '#FFD60A', 'Akrep': '#FF453A',
  'Yay': '#FF9F0A', 'Oğlak': '#8E8E93', 'Kova': '#0A84FF', 'Balık': '#0A84FF'
};

const ZODIAC_SYMBOLS: Record<string, string> = {
  'Koç': '♈', 'Boğa': '♉', 'İkizler': '♊', 'Yengeç': '♋', 'Aslan': '♌', 'Başak': '♍',
  'Terazi': '♎', 'Akrep': '♏', 'Yay': '♐', 'Oğlak': '♑', 'Kova': '♒', 'Balık': '♓'
};

const PLANET_SYMBOLS: Record<string, string> = {
  'Güneş': '☉', 'Ay': '☽', 'Merkür': '☿', 'Venüs': '♀', 'Mars': '♂', 
  'Jüpiter': '♃', 'Satürn': '♄', 'Uranüs': '♅', 'Neptün': '♆', 'Plüton': '♇',
  'Kiron': '⚷', 'Kuzey Ay Düğümü': '☊', 'Lilith': '⚸'
};

const ASPECT_COLORS: Record<string, string> = {
  'Kavuşum': '#D4AF37',
  'Sekstil': '#0A84FF',
  'Kare': '#FF453A',
  'Üçgen': '#32D74B',
  'Karşıt': '#FF453A',
  'Görmeyen': '#8E8E93'
};

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const CHART_SIZE = Math.min(SCREEN_WIDTH - 32, 380);
const CENTER = CHART_SIZE / 2;
const RADIUS = CENTER - 36;

export default function MobileMundaneSkyWheel({
  planets,
  aspects,
  ascendant,
  onSelectAspect,
  onSelectPlanet
}: MobileMundaneSkyWheelProps) {
  const [selectedPlanetName, setSelectedPlanetName] = useState<string | null>(null);

  // ASC longitude or 0
  const baseDegree = ascendant ? ascendant.longitude : 0;

  const getX = (lon: number, r: number) => CENTER + r * Math.cos(((180 + baseDegree - lon) * Math.PI) / 180);
  const getY = (lon: number, r: number) => CENTER + r * Math.sin(((180 + baseDegree - lon) * Math.PI) / 180);

  const R_ZODIAC_OUTER = RADIUS;
  const R_ZODIAC_INNER = RADIUS - 24;
  const R_PLANET_RING = RADIUS - 44;
  const R_ASPECT_CORE = RADIUS - 64;

  const visiblePlanets = planets.filter(p => 
    ['Güneş', 'Ay', 'Merkür', 'Venüs', 'Mars', 'Jüpiter', 'Satürn', 'Uranüs', 'Neptün', 'Plüton', 'Kiron'].includes(p.name)
  );

  const planetMap = new Map<string, AstroPoint>();
  visiblePlanets.forEach(p => planetMap.set(p.name, p));

  return (
    <View style={styles.container}>
      <View style={styles.wheelCard}>
        <Svg width={CHART_SIZE} height={CHART_SIZE} viewBox={`0 0 ${CHART_SIZE} ${CHART_SIZE}`}>
          <Defs>
            <RadialGradient id="skyCenterGlow" cx="50%" cy="50%" r="50%">
              <Stop offset="0%" stopColor="#0EA5E9" stopOpacity="0.16" />
              <Stop offset="60%" stopColor="#D4AF37" stopOpacity="0.05" />
              <Stop offset="100%" stopColor="#000000" stopOpacity="0" />
            </RadialGradient>
          </Defs>

          {/* Background circles */}
          <Circle cx={CENTER} cy={CENTER} r={R_ASPECT_CORE} fill="url(#skyCenterGlow)" />
          <Circle cx={CENTER} cy={CENTER} r={R_ASPECT_CORE} stroke="rgba(255,255,255,0.08)" strokeWidth={1} strokeDasharray="3, 3" fill="none" />
          <Circle cx={CENTER} cy={CENTER} r={R_ZODIAC_INNER} stroke="rgba(212,175,55,0.35)" strokeWidth={1.5} fill="none" />
          <Circle cx={CENTER} cy={CENTER} r={R_ZODIAC_OUTER} stroke="rgba(212,175,55,0.35)" strokeWidth={1.5} fill="none" />

          {/* 12 Zodiac Segments */}
          {Array.from({ length: 12 }).map((_, i) => {
            const signLon = i * 30;
            const midLon = signLon + 15;
            const signName = ZODIAC_ORDER[i];
            return (
              <G key={`zodiac-seg-${i}`}>
                <Line 
                  x1={getX(signLon, R_ZODIAC_OUTER)} 
                  y1={getY(signLon, R_ZODIAC_OUTER)} 
                  x2={getX(signLon, R_ZODIAC_INNER)} 
                  y2={getY(signLon, R_ZODIAC_INNER)} 
                  stroke="rgba(212,175,55,0.3)" 
                  strokeWidth={1} 
                />
                <SvgText 
                  x={getX(midLon, RADIUS - 12)} 
                  y={getY(midLon, RADIUS - 12) + 5} 
                  fontSize="13" 
                  fill={ZODIAC_COLORS[signName]} 
                  textAnchor="middle" 
                  fontWeight="bold"
                >
                  {ZODIAC_SYMBOLS[signName]}
                </SvgText>
              </G>
            );
          })}

          {/* Aspect Lines */}
          <G>
            {aspects.map((asp, idx) => {
              const p1 = planetMap.get(asp.planet1);
              const p2 = planetMap.get(asp.planet2);
              if (!p1 || !p2) return null;

              const isHighlighted = selectedPlanetName === asp.planet1 || selectedPlanetName === asp.planet2;
              const x1 = getX(p1.longitude, R_ASPECT_CORE);
              const y1 = getY(p1.longitude, R_ASPECT_CORE);
              const x2 = getX(p2.longitude, R_ASPECT_CORE);
              const y2 = getY(p2.longitude, R_ASPECT_CORE);

              const color = ASPECT_COLORS[asp.type] || '#888';

              return (
                <Line
                  key={`asp-${idx}`}
                  x1={x1}
                  y1={y1}
                  x2={x2}
                  y2={y2}
                  stroke={color}
                  strokeWidth={isHighlighted ? 2.2 : asp.isExact ? 1.4 : 0.8}
                  strokeOpacity={isHighlighted ? 0.95 : asp.isExact ? 0.65 : 0.35}
                  strokeDasharray={asp.type === 'Sekstil' || asp.type === 'Görmeyen' ? '4, 4' : undefined}
                  onPress={() => onSelectAspect?.(asp)}
                />
              );
            })}
          </G>

          {/* Planets Glyphs */}
          {visiblePlanets.map((p, i) => {
            let rOffset = 0;
            for (let j = 0; j < i; j++) {
              if (Math.abs(p.longitude - visiblePlanets[j].longitude) < 7) {
                rOffset += 14;
              }
            }

            const px = getX(p.longitude, R_PLANET_RING - rOffset);
            const py = getY(p.longitude, R_PLANET_RING - rOffset);
            const isSelected = selectedPlanetName === p.name;

            return (
              <G 
                key={`pl-${p.name}`}
                onPress={() => {
                  setSelectedPlanetName(p.name);
                  onSelectPlanet?.(p);
                }}
              >
                {/* Pointer to zodiac */}
                <Line 
                  x1={getX(p.longitude, R_ZODIAC_INNER)} 
                  y1={getY(p.longitude, R_ZODIAC_INNER)} 
                  x2={px} 
                  y2={py} 
                  stroke={isSelected ? '#0EA5E9' : 'rgba(212,175,55,0.3)'} 
                  strokeWidth={isSelected ? 1.4 : 0.6} 
                  strokeDasharray="2, 2" 
                />

                {/* Planet Circle */}
                <Circle 
                  cx={px} 
                  cy={py} 
                  r={isSelected ? 12 : 10} 
                  fill="#0B0F19" 
                  stroke={isSelected ? '#0EA5E9' : '#D4AF37'} 
                  strokeWidth={isSelected ? 2 : 1.2}
                />

                {/* Glyph */}
                <SvgText 
                  x={px} 
                  y={py + 4} 
                  fontSize="11" 
                  fill={isSelected ? '#0EA5E9' : '#D4AF37'} 
                  textAnchor="middle" 
                  fontWeight="bold"
                >
                  {PLANET_SYMBOLS[p.name] || p.name[0]}
                </SvgText>

                {/* Rx Badge */}
                {p.isRetrograde && (
                  <SvgText 
                    x={px + 11} 
                    y={py + 3} 
                    fontSize="8" 
                    fill="#FF453A" 
                    fontWeight="bold"
                  >
                    Rx
                  </SvgText>
                )}
              </G>
            );
          })}

          {/* Center Info Badge */}
          <Circle cx={CENTER} cy={CENTER} r={24} fill="#090D16" stroke="rgba(212,175,55,0.4)" strokeWidth={1} />
          <SvgText x={CENTER} y={CENTER - 3} fontSize="8" fill="#D4AF37" textAnchor="middle" fontWeight="bold">
            GÖKYÜZÜ
          </SvgText>
          <SvgText x={CENTER} y={CENTER + 8} fontSize="7" fill="#0EA5E9" textAnchor="middle">
            {aspects.length} Açı
          </SvgText>
        </Svg>
      </View>

      {/* Legend */}
      <View style={styles.legendContainer}>
        <View style={styles.legendItem}>
          <View style={[styles.legendDot, { backgroundColor: '#D4AF37' }]} />
          <Text style={styles.legendText}>Kavuşum (0°)</Text>
        </View>
        <View style={styles.legendItem}>
          <View style={[styles.legendDot, { backgroundColor: '#32D74B' }]} />
          <Text style={styles.legendText}>Üçgen (120°)</Text>
        </View>
        <View style={styles.legendItem}>
          <View style={[styles.legendDot, { backgroundColor: '#0A84FF' }]} />
          <Text style={styles.legendText}>Sekstil (60°)</Text>
        </View>
        <View style={styles.legendItem}>
          <View style={[styles.legendDot, { backgroundColor: '#FF453A' }]} />
          <Text style={styles.legendText}>Kare / Karşıt</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    marginVertical: 10,
  },
  wheelCard: {
    backgroundColor: 'rgba(10, 15, 25, 0.75)',
    borderRadius: 24,
    borderWidth: 1,
    borderColor: 'rgba(14, 165, 233, 0.25)',
    padding: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  legendContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 12,
    marginTop: 10,
    paddingHorizontal: 10,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  legendDot: {
    width: 7,
    height: 7,
    borderRadius: 4,
    marginRight: 4,
  },
  legendText: {
    fontSize: 10,
    color: '#9CA3AF',
  },
});
