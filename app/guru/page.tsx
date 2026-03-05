import Layout from "@/components/dashboard/Layout";
export default function GuruPage() {
  return (
    <Layout>
      <div className="rounded-2xl border border-slate-100 bg-white p-6 shadow-md transition-all duration-200 ease-in-out">
        <div className="mb-3 h-1 w-14 rounded-full bg-yellow-400"></div>
        <h1 className="text-3xl font-semibold text-slate-900">
          Welcome, Teacher
        </h1>
        <p className="mt-2 text-slate-500">
          Manage classes, assignments, and materials efficiently.
        </p>
      </div>
      <section className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        <div className="group rounded-2xl border border-slate-100 bg-white p-6 shadow-md transition-all duration-200 ease-in-out hover:scale-[1.02] hover:shadow-lg">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-blue-700">
                <svg viewBox="0 0 24 24" className="h-5 w-5">
                  <path d="M4 6h16v2H4V6zm0 5h10v2H4v-2zm0 5h7v2H4v-2z" fill="currentColor" />
                </svg>
              </div>
              <div className="text-sm font-medium text-blue-900">Active Classes</div>
            </div>
            <span className="rounded-full bg-blue-50 px-2 py-0.5 text-xs text-blue-700">5</span>
          </div>
          <div className="mt-4 text-3xl font-semibold text-slate-900">5 Classes</div>
          <div className="mt-2 text-sm text-slate-500">
            Monitor learning progress in the classes you teach.
          </div>
        </div>
        <div className="group rounded-2xl border border-slate-100 bg-white p-6 shadow-md transition-all duration-200 ease-in-out hover:scale-[1.02] hover:shadow-lg">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50 text-emerald-700">
                <svg viewBox="0 0 24 24" className="h-5 w-5">
                  <path d="M8 6h13v2H8V6zM3 6h3v2H3V6zm5 5h13v2H8v-2zM3 11h3v2H3v-2zm5 5h13v2H8v-2zM3 16h3v2H3v-2z" fill="currentColor" />
                </svg>
              </div>
              <div className="text-sm font-medium text-blue-900">Latest Assignments</div>
            </div>
            <span className="rounded-full bg-emerald-50 px-2 py-0.5 text-xs text-emerald-700">12</span>
          </div>
          <div className="mt-4 text-3xl font-semibold text-slate-900">12 Assignments</div>
          <div className="mt-2 text-sm text-slate-500">Ready for grading and feedback.</div>
        </div>
        <div className="group rounded-2xl border border-slate-100 bg-white p-6 shadow-md transition-all duration-200 ease-in-out hover:scale-[1.02] hover:shadow-lg">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-purple-50 text-purple-700">
                <svg viewBox="0 0 24 24" className="h-5 w-5">
                  <path d="M11 7h10v2H11V7zM3 7h6v2H3V7zm8 5h10v2H11v-2zM3 12h6v2H3v-2zm8 5h10v2H11v-2zM3 17h6v2H3v-2z" fill="currentColor" />
                </svg>
              </div>
              <div className="text-sm font-medium text-blue-900">Materials</div>
            </div>
            <span className="rounded-full bg-purple-50 px-2 py-0.5 text-xs text-purple-700">24</span>
          </div>
          <div className="mt-4 text-3xl font-semibold text-slate-900">24 Modules</div>
          <div className="mt-2 text-sm text-slate-500">Available for learning.</div>
        </div>
      </section>
    </Layout>
  );
}
