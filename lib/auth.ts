import { PrismaAdapter } from "@auth/prisma-adapter";
import bcrypt from "bcrypt";
import { type NextAuthOptions } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { prisma } from "@/lib/prisma";
import { Role } from "@/app/generated/prisma";

const seedDefaultUsersIfEmpty = async () => {
  const count = await prisma.user.count();
  if (count > 0) {
    return;
  }

  const passwordHash = await bcrypt.hash("123456", 10);

  await prisma.user.createMany({
    data: [
      {
        email: "admin@sekolah.id",
        password: passwordHash,
        role: Role.ADMIN,
        name: "Admin Sekolah",
      },
      {
        email: "guru@sekolah.id",
        password: passwordHash,
        role: Role.GURU,
        name: "Guru Sekolah",
      },
      {
        email: "siswa@sekolah.id",
        password: passwordHash,
        role: Role.SISWA,
        name: "Siswa Sekolah",
      },
    ],
  });
};

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  providers: [
    Credentials({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      authorize: async (credentials) => {
        if (!credentials?.email || !credentials.password) {
          return null;
        }

        await seedDefaultUsersIfEmpty();

        const user = await prisma.user.findUnique({
          where: { email: credentials.email },
        });

        if (!user || !user.password) {
          return null;
        }

        const valid = await bcrypt.compare(credentials.password, user.password);


console.log("INPUT:", credentials.password);
console.log("HASH:", user.password);
console.log("VALID:", valid);

        if (!valid) {
          return null;
        }

        return {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role,
          image: user.image,
        };
      },
    }),
  ],
  session: {
    strategy: "jwt",
  },
  pages: {
    signIn: "/login",
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = user.role;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        session.user.role = token.role as Role | undefined;
      }
      return session;
    },
  },
};
