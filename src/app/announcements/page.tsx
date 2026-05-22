import { AnnouncementService } from "@/lib/services/announcement.service";
import { Badge } from "@/components/ui/Badge";
import { glassPanel, gradientText } from "@/components/ui/styles";

export default async function AnnouncementsPage() {
  const service = new AnnouncementService();
  const announcements = await service.listActive();

  return (
    <div className="animate-fade-in space-y-8">
      <section className={`${glassPanel} p-8`}>
        <h1 className={`font-display text-3xl font-bold ${gradientText}`}>Duyurular</h1>
        <p className="mt-2 text-slate-600">Kulüplerden son haberler ve etkinlik güncellemeleri</p>
      </section>

      <div className="space-y-4">
        {announcements.map((a) => (
          <article
            key={a.id}
            className={`${glassPanel} overflow-hidden transition hover:shadow-xl`}
          >
            <div className="h-1.5 bg-gradient-to-r from-campus-500 via-violet-500 to-fuchsia-500" />
            <div className="p-6">
              <div className="flex flex-wrap items-center gap-2">
                <Badge variant="brand">{a.club.name}</Badge>
                <span className="text-xs text-slate-400">
                  {new Date(a.createdAt).toLocaleString("tr-TR")}
                </span>
              </div>
              <h2 className="mt-3 font-display text-xl font-bold text-slate-900">{a.title}</h2>
              <p className="mt-2 leading-relaxed text-slate-600">{a.content}</p>
            </div>
          </article>
        ))}
        {announcements.length === 0 && (
          <div className={`${glassPanel} py-16 text-center text-slate-500`}>Aktif duyuru yok.</div>
        )}
      </div>
    </div>
  );
}
