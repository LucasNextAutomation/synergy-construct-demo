"use client"

import Link from "next/link"
import Image from "next/image"
import { motion } from "framer-motion"
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  Users,
  CalendarCheck,
  MessageCircle,
  BookOpen,
  Download,
  CreditCard,
  FileText,
} from "lucide-react"

// ─── Timeline phases ──────────────────────────────────────────────────────────
const phases = [
  {
    number: "01",
    weeks: "Weeks 1-2",
    title: "Discovery and Setup",
    build: [
      "Kickoff meeting with Virgil (tenders) and Osman (investments)",
      "Requirements workshop — scoping tender filters and deal criteria",
      "SEAP API integration setup and authentication",
      "Data source configuration and access provisioning",
    ],
    deliver: [
      "Technical requirements document",
      "Configured SEAP API connection",
      "Test data samples from all sources",
    ],
  },
  {
    number: "02",
    weeks: "Weeks 3-4",
    title: "SEAP Tender Monitor",
    build: [
      "Document processing pipeline (.p7m / .p7s / ZIP extraction)",
      "OCR engine with Romanian language support (Tesseract)",
      "AI brief generation per tender (Claude AI)",
      "Alert system — email and WhatsApp notifications",
    ],
    deliver: [
      "Working tender monitor with live SEAP data",
      "First real AI-generated project briefs",
      "Demo and walkthrough with Virgil's team",
    ],
  },
  {
    number: "03",
    weeks: "Weeks 5-6",
    title: "Investment Finder",
    build: [
      "5-source scraping engine: UNPIR, ANABI, executari.com, imobiliare.ro, storia.ro",
      "AI deal scoring and classification pipeline",
      "Market comparison engine for below-market detection",
      "Deal report generation with investment summary",
    ],
    deliver: [
      "Working investment finder with live deal data",
      "First batch of scored deal reports",
      "Demo and walkthrough with Osman",
    ],
  },
  {
    number: "04",
    weeks: "Weeks 7-8",
    title: "Integration and Launch",
    build: [
      "Unified dashboard connecting both modules",
      "ROI tracking and reporting interface",
      "Team training sessions for Virgil and Osman",
      "SAP export preparation and data mapping",
    ],
    deliver: [
      "Production-ready platform, fully tested",
      "Training materials and video walkthroughs",
      "Complete handoff documentation and source code",
    ],
  },
]

// ─── Partnership cards ────────────────────────────────────────────────────────
const partnerCards = [
  {
    icon: Users,
    title: "Dedicated Point of Contact",
    description: "One developer owns your project end-to-end. No handoffs, no confusion.",
  },
  {
    icon: CalendarCheck,
    title: "Weekly Progress Updates",
    description: "Every Friday, a written update with what was built, what is next, and any blockers.",
  },
  {
    icon: MessageCircle,
    title: "Direct Developer Access",
    description: "Slack or WhatsApp access to the person building your systems, not a project manager.",
  },
  {
    icon: BookOpen,
    title: "Full Source Code Ownership",
    description: "You own every line of code. Hosted where you want. No vendor lock-in.",
  },
]

// ─── Managed vs Handoff ───────────────────────────────────────────────────────
const managedFeatures = [
  "Platform monitored 24/7",
  "AI model upgrades included",
  "New data sources on request",
  "Priority support channel",
  "Monthly performance reports",
]

const handoffFeatures = [
  "Full source code delivered",
  "Self-hosted on your servers",
  "Deployment documentation",
  "Training session included",
]

