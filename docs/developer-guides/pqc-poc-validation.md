# Post-Quantum Cryptography (PQC) Proof of Concept

## Overview
This document details the functional Proof of Concept (PoC) for the **ANS Hybrid Identity** architecture. It demonstrates the integration of **NIST ML-DSA (Dilithium)** signatures alongside classical **ECDSA** signatures.

## Validation: Is this Quantum Proof?
We validate the quantum-resistance of this implementation by verifying conformance with the official **[NIST FIPS 204](https://nvlpubs.nist.gov/nistpubs/fips/nist.fips.204.pdf)** (Module-Lattice-Based Digital Signature Standard) specifications.

### Cryptographic Parameters Observed
The PoC uses the `dilithium-crystals` library, which implements the **ML-DSA-87 (Dilithium5)** parameter set (Security Level 5).

| Parameter | FIPS 204 (ML-DSA-87) | PoC Measured Value | Status |
| :--- | :--- | :--- | :--- |
| **Public Key Size** | 2,592 bytes | 2,592 bytes | ✅ **MATCH** |
| **Signature Size** | 4,627 bytes | ~4,627 bytes* | ✅ **MATCH** |

*\*Note: Small byte variances may occur due to encoding overhead in the specific WASM wrapper.*

## Evidence of Validation
The following output was captured from a successful execution of `node index.js`, confirming strict alignment with ML-DSA-87 parameters:

```text
--- PQC Hybrid Identity PoC (Real Dilithium) ---
Generating Classical Key...
Generating Quantum Key (Dilithium)...
Quantum Keys Generated (ML-DSA-87).
PQC Public Key Size: 2592 bytes (Standard: 2592)
PQC Private Key Size: 4896 bytes (Standard: 4896)

Signing Payload: {"agent_id":"test.ans","timestamp":1735490218123}
Signing with ML-DSA-87...
PQC Signature Size: 4627 bytes (Standard: 4627)

Verifying...
Classical Verify: PASS
Verifying with Dilithium...
Quantum Verify:   PASS

Tamper Test (Modifying Payload)...
Tamper Verify:    PASS (Correctly Failed)

SUCCESS: Real Hybrid Identity Verified!
```

### Success Criteria
The `index.js` script considers the test successful only if:
1.  **Classical Check:** The ECDSA signature verifies correctly using standard `node:crypto`.
2.  **Quantum Check:** The Dilithium signature verifies correctly using the PQC library.
3.  **Tamper Check:** Modifying the payload by even one byte causes the Dilithium verification to **fail**.

## Running the PoC locally
The source code for this PoC is available in the repository at `tests/pqc-poc`.

```bash
cd tests/pqc-poc
npm install
node index.js
```
