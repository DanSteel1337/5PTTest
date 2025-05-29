"use client"

import type React from "react"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { WagmiProvider, cookieToInitialState } from "wagmi"
import { RainbowKitProvider, darkTheme } from "@rainbow-me/rainbowkit"
import { config } from "@/lib/config"
import { useState, useEffect } from "react"

interface ProvidersProps {
  children: React.ReactNode
  cookie?: string
}

export function Providers({ children, cookie }: ProvidersProps) {
  const [mounted, setMounted] = useState(false)
  const initialState = cookie ? cookieToInitialState(config, cookie) : undefined

  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 60 * 1000,
            gcTime: 10 * 60 * 1000,
            retry: 3,
            refetchOnWindowFocus: false,
            // Prevent queries from running on server
            enabled: typeof window !== "undefined",
          },
          mutations: {
            retry: 1,
          },
        },
      }),
  )

  useEffect(() => {
    setMounted(true)
  }, [])

  // Prevent hydration mismatch by not rendering until mounted
  if (!mounted) {
    return null
  }

  return (
    <WagmiProvider config={config} initialState={initialState}>
      <QueryClientProvider client={queryClient}>
        <RainbowKitProvider
          theme={darkTheme({
            accentColor: "#F0B90B",
          })}
          modalSize="compact"
          showRecentTransactions={true}
        >
          {children}
        </RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  )
}
