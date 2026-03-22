"use client"

import { useEffect, useState, useRef, useCallback } from "react"
import { useRouter } from "next/navigation"
import Sidebar from "@/components/sidebar"
import AppHeader from "@/components/app-header"

interface CompanySettings {
  id?: string
  businessName: string
  email: string
  phone: string
  address: string
  logoUrl: string | null
  brandColor: string
  taxRate: number
  currency: string
}

const DEFAULT_SETTINGS: CompanySettings = {
  businessName: "",
  email: "",
  phone: "",
  address: "",
  logoUrl: null,
  brandColor: "#4F46E5",
  taxRate: 8,
  currency: "USD",
}

export default function SettingsPage() {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState("business")
  const [settings, setSettings] = useState<CompanySettings>(DEFAULT_SETTINGS)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [extracting, setExtracting] = useState(false)
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null)
  
  const logoInputRef = useRef<HTMLInputElement>(null)
  const aiInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    const isAuth = localStorage.getItem("auth")
    if (!isAuth) router.push("/login")
  }, [router])

  const showToast = (message: string, type: "success" | "error" = "success") => {
    setToast({ message, type })
    setTimeout(() => setToast(null), 3000)
  }

  const fetchSettings = useCallback(async () => {
    try {
      const res = await fetch("/api/settings")
      if (res.ok) {
        const data = await res.json()
        setSettings(data)
      }
    } catch (err) {
      console.error("Failed to load settings", err)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchSettings()
  }, [fetchSettings])

  const saveSettings = async (partial?: Partial<CompanySettings>) => {
    setSaving(true)
    try {
      const payload = partial ? { ...settings, ...partial } : settings
      const res = await fetch("/api/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      })
      if (!res.ok) throw new Error("Save failed")
      const updated = await res.json()
      setSettings(updated)
      showToast("Settings saved successfully!")
    } catch {
      showToast("Failed to save settings.", "error")
    } finally {
      setSaving(false)
    }
  }

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    if (file.size > 2 * 1024 * 1024) {
      showToast("Logo must be under 2MB.", "error")
      return
    }
    const reader = new FileReader()
    reader.onload = (evt) => {
      const dataUrl = evt.target?.result as string
      setSettings((prev) => ({ ...prev, logoUrl: dataUrl }))
    }
    reader.readAsDataURL(file)
  }

  const handleAIExtract = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    
    setExtracting(true)
    showToast("AI is analyzing your invoice design...", "success")

    try {
      const reader = new FileReader()
      reader.onload = async (evt) => {
        const base64 = (evt.target?.result as string).split(",")[1]
        const mimeType = file.type

        const res = await fetch("/api/settings/extract", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ image: base64, mimeType })
        })

        if (!res.ok) throw new Error("AI extraction failed")
        
        const data = await res.json()
        
        setSettings(prev => ({
          ...prev,
          businessName: data.businessName || prev.businessName,
          email: data.email || prev.email,
          phone: data.phone || prev.phone,
          address: data.address || prev.address,
          brandColor: data.brandColor || prev.brandColor
        }))

        showToast("Design extracted successfully! Review and Save.")
      }
      reader.readAsDataURL(file)
    } catch (err) {
      console.error(err)
      showToast("AI extraction failed. Please try a different image.", "error")
    } finally {
      setExtracting(false)
    }
  }

  if (loading) {
    return (
      <div className="flex h-screen overflow-hidden">
        <Sidebar />
        <main className="flex-1 overflow-y-auto bg-slate-50 dark:bg-slate-950 flex items-center justify-center">
          <div className="size-8 border-2 border-primary border-t-transparent animate-spin rounded-full" />
        </main>
      </div>
    )
  }

  return (
    <div className="flex h-screen overflow-hidden">
      {/* Toast */}
      {toast && (
        <div
          className={`fixed top-6 right-6 z-50 px-5 py-3 rounded-xl text-sm font-bold shadow-lg transition-all animate-fade-in-up ${
            toast.type === "success"
              ? "bg-green-500 text-white"
              : "bg-red-500 text-white"
          }`}
        >
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-base">
              {toast.type === "success" ? "check_circle" : "error"}
            </span>
            {toast.message}
          </div>
        </div>
      )}

      <Sidebar />
      <main className="flex-1 overflow-y-auto bg-slate-50 dark:bg-slate-950">
        <AppHeader title="Settings" subtitle="Manage your account, business, and preferences" />

        <div className="p-8 max-w-5xl mx-auto space-y-8 pb-12">
          {/* Tabs */}
          <div className="flex border-b border-slate-200 dark:border-slate-800">
            {["business", "branding", "profile"].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-6 py-3 text-sm font-bold transition-colors relative capitalize ${
                  activeTab === tab ? "text-primary" : "text-slate-500 hover:text-slate-900"
                }`}
              >
                {tab === "business" ? "Business Setup" : tab === "branding" ? "Branding" : "User Profile"}
                {activeTab === tab && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary" />}
              </button>
            ))}
          </div>

          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
            
            {/* ── Business Setup Tab ── */}
            {activeTab === "business" && (
              <div className="p-8 space-y-8">
                <div className="flex justify-between items-center mb-4">
                    <h3 className="text-sm font-black text-slate-900 dark:text-slate-100 uppercase tracking-widest">Business Information</h3>
                    
                    {/* AI Extraction Button */}
                    <div className="relative">
                        <input ref={aiInputRef} type="file" accept="image/*,application/pdf" className="hidden" onChange={handleAIExtract} />
                        <button 
                            onClick={() => aiInputRef.current?.click()}
                            disabled={extracting}
                            className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white text-xs font-bold rounded-lg shadow-lg hover:opacity-90 transition-all disabled:opacity-50"
                        >
                            {extracting ? (
                                <div className="size-3 border-2 border-white border-t-transparent animate-spin rounded-full" />
                            ) : (
                                <span className="material-symbols-outlined text-sm">auto_fix</span>
                            )}
                            Extract Branding from Existing Invoice
                        </button>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-4">
                    <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest">General Details</h3>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">Legal Business Name</label>
                        <input
                          className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border-none rounded-xl text-sm"
                          value={settings.businessName}
                          onChange={(e) => setSettings((p) => ({ ...p, businessName: e.target.value }))}
                          placeholder="Your Business LLC"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">Currency</label>
                        <select
                          className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border-none rounded-xl text-sm"
                          value={settings.currency}
                          onChange={(e) => setSettings((p) => ({ ...p, currency: e.target.value }))}
                        >
                          <option value="USD">USD — US Dollar</option>
                          <option value="LKR">LKR — Sri Lankan Rupee</option>
                          <option value="EUR">EUR — Euro</option>
                          <option value="GBP">GBP — British Pound</option>
                          <option value="INR">INR — Indian Rupee</option>
                          <option value="AUD">AUD — Australian Dollar</option>
                          <option value="CAD">CAD — Canadian Dollar</option>
                          <option value="SGD">SGD — Singapore Dollar</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">Default Tax Rate (%)</label>
                        <input
                          type="number"
                          min={0}
                          max={100}
                          step={0.1}
                          className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border-none rounded-xl text-sm"
                          value={settings.taxRate}
                          onChange={(e) => setSettings((p) => ({ ...p, taxRate: parseFloat(e.target.value) || 0 }))}
                        />
                      </div>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest">Contact Information</h3>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">Business Email</label>
                        <input
                          type="email"
                          className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border-none rounded-xl text-sm"
                          value={settings.email}
                          onChange={(e) => setSettings((p) => ({ ...p, email: e.target.value }))}
                          placeholder="hello@yourcompany.com"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">Phone</label>
                        <input
                          type="tel"
                          className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border-none rounded-xl text-sm"
                          value={settings.phone}
                          onChange={(e) => setSettings((p) => ({ ...p, phone: e.target.value }))}
                          placeholder="+1 (555) 000-0000"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="pt-6 border-t border-slate-100 dark:border-slate-800">
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">Business Address</label>
                  <textarea
                    className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border-none rounded-xl text-sm"
                    rows={2}
                    value={settings.address}
                    onChange={(e) => setSettings((p) => ({ ...p, address: e.target.value }))}
                    placeholder="123 Main St, City, State ZIP"
                  />
                </div>

                <div className="flex justify-end">
                  <button
                    onClick={() => saveSettings()}
                    disabled={saving}
                    className="px-6 py-2.5 bg-primary text-white text-sm font-bold rounded-lg shadow-lg shadow-primary/20 disabled:opacity-50 flex items-center gap-2"
                  >
                    {saving && <div className="size-4 border-2 border-white border-t-transparent animate-spin rounded-full" />}
                    Save Business Changes
                  </button>
                </div>
              </div>
            )}

            {/* ── Branding Tab ── */}
            {activeTab === "branding" && (
              <div className="p-8 space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                  <div className="space-y-8">
                    {/* Logo Upload */}
                    <div className="space-y-4">
                      <h3 className="text-sm font-black text-slate-900 dark:text-slate-100 uppercase tracking-widest">Logo & Icon</h3>
                      <div className="flex items-center gap-6">
                        <div
                          className="size-24 rounded-2xl flex items-center justify-center border-2 border-dashed overflow-hidden cursor-pointer hover:opacity-80 transition-opacity"
                          style={{ borderColor: settings.brandColor + "60", backgroundColor: settings.brandColor + "10" }}
                          onClick={() => logoInputRef.current?.click()}
                        >
                          {settings.logoUrl ? (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img src={settings.logoUrl} alt="Logo" className="size-full object-contain p-2" />
                          ) : (
                            <span className="material-symbols-outlined text-4xl" style={{ color: settings.brandColor }}>
                              add_a_photo
                            </span>
                          )}
                        </div>
                        <div className="space-y-2">
                          <input ref={logoInputRef} type="file" accept="image/*" className="hidden" onChange={handleLogoUpload} />
                          <button
                            className="px-4 py-2 text-[10px] font-bold rounded-lg uppercase tracking-widest text-white"
                            style={{ backgroundColor: settings.brandColor }}
                            onClick={() => logoInputRef.current?.click()}
                          >
                            Upload Logo
                          </button>
                          {settings.logoUrl && (
                            <button
                              className="block px-4 py-2 text-[10px] font-bold rounded-lg uppercase tracking-widest bg-slate-100 text-slate-600"
                              onClick={() => setSettings((p) => ({ ...p, logoUrl: null }))}
                            >
                              Remove Logo
                            </button>
                          )}
                          <p className="text-[10px] text-slate-500 font-medium">PNG, JPG or SVG. Max 2MB.</p>
                        </div>
                      </div>
                    </div>

                    {/* Brand Color */}
                    <div className="space-y-4">
                      <h3 className="text-sm font-black text-slate-900 dark:text-slate-100 uppercase tracking-widest">Brand Color</h3>
                      <div className="flex items-center gap-4">
                        <div className="relative">
                          <input
                            type="color"
                            value={settings.brandColor}
                            onChange={(e) => setSettings((p) => ({ ...p, brandColor: e.target.value }))}
                            className="size-12 rounded-full cursor-pointer border-4 border-white shadow-md appearance-none"
                            style={{ padding: 0 }}
                          />
                        </div>
                        <input
                          type="text"
                          value={settings.brandColor}
                          onChange={(e) => {
                            const val = e.target.value
                            if (/^#[0-9A-Fa-f]{0,6}$/.test(val)) setSettings((p) => ({ ...p, brandColor: val }))
                          }}
                          className="flex-1 px-4 py-2 bg-slate-50 dark:bg-slate-800 rounded-xl text-sm font-mono border-none"
                          maxLength={7}
                          placeholder="#4F46E5"
                        />
                      </div>
                      {/* Color Swatches */}
                      <div className="flex gap-2 flex-wrap">
                        {["#4F46E5", "#0EA5E9", "#10B981", "#F59E0B", "#EF4444", "#8B5CF6", "#EC4899", "#14B8A6"].map((color) => (
                          <button
                            key={color}
                            className={`size-8 rounded-full border-2 transition-transform hover:scale-110 ${
                              settings.brandColor === color ? "border-slate-900 scale-110" : "border-white shadow"
                            }`}
                            style={{ backgroundColor: color }}
                            onClick={() => setSettings((p) => ({ ...p, brandColor: color }))}
                          />
                        ))}
                      </div>
                    </div>

                    <button
                      onClick={() => saveSettings()}
                      disabled={saving}
                      className="px-6 py-2.5 text-white text-sm font-bold rounded-lg shadow-lg disabled:opacity-50 flex items-center gap-2"
                      style={{ backgroundColor: settings.brandColor }}
                    >
                      {saving && <div className="size-4 border-2 border-white border-t-transparent animate-spin rounded-full" />}
                      Save Branding
                    </button>
                  </div>

                  {/* Live Preview */}
                  <div className="space-y-4">
                    <h3 className="text-sm font-black text-slate-900 dark:text-slate-100 uppercase tracking-widest">Live Invoice Preview</h3>
                    <div className="rounded-xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm">
                      {/* Accent bar */}
                      <div style={{ height: "5px", backgroundColor: settings.brandColor }} />
                      <div className="p-5 bg-white dark:bg-slate-900 space-y-4">
                        {/* Header */}
                        <div className="flex justify-between items-start">
                          <div className="flex items-center gap-2">
                            {settings.logoUrl ? (
                              // eslint-disable-next-line @next/next/no-img-element
                              <img src={settings.logoUrl} alt="Logo preview" className="h-9 w-auto object-contain rounded" />
                            ) : (
                              <div className="p-1.5 rounded-lg" style={{ backgroundColor: settings.brandColor + "20" }}>
                                <span className="material-symbols-outlined text-lg" style={{ color: settings.brandColor }}>
                                  account_balance_wallet
                                </span>
                              </div>
                            )}
                            <p className="text-sm font-black text-slate-900">
                              {settings.businessName || "Your Company"}
                            </p>
                          </div>
                          <div className="text-right">
                            <div className="h-4 w-16 bg-green-100 rounded-full mb-1" />
                            <p className="text-xs font-black text-slate-900">INV-2024-001</p>
                          </div>
                        </div>
                        {/* Body placeholders */}
                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-1">
                            <div className="h-2 w-8 bg-slate-100 rounded" />
                            <div className="h-2 w-24 bg-slate-200 rounded" />
                            <div className="h-2 w-20 bg-slate-100 rounded" />
                          </div>
                          <div className="space-y-1">
                            <div className="h-2 w-8 bg-slate-100 rounded" />
                            <div className="h-2 w-24 bg-slate-200 rounded" />
                            <div className="h-2 w-20 bg-slate-100 rounded" />
                          </div>
                        </div>
                        <div className="space-y-1 border-t border-slate-100 pt-3">
                          <div className="flex justify-between">
                            <div className="h-2 w-32 bg-slate-100 rounded" />
                            <div className="h-2 w-10 bg-slate-100 rounded" />
                          </div>
                          <div className="flex justify-between">
                            <div className="h-2 w-28 bg-slate-100 rounded" />
                            <div className="h-2 w-10 bg-slate-100 rounded" />
                          </div>
                        </div>
                        <div className="border-t-2 border-slate-100 pt-2 flex justify-between">
                          <p className="text-xs font-black text-slate-700">Total</p>
                          <p className="text-xs font-black" style={{ color: settings.brandColor }}>$4,500.00</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* ── Profile Tab ── */}
            {activeTab === "profile" && (
              <div className="p-8 space-y-8">
                <div className="flex items-center gap-6">
                  <div className="size-20 bg-slate-200 dark:bg-slate-800 rounded-full flex items-center justify-center text-slate-500 overflow-hidden">
                    <span className="material-symbols-outlined text-4xl">person</span>
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100">Administrator</h3>
                    <p className="text-sm text-slate-500">Administrator · Owner</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">Full Name</label>
                    <input className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border-none rounded-xl text-sm" defaultValue="Administrator" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">Email Address</label>
                    <input className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border-none rounded-xl text-sm" defaultValue="admin@proledger.com" />
                  </div>
                </div>

                <div className="pt-6 border-t border-slate-100 dark:border-slate-800 flex justify-between items-center">
                  <div className="space-y-1">
                    <p className="text-sm font-bold text-slate-900 dark:text-slate-100">Two-Factor Authentication</p>
                    <p className="text-xs text-slate-500">Secure your account with 2FA.</p>
                  </div>
                  <button className="px-4 py-2 bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-slate-100 text-xs font-bold rounded-lg">Enable 2FA</button>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  )
}
