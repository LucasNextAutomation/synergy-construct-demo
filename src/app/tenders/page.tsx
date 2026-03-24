"use client"

import { useState, useCallback, useRef, useMemo } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
  FileSearch, AlertTriangle, TrendingUp, MapPin,
  ChevronRight, Clock, Activity,
  ArrowUpDown, SlidersHorizontal, Radar, BarChart3, FileText
} from "lucide-react"
import { mockTenders, tenderStats, type Tender } from "@/data/tenders"
import { realTenders } from "@/data/seap-real"
import Navbar from "@/components/Navbar"
import TenderSlideout from "@/components/TenderSlideout"
import Footer from "@/components/Footer"

function fmtRON(n: number) {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M RON`
  if (n >= 1_000) return `${(n / 1_000).toFixed(0)}K RON`
  return `${n} RON`
}

function ScoreBadge({ score }: { score: number }) {
  const cls = score >= 85
    ? "bg-[#22C55E]/10 text-[#22C55E] border-[#22C55E]/20"
    : score >= 70
    ? "bg-[#F59E0B]/10 text-[#F59E0B] border-[#F59E0B]/20"
    : "bg-[#4A5268]/20 text-[#7A8499] border-[#4A5268]/30"
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-bold border ${cls}`}>
      {score}%
    </span>
  )
}

function StatusBadge({ status }: { status: Tender["status"] }) {
  const styles: Record<string, string> = {
    new: "bg-[#3B7BF5]/10 text-[#60A5FA] border-[#3B7BF5]/20",
    analyzing: "bg-[#F59E0B]/10 text-[#F59E0B] border-[#F59E0B]/20",
    briefed: "bg-[#22C55E]/10 text-[#22C55E] border-[#22C55E]/20",
    passed: "bg-[#4A5268]/20 text-[#7A8499] border-[#4A5268]/30",
  }
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold uppercase tracking-wider border ${styles[status]}`}>
      {status}
    </span>
  )
}

function CategoryBadge({ category }: { category: Tender["category"] }) {
  const styles: Record<string, string> = {
    Infrastructure: "bg-[#3B7BF5]/10 text-[#60A5FA] border-[#3B7BF5]/20",
    Buildings: "bg-[#A855F7]/10 text-[#A855F7] border-[#A855F7]/20",
    Energy: "bg-[#F59E0B]/10 text-[#F59E0B] border-[#F59E0B]/20",
    Industrial: "bg-[#4A5268]/20 text-[#7A8499] border-[#4A5268]/30",
  }
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-medium border ${styles[category]}`}>
      {category}
    </span>
  )
}

type SortKey = "matchScore" | "estimatedValueRON" | "submissionDeadline"

const scanSteps = [
  { label: "Connecting to e-licitatie.ro...", duration: 1000 },
  { label: "Filtering construction tenders >20M RON...", duration: 1500 },
  { label: "Downloading tender documents...", duration: 1500 },
  { label: "OCR processing scanned PDFs & P7S files...", duration: 2000 },
  { label: "AI generating project briefs...", duration: 1500 },
]

const initialActivityFeed = [
  { time: "5 min ago", text: "New construction tender published — Sector 3 Bucuresti", type: "new" as const },
  { time: "22 min ago", text: "OCR completed for CN1087432 — 4 documents processed", type: "update" as const },
  { time: "45 min ago", text: "AI scored CN1087601 at 95% match — HIGH PRIORITY", type: "alert" as const },
  { time: "1 hr ago", text: "P7S signature verified — Certificat urbanism Iasi", type: "update" as const },
  { time: "2 hr ago", text: "SEAP data refreshed — 4 new tenders today", type: "new" as const },
  { time: "3 hr ago", text: "Brief generated for CN1087745 — road rehabilitation", type: "update" as const },
]

// Map realTenders to Tender interface for display
const seapLiveTenders: Tender[] = realTenders.map(rt => ({
  id: `seap-${rt.noticeNo}`,
  seapId: rt.noticeNo,
  title: rt.title,
  authority: rt.authority,
  cpvCode: rt.cpvCode,
  cpvDescription: rt.cpvDescription,
  category: "Infrastructure" as const,
  region: rt.region,
  city: rt.region,
  estimatedValueRON: rt.estimatedValueRon,
  estimatedValueEUR: rt.estimatedValueEur,
  submissionDeadline: rt.deadline.split('T')[0],
  publishDate: rt.publishDate.split('T')[0],
  estimatedDuration: "12 months",
  guaranteeRON: Math.round(rt.estimatedValueRon * 0.02),
  status: rt.status,
  matchScore: rt.matchScore,
  documents: [],
  aiBrief: {
    summary: "Real tender from SEAP e-licitatie.ro — AI brief pending document download.",
    keyRequirements: ["Document package available on SEAP", "Full analysis after document extraction"],
    certifications: ["ISO 9001", "ISO 14001"],
    estimatedTimeline: "12-18 months",
    riskFlags: ["Verify document package completeness before bidding"],
  },
  source: "seap-live" as const,
}))

