"use client"

import { useState, useEffect } from "react"
import { useAccount, useChainId } from "wagmi"
import { ConnectButton } from "@rainbow-me/rainbowkit"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { useInvestmentManager } from "@/hooks/use-investment-manager"
import { useFivePillarsToken } from "@/hooks/use-five-pillars-token"
import { formatTokenAmount } from "@/lib/numbers"
import { TestRunner } from "@/components/test-runner"
import { ReferralSystem } from "@/components/referral-system"
import { PoolEligibilityChecker } from "@/components/pool-eligibility-checker"
import { WhitelistManager } from "@/components/whitelist-manager"
import { AllowanceChecker } from "@/components/allowance-checker"
import { TransactionHistory } from "@/components/transaction-history"
import { bsc, bscTestnet } from "wagmi/chains"

export function Dashboard() {
  const [mounted, setMounted] = useState(false)
  const { address, isConnected } = useAccount()
  const chainId = useChainId()

  const {
    accumulatedRewards,
    lastRoundRewards,
    investorInfo,
    totalInvestorsCount,
    totalDepositAmount,
    startTimestamp,
    pools,
    isLoading: investmentLoading,
    contractAddress: investmentContractAddress,
  } = useInvestmentManager()

  const { balance, totalSupply, isLoading: tokenLoading, contractAddress: tokenContractAddress } = useFivePillarsToken()

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return null
  }

  const isTestnet = chainId === bscTestnet.id
  const isMainnet = chainId === bsc.id
  const networkName = isTestnet ? "BSC Testnet" : isMainnet ? "BSC Mainnet" : "Unknown Network"

  return (
    <div className="container mx-auto p-6 space-y-6" suppressHydrationWarning>
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white">Five Pillars Dashboard</h1>
          <p className="text-gray-400">Investment Management & Testing Platform</p>
        </div>
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
          <Badge variant={isTestnet ? "secondary" : "default"} className="text-sm">
            {networkName}
          </Badge>
          <ConnectButton />
        </div>
      </div>

      {/* Contract Information */}
      <Card className="bg-gray-800 border-gray-700">
        <CardHeader>
          <CardTitle className="text-white">Contract Information</CardTitle>
          <CardDescription className="text-gray-400">Smart contract addresses and network details</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-400">Investment Manager</p>
              <p className="text-white font-mono text-sm break-all">{investmentContractAddress || "Not available"}</p>
            </div>
            <div>
              <p className="text-sm text-gray-400">Five Pillars Token</p>
              <p className="text-white font-mono text-sm break-all">{tokenContractAddress || "Not available"}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {!isConnected ? (
        <Card className="bg-gray-800 border-gray-700">
          <CardContent className="flex flex-col items-center justify-center py-12">
            <h2 className="text-xl font-semibold text-white mb-4">Connect Your Wallet</h2>
            <p className="text-gray-400 text-center mb-6">
              Connect your wallet to access the Five Pillars investment platform
            </p>
            <ConnectButton />
          </CardContent>
        </Card>
      ) : (
        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2 lg:grid-cols-6 bg-gray-800">
            <TabsTrigger value="overview" className="text-white">
              Overview
            </TabsTrigger>
            <TabsTrigger value="pools" className="text-white">
              Pools
            </TabsTrigger>
            <TabsTrigger value="referrals" className="text-white">
              Referrals
            </TabsTrigger>
            <TabsTrigger value="management" className="text-white">
              Management
            </TabsTrigger>
            <TabsTrigger value="history" className="text-white">
              History
            </TabsTrigger>
            <TabsTrigger value="testing" className="text-white">
              Testing
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            {/* User Stats */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card className="bg-gray-800 border-gray-700">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm text-gray-400">Token Balance</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-2xl font-bold text-white">{tokenLoading ? "..." : formatTokenAmount(balance)}</p>
                  <p className="text-xs text-gray-500">5PT Tokens</p>
                </CardContent>
              </Card>

              <Card className="bg-gray-800 border-gray-700">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm text-gray-400">Accumulated Rewards</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-2xl font-bold text-green-400">
                    {investmentLoading ? "..." : formatTokenAmount(accumulatedRewards)}
                  </p>
                  <p className="text-xs text-gray-500">5PT Tokens</p>
                </CardContent>
              </Card>

              <Card className="bg-gray-800 border-gray-700">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm text-gray-400">Total Investment</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-2xl font-bold text-blue-400">
                    {investmentLoading ? "..." : formatTokenAmount(investorInfo?.totalDepositAmount || "0")}
                  </p>
                  <p className="text-xs text-gray-500">5PT Tokens</p>
                </CardContent>
              </Card>

              <Card className="bg-gray-800 border-gray-700">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm text-gray-400">Direct Referrals</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-2xl font-bold text-purple-400">
                    {investmentLoading ? "..." : investorInfo?.directReferralsCount || 0}
                  </p>
                  <p className="text-xs text-gray-500">Active Referrals</p>
                </CardContent>
              </Card>
            </div>

            {/* Last Round Rewards */}
            <Card className="bg-gray-800 border-gray-700">
              <CardHeader>
                <CardTitle className="text-white">Last Round Rewards</CardTitle>
                <CardDescription className="text-gray-400">
                  Breakdown of rewards from the last distribution round
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="text-center">
                    <p className="text-sm text-gray-400">Daily Rewards</p>
                    <p className="text-xl font-semibold text-green-400">{formatTokenAmount(lastRoundRewards.daily)}</p>
                  </div>
                  <div className="text-center">
                    <p className="text-sm text-gray-400">Referral Rewards</p>
                    <p className="text-xl font-semibold text-blue-400">
                      {formatTokenAmount(lastRoundRewards.referral)}
                    </p>
                  </div>
                  <div className="text-center">
                    <p className="text-sm text-gray-400">Pool Rewards</p>
                    <p className="text-xl font-semibold text-purple-400">{formatTokenAmount(lastRoundRewards.pools)}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* System Statistics */}
            <Card className="bg-gray-800 border-gray-700">
              <CardHeader>
                <CardTitle className="text-white">System Statistics</CardTitle>
                <CardDescription className="text-gray-400">Overall platform metrics and information</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div>
                    <p className="text-sm text-gray-400">Total Investors</p>
                    <p className="text-2xl font-bold text-white">
                      {investmentLoading ? "..." : totalInvestorsCount.toLocaleString()}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-400">Total Deposits</p>
                    <p className="text-2xl font-bold text-white">
                      {investmentLoading ? "..." : formatTokenAmount(totalDepositAmount)}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-400">Total Supply</p>
                    <p className="text-2xl font-bold text-white">
                      {tokenLoading ? "..." : formatTokenAmount(totalSupply)}
                    </p>
                  </div>
                </div>
                <Separator className="my-4 bg-gray-700" />
                <div>
                  <p className="text-sm text-gray-400">Platform Start Time</p>
                  <p className="text-white">
                    {startTimestamp > 0 ? new Date(startTimestamp * 1000).toLocaleString() : "Not started"}
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="pools" className="space-y-6">
            <PoolEligibilityChecker />
          </TabsContent>

          <TabsContent value="referrals" className="space-y-6">
            <ReferralSystem />
          </TabsContent>

          <TabsContent value="management" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <WhitelistManager />
              <AllowanceChecker />
            </div>
          </TabsContent>

          <TabsContent value="history" className="space-y-6">
            <TransactionHistory />
          </TabsContent>

          <TabsContent value="testing" className="space-y-6">
            <TestRunner />
          </TabsContent>
        </Tabs>
      )}
    </div>
  )
}
