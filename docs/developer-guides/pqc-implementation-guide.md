# Developer Guide: Implementing Post-Quantum Cryptography in ANS

**Target Audience:** SDK Developers, Core Contributors, High-Security Agent Operators

**Prerequisites:** Knowledge of ANS Registration workflow, basic cryptography concepts.

**Reference:** [Engineering Note: PQC Migration Roadmap](../engineering-notes/pqc-migration-roadmap.md)

---

## 1. Overview

This guide provides the low-level technical specifications for implementing the **Hybrid (Dual-Key)** architecture defined in the PQC Roadmap.

**The Goal:** Update the ANS ecosystem to support **NIST ML-DSA (Dilithium)** signatures alongside standard ECDSA signatures.

## 2. Library Selection

To ensure interoperability, we rely on the **Open Quantum Safe (OQS)** project, specifically `liboqs`, which is the industry standard reference implementation for NIST PQC algorithms.

### Node.js (JavaScript/TypeScript)
*   **Recommended Library:** `liboqs-node` (bindings for liboqs) or `krystals-dilithium` (pure WASM implementation if native bindings are problematic).
*   **Target Algorithm:** `Dilithium3` (NIST Level 3 security).

### Python
*   **Recommended Library:** `liboqs-python`
*   **Installation:**
    ```bash
    pip install liboqs
    ```

---

## 3. Data Structure Updates

We are moving from a single `public_key` string to a structured `identity` object.

### 3.1 The Hybrid Public Key Object

This object replaces the standard PEM string in the `register` payload.

```json
{
  "identity": {
    "version": "2.0-hybrid",
    "keys": {
      "primary": {
        "type": "secp256r1",
        "encoding": "pem",
        "value": "-----BEGIN PUBLIC KEY-----\nMFkwEwYHKoZIzj0CAQYIKoZIzj0DAQcDQgAE...\n-----END PUBLIC KEY-----"
      },
      "quantum": {
        "type": "ml-dsa-65", 
        "encoding": "base64",
        "value": "29c3... (approx 1.9kb of base64 data) ...a9d1"
      }
    }
  }
}
```

### 3.2 The Hybrid Signature Object

When signing a request (e.g., for `/verify` or `/register`), the `signature` field must now accommodate both algorithms.

**Legacy (Current):**
```json
"signature": "3045022100..." // Hex string of ECDSA signature
```

**Hybrid (New):**
```json
"signature": {
  "type": "hybrid",
  "primary": "3045022100...",      // Hex string (ECDSA)
  "quantum": "a7b8c9d0..."         // Hex string (Dilithium - approx 3.3kb)
}
```

---

## 4. Implementation Steps (Practical Example)

A working Proof of Concept (PoC) for Hybrid Identity is available in the repository at:
`tests/pqc-poc/index.js`

