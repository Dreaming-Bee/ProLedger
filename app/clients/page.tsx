"use client"

import { useEffect, useState, useMemo } from "react"
import { useRouter } from "next/navigation"
import Sidebar from "@/components/sidebar"
import * as XLSX from 'xlsx'
import { saveAs } from 'file-saver'

export default function ClientsPage() {
  const router = useRouter()
  const [searchValue, setSearchValue] = useState("")
  const [searchField, setSearchField] = useState<"all" | "name" | "contact" | "email" | "amount">("all")
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc")
  const [filterType, setFilterType] = useState<"all" | "high" | "low">("all")

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
      totalInvoiced: 12450.00,
    },
    {
      id: 2,
      name: "Global Tech",
      initials: "GT",
      contact: "Sarah Smith",
      email: "s.smith@globaltech.io",
      totalInvoiced: 8900.00,
    },
    {
      id: 3,
      name: "Starlight Inc",
      initials: "SL",
      contact: "Mike Johnson",
      email: "mike@starlight.com",
      totalInvoiced: 22100.00,
    },
    {
      id: 4,
      name: "Urban Design",
      initials: "UD",
      contact: "Elena Rodriguez",
      email: "elena@urbandesign.co",
      totalInvoiced: 5200.00,
    },
    {
      id: 5,
      name: "Nova Solutions",
      initials: "NS",
      contact: "David Chen",
      email: "d.chen@nova.com",
      totalInvoiced: 15750.00,
    },
    {
      id: 6,
      name: "Zenith Agency",
      initials: "ZA",
      contact: "Lisa Wong",
      email: "lisa@zenith.agency",
      totalInvoiced: 3100.00,
    },
  ]

  const filteredClients = useMemo(() => {
    let result = clients.filter(client => {
      if (!searchValue) return true
      const term = searchValue.toLowerCase()
      
      switch (searchField) {
        case "name":
          return client.name.toLowerCase().includes(term)
        case "contact":
          return client.contact.toLowerCase().includes(term)
        case "email":
          return client.email.toLowerCase().includes(term)
        case "amount":
          return client.totalInvoiced.toString().includes(term)
        default:
          return (
            client.name.toLowerCase().includes(term) ||
            client.contact.toLowerCase().includes(term) ||
            client.email.toLowerCase().includes(term)
          )
      }
    })

    if (filterType === "high") {
      result = result.filter(c => c.totalInvoiced > 10000)
    } else if (filterType === "low") {
      result = result.filter(c => c.totalInvoiced <= 10000)
    }

    return result.sort((a, b) => {
      if (sortOrder === "asc") return a.name.localeCompare(b.name)
      return b.name.localeCompare(a.name)
    })
  }, [searchValue, searchField, sortOrder, filterType])

  const handleExport = () => {
    const worksheet = XLSX.utils.json_to_sheet(filteredClients.map(c => ({
      'Client Name': c.name,
      'Contact': c.contact,
      'Email': c.email,
      'Total Invoiced ($)': c.totalInvoiced
    })))
    const workbook = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(workbook, worksheet, "Clients")
    const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' })
    const data = new Blob([excelBuffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8' })
    saveAs(data, `ProLedger_Clients_${new Date().toISOString().split('T')[0]}.xlsx`)
  }

  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar />

      <main className="flex-1 flex flex-col overflow-hidden">
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

        <div className="p-8 pb-4 flex flex-col gap-6 overflow-y-auto">
          {/* Stats Bar */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {stats.map((stat, idx) => (
              <div key={idx} className="bg-white dark:bg-slate-900 p-5 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">{stat.label}</p>
                <div className="flex items-end gap-2">
                  <span className="text-2xl font-black text-slate-900 dark:text-slate-100">{stat.value}</span>
                  {stat.icon === "trending_up" && <span className="text-xs text-green-500 font-bold pb-1">+4%</span>}
                </div>
              </div>
            ))}
          </div>

          <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden flex flex-col">
            {/* Table Toolbar */}
            <div className="p-4 border-b border-slate-200 dark:border-slate-800 flex flex-wrap gap-4 items-center justify-between">
              <div className="flex items-center gap-2 flex-1 max-w-2xl">
                <div className="relative flex-1">
                  <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-[20px]">search</span>
                  <input
                    className="w-full pl-10 pr-4 py-2.5 bg-slate-100 dark:bg-slate-800 border-none rounded-lg text-sm focus:ring-2 focus:ring-primary/20 placeholder:text-slate-400"
                    placeholder={`Search by ${searchField === 'all' ? 'any field' : searchField}...`}
                    type="text"
                    value={searchValue}
                    onChange={(e) => setSearchValue(e.target.value)}
                  />
                </div>
                <select 
                  value={searchField}
                  onChange={(e) => setSearchField(e.target.value as any)}
                  className="px-3 py-2.5 text-xs font-bold bg-slate-100 dark:bg-slate-800 border-none rounded-lg focus:ring-2 focus:ring-primary/20 outline-none uppercase tracking-wider text-slate-500"
                >
                  <option value="all">Search All</option>
                  <option value="name">Client Name</option>
                  <option value="contact">Contact</option>
                  <option value="email">Email</option>
                  <option value="amount">Amount</option>
                </select>
              </div>

              <div className="flex items-center gap-2">
                <select 
                  onChange={(e) => setFilterType(e.target.value as any)}
                  className="px-3 py-2 text-sm font-medium bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg focus:ring-2 focus:ring-primary/20 outline-none"
                >
                  <option value="all">All Billings</option>
                  <option value="high">High Revenue ($10k+)</option>
                  <option value="low">Standard ($0 - $10k)</option>
                </select>
                <button 
                  onClick={() => setSortOrder(prev => prev === "asc" ? "desc" : "asc")}
                  className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-800 transition-colors"
                >
                  <span className="material-symbols-outlined text-[18px]">sort_by_alpha</span>
                  {sortOrder === "asc" ? "A-Z" : "Z-A"}
                </button>
                <button 
                  onClick={handleExport}
                  className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-white bg-slate-800 dark:bg-slate-700 hover:bg-slate-900 rounded-lg transition-colors shadow-sm"
                >
                  <span className="material-symbols-outlined text-[18px]">download</span>
                  Export Excel
                </button>
              </div>
            </div>

            {/* Clients Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50 dark:bg-slate-800/50 border-b border-slate-200 dark:border-slate-800">
                    <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Client Name</th>
                    <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Contact</th>
                    <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Email</th>
                    <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Total Invoiced</th>
                    <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {filteredClients.length > 0 ? (
                    filteredClients.map((client) => (
                      <tr key={client.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors">
                        <td className="px-6 py-5">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded bg-primary/20 flex items-center justify-center text-primary text-[10px] font-bold">
                              {client.initials}
                            </div>
                            <span className="text-sm font-semibold text-slate-900 dark:text-slate-100">{client.name}</span>
                          </div>
                        </td>
                        <td className="px-6 py-5 text-sm text-slate-600 dark:text-slate-400">{client.contact}</td>
                        <td className="px-6 py-5 text-sm text-slate-600 dark:text-slate-400">{client.email}</td>
                        <td className="px-6 py-5 text-sm font-bold text-slate-900 dark:text-slate-100">
                          ${client.totalInvoiced.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                        </td>
                        <td className="px-6 py-5 text-right">
                          <div className="flex items-center justify-end gap-1">
                            <button className="p-2 text-primary hover:bg-primary/10 rounded-lg transition-colors"><span className="material-symbols-outlined text-[20px]">edit</span></button>
                            <button className="p-2 text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"><span className="material-symbols-outlined text-[20px]">history</span></button>
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={5} className="px-6 py-12 text-center text-slate-500">No clients found matching your criteria.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* Pagination Footer */}
            <div className="p-4 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between bg-slate-50 dark:bg-slate-800/30">
              <p className="text-sm text-slate-500 dark:text-slate-400">
                Showing <span className="font-semibold text-slate-900 dark:text-slate-100">{filteredClients.length}</span> of <span className="font-semibold text-slate-100">1,284</span> results
              </p>
              <div className="flex items-center gap-1">
                <button className="p-2 text-slate-400 hover:text-primary transition-colors disabled:opacity-30"><span className="material-symbols-outlined">chevron_left</span></button>
                <button className="w-8 h-8 text-sm font-bold bg-primary text-white rounded flex items-center justify-center">1</button>
                <button className="p-2 text-slate-400 hover:text-primary transition-colors"><span className="material-symbols-outlined">chevron_right</span></button>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}

