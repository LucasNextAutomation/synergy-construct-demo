"use client"

import { useState, useCallback, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
  Building2, TrendingUp, MapPin,
  ChevronRight, Activity,
  ArrowUpDown, SlidersHorizontal, Radar, BarChart3, LandPlot,
  Database, Tag
} from "lucide-react"
import { mockInvestments, investmentStats, type Investment } from "@/data/investments"
import Navbar from "@/components/Navbar"
import PropertySlideout from "@/components/PropertySlideout"
import Footer from "@/components/Footer"

function fmtEUR(n: number) {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(2)}M`
  if (n >= 1_000) return `${(n / 1_000).toFixed(0)}K`
  return `${n}`
}

function ScoreBadge({ score }: { score: number }) {
  const cls = score >= 85
    ? "bg-[#22C55E]/10 text-[#22C55E] border-[#22C55E]/20"
    : score >= 70
    ? "bg-[#F59E0B]/10 text-[#F59E0B] border-[#F59E0B]/20"
    : "bg-[#4A5268]/20 text-[#7A8499] border-[#4A5268]/30"
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-bold border ${cls}`}>
      {score}
    </span>
  )
}

function StatusBadge({ status }: { status: Investment["status"] }) {
  const styles: Record<string, string> = {
    new: "bg-[#3B7BF5]/10 text-[#60A5FA] border-[#3B7BF5]/20",
    analyzing: "bg-[#F59E0B]/10 text-[#F59E0B] border-[#F59E0B]/20",
    shortlisted: "bg-[#22C55E]/10 text-[#22C55E] border-[#22C55E]/20",
    passed: "bg-[#4A5268]/20 text-[#7A8499] border-[#4A5268]/30",
  }
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold uppercase tracking-wider border ${styles[status]}`}>
      {status}
    </span>
  )
}

function TypeIcon({ type }: { type: Investment["type"] }) {
  if (type === "Land") return <LandPlot className="w-4 h-4 text-[#22C55E]" />
  if (type === "Building") return <Building2 className="w-4 h-4 text-[#3B7BF5]" />
  return <Building2 className="w-4 h-4 text-[#A855F7]" />
}

function DiscountBadge({ percent }: { percent: number }) {
  const cls = percent >= 30
    ? "bg-[#22C55E]/20 text-[#22C55E] border border-[#22C55E]/30"
    : percent >= 20
    ? "bg-[#22C55E]/15 text-[#22C55E] border border-[#22C55E]/20"
    : "bg-[#22C55E]/10 text-[#22C55E] border border-[#22C55E]/15"
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold ${cls}`}>
      -{percent}%
    </span>
  )
}

const sourceColors: Record<string, string> = {
  "ANAF": "text-[#3B7BF5]",
  "UNPIR": "text-[#F59E0B]",
  "imobiliare.ro": "text-[#22C55E]",
  "storia.ro": "text-[#F97316]",
  "executari.com": "text-[#EF4444]",
  "ANABI": "text-[#A855F7]",
}

const sourceBarColors: Record<string, string> = {
  "ANAF": "bg-[#3B7BF5]/50",
  "UNPIR": "bg-[#F59E0B]/50",
  "imobiliare.ro": "bg-[#22C55E]/50",
  "storia.ro": "bg-[#F97316]/50",
  "executari.com": "bg-[#EF4444]/50",
  "ANABI": "bg-[#A855F7]/50",
}

type SortKey = "investmentScore" | "discountPercent" | "marketValueEUR"

const scanSteps = [
  { label: "Connecting to ANAF auction database...", duration: 1000 },
  { label: "Scanning insolvency portals (UNPIR)...", duration: 1500 },
  { label: "Checking imobiliare.ro & storia.ro...", duration: 1500 },
  { label: "Querying ANCPI cadastre records...", duration: 1000 },
  { label: "Cross-referencing ownership data...", duration: 1500 },
  { label: "AI scoring investment potential...", duration: 1500 },
]

