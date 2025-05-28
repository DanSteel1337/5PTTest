"use client"

import { useReadContracts, useWriteContract, useAccount, useChainId } from "wagmi"
import { INVESTMENT_MANAGER_ABI } from "@/lib/abis"
import { getContractAddress } from "@/lib/config"
import { formatUnits, parseUnits } from "viem"
import { useState, useEffect } from "react"

export function useInvestmentManager() {
  const { address } = useAccount()
  const chainId = useChainId()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  const contractAddress = mounted ? getContractAddress(chainId, "investmentManager") : undefined
  const { writeContract, isPending, error } = useWriteContract()

  const {
    data: contractData,
    isLoading,
    refetch,
  } = useReadContracts({
    contracts: [
      // Core reward data
      ...(address && mounted
        ? [
            {
              address: contractAddress,
              abi: INVESTMENT_MANAGER_ABI,
              functionName: "getAccumulatedRewards",
            },
          ]
        : []),
      ...(mounted
        ? [
            {
              address: contractAddress,
              abi: INVESTMENT_MANAGER_ABI,
              functionName: "getLastRoundRewards",
            },
          ]
        : []),
      // Investor information
      ...(address && mounted
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
      ...(mounted
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
      // Pool data (first 5 pools)
      ...(mounted
        ? Array.from({ length: 5 }, (_, i) => ({
            address: contractAddress,
            abi: INVESTMENT_MANAGER_ABI,
            functionName: "pools",
            args: [BigInt(i)],
          }))
        : []),
    ],
    query: {
      enabled: !!contractAddress && mounted,
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

  if (!mounted) {
    return {
      contractAddress: undefined,
      accumulatedRewards: "0",
      lastRoundRewards: { daily: "0", referral: "0", pools: "0" },
      investorInfo: null,
      totalInvestorsCount: 0,
      totalDepositAmount: "0",
      startTimestamp: 0,
      pools: Array.from({ length: 5 }, (_, i) => ({
        id: i,
        isActive: false,
        curReward: "0",
        participantsCount: 0,
        minInvestmentAmount: "0",
        minDirectReferralsCount: 0,
      })),
      isLoading: true,
      isPending: false,
      error: null,
      refetch: () => {},
      deposit,
      claimReward,
      setWhitelist,
    }
  }

  // Parse contract data with proper null checks
  let dataIndex = 0

  // Handle accumulated rewards
  const accumulatedRewards =
    address && contractData && contractData[dataIndex]?.result !== undefined
      ? formatUnits(contractData[dataIndex].result, 18)
      : "0"

  if (address) dataIndex++

  // Handle last round rewards
  const lastRoundRewards =
    contractData && contractData[dataIndex]?.result
      ? {
          daily: formatUnits(contractData[dataIndex].result[0], 18),
          referral: formatUnits(contractData[dataIndex].result[1], 18),
          pools: formatUnits(contractData[dataIndex].result[2], 18),
        }
      : { daily: "0", referral: "0", pools: "0" }

  dataIndex++

  // Handle investor info
  const investorInfo =
    address && contractData && contractData[dataIndex]?.result
      ? {
          totalDepositAmount: formatUnits(contractData[dataIndex].result[0], 18),
          lastDepositTimestamp: Number(contractData[dataIndex].result[1]),
          referer: contractData[dataIndex].result[2],
          directReferralsCount: Number(contractData[dataIndex].result[3]),
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
      ? formatUnits(contractData[dataIndex].result, 18)
      : "0"

  dataIndex++

  // Handle start timestamp
  const startTimestamp =
    contractData && contractData[dataIndex]?.result !== undefined ? Number(contractData[dataIndex].result) : 0

  dataIndex++

  // Handle pools data
  const pools = Array.from({ length: 5 }, (_, i) => {
    const poolData = contractData && contractData[dataIndex + i]?.result
    return poolData
      ? {
          id: i,
          isActive: poolData[0],
          curReward: formatUnits(poolData[1], 18),
          participantsCount: Number(poolData[2]),
          minInvestmentAmount: formatUnits(poolData[3], 18),
          minDirectReferralsCount: Number(poolData[4]),
        }
      : {
          id: i,
          isActive: false,
          curReward: "0",
          participantsCount: 0,
          minInvestmentAmount: "0",
          minDirectReferralsCount: 0,
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
