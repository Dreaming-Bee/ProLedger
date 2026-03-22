"use client"

import { JSXElementConstructor, Key, ReactElement, ReactNode, ReactPortal, useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Sidebar from "@/components/sidebar"
import AppHeader from "@/components/app-header"

export default function DashboardPage() {
  const router = useRouter()

  useEffect(() => {
    const isAuth = localStorage.getItem("auth")
    if (!isAuth) {
      router.push("/login")
    }
  }, [router])

  const [data, setData] = useState<any>(null)
  const [company, setCompany] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadDashboardData = async () => {
      try {
        const [dashRes, settingsRes] = await Promise.all([
          fetch("/api/dashboard"),
          fetch("/api/settings")
        ])
        if (dashRes.ok && settingsRes.ok) {
          const dashData = await dashRes.json()
          const settingsData = await settingsRes.json()
          setData(dashData)
          setCompany(settingsData)
        }
      } catch (err) {
        console.error("Failed to load dashboard data", err)
      } finally {
        setLoading(false)
      }
    }

    loadDashboardData()
  }, [])

  const formatCurrency = (amount: number) =>
    new Intl.NumberFormat("en-US", { style: "currency", currency: company?.currency || "USD" }).format(amount)

  const stats = data ? [
    {
      label: "Total Revenue",
      value: formatCurrency(data.stats.totalRevenue),
      change: "+12.5%", // These could be calculated if we had historical data
      trend: "up",
      icon: "account_balance",
      bgColor: "bg-primary/10",
      iconColor: "text-primary",
    },
    {
      label: "Pending Amount",
      value: formatCurrency(data.stats.pendingAmount),
      change: "+3.2%",
      trend: "up",
      icon: "pending_actions",
      bgColor: "bg-amber-100",
      iconColor: "text-amber-600",
    },
    {
      label: "Paid Invoices",
      value: data.stats.breakdown.paid.toString(),
      change: "+8.4%",
      trend: "up",
      icon: "check_circle",
      bgColor: "bg-green-100",
      iconColor: "text-green-600",
    },
    {
      label: "Overdue Invoices",
      value: data.stats.breakdown.overdue.toString(),
      change: "-2.1%",
      trend: "down",
      icon: "error_outline",
      bgColor: "bg-red-100",
      iconColor: "text-red-600",
      textColor: "text-red-600",
    },
  ] : []

  const recentInvoices = data ? data.recentInvoices.map((inv: any) => ({
    id: inv.id,
    client: inv.client.name,
    invoice: inv.number,
    initials: inv.client.initials,
    date: new Date(inv.date).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }),
    amount: formatCurrency(inv.total),
    status: inv.status,
    statusColor: inv.statusColor.replace("text-", "text-").replace("bg-", "bg-"), // Ensure correct classes
    statusDot: inv.statusDot,
  })) : []

  return (
    <div className="flex h-screen overflow-hidden">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto">
        {/* Header */}
        <AppHeader
          title="Main Dashboard"
          searchPlaceholder="Search invoices..."
        />

        {/* Content */}
        {loading ? (
          <div className="p-8 flex items-center justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary" />
          </div>
        ) : (
          <div className="p-8 space-y-8">
          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {stats.map((stat, idx) => (
              <div
                key={idx}
                className={`bg-white dark:bg-slate-900 p-6 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm ${stat.label === "Overdue Invoices"
                    ? "border-l-4 border-l-red-500"
                    : ""
                  }`}
              >
                <div className="flex justify-between items-start mb-4">
                  <div className={`p-2 ${stat.bgColor} rounded-lg ${stat.iconColor}`}>
                    <span className="material-symbols-outlined">
                      {stat.icon}
                    </span>
                  </div>
                  <span
                    className={`text-xs font-medium px-2 py-1 rounded-full ${stat.trend === "up"
                        ? stat.label === "Overdue Invoices"
                          ? "text-red-600 bg-red-50"
                          : "text-green-600 bg-green-50"
                        : "text-slate-600 bg-slate-50"
                      }`}
                  >
                    {stat.change}
                  </span>
                </div>
                <p className="text-sm text-slate-500 dark:text-slate-400 font-medium">
                  {stat.label}
                </p>
                <h3
                  className={`text-2xl font-bold mt-1 ${stat.textColor ? stat.textColor : ""
                    }`}
                >
                  {stat.value}
                </h3>
              </div>
            ))}
          </div>

          {/* Revenue Trends & Recent Invoices */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Chart Section */}
            <div className="lg:col-span-1 bg-white dark:bg-slate-900 p-6 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col">
              <div className="flex items-center justify-between mb-8">
                <div>
                  <h4 className="font-bold text-slate-900 dark:text-slate-100">
                    Revenue Trends
                  </h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Monthly overview
                  </p>
                </div>
                <select className="bg-slate-50 dark:bg-slate-800 border-none text-xs rounded-lg focus:ring-0">
                  <option>Last 6 months</option>
                  <option>Last year</option>
                </select>
              </div>

              {/* Simple Bar Chart */}
              <div className="flex-1 flex items-end justify-between gap-2 h-48 px-2">
                {[60, 45, 75, 100, 40, 85].map((height, idx) => (
                  <div
                    key={idx}
                    className="flex flex-col items-center gap-2 w-full"
                  >
                    <div
                      className={`w-full rounded-t-lg relative group transition-all ${idx === 3
                          ? "bg-primary"
                          : "bg-slate-100 dark:bg-slate-800"
                        }`}
                      style={{ height: `${height}%` }}
                    >
                      <div className="absolute inset-0 bg-primary/20 rounded-t-lg opacity-0 group-hover:opacity-100 transition-opacity" />
                    </div>
                    <span className="text-[10px] font-bold text-slate-400 uppercase">
                      {["Jan", "Feb", "Mar", "Apr", "May", "Jun"][idx]}
                    </span>
                  </div>
                ))}
              </div>

              <div className="mt-6 pt-6 border-t border-slate-100 dark:border-slate-800">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-medium text-slate-600 dark:text-slate-400">
                    Monthly Avg.
                  </p>
                  <p className="text-sm font-bold text-slate-900 dark:text-slate-100">
                    $21,405
                  </p>
                </div>
              </div>
            </div>

            {/* Recent Invoices Table */}
            <div className="lg:col-span-2 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden flex flex-col">
              <div className="p-6 flex items-center justify-between border-b border-slate-200 dark:border-slate-800">
                <div>
                  <h4 className="font-bold text-slate-900 dark:text-slate-100">
                    Recent Invoices
                  </h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Manage your latest transactions
                  </p>
                </div>
                <button 
                  onClick={() => router.push("/invoices/create")}
                  className="px-4 py-2 bg-primary text-white text-xs font-bold rounded-lg flex items-center gap-2 hover:bg-primary/90 transition-colors"
                >
                  <span className="material-symbols-outlined text-sm">add</span>
                  Create Invoice
                </button>
              </div>

              <div className="flex-1 overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead className="bg-slate-50 dark:bg-slate-800/50 border-b border-slate-200 dark:border-slate-800">
                    <tr>
                      <th className="px-6 py-3 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                        Client
                      </th>
                      <th className="px-6 py-3 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                        Date
                      </th>
                      <th className="px-6 py-3 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                        Amount
                      </th>
                      <th className="px-6 py-3 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                        Status
                      </th>
                      <th className="px-6 py-3 text-right" />
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                    {recentInvoices.map((invoice: { id: Key | null | undefined; initials: string | number | bigint | boolean | ReactElement<unknown, string | JSXElementConstructor<any>> | Iterable<ReactNode> | ReactPortal | Promise<string | number | bigint | boolean | ReactPortal | ReactElement<unknown, string | JSXElementConstructor<any>> | Iterable<ReactNode> | null | undefined> | null | undefined; client: string | number | bigint | boolean | ReactElement<unknown, string | JSXElementConstructor<any>> | Iterable<ReactNode> | ReactPortal | Promise<string | number | bigint | boolean | ReactPortal | ReactElement<unknown, string | JSXElementConstructor<any>> | Iterable<ReactNode> | null | undefined> | null | undefined; invoice: string | number | bigint | boolean | ReactElement<unknown, string | JSXElementConstructor<any>> | Iterable<ReactNode> | ReactPortal | Promise<string | number | bigint | boolean | ReactPortal | ReactElement<unknown, string | JSXElementConstructor<any>> | Iterable<ReactNode> | null | undefined> | null | undefined; date: string | number | bigint | boolean | ReactElement<unknown, string | JSXElementConstructor<any>> | Iterable<ReactNode> | ReactPortal | Promise<string | number | bigint | boolean | ReactPortal | ReactElement<unknown, string | JSXElementConstructor<any>> | Iterable<ReactNode> | null | undefined> | null | undefined; amount: string | number | bigint | boolean | ReactElement<unknown, string | JSXElementConstructor<any>> | Iterable<ReactNode> | ReactPortal | Promise<string | number | bigint | boolean | ReactPortal | ReactElement<unknown, string | JSXElementConstructor<any>> | Iterable<ReactNode> | null | undefined> | null | undefined; statusColor: any; statusDot: any; status: string | number | bigint | boolean | ReactElement<unknown, string | JSXElementConstructor<any>> | Iterable<ReactNode> | ReactPortal | Promise<string | number | bigint | boolean | ReactPortal | ReactElement<unknown, string | JSXElementConstructor<any>> | Iterable<ReactNode> | null | undefined> | null | undefined }) => (
                      <tr
                        key={invoice.id}
                        className="hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors"
                      >
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className="size-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold text-xs">
                              {invoice.initials}
                            </div>
                            <div>
                              <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                                {invoice.client}
                              </p>
                              <p className="text-xs text-slate-500 dark:text-slate-400">
                                {invoice.invoice}
                              </p>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-sm text-slate-600 dark:text-slate-400">
                          {invoice.date}
                        </td>
                        <td className="px-6 py-4 text-sm font-bold text-slate-900 dark:text-slate-100">
                          {invoice.amount}
                        </td>
                        <td className="px-6 py-4">
                          <span
                            className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-medium ${invoice.statusColor}`}
                          >
                            <span
                              className={`size-1.5 rounded-full ${invoice.statusDot}`}
                            />
                            {invoice.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-right">
                          <button className="text-slate-400 hover:text-primary transition-colors">
                            <span className="material-symbols-outlined">
                              more_vert
                            </span>
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="p-4 bg-slate-50 dark:bg-slate-800/50 flex justify-center border-t border-slate-200 dark:border-slate-800">
                <button 
                  onClick={() => router.push("/invoices")}
                  className="text-primary text-xs font-bold hover:underline"
                >
                  View All Invoices
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </main>
  </div>
)
}
