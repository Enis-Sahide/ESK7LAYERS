import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface ProgressContextType {
  unlockedTiers: string[];
  unlockTier: (tierId: string) => Promise<void>;
  hasAccess: (tierId: string) => boolean;
  resetProgress: () => Promise<void>;
}

const ProgressContext = createContext<ProgressContextType | undefined>(undefined);

export function ProgressProvider({ children }: { children: React.ReactNode }) {
  const [unlockedTiers, setUnlockedTiers] = useState<string[]>([]);

  useEffect(() => {
    loadProgress();
  }, []);

  const loadProgress = async () => {
    try {
      const data = await AsyncStorage.getItem('@mystery_school_progress');
      if (data) {
        setUnlockedTiers(JSON.parse(data));
      } else {
        // İlk açılışta 1. seviyeler zaten açık kabul ediliyor, burası ekstra kilitleri tutar
        setUnlockedTiers([]);
      }
    } catch (error) {
      console.error('Progress yüklenemedi:', error);
    }
  };

  const unlockTier = async (tierId: string) => {
    try {
      if (!unlockedTiers.includes(tierId)) {
        const newTiers = [...unlockedTiers, tierId];
        setUnlockedTiers(newTiers);
        await AsyncStorage.setItem('@mystery_school_progress', JSON.stringify(newTiers));
      }
    } catch (error) {
      console.error('Progress kaydedilemedi:', error);
    }
  };

  const hasAccess = (tierId: string) => {
    // 1. seviyeler (örn: numeroloji_1) varsayılan olarak her zaman açıktır
    if (tierId.endsWith('_1')) return true;
    return unlockedTiers.includes(tierId);
  };

  const resetProgress = async () => {
    try {
      await AsyncStorage.removeItem('@mystery_school_progress');
      setUnlockedTiers([]);
    } catch (error) {
      console.error('Progress silinemedi:', error);
    }
  };

  return (
    <ProgressContext.Provider value={{ unlockedTiers, unlockTier, hasAccess, resetProgress }}>
      {children}
    </ProgressContext.Provider>
  );
}

export function useProgress() {
  const context = useContext(ProgressContext);
  if (context === undefined) {
    throw new Error('useProgress must be used within a ProgressProvider');
  }
  return context;
}
