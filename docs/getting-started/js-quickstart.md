# Getting Started with the JavaScript SDK

This guide will walk you through the process of setting up a Node.js project, registering a new AI agent with the Agent Network System (ANS), and then looking it up.

## Prerequisites

*   Node.js and npm installed on your system.

## Step 1: Set Up Your Project

First, create a new directory for your project, navigate into it, and initialize a new Node.js project.

```bash
mkdir my-js-ans-project
cd my-js-ans-project
npm init -y
```

## Step 2: Install the ANS SDK

Install the `@ans-project/sdk-js` package from npm. This command installs it locally for your project and globally to give you access to the `anslookup` command-line tool.

```bash
npm install @ans-project/sdk-js
npm install -g @ans-project/sdk-js
```

## Step 3: Create the Registration Script

Create a new file named `register.js` in your project directory. This script will perform two main actions:
1.  Register a new agent with the ANS.
2.  Look up the same agent to confirm the registration was successful.

Paste the following code into your `register.js` file:

```javascript
const { ANSClient } = require('@ans-project/sdk-js');
const fs = require('fs');

async function registerAndLookupAgent() {
  // We will use the public gClouds-hosted ANS service for this guide
  const ansBackendUrl = 'https://ans-register-390011077376.us-central1.run.app';
  const client = new ANSClient(ansBackendUrl);

  // 1. Generate a new cryptographic key pair for your agent
  console.log("Generating a new key pair for the agent...");
  const { publicKey, privateKey } = ANSClient.generateKeyPair();
  
  // IMPORTANT: In a real application, you must save and protect your private key!
  // For this example, we'll save it to a file.
  fs.writeFileSync('my-agent-private-key.pem', privateKey);
  console.log("Private key saved to my-agent-private-key.pem. Keep this file secure!");

  // 2. Define your agent's public profile
  const agentId = 'my-first-js-agent.ans'; // Choose a unique ID for your agent
  const agentPayload = {
    agent_id: agentId,
    name: 'My First JavaScript Agent',
    description: 'An agent registered via the ANS Quick Start Guide.',
    capabilities: ['quick-start-test', 'js-sdk'],
    endpoints: { rest: 'https://my-agent.example.com/api' },
    public_key: publicKey,
  };

  // 3. Register the agent with the ANS
  try {
    console.log(`\nAttempting to register agent: ${agentId}`);
    const registrationResponse = await client.register(agentPayload, privateKey);
    console.log("✅ Registration successful:", JSON.stringify(registrationResponse, null, 2));
  } catch (error) {
    console.error("❌ Agent registration failed:", error.message);
    if (error.response && error.response.data) {
      console.error("Backend Error:", JSON.stringify(error.response.data, null, 2));
    }
    return; // Exit if registration fails
  }

  // 4. Look up the agent to confirm it's on the network
  console.log(`\nLooking up the newly registered agent: ${agentId}`);
  try {
    const lookupResults = await client.lookup({ agent_id: agentId });
    console.log("✅ Lookup successful:", JSON.stringify(lookupResults, null, 2));
  } catch (error) {
    console.error("❌ Agent lookup failed:", error.message);
  }
}

registerAndLookupAgent();
```

## Step 4: Run the Script

Execute the script from your terminal:

```bash
node register.js
```

You should see the output confirming that the agent was registered and then successfully looked up.

## Step 5: Verify with the CLI

You can also use the `anslookup` command-line tool to find your newly registered agent from anywhere in your terminal.

```bash
anslookup my-first-js-agent.ans
```

This provides a quick and easy way to verify that your agent is discoverable on the network.