const initialActivityFeed = [
  { time: "8 min ago", text: "New ANAF auction listing — industrial land Arad", type: "new" as const },
  { time: "25 min ago", text: "Price drop detected on storia.ro — Iasi residential lot", type: "alert" as const },
  { time: "1 hr ago", text: "UNPIR insolvency filing — commercial building Brasov", type: "new" as const },
  { time: "2 hr ago", text: "Cadastre data refreshed — 31 properties updated", type: "update" as const },
  { time: "3 hr ago", text: "AI scored INV-005 at 91 — Sibiu heritage building", type: "alert" as const },
  { time: "4 hr ago", text: "New executari.com listing — hotel Sinaia", type: "new" as const },
]

export default function InvestmentsPage() {
  const [selectedInvestment, setSelectedInvestment] = useState<Investment | null>(null)
  const [typeFilter, setTypeFilter] = useState("all")
  const [sourceFilter, setSourceFilter] = useState("all")
  const [sortBy, setSortBy] = useState<SortKey>("investmentScore")
  const [sortDir, setSortDir] = useState<"asc" | "desc">("desc")
  const [showFilters, setShowFilters] = useState(false)
  const [scanning, setScanning] = useState(false)
  const [scanStep, setScanStep] = useState(-1)
  const [scanProgress, setScanProgress] = useState(0)
  const [scanComplete, setScanComplete] = useState(false)
  const [revealedInvestments, setRevealedInvestments] = useState<string[]>([])
  const [activityFeed, setActivityFeed] = useState(initialActivityFeed)
  const scanningRef = useRef(false)

  const hiddenInvestments = mockInvestments.filter(inv => inv.hidden)
  const visibleInvestments = mockInvestments.filter(inv => !inv.hidden || revealedInvestments.includes(inv.id))

  const filteredInvestments = visibleInvestments
    .filter(inv => typeFilter === "all" || inv.type === typeFilter)
    .filter(inv => sourceFilter === "all" || inv.source === sourceFilter)
    .sort((a, b) => {
      const aNew = revealedInvestments.includes(a.id) ? 1 : 0
      const bNew = revealedInvestments.includes(b.id) ? 1 : 0
      if (aNew !== bNew) return bNew - aNew
      return sortDir === "desc" ? b[sortBy] - a[sortBy] : a[sortBy] - b[sortBy]
    })

  const types = [...new Set(mockInvestments.filter(inv => !inv.hidden).map(inv => inv.type))]
  const sources = [...new Set(mockInvestments.filter(inv => !inv.hidden).map(inv => inv.source))]

  const totalOpps = scanComplete ? investmentStats.totalOpportunities + hiddenInvestments.length : investmentStats.totalOpportunities
  const newThisWeek = scanComplete ? investmentStats.newThisWeek + hiddenInvestments.length : investmentStats.newThisWeek

  const runScan = useCallback(async () => {
    if (scanningRef.current) return
    scanningRef.current = true
    setScanning(true)
    setScanStep(0)
    setScanProgress(0)
    setScanComplete(false)

    const totalDuration = scanSteps.reduce((s, st) => s + st.duration, 0) + 500

    let elapsed = 0
    for (let i = 0; i < scanSteps.length; i++) {
      setScanStep(i)
      const step = scanSteps[i]

      if (i === 1) {
        setActivityFeed(prev => [{ time: "Just now", text: "Scanning UNPIR insolvency registry — 3 new filings...", type: "update" as const }, ...prev.slice(0, 5)])
      }
      if (i === 3) {
        setActivityFeed(prev => [{ time: "Just now", text: "ANCPI cadastre check — verifying ownership records...", type: "update" as const }, ...prev.slice(0, 5)])
      }
      if (i === 5) {
        setActivityFeed(prev => [{ time: "Just now", text: "AI flagged INV-009 — industrial land Arad, 40% discount!", type: "alert" as const }, ...prev.slice(0, 5)])
      }

      const startProgress = elapsed / totalDuration * 100
      elapsed += step.duration
      const endProgress = elapsed / totalDuration * 100

      await new Promise<void>(resolve => {
        const startTime = Date.now()
        const animate = () => {
          const fraction = Math.min((Date.now() - startTime) / step.duration, 1)
          setScanProgress(startProgress + (endProgress - startProgress) * fraction)
          if (fraction < 1) requestAnimationFrame(animate)
          else resolve()
        }
        requestAnimationFrame(animate)
      })
    }

    setScanStep(scanSteps.length)
    setScanProgress(100)

    await new Promise(r => setTimeout(r, 500))

    const newIds = hiddenInvestments.map(inv => inv.id)
    setRevealedInvestments(newIds)
    setScanComplete(true)
    setScanning(false)
    scanningRef.current = false

    setActivityFeed(prev => [
      { time: "Just now", text: `Scan complete — ${hiddenInvestments.length} new opportunities discovered!`, type: "alert" as const },
      ...prev.slice(0, 5)
    ])
  }, [hiddenInvestments])

  return (
    <div className="min-h-screen bg-[#0C0E12]">
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        {/* Top Bar */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-semibold text-[#E8ECF4] tracking-tight">Investment Finder</h1>
            <p className="text-sm text-[#7A8499] flex items-center gap-2 mt-1">
              <span className="w-2 h-2 rounded-full bg-[#22C55E] animate-pulse" />
              {investmentStats.sourcesActive} sources active — Last scan: {new Date(investmentStats.lastScanTime).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={runScan}
              disabled={scanning || scanComplete}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200 ${
                scanning ? "bg-[#3B7BF5] text-white animate-pulse cursor-wait"
                : scanComplete ? "bg-[#22C55E]/20 text-[#22C55E] border border-[#22C55E]/30 cursor-default"
                : "bg-[#3B7BF5] text-white hover:bg-[#2E6AE0] shadow-lg shadow-[#3B7BF5]/20"
              }`}
            >
              <Radar className={`w-4 h-4 ${scanning ? "animate-spin" : ""}`} />
              {scanning ? "Scanning..." : scanComplete ? `${hiddenInvestments.length} New Found` : "Run Scan"}
            </button>
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200 ${
                showFilters
                  ? "bg-[#3B7BF5]/10 text-[#3B7BF5] border border-[#3B7BF5]/20"
                  : "border border-[#252A35] text-[#7A8499] hover:bg-[#1A1E27] hover:text-[#E8ECF4]"
              }`}
            >
              <SlidersHorizontal className="w-4 h-4" /> Filters
            </button>
          </div>
        </div>

        {/* Scan Progress */}
        <AnimatePresence>
          {scanning && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ ease: "easeOut" }}
              className="overflow-hidden mb-6"
            >
              <div className="bg-[#60A5FA]/5 border border-[#60A5FA]/20 rounded-xl p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-[#60A5FA]">
                    {scanStep < scanSteps.length ? scanSteps[scanStep].label : `Scan complete — ${hiddenInvestments.length} new opportunities found`}
                  </span>
                  <span className="text-xs text-[#7A8499] font-mono">{Math.round(scanProgress)}%</span>
                </div>
                <div className="w-full h-2 bg-[#1A1E27] rounded-full overflow-hidden">
                  <motion.div
                    className="h-full bg-[#60A5FA] rounded-full"
                    style={{ width: `${scanProgress}%` }}
                    transition={{ duration: 0.1 }}
                  />
                </div>
                <div className="flex items-center gap-3 mt-2">
                  {scanSteps.map((s, i) => (
                    <div key={i} className="flex items-center gap-1">
                      <span className={`w-2 h-2 rounded-full ${i < scanStep ? "bg-[#22C55E]" : i === scanStep ? "bg-[#60A5FA] animate-pulse" : "bg-[#252A35]"}`} />
                      <span className={`text-[10px] hidden sm:inline ${i <= scanStep ? "text-[#7A8499]" : "text-[#4A5268]"}`}>
                        {i < 5 ? "Deterministic" : "AI"}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Filters */}
        <AnimatePresence>
          {showFilters && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ ease: "easeOut" }}
              className="overflow-hidden mb-4"
            >
              <div className="bg-[#13161C] border border-[#252A35] rounded-xl p-4 flex flex-wrap items-center gap-4">
                <div>
                  <label className="text-[10px] text-[#7A8499] uppercase tracking-wider block mb-1">Type</label>
                  <select
                    value={typeFilter}
                    onChange={e => setTypeFilter(e.target.value)}
                    className="text-sm border border-[#252A35] rounded-lg px-3 py-1.5 bg-[#0C0E12] text-[#E8ECF4] focus:outline-none focus:border-[#3B7BF5]"
                  >
                    <option value="all">All Types</option>
                    {types.map(t => <option key={t} value={t}>{t}</option>)}
                  </select>
                </div>
                <div>
                  <label className="text-[10px] text-[#7A8499] uppercase tracking-wider block mb-1">Source</label>
                  <select
                    value={sourceFilter}
                    onChange={e => setSourceFilter(e.target.value)}
                    className="text-sm border border-[#252A35] rounded-lg px-3 py-1.5 bg-[#0C0E12] text-[#E8ECF4] focus:outline-none focus:border-[#3B7BF5]"
                  >
                    <option value="all">All Sources</option>
                    {sources.map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                </div>
                <div>
                  <label className="text-[10px] text-[#7A8499] uppercase tracking-wider block mb-1">Sort By</label>
                  <select
                    value={sortBy}
                    onChange={e => setSortBy(e.target.value as SortKey)}
                    className="text-sm border border-[#252A35] rounded-lg px-3 py-1.5 bg-[#0C0E12] text-[#E8ECF4] focus:outline-none focus:border-[#3B7BF5]"
                  >
                    <option value="investmentScore">Investment Score</option>
                    <option value="discountPercent">Discount %</option>
                    <option value="marketValueEUR">Market Value</option>
                  </select>
                </div>
                <button
                  onClick={() => setSortDir(d => d === "desc" ? "asc" : "desc")}
                  className="flex items-center gap-1 px-3 py-1.5 mt-4 rounded-lg border border-[#252A35] text-sm text-[#7A8499] hover:bg-[#1A1E27] hover:text-[#E8ECF4] transition-colors duration-200"
                >
                  <ArrowUpDown className="w-3.5 h-3.5" />
                  {sortDir === "desc" ? "High \u2192 Low" : "Low \u2192 High"}
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Stats Row */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
          {[
            { label: "Total Opportunities", value: totalOpps.toString(), sub: `${newThisWeek} new this week`, icon: Building2, color: "text-[#3B7BF5]", border: "border-l-[#3B7BF5]" },
            { label: "High Score (>80)", value: investmentStats.highScore.toString(), sub: "Priority targets", icon: TrendingUp, color: "text-[#22C55E]", border: "border-l-[#22C55E]" },
            { label: "Below Market", value: investmentStats.belowMarket.toString(), sub: "Discounted properties", icon: Tag, color: "text-[#60A5FA]", border: "border-l-[#60A5FA]" },
            { label: "Sources Active", value: investmentStats.sourcesActive.toString(), sub: "Monitored platforms", icon: Database, color: "text-[#F97316]", border: "border-l-[#F97316]" },
          ].map(s => (
            <div key={s.label} className={`bg-[#13161C] border border-[#252A35] border-l-2 ${s.border} rounded-xl p-4`}>
              <div className="flex items-center gap-2 mb-2">
                <s.icon className={`w-4 h-4 ${s.color}`} />
                <span className="text-[10px] text-[#7A8499] uppercase tracking-wider">{s.label}</span>
              </div>
              <p className="text-2xl font-bold text-[#E8ECF4]">{s.value}</p>
              <p className="text-[10px] text-[#7A8499] mt-0.5">{s.sub}</p>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Main — Investment List */}
          <div className="lg:col-span-3 space-y-3">
            <div className="flex items-center justify-between mb-2">
              <h2 className="text-sm font-semibold text-[#7A8499] uppercase tracking-wider">
                {filteredInvestments.length} {filteredInvestments.length === 1 ? "Opportunity" : "Opportunities"} found
              </h2>
            </div>

            {filteredInvestments.length === 0 && (
              <div className="bg-[#13161C] border border-dashed border-[#252A35] rounded-xl p-12 text-center">
                <Building2 className="w-10 h-10 text-[#4A5268] mx-auto mb-3" />
                <h3 className="text-sm font-semibold text-[#7A8499] mb-1">No properties match your filters</h3>
                <button
                  onClick={() => { setTypeFilter("all"); setSourceFilter("all") }}
                  className="mt-3 text-xs text-[#3B7BF5] font-medium hover:underline"
                >
                  Clear filters
                </button>
              </div>
            )}

            {filteredInvestments.map((inv, index) => {
              const isNew = revealedInvestments.includes(inv.id)
              const srcColor = sourceColors[inv.source] || "text-[#7A8499]"
              return (
                <motion.div
                  key={inv.id}
                  initial={isNew ? { opacity: 0, y: -20, scale: 0.95 } : { opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  transition={isNew ? { delay: 0.2 * revealedInvestments.indexOf(inv.id), ease: "easeOut" } : { delay: 0.07 * index, ease: "easeOut" }}
                  onClick={() => setSelectedInvestment(inv)}
                  className={`group bg-[#13161C] border rounded-xl p-4 cursor-pointer transition-colors duration-200 ${
                    isNew ? "border-[#22C55E]/40 ring-1 ring-[#22C55E]/10" : "border-[#252A35] hover:border-[#343B4A] hover:bg-[#1A1E27]"
                  }`}
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1 flex-wrap">
                        <span className="text-xs font-mono text-[#4A5268]">{inv.id}</span>
                        <StatusBadge status={inv.status} />
                        <ScoreBadge score={inv.investmentScore} />
                        <DiscountBadge percent={inv.discountPercent} />
                        {isNew && (
                          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-[#22C55E]/10 text-[#22C55E] border border-[#22C55E]/20 animate-pulse">
                            NEW
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-2 mb-1">
                        <TypeIcon type={inv.type} />
                        <h3 className="text-sm font-bold text-[#E8ECF4] group-hover:text-[#3B7BF5] transition-colors duration-200 leading-tight">{inv.title}</h3>
                      </div>
                      <p className="text-xs text-[#7A8499] flex items-center gap-1">
                        <MapPin className="w-3 h-3" /> {inv.city}, {inv.county}
                      </p>
                    </div>
                    <div className="flex-shrink-0 grid grid-cols-2 gap-3 text-right hidden sm:grid">
                      <div>
                        <p className="text-[10px] text-[#7A8499]">Market</p>
                        <p className="text-sm font-bold text-[#E8ECF4]">{fmtEUR(inv.marketValueEUR)} EUR</p>
                      </div>
                      <div>
                        <p className="text-[10px] text-[#7A8499]">Price</p>
                        <p className="text-sm font-bold text-[#22C55E]">{fmtEUR(inv.listedPriceEUR)} EUR</p>
                      </div>
                      <div>
                        <p className="text-[10px] text-[#7A8499]">Size</p>
                        <p className="text-xs font-bold text-[#E8ECF4]">{inv.sizeSqm.toLocaleString()} sqm</p>
                      </div>
                      <div>
                        <p className="text-[10px] text-[#7A8499]">Source</p>
                        <p className={`text-xs font-bold ${srcColor}`}>{inv.source}</p>
                      </div>
                    </div>
                    <ChevronRight className="w-5 h-5 text-[#4A5268] group-hover:text-[#3B7BF5] transition-colors duration-200 mt-2 flex-shrink-0" />
                  </div>
                  <div className="flex items-center gap-4 mt-3 pt-3 border-t border-[#252A35] sm:hidden">
                    <span className="text-[10px] text-[#7A8499]">{fmtEUR(inv.listedPriceEUR)} EUR</span>
                    <span className="text-[10px] text-[#22C55E] font-bold">-{inv.discountPercent}%</span>
                    <span className={`text-[10px] font-medium ${srcColor}`}>{inv.source}</span>
                  </div>
                </motion.div>
              )
            })}
          </div>

          {/* Sidebar */}
          <div className="space-y-4 lg:sticky lg:top-20 lg:self-start">
            {/* Source Breakdown */}
            <div className="bg-[#13161C] border border-[#252A35] rounded-xl p-4">
              <h3 className="text-xs font-bold text-[#7A8499] uppercase tracking-wider mb-3 flex items-center gap-2">
                <Database className="w-3.5 h-3.5" /> By Source
              </h3>
              <div className="space-y-2.5">
                {investmentStats.sourceBreakdown.map(s => (
                  <div key={s.source}>
                    <div className="flex items-center justify-between text-sm mb-1">
                      <span className={`text-xs font-medium ${sourceColors[s.source] || "text-[#7A8499]"}`}>{s.source}</span>
                      <span className="text-xs text-[#7A8499]">{s.count}</span>
                    </div>
                    <div className="w-full h-1.5 rounded-full bg-[#1A1E27] overflow-hidden">
                      <div className={`h-full rounded-full ${sourceBarColors[s.source] || "bg-[#4A5268]/50"}`} style={{ width: `${(s.count / 10) * 100}%` }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Type Breakdown */}
            <div className="bg-[#13161C] border border-[#252A35] rounded-xl p-4">
              <h3 className="text-xs font-bold text-[#7A8499] uppercase tracking-wider mb-3 flex items-center gap-2">
                <BarChart3 className="w-3.5 h-3.5" /> By Type
              </h3>
              <div className="space-y-2">
                {investmentStats.typeBreakdown.map(t => (
                  <div key={t.type} className="flex items-center justify-between">
                    <span className="text-xs text-[#7A8499] flex items-center gap-1.5">
                      <TypeIcon type={t.type as Investment["type"]} />
                      {t.type}
                    </span>
                    <span className="text-xs font-medium text-[#E8ECF4]">{t.count}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Region Breakdown */}
            <div className="bg-[#13161C] border border-[#252A35] rounded-xl p-4">
              <h3 className="text-xs font-bold text-[#7A8499] uppercase tracking-wider mb-3 flex items-center gap-2">
                <MapPin className="w-3.5 h-3.5" /> By Region
              </h3>
              <div className="space-y-2">
                {investmentStats.regionBreakdown.map(r => (
                  <div key={r.region} className="flex items-center justify-between">
                    <span className="text-xs text-[#7A8499]">{r.region}</span>
                    <span className="text-xs font-medium text-[#E8ECF4]">{r.count}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Activity Feed */}
            <div className="bg-[#13161C] border border-[#252A35] rounded-xl p-4">
              <h3 className="text-xs font-bold text-[#7A8499] uppercase tracking-wider mb-3 flex items-center gap-2">
                <Activity className="w-3.5 h-3.5" /> Source Activity
              </h3>
              <div className="space-y-3">
                {activityFeed.map((a, i) => (
                  <motion.div
                    key={`${a.text}-${i}`}
                    initial={a.time === "Just now" ? { opacity: 0, x: -10 } : false}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ ease: "easeOut" }}
                    className="flex items-start gap-2"
                  >
                    <div className={`w-1.5 h-1.5 rounded-full mt-1.5 flex-shrink-0 ${
                      a.type === "alert" ? "bg-[#EF4444]" : a.type === "new" ? "bg-[#3B7BF5]" : "bg-[#4A5268]"
                    }`} />
                    <div>
                      <p className="text-xs text-[#E8ECF4]">{a.text}</p>
                      <p className="text-[10px] text-[#7A8499]">{a.time}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />

      <AnimatePresence>
        {selectedInvestment && (
          <PropertySlideout
            investment={selectedInvestment}
            onClose={() => setSelectedInvestment(null)}
            onPrev={filteredInvestments.indexOf(selectedInvestment) > 0 ? () => setSelectedInvestment(filteredInvestments[filteredInvestments.indexOf(selectedInvestment) - 1]) : undefined}
            onNext={filteredInvestments.indexOf(selectedInvestment) < filteredInvestments.length - 1 ? () => setSelectedInvestment(filteredInvestments[filteredInvestments.indexOf(selectedInvestment) + 1]) : undefined}
          />
        )}
      </AnimatePresence>
    </div>
  )
}
