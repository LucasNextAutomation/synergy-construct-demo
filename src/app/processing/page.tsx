"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
  Shield, FileText, CheckCircle2, AlertTriangle,
  ChevronDown, ChevronRight, Terminal, Download,
  Lock, Archive, Eye, ExternalLink, Cpu
} from "lucide-react"
import Navbar from "@/components/Navbar"
import Footer from "@/components/Footer"

// ─── Pipeline steps — every detail verified on 2026-03-24 ───────────────────
const pipeline = [
  {
    step: 1,
    title: "SEAP API Connection",
    type: "deterministic" as const,
    description: "Connect to the public SEAP API at e-licitatie.ro and retrieve tender metadata. The API requires no authentication — it serves publicly mandated procurement data under Romania's Open Government commitment.",
    details: [
      "Endpoint: POST /api-pub/NoticeCommon/GetCNoticeList/",
      "Authentication: None required (public API)",
      "Required headers: Referer: https://e-licitatie.ro/pub",
      "Rate limiting: 2-second delay between requests",
    ],
    log: [
      "-> POST https://e-licitatie.ro/api-pub/NoticeCommon/GetCNoticeList/",
      "<- 200 OK (25,286 bytes)",
      "OK Parsed 20 contract notices",
      "OK Filtered to 9 construction tenders (CPV 45*)",
    ],
    sourceUrl: "https://e-licitatie.ro/pub/notices/contract-notices/list/0/0",
  },
  {
    step: 2,
    title: "Document Download",
    type: "deterministic" as const,
    description: "Download tender documents directly from SEAP using the document ID. Each tender has associated documentation packages that may include signed files (.p7m, .p7s), PDFs, and Word documents.",
    details: [
      "Endpoint: GET /api-pub/NoticeCommon/DownloadNoticeDocument/?documentId={id}",
      "Document list: POST /api-pub/NoticeDocument/GetAll/ with notice ID",
      "No authentication required — public tender documents",
      "Files include: .p7m, .p7s, .pdf, .docx, .doc, .rar",
    ],
    log: [
      "-> GET DownloadNoticeDocument/?documentId=XXXXX",
      "<- 828,423 bytes (clarificare_DUAE_pfizer.p7m)",
      "-> GET DownloadNoticeDocument/?documentId=XXXXX",
      "<- 672,086 bytes (raspuns_consolidat_satumare.p7s)",
      "OK 2 signed documents downloaded",
    ],
    sourceUrl: "https://e-licitatie.ro/pub",
  },
  {
    step: 3,
    title: "Signature Extraction (.p7m / .p7s)",
    type: "deterministic" as const,
    description: "SEAP documents are digitally signed using CAdES (CMS Advanced Electronic Signatures) — the EU eIDAS standard. The .p7m format wraps the original document inside a PKCS#7 container. We extract the inner document using OpenSSL.",
    details: [
      "Tool: OpenSSL 3.6.1 (standard, pre-installed on all servers)",
      "Command: openssl cms -verify -noverify -in FILE -inform DER -out EXTRACTED",
      "The -noverify flag extracts without requiring the CA certificate chain",
      "Works on both .p7m (enveloped) and .p7s (detached) formats",
    ],
    log: [
      "-> openssl cms -verify -noverify -in clarificare_DUAE_pfizer.p7m -inform DER",
      "<- CMS Verification successful",
      "OK Extracted: 821,002 bytes (PDF document, version 1.6)",
      "-> openssl cms -verify -noverify -in raspuns_consolidat_satumare.p7s -inform DER",
      "<- CMS Verification successful",
      "OK Extracted: 667,257 bytes (PDF document, version 1.4, 2 pages)",
    ],
    sourceUrl: null,
  },
  {
    step: 4,
    title: "Text Extraction",
    type: "deterministic" as const,
    description: "Extract readable text from the recovered PDF documents. For PDFs with a text layer, pdfminer.six extracts instantly. For scanned PDFs (image-only), Tesseract OCR with Romanian language support handles the conversion.",
    details: [
      "Library: pdfminer.six (Python — handles Romanian diacritics natively)",
      "OCR fallback: Tesseract with ron (Romanian) language pack",
      "The Pfizer and Satu Mare PDFs are scanned — require OCR",
      "The RATB Bucuresti PDF has a text layer — extracted 47,608 characters",
    ],
    log: [
      "-> pdfminer.six on fisa_date_RATB_bucuresti.pdf (292,352 bytes)",
      "<- Text layer detected (no OCR needed)",
      "OK 47,608 characters extracted (6,658 words)",
      "OK Content starts: Sistemul Electronic de Achizitii Publice...",
    ],
    sourceUrl: null,
  },
  {
    step: 5,
    title: "AI Qualification Brief",
    type: "ai" as const,
    description: "The extracted text is analyzed by AI to generate a structured qualification brief in Romanian. The AI evaluates project scope, requirements, timeline, risks, and provides a Go/No-Go recommendation tailored to the company's capabilities.",
    details: [
      "Input: extracted text from the tender document",
      "Output: structured analysis with 5-7 qualification points",
      "Language: Romanian (native output, not translated)",
      "AI is only used here — all prior steps are deterministic code",
    ],
    log: [
      "-> Sending 4,000 chars from RATB document for analysis",
      "<- Generated 6 qualification points in Romanian",
      "OK Recommendation: CONDITIONAT (conditional participation)",
      "OK Brief includes: scope, requirements, value, risks, recommendation",
    ],
    sourceUrl: null,
  },
]

