"use client";

import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

type User = { _id?: string; name: string; email: string; role?: string; image?: string; createdAt?: string };

export default function AdminUsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function load() {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/users");
      if (!res.ok) throw new Error("Failed to fetch users");
      const j = await res.json();
      setUsers(j.data || []);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : String(err);
      setError(message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { load(); }, []);

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">Users</h2>
      <div className="mb-4 flex items-center gap-2">
        <Button onClick={load} disabled={loading}>Refresh</Button>
      </div>

      {loading && <div>Loading users...</div>}
      {error && <div className="text-red-500">{error}</div>}

      <div className="grid gap-3">
        {users.map((u) => (
          <Card key={u._id || u.email}>
            <CardContent className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <img src={u.image || "/icon.png"} alt={u.name} className="h-10 w-10 rounded-full" />
                <div>
                  <div className="font-medium">{u.name}</div>
                  <div className="text-sm text-muted-foreground">{u.email}</div>
                </div>
              </div>
              <div className="text-sm text-muted-foreground">{u.role ?? "user"}</div>
              <div className="text-xs text-muted-foreground">{u.createdAt ? new Date(u.createdAt).toLocaleString() : "-"}</div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
