"use client";

import { useState } from "react";
import { getSession, signIn } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function LoginPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const authError = searchParams.get("error");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const errorMessage =
    error ?? (authError ? "Invalid email or password." : null);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);

    if (!password) {
      setError("Password is required.");
      return;
    }

    setLoading(true);
    const res = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });

    if (res?.error) {
      setError("Incorrect email or password.");
      setLoading(false);
      return;
    }

    if (res?.ok) {
      const session = await getSession();
      const role = session?.user?.role;
      if (role === "ADMIN") {
        router.push("/admin");
      } else if (role === "GURU") {
        router.push("/guru");
      } else if (role === "SISWA") {
        router.push("/siswa");
      } else {
        setError("Unknown user role.");
      }
      setLoading(false);
      return;
    }

    setError("An error occurred while logging in.");
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-blue-50 to-blue-100">
      <div className="mx-auto flex min-h-screen max-w-6xl flex-col items-center justify-center gap-12 px-6 py-12 lg:flex-row">
        <div className="flex w-full flex-col gap-6 text-center lg:w-1/2 lg:text-left">
          <div className="inline-flex items-center justify-center rounded-full bg-blue-900/10 px-4 py-2 text-sm font-semibold text-blue-900 lg:justify-start">
            Official School Platform
          </div>
          <h1 className="text-4xl font-semibold leading-tight text-blue-900 md:text-5xl">
            Malachi456 Jaya Plus Montessori
          </h1>
          <h2 className="text-xl font-medium text-blue-800">
            Internal E-Learning Platform
          </h2>
          <p className="text-base leading-relaxed text-blue-900/70">
            Access materials, assignments, and class collaboration securely through a modern and integrated digital learning system for all academic members.
          </p>
          <div className="flex flex-col items-center gap-2 text-sm text-blue-900/70 lg:items-start">
            <span></span>
            <span></span>
          </div>
        </div>

        <div className="w-full max-w-md rounded-3xl bg-white p-8 shadow-xl shadow-blue-900/10 lg:w-1/2">
          <div className="mb-6 space-y-2 text-center">
            <h3 className="text-2xl font-semibold text-blue-900">
              Login
            </h3>
            <p className="text-sm text-blue-900/60">
              Please log in to your account using official school credentials.
            </p>
          </div>

          <form className="space-y-5" onSubmit={handleSubmit}>
            <div className="space-y-2">
              <label className="text-sm font-medium text-blue-900">
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                placeholder="e.g., 123456@sekolah.id"
                className="w-full rounded-2xl border border-blue-100 bg-blue-50/40 px-4 py-3 text-sm text-blue-900 outline-none transition focus:border-blue-600 focus:bg-white"
                required
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-blue-900">
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                placeholder="Enter password"
                className="w-full rounded-2xl border border-blue-100 bg-blue-50/40 px-4 py-3 text-sm text-blue-900 outline-none transition focus:border-blue-600 focus:bg-white"
                required
              />
            </div>

            {errorMessage ? (
              <div className="rounded-2xl border border-red-100 bg-red-50 px-4 py-3 text-sm text-red-600">
                {errorMessage}
              </div>
            ) : null}

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-2xl bg-blue-900 px-4 py-3 text-sm font-semibold text-white shadow-lg shadow-blue-900/30 transition hover:bg-blue-800 disabled:cursor-not-allowed disabled:opacity-70"
            >
              {loading ? "Processing..." : "Login"}
            </button>
          </form>
          <div className="mt-6 text-center text-xs text-blue-900/60">
            This system is for internal school users only.
          </div>
        </div>
      </div>
    </div>
  );
}
