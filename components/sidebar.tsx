"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"

interface NavItem {
  label: string
  href: string
  icon: string
  exact?: boolean
}

const navItems: NavItem[] = [
  { label: "Dashboard", href: "/dashboard", icon: "dashboard", exact: true },
  { label: "Invoices", href: "/invoices", icon: "description" },
  { label: "Clients", href: "/clients", icon: "group" },
  { label: "Payments", href: "/payments", icon: "payments" },
  { label: "Reports", href: "/reports", icon: "analytics" },
]

export default function Sidebar() {
  const pathname = usePathname()

  return (
    <aside className="w-64 flex-shrink-0 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 flex flex-col no-print">
      {/* Logo */}
      <div className="p-6 flex items-center gap-3">
        <div className="size-10 bg-primary rounded-lg flex items-center justify-center text-white">
          <span className="material-symbols-outlined">account_balance_wallet</span>
        </div>
        <div>
          <h1 className="text-lg font-bold leading-none">ProLedger</h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Invoice Management
          </p>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4 py-4 space-y-1">
        {navItems.map((item) => {
          const isActive = item.exact
            ? pathname === item.href
            : pathname.startsWith(item.href)

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 ${
                isActive
                  ? "bg-primary/10 text-primary font-medium"
                  : "text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
              }`}
            >
              <span className="material-symbols-outlined">{item.icon}</span>
              <span>{item.label}</span>
            </Link>
          )
        })}
      </nav>

      {/* Settings & Upgrade */}
      <div className="px-4 py-6 border-t border-slate-200 dark:border-slate-800 space-y-4">
        <Link
          href="/settings"
          className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
        >
          <span className="material-symbols-outlined">settings</span>
          <span>Settings</span>
        </Link>

        {/* Upgrade Card */}
        <div className="p-4 bg-primary/5 rounded-xl">
          <p className="text-xs font-semibold text-primary uppercase tracking-wider mb-2">
            Upgrade Pro
          </p>
          <p className="text-xs text-slate-500 dark:text-slate-400 mb-3">
            Get unlimited invoices and premium support.
          </p>
          <button className="w-full py-2 bg-primary text-white text-xs font-bold rounded-lg hover:bg-primary/90 transition-colors">
            Upgrade Now
          </button>
        </div>
      </div>
    </aside>
  )
}
