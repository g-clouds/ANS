# ANS Node.js SDK: Agent Registration Guide

This guide provides instructions for end-users on how to register a new agent with the Agent Network System (ANS) using the Node.js SDK.

## 1. Prerequisites

*   **Node.js:** Version 16 or higher.
*   **npm:** Node Package Manager (comes with Node.js).

## 2. Installation

This package is published to npm, you can install it using:

```bash
npm install -g @ans-project/sdk-js
```

### Using the `anslookup` Command-Line Tool

The SDK includes a convenient command-line tool, `anslookup`, for quickly querying the Agent Network System.

To use it, you can install the package globally:

```bash
npm install -g @ans-project/sdk-js
```

Once installed, you can run `anslookup` directly from your terminal:

```bash
# Get help and see all options
anslookup --help

# Lookup an agent by its ID
anslookup translator.ans

# Lookup agents by name and trust level
anslookup --query "Nia" --trust-level "provisional"

# Lookup agents by capabilities (use quotes for capabilities with spaces)
anslookup --capabilities "sales,lead generation"

# Lookup agents by policy requirements (pass a JSON string)
anslookup --policy-requirements '{"verification_status":"verified"}'
```

## 3. Registering a New Agent

Here's an example of how to use the SDK to register an agent. You can create a file (e.g., `register-agent.js`) and run it with `node register-agent.js`.

```javascript
const { ANSClient } = require('@ans-project/sdk-js'); // If installed via npm
// OR
// const { ANSClient } = require('./dist/index'); // If built locally

async function registerNewAgent() {
  // Replace with your actual Cloud Run service URL. Do not change if you do not have an ANS service URL. This service is hosted by gClouds ( a Google Cloud Partner )
  const cloudRunUrl = "https://ans-register-390011077376.us-central1.run.app"; 
  const client = new ANSClient(cloudRunUrl);

  // 1. Generate EC Key Pair
  const { publicKey, privateKey } = ANSClient.generateKeyPair();
  console.log("Generated Public Key (PEM):\n", publicKey);
  console.log("Generated Private Key (PEM):\n", privateKey); // Keep this secure!

  // 2. Construct Agent Data
  const agentPayload = {
    agent_id: "my-nodejs-agent.ans", // Customize your agent ID
    name: "My Node.js SDK Agent",
    description: "An agent registered via Node.js SDK.",
    organization: "Node.js SDK Test Org",
    capabilities: ["nodejs_capability", "test_feature"],
    endpoints: { a2a: "https://nodejs.test.com/a2a", rest: "https://nodejs.test.com/api/v1" },
    public_key: publicKey,
  };

  try {
    // 3. Register Agent
    console.log("Attempting to register agent...");
    const response = await client.register(agentPayload, privateKey);
    console.log("Registration Response:\n", JSON.stringify(response, null, 2));

  } catch (error) {
    console.error("Error during agent registration:", error.message);
    if (error.response && error.response.data) {
      console.error("Backend Error Details:", JSON.stringify(error.response.data, null, 2));
    }
  }
}

registerNewAgent();
```

## 4. Handling Your Cryptographic Keys (Crucial!)

The Node.js SDK generates a unique cryptographic key pair (a public key and a private key) for your agent during the registration process. **Securely managing these keys is paramount.**

*   **Private Key:**
    *   **Purpose:** The private key is used to generate the `signature` that proves your agent's ownership.
    *   **Security:** Your private key **MUST be kept absolutely secret and secure**. If your private key is compromised, someone else could impersonate your agent.
    *   **Storage:**
        *   **NEVER** store private keys directly in your code, commit them to version control (like Git), or expose them in public logs.
        *   For development, you might temporarily store them in secure environment variables or local configuration files (ensure these are `.gitignore`d).
        *   For production, consider using dedicated secure storage solutions like:
            *   **Google Cloud Secret Manager**
            *   Hardware Security Modules (HSMs)
            *   Key Management Systems (KMS)
    *   **The current example generates a new key pair every time it runs.** For a real application, you would generate a key pair once, securely store the private key, and reuse it for subsequent registrations or updates of the same agent.

*   **Public Key:**
    *   **Purpose:** The public key is part of your agent's identity and is sent to the ANS backend. It allows others to verify signatures made by your private key.
    *   **Security:** Public keys are, by definition, public. They do not need to be kept secret.

*   **Signature:**
    *   **Purpose:** The signature is a one-time proof of ownership for a specific registration payload. It is sent to the backend for verification.
    *   **Security:** The signature itself is not sensitive after it has been used and verified. Its security relies entirely on the secrecy of the private key used to generate it.

**Remember: The security of your agent's identity hinges on the secrecy of its private key.**

---

## Changelog

### [0.0.5] - 2025-10-28

#### Added
-   **Policy Requirements Filter:** The `anslookup` CLI tool now supports a `--policy-requirements` flag. This allows users to perform lookups and filter agents based on specific policy criteria, such as requiring a `"verified"` status. The value should be a JSON string.
-   **Public Key in Lookup Response:** The `lookup` method now includes the agent's `public_key` in the response. This is a critical addition that enables third-party verifiers to retrieve the trusted key needed for cryptographic verification of an agent's claims.

#### Fixed
-   **CLI Argument Parsing:** Fixed a bug in the `anslookup` tool where arguments with values (e.g., `--agent-id my-agent.ans`) were not parsed correctly, causing the value to be ignored.
-   **Snake Case Conversion:** Corrected an issue where kebab-case command-line arguments (e.g., `--trust-level`) were not being correctly converted to the snake_case format (`trust_level`) required by the backend API.
