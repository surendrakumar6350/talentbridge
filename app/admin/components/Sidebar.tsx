"use client";

import Link from "next/link";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { LoginDialog } from "@/components/LoginDialog";

export function AdminSidebar() {
  const [open, setOpen] = useState(false);
  return (
    <aside className="w-60 border-r border-border p-4">
      <div className="mb-6 font-semibold text-lg">Admin</div>
      <nav className="flex flex-col gap-2">
        <Link href="/admin" className="text-sm hover:text-primary">Dashboard</Link>
        <Link href="/admin/internships" className="text-sm hover:text-primary">Internships</Link>
        <Link href="/admin/applications" className="text-sm hover:text-primary">Applications</Link>
        <Link href="/admin/users" className="text-sm hover:text-primary">Users (TBD)</Link>
      </nav>
      <div className="mt-6">
        <Button onClick={() => setOpen(true)} variant="outline">Admin Login</Button>
        <LoginDialog isOpen={open} onClose={() => setOpen(false)} />
      </div>
    </aside>
  );
}
