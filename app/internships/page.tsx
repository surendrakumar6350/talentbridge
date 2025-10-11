"use client";

import { useEffect, useState, useCallback } from "react";
import { Header } from "@/components/header";
import ApplyModal from "@/components/ApplyModal";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

type Internship = {
  _id?: string;
  title: string;
  company: string;
  description: string;
  location?: string;
  stipend?: string;
  skillsRequired?: string[];
};

type Application = {
  _id?: string;
  internship?: { _id?: string } | string;
  status?: string;
};

export default function InternshipsPage() {
  const [internships, setInternships] = useState<Internship[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [appliedIds, setAppliedIds] = useState<Set<string>>(new Set());
  const [applicationStatusMap, setApplicationStatusMap] = useState<Record<string, string>>({});

  // Simple create form state
  const [applyingTo, setApplyingTo] = useState<string | null>(null);

  const fetchUserApplications = useCallback(async () => {
    try {
      const res = await fetch("/api/applications");
      if (!res.ok) {
        setAppliedIds(new Set());
        setApplicationStatusMap({});
        return;
      }
      const j = await res.json();
      const apps: Application[] = j.applications || [];
      const ids = new Set<string>();
      const statusMap: Record<string, string> = {};
      for (const a of apps) {
        const internship = a.internship;
        const id = internship && typeof internship === "object" ? internship._id : internship;
        if (id) ids.add(String(id));
        if (id && a.status) statusMap[String(id)] = a.status;
      }
      setAppliedIds(ids);
      setApplicationStatusMap(statusMap);
    } catch {
      setAppliedIds(new Set());
      setApplicationStatusMap({});
    }
  }, []);


  const fetchInternships = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/internships");
      if (!res.ok) throw new Error("Failed to fetch");
      const data = await res.json();
      setInternships(data.data || []);
      // After fetching internships, refresh user's applications so we can mark applied ones
      await fetchUserApplications();
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : String(err);
      setError(message);
    } finally {
      setLoading(false);
    }
  }, [fetchUserApplications]);

  // remove duplicate - using the useCallback version above

  useEffect(() => {
    fetchInternships();
  }, [fetchInternships]);

  // (Seed and create actions moved to admin.)

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Header />
      <main className="container mx-auto px-6 py-8">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2">Available Internships</h1>
            <p className="text-muted-foreground">Browse and apply for opportunities that match your skills</p>
          </div>
          <div className="flex items-center gap-3">
            {/* Seed / Add controls moved to admin panel */}
          </div>
        </div>
        {/* form moved to admin management UI */}

        {error && <div className="text-red-500 mb-4">{error}</div>}

        <div className="flex flex-col gap-6">
          {loading ? (
            // skeleton list: show 4 placeholders that match Card layout
            Array.from({ length: 4 }).map((_, i) => (
              <Card key={`skeleton-${i}`}>
                <CardContent className="p-6">
                  <div className="animate-pulse">
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <div className="h-6 w-16 bg-muted/30 rounded" />
                          <div className="h-6 w-12 bg-muted/30 rounded" />
                        </div>
                        <div className="h-6 w-3/4 bg-muted/30 rounded mb-2" />
                        <div className="h-4 w-1/3 bg-muted/30 rounded mb-3" />
                        <div className="space-y-2">
                          <div className="h-3 bg-muted/30 rounded" />
                          <div className="h-3 bg-muted/30 rounded w-5/6" />
                        </div>
                      </div>
                      <div className="mt-4 md:mt-0">
                        <div className="h-10 w-28 bg-muted/30 rounded" />
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          ) : (
            internships.map((it) => (
              <Card key={it._id || it.title}>
                <CardContent className="p-6">
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                    <div>
                      <div className="flex items-center gap-3 mb-2">
                        <Badge variant="secondary">{it.skillsRequired?.[0] ?? "Role"}</Badge>
                        <Badge variant="outline">{it.location ?? "Remote"}</Badge>
                      </div>
                      <h2 className="text-xl font-semibold">{it.title}</h2>
                      <p className="text-muted-foreground text-sm mt-1">{it.company}</p>
                      <div className="mt-3">
                        <p className="text-sm">{it.description}</p>
                        {it.stipend && <p className="mt-2"><span className="font-medium">Stipend:</span> {it.stipend}</p>}
                      </div>
                    </div>
                    {appliedIds.has(it._id || "") ? (
                      // show status badge when available
                      applicationStatusMap[it._id || ""] ? (
                        <Badge variant={applicationStatusMap[it._id || ""] === "accepted" ? "secondary" : applicationStatusMap[it._id || ""] === "rejected" ? "destructive" : "outline"} className="whitespace-nowrap">
                          {applicationStatusMap[it._id || ""]}
                        </Badge>
                      ) : (
                        <Button className="whitespace-nowrap" disabled>Applied</Button>
                      )
                    ) : (
                      <Button className="whitespace-nowrap" onClick={() => setApplyingTo(it._id || null)}>Apply Now</Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))
          )}
          {applyingTo && (
            <ApplyModal internshipId={applyingTo} onClose={() => setApplyingTo(null)} onSuccess={() => {
              // refresh list
              fetchInternships();
            }} />
          )}
        </div>
      </main>
    </div>
  );
}