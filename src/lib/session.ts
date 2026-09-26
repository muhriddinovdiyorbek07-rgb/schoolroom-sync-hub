import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export function useSessionUser() {
  return useQuery({
    queryKey: ["session-user"],
    queryFn: async () => {
      const { data } = await supabase.auth.getUser();
      return data.user ?? null;
    },
  });
}

export type ProfileRow = {
  id: string;
  full_name: string;
  email: string | null;
  region_id: string | null;
  district_id: string | null;
  school_id: string | null;
  class_id: string | null;
};

export function useProfile(userId?: string) {
  return useQuery({
    queryKey: ["profile", userId],
    enabled: Boolean(userId),
    queryFn: async () => {
      const { data, error } = await supabase
        .from("profiles")
        .select("id, full_name, email, region_id, district_id, school_id, class_id")
        .eq("id", userId!)
        .maybeSingle();
      if (error) throw error;
      return (data as ProfileRow | null) ?? null;
    },
  });
}

export function useIsAdmin(userId?: string) {
  return useQuery({
    queryKey: ["is-admin", userId],
    enabled: Boolean(userId),
    queryFn: async () => {
      const { data, error } = await supabase
        .from("user_roles")
        .select("role")
        .eq("user_id", userId!)
        .eq("role", "admin")
        .maybeSingle();
      if (error) throw error;
      return Boolean(data);
    },
  });
}
