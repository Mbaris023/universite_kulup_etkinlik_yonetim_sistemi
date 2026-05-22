import Link from "next/link";
import { getSessionUser } from "@/lib/auth/session";
import { getCoverGradient } from "@/lib/constants/event-visuals";
import { EventService } from "@/lib/services/event.service";
import { EnrollmentPanel } from "@/components/events/EnrollmentPanel";
import { FavoriteButton } from "@/components/events/FavoriteButton";
import { EventStatusBadge } from "@/components/events/EventStatusBadge";
import { Card } from "@/components/ui/Card";
import { btnGhost, glassPanel } from "@/components/ui/styles";
import type { EventListItem } from "@/types";
import { PresidentEventEdit } from "@/components/president/PresidentEventEdit";

type Props = { params: Promise<{ id: string }> };

export default async function EventDetailPage({ params }: Props) {
  const { id } = await params;
  const user = await getSessionUser();
  const eventService = new EventService();
  const eventDetail = await eventService.getById(id, user);
  const event = eventDetail as EventListItem & typeof eventDetail;
  const gradient = getCoverGradient(event.coverKey);
  const date = new Date(event.startTime);

  return (
    <div className="animate-fade-in">
      <Link href="/events" className={`${btnGhost} mb-4 inline-flex text-sm`}>
        ← Etkinliklere dön
      </Link>

      <div className={`relative mb-8 overflow-hidden rounded-3xl bg-gradient-to-br ${gradient} p-8 md:p-12`}>
        <div className="absolute inset-0 bg-black/10" />
        <div className="relative flex flex-wrap items-start justify-between gap-4">
          <div className="max-w-3xl space-y-3">
            <span className="inline-block rounded-full bg-white/25 px-3 py-1 text-xs font-bold uppercase tracking-wide text-white backdrop-blur-sm">
              {event.category}
            </span>
            <h1 className="font-display text-3xl font-bold text-white md:text-4xl">{event.title}</h1>
            <p className="text-white/90">{event.clubName}</p>
            <div className="flex flex-wrap gap-3 text-sm text-white/85">
              <span>
                {date.toLocaleDateString("tr-TR", {
                  weekday: "long",
                  day: "numeric",
                  month: "long",
                  year: "numeric",
                })}
              </span>
              <span>·</span>
              <span>{date.toLocaleTimeString("tr-TR", { hour: "2-digit", minute: "2-digit" })}</span>
              <span>·</span>
              <span>{event.location}</span>
            </div>
            <EventStatusBadge event={event} />
          </div>
          {user?.role === "STUDENT" && (
            <FavoriteButton eventId={event.id} initialFavorited={!!event.isFavorited} />
          )}
        </div>
      </div>

      <div className="grid gap-8 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          <Card title="Etkinlik hakkında">
            <p className="leading-relaxed text-slate-700">{event.description}</p>
          </Card>

          {(user?.role === "CLUB_PRESIDENT" || user?.role === "ADMIN") && (
            <Card title={`Katılımcılar (${event.participants.length})`}>
              <ul className="divide-y divide-slate-100">
                {event.participants.map((p) => (
                  <li key={p.enrollmentId} className="flex justify-between py-3 text-sm">
                    <span className="font-medium text-slate-800">
                      {p.name}{" "}
                      <span className="font-normal text-slate-500">
                        ({p.studentNo}) — {p.department}
                      </span>
                    </span>
                    <span className="text-slate-500">
                      {new Date(p.enrolledAt).toLocaleDateString("tr-TR")}
                    </span>
                  </li>
                ))}
                {event.participants.length === 0 && (
                  <li className="py-6 text-center text-slate-500">Henüz katılımcı yok.</li>
                )}
              </ul>
            </Card>
          )}

          {user?.role === "CLUB_PRESIDENT" && user.clubId === event.clubId && (
            <Card title="Etkinlik düzenleme">
              <PresidentEventEdit
                eventId={event.id}
                initial={{
                  title: event.title,
                  description: event.description,
                  location: event.location,
                  startTime: event.startTime,
                  quota: event.quota,
                }}
              />
            </Card>
          )}
        </div>

        <div>
          {user?.role === "STUDENT" && <EnrollmentPanel event={event} />}
          {user?.role !== "STUDENT" && (
            <div className={`${glassPanel} p-6 text-sm text-slate-600`}>
              Kayıt işlemleri öğrenci hesaplarıyla yapılır. Kulüp başkanı olarak katılımcı listesini
              soldan görüntüleyebilirsiniz.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
