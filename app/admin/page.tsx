import Layout from "@/components/dashboard/Layout";

export default function AdminPage() {
  return (
    <Layout>
      <div className="space-y-6">
        <header className="flex flex-col gap-3 rounded-3xl bg-white px-6 py-5 shadow-sm">
          <div className="text-sm font-medium text-blue-900">
            Malachi456 Jaya Plus Montessori
          </div>
          <div className="text-2xl font-semibold text-slate-900">
            Welcome, Admin
          </div>
          <div className="text-sm text-slate-500">
            Manage users, monitor activity, and ensure the system runs smoothly.
          </div>
        </header>

        <section className="grid gap-6 md:grid-cols-2">
          <div className="rounded-3xl bg-white p-6 shadow-sm">
            <div className="text-sm font-medium text-blue-900">
              User Summary
            </div>
            <div className="mt-4 text-3xl font-semibold text-slate-900">
              3 Active Roles
            </div>
            <div className="mt-2 text-sm text-slate-500">
              Admin, Teacher, and Student are ready to use the platform.
            </div>
          </div>
          <div className="rounded-3xl bg-white p-6 shadow-sm">
            <div className="text-sm font-medium text-blue-900">
              System Status
            </div>
            <div className="mt-4 text-3xl font-semibold text-slate-900">
              Stable
            </div>
            <div className="mt-2 text-sm text-slate-500">
              All services are running normally without issues.
            </div>
          </div>
        </section>
      </div>
    </Layout>
  );
}
