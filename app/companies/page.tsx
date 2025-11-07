"use client";

import { Header } from "@/components/header";
import { Building, Globe, Users, MapPin } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

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
          {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map((i) => (
            <Card key={i}>
              <CardHeader className="pb-3">
                <div className="h-14 w-14 rounded-md bg-primary/20 flex items-center justify-center mb-2">
                  <Building className="h-8 w-8 text-primary" />
                </div>
                <CardTitle>{
                  i === 1 ? "TechCorp Solutions" : 
                  i === 2 ? "InnovateTech" : 
                  i === 3 ? "DevWorks Inc" :
                  i === 4 ? "GreenEnergy Labs" :
                  i === 5 ? "FinEdge Analytics" :
                  i === 6 ? "HealthSync" :
                  i === 7 ? "CloudNova" :
                  i === 8 ? "AeroDynamics" :
                  i === 9 ? "UrbanSpaces" :
                  i === 10 ? "DataForge" :
                  i === 11 ? "BrightMedia" :
                  "QuantumLeap"
                }</CardTitle>
                <CardDescription className="flex items-center gap-1">
                  <Globe className="h-3.5 w-3.5" /> 
                  {i === 1 ? "Technology" : 
                   i === 2 ? "Software Development" : 
                   i === 3 ? "IT Services" :
                   i === 4 ? "Renewable Energy" :
                   i === 5 ? "Financial Technology" :
                   i === 6 ? "Healthcare Technology" :
                   i === 7 ? "Cloud Computing" :
                   i === 8 ? "Aerospace Engineering" :
                   i === 9 ? "Real Estate" :
                   i === 10 ? "Data Analytics" :
                   i === 11 ? "Digital Media" :
                   "Quantum Computing"}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                  <MapPin className="h-4 w-4" />
                  {i === 1 ? "Bangalore" : 
                   i === 2 ? "Mumbai" : 
                   i === 3 ? "Delhi" :
                   i === 4 ? "Pune" :
                   i === 5 ? "Hyderabad" :
                   i === 6 ? "Chennai" :
                   i === 7 ? "Remote" :
                   i === 8 ? "Bangalore" :
                   i === 9 ? "Gurgaon" :
                   i === 10 ? "Mumbai" :
                   i === 11 ? "Noida" :
                   "Bangalore"}
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
                  <Users className="h-4 w-4" />
                  {i === 1 ? "100-200" :
                   i === 2 ? "50-150" :
                   i === 3 ? "200-500" :
                   i === 4 ? "75-125" :
                   i === 5 ? "150-300" :
                   i === 6 ? "300-600" :
                   i === 7 ? "500-1000" :
                   i === 8 ? "250-400" :
                   i === 9 ? "100-250" :
                   i === 10 ? "400-800" :
                   i === 11 ? "80-180" :
                   "600-1200"} employees
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