"use client";

import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
  DialogDescription,
  DialogClose,
} from "@/components/ui/dialog";

type Internship = {
  _id?: string;
  title: string;
  company: string;
  description: string;
};

export default function AdminInternshipsPage() {
  const [items, setItems] = useState<Internship[]>([]);
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [title, setTitle] = useState("");
  const [company, setCompany] = useState("");
  const [description, setDescription] = useState("");
  const [location, setLocation] = useState("");
  const [stipend, setStipend] = useState("");
  const [skillsRequired, setSkillsRequired] = useState("");
  const [lastDateToApply, setLastDateToApply] = useState("");
  const [postedBy, setPostedBy] = useState("");

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

  async function seed() {
    setLoading(true);
    try {
      const res = await fetch("/api/seed/internships", { method: "POST" });
      if (!res.ok) throw new Error("Seed failed");
      await load();
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  async function create(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    try {
      const payload = {
        title,
        company,
        description,
        location,
        stipend,
        skillsRequired: skillsRequired.split(",").map((s) => s.trim()).filter(Boolean),
        lastDateToApply: lastDateToApply ? new Date(lastDateToApply).toISOString() : undefined,
        postedBy,
      };
      const res = await fetch("/api/internships", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) });
      if (!res.ok) throw new Error("Create failed");
      setTitle(""); setCompany(""); setDescription(""); setShowForm(false);
      setLocation(""); setStipend(""); setSkillsRequired(""); setLastDateToApply(""); setPostedBy("");
      await load();
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div>
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold mb-4">Manage Internships</h2>
        <div className="flex items-center gap-3">
          <Button onClick={seed} disabled={loading}>Seed Data</Button>
          <Dialog>
            <DialogTrigger>
              <Button variant="outline">Add Internship</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add Internship</DialogTitle>
                <DialogDescription>Fill the fields below to create a new internship.</DialogDescription>
              </DialogHeader>
              <form onSubmit={create} className="grid gap-2">
                <input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Title" className="input" required />
                <input value={company} onChange={(e) => setCompany(e.target.value)} placeholder="Company" className="input" required />
                <input value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Description" className="input" required />
                <input value={location} onChange={(e) => setLocation(e.target.value)} placeholder="Location" className="input" />
                <input value={stipend} onChange={(e) => setStipend(e.target.value)} placeholder="Stipend" className="input" />
                <input value={skillsRequired} onChange={(e) => setSkillsRequired(e.target.value)} placeholder="Skills (comma separated)" className="input" />
                <input value={lastDateToApply} onChange={(e) => setLastDateToApply(e.target.value)} placeholder="Last date to apply (YYYY-MM-DD)" type="date" className="input" />
                <input value={postedBy} onChange={(e) => setPostedBy(e.target.value)} placeholder="Posted by (email)" className="input" />
                <DialogFooter>
                  <DialogClose asChild>
                    <Button variant="outline">Cancel</Button>
                  </DialogClose>
                  <Button type="submit" disabled={loading}>Create</Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </div>
      {loading && <div>Loading...</div>}
      {showForm && (
        <form onSubmit={create} className="mb-6 grid gap-2 sm:grid-cols-3">
          <input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Title" className="input" />
          <input value={company} onChange={(e) => setCompany(e.target.value)} placeholder="Company" className="input" />
          <input value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Short description" className="input" />
          <div className="sm:col-span-3">
            <Button type="submit" disabled={loading}>Create</Button>
          </div>
        </form>
      )}
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
