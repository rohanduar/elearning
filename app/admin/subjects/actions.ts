"use server";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function createSubject(formData: FormData) {
  const name = String(formData.get("name") ?? "").trim();
  const code = String(formData.get("code") ?? "").trim().toUpperCase();
  const description = String(formData.get("description") ?? "").trim() || null;
  if (!name) return { success: false, message: "Name is required" };
  if (!code) return { success: false, message: "Code is required" };
  const exists = await prisma.subject.findUnique({ where: { code } });
  if (exists) return { success: false, message: "Code already exists" };
  await prisma.subject.create({ data: { name, code, description } });
  revalidatePath("/admin/subjects");
  return { success: true };
}

export async function updateSubject(id: string, formData: FormData) {
  if (!id) return { success: false, message: "Invalid subject id" };
  const name = String(formData.get("name") ?? "").trim();
  const code = String(formData.get("code") ?? "").trim().toUpperCase();
  const description = String(formData.get("description") ?? "").trim() || null;
  if (!name) return { success: false, message: "Name is required" };
  if (!code) return { success: false, message: "Code is required" };
  const exists = await prisma.subject.findUnique({ where: { code } });
  if (exists && exists.id !== id) return { success: false, message: "Code already exists" };
  await prisma.subject.update({
    where: { id },
    data: { name, code, description },
  });
  revalidatePath("/admin/subjects");
  return { success: true };
}

export async function deleteSubject(id: string) {
  if (!id) return;
  await prisma.subject.delete({ where: { id } });
  revalidatePath("/admin/subjects");
}
