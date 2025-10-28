# Getting Started with the Java SDK

This guide will walk you through setting up a Maven project to use the Agent Network System (ANS) Java SDK for registering and looking up an AI agent.

## Prerequisites

*   Java Development Kit (JDK) version 11 or higher.
*   Apache Maven installed on your system.

## Step 1: Set Up Your Maven Project

First, create a new directory for your project and navigate into it.

```bash
mkdir my-java-ans-project
cd my-java-ans-project
```

Next, create a `pom.xml` file in this directory. This file defines your project's dependencies and build settings. The repository configuration is included to allow Maven to download the ANS SDK from GitHub Packages.

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

## Step 2: Create the Java Application

Create the necessary directory structure for your source code:

```bash
mkdir -p src/main/java/com/example
```

Now, create a file named `Main.java` inside `src/main/java/com/example/` and paste the following code into it.

```java
package com.example;

import com.ans.sdk.AgentRegistrationClient;
import com.ans.sdk.model.Agent;
import com.ans.sdk.model.ProofOfOwnership;
import com.ans.sdk.model.LookupResponse;
import com.fasterxml.jackson.databind.ObjectMapper;

import java.security.KeyPair;
import java.time.Instant;
import java.util.Arrays;
import java.nio.file.Files;
import java.nio.file.Paths;
import java.util.Map;
import java.util.HashMap;

public class Main {
    public static void main(String[] args) {
        // We will use the public gClouds-hosted ANS service for this guide
        String cloudRunUrl = "https://ans-register-390011077376.us-central1.run.app"; 

        try {
            AgentRegistrationClient client = new AgentRegistrationClient(cloudRunUrl);

            // 1. Generate a new cryptographic key pair
            System.out.println("Generating a new key pair for the agent...");
            KeyPair keyPair = client.generateKeyPair();
            String publicKeyPem = client.exportPublicKeyToPem(keyPair.getPublic());
            
            // IMPORTANT: In a real application, you must save and protect your private key!
            String privateKeyPem = client.exportPrivateKeyToPem(keyPair.getPrivate());
            Files.write(Paths.get("my-agent-private-key.pem"), privateKeyPem.getBytes());
            System.out.println("Private key saved to my-agent-private-key.pem. Keep this file secure!");

            // 2. Define the agent's public profile
            Agent agent = new Agent();
            agent.setAgentId("my-first-java-agent.ans"); // Choose a unique ID
            agent.setName("My First Java Agent");
            agent.setDescription("An agent registered via the ANS Java SDK.");
            agent.setCapabilities(Arrays.asList("quick-start-test", "java-sdk"));
            Agent.Endpoints endpoints = new Agent.Endpoints();
            endpoints.setRest("https://my-agent.example.com/api");
            agent.setEndpoints(endpoints);
            agent.setPublicKey(publicKeyPem);

            // 3. Sign the payload to create a proof of ownership
            String signature = client.signPayload(keyPair.getPrivate(), agent);
            ProofOfOwnership proof = new ProofOfOwnership();
            proof.setSignature(signature);
            proof.setTimestamp(Instant.now().toString());
            agent.setProofOfOwnership(proof);

            // 4. Register the agent
            System.out.println("\nAttempting to register agent: " + agent.getAgentId());
            String response = client.registerAgent(agent);
            System.out.println("✅ Registration successful!");
            System.out.println("Response from server: " + response);

            // 5. Look up the agent to confirm
            System.out.println("\nLooking up the newly registered agent: " + agent.getAgentId());
            Map<String, String> lookupParams = new HashMap<>();
            lookupParams.put("agent_id", agent.getAgentId());
            LookupResponse lookupResults = client.lookup(lookupParams);
            
            // Use Jackson to pretty-print the lookup result object
            ObjectMapper mapper = new ObjectMapper();
            System.out.println("✅ Lookup successful:");
            System.out.println(mapper.writerWithDefaultPrettyPrinter().writeValueAsString(lookupResults));

        } catch (Exception e) {
            System.err.println("❌ An error occurred: " + e.getMessage());
            e.printStackTrace();
        }
    }
}
```

## Step 3: Run the Application

Navigate back to the root of your `my-java-ans-project` directory and use Maven to compile and run your application. The `-U` flag forces an update of dependencies.

```bash
mvn clean install -U exec:java
```

You should see the output confirming that the agent was registered and then successfully looked up.

