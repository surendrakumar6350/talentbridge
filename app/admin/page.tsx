import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import AdminApplications from "@/components/admin/AdminApplications";

export default async function AdminPage() {
  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Admin Dashboard</h1>
      <div className="grid gap-4 sm:grid-cols-3 mb-6">
        <Card>
          <CardHeader>
            <CardTitle>Total Internships</CardTitle>
          </CardHeader>
          <CardContent>—</CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Applicants</CardTitle>
          </CardHeader>
          <CardContent>—</CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Active Users</CardTitle>
          </CardHeader>
          <CardContent>—</CardContent>
        </Card>
      </div>

      <div className="mb-4">
        <Link href="/admin/internships" className="text-primary underline">Manage Internships</Link>
        <Link href="/admin/applications" className="ml-4 text-primary underline">Review Applications</Link>
      </div>

      <section className="mb-6">
        <h2 className="text-lg font-semibold mb-3">Recent applications</h2>
        <AdminApplications preview />
      </section>
    </div>
  );
}
