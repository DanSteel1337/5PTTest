import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import '@rainbow-me/rainbowkit/styles.css'
import "./globals.css"
import { Providers } from "@/components/providers"
import { headers } from "next/headers"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Five Pillars Investment Platform",
  description: "BSC-based investment and rewards platform",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const cookie = headers().get("cookie") ?? ""
  
  return (
    <html lang="en">
      <body className={inter.className}>
        <Providers cookie={cookie}>
          {children}
        </Providers>
      </body>
    </html>
  )
}
