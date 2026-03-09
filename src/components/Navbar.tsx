"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { FileSearch, Building2, Calculator, Menu, X } from "lucide-react"

const navItems = [
  { href: "/", label: "Overview" },
  { href: "/tenders", label: "Tender Monitor", icon: FileSearch },
  { href: "/investments", label: "Investment Finder", icon: Building2 },
  { href: "/roi", label: "ROI Calculator", icon: Calculator },
]

export default function Navbar() {
  const pathname = usePathname()
  const [mobileOpen, setMobileOpen] = useState(false)

  return (
    <nav className="sticky top-0 z-50 bg-white/90 backdrop-blur-xl border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-[#1B2A4A] flex items-center justify-center">
              <span className="text-[#D4A843] font-bold text-sm">SC</span>
            </div>
            <div className="hidden sm:block">
              <span className="text-sm font-semibold text-gray-900 tracking-tight">Synergy Construct</span>
            </div>
          </Link>

          {/* Desktop nav */}
          <div className="hidden md:flex items-center gap-0.5">
            {navItems.map(item => {
              const active = pathname === item.href
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                    active
                      ? "bg-[#1B2A4A] text-white"
                      : "text-gray-400 hover:text-gray-900 hover:bg-gray-50"
                  }`}
                >
                  {item.icon && <item.icon className="w-3.5 h-3.5" />}
                  <span>{item.label}</span>
                </Link>
              )
            })}
          </div>

          <div className="flex items-center gap-3">
            <span className="hidden md:inline text-xs text-gray-400">
              Built by <span className="text-[#D4A843] font-medium">NextAutomation</span>
            </span>

            {/* Mobile hamburger */}
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="md:hidden p-2 rounded-lg hover:bg-gray-50 text-gray-400"
            >
              {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="md:hidden border-t border-gray-100 bg-white">
          <div className="px-4 py-3 space-y-0.5">
            {navItems.map(item => {
              const active = pathname === item.href
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setMobileOpen(false)}
                  className={`flex items-center gap-2.5 px-4 py-3 rounded-lg text-sm font-medium transition-all ${
                    active
                      ? "bg-[#1B2A4A] text-white"
                      : "text-gray-500 hover:bg-gray-50 hover:text-gray-900"
                  }`}
                >
                  {item.icon && <item.icon className="w-4 h-4" />}
                  {item.label}
                </Link>
              )
            })}
            <div className="pt-3 mt-2 border-t border-gray-100 px-4 text-xs text-gray-400">
              Built by <span className="text-[#D4A843] font-medium">NextAutomation</span>
            </div>
          </div>
        </div>
      )}
    </nav>
  )
}
