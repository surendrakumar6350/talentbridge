"use client";

import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

type Props = {
  internshipId: string;
  onClose?: () => void;
  onSuccess?: (data: unknown) => void;
};

export default function ApplyModal({ internshipId, onClose, onSuccess }: Props) {
  const [resumeLink, setResumeLink] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/applications", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ internshipId, resumeLink, message }),
      });
      const data = await res.json();
      if (!res.ok) {
        if (res.status === 409) throw new Error(data.error || "You have already applied to this internship.");
        throw new Error(data.error || "Failed");
      }
      onSuccess?.(data);
      onClose?.();
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : String(err);
      setError(message || "Error");
    } finally {
      setLoading(false);
    }
  }

  return (
    <Dialog open onOpenChange={(open) => { if (!open) onClose?.(); }}>
      <DialogContent>
        <form onSubmit={submit}>
          <DialogHeader>
            <DialogTitle>Apply to this internship</DialogTitle>
          </DialogHeader>

          <div className="grid gap-2">
            <div>
              <Label>Resume link (optional)</Label>
              <Input value={resumeLink} onChange={(e) => setResumeLink(e.target.value)} placeholder="https://" />
            </div>

            <div>
              <Label>Message (optional)</Label>
              <textarea
                className="min-h-[80px] w-full rounded-md border bg-transparent px-3 py-2 text-sm shadow-xs"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
              />
            </div>

            {error && <div className="text-sm text-destructive">{error}</div>}
          </div>

          <DialogFooter>
            <div className="flex gap-2">
              <Button variant="outline" type="button" onClick={() => onClose?.()}>Cancel</Button>
              <Button type="submit" disabled={loading}>{loading ? "Applying..." : "Apply"}</Button>
            </div>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
