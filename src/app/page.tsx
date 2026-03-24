"use client"

import Link from "next/link"
import Image from "next/image"
import { motion } from "framer-motion"
import {
  FileSearch,
  Building2,
  Calculator,
  Shield,
  ArrowRight,
  CheckCircle2,
  Clock,
  TrendingUp,
  Database,
} from "lucide-react"
import AnimatedCounter from "@/components/AnimatedCounter"
import { realStats } from "@/data/seap-real"

// ─── Data ─────────────────────────────────────────────────────────────────────
const stats = [
  {
    label: "Tenders Monitored",
    value: realStats.totalMonitored,
    sub: "Active in SEAP system",
    icon: FileSearch,
    accentColor: "#3B82F6",
  },
  {
    label: "Construction Matches",
    value: realStats.constructionFiltered,
    sub: "CPV 45* sector filtered",
    icon: TrendingUp,
    accentColor: "#22C55E",
  },
  {
    label: "Hours Saved Weekly",
    valueStr: "~18h",
    sub: "Across both modules",
    icon: Clock,
    accentColor: "#F59E0B",
  },
  {
    label: "Data Sources",
    valueStr: "6",
    sub: "Connected & active",
    icon: Database,
    accentColor: "#E31E24",
  },
]

const systems = [
  {
    href: "/tenders",
    title: "SEAP Tender Monitor",
    icon: FileSearch,
    description:
      "Automated monitoring of e-licitatie.ro for construction tenders matching your criteria. AI extracts data from scanned PDFs and P7S files, generating project briefs instantly.",
    links: [
      { label: "How It Works", href: "/tenders#how" },
      { label: "Live Demo", href: "/tenders" },
    ],
  },
  {
    href: "/investments",
    title: "Investment Finder",
    icon: Building2,
    description:
      "Aggregates off-market opportunities from 5 sources — UNPIR, ANABI, executari.com, imobiliare.ro, storia.ro — scoring each deal's investment potential with AI analysis.",
    links: [
      { label: "How It Works", href: "/investments#how" },
      { label: "Live Demo", href: "/investments" },
    ],
  },
  {
    href: "/processing",
    title: "Document Processing",
    icon: Shield,
    description:
      "Proven .p7m, .p7s, ZIP handling with real extraction pipeline and AI analysis. Complete pipeline walkthrough from raw SEAP download to structured brief.",
    links: [{ label: "View Pipeline", href: "/processing" }],
  },
]

const included = [
  "SEAP Tender Monitor (full build)",
  "Investment Finder (full build)",
  "Document Processing engine",
  "Unified dashboard",
  "Alert system (email + WhatsApp)",
  "SAP export preparation",
]

const managedFeatures = [
  "Monitor runs 24/7, no downtime",
  "AI model upgrades included",
  "New data sources on request",
  "Priority support channel",
]

const handoffFeatures = [
  "Full source code ownership",
  "Deployment documentation",
  "Self-hosted on your servers",
  "Training session included",
]

// ─── Card hover helpers (inline style approach) ───────────────────────────────
function CardWrapper({
  children,
  style,
}: {
  children: React.ReactNode
  style?: React.CSSProperties
}) {
  return (
    <div
      style={{
        backgroundColor: "#ffffff",
        border: "1px solid #e8eaed",
        borderRadius: 16,
        boxShadow: "0 1px 3px rgba(0,0,0,0.04)",
        transition: "all 0.2s ease",
        ...style,
      }}
      onMouseEnter={e => {
        const el = e.currentTarget as HTMLElement
        el.style.boxShadow = "0 4px 20px rgba(0,0,0,0.08)"
        el.style.transform = "translateY(-2px)"
        el.style.borderColor = "#d0d5dd"
      }}
      onMouseLeave={e => {
        const el = e.currentTarget as HTMLElement
        el.style.boxShadow = "0 1px 3px rgba(0,0,0,0.04)"
        el.style.transform = "translateY(0)"
        el.style.borderColor = "#e8eaed"
      }}
    >
      {children}
    </div>
  )
}

