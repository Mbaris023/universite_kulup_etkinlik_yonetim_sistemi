"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { Alert } from "@/components/ui/Alert";

export function PresidentEventEdit({
  eventId,
  initial,
}: {
  eventId: string;
  initial: {
    title: string;
    description: string;
    location: string;
    startTime: string;
    quota: number;
  };
}) {
  const router = useRouter();
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  const localStart = initial.startTime.slice(0, 16);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);
    const form = new FormData(e.currentTarget);
    const res = await fetch(`/api/events/${eventId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        title: form.get("title"),
        description: form.get("description"),
        location: form.get("location"),
        startTime: new Date(form.get("startTime") as string).toISOString(),
        quota: Number(form.get("quota")),
      }),
    });
    const data = await res.json();
    setLoading(false);
    if (!res.ok) {
      setError(data.message ?? "Güncelleme başarısız.");
      return;
    }
    setSuccess("Etkinlik güncellendi.");
    router.refresh();
  }

  return (
    <form onSubmit={handleSubmit} className="mt-6 grid gap-3 border-t pt-6 sm:grid-cols-2">
      <p className="text-sm font-semibold text-slate-700 sm:col-span-2">Etkinliği Düzenle</p>
      <input
        name="title"
        defaultValue={initial.title}
        required
        className="rounded-lg border px-3 py-2 sm:col-span-2"
      />
      <textarea
        name="description"
        defaultValue={initial.description}
        required
        className="min-h-[60px] rounded-lg border px-3 py-2 sm:col-span-2"
      />
      <input name="location" defaultValue={initial.location} required className="rounded-lg border px-3 py-2" />
      <input
        name="startTime"
        type="datetime-local"
        defaultValue={localStart}
        required
        className="rounded-lg border px-3 py-2"
      />
      <input
        name="quota"
        type="number"
        min={1}
        defaultValue={initial.quota}
        required
        className="rounded-lg border px-3 py-2"
      />
      <Button type="submit" disabled={loading} variant="secondary">
        Güncelle
      </Button>
      {error && <Alert message={error} />}
      {success && <Alert message={success} type="success" />}
    </form>
  );
}
