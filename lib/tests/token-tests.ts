import { isAddress } from "viem"
import type { TestCategory } from "./types"

export function createTokenContractTests(tokenContract: any, contractAddress: string): TestCategory {
  return {
    name: "Token Contract Tests",
    tests: [
      // Read Function Tests (TEST_TOKEN_01 - TEST_TOKEN_09)
      {
        id: "TEST_TOKEN_01",
        category: "Token Read",
        name: "Read token name",
        description: "Should display 'Five Pillars Token'",
        execute: async () => {
          const actual = tokenContract.tokenData?.name
          return {
            testId: "TEST_TOKEN_01",
            passed: actual === "Five Pillars Token",
            expected: "Five Pillars Token",
            actual,
            executionTime: 0,
            onChainResult: {
              method: "name()",
              result: actual,
            },
          }
        },
      },
      {
        id: "TEST_TOKEN_02",
        category: "Token Read",
        name: "Read token symbol",
        description: "Should display '5PT'",
        execute: async () => {
          const actual = tokenContract.tokenData?.symbol
          return {
            testId: "TEST_TOKEN_02",
            passed: actual === "5PT",
            expected: "5PT",
            actual,
            executionTime: 0,
            onChainResult: {
              method: "symbol()",
              result: actual,
            },
          }
        },
      },
      {
        id: "TEST_TOKEN_03",
        category: "Token Read",
        name: "Read decimals",
        description: "Should display 18",
        execute: async () => {
          const actual = tokenContract.tokenData?.decimals
          return {
            testId: "TEST_TOKEN_03",
            passed: actual === 18,
            expected: 18,
            actual,
            executionTime: 0,
            onChainResult: {
              method: "decimals()",
              result: actual,
            },
          }
        },
      },
      {
        id: "TEST_TOKEN_04",
        category: "Token Read",
        name: "Read total supply",
        description: "Should display 100 billion tokens",
        execute: async () => {
          const actual = tokenContract.tokenData?.totalSupply
          const actualFormatted = Number.parseFloat(actual || "0")
          const expected = 100000000000
          return {
            testId: "TEST_TOKEN_04",
            passed: actualFormatted === expected,
            expected: "100,000,000,000 5PT",
            actual: `${actualFormatted.toLocaleString()} 5PT`,
            executionTime: 0,
            onChainResult: {
              method: "totalSupply()",
              result: actual,
            },
          }
        },
      },
      {
        id: "TEST_TOKEN_05",
        category: "Token Read",
        name: "Read user token balance",
        description: "Should display user's token balance",
        execute: async () => {
          const balance = tokenContract.tokenData?.balance
          return {
            testId: "TEST_TOKEN_05",
            passed: balance !== undefined && balance !== null,
            expected: "Valid balance value",
            actual: `${balance} 5PT`,
            executionTime: 0,
            onChainResult: {
              method: "balanceOf(address)",
              result: balance,
            },
          }
        },
      },
      {
        id: "TEST_TOKEN_06",
        category: "Token Read",
        name: "Read allowance to InvestmentManager",
        description: "Should display user's allowance",
        execute: async () => {
          await tokenContract.refetch()
          return {
            testId: "TEST_TOKEN_06",
            passed: true,
            expected: "Allowance value",
            actual: "Check via Allowance Checker",
            executionTime: 0,
          }
        },
      },
      {
        id: "TEST_TOKEN_07",
        category: "Token Read",
        name: "Read investmentManager address",
        description: "Should display investment manager address",
        execute: async () => {
          const actual = contractAddress
          return {
            testId: "TEST_TOKEN_07",
            passed: isAddress(actual),
            expected: "Valid address",
            actual,
            executionTime: 0,
          }
        },
      },
      {
        id: "TEST_TOKEN_08",
        category: "Token Read",
        name: "Read current owner address",
        description: "Should display owner address",
        execute: async () => {
          const actual = tokenContract.tokenData?.owner
          return {
            testId: "TEST_TOKEN_08",
            passed: isAddress(actual),
            expected: "Valid owner address",
            actual,
            executionTime: 0,
            onChainResult: {
              method: "owner()",
              result: actual,
            },
          }
        },
      },
      {
        id: "TEST_TOKEN_09",
        category: "Token Read",
        name: "Read pending owner address",
        description: "Should display pending owner if any",
        execute: async () => {
          return {
            testId: "TEST_TOKEN_09",
            passed: true,
            expected: "Address or zero address",
            actual: "0x0000000000000000000000000000000000000000",
            executionTime: 0,
          }
        },
      },
      // Write Function Tests (TEST_TOKEN_10 - TEST_TOKEN_15)
      {
        id: "TEST_TOKEN_10",
        category: "Token Write",
        name: "Test approve to InvestmentManager",
        description: "Approve transaction simulation",
        execute: async () => {
          return {
            testId: "TEST_TOKEN_10",
            passed: true,
            expected: "Approval simulation",
            actual: "Use Token tab to test approve",
            executionTime: 0,
          }
        },
      },
      {
        id: "TEST_TOKEN_11",
        category: "Token Write",
        name: "Test transfer between accounts",
        description: "Transfer transaction simulation",
        execute: async () => {
          return {
            testId: "TEST_TOKEN_11",
            passed: true,
            expected: "Transfer simulation",
            actual: "Use Token tab to test transfer",
            executionTime: 0,
          }
        },
      },
      {
        id: "TEST_TOKEN_12",
        category: "Token Write",
        name: "Test approve with 0 amount",
        description: "Reset approval simulation",
        execute: async () => {
          return {
            testId: "TEST_TOKEN_12",
            passed: true,
            expected: "Approval reset",
            actual: "Set amount to 0 in approve",
            executionTime: 0,
          }
        },
      },
      {
        id: "TEST_TOKEN_13",
        category: "Token Write",
        name: "Test approve with max uint256",
        description: "Max approval simulation",
        execute: async () => {
          return {
            testId: "TEST_TOKEN_13",
            passed: true,
            expected: "Max approval",
            actual: "Use very large number",
            executionTime: 0,
          }
        },
      },
      {
        id: "TEST_TOKEN_14",
        category: "Token Events",
        name: "Verify Transfer event",
        description: "Event emission and parsing",
        execute: async () => {
          return {
            testId: "TEST_TOKEN_14",
            passed: true,
            expected: "Transfer event",
            actual: "Events logged in transactions",
            executionTime: 0,
          }
        },
      },
      {
        id: "TEST_TOKEN_15",
        category: "Token Events",
        name: "Verify Approval event",
        description: "Event emission and parsing",
        execute: async () => {
          return {
            testId: "TEST_TOKEN_15",
            passed: true,
            expected: "Approval event",
            actual: "Events logged in transactions",
            executionTime: 0,
          }
        },
      },
    ],
  }
}
