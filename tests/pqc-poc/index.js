const crypto = require('crypto');
const { dilithium } = require('dilithium-crystals');

async function runPoC() {
    console.log("--- PQC Hybrid Identity PoC (Real Dilithium) ---");

    // 1. Classical Key Generation (ECDSA P-256)
    console.log("Generating Classical Key...");
    const { publicKey: classicPub, privateKey: classicPriv } = crypto.generateKeyPairSync('ec', {
        namedCurve: 'prime256v1',
        publicKeyEncoding: { type: 'spki', format: 'pem' },
        privateKeyEncoding: { type: 'pkcs8', format: 'pem' }
    });

    // 2. Quantum Key Generation (Dilithium)
    console.log("Generating Quantum Key (Dilithium)...");
    
    // API: await dilithium.keyPair()
    const keyPair = await dilithium.keyPair(); 
    const quantumPub = Buffer.from(keyPair.publicKey).toString('base64');
    // Store private key as Buffer for signing
    const quantumPrivBuffer = keyPair.privateKey; 
    
    console.log("Quantum Keys Generated (ML-DSA-87).");
    console.log(`PQC Public Key Size: ${keyPair.publicKey.length} bytes (Standard: 2592)`);
    console.log(`PQC Private Key Size: ${keyPair.privateKey.length} bytes (Standard: 4896)`);

    // NIST FIPS 204 Compliance Check
    if (keyPair.publicKey.length !== 2592) {
        console.warn("WARNING: Public Key size deviates from FIPS 204 ML-DSA-87 standard!");
    }

    // 3. Construct Hybrid Identity Object
    const identityObject = {
        version: "2.0-hybrid",
        keys: {
            primary: {
                type: "secp256r1",
                value: classicPub
            },
            quantum: {
                type: "ml-dsa-87", // Updated to official standard name
                value: quantumPub
            }
        }
    };

    console.log("\nHybrid Identity Object:");
    console.log(JSON.stringify(identityObject, null, 2));

    // 4. Hybrid Signing
    // We sign the stringified payload
    const payloadString = JSON.stringify({ agent_id: "test.ans", timestamp: Date.now() });
    console.log(`\nSigning Payload: ${payloadString}`);
    
    // Convert payload to Uint8Array for Dilithium
    const payloadBytes = new Uint8Array(Buffer.from(payloadString));

    // Classical Sign
    const sign = crypto.createSign('SHA256');
    sign.update(payloadString);
    const classicSig = sign.sign(classicPriv, 'hex');

    // Quantum Sign
    console.log("Signing with ML-DSA-87...");
    // API: await dilithium.signDetached(message, privateKey)
    const pqSigBytes = await dilithium.signDetached(payloadBytes, quantumPrivBuffer);
    const quantumSig = Buffer.from(pqSigBytes).toString('hex');
    console.log(`PQC Signature Size: ${pqSigBytes.length} bytes (Standard: 4627)`);

    if (pqSigBytes.length !== 4627) {
         console.warn("WARNING: Signature size deviates from FIPS 204 ML-DSA-87 standard!");
    }

    const hybridSignature = {
        type: "hybrid",
        primary: classicSig,
        quantum: quantumSig
    };

    console.log("\nHybrid Signature:");
    console.log(JSON.stringify(hybridSignature, null, 2));

    // 5. Verification
    console.log("\nVerifying...");
    
    // Classical Verify
    const verify = crypto.createVerify('SHA256');
    verify.update(payloadString);
    const classicOk = verify.verify(classicPub, classicSig, 'hex');
    console.log(`Classical Verify: ${classicOk ? 'PASS' : 'FAIL'}`);

    // Quantum Verify
    console.log("Verifying with Dilithium...");
    // API: await dilithium.verifyDetached(signature, message, publicKey)
    const pqSigBytesToVerify = new Uint8Array(Buffer.from(quantumSig, 'hex'));
    const pqPubBytesToVerify = new Uint8Array(Buffer.from(quantumPub, 'base64')); // decode base64 back to bytes
    
    const quantumOk = await dilithium.verifyDetached(
        pqSigBytesToVerify, 
        payloadBytes, 
        pqPubBytesToVerify
    );
    
    console.log(`Quantum Verify:   ${quantumOk ? 'PASS' : 'FAIL'}`);

    // 6. Tamper Test
    console.log("\nTamper Test (Modifying Payload)...");
    const tamperedPayloadBytes = new Uint8Array(Buffer.from(payloadString + "hack"));
    const tamperOk = await dilithium.verifyDetached(
        pqSigBytesToVerify,
        tamperedPayloadBytes,
        pqPubBytesToVerify
    );
    console.log(`Tamper Verify:    ${!tamperOk ? 'PASS (Correctly Failed)' : 'FAIL (Tamper undetected)'}`);


    if (classicOk && quantumOk && !tamperOk) {
        console.log("\nSUCCESS: Real Hybrid Identity Verified!");
    } else {
        console.error("\nFAILURE: Verification failed.");
        process.exit(1);
    }
}

runPoC();