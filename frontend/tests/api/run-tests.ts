#!/usr/bin/env node

/**
 * CLI Test Runner for Gemini API
 * Usage: npm run test:api
 */

import { GeminiAPITester } from './gemini-api-test'

async function main() {
  console.clear()
  console.log('╔════════════════════════════════════════════════╗')
  console.log('║       GEMINI API TEST SUITE                    ║')
  console.log('║       Testing Google Gemini Integration        ║')
  console.log('╚════════════════════════════════════════════════╝\n')

  const tester = new GeminiAPITester()
  const results = await tester.runAllTests()

  const failed = results.filter(r => r.status === 'FAIL').length
  
  // Exit with error code if tests failed
  process.exit(failed > 0 ? 1 : 0)
}

main().catch((error) => {
  console.error('Fatal error running tests:', error)
  process.exit(1)
})
