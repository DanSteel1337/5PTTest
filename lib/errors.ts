export function parseContractError(error: Error | null): string | null {
  if (!error) return null

  const errorMessage = error.message

  // Five Pillars specific errors
  if (errorMessage.includes("DepositNotYetAvailable")) {
    return "You must wait 4 hours between deposits. Please try again later."
  } else if (errorMessage.includes("SmallDepositOrClaimAmount")) {
    return "Minimum amount for deposit or claim is 1 token."
  } else if (errorMessage.includes("RefererAlreadySetted")) {
    return "Referrer can only be set on your first deposit."
  } else if (errorMessage.includes("InvalidReferer")) {
    return "Invalid referrer address provided."
  } else if (errorMessage.includes("HalfRequirementViolated")) {
    return "Pool criteria update violates half requirement rule."
  }

  // Generic errors
  if (errorMessage.includes("insufficient funds")) {
    return "Insufficient funds for transaction. Check your BNB balance for gas."
  } else if (errorMessage.includes("user rejected")) {
    return "Transaction was rejected in your wallet."
  }

  return errorMessage
}
