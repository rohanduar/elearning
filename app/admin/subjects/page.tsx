export const dynamic = "force-dynamic";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import Layout from "@/components/dashboard/Layout";
import SubjectModal from "@/components/dashboard/SubjectModal";
import SubjectTable from "@/components/dashboard/SubjectTable";

export default async function SubjectsPage() {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/login");
  if (session.user?.role !== "ADMIN") redirect("/");

  const subjects = await prisma.subject.findMany({
    select: { id: true, name: true, code: true, description: true, createdAt: true },
    orderBy: { createdAt: "desc" },
  });

  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
          <div className="space-y-1">
            <h1 className="text-2xl font-semibold text-slate-900">Subjects</h1>
            <p className="text-sm text-slate-600">Manage subject master data for the platform.</p>
          </div>
          <div>
            <SubjectModal inline />
          </div>
        </div>
        {subjects.length === 0 ? (
          <div className="rounded-2xl border border-slate-100 bg-white p-10 text-center shadow-md">
            <div className="mx-auto mb-3 flex h-10 w-10 items-center justify-center rounded-full bg-slate-50 ring-1 ring-slate-200">
              <svg viewBox="0 0 24 24" className="h-5 w-5 text-slate-500">
                <path d="M16 11a4 4 0 1 0-4-4 4 4 0 0 0 4 4zm-8 0a3 3 0 1 0-3-3 3 3 0 0 0 3 3zm8 2c-3 0-9 1.5-9 4.5V21h14v-3.5c0-3-6-4.5-5-4.5zM8 14c-2.7 0-6 1.35-6 4v2h6v-2.5c0-.52.14-1.02.4-1.5" fill="currentColor" />
              </svg>
            </div>
            <h3 className="text-base font-semibold text-slate-900">No data available</h3>
            <p className="mt-1 text-sm text-slate-600">Please add a new subject.</p>
          </div>
        ) : (
          <SubjectTable rows={subjects as any} />
        )}
      </div>
    </Layout>
  );
}
