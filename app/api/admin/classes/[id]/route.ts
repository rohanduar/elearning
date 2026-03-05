import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(
  _req: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const p = await context.params;
    const id = decodeURIComponent(p.id);
    const cls = await prisma.schoolClass.findUnique({
      where: { id },
      include: {
        teacher: { select: { name: true, email: true } },
        subject: { select: { name: true, code: true } },
        enrollments: { include: { student: { select: { id: true, name: true, email: true } } } },
        _count: { select: { enrollments: true } },
      },
    });
    if (!cls) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }
    return NextResponse.json(cls);
  } catch (e: any) {
    return NextResponse.json({ error: e?.message ?? "Internal error" }, { status: 500 });
  }
}
