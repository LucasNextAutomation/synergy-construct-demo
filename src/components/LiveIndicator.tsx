"use client"

export default function LiveIndicator({ compact = false }: { compact?: boolean }) {
  if (compact) {
    return (
      <span className="w-1.5 h-1.5 rounded-full bg-[#22C55E] animate-pulse-dot flex-shrink-0" />
    )
  }

  return (
    <span className="flex items-center gap-1.5">
      <span className="w-1.5 h-1.5 rounded-full bg-[#22C55E] animate-pulse-dot flex-shrink-0" />
      <span className="text-[11px] text-[#7A8499]">Connected to SEAP</span>
    </span>
  )
}
