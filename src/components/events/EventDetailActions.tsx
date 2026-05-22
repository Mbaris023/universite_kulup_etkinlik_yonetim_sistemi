"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { Alert } from "@/components/ui/Alert";

export function EventDetailActions({
  eventId,
  isPast,
  isFull,
}: {
  eventId: string;
  isPast: boolean;
  isFull: boolean;
}) {
  const router = useRouter();
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function enroll() {
    setLoading(true);
    setError("");
    setMessage("");
    const res = await fetch(`/api/events/${eventId}/enroll`, { method: "POST" });
    const data = await res.json();
    setLoading(false);
    if (!res.ok) {
      setError(data.message ?? "Kayıt başarısız.");
      return;
    }
    setMessage(data.message);
    router.refresh();
  }

  async function cancel() {
    setLoading(true);
    setError("");
    setMessage("");
    const res = await fetch(`/api/events/${eventId}/cancel-enrollment`, { method: "POST" });
    const data = await res.json();
    setLoading(false);
    if (!res.ok) {
      setError(data.message ?? "İptal başarısız.");
      return;
    }
    setMessage(data.message);
    router.refresh();
  }

  return (
    <div className="flex flex-wrap gap-3">
      <Button onClick={enroll} disabled={loading || isPast || isFull}>
        Etkinliğe Katıl
      </Button>
      <Button variant="secondary" onClick={cancel} disabled={loading || isPast}>
        Katılımı İptal Et
      </Button>
      {error && <Alert message={error} />}
      {message && <Alert message={message} type="success" />}
    </div>
  );
}
