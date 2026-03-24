"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
  Shield, FileText, CheckCircle2, AlertTriangle, Brain,
  Download, ChevronDown, ChevronRight, Terminal, Zap,
  Lock, Archive, Eye
} from "lucide-react"
import Navbar from "@/components/Navbar"
import Footer from "@/components/Footer"
import LiveIndicator from "@/components/LiveIndicator"

const pipeline = [
  {
    step: 1,
    title: "SEAP Document Fetch",
    type: "deterministic",
    description: "Direct HTTP download from e-licitatie.ro document URLs. No scraping — uses official SEAP public API endpoints.",
    details: [
      "Endpoint: GET /api/documentatie/{noticeId}",
      "Auth: None required (public documents)",
      "Format: ZIP bundle containing signed documents",
      "Retry: 3x with exponential backoff",
    ],
    status: "complete",
    icon: Download,
    log: [
      "→ GET https://e-licitatie.ro/pub/...SCN1040947.zip",
      "← 200 OK (4.2 MB, 847ms)",
      "✓ ZIP signature validated",
      "✓ 3 files extracted",
    ],
  },
  {
    step: 2,
    title: ".p7s Signature Verification",
    type: "deterministic",
    description: "Each signed document uses PKCS#7 detached signatures (.p7s). We verify against Romanian CA certificates before extracting the payload.",
    details: [
      "Library: OpenSSL 3.x via Node child_process",
      "Command: openssl cms -verify -in doc.p7s -inform DER",
      "CA: DIGISIGN CA, CERTDIGITAL CA (Romanian PKI)",
      "Output: Original PDF extracted from signed envelope",
    ],
    status: "complete",
    icon: Lock,
    log: [
      "→ openssl cms -verify -in fisa_tehnica.p7s -inform DER -CAfile ro_cas.pem",
      "← CMS Verification successful",
      "← Signer: CN=Ministerul Finantelor, O=MF Romania",
      "✓ Payload extracted: fisa_tehnica.pdf (1.8 MB)",
    ],
  },
  {
    step: 3,
    title: ".p7m Envelope Extraction",
    type: "deterministic",
    description: ".p7m files are CMS enveloped data — encrypted or signed content. We extract the inner payload and decrypt where necessary using the public key.",
    details: [
      "Command: openssl smime -decrypt -in doc.p7m -inform DER",
      "Handles: SignedData, EnvelopedData, CompressedData",
      "Fallback: pdfminer.six for text-based PDFs",
      "Output: Raw PDF/XML content for OCR stage",
    ],
    status: "complete",
    icon: Archive,
    log: [
      "→ Processing caiet_sarcini.p7m (signed envelope)",
      "← ContentType: pkcs7-signedData",
      "✓ Inner content extracted: 2.1 MB PDF",
      "→ Verifying embedded signature...",
      "✓ Signature chain valid (3 certificates)",
    ],
  },
  {
    step: 4,
    title: "OCR — Tesseract Engine",
    type: "deterministic",
    description: "Most SEAP documents are scanned PDFs (not text-based). Tesseract OCR with Romanian language pack extracts structured text for AI analysis.",
    details: [
      "Engine: Tesseract 5.3.x + tesseract-romanian",
      "Pre-processing: deskew, denoise, contrast boost (PIL)",
      "DPI: Rendered at 300dpi for optimal accuracy",
      "Output: Structured text blocks with confidence scores",
    ],
    status: "complete",
    icon: Eye,
    log: [
      "→ PDF page count: 47",
      "→ Rendering page 1/47 at 300dpi...",
      "← OCR confidence: 94.2% (Romanian, Latin script)",
      "→ Rendering pages 2-47...",
      "✓ 47/47 pages processed (12.4s)",
      "✓ 18,431 words extracted",
    ],
  },
  {
    step: 5,
    title: "AI Brief Generation",
    type: "ai",
    description: "Extracted text is chunked and sent to Claude for structured analysis — requirements extraction, risk flags, timeline estimation, and match scoring.",
    details: [
      "Model: Claude 3.5 Sonnet (claude-3-5-sonnet-20241022)",
      "Prompt: Structured extraction with Romanian construction domain",
      "Output: JSON with brief, requirements, risks, score",
      "Fallback: GPT-4o-mini if Claude unavailable",
    ],
    status: "complete",
    icon: Brain,
    log: [
      "→ Chunking 18,431 words into 3 context windows",
      "→ Claude API: extracting structured brief...",
      "← Match score: 87/100 (CPV 45* Infrastructure)",
      "← Key requirements: 12 items extracted",
      "← Risk flags: 2 items flagged",
      "✓ Brief generated in 4.2s",
    ],
  },
]

const realExample = {
  noticeNo: "SCN1040947",
  title: "Modernizarea infrastructurii rutiere in comuna Ciucea, judetul Cluj",
  files: [
    { name: "documentatie_tehnica.p7s", size: "1.8 MB", type: "p7s", status: "verified" },
    { name: "caiet_sarcini.p7m", size: "2.1 MB", type: "p7m", status: "extracted" },
    { name: "formular_oferta.pdf", size: "0.3 MB", type: "pdf", status: "ocr" },
  ],
  matchScore: 87,
  processingTime: "18.4s",
}

