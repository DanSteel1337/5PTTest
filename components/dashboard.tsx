"use client"

import { useState, useEffect } from "react"
import { useAccount, useChainId, useSwitchChain } from "wagmi"
import { ConnectButton } from "@rainbow-me/rainbowkit"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Separator } from "@/components/ui/separator"
import { useFivePillarsToken } from "@/hooks/use-five-pillars-token"
import { useInvestmentManager } from "@/hooks/use-investment-manager"
import { bsc, bscTestnet } from "wagmi/chains"
import { AlertCircle, CheckCircle, Clock, DollarSign, Users, TrendingUp } from "lucide-react"
import { TransactionHistory } from "@/components/transaction-history"
import { ReferralSystem } from "@/components/referral-system"
import { PoolEligibilityChecker } from "@/components/pool-eligibility-checker"
import { WhitelistManager } from "@/components/whitelist-manager"
import { AllowanceChecker } from "@/components/allowance-checker"
import { isPoolEligible, calculateTimeRemaining } from "@/lib/utils"

export function Dashboard() {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return <div className="flex items-center justify-center min-h-screen">Loading dashboard...</div>
  }

  return <DashboardContent />
}

function DashboardContent() {
  const { address, isConnected } = useAccount()
  const chainId = useChainId()
  const { switchChain } = useSwitchChain()
  const [mounted, setMounted] = useState(false)

  // Form states
  const [transferTo, setTransferTo] = useState("")
  const [transferAmount, setTransferAmount] = useState("")
  const [approveSpender, setApproveSpender] = useState("")
  const [approveAmount, setApproveAmount] = useState("")
  const [depositAmount, setDepositAmount] = useState("")
  const [refererAddress, setRefererAddress] = useState("")

  // Contract hooks
  const tokenContract = useFivePillarsToken()
  const investmentContract = useInvestmentManager()

  useEffect(() => {
    setMounted(true)
    // Extract referrer from URL
    if (typeof window !== "undefined") {
      const urlParams = new URLSearchParams(window.location.search)
      const ref = urlParams.get("ref")
      if (ref) {
        setRefererAddress(ref)
      }
    }
  }, [])

  // Parse contract-specific errors
  const parseContractError = (error: Error | null) => {
    if (!error) return null

    const errorMessage = error.message

    // Five Pillars specific errors
    if (errorMessage.includes("DepositNotYetAvailable")) {
      return "You must wait 4 hours between deposits. Please try again later."
    } else if (errorMessage.includes("SmallDepositOrClaimAmount")) {
      return "Minimum amount for deposit or claim is 1 token."
    } else if (errorMessage.includes("RefererAlreadySetted")) {
      return "Referrer can only be set on your first deposit."
    } else if (errorMessage.includes("InvalidReferer")) {
      return "Invalid referrer address provided."
    } else if (errorMessage.includes("HalfRequirementViolated")) {
      return "Pool criteria update violates half requirement rule."
    }

    // Generic errors
    if (errorMessage.includes("insufficient funds")) {
      return "Insufficient funds for transaction. Check your BNB balance for gas."
    } else if (errorMessage.includes("user rejected")) {
      return "Transaction was rejected in your wallet."
    }

    return errorMessage
  }

  // Don't render until mounted to avoid hydration issues
  if (!mounted) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>
  }

  const isCorrectNetwork = chainId === bscTestnet.id || chainId === bsc.id
  const networkName = chainId === bsc.id ? "BSC Mainnet" : "BSC Testnet"

  // Safe number parsing with fallbacks
  const safeParseFloat = (value: string | undefined): number => {
    if (!value) return 0
    const parsed = Number.parseFloat(value)
    return isNaN(parsed) ? 0 : parsed
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Five Pillars Developer Dashboard</h1>
          <p className="text-muted-foreground">Test and debug smart contract interactions</p>
        </div>
        <div className="flex items-center gap-4">
          <Badge variant={isCorrectNetwork ? "default" : "destructive"}>{networkName}</Badge>
          <ConnectButton />
        </div>
      </div>

      {/* Network Warning */}
      {isConnected && !isCorrectNetwork && (
        <Alert>
          <AlertCircle className="h-4 w-4" />
          <AlertDescription className="flex items-center justify-between">
            Please switch to BSC Testnet or BSC Mainnet to interact with contracts.
            <Button size="sm" onClick={() => switchChain({ chainId: bscTestnet.id })}>
              Switch to BSC Testnet
            </Button>
          </AlertDescription>
        </Alert>
      )}

      {/* Connection Status */}
      {!isConnected && (
        <Alert>
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>Please connect your wallet to interact with the Five Pillars contracts.</AlertDescription>
        </Alert>
      )}

      {/* Main Content */}
      {isConnected && isCorrectNetwork && (
        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="token">5PT Token</TabsTrigger>
            <TabsTrigger value="investment">Investment</TabsTrigger>
            <TabsTrigger value="tools">Tools</TabsTrigger>
            <TabsTrigger value="debug">Debug</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Your Balance</CardTitle>
                  <DollarSign className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{tokenContract.tokenData?.balance || "0"} 5PT</div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Pending Rewards</CardTitle>
                  <TrendingUp className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{investmentContract.accumulatedRewards} 5PT</div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Investors</CardTitle>
                  <Users className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{investmentContract.totalInvestorsCount}</div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Deposits</CardTitle>
                  <Clock className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {safeParseFloat(investmentContract.totalDepositAmount).toFixed(2)} 5PT
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Investor Information */}
            {investmentContract.investorInfo && (
              <Card>
                <CardHeader>
                  <CardTitle>Your Investment Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label className="text-sm font-medium">Total Deposited</Label>
                      <p className="text-lg font-semibold">{investmentContract.investorInfo.totalDepositAmount} 5PT</p>
                    </div>
                    <div>
                      <Label className="text-sm font-medium">Direct Referrals</Label>
                      <p className="text-lg font-semibold">{investmentContract.investorInfo.directReferralsCount}</p>
                    </div>
                  </div>
                  <div>
                    <Label className="text-sm font-medium">Referrer</Label>
                    <p className="text-sm font-mono bg-muted p-2 rounded">
                      {investmentContract.investorInfo.referer === "0x0000000000000000000000000000000000000000"
                        ? "No referrer"
                        : investmentContract.investorInfo.referer}
                    </p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium">Last Deposit</Label>
                    <p className="text-sm">
                      {investmentContract.investorInfo.lastDepositTimestamp > 0
                        ? new Date(investmentContract.investorInfo.lastDepositTimestamp * 1000).toLocaleString()
                        : "No deposits yet"}
                    </p>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Pool Information */}
            <Card>
              <CardHeader>
                <CardTitle>Investment Pools</CardTitle>
                <CardDescription>Current pool status and your eligibility</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4">
                  {investmentContract.pools.map((pool) => {
                    const eligible = investmentContract.investorInfo
                      ? isPoolEligible(
                          pool.id,
                          investmentContract.investorInfo.totalDepositAmount,
                          Number(investmentContract.investorInfo.directReferralsCount),
                          investmentContract.pools,
                        )
                      : false

                    return (
                      <div key={pool.id} className="flex items-center justify-between p-4 border rounded-lg">
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <h4 className="font-medium">Pool {pool.id}</h4>
                            <Badge variant={pool.isActive ? "default" : "secondary"}>
                              {pool.isActive ? "Active" : "Inactive"}
                            </Badge>
                            {investmentContract.investorInfo && (
                              <Badge variant={eligible ? "success" : "outline"}>
                                {eligible ? "Eligible" : "Not Eligible"}
                              </Badge>
                            )}
                          </div>
                          <p className="text-sm text-muted-foreground">
                            Min Investment: {pool.minInvestmentAmount} 5PT | Min Referrals:{" "}
                            {pool.minDirectReferralsCount}
                          </p>
                        </div>
                        <div className="text-right space-y-1">
                          <p className="font-medium">{pool.curReward} 5PT</p>
                          <p className="text-sm text-muted-foreground">{pool.participantsCount} participants</p>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </CardContent>
            </Card>

            {/* Referral System */}
            <ReferralSystem />
          </TabsContent>

          {/* Token Tab */}
          <TabsContent value="token" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Token Information */}
              <Card>
                <CardHeader>
                  <CardTitle>Token Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {tokenContract.tokenData && (
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="font-medium">Name:</span>
                        <span>{tokenContract.tokenData.name}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="font-medium">Symbol:</span>
                        <span>{tokenContract.tokenData.symbol}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="font-medium">Decimals:</span>
                        <span>{tokenContract.tokenData.decimals}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="font-medium">Total Supply:</span>
                        <span>{safeParseFloat(tokenContract.tokenData.totalSupply).toLocaleString()} 5PT</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="font-medium">Your Balance:</span>
                        <span className="font-semibold">{tokenContract.tokenData.balance} 5PT</span>
                      </div>
                      <Separator />
                      <div className="flex justify-between">
                        <span className="font-medium">Contract:</span>
                        <span className="text-xs font-mono">{tokenContract.contractAddress}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="font-medium">Owner:</span>
                        <span className="text-xs font-mono">{tokenContract.tokenData.owner}</span>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Token Actions */}
              <div className="space-y-6">
                {/* Transfer */}
                <Card>
                  <CardHeader>
                    <CardTitle>Transfer Tokens</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="transfer-to">To Address</Label>
                      <Input
                        id="transfer-to"
                        placeholder="0x..."
                        value={transferTo}
                        onChange={(e) => setTransferTo(e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="transfer-amount">Amount (5PT)</Label>
                      <Input
                        id="transfer-amount"
                        type="number"
                        placeholder="0.0"
                        value={transferAmount}
                        onChange={(e) => setTransferAmount(e.target.value)}
                      />
                    </div>
                    <Button
                      onClick={() => tokenContract.transfer(transferTo, transferAmount)}
                      disabled={tokenContract.isPending || !transferTo || !transferAmount}
                      className="w-full"
                    >
                      {tokenContract.isPending ? "Transferring..." : "Transfer"}
                    </Button>
                  </CardContent>
                </Card>

                {/* Approve */}
                <Card>
                  <CardHeader>
                    <CardTitle>Approve Tokens</CardTitle>
                    <CardDescription>Allow another address to spend your tokens</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="approve-spender">Spender Address</Label>
                      <Input
                        id="approve-spender"
                        placeholder="0x..."
                        value={approveSpender}
                        onChange={(e) => setApproveSpender(e.target.value)}
                      />
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => setApproveSpender(investmentContract.contractAddress || "")}
                      >
                        Use Investment Manager
                      </Button>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="approve-amount">Amount (5PT)</Label>
                      <Input
                        id="approve-amount"
                        type="number"
                        placeholder="0.0"
                        value={approveAmount}
                        onChange={(e) => setApproveAmount(e.target.value)}
                      />
                    </div>
                    <Button
                      onClick={() => tokenContract.approve(approveSpender, approveAmount)}
                      disabled={tokenContract.isPending || !approveSpender || !approveAmount}
                      className="w-full"
                    >
                      {tokenContract.isPending ? "Approving..." : "Approve"}
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </div>

            {/* Allowance Checker */}
            <AllowanceChecker />
          </TabsContent>

          {/* Investment Tab */}
          <TabsContent value="investment" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Investment Actions */}
              <div className="space-y-6">
                {/* Deposit */}
                <Card>
                  <CardHeader>
                    <CardTitle>Make Investment</CardTitle>
                    <CardDescription>Minimum 1 5PT token required</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {investmentContract.investorInfo && investmentContract.investorInfo.lastDepositTimestamp > 0 && (
                      <div className="mb-4">
                        <Badge
                          variant={
                            calculateTimeRemaining(investmentContract.investorInfo.lastDepositTimestamp).canDeposit
                              ? "success"
                              : "outline"
                          }
                        >
                          {calculateTimeRemaining(investmentContract.investorInfo.lastDepositTimestamp).timeRemaining}
                        </Badge>
                        <p className="text-xs text-muted-foreground mt-1">
                          Last deposit:{" "}
                          {new Date(investmentContract.investorInfo.lastDepositTimestamp * 1000).toLocaleString()}
                        </p>
                      </div>
                    )}
                    <div className="space-y-2">
                      <Label htmlFor="deposit-amount">Amount (5PT)</Label>
                      <Input
                        id="deposit-amount"
                        type="number"
                        placeholder="1.0"
                        value={depositAmount}
                        onChange={(e) => setDepositAmount(e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="referer">Referrer Address (Optional)</Label>
                      <Input
                        id="referer"
                        placeholder="0x..."
                        value={refererAddress}
                        onChange={(e) => setRefererAddress(e.target.value)}
                      />
                    </div>
                    <Alert>
                      <AlertCircle className="h-4 w-4" />
                      <AlertDescription>
                        Ensure you have approved the Investment Manager contract to spend your tokens first. There's a
                        4-hour delay between deposits.
                      </AlertDescription>
                    </Alert>
                    <Button
                      onClick={() => investmentContract.deposit(depositAmount, refererAddress)}
                      disabled={
                        investmentContract.isPending ||
                        !depositAmount ||
                        safeParseFloat(depositAmount) < 1 ||
                        (investmentContract.investorInfo &&
                          !calculateTimeRemaining(investmentContract.investorInfo.lastDepositTimestamp).canDeposit)
                      }
                      className="w-full"
                    >
                      {investmentContract.isPending ? "Depositing..." : "Deposit"}
                    </Button>
                  </CardContent>
                </Card>

                {/* Claim Rewards */}
                <Card>
                  <CardHeader>
                    <CardTitle>Claim Rewards</CardTitle>
                    <CardDescription>50% paid to you, 50% redistributed</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="text-center">
                      <p className="text-2xl font-bold">{investmentContract.accumulatedRewards} 5PT</p>
                      <p className="text-sm text-muted-foreground">Available to claim</p>
                    </div>
                    {investmentContract.lastRoundRewards && (
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span>Daily Reward:</span>
                          <span>{investmentContract.lastRoundRewards.daily} 5PT</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Referral Reward:</span>
                          <span>{investmentContract.lastRoundRewards.referral} 5PT</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Pool Reward:</span>
                          <span>{investmentContract.lastRoundRewards.pools} 5PT</span>
                        </div>
                      </div>
                    )}
                    <Button
                      onClick={() => investmentContract.claimReward()}
                      disabled={
                        investmentContract.isPending || safeParseFloat(investmentContract.accumulatedRewards) < 1
                      }
                      className="w-full"
                    >
                      {investmentContract.isPending ? "Claiming..." : "Claim Rewards"}
                    </Button>
                  </CardContent>
                </Card>
              </div>

              {/* System Information */}
              <Card>
                <CardHeader>
                  <CardTitle>System Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="font-medium">Contract Address:</span>
                      <span className="text-xs font-mono">{investmentContract.contractAddress}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-medium">Start Time:</span>
                      <span className="text-sm">
                        {investmentContract.startTimestamp > 0
                          ? new Date(investmentContract.startTimestamp * 1000).toLocaleString()
                          : "Not started"}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-medium">Total Investors:</span>
                      <span>{investmentContract.totalInvestorsCount}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-medium">Total Deposits:</span>
                      <span>{safeParseFloat(investmentContract.totalDepositAmount).toFixed(2)} 5PT</span>
                    </div>
                  </div>

                  <Separator />

                  <div>
                    <h4 className="font-medium mb-2">System Rules</h4>
                    <ul className="text-sm space-y-1 text-muted-foreground">
                      <li>• Minimum deposit: 1 5PT token</li>
                      <li>• 4-hour delay between deposits</li>
                      <li>• Referrer can only be set once</li>
                      <li>• 50% of claimed rewards are redistributed</li>
                      <li>• Pool eligibility updates automatically</li>
                    </ul>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Whitelist Manager */}
            <WhitelistManager />
          </TabsContent>

          {/* Tools Tab */}
          <TabsContent value="tools" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Pool Eligibility Checker */}
              <PoolEligibilityChecker />

              {/* Transaction History */}
              <TransactionHistory />
            </div>
          </TabsContent>

          {/* Debug Tab */}
          <TabsContent value="debug" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Contract Status */}
              <Card>
                <CardHeader>
                  <CardTitle>Contract Status</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <span>Token Contract: Connected</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <span>Investment Contract: Connected</span>
                  </div>
                  <div className="flex items-center gap-2">
                    {isCorrectNetwork ? (
                      <CheckCircle className="h-4 w-4 text-green-500" />
                    ) : (
                      <AlertCircle className="h-4 w-4 text-red-500" />
                    )}
                    <span>Network: {networkName}</span>
                  </div>
                </CardContent>
              </Card>

              {/* Error Display */}
              {(tokenContract.error || investmentContract.error) && (
                <Card>
                  <CardHeader>
                    <CardTitle className="text-red-500">Transaction Errors</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {tokenContract.error && (
                      <Alert className="mb-4">
                        <AlertCircle className="h-4 w-4" />
                        <AlertDescription>
                          <div className="font-medium">Token Contract Error:</div>
                          <div className="text-sm">{parseContractError(tokenContract.error)}</div>
                          <div className="text-xs mt-1 text-muted-foreground">Raw: {tokenContract.error.message}</div>
                        </AlertDescription>
                      </Alert>
                    )}
                    {investmentContract.error && (
                      <Alert>
                        <AlertCircle className="h-4 w-4" />
                        <AlertDescription>
                          <div className="font-medium">Investment Contract Error:</div>
                          <div className="text-sm">{parseContractError(investmentContract.error)}</div>
                          <div className="text-xs mt-1 text-muted-foreground">
                            Raw: {investmentContract.error.message}
                          </div>
                        </AlertDescription>
                      </Alert>
                    )}
                  </CardContent>
                </Card>
              )}

              {/* Raw Data */}
              <Card className="lg:col-span-2">
                <CardHeader>
                  <CardTitle>Raw Contract Data</CardTitle>
                  <CardDescription>Debug information for developers</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <h4 className="font-medium mb-2">Token Data</h4>
                      <pre className="text-xs bg-muted p-4 rounded overflow-auto">
                        {JSON.stringify(tokenContract.tokenData, null, 2)}
                      </pre>
                    </div>
                    <div>
                      <h4 className="font-medium mb-2">Investment Data</h4>
                      <pre className="text-xs bg-muted p-4 rounded overflow-auto">
                        {JSON.stringify(
                          {
                            accumulatedRewards: investmentContract.accumulatedRewards,
                            lastRoundRewards: investmentContract.lastRoundRewards,
                            investorInfo: investmentContract.investorInfo,
                            pools: investmentContract.pools,
                            totalInvestorsCount: investmentContract.totalInvestorsCount,
                            totalDepositAmount: investmentContract.totalDepositAmount,
                            startTimestamp: investmentContract.startTimestamp,
                          },
                          null,
                          2,
                        )}
                      </pre>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      )}
    </div>
  )
}
