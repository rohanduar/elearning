"use client";
import { useState, type ReactNode } from "react";
import { signOut } from "next-auth/react";
import Header from "./Header";
import Sidebar from "./Sidebar";
export default function Layout({ children }: { children: ReactNode }) {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [logoutOpen, setLogoutOpen] = useState(false);
  return (
    <>
      <div className="flex h-screen bg-gray-50">
        <Header
          onToggle={() => {
            if (typeof window !== "undefined" && window.innerWidth < 640) {
              setMobileOpen((v) => !v);
            } else {
              setCollapsed((v) => !v);
            }
          }}
          collapsed={collapsed}
          onLogoutClick={() => setLogoutOpen(true)}
        />
        <div className="hidden md:block">
          <Sidebar collapsed={collapsed} onLogoutClick={() => setLogoutOpen(true)} />
        </div>
        <main
          className={`flex-1 overflow-y-auto p-4 pt-20 md:p-6 md:pt-24 transition-all duration-200 ${
            collapsed ? "md:ml-20" : "md:ml-64"
          }`}
        >
          <div className="w-full px-4 md:px-6">{children}</div>
        </main>
      </div>
      <div
        className={`fixed inset-0 z-40 bg-black/40 backdrop-blur-sm transition-opacity md:hidden ${
          mobileOpen ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
        onClick={() => setMobileOpen(false)}
      />
      <div
        className={`fixed inset-y-0 left-0 z-50 w-64 bg-blue-900/95 px-4 py-5 text-white shadow-xl transition-transform md:hidden ${
          mobileOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <Sidebar collapsed={false} onLogoutClick={() => setLogoutOpen(true)} />
      </div>
      <div
        className={`fixed inset-0 z-[90] bg-black/40 backdrop-blur-sm transition-opacity duration-200 ease-out ${
          logoutOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
        onClick={() => setLogoutOpen(false)}
      />
      <div
        className={`fixed inset-0 z-[100] flex items-center justify-center p-4 ${
          logoutOpen ? "pointer-events-auto" : "pointer-events-none"
        }`}
      >
        <div
          className={`w-full max-w-sm rounded-2xl border border-slate-100 bg-white p-6 shadow-2xl transition-opacity duration-200 ease-out ${
            logoutOpen ? "opacity-100" : "opacity-0"
          }`}
        >
          <h2 className="text-lg font-semibold text-slate-900">Logout Confirmation</h2>
          <p className="mt-2 text-slate-600">Are you sure you want to log out?</p>
          <div className="mt-6 flex justify-end gap-3">
            <button
              type="button"
              onClick={() => setLogoutOpen(false)}
              className="rounded-md bg-gray-100 px-4 py-2 text-sm font-medium text-slate-700 transition-colors hover:bg-gray-200"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={() => signOut({ callbackUrl: "/login" })}
              className="rounded-md bg-red-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-red-700"
            >
              Logout
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