// ─── Page ─────────────────────────────────────────────────────────────────────
export default function HomePage() {
  return (
    <div style={{ backgroundColor: "#ffffff", minHeight: "100vh" }}>

      {/* ── Section 1: Hero ─────────────────────────────────────────────────── */}
      <section
        style={{
          backgroundColor: "#ffffff",
          paddingTop: 120,
          paddingBottom: 100,
          paddingLeft: 40,
          paddingRight: 40,
        }}
      >
        <div
          style={{
            maxWidth: 960,
            margin: "0 auto",
            textAlign: "center",
          }}
        >
          {/* Logo */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
            style={{ display: "flex", justifyContent: "center", marginBottom: 40 }}
          >
            <Image
              src="/synergy-logo.png"
              alt="Synergy Construct"
              width={220}
              height={56}
              style={{ height: 52, width: "auto", objectFit: "contain" }}
              priority
            />
          </motion.div>

          {/* Headline */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1, ease: "easeOut" }}
            style={{
              fontSize: "clamp(40px, 6vw, 64px)",
              fontWeight: 800,
              color: "#0f172a",
              letterSpacing: "-0.03em",
              lineHeight: 1.1,
              margin: "0 0 20px",
            }}
          >
            AI-Powered Construction
            <br />
            Intelligence
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2, ease: "easeOut" }}
            style={{
              fontSize: 18,
              color: "#64748b",
              lineHeight: 1.65,
              maxWidth: 560,
              margin: "0 auto",
            }}
          >
            Two AI systems working together — monitor SEAP tenders automatically and discover
            off-market investment opportunities before the competition.
          </motion.p>
        </div>
      </section>

      {/* ── Section 2: Stats Row ─────────────────────────────────────────────── */}
      <section
        style={{
          backgroundColor: "#ffffff",
          paddingBottom: 100,
          paddingLeft: 40,
          paddingRight: 40,
        }}
      >
        <div
          style={{
            maxWidth: 960,
            margin: "0 auto",
            display: "grid",
            gridTemplateColumns: "repeat(4, 1fr)",
            gap: 16,
          }}
          className="!grid-cols-2 sm:!grid-cols-4"
        >
          {stats.map((s, i) => (
            <motion.div
              key={s.label}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.08, ease: "easeOut" }}
            >
              <CardWrapper style={{ padding: 24, textAlign: "center" }}>
                <s.icon
                  size={20}
                  style={{ color: s.accentColor, margin: "0 auto 12px", display: "block" }}
                />
                <p
                  style={{
                    fontSize: 32,
                    fontWeight: 800,
                    color: "#0f172a",
                    letterSpacing: "-0.03em",
                    margin: "0 0 4px",
                    lineHeight: 1,
                  }}
                >
                  {s.value !== undefined ? (
                    <AnimatedCounter target={s.value} />
                  ) : (
                    s.valueStr
                  )}
                </p>
                <p
                  style={{
                    fontSize: 13,
                    fontWeight: 600,
                    color: "#0f172a",
                    margin: "0 0 4px",
                  }}
                >
                  {s.label}
                </p>
                <p style={{ fontSize: 11, color: "#94a3b8", margin: 0 }}>{s.sub}</p>
              </CardWrapper>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ── Section 3: Systems ───────────────────────────────────────────────── */}
      <section
        style={{
          backgroundColor: "#f6f7f8",
          paddingTop: 100,
          paddingBottom: 100,
          paddingLeft: 40,
          paddingRight: 40,
        }}
      >
        <div style={{ maxWidth: 960, margin: "0 auto" }}>
          {/* Eyebrow + heading */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            style={{ textAlign: "center", marginBottom: 56 }}
          >
            <p
              style={{
                fontSize: 11,
                fontWeight: 700,
                letterSpacing: "0.08em",
                textTransform: "uppercase",
                color: "#E31E24",
                marginBottom: 12,
              }}
            >
              Platform
            </p>
            <h2
              style={{
                fontSize: "clamp(28px, 4vw, 40px)",
                fontWeight: 800,
                color: "#0f172a",
                letterSpacing: "-0.03em",
                margin: 0,
              }}
            >
              Three Integrated Systems
            </h2>
          </motion.div>

          {/* 2×2 grid */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(2, 1fr)",
              gap: 20,
            }}
            className="!grid-cols-1 md:!grid-cols-2"
          >
            {systems.map((sys, i) => (
              <motion.div
                key={sys.href}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.08, ease: "easeOut" }}
              >
                <CardWrapper style={{ padding: 28 }}>
                  {/* Icon */}
                  <div
                    style={{
                      width: 44,
                      height: 44,
                      borderRadius: 10,
                      backgroundColor: "#f6f7f8",
                      border: "1px solid #e8eaed",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      marginBottom: 20,
                    }}
                  >
                    <sys.icon size={20} style={{ color: "#64748b" }} />
                  </div>

                  {/* Title + description */}
                  <h3
                    style={{
                      fontSize: 17,
                      fontWeight: 700,
                      color: "#0f172a",
                      letterSpacing: "-0.02em",
                      margin: "0 0 10px",
                    }}
                  >
                    {sys.title}
                  </h3>
                  <p
                    style={{
                      fontSize: 14,
                      color: "#64748b",
                      lineHeight: 1.65,
                      margin: "0 0 20px",
                    }}
                  >
                    {sys.description}
                  </p>

                  {/* Links */}
                  <div style={{ display: "flex", gap: 20, alignItems: "center" }}>
                    {sys.links.map(link => (
                      <Link
                        key={link.label}
                        href={link.href}
                        style={{
                          fontSize: 13,
                          fontWeight: 600,
                          color: "#E31E24",
                          textDecoration: "none",
                          display: "flex",
                          alignItems: "center",
                          gap: 4,
                        }}
                      >
                        {link.label} <ArrowRight size={13} />
                      </Link>
                    ))}
                  </div>
                </CardWrapper>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Section 4: Investment ────────────────────────────────────────────── */}
      <section
        style={{
          backgroundColor: "#ffffff",
          paddingTop: 100,
          paddingBottom: 100,
          paddingLeft: 40,
          paddingRight: 40,
        }}
      >
        <div style={{ maxWidth: 960, margin: "0 auto", display: "flex", justifyContent: "center" }}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            style={{
              backgroundColor: "#0f172a",
              borderRadius: 16,
              padding: "48px 48px",
              maxWidth: 700,
              width: "100%",
              color: "#ffffff",
            }}
          >
            {/* Eyebrow */}
            <p
              style={{
                fontSize: 11,
                fontWeight: 700,
                letterSpacing: "0.08em",
                textTransform: "uppercase",
                color: "#E31E24",
                marginBottom: 12,
              }}
            >
              Investment
            </p>

            {/* Title + price */}
            <h2
              style={{
                fontSize: 28,
                fontWeight: 800,
                letterSpacing: "-0.03em",
                margin: "0 0 8px",
              }}
            >
              Complete Platform
            </h2>
            <p
              style={{
                fontSize: 52,
                fontWeight: 800,
                letterSpacing: "-0.03em",
                margin: "0 0 4px",
                lineHeight: 1,
              }}
            >
              $11,000
            </p>
            <p
              style={{
                fontSize: 14,
                color: "#94a3b8",
                marginBottom: 36,
              }}
            >
              <s style={{ opacity: 0.5 }}>was $13,000</s>&nbsp;&nbsp;50% upfront · 50% at delivery
            </p>

            {/* Divider */}
            <div style={{ height: 1, backgroundColor: "rgba(255,255,255,0.1)", marginBottom: 32 }} />

            {/* Two columns */}
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: 32,
              }}
              className="!grid-cols-1 md:!grid-cols-2"
            >
              {/* Build column */}
              <div>
                <p
                  style={{
                    fontSize: 11,
                    fontWeight: 700,
                    letterSpacing: "0.08em",
                    textTransform: "uppercase",
                    color: "#94a3b8",
                    marginBottom: 16,
                  }}
                >
                  Build Includes
                </p>
                <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                  {included.map(item => (
                    <div key={item} style={{ display: "flex", alignItems: "flex-start", gap: 10 }}>
                      <CheckCircle2
                        size={15}
                        style={{ color: "#22C55E", flexShrink: 0, marginTop: 2 }}
                      />
                      <span style={{ fontSize: 14, color: "#e2e8f0", lineHeight: 1.5 }}>
                        {item}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Ongoing column */}
              <div>
                <p
                  style={{
                    fontSize: 11,
                    fontWeight: 700,
                    letterSpacing: "0.08em",
                    textTransform: "uppercase",
                    color: "#94a3b8",
                    marginBottom: 16,
                  }}
                >
                  After Delivery
                </p>
                <div style={{ marginBottom: 16 }}>
                  <p style={{ fontSize: 13, fontWeight: 600, color: "#ffffff", marginBottom: 8 }}>
                    Managed — $600/mo
                  </p>
                  <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                    {managedFeatures.map(f => (
                      <div key={f} style={{ display: "flex", alignItems: "flex-start", gap: 10 }}>
                        <CheckCircle2
                          size={14}
                          style={{ color: "#22C55E", flexShrink: 0, marginTop: 2 }}
                        />
                        <span style={{ fontSize: 13, color: "#94a3b8" }}>{f}</span>
                      </div>
                    ))}
                  </div>
                </div>
                <div>
                  <p style={{ fontSize: 13, fontWeight: 600, color: "#ffffff", marginBottom: 8 }}>
                    Handoff — $0/mo
                  </p>
                  <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                    {handoffFeatures.map(f => (
                      <div key={f} style={{ display: "flex", alignItems: "flex-start", gap: 10 }}>
                        <CheckCircle2
                          size={14}
                          style={{ color: "#64748b", flexShrink: 0, marginTop: 2 }}
                        />
                        <span style={{ fontSize: 13, color: "#94a3b8" }}>{f}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── Section 5: CTA ───────────────────────────────────────────────────── */}
      <section
        style={{
          backgroundColor: "#f6f7f8",
          paddingTop: 80,
          paddingBottom: 80,
          paddingLeft: 40,
          paddingRight: 40,
          textAlign: "center",
        }}
      >
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, ease: "easeOut" }}
        >
          <p
            style={{
              fontSize: 14,
              color: "#64748b",
              marginBottom: 20,
            }}
          >
            Ready to see how we work together?
          </p>
          <Link
            href="/collaboration"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 8,
              fontSize: 15,
              fontWeight: 700,
              color: "#E31E24",
              textDecoration: "none",
              padding: "14px 28px",
              borderRadius: 10,
              border: "2px solid #E31E24",
              transition: "all 0.2s ease",
              letterSpacing: "-0.01em",
            }}
            onMouseEnter={e => {
              const el = e.currentTarget as HTMLElement
              el.style.backgroundColor = "#E31E24"
              el.style.color = "#ffffff"
            }}
            onMouseLeave={e => {
              const el = e.currentTarget as HTMLElement
              el.style.backgroundColor = "transparent"
              el.style.color = "#E31E24"
            }}
          >
            See How We Work Together <ArrowRight size={16} />
          </Link>
        </motion.div>
      </section>
    </div>
  )
}
