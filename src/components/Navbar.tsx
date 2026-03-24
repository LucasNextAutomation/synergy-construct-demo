"use client"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { usePathname } from "next/navigation"
import { FileSearch, Building2, Calculator, Shield, Menu, X } from "lucide-react"
import LiveIndicator from "@/components/LiveIndicator"

const navItems = [
  { href: "/", label: "Overview" },
  { href: "/tenders", label: "Tender Monitor", icon: FileSearch, live: true },
  { href: "/investments", label: "Investment Finder", icon: Building2 },
  { href: "/roi", label: "ROI Calculator", icon: Calculator },
  { href: "/processing", label: "Processing", icon: Shield },
]

export default function Navbar() {
  const pathname = usePathname()
  const [mobileOpen, setMobileOpen] = useState(false)

  return (
    <nav className="sticky top-0 z-50 bg-[#0C0E12]/80 backdrop-blur-xl border-b border-[#252A35]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="flex items-center gap-3">
            <Image
              src="/synergy-logo-dark.png"
              alt="Synergy Construct"
              width={160}
              height={40}
              className="h-9 w-auto object-contain"
              priority
            />
          </Link>

          {/* Desktop nav */}
          <div className="hidden md:flex items-center gap-0.5">
            {navItems.map(item => {
              const active = pathname === item.href
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200 ${
                    active
                      ? "bg-[#3B7BF5]/10 text-[#3B7BF5]"
                      : "text-[#7A8499] hover:text-[#E8ECF4] hover:bg-[#1A1E27]"
                  }`}
                >
                  {item.icon && <item.icon className="w-3.5 h-3.5" />}
                  <span>{item.label}</span>
                  {item.live && <LiveIndicator compact />}
                </Link>
              )
            })}
          </div>

          <div className="flex items-center gap-3">
            <span className="hidden md:inline text-xs text-[#7A8499]">
              Built by <span className="text-[#3B7BF5] font-medium">NextAutomation</span>
            </span>

            {/* Mobile hamburger */}
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="md:hidden p-2 rounded-lg hover:bg-[#1A1E27] text-[#7A8499] transition-colors duration-200"
            >
              {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="md:hidden border-t border-[#252A35] bg-[#13161C]">
          <div className="px-4 py-3 space-y-0.5">
            {navItems.map(item => {
              const active = pathname === item.href
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setMobileOpen(false)}
                  className={`flex items-center gap-2.5 px-4 py-3 rounded-lg text-sm font-medium transition-colors duration-200 ${
                    active
                      ? "bg-[#3B7BF5]/10 text-[#3B7BF5]"
                      : "text-[#7A8499] hover:bg-[#1A1E27] hover:text-[#E8ECF4]"
                  }`}
                >
                  {item.icon && <item.icon className="w-4 h-4" />}
                  <span>{item.label}</span>
                  {item.live && <LiveIndicator compact />}
                </Link>
              )
            })}
            <div className="pt-3 mt-2 border-t border-[#252A35] px-4 text-xs text-[#7A8499]">
              Built by <span className="text-[#3B7BF5] font-medium">NextAutomation</span>
            </div>
          </div>
        </div>
      )}
    </nav>
  )
}
