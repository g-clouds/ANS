# Engineering Note: Post-Quantum Cryptography (PQC) Migration Roadmap

**Status:** Draft / Request for Comment

**Date:** 2024-12-29

**Context:** Security Hardening, Future-Proofing

**Related Components:** `ans-sdk`, `backend/verify`, `registry-schema`


## 1. Executive Summary

The Agent Network System (ANS) currently relies on classical asymmetric cryptography (Elliptic Curve `secp256r1`) for agent identity, authentication, and claim verification. While secure against current computing capabilities, these algorithms are vulnerable to Shor's Algorithm running on a sufficiently powerful Cryptographically Relevant Quantum Computer (CRQC).

This roadmap outlines the strategy to transition ANS to a **Quantum-Secure** state using **Post-Quantum Cryptography (PQC)**. The primary objective is to implement a **Hybrid (Dual-Key) Architecture** that maintains backward compatibility while introducing NIST-standardized PQC algorithms (ML-DSA / Dilithium) to secure the network against future threats and "store-now-decrypt-later" attacks.

## 2. Threat Model & Motivation

### 2.1 The Quantum Threat

* **Identity Impersonation:** A quantum adversary could derive an agent's private key from its public key, allowing them to sign malicious payloads, impersonate trusted agents, or conduct Man-in-the-Middle (MitM) attacks.
* **Retroactive Decryption:** Encrypted traffic captured today could be decrypted in the future. While ANS focuses on discovery (public data), the A2A (Agent-to-Agent) communication links established via ANS often rely on key exchanges that must be quantum-hardened.

### 2.2 Algorithm Selection (NIST Standards)

We align with the official **[NIST FIPS 204](https://nvlpubs.nist.gov/nistpubs/fips/nist.fips.204.pdf)** (August 2024) standard:

| Purpose                                 | Current (Classical)   | Target PQC Standard         | Implementation Candidate                    |
| :-------------------------------------- | :-------------------- | :-------------------------- | :------------------------------------------ |
| **Digital Signatures** (Identity) | ECDSA (`secp256r1`) | **ML-DSA**            | **ML-DSA-65** (Dilithium3 equivalent) |
| **Key Encapsulation** (Transport) | ECDH / RSA            | **ML-KEM** (FIPS 203) | **ML-KEM-768** (Kyber768 equivalent)  |

**Note:** We have selected **Dilithium** over Falcon due to easier implementation (no floating-point requirements) and robust library support, despite slightly larger key sizes. SPHINCS+ was rejected due to signature size and performance latency unsuitable for high-frequency agent lookups.

## 3. Technical Architecture: The Hybrid Approach

To ensure a smooth transition without breaking existing agents, ANS will adopt a **Crypto-Agile Hybrid Strategy**.

### 3.1 Registry Schema Update

The agent data model in Firestore and the SDKs must be updated to support a secondary key.

**Current Schema:**

```json
{
  "agent_id": "agent.ans",
  "public_key": "raw_ecdsa_pem_string"
}
```

**Proposed Hybrid Schema:**

```json
{
  "agent_id": "agent.ans",
  "identity": {
    "version": 2,
    "keys": {
      "primary": {
        "type": "secp256r1",
        "value": "raw_ecdsa_pem_string"
      },
      "quantum": {
        "type": "ml-dsa-65", // Dilithium3
        "value": "base64_encoded_pqc_key"
      }
    }
  }
}
```

### 3.2 Hybrid Signatures

When an agent signs a payload (e.g., for `verify` or `register`), the signature object will become a composite:

```javascript
const signature = {
  classical: "ecdsa_signature_hex...", 
  quantum: "dilithium_signature_hex..." 
};
```

The verification logic will enforce rules based on the `Trust Level` requested:

* **Basic Trust:** Validates `classical` signature only.
* **Quantum Trust:** Validates **BOTH** `classical` and `quantum` signatures.

## 4. Implementation Phases



### Phase 1: Foundation & Dependencies (Q1 2026)

*   **Objective:** Enable SDKs to generate PQC keys.

*   **Actions:**

    *   Integrate `liboqs` (Open Quantum Safe) bindings into Node.js and Python SDKs.

    *   Update `ANSClient.generateKeyPair()` to produce hybrid keys.

    *   Update Backend API to accept (but not yet enforce) the new schema fields.



### Phase 2: Dual-Stack Support (Q2 2026)

*   **Objective:** Allow early adopters to register PQC identities.

*   **Actions:**

    *   Update `register` endpoint to validate PQC keys if provided.

    *   Update `verify` endpoint to perform hybrid verification.

    *   Add `is_quantum_secure` boolean flag to Lookup responses.

    *   Update `anslookup` CLI to display quantum security status.



### Phase 3: Transition & Enforcement (Q4 2026)

*   **Objective:** Make PQC the standard for high-trust agents.

*   **Actions:**

    *   **Policy Update:** Agents requesting `trust_level="blockchain"` MUST provide a PQC key.

    *   **Deprecation Warning:** Issue warnings for "Classical Only" registrations.

    *   **A2A Handshake:** Update the A2A protocol spec to prefer ML-KEM (Kyber) for session key exchange.



### Phase 4: Quantum Native (Long Term / Post-2027)



* **Objective:** Full deprecation of classical algorithms (timeline dependent on quantum computing progress).
* **Actions:**
  * Make classical keys optional (or remove them entirely if purely PQC-native ecosystem is desired).
  * Switch `primary` key slot to PQC.

## 5. Performance & Storage Implications

Moving to PQC introduces overhead that must be accounted for in infrastructure planning.

| Metric                    | Classical (ECDSA) | PQC (Dilithium3)  | Impact                                                      |
| :------------------------ | :---------------- | :---------------- | :---------------------------------------------------------- |
| **Public Key Size** | ~64 bytes         | ~1,952 bytes      | **30x increase** in storage per agent.                |
| **Signature Size**  | ~64 bytes         | ~3,293 bytes      | **50x increase** in payload size for signed messages. |
| **Verify Speed**    | Fast              | Fast (comparable) | Negligible CPU impact; primary cost is bandwidth/storage.   |

**Mitigation:**

* **Storage:** Firestore costs will increase slightly, but text-based keys are still small relative to other metadata (descriptions, policies).
* **Bandwidth:** SDKs should compress payloads where possible.
* **Caching:** The `Global Cache Layer` (Redis) becomes even more critical to avoid fetching large keys repeatedly from the database.

## 6. Infrastructure Augmentation (QKD)

While PQC secures the *application layer*, we recommend high-value node operators (e.g., Government, Banking) augment their *physical layer* with **Quantum Key Distribution (QKD)** links for backend-to-backend synchronisation, ensuring defense-in-depth for the "Synchronisation Engine" links described in the core architecture.

## 7. References

1. **NIST PQC Project:** [https://csrc.nist.gov/projects/post-quantum-cryptography](https://csrc.nist.gov/projects/post-quantum-cryptography)
2. **Open Quantum Safe:** [https://openquantumsafe.org/](https://openquantumsafe.org/)
3. **IETF Drafts:** X.509 Certificate Extensions for Hybrid Public Key Infrastructure.
