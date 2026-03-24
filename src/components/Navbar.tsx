"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { usePathname } from "next/navigation"
import { Menu, X } from "lucide-react"

const navItems = [
  { href: "/", label: "Overview" },
  { href: "/tenders", label: "Tender Monitor" },
  { href: "/investments", label: "Investment Finder" },
  { href: "/processing", label: "Processing" },
  { href: "/roi", label: "ROI" },
  { href: "/collaboration", label: "Collaboration" },
]

export default function Navbar() {
  const pathname = usePathname()
  const [mobileOpen, setMobileOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 8)
    window.addEventListener("scroll", handleScroll, { passive: true })
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  return (
    <nav
      style={{
        position: "sticky",
        top: 0,
        zIndex: 50,
        height: 64,
        backgroundColor: "#ffffff",
        borderBottom: scrolled ? "1px solid #e8eaed" : "1px solid transparent",
        backdropFilter: scrolled ? "blur(12px)" : "none",
        boxShadow: scrolled ? "0 1px 8px rgba(0,0,0,0.06)" : "none",
        transition: "all 0.2s ease",
      }}
    >
      <div
        style={{
          maxWidth: 960,
          margin: "0 auto",
          padding: "0 40px",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        {/* Logo */}
        <Link href="/" style={{ display: "flex", alignItems: "center" }}>
          <Image
            src="/synergy-logo.png"
            alt="Synergy Construct"
            width={160}
            height={40}
            style={{ height: 36, width: "auto", objectFit: "contain" }}
            priority
          />
        </Link>

        {/* Desktop nav */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 4,
          }}
          className="hidden md:flex"
        >
          {navItems.map(item => {
            const active = pathname === item.href
            return (
              <Link
                key={item.href}
                href={item.href}
                style={{
                  padding: "6px 14px",
                  borderRadius: 8,
                  fontSize: 14,
                  fontWeight: 500,
                  color: active ? "#E31E24" : "#64748b",
                  borderBottom: active ? "2px solid #E31E24" : "2px solid transparent",
                  transition: "all 0.15s ease",
                  textDecoration: "none",
                }}
                onMouseEnter={e => {
                  if (!active) (e.currentTarget as HTMLElement).style.color = "#0f172a"
                }}
                onMouseLeave={e => {
                  if (!active) (e.currentTarget as HTMLElement).style.color = "#64748b"
                }}
              >
                {item.label}
              </Link>
            )
          })}
        </div>

        {/* Right badge */}
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <span
            className="hidden md:inline"
            style={{
              fontSize: 12,
              fontWeight: 500,
              color: "#64748b",
              backgroundColor: "#f6f7f8",
              border: "1px solid #e8eaed",
              borderRadius: 20,
              padding: "4px 12px",
            }}
          >
            Built by{" "}
            <span style={{ color: "#E31E24", fontWeight: 600 }}>NextAutomation</span>
          </span>

          {/* Mobile hamburger */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="md:hidden"
            style={{
              padding: 8,
              borderRadius: 8,
              background: "none",
              border: "1px solid #e8eaed",
              cursor: "pointer",
              color: "#64748b",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            {mobileOpen ? <X size={18} /> : <Menu size={18} />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div
          className="md:hidden"
          style={{
            backgroundColor: "#ffffff",
            borderTop: "1px solid #e8eaed",
            borderBottom: "1px solid #e8eaed",
          }}
        >
          <div style={{ padding: "12px 16px", display: "flex", flexDirection: "column", gap: 2 }}>
            {navItems.map(item => {
              const active = pathname === item.href
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setMobileOpen(false)}
                  style={{
                    display: "block",
                    padding: "12px 16px",
                    borderRadius: 8,
                    fontSize: 15,
                    fontWeight: 500,
                    color: active ? "#E31E24" : "#64748b",
                    backgroundColor: active ? "#E31E2408" : "transparent",
                    textDecoration: "none",
                    transition: "all 0.15s ease",
                  }}
                >
                  {item.label}
                </Link>
              )
            })}
            <div
              style={{
                marginTop: 8,
                paddingTop: 12,
                borderTop: "1px solid #e8eaed",
                paddingLeft: 16,
                fontSize: 12,
                color: "#64748b",
              }}
            >
              Built by <span style={{ color: "#E31E24", fontWeight: 600 }}>NextAutomation</span>
            </div>
          </div>
        </div>
      )}
    </nav>
  )
}
