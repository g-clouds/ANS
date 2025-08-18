# ANS Java SDK: Agent Registration Guide

This guide provides instructions for end-users on how to register a new agent with the Agent Network System (ANS) using the Java SDK.

## 1. Prerequisites

* **Java Development Kit (JDK):** Version 11 or higher.
* **Apache Maven:** For building the SDK.

## 2. Get Started

1. **Clone the ANS Repository:**

   ```bash
   git clone https://github.com/g-clouds/ANS.git
   cd ans
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

## 3. Registering a New Agent

The `Main.java` file in this SDK provides an example of how to register an agent.

1. **Customize Agent Details (Optional):**
   Open `src/main/java/com/ans/sdk/Main.java` in a text editor or IDE.

   * **Cloud Run Endpoint:** Update the `cloudRunUrl` variable with the actual URL of your deployed ANS backend Cloud Run service.
   * **Agent Information:** Modify the `agent.setAgentId("my-smart-agent.ans")`, `agent.setName("My Smart AI Agent")`, etc., to define your agent's details.
2. **Run the Registration:**

   ```bash
   java -jar target/sdk-java-0.0.2-jar-with-dependencies.jar
   ```

## 4. Understanding the Output

Upon successful execution, the SDK will print:

* **Generated Public Key (PEM):** This is the public part of your agent's cryptographic identity.
* **Generated Private Key (PEM):** The example code prints the private key for demonstration purposes. **This is not a secure practice for production use.**
* **Generated Signature:** This is the cryptographic proof that you own the agent's identity.
* **Registration Response:** This is the JSON response from the ANS backend.

## 5. Handling Your Cryptographic Keys (Crucial!)

The Java SDK generates a unique cryptographic key pair. **Securely managing these keys is paramount.**

* **Private Key:**

  * **Purpose:** The private key is used to generate the `signature` that proves your agent's ownership.
  * **Security:** Your private key **MUST be kept absolutely secret and secure**.
  * **Storage:** For production, use a dedicated secure storage solution like **Google Cloud Secret Manager**, another cloud provider's secret manager, or a Hardware Security Module (HSM).
  * **The included `Main.java` example generates a new key pair every time it runs.** For a real application, you would generate a key pair once, securely store the private key, and reuse it for subsequent registrations or updates of the same agent.

* **Public Key:**

  * **Purpose:** The public key is part of your agent's identity and is sent to the ANS backend.
  * **Security:** Public keys are, by definition, public and do not need to be kept secret.

## 6. Publishing to GitHub Packages

This SDK is configured for deployment to the GitHub Packages Maven registry.

1.  **Configure `pom.xml`**: The `pom.xml` in this directory has already been configured with the necessary `<distributionManagement>` section pointing to the correct GitHub repository.

2.  **Authenticate**: Before you can deploy, you must configure your local Maven `settings.xml` file (located in your user's `.m2/` directory) with your GitHub credentials. Use your GitHub username and a Personal Access Token (PAT) with the `write:packages` scope.
    ```xml
    <servers>
      <server>
        <id>github</id>
        <username>YOUR_GITHUB_USERNAME</username>
        <password>YOUR_GITHUB_PAT</password>
      </server>
    </servers>
    ```

3.  **Deploy**: Once your credentials are configured, run the following command from this directory (`sdk/sdk-java`) to publish the package:
    ```bash
    mvn deploy
    ```