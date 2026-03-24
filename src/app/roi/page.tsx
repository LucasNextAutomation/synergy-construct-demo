"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Calculator, Clock, TrendingUp, FileSearch, Building2, ArrowRight } from "lucide-react"
import Navbar from "@/components/Navbar"
import Footer from "@/components/Footer"

function fmtNum(n: number) {
  return n.toLocaleString("en-US", { maximumFractionDigits: 0 })
}

export default function ROIPage() {
  // Tender Monitoring inputs
  const [tenderHoursMonitoring, setTenderHoursMonitoring] = useState(8)
  const [tenderHoursDocAnalysis, setTenderHoursDocAnalysis] = useState(6)
  const [hourlyCostEUR, setHourlyCostEUR] = useState(25)
  const [missedTendersPerMonth, setMissedTendersPerMonth] = useState(3)
  const [avgTenderValueRON, setAvgTenderValueRON] = useState(30_000_000)

  // Investment Finder inputs
  const [investHoursSearching, setInvestHoursSearching] = useState(10)
  const [missedDealsPerQuarter, setMissedDealsPerQuarter] = useState(2)
  const [avgDealValueEUR, setAvgDealValueEUR] = useState(500_000)
  const [avgDiscountPercent, setAvgDiscountPercent] = useState(15)

  // Tender calculations
  const tenderWeeklyHoursSaved = Math.round((tenderHoursMonitoring + tenderHoursDocAnalysis) * 0.85)
  const tenderMonthlySavingsEUR = tenderWeeklyHoursSaved * 4 * hourlyCostEUR
  const tenderAnnualSavingsEUR = tenderMonthlySavingsEUR * 12
  const missedTendersAnnual = missedTendersPerMonth * 12
  const missedTenderValueRON = missedTendersAnnual * avgTenderValueRON

  // Investment calculations
  const investWeeklyHoursSaved = Math.round(investHoursSearching * 0.80)
  const investMonthlySavingsEUR = investWeeklyHoursSaved * 4 * hourlyCostEUR
  const investAnnualSavingsEUR = investMonthlySavingsEUR * 12
  const additionalDealsPerYear = missedDealsPerQuarter * 4
  const potentialSavingsOnDeals = additionalDealsPerYear * avgDealValueEUR * (avgDiscountPercent / 100)

  // Combined
  const totalWeeklyHoursSaved = tenderWeeklyHoursSaved + investWeeklyHoursSaved
  const totalAnnualSavingsEUR = tenderAnnualSavingsEUR + investAnnualSavingsEUR
  const totalOpportunityValue = potentialSavingsOnDeals

  return (
    <div className="min-h-screen bg-[#f6f7f8]">
      <Navbar />

      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ ease: "easeOut", duration: 0.5 }}
          className="text-center mb-12"
        >
          <div className="w-14 h-14 rounded-2xl bg-[#E31E24]/8 border border-[#E31E24]/20 flex items-center justify-center mx-auto mb-4">
            <Calculator className="w-7 h-7 text-[#E31E24]" />
          </div>
          <h1 className="text-3xl font-semibold text-[#0f172a] tracking-tight mb-2">ROI Calculator</h1>
          <p className="text-[#64748b] max-w-lg mx-auto">
            Adjust the inputs below to see how much time and money your team could save with automated tender monitoring and investment sourcing.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-8 mb-12">
          {/* Section A: Tender Monitoring ROI */}
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, ease: "easeOut", duration: 0.5 }}
            style={{ borderRadius: 16, border: '1px solid #e8eaed', boxShadow: '0 1px 3px rgba(0,0,0,0.04)' }}
            className="bg-white p-6"
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-xl bg-[#E31E24]/8 border border-[#E31E24]/20 flex items-center justify-center">
                <FileSearch className="w-5 h-5 text-[#E31E24]" />
              </div>
              <div>
                <h2 className="text-lg font-semibold text-[#0f172a]">Tender Monitoring</h2>
                <p className="text-xs text-[#64748b]">SEAP / e-licitatie.ro automation</p>
              </div>
            </div>

            <div className="space-y-5">
              <InputSlider
                label="Hours/week on SEAP monitoring"
                value={tenderHoursMonitoring}
                onChange={setTenderHoursMonitoring}
                min={1} max={40} step={1}
                unit="hrs"
              />
              <InputSlider
                label="Hours/week on document analysis"
                value={tenderHoursDocAnalysis}
                onChange={setTenderHoursDocAnalysis}
                min={1} max={30} step={1}
                unit="hrs"
              />
              <InputSlider
                label="Average hourly cost of team member"
                value={hourlyCostEUR}
                onChange={setHourlyCostEUR}
                min={10} max={100} step={5}
                unit="EUR"
              />
              <InputSlider
                label="Tenders missed per month (manual process)"
                value={missedTendersPerMonth}
                onChange={setMissedTendersPerMonth}
                min={0} max={15} step={1}
                unit=""
              />
              <InputSlider
                label="Average tender value"
                value={avgTenderValueRON}
                onChange={setAvgTenderValueRON}
                min={5_000_000} max={200_000_000} step={5_000_000}
                unit="RON"
                format={v => `${(v / 1_000_000).toFixed(0)}M`}
              />
            </div>

            {/* Results */}
            <div className="mt-6 pt-6 border-t border-[#e8eaed] space-y-3">
              <ResultRow label="Weekly hours saved" value={`${tenderWeeklyHoursSaved}h`} color="text-[#3B82F6]" />
              <ResultRow label="Monthly savings" value={`${fmtNum(tenderMonthlySavingsEUR)} EUR`} color="text-[#22C55E]" />
              <ResultRow label="Annual savings" value={`${fmtNum(tenderAnnualSavingsEUR)} EUR`} color="text-[#22C55E]" highlight />
              <div className="bg-[#EF4444]/5 border border-[#EF4444]/15 rounded-lg p-3 mt-3">
                <p className="text-xs text-[#EF4444]/80">
                  At current pace, your team misses ~<strong className="text-[#EF4444]">{missedTendersAnnual} tenders/year</strong> worth a combined <strong className="text-[#EF4444]">{fmtNum(missedTenderValueRON / 1_000_000)}M RON</strong> in potential contracts.
                </p>
              </div>
            </div>
          </motion.div>

          {/* Section B: Investment Finder ROI */}
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, ease: "easeOut", duration: 0.5 }}
            style={{ borderRadius: 16, border: '1px solid #e8eaed', boxShadow: '0 1px 3px rgba(0,0,0,0.04)' }}
            className="bg-white p-6"
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-xl bg-[#22C55E]/10 border border-[#22C55E]/20 flex items-center justify-center">
                <Building2 className="w-5 h-5 text-[#22C55E]" />
              </div>
              <div>
                <h2 className="text-lg font-semibold text-[#0f172a]">Investment Finder</h2>
                <p className="text-xs text-[#64748b]">Off-market property sourcing</p>
              </div>
            </div>

            <div className="space-y-5">
              <InputSlider
                label="Hours/week searching for properties"
                value={investHoursSearching}
                onChange={setInvestHoursSearching}
                min={1} max={40} step={1}
                unit="hrs"
              />
              <InputSlider
                label="Deals missed per quarter"
                value={missedDealsPerQuarter}
                onChange={setMissedDealsPerQuarter}
                min={0} max={10} step={1}
                unit=""
              />
              <InputSlider
                label="Average deal value"
                value={avgDealValueEUR}
                onChange={setAvgDealValueEUR}
                min={100_000} max={5_000_000} step={50_000}
                unit="EUR"
                format={v => `${(v / 1_000).toFixed(0)}K`}
              />
              <InputSlider
                label="Average discount on found deals"
                value={avgDiscountPercent}
                onChange={setAvgDiscountPercent}
                min={5} max={50} step={1}
                unit="%"
              />
            </div>

            {/* Results */}
            <div className="mt-6 pt-6 border-t border-[#e8eaed] space-y-3">
              <ResultRow label="Weekly hours saved" value={`${investWeeklyHoursSaved}h`} color="text-[#3B82F6]" />
              <ResultRow label="Monthly savings" value={`${fmtNum(investMonthlySavingsEUR)} EUR`} color="text-[#22C55E]" />
              <ResultRow label="Annual savings" value={`${fmtNum(investAnnualSavingsEUR)} EUR`} color="text-[#22C55E]" highlight />
              <ResultRow label="Additional deals found/year" value={additionalDealsPerYear.toString()} color="text-[#3B82F6]" />
              <div className="bg-[#22C55E]/8 border border-[#22C55E]/15 rounded-lg p-3 mt-3">
                <p className="text-xs text-[#22C55E]/90">
                  Finding <strong className="text-[#22C55E]">{additionalDealsPerYear} more deals/year</strong> at avg {avgDiscountPercent}% discount = <strong className="text-[#22C55E]">{fmtNum(potentialSavingsOnDeals)} EUR</strong> in additional savings on acquisitions.
                </p>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Combined Summary — navy card like W5 */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, ease: "easeOut", duration: 0.5 }}
          style={{ borderRadius: 16, boxShadow: '0 4px 20px rgba(0,0,0,0.08)' }}
          className="bg-[#0f172a] p-8"
        >
          <p className="text-center text-[11px] uppercase tracking-[0.08em] text-[#E31E24] font-bold mb-8">
            Combined Annual Impact
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8">
            <div className="text-center">
              <div className="w-12 h-12 rounded-xl bg-white/10 border border-white/10 flex items-center justify-center mx-auto mb-3">
                <Clock className="w-6 h-6 text-white" />
              </div>
              <p className="text-4xl font-bold text-white">{totalWeeklyHoursSaved}h</p>
              <p className="text-sm text-[#94a3b8] mt-1">saved per week</p>
              <p className="text-xs text-[#64748b] mt-0.5">{totalWeeklyHoursSaved * 52}h per year</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 rounded-xl bg-[#22C55E]/10 border border-[#22C55E]/20 flex items-center justify-center mx-auto mb-3">
                <TrendingUp className="w-6 h-6 text-[#22C55E]" />
              </div>
              <p className="text-4xl font-bold text-white">{fmtNum(totalAnnualSavingsEUR)}</p>
              <p className="text-sm text-[#94a3b8] mt-1">EUR saved annually</p>
              <p className="text-xs text-[#64748b] mt-0.5">In team productivity</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 rounded-xl bg-[#E31E24]/10 border border-[#E31E24]/20 flex items-center justify-center mx-auto mb-3">
                <Building2 className="w-6 h-6 text-[#E31E24]" />
              </div>
              <p className="text-4xl font-bold text-white">{fmtNum(totalOpportunityValue)}</p>
              <p className="text-sm text-[#94a3b8] mt-1">EUR in opportunity value</p>
              <p className="text-xs text-[#64748b] mt-0.5">{additionalDealsPerYear} additional deals/year</p>
            </div>
          </div>

          <div className="flex items-center justify-center gap-3 text-center">
            <div className="bg-white/5 border border-white/10 rounded-xl px-6 py-4 inline-flex items-center gap-3 flex-wrap justify-center">
              <span className="text-lg font-bold text-white">{totalWeeklyHoursSaved}h/week</span>
              <ArrowRight className="w-5 h-5 text-[#64748b]" />
              <span className="text-lg font-bold text-[#22C55E]">{fmtNum(totalAnnualSavingsEUR)} EUR/year</span>
              <span className="text-[#64748b] mx-1">+</span>
              <span className="text-lg font-bold text-[#E31E24]">{fmtNum(totalOpportunityValue)} EUR</span>
              <span className="text-sm text-[#94a3b8] ml-1">opportunity value</span>
            </div>
          </div>

          <p className="text-center text-xs text-[#64748b] mt-6">
            Calculations assume 85% automation of monitoring tasks and 80% of search tasks.
            Actual results may vary based on implementation scope.
          </p>
        </motion.div>
      </div>

      <Footer />
    </div>
  )
}

