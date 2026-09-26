import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { lovable } from "@/integrations/lovable/index";
import { AmbientBackground } from "@/components/AmbientBackground";

export const Route = createFileRoute("/auth")({
  ssr: false,
  validateSearch: (search: Record<string, unknown>): { mode?: "signup" | "login" } =>
    search['mode'] === "signup" ? { mode: "signup" } : {},
  head: () => ({
    meta: [
      { title: "Kirish va ro'yxatdan o'tish — Bilim.uz" },
      {
        name: "description",
        content: "Bilim.uz hisobingizga kiring yoki yangi o'quvchi sifatida ro'yxatdan o'ting.",
      },
      { property: "og:title", content: "Kirish va ro'yxatdan o'tish — Bilim.uz" },
      {
        property: "og:description",
        content: "Bilim.uz hisobingizga kiring yoki yangi o'quvchi sifatida ro'yxatdan o'ting.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: AuthPage,
});

function AuthPage() {
  const { mode } = Route.useSearch();
  const navigate = useNavigate();
  const [isSignup, setIsSignup] = useState(mode === "signup");
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      if (data.user) navigate({ to: "/dashboard", replace: true });
    });
  }, [navigate]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    try {
      if (isSignup) {
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            emailRedirectTo: window.location.origin,
            data: { full_name: fullName },
          },
        });
        if (error) throw error;
        toast.success("Hisob yaratildi. Endi maktabingizni tanlang.");
      } else {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        toast.success("Xush kelibsiz!");
      }
      navigate({ to: "/dashboard", replace: true });
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Xatolik yuz berdi");
    } finally {
      setLoading(false);
    }
  }

  async function handleGoogle() {
    const result = await lovable.auth.signInWithOAuth("google", {
      redirect_uri: window.location.origin,
    });
    if (result.error) {
      toast.error("Google orqali kirishda xatolik");
      return;
    }
    if (result.redirected) return;
    navigate({ to: "/dashboard", replace: true });
  }

  return (
    <div className="relative flex min-h-screen items-center justify-center px-6 py-24">
      <AmbientBackground />

      <div className="a-rise glass-panel w-full max-w-md rounded-[28px] p-7">
        <Link to="/" className="flex items-center gap-2.5">
          <span className="grid size-9 place-items-center rounded-xl bg-primary font-display text-lg font-bold text-primary-foreground">
            B
          </span>
          <span className="font-display text-lg font-bold tracking-tight">
            Bilim<span className="text-accent">.uz</span>
          </span>
        </Link>

        <h1 className="mt-6 font-display text-3xl font-bold tracking-tight">
          {isSignup ? "Yangi o'quvchi" : "Hisobingizga kiring"}
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          {isSignup
            ? "Ro'yxatdan o'ting — keyin viloyat, tuman, maktab va sinfingizni tanlaysiz."
            : "Email va parolingiz bilan davom eting."}
        </p>

        <form onSubmit={handleSubmit} className="mt-6 space-y-3">
          {isSignup ? (
            <label className="block">
              <span className="text-[11px] font-bold uppercase tracking-wide text-muted-foreground">
                To'liq ism
              </span>
              <input
                required
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="Dilnoza Karimova"
                className="mt-1 w-full rounded-2xl border border-border bg-secondary/60 px-4 py-3 text-sm outline-none transition focus:border-primary"
              />
            </label>
          ) : null}

          <label className="block">
            <span className="text-[11px] font-bold uppercase tracking-wide text-muted-foreground">
              Email
            </span>
            <input
              required
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="siz@example.com"
              className="mt-1 w-full rounded-2xl border border-border bg-secondary/60 px-4 py-3 text-sm outline-none transition focus:border-primary"
            />
          </label>

          <label className="block">
            <span className="text-[11px] font-bold uppercase tracking-wide text-muted-foreground">
              Parol
            </span>
            <input
              required
              minLength={6}
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="mt-1 w-full rounded-2xl border border-border bg-secondary/60 px-4 py-3 text-sm outline-none transition focus:border-primary"
            />
          </label>

          <button
            type="submit"
            disabled={loading}
            className="a-shim w-full rounded-2xl bg-accent py-3.5 text-sm font-bold text-accent-foreground shadow-lg shadow-accent/25 transition hover:opacity-90 disabled:opacity-60"
          >
            {loading ? "Yuklanmoqda…" : isSignup ? "Ro'yxatdan o'tish" : "Kirish"}
          </button>
        </form>

        <div className="my-5 flex items-center gap-3 text-[11px] font-bold uppercase tracking-wide text-muted-foreground">
          <span className="h-px flex-1 bg-border" /> yoki <span className="h-px flex-1 bg-border" />
        </div>

        <button
          onClick={handleGoogle}
          className="w-full rounded-2xl border border-border bg-secondary/60 py-3.5 text-sm font-bold transition hover:bg-secondary"
        >
          Google bilan davom etish
        </button>

        <p className="mt-6 text-center text-sm text-muted-foreground">
          {isSignup ? "Hisobingiz bormi?" : "Hisobingiz yo'qmi?"}{" "}
          <button
            onClick={() => setIsSignup((v) => !v)}
            className="font-bold text-accent hover:underline"
          >
            {isSignup ? "Kirish" : "Ro'yxatdan o'tish"}
          </button>
        </p>
      </div>
    </div>
  );
}
