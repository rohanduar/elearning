import Layout from "@/components/dashboard/Layout";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";

export default async function AdminMateriPage() {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/login");
  if (session.user?.role !== "ADMIN") redirect("/");

  let rows: Array<{
    id: string;
    title: string;
    date: Date;
    fileUrl: string | null;
    classId: string;
    createdById: string;
    class_name: string | null;
    created_name: string | null;
    created_email: string | null;
  }> = [];
  try {
    rows = (await prisma.$queryRaw`
      SELECT 
        m.id,
        m.title,
        m."date",
        m."fileUrl",
        m."classId",
        m."createdById",
        c.name as class_name,
        u.name as created_name,
        u.email as created_email
      FROM "Material" m
      LEFT JOIN "SchoolClass" c ON c.id = m."classId"
      LEFT JOIN "User" u ON u.id = m."createdById"
      ORDER BY m."date" DESC
    `) as any;
  } catch (e) {
    rows = [];
  }

  return (
    <Layout>
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h1 className="text-xl font-semibold text-slate-900">Manajemen Materi</h1>
          <button className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700">
            + Tambah Materi
          </button>
        </div>

        <div className="rounded-2xl border border-slate-100 bg-white shadow-md">
          {rows.length === 0 ? (
            <div className="p-10 text-center">
              <div className="mx-auto mb-3 h-10 w-10 rounded-full bg-slate-50 ring-1 ring-slate-200 flex items-center justify-center">
                <svg viewBox="0 0 24 24" className="h-5 w-5 text-slate-500">
                  <path d="M4 6h16v2H4V6zm0 5h16v2H4v-2zm0 5h16v2H4v-2z" fill="currentColor" />
                </svg>
              </div>
              <h3 className="text-base font-semibold text-slate-900">Belum ada materi</h3>
              <p className="mt-1 text-sm text-slate-600">Silakan tambahkan materi baru.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-slate-100">
                <thead className="bg-slate-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-slate-500">Judul</th>
                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-slate-500">Kelas</th>
                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-slate-500">Tanggal</th>
                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-slate-500">Dibuat Oleh</th>
                    <th className="px-6 py-3 text-right text-xs font-medium uppercase tracking-wider text-slate-500">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {rows.map((m) => (
                    <tr key={m.id} className="hover:bg-slate-50/70 transition-colors">
                      <td className="px-6 py-3 text-sm text-slate-900">{m.title}</td>
                      <td className="px-6 py-3 text-sm text-slate-700">{m.class_name ?? "-"}</td>
                      <td className="px-6 py-3 text-sm text-slate-700">
                        {new Date(m.date).toLocaleDateString("id-ID", { year: "numeric", month: "long", day: "numeric" })}
                      </td>
                      <td className="px-6 py-3 text-sm text-slate-700">
                        {m.created_name ?? m.created_email ?? "-"}
                      </td>
                      <td className="px-6 py-3">
                        <div className="flex items-center justify-end gap-2">
                          <button className="rounded-md border border-slate-200 bg-white px-2 py-1 text-slate-700 hover:bg-slate-100">
                            Detail
                          </button>
                          <button className="rounded-md border border-red-200 bg-red-50 px-2 py-1 text-red-700 hover:bg-red-100">
                            Hapus
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
}
