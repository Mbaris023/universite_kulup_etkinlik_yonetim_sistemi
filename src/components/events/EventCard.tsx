import Link from "next/link";
import type { EventListItem } from "@/types";

export function EventCard({ event }: { event: EventListItem }) {
  return (
    <article className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm transition hover:shadow-md">
      <div className="mb-2 flex items-start justify-between gap-2">
        <h3 className="text-lg font-semibold text-slate-900">{event.title}</h3>
        <span className="rounded-full bg-brand-50 px-2 py-1 text-xs font-medium text-brand-700">
          {event.clubName}
        </span>
      </div>
      <p className="mb-3 line-clamp-2 text-sm text-slate-600">{event.description}</p>
      <dl className="mb-4 grid grid-cols-2 gap-2 text-sm text-slate-600">
        <div>
          <dt className="font-medium text-slate-500">Tarih</dt>
          <dd>{new Date(event.startTime).toLocaleString("tr-TR")}</dd>
        </div>
        <div>
          <dt className="font-medium text-slate-500">Konum</dt>
          <dd>{event.location}</dd>
        </div>
        <div>
          <dt className="font-medium text-slate-500">Kontenjan</dt>
          <dd>
            {event.activeEnrollmentCount} / {event.quota}
          </dd>
        </div>
        <div>
          <dt className="font-medium text-slate-500">Durum</dt>
          <dd>
            {event.isPast ? "Geçmiş" : event.isFull ? "Dolu" : "Açık"}
          </dd>
        </div>
      </dl>
      <Link
        href={`/events/${event.id}`}
        className="inline-flex text-sm font-semibold text-brand-600 hover:text-brand-700"
      >
        Detayları Gör →
      </Link>
    </article>
  );
}
