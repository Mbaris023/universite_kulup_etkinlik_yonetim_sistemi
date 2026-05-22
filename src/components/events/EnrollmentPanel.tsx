"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Badge } from "@/components/ui/Badge";
import { glassPanel, btnPrimary, btnSecondary } from "@/components/ui/styles";
import type { EventListItem } from "@/types";

type PanelState = "enrolled" | "can_enroll" | "full" | "past" | "cancelled";

function resolveState(event: EventListItem): PanelState {
  if (event.status === "CANCELLED") return "cancelled";
  if (event.isPast) return "past";
  if (event.isEnrolled) return "enrolled";
  if (event.isFull) return "full";
  return "can_enroll";
}

function eventSpots(event: EventListItem) {
  return event.spotsLeft ?? Math.max(0, event.quota - event.activeEnrollmentCount);
}

function getHint(state: PanelState, event: EventListItem): string {
  switch (state) {
    case "enrolled":
      return "Etkinlik başlamadan önce kaydını iptal edebilirsin.";
    case "can_enroll":
      return `${eventSpots(event)} yer kaldı — hemen kayıt ol.`;
    case "full":
      return "Şu an yeni kayıt alınmıyor. Favorilere ekleyerek takip edebilirsin.";
    case "past":
      return "Geçmiş etkinliklere kayıt yapılamaz.";
    case "cancelled":
      return "Bu etkinlik kulüp tarafından iptal edilmiştir.";
  }
}

const STATE_LABELS: Record<
  PanelState,
  { label: string; badge: "success" | "warning" | "danger" | "outline" | "brand" }
> = {
  enrolled: { label: "Bu etkinliğe kayıtlısın", badge: "success" },
  can_enroll: { label: "Kayıt açık", badge: "brand" },
  full: { label: "Kontenjan doldu", badge: "warning" },
  past: { label: "Etkinlik süresi geçti", badge: "outline" },
  cancelled: { label: "Etkinlik iptal edildi", badge: "danger" },
};

export function EnrollmentPanel({ event }: { event: EventListItem }) {
  const router = useRouter();
  const [loading, setLoading] = useState<"enroll" | "cancel" | null>(null);
  const [feedback, setFeedback] = useState<{ type: "ok" | "err"; text: string } | null>(null);
  const state = resolveState(event);
  const config = STATE_LABELS[state];
  const hint = getHint(state, event);

  async function enroll() {
    setLoading("enroll");
    setFeedback(null);
    const res = await fetch(`/api/events/${event.id}/enroll`, { method: "POST" });
    const data = await res.json();
    setLoading(null);
    if (!res.ok) {
      setFeedback({ type: "err", text: data.message ?? "Kayıt başarısız." });
      return;
    }
    setFeedback({ type: "ok", text: data.message });
    router.refresh();
  }

  async function cancel() {
    setLoading("cancel");
    setFeedback(null);
    const res = await fetch(`/api/events/${event.id}/cancel-enrollment`, { method: "POST" });
    const data = await res.json();
    setLoading(null);
    if (!res.ok) {
      setFeedback({ type: "err", text: data.message ?? "İptal başarısız." });
      return;
    }
    setFeedback({ type: "ok", text: data.message });
    router.refresh();
  }

  return (
    <div className={`${glassPanel} sticky top-24 space-y-4 p-6`}>
      <div className="flex items-center justify-between gap-2">
        <h3 className="font-display text-lg font-bold text-slate-900">Kayıt durumu</h3>
        <Badge variant={config.badge}>{config.label}</Badge>
      </div>
      <p className="text-sm text-slate-600">{hint}</p>

      <div className="rounded-xl bg-slate-50 p-4 text-sm">
        <div className="flex justify-between font-medium text-slate-700">
          <span>Doluluk</span>
          <span>
            {event.activeEnrollmentCount}/{event.quota}
          </span>
        </div>
        <div className="mt-2 h-2.5 overflow-hidden rounded-full bg-slate-200">
          <div
            className="h-full rounded-full bg-gradient-to-r from-campus-500 to-violet-500"
            style={{ width: `${event.occupancyPercent}%` }}
          />
        </div>
      </div>

      {state === "enrolled" && (
        <button
          type="button"
          onClick={cancel}
          disabled={loading !== null}
          className={`${btnSecondary} w-full border-rose-200 text-rose-700 hover:border-rose-300 hover:bg-rose-50`}
        >
          {loading === "cancel" ? "İptal ediliyor..." : "Kaydı İptal Et"}
        </button>
      )}

      {state === "can_enroll" && (
        <button type="button" onClick={enroll} disabled={loading !== null} className={`${btnPrimary} w-full`}>
          {loading === "enroll" ? "Kaydediliyor..." : "Etkinliğe Katıl"}
        </button>
      )}

      {(state === "full" || state === "past" || state === "cancelled") && (
        <button type="button" disabled className={`${btnPrimary} w-full cursor-not-allowed opacity-50`}>
          Kayıt kapalı
        </button>
      )}

      {feedback && (
        <p
          className={`rounded-lg px-3 py-2 text-sm ${
            feedback.type === "ok" ? "bg-emerald-50 text-emerald-800" : "bg-rose-50 text-rose-800"
          }`}
        >
          {feedback.text}
        </p>
      )}
    </div>
  );
}
