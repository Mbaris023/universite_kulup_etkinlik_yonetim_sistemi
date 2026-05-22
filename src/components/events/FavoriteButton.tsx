"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export function FavoriteButton({
  eventId,
  initialFavorited,
  size = "md",
}: {
  eventId: string;
  initialFavorited: boolean;
  size?: "sm" | "md";
}) {
  const router = useRouter();
  const [favorited, setFavorited] = useState(initialFavorited);
  const [loading, setLoading] = useState(false);

  async function toggle(e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();
    setLoading(true);
    const method = favorited ? "DELETE" : "POST";
    const res = await fetch(`/api/events/${eventId}/favorite`, { method });
    setLoading(false);
    if (res.ok) {
      setFavorited(!favorited);
      router.refresh();
    }
  }

  const sizeClass = size === "sm" ? "h-9 w-9" : "h-11 w-11";

  return (
    <button
      type="button"
      onClick={toggle}
      disabled={loading}
      aria-label={favorited ? "Favorilerden çıkar" : "Favorilere ekle"}
      className={`${sizeClass} flex shrink-0 items-center justify-center rounded-full border border-white/40 bg-black/20 text-white backdrop-blur-md transition hover:scale-110 hover:bg-black/35 disabled:opacity-60`}
    >
      <svg
        className={`h-5 w-5 transition ${favorited ? "fill-rose-400 text-rose-400" : "fill-transparent"}`}
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={2}
      >
        <path d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
      </svg>
    </button>
  );
}
