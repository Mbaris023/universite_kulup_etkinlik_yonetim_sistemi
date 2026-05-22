"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { COVER_GRADIENTS, EVENT_CATEGORIES } from "@/lib/constants/event-visuals";
import { Alert } from "@/components/ui/Alert";
import { btnPrimary } from "@/components/ui/styles";

const CATEGORIES = EVENT_CATEGORIES.filter((c) => c !== "Tümü");

export function PresidentEventForm() {
  const router = useRouter();
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);
    const form = new FormData(e.currentTarget);
    const startTime = new Date(form.get("startTime") as string).toISOString();

    const res = await fetch("/api/events", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        title: form.get("title"),
        description: form.get("description"),
        location: form.get("location"),
        category: form.get("category"),
        coverKey: form.get("coverKey"),
        startTime,
        quota: Number(form.get("quota")),
      }),
    });
    const data = await res.json();
    setLoading(false);
    if (!res.ok) {
      setError(data.message ?? "Etkinlik oluşturulamadı.");
      return;
    }
    setSuccess("Etkinlik başarıyla oluşturuldu.");
    (e.target as HTMLFormElement).reset();
    router.refresh();
  }

  const inputClass =
    "w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none focus:border-campus-400 focus:ring-4 focus:ring-campus-500/15";

  return (
    <form onSubmit={handleSubmit} className="grid gap-4 sm:grid-cols-2">
      <input name="title" placeholder="Etkinlik başlığı" required className={`${inputClass} sm:col-span-2`} />
      <textarea
        name="description"
        placeholder="Açıklama"
        required
        className={`${inputClass} min-h-[100px] sm:col-span-2`}
      />
      <select name="category" required className={inputClass} defaultValue="Atölye">
        {CATEGORIES.map((c) => (
          <option key={c} value={c}>
            {c}
          </option>
        ))}
      </select>
      <select name="coverKey" required className={inputClass} defaultValue="aurora">
        {Object.keys(COVER_GRADIENTS).map((k) => (
          <option key={k} value={k}>
            Kapak: {k}
          </option>
        ))}
      </select>
      <input name="location" placeholder="Konum" required className={inputClass} />
      <input name="startTime" type="datetime-local" required className={inputClass} />
      <input
        name="quota"
        type="number"
        min={1}
        placeholder="Kontenjan"
        required
        className={inputClass}
      />
      <div className="sm:col-span-2">
        <button type="submit" disabled={loading} className={btnPrimary}>
          {loading ? "Oluşturuluyor..." : "Etkinlik Oluştur"}
        </button>
      </div>
      {error && <div className="sm:col-span-2"><Alert message={error} /></div>}
      {success && <div className="sm:col-span-2"><Alert message={success} type="success" /></div>}
    </form>
  );
}
