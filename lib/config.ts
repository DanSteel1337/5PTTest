"use client"

import { getDefaultConfig } from "@rainbow-me/rainbowkit"
import { bsc, bscTestnet } from "wagmi/chains"

// Ensure we have a valid project ID
const projectId = process.env.NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID || "YOUR_PROJECT_ID"

export const config = getDefaultConfig({
  appName: "Five Pillars Developer Dashboard",
  projectId: projectId,
  chains: [bscTestnet, bsc],
  ssr: true,
})

export const CONTRACT_ADDRESSES = {
  [bscTestnet.id]: {
    fivePillarsToken: "0xD9482A362b121090306E8A997Bd4B5196399DF00",
    investmentManager: "0xde829c7aB7C7B1938CEd26Bf725AD99da477b238",
  },
  [bsc.id]: {
    fivePillarsToken: "0x...", // Production addresses when deployed
    investmentManager: "0x...",
  },
} as const

export function getContractAddress(chainId: number, contractName: keyof (typeof CONTRACT_ADDRESSES)[56]) {
  return CONTRACT_ADDRESSES[chainId as keyof typeof CONTRACT_ADDRESSES]?.[contractName]
}
