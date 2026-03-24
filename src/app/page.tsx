"use client"

import Link from "next/link"
import { motion } from "framer-motion"
import { FileSearch, Building2, Calculator, Shield, ArrowRight, CheckCircle2, Clock, TrendingUp, Zap, Database } from "lucide-react"
import AnimatedCounter from "@/components/AnimatedCounter"
import { realStats } from "@/data/seap-real"

const systems = [
  {
    href: "/tenders",
    title: "SEAP Tender Monitor",
    icon: FileSearch,
    description: "Automated monitoring of e-licitatie.ro for construction tenders matching your criteria. AI extracts data from scanned PDFs and P7S files, generating project briefs instantly.",
    highlights: ["Real-time SEAP monitoring", "OCR for scanned PDFs & P7S", "AI-powered project briefs"],
    accent: "#3B7BF5",
  },
  {
    href: "/investments",
    title: "Investment Finder",
    icon: Building2,
    description: "Aggregates off-market opportunities from 6 sources — ANAF auctions, insolvency portals, listing platforms — scoring each deal's investment potential with AI analysis.",
    highlights: ["6 data sources connected", "AI investment scoring", "Below-market deal alerts"],
    accent: "#22C55E",
  },
  {
    href: "/roi",
    title: "ROI Calculator",
    icon: Calculator,
    description: "Interactive calculator showing the time and cost savings from automating your tender monitoring and investment search processes. Built to present to leadership.",
    highlights: ["Time savings projection", "Cost-benefit analysis", "Leadership-ready report"],
    accent: "#F59E0B",
  },
  {
    href: "/processing",
    title: "Document Processing",
    icon: Shield,
    description: "Proven .p7m, .p7s, ZIP handling with real extraction pipeline and AI analysis. Complete pipeline walkthrough from raw SEAP download to structured brief.",
    highlights: [".p7m / .p7s / ZIP handling", "Tesseract OCR pipeline", "AI analysis proof"],
    accent: "#60A5FA",
  },
]

