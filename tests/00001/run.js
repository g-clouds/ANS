import { registerSchema } from './schemas.js';
import crypto from 'crypto';
import { v4 as uuid } from 'uuid';
import { base58btc } from 'multiformats/bases/base58';
import { CID } from 'multiformats/cid';
import { sha256 } from 'multiformats/hashes/sha2';
import { delay, streamText, clearScreen, setColors, resetColors, printLine, printPrompt, printColoredLine, printCenteredLine, ANSI_COLOR_YELLOW, ANSI_COLOR_GREEN, ANSI_COLOR_BLACK, countdown } from '../helpers/retro-console.js';
import { animateText, ansLogo, pixelCharacter, levelUpText, introAnimation } from '../helpers/visual-effects.js';
import testCard from './testcard.js';

// --- Configuration from Environment Variables ---
const config = {
    agentId: process.env.AGENT_ID || "my-realistic-agent.ans",
    agentName: process.env.AGENT_NAME || "My Realistic Agent",
    agentDescription: process.env.AGENT_DESCRIPTION || "An agent with a cryptographically valid signature.",
    agentOrganization: process.env.AGENT_ORGANIZATION || "Test Corp",
    agentCapabilities: process.env.AGENT_CAPABILITIES ? process.env.AGENT_CAPABILITIES.split(',') : ["test_capability"],
    endpointA2A: process.env.ENDPOINT_A2A || "https://test.com/a2a",
    endpointRest: process.env.ENDPOINT_REST || "https://test.com/api/v1",
};

