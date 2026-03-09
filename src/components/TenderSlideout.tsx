"use client"

import { motion } from "framer-motion"
import {
  X, ChevronLeft, ChevronRight, Calendar, Clock, Shield,
  FileText, Download, Star, AlertTriangle, CheckCircle2,
  Brain, FileSearch
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
  const color = score >= 85 ? "bg-emerald-500/10 text-emerald-600 border-emerald-200"
    : score >= 70 ? "bg-amber-500/10 text-amber-600 border-amber-200"
    : "bg-gray-500/10 text-gray-500 border-gray-200"
  return <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-sm font-bold border ${color}`}>{score}%</span>
}

const docIcons: Record<string, string> = {
  pdf: "text-red-500",
  p7s: "text-blue-500",
  rar: "text-purple-500",
  xlsx: "text-emerald-500",
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
      className="fixed inset-0 z-50 flex justify-end"
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/20 backdrop-blur-sm" onClick={onClose} />

      {/* Panel */}
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
              <span className="text-xs font-mono text-gray-400">{tender.seapId}</span>
              <MatchBadge score={tender.matchScore} />
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
          <h2 className="text-lg font-bold text-gray-900 leading-tight">{tender.title}</h2>
          <p className="text-sm text-gray-500 mt-1">{tender.authority}</p>
          <p className="text-xs text-gray-400 mt-1">{tender.cpvCode} — {tender.cpvDescription}</p>
        </div>

        <div className="px-6 py-6 space-y-6">
          {/* Key Metrics */}
          <div className="grid grid-cols-2 gap-3">
            {[
              { label: "Estimated Value", value: fmtRON(tender.estimatedValueRON), sub: fmtEUR(tender.estimatedValueEUR), icon: FileSearch },
              { label: "Submission Deadline", value: tender.submissionDeadline, sub: `${Math.ceil((new Date(tender.submissionDeadline).getTime() - Date.now()) / 86400000)} days left`, icon: Calendar },
              { label: "Duration", value: tender.estimatedDuration, sub: "From contract signing", icon: Clock },
              { label: "Guarantee", value: fmtRON(tender.guaranteeRON), sub: `${((tender.guaranteeRON / tender.estimatedValueRON) * 100).toFixed(1)}% of value`, icon: Shield },
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

          {/* AI Brief */}
          <div className="bg-[#D4A843]/5 border border-[#D4A843]/20 rounded-xl p-5">
            <h3 className="flex items-center gap-2 text-sm font-bold text-[#1B2A4A] mb-3">
              <Brain className="w-4 h-4 text-[#D4A843]" />
              AI-Generated Project Brief
            </h3>

            <p className="text-sm text-gray-700 leading-relaxed mb-4">{tender.aiBrief.summary}</p>

            <div className="space-y-4">
              <div>
                <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Key Requirements</h4>
                <div className="space-y-1.5">
                  {tender.aiBrief.keyRequirements.map((req, i) => (
                    <div key={i} className="flex items-start gap-2 text-xs text-gray-600">
                      <CheckCircle2 className="w-3.5 h-3.5 text-[#D4A843] flex-shrink-0 mt-0.5" />
                      <span>{req}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Required Certifications</h4>
                <div className="flex flex-wrap gap-1.5">
                  {tender.aiBrief.certifications.map((cert, i) => (
                    <span key={i} className="px-2 py-0.5 rounded bg-white border border-gray-200 text-[10px] text-gray-600">
                      {cert}
                    </span>
                  ))}
                </div>
              </div>

              <div>
                <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Timeline</h4>
                <p className="text-xs text-gray-600">{tender.aiBrief.estimatedTimeline}</p>
              </div>

              <div>
                <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Risk Flags</h4>
                <div className="space-y-1.5">
                  {tender.aiBrief.riskFlags.map((risk, i) => (
                    <div key={i} className="flex items-start gap-2 text-xs text-red-600">
                      <AlertTriangle className="w-3.5 h-3.5 flex-shrink-0 mt-0.5" />
                      <span>{risk}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Documents */}
          <div>
            <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3 flex items-center gap-2">
              <FileText className="w-3.5 h-3.5" /> Tender Documents
            </h3>
            <div className="space-y-2">
              {tender.documents.map((doc, i) => (
                <div key={i} className="flex items-center justify-between bg-gray-50 border border-gray-100 rounded-lg px-3 py-2.5">
                  <div className="flex items-center gap-2.5">
                    <FileText className={`w-4 h-4 ${docIcons[doc.type] || "text-gray-400"}`} />
                    <div>
                      <p className="text-xs font-medium text-gray-700">{doc.name}</p>
                      <p className="text-[10px] text-gray-400">
                        {doc.size}
                        {doc.ocrProcessed && (
                          <span className="ml-2 text-emerald-500 font-medium">OCR Processed</span>
                        )}
                      </p>
                    </div>
                  </div>
                  <Download className="w-3.5 h-3.5 text-gray-400" />
                </div>
              ))}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-2 pt-2">
            <button className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-[#D4A843] text-white rounded-lg text-sm font-medium hover:bg-[#c49a3a] transition-colors">
              <Download className="w-4 h-4" /> Export to Excel
            </button>
            <button className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-[#1B2A4A] text-white rounded-lg text-sm font-medium hover:bg-[#152238] transition-colors">
              <Star className="w-4 h-4" /> Mark Priority
            </button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  )
}
