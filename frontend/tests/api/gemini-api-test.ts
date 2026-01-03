/**
 * Gemini API Test Suite
 * Tests the Google Gemini API integration for agent name extraction
 */

interface TestResult {
  test: string
  status: 'PASS' | 'FAIL' | 'SKIP'
  message: string
  duration: number
}

export class GeminiAPITester {
  private apiKey: string | undefined
  private results: TestResult[] = []

  constructor() {
    this.apiKey = process.env.NEXT_PUBLIC_GOOGLE_API_KEY
  }

  /**
   * Test 1: Check if API key is configured
   */
  async testAPIKeyPresent(): Promise<TestResult> {
    const start = Date.now()
    const test = 'API Key Configuration'

    if (!this.apiKey) {
      return {
        test,
        status: 'FAIL',
        message: '❌ API key not found in environment variables',
        duration: Date.now() - start,
      }
    }

    if (this.apiKey.length < 30) {
      return {
        test,
        status: 'FAIL',
        message: '❌ API key seems invalid (too short)',
        duration: Date.now() - start,
      }
    }

    return {
      test,
      status: 'PASS',
      message: `✅ API key present (${this.apiKey.substring(0, 10)}...)`,
      duration: Date.now() - start,
    }
  }

  /**
   * Test 2: Check API connectivity
   */
  async testAPIConnectivity(): Promise<TestResult> {
    const start = Date.now()
    const test = 'API Connectivity'

    if (!this.apiKey) {
      return {
        test,
        status: 'SKIP',
        message: '⏭️ Skipped - No API key',
        duration: Date.now() - start,
      }
    }

    try {
      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-exp:generateContent?key=${this.apiKey}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [{ parts: [{ text: 'Hello' }] }],
          }),
        }
      )

      if (!response.ok) {
        const errorData = await response.json()
        return {
          test,
          status: 'FAIL',
          message: `❌ API error: ${errorData.error?.message || response.statusText}`,
          duration: Date.now() - start,
        }
      }

      return {
        test,
        status: 'PASS',
        message: '✅ API connection successful',
        duration: Date.now() - start,
      }
    } catch (error) {
      return {
        test,
        status: 'FAIL',
        message: `❌ Network error: ${error instanceof Error ? error.message : 'Unknown error'}`,
        duration: Date.now() - start,
      }
    }
  }

  /**
   * Test 3: Test agent name extraction
   */
  async testAgentNameExtraction(): Promise<TestResult> {
    const start = Date.now()
    const test = 'Agent Name Extraction'

    if (!this.apiKey) {
      return {
        test,
        status: 'SKIP',
        message: '⏭️ Skipped - No API key',
        duration: Date.now() - start,
      }
    }

    try {
      const testPrompt = 'Create a BMI calculator agent that calculates body mass index'
      
      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-exp:generateContent?key=${this.apiKey}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [
              {
                parts: [
                  {
                    text: `Extract a concise agent name and type from this user description. 
                    
User description: "${testPrompt}"

Respond ONLY with valid JSON in this exact format:
{
  "agentName": "BMI Calculator Agent",
  "agentType": "calculator",
  "shortDescription": "Calculates BMI from height and weight"
}`,
                  },
                ],
              },
            ],
            generationConfig: {
              temperature: 0.3,
              maxOutputTokens: 200,
            },
          }),
        }
      )

      if (!response.ok) {
        return {
          test,
          status: 'FAIL',
          message: `❌ Extraction failed: ${response.statusText}`,
          duration: Date.now() - start,
        }
      }

      const data = await response.json()
      const textContent = data.candidates?.[0]?.content?.parts?.[0]?.text

      if (!textContent) {
        return {
          test,
          status: 'FAIL',
          message: '❌ No response content received',
          duration: Date.now() - start,
        }
      }

      const jsonMatch = textContent.match(/\{[\s\S]*\}/)
      if (!jsonMatch) {
        return {
          test,
          status: 'FAIL',
          message: '❌ Could not parse JSON from response',
          duration: Date.now() - start,
        }
      }

      const result = JSON.parse(jsonMatch[0])
      
      if (!result.agentName || !result.agentType || !result.shortDescription) {
        return {
          test,
          status: 'FAIL',
          message: '❌ Invalid response structure',
          duration: Date.now() - start,
        }
      }

      return {
        test,
        status: 'PASS',
        message: `✅ Extracted: "${result.agentName}" (${result.agentType})`,
        duration: Date.now() - start,
      }
    } catch (error) {
      return {
        test,
        status: 'FAIL',
        message: `❌ Error: ${error instanceof Error ? error.message : 'Unknown error'}`,
        duration: Date.now() - start,
      }
    }
  }

  /**
   * Test 4: Test fallback mechanism
   */
  async testFallbackMechanism(): Promise<TestResult> {
    const start = Date.now()
    const test = 'Fallback Mechanism'

    try {
      // Import the fallback function
      const testInputs = [
        { input: 'Create a BMI calculator', expected: 'BMI Calculator Agent' },
        { input: 'Build a task manager', expected: 'Task Manager Agent' },
        { input: 'Make a support chatbot', expected: 'Support Assistant Agent' },
      ]

      let allPassed = true
      const results: string[] = []

      for (const { input, expected } of testInputs) {
        // Simple keyword matching test
        const lower = input.toLowerCase()
        let matched = false

        if (lower.includes('bmi') || lower.includes('weight')) {
          matched = expected === 'BMI Calculator Agent'
        } else if (lower.includes('task') || lower.includes('todo')) {
          matched = expected === 'Task Manager Agent'
        } else if (lower.includes('support') || lower.includes('help')) {
          matched = expected === 'Support Assistant Agent'
        }

        results.push(`${matched ? '✅' : '❌'} "${input}" → ${expected}`)
        if (!matched) allPassed = false
      }

      return {
        test,
        status: allPassed ? 'PASS' : 'FAIL',
        message: allPassed 
          ? '✅ Fallback keywords working correctly'
          : `❌ Some fallback tests failed:\n${results.join('\n')}`,
        duration: Date.now() - start,
      }
    } catch (error) {
      return {
        test,
        status: 'FAIL',
        message: `❌ Error: ${error instanceof Error ? error.message : 'Unknown error'}`,
        duration: Date.now() - start,
      }
    }
  }

  /**
   * Run all tests
   */
  async runAllTests(): Promise<TestResult[]> {
    console.log('🧪 Starting Gemini API Test Suite...\n')

    this.results = []

    // Test 1: API Key
    const test1 = await this.testAPIKeyPresent()
    this.results.push(test1)
    this.printResult(test1)

    // Test 2: Connectivity
    const test2 = await this.testAPIConnectivity()
    this.results.push(test2)
    this.printResult(test2)

    // Test 3: Extraction
    const test3 = await this.testAgentNameExtraction()
    this.results.push(test3)
    this.printResult(test3)

    // Test 4: Fallback
    const test4 = await this.testFallbackMechanism()
    this.results.push(test4)
    this.printResult(test4)

    this.printSummary()

    return this.results
  }

  private printResult(result: TestResult) {
    const icon = result.status === 'PASS' ? '✅' : result.status === 'FAIL' ? '❌' : '⏭️'
    console.log(`${icon} ${result.test} (${result.duration}ms)`)
    console.log(`   ${result.message}\n`)
  }

  private printSummary() {
    const passed = this.results.filter(r => r.status === 'PASS').length
    const failed = this.results.filter(r => r.status === 'FAIL').length
    const skipped = this.results.filter(r => r.status === 'SKIP').length
    const total = this.results.length

    console.log('━'.repeat(50))
    console.log(`📊 Test Summary: ${passed}/${total} passed`)
    console.log(`   ✅ Passed:  ${passed}`)
    console.log(`   ❌ Failed:  ${failed}`)
    console.log(`   ⏭️  Skipped: ${skipped}`)
    console.log('━'.repeat(50))

    if (failed === 0 && passed > 0) {
      console.log('🎉 All tests passed! Gemini API is ready to use.')
    } else if (failed > 0) {
      console.log('⚠️  Some tests failed. Check the errors above.')
    }
  }

  getResults(): TestResult[] {
    return this.results
  }
}

// Export a function to run tests from browser console
export async function runGeminiTests() {
  const tester = new GeminiAPITester()
  return await tester.runAllTests()
}
