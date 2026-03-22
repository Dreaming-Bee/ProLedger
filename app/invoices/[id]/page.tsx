"use client"

import { useEffect, useState, useRef, useCallback } from "react"
import { useRouter, useParams } from "next/navigation"
import Sidebar from "@/components/sidebar"
import AppHeader from "@/components/app-header"
import jsPDF from "jspdf"
import html2canvas from "html2canvas"

interface CompanySettings {
  businessName: string
  email: string
  phone: string
  address: string
  logoUrl: string | null
  brandColor: string
  taxRate: number
  currency: string
}

export default function InvoiceDetailPage() {
  const router = useRouter()
  const params = useParams()
  const id = params?.id as string
  const invoiceRef = useRef<HTMLDivElement>(null)

  const [showSendModal, setShowSendModal] = useState(false)
  const [clientWhatsApp, setClientWhatsApp] = useState("+15551234567")
  const [isGenerating, setIsGenerating] = useState(false)
  const [shareToken, setShareToken] = useState<string | null>(null)
  const [shareUrl, setShareUrl] = useState("")
  const [copied, setCopied] = useState(false)
  const [invoice, setInvoice] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [company, setCompany] = useState<CompanySettings>({
    businessName: "ProLedger Inc.",
    email: "billing@proledger.com",
    phone: "",
    address: "456 Finance Way, New York, NY 10001",
    logoUrl: null,
    brandColor: "#4F46E5",
    taxRate: 8,
    currency: "USD",
  })

  useEffect(() => {
    const isAuth = localStorage.getItem("auth")
    if (!isAuth) router.push("/login")
  }, [router])

  const loadCompanySettings = useCallback(async () => {
    try {
      const res = await fetch("/api/settings")
      if (res.ok) {
        const data = await res.json()
        setCompany(data)
      }
    } catch (err) {
      console.error("Failed to load company settings", err)
    }
  }, [])

  const loadInvoiceData = useCallback(async () => {
    if (!id) return
    setLoading(true)
    try {
      const res = await fetch(`/api/invoices/${id}`)
      if (res.ok) {
        const data = await res.json()
        setInvoice(data)
      } else {
        console.error("Failed to load invoice")
      }
    } catch (err) {
      console.error("Failed to load invoice data", err)
    } finally {
      setLoading(false)
    }
  }, [id])

  // Generate/get share token for this invoice
  const initShareToken = useCallback(async () => {
    if (!id) return
    try {
      const res = await fetch(`/api/invoices/${id}/share-token`, { method: "POST" })
      if (res.ok) {
        const data = await res.json()
        setShareToken(data.token)
        setShareUrl(`${window.location.origin}/p/${data.token}`)
      }
    } catch (err) {
      console.error("Failed to generate share token", err)
    }
  }, [id])

  useEffect(() => {
    loadCompanySettings()
    loadInvoiceData()
    initShareToken()
  }, [loadCompanySettings, loadInvoiceData, initShareToken])

  const handleCopyLink = async () => {
    if (!shareUrl) return
    try {
      await navigator.clipboard.writeText(shareUrl)
      setCopied(true)
      setTimeout(() => setCopied(false), 2500)
    } catch {
      // fallback
      const el = document.createElement("input")
      el.value = shareUrl
      document.body.appendChild(el)
      el.select()
      document.execCommand("copy")
      document.body.removeChild(el)
      setCopied(true)
      setTimeout(() => setCopied(false), 2500)
    }
  }


  const formatCurrency = (amount: number) =>
    new Intl.NumberFormat("en-US", { style: "currency", currency: company.currency || "USD" }).format(amount)

  const accentColor = company.brandColor || "#4F46E5"

  const generatePDFBlob = async () => {
    if (!invoiceRef.current) return null
    setIsGenerating(true)
    try {
      const canvas = await html2canvas(invoiceRef.current, {
        scale: 2,
        useCORS: true,
        logging: false,
        backgroundColor: "#ffffff",
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
    const file = new File([pdfBlob], `${invoice.number}.pdf`, { type: "application/pdf" })
    if (navigator.canShare && navigator.canShare({ files: [file] })) {
      try {
        await navigator.share({ files: [file], title: `Invoice ${invoice.number}`, text: `Hi! Here is your invoice ${invoice.number} from ${company.businessName}.` })
        setShowSendModal(false)
        return
      } catch (err) {
        console.log("Share fell back", err)
      }
    }
    const message = encodeURIComponent(`Hi! I've attached your invoice ${invoice.number} for your review.${shareUrl ? ` View online: ${shareUrl}` : ""}`)
    window.open(`https://wa.me/${clientWhatsApp.replace(/\D/g, "")}/?text=${message}`, "_blank")
    setShowSendModal(false)
  }

  const handleDownload = async () => {
    const pdfBlob = await generatePDFBlob()
    if (pdfBlob) {
      const url = URL.createObjectURL(pdfBlob)
      const link = document.createElement("a")
      link.href = url
      link.download = `${invoice.number}.pdf`
      link.click()
      URL.revokeObjectURL(url)
    }
    setShowSendModal(false)
  }

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600" />
      </div>
    )
  }

  if (!invoice) {
    return (
      <div className="flex h-screen items-center justify-center flex-col gap-4">
        <p className="text-xl font-bold">Invoice not found</p>
        <button onClick={() => router.back()} className="text-indigo-600 font-bold underline">Go Back</button>
      </div>
    )
  }

  return (
    <div className="flex h-screen overflow-hidden relative">
      {/* Copied Toast */}
      {copied && (
        <div className="fixed top-6 right-6 z-50 px-5 py-3 bg-green-500 text-white rounded-xl text-sm font-bold shadow-lg flex items-center gap-2 animate-fade-in-up">
          <span className="material-symbols-outlined text-base">check_circle</span>
          Link copied to clipboard!
        </div>
      )}

      {/* Send Modal */}
      {showSendModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-6">
          <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={() => setShowSendModal(false)} />
          <div className="relative bg-white dark:bg-slate-900 rounded-3xl p-8 max-w-md w-full shadow-2xl space-y-8 animate-fade-in-up">
            <div className="flex justify-between items-start">
              <div className="size-16 rounded-2xl flex items-center justify-center" style={{ backgroundColor: accentColor + "20" }}>
                <span className="material-symbols-outlined text-3xl" style={{ color: accentColor }}>mark_email_read</span>
              </div>
              <button onClick={() => setShowSendModal(false)} className="text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors">
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>

            <div className="space-y-2">
              <h3 className="text-2xl font-black tracking-tight text-slate-900 dark:text-slate-100">Deliver Invoice</h3>
              <p className="text-slate-500 dark:text-slate-400 text-sm">Choose how you would like to share <strong>{invoice.number}</strong></p>
            </div>

            <div className="grid grid-cols-1 gap-4">
              {/* Share Link Option */}
              {shareUrl && (
                <button
                  onClick={handleCopyLink}
                  className="flex items-center gap-4 p-4 rounded-2xl bg-slate-50 dark:bg-slate-800 hover:bg-primary/5 border border-slate-100 dark:border-slate-700 transition-all group"
                >
                  <div
                    className="size-12 rounded-xl flex items-center justify-center shadow-sm group-hover:text-white transition-colors text-white"
                    style={{ backgroundColor: accentColor }}
                  >
                    <span className="material-symbols-outlined">link</span>
                  </div>
                  <div className="text-left">
                    <p className="text-sm font-bold text-slate-900 dark:text-slate-100">Copy Share Link</p>
                    <p className="text-[10px] text-slate-500 truncate max-w-[220px]">{shareUrl}</p>
                  </div>
                </button>
              )}

              {/* Download PDF */}
              <button
                onClick={handleDownload}
                disabled={isGenerating}
                className="flex items-center gap-4 p-4 rounded-2xl bg-slate-50 dark:bg-slate-800 hover:bg-primary/5 border border-slate-100 dark:border-slate-700 transition-all group disabled:opacity-50"
              >
                <div className="size-12 bg-white dark:bg-slate-900 rounded-xl flex items-center justify-center shadow-sm group-hover:bg-primary group-hover:text-white transition-colors">
                  {isGenerating ? (
                    <div className="size-5 border-2 border-primary border-t-transparent animate-spin rounded-full" />
                  ) : (
                    <span className="material-symbols-outlined">download</span>
                  )}
                </div>
                <div className="text-left">
                  <p className="text-sm font-bold text-slate-900 dark:text-slate-100">{isGenerating ? "Preparing PDF..." : "Download PDF"}</p>
                  <p className="text-[10px] text-slate-500">Save a copy to your computer</p>
                </div>
              </button>

              {/* WhatsApp */}
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 space-y-4">
                <div className="flex items-center gap-4">
                  <div className="size-12 bg-[#25D366] text-white rounded-xl flex items-center justify-center shadow-sm">
                    <span className="material-symbols-outlined">chat</span>
                  </div>
                  <div className="text-left">
                    <p className="text-sm font-bold text-slate-900 dark:text-slate-100">Share via WhatsApp</p>
                    <p className="text-[10px] text-slate-500">Send direct to client&apos;s phone</p>
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
          </div>
        </div>
      )}

      <Sidebar />
      <main className="flex-1 overflow-y-auto bg-slate-50 dark:bg-slate-950">
        <AppHeader
          title={`Invoice ${invoice.number}`}
          subtitle="View and manage invoice details"
        />

        <div className="p-8 max-w-5xl mx-auto space-y-8">
          {/* Actions Bar */}
          <div className="flex items-center justify-between no-print">
            <button
              onClick={() => router.back()}
              className="flex items-center gap-2 text-slate-500 hover:text-slate-900 dark:hover:text-slate-100 font-bold transition-colors"
            >
              <span className="material-symbols-outlined">arrow_back</span>
              Back to List
            </button>
            <div className="flex gap-3">
              <button
                onClick={handleDownload}
                className="px-4 py-2 border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 rounded-lg text-sm font-bold flex items-center gap-2 hover:bg-slate-50 transition-colors"
              >
                <span className="material-symbols-outlined text-lg">download</span>
                Download PDF
              </button>
              <button
                onClick={() => setShowSendModal(true)}
                className="px-4 py-2 text-white rounded-lg text-sm font-bold flex items-center gap-2 hover:opacity-90 transition-opacity"
                style={{ backgroundColor: accentColor }}
              >
                <span className="material-symbols-outlined text-lg">send</span>
                Send to Client
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Invoice Card */}
            <div id="invoice-card" ref={invoiceRef} className="lg:col-span-2 space-y-8 print-content">
              <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
                {/* Brand accent bar */}
                <div style={{ height: "6px", backgroundColor: accentColor }} />

                <div className="p-10 space-y-10">
                  {/* Branding & Invoice Info */}
                  <div className="flex justify-between items-start">
                    <div className="flex items-center gap-3">
                      {company.logoUrl ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={company.logoUrl}
                          alt="Company logo"
                          className="h-12 w-auto object-contain rounded-lg"
                        />
                      ) : (
                        <div className="p-2 rounded-lg" style={{ backgroundColor: accentColor + "20" }}>
                          <span className="material-symbols-outlined text-2xl" style={{ color: accentColor }}>
                            account_balance_wallet
                          </span>
                        </div>
                      )}
                      <h3 className="text-xl font-black tracking-tight">{company.businessName}</h3>
                    </div>
                    <div className="text-right">
                      <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold mb-2 ${invoice.statusColor}`}>
                        <span className={`size-1.5 rounded-full ${invoice.statusDot}`} />
                        {invoice.status.toUpperCase()}
                      </span>
                      <h2 className="text-2xl font-black text-slate-900 dark:text-slate-100">{invoice.number}</h2>
                    </div>
                  </div>

                  {/* Addresses */}
                  <div className="grid grid-cols-2 gap-12">
                    <div className="space-y-3">
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">From</p>
                      <div className="text-sm space-y-1">
                        <p className="font-bold text-slate-900 dark:text-slate-100">{company.businessName}</p>
                        {company.email && <p className="text-slate-500 dark:text-slate-400">{company.email}</p>}
                        {company.phone && <p className="text-slate-500 dark:text-slate-400">{company.phone}</p>}
                        {company.address && <p className="text-slate-500 dark:text-slate-400">{company.address}</p>}
                      </div>
                    </div>
                    <div className="space-y-3">
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Bill To</p>
                      <div className="text-sm space-y-1">
                        <p className="font-bold text-slate-900 dark:text-slate-100">{invoice.client.name}</p>
                        <p className="text-slate-500 dark:text-slate-400">{invoice.client.email}</p>
                        <p className="text-slate-500 dark:text-slate-400">{invoice.client.address}</p>
                      </div>
                    </div>
                  </div>

                  {/* Dates */}
                  <div className="grid grid-cols-2 gap-12 pt-6 border-t border-slate-100 dark:border-slate-800">
                    <div>
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Date Issued</p>
                      <p className="text-sm font-bold text-slate-900 dark:text-slate-100">
                        {new Date(invoice.date).toLocaleDateString()}
                      </p>
                    </div>
                    <div>
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Due Date</p>
                      <p className="text-sm font-bold text-slate-900 dark:text-slate-100">
                        {new Date(invoice.dueDate).toLocaleDateString()}
                      </p>
                    </div>
                  </div>

                  {/* Items Table */}
                  <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                      <thead>
                        <tr className="border-b-2 border-slate-100 dark:border-slate-800">
                          <th className="py-4 text-xs font-bold text-slate-400 uppercase tracking-widest">Description</th>
                          <th className="py-4 text-xs font-bold text-slate-400 uppercase tracking-widest text-center">Qty</th>
                          <th className="py-4 text-xs font-bold text-slate-400 uppercase tracking-widest text-right">Price</th>
                          <th className="py-4 text-xs font-bold text-slate-400 uppercase tracking-widest text-right">Total</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-50 dark:divide-slate-800">
                        {invoice.items.map((item) => (
                          <tr key={item.id}>
                            <td className="py-5">
                              <p className="text-sm font-bold text-slate-900 dark:text-slate-100">{item.description}</p>
                            </td>
                            <td className="py-5 text-sm text-slate-600 dark:text-slate-400 text-center font-medium">{item.qty}</td>
                            <td className="py-5 text-sm text-slate-600 dark:text-slate-400 text-right font-medium">{formatCurrency(item.price)}</td>
                            <td className="py-5 text-sm font-bold text-slate-900 dark:text-slate-100 text-right">{formatCurrency(item.qty * item.price)}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  {/* Totals Summary */}
                  <div className="flex justify-end">
                    <div className="w-full max-w-[240px] space-y-3">
                      <div className="flex justify-between text-sm">
                        <span className="text-slate-500 font-medium">Subtotal</span>
                        <span className="text-slate-900 dark:text-slate-100 font-bold">{formatCurrency(invoice.subtotal)}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-slate-500 font-medium">Tax ({company.taxRate}%)</span>
                        <span className="text-slate-900 dark:text-slate-100 font-bold">{formatCurrency(invoice.tax)}</span>
                      </div>
                      <div className="pt-3 border-t-2 border-slate-100 dark:border-slate-800 flex justify-between items-center">
                        <span className="text-base font-black text-slate-900 dark:text-slate-100">Total</span>
                        <span className="text-xl font-black" style={{ color: accentColor }}>{formatCurrency(invoice.total)}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Sidebar: Details & History */}
            <div className="space-y-8">
              {/* Status Section */}
              <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
                <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Update Status</h4>
                <div className="grid grid-cols-2 gap-2">
                  <button className="py-2 text-xs font-bold bg-green-50 text-green-600 rounded-lg hover:bg-green-100 transition-colors">Mark Paid</button>
                  <button className="py-2 text-xs font-bold bg-slate-50 text-slate-600 rounded-lg hover:bg-slate-100 transition-colors">Cancel</button>
                </div>
              </div>

              {/* History Timeline */}
              <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-6">
                <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Activity Timeline</h4>
                 <div className="space-y-6">
                  {invoice.history?.map((h: any, i: number) => (
                    <div key={i} className="flex gap-4 relative">
                      {i < invoice.history.length - 1 && (
                        <div className="absolute left-[7px] top-4 bottom-[-24px] w-0.5 bg-slate-100 dark:bg-slate-800" />
                      )}
                      <div className="size-4 rounded-full border-2 bg-white z-10 shrink-0" style={{ borderColor: accentColor }} />
                      <div className="space-y-1">
                        <p className="text-xs font-bold text-slate-900 dark:text-slate-100">{h.event}</p>
                        <p className="text-[10px] text-slate-500">{h.date} · {h.user}</p>
                      </div>
                    </div>
                  )) || (
                    <div className="text-xs text-slate-400">No activity yet</div>
                  )}
                </div>
              </div>

              {/* Public Share Link */}
              <div className="rounded-2xl p-6 space-y-4" style={{ backgroundColor: accentColor + "0D", border: `1px solid ${accentColor}30` }}>
                <h4 className="text-[10px] font-bold uppercase tracking-widest" style={{ color: accentColor }}>Public Share Link</h4>
                <div className="flex gap-2">
                  <input
                    readOnly
                    value={shareUrl || (shareToken ? `${typeof window !== "undefined" ? window.location.origin : ""}/p/${shareToken}` : "Generating link…")}
                    className="flex-1 bg-white dark:bg-slate-900 border rounded-lg px-3 py-2 text-[10px] font-medium text-slate-600"
                    style={{ borderColor: accentColor + "30" }}
                  />
                  <button
                    onClick={handleCopyLink}
                    disabled={!shareUrl}
                    className="text-white p-2 rounded-lg hover:opacity-90 transition-all disabled:opacity-40"
                    style={{ backgroundColor: accentColor }}
                    title="Copy link"
                  >
                    <span className="material-symbols-outlined text-sm">
                      {copied ? "check" : "content_copy"}
                    </span>
                  </button>
                </div>
                <p className="text-[10px] font-medium" style={{ color: accentColor + "B3" }}>
                  Clients can view this invoice via this link without logging in.
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
