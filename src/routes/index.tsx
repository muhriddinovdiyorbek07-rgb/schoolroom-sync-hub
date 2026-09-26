import { createFileRoute, Link } from "@tanstack/react-router";
import { AmbientBackground } from "@/components/AmbientBackground";
import { SiteHeader } from "@/components/SiteHeader";
import { BarChart3, BookOpen, FlaskConical } from "lucide-react";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Bilim.uz — O'zbekiston maktablari uchun onlayn platforma" },
      {
        name: "description",
        content:
          "Viloyat, tuman va maktabni tanlang, sinfingizga biriktiriling. O'quvchilar uchun shaxsiy kabinet va maktab uchun admin panel.",
      },
      { property: "og:title", content: "Bilim.uz — maktab ta'lim platformasi" },
      {
        property: "og:description",
        content:
          "Ro'yxatdan o'ting, sinfingizni tanlang va darslaringizni bir joyda kuzating.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

function Index() {
  return (
    <div className="relative min-h-screen">
      <AmbientBackground />
      <SiteHeader />

      <section className="relative overflow-hidden pb-24 pt-36">
        <div className="mx-auto grid max-w-6xl grid-cols-1 items-center gap-12 px-6 lg:grid-cols-[1.05fr_.95fr]">
          <div className="a-rise">
            <span className="glass-panel inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-xs font-bold uppercase tracking-wider text-foreground/80">
              <span className="size-1.5 rounded-full bg-accent" /> O'zbekiston bo'ylab 2 400+ maktab
            </span>
            <h1 className="mt-6 text-5xl font-bold leading-[1.05] tracking-tight sm:text-6xl">
              Har bir o'quvchi uchun{" "}
              <span className="bg-gradient-to-r from-primary to-teal bg-clip-text text-transparent">
                zamonaviy ta'lim
              </span>{" "}
              platformasi
            </h1>
            <p className="mt-5 max-w-lg text-lg text-muted-foreground">
              Viloyat, tuman va maktabni tanlang — sinfingizga biriktirilasiz. O'zbek tilida,
              bepul va mobil.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                to="/auth"
                search={{ mode: "signup" }}
                className="rounded-full bg-primary px-7 py-3.5 text-sm font-bold text-primary-foreground shadow-xl shadow-primary/30 transition hover:opacity-90"
              >
                Bepul ro'yxatdan o'tish
              </Link>
              <Link
                to="/auth"
                search={{ mode: "login" }}
                className="glass-panel rounded-full px-7 py-3.5 text-sm font-bold transition hover:opacity-90"
              >
                Kirish →
              </Link>
            </div>
            <div className="mt-10 flex items-center gap-8">
              <div>
                <div className="font-display text-3xl font-bold text-primary">186K+</div>
                <div className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                  O'quvchilar
                </div>
              </div>
              <div className="h-10 w-px bg-border" />
              <div>
                <div className="font-display text-3xl font-bold text-teal">94%</div>
                <div className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                  Bitiruvchilar
                </div>
              </div>
              <div className="h-10 w-px bg-border" />
              <div>
                <div className="font-display text-3xl font-bold text-accent">4.9★</div>
                <div className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                  Reyting
                </div>
              </div>
            </div>
          </div>

          <div className="a-rise relative" style={{ animationDelay: ".15s" }}>
            <div className="glass-panel rounded-[28px] p-6">
              <div className="flex items-center justify-between">
                <span className="font-display text-sm font-bold">Yangi o'quvchi</span>
                <span className="rounded-full bg-teal/15 px-3 py-1 text-xs font-bold text-teal">
                  Qadam 1/2
                </span>
              </div>
              <div className="mt-5 space-y-3">
                {[
                  ["Viloyat", "Toshkent viloyati"],
                  ["Tuman", "Yangiyo'l tumani"],
                  ["Maktab", "12-maktab"],
                  ["Sinf", "9-sinf · B guruh"],
                ].map(([label, value]) => (
                  <div
                    key={label}
                    className="rounded-2xl border border-border bg-secondary/50 px-4 py-3"
                  >
                    <div className="text-[11px] font-bold uppercase tracking-wide text-muted-foreground">
                      {label}
                    </div>
                    <div className="mt-0.5 font-semibold">{value} ▾</div>
                  </div>
                ))}
              </div>
              <Link
                to="/auth"
                search={{ mode: "signup" }}
                className="mt-5 block rounded-2xl bg-accent py-3.5 text-center text-sm font-bold text-accent-foreground shadow-lg shadow-accent/25 transition hover:opacity-90"
              >
                Davom etish →
              </Link>
            </div>
            <div className="a-drift glass-panel absolute -bottom-14 left-2 hidden w-52 rounded-2xl p-4 lg:block">
              <div className="text-[11px] font-bold uppercase tracking-wide text-muted-foreground">
                Bugungi test
              </div>
              <div className="mt-1 text-sm font-bold">Matematika · 87%</div>
              <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-secondary">
                <div className="a-bar h-full w-[87%] rounded-full bg-teal" />
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 py-20">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-4xl font-bold tracking-tight">Nima qo'shamiz</h2>
          <p className="mt-3 text-muted-foreground">
            O'quvchi, o'qituvchi va maktab uchun bir butun muhit.
          </p>
        </div>
        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {[
            {
              Icon: BookOpen,
              title: "Raqamli darsliklar",
              text: "Har sinf uchun rasmiy darsliklar va video darslar.",
            },
            {
              Icon: FlaskConical,
              title: "Interaktiv testlar",
              text: "Nazorat ishlari va darhol natija — bilimingizni kuzating.",
            },
            {
              Icon: BarChart3,
              title: "Baho tizimi",
              text: "O'qituvchi va ota-onalar uchun shaffof reyting va hisobotlar.",
            },
          ].map(({ Icon, title, text }) => (
            <div key={title} className="glass-panel rounded-3xl p-7">
              <div className="grid size-12 place-items-center rounded-2xl bg-primary/15 text-primary">
                <Icon className="size-6" />
              </div>
              <h3 className="mt-4 text-xl font-bold">{title}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{text}</p>
            </div>
          ))}
        </div>
      </section>

      <footer className="border-t border-border">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 px-6 py-8 text-sm text-muted-foreground sm:flex-row">
          <div className="font-display font-bold text-foreground">
            Bilim<span className="text-accent">.uz</span>
          </div>
          <div>© 2026 Bilim.uz — O'zbekiston ta'lim platformasi</div>
          <div className="flex gap-5 font-semibold">
            <span>Maxfiylik</span>
            <span>Shartlar</span>
            <span>Yordam</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
