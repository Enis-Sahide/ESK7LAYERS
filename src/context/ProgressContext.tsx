import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';

import {
  onAuthChange,
  getProgress,
  unlockTierRemote,
  isAuthenticated,
} from '@/src/core/api/client';
import { ROLE_LEVELS } from '@/src/core/auth/roles';

interface ProgressContextType {
  unlockedTiers: string[];
  passedExams: string[];
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
  const [passedExams, setPassedExams] = useState<string[]>([]);
  const [role, setRole] = useState<string>('free');

  const refresh = useCallback(async () => {
    try {
      if (!(await isAuthenticated())) {
        setUnlockedTiers([]);
        setPassedExams([]);
        setRole('free');
        return;
      }
      const p: any = await getProgress();
      setUnlockedTiers(p.unlockedTiers || []);
      setPassedExams(p.passedExams || []);
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

  // Seviye-bazlı erişim: tierId derecesi (1/2/3) ≤ kullanıcının rol seviyesi olmalı. admin her şeyi görür.
  const hasAccess = (tierId: string) => {
    if (role === 'admin') return true;
    if (!tierId) return true;
    const lvl = tierId.includes('master') || /3$/.test(tierId)
      ? 3
      : /2$/.test(tierId)
        ? 2
        : /1$/.test(tierId)
          ? 1
          : 0;
    return (ROLE_LEVELS[role] ?? 0) >= lvl;
  };

  const resetProgress = async () => {
    setUnlockedTiers([]);
  };

  const isAdmin = role === 'admin';

  return (
    <ProgressContext.Provider
      value={{ unlockedTiers, passedExams, role, isAdmin, unlockTier, hasAccess, resetProgress, refresh }}
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
