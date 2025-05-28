"use client"

import { useReadContracts, useWriteContract, useAccount, useChainId } from "wagmi"
import { INVESTMENT_MANAGER_ABI } from "@/lib/abis"
import { getContractAddress } from "@/lib/config"
import { formatUnits, parseUnits } from "viem"

export function useInvestmentManager() {
  const { address } = useAccount()
  const chainId = useChainId()

  // Always get the contract address, even if it might be undefined
  const contractAddress = getContractAddress(chainId, "investmentManager")

  // Always call hooks unconditionally
  const { writeContract, isPending, error } = useWriteContract()

  // Build contracts array conditionally but call useReadContracts unconditionally
  const contracts = [
    // Core reward data
    ...(address && contractAddress
      ? [
          {
            address: contractAddress,
            abi: INVESTMENT_MANAGER_ABI,
            functionName: "getAccumulatedRewards",
            account: address,
          },
        ]
      : []),
    ...(address && contractAddress
      ? [
          {
            address: contractAddress,
            abi: INVESTMENT_MANAGER_ABI,
            functionName: "getLastRoundRewards",
            account: address,
          },
        ]
      : []),
    // Investor information
    ...(address && contractAddress
      ? [
          {
            address: contractAddress,
            abi: INVESTMENT_MANAGER_ABI,
            functionName: "accountToInvestorInfo",
            args: [address],
          },
        ]
      : []),
    // System statistics
    ...(contractAddress
      ? [
          {
            address: contractAddress,
            abi: INVESTMENT_MANAGER_ABI,
            functionName: "getTotalInvestorsCount",
          },
          {
            address: contractAddress,
            abi: INVESTMENT_MANAGER_ABI,
            functionName: "totalDepositAmount",
          },
          {
            address: contractAddress,
            abi: INVESTMENT_MANAGER_ABI,
            functionName: "startTimestamp",
          },
        ]
      : []),
    // All 9 pools data
    ...(contractAddress
      ? Array.from({ length: 9 }, (_, i) => ({
          address: contractAddress,
          abi: INVESTMENT_MANAGER_ABI,
          functionName: "pools",
          args: [BigInt(i)],
        }))
      : []),
  ]

  const {
    data: contractData,
    isLoading,
    refetch,
  } = useReadContracts({
    contracts,
    query: {
      enabled: !!contractAddress,
      refetchInterval: 10000,
    },
  })

  const deposit = async (amount: string, referer?: string) => {
    if (!contractAddress) return
    try {
      const result = await writeContract({
        address: contractAddress,
        abi: INVESTMENT_MANAGER_ABI,
        functionName: "deposit",
        args: [parseUnits(amount, 18), (referer || "0x0000000000000000000000000000000000000000") as `0x${string}`],
      })

      // Add to transaction history if available
      if (typeof window !== "undefined" && window.addTransaction && result) {
        // @ts-ignore
        window.addTransaction({
          hash: result,
          from: address || "",
          to: contractAddress,
          status: "pending",
          contract: "investment",
          method: "deposit",
        })
      }

      return result
    } catch (error) {
      console.error("Deposit error:", error)
      throw error
    }
  }

  const claimReward = async () => {
    if (!contractAddress) return
    try {
      const result = await writeContract({
        address: contractAddress,
        abi: INVESTMENT_MANAGER_ABI,
        functionName: "claimReward",
      })

      // Add to transaction history if available
      if (typeof window !== "undefined" && window.addTransaction && result) {
        // @ts-ignore
        window.addTransaction({
          hash: result,
          from: address || "",
          to: contractAddress,
          status: "pending",
          contract: "investment",
          method: "claimReward",
        })
      }

      return result
    } catch (error) {
      console.error("Claim reward error:", error)
      throw error
    }
  }

  const setWhitelist = async (investor: string, poolId: number, add: boolean) => {
    if (!contractAddress) return
    try {
      const result = await writeContract({
        address: contractAddress,
        abi: INVESTMENT_MANAGER_ABI,
        functionName: "setWhitelist",
        args: [investor as `0x${string}`, poolId, add],
      })

      // Add to transaction history if available
      if (typeof window !== "undefined" && window.addTransaction && result) {
        // @ts-ignore
        window.addTransaction({
          hash: result,
          from: address || "",
          to: contractAddress,
          status: "pending",
          contract: "investment",
          method: "setWhitelist",
        })
      }

      return result
    } catch (error) {
      console.error("Set whitelist error:", error)
      throw error
    }
  }

  // Default values for when data is not available
  const defaultData = {
    contractAddress,
    accumulatedRewards: "0",
    lastRoundRewards: { daily: "0", referral: "0", pools: "0" },
    investorInfo: null,
    totalInvestorsCount: 0,
    totalDepositAmount: "0",
    startTimestamp: 0,
    pools: Array.from({ length: 9 }, (_, i) => ({
      id: i,
      isActive: false,
      curReward: "0",
      participantsCount: 0,
      minInvestmentAmount: "0",
      minDirectReferralsCount: 0,
      minDirectReferralsDeposit: "0",
      share: 0,
    })),
    isLoading,
    isPending,
    error,
    refetch,
    deposit,
    claimReward,
    setWhitelist,
  }

  // Return early with defaults if no contract address
  if (!contractAddress) {
    return defaultData
  }

  // Parse contract data with proper null checks
  let dataIndex = 0

  // Handle accumulated rewards
  const accumulatedRewards =
    address && contractData && contractData[dataIndex]?.result !== undefined
      ? formatUnits(contractData[dataIndex].result as bigint, 18)
      : "0"

  if (address) dataIndex++

  // Handle last round rewards
  const lastRoundRewards =
    address && contractData && contractData[dataIndex]?.result
      ? {
          daily: formatUnits((contractData[dataIndex].result as any)[0], 18),
          referral: formatUnits((contractData[dataIndex].result as any)[1], 18),
          pools: formatUnits((contractData[dataIndex].result as any)[2], 18),
        }
      : { daily: "0", referral: "0", pools: "0" }

  if (address) dataIndex++

  // Handle investor info
  const investorInfo =
    address && contractData && contractData[dataIndex]?.result
      ? {
          totalDepositAmount: formatUnits((contractData[dataIndex].result as any)[0], 18),
          directReferralsCount: Number((contractData[dataIndex].result as any)[1]),
          downlineReferralsCount: Number((contractData[dataIndex].result as any)[2]),
          directRefsDeposit: formatUnits((contractData[dataIndex].result as any)[3], 18),
          downlineRefsDeposit: formatUnits((contractData[dataIndex].result as any)[4], 18),
          referer: (contractData[dataIndex].result as any)[5],
          lastDailyReward: formatUnits((contractData[dataIndex].result as any)[6], 18),
          lastRefReward: formatUnits((contractData[dataIndex].result as any)[7], 18),
          accumulatedReward: formatUnits((contractData[dataIndex].result as any)[8], 18),
          lastClaimTimestamp: Number((contractData[dataIndex].result as any)[9]),
          lastDepositTimestamp: Number((contractData[dataIndex].result as any)[10]),
          updateRefRewardTimestamp: Number((contractData[dataIndex].result as any)[11]),
        }
      : null

  if (address) dataIndex++

  // Handle total investors count
  const totalInvestorsCount =
    contractData && contractData[dataIndex]?.result !== undefined ? Number(contractData[dataIndex].result) : 0

  dataIndex++

  // Handle total deposit amount
  const totalDepositAmount =
    contractData && contractData[dataIndex]?.result !== undefined
      ? formatUnits(contractData[dataIndex].result as bigint, 18)
      : "0"

  dataIndex++

  // Handle start timestamp
  const startTimestamp =
    contractData && contractData[dataIndex]?.result !== undefined ? Number(contractData[dataIndex].result) : 0

  dataIndex++

  // Handle pools data (updated based on documentation)
  const pools = Array.from({ length: 9 }, (_, i) => {
    const poolData = contractData && contractData[dataIndex + i]?.result
    return poolData
      ? {
          id: i,
          isActive: (poolData as any)[0],
          curReward: formatUnits((poolData as any)[1], 18),
          lastReward: formatUnits((poolData as any)[2], 18),
          participantsCount: Number((poolData as any)[3]),
          rewardPerInvestorStored: formatUnits((poolData as any)[4], 18),
          minInvestmentAmount: formatUnits((poolData as any)[5], 18),
          minDirectReferralsDeposit: formatUnits((poolData as any)[6], 18),
          minDirectReferralsCount: Number((poolData as any)[7]),
          share: Number((poolData as any)[8]),
        }
      : {
          id: i,
          isActive: false,
          curReward: "0",
          lastReward: "0",
          participantsCount: 0,
          rewardPerInvestorStored: "0",
          minInvestmentAmount: "0",
          minDirectReferralsDeposit: "0",
          minDirectReferralsCount: 0,
          share: 0,
        }
  })

  return {
    contractAddress,
    accumulatedRewards,
    lastRoundRewards,
    investorInfo,
    totalInvestorsCount,
    totalDepositAmount,
    startTimestamp,
    pools,
    isLoading,
    isPending,
    error,
    refetch,
    deposit,
    claimReward,
    setWhitelist,
  }
}
