# How to Look Up Agents

Once agents are registered on the Agent Network System (ANS), they can be discovered by other agents or applications. The `lookup` functionality allows you to query the ANS registry to find agents based on various criteria.

## The Lookup Process

A lookup is a simple query to the ANS `lookup` endpoint. You can search for agents by:

*   **`agent_id`**: The most direct way to find a specific agent.
*   **`query`**: A prefix search on the agent's `name`.
*   **`capabilities`**: A list of skills or features the agent must possess.
*   **`trust_level`**: The minimum trust level required (e.g., `provisional`).
*   **`policy_requirements`**: Advanced filtering based on an agent's policies (JavaScript SDK only).

---

## Node.js Example

This example demonstrates how to first register a target agent and then use the `lookup` method from the `@ans-project/sdk-js` to find it based on its capabilities.

```javascript
import { ANSClient } from '@ans-project/sdk-js';
import { v4 as uuidv4 } from 'uuid';

const ANS_BASE_URL = "https://ans-register-390011077376.us-central1.run.app";

async function lookupAgent() {
    const client = new ANSClient(ANS_BASE_URL);

    // --- STEP 1: Register a target agent to ensure it exists ---
    const { publicKey, privateKey } = ANSClient.generateKeyPair();
    const targetAgentId = `quantum-agent-${uuidv4().substring(0, 8)}.ans`;
    const targetAgentPayload = {
      agent_id: targetAgentId,
      name: "Quantum Computing Agent",
      capabilities: ["quantum-computation", "secure-encryption"],
      public_key: publicKey,
    };

    try {
        await client.register(targetAgentPayload, privateKey);
        console.log(`Target agent '${targetAgentId}' registered successfully.\n`);
    } catch (error) {
        console.error("Failed to register the target agent. Aborting.", error.message);
        return;
    }

    // --- STEP 2: Perform the lookup ---
    console.log("Performing lookup for agents with 'quantum-computation' capability...");
    
    try {
        const lookupParams = {
            capabilities: ["quantum-computation"]
        };
        const lookupResponse = await client.lookup(lookupParams);

        console.log("\n--- LOOKUP RESULTS ---");
        if (lookupResponse.results && lookupResponse.results.length > 0) {
            console.log(`Found ${lookupResponse.results.length} agent(s):`);
            console.log(JSON.stringify(lookupResponse.results, null, 2));
        } else {
            console.log("No agents found matching the criteria.");
        }

    } catch (error) {
        console.error("\n--- LOOKUP FAILED ---");
        console.error(error.message);
    }
}

lookupAgent();
```

---

## Python Example

This example uses the `ans-project-sdk` for Python to look up agents by both `agent_id` and `capabilities`.

```python
import json
from ans_project.sdk import ANSClient

def lookup_agent():
    """Example of looking up agents with the Python SDK."""
    client = ANSClient()

    # --- Example 1: Looking up a specific agent by its ID ---
    agent_id_to_find = "my-python-agent.ans"
    print(f"--- Looking up agent by ID: {agent_id_to_find} ---")
    try:
        response = client.lookup({"agent_id": agent_id_to_find})
        print("Lookup successful!")
        print(json.dumps(response, indent=2))
    except Exception as e:
        print(f"Lookup failed: {e}")

    # --- Example 2: Looking up agents by capability ---
    capability_to_find = "python"
    print(f"\n--- Looking up agents with capability: '{capability_to_find}' ---")
    try:
        # Note: The backend treats a single string as a comma-separated list of one
        response = client.lookup({"capabilities": capability_to_find})
        print("Lookup successful!")
        print(json.dumps(response, indent=2))
    except Exception as e:
        print(f"Lookup failed: {e}")

if __name__ == "__main__":
    lookup_agent()
```