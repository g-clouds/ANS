# How to Verify Agent Claims

Verification is the cornerstone of trust in the Agent Network System (ANS). It provides a cryptographic guarantee that a piece of data (a "claim" or "attestation") was authored by a specific agent and has not been altered.

This guide demonstrates the full end-to-end verification workflow using the Node.js SDK, which is currently the only SDK with this feature implemented.

## The Verification Workflow

The process involves three main stages, which can be performed by different parties:

1.  **Registration (The Claimant):** An agent ("Alice") registers with the ANS, publishing her **public key**. She keeps her **private key** secret.
2.  **Signing (The Claimant):** Alice creates a piece of data (the `attestation`) and uses her **private key** to generate a unique **signature** for it. She can now present the `attestation` and `signature` to anyone.
3.  **Verification (The Verifier):** Another agent ("Bob") wants to verify Alice's claim.
    *   Bob first looks up Alice on the ANS to retrieve her trusted **public key**.
    *   Bob then obtains the `attestation` and `signature` from Alice.
    *   Finally, Bob calls the ANS `verify` endpoint, providing the agent's ID, the attestation, the signature, and the public key. The ANS performs the cryptographic check and returns a boolean `isValid` result.

---

## Node.js Example

This complete example, adapted from our internal end-to-end tests, simulates the entire workflow.

```javascript
import { ANSClient } from '@ans-project/sdk-js';
import { v4 as uuidv4 } from 'uuid';
import crypto from 'crypto';

const ANS_BASE_URL = "https://ans-register-390011077376.us-central1.run.app";

async function runVerificationTest() {
    const client = new ANSClient(ANS_BASE_URL);
    const agentId = `verifier-agent-${uuidv4().substring(0, 8)}.ans`;

    // --- STEP 1: Register an agent to establish a trusted identity ---
    console.log(`Registering a new agent: ${agentId}`);
    const { publicKey, privateKey } = ANSClient.generateKeyPair();
    
    await client.register({
      agent_id: agentId,
      name: "Verification Test Agent",
      public_key: publicKey,
    }, privateKey);
    console.log("Agent registered successfully.");

    // --- STEP 2: Create and sign a claim (attestation) ---
    console.log("\nCreating and signing a claim...");
    const attestation = {
        claim: "This agent is certified for high-security operations.",
        timestamp: new Date().toISOString(),
        issuer: agentId
    };

    const sign = crypto.createSign('SHA256');
    sign.update(JSON.stringify(attestation));
    const signature = sign.sign(privateKey, 'hex');
    console.log("Claim signed.");
    console.log("  - Attestation:", JSON.stringify(attestation));
    console.log(`  - Signature: ${signature.substring(0, 40)}...`);

    // --- STEP 3: Perform verification with the valid signature ---
    console.log("\nVerifying the authentic claim with the ANS...");
    try {
        const verificationResult = await client.verify(agentId, attestation, signature, publicKey);
        if (verificationResult.isValid) {
            console.log("  - RESULT: VERIFICATION SUCCESSFUL! The signature is valid. ✅");
        } else {
            console.error("  - RESULT: VERIFICATION FAILED! This should have been valid. ❌");
        }
    } catch (error) {
        console.error("An error occurred during verification:", error.message);
    }

    // --- STEP 4: Attempt verification with tampered data ---
    console.log("\nAttempting to verify tampered data with the original signature...");
    const tamperedAttestation = { ...attestation, claim: "This is a fake claim." };

    try {
        const tamperedResult = await client.verify(agentId, tamperedAttestation, signature, publicKey);
        if (!tamperedResult.isValid) {
            console.log("  - RESULT: VERIFICATION CORRECTLY FAILED! The signature is invalid for the tampered data. ✅");
        } else {
            console.error("  - RESULT: SECURITY ALERT! Verification succeeded with tampered data. ❌");
        }
    } catch (error) {
        console.error("An error occurred during verification:", error.message);
    }
}

runVerificationTest();
```