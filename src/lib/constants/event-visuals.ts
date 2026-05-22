export const EVENT_CATEGORIES = [
  "Tümü",
  "Teknoloji",
  "Kariyer",
  "Sanat",
  "Spor",
  "Sosyal",
  "Atölye",
] as const;

export type EventCategory = (typeof EVENT_CATEGORIES)[number];

export const COVER_GRADIENTS: Record<string, string> = {
  aurora: "from-violet-600 via-fuchsia-500 to-orange-400",
  ocean: "from-cyan-500 via-blue-600 to-indigo-700",
  sunset: "from-rose-500 via-orange-500 to-amber-400",
  forest: "from-emerald-500 via-teal-600 to-cyan-700",
  midnight: "from-slate-800 via-indigo-900 to-violet-900",
  coral: "from-pink-500 via-rose-500 to-red-500",
  lime: "from-lime-400 via-green-500 to-emerald-600",
  grape: "from-purple-600 via-violet-600 to-indigo-600",
};

export function getCoverGradient(key: string) {
  return COVER_GRADIENTS[key] ?? COVER_GRADIENTS.aurora;
}
