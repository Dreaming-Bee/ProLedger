"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Sidebar from "@/components/sidebar"
import AppHeader from "@/components/app-header"

export default function AddClientPage() {
  const router = useRouter()
  const [formData, setFormData] = useState({
    name: "",
    contact: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    state: "",
    zip: "",
    taxId: "",
  })

  useEffect(() => {
    const isAuth = localStorage.getItem("auth")
    if (!isAuth) {
      router.push("/login")
    }
  }, [router])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Mock save logic
    router.push("/clients")
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar />
      <main className="flex-1 overflow-y-auto bg-slate-50 dark:bg-slate-950">
        <AppHeader 
          title="Add New Client" 
          subtitle="Create a new business contact record"
        />

        <div className="p-8 max-w-4xl mx-auto space-y-8 pb-12">
          {/* Header Actions */}
          <div className="flex items-center justify-between">
            <button 
              onClick={() => router.back()}
              className="flex items-center gap-2 text-slate-500 hover:text-slate-900 dark:hover:text-slate-100 font-bold transition-colors"
            >
              <span className="material-symbols-outlined">arrow_back</span>
              Cancel
            </button>
            <button 
              onClick={handleSubmit}
              className="px-6 py-2.5 bg-primary text-white rounded-lg text-sm font-bold flex items-center gap-2 hover:bg-primary/90 transition-all shadow-lg shadow-primary/20"
            >
              <span className="material-symbols-outlined text-lg">save</span>
              Save Client Record
            </button>
          </div>

          <form className="grid grid-cols-1 md:grid-cols-2 gap-8" onSubmit={handleSubmit}>
            {/* General Info */}
            <div className="bg-white dark:bg-slate-900 p-8 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-6">
              <h3 className="text-sm font-black text-slate-900 dark:text-slate-100 uppercase tracking-widest border-b border-slate-100 dark:border-slate-800 pb-4">General Information</h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">Company Name</label>
                  <input 
                    name="name"
                    required
                    placeholder="Acme Corporation"
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border-none rounded-xl text-sm focus:ring-2 focus:ring-primary/20 placeholder:text-slate-400"
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">Contact Person</label>
                    <input 
                      name="contact"
                      placeholder="Jane Smith"
                      value={formData.contact}
                      onChange={handleChange}
                      className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border-none rounded-xl text-sm focus:ring-2 focus:ring-primary/20 placeholder:text-slate-400"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">Tax/VAT ID</label>
                    <input 
                      name="taxId"
                      placeholder="VAT-123456"
                      value={formData.taxId}
                      onChange={handleChange}
                      className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border-none rounded-xl text-sm focus:ring-2 focus:ring-primary/20 placeholder:text-slate-400"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">Email Address</label>
                  <input 
                    name="email"
                    type="email"
                    required
                    placeholder="jane@acme.com"
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border-none rounded-xl text-sm focus:ring-2 focus:ring-primary/20 placeholder:text-slate-400"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">Phone Number</label>
                  <input 
                    name="phone"
                    placeholder="+1 (555) 000-0000"
                    value={formData.phone}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border-none rounded-xl text-sm focus:ring-2 focus:ring-primary/20 placeholder:text-slate-400"
                  />
                </div>
              </div>
            </div>

            {/* Address Info */}
            <div className="bg-white dark:bg-slate-900 p-8 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-6">
              <h3 className="text-sm font-black text-slate-900 dark:text-slate-100 uppercase tracking-widest border-b border-slate-100 dark:border-slate-800 pb-4">Billing Address</h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">Street Address</label>
                  <textarea 
                    name="address"
                    rows={2}
                    placeholder="123 Corporate Blvd, Suite 100"
                    value={formData.address}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border-none rounded-xl text-sm focus:ring-2 focus:ring-primary/20 placeholder:text-slate-400"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">City</label>
                    <input 
                      name="city"
                      placeholder="New York"
                      value={formData.city}
                      onChange={handleChange}
                      className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border-none rounded-xl text-sm focus:ring-2 focus:ring-primary/20 placeholder:text-slate-400"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">State / Province</label>
                    <input 
                      name="state"
                      placeholder="NY"
                      value={formData.state}
                      onChange={handleChange}
                      className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border-none rounded-xl text-sm focus:ring-2 focus:ring-primary/20 placeholder:text-slate-400"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">Zip / Postal Code</label>
                  <input 
                    name="zip"
                    placeholder="10001"
                    value={formData.zip}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border-none rounded-xl text-sm focus:ring-2 focus:ring-primary/20 placeholder:text-slate-400 w-1/2"
                  />
                </div>
              </div>

              {/* Tips Section */}
              <div className="p-4 bg-primary/5 rounded-xl border border-primary/10">
                <div className="flex gap-3">
                  <span className="material-symbols-outlined text-primary">info</span>
                  <p className="text-[10px] text-slate-600 dark:text-slate-400 leading-relaxed font-medium">
                    <span className="font-bold text-primary">Pro Tip:</span> Providing a full billing address will ensure that all invoices generated for this client are legally compliant and professionally formatted.
                  </p>
                </div>
              </div>
            </div>
          </form>
        </div>
      </main>
    </div>
  )
}
