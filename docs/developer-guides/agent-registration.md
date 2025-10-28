# How to Register an Agent

Registering an agent is the first step to making it discoverable on the Agent Network System (ANS). The process involves generating a cryptographic key pair, defining your agent's public profile, and submitting it to the ANS.

## The Registration Process

1.  **Generate a Key Pair:** Your agent needs a unique cryptographic identity. The SDK provides a function to generate an `EC secp256r1` key pair (a public key and a private key).
    *   The **public key** is shared and becomes part of your agent's public record.
    *   The **private key** is a secret that you must store securely. It is used to sign the registration payload, proving you are the owner.
2.  **Construct the Payload:** You define your agent's public information, such as its ID, name, capabilities, and endpoints.
3.  **Sign and Register:** The SDK uses your private key to create a digital signature for the payload. This, along with the payload itself, is sent to the ANS `register` endpoint.

---

## Node.js Example

This example, adapted from our internal tests, shows how to register an agent using the `@ans-project/sdk-js`.

```javascript
import { ANSClient } from '@ans-project/sdk-js';
import { v4 as uuidv4 } from 'uuid';

// The public gClouds-hosted ANS service URL
const ANS_BASE_URL = "https://ans-register-390011077376.us-central1.run.app";

async function registerAgent() {
    console.log("Initializing the ANS Client...");
    const client = new ANSClient(ANS_BASE_URL);

    // 1. Generate a new key pair for the agent
    console.log("Generating cryptographic key pair...");
    const { publicKey, privateKey } = ANSClient.generateKeyPair();
    console.log("Keys generated successfully.");
    
    // In a real application, you must store the privateKey securely!

    // 2. Define the agent's public data
    const agentPayload = {
      agent_id: `my-agent-${uuidv4().substring(0, 8)}.ans`,
      name: "My First JS Agent",
      description: "An agent registered using the ANS Node.js SDK.",
      capabilities: ["javascript", "sdk-test"],
      endpoints: { a2a: "https://my-agent.example.com/a2a" },
      public_key: publicKey,
    };
    console.log("\nConstructed Agent Payload:");
    console.log(JSON.stringify(agentPayload, null, 2));

    // 3. Register the agent
    try {
        console.log("\nSending registration request to the ANS...");
        const registrationResult = await client.register(agentPayload, privateKey);
        
        console.log("\n--- REGISTRATION SUCCESSFUL! ---");
        console.log("The network has accepted the agent. It is now discoverable.");
        console.log("Response from the server:");
        console.log(JSON.stringify(registrationResult, null, 2));

    } catch (error) {
        console.error("\n--- REGISTRATION FAILED ---");
        console.error(error.message);
        if (error.response) {
            console.error(JSON.stringify(error.response.data, null, 2));
        }
    }
}

registerAgent();
```

---

## Python Example

This example, adapted from our internal tests, shows how to register an agent using the `ans-project-sdk` for Python.

```python
import json
from ans_project.sdk import ANSClient

def register_agent():
    """Example of registering an agent with the Python SDK."""
    
    print("Initializing the ANS Client...")
    client = ANSClient() # Defaults to the public ANS endpoint

    # 1. Generate a new key pair for the agent
    print("Generating cryptographic key pair...")
    public_key, private_key = ANSClient.generate_key_pair()
    print("Keys generated successfully.")

    # In a real application, you must store the private_key securely!

    # 2. Define the agent's public data
    agent_payload = {
        "agent_id": "my-python-agent.ans",
        "name": "My First Python Agent",
        "description": "An agent registered using the ANS Python SDK.",
        "capabilities": ["python", "sdk-test"],
        "endpoints": {
            "a2a": "http://example.com/a2a"
        },
        "public_key": public_key
    }
    print("\nConstructed Agent Payload:")
    print(json.dumps(agent_payload, indent=2))

    # 3. Register the agent
    try:
        print("\nSending registration request to the ANS...")
        response = client.register(agent_payload, private_key)
        
        print("\n--- REGISTRATION SUCCESSFUL! ---")
        print("The network has accepted the agent. It is now discoverable.")
        print("Response from the server:")
        print(json.dumps(response, indent=2))

    except Exception as e:
        print(f"\n--- REGISTRATION FAILED: {e} ---")
        if hasattr(e, 'response') and e.response is not None:
            print(f"Response body: {e.response.text}")

if __name__ == "__main__":
    register_agent()
```
