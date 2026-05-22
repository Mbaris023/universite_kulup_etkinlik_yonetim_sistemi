"use client";

import { useMemo, useState } from "react";
import { EVENT_CATEGORIES } from "@/lib/constants/event-visuals";
import { PremiumEventCard } from "@/components/events/PremiumEventCard";
import { glassPanel, gradientText, chipActive, chipInactive } from "@/components/ui/styles";
import type { EventListItem } from "@/types";

export function EventExplorer({
  events,
  showFavorite,
  title = "Etkinlikleri Keşfet",
}: {
  events: EventListItem[];
  showFavorite?: boolean;
  title?: string;
}) {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("Tümü");
  const [sort, setSort] = useState<"date" | "popular">("date");

  const filtered = useMemo(() => {
    let list = [...events];
    if (category !== "Tümü") {
      list = list.filter((e) => e.category === category);
    }
    if (query.trim()) {
      const q = query.toLowerCase();
      list = list.filter(
        (e) =>
          e.title.toLowerCase().includes(q) ||
          e.clubName.toLowerCase().includes(q) ||
          e.location.toLowerCase().includes(q),
      );
    }
    if (sort === "popular") {
      list.sort((a, b) => b.activeEnrollmentCount - a.activeEnrollmentCount);
    } else {
      list.sort((a, b) => new Date(a.startTime).getTime() - new Date(b.startTime).getTime());
    }
    return list;
  }, [events, category, query, sort]);

  const stats = useMemo(
    () => ({
      total: events.length,
      open: events.filter((e) => !e.isPast && !e.isFull).length,
      enrolled: events.filter((e) => e.isEnrolled).length,
      favorites: events.filter((e) => e.isFavorited).length,
    }),
    [events],
  );

  return (
    <div className="animate-fade-in space-y-8">
      <section className={`${glassPanel} relative overflow-hidden p-8 md:p-10`}>
        <div className="pointer-events-none absolute -right-20 -top-20 h-64 w-64 rounded-full bg-gradient-to-br from-violet-400/30 to-fuchsia-400/20 blur-3xl" />
        <div className="relative">
          <p className="text-sm font-semibold uppercase tracking-widest text-campus-600">CampusPulse</p>
          <h1 className="font-display mt-2 text-3xl font-bold tracking-tight md:text-4xl">
            <span className={gradientText}>{title}</span>
          </h1>
          <p className="mt-3 max-w-2xl text-slate-600">
            {stats.total} yaklaşan etkinlik · {stats.open} kayıt açık
            {showFavorite && stats.favorites > 0 && ` · ${stats.favorites} favori`}
            {showFavorite && stats.enrolled > 0 && ` · ${stats.enrolled} kayıtlı`}
          </p>
        </div>
      </section>

      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="relative flex-1">
          <SearchIcon className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
          <input
            type="search"
            placeholder="Etkinlik, kulüp veya konum ara..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full rounded-2xl border border-slate-200/80 bg-white/90 py-3.5 pl-12 pr-4 text-sm shadow-sm outline-none ring-campus-500/0 transition focus:border-campus-300 focus:ring-4 focus:ring-campus-500/15"
          />
        </div>
        <select
          value={sort}
          onChange={(e) => setSort(e.target.value as "date" | "popular")}
          className="rounded-2xl border border-slate-200/80 bg-white/90 px-4 py-3.5 text-sm font-medium text-slate-700 shadow-sm outline-none focus:border-campus-300"
        >
          <option value="date">Tarihe göre</option>
          <option value="popular">Popülerliğe göre</option>
        </select>
      </div>

      <div className="flex flex-wrap gap-2">
        {EVENT_CATEGORIES.map((cat) => (
          <button
            key={cat}
            type="button"
            onClick={() => setCategory(cat)}
            className={category === cat ? chipActive : chipInactive}
          >
            {cat}
          </button>
        ))}
      </div>

      {filtered.length > 0 ? (
        <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
          {filtered.map((event, i) => (
            <div key={event.id} className="animate-slide-up" style={{ animationDelay: `${i * 40}ms` }}>
              <PremiumEventCard event={event} showFavorite={showFavorite} />
            </div>
          ))}
        </div>
      ) : (
        <div className={`${glassPanel} py-16 text-center`}>
          <p className="text-lg font-semibold text-slate-700">Etkinlik bulunamadı</p>
          <p className="mt-2 text-sm text-slate-500">Filtreleri değiştirmeyi deneyin.</p>
        </div>
      )}
    </div>
  );
}

function SearchIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
    </svg>
  );
}
