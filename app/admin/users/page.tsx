export const dynamic = "force-dynamic";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import Layout from "@/components/dashboard/Layout";
import UserModal from "@/components/dashboard/UserModal";
import UserTable from "@/components/dashboard/UserTable";
import Link from "next/link";
import { Role } from "@/app/generated/prisma";

export default async function UsersPage(
  { searchParams }: { searchParams: Promise<{ role?: string }> }
) {
  const session = await getServerSession(authOptions);
  if (!session) {
    redirect("/login");
  }
  if (session.user?.role !== "ADMIN") {
    redirect("/");
  }
  const params = await searchParams;
  const roleParam = params?.role;
  const selectedRoleStr = roleParam === "GURU" ? "GURU" : roleParam === "SISWA" ? "SISWA" : "ADMIN";
  const selectedRoleEnum = selectedRoleStr === "GURU" ? Role.GURU : selectedRoleStr === "SISWA" ? Role.SISWA : Role.ADMIN;

  const users = await prisma.user.findMany({
    where: { role: selectedRoleEnum },
    select: { id: true, name: true, email: true, role: true, createdAt: true },
    orderBy: { createdAt: "desc" },
  });
  const roleLabels = { ADMIN: "Admin", GURU: "Teacher", SISWA: "Student" } as const;
  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
          <div className="space-y-3">
            <h1 className="text-2xl font-semibold text-slate-900">User Management</h1>
            <div className="inline-flex rounded-2xl bg-slate-100 p-1 shadow-inner">
              {(["ADMIN", "GURU", "SISWA"] as const).map((r) => (
                <Link
                  key={r}
                  href={`/admin/users?role=${r}`}
                  className={`rounded-lg px-4 py-2 text-sm font-medium transition-all duration-200 ${
                    selectedRoleStr === r ? "bg-white shadow-md text-blue-600" : "text-slate-600 hover:bg-white/60"
                  }`}
                >
                  {roleLabels[r]}
                </Link>
              ))}
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            {(selectedRoleStr === "GURU" || selectedRoleStr === "SISWA") && (
              <button
                type="button"
                className="h-10 rounded-lg border border-slate-200 bg-white px-4 text-sm font-medium text-slate-700 shadow-sm hover:bg-slate-50"
                title="Upload Excel (placeholder)"
              >
                Upload Excel
              </button>
            )}
            <UserModal inline selectedRole={selectedRoleStr as "ADMIN" | "GURU" | "SISWA"} />
          </div>
        </div>
        {users.length === 0 ? (
          <div className="rounded-2xl border border-slate-100 bg-white p-10 text-center shadow-md">
            <div className="mx-auto mb-3 h-10 w-10 rounded-full bg-slate-50 ring-1 ring-slate-200 flex items-center justify-center">
              <svg viewBox="0 0 24 24" className="h-5 w-5 text-slate-500">
                <path d="M16 11a4 4 0 1 0-4-4 4 4 0 0 0 4 4zm-8 0a3 3 0 1 0-3-3 3 3 0 0 0 3 3zm8 2c-3 0-9 1.5-9 4.5V21h14v-3.5c0-3-6-4.5-5-4.5zM8 14c-2.7 0-6 1.35-6 4v2h6v-2.5c0-.52.14-1.02.4-1.5" fill="currentColor" />
              </svg>
            </div>
            <h3 className="text-base font-semibold text-slate-900">No data for {selectedRoleStr}</h3>
            <p className="mt-1 text-sm text-slate-600">
              Please add a new {selectedRoleStr.toLowerCase()}.
            </p>
          </div>
        ) : (
          <UserTable users={users as any} actorId={(session.user as any)?.id ?? ""} />
        )}
      </div>
    </Layout>
  );
}
