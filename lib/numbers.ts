export function safeParseFloat(value: string | undefined): number {
  if (!value) return 0
  const parsed = Number.parseFloat(value)
  return isNaN(parsed) ? 0 : parsed
}

export function formatTokenAmount(amount: string | number, decimals = 2): string {
  const num = typeof amount === "string" ? safeParseFloat(amount) : amount
  return num.toFixed(decimals)
}

export function formatLargeNumber(amount: string | number): string {
  const num = typeof amount === "string" ? safeParseFloat(amount) : amount
  return num.toLocaleString()
}
