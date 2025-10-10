"use client";

import Link from "next/link";
import { Briefcase } from "lucide-react";
import { ThemeToggle } from "@/components/theme-toggle";
import { Button } from "@/components/ui/button";
import { LoginDialog } from "@/components/LoginDialog";
import { useState } from "react";

export function Header() {
  const [open, setOpen] = useState(false);
  return (
    <header className="w-full border-b border-border bg-card/80 backdrop-blur sticky top-0 z-30">
      <div className="flex items-center justify-between py-3 px-6">
        <Link href="/" className="flex items-center gap-2 font-semibold text-lg text-primary">
          <Briefcase className="h-6 w-6" />
          TalentBridge
        </Link>
        <div className="flex items-center gap-4">
          <nav className="hidden md:flex items-center gap-4">
            <Link href="/" className="text-sm font-medium hover:text-primary">
              Home
            </Link>
            <Link href="/internships" className="text-sm font-medium hover:text-primary">
              Internships
            </Link>
            <Link href="/companies" className="text-sm font-medium hover:text-primary">
              Companies
            </Link>
          </nav>
          <ThemeToggle variant="outline" />
          <Button variant="outline" onClick={() => setOpen(true)}>Login</Button>
          <LoginDialog isOpen={open} onClose={() => setOpen(false)} />
        </div>
      </div>
    </header>
  );
}