const stats = [
  {
    label: "Tenders Monitored",
    value: realStats.totalMonitored,
    sub: "Active in SEAP system",
    icon: FileSearch,
    borderColor: "border-l-[#3B7BF5]",
    textColor: "text-[#3B7BF5]",
  },
  {
    label: "Construction Matches",
    value: realStats.constructionFiltered,
    sub: "CPV 45* sector filtered",
    icon: TrendingUp,
    borderColor: "border-l-[#22C55E]",
    textColor: "text-[#22C55E]",
  },
  {
    label: "Hours Saved Weekly",
    valueStr: "~18",
    sub: "Across both modules",
    icon: Clock,
    borderColor: "border-l-[#F59E0B]",
    textColor: "text-[#F59E0B]",
  },
  {
    label: "Data Sources",
    valueStr: "6",
    sub: "Connected & active",
    icon: Database,
    borderColor: "border-l-[#F97316]",
    textColor: "text-[#F97316]",
  },
]

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-[#0C0E12] dot-grid">
      {/* Hero */}
      <section className="relative py-24 md:py-36 overflow-hidden">
        {/* Radial blue glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-[#3B7BF5]/[0.06] rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-4xl mx-auto px-6 relative">
          <div className="text-center">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ ease: "easeOut", duration: 0.4 }}
              className="flex justify-center mb-10"
            >
              <div className="w-20 h-20 md:w-24 md:h-24 rounded-2xl bg-[#13161C] border border-[#252A35] flex items-center justify-center shadow-lg animate-pulse-glow">
                <span className="text-[#3B7BF5] font-bold text-2xl md:text-3xl">SC</span>
              </div>
            </motion.div>

            <motion.p
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1, ease: "easeOut" }}
              className="text-xs md:text-sm uppercase tracking-[0.2em] text-[#7A8499] font-medium mb-6"
            >
              Synergy Construct
            </motion.p>

            <motion.h1
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15, ease: "easeOut" }}
              className="text-3xl md:text-5xl lg:text-6xl font-semibold text-[#E8ECF4] mb-6 tracking-tight leading-[1.1]"
            >
              AI-Powered Construction<br />
              Intelligence
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.25, ease: "easeOut" }}
              className="text-base md:text-lg text-[#7A8499] mb-10 max-w-xl mx-auto leading-relaxed"
            >
              Two AI systems working together — monitor SEAP tenders automatically and discover off-market investment opportunities before the competition.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.35, ease: "easeOut" }}
              className="flex items-center justify-center gap-8 text-sm text-[#7A8499]"
            >
              <span className="flex items-center gap-2">
                <Zap className="w-3.5 h-3.5 text-[#3B7BF5]" />
                Deterministic scraping
              </span>
              <span className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-[#22C55E]" />
                AI analysis only
              </span>
              <span>Romania-wide coverage</span>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Stats Row */}
      <section className="py-4">
        <div className="max-w-5xl mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {stats.map((s, i) => (
              <motion.div
                key={s.label}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 + 0.05 * i, ease: "easeOut" }}
                className={`bg-[#13161C] border border-[#252A35] border-l-2 ${s.borderColor} rounded-xl p-4 text-center`}
              >
                <s.icon className={`w-5 h-5 mx-auto mb-2 ${s.textColor}`} />
                <p className="text-2xl font-bold text-[#E8ECF4]">
                  {s.value !== undefined ? (
                    <AnimatedCounter target={s.value} />
                  ) : (
                    s.valueStr
                  )}
                </p>
                <p className="text-xs text-[#E8ECF4] font-medium">{s.label}</p>
                <p className="text-[10px] text-[#7A8499] mt-0.5">{s.sub}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Divider */}
      <div className="max-w-24 mx-auto border-t border-[#252A35] my-8" />

      {/* System Cards */}
      <section className="py-12 md:py-20">
        <div className="max-w-5xl mx-auto px-6">
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5, ease: "easeOut" }}
            className="text-center text-xs uppercase tracking-[0.2em] text-[#7A8499] font-medium mb-14"
          >
            Explore the live demos
          </motion.p>

          <div className="grid md:grid-cols-2 xl:grid-cols-4 gap-5">
            {systems.map((sys, i) => (
              <motion.div
                key={sys.href}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.55 + 0.08 * i, ease: "easeOut" }}
              >
                <Link href={sys.href} className="block group h-full">
                  <div className="relative h-full bg-[#13161C] border border-[#252A35] rounded-2xl p-6 transition-colors duration-200 hover:border-[#343B4A] hover:bg-[#1A1E27]">
                    <div
                      className="w-10 h-10 rounded-xl bg-[#0C0E12] border border-[#252A35] flex items-center justify-center mb-5 transition-colors duration-200 group-hover:border-[#343B4A]"
                    >
                      <sys.icon className="w-5 h-5 text-[#4A5268] group-hover:text-[#E8ECF4] transition-colors duration-200" style={{ color: undefined }} />
                    </div>

                    <h3 className="text-base font-semibold text-[#E8ECF4] mb-2">{sys.title}</h3>
                    <p className="text-sm text-[#7A8499] leading-relaxed mb-5">{sys.description}</p>

                    <div className="space-y-2 mb-6">
                      {sys.highlights.map((h, j) => (
                        <div key={j} className="flex items-center gap-2 text-sm">
                          <CheckCircle2 className="w-3.5 h-3.5 text-[#3B7BF5]/60 flex-shrink-0" />
                          <span className="text-[#7A8499]">{h}</span>
                        </div>
                      ))}
                    </div>

                    <div className="flex items-center gap-1.5 text-sm font-medium text-[#3B7BF5] group-hover:gap-2.5 transition-all mt-auto">
                      View Demo <ArrowRight className="w-3.5 h-3.5" />
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 border-t border-[#252A35]">
        <div className="max-w-5xl mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex flex-col sm:flex-row items-center gap-3 text-center sm:text-left">
            <p className="text-xs text-[#7A8499]">
              Connected to SEAP e-licitatie.ro — Real tender data from Romanian public procurement
            </p>
            <span className="hidden sm:inline text-[#4A5268]">|</span>
            <p className="text-[11px] text-[#4A5268]">
              Powered by: OpenSSL | pdfminer | Tesseract OCR | Claude AI
            </p>
          </div>
          <p className="text-xs text-[#7A8499] flex-shrink-0">
            Built by <span className="text-[#3B7BF5] font-medium">NextAutomation</span>
          </p>
        </div>
      </footer>
    </div>
  )
}
