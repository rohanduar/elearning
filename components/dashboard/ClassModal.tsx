"use client";
import { useState } from "react";

type Teacher = { id: string; name: string | null; email: string | null };
type Subject = { id: string; name: string; code: string };

type Props = {
  teachers: Teacher[];
  subjects: Subject[];
  onCreate: (formData: FormData) => Promise<void>;
};

export default function ClassModal({ teachers, subjects, onCreate }: Props) {
  const [open, setOpen] = useState(false);
  return (
    <>
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-lg font-semibold text-slate-900">Class Management</h2>
        <button
          onClick={() => setOpen(true)}
          className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-700"
        >
          Add Class
        </button>
      </div>
      <div
        className={`fixed inset-0 z-50 bg-black/40 backdrop-blur-sm transition-opacity duration-200 ease-out ${
          open ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
        onClick={() => setOpen(false)}
      />
      <div className={`fixed inset-0 z-50 flex items-center justify-center p-4 ${open ? "pointer-events-auto" : "pointer-events-none"}`}>
        <div
          className={`w-full max-w-md transform rounded-2xl border border-slate-100 bg-white p-6 shadow-2xl transition-all duration-200 ease-out will-change-transform ${
            open ? "opacity-100 scale-100 translate-y-0" : "opacity-0 scale-95 translate-y-2"
          }`}
        >
          <h3 className="text-base font-semibold text-slate-900">Add New Class</h3>
          <form
            action={async (fd: FormData) => {
              await onCreate(fd);
              setOpen(false);
            }}
            className="mt-4 space-y-4"
          >
            <div>
              <label className="mb-1 block text-sm font-semibold text-slate-800">Class Name</label>
              <input
                name="name"
                type="text"
                required
                placeholder="e.g., A / 2025-A"
                className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="mb-1 block text-sm font-semibold text-slate-800">Subject</label>
              <select
                name="subjectId"
                required
                className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Select Subject</option>
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
                required
                className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Select Teacher</option>
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
                onClick={() => setOpen(false)}
                className="rounded-md bg-gray-100 px-4 py-2 text-sm font-medium text-slate-700 transition-colors hover:bg-gray-200"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-blue-700"
              >
                Save
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}
