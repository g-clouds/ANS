### Developer Note: Using the Mock Registration Test Script

#### **1. Purpose**

This document provides guidance on using the `mock-register.js` script located in the `backend/` directory.

The primary purpose of this script is to serve as a powerful, self-contained tool for developers. It allows you to perform a complete, end-to-end test of the agent registration data structure and its cryptographic signing process **without needing a running backend, database, or any network connectivity.**

For developers setting up a new regional or private ANS deployment, this script is the perfect first step. It allows you to generate a valid registration payload and understand the exact data structure your ANS instance will need to handle, ensuring you can build compliant clients and services.

#### **2. How It Works**

The script simulates the entire process a client would follow to register an agent, and then validates the result. When you run it, it executes the following stages automatically:

1.  **Generates a New Key Pair:** Creates a fresh, full-length `secp256k1` public/private key pair in PEM format.
2.  **Constructs Agent Data:** Builds a sample agent payload using configuration (see below).
3.  **Generates a Cryptographic Signature:** Signs the agent data with the private key to create a valid `proofOfOwnership` signature.
4.  **Validates the Schema:** Checks the final, signed payload against the official `registerSchema` from the backend source code. This is the same validation the real API endpoint performs.
5.  **Generates a DID:** Creates a valid Decentralized Identifier (`did:ans:...`) based on the agent's public key.
6.  **Prints a Detailed Report:** Outputs all generated artifacts (keys, signature, DID) and a field-by-field breakdown of the final data object that *would* be sent to the Firestore database upon a real registration.

#### **3. How to Use**

You can run the script from the root directory of the project.

**Step 1: Install Dependencies**
If you haven't already, you need to install the required Node.js libraries for the backend:
```bash
npm install --prefix backend
```

**Step 2: Run the Script**
Execute the script using Node.js:
```bash
node backend/mock-register.js
```

#### **4. Configuration (Customizing for Your Regional Deployment)**

The script is designed to be easily configured for your specific needs without modifying the code itself. You can customize the generated agent data by setting the following environment variables before running the script.

| Environment Variable    | Description                                       | Default Value                               |
| ----------------------- | ------------------------------------------------- | ------------------------------------------- |
| `AGENT_ID`              | The unique ID for your agent.                     | `my-realistic-agent.ans`                    |
| `AGENT_NAME`            | The human-readable name of the agent.             | `My Realistic Agent`                        |
| `AGENT_DESCRIPTION`     | A short description of the agent.                 | `An agent with a...`                        |
| `AGENT_ORGANIZATION`    | The organization that owns the agent.             | `Test Corp`                                 |
| `AGENT_CAPABILITIES`    | A comma-separated list of capabilities.           | `test_capability`                           |
| `ENDPOINT_A2A`          | The agent-to-agent communication endpoint.        | `https://test.com/a2a`                      |
| `ENDPOINT_REST`         | The REST API endpoint for the agent.              | `https://test.com/api/v1`                   |

**Example Usage (Linux/macOS):**
```bash
AGENT_ID="logistics-agent.my-region.ans" \
AGENT_NAME="EU Logistics Agent" \
AGENT_CAPABILITIES="shipping,tracking" \
node backend/mock-register.js
```

**Example Usage (Windows Command Prompt):**
```cmd
set AGENT_ID=logistics-agent.my-region.ans
set AGENT_NAME=EU Logistics Agent
set AGENT_CAPABILITIES=shipping,tracking
node backend/mock-register.js
```

**Example Usage (Windows PowerShell):**
```powershell
$env:AGENT_ID="logistics-agent.my-region.ans"
$env:AGENT_NAME="EU Logistics Agent"
$env:AGENT_CAPABILITIES="shipping,tracking"
node backend/mock-register.js
```

#### **5. Next Steps**

After using this script to successfully generate and validate a payload, your next step would be to use a real HTTP client (like `curl`, Postman, or a client library) to send a similarly generated payload to the `/register` endpoint of your actual, running regional ANS instance. This script helps you ensure that the data you send will be perfectly formatted.
