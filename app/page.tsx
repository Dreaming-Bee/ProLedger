"use client"

import Link from "next/link"
import { useRouter } from "next/navigation"

export default function LandingPage() {
  const router = useRouter()

  return (
    <div className="min-h-screen bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-100 font-sans selection:bg-primary/30 selection:text-primary">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 dark:bg-slate-950/80 backdrop-blur-xl border-b border-slate-200 dark:border-slate-800">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="size-10 bg-primary rounded-xl flex items-center justify-center text-white shadow-lg shadow-primary/20">
              <span className="material-symbols-outlined">account_balance_wallet</span>
            </div>
            <span className="text-xl font-black tracking-tighter">ProLedger</span>
          </div>
          
          <div className="hidden md:flex items-center gap-8 text-sm font-bold text-slate-500">
            <a href="#features" className="hover:text-primary transition-colors">Features</a>
            <a href="#solutions" className="hover:text-primary transition-colors">Solutions</a>
            <a href="#pricing" className="hover:text-primary transition-colors">Pricing</a>
          </div>

          <div className="flex items-center gap-4">
            <Link href="/login" className="text-sm font-bold px-4 py-2 hover:text-primary transition-colors">
              Log in
            </Link>
            <Link href="/register" className="bg-primary text-white text-sm font-black px-6 py-2.5 rounded-full shadow-lg shadow-primary/20 hover:scale-[1.02] active:scale-[0.98] transition-all">
              Get Started Free
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 md:pt-48 md:pb-32 overflow-hidden">
        {/* Background Gradients */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[600px] pointer-events-none opacity-30">
          <div className="absolute top-[-100px] left-[-200px] w-96 h-96 bg-primary rounded-full blur-[120px]" />
          <div className="absolute top-[200px] right-[-200px] w-96 h-96 bg-blue-400 rounded-full blur-[120px]" />
        </div>

        <div className="max-w-7xl mx-auto px-6 relative z-10 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-xs font-black uppercase tracking-widest mb-8 animate-fade-in">
            <span className="material-symbols-outlined text-[14px]">bolt</span>
            The Future of Invoicing is here
          </div>
          
          <h1 className="text-5xl md:text-8xl font-black tracking-tighter leading-[0.9] mb-8 max-w-4xl mx-auto">
            Invoice management <br />
            <span className="text-primary italic">reimagined</span> for modern teams.
          </h1>
          
          <p className="text-lg md:text-xl text-slate-500 dark:text-slate-400 max-w-2xl mx-auto mb-12 leading-relaxed">
            Beautifully crafted, automated, and secure. ProLedger helps you create professional invoices, track client engagement, and get paid 3x faster.
          </p>

          <div className="flex flex-col md:flex-row items-center justify-center gap-4">
            <Link href="/register" className="w-full md:w-auto bg-primary text-white text-lg font-black px-10 py-5 rounded-2xl shadow-2xl shadow-primary/20 hover:scale-[1.03] active:scale-[0.97] transition-all flex items-center justify-center gap-3">
              Start Free Trial
              <span className="material-symbols-outlined">arrow_forward</span>
            </Link>
            <button className="w-full md:w-auto bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-slate-100 text-lg font-bold px-10 py-5 rounded-2xl hover:bg-slate-50 transition-colors">
              Book a Demo
            </button>
          </div>

          {/* Social Proof */}
          <div className="mt-20 pt-10 border-t border-slate-100 dark:border-slate-900">
            <p className="text-xs font-bold text-slate-400 uppercase tracking-[0.2em] mb-8">Trusted by teams at</p>
            <div className="flex flex-wrap justify-center items-center gap-12 opacity-40 grayscale group hover:grayscale-0 transition-all">
              <div className="text-xl font-black italic">TECHNO</div>
              <div className="text-xl font-black italic">GLOBAL</div>
              <div className="text-xl font-black italic">STATION</div>
              <div className="text-xl font-black italic">LUMINA</div>
              <div className="text-xl font-black italic">VANTAGE</div>
            </div>
          </div>
        </div>
      </section>

      {/* Feature Grid Section */}
      <section id="features" className="py-24 bg-slate-50 dark:bg-slate-900/50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16 space-y-4">
            <h2 className="text-4xl md:text-6xl font-black tracking-tighter">Everything you need to scale.</h2>
            <p className="text-lg text-slate-500 max-w-2xl mx-auto">Skip the spreadsheet headaches. Our intuitive tools handle the heavy lifting of financial documentation.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white dark:bg-slate-900 p-8 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-xl hover:-translate-y-2 transition-all">
              <div className="size-16 bg-blue-500 rounded-2xl flex items-center justify-center text-white mb-6">
                <span className="material-symbols-outlined text-3xl">edit_document</span>
              </div>
              <h3 className="text-xl font-bold mb-3">Professional Templates</h3>
              <p className="text-slate-500 text-sm leading-relaxed">Choose from dozens of designer-made templates. Fully customize colors, fonts, and layouts to match your brand.</p>
            </div>

            <div className="bg-white dark:bg-slate-900 p-8 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-xl hover:-translate-y-2 transition-all">
              <div className="size-16 bg-primary rounded-2xl flex items-center justify-center text-white mb-6">
                <span className="material-symbols-outlined text-3xl">track_changes</span>
              </div>
              <h3 className="text-xl font-bold mb-3">Real-time Tracking</h3>
              <p className="text-slate-500 text-sm leading-relaxed">Know exactly when a client views your invoice. Track payment status and set up automatic reminders.</p>
            </div>

            <div className="bg-white dark:bg-slate-900 p-8 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-xl hover:-translate-y-2 transition-all">
              <div className="size-16 bg-amber-500 rounded-2xl flex items-center justify-center text-white mb-6">
                <span className="material-symbols-outlined text-3xl">lock_open</span>
              </div>
              <h3 className="text-xl font-bold mb-3">Secure Client Portals</h3>
              <p className="text-slate-500 text-sm leading-relaxed">Give your clients a polished, private link to view and pay. No login required for your customers.</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 overflow-hidden relative">
        <div className="max-w-7xl mx-auto px-6">
          <div className="bg-primary rounded-[3rem] p-12 md:p-20 text-center text-white relative overflow-hidden">
            {/* Background pattern */}
            <div className="absolute inset-0 opacity-10">
              <div className="absolute -top-24 -right-24 size-96 bg-white rounded-full blur-[80px]" />
              <div className="absolute -bottom-24 -left-24 size-96 bg-blue-200 rounded-full blur-[80px]" />
            </div>

            <h2 className="text-4xl md:text-7xl font-black tracking-tighter leading-tight mb-8 relative z-10 text-white">
              Ready to modernize <br /> your billing workflow?
            </h2>
            <p className="text-lg text-white/80 max-w-xl mx-auto mb-12 relative z-10">
              Join 10,000+ organizations who trust ProLedger for their professional invoicing needs. No credit card required.
            </p>
            <Link href="/register" className="inline-flex items-center gap-2 bg-white text-primary text-xl font-black px-12 py-5 rounded-2xl shadow-2xl hover:scale-105 active:scale-95 transition-all relative z-10">
              Sign Up Now
              <span className="material-symbols-outlined">rocket_launch</span>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-20 border-t border-slate-200 dark:border-slate-800">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-12">
          <div className="col-span-2 md:col-span-1 space-y-6">
            <div className="flex items-center gap-3">
              <div className="size-8 bg-primary rounded-lg flex items-center justify-center text-white">
                <span className="material-symbols-outlined text-xl">account_balance_wallet</span>
              </div>
              <span className="text-lg font-black tracking-tighter">ProLedger</span>
            </div>
            <p className="text-sm text-slate-500 leading-relaxed">The global standard for professional invoice management. Built for speed and scale.</p>
          </div>
          
          <div className="space-y-4">
            <h4 className="text-xs font-black uppercase tracking-widest">Product</h4>
            <ul className="text-sm text-slate-500 space-y-2">
              <li><a href="#" className="hover:text-primary transition-colors">Features</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">Templates</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">Client Portal</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">API</a></li>
            </ul>
          </div>

          <div className="space-y-4">
            <h4 className="text-xs font-black uppercase tracking-widest">Company</h4>
            <ul className="text-sm text-slate-500 space-y-2">
              <li><a href="#" className="hover:text-primary transition-colors">About Us</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">Carrers</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">Press</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">Contact</a></li>
            </ul>
          </div>

          <div className="space-y-4">
            <h4 className="text-xs font-black uppercase tracking-widest">Legal</h4>
            <ul className="text-sm text-slate-500 space-y-2">
              <li><a href="#" className="hover:text-primary transition-colors">Privacy</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">Terms</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">Security</a></li>
            </ul>
          </div>
        </div>
        
        <div className="max-w-7xl mx-auto px-6 mt-20 pt-10 border-t border-slate-100 dark:border-slate-900 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-xs text-slate-400 font-medium">© 2024 ProLedger Systems. All rights reserved.</p>
          <div className="flex gap-6">
             <span className="material-symbols-outlined text-slate-400 hover:text-primary cursor-pointer transition-colors">public</span>
             <span className="material-symbols-outlined text-slate-400 hover:text-primary cursor-pointer transition-colors">translate</span>
          </div>
        </div>
      </footer>
    </div>
  )
}