export default function TendersPage() {
  const [selectedTender, setSelectedTender] = useState<Tender | null>(null)
  const [categoryFilter, setCategoryFilter] = useState("all")
  const [sortBy, setSortBy] = useState<SortKey>("matchScore")
  const [sortDir, setSortDir] = useState<"asc" | "desc">("desc")
  const [showFilters, setShowFilters] = useState(false)
  const [scanning, setScanning] = useState(false)
  const [scanStep, setScanStep] = useState(-1)
  const [scanProgress, setScanProgress] = useState(0)
  const [scanComplete, setScanComplete] = useState(false)
  const [revealedTenders, setRevealedTenders] = useState<string[]>([])
  const [activityFeed, setActivityFeed] = useState(initialActivityFeed)
  const scanningRef = useRef(false)

  // Merge: real SEAP tenders first, then mock tenders
  const allTenders = useMemo(() => [...seapLiveTenders, ...mockTenders], [])

  const hiddenTenders = mockTenders.filter(t => t.hidden)
  const visibleTenders = allTenders.filter(t => !t.hidden || revealedTenders.includes(t.id))

  const filteredTenders = visibleTenders
    .filter(t => categoryFilter === "all" || t.category === categoryFilter)
    .sort((a, b) => {
      const aNew = revealedTenders.includes(a.id) ? 1 : 0
      const bNew = revealedTenders.includes(b.id) ? 1 : 0
      if (aNew !== bNew) return bNew - aNew
      // Real SEAP tenders sort before mock
      const aLive = a.source === "seap-live" ? 1 : 0
      const bLive = b.source === "seap-live" ? 1 : 0
      if (aLive !== bLive) return bLive - aLive
      if (sortBy === "submissionDeadline") {
        const cmp = new Date(a.submissionDeadline).getTime() - new Date(b.submissionDeadline).getTime()
        return sortDir === "desc" ? -cmp : cmp
      }
      return sortDir === "desc" ? b[sortBy] - a[sortBy] : a[sortBy] - b[sortBy]
    })

  const categories = [...new Set(mockTenders.filter(t => !t.hidden).map(t => t.category))]

  const totalTenders = scanComplete ? tenderStats.totalTenders + hiddenTenders.length : tenderStats.totalTenders + seapLiveTenders.length
  const newToday = scanComplete ? tenderStats.newToday + hiddenTenders.length : tenderStats.newToday

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
        setActivityFeed(prev => [{ time: "Just now", text: "Filtering by CPV codes 45* (construction) and value >20M RON...", type: "update" as const }, ...prev.slice(0, 5)])
      }
      if (i === 3) {
        setActivityFeed(prev => [{ time: "Just now", text: "OCR processing 12 scanned PDFs — Tesseract engine active...", type: "update" as const }, ...prev.slice(0, 5)])
      }
      if (i === 4) {
        setActivityFeed(prev => [{ time: "Just now", text: "AI flagged CN1087956 — school campus, 90% match!", type: "alert" as const }, ...prev.slice(0, 5)])
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

    const newIds = hiddenTenders.map(t => t.id)
    setRevealedTenders(newIds)
    setScanComplete(true)
    setScanning(false)
    scanningRef.current = false

    setActivityFeed(prev => [
      { time: "Just now", text: `Scan complete — ${hiddenTenders.length} new tenders discovered!`, type: "alert" as const },
      ...prev.slice(0, 5)
    ])
  }, [hiddenTenders])

  return (
    <div className="min-h-screen bg-[#0C0E12]">
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        {/* Top Bar */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-semibold text-[#E8ECF4] tracking-tight">SEAP Tender Monitor</h1>
            <p className="text-sm text-[#7A8499] flex items-center gap-2 mt-1">
              <span className="w-2 h-2 rounded-full bg-[#22C55E] animate-pulse" />
              {tenderStats.sourcesActive} sources active — Last scan: {new Date(tenderStats.lastScanTime).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
              <span className="text-[#4A5268]">|</span>
              {tenderStats.regionsMonitored} regions
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
              {scanning ? "Scanning..." : scanComplete ? `${hiddenTenders.length} New Found` : "Run Scan"}
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
                    {scanStep < scanSteps.length ? scanSteps[scanStep].label : `Scan complete — ${hiddenTenders.length} new tenders found`}
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
                <div className="flex items-center gap-4 mt-2">
                  {scanSteps.map((s, i) => (
                    <div key={i} className="flex items-center gap-1.5">
                      <span className={`w-2 h-2 rounded-full ${i < scanStep ? "bg-[#22C55E]" : i === scanStep ? "bg-[#60A5FA] animate-pulse" : "bg-[#252A35]"}`} />
                      <span className={`text-[10px] hidden sm:inline ${i <= scanStep ? "text-[#7A8499]" : "text-[#4A5268]"}`}>
                        {i < 4 ? "Deterministic" : "AI"}
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
                  <label className="text-[10px] text-[#7A8499] uppercase tracking-wider block mb-1">Category</label>
                  <select
                    value={categoryFilter}
                    onChange={e => setCategoryFilter(e.target.value)}
                    className="text-sm border border-[#252A35] rounded-lg px-3 py-1.5 bg-[#0C0E12] text-[#E8ECF4] focus:outline-none focus:border-[#3B7BF5]"
                  >
                    <option value="all">All Categories</option>
                    {categories.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
                <div>
                  <label className="text-[10px] text-[#7A8499] uppercase tracking-wider block mb-1">Sort By</label>
                  <select
                    value={sortBy}
                    onChange={e => setSortBy(e.target.value as SortKey)}
                    className="text-sm border border-[#252A35] rounded-lg px-3 py-1.5 bg-[#0C0E12] text-[#E8ECF4] focus:outline-none focus:border-[#3B7BF5]"
                  >
                    <option value="matchScore">Match Score</option>
                    <option value="estimatedValueRON">Value (RON)</option>
                    <option value="submissionDeadline">Deadline</option>
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
            { label: "Total Tenders", value: totalTenders.toString(), sub: `${newToday} new today`, icon: FileSearch, color: "text-[#3B7BF5]", border: "border-l-[#3B7BF5]" },
            { label: "High Value (>50M)", value: tenderStats.highValue.toString(), sub: "Major opportunities", icon: TrendingUp, color: "text-[#22C55E]", border: "border-l-[#22C55E]" },
            { label: "New Today", value: newToday.toString(), sub: "Published on SEAP", icon: AlertTriangle, color: "text-[#60A5FA]", border: "border-l-[#60A5FA]" },
            { label: "Avg. Value", value: fmtRON(tenderStats.avgValueRON), sub: "All monitored tenders", icon: BarChart3, color: "text-[#F97316]", border: "border-l-[#F97316]" },
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
          {/* Main — Tender List */}
          <div className="lg:col-span-3 space-y-3">
            <div className="flex items-center justify-between mb-2">
              <h2 className="text-sm font-semibold text-[#7A8499] uppercase tracking-wider">
                {filteredTenders.length} {filteredTenders.length === 1 ? "Tender" : "Tenders"} found
                {categoryFilter !== "all" && <span className="text-[#4A5268] font-normal"> in {categoryFilter}</span>}
              </h2>
            </div>

            {filteredTenders.length === 0 && (
              <div className="bg-[#13161C] border border-dashed border-[#252A35] rounded-xl p-12 text-center">
                <FileSearch className="w-10 h-10 text-[#4A5268] mx-auto mb-3" />
                <h3 className="text-sm font-semibold text-[#7A8499] mb-1">No tenders match your filters</h3>
                <p className="text-xs text-[#4A5268]">Try adjusting your category filter or sort criteria.</p>
                <button onClick={() => setCategoryFilter("all")} className="mt-3 text-xs text-[#3B7BF5] font-medium hover:underline">Clear filters</button>
              </div>
            )}

            {filteredTenders.map((tender, index) => {
              const isNew = revealedTenders.includes(tender.id)
              const isLive = tender.source === "seap-live"
              return (
                <motion.div
                  key={tender.id}
                  initial={isNew ? { opacity: 0, y: -20, scale: 0.95 } : { opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  transition={
                    isNew
                      ? { delay: 0.2 * revealedTenders.indexOf(tender.id), ease: "easeOut" }
                      : { delay: 0.07 * index, ease: "easeOut" }
                  }
                  onClick={() => setSelectedTender(tender)}
                  className={`group bg-[#13161C] border rounded-xl p-4 cursor-pointer transition-colors duration-200 ${
                    isNew
                      ? "border-[#22C55E]/40 ring-1 ring-[#22C55E]/10"
                      : isLive
                      ? "border-[#3B7BF5]/30 hover:border-[#343B4A]"
                      : "border-[#252A35] hover:border-[#343B4A] hover:bg-[#1A1E27]"
                  }`}
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1 flex-wrap">
                        <span className="text-xs font-mono text-[#4A5268]">{tender.seapId}</span>
                        <StatusBadge status={tender.status} />
                        <CategoryBadge category={tender.category} />
                        <ScoreBadge score={tender.matchScore} />
                        {isLive && (
                          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-[#3B7BF5]/10 text-[#60A5FA] border border-[#3B7BF5]/20">
                            LIVE
                          </span>
                        )}
                        {isNew && (
                          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-[#22C55E]/10 text-[#22C55E] border border-[#22C55E]/20 animate-pulse">
                            NEW
                          </span>
                        )}
                      </div>
                      <h3 className="text-sm font-bold text-[#E8ECF4] group-hover:text-[#3B7BF5] transition-colors duration-200 leading-tight">{tender.title}</h3>
                      <p className="text-xs text-[#7A8499] mt-1">{tender.authority}</p>
                      <p className="text-[10px] text-[#4A5268] mt-0.5">{tender.cpvCode} — {tender.cpvDescription}</p>
                    </div>
                    <div className="flex-shrink-0 grid grid-cols-2 gap-3 text-right hidden sm:grid">
                      <div>
                        <p className="text-[10px] text-[#7A8499]">Value</p>
                        <p className="text-sm font-bold text-[#E8ECF4]">{fmtRON(tender.estimatedValueRON)}</p>
                      </div>
                      <div>
                        <p className="text-[10px] text-[#7A8499]">EUR</p>
                        <p className="text-sm font-bold text-[#7A8499]">{(tender.estimatedValueEUR / 1_000_000).toFixed(1)}M</p>
                      </div>
                      <div>
                        <p className="text-[10px] text-[#7A8499]">Deadline</p>
                        <p className="text-xs font-bold text-[#E8ECF4]">{tender.submissionDeadline}</p>
                      </div>
                      <div>
                        <p className="text-[10px] text-[#7A8499]">Duration</p>
                        <p className="text-xs font-bold text-[#E8ECF4]">{tender.estimatedDuration}</p>
                      </div>
                    </div>
                    <ChevronRight className="w-5 h-5 text-[#4A5268] group-hover:text-[#3B7BF5] transition-colors duration-200 mt-2 flex-shrink-0" />
                  </div>
                  <div className="flex items-center gap-4 mt-3 pt-3 border-t border-[#252A35]">
                    <span className="text-[10px] text-[#7A8499] flex items-center gap-1">
                      <MapPin className="w-3 h-3" /> {tender.city}, {tender.region}
                    </span>
                    <span className="text-[10px] text-[#7A8499] flex items-center gap-1">
                      <Clock className="w-3 h-3" /> {Math.max(0, Math.ceil((new Date(tender.submissionDeadline).getTime() - Date.now()) / 86400000))}d left
                    </span>
                    {tender.documents.length > 0 && (
                      <span className="text-[10px] text-[#7A8499] flex items-center gap-1">
                        <FileText className="w-3 h-3" /> {tender.documents.length} docs
                      </span>
                    )}
                  </div>
                </motion.div>
              )
            })}
          </div>

          {/* Sidebar */}
          <div className="space-y-4 lg:sticky lg:top-20 lg:self-start">
            {/* Category Breakdown */}
            <div className="bg-[#13161C] border border-[#252A35] rounded-xl p-4">
              <h3 className="text-xs font-bold text-[#7A8499] uppercase tracking-wider mb-3 flex items-center gap-2">
                <BarChart3 className="w-3.5 h-3.5" /> By Category
              </h3>
              <div className="space-y-2.5">
                {tenderStats.categoryBreakdown.map(c => (
                  <div key={c.category}>
                    <div className="flex items-center justify-between text-sm mb-1">
                      <span className="text-[#E8ECF4] text-xs">{c.category}</span>
                      <span className="text-xs text-[#7A8499]">{c.count}</span>
                    </div>
                    <div className="w-full h-1.5 rounded-full bg-[#1A1E27] overflow-hidden">
                      <div className="h-full rounded-full bg-[#3B7BF5]/50" style={{ width: `${(c.count / 10) * 100}%` }} />
                    </div>
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
                {tenderStats.regionBreakdown.map(r => (
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
        {selectedTender && (
          <TenderSlideout
            tender={selectedTender}
            onClose={() => setSelectedTender(null)}
            onPrev={filteredTenders.indexOf(selectedTender) > 0 ? () => setSelectedTender(filteredTenders[filteredTenders.indexOf(selectedTender) - 1]) : undefined}
            onNext={filteredTenders.indexOf(selectedTender) < filteredTenders.length - 1 ? () => setSelectedTender(filteredTenders[filteredTenders.indexOf(selectedTender) + 1]) : undefined}
          />
        )}
      </AnimatePresence>
    </div>
  )
}
