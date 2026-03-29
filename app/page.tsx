"use client";

import Link from "next/link";
import Navbar from "@/components/Navbar";

export default function Home() {
  return (
    <div className="min-h-screen bg-muted/5">
      <Navbar />
      <main className="max-w-4xl mx-auto p-12 text-center space-y-8 mt-20">
        <h1 className="text-6xl font-extrabold tracking-tight text-gray-900">
          Smart <span className="text-primary">Reimbursement</span> Management
        </h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          Streamline your company&apos;s expense approval process with multi-level workflows, custom rules, and OCR-powered receipt scanning.
        </p>
        <div className="flex justify-center gap-4 pt-4">
          <Link href="/signup" className="px-8 py-3 bg-primary text-white rounded-lg font-bold shadow-lg hover:bg-primary/90 transition-all hover:scale-105">
            Get Started
          </Link>
          <Link href="/signin" className="px-8 py-3 bg-white border border-gray-300 rounded-lg font-bold shadow-sm hover:bg-muted/50 transition-all hover:scale-105">
            Sign In
          </Link>
        </div>
        
        <div className="pt-20 grid grid-cols-1 md:grid-cols-3 gap-8 text-left">
          <div className="bg-white p-6 rounded-xl border shadow-sm">
            <div className="w-10 h-10 bg-blue-100 text-blue-600 rounded-lg flex items-center justify-center mb-4 font-bold">1</div>
            <h3 className="font-bold text-lg mb-2">Automated Flows</h3>
            <p className="text-sm text-muted-foreground">Define complex sequential or percentage-based approval workflows in seconds.</p>
          </div>
          <div className="bg-white p-6 rounded-xl border shadow-sm">
            <div className="w-10 h-10 bg-green-100 text-green-600 rounded-lg flex items-center justify-center mb-4 font-bold">2</div>
            <h3 className="font-bold text-lg mb-2">Multi-Currency</h3>
            <p className="text-sm text-muted-foreground">Submit expenses in any currency and see them auto-converted to your company base.</p>
          </div>
          <div className="bg-white p-6 rounded-xl border shadow-sm">
            <div className="w-10 h-10 bg-purple-100 text-purple-600 rounded-lg flex items-center justify-center mb-4 font-bold">3</div>
            <h3 className="font-bold text-lg mb-2">Role Based</h3>
            <p className="text-sm text-muted-foreground">Tailored dashboards for Employees, Managers, and Admins to manage their tasks.</p>
          </div>
        </div>
      </main>
    </div>
  );
}
