"use client"

import { motion } from "framer-motion"
import {
  X, ChevronLeft, ChevronRight, Calendar, MapPin,
  Download, Star, AlertTriangle, TrendingUp,
  Brain, Building2, LandPlot, Ruler, CalendarDays
} from "lucide-react"
import type { Investment } from "@/data/investments"

function fmtEUR(n: number) {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(2)}M EUR`
  if (n >= 1_000) return `${(n / 1_000).toFixed(0)}K EUR`
  return `${n} EUR`
}

function ScoreBadge({ score }: { score: number }) {
  const cls = score >= 85
    ? "bg-[#22C55E]/10 text-[#22C55E] border-[#22C55E]/20"
    : score >= 70
    ? "bg-[#F59E0B]/10 text-[#F59E0B] border-[#F59E0B]/20"
    : "bg-[#4A5268]/20 text-[#7A8499] border-[#4A5268]/30"
  return (
    <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-sm font-bold border ${cls}`}>
      {score}
    </span>
  )
}

function DiscountBadge({ percent }: { percent: number }) {
  const cls = percent >= 30
    ? "bg-[#22C55E]/20 text-[#22C55E] border border-[#22C55E]/30"
    : percent >= 20
    ? "bg-[#22C55E]/15 text-[#22C55E] border border-[#22C55E]/20"
    : "bg-[#22C55E]/10 text-[#22C55E] border border-[#22C55E]/15"
  return (
    <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-sm font-bold ${cls}`}>
      -{percent}%
    </span>
  )
}

const typeIcons: Record<string, typeof Building2> = {
  Land: LandPlot,
  Building: Building2,
  "Mixed-use": Building2,
}

export default function PropertySlideout({
  investment,
  onClose,
  onPrev,
  onNext,
}: {
  investment: Investment
  onClose: () => void
  onPrev?: () => void
  onNext?: () => void
}) {
  const TypeIcon = typeIcons[investment.type] || Building2

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ ease: "easeOut" }}
      className="fixed inset-0 z-50 flex justify-end"
    >
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />

      <motion.div
        initial={{ x: "100%" }}
        animate={{ x: 0 }}
        exit={{ x: "100%" }}
        transition={{ ease: "easeOut", duration: 0.3 }}
        className="relative w-full md:max-w-xl bg-[#13161C] border-l border-[#252A35] shadow-2xl overflow-y-auto"
      >
        {/* Sticky Header */}
        <div className="sticky top-0 z-10 bg-[#0C0E12] border-b border-[#252A35] px-6 py-4">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono text-[#4A5268]">{investment.id}</span>
              <ScoreBadge score={investment.investmentScore} />
              <DiscountBadge percent={investment.discountPercent} />
            </div>
            <div className="flex items-center gap-1">
              {onPrev && (
                <button onClick={onPrev} className="p-1.5 rounded-lg hover:bg-[#1A1E27] text-[#7A8499] hover:text-[#E8ECF4] transition-colors duration-200">
                  <ChevronLeft className="w-4 h-4" />
                </button>
              )}
              {onNext && (
                <button onClick={onNext} className="p-1.5 rounded-lg hover:bg-[#1A1E27] text-[#7A8499] hover:text-[#E8ECF4] transition-colors duration-200">
                  <ChevronRight className="w-4 h-4" />
                </button>
              )}
              <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-[#1A1E27] text-[#7A8499] hover:text-[#E8ECF4] transition-colors duration-200 ml-2">
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>
          <div className="flex items-center gap-2 mb-1">
            <TypeIcon className="w-4 h-4 text-[#3B7BF5]" />
            <span className="text-xs font-medium text-[#3B7BF5] uppercase">{investment.type}</span>
          </div>
          <h2 className="text-lg font-bold text-[#E8ECF4] leading-tight">{investment.title}</h2>
          <p className="text-sm text-[#7A8499] mt-1 flex items-center gap-1">
            <MapPin className="w-3.5 h-3.5" /> {investment.location}
          </p>
        </div>

        <div className="px-6 py-6 space-y-6">
          {/* Key Metrics */}
          <div className="grid grid-cols-2 gap-3">
            {[
              { label: "Market Value", value: fmtEUR(investment.marketValueEUR), sub: "Estimated", icon: TrendingUp },
              { label: "Listed Price", value: fmtEUR(investment.listedPriceEUR), sub: `${investment.discountPercent}% below market`, icon: TrendingUp },
              { label: "Size", value: `${investment.sizeSqm.toLocaleString()} sqm`, sub: investment.lotSizeSqm ? `Lot: ${investment.lotSizeSqm.toLocaleString()} sqm` : "Built area", icon: Ruler },
              ...(investment.yearBuilt ? [{ label: "Year Built", value: investment.yearBuilt.toString(), sub: `${new Date().getFullYear() - investment.yearBuilt} years old`, icon: CalendarDays }] : []),
              ...(investment.auctionDate ? [{ label: "Auction Date", value: investment.auctionDate, sub: `${Math.max(0, Math.ceil((new Date(investment.auctionDate).getTime() - Date.now()) / 86400000))} days left`, icon: Calendar }] : []),
            ].map(m => (
              <div key={m.label} className="bg-[#0C0E12] border border-[#252A35] rounded-xl p-3">
                <div className="flex items-center gap-1.5 mb-1">
                  <m.icon className="w-3.5 h-3.5 text-[#4A5268]" />
                  <span className="text-[10px] text-[#7A8499] uppercase tracking-wider">{m.label}</span>
                </div>
                <p className="text-sm font-bold text-[#E8ECF4]">{m.value}</p>
                <p className="text-[10px] text-[#7A8499]">{m.sub}</p>
              </div>
            ))}
          </div>

          {/* Savings Highlight */}
          <div className="bg-[#22C55E]/10 border border-[#22C55E]/20 rounded-xl p-4 text-center">
            <p className="text-xs text-[#22C55E] font-medium uppercase tracking-wider mb-1">Potential Savings</p>
            <p className="text-3xl font-bold text-[#22C55E]">{fmtEUR(investment.marketValueEUR - investment.listedPriceEUR)}</p>
            <p className="text-xs text-[#22C55E]/60 mt-1">below estimated market value</p>
          </div>

          {/* AI Analysis */}
          <div className="bg-[#3B7BF5]/5 border-l-2 border-[#3B7BF5] rounded-r-xl p-5">
            <h3 className="flex items-center gap-2 text-sm font-bold text-[#E8ECF4] mb-3">
              <Brain className="w-4 h-4 text-[#3B7BF5]" />
              AI Investment Analysis
            </h3>

            <p className="text-sm text-[#7A8499] leading-relaxed mb-4">{investment.analysis.thesis}</p>

            <div className="space-y-4">
              <div>
                <h4 className="text-xs font-semibold text-[#7A8499] uppercase tracking-wider mb-2">Comparable Sales</h4>
                <div className="space-y-1.5">
                  {investment.analysis.comparables.map((comp, i) => (
                    <p key={i} className="text-xs text-[#7A8499] pl-3 border-l-2 border-[#3B7BF5]/30">{comp}</p>
                  ))}
                </div>
              </div>

              <div>
                <h4 className="text-xs font-semibold text-[#7A8499] uppercase tracking-wider mb-2">Risk Assessment</h4>
                <div className="space-y-1.5">
                  {investment.analysis.risks.map((risk, i) => (
                    <div key={i} className="flex items-start gap-2 text-xs text-[#EF4444]/80">
                      <AlertTriangle className="w-3.5 h-3.5 text-[#EF4444] flex-shrink-0 mt-0.5" />
                      <span>{risk}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h4 className="text-xs font-semibold text-[#7A8499] uppercase tracking-wider mb-2">ROI Scenarios</h4>
                <div className="space-y-2">
                  {investment.analysis.roiScenarios.map((scenario, i) => (
                    <div key={i} className={`flex items-center justify-between rounded-lg px-3 py-2 border border-[#252A35] ${i % 2 === 1 ? "bg-[#1A1E27]" : "bg-[#0C0E12]"}`}>
                      <span className="text-xs text-[#7A8499]">{scenario.label}</span>
                      <div className="flex items-center gap-4">
                        <span className="text-xs font-bold text-[#22C55E]">{scenario.annualReturn}%/yr</span>
                        <span className="text-[10px] text-[#4A5268]">{scenario.totalReturn5yr}% in 5yr</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Cadastre / Source Info */}
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-[#0C0E12] border border-[#252A35] rounded-xl p-3">
              <p className="text-[10px] text-[#7A8499] uppercase tracking-wider mb-1">Cadastre Ref</p>
              <p className="text-xs font-mono text-[#E8ECF4]">{investment.cadastreRef}</p>
            </div>
            <div className="bg-[#0C0E12] border border-[#252A35] rounded-xl p-3">
              <p className="text-[10px] text-[#7A8499] uppercase tracking-wider mb-1">Source</p>
              <p className="text-xs font-medium text-[#E8ECF4]">{investment.source}</p>
            </div>
            {investment.contactInfo && (
              <div className="col-span-2 bg-[#0C0E12] border border-[#252A35] rounded-xl p-3">
                <p className="text-[10px] text-[#7A8499] uppercase tracking-wider mb-1">Contact</p>
                <p className="text-xs text-[#E8ECF4]">{investment.contactInfo}</p>
              </div>
            )}
          </div>

          {/* Actions */}
          <div className="flex gap-2 pt-2">
            <button className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-[#3B7BF5] text-white rounded-lg text-sm font-medium hover:bg-[#2E6AE0] transition-colors duration-200">
              <Download className="w-4 h-4" /> Export Report
            </button>
            <button className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-[#1A1E27] border border-[#343B4A] text-[#E8ECF4] rounded-lg text-sm font-medium hover:bg-[#252A35] transition-colors duration-200">
              <Star className="w-4 h-4" /> Shortlist
            </button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  )
}
