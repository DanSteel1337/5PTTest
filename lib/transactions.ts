import type { WriteContractReturnType } from "wagmi"

export interface TransactionRecord {
  hash: string
  from: string
  to: string
  status: "pending" | "confirmed" | "failed"
  contract: "token" | "investment" | "other"
  method?: string
}

export function addTransactionToHistory(
  result: WriteContractReturnType | undefined,
  from: string,
  to: string,
  contract: TransactionRecord["contract"],
  method: string,
): void {
  if (typeof window !== "undefined" && window.addTransaction && result) {
    // @ts-ignore
    window.addTransaction({
      hash: result,
      from: from || "",
      to: to || "",
      status: "pending",
      contract,
      method,
    })
  }
}

// Extend window interface
declare global {
  interface Window {
    addTransaction?: (tx: Omit<TransactionRecord, "timestamp">) => void
  }
}
