"use client";
import { useState } from "react";
import { assignStudentToClass } from "@/app/admin/classes/actions";

type Student = { id: string; name: string | null; email: string | null };

type Props = {
  students: Student[];
  classId: string;
};

export default function AssignStudentModal({ students, classId }: Props) {
  const [open, setOpen] = useState(false);
  return (
    <>
      <div className="flex items-center justify-between">
        <h3 className="text-base font-semibold text-slate-900">Manajemen Siswa</h3>
        <button
          onClick={() => setOpen(true)}
          className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-700"
        >
          Tambah Siswa
        </button>
      </div>
      <div
        className={`fixed inset-0 z-50 bg-black/40 backdrop-blur-sm transition-opacity duration-200 ease-out ${
          open ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
        onClick={() => setOpen(false)}
      />
      <div
        className={`fixed inset-0 z-50 flex items-center justify-center p-4 ${
          open ? "pointer-events-auto" : "pointer-events-none"
        }`}
      >
        <div
          className={`w-full max-w-md transform rounded-2xl border border-slate-100 bg-white p-6 shadow-2xl transition-all duration-200 ease-out will-change-transform ${
            open ? "opacity-100 scale-100 translate-y-0" : "opacity-0 scale-95 translate-y-2"
          }`}
        >
          <h4 className="text-base font-semibold text-slate-900">Tambah Siswa ke Kelas</h4>
          <form
            action={async (fd: FormData) => {
              const studentId = String(fd.get("studentId") ?? "");
              await assignStudentToClass(studentId, classId);
              setOpen(false);
            }}
            className="mt-4 space-y-4"
          >
            <div>
              <label className="mb-1 block text-sm font-semibold text-slate-800">Pilih Siswa</label>
              <select
                name="studentId"
                required
                className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Pilih siswa tanpa kelas</option>
                {students.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.name ?? s.email ?? "Siswa"}
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
                Batal
              </button>
              <button
                type="submit"
                className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-blue-700"
              >
                Tambah
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}
