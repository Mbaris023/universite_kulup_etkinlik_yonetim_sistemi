"use client";

import { useEffect, useState } from "react";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";

type ClubRow = {
  id: string;
  name: string;
  description: string;
  status: string;
  president: { name: string; email: string };
};

export default function AdminClubsPage() {
  const [clubs, setClubs] = useState<ClubRow[]>([]);

  async function load() {
    const res = await fetch("/api/admin/clubs");
    const data = await res.json();
    if (res.ok) setClubs(data.clubs);
  }

  useEffect(() => {
    load();
  }, []);

  async function deactivate(id: string) {
    await fetch(`/api/admin/clubs/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: "INACTIVE" }),
    });
    load();
  }

  return (
    <div>
      <h1 className="mb-6 text-2xl font-bold">Kulüp Yönetimi</h1>
      <div className="space-y-4">
        {clubs.map((club) => (
          <Card key={club.id}>
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div>
                <h2 className="text-lg font-semibold">{club.name}</h2>
                <p className="mt-1 text-sm text-slate-600">{club.description}</p>
                <p className="mt-2 text-sm">
                  Başkan: {club.president.name} ({club.president.email})
                </p>
                <p className="text-sm text-slate-500">Durum: {club.status}</p>
              </div>
              {club.status === "ACTIVE" && (
                <Button variant="danger" onClick={() => deactivate(club.id)}>
                  Pasifleştir
                </Button>
              )}
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
