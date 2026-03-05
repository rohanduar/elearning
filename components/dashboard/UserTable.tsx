"use client";
import { useTransition, useState } from "react";
import { deleteUser, updateRole, updateUser, resetPassword } from "@/app/admin/users/actions";
import Swal from "sweetalert2";

type RoleOption = "ADMIN" | "GURU" | "SISWA";

type User = {
  id: string;
  name: string | null;
  email: string;
  role: RoleOption;
};

type Props = {
  users: User[];
  actorId: string;
};

export default function UserTable({ users, actorId }: Props) {
  const [isPending, startTransition] = useTransition();
  const [editUser, setEditUser] = useState<User | null>(null);
  const [resetUser, setResetUser] = useState<User | null>(null);
  const [editRole, setEditRole] = useState<RoleOption | null>(null);
  return (
    <div className="rounded-2xl border border-slate-200 bg-white shadow-sm">
      <div className="w-full overflow-x-auto">
        <table className="w-full divide-y divide-slate-100">
          <thead className="bg-slate-50">
            <tr>
              <th className="px-3 py-3 sm:px-6 text-left text-xs font-medium uppercase tracking-wider text-slate-500">
                Name
              </th>
              <th className="hidden sm:table-cell px-3 py-3 sm:px-6 text-left text-xs font-medium uppercase tracking-wider text-slate-500">
                Email
              </th>
              <th className="min-w-[140px] px-3 py-3 sm:px-6 text-right text-xs font-medium uppercase tracking-wider text-slate-500">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {users.map((u) => (
              <tr key={u.id} className="hover:bg-slate-50/70 transition-colors">
                <td className="px-3 py-3 sm:px-6 text-sm text-slate-900">{u.name ?? "-"}</td>
                <td className="hidden sm:table-cell px-3 py-3 sm:px-6 text-sm text-slate-700">{u.email}</td>
                <td className="min-w-[140px] whitespace-nowrap px-3 py-3 sm:px-6">
                  <div className="flex items-center gap-1 sm:gap-2 justify-end">
                    <button
                      onClick={() => {
                        setEditUser(u);
                        setEditRole(u.role);
                      }}
                      className="rounded-md border border-slate-200 bg-white px-2 py-1 text-xs sm:text-sm text-slate-700 hover:bg-slate-100"
                      title="Edit"
                    >
                      <svg viewBox="0 0 24 24" className="h-4 w-4">
                        <path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04a1 1 0 0 0 0-1.41l-2.34-2.34a1 1 0 0 0-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z" fill="currentColor" />
                      </svg>
                    </button>
                    <button
                      onClick={() => setResetUser(u)}
                      className="rounded-md border border-amber-200 bg-amber-50 px-2 py-1 text-xs sm:text-sm text-amber-700 hover:bg-amber-100"
                      title="Reset Password"
                    >
                      <svg viewBox="0 0 24 24" className="h-4 w-4">
                        <path d="M12 6a6 6 0 1 1-6 6H3l4-4 4 4H8a4 4 0 1 0 4-4V6z" fill="currentColor" />
                      </svg>
                    </button>
                    <button
                      disabled={isPending}
                      onClick={async () => {
                        const result = await Swal.fire({
                          title: "Delete this user?",
                          text: "This action cannot be undone",
                          icon: "warning",
                          showCancelButton: true,
                          confirmButtonColor: "#dc2626",
                          cancelButtonColor: "#64748b",
                          confirmButtonText: "Yes, delete",
                          cancelButtonText: "Cancel",
                          allowOutsideClick: false,
                        });
                        if (result.isConfirmed) {
                          try {
                            await deleteUser(u.id, actorId);
                            await Swal.fire({
                              icon: "success",
                              title: "Success",
                              text: "User deleted successfully",
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
                      aria-label="Delete user"
                      title="Delete user"
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
      {/* Edit User Modal */}
      <div
        className={`fixed inset-0 z-50 bg-black/40 backdrop-blur-sm transition-opacity duration-200 ease-out ${
          editUser ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
        onClick={() => setEditUser(null)}
      />
      <div
        className={`fixed inset-0 z-50 flex items-center justify-center p-4 ${
          editUser ? "pointer-events-auto" : "pointer-events-none"
        }`}
      >
        <div
          className={`w-full max-w-md transform rounded-2xl border border-slate-100 bg-white p-6 shadow-2xl transition-all duration-200 ease-out will-change-transform ${
            editUser ? "opacity-100 scale-100 translate-y-0" : "opacity-0 scale-95 translate-y-2"
          }`}
        >
          <h3 className="text-base font-semibold text-slate-900">Edit User</h3>
          <form
            action={async (fd: FormData) => {
              if (!editUser) return;
              try {
                await updateUser(
                  editUser.id,
                  String(fd.get("name") ?? ""),
                  String(fd.get("email") ?? ""),
                  (editRole ?? "SISWA") as RoleOption,
                  actorId
                );
                await Swal.fire({
                  icon: "success",
                  title: "Success",
                  text: "User updated successfully",
                  timer: 1500,
                  showConfirmButton: false,
                });
                setEditUser(null);
              } catch (err: any) {
                await Swal.fire({
                  icon: "error",
                  title: "Error",
                  text: err?.message ?? "An error occurred",
                });
              }
            }}
            className="mt-4 space-y-4"
          >
            <div>
              <label className="mb-1 block text-sm font-semibold text-slate-800">Name</label>
              <input
                name="name"
                type="text"
                defaultValue={editUser?.name ?? ""}
                className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="mb-1 block text-sm font-semibold text-slate-800">Email</label>
              <input
                name="email"
                type="email"
                defaultValue={editUser?.email}
                className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="mb-1 block text-sm font-semibold text-slate-800">Role</label>
              <select
                name="role"
                value={editRole ?? ""}
                onChange={(e) => setEditRole(e.target.value as RoleOption)}
                className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500"
              >
                <option value="ADMIN">ADMIN</option>
                <option value="GURU">GURU</option>
                <option value="SISWA">SISWA</option>
              </select>
            </div>
            <div className="mt-6 flex justify-end gap-3">
              <button
                type="button"
                onClick={() => setEditUser(null)}
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
      {/* Reset Password Modal */}
      <div
        className={`fixed inset-0 z-50 bg-black/40 backdrop-blur-sm transition-opacity duration-200 ease-out ${
          resetUser ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
        onClick={() => setResetUser(null)}
      />
      <div
        className={`fixed inset-0 z-50 flex items-center justify-center p-4 ${
          resetUser ? "pointer-events-auto" : "pointer-events-none"
        }`}
      >
        <div
          className={`w-full max-w-sm transform rounded-2xl border border-slate-100 bg-white p-6 shadow-2xl transition-all duration-200 ease-out will-change-transform ${
            resetUser ? "opacity-100 scale-100 translate-y-0" : "opacity-0 scale-95 translate-y-2"
          }`}
        >
          <h3 className="text-base font-semibold text-slate-900">Reset Password</h3>
          <form
            action={async (fd: FormData) => {
              if (!resetUser) return;
              try {
                await resetPassword(resetUser.id, String(fd.get("password") ?? ""));
                await Swal.fire({
                  icon: "success",
                  title: "Password reset successfully",
                  timer: 1500,
                  showConfirmButton: false,
                });
                setResetUser(null);
              } catch (err: any) {
                await Swal.fire({
                  icon: "error",
                  title: "Failed to reset password",
                  text: err?.message ?? "An error occurred",
                });
              }
            }}
            className="mt-4 space-y-4"
          >
            <div>
              <label className="mb-1 block text-sm font-semibold text-slate-800">New Password</label>
              <input
                name="password"
                type="password"
                required
                placeholder="New password"
                className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div className="mt-6 flex justify-end gap-3">
              <button
                type="button"
                onClick={() => setResetUser(null)}
                className="rounded-md bg-gray-100 px-4 py-2 text-sm font-medium text-slate-700 transition-colors hover:bg-gray-200"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-blue-700"
              >
                Reset
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
