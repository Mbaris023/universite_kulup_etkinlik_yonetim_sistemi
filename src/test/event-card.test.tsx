import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { PremiumEventCard } from "@/components/events/PremiumEventCard";

describe("PremiumEventCard", () => {
  it("etkinlik bilgilerini listeler", () => {
    render(
      <PremiumEventCard
        event={{
          id: "1",
          clubId: "club-1",
          title: "React Atölyesi",
          description: "Modern React",
          location: "B201",
          category: "Teknoloji",
          coverKey: "aurora",
          startTime: new Date("2030-01-15T10:00:00Z").toISOString(),
          quota: 30,
          status: "ACTIVE",
          clubName: "Yazılım Kulübü",
          activeEnrollmentCount: 5,
          isFull: false,
          isPast: false,
          spotsLeft: 25,
          occupancyPercent: 17,
        }}
      />,
    );

    expect(screen.getByText("React Atölyesi")).toBeInTheDocument();
    expect(screen.getByText("Yazılım Kulübü")).toBeInTheDocument();
    expect(screen.getByText(/5 \/ 30/)).toBeInTheDocument();
  });
});
