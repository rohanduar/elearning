import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import Layout from "@/components/dashboard/Layout";
import ClassDetailTabs from "@/components/dashboard/ClassDetailTabs";

type Props = { params: { id: string } };

export default async function ClassDetailPage({ params }: Props) {
  if (!params || !params.id) {
    redirect("/admin/classes");
  }
  const id = decodeURIComponent(params.id);
  const session = await getServerSession(authOptions);
  if (!session) redirect("/login");
  if (session.user?.role !== "ADMIN") redirect("/");

  const cls = await prisma.schoolClass.findUnique({
    where: { id },
    include: {
      teacher: { select: { name: true, email: true } },
      subject: { select: { name: true, code: true } },
      materials: true,
      enrollments: { include: { student: { select: { id: true, name: true, email: true } } } },
      _count: { select: { enrollments: true } },
    },
  });
  const availableStudents = await prisma.user.findMany({
    where: { role: "SISWA" as any },
    select: { id: true, name: true, email: true },
    orderBy: { name: "asc" },
  });

  return (
    <Layout>
      <ClassDetailTabs cls={cls as any} availableStudents={availableStudents as any} />
    </Layout>
  );
}
