import { Dashboard } from "@/components/dashboard"
import { Providers } from "@/components/providers"
import { headers } from "next/headers"
import { WalletErrorBoundary } from "@/components/error-boundary"

export default async function Page() {
  const cookieHeader = (await headers()).get("cookie")

  return (
    <Providers cookie={cookieHeader}>
      <WalletErrorBoundary>
        <Dashboard />
      </WalletErrorBoundary>
    </Providers>
  )
}
