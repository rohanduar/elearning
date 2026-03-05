"use client";
import { useSession } from "next-auth/react";
type Props = { onToggle: () => void; collapsed: boolean; onLogoutClick: () => void };
export default function Header({ onToggle, collapsed, onLogoutClick }: Props) {
  const { data } = useSession();
  const name = data?.user?.name ?? "User";
  const role = data?.user?.role;
  const roleLabel = role === "ADMIN" ? "School Admin" : role === "GURU" ? "Teacher" : role === "SISWA" ? "Student" : "";
  const leftClass = collapsed ? "md:left-20" : "md:left-64";
  return (
    <header className={`fixed top-0 left-0 right-0 z-40 h-16 bg-white text-slate-900 shadow-sm ${leftClass}`}>
      <div className="mx-auto flex h-full max-w-full items-center justify-between px-4 md:px-6">
        <button
          onClick={onToggle}
          aria-label="Toggle sidebar"
          className="rounded-md p-2 transition-all duration-200 ease-in-out hover:bg-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-200"
        >
          <span className="block h-0.5 w-6 bg-slate-900"></span>
          <span className="mt-1 block h-0.5 w-6 bg-slate-900"></span>
          <span className="mt-1 block h-0.5 w-6 bg-slate-900"></span>
        </button>
        <div />
        <div className="flex items-center gap-3">
          <div className="hidden text-sm md:block">
            {name}
            {roleLabel ? ` • ${roleLabel}` : ""}
          </div>
          <div className="hidden h-8 w-8 items-center justify-center rounded-full bg-slate-100 text-xs font-semibold md:flex">
            {name.substring(0, 1).toUpperCase()}
          </div>
          <button
            onClick={onLogoutClick}
            className="rounded-md border border-slate-300 bg-white px-3 py-1.5 text-sm font-medium text-slate-900 transition-all duration-200 ease-in-out hover:bg-slate-50"
          >
            Logout
          </button>
        </div>
      </div>
    </header>
  );
}
