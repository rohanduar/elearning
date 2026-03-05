"use client";
import { useEffect, useState } from "react";
import { createUser } from "@/app/admin/users/actions";
import Swal from "sweetalert2";

type RoleOption = "ADMIN" | "GURU" | "SISWA";

export default function UserModal({
  inline = false,
  selectedRole = "ADMIN",
}: {
  inline?: boolean;
  selectedRole?: RoleOption;
}) {
  const [open, setOpen] = useState(false);
  const [role, setRole] = useState<RoleOption>(selectedRole);
  useEffect(() => {
    setRole(selectedRole);
  }, [selectedRole]);
  return (
    <>
      {inline ? (
        <button
          onClick={() => setOpen(true)}
          className="h-10 rounded-lg bg-blue-600 px-4 text-sm font-medium text-white shadow-sm transition-colors hover:bg-blue-700"
        >
          Add User
        </button>
      ) : (
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-slate-900">User Management</h2>
          <button
            onClick={() => setOpen(true)}
            className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-700"
          >
            Add User
          </button>
        </div>
      )}
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
          <h3 className="text-base font-semibold text-slate-900">Add New User</h3>
          <form
            action={async (fd: FormData) => {
              const result = await createUser(fd);
              if (result && (result as any).success === false) {
                await Swal.fire({
                  icon: "error",
                  title: "Error",
                  text: (result as any).message ?? "An error occurred",
                });
                return;
              }
              await Swal.fire({
                icon: "success",
                title: "Success",
                text: "User added successfully",
                timer: 1500,
                showConfirmButton: false,
              });
              setOpen(false);
            }}
            className="mt-4 space-y-4"
          >
            <div>
              <label className="mb-1 block text-sm font-semibold text-slate-800">Name</label>
              <input
                name="name"
                type="text"
                required
                placeholder="Full name"
                className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="mb-1 block text-sm font-semibold text-slate-800">Email</label>
              <input
                name="email"
                type="email"
                required
                placeholder="email@domain.com"
                className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="mb-1 block text-sm font-semibold text-slate-800">Password</label>
              <input
                name="password"
                type="password"
                required
                placeholder="Minimum 8 characters"
                className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="mb-1 block text-sm font-semibold text-slate-800">Role</label>
              {selectedRole !== "ADMIN" && (
                <input type="hidden" name="role" value={selectedRole} />
              )}
              <select
                name="role"
                value={role}
                onChange={(e) => setRole(e.target.value as RoleOption)}
                className={`w-full rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-900 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500 ${
                  selectedRole !== "ADMIN" ? "pointer-events-none bg-slate-100 opacity-80" : "bg-white"
                }`}
              >
                <option value="ADMIN">ADMIN</option>
                <option value="GURU">GURU</option>
                <option value="SISWA">SISWA</option>
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
