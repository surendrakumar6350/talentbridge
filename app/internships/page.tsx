"use client";

import { Header } from "@/components/header";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export default function InternshipsPage() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Header />
      <main className="container mx-auto px-6 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Available Internships</h1>
          <p className="text-muted-foreground">Browse and apply for opportunities that match your skills</p>
        </div>
        
        <div className="flex flex-col gap-6">
          {[1, 2, 3, 4, 5].map((i) => (
            <Card key={i}>
              <CardContent className="p-6">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-3 mb-2">
                      <Badge variant={i % 3 === 0 ? "default" : i % 3 === 1 ? "secondary" : "outline"}>
                        {i % 3 === 0 ? "Frontend" : i % 3 === 1 ? "Backend" : "Full Stack"}
                      </Badge>
                      <Badge variant="outline">{i % 2 === 0 ? "Remote" : "Hybrid"}</Badge>
                    </div>
                    <h2 className="text-xl font-semibold">{
                      i % 3 === 0 ? "UI/UX Developer Intern" : 
                      i % 3 === 1 ? "Backend Engineer Intern" : 
                      "Full Stack Developer Intern"
                    }</h2>
                    <p className="text-muted-foreground text-sm mt-1">
                      {i % 3 === 0 ? "TechCorp Solutions" : i % 3 === 1 ? "InnovateTech" : "DevWorks Inc"}
                    </p>
                    <div className="mt-3">
                      <p><span className="font-medium">Duration:</span> {i % 2 === 0 ? "3 months" : "6 months"}</p>
                      <p><span className="font-medium">Stipend:</span> ₹{(10 + i * 2)}k per month</p>
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