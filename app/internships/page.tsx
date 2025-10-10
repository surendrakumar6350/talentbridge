"use client";

import { useEffect, useState } from "react";
import { Header } from "@/components/header";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

type Internship = {
  _id?: string;
  title: string;
  company: string;
  description: string;
  location?: string;
  stipend?: string;
  skillsRequired?: string[];
};

export default function InternshipsPage() {
  const [internships, setInternships] = useState<Internship[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Simple create form state
  const [showForm, setShowForm] = useState(false);
  const [title, setTitle] = useState("");
  const [company, setCompany] = useState("");
  const [description, setDescription] = useState("");

  async function fetchInternships() {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/internships");
      if (!res.ok) throw new Error("Failed to fetch");
      const data = await res.json();
      setInternships(data.data || []);
    } catch (err: any) {
      setError(err.message || String(err));
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchInternships();
  }, []);

  async function seed() {
    setLoading(true);
    try {
      const res = await fetch("/api/seed/internships", { method: "POST" });
      if (!res.ok) throw new Error("Seed failed");
      await fetchInternships();
    } catch (err: any) {
      setError(err.message || String(err));
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
    } catch (err: any) {
      setError(err.message || String(err));
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
                  <Button className="whitespace-nowrap">Apply Now</Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </main>
    </div>
  );
}