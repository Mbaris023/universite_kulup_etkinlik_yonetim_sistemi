/**
 * Factory Method: farklı bildirim türleri için mesaj üretimi.
 */
export type NotificationType =
  | "ENROLLMENT_SUCCESS"
  | "ENROLLMENT_CANCELLED"
  | "EVENT_CREATED"
  | "ANNOUNCEMENT_PUBLISHED";

export class NotificationFactory {
  static create(type: NotificationType, context: Record<string, string>): string {
    switch (type) {
      case "ENROLLMENT_SUCCESS":
        return `"${context.eventTitle}" etkinliğine kaydınız alındı.`;
      case "ENROLLMENT_CANCELLED":
        return `"${context.eventTitle}" etkinliği kaydınız iptal edildi.`;
      case "EVENT_CREATED":
        return `Kulübünüz "${context.eventTitle}" etkinliğini oluşturdu.`;
      case "ANNOUNCEMENT_PUBLISHED":
        return `Yeni duyuru: ${context.announcementTitle}`;
      default:
        return "Sistem bildirimi.";
    }
  }
}
