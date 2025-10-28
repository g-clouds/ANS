import { ANSClient } from '@ans-project/sdk-js';
import { v4 as uuidv4 } from 'uuid';
import crypto from 'crypto';
import { delay, streamText, printLine, printColoredLine, ANSI_COLOR_YELLOW, ANSI_COLOR_GREEN, ANSI_COLOR_RED, clearScreen, setColors } from '../helpers/retro-console.js';
import { animateText, pixelCharacter, levelUpTextMobile } from '../helpers/visual-effects.js';
import testCard from './testcard.js';

// --- Configuration ---
const ANS_BASE_URL = process.env.ANS_BASE_URL || "https://ans-register-390011077376.us-central1.run.app";

// --- Main Test Execution ---
async function runVerificationTest() {
    clearScreen();
    setColors();

    await printLine("=".repeat(60));
    await printColoredLine(`TEST #${testCard.number}: ${testCard.name}`, ANSI_COLOR_GREEN);
    await printLine("=".repeat(60));
    await delay(1.5);
    await printLine(`\nPurpose: ${testCard.purpose}`);
    await delay(2);

    // --- Stage 1: Register a new agent to act as the verifier ---
    await printLine("\n" + "=".repeat(60));
    await printColoredLine("STEP 1: ESTABLISHING A TRUSTED IDENTITY", ANSI_COLOR_YELLOW);
    await printLine("=".repeat(60));
    await printLine("First, I need to exist on the network. I will register a new agent to serve as our identity for this test.");
    await delay(2);

    const client = new ANSClient(ANS_BASE_URL);
    const { publicKey, privateKey } = ANSClient.generateKeyPair();
    const agentId = `verifier-agent-${uuidv4().substring(0, 8)}`;

    const agentPayload = {
      agent_id: agentId,
      name: "Verification Test Agent",
      capabilities: ["verification-test"],
      public_key: publicKey,
    };

    try {
        await client.register(agentPayload, privateKey);
        await printColoredLine(`\nAgent '${agentId}' registered successfully. Identity established.`, ANSI_COLOR_GREEN);
    } catch (error) {
        await printColoredLine("\n--- AGENT REGISTRATION FAILED ---", ANSI_COLOR_RED);
        await streamText(error.message);
        return;
    }
    await delay(2);

    // --- Stage 2: Create and Sign a Claim ---
    await printLine("\n" + "=".repeat(60));
    await printColoredLine("STEP 2: MAKING A VERIFIABLE CLAIM", ANSI_COLOR_YELLOW);
    await printLine("=".repeat(60));
    await printLine("Now, I will make a claim—an 'attestation'—and sign it with my private key.");
    await printLine("This signature is cryptographic proof that I, and only I, authored this claim.");
    await delay(2);

    const attestation = {
        claim: "This agent is certified for high-security operations.",
        timestamp: new Date().toISOString(),
        issuer: agentId
    };

    const sign = crypto.createSign('SHA256');
    sign.update(JSON.stringify(attestation));
    const signature = sign.sign(privateKey, 'hex');

    await printLine("\n--- Attestation Data ---");
    await streamText(JSON.stringify(attestation, null, 2));
    await printLine("\n--- Signature (Proof) ---");
    await streamText(signature);
    await delay(2);

    // --- Stage 3: Perform a REAL Verification (Valid Case) ---
    await printLine("\n" + "=".repeat(60));
    await printColoredLine("STEP 3: REAL VERIFICATION - THE MOMENT OF TRUTH", ANSI_COLOR_YELLOW);
    await printLine("=".repeat(60));
    await printLine("I will now send my claim and signature to the ANS for verification.");
    await printLine("The network will use my public key to check if the signature is authentic.");
    await delay(2);

    try {
        const verificationResult = await client.verify(agentId, attestation, signature, publicKey);
        if (verificationResult.isValid) {
            await printColoredLine("\n--- VERIFICATION SUCCESSFUL! ---", ANSI_COLOR_GREEN);
            await printLine("The ANS has confirmed the signature is valid. The claim is authentic.");
            await printLine("\n--- Backend Response ---");
            await streamText(JSON.stringify(verificationResult, null, 2));
        } else {
            await printColoredLine("\n--- VERIFICATION FAILED (UNEXPECTED) ---", ANSI_COLOR_RED);
            await printLine("The signature was expected to be valid, but the network rejected it.");
            await printLine("\n--- Backend Response ---");
            await streamText(JSON.stringify(verificationResult, null, 2));
        }
    } catch (error) {
        await printColoredLine("\n--- VERIFICATION ERROR ---", ANSI_COLOR_RED);
        await streamText(error.message);
    }
    await delay(2);

    // --- Stage 4: Perform a REAL Verification (Invalid Case) ---
    await printLine("\n" + "=".repeat(60));
    await printColoredLine("STEP 4: TESTING FORGERY - INVALID SIGNATURE", ANSI_COLOR_YELLOW);
    await printLine("=".repeat(60));
    await printLine("What if someone tries to forge my signature? I will test this by sending the same claim with a fake signature.");
    await delay(2);

    const invalidSignature = "0000111122223333deadbeef";
    try {
        const invalidResult = await client.verify(agentId, attestation, invalidSignature, publicKey);
        if (!invalidResult.isValid) {
            await printColoredLine("\n--- VERIFICATION CORRECTLY FAILED! ---", ANSI_COLOR_GREEN);
            await printLine("The ANS correctly identified the signature as invalid. The system is secure against forgery.");
            await printLine("\n--- Backend Response ---");
            await streamText(JSON.stringify(invalidResult, null, 2));
        } else {
            await printColoredLine("\n--- SECURITY ALERT: VERIFICATION SUCCEEDED (UNEXPECTED) ---", ANSI_COLOR_RED);
            await printLine("The invalid signature was accepted by the network. This is a critical security flaw.");
            await printLine("\n--- Backend Response ---");
            await streamText(JSON.stringify(invalidResult, null, 2));
        }
    } catch (error) {
        await printColoredLine("\n--- VERIFICATION ERROR ---", ANSI_COLOR_RED);
        await streamText(error.message);
    }
    await delay(2);

    await animateText(levelUpTextMobile, 150, 5);
    await printColoredLine("\nVERIFICATION TEST COMPLETE.", ANSI_COLOR_GREEN);
}

runVerificationTest();
