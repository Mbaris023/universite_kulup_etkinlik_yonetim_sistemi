import { redirect } from "next/navigation";
import { getSessionUser } from "@/lib/auth/session";
import { FavoriteService } from "@/lib/services/favorite.service";
import { EventExplorer } from "@/components/events/EventExplorer";

export default async function FavoritesPage() {
  const user = await getSessionUser();
  if (!user || user.role !== "STUDENT") {
    redirect("/login");
  }

  const service = new FavoriteService();
  const favorites = await service.list(user);
  const events = favorites.map((f) => ({
    ...f.event,
    isFavorited: true,
  }));

  return (
    <EventExplorer
      events={events}
      showFavorite
      title="Favori Etkinliklerin"
    />
  );
}
