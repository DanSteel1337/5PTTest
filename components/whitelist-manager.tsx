"use client"

import { useState } from "react"
import { useAccount } from "wagmi"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { AlertCircle } from "lucide-react"
import { useInvestmentManager } from "@/hooks/use-investment-manager"
import { useFivePillarsToken } from "@/hooks/use-five-pillars-token"

export function WhitelistManager() {
  const { address } = useAccount()
  const { tokenData } = useFivePillarsToken()
  const { setWhitelist, isPending } = useInvestmentManager()

  const [investorAddress, setInvestorAddress] = useState("")
  const [poolId, setPoolId] = useState("7")
  const [action, setAction] = useState("add")

  const isOwner = address && tokenData?.owner && address.toLowerCase() === tokenData.owner.toLowerCase()

  const handleSubmit = () => {
    if (!investorAddress || !poolId) return
    setWhitelist(investorAddress, Number(poolId), action === "add")
  }

  if (!isOwner) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Whitelist Manager</CardTitle>
          <CardDescription>Manage whitelist for special pools</CardDescription>
        </CardHeader>
        <CardContent>
          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>Only the contract owner can manage the whitelist.</AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Whitelist Manager</CardTitle>
        <CardDescription>Manage whitelist for special pools (Owner Only)</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="investor-address">Investor Address</Label>
          <Input
            id="investor-address"
            placeholder="0x..."
            value={investorAddress}
            onChange={(e) => setInvestorAddress(e.target.value)}
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="pool-id">Pool ID</Label>
            <Select value={poolId} onValueChange={setPoolId}>
              <SelectTrigger id="pool-id">
                <SelectValue placeholder="Select Pool" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="7">Pool 7</SelectItem>
                <SelectItem value="8">Pool 8</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="action">Action</Label>
            <Select value={action} onValueChange={setAction}>
              <SelectTrigger id="action">
                <SelectValue placeholder="Select Action" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="add">Add to Whitelist</SelectItem>
                <SelectItem value="remove">Remove from Whitelist</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <Button onClick={handleSubmit} disabled={isPending || !investorAddress || !poolId} className="w-full">
          {isPending ? "Processing..." : "Update Whitelist"}
        </Button>
      </CardContent>
    </Card>
  )
}
