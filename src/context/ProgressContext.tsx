import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { supabase } from '@/src/services/supabase';

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
    
    // Subscribe to auth state changes to reload progress when user logs in
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_IN') {
        loadProgress();
      } else if (event === 'SIGNED_OUT') {
        setUnlockedTiers([]);
      }
    });
    
    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const loadProgress = async () => {
    try {
      // 1. Try to load from Supabase User Metadata first (source of truth)
      const { data: { session } } = await supabase.auth.getSession();
      
      if (session?.user?.user_metadata?.unlockedTiers) {
        const metadataTiers = session.user.user_metadata.unlockedTiers;
        setUnlockedTiers(metadataTiers);
        // Backup to local storage for offline fast load
        await AsyncStorage.setItem('@mystery_school_progress', JSON.stringify(metadataTiers));
        return;
      }
      
      // 2. Fallback to AsyncStorage if no network/session metadata yet
      const localData = await AsyncStorage.getItem('@mystery_school_progress');
      if (localData) {
        const parsedData = JSON.parse(localData);
        setUnlockedTiers(parsedData);
        
        // If we have a session but no metadata, sync local data UP to Supabase
        if (session && session.user && !session.user.user_metadata?.unlockedTiers) {
            await supabase.auth.updateUser({
              data: { unlockedTiers: parsedData }
            });
        }
      } else {
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
        
        // 1. Save to local storage
        await AsyncStorage.setItem('@mystery_school_progress', JSON.stringify(newTiers));
        
        // 2. Sync to Supabase Database (user_metadata)
        const { data: { session } } = await supabase.auth.getSession();
        if (session?.user) {
          await supabase.auth.updateUser({
            data: { unlockedTiers: newTiers }
          });
        }
      }
    } catch (error) {
      console.error('Progress kaydedilemedi:', error);
    }
  };

  const hasAccess = (tierId: string) => {
    if (tierId.endsWith('_1')) return true;
    return unlockedTiers.includes(tierId);
  };

  const resetProgress = async () => {
    try {
      await AsyncStorage.removeItem('@mystery_school_progress');
      setUnlockedTiers([]);
      
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user) {
        await supabase.auth.updateUser({
          data: { unlockedTiers: [] }
        });
      }
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
