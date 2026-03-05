"use server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcrypt";
import { revalidatePath } from "next/cache";
import { Role } from "@/app/generated/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function createUser(formData: FormData) {
  const name = String(formData.get("name") ?? "").trim();
  const email = String(formData.get("email") ?? "").trim().toLowerCase();
  const password = String(formData.get("password") ?? "");
  const role = String(formData.get("role") ?? "SISWA").toUpperCase() as Role;
  if (!name || !email || !password) {
    return { success: false, message: "Nama, email, dan password wajib diisi" };
  }
  const exists = await prisma.user.findUnique({ where: { email } });
  if (exists) {
    return { success: false, message: "Email sudah terdaftar" };
  }
  const hash = await bcrypt.hash(password, 10);
  await prisma.user.create({
    data: { name, email, password: hash, role },
  });
  revalidatePath("/admin/users");
  return { success: true };
}

export async function deleteUser(id: string, currentAdminId?: string) {
  if (!id) return;
  let actorId = currentAdminId && currentAdminId.length > 0 ? currentAdminId : undefined;
  if (!actorId) {
    const session = await getServerSession(authOptions);
    actorId = (session?.user?.id as string | undefined) ?? undefined;
    if (!actorId && session?.user?.email) {
      const me = await prisma.user.findUnique({ where: { email: session.user.email }, select: { id: true } });
      actorId = me?.id;
    }
  }
  if (!actorId) throw new Error("Unauthorized");
  if (id === actorId) {
    throw new Error("Tidak bisa menghapus akun sendiri");
  }
  const adminCount = await prisma.user.count({ where: { role: "ADMIN" as Role } });
  const target = await prisma.user.findUnique({ where: { id }, select: { role: true } });
  if (target?.role === ("ADMIN" as Role) && adminCount <= 1) {
    throw new Error("Tidak bisa menghapus ADMIN terakhir");
  }
  await prisma.user.delete({ where: { id } });
  revalidatePath("/admin/users");
}

export async function updateRole(id: string, role: Role) {
  if (!id) return;
  await prisma.user.update({
    where: { id },
    data: { role },
  });
  revalidatePath("/admin/users");
}

export async function updateUser(id: string, name: string, email: string, role: Role, actorIdParam?: string) {
  if (!id) return;
  // Prefer actorId sent from client (page-level prop) to avoid session read issues in some setups
  let actorId = actorIdParam && actorIdParam.length > 0 ? actorIdParam : undefined;
  if (!actorId) {
    const session = await getServerSession(authOptions);
    actorId = (session?.user?.id as string | undefined) ?? undefined;
    if (!actorId && session?.user?.email) {
      const me = await prisma.user.findUnique({ where: { email: session.user.email }, select: { id: true } });
      actorId = me?.id;
    }
  }
  if (!actorId) throw new Error("Unauthorized");
  if (id === actorId && role !== ("ADMIN" as Role)) {
    throw new Error("Tidak boleh menurunkan role akun sendiri");
  }
  await prisma.user.update({
    where: { id },
    data: { name, email, role },
  });
  revalidatePath("/admin/users");
}

export async function resetPassword(id: string, newPassword: string) {
  if (!id || !newPassword) throw new Error("Data tidak lengkap");
  const hash = await bcrypt.hash(newPassword, 10);
  await prisma.user.update({
    where: { id },
    data: { password: hash },
  });
  revalidatePath("/admin/users");
}
