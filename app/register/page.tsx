"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"

export default function RegisterPage() {
  const router = useRouter()
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    businessName: "",
  })
  const [showPassword, setShowPassword] = useState(false)

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault()
    // In production, implement actual registration logic
    localStorage.setItem("auth", "true")
    localStorage.setItem("user", formData.email)
    router.push("/dashboard")
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  return (
    <div className="min-h-screen flex flex-col lg:flex-row bg-background-light dark:bg-background-dark">
      {/* Left Side: Branding Area */}
      <div className="relative hidden lg:flex lg:w-1/2 flex-col justify-between p-12 bg-primary overflow-hidden">
        <div className="absolute inset-0 opacity-10 pointer-events-none">
          <svg className="h-full w-full" preserveAspectRatio="none" viewBox="0 0 100 100">
            <defs>
              <pattern id="grid" width="10" height="10" patternUnits="userSpaceOnUse">
                <path d="M 10 0 L 0 0 0 10" fill="none" stroke="white" strokeWidth="0.5" />
              </pattern>
            </defs>
            <rect width="100" height="100" fill="url(#grid)" />
          </svg>
        </div>

        <div className="relative z-10 flex items-center gap-3 text-white">
          <div className="bg-white/20 p-2 rounded-lg backdrop-blur-sm">
            <span className="material-symbols-outlined text-3xl">account_balance_wallet</span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight">ProLedger</h1>
        </div>

        <div className="relative z-10">
          <blockquote className="space-y-4">
            <p className="text-4xl font-semibold leading-tight text-white/90">
              "Join thousands of businesses managing their finances with ease."
            </p>
            <footer className="text-lg text-white/70">— Professional, Secure, Scalable.</footer>
          </blockquote>
        </div>

        <div className="relative z-10 flex gap-4">
          <div className="h-1 w-12 bg-white/30 rounded-full" />
          <div className="h-1 w-12 bg-white rounded-full" />
          <div className="h-1 w-12 bg-white/30 rounded-full" />
        </div>
      </div>

      {/* Right Side: Register Form */}
      <div className="flex-1 flex flex-col justify-center items-center px-6 py-12 lg:px-24 overflow-y-auto">
        <div className="w-full max-w-md space-y-8">
          <div className="lg:hidden flex items-center gap-3 mb-8">
            <div className="bg-primary p-2 rounded-lg">
              <span className="material-symbols-outlined text-white text-2xl">account_balance_wallet</span>
            </div>
            <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100">ProLedger</h2>
          </div>

          <div className="space-y-2">
            <h2 className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-slate-100">Create your account</h2>
            <p className="text-slate-500 dark:text-slate-400">Join ProLedger and start managing your invoices today.</p>
          </div>

          <form className="space-y-4" onSubmit={handleRegister}>
            <div className="grid grid-cols-1 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Full Name</label>
                <input
                  name="name"
                  type="text"
                  required
                  placeholder="John Doe"
                  value={formData.name}
                  onChange={handleChange}
                  className="block w-full px-3 py-2.5 border border-slate-200 dark:border-slate-800 rounded-lg bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-primary/50"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Email Address</label>
                <input
                  name="email"
                  type="email"
                  required
                  placeholder="john@example.com"
                  value={formData.email}
                  onChange={handleChange}
                  className="block w-full px-3 py-2.5 border border-slate-200 dark:border-slate-800 rounded-lg bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-primary/50"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Business Name</label>
                <input
                  name="businessName"
                  type="text"
                  required
                  placeholder="Acme Corp"
                  value={formData.businessName}
                  onChange={handleChange}
                  className="block w-full px-3 py-2.5 border border-slate-200 dark:border-slate-800 rounded-lg bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-primary/50"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Password</label>
                <div className="relative">
                  <input
                    name="password"
                    type={showPassword ? "text" : "password"}
                    required
                    placeholder="••••••••"
                    value={formData.password}
                    onChange={handleChange}
                    className="block w-full px-3 py-2.5 border border-slate-200 dark:border-slate-800 rounded-lg bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-primary/50"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400"
                  >
                    <span className="material-symbols-outlined text-xl">{showPassword ? "visibility_off" : "visibility"}</span>
                  </button>
                </div>
              </div>
            </div>

            <div className="flex items-center">
              <input id="terms" type="checkbox" required className="h-4 w-4 text-primary focus:ring-primary border-slate-300 rounded cursor-pointer" />
              <label htmlFor="terms" className="ml-2 block text-sm text-slate-700 dark:text-slate-300 cursor-pointer">
                I agree to the <span className="text-primary font-bold">Terms of Service</span> and <span className="text-primary font-bold">Privacy Policy</span>
              </label>
            </div>

            <button
              type="submit"
              className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-bold text-white bg-primary hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary transition-all"
            >
              Create Account
            </button>
          </form>

          <p className="text-center text-sm text-slate-500 dark:text-slate-400">
            Already have an account?{" "}
            <Link href="/login" className="font-bold text-primary hover:text-primary/80">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
