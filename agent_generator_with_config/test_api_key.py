#!/usr/bin/env python3
"""
Gemini Prompt Test (Single Prompt)
"""

import os
from dotenv import load_dotenv
from google import genai

load_dotenv()

api_key = os.getenv("GOOGLE_API_KEY")

print("=" * 80)
print("🧠 Gemini Prompt Test")
print("=" * 80)
print()

if not api_key:
    print("❌ No API key found")
    exit(1)

client = genai.Client(api_key=api_key)

prompt = """
hi
"""

try:
    response = client.models.generate_content(
        model="gemini-flash-latest",
        contents=prompt
    )

    print("📤 Prompt:")
    print(prompt.strip())
    print("\n📥 Response:")
    print(response.text)

except Exception as e:
    print("❌ Error:", e)
