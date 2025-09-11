# To run this example, you must first install the SDK.
# From the root of the `ans` repository, run:
# pip install -e sdk/sdk-python

import json
from ans_project.sdk import ANSClient

def main():
    """Example of looking up agents."""
    client = ANSClient()

    print("--- Looking up agent by ID ---")
    try:
        response = client.lookup({"agent_id": "my-python-agent.ans"})
        print(json.dumps(response, indent=2))
    except Exception as e:
        print(f"Lookup failed: {e}")

    print("\n--- Looking up agents by capability ---")
    try:
        response = client.lookup({"capabilities": "python"})
        print(json.dumps(response, indent=2))
    except Exception as e:
        print(f"Lookup failed: {e}")

if __name__ == "__main__":
    main()

