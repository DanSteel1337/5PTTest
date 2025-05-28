"use client"

import { useReadContracts, useWriteContract, useAccount, useChainId } from "wagmi"
import { FIVE_PILLARS_TOKEN_ABI } from "@/lib/abis"
import { getContractAddress } from "@/lib/config"
import { formatUnits, parseUnits } from "viem"

export function useFivePillarsToken() {
  const { address } = useAccount()
  const chainId = useChainId()
  const contractAddress = getContractAddress(chainId, "fivePillarsToken")
  const { writeContract, isPending, error } = useWriteContract()

  const {
    data: tokenData,
    isLoading,
    refetch,
  } = useReadContracts({
    contracts: [
      {
        address: contractAddress,
        abi: FIVE_PILLARS_TOKEN_ABI,
        functionName: "name",
      },
      {
        address: contractAddress,
        abi: FIVE_PILLARS_TOKEN_ABI,
        functionName: "symbol",
      },
      {
        address: contractAddress,
        abi: FIVE_PILLARS_TOKEN_ABI,
        functionName: "decimals",
      },
      {
        address: contractAddress,
        abi: FIVE_PILLARS_TOKEN_ABI,
        functionName: "totalSupply",
      },
      {
        address: contractAddress,
        abi: FIVE_PILLARS_TOKEN_ABI,
        functionName: "owner",
      },
      ...(address
        ? [
            {
              address: contractAddress,
              abi: FIVE_PILLARS_TOKEN_ABI,
              functionName: "balanceOf",
              args: [address],
            },
          ]
        : []),
    ],
    query: {
      enabled: !!contractAddress,
      refetchInterval: 10000,
    },
  })

  const transfer = async (to: string, amount: string) => {
    if (!contractAddress) return
    try {
      const result = await writeContract({
        address: contractAddress,
        abi: FIVE_PILLARS_TOKEN_ABI,
        functionName: "transfer",
        args: [to as `0x${string}`, parseUnits(amount, 18)],
      })

      // Add to transaction history if available
      if (typeof window !== "undefined" && window.addTransaction && result) {
        // @ts-ignore
        window.addTransaction({
          hash: result,
          from: address || "",
          to: contractAddress,
          status: "pending",
          contract: "token",
          method: "transfer",
        })
      }

      return result
    } catch (error) {
      console.error("Transfer error:", error)
      throw error
    }
  }

  const approve = async (spender: string, amount: string) => {
    if (!contractAddress) return
    try {
      const result = await writeContract({
        address: contractAddress,
        abi: FIVE_PILLARS_TOKEN_ABI,
        functionName: "approve",
        args: [spender as `0x${string}`, parseUnits(amount, 18)],
      })

      // Add to transaction history if available
      if (typeof window !== "undefined" && window.addTransaction && result) {
        // @ts-ignore
        window.addTransaction({
          hash: result,
          from: address || "",
          to: contractAddress,
          status: "pending",
          contract: "token",
          method: "approve",
        })
      }

      return result
    } catch (error) {
      console.error("Approve error:", error)
      throw error
    }
  }

  const setInvestmentManager = async (manager: string) => {
    if (!contractAddress) return
    try {
      const result = await writeContract({
        address: contractAddress,
        abi: FIVE_PILLARS_TOKEN_ABI,
        functionName: "setInvestmentManager",
        args: [manager as `0x${string}`],
      })

      // Add to transaction history if available
      if (typeof window !== "undefined" && window.addTransaction && result) {
        // @ts-ignore
        window.addTransaction({
          hash: result,
          from: address || "",
          to: contractAddress,
          status: "pending",
          contract: "token",
          method: "setInvestmentManager",
        })
      }

      return result
    } catch (error) {
      console.error("Set investment manager error:", error)
      throw error
    }
  }

  // Parse token data with proper null checks
  const parsedTokenData = tokenData
    ? {
        name: tokenData[0]?.result || "Five Pillars Token",
        symbol: tokenData[1]?.result || "5PT",
        decimals: tokenData[2]?.result !== undefined ? tokenData[2].result : 18,
        totalSupply: tokenData[3]?.result !== undefined ? formatUnits(tokenData[3].result, 18) : "0",
        owner: tokenData[4]?.result || "0x0000000000000000000000000000000000000000",
        balance: address && tokenData[5]?.result !== undefined ? formatUnits(tokenData[5].result, 18) : "0",
      }
    : {
        name: "Five Pillars Token",
        symbol: "5PT",
        decimals: 18,
        totalSupply: "0",
        owner: "0x0000000000000000000000000000000000000000",
        balance: "0",
      }

  return {
    contractAddress,
    tokenData: parsedTokenData,
    isLoading,
    isPending,
    error,
    refetch,
    transfer,
    approve,
    setInvestmentManager,
  }
}
