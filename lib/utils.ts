import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatAddress(address: string | undefined): string {
  if (!address) return ""
  return `${address.substring(0, 6)}...${address.substring(address.length - 4)}`
}

export function isPoolEligible(
  poolId: number,
  investmentAmount: string,
  directReferrals: number,
  directReferralsDeposit: string,
  poolCriteria: {
    id: number
    minInvestmentAmount: string
    minDirectReferralsCount: number
    minDirectReferralsDeposit: string
  }[],
): boolean {
  // Special pools 7-8 require whitelist
  if (poolId >= 7) return false

  const pool = poolCriteria.find((p) => p.id === poolId)
  if (!pool) return false

  const investmentAmountNum = Number.parseFloat(investmentAmount)
  const minInvestmentAmountNum = Number.parseFloat(pool.minInvestmentAmount)
  const directReferralsDepositNum = Number.parseFloat(directReferralsDeposit || "0")
  const minDirectReferralsDepositNum = Number.parseFloat(pool.minDirectReferralsDeposit)

  return (
    investmentAmountNum >= minInvestmentAmountNum && 
    directReferrals >= pool.minDirectReferralsCount &&
    directReferralsDepositNum >= minDirectReferralsDepositNum
  )
}

export function calculateTimeRemaining(lastDepositTimestamp: number): {
  canDeposit: boolean
  timeRemaining: string
} {
  if (!lastDepositTimestamp) {
    return { canDeposit: true, timeRemaining: "Ready" }
  }

  const now = Math.floor(Date.now() / 1000)
  const depositDelay = 60 * 60 * 4 // 4 hours in seconds
  const nextDepositTime = lastDepositTimestamp + depositDelay

  if (now >= nextDepositTime) {
    return { canDeposit: true, timeRemaining: "Ready" }
  }

  const remainingSeconds = nextDepositTime - now
  const hours = Math.floor(remainingSeconds / 3600)
  const minutes = Math.floor((remainingSeconds % 3600) / 60)

  return {
    canDeposit: false,
    timeRemaining: `${hours}h ${minutes}m remaining`,
  }
}

export function generateReferralLink(address: string | undefined): string {
  if (!address) return ""

  // Get the current URL without any query parameters
  const baseUrl =
    typeof window !== "undefined"
      ? `${window.location.protocol}//${window.location.host}${window.location.pathname}`
      : ""

  return `${baseUrl}?ref=${address}`
}

export function copyToClipboard(text: string): Promise<void> {
  return new Promise((resolve, reject) => {
    if (typeof navigator === "undefined" || !navigator.clipboard) {
      const textArea = document.createElement("textarea")
      textArea.value = text
      textArea.style.position = "fixed"
      document.body.appendChild(textArea)
      textArea.focus()
      textArea.select()

      try {
        document.execCommand("copy")
        document.body.removeChild(textArea)
        resolve()
      } catch (err) {
        document.body.removeChild(textArea)
        reject(err)
      }
    } else {
      navigator.clipboard.writeText(text).then(resolve, reject)
    }
  })
}
