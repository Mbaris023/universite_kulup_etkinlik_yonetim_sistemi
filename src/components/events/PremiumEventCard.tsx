import Link from "next/link";
import { getCoverGradient } from "@/lib/constants/event-visuals";
import { FavoriteButton } from "@/components/events/FavoriteButton";
import { EventStatusBadge } from "@/components/events/EventStatusBadge";
import type { EventListItem } from "@/types";

export function PremiumEventCard({
  event,
  showFavorite = false,
}: {
  event: EventListItem;
  showFavorite?: boolean;
}) {
  const gradient = getCoverGradient(event.coverKey);
  const date = new Date(event.startTime);

  return (
    <Link
      href={`/events/${event.id}`}
      className="group relative flex flex-col overflow-hidden rounded-2xl bg-white shadow-lg transition duration-300 hover:-translate-y-1 hover:shadow-2xl"
    >
      <div className={`relative h-44 bg-gradient-to-br ${gradient} p-4`}>
        <div className="absolute inset-0 opacity-40 mix-blend-overlay bg-[radial-gradient(circle_at_30%_20%,white_0%,transparent_50%)]" />
        <div className="relative flex items-start justify-between gap-2">
          <span className="rounded-full bg-white/20 px-3 py-1 text-xs font-bold uppercase tracking-wide text-white backdrop-blur-sm">
            {event.category}
          </span>
          {showFavorite && (
            <FavoriteButton eventId={event.id} initialFavorited={!!event.isFavorited} size="sm" />
          )}
        </div>
        <div className="absolute bottom-4 left-4 right-4">
          <p className="text-xs font-medium text-white/80">{event.clubName}</p>
          <h3 className="font-display text-lg font-bold leading-tight text-white drop-shadow-sm">
            {event.title}
          </h3>
        </div>
      </div>

      <div className="flex flex-1 flex-col gap-3 p-4">
        <p className="line-clamp-2 text-sm text-slate-600">{event.description}</p>
        <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500">
          <span className="flex items-center gap-1">
            <CalendarIcon />
            {date.toLocaleDateString("tr-TR", { day: "numeric", month: "short", year: "numeric" })}
          </span>
          <span>·</span>
          <span>{date.toLocaleTimeString("tr-TR", { hour: "2-digit", minute: "2-digit" })}</span>
        </div>
        <p className="text-xs text-slate-500">{event.location}</p>

        <div className="mt-auto space-y-2">
          <div className="flex items-center justify-between text-xs font-medium text-slate-600">
            <span>
              {event.activeEnrollmentCount} / {event.quota} katılımcı
            </span>
            <span>%{event.occupancyPercent}</span>
          </div>
          <div className="h-2 overflow-hidden rounded-full bg-slate-100">
            <div
              className={`h-full rounded-full transition-all ${
                event.isFull ? "bg-rose-500" : "bg-gradient-to-r from-campus-500 to-violet-500"
              }`}
              style={{ width: `${Math.min(100, event.occupancyPercent ?? 0)}%` }}
            />
          </div>
          <div className="flex items-center justify-between">
            <EventStatusBadge event={event} />
            <span className="text-sm font-semibold text-campus-600 group-hover:underline">
              İncele →
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
}

function CalendarIcon() {
  return (
    <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
    </svg>
  );
}
