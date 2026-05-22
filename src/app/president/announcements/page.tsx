"use client";

import { useState } from "react";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Alert } from "@/components/ui/Alert";

export default function PresidentAnnouncementsPage() {
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);
    const form = new FormData(e.currentTarget);
    const res = await fetch("/api/announcements", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        title: form.get("title"),
        content: form.get("content"),
      }),
    });
    const data = await res.json();
    setLoading(false);
    if (!res.ok) {
      setError(data.message ?? "Duyuru paylaşılamadı.");
      return;
    }
    setSuccess("Duyuru paylaşıldı.");
    (e.target as HTMLFormElement).reset();
  }

  return (
    <div>
      <h1 className="mb-6 text-2xl font-bold">Duyuru Paylaş</h1>
      <Card>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input name="title" placeholder="Duyuru başlığı" required className="w-full rounded-lg border px-3 py-2" />
          <textarea
            name="content"
            placeholder="Duyuru içeriği"
            required
            className="min-h-[120px] w-full rounded-lg border px-3 py-2"
          />
          <Button type="submit" disabled={loading}>
            Paylaş
          </Button>
          {error && <Alert message={error} />}
          {success && <Alert message={success} type="success" />}
        </form>
      </Card>
    </div>
  );
}
