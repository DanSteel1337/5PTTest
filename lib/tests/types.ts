export interface TestCase {
  id: string
  category: string
  name: string
  description: string
  execute: () => Promise<TestResult>
  skip?: boolean
}

export interface TestResult {
  testId: string
  passed: boolean
  expected: any
  actual: any
  error?: string
  transactionHash?: string
  gasUsed?: bigint
  executionTime: number
  onChainResult?: {
    method: string
    result: any
  }
}

export interface TestCategory {
  name: string
  tests: TestCase[]
}

// Test helper functions
export const compareValues = (expected: any, actual: any, tolerance = 0): boolean => {
  if (typeof expected === "number" && typeof actual === "number") {
    return Math.abs(expected - actual) <= tolerance
  }
  return expected === actual
}

export const formatTestValue = (value: any): string => {
  if (typeof value === "bigint") {
    return value.toString()
  }
  if (typeof value === "object") {
    return JSON.stringify(value, null, 2)
  }
  return String(value)
}
