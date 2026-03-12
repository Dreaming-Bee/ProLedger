"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault()
    // Store auth state (in production, use proper auth)
    localStorage.setItem("auth", "true")
    localStorage.setItem("user", email)
    router.push("/dashboard")
  }

  return (
    <div className="min-h-screen flex flex-col lg:flex-row bg-background-light dark:bg-background-dark">
      {/* Left Side: Branding Area */}
      <div className="relative hidden lg:flex lg:w-1/2 flex-col justify-between p-12 bg-primary overflow-hidden">
        {/* Decorative Background Pattern */}
        <div className="absolute inset-0 opacity-10 pointer-events-none">
          <svg
            className="h-full w-full"
            preserveAspectRatio="none"
            viewBox="0 0 100 100"
          >
            <defs>
              <pattern
                id="grid"
                width="10"
                height="10"
                patternUnits="userSpaceOnUse"
              >
                <path d="M 10 0 L 0 0 0 10" fill="none" stroke="white" strokeWidth="0.5" />
              </pattern>
            </defs>
            <rect width="100" height="100" fill="url(#grid)" />
          </svg>
        </div>

        {/* Logo */}
        <div className="relative z-10 flex items-center gap-3 text-white">
          <div className="bg-white/20 p-2 rounded-lg backdrop-blur-sm">
            <span className="material-symbols-outlined text-3xl">
              account_balance_wallet
            </span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight">ProLedger</h1>
        </div>

        {/* Quote */}
        <div className="relative z-10">
          <blockquote className="space-y-4">
            <p className="text-4xl font-semibold leading-tight text-white/90">
              "The most advanced financial management platform for modern
              enterprises."
            </p>
            <footer className="text-lg text-white/70">
              — Trusted by over 10,000 businesses globally.
            </footer>
          </blockquote>
        </div>

        {/* Indicators */}
        <div className="relative z-10 flex gap-4">
          <div className="h-1 w-12 bg-white rounded-full" />
          <div className="h-1 w-12 bg-white/30 rounded-full" />
          <div className="h-1 w-12 bg-white/30 rounded-full" />
        </div>
      </div>

      {/* Right Side: Login Form */}
      <div className="flex-1 flex flex-col justify-center items-center px-6 py-12 lg:px-24">
        <div className="w-full max-w-md space-y-8">
          {/* Mobile Header */}
          <div className="lg:hidden flex items-center gap-3 mb-12">
            <div className="bg-primary p-2 rounded-lg">
              <span className="material-symbols-outlined text-white text-2xl">
                account_balance_wallet
              </span>
            </div>
            <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100">
              ProLedger
            </h2>
          </div>

          {/* Header */}
          <div className="space-y-2">
            <h2 className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-slate-100">
              Welcome back
            </h2>
            <p className="text-slate-500 dark:text-slate-400">
              Enter your credentials to access your ProLedger account.
            </p>
          </div>

          {/* Form */}
          <form className="space-y-6" onSubmit={handleLogin}>
            {/* Email Field */}
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2"
              >
                Email Address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <span className="material-symbols-outlined text-slate-400 text-xl">
                    mail
                  </span>
                </div>
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  placeholder="name@company.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="block w-full pl-10 pr-3 py-3 border border-slate-200 dark:border-slate-800 rounded-lg bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all duration-200"
                />
              </div>
            </div>

            {/* Password Field */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label
                  htmlFor="password"
                  className="block text-sm font-medium text-slate-700 dark:text-slate-300"
                >
                  Password
                </label>
                <a
                  href="#"
                  className="text-sm font-semibold text-primary hover:text-primary/80 transition-colors"
                >
                  Forgot password?
                </a>
              </div>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <span className="material-symbols-outlined text-slate-400 text-xl">
                    lock
                  </span>
                </div>
                <input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="current-password"
                  required
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="block w-full pl-10 pr-12 py-3 border border-slate-200 dark:border-slate-800 rounded-lg bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all duration-200"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600"
                >
                  <span className="material-symbols-outlined text-xl">
                    {showPassword ? "visibility_off" : "visibility"}
                  </span>
                </button>
              </div>
            </div>

            {/* Remember Me */}
            <div className="flex items-center">
              <input
                id="remember-me"
                name="remember-me"
                type="checkbox"
                className="h-4 w-4 text-primary focus:ring-primary border-slate-300 rounded cursor-pointer"
              />
              <label
                htmlFor="remember-me"
                className="ml-2 block text-sm text-slate-700 dark:text-slate-300 cursor-pointer"
              >
                Keep me logged in
              </label>
            </div>

            {/* Submit Button */}
            <div>
              <button
                type="submit"
                className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-bold text-white bg-primary hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary transition-all duration-200"
              >
                Sign in to Account
              </button>
            </div>
          </form>

          {/* Divider */}
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-slate-200 dark:border-slate-800" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-background-light dark:bg-background-dark text-slate-500">
                Or continue with
              </span>
            </div>
          </div>

          {/* OAuth Buttons */}
          <div className="grid grid-cols-2 gap-4">
            <button
              type="button"
              className="flex w-full items-center justify-center gap-2 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-4 py-2.5 text-sm font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
            >
              <svg
                className="h-5 w-5"
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
              </svg>
              Google
            </button>
            <button
              type="button"
              className="flex w-full items-center justify-center gap-2 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-4 py-2.5 text-sm font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
            >
              <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
                <path d="M17.05 13.75c0-.61.47-1.18 1.25-1.18.78 0 1.25.57 1.25 1.18 0 .61-.47 1.18-1.25 1.18-.78 0-1.25-.57-1.25-1.18zm-4.5 0c0-.61.47-1.18 1.25-1.18s1.25.57 1.25 1.18c0 .61-.47 1.18-1.25 1.18s-1.25-.57-1.25-1.18zm-4.5 0c0-.61.47-1.18 1.25-1.18s1.25.57 1.25 1.18c0 .61-.47 1.18-1.25 1.18-1.25 0-1.25-.57-1.25-1.18z" />
              </svg>
              Apple
            </button>
          </div>

          {/* Sign Up Link */}
          <p className="text-center text-sm text-slate-500 dark:text-slate-400">
            Don't have an account yet?{" "}
            <Link href="/register" className="font-bold text-primary hover:text-primary/80 transition-colors">
              Create an account
            </Link>
          </p>
        </div>

        {/* Footer */}
        <div className="mt-12 flex gap-6 text-xs text-slate-400 uppercase tracking-widest font-semibold">
          <a href="#" className="hover:text-slate-600 transition-colors">
            Terms
          </a>
          <a href="#" className="hover:text-slate-600 transition-colors">
            Privacy
          </a>
          <a href="#" className="hover:text-slate-600 transition-colors">
            Contact
          </a>
        </div>
      </div>
    </div>
  )
}
