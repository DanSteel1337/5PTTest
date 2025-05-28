"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { useInvestmentManager } from "@/hooks/use-investment-manager"
import { isPoolEligible } from "@/lib/utils"

export function PoolEligibilityChecker() {
  const { pools } = useInvestmentManager()
  const [investmentAmount, setInvestmentAmount] = useState("")
  const [referralsCount, setReferralsCount] = useState("")
  const [referralsVolume, setReferralsVolume] = useState("")
  const [showResults, setShowResults] = useState(false)

  const handleCheck = () => {
    setShowResults(true)
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Pool Eligibility Checker</CardTitle>
        <CardDescription>Check eligibility for different investment pools</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="investment-amount">Investment Amount (5PT)</Label>
          <Input
            id="investment-amount"
            type="number"
            placeholder="0.0"
            value={investmentAmount}
            onChange={(e) => setInvestmentAmount(e.target.value)}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="referrals-count">Direct Referrals Count</Label>
          <Input
            id="referrals-count"
            type="number"
            placeholder="0"
            value={referralsCount}
            onChange={(e) => setReferralsCount(e.target.value)}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="referrals-volume">Direct Referrals Volume (5PT)</Label>
          <Input
            id="referrals-volume"
            type="number"
            placeholder="0.0"
            value={referralsVolume}
            onChange={(e) => setReferralsVolume(e.target.value)}
          />
        </div>
        <Button onClick={handleCheck} className="w-full">
          Check Eligibility
        </Button>

        {showResults && (
          <div className="space-y-2 mt-4">
            <h4 className="font-medium">Results:</h4>
            <div className="grid gap-2">
              {pools.map((pool) => {
                const eligible = isPoolEligible(
                  pool.id, 
                  investmentAmount || "0", 
                  Number(referralsCount) || 0, 
                  referralsVolume || "0",
                  pools
                )

                return (
                  <div key={pool.id} className="flex items-center justify-between p-2 border rounded">
                    <div className="flex items-center gap-2">
                      <span>Pool {pool.id + 1}</span>
                      <Badge variant={eligible ? "success" : "outline"}>{eligible ? "Eligible" : "Not Eligible"}</Badge>
                    </div>
                    <div className="text-xs text-muted-foreground">
                      Min: {pool.minInvestmentAmount} 5PT / {pool.minDirectReferralsCount} refs / {pool.minDirectReferralsDeposit} 5PT
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
