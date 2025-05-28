"use client"

import { useEffect } from "react"
import { cssStringFromTheme, darkTheme } from "@rainbow-me/rainbowkit"

export function RainbowKitStyles() {
  useEffect(() => {
    // Only run on client
    if (typeof document !== "undefined") {
      const customStyles = document.createElement("style")
      customStyles.textContent = cssStringFromTheme(
        darkTheme({
          accentColor: "#F0B90B",
          accentColorForeground: "white",
        }),
      )
      document.head.appendChild(customStyles)

      return () => {
        document.head.removeChild(customStyles)
      }
    }
  }, [])

  return null
}
