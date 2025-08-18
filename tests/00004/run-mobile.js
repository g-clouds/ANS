import { ANSClient } from '@ans-project/sdk-js';
import { v4 as uuidv4 } from 'uuid';
import { printLine } from '../helpers/retro-console.js';
import testCard from './testcard.js';

// --- Configuration ---
// IMPORTANT: Replace with your actual ANS backend URL
const ANS_BASE_URL = process.env.ANS_BASE_URL || "https://ans-register-390011077376.us-central1.run.app";
const NUM_AGENTS = 100;

// --- Main Test Execution ---
async function runSdkStressTest() {
    // --- Test Card Display ---
    await printLine("=================================================================");
    await printLine(`TEST #${testCard.number}: ${testCard.name}`);
    await printLine("=================================================================");
    await printLine(`
Purpose: ${testCard.purpose}`);
    await printLine(`
This test will register ${NUM_AGENTS} agents.`);

    const client = new ANSClient(ANS_BASE_URL);

    for (let i = 0; i < NUM_AGENTS; i++) {
        //await printLine(`Registering Agent ${i + 1} of ${NUM_AGENTS}`);

        const { publicKey, privateKey } = ANSClient.generateKeyPair();

        const agentPayload = {
            agent_id: `agent-${uuidv4()}`,
            name: `Test Agent ${i + 1}`,
            capabilities: ["stress-test"],
            endpoints: { a2a: "https://example.com/a2a" },
            public_key: publicKey,
        };

        try {
            const registrationResult = await client.register(agentPayload, privateKey);
            await printLine(`${agentPayload.name} ✓`);
        } catch (error) {
            await printLine("--- REGISTRATION FAILED ---");
            await printLine(error.message);
            if (error.response) {
                await printLine(JSON.stringify(error.response.data, null, 2));
            }
        }
    }
}

runSdkStressTest();
