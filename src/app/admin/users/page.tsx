"use client";

import { useEffect, useState } from "react";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Alert } from "@/components/ui/Alert";

type UserRow = {
  id: string;
  name: string;
  email: string;
  role: string;
  status: string;
};

export default function AdminUsersPage() {
  const [users, setUsers] = useState<UserRow[]>([]);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  async function load() {
    const res = await fetch("/api/admin/users");
    const data = await res.json();
    if (res.ok) setUsers(data.users);
    else setError(data.message);
  }

  useEffect(() => {
    load();
  }, []);

  async function deactivate(id: string) {
    const res = await fetch(`/api/admin/users/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: "INACTIVE" }),
    });
    const data = await res.json();
    if (!res.ok) {
      setError(data.message);
      return;
    }
    setMessage("Kullanıcı pasifleştirildi.");
    load();
  }

  return (
    <div>
      <h1 className="mb-6 text-2xl font-bold">Kullanıcı Yönetimi</h1>
      {message && <Alert message={message} type="success" />}
      {error && <Alert message={error} />}
      <Card>
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b text-left text-slate-500">
              <th className="py-2">Ad</th>
              <th>E-posta</th>
              <th>Rol</th>
              <th>Durum</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {users.map((u) => (
              <tr key={u.id} className="border-b border-slate-100">
                <td className="py-3">{u.name}</td>
                <td>{u.email}</td>
                <td>{u.role}</td>
                <td>{u.status}</td>
                <td>
                  {u.status === "ACTIVE" && (
                    <Button variant="danger" onClick={() => deactivate(u.id)}>
                      Pasifleştir
                    </Button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>
    </div>
  );
}