function InputSlider({
  label,
  value,
  onChange,
  min,
  max,
  step,
  unit,
  format,
}: {
  label: string
  value: number
  onChange: (v: number) => void
  min: number
  max: number
  step: number
  unit: string
  format?: (v: number) => string
}) {
  const display = format ? format(value) : value.toString()
  const pct = ((value - min) / (max - min)) * 100

  return (
    <div>
      <div className="flex items-center justify-between mb-1.5">
        <label className="text-sm text-[#64748b]">{label}</label>
        <span className="text-sm font-bold text-[#0f172a]">{display} {unit}</span>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={e => onChange(Number(e.target.value))}
        className="w-full h-2 rounded-full appearance-none cursor-pointer"
        style={{ background: `linear-gradient(to right, #E31E24 0%, #E31E24 ${pct}%, #e8eaed ${pct}%, #e8eaed 100%)` }}
      />
      <div className="flex justify-between text-[10px] text-[#94a3b8] mt-0.5">
        <span>{format ? format(min) : min} {unit}</span>
        <span>{format ? format(max) : max} {unit}</span>
      </div>
    </div>
  )
}

function ResultRow({ label, value, color, highlight }: { label: string; value: string; color: string; highlight?: boolean }) {
  return (
    <div className={`flex items-center justify-between ${highlight ? "bg-[#f6f7f8] border border-[#e8eaed] rounded-lg px-3 py-2 -mx-1" : ""}`}>
      <span className={`text-sm ${highlight ? "font-semibold text-[#0f172a]" : "text-[#64748b]"}`}>{label}</span>
      <span className={`text-sm font-bold ${color} ${highlight ? "text-base" : ""}`}>{value}</span>
    </div>
  )
}