**Validation:** This PoC has been verified to produce keys and signatures that bit-for-bit match the lengths specified in **NIST FIPS 204 (ML-DSA-87)**. See the **[PQC PoC Validation Report](./pqc-poc-validation.md#evidence-of-validation)** for the execution log.

To run the PoC:
```bash
cd tests/pqc-poc
npm install
node index.js
```

### Step 1: Generating Hybrid Keys

Developers must update the `generateKeyPair` function to produce both keys.

**Node.js Example Logic:**

```javascript
// Import libraries
const { generateKeyPairSync } = require('crypto'); // Built-in for ECDSA
// const { OQS } = require('liboqs-node'); // Hypothetical import

function generateHybridKeyPair() {
  // 1. Generate Classical Key (ECDSA P-256)
  const classicalKeys = generateKeyPairSync('ec', { namedCurve: 'prime256v1' });
  const classicalPub = classicalKeys.publicKey.export({ type: 'spki', format: 'pem' });
  const classicalPriv = classicalKeys.privateKey.export({ type: 'pkcs8', format: 'pem' });

  // 2. Generate Quantum Key (Dilithium3)
  // const sig = new OQS.Signature('Dilithium3');
  // const quantumPub = sig.generate_keypair(); 
  // const quantumPriv = sig.export_secret_key();

  return {
    publicKey: {
      version: "2.0-hybrid",
      keys: {
        primary: { type: "secp256r1", value: classicalPub },
        quantum: { type: "ml-dsa-65", value: "base64_quantum_pub_key_here" }
      }
    },
    privateKey: {
      primary: classicalPriv,
      quantum: "base64_quantum_priv_key_here"
    }
  };
}
```

### Step 2: Creating a Hybrid Signature

The signing function must sign the **exact same data** with both keys.

**Python Example Logic:**

```python
import hashlib
# import oqs

def sign_hybrid(data_string, private_keys):
    # 1. Prepare Data
    # For ANS, we usually sign the SHA-256 hash of the JSON payload
    data_bytes = data_string.encode('utf-8')
    data_hash = hashlib.sha256(data_bytes).digest()

    # 2. Sign with Classical Key
    # classical_sig = private_keys['primary'].sign(data_hash) 
    
    # 3. Sign with Quantum Key
    # signer = oqs.Signature("Dilithium3")
    # signer.import_secret_key(private_keys['quantum'])
    # quantum_sig = signer.sign(data_bytes) # Note: PQC often signs message, not hash

    return {
        "type": "hybrid",
        "primary": "hex_classical_sig",
        "quantum": "hex_quantum_sig"
    }
```

### Step 3: Backend Verification Logic

The `/verify` endpoint in the backend must be updated to handle the new `signature` object structure.

**Validation Logic Flow:**

1.  **Receive Request:** `{ agent_id, data, signature, ... }`
2.  **Lookup Agent:** Retrieve stored public key object from Firestore.
3.  **Detect Scheme:**
    *   If `signature` is a string -> Run Legacy ECDSA verification.
    *   If `signature` is object AND `signature.type == 'hybrid'` -> Proceed to Hybrid check.
4.  **Hybrid Verification:**
    *   **Check 1 (Classical):** Verify `signature.primary` against stored `keys.primary`.
        *   *If Fail:* Reject immediately.
    *   **Check 2 (Quantum):** Verify `signature.quantum` against stored `keys.quantum`.
        *   *If Fail:*
            *   If `Trust Level == 'Basic'`, LOG WARNING but ACCEPT (Transition phase).
            *   If `Trust Level == 'Quantum'`, REJECT.
    *   **Success:** Return `isValid: true`.

---

## 5. Storage Optimization

Since Dilithium keys and signatures are large (~5KB overhead per interaction), efficient handling is critical.

*   **SDKs:** DO NOT send the full public key in every `/verify` request if the agent is already registered. Send only the `agent_id`. The backend will fetch the large keys from its database.
*   **Compression:** Although cryptographic data (high entropy) doesn't compress well, ensure HTTP/2 gzip/brotli is enabled on the backend to compress the JSON structural overhead.

## 6. Security Considerations

*   **Key Storage:** The `quantum` private key is just as sensitive as the `primary` one. It should be stored encrypted at rest.
*   **Crypto-Agility:** The `version` field in the identity object is crucial. If NIST standardizes a new parameter set for Dilithium (e.g., Dilithium5), or if a vulnerability is found, we can increment the version and support new algorithms without breaking the API structure.

## 7. Migration Checklist for Developers

- [ ] **Audit dependencies:** Check if your environment supports building C-bindings (required for `liboqs`).
- [ ] **Update Registration:** Modify your agent's registration script to generate and include the `quantum` key.
- [ ] **Update Verification:** If your agent performs peer-to-peer verification (A2A), update your client logic to check for the presence of `quantum` signatures from peers.

## 8. Validation & Compliance

To ensure your implementation is truly Quantum-Resistant, you must validate that your key generation aligns with the **[NIST FIPS 204](https://nvlpubs.nist.gov/nistpubs/fips/nist.fips.204.pdf)** parameters.

### 8.1 NIST Parameter Check
When integrating a PQC library, verify the byte lengths of your keys and signatures against Table 2 of FIPS 204:

| Algorithm (Security Level) | Public Key Size | Signature Size |
| :--- | :--- | :--- |
| **ML-DSA-44 (Dilithium2)** | 1,312 bytes | 2,420 bytes |
| **ML-DSA-65 (Dilithium3)** | 1,952 bytes | 3,309 bytes |
| **ML-DSA-87 (Dilithium5)** | 2,592 bytes | 4,627 bytes |

**Note:** If your output differs significantly from these values, you may be using a non-standard or pre-standard version of the algorithm (e.g., Dilithium Round 2/3), which is **NOT** compliant with the final FIPS 204 standard.

### 8.2 Tamper Testing
Always include a negative test case in your CI/CD pipeline:
1.  Sign a valid payload.
2.  Flip a single bit in the payload.
3.  Assert that `verify(payload_tampered, signature)` returns `false`.

This ensures that the PQC library is actively checking integrity and not just returning `true` defaults (a common error in mock integrations).

