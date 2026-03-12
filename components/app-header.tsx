"use client"

import { useRouter } from "next/navigation"
import { useState } from "react"

interface AppHeaderProps {
  title: string
  subtitle?: string
  searchPlaceholder?: string
}

export default function AppHeader({
  title,
  subtitle,
  searchPlaceholder = "Search invoices...",
}: AppHeaderProps) {
  const router = useRouter()
  const [searchValue, setSearchValue] = useState("")

  const handleLogout = () => {
    localStorage.removeItem("auth")
    localStorage.removeItem("user")
    router.push("/login")
  }

  return (
    <header className="sticky top-0 z-10 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 px-8 py-4 flex items-center justify-between no-print">
      <div>
        <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100">
          {title}
        </h2>
        {subtitle && (
          <p className="text-sm text-slate-500 dark:text-slate-400">{subtitle}</p>
        )}
      </div>

      <div className="flex items-center gap-6">
        {/* Search */}
        <div className="relative w-64 group hidden sm:block">
          <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary transition-colors">
            search
          </span>
          <input
            className="w-full pl-10 pr-4 py-2 bg-slate-100 dark:bg-slate-800 border-none rounded-lg text-sm focus:ring-2 focus:ring-primary/20 focus:outline-none placeholder-slate-500"
            placeholder={searchPlaceholder}
            type="text"
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
          />
        </div>

        {/* Icons */}
        <div className="flex items-center gap-2">
          <button className="p-2 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors">
            <span className="material-symbols-outlined">notifications</span>
          </button>

          <div className="h-8 w-px bg-slate-200 dark:bg-slate-800 mx-2" />

          {/* User Profile */}
          <div className="flex items-center gap-3 pl-2">
            <div className="text-right hidden sm:block">
              <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                Alex Rivera
              </p>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Administrator
              </p>
            </div>

            <img
              alt="User Profile"
              className="size-10 rounded-full border-2 border-primary/20 object-cover"
              src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=40&h=40&fit=crop"
            />

            <button
              onClick={handleLogout}
              className="ml-2 p-2 text-slate-500 hover:text-red-500 transition-colors"
              title="Logout"
            >
              <span className="material-symbols-outlined">logout</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  )
}
