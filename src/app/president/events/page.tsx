import Link from "next/link";
import { getSessionUser } from "@/lib/auth/session";
import { EventService } from "@/lib/services/event.service";
import { PremiumEventCard } from "@/components/events/PremiumEventCard";
import { PresidentEventForm } from "@/components/president/PresidentEventForm";
import { glassPanel, gradientText } from "@/components/ui/styles";

export default async function PresidentEventsPage() {
  const user = await getSessionUser();
  const eventService = new EventService();
  const events = user ? await eventService.listForPresident(user) : [];

  return (
    <div className="animate-fade-in space-y-8">
      <section className={`${glassPanel} p-8`}>
        <h1 className={`font-display text-3xl font-bold ${gradientText}`}>Kulüp Yönetim Paneli</h1>
        <p className="mt-2 text-slate-600">Etkinlik oluştur, düzenle ve katılımcıları takip et.</p>
      </section>

      <section className={`${glassPanel} p-6`}>
        <h2 className="font-display mb-4 text-lg font-bold">Yeni etkinlik</h2>
        <PresidentEventForm />
      </section>

      <section>
        <h2 className="mb-4 font-display text-lg font-bold text-slate-800">
          Kulübünüzün etkinlikleri ({events.length})
        </h2>
        <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
          {events.map((event) => (
            <div key={event.id}>
              <PremiumEventCard event={event} />
              <Link
                href={`/events/${event.id}`}
                className="mt-2 inline-flex text-sm font-semibold text-campus-600 hover:underline"
              >
                Katılımcı listesi →
              </Link>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
