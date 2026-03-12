"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import Sidebar from "@/components/sidebar"
import AppHeader from "@/components/app-header"

export default function ReportsPage() {
  const router = useRouter()

  useEffect(() => {
    const isAuth = localStorage.getItem("auth")
    if (!isAuth) {
      router.push("/login")
    }
  }, [router])

  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar />
      <main className="flex-1 overflow-y-auto">
        <AppHeader title="Reports" subtitle="Generate and view financial reports" />
        <div className="p-8">
          <div className="bg-white dark:bg-slate-900 p-12 rounded-xl border border-slate-200 dark:border-slate-800 text-center">
            <span className="material-symbols-outlined text-6xl text-slate-300 dark:text-slate-700 block mb-4">
              analytics
            </span>
            <h3 className="text-2xl font-bold text-slate-900 dark:text-slate-100 mb-2">
              Reports
            </h3>
            <p className="text-slate-500 dark:text-slate-400">
              Comprehensive financial reports and analytics coming soon.
            </p>
          </div>
        </div>
      </main>
    </div>
  )
}
