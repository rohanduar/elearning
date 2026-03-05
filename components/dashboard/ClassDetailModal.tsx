"use client";
import { useEffect, useState } from "react";

type Guru = { name: string | null; email: string | null } | null;
type Student = { id: string; name: string | null; email: string | null };

type ClassDetail = {
  id: string;
  name: string;
  subject?: { name: string; code: string } | null;
  teacher?: { name: string | null; email: string | null } | null;
  students: Student[];
  _count: { students: number };
  guru?: Guru; // legacy field for display fallback
};

type ClassSummary = {
  id: string;
  name: string;
  teacher?: Guru;
  guru?: Guru;
  subject?: { name: string; code: string } | null;
  _count?: { students: number };
  students?: Student[];
};

type Props = {
  isOpen: boolean;
  onClose: () => void;
  classId: string;
  cls?: ClassSummary | null;
};

export default function ClassDetailModal({ isOpen, onClose, classId, cls }: Props) {
  const [activeTab, setActiveTab] = useState<"overview" | "students" | "materials" | "attendance">("overview");
  const [data, setData] = useState<ClassDetail | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    let cancelled = false;
    async function load() {
      if (!isOpen || !classId) {
        setData(null);
        return;
      }
      setLoading(true);
      try {
        const res = await fetch(`/api/admin/classes/${classId}`, { cache: "no-store" });
        if (!res.ok) throw new Error("Failed to load");
        const json = await res.json();
        if (!cancelled) {
          const normalized: ClassDetail = {
            id: json.id,
            name: json.name,
            subject: json.subject ?? null,
            teacher: json.teacher ?? null,
            students: (json.enrollments ?? []).map((e: any) => e.student),
            _count: { students: (json._count?.enrollments as number | undefined) ?? ((json.enrollments ?? []).length) },
            guru: null,
          };
          setData(normalized);
        }
      } catch {
        if (!cancelled) setData(null);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    load();
    return () => {
      cancelled = true;
    };
  }, [isOpen, classId]);
  return (
    <>
      <div
        className={`fixed inset-0 z-50 bg-black/40 backdrop-blur-sm transition-opacity duration-200 ease-out ${
          isOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
        onClick={onClose}
      />
      <div
        className={`fixed inset-0 z-50 flex items-center justify-center p-4 ${
          isOpen ? "pointer-events-auto" : "pointer-events-none"
        }`}
      >
        <div
          className={`w-full max-w-5xl transform rounded-2xl border border-slate-100 bg-white shadow-2xl transition-all duration-200 ease-out will-change-transform ${
            isOpen ? "opacity-100 scale-100 translate-y-0" : "opacity-0 scale-95 translate-y-2"
          }`}
        >
          <div className="flex items-center justify-between border-b border-slate-200 px-6 py-4">
            <h3 className="text-base font-semibold text-slate-900">Class Details</h3>
            <button
              type="button"
              onClick={onClose}
              className="rounded-md bg-gray-100 px-3 py-1.5 text-sm font-medium text-slate-700 transition-colors hover:bg-gray-200"
            >
              Close
            </button>
          </div>
          <div className="max-h-[75vh] overflow-y-auto p-6">
            {loading && <div className="text-sm text-slate-600">Loading...</div>}
            {!loading && !data && <div className="text-sm text-slate-600">No data available</div>}
            {!loading && data && (
              <>
            <div className="mb-4 flex items-center gap-2 border-b border-slate-200">
              {(["overview", "students", "materials", "attendance"] as const).map((t) => (
                <button
                  key={t}
                  onClick={() => setActiveTab(t)}
                  className={`relative -mb-px whitespace-nowrap px-3 py-2 text-sm font-medium transition-colors ${
                    activeTab === t ? "border-b-2 border-blue-600 text-blue-600" : "text-slate-500 hover:text-slate-700"
                  }`}
                >
                  {t === "overview" ? "Overview" : t === "students" ? "Students" : t === "materials" ? "Materials" : "Attendance"}
                </button>
              ))}
            </div>

            {activeTab === "overview" && (
              <div className="rounded-xl border border-slate-100 bg-white p-6">
                <h3 className="text-base font-semibold text-slate-900">Overview</h3>
                <div className="mt-3 space-y-2 text-sm text-slate-700">
                  <div>
                    <span className="font-medium text-slate-900">Class name: </span>
                    <span>{data.name}</span>
                  </div>
                  <div>
                    <span className="font-medium text-slate-900">Subject: </span>
                    <span>{data.subject?.name ?? "-"}</span>
                  </div>
                  <div>
                    <span className="font-medium text-slate-900">Teacher: </span>
                    <span>{data.teacher?.name ?? data.teacher?.email ?? "-"}</span>
                  </div>
                  <div>
                    <span className="font-medium text-slate-900">Students: </span>
                    <span>{data._count?.students ?? data.students.length}</span>
                  </div>
                </div>
              </div>
            )}

            {activeTab === "students" && (
              <div className="rounded-xl border border-slate-100 bg-white p-6">
                <h3 className="text-base font-semibold text-slate-900">Students</h3>
                {data?.students && data.students.length > 0 ? (
                  <ul className="mt-3 space-y-2">
                    {data.students.map((s) => (
                      <li key={s.id} className="text-sm text-slate-700">
                        {s.name ?? s.email ?? s.id}
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="mt-1 text-sm text-slate-700">No students listed</p>
                )}
              </div>
            )}

            {activeTab === "materials" && (
              <div className="rounded-xl border border-slate-100 bg-white p-6">
                <h3 className="text-base font-semibold text-slate-900">Materials</h3>
                <p className="mt-1 text-sm text-slate-700">Belum ada materi</p>
              </div>
            )}

            {activeTab === "attendance" && (
              <div className="rounded-xl border border-slate-100 bg-white p-6">
                <h3 className="text-base font-semibold text-slate-900">Absensi</h3>
                <p className="mt-1 text-sm text-slate-700">Belum tersedia</p>
              </div>
            )}
              </>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
