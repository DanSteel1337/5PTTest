"use client"

import { useState, useEffect } from "react"
import { useAccount, useChainId, useWatchBlocks } from "wagmi"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { getContractAddress } from "@/lib/config"

type Transaction = {
  hash: string
  timestamp: number
  from: string
  to: string
  status: "pending" | "confirmed" | "failed"
  contract: "token" | "investment" | "other"
  method?: string
}

export function TransactionHistory() {
  const { address } = useAccount()
  const chainId = useChainId()
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [mounted, setMounted] = useState(false)

  const tokenAddress = getContractAddress(chainId, "fivePillarsToken")
  const investmentAddress = getContractAddress(chainId, "investmentManager")

  useEffect(() => {
    setMounted(true)
  }, [])

  // Watch for new blocks to update transaction status
  useWatchBlocks({
    onBlock: () => {
      // Update transaction statuses
      setTransactions((prev) => prev.map((tx) => (tx.status === "pending" ? { ...tx, status: "confirmed" } : tx)))
    },
    enabled: mounted,
  })

  // Load transactions from localStorage on mount
  useEffect(() => {
    if (!address || !mounted) return

    try {
      const storedTx = localStorage.getItem(`transactions-${address}`)
      if (storedTx) {
        setTransactions(JSON.parse(storedTx))
      }
    } catch (error) {
      console.error("Failed to load transactions:", error)
    }
  }, [address, mounted])

  // Save transactions to localStorage when updated
  useEffect(() => {
    if (!address || transactions.length === 0 || !mounted) return

    try {
      localStorage.setItem(`transactions-${address}`, JSON.stringify(transactions))
    } catch (error) {
      console.error("Failed to save transactions:", error)
    }
  }, [transactions, address, mounted])

  // Add a new transaction to history
  const addTransaction = (tx: Omit<Transaction, "timestamp">) => {
    setTransactions((prev) => [
      {
        ...tx,
        timestamp: Date.now(),
      },
      ...prev.slice(0, 9), // Keep only the 10 most recent
    ])
  }

  // Expose the addTransaction function globally for hooks to use
  useEffect(() => {
    if (typeof window !== "undefined" && mounted) {
      // @ts-ignore
      window.addTransaction = addTransaction
    }

    return () => {
      if (typeof window !== "undefined") {
        // @ts-ignore
        delete window.addTransaction
      }
    }
  }, [mounted])

  if (!mounted) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Transaction History</CardTitle>
          <CardDescription>Loading...</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">Loading transaction history...</p>
        </CardContent>
      </Card>
    )
  }

  if (!address || transactions.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Transaction History</CardTitle>
          <CardDescription>Recent contract interactions will appear here</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">No transactions yet</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Transaction History</CardTitle>
        <CardDescription>Recent contract interactions</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {transactions.map((tx) => (
            <div key={tx.hash} className="flex items-center justify-between border-b pb-2">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <Badge
                    variant={
                      tx.status === "confirmed" ? "default" : tx.status === "pending" ? "outline" : "destructive"
                    }
                  >
                    {tx.status}
                  </Badge>
                  <Badge variant="secondary">{tx.contract}</Badge>
                  {tx.method && <span className="text-xs">{tx.method}</span>}
                </div>
                <a
                  href={`https://testnet.bscscan.com/tx/${tx.hash}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs text-blue-500 hover:underline"
                >
                  {tx.hash.substring(0, 10)}...{tx.hash.substring(tx.hash.length - 8)}
                </a>
              </div>
              <div className="text-right">
                <div className="text-xs text-muted-foreground">{new Date(tx.timestamp).toLocaleString()}</div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
