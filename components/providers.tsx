"use client"

import type React from "react"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { WagmiProvider, cookieToInitialState } from "wagmi"
import { RainbowKitProvider, darkTheme } from "@rainbow-me/rainbowkit"
import { config } from "@/lib/config"
import { useState, useEffect } from "react"

export function Providers({
  children,
  cookie,
}: {
  children: React.ReactNode
  cookie?: string
}) {
  const [mounted, setMounted] = useState(false)
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 60 * 1000,
            gcTime: 10 * 60 * 1000,
            retry: 3,
            refetchOnWindowFocus: false,
          },
        },
      }),
  )

  useEffect(() => {
    setMounted(true)
  }, [])

  // Don't render providers until mounted to avoid hydration issues
  if (!mounted) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>
  }

  const initialState = cookieToInitialState(config, cookie)

  return (
    <WagmiProvider config={config} initialState={initialState}>
      <QueryClientProvider client={queryClient}>
        <RainbowKitProvider
          theme={darkTheme({
            accentColor: "#F0B90B",
            accentColorForeground: "white",
          })}
          modalSize="compact"
        >
          {children}
        </RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  )
}
