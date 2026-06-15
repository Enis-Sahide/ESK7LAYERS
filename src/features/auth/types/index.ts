export type UserRole = 'ADMIN' | 'CUSTOMER' | 'SELLER';

export interface Profile {
  id: string; // UUID from Supabase auth.users
  full_name: string | null;
  avatar_url: string | null;
  role: UserRole;
  created_at: string;
}
