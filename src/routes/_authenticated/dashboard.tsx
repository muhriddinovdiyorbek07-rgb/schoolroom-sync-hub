import { createFileRoute } from "@tanstack/react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { AmbientBackground } from "@/components/AmbientBackground";
import { SiteHeader } from "@/components/SiteHeader";
import { useProfile, useSessionUser } from "@/lib/session";

export const Route = createFileRoute("/_authenticated/dashboard")({
  head: () => ({
    meta: [
      { title: "O'quvchi paneli — Bilim.uz" },
      { name: "description", content: "Sinfingiz, darslaringiz va natijalaringiz bir joyda." },
      { property: "og:title", content: "O'quvchi paneli — Bilim.uz" },
      {
        property: "og:description",
        content: "Sinfingiz, darslaringiz va natijalaringiz bir joyda.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Dashboard,
});

function useList<T>(key: string, table: string, column?: string, value?: string | null) {
  return useQuery({
    queryKey: [key, value ?? null],
    enabled: column ? Boolean(value) : true,
    queryFn: async () => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      let q: any = (supabase.from as any)(table).select("*");
      if (column && value) q = q.eq(column, value);
      const { data, error } = await q;
      if (error) throw error;
      return (data ?? []) as T[];
    },
  });
}

type Named = { id: string; name: string };
type ClassRow = { id: string; grade: number; letter: string };

function Dashboard() {
  const { data: user } = useSessionUser();
  const { data: profile, isLoading } = useProfile(user?.id);
  const queryClient = useQueryClient();

  const [regionId, setRegionId] = useState<string | null>(null);
  const [districtId, setDistrictId] = useState<string | null>(null);
  const [schoolId, setSchoolId] = useState<string | null>(null);
  const [classId, setClassId] = useState<string | null>(null);

  useEffect(() => {
    if (!profile) return;
    setRegionId(profile.region_id);
    setDistrictId(profile.district_id);
    setSchoolId(profile.school_id);
    setClassId(profile.class_id);
  }, [profile]);

  const regions = useList<Named>("regions", "regions");
  const districts = useList<Named>("districts", "districts", "region_id", regionId);
  const schools = useList<Named>("schools", "schools", "district_id", districtId);
  const classes = useList<ClassRow>("classes", "classes", "school_id", schoolId);

  const save = useMutation({
    mutationFn: async () => {
      const { error } = await supabase
        .from("profiles")
        .update({
          region_id: regionId,
          district_id: districtId,
          school_id: schoolId,
          class_id: classId,
        })
        .eq("id", user!.id);
      if (error) throw error;
    },
    onSuccess: () => {
      toast.success("Ma'lumotlar saqlandi");
      queryClient.invalidateQueries({ queryKey: ["profile"] });
    },
    onError: (e) => toast.error(e instanceof Error ? e.message : "Saqlashda xatolik"),
  });

  const placed = Boolean(profile?.class_id);
  const currentClass = classes.data?.find((c) => c.id === classId);

  return (
    <div className="relative min-h-screen">
      <AmbientBackground />
      <SiteHeader />

      <main className="mx-auto max-w-6xl px-6 pb-24 pt-32">
        <div className="a-rise">
          <div className="text-xs font-bold uppercase tracking-wider text-accent">
            O'quvchi paneli
          </div>
          <h1 className="mt-1 text-3xl font-bold tracking-tight">
            Salom, {profile?.full_name || "o'quvchi"}
          </h1>
        </div>

        {isLoading ? (
          <p className="mt-8 text-muted-foreground">Yuklanmoqda…</p>
        ) : (
          <>
            <section className="glass-panel mt-8 rounded-[32px] p-6 sm:p-8">
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div>
                  <h2 className="text-2xl font-bold">
                    {placed ? "Mening maktabim" : "Maktabingizni tanlang"}
                  </h2>
                  <p className="mt-1 text-sm text-muted-foreground">
                    Viloyat → tuman → maktab → sinf ketma-ketligida tanlang.
                  </p>
                </div>
                {placed && currentClass ? (
                  <div className="flex items-center gap-2 rounded-full border border-border bg-secondary/50 px-4 py-2 text-sm font-semibold">
                    <span className="size-2 rounded-full bg-teal" /> {currentClass.grade}-sinf ·{" "}
                    {currentClass.letter} guruh
                  </div>
                ) : null}
              </div>

              <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                <Field label="Viloyat">
                  <Select
                    value={regionId}
                    onChange={(v) => {
                      setRegionId(v);
                      setDistrictId(null);
                      setSchoolId(null);
                      setClassId(null);
                    }}
                    options={(regions.data ?? []).map((r) => ({ value: r.id, label: r.name }))}
                  />
                </Field>
                <Field label="Tuman">
                  <Select
                    value={districtId}
                    disabled={!regionId}
                    onChange={(v) => {
                      setDistrictId(v);
                      setSchoolId(null);
                      setClassId(null);
                    }}
                    options={(districts.data ?? []).map((d) => ({ value: d.id, label: d.name }))}
                  />
                </Field>
                <Field label="Maktab">
                  <Select
                    value={schoolId}
                    disabled={!districtId}
                    onChange={(v) => {
                      setSchoolId(v);
                      setClassId(null);
                    }}
                    options={(schools.data ?? []).map((s) => ({ value: s.id, label: s.name }))}
                  />
                </Field>
                <Field label="Sinf">
                  <Select
                    value={classId}
                    disabled={!schoolId}
                    onChange={setClassId}
                    options={(classes.data ?? []).map((c) => ({
                      value: c.id,
                      label: `${c.grade}-sinf · ${c.letter}`,
                    }))}
                  />
                </Field>
              </div>

              <button
                onClick={() => save.mutate()}
                disabled={!classId || save.isPending}
                className="mt-6 rounded-2xl bg-accent px-6 py-3 text-sm font-bold text-accent-foreground shadow-lg shadow-accent/25 transition hover:opacity-90 disabled:opacity-50"
              >
                {save.isPending ? "Saqlanmoqda…" : "Saqlash"}
              </button>
            </section>

            <section className="mt-6 grid gap-6 lg:grid-cols-[1.4fr_1fr]">
              <div className="space-y-6">
                <div className="grid grid-cols-3 gap-4">
                  <Stat label="O'rtacha baho" value="4.6" tone="text-primary" />
                  <Stat label="O'qilgan darslar" value="42" tone="text-teal" />
                  <Stat label="Ballar" value="1280" tone="text-accent" />
                </div>

                <div className="glass-panel rounded-2xl p-5">
                  <div className="flex items-center justify-between">
                    <div className="font-bold">O'qish jarayoni</div>
                    <span className="text-sm font-bold text-teal">72%</span>
                  </div>
                  <div className="mt-3 h-2.5 overflow-hidden rounded-full bg-secondary">
                    <div className="a-bar h-full w-[72%] rounded-full bg-primary" />
                  </div>
                </div>

                <div className="glass-panel rounded-2xl p-5">
                  <div className="font-bold">Fanlar bo'yicha natija</div>
                  <div className="mt-4 space-y-3 text-sm">
                    <Progress label="Matematika" percent="87%" bar="bg-teal" />
                    <Progress label="Ona tili" percent="94%" bar="bg-accent" />
                    <Progress label="Tabiiy fanlar" percent="79%" bar="bg-primary" />
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div className="glass-panel rounded-2xl p-5">
                  <div className="font-bold">Bugun</div>
                  <div className="mt-3 space-y-2 text-sm">
                    <div className="flex items-center gap-3 rounded-xl bg-primary/10 px-3 py-2">
                      <span className="text-primary">09:00</span>
                      <span className="font-semibold">Algebra — 30-mashq</span>
                    </div>
                    <div className="flex items-center gap-3 rounded-xl bg-teal/10 px-3 py-2">
                      <span className="text-teal">11:00</span>
                      <span className="font-semibold">Fizika — video dars</span>
                    </div>
                    <div className="flex items-center gap-3 rounded-xl bg-accent/10 px-3 py-2">
                      <span className="text-accent">14:00</span>
                      <span className="font-semibold">Tarix — test</span>
                    </div>
                  </div>
                </div>
                <div className="glass-panel rounded-2xl p-5">
                  <div className="font-bold">Yutuqlar</div>
                  <div className="mt-3 flex gap-3">
                    {[
                      { Icon: Medal, label: "100 kun" },
                      { Icon: Flame, label: "Seriyali" },
                      { Icon: Target, label: "Top 5%" },
                    ].map(({ Icon, label }) => (
                      <div key={label} className="text-center">
                        <div className="grid size-11 place-items-center rounded-full bg-secondary text-accent">
                          <Icon className="size-5" />
                        </div>
                        <div className="mt-1 text-[10px] font-semibold text-muted-foreground">
                          {label}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </section>
          </>
        )}
      </main>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="text-[11px] font-bold uppercase tracking-wide text-muted-foreground">
        {label}
      </span>
      {children}
    </label>
  );
}

function Select({
  value,
  onChange,
  options,
  disabled,
}: {
  value: string | null;
  onChange: (v: string) => void;
  options: { value: string; label: string }[];
  disabled?: boolean;
}) {
  return (
    <select
      disabled={disabled}
      value={value ?? ""}
      onChange={(e) => onChange(e.target.value)}
      className="mt-1 w-full rounded-2xl border border-border bg-secondary/60 px-4 py-3 text-sm outline-none transition focus:border-primary disabled:opacity-50"
    >
      <option value="">Tanlang…</option>
      {options.map((o) => (
        <option key={o.value} value={o.value}>
          {o.label}
        </option>
      ))}
    </select>
  );
}

function Stat({ label, value, tone }: { label: string; value: string; tone: string }) {
  return (
    <div className="glass-panel rounded-2xl p-4">
      <div className="text-[11px] font-bold uppercase text-muted-foreground">{label}</div>
      <div className={`mt-1 font-display text-2xl font-bold ${tone}`}>{value}</div>
    </div>
  );
}

function Progress({ label, percent, bar }: { label: string; percent: string; bar: string }) {
  return (
    <div>
      <div className="flex justify-between">
        <span className="font-semibold">{label}</span>
        <span className="text-muted-foreground">{percent}</span>
      </div>
      <div className="mt-1 h-2 overflow-hidden rounded-full bg-secondary">
        <div className={`a-bar h-full rounded-full ${bar}`} style={{ width: percent }} />
      </div>
    </div>
  );
}
