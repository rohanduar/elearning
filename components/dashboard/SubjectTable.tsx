"use client";
import { useState } from "react";
import Swal from "sweetalert2";
import { deleteSubject } from "@/app/admin/subjects/actions";
import SubjectModal from "./SubjectModal";

type Row = {
  id: string;
  name: string;
  code: string;
  description: string | null;
};

export default function SubjectTable({ rows }: { rows: Row[] }) {
  const [editing, setEditing] = useState<Row | null>(null);
  return (
    <div className="rounded-2xl border border-slate-200 bg-white shadow-sm">
      <div className="w-full overflow-x-auto">
        <table className="w-full divide-y divide-slate-100">
          <thead className="bg-slate-50">
            <tr>
              <th className="px-3 py-3 sm:px-6 text-left text-xs font-medium uppercase tracking-wider text-slate-500">
                Name
              </th>
              <th className="px-3 py-3 sm:px-6 text-left text-xs font-medium uppercase tracking-wider text-slate-500">
                Code
              </th>
              <th className="px-3 py-3 sm:px-6 text-left text-xs font-medium uppercase tracking-wider text-slate-500">
                Description
              </th>
              <th className="min-w-[140px] px-3 py-3 sm:px-6 text-right text-xs font-medium uppercase tracking-wider text-slate-500">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {rows.map((r) => (
              <tr key={r.id} className="hover:bg-slate-50/70 transition-colors">
                <td className="px-3 py-3 sm:px-6 text-sm text-slate-900">{r.name}</td>
                <td className="px-3 py-3 sm:px-6 text-sm text-slate-700">{r.code}</td>
                <td className="px-3 py-3 sm:px-6 text-sm text-slate-700">
                  {r.description ?? "-"}
                </td>
                <td className="min-w-[140px] whitespace-nowrap px-3 py-3 sm:px-6">
                  <div className="flex items-center gap-1 sm:gap-2 justify-end">
                    <button
                      onClick={() => setEditing(r)}
                      className="rounded-md border border-slate-200 bg-white px-2 py-1 text-xs sm:text-sm text-slate-700 hover:bg-slate-100"
                      title="Edit"
                    >
                      <svg viewBox="0 0 24 24" className="h-4 w-4">
                        <path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04a1 1 0 0 0 0-1.41l-2.34-2.34a1 1 0 0 0-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z" fill="currentColor" />
                      </svg>
                    </button>
                    <button
                      onClick={async () => {
                        const result = await Swal.fire({
                          title: "Are you sure?",
                          text: "This action cannot be undone.",
                          icon: "warning",
                          showCancelButton: true,
                          confirmButtonColor: "#dc2626",
                          cancelButtonColor: "#64748b",
                          confirmButtonText: "Confirm",
                          cancelButtonText: "Cancel",
                          allowOutsideClick: false,
                        });
                        if (result.isConfirmed) {
                          try {
                            await deleteSubject(r.id);
                            await Swal.fire({
                              icon: "success",
                              title: "Success",
                              text: "Subject deleted successfully",
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
                        }
                      }}
                      className="rounded-md border border-red-200 bg-red-50 px-2 py-1 text-xs sm:text-sm font-medium text-red-700 transition-colors hover:bg-red-100"
                      title="Delete"
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

      {/* Edit Modal */}
      {editing && (
        <SubjectModal inline={false} open={!!editing} onClose={() => setEditing(null)} subject={editing} />
      )}
    </div>
  );
}
