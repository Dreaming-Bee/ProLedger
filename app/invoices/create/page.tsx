"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"

export default function CreateInvoicePage() {
  const router = useRouter()
  const [lineItems, setLineItems] = useState([
    { id: 1, description: "Branding & Identity Suite", qty: 1, price: 2500 },
    { id: 2, description: "UI/UX Design - Mobile App", qty: 40, price: 85 },
  ])
  const [taxRate, setTaxRate] = useState(8)

  useEffect(() => {
    const isAuth = localStorage.getItem("auth")
    if (!isAuth) {
      router.push("/login")
    }
  }, [router])

  const subtotal = lineItems.reduce((sum, item) => sum + item.qty * item.price, 0)
  const tax = (subtotal * taxRate) / 100
  const total = subtotal + tax

  const addLineItem = () => {
    const newId = Math.max(...lineItems.map((i) => i.id)) + 1
    setLineItems([
      ...lineItems,
      { id: newId, description: "", qty: 1, price: 0 },
    ])
  }

  const removeLineItem = (id: number) => {
    setLineItems(lineItems.filter((item) => item.id !== id))
  }

  const updateLineItem = (id: number, field: string, value: any) => {
    setLineItems(
      lineItems.map((item) =>
        item.id === id ? { ...item, [field]: value } : item
      )
    )
  }

  return (
    <div className="layout-container flex h-full grow flex-col bg-background-light dark:bg-background-dark text-slate-900 dark:text-slate-100">
      {/* Header */}
      <header className="flex items-center justify-between whitespace-nowrap border-b border-solid border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-6 md:px-10 py-4 sticky top-0 z-10">
        <div className="flex items-center gap-4">
          <div className="text-primary">
            <span className="material-symbols-outlined text-3xl">
              account_balance_wallet
            </span>
          </div>
          <h2 className="text-slate-900 dark:text-slate-100 text-lg font-bold leading-tight tracking-tight">
            ProLedger
          </h2>
        </div>
        <div className="flex gap-3">
          <button
            onClick={() => router.back()}
            className="flex min-w-[84px] cursor-pointer items-center justify-center rounded-lg h-10 px-5 bg-slate-200 dark:bg-slate-800 text-slate-900 dark:text-slate-100 text-sm font-bold transition-colors hover:bg-slate-300 dark:hover:bg-slate-700"
          >
            Cancel
          </button>
          <button className="flex min-w-[84px] cursor-pointer items-center justify-center rounded-lg h-10 px-5 bg-primary text-white text-sm font-bold transition-opacity hover:opacity-90">
            Save Invoice
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-5xl mx-auto w-full p-6 md:p-10 space-y-8 overflow-y-auto">
        {/* Title */}
        <div className="flex flex-col gap-2">
          <h1 className="text-slate-900 dark:text-slate-100 text-3xl md:text-4xl font-black tracking-tight">
            Create New Invoice
          </h1>
          <p className="text-slate-500 dark:text-slate-400 text-sm">
            Fill in the details below to generate a new professional invoice.
          </p>
        </div>

        {/* Meta Information */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 bg-white dark:bg-slate-900 p-6 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="flex flex-col gap-2">
            <label className="text-slate-700 dark:text-slate-300 text-sm font-semibold">
              Client Selection
            </label>
            <div className="relative">
              <select className="w-full rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 h-11 focus:ring-2 focus:ring-primary focus:border-primary appearance-none px-3">
                <option>Select a client</option>
                <option>Acme Corp</option>
                <option>Global Industries</option>
                <option>Design Studio X</option>
              </select>
              <span className="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none">
                expand_more
              </span>
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-slate-700 dark:text-slate-300 text-sm font-semibold">
              Invoice #
            </label>
            <input
              className="w-full rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 h-11 focus:ring-2 focus:ring-primary focus:border-primary px-3"
              type="text"
              defaultValue="INV-2023-0042"
            />
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-slate-700 dark:text-slate-300 text-sm font-semibold">
              Issue Date
            </label>
            <input
              className="w-full rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 h-11 focus:ring-2 focus:ring-primary focus:border-primary px-3"
              type="date"
              defaultValue="2023-10-24"
            />
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-slate-700 dark:text-slate-300 text-sm font-semibold">
              Due Date
            </label>
            <input
              className="w-full rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 h-11 focus:ring-2 focus:ring-primary focus:border-primary px-3"
              type="date"
              defaultValue="2023-11-24"
            />
          </div>
        </div>

        {/* Line Items Table */}
        <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 dark:bg-slate-800/50 border-b border-slate-200 dark:border-slate-800">
                  <th className="px-6 py-4 text-sm font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                    Description
                  </th>
                  <th className="px-6 py-4 text-sm font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider w-24 text-center">
                    Qty
                  </th>
                  <th className="px-6 py-4 text-sm font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider w-40">
                    Unit Price
                  </th>
                  <th className="px-6 py-4 text-sm font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider w-32 text-right">
                    Total
                  </th>
                  <th className="px-6 py-4 w-16" />
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {lineItems.map((item) => (
                  <tr key={item.id}>
                    <td className="px-6 py-4">
                      <input
                        className="w-full border-none bg-transparent focus:ring-0 text-slate-900 dark:text-slate-100 p-0 placeholder:text-slate-400"
                        placeholder="Item description"
                        type="text"
                        value={item.description}
                        onChange={(e) =>
                          updateLineItem(item.id, "description", e.target.value)
                        }
                      />
                    </td>
                    <td className="px-6 py-4">
                      <input
                        className="w-full border-none bg-transparent focus:ring-0 text-center text-slate-900 dark:text-slate-100 p-0"
                        type="number"
                        value={item.qty}
                        onChange={(e) =>
                          updateLineItem(
                            item.id,
                            "qty",
                            parseInt(e.target.value) || 0
                          )
                        }
                      />
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-1">
                        <span className="text-slate-400">$</span>
                        <input
                          className="w-full border-none bg-transparent focus:ring-0 text-slate-900 dark:text-slate-100 p-0"
                          type="number"
                          value={item.price}
                          onChange={(e) =>
                            updateLineItem(
                              item.id,
                              "price",
                              parseFloat(e.target.value) || 0
                            )
                          }
                        />
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right font-medium text-slate-900 dark:text-slate-100">
                      ${(item.qty * item.price).toFixed(2)}
                    </td>
                    <td className="px-6 py-4 text-center">
                      <button
                        onClick={() => removeLineItem(item.id)}
                        className="text-slate-400 hover:text-red-500 transition-colors"
                      >
                        <span className="material-symbols-outlined text-lg">
                          delete
                        </span>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Add Line Item Button */}
          <div className="p-4 bg-slate-50 dark:bg-slate-800/30 border-t border-slate-200 dark:border-slate-800">
            <button
              onClick={addLineItem}
              className="flex items-center gap-2 text-primary font-bold text-sm hover:underline"
            >
              <span className="material-symbols-outlined">add_circle</span>
              Add Line Item
            </button>
          </div>
        </div>

        {/* Notes & Totals */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          {/* Left: Notes & Terms */}
          <div className="space-y-6">
            <div className="flex flex-col gap-2">
              <label className="text-slate-700 dark:text-slate-300 text-sm font-semibold">
                Notes / Special Instructions
              </label>
              <textarea
                className="w-full rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-primary focus:border-primary p-3 text-sm"
                placeholder="Add a personal note to the client..."
                rows={3}
              />
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-slate-700 dark:text-slate-300 text-sm font-semibold">
                Terms & Conditions
              </label>
              <textarea
                className="w-full rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-primary focus:border-primary p-3 text-sm"
                placeholder="Payment is due within 30 days. Late fees may apply."
                rows={3}
              />
            </div>
          </div>

          {/* Right: Summary Totals */}
          <div className="bg-white dark:bg-slate-900 p-8 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
            <div className="flex justify-between items-center text-slate-600 dark:text-slate-400">
              <span className="text-sm font-medium">Subtotal</span>
              <span className="font-bold text-slate-900 dark:text-slate-100">
                ${subtotal.toFixed(2)}
              </span>
            </div>

            <div className="flex justify-between items-center text-slate-600 dark:text-slate-400">
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium">Tax (%)</span>
                <input
                  className="w-16 h-8 rounded border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs text-center focus:ring-2 focus:ring-primary px-1"
                  type="number"
                  value={taxRate}
                  onChange={(e) => setTaxRate(parseInt(e.target.value) || 0)}
                />
              </div>
              <span className="font-bold text-slate-900 dark:text-slate-100">
                ${tax.toFixed(2)}
              </span>
            </div>

            <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex justify-between items-center">
              <span className="text-lg font-bold text-slate-900 dark:text-slate-100">
                Total Amount
              </span>
              <span className="text-2xl font-black text-primary">
                ${total.toFixed(2)}
              </span>
            </div>

            <div className="pt-6">
              <button className="w-full py-3 bg-primary text-white font-bold rounded-lg shadow-lg shadow-primary/20 hover:bg-primary/90 transition-all flex items-center justify-center gap-2">
                <span className="material-symbols-outlined">send</span>
                Finalize & Send Invoice
              </button>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="py-8 text-center text-slate-400 dark:text-slate-600 text-xs border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
        <p>© 2024 ProLedger Accounting Software. All rights reserved.</p>
      </footer>
    </div>
  )
}
