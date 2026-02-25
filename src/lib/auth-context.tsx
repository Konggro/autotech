import { createContext, useContext, useEffect, useMemo, useState, ReactNode } from 'react';
import { supabase, isSupabaseConfigured } from './supabase';

interface User {
  id: string;
  email: string;
  name: string;
  role: 'user' | 'admin';
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  register: (
    name: string,
    email: string,
    password: string,
  ) => Promise<{ success: boolean; error?: string }>;
  logout: () => Promise<void>;
  isAdmin: boolean;
  favorites: string[];
  toggleFavorite: (productId: string) => Promise<void>;
  isFavorite: (productId: string) => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [favorites, setFavorites] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  const loadFavorites = async (userId: string) => {
    if (!isSupabaseConfigured || !supabase) return;
    const { data, error } = await supabase
      .from('favorites')
      .select('product_id')
      .eq('user_id', userId);

    if (error) {
      console.error('Failed to load favorites:', error);
      return;
    }

    setFavorites((data ?? []).map((row) => row.product_id));
  };

  const loadUserFromSession = async () => {
    if (!isSupabaseConfigured || !supabase) {
      setLoading(false);
      return;
    }

    const { data: sessionData } = await supabase.auth.getSession();
    const sessionUser = sessionData.session?.user;

    if (!sessionUser) {
      setUser(null);
      setFavorites([]);
      setLoading(false);
      return;
    }

    const { data: profileData } = await supabase
      .from('profiles')
      .select('full_name, role')
      .eq('id', sessionUser.id)
      .maybeSingle();

    const resolvedUser: User = {
      id: sessionUser.id,
      email: sessionUser.email ?? '',
      name:
        profileData?.full_name ||
        sessionUser.user_metadata?.full_name ||
        sessionUser.email?.split('@')[0] ||
        'User',
      role: profileData?.role === 'admin' ? 'admin' : 'user',
    };

    setUser(resolvedUser);
    await loadFavorites(sessionUser.id);
    setLoading(false);
  };

  useEffect(() => {
    loadUserFromSession();

    if (!isSupabaseConfigured || !supabase) return;

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(() => {
      loadUserFromSession();
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    if (!isSupabaseConfigured || !supabase) return false;

    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) return false;

    await loadUserFromSession();
    return true;
  };

  const register = async (
    name: string,
    email: string,
    password: string,
  ): Promise<{ success: boolean; error?: string }> => {
    if (!isSupabaseConfigured || !supabase) {
      return { success: false, error: 'Supabase тохиргоо дутуу байна.' };
    }

    const normalizedEmail = email.trim().toLowerCase();

    const { error } = await supabase.auth.signUp({
      email: normalizedEmail,
      password,
      options: {
        data: { full_name: name.trim() },
      },
    });

    if (error) {
      return {
        success: false,
        error: error.message || 'Бүртгэл үүсгэх үед алдаа гарлаа.',
      };
    }

    await loadUserFromSession();
    return { success: true };
  };

  const logout = async () => {
    if (isSupabaseConfigured && supabase) {
      await supabase.auth.signOut();
    }
    setUser(null);
    setFavorites([]);
  };

  const toggleFavorite = async (productId: string) => {
    if (!user || user.role !== 'user' || !isSupabaseConfigured || !supabase) return;

    const isAlreadyFavorite = favorites.includes(productId);
    const previousFavorites = favorites;
    const nextFavorites = isAlreadyFavorite
      ? favorites.filter((id) => id !== productId)
      : [...favorites, productId];

    setFavorites(nextFavorites);

    if (isAlreadyFavorite) {
      const { error } = await supabase
        .from('favorites')
        .delete()
        .eq('user_id', user.id)
        .eq('product_id', productId);

      if (error) {
        console.error('Failed to remove favorite:', error);
        setFavorites(previousFavorites);
      }
      return;
    }

    const { error } = await supabase.from('favorites').insert({
      user_id: user.id,
      product_id: productId,
    });

    if (error) {
      console.error('Failed to add favorite:', error);
      setFavorites(previousFavorites);
    }
  };

  const isFavorite = (productId: string): boolean => {
    return favorites.includes(productId);
  };

  const isAdmin = useMemo(() => user?.role === 'admin', [user]);

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        register,
        logout,
        isAdmin,
        favorites,
        toggleFavorite,
        isFavorite
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
