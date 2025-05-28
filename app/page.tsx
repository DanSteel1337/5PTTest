import { Dashboard } from "@/components/dashboard"
import { WalletErrorBoundary } from "@/components/error-boundary"

export default function Page() {
  return (
    <WalletErrorBoundary>
      <Dashboard />
    </WalletErrorBoundary>
  )
}
