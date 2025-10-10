import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

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
      </div>
    </div>
  );
}
