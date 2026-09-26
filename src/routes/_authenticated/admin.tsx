import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { AmbientBackground } from "@/components/AmbientBackground";
import { SiteHeader } from "@/components/SiteHeader";
import { useIsAdmin, useSessionUser } from "@/lib/session";

export const Route = createFileRoute("/_authenticated/admin")({
  head: () => ({
    meta: [
      { title: "Admin panel — Bilim.uz" },
      { name: "description", content: "Maktablar va o'quvchilarni boshqarish paneli." },
      { property: "og:title", content: "Admin panel — Bilim.uz" },
      { property: "og:description", content: "Maktablar va o'quvchilarni boshqarish paneli." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: AdminPage,
});

type StudentRow = {
  id: string;
  full_name: string;
  email: string | null;
  created_at: string;
  regions: { name: string } | null;
  districts: { name: string } | null;
  schools: { name: string } | null;
  classes: { grade: number; letter: string } | null;
};

function AdminPage() {
  const { data: user } = useSessionUser();
  const { data: isAdmin, isLoading: roleLoading } = useIsAdmin(user?.id);

  const students = useQuery({
    queryKey: ["admin-students"],
    enabled: isAdmin === true,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("profiles")
        .select(
          "id, full_name, email, created_at, regions(name), districts(name), schools(name), classes(grade, letter)",
        )
        .order("created_at", { ascending: false });
      if (error) throw error;
      return (data ?? []) as unknown as StudentRow[];
    },
  });

  const counts = useQuery({
    queryKey: ["admin-counts"],
    enabled: isAdmin === true,
    queryFn: async () => {
      const [schools, classes, regions] = await Promise.all([
        supabase.from("schools").select("id", { count: "exact", head: true }),
        supabase.from("classes").select("id", { count: "exact", head: true }),
        supabase.from("regions").select("id", { count: "exact", head: true }),
      ]);
      return {
        schools: schools.count ?? 0,
        classes: classes.count ?? 0,
        regions: regions.count ?? 0,
      };
    },
  });

  if (roleLoading) {
    return (
      <div className="relative min-h-screen">
        <AmbientBackground />
        <SiteHeader />
        <p className="px-6 pt-40 text-center text-muted-foreground">Tekshirilmoqda…</p>
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="relative min-h-screen">
        <AmbientBackground />
        <SiteHeader />
        <div className="mx-auto max-w-lg px-6 pt-40 text-center">
          <div className="glass-panel rounded-[28px] p-8">
            <h1 className="text-2xl font-bold">Ruxsat yo'q</h1>
            <p className="mt-2 text-sm text-muted-foreground">
              Bu bo'lim faqat ma'muriyat uchun. O'quvchi panelingizga qayting.
            </p>
            <Link
              to="/dashboard"
              className="mt-6 inline-block rounded-2xl bg-primary px-6 py-3 text-sm font-bold text-primary-foreground"
            >
              O'quvchi paneli
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const rows = students.data ?? [];

  return (
    <div className="relative min-h-screen">
      <AmbientBackground />
      <SiteHeader />

      <main className="mx-auto max-w-6xl px-6 pb-24 pt-32">
        <div className="flex items-center gap-3">
          <span className="rounded-full bg-primary px-3 py-1 text-xs font-bold text-primary-foreground">
            Admin panel
          </span>
          <h1 className="text-2xl font-bold">Maktab boshqaruvi</h1>
        </div>

        <div className="mt-6 grid gap-4 sm:grid-cols-4">
          <Metric label="Jami o'quvchilar" value={rows.length} tone="text-primary" />
          <Metric label="Maktablar" value={counts.data?.schools ?? 0} tone="text-teal" />
          <Metric label="Sinflar" value={counts.data?.classes ?? 0} tone="text-accent" />
          <Metric label="Viloyatlar" value={counts.data?.regions ?? 0} tone="text-foreground" />
        </div>

        <div className="glass-panel mt-6 overflow-hidden rounded-2xl">
          <div className="flex items-center justify-between border-b border-border px-5 py-3">
            <div className="font-bold">Ro'yxatdan o'tgan o'quvchilar</div>
            <span className="text-xs font-semibold text-muted-foreground">
              {rows.length} ta yozuv
            </span>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="text-[11px] uppercase tracking-wide text-muted-foreground">
                <tr>
                  <th className="px-5 py-3 font-semibold">O'quvchi</th>
                  <th className="px-5 py-3 font-semibold">Viloyat / tuman</th>
                  <th className="px-5 py-3 font-semibold">Maktab</th>
                  <th className="px-5 py-3 font-semibold">Sinf</th>
                  <th className="px-5 py-3 font-semibold">Holat</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {students.isLoading ? (
                  <tr>
                    <td className="px-5 py-4 text-muted-foreground" colSpan={5}>
                      Yuklanmoqda…
                    </td>
                  </tr>
                ) : rows.length === 0 ? (
                  <tr>
                    <td className="px-5 py-4 text-muted-foreground" colSpan={5}>
                      Hozircha o'quvchilar yo'q.
                    </td>
                  </tr>
                ) : (
                  rows.map((r) => (
                    <tr key={r.id} className="transition hover:bg-secondary/40">
                      <td className="px-5 py-3">
                        <div className="font-semibold">{r.full_name || "Ism kiritilmagan"}</div>
                        <div className="text-xs text-muted-foreground">{r.email}</div>
                      </td>
                      <td className="px-5 py-3 text-muted-foreground">
                        {r.regions?.name ?? "—"} {r.districts?.name ? `· ${r.districts.name}` : ""}
                      </td>
                      <td className="px-5 py-3 text-muted-foreground">{r.schools?.name ?? "—"}</td>
                      <td className="px-5 py-3">
                        {r.classes ? `${r.classes.grade}-sinf · ${r.classes.letter}` : "—"}
                      </td>
                      <td className="px-5 py-3">
                        {r.classes ? (
                          <span className="rounded-full bg-teal/15 px-3 py-1 text-xs font-bold text-teal">
                            Biriktirilgan
                          </span>
                        ) : (
                          <span className="rounded-full bg-accent/15 px-3 py-1 text-xs font-bold text-accent">
                            Sinf tanlanmagan
                          </span>
                        )}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
}

function Metric({ label, value, tone }: { label: string; value: number; tone: string }) {
  return (
    <div className="glass-panel rounded-2xl p-5">
      <div className="text-[11px] font-bold uppercase text-muted-foreground">{label}</div>
      <div className={`mt-1 font-display text-3xl font-bold ${tone}`}>{value}</div>
    </div>
  );
}
