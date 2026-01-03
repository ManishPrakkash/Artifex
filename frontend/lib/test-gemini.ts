/**
 * Test script to verify Gemini API integration
 * Run this in browser console to test
 */

export async function testGeminiAPI() {
  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_API_KEY
  
  console.log("🔑 API Key present:", !!apiKey)
  console.log("🔑 API Key (first 10 chars):", apiKey?.substring(0, 10))
  
  if (!apiKey) {
    console.error("❌ No API key found!")
    return
  }

  try {
    const testPrompt = "Create a BMI calculator agent"
    console.log("📤 Testing with prompt:", testPrompt)
    
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-exp:generateContent?key=${apiKey}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          contents: [
            {
              parts: [
                {
                  text: `Extract a concise agent name from: "${testPrompt}". Respond with JSON: {"agentName": "name", "agentType": "type", "shortDescription": "desc"}`,
                },
              ],
            },
          ],
        }),
      }
    )

    console.log("📥 Response status:", response.status)
    
    if (!response.ok) {
      const errorText = await response.text()
      console.error("❌ API Error:", errorText)
      return
    }

    const data = await response.json()
    console.log("✅ API Response:", data)
    
    const textContent = data.candidates?.[0]?.content?.parts?.[0]?.text
    console.log("📝 Extracted text:", textContent)
    
  } catch (error) {
    console.error("❌ Test failed:", error)
  }
}

// Auto-run test if in browser
if (typeof window !== 'undefined') {
  console.log("🧪 Gemini API test ready. Run: testGeminiAPI()")
}
