"use client"

import Link from "next/link"
import { motion } from "framer-motion"
import { FileSearch, Building2, Calculator, ArrowRight, CheckCircle2, Database, Clock, TrendingUp, Zap } from "lucide-react"

const systems = [
  {
    href: "/tenders",
    title: "SEAP Tender Monitor",
    icon: FileSearch,
    description: "Automated monitoring of e-licitatie.ro for construction tenders matching your criteria. AI extracts data from scanned PDFs and P7S files, generating project briefs instantly.",
    highlights: ["Real-time SEAP monitoring", "OCR for scanned PDFs & P7S", "AI-powered project briefs"],
  },
  {
    href: "/investments",
    title: "Investment Finder",
    icon: Building2,
    description: "Aggregates off-market opportunities from 6 sources — ANAF auctions, insolvency portals, listing platforms — scoring each deal's investment potential with AI analysis.",
    highlights: ["6 data sources connected", "AI investment scoring", "Below-market deal alerts"],
  },
  {
    href: "/roi",
    title: "ROI Calculator",
    icon: Calculator,
    description: "Interactive calculator showing the time and cost savings from automating your tender monitoring and investment search processes. Built to present to leadership.",
    highlights: ["Time savings projection", "Cost-benefit analysis", "Leadership-ready report"],
  },
]

const stats = [
  { label: "Tenders Monitored", value: "47", sub: "This month", icon: FileSearch, color: "text-[#D4A843]" },
  { label: "Opportunities Found", value: "12", sub: "Below market value", icon: TrendingUp, color: "text-emerald-500" },
  { label: "Hours Saved Weekly", value: "~18", sub: "Across both modules", icon: Clock, color: "text-blue-500" },
  { label: "Data Sources", value: "6", sub: "Connected & active", icon: Database, color: "text-purple-500" },
]

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero */}
      <section className="relative py-24 md:py-36 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-gray-50/80 via-white to-white" />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[800px] bg-[#D4A843]/[0.04] rounded-full blur-3xl" />

        <div className="max-w-4xl mx-auto px-6 relative">
          <div className="text-center">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="flex justify-center mb-10"
            >
              <div className="w-20 h-20 md:w-24 md:h-24 rounded-2xl bg-[#1B2A4A] flex items-center justify-center shadow-lg">
                <span className="text-[#D4A843] font-bold text-2xl md:text-3xl">SC</span>
              </div>
            </motion.div>

            <motion.p
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-xs md:text-sm uppercase tracking-[0.2em] text-gray-400 font-medium mb-6"
            >
              Synergy Construct
            </motion.p>

            <motion.h1
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15 }}
              className="text-3xl md:text-5xl lg:text-6xl font-semibold text-gray-900 mb-6 tracking-tight leading-[1.1]"
            >
              AI-Powered Construction<br />
              Intelligence
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.25 }}
              className="text-base md:text-lg text-gray-500 mb-10 max-w-xl mx-auto leading-relaxed"
            >
              Two AI systems working together — monitor SEAP tenders automatically and discover off-market investment opportunities before the competition.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.35 }}
              className="flex items-center justify-center gap-8 text-sm text-gray-400"
            >
              <span className="flex items-center gap-2">
                <Zap className="w-3.5 h-3.5 text-[#D4A843]" />
                Deterministic scraping
              </span>
              <span className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
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
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 + 0.05 * i }}
                className="bg-gray-50/80 border border-gray-100 rounded-xl p-4 text-center"
              >
                <s.icon className={`w-5 h-5 mx-auto mb-2 ${s.color}`} />
                <p className="text-2xl font-bold text-gray-900">{s.value}</p>
                <p className="text-xs text-gray-500 font-medium">{s.label}</p>
                <p className="text-[10px] text-gray-400 mt-0.5">{s.sub}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Divider */}
      <div className="max-w-24 mx-auto border-t border-gray-200 my-8" />

      {/* System Cards */}
      <section className="py-12 md:py-20">
        <div className="max-w-5xl mx-auto px-6">
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="text-center text-xs uppercase tracking-[0.2em] text-gray-400 font-medium mb-14"
          >
            Explore the live demos
          </motion.p>

          <div className="grid md:grid-cols-3 gap-5">
            {systems.map((sys, i) => (
              <motion.div
                key={sys.href}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.55 + 0.08 * i }}
              >
                <Link href={sys.href} className="block group h-full">
                  <div className="relative h-full bg-white border border-gray-200 rounded-2xl p-6 transition-all duration-300 hover:border-[#D4A843]/40 hover:shadow-lg hover:-translate-y-0.5">
                    <div className="w-10 h-10 rounded-xl bg-gray-50 border border-gray-100 flex items-center justify-center mb-5 group-hover:bg-[#D4A843]/5 group-hover:border-[#D4A843]/20 transition-colors">
                      <sys.icon className="w-5 h-5 text-gray-400 group-hover:text-[#D4A843] transition-colors" />
                    </div>

                    <h3 className="text-base font-semibold text-gray-900 mb-2">{sys.title}</h3>
                    <p className="text-sm text-gray-500 leading-relaxed mb-5">{sys.description}</p>

                    <div className="space-y-2 mb-6">
                      {sys.highlights.map((h, j) => (
                        <div key={j} className="flex items-center gap-2 text-sm">
                          <CheckCircle2 className="w-3.5 h-3.5 text-[#D4A843]/60 flex-shrink-0" />
                          <span className="text-gray-600">{h}</span>
                        </div>
                      ))}
                    </div>

                    <div className="flex items-center gap-1.5 text-sm font-medium text-[#D4A843] group-hover:gap-2.5 transition-all mt-auto">
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
      <footer className="py-8 border-t border-gray-100">
        <div className="max-w-5xl mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-xs text-gray-400">Interactive demo — data is simulated for demonstration purposes</p>
          <p className="text-xs text-gray-400">
            Built by <span className="text-[#D4A843] font-medium">NextAutomation</span>
          </p>
        </div>
      </footer>
    </div>
  )
}
