"use client";

import Link from "next/link";
import { ArrowRight, Briefcase, GraduationCap, Building } from "lucide-react";
import { useEffect, useState, useCallback } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Header } from "@/components/header";
import ApplyModal from "@/components/ApplyModal";
// note: no search input here — single CTA only per design

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

export default function Home() {
  const [featured, setFeatured] = useState<Internship[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [appliedIds, setAppliedIds] = useState<Set<string>>(new Set());
  const [applicationStatusMap, setApplicationStatusMap] = useState<Record<string, string>>({});
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

  const fetchFeatured = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/internships/featured");
      if (!res.ok) throw new Error("Failed to fetch featured internships");
      const data = await res.json();
      setFeatured(data.data || []);
      // After fetching featured internships, refresh user's applications so we can mark applied ones
      await fetchUserApplications();
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : String(err);
      setError(message);
    } finally {
      setLoading(false);
    }
  }, [fetchUserApplications]);

  useEffect(() => {
    fetchFeatured();
  }, [fetchFeatured]);

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Header />
      {error && (
        <div className="container mx-auto px-6 mt-4">
          <div className="rounded-md bg-red-50 border border-red-200 p-3 text-sm text-red-700">{error}</div>
        </div>
      )}
      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 -z-10 bg-gradient-to-b from-primary/10 to-transparent" />
        <div className="container mx-auto px-6 pt-20 pb-12">
          <div className="mx-auto max-w-7xl">
            <div className="relative overflow-hidden bg-card/70 backdrop-blur-sm rounded-2xl border p-6 md:p-10">
              {/* decorative shape */}
              <svg className="pointer-events-none absolute -right-10 -top-10 hidden w-48 opacity-20 md:block" viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg" aria-hidden>
                <path fill="currentColor" d="M42.4,-55.3C55.8,-46.9,68,-34.2,73.6,-18.1C79.2,-2,78.2,17.5,70.9,31.6C63.6,45.7,49.9,54.4,35.8,59.3C21.7,64.2,10.9,65.2,-1,67.1C-12.9,69,-25.8,71.8,-36.8,67.1C-47.7,62.5,-56.7,50.3,-62.2,36.6C-67.8,22.9,-69.8,7.7,-68.4,-7.1C-67.1,-21.9,-62.4,-36.9,-51.9,-45.7C-41.5,-54.5,-25.3,-57.1,-9.8,-56.6C5.6,-56.2,11.2,-52.7,42.4,-55.3Z" transform="translate(100 100)" />
              </svg>

              <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
                <div className="max-w-2xl">
                  <Badge className="mb-4">Now Accepting Applications</Badge>
                  <h1 className="text-4xl font-extrabold leading-tight sm:text-5xl">
                    Kickstart your career with the right opportunity
                  </h1>
                  <p className="mt-4 text-muted-foreground text-lg">
                    Find curated internships from top companies, tailored to your skills. Search roles, browse companies, and apply in a few clicks.
                  </p>

                  {/* Search + CTAs */}
                  <HeroActions />
                </div>

                {/* quick stats */}
                <div className="mt-6 md:mt-0 md:ml-8 flex-shrink-0 w-full md:w-56">
                  <div className="grid grid-cols-2 gap-3 sm:grid-cols-1 md:grid-cols-1">
                    <Stat label="Opportunities" value="1.2k+" />
                    <Stat label="Companies" value="350+" />
                    <Stat label="Active Applicants" value="45k+" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="container mx-auto px-6 py-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-3">
              <Briefcase className="h-5 w-5 text-primary" />
              Curated Internships
            </CardTitle>
            <CardDescription>Find the perfect match for your skills and interests</CardDescription>
          </CardHeader>
          <CardContent>
            Browse through hand-picked opportunities from top companies across various industries.
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-3">
              <GraduationCap className="h-5 w-5 text-primary" />
              Student Resources
            </CardTitle>
            <CardDescription>Get the support you need to succeed</CardDescription>
          </CardHeader>
          <CardContent>
            Access resume templates, interview guides, and career advice from industry professionals.
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-3">
              <Building className="h-5 w-5 text-primary" />
              Company Profiles
            </CardTitle>
            <CardDescription>Learn about potential employers</CardDescription>
          </CardHeader>
          <CardContent>
            Research company cultures, values, and growth opportunities before applying.
          </CardContent>
        </Card>
      </section>

  {/* Featured Internships */}
  <section className="bg-background py-12">
        <div className="container mx-auto px-6">
          <div className="mb-8 text-center">
            <h2 className="text-3xl font-semibold">Featured Opportunities</h2>
            <p className="mt-2 text-muted-foreground">Apply to these trending positions</p>
          </div>
          <div className="grid gap-6 md:grid-cols-3">
            {loading ? (
              // show 3 skeleton cards matching the card layout
              Array.from({ length: 3 }).map((_, i) => (
                <div key={`skeleton-${i}`} className="animate-pulse">
                  <div className="border rounded-lg p-6 bg-card">
                    <div className="h-4 w-24 bg-muted/30 dark:bg-muted/30 rounded mb-3" />
                    <div className="h-5 w-3/4 bg-muted/30 dark:bg-muted/30 rounded mb-2" />
                    <div className="h-3 w-1/2 bg-muted/30 dark:bg-muted/30 rounded mb-4" />
                    <div className="space-y-2">
                      <div className="h-3 bg-muted/30 dark:bg-muted/30 rounded" />
                      <div className="h-3 bg-muted/30 dark:bg-muted/30 rounded w-5/6" />
                    </div>
                    <div className="mt-4 h-8 w-32 bg-muted/30 dark:bg-muted/30 rounded" />
                  </div>
                </div>
              ))
            ) : (
              featured.map((it) => (
                <Card key={it._id || it.title}>
                  <CardHeader>
                    <Badge className="w-fit" variant="secondary">{it.skillsRequired?.[0] ?? "Role"}</Badge>
                    <CardTitle className="mt-2">{it.title}</CardTitle>
                    <CardDescription>{it.location ?? "Remote"} • {it.stipend ? `Stipend ${it.stipend}` : ""}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm">{it.description}</p>
                    <div className="mt-4">
                      {appliedIds.has(it._id || "") ? (
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
          </div>
          <div className="mt-8 text-center">
            <Button asChild variant="outline">
              <Link href="/internships">View All Opportunities</Link>
            </Button>
          </div>
        </div>
      </section>

      {applyingTo && (
        <ApplyModal internshipId={applyingTo} onClose={() => setApplyingTo(null)} onSuccess={() => {
          // refresh featured list and user applications
          fetchFeatured();
        }} />
      )}
    </div>
  );
}

function HeroActions() {
  return (
    <div className="mt-8 flex w-full items-center">
      <Button className="shadow-lg transform transition hover:-translate-y-0.5" size="lg" asChild>
        <Link href="/internships" aria-label="Browse Opportunities" className="inline-flex items-center gap-3 px-6 py-3">
          Browse Opportunities
          <ArrowRight className="h-4 w-4" />
        </Link>
      </Button>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg border bg-card px-4 py-3 text-center">
      <div className="text-xl font-semibold">{value}</div>
      <div className="text-sm text-muted-foreground">{label}</div>
    </div>
  );
}
