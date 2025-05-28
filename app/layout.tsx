import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import '@rainbow-me/rainbowkit/styles.css
import "./globals.css"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Five Pillars Developer Dashboard",
  description: "Test and debug Five Pillars smart contracts",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>{children}</body>
    </html>
  )
}
