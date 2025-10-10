"use client";

import { useState } from "react";

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
      if (!res.ok) throw new Error(data.error || "Failed");
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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="w-full max-w-md rounded bg-white p-6 shadow-lg">
        <h3 className="mb-4 text-lg font-semibold">Apply to this internship</h3>
        <form onSubmit={submit}>
          <label className="mb-2 block text-sm">Resume link (optional)</label>
          <input className="mb-3 w-full rounded border px-3 py-2" value={resumeLink} onChange={(e) => setResumeLink(e.target.value)} />
          <label className="mb-2 block text-sm">Message (optional)</label>
          <textarea className="mb-3 w-full rounded border p-2" value={message} onChange={(e) => setMessage(e.target.value)} />

          {error && <div className="mb-3 text-sm text-red-600">{error}</div>}

          <div className="flex justify-end gap-2">
            <button type="button" className="rounded border px-3 py-1" onClick={() => onClose?.()}>Cancel</button>
            <button type="submit" disabled={loading} className="rounded bg-blue-600 px-3 py-1 text-white">
              {loading ? "Applying..." : "Apply"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
