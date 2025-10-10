"use client";

import Link from "next/link";
import { ArrowRight, Briefcase, GraduationCap, Building, Users } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Header } from "@/components/header";

export default function Home() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Header />
      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 -z-10 bg-gradient-to-b from-primary/10 to-transparent" />
        <div className="container mx-auto px-6 pt-20 pb-12">
          <div className="max-w-3xl">
            <Badge className="mb-4">Now Accepting Applications</Badge>
            <h1 className="mt-4 text-4xl font-semibold leading-tight sm:text-5xl">
              Kickstart your career with the right opportunity
            </h1>
            <p className="mt-4 text-muted-foreground max-w-2xl">
              Connect with top companies, apply for internships and full-time positions, and take the next step in your professional journey.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Button asChild size="lg">
                <Link href="/internships" className="inline-flex items-center gap-2">
                  Browse Opportunities
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg">
                <Link href="/login">Sign In</Link>
              </Button>
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
      <section className="bg-muted/50 py-12">
        <div className="container mx-auto px-6">
          <div className="mb-8 text-center">
            <h2 className="text-3xl font-semibold">Featured Opportunities</h2>
            <p className="mt-2 text-muted-foreground">Apply to these trending positions</p>
          </div>
          <div className="grid gap-6 md:grid-cols-3">
            <Card>
              <CardHeader>
                <Badge className="w-fit" variant="secondary">Frontend</Badge>
                <CardTitle className="mt-2">UI/UX Developer Intern</CardTitle>
                <CardDescription>Remote • Stipend ₹15k</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm">Design and implement responsive user interfaces using React, Tailwind CSS and modern UI libraries.</p>
                <Button className="mt-4 w-full">Apply Now</Button>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <Badge className="w-fit" variant="secondary">Backend</Badge>
                <CardTitle className="mt-2">Node.js Developer</CardTitle>
                <CardDescription>Hybrid • Stipend ₹20k</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm">Build scalable APIs and services using Node.js, Express, and MongoDB in an Agile environment.</p>
                <Button className="mt-4 w-full">Apply Now</Button>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <Badge className="w-fit" variant="secondary">Data Science</Badge>
                <CardTitle className="mt-2">ML Engineer Intern</CardTitle>
                <CardDescription>On-site • Stipend ₹25k</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm">Apply machine learning algorithms to solve real-world problems using Python and TensorFlow.</p>
                <Button className="mt-4 w-full">Apply Now</Button>
              </CardContent>
            </Card>
          </div>
          <div className="mt-8 text-center">
            <Button asChild variant="outline">
              <Link href="/internships">View All Opportunities</Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
