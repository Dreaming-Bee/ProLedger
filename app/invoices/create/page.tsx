"use client"

import { useEffect, useState, useRef } from "react"
import { useRouter } from "next/navigation"
import Sidebar from "@/components/sidebar"
import AppHeader from "@/components/app-header"
import jsPDF from "jspdf"
import html2canvas from "html2canvas"

export default function CreateInvoicePage() {
  const router = useRouter()
  const invoiceRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const isAuth = localStorage.getItem("auth")
    if (!isAuth) {
      router.push("/login")
    }
  }, [router])

  const [lineItems, setLineItems] = useState([
    { id: 1, description: "Professional Services", qty: 1, price: 1200 },
    { id: 2, description: "Software License", qty: 5, price: 45 },
  ])
  const [taxRate, setTaxRate] = useState(8)
  const [showSendModal, setShowSendModal] = useState(false)
  const [clientWhatsApp, setClientWhatsApp] = useState("+15551234567")
  const [isGenerating, setIsGenerating] = useState(false)

  const subtotal = lineItems.reduce((acc, item) => acc + item.qty * item.price, 0)
  const tax = (subtotal * taxRate) / 100
  const total = subtotal + tax

  const addLineItem = () => {
    setLineItems([...lineItems, { id: Date.now(), description: "", qty: 1, price: 0 }])
  }

  const removeLineItem = (id: number) => {
    setLineItems(lineItems.filter((item) => item.id !== id))
  }

  const updateLineItem = (id: number, field: string, value: string | number) => {
    setLineItems(
      lineItems.map((item) => (item.id === id ? { ...item, [field]: value } : item))
    )
  }

  const generatePDFBlob = async () => {
    if (!invoiceRef.current) return null
    setIsGenerating(true)
    try {
      const canvas = await html2canvas(invoiceRef.current, {
        scale: 2,
        useCORS: true,
        logging: false,
        backgroundColor: "#ffffff"
      })
      const imgData = canvas.toDataURL("image/png")
      const pdf = new jsPDF("p", "mm", "a4")
      const imgProps = pdf.getImageProperties(imgData)
      const pdfWidth = pdf.internal.pageSize.getWidth()
      const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width
      pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight)
      return pdf.output("blob")
    } catch (error) {
      console.error("PDF Generation failed", error)
      return null
    } finally {
      setIsGenerating(false)
    }
  }

  const handleWhatsAppShare = async () => {
    const pdfBlob = await generatePDFBlob()
    if (!pdfBlob) {
      alert("Failed to generate PDF for sharing.")
      return
    }

    const file = new File([pdfBlob], `Invoice.pdf`, { type: "application/pdf" })
    
    // Try Web Share API
    if (navigator.canShare && navigator.canShare({ files: [file] })) {
      try {
        await navigator.share({
          files: [file],
          title: `New Invoice`,
          text: `Hi! Here is your new invoice from ProLedger.`
        })
        setShowSendModal(false)
        return
      } catch (err) {
        console.log("Share failed", err)
      }
    }

    const message = encodeURIComponent(`Hi! Here is your invoice for $${total.toFixed(2)}. (Generated via ProLedger)`)
    window.open(`https://wa.me/${clientWhatsApp.replace(/\D/g, "")}/?text=${message}`, "_blank")
    setShowSendModal(false)
  }

  const handleDownload = async () => {
    const pdfBlob = await generatePDFBlob()
    if (pdfBlob) {
      const url = URL.createObjectURL(pdfBlob)
      const link = document.createElement("a")
      link.href = url
      link.download = `Invoice.pdf`
      link.click()
      URL.revokeObjectURL(url)
    }
    setShowSendModal(false)
  }

  return (
    <div className="layout-container flex h-full grow flex-col bg-background-light dark:bg-background-dark text-slate-900 dark:text-slate-100 relative">
      {/* Send Modal */}
      {showSendModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-6">
          <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={() => setShowSendModal(false)} />
          <div className="relative bg-white dark:bg-slate-900 rounded-3xl p-8 max-w-md w-full shadow-2xl space-y-8 animate-fade-in-up">
            <div className="flex justify-between items-start">
              <div className="size-16 bg-primary/10 rounded-2xl flex items-center justify-center text-primary">
                <span className="material-symbols-outlined text-3xl">mark_email_read</span>
              </div>
              <button onClick={() => setShowSendModal(false)} className="text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors">
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>

            <div className="space-y-2">
              <h3 className="text-2xl font-black tracking-tight text-slate-900 dark:text-slate-100">Finalize Invoice</h3>
              <p className="text-slate-500 dark:text-slate-400 text-sm">Choose how you would like to deliver the invoice for $ {total.toFixed(2)}</p>
            </div>

            <div className="grid grid-cols-1 gap-4">
              <button 
                onClick={handleDownload}
                disabled={isGenerating}
                className="flex items-center gap-4 p-4 rounded-2xl bg-slate-50 dark:bg-slate-800 hover:bg-primary/5 border border-slate-100 dark:border-slate-700 hover:border-primary/20 transition-all group disabled:opacity-50"
              >
                <div className="size-12 bg-white dark:bg-slate-900 rounded-xl flex items-center justify-center shadow-sm group-hover:bg-primary group-hover:text-white transition-colors">
                  {isGenerating ? (
                    <div className="size-5 border-2 border-primary border-t-transparent animate-spin rounded-full" />
                  ) : (
                    <span className="material-symbols-outlined">download</span>
                  )}
                </div>
                <div className="text-left">
                  <p className="text-sm font-bold text-slate-900 dark:text-slate-100">
                    {isGenerating ? "Preparing PDF..." : "Download PDF"}
                  </p>
                  <p className="text-[10px] text-slate-500">Generate a high-quality PDF document</p>
                </div>
              </button>

              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 space-y-4">
                <div className="flex items-center gap-4">
                  <div className="size-12 bg-[#25D366] text-white rounded-xl flex items-center justify-center shadow-sm">
                    <span className="material-symbols-outlined">chat</span>
                  </div>
                  <div className="text-left">
                    <p className="text-sm font-bold text-slate-900 dark:text-slate-100">Share via WhatsApp</p>
                    <p className="text-[10px] text-slate-500">Send direct to client's phone</p>
                  </div>
                </div>
                
                <div className="flex gap-2">
                  <input 
                    type="tel" 
                    value={clientWhatsApp}
                    onChange={(e) => setClientWhatsApp(e.target.value)}
                    className="flex-1 px-3 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-xs"
                    placeholder="+1 (555) 000-0000"
                  />
                  <button 
                    onClick={handleWhatsAppShare}
                    disabled={isGenerating}
                    className="px-4 py-2 bg-[#25D366] text-white rounded-lg text-xs font-bold hover:opacity-90 transition-opacity disabled:opacity-50"
                  >
                    {isGenerating ? "..." : "Send"}
                  </button>
                </div>
              </div>
            </div>

            <button 
              onClick={() => {
                alert("Invoices saved successfully!");
                router.push("/dashboard");
              }}
              className="w-full py-4 text-slate-400 hover:text-primary text-xs font-black uppercase tracking-widest transition-colors"
            >
              Just Save to Database
            </button>
          </div>
        </div>
      )}

      {/* Header */}
      <header className="flex items-center justify-between whitespace-nowrap border-b border-solid border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-6 md:px-10 py-4 sticky top-0 z-10 no-print">
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
          <button 
            onClick={() => {
              alert("Invoice draft saved successfully!");
              router.push("/invoices");
            }}
            className="flex min-w-[84px] cursor-pointer items-center justify-center rounded-lg h-10 px-5 bg-primary text-white text-sm font-bold transition-opacity hover:opacity-90"
          >
            Save Invoice
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main ref={invoiceRef} className="flex-1 max-w-5xl mx-auto w-full p-6 md:p-10 space-y-8 overflow-y-auto bg-white dark:bg-slate-950">
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
              <button 
                onClick={() => setShowSendModal(true)}
                className="w-full py-3 bg-primary text-white font-bold rounded-lg shadow-lg shadow-primary/20 hover:bg-primary/90 transition-all flex items-center justify-center gap-2"
              >
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
