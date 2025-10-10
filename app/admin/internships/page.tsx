"use client";

import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

type Internship = {
  _id?: string;
  title: string;
  company: string;
  description: string;
};

export default function AdminInternshipsPage() {
  const [items, setItems] = useState<Internship[]>([]);
  const [loading, setLoading] = useState(false);

  async function load() {
    setLoading(true);
    try {
      const res = await fetch("/api/internships");
      const j = await res.json();
      setItems(j.data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { load(); }, []);

  async function remove(id?: string) {
    if (!id) return;
    setLoading(true);
    try {
      const res = await fetch(`/api/internships/${id}`, { method: "DELETE" });
      if (res.ok) await load();
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">Manage Internships</h2>
      {loading && <div>Loading...</div>}
      <div className="grid gap-4">
        {items.map((it) => (
          <Card key={it._id || it.title}>
            <CardContent className="flex items-center justify-between">
              <div>
                <div className="font-semibold">{it.title}</div>
                <div className="text-sm text-muted-foreground">{it.company}</div>
              </div>
              <div className="flex gap-2">
                <Button variant="destructive" onClick={() => remove(it._id)}>Delete</Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
