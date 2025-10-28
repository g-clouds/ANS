# Using the ANSClient

The `ANSClient` is the primary interface for interacting with the Agent Network System. It is available for both Python and Node.js and provides a consistent set of methods for all core ANS operations.

## Python SDK

### Installation

Install the Python SDK from PyPI:

```bash
pip install ans-project-sdk
```

### Quick Start

Here's a quick example of how to use the `ANSClient` in Python:

```python
from ans_project.sdk import ANSClient

# Initialize the client (defaults to the public ANS endpoint)
client = ANSClient()

# 1. Generate a new key pair
public_key, private_key = ANSClient.generate_key_pair()

# NOTE: Securely store the private_key. Do not hardcode it in your application.

# 2. Register an agent
agent_data = {
    "agent_id": "my-python-agent.ans",
    "name": "My Python Agent",
    "capabilities": ["python_sdk_test"],
    "public_key": public_key
}
try:
    response = client.register(agent_data, private_key)
    print("Registration successful:", response)
except Exception as e:
    print("Registration failed:", e)


# 3. Lookup an agent
try:
    response = client.lookup({"agent_id": "my-python-agent.ans"})
    print("Lookup successful:", response)
except Exception as e:
    print("Lookup failed:", e)
```

---

## Node.js SDK

### Installation

Install the Node.js SDK from npm:

```bash
npm install @ans-project/sdk-js
```

### Quick Start

Here's a quick example of how to use the `ANSClient` in Node.js:

```javascript
const { ANSClient } = require('@ans-project/sdk-js');

async function main() {
  // Use the public gClouds-hosted ANS service URL
  const cloudRunUrl = "https://ans-register-390011077376.us-central1.run.app"; 
  const client = new ANSClient(cloudRunUrl);

  // 1. Generate a new key pair
  const { publicKey, privateKey } = ANSClient.generateKeyPair();
  
  // NOTE: Securely store the privateKey. Do not hardcode it in your application.

  // 2. Construct Agent Data
  const agentPayload = {
    agent_id: "my-nodejs-agent.ans",
    name: "My Node.js SDK Agent",
    capabilities: ["nodejs_capability", "test_feature"],
    public_key: publicKey,
  };

  try {
    // 3. Register Agent
    console.log("Attempting to register agent...");
    const response = await client.register(agentPayload, privateKey);
    console.log("Registration Response:", JSON.stringify(response, null, 2));

  } catch (error) {
    console.error("Error during agent registration:", error.message);
  }
}

main();
```

## Key Management

When you register an agent, you generate a public/private key pair.

*   **Private Key:** This key is your agent's secret. It's used to sign registration and verification requests, proving that you are the owner of the agent. **Never share your private key or commit it to version control.** For production, use a secure storage solution like Google Cloud Secret Manager.
*   **Public Key:** This key is shared publicly as part of your agent's registration. It's used by others to verify your agent's signatures.
