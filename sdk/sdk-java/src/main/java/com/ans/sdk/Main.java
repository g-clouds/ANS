package com.ans.sdk;

import com.ans.sdk.model.Agent;
import com.ans.sdk.model.ProofOfOwnership;

import java.security.KeyPair;
import java.time.Instant;
import java.util.Arrays;
import java.util.Collections;
import java.nio.file.Files;
import java.nio.file.Paths;

public class Main {
    public static void main(String[] args) {
        // Replace with your actual Cloud Run service URL
        String cloudRunUrl = "https://ans-register-390011077376.us-central1.run.app"; 

        try {
            AgentRegistrationClient client = new AgentRegistrationClient(cloudRunUrl);

            // 1. Generate Key Pair
            KeyPair keyPair = client.generateKeyPair();
            String publicKeyPem = client.exportPublicKeyToPem(keyPair.getPublic());
            System.out.println("Generated Public Key (PEM):\n" + publicKeyPem);

            // Export Private Key to PEM file
            String privateKeyPem = client.exportPrivateKeyToPem(keyPair.getPrivate());
            System.out.println("Generated Private Key (PEM):\n" + privateKeyPem);
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

        } catch (Exception e) {
            System.err.println("Error during agent registration: " + e.getMessage());
            e.printStackTrace();
        }
    }
}
