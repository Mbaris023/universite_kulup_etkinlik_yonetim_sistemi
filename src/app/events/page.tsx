import { getSessionUser } from "@/lib/auth/session";
import { EventService } from "@/lib/services/event.service";
import { EventExplorer } from "@/components/events/EventExplorer";

export default async function EventsPage() {
  const user = await getSessionUser();
  const eventService = new EventService();
  const events = await eventService.listUpcoming(user);

  return <EventExplorer events={events} showFavorite={user?.role === "STUDENT"} />;
}
