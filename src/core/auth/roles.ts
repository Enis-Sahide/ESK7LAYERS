// Rol seviyeleri (büyük = üst). Web ile aynı sıralama.
export const ROLE_LEVELS: Record<string, number> = {
  free: 0,
  apprentice: 1,
  journeyman: 2,
  master: 3,
  admin: 999,
};

export type MinRole = 'free' | 'apprentice' | 'journeyman' | 'master';

// role, min seviyeyi karşılıyor mu? admin her zaman geçer.
export function meetsRole(role: string, min: MinRole): boolean {
  if (role === 'admin') return true;
  return (ROLE_LEVELS[role] ?? 0) >= (ROLE_LEVELS[min] ?? 0);
}
