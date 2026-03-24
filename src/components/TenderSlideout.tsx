"use client"

import Link from "next/link"
import { motion } from "framer-motion"
import {
  X, ChevronLeft, ChevronRight, Calendar, Clock, Shield,
  FileText, Download, Star, AlertTriangle, CheckCircle2,
  Brain, FileSearch, ArrowRight
} from "lucide-react"
import type { Tender } from "@/data/tenders"

function fmtRON(n: number) {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M RON`
  if (n >= 1_000) return `${(n / 1_000).toFixed(0)}K RON`
  return `${n} RON`
}

function fmtEUR(n: number) {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M EUR`
  if (n >= 1_000) return `${(n / 1_000).toFixed(0)}K EUR`
  return `${n} EUR`
}

function MatchBadge({ score }: { score: number }) {
  const cls = score >= 85
    ? "bg-[#22C55E]/10 text-[#22C55E] border-[#22C55E]/20"
    : score >= 70
    ? "bg-[#F59E0B]/10 text-[#F59E0B] border-[#F59E0B]/20"
    : "bg-[#4A5268]/20 text-[#7A8499] border-[#4A5268]/30"
  return (
    <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-sm font-bold border ${cls}`}>
      {score}%
    </span>
  )
}

const docColors: Record<string, string> = {
  pdf: "text-[#EF4444]",
  p7s: "text-[#3B7BF5]",
  rar: "text-[#A855F7]",
  xlsx: "text-[#22C55E]",
}

export default function TenderSlideout({
  tender,
  onClose,
  onPrev,
  onNext,
}: {
  tender: Tender
  onClose: () => void
  onPrev?: () => void
  onNext?: () => void
}) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ ease: "easeOut" }}
      className="fixed inset-0 z-50 flex justify-end"
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />

      {/* Panel */}
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
              <span className="text-xs font-mono text-[#4A5268]">{tender.seapId}</span>
              <MatchBadge score={tender.matchScore} />
              {tender.source === "seap-live" && (
                <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-[#3B7BF5]/10 text-[#60A5FA] border border-[#3B7BF5]/20">
                  LIVE
                </span>
              )}
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
          <h2 className="text-lg font-bold text-[#E8ECF4] leading-tight">{tender.title}</h2>
          <p className="text-sm text-[#7A8499] mt-1">{tender.authority}</p>
          <p className="text-xs text-[#4A5268] mt-1">{tender.cpvCode} — {tender.cpvDescription}</p>
        </div>

        <div className="px-6 py-6 space-y-6">
          {/* Key Metrics */}
          <div className="grid grid-cols-2 gap-3">
            {[
              { label: "Estimated Value", value: fmtRON(tender.estimatedValueRON), sub: fmtEUR(tender.estimatedValueEUR), icon: FileSearch },
              { label: "Submission Deadline", value: tender.submissionDeadline, sub: `${Math.max(0, Math.ceil((new Date(tender.submissionDeadline).getTime() - Date.now()) / 86400000))} days left`, icon: Calendar },
              { label: "Duration", value: tender.estimatedDuration, sub: "From contract signing", icon: Clock },
              { label: "Guarantee", value: fmtRON(tender.guaranteeRON), sub: `${((tender.guaranteeRON / tender.estimatedValueRON) * 100).toFixed(1)}% of value`, icon: Shield },
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

          {/* AI Brief */}
          <div className="bg-[#3B7BF5]/5 border-l-2 border-[#3B7BF5] rounded-r-xl p-5">
            <h3 className="flex items-center gap-2 text-sm font-bold text-[#E8ECF4] mb-3">
              <Brain className="w-4 h-4 text-[#3B7BF5]" />
              AI-Generated Project Brief
            </h3>

            <p className="text-sm text-[#7A8499] leading-relaxed mb-4">{tender.aiBrief.summary}</p>

            <div className="space-y-4">
              <div>
                <h4 className="text-xs font-semibold text-[#7A8499] uppercase tracking-wider mb-2">Key Requirements</h4>
                <div className="space-y-1.5">
                  {tender.aiBrief.keyRequirements.map((req, i) => (
                    <div key={i} className="flex items-start gap-2 text-xs text-[#7A8499]">
                      <CheckCircle2 className="w-3.5 h-3.5 text-[#3B7BF5] flex-shrink-0 mt-0.5" />
                      <span>{req}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h4 className="text-xs font-semibold text-[#7A8499] uppercase tracking-wider mb-2">Required Certifications</h4>
                <div className="flex flex-wrap gap-1.5">
                  {tender.aiBrief.certifications.map((cert, i) => (
                    <span key={i} className="px-2 py-0.5 rounded bg-[#1A1E27] border border-[#343B4A] text-[10px] text-[#7A8499]">
                      {cert}
                    </span>
                  ))}
                </div>
              </div>

              <div>
                <h4 className="text-xs font-semibold text-[#7A8499] uppercase tracking-wider mb-2">Timeline</h4>
                <p className="text-xs text-[#7A8499]">{tender.aiBrief.estimatedTimeline}</p>
              </div>

              <div>
                <h4 className="text-xs font-semibold text-[#7A8499] uppercase tracking-wider mb-2">Risk Flags</h4>
                <div className="space-y-1.5">
                  {tender.aiBrief.riskFlags.map((risk, i) => (
                    <div key={i} className="flex items-start gap-2 text-xs text-[#EF4444]/80">
                      <AlertTriangle className="w-3.5 h-3.5 text-[#EF4444] flex-shrink-0 mt-0.5" />
                      <span>{risk}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Documents */}
          {tender.documents.length > 0 && (
            <div>
              <h3 className="text-xs font-bold text-[#7A8499] uppercase tracking-wider mb-3 flex items-center gap-2">
                <FileText className="w-3.5 h-3.5" /> Tender Documents
              </h3>
              <div className="space-y-2">
                {tender.documents.map((doc, i) => (
                  <div key={i} className="flex items-center justify-between bg-[#0C0E12] border border-[#252A35] rounded-lg px-3 py-2.5 hover:border-[#343B4A] transition-colors duration-200">
                    <div className="flex items-center gap-2.5">
                      <FileText className={`w-4 h-4 ${docColors[doc.type] || "text-[#4A5268]"}`} />
                      <div>
                        <p className="text-xs font-medium text-[#E8ECF4]">{doc.name}</p>
                        <p className="text-[10px] text-[#7A8499]">
                          {doc.size}
                          {doc.ocrProcessed && (
                            <span className="ml-2 text-[#22C55E] font-medium">OCR Processed</span>
                          )}
                        </p>
                      </div>
                    </div>
                    <Download className="w-3.5 h-3.5 text-[#4A5268]" />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Processing Proof Link */}
          <div className="pt-2 border-t border-[#252A35]">
            <Link
              href="/processing"
              className="flex items-center gap-1.5 text-sm font-medium text-[#3B7BF5] hover:text-[#60A5FA] transition-colors duration-200"
            >
              View Processing Proof <ArrowRight className="w-3.5 h-3.5" />
            </Link>
            <p className="text-[10px] text-[#4A5268] mt-0.5">See .p7m, .p7s, ZIP extraction pipeline in action</p>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-2 pt-2">
            <button className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-[#3B7BF5] text-white rounded-lg text-sm font-medium hover:bg-[#2E6AE0] transition-colors duration-200">
              <Download className="w-4 h-4" /> Export to Excel
            </button>
            <button className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-[#1A1E27] border border-[#343B4A] text-[#E8ECF4] rounded-lg text-sm font-medium hover:bg-[#252A35] transition-colors duration-200">
              <Star className="w-4 h-4" /> Mark Priority
            </button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  )
}
