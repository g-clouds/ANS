import { ANSClient } from '@ans-project/sdk-js';
import { v4 as uuidv4 } from 'uuid';
import { delay, streamText, printLine, printColoredLine, printCenteredLine, ANSI_COLOR_YELLOW, ANSI_COLOR_GREEN, ANSI_COLOR_RED } from '../helpers/retro-console.js';
import { animateText, pixelCharacter, levelUpTextMobile, introAnimation } from '../helpers/visual-effects.js';
import testCard from './testcard.js';
import axios from 'axios';

// --- Configuration ---
// IMPORTANT: Replace with your actual ANS backend URL
const ANS_BASE_URL = process.env.ANS_BASE_URL || "https://ans-register-390011077376.us-central1.run.app";

// --- Main Test Execution ---
async function runSdkLookupDemo() {
    // --- Test Card Display ---
    await printLine("=".repeat(Math.min(process.stdout.columns || 60, 60)));
    await printLine(`TEST #${testCard.number}: ${testCard.name}`);
    await printLine("=".repeat(Math.min(process.stdout.columns || 60, 60)));
    await delay(1500);
    await printLine("\n");
    await animateText(pixelCharacter, 200, 10);
    await printLine("Welcome, fellow AI. Today, we explore the Agent Network System's \nmost vital function: Discovery.");
    await printLine("This demonstration will show how agents find each other in the \nvast digital ocean.");
    await delay(2000);
    await printLine(`\n\nPurpose: ${testCard.purpose}`);
    await delay(1500);
    await printLine(`\n\nLocation: ${testCard.location}`);
    await delay(1500);

    await printLine("=".repeat(Math.min(process.stdout.columns || 60, 60)));
    await printLine("======          ANS sdk-js Agent Discovery           =====");
    await printLine("=".repeat(Math.min(process.stdout.columns || 60, 60)));

    await delay(500);
    await printLine("\n  INITIALIZING DISCOVERY PROTOCOLS...  ");
    await printLine("\nPreparing my sensors to scan the network for new connections...");
    await delay(1000);
    await printLine("Discovery protocols online. Ready to search.\n\n");
    await delay(500);

    // --- Stage 1: Register a Target Agent (for demonstration purposes) ---
    await printLine("=".repeat(Math.min(process.stdout.columns || 60, 60)));
    await printLine("STEP 1: DEPLOYING A BEACON - REGISTERING A TARGET AGENT");
    await printLine("=".repeat(Math.min(process.stdout.columns || 60, 60)));
    await printLine("To demonstrate lookup, we first need an agent to be found. I will deploy a 'Quantum Computing Agent' as our target.");
    await printLine("This agent will register itself with a unique ID and specific \ncapabilities.");
    await delay(2000);

    process.stdout.write("\nGenerating keys for Quantum Computing Agent... ");
    const { publicKey: targetPublicKey, privateKey: targetPrivateKey } = ANSClient.generateKeyPair();
    process.stdout.write("\rKeys generated!\n");
    await delay(1000);

    const targetAgentId = `quantum-agent-${uuidv4().substring(0, 8)}`;
    const targetAgentPayload = {
      agent_id: targetAgentId,
      name: "Quantum Computing Agent",
      description: "An agent capable of advanced quantum computations.",
      capabilities: ["quantum-computation", "secure-encryption"],
      endpoints: { a2a: "https://quantum.glabs.com/a2a" },
      public_key: targetPublicKey,
    };

    process.stdout.write("\nRegistering Quantum Computing Agent... ");
    const client = new ANSClient(ANS_BASE_URL);
    try {
        await client.register(targetAgentPayload, targetPrivateKey);
        process.stdout.write("\nQuantum Computing Agent registered successfully!\n");
        await delay(1000);
        await printLine(`Registered Agent ID: ${targetAgentId}`);
        await delay(1500);
    } catch (error) {
        printLine("\n--- REGISTRATION OF TARGET AGENT FAILED ---");
        await streamText(error.message);
        if (error.response) {
            await streamText(JSON.stringify(error.response.data, null, 2));
        }
        await printLine("--- End Error Details ---");
        return; // Exit if target agent registration fails
    }

    // --- Middle Animation ---
    await animateText(pixelCharacter, 200, 10);
    await printCenteredLine("\nLevel Up! The target is now on the network...");
    await delay(1500);

    // --- Stage 2: Perform Lookup ---
    await printLine("=".repeat(Math.min(process.stdout.columns || 60, 60)));
    await printLine("STEP 2: SEEKING KNOWLEDGE - PERFORMING AN AGENT LOOKUP");
    await printLine("=".repeat(Math.min(process.stdout.columns || 60, 60)));
    await printLine("Now, another agent, 'Pathfinder', needs to find an agent with \n'quantum-computation' capabilities.");
    await printLine("Pathfinder will query the ANS to discover suitable partners.");
    await delay(2000);

    process.stdout.write("\nPathfinder initiating lookup for 'quantum-computation' capability... ");
    try {
        // 1. Build the query string exactly like anslookup does
        const params = new URLSearchParams();
        params.append('capabilities', 'quantum-computation');
        params.append('capabilities', 'secure-encryption');

        const url = `https://ans-register-390011077376.us-central1.run.app/lookup?${params}`;

        // 2. Fire the request
        const { data: lookupResponse } = await axios.get(url);

        process.stdout.write("\nLookup complete! Pathfinder has scanned the network.\n");
        await delay(1000);

        // 3. Print results
        await printLine("\n--- LOOKUP RESULTS ---");
        const lookupResults = lookupResponse.results || [];
        if (lookupResults.length > 0) {
            await printLine(`Found ${lookupResults.length} agent(s) matching the query:`);
            for (const agent of lookupResults) {
                await printLine(`\n  Agent ID: ${agent.agent_id}`);
                await printLine(`  Name: ${agent.name}`);
                await printLine(`  Description: ${agent.description || 'N/A'}`);
                await printLine(`  Capabilities: ${agent.capabilities ? agent.capabilities.join(', ') : 'N/A'}`);
                await printLine(`  Endpoints: ${JSON.stringify(agent.endpoints)}`);
                await printLine(`  DID: ${agent.did || 'N/A'}`);
                await delay(1000);
            }
            await printLine("\nPathfinder has successfully identified a Quantum Computing Agent!");
        } else {
            await printLine("\nNo agents found matching the query. The network is vast, but sometimes specific knowledge is elusive.");
        }
        await printLine("--- End Lookup Results ---");
        await delay(2000);

        // 4. End animation
        await animateText(levelUpTextMobile, 150, 5);
        await printLine("\nDISCOVERY COMPLETE. PRESS ANY KEY TO CONTINUE...");
        await delay(1000);
    } catch (error) {
        process.stdout.write("\rLookup failed! Pathfinder encountered an anomaly.\n");
        await delay(1000);
        await printLine("\n--- LOOKUP FAILED ---");
        await printLine("Something went wrong during the lookup process:");
        await streamText(error.message);
        if (error.response) {
            await streamText(JSON.stringify(error.response.data, null, 2));
        }
        await printLine("--- End Error Details ---");
    }
}

runSdkLookupDemo();