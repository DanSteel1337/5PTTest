"use client"

import { useReadContracts, useWriteContract, useAccount, useChainId } from "wagmi"
import { FIVE_PILLARS_TOKEN_ABI } from "@/lib/abis"
import { getContractAddress } from "@/lib/config"
import { formatUnits, parseUnits } from "viem"
import { addTransactionToHistory } from "@/lib/transactions"

export function useFivePillarsToken() {
  const { address } = useAccount()
  const chainId = useChainId()

  // Always get the contract address, even if it might be undefined
  const contractAddress = getContractAddress(chainId, "fivePillarsToken")

  // Always call hooks unconditionally
  const { writeContract, isPending, error } = useWriteContract()

  // Build contracts array conditionally but call useReadContracts unconditionally
  const contracts = contractAddress
    ? [
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
      ]
    : []

  const {
    data: tokenData,
    isLoading,
    refetch,
  } = useReadContracts({
    contracts,
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

      addTransactionToHistory(result, address || "", contractAddress, "token", "transfer")
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

      addTransactionToHistory(result, address || "", contractAddress, "token", "approve")
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

      addTransactionToHistory(result, address || "", contractAddress, "token", "setInvestmentManager")
      return result
    } catch (error) {
      console.error("Set investment manager error:", error)
      throw error
    }
  }

  // Default values
  const defaultTokenData = {
    name: "Five Pillars Token",
    symbol: "5PT",
    decimals: 18,
    totalSupply: "0",
    owner: "0x0000000000000000000000000000000000000000",
    balance: "0",
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
    : defaultTokenData

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