// ─── CardWrapper ──────────────────────────────────────────────────────────────
function CardWrapper({
  children,
  style,
}: {
  children: React.ReactNode
  style?: React.CSSProperties
}) {
  return (
    <div
      style={{
        backgroundColor: "#ffffff",
        border: "1px solid #e8eaed",
        borderRadius: 16,
        boxShadow: "0 1px 3px rgba(0,0,0,0.04)",
        transition: "all 0.2s ease",
        ...style,
      }}
      onMouseEnter={e => {
        const el = e.currentTarget as HTMLElement
        el.style.boxShadow = "0 4px 20px rgba(0,0,0,0.08)"
        el.style.transform = "translateY(-2px)"
        el.style.borderColor = "#d0d5dd"
      }}
      onMouseLeave={e => {
        const el = e.currentTarget as HTMLElement
        el.style.boxShadow = "0 1px 3px rgba(0,0,0,0.04)"
        el.style.transform = "translateY(0)"
        el.style.borderColor = "#e8eaed"
      }}
    >
      {children}
    </div>
  )
}

// ─── Page ─────────────────────────────────────────────────────────────────────
export default function CollaborationPage() {
  return (
    <div style={{ backgroundColor: "#ffffff", minHeight: "100vh" }}>

      {/* ── Section 1: Hero ─────────────────────────────────────────────────── */}
      <section
        style={{
          backgroundColor: "#ffffff",
          paddingTop: 80,
          paddingBottom: 80,
          paddingLeft: 40,
          paddingRight: 40,
        }}
      >
        <div style={{ maxWidth: 960, margin: "0 auto" }}>
          {/* Back link */}
          <motion.div
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
            style={{ marginBottom: 40 }}
          >
            <Link
              href="/"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 6,
                fontSize: 14,
                fontWeight: 500,
                color: "#64748b",
                textDecoration: "none",
                transition: "color 0.15s ease",
              }}
              onMouseEnter={e =>
                ((e.currentTarget as HTMLElement).style.color = "#0f172a")
              }
              onMouseLeave={e =>
                ((e.currentTarget as HTMLElement).style.color = "#64748b")
              }
            >
              <ArrowLeft size={14} /> Back to Overview
            </Link>
          </motion.div>

          {/* Logo */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.05, ease: "easeOut" }}
            style={{ marginBottom: 24 }}
          >
            <Image
              src="/synergy-logo.png"
              alt="Synergy Construct"
              width={160}
              height={40}
              style={{ height: 36, width: "auto", objectFit: "contain" }}
              priority
            />
          </motion.div>

          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.1, ease: "easeOut" }}
            style={{ marginBottom: 20 }}
          >
            <span
              style={{
                display: "inline-block",
                fontSize: 12,
                fontWeight: 600,
                color: "#E31E24",
                backgroundColor: "#E31E2410",
                border: "1px solid #E31E2430",
                borderRadius: 20,
                padding: "4px 14px",
                letterSpacing: "0.04em",
              }}
            >
              Partnership
            </span>
          </motion.div>

          {/* Headline */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.15, ease: "easeOut" }}
            style={{
              fontSize: "clamp(36px, 5vw, 52px)",
              fontWeight: 800,
              color: "#0f172a",
              letterSpacing: "-0.03em",
              lineHeight: 1.1,
              margin: "0 0 20px",
              maxWidth: 640,
            }}
          >
            How We Work Together
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2, ease: "easeOut" }}
            style={{
              fontSize: 18,
              color: "#64748b",
              lineHeight: 1.65,
              maxWidth: 560,
              margin: 0,
            }}
          >
            An 8-week phased engagement structured to de-risk delivery, keep you informed at
            every step, and put working software in your hands as early as week 4.
          </motion.p>
        </div>
      </section>

      {/* ── Section 2: Timeline ──────────────────────────────────────────────── */}
      <section
        style={{
          backgroundColor: "#f6f7f8",
          paddingTop: 100,
          paddingBottom: 100,
          paddingLeft: 40,
          paddingRight: 40,
        }}
      >
        <div style={{ maxWidth: 960, margin: "0 auto" }}>
          {/* Section header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            style={{ marginBottom: 60 }}
          >
            <p
              style={{
                fontSize: 11,
                fontWeight: 700,
                letterSpacing: "0.08em",
                textTransform: "uppercase",
                color: "#E31E24",
                marginBottom: 12,
              }}
            >
              Timeline
            </p>
            <h2
              style={{
                fontSize: "clamp(24px, 3.5vw, 36px)",
                fontWeight: 800,
                color: "#0f172a",
                letterSpacing: "-0.03em",
                margin: 0,
              }}
            >
              8-Week Build Plan
            </h2>
          </motion.div>

          {/* Timeline */}
          <div style={{ position: "relative" }}>
            {/* Spine line */}
            <div
              style={{
                position: "absolute",
                left: 20,
                top: 0,
                bottom: 0,
                width: 2,
                backgroundColor: "#e8eaed",
              }}
            />

            <div style={{ display: "flex", flexDirection: "column", gap: 32 }}>
              {phases.map((phase, i) => (
                <motion.div
                  key={phase.number}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: i * 0.1, ease: "easeOut" }}
                  style={{
                    display: "flex",
                    gap: 32,
                    paddingLeft: 60,
                    position: "relative",
                  }}
                >
                  {/* Dot on spine */}
                  <div
                    style={{
                      position: "absolute",
                      left: 10,
                      top: 24,
                      width: 22,
                      height: 22,
                      borderRadius: "50%",
                      backgroundColor: "#E31E24",
                      border: "3px solid #f6f7f8",
                      boxShadow: "0 0 0 4px rgba(227,30,36,0.15)",
                    }}
                  />

                  {/* Card */}
                  <div
                    style={{
                      flex: 1,
                      backgroundColor: "#ffffff",
                      border: "1px solid #e8eaed",
                      borderLeft: "3px solid #E31E24",
                      borderRadius: 16,
                      padding: 28,
                      boxShadow: "0 1px 3px rgba(0,0,0,0.04)",
                    }}
                  >
                    {/* Phase header */}
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 12,
                        marginBottom: 20,
                      }}
                    >
                      <span
                        style={{
                          fontSize: 11,
                          fontWeight: 700,
                          letterSpacing: "0.08em",
                          textTransform: "uppercase",
                          color: "#E31E24",
                          backgroundColor: "#E31E2410",
                          padding: "3px 10px",
                          borderRadius: 20,
                        }}
                      >
                        Phase {phase.number}
                      </span>
                      <span
                        style={{
                          fontSize: 12,
                          color: "#94a3b8",
                          fontWeight: 500,
                        }}
                      >
                        {phase.weeks}
                      </span>
                    </div>

                    <h3
                      style={{
                        fontSize: 20,
                        fontWeight: 700,
                        color: "#0f172a",
                        letterSpacing: "-0.02em",
                        margin: "0 0 24px",
                      }}
                    >
                      {phase.title}
                    </h3>

                    {/* Build / Deliver columns */}
                    <div
                      style={{
                        display: "grid",
                        gridTemplateColumns: "1fr 1fr",
                        gap: 24,
                      }}
                      className="!grid-cols-1 md:!grid-cols-2"
                    >
                      {/* Build */}
                      <div>
                        <p
                          style={{
                            fontSize: 11,
                            fontWeight: 700,
                            letterSpacing: "0.08em",
                            textTransform: "uppercase",
                            color: "#94a3b8",
                            marginBottom: 14,
                          }}
                        >
                          Build
                        </p>
                        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                          {phase.build.map((item, j) => (
                            <div
                              key={j}
                              style={{ display: "flex", alignItems: "flex-start", gap: 10 }}
                            >
                              <div
                                style={{
                                  width: 5,
                                  height: 5,
                                  borderRadius: "50%",
                                  backgroundColor: "#E31E24",
                                  flexShrink: 0,
                                  marginTop: 7,
                                }}
                              />
                              <span
                                style={{
                                  fontSize: 14,
                                  color: "#64748b",
                                  lineHeight: 1.55,
                                }}
                              >
                                {item}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Deliver */}
                      <div>
                        <p
                          style={{
                            fontSize: 11,
                            fontWeight: 700,
                            letterSpacing: "0.08em",
                            textTransform: "uppercase",
                            color: "#94a3b8",
                            marginBottom: 14,
                          }}
                        >
                          Deliver
                        </p>
                        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                          {phase.deliver.map((item, j) => (
                            <div
                              key={j}
                              style={{ display: "flex", alignItems: "flex-start", gap: 10 }}
                            >
                              <CheckCircle2
                                size={15}
                                style={{
                                  color: "#22C55E",
                                  flexShrink: 0,
                                  marginTop: 2,
                                }}
                              />
                              <span
                                style={{
                                  fontSize: 14,
                                  color: "#0f172a",
                                  fontWeight: 500,
                                  lineHeight: 1.55,
                                }}
                              >
                                {item}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── Section 3: Partnership Grid ──────────────────────────────────────── */}
      <section
        style={{
          backgroundColor: "#ffffff",
          paddingTop: 100,
          paddingBottom: 100,
          paddingLeft: 40,
          paddingRight: 40,
        }}
      >
        <div style={{ maxWidth: 960, margin: "0 auto" }}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            style={{ textAlign: "center", marginBottom: 56 }}
          >
            <p
              style={{
                fontSize: 11,
                fontWeight: 700,
                letterSpacing: "0.08em",
                textTransform: "uppercase",
                color: "#E31E24",
                marginBottom: 12,
              }}
            >
              Partnership
            </p>
            <h2
              style={{
                fontSize: "clamp(24px, 3.5vw, 36px)",
                fontWeight: 800,
                color: "#0f172a",
                letterSpacing: "-0.03em",
                margin: 0,
              }}
            >
              How We Operate
            </h2>
          </motion.div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(4, 1fr)",
              gap: 16,
            }}
            className="!grid-cols-2 md:!grid-cols-4"
          >
            {partnerCards.map((card, i) => (
              <motion.div
                key={card.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.08, ease: "easeOut" }}
              >
                <CardWrapper style={{ padding: 24 }}>
                  <div
                    style={{
                      width: 40,
                      height: 40,
                      borderRadius: 10,
                      backgroundColor: "#E31E2410",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      marginBottom: 16,
                    }}
                  >
                    <card.icon size={18} style={{ color: "#E31E24" }} />
                  </div>
                  <h3
                    style={{
                      fontSize: 15,
                      fontWeight: 700,
                      color: "#0f172a",
                      letterSpacing: "-0.01em",
                      margin: "0 0 8px",
                    }}
                  >
                    {card.title}
                  </h3>
                  <p style={{ fontSize: 13, color: "#64748b", lineHeight: 1.6, margin: 0 }}>
                    {card.description}
                  </p>
                </CardWrapper>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Section 4: CTA ───────────────────────────────────────────────────── */}
      <section
        style={{
          backgroundColor: "#f6f7f8",
          paddingTop: 80,
          paddingBottom: 80,
          paddingLeft: 40,
          paddingRight: 40,
          textAlign: "center",
        }}
      >
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          style={{ maxWidth: 560, margin: "0 auto" }}
        >
          <p style={{ fontSize: 14, color: "#64748b", marginBottom: 20 }}>
            For full pricing, service agreement, and payment options:
          </p>
          <a
            href="https://nextautomation.us/proposals/synergy-construct"
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 8,
              fontSize: 15,
              fontWeight: 700,
              color: "#E31E24",
              textDecoration: "none",
              padding: "14px 28px",
              borderRadius: 10,
              border: "2px solid #E31E24",
              transition: "all 0.2s ease",
            }}
            onMouseEnter={e => {
              const el = e.currentTarget as HTMLElement
              el.style.backgroundColor = "#E31E24"
              el.style.color = "#ffffff"
            }}
            onMouseLeave={e => {
              const el = e.currentTarget as HTMLElement
              el.style.backgroundColor = "transparent"
              el.style.color = "#E31E24"
            }}
          >
            View Full Proposal <ArrowRight size={16} />
          </a>
        </motion.div>
      </section>
    </div>
  )
}
