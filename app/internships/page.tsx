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
};

export default function InternshipsPage() {
  const [internships, setInternships] = useState<Internship[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [appliedIds, setAppliedIds] = useState<Set<string>>(new Set());

  // Simple create form state
  const [showForm, setShowForm] = useState(false);
  const [applyingTo, setApplyingTo] = useState<string | null>(null);
  const [title, setTitle] = useState("");
  const [company, setCompany] = useState("");
  const [description, setDescription] = useState("");

  const fetchUserApplications = useCallback(async () => {
    try {
      const res = await fetch("/api/applications");
      if (!res.ok) {
        setAppliedIds(new Set());
        return;
      }
      const j = await res.json();
      const apps: Application[] = j.applications || [];
      const ids = new Set<string>();
      for (const a of apps) {
        const internship = a.internship;
        const id = internship && typeof internship === "object" ? internship._id : internship;
        if (id) ids.add(String(id));
      }
      setAppliedIds(ids);
    } catch {
      setAppliedIds(new Set());
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

  async function seed() {
    setLoading(true);
    try {
      const res = await fetch("/api/seed/internships", { method: "POST" });
      if (!res.ok) throw new Error("Seed failed");
      await fetchInternships();
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : String(err);
      setError(message);
    } finally {
      setLoading(false);
    }
  }

  async function createInternship(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    try {
      const payload = { title, company, description };
      const res = await fetch("/api/internships", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) });
      if (!res.ok) throw new Error("Create failed");
      setTitle("");
      setCompany("");
      setDescription("");
      setShowForm(false);
      await fetchInternships();
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : String(err);
      setError(message);
    } finally {
      setLoading(false);
    }
  }

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
            <Button onClick={seed} disabled={loading}>Seed Data</Button>
            <Button variant="outline" onClick={() => setShowForm((s) => !s)}>{showForm ? "Cancel" : "Add Internship"}</Button>
          </div>
        </div>

        {showForm && (
          <form onSubmit={createInternship} className="mb-6 grid gap-2 sm:grid-cols-3">
            <input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Title" className="input" />
            <input value={company} onChange={(e) => setCompany(e.target.value)} placeholder="Company" className="input" />
            <input value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Short description" className="input" />
            <div className="sm:col-span-3">
              <Button type="submit" disabled={loading}>Create</Button>
            </div>
          </form>
        )}

        {error && <div className="text-red-500 mb-4">{error}</div>}

        <div className="flex flex-col gap-6">
          {loading && <div>Loading...</div>}
          {!loading && internships.map((it) => (
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
                    <Button className="whitespace-nowrap" disabled>Applied</Button>
                  ) : (
                    <Button className="whitespace-nowrap" onClick={() => setApplyingTo(it._id || null)}>Apply Now</Button>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
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