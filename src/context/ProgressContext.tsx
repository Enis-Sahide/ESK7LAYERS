import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { supabase } from '@/src/core/api/supabase';

interface ProgressContextType {
  unlockedTiers: string[];
  unlockTier: (tierId: string) => Promise<void>;
  hasAccess: (tierId: string) => boolean;
  resetProgress: () => Promise<void>;
  isAdmin: boolean;
}

const ProgressContext = createContext<ProgressContextType | undefined>(undefined);

export function ProgressProvider({ children }: { children: React.ReactNode }) {
  const [unlockedTiers, setUnlockedTiers] = useState<string[]>([]);
  const [userEmail, setUserEmail] = useState<string | null>(null);

  useEffect(() => {
    loadProgress();
    
    // Subscribe to auth state changes to reload progress when user logs in
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_IN') {
        setUserEmail(session?.user?.email || null);
        loadProgress();
      } else if (event === 'SIGNED_OUT') {
        setUserEmail(null);
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
      
      if (session?.user?.email) {
        setUserEmail(session.user.email);
      } else {
        setUserEmail(null);
      }
      
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

          // Determine overall role level and sync to public.profiles table
          const hasMaster = newTiers.some((t: string) => t.includes('master') || t.endsWith('_3') || t.includes('Final'));
          const hasJourneyman = newTiers.some((t: string) => t.includes('_2') || t.endsWith('_2'));
          
          let newRole = 'free';
          if (hasMaster) {
            newRole = 'master';
          } else if (hasJourneyman) {
            newRole = 'journeyman';
          } else if (newTiers.length > 0) {
            newRole = 'apprentice';
          }

          // Fetch current profile role to see if we should upgrade
          const { data: profile } = await supabase
            .from('profiles')
            .select('role')
            .eq('id', session.user.id)
            .single();

          const roleLevels: Record<string, number> = {
            free: 0,
            apprentice: 1,
            journeyman: 2,
            master: 3,
            admin: 999
          };

          const currentRole = profile?.role || 'free';
          if (roleLevels[newRole] > roleLevels[currentRole]) {
            await supabase
              .from('profiles')
              .update({ role: newRole })
              .eq('id', session.user.id);
          }
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

  const isAdmin = userEmail?.toLowerCase() === 'enissahide.kesik@outlook.com';

  return (
    <ProgressContext.Provider value={{ unlockedTiers, unlockTier, hasAccess, resetProgress, isAdmin }}>
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
