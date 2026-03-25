"use client"

import { useState, useEffect, useCallback } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
  FileSearch, Clock, TrendingUp, Building2,
  RefreshCw, ChevronDown, ChevronUp, Wifi,
} from "lucide-react"
import Navbar from "@/components/Navbar"
import Footer from "@/components/Footer"

const FEED_URL = "https://nextautomations.us/seap-feed.json"

interface SeapTender {
  noticeNo: string
  title: string
  authority: string
  valueRon: number | null
  cpvCode: string
  cpvName: string
  type: string
  procedure: string
  state: string
  deadline: string
  published: string
  hasLots: boolean
}

interface FeedData {
  lastSync: string
  totalInSystem: number
  totalFetched: number
  constructionCount: number
  construction: SeapTender[]
}

function fmtRON(v: number | null): string {
  if (!v) return "N/A"
  if (v >= 1_000_000) return `${(v / 1_000_000).toFixed(1)}M RON`
  if (v >= 1_000) return `${(v / 1_000).toFixed(0)}K RON`
  return `${v.toLocaleString()} RON`
}

function timeAgo(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime()
  const mins = Math.floor(diff / 60000)
  if (mins < 1) return "just now"
  if (mins < 60) return `${mins}m ago`
  const hrs = Math.floor(mins / 60)
  if (hrs < 24) return `${hrs}h ago`
  return `${Math.floor(hrs / 24)}d ago`
}

function fmtDate(iso: string): string {
  if (!iso) return "N/A"
  return new Date(iso).toLocaleDateString("ro-RO", { day: "numeric", month: "short", year: "numeric" })
}

