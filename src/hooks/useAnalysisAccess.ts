import { useState, useEffect } from 'react';
import { Alert } from 'react-native';
import { useProgress } from '@/src/context/ProgressContext';
import { apiFetch, isAuthenticated } from '@/src/core/api/client';

interface UnlockedResponse {
  success: boolean;
  isAllUnlocked: boolean;
  unlockedTypes: string[];
}

export function useAnalysisAccess(analysisType: string) {
  const { role, isAdmin } = useProgress();
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [loading, setLoading] = useState(true);

  const isMasterOrAdmin = role === 'admin' || role === 'master' || isAdmin;

  useEffect(() => {
    // Admin veya Master için tüm analizler doğrudan açık
    if (isMasterOrAdmin) {
      setIsUnlocked(true);
      setLoading(false);
      return;
    }

    let isMounted = true;

    isAuthenticated().then((authed) => {
      if (!authed) {
        if (isMounted) {
          setIsUnlocked(false);
          setLoading(false);
        }
        return;
      }

      apiFetch<UnlockedResponse>('/api/user/unlocked-analyses')
        .then((res) => {
          if (!isMounted) return;
          if (res?.isAllUnlocked) {
            setIsUnlocked(true);
          } else {
            const types = res?.unlockedTypes || [];
            const target = analysisType.toLowerCase();
            const hasAccess = types.includes(target);
            setIsUnlocked(hasAccess);
          }
        })
        .catch((err) => {
          console.error('Error checking analysis access:', err);
          if (isMounted) setIsUnlocked(false);
        })
        .finally(() => {
          if (isMounted) setLoading(false);
        });
    });

    return () => {
      isMounted = false;
    };
  }, [role, isMasterOrAdmin, analysisType]);

  return { isUnlocked, loading };
}

export function showAnalysisLockedAlert(title = "Detaylı Analiz Kilitli") {
  Alert.alert(
    title,
    "Bu bölüm Kapsamlı Analiz Raporu kapsamında sunulmaktadır. Hesabınızda aktif bir rapor tanımlı değildir. Raporlarınızı ve hesap durumunuzu yönetmek için platformumuzu web tarayıcınız üzerinden ziyaret edebilirsiniz.",
    [
      {
        text: "Tamam",
        style: "default",
      },
    ]
  );
}
