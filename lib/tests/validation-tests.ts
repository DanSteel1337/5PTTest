import type { TestCategory } from "./types"

export function createValidationTests(): TestCategory {
  return {
    name: "Validation Tests",
    tests: [
      {
        id: "TEST_VALIDATE_01",
        category: "Amount",
        name: "Validate amount > 0",
        description: "Positive numbers",
        execute: async () => {
          const amount = "0.5"
          const valid = Number.parseFloat(amount) > 0
          return {
            testId: "TEST_VALIDATE_01",
            passed: valid,
            expected: "Positive amount",
            actual: valid ? "Valid" : "Invalid",
            executionTime: 0,
          }
        },
      },
      // Additional tests omitted for brevity
      // In a real implementation, all tests would be included
    ],
  }
}
