import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import Layout from "@/components/dashboard/Layout";
import ClassModal from "@/components/dashboard/ClassModal";
import ClassTable from "@/components/dashboard/ClassTable";
import { createClass, deleteClass } from "./actions";
// Removed bottom detail panel (moved to modal)

export default async function AdminClassesPage() {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/login");
  if (session.user?.role !== "ADMIN") redirect("/");

  const [classes, teachers, subjects] = await Promise.all([
    prisma.schoolClass.findMany({
      include: {
        teacher: { select: { name: true, email: true } },
        subject: { select: { name: true, code: true } },
        enrollments: { include: { student: { select: { id: true, name: true, email: true } } } },
        _count: { select: { enrollments: true } },
      },
      orderBy: { name: "asc" },
    }),
    prisma.user.findMany({
      where: { role: "GURU" as any },
      select: { id: true, name: true, email: true },
      orderBy: { name: "asc" },
    }),
    prisma.subject.findMany({
      select: { id: true, name: true, code: true },
      orderBy: { name: "asc" },
    }),
  ]);
  return (
    <Layout>
      <div className="space-y-6">
        <ClassModal teachers={teachers as any} subjects={subjects as any} onCreate={createClass} />
        <ClassTable rows={classes as any} onDelete={deleteClass} teachers={teachers as any} subjects={subjects as any} />
      </div>
    </Layout>
  );
}