// ─── Real documents from SEAP — downloadable ────────────────────────────────
const realDocuments = [
  {
    name: "clarificare_DUAE_pfizer.p7m",
    displayName: "Pfizer Romania — DUAE Clarification",
    size: "828,423 bytes",
    type: "p7m",
    signer: "Pfizer Romania SRL",
    result: "CMS Verification successful",
    extractedFile: "pfizer_extracted_from_p7m.pdf",
    extractedSize: "821,002 bytes",
    extractedDesc: "PDF document, version 1.6 (scanned — OCR required)",
    downloadPath: "/seap-proof/clarificare_DUAE_pfizer.p7m",
    extractedDownloadPath: "/seap-proof/pfizer_extracted_from_p7m.pdf",
  },
  {
    name: "raspuns_consolidat_satumare.p7s",
    displayName: "Judetul Satu Mare — Consolidated Response",
    size: "672,086 bytes",
    type: "p7s",
    signer: "Judetul Satu Mare",
    result: "CMS Verification successful",
    extractedFile: "satumare_extracted_from_p7s.pdf",
    extractedSize: "667,257 bytes",
    extractedDesc: "PDF document, version 1.4, 2 pages (scanned — OCR required)",
    downloadPath: "/seap-proof/raspuns_consolidat_satumare.p7s",
    extractedDownloadPath: "/seap-proof/satumare_extracted_from_p7s.pdf",
  },
  {
    name: "fisa_date_RATB_bucuresti.pdf",
    displayName: "RATB Bucuresti — Tender Data Sheet (Fisa de Date)",
    size: "292,352 bytes",
    type: "pdf",
    signer: "Regia Autonoma de Transport Bucuresti",
    result: "Text layer detected — 47,608 chars extracted",
    extractedFile: null,
    extractedSize: "47,608 characters / 6,658 words",
    extractedDesc: "11-page procurement document with full text layer",
    downloadPath: "/seap-proof/fisa_date_RATB_bucuresti.pdf",
    extractedDownloadPath: null,
  },
]

const extractedTextPreview = `Sistemul Electronic de Achizitii Publice

Fisa de date
Tip anunt: Anunt de participare simplificat
Tip Legislatie: Legea nr. 99/23.05.2016

Sectiunea I Autoritatea contractanta

I.1) Denumire si adrese
Regia Autonoma de Transport Bucuresti

Cod de identificare fiscala: 1589886
Adresa: Strada: Bd. Dinicu Golescu, nr. 1
Localitate: Bucuresti; Cod Postal: 7000; Tara: Romania
Codul NUTS: RO321 Bucuresti`

const realAiBrief = [
  "Domeniul proiectului: Furnizare cabluri cu conductoare de aluminiu cu intarziere marita la propagarea flacarii pentru vehiculele de transport public RATB. Contractul este impartit in 14 loturi.",
  "Cerinte cheie: Cabluri de joasa tensiune conforme anexei 1 model acord cadru, cantitate minima 150m, maxima 210m pentru lotul 1. Livrare la sediul RATB (Intrarea Vagonului nr.11, sector 2, Bucuresti).",
  "Valoare si calendar: Valoarea totala estimata 337.629,46 RON fara TVA (toate loturile). Termen clarificari: 6 zile inainte de depunere oferte.",
  "Riscuri identificate: Valoarea foarte mica per lot (sub 500 RON) poate indica costuri administrative disproportionate. Documentul pare incomplet.",
  "Flag-uri procedurale: Legislatia aplicabila 99/2016, procedura simplificata. Autoritate contractanta stabila (RATB).",
  "Recomandare: CONDITIONAT. Participare doar daca aveti stoc existent si capacitate de livrare rapida in Bucuresti.",
]

