import { redirect } from "next/navigation";
import { getSessionUser } from "@/lib/auth/session";
import { EventService } from "@/lib/services/event.service";
import { EventExplorer } from "@/components/events/EventExplorer";

export default async function MyEventsPage() {
  const user = await getSessionUser();
  if (!user || user.role !== "STUDENT") {
    redirect("/login");
  }

  const service = new EventService();
  const events = await service.listEnrolled(user);

  return (
    <EventExplorer events={events} showFavorite title="Kayıtlı Etkinliklerim" />
  );
}
