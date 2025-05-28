"use client"

import { getDefaultConfig } from "@rainbow-me/rainbowkit"
import { bsc, bscTestnet } from "wagmi/chains"

// Use the environment variable for the WalletConnect project ID
const projectId = process.env.NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID

if (!projectId) {
  console.warn("Missing NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID environment variable")
}

export const config = getDefaultConfig({
  appName: "Five Pillars Developer Dashboard",
  projectId: projectId || "default_project_id", // Fallback to prevent errors
  chains: [bscTestnet, bsc],
  ssr: true,
  // Add wallet connect options to handle potential issues
  walletConnectOptions: {
    projectId: projectId || "default_project_id",
    metadata: {
      name: "Five Pillars Developer Dashboard",
      description: "Test and debug Five Pillars smart contracts",
      url: typeof window !== "undefined" ? window.location.origin : "https://localhost:3000",
      icons: [],
    },
  },
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
