require("dotenv/config");
const { PrismaPg } = require("@prisma/adapter-pg");
const { PrismaClient, Role } = require("../app/generated/prisma");
const bcrypt = require("bcrypt");

const prisma = new PrismaClient({
  adapter: new PrismaPg({
    connectionString: process.env.DATABASE_URL ?? "",
  }),
});

const seed = async () => {
  const passwordHash = await bcrypt.hash("123456", 10);

  // Upsert Admin
  const admin = await prisma.user.upsert({
    where: { email: "admin@sekolah.id" },
    update: {},
    create: {
      email: "admin@sekolah.id",
      password: passwordHash,
      role: Role.ADMIN,
      name: "Admin Sekolah",
    },
  });

  // Upsert Gurus
  const guru1 = await prisma.user.upsert({
    where: { email: "guru@sekolah.id" },
    update: {},
    create: {
      email: "guru@sekolah.id",
      password: passwordHash,
      role: Role.GURU,
      name: "Guru Satu",
    },
  });
  const guru2 = await prisma.user.upsert({
    where: { email: "guru2@sekolah.id" },
    update: {},
    create: {
      email: "guru2@sekolah.id",
      password: passwordHash,
      role: Role.GURU,
      name: "Guru Dua",
    },
  });

  // Upsert Siswa
  const siswa1 = await prisma.user.upsert({
    where: { email: "siswa1@sekolah.id" },
    update: {},
    create: {
      email: "siswa1@sekolah.id",
      password: passwordHash,
      role: Role.SISWA,
      name: "Siswa Satu",
    },
  });
  const siswa2 = await prisma.user.upsert({
    where: { email: "siswa2@sekolah.id" },
    update: {},
    create: {
      email: "siswa2@sekolah.id",
      password: passwordHash,
      role: Role.SISWA,
      name: "Siswa Dua",
    },
  });
  const siswa3 = await prisma.user.upsert({
    where: { email: "siswa3@sekolah.id" },
    update: {},
    create: {
      email: "siswa3@sekolah.id",
      password: passwordHash,
      role: Role.SISWA,
      name: "Siswa Tiga",
    },
  });

  // Upsert Subjects by code
  const mtk = await prisma.subject.upsert({
    where: { code: "MTK" },
    update: { name: "Matematika" },
    create: { code: "MTK", name: "Matematika", description: null },
  });
  const ind = await prisma.subject.upsert({
    where: { code: "IND" },
    update: { name: "Bahasa Indonesia" },
    create: { code: "IND", name: "Bahasa Indonesia", description: null },
  });

  // Create Classes if not exists
  const kelas7A = await prisma.schoolClass.upsert({
    where: { id: "seed-7A" },
    update: {},
    create: {
      id: "seed-7A",
      name: "Kelas 7A",
      teacherId: guru1.id,
      subjectId: mtk.id,
    },
  });
  const kelas7B = await prisma.schoolClass.upsert({
    where: { id: "seed-7B" },
    update: {},
    create: {
      id: "seed-7B",
      name: "Kelas 7B",
      teacherId: guru2.id,
      subjectId: ind.id,
    },
  });

  // Extra gurus
  const guru3 = await prisma.user.upsert({
    where: { email: "guru3@sekolah.id" },
    update: {},
    create: {
      email: "guru3@sekolah.id",
      password: passwordHash,
      role: Role.GURU,
      name: "Guru Tiga",
    },
  });
  const guru4 = await prisma.user.upsert({
    where: { email: "guru4@sekolah.id" },
    update: {},
    create: {
      email: "guru4@sekolah.id",
      password: passwordHash,
      role: Role.GURU,
      name: "Guru Empat",
    },
  });

  const kelas8A = await prisma.schoolClass.upsert({
    where: { id: "seed-8A" },
    update: {},
    create: {
      id: "seed-8A",
      name: "Kelas 8A",
      teacherId: guru3.id,
      subjectId: mtk.id,
    },
  });
  const kelas9A = await prisma.schoolClass.upsert({
    where: { id: "seed-9A" },
    update: {},
    create: {
      id: "seed-9A",
      name: "Kelas 9A",
      teacherId: guru4.id,
      subjectId: ind.id,
    },
  });

  // Assign students to classes using Enrollment
  await prisma.enrollment.createMany({
    data: [
      { studentId: siswa1.id, classId: kelas7A.id },
      { studentId: siswa2.id, classId: kelas7A.id },
      { studentId: siswa3.id, classId: kelas7B.id },
    ],
    skipDuplicates: true,
  });

  // More siswa
  const siswa4 = await prisma.user.upsert({
    where: { email: "siswa4@sekolah.id" },
    update: {},
    create: {
      email: "siswa4@sekolah.id",
      password: passwordHash,
      role: Role.SISWA,
      name: "Siswa Empat",
    },
  });
  const siswa5 = await prisma.user.upsert({
    where: { email: "siswa5@sekolah.id" },
    update: {},
    create: {
      email: "siswa5@sekolah.id",
      password: passwordHash,
      role: Role.SISWA,
      name: "Siswa Lima",
    },
  });
  const siswa6 = await prisma.user.upsert({
    where: { email: "siswa6@sekolah.id" },
    update: {},
    create: {
      email: "siswa6@sekolah.id",
      password: passwordHash,
      role: Role.SISWA,
      name: "Siswa Enam",
    },
  });
  const siswa7 = await prisma.user.upsert({
    where: { email: "siswa7@sekolah.id" },
    update: {},
    create: {
      email: "siswa7@sekolah.id",
      password: passwordHash,
      role: Role.SISWA,
      name: "Siswa Tujuh",
    },
  });
  const siswa8 = await prisma.user.upsert({
    where: { email: "siswa8@sekolah.id" },
    update: {},
    create: {
      email: "siswa8@sekolah.id",
      password: passwordHash,
      role: Role.SISWA,
      name: "Siswa Delapan",
    },
  });
  const siswa9 = await prisma.user.upsert({
    where: { email: "siswa9@sekolah.id" },
    update: {},
    create: {
      email: "siswa9@sekolah.id",
      password: passwordHash,
      role: Role.SISWA,
      name: "Siswa Sembilan",
    },
  });
  const siswa10 = await prisma.user.upsert({
    where: { email: "siswa10@sekolah.id" },
    update: {},
    create: {
      email: "siswa10@sekolah.id",
      password: passwordHash,
      role: Role.SISWA,
      name: "Siswa Sepuluh",
    },
  });

  // Assign to extra classes using Enrollment
  await prisma.enrollment.createMany({
    data: [
      { studentId: siswa4.id, classId: kelas8A.id },
      { studentId: siswa5.id, classId: kelas8A.id },
      { studentId: siswa6.id, classId: kelas8A.id },
      { studentId: siswa7.id, classId: kelas9A.id },
      { studentId: siswa8.id, classId: kelas9A.id },
      { studentId: siswa9.id, classId: kelas9A.id },
      { studentId: siswa10.id, classId: kelas9A.id },
    ],
    skipDuplicates: true,
  });

  // Seed Materials (optional basic placeholders)
  try {
    const makeIfEmpty = async (classId, items) => {
      const c = await prisma.material.count({ where: { classId } });
      if (c === 0) {
        await prisma.material.createMany({ data: items });
      }
    };
    await makeIfEmpty(kelas7A.id, [
      { title: "Pengenalan Matematika", description: "Dasar-dasar aritmetika", date: new Date(), fileUrl: null, classId: kelas7A.id, createdById: admin.id },
      { title: "Geometri Dasar", description: "Bangun datar & ruang", date: new Date(), fileUrl: null, classId: kelas7A.id, createdById: admin.id },
    ]);
    await makeIfEmpty(kelas7B.id, [
      { title: "Bahasa Indonesia: Membaca", description: "Membaca pemahaman", date: new Date(), fileUrl: null, classId: kelas7B.id, createdById: admin.id },
    ]);
    await makeIfEmpty(kelas8A.id, [
      { title: "IPA: Sistem Peredaran Darah", description: null, date: new Date(), fileUrl: null, classId: kelas8A.id, createdById: admin.id },
    ]);
    await makeIfEmpty(kelas9A.id, [
      { title: "IPS: Geografi Indonesia", description: null, date: new Date(), fileUrl: null, classId: kelas9A.id, createdById: admin.id },
      { title: "Matematika: Aljabar", description: null, date: new Date(), fileUrl: null, classId: kelas9A.id, createdById: admin.id },
    ]);
  } catch (_) {
    // ignore if table doesn't exist or duplicates
  }
};

seed()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (error) => {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  });
