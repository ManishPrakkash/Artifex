# Test Suite

This folder contains test files to verify API integrations before starting development.

## 📁 Structure

```
tests/
├── api/
│   ├── gemini-api-test.ts    # Gemini API test suite
│   └── run-tests.ts           # CLI test runner
├── test-page.html             # Browser-based test interface
└── README.md                  # This file
```

## 🧪 Running Tests

### Option 1: Browser Test Page (Recommended)

1. Open `test-page.html` directly in your browser
2. Enter your Google API key
3. Click "Run All Tests"
4. View detailed results

**Or start a simple server:**
```bash
cd frontend/tests
npx serve .
# Open http://localhost:3000/test-page.html
```

### Option 2: Command Line

```bash
cd frontend
npm run test:api
```

### Option 3: Browser Console

1. Open your app at http://localhost:3000
2. Open DevTools Console (F12)
3. Run:
```javascript
import { runGeminiTests } from './tests/api/gemini-api-test'
runGeminiTests()
```

## 📋 Tests Included

### 1. API Key Configuration ✅
- Checks if API key is present
- Validates API key format
- Ensures key meets minimum length requirements

### 2. API Connectivity ✅
- Tests connection to Google Gemini API
- Verifies authentication works
- Checks for network issues

### 3. Agent Name Extraction ✅
- Tests AI-powered name extraction
- Validates JSON response parsing
- Ensures correct data structure

### 4. Fallback Mechanism ✅
- Tests keyword-based fallback
- Verifies common agent types are recognized
- Ensures graceful degradation

## 🎯 Expected Results

**All tests pass:**
```
✅ API Key Configuration (5ms)
✅ API Connectivity (234ms)
✅ Agent Name Extraction (567ms)
✅ Fallback Mechanism (2ms)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📊 Test Summary: 4/4 passed
   ✅ Passed:  4
   ❌ Failed:  0
   ⏭️  Skipped: 0
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🎉 All tests passed! Gemini API is ready to use.
```

**Some tests fail:**
- Check your API key in `.env` file
- Verify internet connection
- Check API quota/billing on Google Cloud Console
- Review error messages for specific issues

## 🔧 Configuration

Make sure your `.env` file contains:
```env
NEXT_PUBLIC_GOOGLE_API_KEY=your-actual-api-key-here
```

## 🐛 Troubleshooting

### API Key Not Found
- Ensure `.env` file exists in `frontend/` directory
- Variable must start with `NEXT_PUBLIC_` for client-side access
- Restart dev server after changing `.env`

### API Connection Failed
- Check internet connection
- Verify API key is valid
- Check Google Cloud Console for API status
- Ensure Gemini API is enabled in your project

### Extraction Failed
- API might be rate-limited
- Check API quota in Google Cloud Console
- Verify model name is correct: `gemini-2.0-flash-exp`

### Fallback Not Working
- Should always work (no API required)
- Check browser console for JavaScript errors
- Verify test inputs match expected keywords

## 📊 Test Output Format

Each test returns:
```typescript
{
  test: string           // Test name
  status: 'PASS' | 'FAIL' | 'SKIP'
  message: string        // Detailed result message
  duration: number       // Execution time in ms
}
```

## 🚀 Next Steps

Once all tests pass:
1. ✅ API is configured correctly
2. ✅ Start development with confidence
3. ✅ Dynamic agent naming will work
4. ✅ Fallback ensures reliability

If tests fail, fix issues before proceeding with development.
