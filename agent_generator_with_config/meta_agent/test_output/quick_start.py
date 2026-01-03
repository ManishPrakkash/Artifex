#!/usr/bin/env python3
# Quick start script for test_bmi_calculator

from agent import root_agent

def main():
    print("Starting test_bmi_calculator...")
    print("Main agent: bmi_agent")
    print("Available agents: ['bmi_agent']")
    print("Available tools: []")
    print()
    print("Generated in current directory for easy testing with ADK Web UI")
    print()
    print("To run the agent with ADK CLI:")
    print("adk cli agent.py")
    print()
    print("To use the agent programmatically:")
    print("response = root_agent.run('Your message here')")
    print("print(response)")

if __name__ == "__main__":
    main()
