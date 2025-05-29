// Test result interface
export interface TestResult {
  testId: string
  passed: boolean
  expected: any
  actual: any
  error?: string
  executionTime: number
  transactionHash?: string
  onChainResult?: {
    method: string
    result: any
  }
}

// Individual test case interface
export interface TestCase {
  id: string
  name: string
  description?: string
  skip?: boolean
  execute: () => Promise<TestResult>
}

// Test category interface
export interface TestCategory {
  name: string
  description?: string
  tests: TestCase[]
}

// Test execution context
export interface TestContext {
  address: string
  tokenContract: any
  investmentContract: any
}

// Test validation helpers
export interface ValidationResult {
  isValid: boolean
  errors: string[]
}

// Mock data interfaces for testing
export interface MockInvestorData {
  totalDepositAmount: string
  directReferralsCount: number
  directRefsDeposit: string
  referer: string
  lastDepositTimestamp: number
}

export interface MockPoolData {
  id: number
  isActive: boolean
  minInvestmentAmount: string
  minDirectReferralsCount: number
  minDirectReferralsDeposit: string
  curReward: string
  participantsCount: number
}

// Test utilities
export interface TestUtilities {
  parseContractError: (error: Error) => string
  formatTokenAmount: (amount: string) => string
  validateAddress: (address: string) => boolean
  calculateTimeRemaining: (timestamp: number) => { canDeposit: boolean; timeRemaining: string }
}
