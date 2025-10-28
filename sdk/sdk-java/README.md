# ANS Java SDK: Agent Registration & Lookup Guide

This guide provides instructions for end-users on how to use the Java SDK to programmatically register a new agent with the Agent Network System (ANS) and then look it up to verify the registration.

## 1. Prerequisites

*   **Java Development Kit (JDK):** Version 11 or higher.
*   **Apache Maven:** For building the SDK.

## 2. How to Run the Example

The SDK includes a `Main.java` file that serves as a complete, runnable example of the registration and lookup process.

### Step 1: Build the SDK

First, clone the repository and build the project using Maven. This command compiles the code and packages the SDK into a single, executable JAR file.

```bash
# Navigate to the Java SDK directory from the root of the ANS project
cd sdk/sdk-java

# Build the project
mvn clean install
```

### Step 2: Customize and Run the Example

The `Main.java` file is pre-configured to register a sample agent (`my-smart-agent.ans`) and then perform a lookup for it.

1.  **Customize Agent Details (Optional):**
    If you wish, you can modify the agent details by editing the `src/main/java/com/ans/sdk/Main.java` file in your IDE or a text editor.

2.  **Run the Example:**
    Execute the packaged JAR file from your terminal. This will run the `main` method in the `Main.java` file.

    ```bash
    # Replace <version> with the actual version from your pom.xml, e.g., 0.0.3
    java -jar target/sdk-java-0.0.3-jar-with-dependencies.jar
    ```

## 3. Understanding the Output

Upon successful execution, the script will print the following to the console:

1.  **Generated Keys:** The public and private keys for the new agent. The private key is also saved to a `ans-private_key.pem` file.
2.  **Generated Signature:** The cryptographic proof of ownership for the registration payload.
3.  **Registration Response:** The JSON response from the ANS backend confirming the agent was successfully registered.
4.  **Lookup Response:** The JSON response from the ANS backend showing the details of the agent that was just looked up.

## 4. Handling Your Cryptographic Keys (Crucial!)

The Java SDK generates a unique cryptographic key pair for your agent. **Securely managing these keys is paramount.**

*   **Private Key:**
    *   **Purpose:** The private key is used to generate the `signature` that proves your agent's ownership.
    *   **Security:** Your private key **MUST be kept absolutely secret and secure**. If it is compromised, another party could impersonate your agent.
    *   **Storage:** For production applications, use a dedicated secure storage solution like **Google Cloud Secret Manager**, another KMS, or a Hardware Security Module (HSM). Never commit private keys to version control.

*   **Public Key:**
    *   **Purpose:** The public key is part of your agent's public identity and is sent to the ANS backend. It allows others to verify signatures made with your private key. It does not need to be kept secret.

**Remember: The security of your agent's identity hinges on the secrecy of its private key.**
