import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';

import {
  onAuthChange,
  getProgress,
  unlockTierRemote,
  isAuthenticated,
} from '@/src/core/api/client';

interface ProgressContextType {
  unlockedTiers: string[];
  role: string;
  isAdmin: boolean;
  unlockTier: (tierId: string) => Promise<void>;
  hasAccess: (tierId: string) => boolean;
  resetProgress: () => Promise<void>;
  refresh: () => Promise<void>;
}

const ProgressContext = createContext<ProgressContextType | undefined>(undefined);

export function ProgressProvider({ children }: { children: React.ReactNode }) {
  const [unlockedTiers, setUnlockedTiers] = useState<string[]>([]);
  const [role, setRole] = useState<string>('free');

  const refresh = useCallback(async () => {
    try {
      if (!(await isAuthenticated())) {
        setUnlockedTiers([]);
        setRole('free');
        return;
      }
      const p: any = await getProgress();
      setUnlockedTiers(p.unlockedTiers || []);
      setRole(p.role || 'free');
    } catch (e) {
      // Offline / hata: mevcut durumu koru
      console.error('Progress yüklenemedi:', e);
    }
  }, []);

  useEffect(() => {
    refresh();
    const unsub = onAuthChange(() => {
      refresh();
    });
    return unsub;
  }, [refresh]);

  const unlockTier = async (tierId: string) => {
    try {
      const res: any = await unlockTierRemote(tierId);
      setUnlockedTiers(res.unlockedTiers || []);
      if (res.role) setRole(res.role);
    } catch (e) {
      console.error('Progress kaydedilemedi:', e);
    }
  };

  const hasAccess = (tierId: string) => {
    if (tierId.endsWith('_1')) return true;
    return unlockedTiers.includes(tierId);
  };

  const resetProgress = async () => {
    setUnlockedTiers([]);
  };

  const isAdmin = role === 'admin';

  return (
    <ProgressContext.Provider
      value={{ unlockedTiers, role, isAdmin, unlockTier, hasAccess, resetProgress, refresh }}
    >
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
