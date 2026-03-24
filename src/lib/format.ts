// Shared number formatting utilities

export function fmtRON(value: number): string {
  if (value >= 1_000_000) {
    return `${(value / 1_000_000).toFixed(1)}M RON`;
  }
  if (value >= 1_000) {
    return `${(value / 1_000).toFixed(0)}K RON`;
  }
  return `${value.toLocaleString()} RON`;
}

export function fmtEUR(value: number): string {
  if (value >= 1_000_000) {
    return `${(value / 1_000_000).toFixed(1)}M EUR`;
  }
  if (value >= 1_000) {
    return `${(value / 1_000).toFixed(0)}K EUR`;
  }
  return `${value.toLocaleString()} EUR`;
}

export function fmtNum(value: number, decimals = 0): string {
  return value.toLocaleString('en-US', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  });
}

export function fmtPercent(value: number): string {
  return `${value.toFixed(1)}%`;
}

export function fmtDuration(ms: number): string {
  if (ms < 1000) return `${ms}ms`;
  return `${(ms / 1000).toFixed(1)}s`;
}

export function fmtBytes(bytes: number): string {
  if (bytes >= 1_000_000) return `${(bytes / 1_000_000).toFixed(1)} MB`;
  if (bytes >= 1_000) return `${(bytes / 1_000).toFixed(1)} KB`;
  return `${bytes} bytes`;
}
