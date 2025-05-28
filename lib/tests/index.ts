// Export types
export * from "./types"

// Export test creators
import type { TestCategory, TestCase, TestResult } from "./types"
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
export function getAllTestCategories(
  tokenContract: any,
  investmentContract: any,
  address: string | undefined,
): TestCategory[] {
  return [
    createTokenContractTests(tokenContract, tokenContract.contractAddress || ""),
    createInvestmentManagerTests(investmentContract, address),
    createDepositTests(investmentContract, address),
    createClaimTests(investmentContract, tokenContract, address),
    createReferralTests(investmentContract, address),
    createPoolTests(investmentContract),
    createUpdateTests(),
    createFlowTests(),
    createErrorTests(),
    createUITests(),
    createFormatTests(),
    createValidationTests(),
  ]
}

export type { TestCategory, TestCase, TestResult }
