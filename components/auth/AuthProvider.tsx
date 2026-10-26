"use client";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import dynamic from "next/dynamic";
import type { SupabaseClient } from "@supabase/supabase-js";
import { AUTH_ENABLED } from "@/lib/supabase/config";
import type { Profile } from "@/lib/supabase/types";

const AuthModal = dynamic(() => import("./AuthModal"), { ssr: false });

export interface SessionUser {
  id: string;
  email: string | null;
  phone: string | null;
  name: string | null;
  avatarUrl: string | null;
  provider: string | null;
}

interface AuthContextValue {
  /** False when Supabase is not configured — every gate is then open. */
  enabled: boolean;
  /** True once the stored session (if any) has been checked. */
  ready: boolean;
  user: SessionUser | null;
  profile: Profile | null;
  firstName: string | null;
  /** Signed in and onboarded. */
  isMember: boolean;
  openAuth: (reason?: string, next?: string) => void;
  closeAuth: () => void;
  /** Runs `action` immediately for members; otherwise starts sign-in/onboarding. */
  requireAuth: (reason: string, action: () => void, next?: string) => void;
  refreshProfile: () => Promise<Profile | null>;
  signOut: () => Promise<void>;
  getClient: () => Promise<SupabaseClient | null>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

function firstNameOf(name: string | null | undefined): string | null {
  if (!name) return null;
  const first = name.trim().split(/\s+/)[0];
  return first ? first.charAt(0).toUpperCase() + first.slice(1) : null;
}

function currentPath(): string {
  if (typeof window === "undefined") return "/";
  return `${window.location.pathname}${window.location.search}${window.location.hash}`;
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [ready, setReady] = useState(!AUTH_ENABLED);
  const [user, setUser] = useState<SessionUser | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [modal, setModal] = useState<{ open: boolean; reason?: string; next?: string }>({
    open: false,
  });
  const clientRef = useRef<SupabaseClient | null>(null);

  // supabase-js is ~50 kB; it loads after hydration so it never competes
  // with the hero for the first paint.
  const getClient = useCallback(async () => {
    if (!AUTH_ENABLED) return null;
    if (clientRef.current) return clientRef.current;
    const { getBrowserSupabase } = await import("@/lib/supabase/client");
    clientRef.current = getBrowserSupabase();
    return clientRef.current;
  }, []);

  const loadProfile = useCallback(
    async (userId: string): Promise<Profile | null> => {
      const supabase = await getClient();
      if (!supabase) return null;
      const { data } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", userId)
        .maybeSingle<Profile>();
      setProfile(data ?? null);
      return data ?? null;
    },
    [getClient],
  );

  useEffect(() => {
    if (!AUTH_ENABLED) return;
    let unsubscribe: (() => void) | undefined;
    let cancelled = false;

    (async () => {
      const supabase = await getClient();
      if (!supabase || cancelled) return;

      const apply = async (session: Awaited<ReturnType<typeof supabase.auth.getSession>>["data"]["session"]) => {
        const u = session?.user;
        if (!u) {
          setUser(null);
          setProfile(null);
          return;
        }
        const meta = (u.user_metadata ?? {}) as Record<string, unknown>;
        setUser({
          id: u.id,
          email: u.email ?? null,
          phone: u.phone ?? null,
          name: (meta.full_name as string) || (meta.name as string) || null,
          avatarUrl: (meta.avatar_url as string) || (meta.picture as string) || null,
          provider: (u.app_metadata?.provider as string) ?? null,
        });
        await loadProfile(u.id);
      };

      const { data } = await supabase.auth.getSession();
      await apply(data.session);
      if (!cancelled) setReady(true);

      const sub = supabase.auth.onAuthStateChange((_event, session) => {
        void apply(session);
      });
      unsubscribe = () => sub.data.subscription.unsubscribe();
    })();

    return () => {
      cancelled = true;
      unsubscribe?.();
    };
  }, [getClient, loadProfile]);

  const openAuth = useCallback((reason?: string, next?: string) => {
    setModal({ open: true, reason, next: next ?? currentPath() });
  }, []);

  const closeAuth = useCallback(() => setModal({ open: false }), []);

  const requireAuth = useCallback(
    (reason: string, action: () => void, next?: string) => {
      if (!AUTH_ENABLED) return action();
      if (user && profile) return action();
      const target = next ?? currentPath();
      if (user && !profile) {
        window.location.assign(`/welcome?next=${encodeURIComponent(target)}`);
        return;
      }
      openAuth(reason, target);
    },
    [user, profile, openAuth],
  );

  const refreshProfile = useCallback(async () => {
    if (!user) return null;
    return loadProfile(user.id);
  }, [user, loadProfile]);

  const signOut = useCallback(async () => {
    const supabase = await getClient();
    await supabase?.auth.signOut();
    setUser(null);
    setProfile(null);
  }, [getClient]);

  const value = useMemo<AuthContextValue>(
    () => ({
      enabled: AUTH_ENABLED,
      ready,
      user,
      profile,
      firstName: firstNameOf(profile?.full_name ?? user?.name),
      isMember: Boolean(user && profile),
      openAuth,
      closeAuth,
      requireAuth,
      refreshProfile,
      signOut,
      getClient,
    }),
    [ready, user, profile, openAuth, closeAuth, requireAuth, refreshProfile, signOut, getClient],
  );

  return (
    <AuthContext.Provider value={value}>
      {children}
      {AUTH_ENABLED && modal.open && (
        <AuthModal reason={modal.reason} next={modal.next} onClose={closeAuth} />
      )}
    </AuthContext.Provider>
  );
}

const fallback: AuthContextValue = {
  enabled: false,
  ready: true,
  user: null,
  profile: null,
  firstName: null,
  isMember: false,
  openAuth: () => {},
  closeAuth: () => {},
  requireAuth: (_reason, action) => action(),
  refreshProfile: async () => null,
  signOut: async () => {},
  getClient: async () => null,
};

export function useAuth(): AuthContextValue {
  return useContext(AuthContext) ?? fallback;
}
