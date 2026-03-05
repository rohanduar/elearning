"use client";
import { useState } from "react";

type Guru = { name: string | null; email: string | null } | null;
type Student = { id: string; name: string | null; email: string | null };

type Props = {
  cls: {
    id: string;
    name: string;
    guru: Guru;
    teacher?: Guru;
    subject?: { name: string; code: string } | null;
    _count: { students: number };
    students: Student[];
  };
  availableStudents: Student[];
};

export default function ClassDetailTabs({ cls, availableStudents }: Props) {
  const [activeTab, setActiveTab] = useState<"overview" | "activity" | "attendance">("overview");
  return (
    <div className="rounded-2xl border border-slate-100 bg-white shadow-md">
      <div className="overflow-x-auto">
        <div className="flex min-w-full items-center gap-2 border-b border-slate-200 px-4">
          <button
            onClick={() => setActiveTab("overview")}
            className={`relative -mb-px whitespace-nowrap px-3 py-3 text-sm font-medium transition-colors ${
              activeTab === "overview" ? "border-b-2 border-blue-600 text-blue-600" : "text-slate-500 hover:text-slate-700"
            }`}
          >
            Overview
          </button>
          <button
            onClick={() => setActiveTab("activity")}
            className={`relative -mb-px whitespace-nowrap px-3 py-3 text-sm font-medium transition-colors ${
              activeTab === "activity" ? "border-b-2 border-blue-600 text-blue-600" : "text-slate-500 hover:text-slate-700"
            }`}
          >
            Materi
          </button>
          <button
            onClick={() => setActiveTab("attendance")}
            className={`relative -mb-px whitespace-nowrap px-3 py-3 text-sm font-medium transition-colors ${
              activeTab === "attendance" ? "border-b-2 border-blue-600 text-blue-600" : "text-slate-500 hover:text-slate-700"
            }`}
          >
            Absensi
          </button>
        </div>
      </div>
      <div className="p-6">
        {activeTab === "overview" && (
          <div className="space-y-2">
            <h2 className="text-xl font-semibold text-slate-900">{cls.name}</h2>
            <div className="text-slate-700">
              Subject: {cls.subject?.name ?? "-"}
            </div>
            <div className="text-slate-700">
              Teacher: {cls.teacher?.name ?? cls.teacher?.email ?? cls.guru?.name ?? cls.guru?.email ?? "-"}
            </div>
            <div className="text-slate-700">Students: {cls._count.students}</div>
          </div>
        )}
        {activeTab === "activity" && (
          <div className="rounded-xl border border-slate-100 bg-white p-6">
            <h3 className="text-base font-semibold text-slate-900">Materi Kelas</h3>
            <p className="mt-1 text-sm text-slate-700">Belum ada materi</p>
          </div>
        )}
        {activeTab === "attendance" && (
          <div className="rounded-xl border border-slate-100 bg-white p-6">
            <h3 className="text-base font-semibold text-slate-900">Absensi</h3>
            <p className="mt-1 text-sm text-slate-700">Belum tersedia</p>
          </div>
        )}
      </div>
    </div>
  );
}
