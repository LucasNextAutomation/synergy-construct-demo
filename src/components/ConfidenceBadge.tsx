'use client';

interface ConfidenceBadgeProps {
  confidence: number;
}

export default function ConfidenceBadge({ confidence }: ConfidenceBadgeProps) {
  let color: string;
  let bg: string;
  let label: string;

  if (confidence > 90) {
    color = '#22C55E';
    bg = '#22C55E18';
    label = 'HIGH';
  } else if (confidence >= 70) {
    color = '#F59E0B';
    bg = '#F59E0B18';
    label = 'REVIEW';
  } else {
    color = '#EF4444';
    bg = '#EF444418';
    label = 'LOW';
  }

  return (
    <span
      style={{ color, backgroundColor: bg, borderColor: `${color}30` }}
      className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border font-mono"
    >
      <span
        className="w-1.5 h-1.5 rounded-full"
        style={{ backgroundColor: color }}
      />
      {confidence}% {label}
    </span>
  );
}
