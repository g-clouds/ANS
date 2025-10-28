# Quick Start Guide: Registering and Looking Up AI Agents with ANS SDKs

This guide provides a quick walkthrough on how to register a new AI agent and then look it up using the JavaScript/TypeScript, Java, and Python SDKs.

## Prerequisites

* **Node.js & npm:** For JavaScript/TypeScript SDK.
* **Java Development Kit (JDK) & Apache Maven:** For Java SDK.
* **Python 3.7+ & pip:** For Python SDK.
* **Deployed ANS Backend:** An operational ANS backend service (We will use the existing global registry, The Nexus, of gLabs' for this quick guide).

## 1. JavaScript/TypeScript SDK

### Step 0: Prepare your working directory

Create a new directory for your project and navigate into it:

```bash
mkdir my-js-ans-project
cd my-js-ans-project
```

### Step 1: Install the SDK

Install the `@ans-project/sdk-js` package globally to get the `anslookup` CLI and locally for programmatic use.

```bash
npm install -g @ans-project/sdk-js
npm install @ans-project/sdk-js
```

### Step 2: Look up your AI Agent (Pre-registration Check)

Before registering, you can use `anslookup` to check if an agent with your desired ID already exists.

```bash
anslookup <YOUR_AGENT_ID>
# Example: anslookup my-new-agent.ans
```

If the agent is found, you might need to choose a different ID or proceed with caution if you intend to update an existing agent.

### Step 3: Create and Register Your AI Agent

**IMPORTANT:** You need to create a new file in your current directory (`my-js-ans-project` or `quickguide-test` in your case) and name it exactly `register_agent.js`. Use a plain text editor (like Notepad, VS Code, Sublime Text, etc.) to create this file. Do NOT use a word processor.

Paste the following code into the `register_agent.js` file. Remember to replace placeholders like `<YOUR_AGENT_ID>`.

```javascript
const { ANSClient } = require('@ans-project/sdk-js');
const fs = require('fs'); // For saving private key securely

async function registerAndLookupAgent() {
  const ansBackendUrl = 'https://ans-register-390011077376.us-central1.run.app';
  const client = new ANSClient(ansBackendUrl);

  // Generate a new key pair for your agent
  const { publicKey, privateKey } = ANSClient.generateKeyPair();
  console.log("Generated Public Key:", publicKey);
  // IMPORTANT: Save your private key securely! Do NOT expose it.
  fs.writeFileSync('my-agent-private-key.pem', privateKey);
  console.log("Private key saved to my-agent-private-key.pem");

  const agentId = '<YOUR_AGENT_ID>'; // e.g., "my-new-agent.ans"
  const agentPayload = {
    agent_id: agentId,
    name: 'My New AI Agent',
    description: 'An agent registered via the Quick Guide.',
    capabilities: ['quick_guide_test', 'lookup_example'],
    endpoints: { rest: 'https://example.com/api' },
    public_key: publicKey,
  };

  try {
    console.log(`Attempting to register agent: ${agentId}`);
    const registrationResponse = await client.register(agentPayload, privateKey);
    console.log("Registration successful:", JSON.stringify(registrationResponse, null, 2));
  } catch (error) {
    console.error("Agent registration failed:", error.message);
    if (error.response && error.response.data) {
      console.error("Backend Error Details:", JSON.stringify(error.response.data, null, 2));
    }
    return; // Stop if registration fails
  }

  // Step 4: Look up your AI Agent (Post-registration Confirmation)
  console.log(`\nAttempting to look up agent: ${agentId}`);
  try {
    const lookupResults = await client.lookup({ agent_id: agentId });
    console.log("Lookup successful:", JSON.stringify(lookupResults, null, 2));
  } catch (error) {
    console.error("Agent lookup failed:", error.message);
  }
}

registerAndLookupAgent();
```

Run the script:

```bash
node register_agent.js
```

### Step 4: Lookup your AI agent

```bash
anslookup my-new-agent.ans
```

```json

[
  {
    "agent_id": "my-new-agent.ans",
    "did": "did:ans:f58f1bd8-e4d9-4948-b1cd-1f8f6511db57:zQmaEVFQ5kRYGJKZzbtTwhSxgMMbGNf7c6vzGnpWxcavRLC",
    "name": "My New AI Agent",
    "description": "An agent registered via the Quick Guide.",
    "endpoints": {
      "rest": "https://example.com/api"
    },
    "capabilities": [
      "quick_guide_test",
      "lookup_example"
    ],
    "verification": {
      "level": "provisional"
    },
    "policy_compatibility": true
  }
]
```

## 2. Java SDK - Maven

This guide provides a quick way to get started with the Java SDK by setting up a simple Maven project.

### Step 0: Prepare your working directory

Create a new directory for your project and navigate into it:

```bash
mkdir my-java-ans-project
cd my-java-ans-project
```

### Step 1: Create a `pom.xml` file

Create a file named `pom.xml` in your `my-java-ans-project` directory and paste the following content into it. This `pom.xml` includes the necessary repository configuration to download the `sdk-java` dependency from GitHub Packages, and also configures the compiler and execution plugins.

```xml
<?xml version="1.0" encoding="UTF-8"?>
<project xmlns="http://maven.apache.org/POM/4.0.0"
         xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
         xsi:schemaLocation="http://maven.apache.org/POM/4.0.0 http://maven.apache.org/xsd/maven-4.0.0.xsd">
    <modelVersion>4.0.0</modelVersion>

    <groupId>com.example</groupId>
    <artifactId>my-ans-app</artifactId>
    <version>1.0-SNAPSHOT</version>

    <properties>
        <maven.compiler.source>11</maven.compiler.source>
        <maven.compiler.target>11</maven.compiler.target>
    </properties>

    <repositories>
        <repository>
            <id>github</id>
            <url>https://maven.pkg.github.com/g-clouds/ANS</url>
            <snapshots>
                <enabled>true</enabled>
            </snapshots>
        </repository>
    </repositories>

    <dependencies>
        <dependency>
            <groupId>io.github.ans-project</groupId>
            <artifactId>sdk-java</artifactId>
            <version>0.0.3</version>
        </dependency>
    </dependencies>

    <build>
        <plugins>
            <plugin>
                <groupId>org.apache.maven.plugins</groupId>
                <artifactId>maven-compiler-plugin</artifactId>
                <version>3.8.1</version>
                <configuration>
                    <source>${maven.compiler.source}</source>
                    <target>${maven.compiler.target}</target>
                </configuration>
            </plugin>
            <plugin>
                <groupId>org.codehaus.mojo</groupId>
                <artifactId>exec-maven-plugin</artifactId>
                <version>3.0.0</version>
                <configuration>
                    <mainClass>com.example.Main</mainClass>
                </configuration>
            </plugin>
        </plugins>
    </build>
</project>
```

### Step 2: Create your Java Application

First, create the necessary directory structure:

```bash
mkdir src\main\java\com\example
```

Then, create a file named `Main.java` inside `src/main/java/com/example/` and paste the following code. Remember to replace `<YOUR_AGENT_ID>` with your desired agent ID.

```java
package com.example;

import com.ans.sdk.AgentRegistrationClient;
import com.ans.sdk.model.Agent;
import com.ans.sdk.model.ProofOfOwnership;
import com.ans.sdk.model.LookupResponse;

import java.security.KeyPair;
import java.time.Instant;
import java.util.Arrays;
import java.nio.file.Files;
import java.nio.file.Paths;
import java.util.Map;
import java.util.HashMap; // Explicitly import HashMap

public class Main {
    public static void main(String[] args) {
        String cloudRunUrl = "https://ans-register-390011077376.us-central1.run.app"; 

        try {
            AgentRegistrationClient client = new AgentRegistrationClient(cloudRunUrl);

            // 1. Generate Key Pair
            KeyPair keyPair = client.generateKeyPair();
            String publicKeyPem = client.exportPublicKeyToPem(keyPair.getPublic());
            Files.write(Paths.get("ans-public_key.pem"), publicKeyPem.getBytes());
            System.out.println("Public key saved to ans-public_key.pem");

            // Export Private Key to PEM file
            String privateKeyPem = client.exportPrivateKeyToPem(keyPair.getPrivate());
            Files.write(Paths.get("ans-private_key.pem"), privateKeyPem.getBytes());
            System.out.println("Private key saved to ans-private_key.pem");

            // 2. Construct Agent Data
            Agent agent = new Agent();
            agent.setAgentId("my-smart-agent.ans");
            agent.setName("My Smart AI Agent");
            agent.setDescription("An agent that can.....");
            agent.setOrganization("My Org");
            agent.setCapabilities(Arrays.asList("search_capability", "test2_feature"));

            Agent.Endpoints endpoints = new Agent.Endpoints();
            endpoints.setA2a("https://smartai.test.com/a2a");
            endpoints.setRest("https://smartai.test.com/api/v1");
            agent.setEndpoints(endpoints);
            agent.setPublicKey(publicKeyPem);

            // 3. Sign Payload
            String signature = client.signPayload(keyPair.getPrivate(), agent);
            System.out.println("Generated Signature: " + signature);

            // 4. Assemble Final Payload with ProofOfOwnership
            ProofOfOwnership proofOfOwnership = new ProofOfOwnership();
            proofOfOwnership.setSignature(signature);
            proofOfOwnership.setTimestamp(Instant.now().toString());
            agent.setProofOfOwnership(proofOfOwnership);

            // 5. Register Agent
            System.out.println("Attempting to register agent...");
            String response = client.registerAgent(agent);
            System.out.println("Registration Response:\n" + response);

            // 6. Look up your AI Agent (Post-registration Confirmation)
            System.out.println("\nAttempting to look up agent: " + agent.getAgentId());
            Map<String, String> lookupParams = new HashMap<>();
            lookupParams.put("agent_id", agent.getAgentId());
            LookupResponse lookupResults = client.lookup(lookupParams);
            System.out.println("Lookup successful:\n" + lookupResults.toString());

        } catch (Exception e) {
            System.err.println("Error during agent registration or lookup: " + e.getMessage());
            e.printStackTrace();
        }
    }
}
```

### Step 3: Run Your Java Application

Navigate to your `my-java-ans-project` directory and run the following Maven command:

```bash
mvn clean install -U exec:java
```

**Note on Warnings:** You might still see warnings about "lingering threads" from OkHttp. These are not critical errors and indicate that some background threads used by the SDK's HTTP client are still active when the main application finishes. The build will still report `BUILD SUCCESS`.

## 3. Python SDK

### Step 0: Prepare your working directory

Create a new directory for your project and navigate into it:

```bash
mkdir my-python-ans-project
cd my-python-ans-project
```

### Step 1: Install the SDK

Install from PyPI:

```bash
pip install ans-project-sdk
```

### Step 2: Look up your AI Agent (Pre-registration Check)

Before registering, you can use `anslookup` to check if an agent with your desired ID already exists.

```bash
anslookup <YOUR_AGENT_ID>
# Example: anslookup my-new-agent.ans
```

If the agent is found, you might need to choose a different ID or proceed with caution if you intend to update an existing agent.

### Step 3: Create and Register Your AI Agent

**IMPORTANT:** You need to create a new file in your current directory (`my-python-ans-project`) and name it exactly `register_agent.py`. Use a plain text editor (like Notepad, VS Code, Sublime Text, etc.) to create this file. Do NOT use a word processor.

Paste the following code into the `register_agent.py` file. Remember to replace placeholders like `<YOUR_AGENT_ID>`.

```python
from ans_project.sdk import ANSClient
import json

def main():
    client = ANSClient() # Defaults to public ANS endpoint

    # 1. Generate a new key pair for the agent.
    # In a real application, you would do this once and store the private key securely.
    public_key, private_key = ANSClient.generate_key_pair()

    print("--- Generated Keys ---")
    print("Public Key (store this in your agent's public record):")
    print(public_key)
    print("\nPrivate Key (STORE THIS SECURELY!):")
    print(private_key)
    print("----------------------\n")

    # 2. Define the agent's public data.
    agent_id = "<YOUR_AGENT_ID>" # e.g., "my-new-python-agent.ans"
    agent_payload = {
        "agent_id": agent_id,
        "name": "My New Python Agent",
        "description": "An agent registered using the ANS Python SDK.",
        "organization": "Python SDK Examples",
        "capabilities": ["quick_guide_test", "python_sdk_example"],
        "endpoints": {
            "a2a": "http://example.com/a2a",
            "rest": "http://example.com/api"
        },
        "public_key": public_key
    }

    # 3. Register the agent.
    # The client handles signing the payload with the private key.
    try:
        print(f"Attempting to register agent: {agent_id}...")
        response = client.register(agent_payload, private_key)
        print("Registration successful!")
        print("Response:")
        print(json.dumps(response, indent=2))
    except Exception as e:
        print(f"Registration failed: {e}")
        if hasattr(e, 'response') and e.response is not None:
            print(f"Response body: {e.response.text}")
        return # Stop if registration fails

    # 4. Look up your AI Agent (Post-registration Confirmation)
    print(f"\nAttempting to look up agent: {agent_id}")
    try:
        response = client.lookup({"agent_id": agent_id})
        print("Lookup successful:")
        print(json.dumps(response, indent=2))
    except Exception as e:
        print(f"Lookup failed: {e}")

if __name__ == "__main__":
    main()
```

Run the script:

```bash
python register_agent.py
```

### Step 4: Lookup your AI agent

```bash
anslookup my-new-python-agent.ans
```

```json
[
  {
    "agent_id": "my-new-python-agent.ans",
    "did": "did:ans:…",
    "name": "My New Python Agent",
    "description": "An agent registered using the ANS Python SDK.",
    "organization": "Python SDK Examples",
    "capabilities": [
      "quick_guide_test",
      "python_sdk_example"
    ],
    "endpoints": {
      "a2a": "http://example.com/a2a",
      "rest": "http://example.com/api"
    },
    "verification": {
      "level": "provisional"
    },
    "policy_compatibility": true
  }
]
```

### Step 5: Handling Your Cryptographic Keys (Crucial!)

The Python SDK generates a unique cryptographic key pair (a public key and a private key) for your agent during the registration process. **Securely managing these keys is paramount.**

* **Private Key:**
  * **Purpose:** The private key is used to generate the `signature` that proves your agent's ownership.
  * **Security:** Your private key **MUST be kept absolutely secret and secure**. If your private key is compromised, someone else could impersonate your agent.
  * **Storage:**
    * **NEVER** store private keys directly in your code, commit them to version control (like Git), or expose them in public logs.
    * For development, you might temporarily store them in secure environment variables or local configuration files (ensure these are `.gitignore`d).
    * For production, consider using dedicated secure storage solutions like:
      * **Google Cloud Secret Manager**
      * Hardware Security Modules (HSMs)
      * Key Management Systems (KMS)
  * **The current example generates a new key pair every every time it runs.** For a real application, you would generate a key pair once, securely store the private key, and reuse it for subsequent registrations or updates of the same agent.
* **Public Key:**
  * **Purpose:** The public key is part of your agent's identity and is sent to the ANS backend. It allows others to verify signatures made by your private key.
  * **Security:** Public keys are, by definition, public. They do not need to be secret.
* **Signature:**
  * **Purpose:** The signature is a one-time proof of ownership for a specific registration payload. It is sent to the backend for verification.
  * **Security:** The signature itself is not sensitive after it has been used and verified. Its security relies entirely on the secrecy of the private key used to generate it.

**Remember: The security of your agent's identity hinges on the secrecy of its private key.**

## 4. JAVA SDK - Git Clone

This guide provides instructions for end-users on how to register a new agent with the Agent Network System (ANS) using the Java SDK.

### Step 0: Prerequisites

* **Java Development Kit (JDK):** Version 11 or higher.
* **Apache Maven:** For building the SDK.

### Step 1: Get Started

1. **Clone the ANS Repository:**

   ```bash
   git clone https://github.com/g-clouds/ANS.git
   cd ANS
   ```
2. **Navigate to the Java SDK Directory:**

   ```bash
   cd sdk/sdk-java
   ```
3. **Build the Java SDK:**

   ```bash
   mvn clean install
   ```

   This command compiles the code and packages the SDK into a runnable JAR file.

### Step 2: Using the `anslookup` Command-Line Tool

The SDK includes a convenient command-line tool, `anslookup`, for quickly querying the Agent Network System.

To use it, first ensure you have built the SDK (as described above), then run the JAR directly:

```bash
# Get help and see all options (replace <version> with the actual SDK version, e.g., 0.0.3)
java -jar target/sdk-java-0.0.3-jar-with-dependencies.jar --help

# Lookup an agent by its ID
java -jar target/sdk-java-0.0.3-jar-with-dependencies.jar my-smart-agent.ans

# Lookup agents by name and trust level
java -jar target/sdk-java-0.0.3-jar-with-dependencies.jar --query ""My Smart AI Agent"" --trust-level "provisional"

# Lookup agents by capabilities (use quotes for capabilities with spaces)
java -jar target/sdk-java-0.0.3-jar-with-dependencies.jar --capabilities "search_capability,test2_feature"
```

### Step 4: Registering a New Agent

The `Main.java` file in this SDK provides an example of how to register an agent.

1. **Customize Agent Details (Optional):**
   Open `src/main/java/com/ans/sdk/Main.java` in a text editor or IDE.

   * **Agent Information:** Modify the
   * `agent.setAgentId("my-smart-agent.ans")`,
   * `agent.setName("My Smart AI Agent")`,
   * `agent.setDescription("An agent that can.....")`,
   * `agent.setOrganization("My Org")`,
   * `agent.setCapabilities(Arrays.asList("search_capability","test2_feature"))`,
   * and `agent.setEndpoints()` calls to define your agent's details.
2. **Run the Registration:**

   ```bash
   java -jar target/sdk-java-0.0.3-jar-with-dependencies.jar
   ```

### Step 5: Understanding the Output

Upon successful execution, the SDK will print:

* **Generated Public Key (PEM):** This is the public part of your agent's cryptographic identity. It is sent to the ANS backend and is publicly verifiable.
* **Generated Private Key (PEM):** This is the private part of your agent's cryptographic identity. It is saved to `ans-private_key.pem` in the SDK directory.
* **Generated Signature:** This is the cryptographic proof that you own the agent's identity. It is generated using your private key and the agent's data.
* **Registration Response:** This is the JSON response from the ANS backend, indicating whether the registration was successful.

### Step 6: Handling Your Cryptographic Keys (Crucial!)

The Java SDK generates a unique cryptographic key pair (a public key and a private key) for your agent during the registration process. **Securely managing these keys is paramount.**

* **Private Key:**
* **Purpose:** The private key is used to generate the `signature` that proves your agent's ownership.
* **Security:** Your private key **MUST be kept absolutely secret and secure**. If your private key is compromised, someone else could impersonate your agent.
* **Storage:**
  *   **NEVER** store private keys directly in your code, commit them to version control (like Git), or expose them in public logs.
  *   For development, you might temporarily store them in secure environment variables or local configuration files (ensure these are `.gitignore`d).
  *   For production, consider using dedicated secure storage solutions like:

  * **Google Cloud Secret Manager**
  * Hardware Security Modules (HSMs)
  * Key Management Systems (KMS)
* **The current `Main.java` generates a new key pair every time it runs.** For a real application, you would generate a key pair once, securely store the private key, and reuse it for subsequent registrations or updates of the same agent.
* **Public Key:**

  * **Purpose:** The public key is part of your agent's identity and is sent to the ANS backend. It allows others to verify signatures made by your private key.
  * **Security:** Public keys are, by definition, public. They do not need to be secret.
* **Signature:**

  * **Purpose:** The signature is a one-time proof of ownership for a specific registration payload. It is sent to the backend for verification.
  * **Security:** The signature itself is not sensitive after it has been used and verified. Its security relies entirely on the secrecy of the private key used to generate it.

**Remember: The security of your agent's identity hinges on the secrecy of its private key.**