"use client";
import { useTransition, useState } from "react";
import { updateClassWith } from "@/app/admin/classes/actions";
import Swal from "sweetalert2";
import ClassDetailModal from "./ClassDetailModal";

type Row = {
  id: string;
  name: string;
  subject?: { name: string; code: string } | null;
  teacher?: { name: string | null; email: string | null } | null;
  guru: { name: string | null; email: string | null } | null;
  _count: { enrollments: number };
};

type Props = {
  rows: Row[];
  onDelete: (id: string) => Promise<void>;
  teachers: { id: string; name: string | null; email: string | null }[];
  subjects: { id: string; name: string; code: string }[];
};

export default function ClassTable({ rows, onDelete, teachers, subjects }: Props) {
  const [isPending, startTransition] = useTransition();
  const [editing, setEditing] = useState<Row | null>(null);
  const [selectedClassId, setSelectedClassId] = useState<string | null>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  return (
    <div className="rounded-2xl border border-slate-100 bg-white shadow-md">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-slate-100">
          <thead className="bg-slate-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-slate-500">Class Name</th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-slate-500">Subject</th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-slate-500">Teacher</th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-slate-500">Students Count</th>
              <th className="px-6 py-3 text-right text-xs font-medium uppercase tracking-wider text-slate-500">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {rows.map((r) => (
              <tr key={r.id} className="hover:bg-slate-50/70 transition-colors">
                <td className="px-6 py-3 text-sm text-slate-900">{r.name}</td>
                <td className="px-6 py-3 text-sm text-slate-700">{r.subject?.name ?? "-"}</td>
                <td className="px-6 py-3 text-sm text-slate-700">{r.teacher?.name ?? r.teacher?.email ?? "-"}</td>
                <td className="px-6 py-3 text-sm text-slate-700">{r._count.enrollments}</td>
                <td className="px-6 py-3">
                  <div className="flex items-center justify-end gap-2">
                    <button
                      onClick={() => {
                        setSelectedClassId(r.id);
                        setIsDetailOpen(true);
                      }}
                      className="rounded-md border border-slate-200 bg-white px-2 py-1 text-slate-700 hover:bg-slate-100"
                      title="Detail"
                    >
                      <svg viewBox="0 0 24 24" className="h-4 w-4">
                        <path d="M12 5c-7 0-11 7-11 7s4 7 11 7 11-7 11-7-4-7-11-7zm0 2a5 5 0 1 1 0 10 5 5 0 0 1 0-10z" fill="currentColor" />
                      </svg>
                    </button>
                    <button
                      onClick={() => setEditing(r)}
                      className="rounded-md border border-slate-200 bg-white px-2 py-1 text-slate-700 hover:bg-slate-100"
                      title="Edit"
                    >
                      <svg viewBox="0 0 24 24" className="h-4 w-4">
                        <path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04a1 1 0 0 0 0-1.41l-2.34-2.34a1 1 0 0 0-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z" fill="currentColor" />
                      </svg>
                    </button>
                    <button
                      disabled={isPending}
                      onClick={async () => {
                        const result = await Swal.fire({
                          title: "Delete Class?",
                          text: "This action cannot be undone.",
                          icon: "warning",
                          showCancelButton: true,
                          confirmButtonColor: "#dc2626",
                          cancelButtonColor: "#64748b",
                          confirmButtonText: "Yes, delete it",
                          cancelButtonText: "Cancel",
                          allowOutsideClick: false,
                        });
                        if (result.isConfirmed) {
                          startTransition(async () => {
                            try {
                              await onDelete(r.id);
                              await Swal.fire({
                                icon: "success",
                                title: "Deleted!",
                                text: "Class has been deleted successfully.",
                                timer: 1500,
                                showConfirmButton: false,
                              });
                            } catch (err: any) {
                              await Swal.fire({
                                icon: "error",
                                title: "Error",
                                text: err?.message ?? "An error occurred",
                              });
                            }
                          });
                        }
                      }}
                      className="rounded-md border border-red-200 bg-red-50 px-2 py-1 text-xs sm:text-sm font-medium text-red-700 transition-colors hover:bg-red-100"
                      aria-label="Delete class"
                      title="Delete class"
                    >
                      <svg viewBox="0 0 24 24" className="h-4 w-4">
                        <path d="M6 7h12l-1 14H7L6 7zm3-3h6l1 2H8l1-2z" fill="currentColor" />
                      </svg>
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <ClassDetailModal
        isOpen={isDetailOpen}
        onClose={() => setIsDetailOpen(false)}
        classId={selectedClassId ?? ""}
      />
      {editing && (
        <>
          <div
            className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm"
            onClick={() => setEditing(null)}
          />
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="w-full max-w-md rounded-2xl border border-slate-100 bg-white p-6 shadow-2xl">
              <h3 className="text-base font-semibold text-slate-900">Edit Class</h3>
              <form
                action={async (fd: FormData) => {
                  if (!editing) return;
                  const name = String(fd.get("name") ?? "");
                  const subjectId = String(fd.get("subjectId") ?? "");
                  const teacherId = String(fd.get("teacherId") ?? "");
                  startTransition(async () => {
                    await updateClassWith(editing.id, name, subjectId, teacherId);
                    await Swal.fire({
                      icon: "success",
                      title: "Updated!",
                      text: "Class has been updated successfully.",
                      timer: 1500,
                      showConfirmButton: false,
                    });
                    setEditing(null);
                  });
                }}
                className="mt-4 space-y-4"
              >
                <div>
                  <label className="mb-1 block text-sm font-semibold text-slate-800">Class Name</label>
                  <input
                    name="name"
                    type="text"
                    defaultValue={editing?.name ?? ""}
                    className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="mb-1 block text-sm font-semibold text-slate-800">Subject</label>
                  <select
                    name="subjectId"
                    defaultValue={(editing as any)?.subjectId ?? ""}
                    className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500"
                  >
                    {subjects.map((s) => (
                      <option key={s.id} value={s.id}>
                        {s.name} ({s.code})
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="mb-1 block text-sm font-semibold text-slate-800">Teacher</label>
                  <select
                    name="teacherId"
                    defaultValue={(editing as any)?.teacherId ?? ""}
                    className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500"
                  >
                    {teachers.map((t) => (
                      <option key={t.id} value={t.id}>
                        {t.name ?? t.email ?? "Teacher"}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="mt-6 flex justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => setEditing(null)}
                    className="rounded-md bg-gray-100 px-4 py-2 text-sm font-medium text-slate-700 transition-colors hover:bg-gray-200"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-blue-700"
                  >
                    Save Changes
                  </button>
                </div>
              </form>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
