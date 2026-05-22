import { Badge } from "@/components/ui/Badge";
import type { EventListItem } from "@/types";

export function EventStatusBadge({ event }: { event: EventListItem }) {
  if (event.status === "CANCELLED") {
    return <Badge variant="danger">İptal edildi</Badge>;
  }
  if (event.isPast) {
    return <Badge variant="outline">Süresi doldu</Badge>;
  }
  if (event.isEnrolled) {
    return <Badge variant="success">Kayıtlısın</Badge>;
  }
  if (event.isFull) {
    return <Badge variant="warning">Kontenjan dolu</Badge>;
  }
  if ((event.spotsLeft ?? 0) <= 5) {
    return <Badge variant="warning">Son {event.spotsLeft} yer</Badge>;
  }
  return <Badge variant="brand">Kayıt açık</Badge>;
}
