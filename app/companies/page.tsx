"use client";

import { Header } from "@/components/header";
import { Building, Globe, Users, MapPin } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const companies = [
  { name: "TechCorp Solutions", industry: "Technology", location: "Bangalore", employees: "100-200" },
  { name: "InnovateTech", industry: "Software Development", location: "Mumbai", employees: "50-150" },
  { name: "DevWorks Inc", industry: "IT Services", location: "Delhi", employees: "200-500" },
  { name: "GreenEnergy Labs", industry: "Renewable Energy", location: "Pune", employees: "75-125" },
  { name: "FinEdge Analytics", industry: "Financial Technology", location: "Hyderabad", employees: "150-300" },
  { name: "HealthSync", industry: "Healthcare Technology", location: "Chennai", employees: "300-600" },
  { name: "CloudNova", industry: "Cloud Computing", location: "Remote", employees: "500-1000" },
  { name: "AeroDynamics", industry: "Aerospace Engineering", location: "Bangalore", employees: "250-400" },
  { name: "UrbanSpaces", industry: "Real Estate", location: "Gurgaon", employees: "100-250" },
  { name: "DataForge", industry: "Data Analytics", location: "Mumbai", employees: "400-800" },
  { name: "BrightMedia", industry: "Digital Media", location: "Noida", employees: "80-180" },
  { name: "QuantumLeap", industry: "Quantum Computing", location: "Bangalore", employees: "600-1200" },
];

export default function CompaniesPage() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Header />
      <main className="container mx-auto px-6 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Partner Companies</h1>
          <p className="text-muted-foreground">Explore companies that post internships on TalentBridge</p>
        </div>
        
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {companies.map((company, i) => (
            <Card key={i}>
              <CardHeader className="pb-3">
                <div className="h-14 w-14 rounded-md bg-primary/20 flex items-center justify-center mb-2">
                  <Building className="h-8 w-8 text-primary" />
                </div>
                <CardTitle>{company.name}</CardTitle>
                <CardDescription className="flex items-center gap-1">
                  <Globe className="h-3.5 w-3.5" /> 
                  {company.industry}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                  <MapPin className="h-4 w-4" />
                  {company.location}
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
                  <Users className="h-4 w-4" />
                  {company.employees} employees
                </div>
                {/* Openings temporarily hidden — re-enable when feature is ready */}
                <Button className="w-full" disabled>
                  Openings hidden
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </main>
    </div>
  );
}