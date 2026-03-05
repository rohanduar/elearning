import Layout from "@/components/dashboard/Layout";
export default function SiswaPage() {
  return (
    <Layout>
      <div className="rounded-2xl border border-slate-100 bg-white p-6 shadow-md transition-all duration-200 ease-in-out">
        <div className="mb-3 h-1 w-14 rounded-full bg-yellow-400"></div>
        <h1 className="text-3xl font-semibold text-slate-900">
          Welcome, Student
        </h1>
        <p className="mt-2 text-slate-500">
          See the latest materials, complete assignments, and track your progress.
        </p>
      </div>
      <section className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        <div className="group rounded-2xl border border-slate-100 bg-white p-6 shadow-md transition-all duration-200 ease-in-out hover:scale-[1.02] hover:shadow-lg">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-50 text-indigo-700">
                <svg viewBox="0 0 24 24" className="h-5 w-5">
                  <path d="M11 7h10v2H11V7zM3 7h6v2H3V7zm8 5h10v2H11v-2zM3 12h6v2H3v-2zm8 5h10v2H11v-2zM3 17h6v2H3v-2z" fill="currentColor" />
                </svg>
              </div>
              <div className="text-sm font-medium text-blue-900">This Week&apos;s Materials</div>
            </div>
            <span className="rounded-full bg-indigo-50 px-2 py-0.5 text-xs text-indigo-700">8</span>
          </div>
          <div className="mt-4 text-3xl font-semibold text-slate-900">8 Modules</div>
          <div className="mt-2 text-sm text-slate-500">
            Ready to study according to the class schedule.
          </div>
        </div>
        <div className="group rounded-2xl border border-slate-100 bg-white p-6 shadow-md transition-all duration-200 ease-in-out hover:scale-[1.02] hover:shadow-lg">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-rose-50 text-rose-700">
                <svg viewBox="0 0 24 24" className="h-5 w-5">
                  <path d="M8 6h13v2H8V6zM3 6h3v2H3V6zm5 5h13v2H8v-2zM3 11h3v2H3v-2zm5 5h13v2H8v-2zM3 16h3v2H3v-2z" fill="currentColor" />
                </svg>
              </div>
              <div className="text-sm font-medium text-blue-900">Active Assignments</div>
            </div>
            <span className="rounded-full bg-rose-50 px-2 py-0.5 text-xs text-rose-700">4</span>
          </div>
          <div className="mt-4 text-3xl font-semibold text-slate-900">4 Assignments</div>
          <div className="mt-2 text-sm text-slate-500">
            Make sure to submit assignments on time.
          </div>
        </div>
        <div className="group rounded-2xl border border-slate-100 bg-white p-6 shadow-md transition-all duration-200 ease-in-out hover:scale-[1.02] hover:shadow-lg">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-50 text-amber-700">
                <svg viewBox="0 0 24 24" className="h-5 w-5">
                  <path d="M4 6h16v2H4V6zm0 5h16v2H4v-2zm0 5h16v2H4v-2z" fill="currentColor" />
                </svg>
              </div>
              <div className="text-sm font-medium text-blue-900">Activity</div>
            </div>
            <span className="rounded-full bg-amber-50 px-2 py-0.5 text-xs text-amber-700">7</span>
          </div>
          <div className="mt-4 text-3xl font-semibold text-slate-900">7 Activities</div>
          <div className="mt-2 text-sm text-slate-500">Your latest activities.</div>
        </div>
      </section>
    </Layout>
  );
}
