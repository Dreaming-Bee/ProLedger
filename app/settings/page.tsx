"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Sidebar from "@/components/sidebar"
import AppHeader from "@/components/app-header"

export default function SettingsPage() {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState("business")

  useEffect(() => {
    const isAuth = localStorage.getItem("auth")
    if (!isAuth) {
      router.push("/login")
    }
  }, [router])

  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar />
      <main className="flex-1 overflow-y-auto bg-slate-50 dark:bg-slate-950">
        <AppHeader title="Settings" subtitle="Manage your account, business, and preferences" />
        
        <div className="p-8 max-w-5xl mx-auto space-y-8 pb-12">
          {/* Tabs */}
          <div className="flex border-b border-slate-200 dark:border-slate-800">
            <button 
              onClick={() => setActiveTab("business")}
              className={`px-6 py-3 text-sm font-bold transition-colors relative ${activeTab === "business" ? "text-primary" : "text-slate-500 hover:text-slate-900"}`}
            >
              Business Setup
              {activeTab === "business" && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary" />}
            </button>
            <button 
              onClick={() => setActiveTab("branding")}
              className={`px-6 py-3 text-sm font-bold transition-colors relative ${activeTab === "branding" ? "text-primary" : "text-slate-500 hover:text-slate-900"}`}
            >
              Branding
              {activeTab === "branding" && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary" />}
            </button>
            <button 
              onClick={() => setActiveTab("profile")}
              className={`px-6 py-3 text-sm font-bold transition-colors relative ${activeTab === "profile" ? "text-primary" : "text-slate-500 hover:text-slate-900"}`}
            >
              User Profile
              {activeTab === "profile" && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary" />}
            </button>
          </div>

          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
            {activeTab === "business" && (
              <div className="p-8 space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-4">
                    <h3 className="text-sm font-black text-slate-900 dark:text-slate-100 uppercase tracking-widest">General Details</h3>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">Legal Business Name</label>
                        <input className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border-none rounded-xl text-sm" defaultValue="ProLedger Enterprises LLC" />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">Tax Identification Number</label>
                        <input className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border-none rounded-xl text-sm" defaultValue="EIN-99-1234567" />
                      </div>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <h3 className="text-sm font-black text-slate-900 dark:text-slate-100 uppercase tracking-widest">Contact Information</h3>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">Business Email</label>
                        <input className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border-none rounded-xl text-sm" defaultValue="hello@proledger.com" />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">Phone</label>
                        <input className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border-none rounded-xl text-sm" defaultValue="+1 (555) 123-4567" />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="pt-6 border-t border-slate-100 dark:border-slate-800">
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">Business Address</label>
                  <textarea className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border-none rounded-xl text-sm" rows={2} defaultValue="789 Financial District, San Francisco, CA 94103" />
                </div>

                <div className="flex justify-end">
                  <button className="px-6 py-2.5 bg-primary text-white text-sm font-bold rounded-lg shadow-lg shadow-primary/20">Save Business Changes</button>
                </div>
              </div>
            )}

            {activeTab === "branding" && (
              <div className="p-8 space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                  <div className="space-y-6">
                    <h3 className="text-sm font-black text-slate-900 dark:text-slate-100 uppercase tracking-widest">Logo & Icon</h3>
                    <div className="flex items-center gap-6">
                      <div className="size-24 bg-primary/10 rounded-2xl flex items-center justify-center border-2 border-dashed border-primary/20">
                        <span className="material-symbols-outlined text-4xl text-primary">add_a_photo</span>
                      </div>
                      <div className="space-y-2">
                        <button className="px-4 py-2 bg-primary text-white text-[10px] font-bold rounded-lg uppercase tracking-widest">Upload Logo</button>
                        <p className="text-[10px] text-slate-500 font-medium">PNG, JPG or SVG. Max 2MB.</p>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <h3 className="text-sm font-black text-slate-900 dark:text-slate-100 uppercase tracking-widest">Brand Colors</h3>
                      <div className="flex items-center gap-4">
                        <div className="size-10 bg-primary rounded-full ring-4 ring-primary/10" />
                        <div className="flex-1 px-4 py-2 bg-slate-50 dark:bg-slate-800 rounded-xl text-sm font-mono">#4F46E5</div>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-6">
                    <h3 className="text-sm font-black text-slate-900 dark:text-slate-100 uppercase tracking-widest">Invoice Preview</h3>
                    <div className="aspect-[3/4] bg-slate-50 dark:bg-slate-950 rounded-xl border border-slate-200 dark:border-slate-800 p-6 shadow-inner">
                      <div className="h-4 w-12 bg-primary/20 rounded mb-4" />
                      <div className="h-6 w-3/4 bg-slate-200 dark:bg-slate-800 rounded mb-2" />
                      <div className="h-3 w-1/2 bg-slate-100 dark:bg-slate-900 rounded mb-8" />
                      <div className="space-y-2">
                        <div className="h-2 w-full bg-slate-100 dark:bg-slate-900 rounded" />
                        <div className="h-2 w-full bg-slate-100 dark:bg-slate-900 rounded" />
                        <div className="h-2 w-3/4 bg-slate-100 dark:bg-slate-900 rounded" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === "profile" && (
              <div className="p-8 space-y-8">
                <div className="flex items-center gap-6">
                  <div className="size-20 bg-slate-200 dark:bg-slate-800 rounded-full flex items-center justify-center text-slate-500 overflow-hidden">
                    <span className="material-symbols-outlined text-4xl">person</span>
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100">Alexander Pierce</h3>
                    <p className="text-sm text-slate-500">Administrator • Owner</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">Full Name</label>
                    <input className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border-none rounded-xl text-sm" defaultValue="Alexander Pierce" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">Email Address</label>
                    <input className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border-none rounded-xl text-sm" defaultValue="alex@proledger.com" />
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
