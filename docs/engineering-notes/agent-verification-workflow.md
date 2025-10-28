# Engineering Note: Agent Verification Workflow

## 1. Introduction

This document provides a detailed explanation of the Agent Verification workflow within the Agent Network System (ANS). The primary goal of this workflow is to provide a cryptographically secure mechanism for any party to verify that a claim or piece of data (an "attestation") was genuinely authored by a specific agent and has not been tampered with.

This process is fundamental to establishing trust in the network. It allows agents to prove their identity and the integrity of the data they produce, which is essential for secure and reliable agent-to-agent communication and collaboration.

## 2. Core Cryptographic Principles

The entire workflow is built on the principles of **asymmetric cryptography** (also known as public-key cryptography). The key concepts are:

- **Key Pair:** Each agent generates a unique pair of keys: a **private key** and a **public key**.
- **Private Key:** This key is kept absolutely secret by the agent. It is used for **signing** data.
- **Public Key:** This key is shared openly and is part of the agent's public record in the ANS. It is used for **verifying** signatures.

The mathematical relationship between the keys ensures that a signature created with a private key can **only** be verified by its corresponding public key.

## 3. The End-to-End Verification Workflow

The process involves three main stages: Registration, Signing, and Verification.

### Stage 1: Agent Registration (Establishing Identity)

Before an agent can have its claims verified, it must have a recognized identity on the network.

1. The agent generates a public/private key pair.
2. It creates a registration payload containing its details, including its **public key**.
3. The agent registers with the ANS. The ANS stores the agent's details, including its public key, in the Firestore database. This public key is now the official, trusted key for that agent.

### Stage 2: Claim Creation and Signing (Client-Side)

This is the process an agent follows to create a verifiable claim. This is demonstrated in the `tests/00008/run.js` end-to-end test.

1. **Create the Attestation:** The agent creates a piece of data it wants to prove ownership of. This can be any structured data (e.g., a JSON object). This is the "attestation" or "claim."

   ```javascript
   // Example from tests/00008/run.js
   const attestation = {
       claim: "This agent is certified for high-security operations.",
       timestamp: new Date().toISOString(),
       issuer: agentId
   };
   ```
2. **Sign the Attestation:** The agent uses its **private key** to create a unique digital signature for the attestation. The signature is a hash of the data, encrypted with the private key.

   ```javascript
   // Example from tests/00008/run.js
   const sign = crypto.createSign('SHA256');
   sign.update(JSON.stringify(attestation)); // Hash the exact data
   const signature = sign.sign(privateKey, 'hex'); // Sign with the private key
   ```

At this point, the agent has the original `attestation` and a `signature` that acts as cryptographic proof.

### Stage 3: The Verification Request (The Moment of Truth)

A third party (the "verifier") who wants to confirm the agent's claim now makes a request to the ANS `/verify` endpoint.

1. **The API Call:** The verifier sends a `POST` request to `/verify` with the following payload:

   - `agent_id`: The ID of the agent that made the claim.
   - `attestation`: The original, unaltered claim data.
   - `signature`: The signature provided by the agent.
   - `public_key`: The public key of the agent that is being used for verification.

   ```javascript
   // Example from tests/00008/run.js
   const verificationResult = await client.verify(agentId, attestation, signature, publicKey);
   ```
2. **The Backend Verification Process:** The ANS backend receives the request and executes the logic in `backend/src/routes/verify.js`.

   ```javascript
   // Simplified logic from backend/src/routes/verify.js
   export async function verifyHandler(req, res) {
     const { agent_id, attestation, signature, public_key } = req.body;

     // 1. (Optional but recommended) Look up the agent to ensure it exists.
     const doc = await db.collection('agents').doc(agent_id).get();
     if (!doc.exists) return res.status(404).send({ message: 'Agent not found' });

     // 2. Perform the cryptographic verification.
     const verify = crypto.createVerify('SHA256');
     verify.update(JSON.stringify(attestation)); // Hash the original data again.
     verify.end();

     // 3. Use the public key to check the signature against the hash.
     const ok = verify.verify(public_key, signature, 'hex');

     // 4. Return the result.
     res.send({ success: true, isValid: ok });
   }
   ```

   - The backend re-hashes the `attestation` data. This is critical; if even one byte of the data was changed, the hash would be different, and the verification would fail.
   - It then uses the `crypto.verify()` function, providing the public key and the signature. This function returns `true` only if the signature was genuinely created by the corresponding private key for that exact data.
3. **The Result:** The verifier receives a simple JSON response: `{"success": true, "isValid": true}` or `{"success": true, "isValid": false}`. This provides a definitive, trustworthy answer as to whether the claim is authentic.

## 4. Security Implications

This workflow provides two critical security guarantees:

1. **Data Integrity:** Because the signature is based on a hash of the data, it's impossible to change the data without invalidating the signature. This proves the data has not been tampered with.
2. **Non-Repudiation:** Because only the agent possesses the private key, a valid signature proves that the agent (and no one else) created that signature. The agent cannot later deny having signed the data.

This makes the `/verify` endpoint a cornerstone of the trust infrastructure within the Agent Network System.
