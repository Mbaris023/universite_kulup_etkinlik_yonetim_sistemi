"use client";

import { useEffect, useState } from "react";
import { Card } from "@/components/ui/Card";
import type { ReportSummary } from "@/types";

export default function AdminReportsPage() {
  const [summary, setSummary] = useState<ReportSummary | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch("/api/reports/summary")
      .then((r) => r.json())
      .then((data) => {
        if (data.summary) setSummary(data.summary);
        else setError(data.message ?? "Rapor yüklenemedi.");
      })
      .catch(() => setError("Bağlantı hatası."));
  }, []);

  if (error) return <p className="text-red-600">{error}</p>;
  if (!summary) return <p className="text-slate-500">Yükleniyor...</p>;

  return (
    <div>
      <h1 className="mb-6 text-2xl font-bold">Yönetim Raporları</h1>
      <div className="mb-8 grid gap-4 sm:grid-cols-3">
        <Card>
          <p className="text-sm text-slate-500">Toplam Etkinlik</p>
          <p className="text-3xl font-bold">{summary.totalEvents}</p>
        </Card>
        <Card>
          <p className="text-sm text-slate-500">Toplam Katılımcı</p>
          <p className="text-3xl font-bold">{summary.totalActiveEnrollments}</p>
        </Card>
        <Card>
          <p className="text-sm text-slate-500">Ortalama Doluluk</p>
          <p className="text-3xl font-bold">%{summary.averageOccupancyRate}</p>
        </Card>
      </div>
      <Card title="Kulüp Bazlı Özet">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="border-b text-slate-500">
              <th className="py-2">Kulüp</th>
              <th>Etkinlik</th>
              <th>Katılımcı</th>
              <th>Doluluk</th>
            </tr>
          </thead>
          <tbody>
            {summary.eventsByClub.map((row) => (
              <tr key={row.clubName} className="border-b border-slate-100">
                <td className="py-3 font-medium">{row.clubName}</td>
                <td>{row.eventCount}</td>
                <td>{row.enrollmentCount}</td>
                <td>%{row.occupancyRate}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>
    </div>
  );
}
