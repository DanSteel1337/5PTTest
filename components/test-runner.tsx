"use client"

import { useState, useEffect } from "react"
import { useAccount } from "wagmi"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import { CheckCircle, XCircle, Clock, AlertCircle } from "lucide-react"
import { useFivePillarsToken } from "@/hooks/use-five-pillars-token"
import { useInvestmentManager } from "@/hooks/use-investment-manager"
import { getAllTestCategories, type TestResult, type TestCase } from "@/lib/tests"

export function TestRunner() {
  const { address } = useAccount()
  const tokenContract = useFivePillarsToken()
  const investmentContract = useInvestmentManager()
  const [mounted, setMounted] = useState(false)
  const [testCategories, setTestCategories] = useState<any[]>([])
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const [testResults, setTestResults] = useState<Record<string, TestResult>>({})
  const [runningTests, setRunningTests] = useState(false)
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    setMounted(true)
    if (mounted) {
      const categories = getAllTestCategories(tokenContract, investmentContract, address)
      setTestCategories(categories)
      if (categories.length > 0 && !selectedCategory) {
        setSelectedCategory(categories[0].name)
      }
    }
  }, [mounted, tokenContract, investmentContract, address, selectedCategory])

  const runAllTests = async () => {
    setRunningTests(true)
    setProgress(0)
    setTestResults({})

    const allTests = testCategories.flatMap((category) => category.tests)
    let completedTests = 0

    for (const test of allTests) {
      if (test.skip) continue
      try {
        const result = await test.execute()
        setTestResults((prev) => ({ ...prev, [test.id]: result }))
      } catch (error) {
        setTestResults((prev) => ({
          ...prev,
          [test.id]: {
            testId: test.id,
            passed: false,
            expected: "Test to complete without errors",
            actual: "Test threw an exception",
            error: error instanceof Error ? error.message : String(error),
            executionTime: 0,
          },
        }))
      }
      completedTests++
      setProgress((completedTests / allTests.length) * 100)
    }

    setRunningTests(false)
  }

  const runCategoryTests = async (categoryName: string) => {
    setRunningTests(true)
    setProgress(0)

    const category = testCategories.find((c) => c.name === categoryName)
    if (!category) {
      setRunningTests(false)
      return
    }

    const tests = category.tests
    let completedTests = 0

    for (const test of tests) {
      if (test.skip) continue
      try {
        const result = await test.execute()
        setTestResults((prev) => ({ ...prev, [test.id]: result }))
      } catch (error) {
        setTestResults((prev) => ({
          ...prev,
          [test.id]: {
            testId: test.id,
            passed: false,
            expected: "Test to complete without errors",
            actual: "Test threw an exception",
            error: error instanceof Error ? error.message : String(error),
            executionTime: 0,
          },
        }))
      }
      completedTests++
      setProgress((completedTests / tests.length) * 100)
    }

    setRunningTests(false)
  }

  if (!mounted) {
    return <div>Loading test runner...</div>
  }

  const selectedCategoryTests = selectedCategory
    ? testCategories.find((c) => c.name === selectedCategory)?.tests || []
    : []

  const passedTests = Object.values(testResults).filter((r) => r.passed).length
  const failedTests = Object.values(testResults).filter((r) => !r.passed).length
  const totalRun = Object.values(testResults).length

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Contract Test Runner</CardTitle>
        <CardDescription>Run tests to verify contract functionality</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Test Controls */}
        <div className="flex flex-wrap gap-2">
          <Button onClick={runAllTests} disabled={runningTests}>
            Run All Tests
          </Button>
          {testCategories.map((category) => (
            <Button
              key={category.name}
              variant={selectedCategory === category.name ? "default" : "outline"}
              onClick={() => setSelectedCategory(category.name)}
              disabled={runningTests}
            >
              {category.name}
            </Button>
          ))}
        </div>

        {/* Progress */}
        {runningTests && (
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Running tests...</span>
              <span>{Math.round(progress)}%</span>
            </div>
            <Progress value={progress} />
          </div>
        )}

        {/* Test Results Summary */}
        {totalRun > 0 && !runningTests && (
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="font-medium">Test Results</span>
              <span>
                {passedTests} passed, {failedTests} failed, {totalRun} total
              </span>
            </div>
            <Progress
              value={(passedTests / totalRun) * 100}
              className={`h-2 ${failedTests > 0 ? "bg-red-100" : "bg-green-100"}`}
            />
          </div>
        )}

        {/* Selected Category */}
        {selectedCategory && (
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-medium">{selectedCategory}</h3>
              <Button onClick={() => runCategoryTests(selectedCategory)} disabled={runningTests} size="sm">
                Run Category
              </Button>
            </div>

            <ScrollArea className="h-[400px] rounded-md border p-4">
              <div className="space-y-4">
                {selectedCategoryTests.map((test: TestCase) => {
                  const result = testResults[test.id]
                  return (
                    <div key={test.id} className="space-y-2">
                      <div className="flex items-start justify-between">
                        <div>
                          <h4 className="font-medium">{test.name}</h4>
                          <p className="text-sm text-muted-foreground">{test.description}</p>
                        </div>
                        {result ? (
                          <div className="flex items-center gap-2">
                            {result.passed ? (
                              <CheckCircle className="h-5 w-5 text-green-500" />
                            ) : (
                              <XCircle className="h-5 w-5 text-red-500" />
                            )}
                            <span className="text-sm text-muted-foreground">{result.executionTime.toFixed(2)}ms</span>
                          </div>
                        ) : (
                          <div className="flex items-center gap-2">
                            <Clock className="h-5 w-5 text-muted-foreground" />
                            <span className="text-sm text-muted-foreground">Not run</span>
                          </div>
                        )}
                      </div>

                      {result && (
                        <div className="rounded-md bg-muted p-3 text-sm">
                          <div className="flex justify-between">
                            <span className="font-medium">Expected:</span>
                            <span>{result.expected}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="font-medium">Actual:</span>
                            <span>{result.actual}</span>
                          </div>
                          {result.error && (
                            <div className="mt-2 flex items-start gap-2 text-red-500">
                              <AlertCircle className="h-4 w-4 mt-0.5" />
                              <span>{result.error}</span>
                            </div>
                          )}
                          {result.transactionHash && (
                            <div className="mt-2">
                              <span className="font-medium">Tx Hash:</span>
                              <span className="font-mono text-xs ml-2">{result.transactionHash}</span>
                            </div>
                          )}
                        </div>
                      )}
                      <Separator />
                    </div>
                  )
                })}
              </div>
            </ScrollArea>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
