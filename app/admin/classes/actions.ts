"use server";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { Role } from "@/app/generated/prisma";

export async function createClass(formData: FormData) {
  const name = String(formData.get("name") ?? "").trim();
  const subjectId = String(formData.get("subjectId") ?? "").trim();
  const teacherId = String(formData.get("teacherId") ?? "").trim();
  if (!name) throw new Error("Class name is required");
  if (!subjectId) throw new Error("Subject is required");
  if (!teacherId) throw new Error("Teacher is required");
  const teacher = await prisma.user.findUnique({ where: { id: teacherId }, select: { role: true } });
  if (!teacher || teacher.role !== "GURU") throw new Error("Invalid teacher");
  await prisma.schoolClass.create({
    data: {
      name,
      subjectId,
      teacherId,
    },
  });
  revalidatePath("/admin/classes");
}

export async function deleteClass(id: string) {
  if (!id) return;
  await prisma.schoolClass.delete({ where: { id } });
  revalidatePath("/admin/classes");
}

export async function updateClass(id: string, name: string, guruId: string) {
  const trimmedName = (name ?? "").trim();
  const subjectId = (guruId ?? "").trim(); // backward compat signature; will be replaced by subjectId in caller
  const teacherId = subjectId; // placeholder to avoid TS error; will update signature below
  return; // placeholder
}

export async function updateClassWith(id: string, name: string, subjectId: string, teacherId: string) {
  const trimmedName = (name ?? "").trim();
  const trimmedSubjectId = (subjectId ?? "").trim();
  const trimmedTeacherId = (teacherId ?? "").trim();
  if (!id) throw new Error("Class ID is required");
  if (!trimmedName) throw new Error("Class name is required");
  if (!trimmedSubjectId) throw new Error("Subject is required");
  if (!trimmedTeacherId) throw new Error("Teacher is required");
  const teacher = await prisma.user.findUnique({ where: { id: trimmedTeacherId }, select: { role: true } });
  if (!teacher || teacher.role !== ("GURU" as Role)) throw new Error("Invalid teacher");
  await prisma.schoolClass.update({
    where: { id },
    data: { name: trimmedName, subjectId: trimmedSubjectId, teacherId: trimmedTeacherId },
  });
  revalidatePath("/admin/classes");
}

export async function assignStudentToClass(studentId: string, classId: string) {
  const sid = (studentId ?? "").trim();
  const cid = (classId ?? "").trim();
  if (!sid || !cid) throw new Error("Data tidak lengkap");
  const student = await prisma.user.findUnique({ where: { id: sid }, select: { role: true } });
  if (!student || student.role !== ("SISWA" as Role)) throw new Error("Hanya siswa yang bisa di-assign ke kelas");
  const exists = await prisma.enrollment.findUnique({
    where: { studentId_classId: { studentId: sid, classId: cid } },
  });
  if (!exists) {
    await prisma.enrollment.create({
      data: { studentId: sid, classId: cid },
    });
  }
  revalidatePath(`/admin/classes/${cid}`);
}

export async function removeStudentFromClass(studentId: string) {
  const sid = (studentId ?? "").trim();
  if (!sid) throw new Error("Data tidak lengkap");
  const current = await prisma.enrollment.findFirst({ where: { studentId: sid } });
  await prisma.enrollment.deleteMany({ where: { studentId: sid } });
  if (current?.classId) revalidatePath(`/admin/classes/${current.classId}`);
  else revalidatePath(`/admin/classes`);
}
