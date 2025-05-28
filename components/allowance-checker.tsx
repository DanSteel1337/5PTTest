"use client"

import { useState, useEffect } from "react"
import { useAccount, useReadContract, useChainId } from "wagmi"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { FIVE_PILLARS_TOKEN_ABI } from "@/lib/abis"
import { getContractAddress } from "@/lib/config"
import { formatUnits } from "viem"
import { useFivePillarsToken } from "@/hooks/use-five-pillars-token"
import { useInvestmentManager } from "@/hooks/use-investment-manager"

export function AllowanceChecker() {
  const { address } = useAccount()
  const chainId = useChainId()
  const [spenderAddress, setSpenderAddress] = useState("")
  const [allowance, setAllowance] = useState<string | null>(null)
  const tokenContract = useFivePillarsToken()
  const investmentContract = useInvestmentManager()

  const tokenAddress = getContractAddress(chainId, "fivePillarsToken")

  const { data: allowanceData, refetch } = useReadContract({
    address: tokenAddress,
    abi: FIVE_PILLARS_TOKEN_ABI,
    functionName: "allowance",
    args: address && spenderAddress ? [address, spenderAddress as `0x${string}`] : undefined,
    query: {
      enabled: !!address && !!spenderAddress && !!tokenAddress,
    },
  })

  useEffect(() => {
    if (allowanceData !== undefined) {
      setAllowance(formatUnits(allowanceData, 18))
    }
  }, [allowanceData])

  const handleCheck = () => {
    refetch()
  }

  const handleUseInvestmentManager = () => {
    if (investmentContract.contractAddress) {
      setSpenderAddress(investmentContract.contractAddress)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Allowance Checker</CardTitle>
        <CardDescription>Check token allowance for a spender</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="spender-address">Spender Address</Label>
          <div className="flex gap-2">
            <Input
              id="spender-address"
              placeholder="0x..."
              value={spenderAddress}
              onChange={(e) => setSpenderAddress(e.target.value)}
            />
            <Button variant="outline" onClick={handleUseInvestmentManager}>
              Use Investment Manager
            </Button>
          </div>
        </div>

        <Button onClick={handleCheck} disabled={!address || !spenderAddress} className="w-full">
          Check Allowance
        </Button>

        {allowance !== null && (
          <div className="mt-4 p-4 bg-muted rounded-md">
            <div className="flex justify-between">
              <span className="font-medium">Allowance:</span>
              <span>{allowance} 5PT</span>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
