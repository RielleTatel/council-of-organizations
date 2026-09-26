import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import type { Session } from "@supabase/supabase-js";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { requireSupabase, supabase } from "../../lib/cms/client";
import type { Staff } from "../../lib/cms/content";

const AuthContext = createContext<{
  session: Session | null;
  staff: Staff | null;
  loading: boolean;
}>({ session: null, staff: null, loading: true });
export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [initializing, setInitializing] = useState(true);
  const cache = useQueryClient();
  useEffect(() => {
    if (!supabase) {
      setInitializing(false);
      return;
    }
    let alive = true;
    supabase.auth.getSession().then(({ data }) => {
      if (alive) {
        setSession(data.session);
        setInitializing(false);
      }
    });
    const { data } = supabase.auth.onAuthStateChange((_event, next) => {
      setSession(next);
      setInitializing(false);
    });
    return () => {
      alive = false;
      data.subscription.unsubscribe();
    };
  }, []);
  useEffect(() => {
    cache.removeQueries({ queryKey: ["cms", "admin"] });
  }, [session?.user.id, cache]);
  const staff = useQuery({
    queryKey: ["cms", "staff", session?.user.id],
    enabled: !!session,
    queryFn: async () => {
      const { data, error } = await requireSupabase()
        .from("cms_staff")
        .select("*")
        .eq("user_id", session!.user.id)
        .maybeSingle();
      if (error) throw new Error(error.message);
      return data as Staff | null;
    },
    retry: false,
    refetchInterval: 15_000,
  });
  return (
    <AuthContext.Provider
      value={{
        session,
        staff: staff.data?.active ? staff.data : null,
        loading: initializing || (!!session && staff.isPending),
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
export const useAuth = () => useContext(AuthContext);
