import { Link, useNavigate } from "@tanstack/react-router";
import { useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useIsAdmin, useSessionUser } from "@/lib/session";

export function SiteHeader() {
  const { data: user } = useSessionUser();
  const { data: isAdmin } = useIsAdmin(user?.id);
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  async function signOut() {
    await queryClient.cancelQueries();
    queryClient.clear();
    await supabase.auth.signOut();
    navigate({ to: "/auth", replace: true });
  }

  return (
    <header className="fixed left-1/2 top-4 z-50 w-[94%] max-w-6xl -translate-x-1/2">
      <div className="glass-panel flex items-center justify-between gap-4 rounded-full px-5 py-2.5">
        <Link to="/" className="flex items-center gap-2.5">
          <span className="grid size-9 place-items-center rounded-xl bg-primary font-display text-lg font-bold text-primary-foreground shadow-lg shadow-primary/30">
            B
          </span>
          <span className="font-display text-lg font-bold tracking-tight">
            Bilim<span className="text-accent">.uz</span>
          </span>
        </Link>

        <nav className="hidden items-center gap-7 text-sm font-semibold text-muted-foreground md:flex">
          <Link to="/" className="transition hover:text-foreground">
            Bosh sahifa
          </Link>
          {user ? (
            <Link to="/dashboard" className="transition hover:text-foreground">
              Mening panelim
            </Link>
          ) : null}
          {isAdmin ? (
            <Link to="/admin" className="transition hover:text-foreground">
              Admin panel
            </Link>
          ) : null}
        </nav>

        <div className="flex items-center gap-2">
          {user ? (
            <button
              onClick={signOut}
              className="rounded-full border border-border px-4 py-2 text-sm font-semibold text-muted-foreground transition hover:text-foreground"
            >
              Chiqish
            </button>
          ) : (
            <>
              <Link
                to="/auth"
                className="hidden rounded-full px-4 py-2 text-sm font-semibold text-muted-foreground transition hover:text-foreground sm:block"
              >
                Kirish
              </Link>
              <Link
                to="/auth"
                search={{ mode: "signup" }}
                className="rounded-full bg-primary px-5 py-2.5 text-sm font-bold text-primary-foreground shadow-lg shadow-primary/30 transition hover:opacity-90"
              >
                Ro'yxatdan o'tish
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
