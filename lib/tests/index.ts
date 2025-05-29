// Export types
export type { TestCategory, TestCase, TestResult } from "./types"

// Export test creators
import type { TestCategory } from "./types"
import { createTokenContractTests } from "./token-tests"
import { createInvestmentManagerTests } from "./investment-tests"
import { createDepositTests } from "./deposit-tests"
import { createClaimTests } from "./claim-tests"
import { createReferralTests } from "./referral-tests"
import { createPoolTests } from "./pool-tests"
import { createUpdateTests } from "./update-tests"
import { createFlowTests } from "./flow-tests"
import { createErrorTests } from "./error-tests"
import { createUITests } from "./ui-tests"
import { createFormatTests } from "./format-tests"
import { createValidationTests } from "./validation-tests"

// Main function to get all test categories
export function getAllTestCategories(tokenContract: any, investmentContract: any, address = ""): TestCategory[] {
  // Ensure we have valid inputs or provide defaults
  if (!tokenContract || !investmentContract) {
    console.warn("Missing contract data for tests")
    return []
  }

  // Ensure address is always a string
  const safeAddress = address || ""

  try {
    return [
      createTokenContractTests(tokenContract, tokenContract.contractAddress || ""),
      createInvestmentManagerTests(investmentContract, safeAddress),
      createDepositTests(investmentContract, safeAddress),
      createClaimTests(investmentContract, tokenContract, safeAddress),
      createReferralTests(investmentContract, safeAddress),
      createPoolTests(investmentContract),
      createUpdateTests(),
      createFlowTests(),
      createErrorTests(),
      createUITests(),
      createFormatTests(),
      createValidationTests(),
    ].filter(Boolean) // Filter out any undefined categories
  } catch (error) {
    console.error("Error creating test categories:", error)
    return []
  }
}
