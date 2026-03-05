"use client";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { usePathname } from "next/navigation";
type Props = { collapsed: boolean; onLogoutClick: () => void };
export default function Sidebar({ collapsed, onLogoutClick }: Props) {
  const { data } = useSession();
  const role = data?.user?.role;
  const pathname = usePathname();
  const base =
    "group flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-all duration-200 ease-in-out";
  const items =
    role === "ADMIN"
      ? [
          { label: "Dashboard", href: "/admin", icon: "home" },
          { label: "User Management", href: "/admin/users", icon: "users" },
          { label: "Subjects", href: "/admin/subjects", icon: "book" },
          { label: "Classes", href: "/admin/classes", icon: "class" },
          { label: "Materials", href: "/admin/materi", icon: "book" },
          { label: "Logout", href: "#", icon: "logout" },
        ]
      : role === "GURU"
      ? [
          { label: "Dashboard", href: "/guru", icon: "home" },
          { label: "Materials", href: "#", icon: "book" },
          { label: "Activity", href: "#", icon: "chart" },
          { label: "Logout", href: "#", icon: "logout" },
        ]
      : [
          { label: "Dashboard", href: "/siswa", icon: "home" },
          { label: "Materials", href: "#", icon: "book" },
          { label: "Activity", href: "#", icon: "chart" },
          { label: "Logout", href: "#", icon: "logout" },
        ];
  const icon = (name: string) => {
    if (name === "home")
      return (
        <svg viewBox="0 0 24 24" className="h-5 w-5">
          <path d="M3 10.5l9-7 9 7V20a2 2 0 0 1-2 2h-4v-7H9v7H5a2 2 0 0 1-2-2v-9.5z" fill="currentColor" />
        </svg>
      );
    if (name === "users")
      return (
        <svg viewBox="0 0 24 24" className="h-5 w-5">
          <path d="M16 11a4 4 0 1 0-4-4 4 4 0 0 0 4 4zm-8 0a3 3 0 1 0-3-3 3 3 0 0 0 3 3zm8 2c-3 0-9 1.5-9 4.5V21h14v-3.5c0-3-6-4.5-5-4.5zM8 14c-2.7 0-6 1.35-6 4v2h6v-2.5c0-.52.14-1.02.4-1.5" fill="currentColor" />
        </svg>
      );
    if (name === "class")
      return (
        <svg viewBox="0 0 24 24" className="h-5 w-5">
          <path d="M3 6l9-4 9 4-9 4-9-4zm0 6l9 4 9-4v6l-9 4-9-4v-6z" fill="currentColor" />
        </svg>
      );
    if (name === "book")
      return (
        <svg viewBox="0 0 24 24" className="h-5 w-5">
          <path d="M6 3h9a3 3 0 0 1 3 3v13l-3-2-3 2-3-2-3 2V6a3 3 0 0 1 3-3z" fill="currentColor" />
        </svg>
      );
    if (name === "chart")
      return (
        <svg viewBox="0 0 24 24" className="h-5 w-5">
          <path d="M4 20h16v-2H4v2zm3-4h2v-6H7v6zm4 0h2V6h-2v10zm4 0h2v-3h-2v3z" fill="currentColor" />
        </svg>
      );
    return (
      <svg viewBox="0 0 24 24" className="h-5 w-5">
        <path d="M16 13v-2H8v2h8zm-4 9a9 9 0 1 0-9-9h2a7 7 0 1 1 7 7v2z" fill="currentColor" />
      </svg>
    );
  };
  return (
    <>
      <aside
      className={`fixed inset-y-0 left-0 z-40 h-screen shrink-0 bg-blue-900 px-4 py-5 text-white transition-all duration-200 ease-in-out ${
        collapsed ? "w-20" : "w-64"
      }`}
    >
      <div className={`mb-4 pb-4 ${collapsed ? "px-0" : "px-1"} border-b border-white/10`}>
        <div className={`font-semibold ${collapsed ? "sr-only" : "block"}`}>Malachi456 Jaya Plus Montessori</div>
        <div className={`text-xs text-white/70 ${collapsed ? "sr-only" : "block"}`}>Internal E-Learning Platform</div>
      </div>
      <div className={`mb-3 px-1 text-[10px] uppercase tracking-wider text-white/60 ${collapsed ? "sr-only" : "block"}`}>
        Menu
      </div>
      <nav className="space-y-1.5 overflow-y-auto pr-1">
        {items.map((it) =>
          it.icon === "logout" ? (
            <button
              key={it.label}
              type="button"
              onClick={onLogoutClick}
              className={`${base} w-full text-left ${collapsed ? "justify-center" : ""} text-white/80 hover:bg-white/10`}
            >
              <span className="text-white">{icon(it.icon)}</span>
              <span className={`${collapsed ? "sr-only" : "block"}`}>{it.label}</span>
            </button>
          ) : (
            <Link
              key={it.label}
              href={it.href}
              className={`${base} ${collapsed ? "justify-center" : ""} ${
                pathname === it.href ? "bg-blue-600 text-white" : "text-white/80 hover:bg-white/10"
              }`}
            >
              <span className="text-white">{icon(it.icon)}</span>
              <span className={`${collapsed ? "sr-only" : "block"}`}>{it.label}</span>
            </Link>
          )
        )}
      </nav>
    </aside>
    </>
  );
}
