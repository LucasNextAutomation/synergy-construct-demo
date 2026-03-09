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
  const color = score >= 85 ? "bg-emerald-500/10 text-emerald-600 border-emerald-200"
    : score >= 70 ? "bg-amber-500/10 text-amber-600 border-amber-200"
    : "bg-gray-500/10 text-gray-500 border-gray-200"
  return <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-sm font-bold border ${color}`}>{score}</span>
}

function DiscountBadge({ percent }: { percent: number }) {
  const color = percent >= 30 ? "bg-emerald-500 text-white"
    : percent >= 20 ? "bg-emerald-500/80 text-white"
    : "bg-emerald-500/60 text-white"
  return <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-sm font-bold ${color}`}>-{percent}%</span>
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
      className="fixed inset-0 z-50 flex justify-end"
    >
      <div className="absolute inset-0 bg-black/20 backdrop-blur-sm" onClick={onClose} />

      <motion.div
        initial={{ x: "100%" }}
        animate={{ x: 0 }}
        exit={{ x: "100%" }}
        transition={{ type: "spring", damping: 30, stiffness: 300 }}
        className="relative w-full md:max-w-xl bg-white shadow-2xl overflow-y-auto"
      >
        {/* Header */}
        <div className="sticky top-0 z-10 bg-white border-b border-gray-100 px-6 py-4">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono text-gray-400">{investment.id}</span>
              <ScoreBadge score={investment.investmentScore} />
              <DiscountBadge percent={investment.discountPercent} />
            </div>
            <div className="flex items-center gap-1">
              {onPrev && (
                <button onClick={onPrev} className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-400">
                  <ChevronLeft className="w-4 h-4" />
                </button>
              )}
              {onNext && (
                <button onClick={onNext} className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-400">
                  <ChevronRight className="w-4 h-4" />
                </button>
              )}
              <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-400 ml-2">
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>
          <div className="flex items-center gap-2 mb-1">
            <TypeIcon className="w-4 h-4 text-[#D4A843]" />
            <span className="text-xs font-medium text-[#D4A843] uppercase">{investment.type}</span>
          </div>
          <h2 className="text-lg font-bold text-gray-900 leading-tight">{investment.title}</h2>
          <p className="text-sm text-gray-500 mt-1 flex items-center gap-1">
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
              ...(investment.auctionDate ? [{ label: "Auction Date", value: investment.auctionDate, sub: `${Math.ceil((new Date(investment.auctionDate).getTime() - Date.now()) / 86400000)} days left`, icon: Calendar }] : []),
            ].map(m => (
              <div key={m.label} className="bg-gray-50 border border-gray-100 rounded-xl p-3">
                <div className="flex items-center gap-1.5 mb-1">
                  <m.icon className="w-3.5 h-3.5 text-gray-400" />
                  <span className="text-[10px] text-gray-400 uppercase tracking-wider">{m.label}</span>
                </div>
                <p className="text-sm font-bold text-gray-900">{m.value}</p>
                <p className="text-[10px] text-gray-500">{m.sub}</p>
              </div>
            ))}
          </div>

          {/* Savings Highlight */}
          <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4 text-center">
            <p className="text-xs text-emerald-600 font-medium uppercase tracking-wider mb-1">Potential Savings</p>
            <p className="text-3xl font-bold text-emerald-700">{fmtEUR(investment.marketValueEUR - investment.listedPriceEUR)}</p>
            <p className="text-xs text-emerald-500 mt-1">below estimated market value</p>
          </div>

          {/* AI Analysis */}
          <div className="bg-[#D4A843]/5 border border-[#D4A843]/20 rounded-xl p-5">
            <h3 className="flex items-center gap-2 text-sm font-bold text-[#1B2A4A] mb-3">
              <Brain className="w-4 h-4 text-[#D4A843]" />
              AI Investment Analysis
            </h3>

            <p className="text-sm text-gray-700 leading-relaxed mb-4">{investment.analysis.thesis}</p>

            <div className="space-y-4">
              <div>
                <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Comparable Sales</h4>
                <div className="space-y-1.5">
                  {investment.analysis.comparables.map((comp, i) => (
                    <p key={i} className="text-xs text-gray-600 pl-3 border-l-2 border-[#D4A843]/30">{comp}</p>
                  ))}
                </div>
              </div>

              <div>
                <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Risk Assessment</h4>
                <div className="space-y-1.5">
                  {investment.analysis.risks.map((risk, i) => (
                    <div key={i} className="flex items-start gap-2 text-xs text-red-600">
                      <AlertTriangle className="w-3.5 h-3.5 flex-shrink-0 mt-0.5" />
                      <span>{risk}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">ROI Scenarios</h4>
                <div className="space-y-2">
                  {investment.analysis.roiScenarios.map((scenario, i) => (
                    <div key={i} className="flex items-center justify-between bg-white rounded-lg px-3 py-2 border border-gray-100">
                      <span className="text-xs text-gray-600">{scenario.label}</span>
                      <div className="flex items-center gap-4">
                        <span className="text-xs font-bold text-emerald-600">{scenario.annualReturn}%/yr</span>
                        <span className="text-[10px] text-gray-400">{scenario.totalReturn5yr}% in 5yr</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Cadastre / Source Info */}
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-gray-50 border border-gray-100 rounded-xl p-3">
              <p className="text-[10px] text-gray-400 uppercase tracking-wider mb-1">Cadastre Ref</p>
              <p className="text-xs font-mono text-gray-700">{investment.cadastreRef}</p>
            </div>
            <div className="bg-gray-50 border border-gray-100 rounded-xl p-3">
              <p className="text-[10px] text-gray-400 uppercase tracking-wider mb-1">Source</p>
              <p className="text-xs font-medium text-gray-700">{investment.source}</p>
            </div>
            {investment.contactInfo && (
              <div className="col-span-2 bg-gray-50 border border-gray-100 rounded-xl p-3">
                <p className="text-[10px] text-gray-400 uppercase tracking-wider mb-1">Contact</p>
                <p className="text-xs text-gray-700">{investment.contactInfo}</p>
              </div>
            )}
          </div>

          {/* Actions */}
          <div className="flex gap-2 pt-2">
            <button className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-[#D4A843] text-white rounded-lg text-sm font-medium hover:bg-[#c49a3a] transition-colors">
              <Download className="w-4 h-4" /> Export Report
            </button>
            <button className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-[#1B2A4A] text-white rounded-lg text-sm font-medium hover:bg-[#152238] transition-colors">
              <Star className="w-4 h-4" /> Shortlist
            </button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  )
}
