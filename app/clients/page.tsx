"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Sidebar from "@/components/sidebar"

export default function ClientsPage() {
  const router = useRouter()
  const [searchValue, setSearchValue] = useState("")

  useEffect(() => {
    const isAuth = localStorage.getItem("auth")
    if (!isAuth) {
      router.push("/login")
    }
  }, [router])

  const stats = [
    {
      label: "Total Active Clients",
      value: "1,284",
      change: "+4%",
      icon: "trending_up",
    },
    {
      label: "Pending Invoices",
      value: "$42,850",
      sublabel: "12 clients",
    },
    {
      label: "Retention Rate",
      value: "98.2%",
      icon: "verified",
      sublabel: "High",
    },
  ]

  const clients = [
    {
      id: 1,
      name: "Acme Corp",
      initials: "AC",
      contact: "John Doe",
      email: "john@acme.com",
      totalInvoiced: "$12,450.00",
    },
    {
      id: 2,
      name: "Global Tech",
      initials: "GT",
      contact: "Sarah Smith",
      email: "s.smith@globaltech.io",
      totalInvoiced: "$8,900.00",
    },
    {
      id: 3,
      name: "Starlight Inc",
      initials: "SL",
      contact: "Mike Johnson",
      email: "mike@starlight.com",
      totalInvoiced: "$22,100.00",
    },
    {
      id: 4,
      name: "Urban Design",
      initials: "UD",
      contact: "Elena Rodriguez",
      email: "elena@urbandesign.co",
      totalInvoiced: "$5,200.00",
    },
  ]

  return (
    <div className="flex h-screen overflow-hidden">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <main className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="h-20 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between px-8 flex-shrink-0">
          <div>
            <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100 tracking-tight">
              Client Directory
            </h2>
            <p className="text-sm text-slate-500 dark:text-slate-400">
              Manage and track your business relationships
            </p>
          </div>
          <div className="flex items-center gap-4">
            <button className="p-2 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors relative">
              <span className="material-symbols-outlined">notifications</span>
              <span className="absolute top-2 right-2 w-2 h-2 bg-primary rounded-full" />
            </button>
            <button 
              onClick={() => router.push("/clients/add")}
              className="flex items-center gap-2 bg-primary hover:bg-primary/90 text-white px-5 py-2.5 rounded-lg text-sm font-bold transition-all shadow-lg shadow-primary/20"
            >
              <span className="material-symbols-outlined text-[20px]">
                person_add
              </span>
              <span>Add New Client</span>
            </button>
          </div>
        </header>

        {/* Content */}
        <div className="p-8 pb-4 flex flex-col gap-6 overflow-y-auto">
          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {stats.map((stat, idx) => (
              <div
                key={idx}
                className="bg-white dark:bg-slate-900 p-5 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm"
              >
                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">
                  {stat.label}
                </p>
                <div className="flex items-end gap-2">
                  <span className="text-2xl font-black text-slate-900 dark:text-slate-100">
                    {stat.value}
                  </span>
                  {stat.icon && (
                    <span className="text-xs font-bold pb-1 flex items-center gap-0.5">
                      {stat.icon === "trending_up" && (
                        <>
                          <span className="material-symbols-outlined text-[14px] text-green-500">
                            trending_up
                          </span>
                          <span className="text-green-500">+4%</span>
                        </>
                      )}
                      {stat.icon === "verified" && (
                        <>
                          <span className="material-symbols-outlined text-[14px] text-primary">
                            verified
                          </span>
                          <span className="text-primary">High</span>
                        </>
                      )}
                    </span>
                  )}
                  {stat.sublabel && (
                    <span className="text-xs text-slate-500 font-bold pb-1">
                      {stat.sublabel}
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Table Container */}
          <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden flex flex-col">
            {/* Toolbar */}
            <div className="p-4 border-b border-slate-200 dark:border-slate-800 flex flex-wrap gap-4 items-center justify-between">
              <div className="relative w-full max-w-md">
                <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-[20px]">
                  search
                </span>
                <input
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-100 dark:bg-slate-800 border-none rounded-lg text-sm focus:ring-2 focus:ring-primary/20 placeholder:text-slate-400"
                  placeholder="Search clients by name, contact or email..."
                  type="text"
                  value={searchValue}
                  onChange={(e) => setSearchValue(e.target.value)}
                />
              </div>
              <div className="flex items-center gap-2">
                <button className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-800">
                  <span className="material-symbols-outlined text-[18px]">
                    filter_list
                  </span>
                  Filter
                </button>
                <button className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-800">
                  <span className="material-symbols-outlined text-[18px]">
                    download
                  </span>
                  Export
                </button>
              </div>
            </div>

            {/* Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50 dark:bg-slate-800/50 border-b border-slate-200 dark:border-slate-800">
                    <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">
                      Client Name
                    </th>
                    <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">
                      Contact Person
                    </th>
                    <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">
                      Email Address
                    </th>
                    <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">
                      Total Invoiced
                    </th>
                    <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider text-right">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {clients.map((client) => (
                    <tr
                      key={client.id}
                      className="hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors"
                    >
                      <td className="px-6 py-5">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded bg-primary/20 flex items-center justify-center text-primary text-[10px] font-bold">
                            {client.initials}
                          </div>
                          <span className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                            {client.name}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-5 text-sm text-slate-600 dark:text-slate-400">
                        {client.contact}
                      </td>
                      <td className="px-6 py-5 text-sm text-slate-600 dark:text-slate-400">
                        {client.email}
                      </td>
                      <td className="px-6 py-5 text-sm font-bold text-slate-900 dark:text-slate-100">
                        {client.totalInvoiced}
                      </td>
                      <td className="px-6 py-5 text-right">
                        <div className="flex items-center justify-end gap-1">
                          <button
                            className="p-2 text-primary hover:bg-primary/10 rounded-lg transition-colors"
                            title="Edit Client"
                          >
                            <span className="material-symbols-outlined text-[20px]">
                              edit
                            </span>
                          </button>
                          <button
                            className="p-2 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
                            title="View History"
                          >
                            <span className="material-symbols-outlined text-[20px]">
                              history
                            </span>
                          </button>
                          <button className="p-2 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors">
                            <span className="material-symbols-outlined text-[20px]">
                              more_vert
                            </span>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            <div className="p-4 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between bg-slate-50 dark:bg-slate-800/30">
              <p className="text-sm text-slate-500 dark:text-slate-400">
                Showing{" "}
                <span className="font-semibold text-slate-900 dark:text-slate-100">
                  1
                </span>{" "}
                to{" "}
                <span className="font-semibold text-slate-900 dark:text-slate-100">
                  10
                </span>{" "}
                of{" "}
                <span className="font-semibold text-slate-900 dark:text-slate-100">
                  1,284
                </span>{" "}
                results
              </p>
              <div className="flex items-center gap-1">
                <button className="p-2 text-slate-400 hover:text-primary transition-colors disabled:opacity-30">
                  <span className="material-symbols-outlined">chevron_left</span>
                </button>
                <button className="w-8 h-8 text-sm font-bold bg-primary text-white rounded flex items-center justify-center">
                  1
                </button>
                <button className="w-8 h-8 text-sm font-medium text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700 rounded flex items-center justify-center">
                  2
                </button>
                <button className="w-8 h-8 text-sm font-medium text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700 rounded flex items-center justify-center">
                  3
                </button>
                <span className="px-2 text-slate-400">...</span>
                <button className="w-8 h-8 text-sm font-medium text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700 rounded flex items-center justify-center">
                  128
                </button>
                <button className="p-2 text-slate-400 hover:text-primary transition-colors">
                  <span className="material-symbols-outlined">chevron_right</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
