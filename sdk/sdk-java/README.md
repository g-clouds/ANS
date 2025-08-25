# ANS Java SDK: Agent Registration Guide

This guide provides instructions for end-users on how to register a new agent with the Agent Network System (ANS) using the Java SDK.

## 1. Prerequisites

* **Java Development Kit (JDK):** Version 11 or higher.
* **Apache Maven:** For building the SDK.

## 2. Get Started

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

### Using the `anslookup` Command-Line Tool

The SDK includes a convenient command-line tool, `anslookup`, for quickly querying the Agent Network System.

To use it, first ensure you have built the SDK (as described above), then run the JAR directly:

```bash
# Get help and see all options (replace <version> with the actual SDK version, e.g., 0.0.3)
java -jar target/sdk-java-0.0.3-jar-with-dependencies.jar --help

# Lookup an agent by its ID
java -jar target/sdk-java-0.0.3-jar-with-dependencies.jar translator.ans

# Lookup agents by name and trust level
java -jar target/sdk-java-0.0.3-jar-with-dependencies.jar --query "Translator" --trust-level "provisional"

# Lookup agents by capabilities (use quotes for capabilities with spaces)
java -jar target/sdk-java-0.0.3-jar-with-dependencies.jar --capabilities "sales,lead generation"
```

## 3. Registering a New Agent

The `Main.java` file in this SDK provides an example of how to register an agent.

1. **Customize Agent Details (Optional):**
   Open `src/main/java/com/ans/sdk/Main.java` in a text editor or IDE.

   * **Cloud Run Endpoint:** Update the `cloudRunUrl` variable with the actual URL of your deployed ANS backend Cloud Run service.
   * **Agent Information:** Modify the `agent.setAgentId("my-smart-agent.ans")`, `agent.setName("My Smart AI Agent")`, `agent.setDescription("An agent that can.....")`, `agent.setOrganization("My Org")`, `agent.setCapabilities(Arrays.asList("search_capability", "test2_feature"))`, and `agent.setEndpoints()` calls to define your agent's details.
2. **Run the Registration:**

   ```bash
   java -jar target/sdk-java-0.0.3-jar-with-dependencies.jar
   ```

## 4. Understanding the Output

Upon successful execution, the SDK will print:

* **Generated Public Key (PEM):** This is the public part of your agent's cryptographic identity. It is sent to the ANS backend and is publicly verifiable.
* **Generated Private Key (PEM):** This is the private part of your agent's cryptographic identity. It is saved to `ans-private_key.pem` in the SDK directory.
* **Generated Signature:** This is the cryptographic proof that you own the agent's identity. It is generated using your private key and the agent's data.
* **Registration Response:** This is the JSON response from the ANS backend, indicating whether the registration was successful.

## 5. Handling Your Cryptographic Keys (Crucial!)

The Java SDK generates a unique cryptographic key pair (a public key and a private key) for your agent during the registration process. **Securely managing these keys is paramount.**

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
  * **The current `Main.java` generates a new key pair every time it runs.** For a real application, you would generate a key pair once, securely store the private key, and reuse it for subsequent registrations or updates of the same agent.
* **Public Key:**

  * **Purpose:** The public key is part of your agent's identity and is sent to the ANS backend. It allows others to verify signatures made by your private key.
  * **Security:** Public keys are, by definition, public. They do not need to be secret.
* **Signature:**

  * **Purpose:** The signature is a one-time proof of ownership for a specific registration payload. It is sent to the backend for verification.
  * **Security:** The signature itself is not sensitive after it has been used and verified. Its security relies entirely on the secrecy of the private key used to generate it.

**Remember: The security of your agent's identity hinges on the secrecy of its private key.**