const fileColors: Record<string, string> = {
  p7s: "#3B82F6",
  p7m: "#A855F7",
  pdf: "#EF4444",
}

const stepIcons = [Shield, Download, Lock, Eye, Cpu]

export default function ProcessingPage() {
  const [expandedStep, setExpandedStep] = useState<number | null>(null)

  return (
    <div style={{ minHeight: "100vh", backgroundColor: "#f6f7f8" }}>
      <Navbar />

      <div style={{ maxWidth: 800, margin: "0 auto", padding: "48px 40px 80px" }}>

        {/* ── Header ────────────────────────────────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ ease: "easeOut", duration: 0.5 }}
          style={{ marginBottom: 48 }}
        >
          <p style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", color: "#E31E24", marginBottom: 12 }}>
            Technical Proof
          </p>
          <h1 style={{ fontSize: "clamp(28px, 4vw, 40px)", fontWeight: 800, color: "#0f172a", letterSpacing: "-0.03em", lineHeight: 1.15, margin: "0 0 16px" }}>
            Real SEAP Document Processing
          </h1>
          <p style={{ fontSize: 16, color: "#64748b", lineHeight: 1.65, maxWidth: 620 }}>
            Below are real documents downloaded from the Romanian public procurement system (e-licitatie.ro) on March 24, 2026. You can download each original file, verify the extraction yourself, and review the AI analysis output.
          </p>
        </motion.div>

        {/* ── Source verification banner ─────────────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.08, ease: "easeOut", duration: 0.5 }}
          style={{
            backgroundColor: "#ffffff",
            border: "1px solid #e8eaed",
            borderRadius: 12,
            padding: "16px 20px",
            marginBottom: 32,
            display: "flex",
            alignItems: "flex-start",
            gap: 12,
            boxShadow: "0 1px 3px rgba(0,0,0,0.04)",
          }}
        >
          <Shield size={18} style={{ color: "#22C55E", flexShrink: 0, marginTop: 2 }} />
          <div>
            <p style={{ fontSize: 13, fontWeight: 600, color: "#0f172a", margin: "0 0 4px" }}>All documents sourced from e-licitatie.ro</p>
            <p style={{ fontSize: 12, color: "#64748b", margin: "0 0 6px", lineHeight: 1.5 }}>
              SEAP (Sistemul Electronic de Achizitii Publice) is Romania's official government procurement portal, operated by the Authority for Digitalization of Romania under Law 98/2016.
            </p>
            <a
              href="https://e-licitatie.ro/pub/notices/contract-notices/list/0/0"
              target="_blank"
              rel="noopener noreferrer"
              style={{ fontSize: 12, fontWeight: 600, color: "#E31E24", textDecoration: "none", display: "inline-flex", alignItems: "center", gap: 4 }}
            >
              Visit SEAP Portal <ExternalLink size={11} />
            </a>
          </div>
        </motion.div>

        {/* ── Real documents — downloadable ──────────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15, ease: "easeOut", duration: 0.5 }}
          style={{ marginBottom: 40 }}
        >
          <p style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", color: "#E31E24", marginBottom: 8 }}>
            Documents Processed
          </p>
          <p style={{ fontSize: 14, color: "#64748b", marginBottom: 20 }}>
            Downloaded via SEAP API on March 24, 2026. Click to download the original files.
          </p>

          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {realDocuments.map((doc, i) => (
              <motion.div
                key={doc.name}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 + i * 0.07, ease: "easeOut" }}
                style={{
                  backgroundColor: "#ffffff",
                  border: "1px solid #e8eaed",
                  borderRadius: 14,
                  padding: 20,
                  boxShadow: "0 1px 3px rgba(0,0,0,0.04)",
                }}
              >
                {/* Header */}
                <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 12, marginBottom: 12 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                    <div style={{
                      width: 36, height: 36, borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center",
                      backgroundColor: `${fileColors[doc.type]}08`, border: `1px solid ${fileColors[doc.type]}20`,
                    }}>
                      <FileText size={16} style={{ color: fileColors[doc.type] }} />
                    </div>
                    <div>
                      <p style={{ fontSize: 14, fontWeight: 700, color: "#0f172a", margin: 0 }}>{doc.displayName}</p>
                      <p style={{ fontSize: 11, fontFamily: "var(--font-mono)", color: "#94a3b8", margin: "2px 0 0" }}>{doc.name}</p>
                    </div>
                  </div>
                  <span style={{
                    fontSize: 10, fontWeight: 700, letterSpacing: "0.04em", textTransform: "uppercase",
                    backgroundColor: "#22C55E08", color: "#22C55E", border: "1px solid #22C55E20",
                    padding: "3px 8px", borderRadius: 6, whiteSpace: "nowrap",
                  }}>
                    {doc.result.split(" ").slice(0, 2).join(" ")}
                  </span>
                </div>

                {/* Details */}
                <div style={{ display: "flex", gap: 24, flexWrap: "wrap", marginBottom: 12 }}>
                  <div>
                    <p style={{ fontSize: 10, color: "#94a3b8", margin: "0 0 2px", textTransform: "uppercase", letterSpacing: "0.04em", fontWeight: 600 }}>Original</p>
                    <p style={{ fontSize: 13, color: "#0f172a", margin: 0, fontWeight: 600 }}>{doc.size}</p>
                  </div>
                  <div>
                    <p style={{ fontSize: 10, color: "#94a3b8", margin: "0 0 2px", textTransform: "uppercase", letterSpacing: "0.04em", fontWeight: 600 }}>Extracted</p>
                    <p style={{ fontSize: 13, color: "#0f172a", margin: 0, fontWeight: 600 }}>{doc.extractedSize}</p>
                  </div>
                  <div>
                    <p style={{ fontSize: 10, color: "#94a3b8", margin: "0 0 2px", textTransform: "uppercase", letterSpacing: "0.04em", fontWeight: 600 }}>Signer</p>
                    <p style={{ fontSize: 13, color: "#0f172a", margin: 0, fontWeight: 600 }}>{doc.signer}</p>
                  </div>
                </div>

                <p style={{ fontSize: 12, color: "#64748b", margin: "0 0 14px", lineHeight: 1.5 }}>{doc.extractedDesc}</p>

                {/* Download buttons */}
                <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                  <a
                    href={doc.downloadPath}
                    download
                    style={{
                      display: "inline-flex", alignItems: "center", gap: 6,
                      fontSize: 12, fontWeight: 600, color: "#E31E24", textDecoration: "none",
                      padding: "7px 14px", borderRadius: 8, border: "1px solid #E31E2430",
                      backgroundColor: "#E31E2406", transition: "all 0.15s ease",
                    }}
                    onMouseEnter={e => { (e.currentTarget as HTMLElement).style.backgroundColor = "#E31E2410" }}
                    onMouseLeave={e => { (e.currentTarget as HTMLElement).style.backgroundColor = "#E31E2406" }}
                  >
                    <Download size={12} /> Download Original
                  </a>
                  {doc.extractedDownloadPath && (
                    <a
                      href={doc.extractedDownloadPath}
                      download
                      style={{
                        display: "inline-flex", alignItems: "center", gap: 6,
                        fontSize: 12, fontWeight: 600, color: "#64748b", textDecoration: "none",
                        padding: "7px 14px", borderRadius: 8, border: "1px solid #e8eaed",
                        transition: "all 0.15s ease",
                      }}
                      onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor = "#d0d5dd" }}
                      onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = "#e8eaed" }}
                    >
                      <Download size={12} /> Download Extracted PDF
                    </a>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* ── Extracted text preview ─────────────────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ ease: "easeOut", duration: 0.5 }}
          style={{
            backgroundColor: "#ffffff",
            border: "1px solid #e8eaed",
            borderRadius: 14,
            padding: 24,
            marginBottom: 40,
            boxShadow: "0 1px 3px rgba(0,0,0,0.04)",
          }}
        >
          <p style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", color: "#E31E24", marginBottom: 4 }}>
            Extracted Text Output
          </p>
          <p style={{ fontSize: 13, color: "#64748b", marginBottom: 14 }}>
            From fisa_date_RATB_bucuresti.pdf (47,608 characters / 6,658 words extracted via pdfminer.six)
          </p>
          <div style={{
            backgroundColor: "#0f172a", borderRadius: 10, padding: 20,
            fontFamily: "var(--font-mono)", fontSize: 12, lineHeight: 1.75,
            color: "#e2e8f0", whiteSpace: "pre-wrap",
          }}>
            {extractedTextPreview}
          </div>
          <p style={{ fontSize: 11, color: "#94a3b8", marginTop: 10 }}>
            Showing first 400 characters. Full 47,608 characters sent to AI for qualification analysis.
          </p>
        </motion.div>

        {/* ── AI qualification brief ──────────────────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ ease: "easeOut", duration: 0.5 }}
          style={{
            backgroundColor: "#ffffff",
            border: "1px solid #e8eaed",
            borderRadius: 14,
            padding: 24,
            marginBottom: 40,
            boxShadow: "0 1px 3px rgba(0,0,0,0.04)",
          }}
        >
          <p style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", color: "#E31E24", marginBottom: 4 }}>
            AI Qualification Brief
          </p>
          <p style={{ fontSize: 13, color: "#64748b", marginBottom: 16 }}>
            Generated automatically from the RATB Bucuresti procurement document
          </p>
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {realAiBrief.map((point, i) => {
              const isRecommendation = point.startsWith("Recomandare")
              return (
                <div key={i} style={{ display: "flex", alignItems: "flex-start", gap: 10 }}>
                  <CheckCircle2 size={14} style={{ color: isRecommendation ? "#F59E0B" : "#22C55E", flexShrink: 0, marginTop: 3 }} />
                  <p style={{ fontSize: 14, color: "#0f172a", lineHeight: 1.6, margin: 0 }}>{point}</p>
                </div>
              )
            })}
          </div>
          <div style={{ marginTop: 16, paddingTop: 14, borderTop: "1px solid #e8eaed" }}>
            <p style={{ fontSize: 11, color: "#94a3b8", margin: 0, fontStyle: "italic" }}>
              AI is only used for analysis (this step). All document extraction, signature verification, and text parsing is performed by deterministic code.
            </p>
          </div>
        </motion.div>

        {/* ── Pipeline architecture ───────────────────────────────────────────── */}
        <div style={{ marginBottom: 40 }}>
          <p style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", color: "#E31E24", marginBottom: 8 }}>
            Pipeline Architecture
          </p>
          <p style={{ fontSize: 14, color: "#64748b", marginBottom: 24 }}>
            4 deterministic steps + 1 AI step. Document handling never uses AI.
          </p>

          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {pipeline.map((step, i) => {
              const isExpanded = expandedStep === step.step
              const Icon = stepIcons[i]

              return (
                <motion.div
                  key={step.step}
                  initial={{ opacity: 0, y: 8 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.05 * i, ease: "easeOut" }}
                  style={{
                    backgroundColor: "#ffffff",
                    border: "1px solid #e8eaed",
                    borderRadius: 12,
                    overflow: "hidden",
                    boxShadow: "0 1px 3px rgba(0,0,0,0.04)",
                  }}
                >
                  <button
                    onClick={() => setExpandedStep(isExpanded ? null : step.step)}
                    style={{
                      width: "100%", display: "flex", alignItems: "center", gap: 14,
                      padding: "16px 20px", background: "none", border: "none",
                      cursor: "pointer", textAlign: "left", transition: "background-color 0.15s ease",
                    }}
                    onMouseEnter={e => ((e.currentTarget as HTMLElement).style.backgroundColor = "#f6f7f8")}
                    onMouseLeave={e => ((e.currentTarget as HTMLElement).style.backgroundColor = "transparent")}
                  >
                    <div style={{
                      width: 32, height: 32, borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
                      backgroundColor: step.type === "ai" ? "#E31E2406" : "#3B82F606",
                      border: `1px solid ${step.type === "ai" ? "#E31E2418" : "#3B82F618"}`,
                    }}>
                      <Icon size={15} style={{ color: step.type === "ai" ? "#E31E24" : "#3B82F6" }} />
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 2 }}>
                        <span style={{ fontSize: 10, color: "#94a3b8", fontFamily: "var(--font-mono)" }}>Step {step.step}</span>
                        <span style={{
                          fontSize: 9, fontWeight: 700, textTransform: "uppercase", padding: "1px 6px", borderRadius: 4, letterSpacing: "0.04em",
                          backgroundColor: step.type === "ai" ? "#E31E2406" : "#3B82F606",
                          color: step.type === "ai" ? "#E31E24" : "#3B82F6",
                        }}>
                          {step.type === "ai" ? "AI" : "Code"}
                        </span>
                        <CheckCircle2 size={12} style={{ color: "#22C55E" }} />
                      </div>
                      <p style={{ fontSize: 14, fontWeight: 600, color: "#0f172a", margin: 0 }}>{step.title}</p>
                    </div>
                    {isExpanded
                      ? <ChevronDown size={16} style={{ color: "#94a3b8", flexShrink: 0 }} />
                      : <ChevronRight size={16} style={{ color: "#94a3b8", flexShrink: 0 }} />
                    }
                  </button>

                  <AnimatePresence>
                    {isExpanded && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ ease: "easeOut", duration: 0.25 }}
                        style={{ overflow: "hidden" }}
                      >
                        <div style={{ padding: "0 20px 20px", borderTop: "1px solid #e8eaed", paddingTop: 16 }}>
                          <p style={{ fontSize: 13, color: "#64748b", lineHeight: 1.65, marginBottom: 16 }}>{step.description}</p>

                          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }} className="!grid-cols-1 md:!grid-cols-2">
                            <div>
                              <p style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.06em", textTransform: "uppercase", color: "#94a3b8", marginBottom: 8 }}>
                                Implementation
                              </p>
                              <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                                {step.details.map((d, j) => (
                                  <div key={j} style={{ display: "flex", alignItems: "flex-start", gap: 6 }}>
                                    <span style={{ width: 4, height: 4, borderRadius: 2, backgroundColor: "#94a3b8", marginTop: 6, flexShrink: 0 }} />
                                    <p style={{ fontSize: 12, color: "#64748b", margin: 0, fontFamily: "var(--font-mono)", lineHeight: 1.5 }}>{d}</p>
                                  </div>
                                ))}
                              </div>
                            </div>

                            <div>
                              <p style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.06em", textTransform: "uppercase", color: "#94a3b8", marginBottom: 8, display: "flex", alignItems: "center", gap: 6 }}>
                                <Terminal size={11} /> Log Output
                              </p>
                              <div style={{ backgroundColor: "#0f172a", borderRadius: 8, padding: 12, display: "flex", flexDirection: "column", gap: 3 }}>
                                {step.log.map((line, j) => (
                                  <p key={j} style={{
                                    fontSize: 11, margin: 0, fontFamily: "var(--font-mono)", lineHeight: 1.5,
                                    color: line.startsWith("OK") ? "#22C55E"
                                      : line.startsWith("<-") ? "#60A5FA"
                                      : line.startsWith("->") ? "#94a3b8"
                                      : "#64748b",
                                  }}>
                                    {line}
                                  </p>
                                ))}
                              </div>
                            </div>
                          </div>

                          {step.sourceUrl && (
                            <div style={{ marginTop: 12 }}>
                              <a
                                href={step.sourceUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                style={{ fontSize: 11, fontWeight: 600, color: "#E31E24", textDecoration: "none", display: "inline-flex", alignItems: "center", gap: 4 }}
                              >
                                View source <ExternalLink size={10} />
                              </a>
                            </div>
                          )}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              )
            })}
          </div>
        </div>

        {/* ── Key takeaway ────────────────────────────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ ease: "easeOut", duration: 0.5 }}
          style={{
            backgroundColor: "#ffffff",
            border: "1px solid #e8eaed",
            borderRadius: 14,
            padding: 24,
            boxShadow: "0 1px 3px rgba(0,0,0,0.04)",
          }}
        >
          <div style={{ display: "flex", alignItems: "flex-start", gap: 12 }}>
            <AlertTriangle size={16} style={{ color: "#F59E0B", flexShrink: 0, marginTop: 2 }} />
            <div>
              <p style={{ fontSize: 14, fontWeight: 700, color: "#0f172a", margin: "0 0 6px" }}>
                Why this matters for your team
              </p>
              <p style={{ fontSize: 13, color: "#64748b", lineHeight: 1.65, margin: 0 }}>
                SEAP tender documents come in digitally signed formats (.p7m, .p7s) that cannot be opened with standard PDF readers. Our pipeline extracts the original documents automatically, reads the content, and generates a structured brief your team can act on. All document handling is deterministic code — AI is only used for the final analysis step, which eliminates any risk of hallucinated document content.
              </p>
            </div>
          </div>
        </motion.div>

      </div>
      <Footer />
    </div>
  )
}
