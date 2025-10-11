"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

type User = { _id?: string; name?: string; email?: string; image?: string };
type Internship = { _id?: string; title?: string; company?: string };
type Application = {
  _id?: string;
  internship?: Internship | string;
  applicant?: User | string;
  name?: string;
  email?: string;
  resumeLink?: string;
  message?: string;
  status?: string;
  createdAt?: string;
};

export function AdminApplications({ preview = false }: { preview?: boolean }) {
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [updatingIds, setUpdatingIds] = useState<Record<string, boolean>>({});

  async function fetchApplications() {
    setLoading(true);
    setError(null);
    try {
  const res = await fetch("/api/admin/applications");
      if (!res.ok) {
        if (res.status === 401 || res.status === 403) throw new Error("Unauthorized: admin access required");
        throw new Error("Failed to fetch applications");
      }
      const j = await res.json();
      setApplications(j.applications || []);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : String(err));
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchApplications();
  }, []);

  async function updateStatus(id: string, status: "pending" | "accepted" | "rejected") {
    if (!id) return;
    setError(null);
    setUpdatingIds((s) => ({ ...s, [id]: true }));
    // optimistic update
    const prev = applications;
    setApplications((cur) => cur.map((c) => (c._id === id ? { ...c, status } : c)));
    try {
      const res = await fetch(`/api/applications/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body?.error || "Failed to update status");
      }
      const j = await res.json();
      // ensure we sync with server response if provided
      if (j?.application) {
        setApplications((cur) => cur.map((c) => (c._id === id ? j.application : c)));
      }
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : String(err));
      // rollback
      setApplications(prev);
    } finally {
      setUpdatingIds((s) => {
        const next = { ...s };
        delete next[id];
        return next;
      });
    }
  }

  function groupByInternship(apps: Application[]) {
    const map = new Map<string, { internship: Internship | null; apps: Application[] }>();
    for (const a of apps) {
      const internship = a.internship as Internship | undefined;
      const id = internship?._id ?? String(internship ?? "unknown");
      if (!map.has(id)) map.set(id, { internship: internship ?? null, apps: [] });
      map.get(id)!.apps.push(a);
    }
    return Array.from(map.values());
  }

  const groups = groupByInternship(preview ? applications.slice(0, 12) : applications);

  if (loading) return <div>Loading applications…</div>;
  if (error) return <div className="text-sm text-red-600">{error}</div>;
  if (groups.length === 0) return <div className="text-sm text-muted-foreground">No applications found.</div>;

  return (
    <div className="grid gap-4">
      {groups.map((g, idx) => (
        <Card key={idx}>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <div>
                <div className="text-sm font-semibold">{g.internship?.title ?? "(No title)"}</div>
                <div className="text-xs text-muted-foreground">{g.internship?.company ?? ""}</div>
              </div>
              <div className="text-xs text-muted-foreground">{g.apps.length} app{g.apps.length !== 1 ? "s" : ""}</div>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {g.apps.slice(0, preview ? 3 : 50).map((a) => (
                <div key={a._id} className="flex items-center justify-between gap-4 border-t pt-2">
                  <div>
                    <div className="text-sm font-medium">{a.name || a.email}</div>
                    <div className="text-xs text-muted-foreground">{a.email}</div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant={a.status === "accepted" ? "secondary" : a.status === "rejected" ? "destructive" : "outline"}>{a.status ?? "pending"}</Badge>
                    {a.resumeLink && (
                      <a href={a.resumeLink} target="_blank" rel="noreferrer" className="text-xs underline">Resume</a>
                    )}
                    {/* Status actions for admin: only show on admin pages (this component is used for admin) */}
                    <div className="flex items-center gap-1">
                      {a.status !== "accepted" && (
                        <button
                          className="text-xs px-2 py-1 rounded-md bg-green-600 text-white hover:bg-green-700"
                          onClick={async () => await updateStatus(a._id!, "accepted")}
                        >
                          Accept
                        </button>
                      )}
                      {a.status !== "rejected" && (
                        <button
                          className="text-xs px-2 py-1 rounded-md bg-red-600 text-white hover:bg-red-700"
                          onClick={async () => await updateStatus(a._id!, "rejected")}
                        >
                          Reject
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

export default AdminApplications;
