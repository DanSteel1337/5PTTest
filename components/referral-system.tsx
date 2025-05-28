"use client"

import { useState } from "react"
import { useAccount } from "wagmi"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Copy, Check, Share2, AlertCircle } from "lucide-react"
import { generateReferralLink, copyToClipboard } from "@/lib/utils"
import { useInvestmentManager } from "@/hooks/use-investment-manager"

export function ReferralSystem() {
  const { address } = useAccount()
  const { investorInfo } = useInvestmentManager()
  const [copied, setCopied] = useState(false)
  const referralLink = generateReferralLink(address)

  const handleCopy = async () => {
    try {
      await copyToClipboard(referralLink)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (error) {
      console.error("Failed to copy:", error)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Referral System</CardTitle>
        <CardDescription>Share your referral link to earn rewards</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {investorInfo?.referer !== "0x0000000000000000000000000000000000000000" && (
          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              Your referrer is set to: {investorInfo?.referer.substring(0, 6)}...
              {investorInfo?.referer.substring(investorInfo?.referer.length - 4)}
            </AlertDescription>
          </Alert>
        )}

        <div className="space-y-2">
          <Label htmlFor="referral-link">Your Referral Link</Label>
          <div className="flex gap-2">
            <Input id="referral-link" value={referralLink} readOnly className="font-mono text-xs" />
            <Button size="icon" onClick={handleCopy} variant="outline">
              {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
            </Button>
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex justify-between">
            <span>Direct Referrals:</span>
            <span className="font-medium">{investorInfo?.directReferralsCount || 0}</span>
          </div>
          <div className="flex justify-between">
            <span>Referral Rewards:</span>
            <span className="font-medium">
              {investorInfo ? (Number.parseFloat(investorInfo.totalDepositAmount) * 0.05).toFixed(2) : "0"} 5PT
            </span>
          </div>
        </div>

        <Button className="w-full" variant="outline" onClick={handleCopy}>
          <Share2 className="mr-2 h-4 w-4" />
          Share Referral Link
        </Button>
      </CardContent>
    </Card>
  )
}
