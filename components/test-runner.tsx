"use client"

import { useState, useEffect } from "react"
import { useAccount } from "wagmi"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import {
  CheckCircle2,
  XCircle,
  Clock,
  Play,
  Pause,
  RotateCw,
  ChevronRight,
  ChevronDown,
  FileText,
  Download,
  AlertCircle,
  Zap,
} from "lucide-react"
import { useFivePillarsToken } from "@/hooks/use-five-pillars-token"
import { useInvestmentManager } from "@/hooks/use-investment-manager"
import { cn } from "@/lib/utils"
import { getAllTestCategories, type TestResult, type TestCase } from "@/lib/tests"
import { Alert, AlertDescription } from "@/components/ui/alert"

export function TestRunner() {
  const { address } = useAccount()
  const tokenContract = useFivePillarsToken()
  const investmentContract = useInvestmentManager()

  const [isRunning, setIsRunning] = useState(false)
  const [currentTest, setCurrentTest] = useState<string | null>(null)
  const [results, setResults] = useState<Map<string, TestResult>>(new Map())
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(new Set())
  const [selectedResult, setSelectedResult] = useState<TestResult | null>(null)
  const [runningCategory, setRunningCategory] = useState<string | null>(null)
  const [categories, setCategories] = useState<ReturnType<typeof getAllTestCategories>>([])
  const [mounted, setMounted] = useState(false)

  // First effect just for mounting
  useEffect(() => {
    setMounted(true)
  }, [])

  // Second effect for loading test categories after mounting
  useEffect(() => {
    if (!mounted) return

    try {
      // Safely get categories with proper fallbacks
      const cats = getAllTestCategories(tokenContract, investmentContract, address || "")
      setCategories(cats || [])
    } catch (error) {
      console.error("Error loading test categories:", error)
      setCategories([])
    }
  }, [mounted, tokenContract, investmentContract, address])

  // Safely calculate derived values with fallbacks
  const totalTests = categories?.reduce((sum, cat) => sum + (cat.tests?.length || 0), 0) || 0
  const completedTests = results?.size || 0
  const passedTests = Array.from(results?.values() || []).filter((r) => r?.passed).length
  const failedTests = Array.from(results?.values() || []).filter((r) => !r?.passed).length
  const progress = totalTests > 0 ? (completedTests / totalTests) * 100 : 0

  const runTest = async (test: TestCase): Promise<TestResult> => {
    if (!test || typeof test.execute !== "function") {
      return {
        testId: test?.id || "unknown",
        passed: false,
        expected: null,
        actual: null,
        error: "Invalid test case",
        executionTime: 0,
      }
    }

    const startTime = Date.now()
    try {
      const result = await test.execute()
      result.executionTime = Date.now() - startTime
      return result
    } catch (error) {
      return {
        testId: test.id,
        passed: false,
        expected: null,
        actual: null,
        error: error instanceof Error ? error.message : String(error),
        executionTime: Date.now() - startTime,
      }
    }
  }

  const runAllTests = async () => {
    if (!categories || categories.length === 0) return

    setIsRunning(true)
    setResults(new Map())

    for (const category of categories) {
      if (!category || !category.tests) continue

      setRunningCategory(category.name)
      for (const test of category.tests) {
        if (!test || test.skip) continue

        setCurrentTest(test.id)
        const result = await runTest(test)
        setResults((prev) => new Map(prev).set(test.id, result))
        // Small delay to show progress
        await new Promise((resolve) => setTimeout(resolve, 50))
      }
    }

    setIsRunning(false)
    setCurrentTest(null)
    setRunningCategory(null)
  }

  const runCategory = async (categoryName: string) => {
    if (!categories) return

    const category = categories.find((c) => c?.name === categoryName)
    if (!category || !category.tests) return

    setIsRunning(true)
    setRunningCategory(categoryName)

    for (const test of category.tests) {
      if (!test || test.skip) continue

      setCurrentTest(test.id)
      const result = await runTest(test)
      setResults((prev) => new Map(prev).set(test.id, result))
      await new Promise((resolve) => setTimeout(resolve, 50))
    }

    setIsRunning(false)
    setCurrentTest(null)
    setRunningCategory(null)
  }

  const exportResults = () => {
    if (!categories) return

    const exportData = {
      timestamp: new Date().toISOString(),
      network: "BSC Testnet",
      address,
      totalTests,
      passedTests,
      failedTests,
      passRate: totalTests > 0 ? ((passedTests / totalTests) * 100).toFixed(2) : "0",
      categories: categories.map((cat) => ({
        name: cat?.name || "Unknown",
        tests: (cat?.tests || []).map((test) => ({
          ...test,
          result: results.get(test.id),
        })),
      })),
    }

    const blob = new Blob([JSON.stringify(exportData, null, 2)], {
      type: "application/json",
    })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `five-pillars-test-results-${Date.now()}.json`
    a.click()
    URL.revokeObjectURL(url)
  }

  const toggleCategory = (categoryName: string) => {
    setExpandedCategories((prev) => {
      const next = new Set(prev)
      if (next.has(categoryName)) {
        next.delete(categoryName)
      } else {
        next.add(categoryName)
      }
      return next
    })
  }

  const getTestStatus = (testId: string): "pending" | "running" | "passed" | "failed" => {
    if (currentTest === testId) return "running"
    const result = results.get(testId)
    if (!result) return "pending"
    return result.passed ? "passed" : "failed"
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "running":
        return <Clock className="h-4 w-4 animate-spin text-yellow-500" />
      case "passed":
        return <CheckCircle2 className="h-4 w-4 text-green-500" />
      case "failed":
        return <XCircle className="h-4 w-4 text-red-500" />
      default:
        return <Clock className="h-4 w-4 text-gray-400" />
    }
  }

  // Show loading state while not mounted
  if (!mounted) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Automated Test Runner</CardTitle>
              <CardDescription>Execute all {totalTests} tests to verify contract functionality</CardDescription>
            </div>
            <div className="flex items-center gap-2">
              <Button onClick={runAllTests} disabled={isRunning || !address || categories.length === 0} size="lg">
                {isRunning ? (
                  <>
                    <Pause className="mr-2 h-4 w-4" />
                    Running...
                  </>
                ) : (
                  <>
                    <Play className="mr-2 h-4 w-4" />
                    Run All Tests
                  </>
                )}
              </Button>
              <Button onClick={() => setResults(new Map())} variant="outline" disabled={isRunning}>
                <RotateCw className="mr-2 h-4 w-4" />
                Reset
              </Button>
              <Button onClick={exportResults} variant="outline" disabled={results.size === 0}>
                <Download className="mr-2 h-4 w-4" />
                Export
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {/* Progress */}
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>
                  Progress: {completedTests} / {totalTests} tests
                </span>
                <span>{progress.toFixed(1)}%</span>
              </div>
              <Progress value={progress} className="h-2" />
            </div>

            {/* Statistics */}
            <div className="grid grid-cols-4 gap-4">
              <Card>
                <CardContent className="p-4">
                  <div className="text-2xl font-bold">{totalTests}</div>
                  <div className="text-sm text-muted-foreground">Total Tests</div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4">
                  <div className="text-2xl font-bold text-green-600">{passedTests}</div>
                  <div className="text-sm text-muted-foreground">Passed</div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4">
                  <div className="text-2xl font-bold text-red-600">{failedTests}</div>
                  <div className="text-sm text-muted-foreground">Failed</div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4">
                  <div className="text-2xl font-bold text-blue-600">
                    {totalTests > 0 ? ((passedTests / totalTests) * 100).toFixed(1) : "0"}%
                  </div>
                  <div className="text-sm text-muted-foreground">Pass Rate</div>
                </CardContent>
              </Card>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Test Categories */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Test List */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Test Categories</CardTitle>
              <CardDescription>Click on a test to view details</CardDescription>
            </CardHeader>
            <CardContent>
              {categories.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <FileText className="h-12 w-12 mx-auto mb-2 opacity-50" />
                  <p>No test categories available</p>
                  {!address && <p className="mt-2 text-sm">Connect your wallet to load tests</p>}
                </div>
              ) : (
                <ScrollArea className="h-[600px] pr-4">
                  <div className="space-y-4">
                    {categories.map((category, idx) => {
                      if (!category || !category.tests) return null

                      const categoryTests = category.tests
                      const categoryPassed = categoryTests.filter((t) => results.get(t.id)?.passed).length
                      const categoryCompleted = categoryTests.filter((t) => results.has(t.id)).length
                      const isExpanded = expandedCategories.has(category.name)
                      const isRunning = runningCategory === category.name

                      return (
                        <div key={category.name || idx} className="border rounded-lg">
                          <div
                            className="flex items-center justify-between p-4 cursor-pointer hover:bg-muted/50"
                            onClick={() => toggleCategory(category.name)}
                          >
                            <div className="flex items-center gap-2">
                              {isExpanded ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
                              <h3 className="font-medium">{category.name}</h3>
                              <Badge variant="outline">
                                {categoryCompleted} / {categoryTests.length}
                              </Badge>
                              {categoryCompleted === categoryTests.length && categoryTests.length > 0 && (
                                <Badge variant={categoryPassed === categoryTests.length ? "success" : "destructive"}>
                                  {categoryPassed === categoryTests.length
                                    ? "All Passed"
                                    : `${categoryTests.length - categoryPassed} Failed`}
                                </Badge>
                              )}
                            </div>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={(e) => {
                                e.stopPropagation()
                                runCategory(category.name)
                              }}
                              disabled={isRunning || !address}
                            >
                              {isRunning && runningCategory === category.name ? (
                                <>
                                  <Pause className="mr-1 h-3 w-3" />
                                  Running
                                </>
                              ) : (
                                <>
                                  <Zap className="mr-1 h-3 w-3" />
                                  Run
                                </>
                              )}
                            </Button>
                          </div>

                          {isExpanded && (
                            <div className="border-t">
                              {categoryTests.map((test) => {
                                if (!test) return null

                                const status = getTestStatus(test.id)
                                const result = results.get(test.id)

                                return (
                                  <div
                                    key={test.id}
                                    className={cn(
                                      "flex items-center justify-between p-3 border-b last:border-b-0 cursor-pointer hover:bg-muted/50",
                                      selectedResult?.testId === test.id && "bg-muted",
                                    )}
                                    onClick={() => setSelectedResult(result || null)}
                                  >
                                    <div className="flex items-center gap-3">
                                      {getStatusIcon(status)}
                                      <div>
                                        <div className="font-medium text-sm">{test.id}</div>
                                        <div className="text-xs text-muted-foreground">{test.name}</div>
                                      </div>
                                    </div>
                                    {result && (
                                      <div className="text-xs text-muted-foreground">{result.executionTime}ms</div>
                                    )}
                                  </div>
                                )
                              })}
                            </div>
                          )}
                        </div>
                      )
                    })}
                  </div>
                </ScrollArea>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Test Details */}
        <div>
          <Card>
            <CardHeader>
              <CardTitle>Test Details</CardTitle>
              <CardDescription>
                {selectedResult ? selectedResult.testId : "Select a test to view details"}
              </CardDescription>
            </CardHeader>
            <CardContent>
              {selectedResult ? (
                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    {selectedResult.passed ? (
                      <CheckCircle2 className="h-5 w-5 text-green-500" />
                    ) : (
                      <XCircle className="h-5 w-5 text-red-500" />
                    )}
                    <span className="font-medium text-lg">{selectedResult.passed ? "Passed" : "Failed"}</span>
                  </div>

                  <Separator />

                  <div className="space-y-3">
                    <div>
                      <h4 className="font-medium mb-1">Expected Result</h4>
                      <div className="bg-muted p-3 rounded text-sm font-mono">
                        {typeof selectedResult.expected === "object"
                          ? JSON.stringify(selectedResult.expected, null, 2)
                          : String(selectedResult.expected)}
                      </div>
                    </div>

                    <div>
                      <h4 className="font-medium mb-1">Actual Result</h4>
                      <div
                        className={cn(
                          "p-3 rounded text-sm font-mono",
                          selectedResult.passed ? "bg-green-50" : "bg-red-50",
                        )}
                      >
                        {typeof selectedResult.actual === "object"
                          ? JSON.stringify(selectedResult.actual, null, 2)
                          : String(selectedResult.actual)}
                      </div>
                    </div>

                    {selectedResult.error && (
                      <div>
                        <h4 className="font-medium mb-1">Error</h4>
                        <Alert>
                          <AlertCircle className="h-4 w-4" />
                          <AlertDescription className="font-mono text-sm">{selectedResult.error}</AlertDescription>
                        </Alert>
                      </div>
                    )}

                    {selectedResult.onChainResult && (
                      <div>
                        <h4 className="font-medium mb-1">On-Chain Verification</h4>
                        <div className="bg-muted p-3 rounded text-sm">
                          <div className="space-y-1">
                            <div className="flex justify-between">
                              <span>Method:</span>
                              <span className="font-mono">{selectedResult.onChainResult.method}</span>
                            </div>
                            <div className="flex justify-between">
                              <span>Result:</span>
                              <span className="font-mono">
                                {typeof selectedResult.onChainResult.result === "object"
                                  ? JSON.stringify(selectedResult.onChainResult.result)
                                  : String(selectedResult.onChainResult.result)}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}

                    {selectedResult.transactionHash && (
                      <div>
                        <h4 className="font-medium mb-1">Transaction</h4>
                        <a
                          href={`https://testnet.bscscan.com/tx/${selectedResult.transactionHash}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-500 hover:underline text-sm font-mono"
                        >
                          {selectedResult.transactionHash.substring(0, 10)}...
                          {selectedResult.transactionHash.substring(selectedResult.transactionHash.length - 8)}
                        </a>
                      </div>
                    )}

                    <div className="flex justify-between text-sm">
                      <span>Execution Time:</span>
                      <span>{selectedResult.executionTime}ms</span>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-center text-muted-foreground py-8">
                  <FileText className="h-12 w-12 mx-auto mb-2 opacity-50" />
                  <p>Select a test to view its details</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