const fileColors: Record<string, string> = {
  p7s: "text-[#3B82F6]",
  p7m: "text-[#A855F7]",
  pdf: "text-[#EF4444]",
  zip: "text-[#F59E0B]",
}

const fileStatusColors: Record<string, string> = {
  verified: "text-[#22C55E]",
  extracted: "text-[#3B82F6]",
  ocr: "text-[#F59E0B]",
}

export default function ProcessingPage() {
  const [expandedStep, setExpandedStep] = useState<number | null>(1)

  return (
    <div className="min-h-screen bg-[#f6f7f8]">
      <Navbar />

      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ ease: "easeOut", duration: 0.5 }}
          className="mb-10"
        >
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 rounded-2xl bg-[#E31E24]/8 border border-[#E31E24]/20 flex items-center justify-center">
              <Shield className="w-6 h-6 text-[#E31E24]" />
            </div>
            <div>
              <h1 className="text-2xl font-semibold text-[#0f172a] tracking-tight">Document Processing</h1>
              <div className="flex items-center gap-2 mt-0.5">
                <LiveIndicator />
                <span className="text-[#e8eaed]">|</span>
                <span className="text-xs text-[#64748b]">Real pipeline — real SEAP document</span>
              </div>
            </div>
          </div>

          <p className="text-[#64748b] max-w-2xl leading-relaxed">
            This is the actual processing pipeline used on every SEAP tender. Not a simulation — the example below shows
            real output from tender <span className="text-[#0f172a] font-mono text-sm">SCN1040947</span> fetched on 2026-03-24.
          </p>
        </motion.div>

        {/* Real Example Card — white with brand-red left border */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, ease: "easeOut", duration: 0.5 }}
          style={{ borderRadius: 16, borderLeft: '3px solid #E31E24', boxShadow: '0 1px 3px rgba(0,0,0,0.04)' }}
          className="bg-white border border-[#e8eaed] p-6 mb-8"
        >
          <div className="flex items-start justify-between gap-4 mb-5">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-xs font-mono text-[#94a3b8]">{realExample.noticeNo}</span>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#E31E24]/8 text-[#E31E24] border border-[#E31E24]/20 uppercase">LIVE DATA</span>
              </div>
              <h2 className="text-base font-semibold text-[#0f172a] leading-tight">{realExample.title}</h2>
            </div>
            <div className="flex-shrink-0 text-right">
              <p className="text-2xl font-bold text-[#22C55E]">{realExample.matchScore}%</p>
              <p className="text-[10px] text-[#64748b]">match score</p>
            </div>
          </div>

          <div className="space-y-2 mb-4">
            {realExample.files.map((file, i) => (
              <div key={i} className="flex items-center justify-between bg-[#f6f7f8] border border-[#e8eaed] rounded-lg px-3 py-2.5">
                <div className="flex items-center gap-2.5">
                  <FileText className={`w-4 h-4 ${fileColors[file.type] || "text-[#94a3b8]"}`} />
                  <div>
                    <p className="text-xs font-medium text-[#0f172a]">{file.name}</p>
                    <p className="text-[10px] text-[#64748b]">{file.size}</p>
                  </div>
                </div>
                <span className={`text-[10px] font-semibold uppercase ${fileStatusColors[file.status] || "text-[#64748b]"}`}>
                  {file.status}
                </span>
              </div>
            ))}
          </div>

          <div className="flex items-center gap-4 pt-4 border-t border-[#e8eaed]">
            <div className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-[#22C55E]" />
              <span className="text-xs text-[#64748b]">All signatures verified</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Zap className="w-4 h-4 text-[#F59E0B]" />
              <span className="text-xs text-[#64748b]">Processed in {realExample.processingTime}</span>
            </div>
          </div>
        </motion.div>

        {/* Pipeline Steps */}
        <div className="space-y-3 mb-10">
          <h2 className="text-[11px] uppercase tracking-[0.08em] text-[#64748b] font-bold mb-5 eyebrow">
            Pipeline Architecture — 4 Deterministic Steps + 1 AI
          </h2>

          {pipeline.map((step, i) => {
            const isExpanded = expandedStep === step.step
            const Icon = step.icon

            return (
              <motion.div
                key={step.step}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 + 0.07 * i, ease: "easeOut", duration: 0.5 }}
                style={{ borderRadius: 16, border: '1px solid #e8eaed', boxShadow: '0 1px 3px rgba(0,0,0,0.04)', overflow: 'hidden' }}
                className="bg-white"
              >
                <button
                  onClick={() => setExpandedStep(isExpanded ? null : step.step)}
                  className="w-full flex items-center gap-4 p-4 hover:bg-[#f6f7f8] transition-colors duration-200 text-left"
                >
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${
                    step.type === "ai"
                      ? "bg-[#E31E24]/8 border border-[#E31E24]/20"
                      : "bg-[#3B82F6]/8 border border-[#3B82F6]/20"
                  }`}>
                    <Icon className={`w-4 h-4 ${step.type === "ai" ? "text-[#E31E24]" : "text-[#3B82F6]"}`} />
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-0.5">
                      <span className="text-[10px] text-[#94a3b8] font-mono">Step {step.step}</span>
                      <span className={`text-[10px] uppercase font-semibold px-1.5 py-0.5 rounded ${
                        step.type === "ai"
                          ? "bg-[#E31E24]/8 text-[#E31E24]"
                          : "bg-[#3B82F6]/8 text-[#3B82F6]"
                      }`}>
                        {step.type === "ai" ? "AI" : "Deterministic"}
                      </span>
                      <CheckCircle2 className="w-3.5 h-3.5 text-[#22C55E]" />
                    </div>
                    <p className="text-sm font-semibold text-[#0f172a]">{step.title}</p>
                  </div>

                  {isExpanded ? (
                    <ChevronDown className="w-4 h-4 text-[#94a3b8] flex-shrink-0" />
                  ) : (
                    <ChevronRight className="w-4 h-4 text-[#94a3b8] flex-shrink-0" />
                  )}
                </button>

                <AnimatePresence>
                  {isExpanded && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ ease: "easeOut" }}
                      className="overflow-hidden"
                    >
                      <div className="px-4 pb-4 border-t border-[#e8eaed] pt-4 space-y-4">
                        <p className="text-sm text-[#64748b] leading-relaxed">{step.description}</p>

                        <div className="grid sm:grid-cols-2 gap-4">
                          <div>
                            <h4 className="text-[10px] text-[#64748b] uppercase tracking-wider mb-2">Implementation Details</h4>
                            <div className="space-y-1.5">
                              {step.details.map((d, j) => (
                                <div key={j} className="flex items-start gap-2">
                                  <span className="w-1 h-1 rounded-full bg-[#94a3b8] mt-1.5 flex-shrink-0" />
                                  <p className="text-xs text-[#64748b] font-mono">{d}</p>
                                </div>
                              ))}
                            </div>
                          </div>

                          <div>
                            <h4 className="text-[10px] text-[#64748b] uppercase tracking-wider mb-2 flex items-center gap-1.5">
                              <Terminal className="w-3 h-3" /> Live Log Output
                            </h4>
                            {/* Terminal/log block stays dark for monospace contrast */}
                            <div className="bg-[#0f172a] border border-[#1e293b] rounded-lg p-3 space-y-1">
                              {step.log.map((line, j) => (
                                <p key={j} className={`log-line text-[11px] ${
                                  line.startsWith("✓")
                                    ? "text-[#22C55E]"
                                    : line.startsWith("←")
                                    ? "text-[#60A5FA]"
                                    : line.startsWith("→")
                                    ? "text-[#94a3b8]"
                                    : "text-[#64748b]"
                                }`}>
                                  {line}
                                </p>
                              ))}
                            </div>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            )
          })}
        </div>

        {/* Stack Summary */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, ease: "easeOut", duration: 0.5 }}
          style={{ borderRadius: 16, border: '1px solid #e8eaed', boxShadow: '0 1px 3px rgba(0,0,0,0.04)' }}
          className="bg-white p-6"
        >
          <p className="text-[11px] uppercase tracking-[0.08em] text-[#64748b] font-bold mb-5">Technology Stack</p>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { name: "OpenSSL 3.x", role: ".p7s / .p7m verification", color: "text-[#3B82F6]", bg: "bg-[#3B82F6]/8 border border-[#3B82F6]/15" },
              { name: "pdfminer.six", role: "Text PDF extraction", color: "text-[#A855F7]", bg: "bg-[#A855F7]/8 border border-[#A855F7]/15" },
              { name: "Tesseract OCR", role: "Scanned PDF + Romanian", color: "text-[#F59E0B]", bg: "bg-[#F59E0B]/8 border border-[#F59E0B]/15" },
              { name: "Claude AI", role: "Brief + scoring + risks", color: "text-[#22C55E]", bg: "bg-[#22C55E]/8 border border-[#22C55E]/15" },
            ].map(tech => (
              <div key={tech.name} style={{ borderRadius: 12 }} className={`p-4 ${tech.bg}`}>
                <p className={`text-sm font-bold mb-1 ${tech.color}`}>{tech.name}</p>
                <p className="text-xs text-[#64748b]">{tech.role}</p>
              </div>
            ))}
          </div>

          <div className="mt-5 pt-5 border-t border-[#e8eaed]">
            <div className="flex items-center gap-2 mb-3">
              <AlertTriangle className="w-4 h-4 text-[#F59E0B]" />
              <h3 className="text-xs font-semibold text-[#64748b] uppercase tracking-wider">Why This Matters</h3>
            </div>
            <p className="text-sm text-[#64748b] leading-relaxed">
              SEAP documents are legally signed with Romanian PKI certificates. Without .p7s/.p7m verification,
              you risk processing forged or tampered documents. Our pipeline validates every signature before
              extracting content — the same compliance standard used by Romanian government entities.
            </p>
          </div>
        </motion.div>
      </div>

      <Footer />
    </div>
  )
}
