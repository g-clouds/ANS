# Getting Started with the Python SDK

This guide will walk you through setting up a Python project, registering a new AI agent with the Agent Network System (ANS), and then looking it up using the `ans-project-sdk`.

## Prerequisites

* Python 3.7+ and pip installed on your system.

## Step 1: Set Up Your Project

First, create a new directory for your project, navigate into it, and it's a good practice to create a virtual environment.

```bash
mkdir my-python-ans-project
cd my-python-ans-project
python -m venv venv
source venv/bin/activate  # On Windows use `venv\Scripts\activate`
```

## Step 2: Install the ANS SDK

Install the `ans-project-sdk` package from PyPI.

```bash
pip install ans-project-sdk
```

This will install the Python client library and also make the `anslookup` command-line tool available in your environment.

## Step 3: Create the Registration Script

Create a new file named `register.py` in your project directory. This script will perform two main actions:
1. Register a new agent with the ANS.
2. Look up the same agent to confirm the registration was successful.

Paste the following code into your `register.py` file:

```python
import json
from ans_project.sdk import ANSClient

def register_and_lookup_agent():
    """
    A script to register and then look up an agent using the ANS Python SDK.
    """
    # Initialize the client. It defaults to the public gClouds-hosted ANS endpoint.
    client = ANSClient()

    # 1. Generate a new cryptographic key pair for the agent.
    print("Generating a new key pair for the agent...")
    public_key, private_key = ANSClient.generate_key_pair()

    # IMPORTANT: In a real application, you must save and protect your private key!
    with open("my-agent-private-key.pem", "w") as f:
        f.write(private_key)
    print("Private key saved to my-agent-private-key.pem. Keep this file secure!")

    # 2. Define the agent's public profile.
    agent_id = "my-first-python-agent.ans"  # Choose a unique ID for your agent
    agent_payload = {
        "agent_id": agent_id,
        "name": "My First Python Agent",
        "description": "An agent registered via the ANS Python SDK.",
        "organization": "Python SDK Examples",
        "capabilities": ["quick-start-test", "python-sdk"],
        "endpoints": {
            "rest": "http://my-agent.example.com/api"
        },
        "public_key": public_key
    }

    # 3. Register the agent with the ANS.
    try:
        print(f"\nAttempting to register agent: {agent_id}")
        response = client.register(agent_payload, private_key)
        print("✅ Registration successful!")
        print("Response from server:")
        print(json.dumps(response, indent=2))
    except Exception as e:
        print(f"❌ Registration failed: {e}")
        if hasattr(e, 'response') and e.response is not None:
            print(f"Backend Error: {e.response.text}")
        return  # Exit if registration fails

    # 4. Look up the agent to confirm it's on the network.
    print(f"\nLooking up the newly registered agent: {agent_id}")
    try:
        response = client.lookup({"agent_id": agent_id})
        print("✅ Lookup successful:")
        print(json.dumps(response, indent=2))
    except Exception as e:
        print(f"❌ Lookup failed: {e}")

if __name__ == "__main__":
    register_and_lookup_agent()
```

## Step 4: Run the Script

Execute the script from your terminal:

```bash
python register.py
```

You should see the output confirming that the agent was registered and then successfully looked up.

## Step 5: Verify with the CLI

You can also use the `anslookup` command-line tool to find your newly registered agent from anywhere in your terminal.

```bash
anslookup my-first-python-agent.ans
```
This provides a quick and easy way to verify that your agent is discoverable on the network.