// --- Main Test Execution ---
async function runMockRegistration() {
    clearScreen();
    setColors(); // Set blue background, white text

    // --- Test Card Display ---
    await printLine("=================================================================");
    await printColoredLine(`TEST #${testCard.number}: ${testCard.name}`, ANSI_COLOR_GREEN);
    await printLine("=================================================================");
    await delay(1500);
    await printLine("\n");
    await printLine(testCard.description);
    await delay(1500);
    await printLine(`\n\nPurpose: ${testCard.purpose}`);
    await delay(1500);
    await printLine(`\n\nLocation: ${testCard.location}`);
    await delay(1500);

    // --- Countdown Animation ---
    await countdown();

    // --- Intro Animation ---
    await introAnimation();

    await printLine("=================================================================");
    await printLine("======         ANS Mock Registration Test Run               =====");
    await printLine("=================================================================");

    await delay(500);
    await printLine("\n[  INITIALIZING TEST ENVIRONMENT  ]");
    await printLine("Preparing necessary modules and configurations...");
    await delay(1000);
    await printLine("Environment ready.\n");
    await delay(500);

    // --- Stage 1: Generate a realistic, signed payload ---

    await printLine("-----------------------------------------------------------------");
    await printColoredLine("STEP 1: FORGING IDENTITY - GENERATING CRYPTOGRAPHIC KEY PAIR", ANSI_COLOR_YELLOW);
    await printLine("-----------------------------------------------------------------");
    await printColoredLine("As an AI agent, I need a unique and secure identity to interact with the Agent Network System.", ANSI_COLOR_GREEN);
    await printColoredLine("This step creates my digital fingerprint: a public and private key pair.", ANSI_COLOR_GREEN);
    await printColoredLine("My private key is my secret, proving I am who I say I am.", ANSI_COLOR_GREEN);
    await delay(1500);

    process.stdout.write("\nGenerating keys... ");
    const { privateKey, publicKey } = crypto.generateKeyPairSync('ec', {
      namedCurve: 'prime256v1'
    });
    const publicKeyPem = publicKey.export({ type: 'spki', format: 'pem' });
    const privateKeyPem = privateKey.export({ type: 'pkcs8', format: 'pem' });
    process.stdout.write("\rKeys generated!\n");
    await delay(1000);

    await printLine("\n--- Generated Public Key (PEM Format) ---");
    await streamText(publicKeyPem);
    await printLine("--- End Public Key ---");
    await delay(1500);

    await printLine("\n--- Generated Private Key (PEM Format - KEEP SECRET) ---");
    await streamText(privateKeyPem);
    await printLine("--- End Private Key ---");
    await delay(1500);

    // --- Middle Animation ---
    await animateText(pixelCharacter, 200, 10);
    await printCenteredLine("\nLevel Up! Proceeding to Agent Data Construction...");
    await delay(1500);

    await printLine("-----------------------------------------------------------------");
    await printColoredLine("STEP 2: PREPARING CREDENTIALS - CONSTRUCTING AGENT DATA AND SIGNING", ANSI_COLOR_YELLOW);
    await printLine("-----------------------------------------------------------------");
    await printColoredLine("Now, I assemble my profile: my name, capabilities, and how other agents can reach me.", ANSI_COLOR_GREEN);
    await printColoredLine("Then, I use my private key to digitally sign this information.", ANSI_COLOR_GREEN);
    await printColoredLine("This signature is my proof of ownership, ensuring my data hasn't been tampered with.", ANSI_COLOR_GREEN);
    await delay(1500);

    process.stdout.write("\nConstructing agent data... ");
    const agent = {
      agent_id: config.agentId,
      name: config.agentName,
      description: config.agentDescription,
      organization: config.agentOrganization,
      capabilities: config.agentCapabilities,
      endpoints: {
        a2a: config.endpointA2A,
        rest: config.endpointRest
      },
      public_key: publicKeyPem,
    };
    process.stdout.write("\rAgent data constructed!\n");
    await delay(1000);

    await printLine("\n--- Message to be Signed ---");
    await streamText(JSON.stringify(agent, null, 2));
    await printLine("--- End Message ---");
    await delay(1500);

    process.stdout.write("\nGenerating signature... ");
    const sign = crypto.createSign('SHA256');
    sign.update(JSON.stringify(agent)); // Sign the actual agent object
    sign.end();
    const signature = sign.sign(privateKey, 'hex');
    process.stdout.write("\rSignature generated!\n");
    await delay(1000);

    await printLine("\n--- Generated Signature (Hex) ---");
    await streamText(signature);
    await printLine("--- End Signature ---");
    await delay(1500);

    process.stdout.write("\nAssembling final payload with proofOfOwnership... ");
    const registrationPayload = {
      ...agent,
      proofOfOwnership: {
        signature: signature,
        timestamp: new Date().toISOString()
      }
    };
    process.stdout.write("\rFinal payload assembled!\n\n");
    await delay(1000);

    await printLine("--- Final Registration Payload ---");
    await streamText(JSON.stringify(registrationPayload, null, 2));
    await printLine("--- End Payload ---");
    await delay(1500);

    // --- Stage 2: Complete Schema Validation ---

    // --- Middle Animation ---
    await animateText(pixelCharacter, 200, 10);
    await printCenteredLine("\nLevel Up! Proceeding to NETWORK Acceptance...");
    await delay(1500);

    await printLine("-----------------------------------------------------------------");
    await printColoredLine("STEP 3: NETWORK ACCEPTANCE - SCHEMA VALIDATION", ANSI_COLOR_YELLOW);
    await printLine("-----------------------------------------------------------------");
    await printColoredLine("The Agent Network System now checks if my credentials are in the correct format.", ANSI_COLOR_GREEN);
    await printColoredLine("This ensures I meet the network's standards before I can join.", ANSI_COLOR_GREEN);
    await delay(1500);

    process.stdout.write("\nValidating payload... ");
    const { error, value } = registerSchema.validate(registrationPayload);
    process.stdout.write("\rPayload validated!\n");
    await delay(1000);

    if (error) {
      await printLine("\nSchema validation FAILED:");
      await printLine(error.details);
    } else {
      await printLine("\nSchema validation PASSED!");
      await delay(1000);
      await printLine("\n--- Field-by-Field Validation Results ---");
      for (const key in value) {
        if (Object.hasOwnProperty.call(value, key)) {
            let content = value[key];
            if (typeof content === 'object') {
                content = JSON.stringify(content);
            }
            process.stdout.write(`  - [PASSED] Field '${key}' is valid. Content: ${content.toString().substring(0, 100)}...\n`);
            await delay(50); // Small delay for each field
        }
      }
      await delay(1500);
      
      // --- Stage 3: Simulate backend enrichment and print Firestore data ---

      // --- Middle Animation ---
      await animateText(pixelCharacter, 200, 10);
      await printCenteredLine("\nLevel Up! Joining to NETWORK ...");
      await delay(1500);

      await printLine("-----------------------------------------------------------------");
      await printColoredLine("STEP 4: JOINING THE NETWORK - ENRICHMENT & DATA STORAGE", ANSI_COLOR_YELLOW);
    await printLine("-----------------------------------------------------------------");
    await printColoredLine("My credentials are accepted! The ANS is now assigning me a permanent address (DID).", ANSI_COLOR_GREEN);
    await printColoredLine("My verified details are being securely stored, making me discoverable by other agents.", ANSI_COLOR_GREEN);
    await delay(1500);

    process.stdout.write("\nGenerating real DID... ");
    const hash = await sha256.digest(new TextEncoder().encode(value.public_key));
    const cid = CID.create(1, 0x70, hash);
    const multihash = cid.multihash.bytes;
    const did = `did:ans:${uuid()}:${base58btc.encode(multihash)}`;
    process.stdout.write("\rDID generated!\n");
    await delay(1000);

    const firestoreData = {
        ...value,
        did: did,
        verification_status: 'provisional',
        created_at: new Date(),
    };
    delete firestoreData.proofOfOwnership;

    process.stdout.write("\nAssembling data for Firestore storage... ");
    process.stdout.write("\rData ready for Firestore!\n");
    await delay(1000);

    await printLine("\n--- Data to be written to Firestore ---");
    await printLine("Collection: agents");
    await printLine(`Document ID: ${firestoreData.agent_id}`);
    await printLine("\nFields:");
    await printLine(`- agent_id (string): ${firestoreData.agent_id}`);
    await printLine(`- name (string): ${firestoreData.name}`);
    await printLine(`- description (string): ${firestoreData.description}`);
    await printLine(`- organization (string): ${firestoreData.organization}`);
    await printLine(`- capabilities (array): ${JSON.stringify(firestoreData.capabilities)}`);
    await printLine(`- endpoints (object): ${JSON.stringify(firestoreData.endpoints)}`);
    await printLine(`- public_key (string):\n${firestoreData.public_key}`);
    await printLine(`- did (string): ${firestoreData.did}`);
    await printLine(`- verification_status (string): ${firestoreData.verification_status}`);
    await printLine(`- created_at (timestamp): ${firestoreData.created_at.toISOString()}`);
    await delay(2000);

    // --- End Animation ---
    await animateText(levelUpText, 150, 5);
    await printColoredLine("\nTEST COMPLETE. PRESS ANY KEY TO CONTINUE...", ANSI_COLOR_GREEN);
    await delay(1000);
    resetColors();
    }
    await printPrompt();
    resetColors(); // Reset colors at the very end
}

runMockRegistration();
