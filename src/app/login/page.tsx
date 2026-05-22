"use client";

import { btnPrimary, glassPanel } from "@/components/ui/styles";
import { useState } from "react";
import { useRouter } from "next/navigation";

const DEMO_ACCOUNTS = [
  { email: "student@uni.edu", role: "Öğrenci", color: "from-emerald-500 to-teal-600" },
  { email: "president@uni.edu", role: "Kulüp Başkanı", color: "from-violet-500 to-purple-600" },
  { email: "admin@uni.edu", role: "Admin", color: "from-rose-500 to-orange-500" },
];

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("student@uni.edu");
  const [password, setPassword] = useState("123456");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.message ?? "Giriş başarısız.");
        return;
      }
      const role = data.user.role;
      if (role === "ADMIN") router.push("/admin/reports");
      else if (role === "CLUB_PRESIDENT") router.push("/president/events");
      else router.push("/events");
      router.refresh();
    } catch {
      setError("Bağlantı hatası oluştu.");
    } finally {
      setLoading(false);
    }
  }

  function quickLogin(demoEmail: string) {
    setEmail(demoEmail);
    setPassword("123456");
  }

  return (
    <div className="mx-auto grid min-h-[80vh] max-w-6xl items-center gap-10 lg:grid-cols-2">
      <section className="relative hidden overflow-hidden rounded-3xl bg-gradient-to-br from-campus-700 via-violet-700 to-fuchsia-600 p-10 text-white shadow-glow lg:block">
        <div className="absolute -right-10 -top-10 h-48 w-48 rounded-full bg-white/10 blur-2xl" />
        <div className="absolute -bottom-10 -left-10 h-56 w-56 rounded-full bg-accent-coral/30 blur-3xl" />
        <div className="relative">
          <p className="text-sm font-semibold uppercase tracking-widest text-white/70">CampusPulse</p>
          <h1 className="font-display mt-4 text-4xl font-bold leading-tight">
            Kampüs etkinliklerini tek yerden yönet
          </h1>
          <p className="mt-4 max-w-md text-lg text-white/85">
            Keşfet, favorile, kayıt ol. 12+ etkinlik, canlı kontenjan ve profesyonel deneyim.
          </p>
          <ul className="mt-8 space-y-3 text-sm text-white/90">
            <li>✦ Kategori ve arama ile filtreleme</li>
            <li>♥ Favori etkinlik listesi</li>
            <li>◎ Kayıtlarım paneli</li>
            <li>◈ Kulüp duyuruları</li>
          </ul>
        </div>
      </section>

      <section className={`${glassPanel} mx-auto w-full max-w-md p-8 md:p-10`}>
        <h2 className="font-display text-2xl font-bold text-slate-900">Hoş geldin</h2>
        <p className="mt-1 text-sm text-slate-500">Hesabınla giriş yap veya demo seç</p>

        <div className="mt-6 grid gap-2">
          {DEMO_ACCOUNTS.map((d) => (
            <button
              key={d.email}
              type="button"
              onClick={() => quickLogin(d.email)}
              className={`flex items-center justify-between rounded-xl bg-gradient-to-r ${d.color} px-4 py-2.5 text-left text-sm font-semibold text-white shadow-sm transition hover:scale-[1.01]`}
            >
              <span>{d.role}</span>
              <span className="text-xs opacity-90">{d.email}</span>
            </button>
          ))}
        </div>

        <form onSubmit={handleSubmit} className="mt-8 space-y-4">
          <div>
            <label className="mb-1.5 block text-sm font-medium text-slate-700">E-posta</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none focus:border-campus-400 focus:ring-4 focus:ring-campus-500/15"
              required
            />
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-medium text-slate-700">Şifre</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none focus:border-campus-400 focus:ring-4 focus:ring-campus-500/15"
              required
            />
          </div>
          {error && (
            <p className="rounded-xl bg-rose-50 px-4 py-3 text-sm text-rose-800">{error}</p>
          )}
          <button type="submit" disabled={loading} className={`${btnPrimary} w-full py-3.5`}>
            {loading ? "Giriş yapılıyor..." : "Giriş Yap"}
          </button>
        </form>
        <p className="mt-4 text-center text-xs text-slate-400">Demo şifre: 123456</p>
      </section>
    </div>
  );
}
