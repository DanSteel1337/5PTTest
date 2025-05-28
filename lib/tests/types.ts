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

export interface TestCase {
  id: string
  category: string
  name: string
  description: string
  skip?: boolean
  execute: () => Promise<TestResult>
}

export interface TestCategory {
  name: string
  description: string
  tests: TestCase[]
}

// Helper function to create a default test result
export function createDefaultTestResult(testId: string): TestResult {
  return {
    testId,
    passed: false,
    expected: "Test to execute successfully",
    actual: "Test not executed",
    executionTime: 0,
  }
}

// Helper function to safely create a test case
export function createTestCase(
  id: string,
  category: string,
  name: string,
  description: string,
  execute: () => Promise<TestResult>,
  skip?: boolean,
): TestCase {
  return {
    id,
    category,
    name,
    description,
    skip,
    execute: async () => {
      try {
        return await execute()
      } catch (error) {
        return {
          testId: id,
          passed: false,
          expected: "Test to execute without errors",
          actual: "Test execution failed",
          error: error instanceof Error ? error.message : String(error),
          executionTime: 0,
        }
      }
    },
  }
}