export default function TendersPage() {
  const [feed, setFeed] = useState<FeedData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [expandedId, setExpandedId] = useState<string | null>(null)
  const [sortBy, setSortBy] = useState<"value" | "date">("date")
  const [refreshing, setRefreshing] = useState(false)

  const fetchFeed = useCallback(async (showRefresh = false) => {
    if (showRefresh) setRefreshing(true)
    try {
      const res = await fetch(FEED_URL, { cache: "no-store" })
      if (!res.ok) throw new Error(`HTTP ${res.status}`)
      const data: FeedData = await res.json()
      setFeed(data)
      setError(null)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch")
    } finally {
      setLoading(false)
      setRefreshing(false)
    }
  }, [])

  useEffect(() => { fetchFeed() }, [fetchFeed])

  const sorted = feed?.construction
    ? [...feed.construction].sort((a, b) => {
        if (sortBy === "value") return (b.valueRon ?? 0) - (a.valueRon ?? 0)
        return new Date(b.published || "").getTime() - new Date(a.published || "").getTime()
      })
    : []

  const totalValue = feed?.construction.reduce((s, t) => s + (t.valueRon ?? 0), 0) ?? 0

  return (
    <div style={{ minHeight: "100vh", backgroundColor: "#f6f7f8" }}>
      <Navbar />

      <div style={{ maxWidth: 960, margin: "0 auto", padding: "48px 40px 80px" }}>

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ ease: "easeOut", duration: 0.5 }}
          style={{ marginBottom: 32 }}
        >
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 16, marginBottom: 16 }}>
            <div>
              <p style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", color: "#E31E24", marginBottom: 8 }}>
                Live SEAP Monitor
              </p>
              <h1 style={{ fontSize: "clamp(24px, 4vw, 36px)", fontWeight: 800, color: "#0f172a", letterSpacing: "-0.03em", margin: 0 }}>
                Construction Tenders
              </h1>
            </div>

            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                <div style={{ width: 7, height: 7, borderRadius: "50%", backgroundColor: feed ? "#22C55E" : "#94a3b8", boxShadow: feed ? "0 0 6px #22C55E80" : "none" }} />
                <span style={{ fontSize: 12, color: "#64748b" }}>
                  {feed ? `Synced ${timeAgo(feed.lastSync)}` : "Connecting..."}
                </span>
              </div>
              <button
                onClick={() => fetchFeed(true)}
                disabled={refreshing}
                style={{
                  display: "flex", alignItems: "center", gap: 6, padding: "6px 12px",
                  borderRadius: 8, border: "1px solid #e8eaed", backgroundColor: "#ffffff",
                  cursor: "pointer", fontSize: 12, fontWeight: 600, color: "#64748b",
                }}
              >
                <RefreshCw size={13} style={{ animation: refreshing ? "spin 1s linear infinite" : "none" }} />
                Refresh
              </button>
            </div>
          </div>

          <p style={{ fontSize: 15, color: "#64748b", lineHeight: 1.6, maxWidth: 600 }}>
            Real-time construction tenders from e-licitatie.ro. Data refreshes every hour from the SEAP public API.
          </p>
        </motion.div>

        {/* Stats */}
        {feed && (
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, ease: "easeOut" }}
            style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 12, marginBottom: 32 }}
            className="!grid-cols-2 md:!grid-cols-4"
          >
            {[
              { label: "In SEAP System", value: feed.totalInSystem.toLocaleString(), icon: Wifi, color: "#3B82F6" },
              { label: "Construction", value: String(feed.constructionCount), icon: Building2, color: "#E31E24" },
              { label: "Total Value", value: fmtRON(totalValue), icon: TrendingUp, color: "#22C55E" },
              { label: "Last Sync", value: timeAgo(feed.lastSync), icon: Clock, color: "#F59E0B" },
            ].map(s => (
              <div key={s.label} style={{
                backgroundColor: "#ffffff", border: "1px solid #e8eaed", borderRadius: 12,
                padding: 16, boxShadow: "0 1px 3px rgba(0,0,0,0.04)",
              }}>
                <s.icon size={16} style={{ color: s.color, marginBottom: 8 }} />
                <p style={{ fontSize: 20, fontWeight: 800, color: "#0f172a", letterSpacing: "-0.02em", margin: "0 0 2px" }}>{s.value}</p>
                <p style={{ fontSize: 11, color: "#94a3b8", margin: 0 }}>{s.label}</p>
              </div>
            ))}
          </motion.div>
        )}

        {/* Sort bar */}
        {sorted.length > 0 && (
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
            <p style={{ fontSize: 13, color: "#64748b", margin: 0 }}>
              {sorted.length} construction tenders (CPV 45*)
            </p>
            <div style={{ display: "flex", gap: 4 }}>
              {(["date", "value"] as const).map(s => (
                <button
                  key={s}
                  onClick={() => setSortBy(s)}
                  style={{
                    padding: "5px 12px", borderRadius: 6, border: "1px solid #e8eaed",
                    backgroundColor: sortBy === s ? "#0f172a" : "#ffffff",
                    color: sortBy === s ? "#ffffff" : "#64748b",
                    fontSize: 12, fontWeight: 600, cursor: "pointer",
                  }}
                >
                  {s === "date" ? "Latest" : "Highest Value"}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Loading */}
        {loading && (
          <div style={{ textAlign: "center", padding: 60 }}>
            <RefreshCw size={24} style={{ color: "#94a3b8", animation: "spin 1s linear infinite", margin: "0 auto 12px", display: "block" }} />
            <p style={{ fontSize: 14, color: "#94a3b8" }}>Connecting to SEAP...</p>
          </div>
        )}

        {/* Error */}
        {error && !loading && (
          <div style={{ textAlign: "center", padding: 40, backgroundColor: "#ffffff", borderRadius: 12, border: "1px solid #e8eaed" }}>
            <p style={{ fontSize: 14, color: "#EF4444", marginBottom: 8 }}>Could not reach SEAP feed</p>
            <p style={{ fontSize: 12, color: "#94a3b8" }}>{error}</p>
          </div>
        )}

        {/* Tender list */}
        {!loading && sorted.length > 0 && (
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {sorted.map((tender, i) => {
              const isExpanded = expandedId === tender.noticeNo
              return (
                <motion.div
                  key={tender.noticeNo}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.03 * Math.min(i, 15), ease: "easeOut" }}
                  style={{
                    backgroundColor: "#ffffff", border: "1px solid #e8eaed", borderRadius: 12,
                    overflow: "hidden", boxShadow: "0 1px 3px rgba(0,0,0,0.04)",
                    transition: "box-shadow 0.2s ease",
                  }}
                  onMouseEnter={e => ((e.currentTarget as HTMLElement).style.boxShadow = "0 4px 16px rgba(0,0,0,0.07)")}
                  onMouseLeave={e => ((e.currentTarget as HTMLElement).style.boxShadow = "0 1px 3px rgba(0,0,0,0.04)")}
                >
                  <button
                    onClick={() => setExpandedId(isExpanded ? null : tender.noticeNo)}
                    style={{
                      width: "100%", display: "flex", alignItems: "center", gap: 16,
                      padding: "16px 20px", background: "none", border: "none",
                      cursor: "pointer", textAlign: "left",
                    }}
                  >
                    <div style={{ minWidth: 90, textAlign: "right", flexShrink: 0 }}>
                      <p style={{ fontSize: 15, fontWeight: 800, color: "#0f172a", letterSpacing: "-0.02em", margin: 0 }}>
                        {fmtRON(tender.valueRon)}
                      </p>
                    </div>

                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 3 }}>
                        <span style={{ fontSize: 11, fontFamily: "var(--font-mono)", color: "#94a3b8" }}>{tender.noticeNo}</span>
                        <span style={{
                          fontSize: 9, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.04em",
                          padding: "1px 6px", borderRadius: 4,
                          backgroundColor: tender.state === "Atribuita" ? "#22C55E08" : tender.state === "Anulata" ? "#EF444408" : "#3B82F608",
                          color: tender.state === "Atribuita" ? "#22C55E" : tender.state === "Anulata" ? "#EF4444" : "#3B82F6",
                        }}>
                          {tender.state || "Active"}
                        </span>
                      </div>
                      <p style={{
                        fontSize: 14, fontWeight: 600, color: "#0f172a", margin: 0,
                        overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap",
                      }}>
                        {tender.title}
                      </p>
                    </div>

                    {isExpanded
                      ? <ChevronUp size={16} style={{ color: "#94a3b8", flexShrink: 0 }} />
                      : <ChevronDown size={16} style={{ color: "#94a3b8", flexShrink: 0 }} />
                    }
                  </button>

                  <AnimatePresence>
                    {isExpanded && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ ease: "easeOut", duration: 0.2 }}
                        style={{ overflow: "hidden" }}
                      >
                        <div style={{ padding: "0 20px 20px", borderTop: "1px solid #e8eaed", paddingTop: 16 }}>
                          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 12 }} className="!grid-cols-1 md:!grid-cols-2">
                            <div>
                              <p style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.06em", textTransform: "uppercase", color: "#94a3b8", marginBottom: 6 }}>Authority</p>
                              <p style={{ fontSize: 13, color: "#0f172a", margin: 0, lineHeight: 1.5 }}>{tender.authority}</p>
                            </div>
                            <div>
                              <p style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.06em", textTransform: "uppercase", color: "#94a3b8", marginBottom: 6 }}>CPV Code</p>
                              <p style={{ fontSize: 13, color: "#0f172a", margin: 0, fontFamily: "var(--font-mono)" }}>{tender.cpvCode}</p>
                              <p style={{ fontSize: 12, color: "#64748b", margin: "2px 0 0" }}>{tender.cpvName}</p>
                            </div>
                          </div>
                          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 16 }} className="!grid-cols-1 md:!grid-cols-3">
                            <div>
                              <p style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.06em", textTransform: "uppercase", color: "#94a3b8", marginBottom: 6 }}>Procedure</p>
                              <p style={{ fontSize: 13, color: "#0f172a", margin: 0 }}>{tender.procedure || "N/A"}</p>
                            </div>
                            <div>
                              <p style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.06em", textTransform: "uppercase", color: "#94a3b8", marginBottom: 6 }}>Published</p>
                              <p style={{ fontSize: 13, color: "#0f172a", margin: 0 }}>{fmtDate(tender.published)}</p>
                            </div>
                            <div>
                              <p style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.06em", textTransform: "uppercase", color: "#94a3b8", marginBottom: 6 }}>Deadline</p>
                              <p style={{ fontSize: 13, color: "#0f172a", margin: 0 }}>{fmtDate(tender.deadline)}</p>
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
        )}

        <div style={{ marginTop: 32, textAlign: "center" }}>
          <p style={{ fontSize: 11, color: "#94a3b8" }}>
            Data sourced from e-licitatie.ro public API. Refreshed hourly. Construction tenders filtered by CPV code 45*.
          </p>
        </div>
      </div>

      <Footer />
      <style>{`@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}</style>
    </div>
  )
}
