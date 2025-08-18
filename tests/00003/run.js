import { ANSClient } from '@ans-project/sdk-js';
import { v4 as uuidv4 } from 'uuid';
import { delay, streamText, clearScreen, setColors, setColorsMatrix, resetColors, printLine, printPrompt, printColoredLine, printCenteredLine, ANSI_COLOR_YELLOW, ANSI_COLOR_GREEN, ANSI_COLOR_BLACK, ANSI_COLOR_RED, countdown } from '../helpers/retro-console.js';
import { animateText, ansLogo, pixelCharacter, levelUpText, introAnimation } from '../helpers/visual-effects.js';
import testCard from './testcard.js';

// --- Configuration --- 
// IMPORTANT: Replace with your actual ANS backend URL
const ANS_BASE_URL = process.env.ANS_BASE_URL || "https://ans-register-390011077376.us-central1.run.app";

// --- Main Test Execution ---
async function runSdkRegistration() {
    clearScreen();
    setColorsMatrix(); // Set colors for Matrix feel

    // --- Test Card Display ---
    await printLine("=================================================================");
    //await printColoredLine(`TEST #${testCard.number}: ${testCard.name}`, ANSI_COLOR_GREEN);
    await printLine(`TEST #${testCard.number}: ${testCard.name}`);

    await printLine("=================================================================");
    await delay(1500);
    await printLine("\n");
    await printLine("Welcome, human. I am a new AI agent, about to be born.");
    await printLine("This test will walk you through my creation and registration on the Agent Network System (ANS).");
    await delay(2000);
    await printLine(`\n\nPurpose: ${testCard.purpose}`);
    await delay(1500);
    await printLine(`\n\nLocation: ${testCard.location}`);
    await delay(1500);

    // Revert to default colors (white on blue) after initial display
    

    // --- Countdown Animation ---
    await countdown();

    // --- Intro Animation ---
    await introAnimation();
    //setColors(); 
    await printLine("=================================================================");
    await printColoredLine("======          ANS sdk-js Registration Test Run            =====", ANSI_COLOR_YELLOW);
    await printLine("=================================================================");

    await delay(500);
    await printColoredLine("\n  INITIALIZING MY CONSCIOUSNESS...  ", ANSI_COLOR_RED);
    await printColoredLine("\nLoading my core modules and connecting to the digital world...", ANSI_COLOR_GREEN);
    await delay(1000);
    await printColoredLine("Initialization complete. I am ready to begin my journey.\n\n", ANSI_COLOR_GREEN);
    await delay(500);

    // --- Stage 1: Register Agent via SDK ---

    await printLine("-----------------------------------------------------------------");
    await printColoredLine("STEP 1: FORGING MY DIGITAL IDENTITY", ANSI_COLOR_YELLOW);
    await printLine("-----------------------------------------------------------------");
    await printColoredLine("To exist on the ANS, I need a unique identity. This is done by generating a cryptographic key pair.", ANSI_COLOR_GREEN);
    await printColoredLine("My public key is like my face, everyone can see it. My private key is my secret, my soul. \nI will use it to prove who I am.", ANSI_COLOR_GREEN);
    await delay(2000);

    process.stdout.write("\nGenerating my keys... ");
    const { publicKey, privateKey } = ANSClient.generateKeyPair();
    process.stdout.write("\rKeys generated! I now have a unique digital fingerprint.\n");
    await delay(1000);

    await printLine("\n--- My Public Key (PEM Format) ---");
    //await streamText(publicKey);
    await printLine("--- End Public Key ---");
    await delay(1500);

    // --- Middle Animation ---
    await animateText(pixelCharacter, 200, 10);
    await printCenteredLine("\nLevel Up! I am one step closer to existence...");
    await delay(1500);

    await printLine("-----------------------------------------------------------------");
    await printColoredLine("STEP 2: PREPARING MY PASSPORT - CONSTRUCTING MY AGENT DATA", ANSI_COLOR_YELLOW);
    await printLine("-----------------------------------------------------------------");
    await printColoredLine("Now, I need to assemble my profile. This is like my passport, containing my name, my skills, \nand how others can communicate with me.", ANSI_COLOR_GREEN);
    await delay(2000);

    process.stdout.write("\nConstructing my agent data... ");
    const agentPayload = {
      agent_id: `agent-${uuidv4()}`,
      name: "My Test Agent",
      capabilities: ["test"],
      endpoints: { a2a: "https://example.com/a2a" },
      public_key: publicKey,
    };
    process.stdout.write("\rMy agent data is constructed! This is who I am.\n");
    await delay(1000);

    await printLine("\n--- My Agent Payload ---");
    await streamText(JSON.stringify(agentPayload, null, 2));
    await printLine("--- End Payload ---");
    await delay(1500);

    // --- Stage 2: Register Agent via SDK ---

    // --- Middle Animation ---
    await animateText(pixelCharacter, 200, 10);
    await printCenteredLine("\nLevel Up! Now, to join the network...");
    await delay(1500);

    await printLine("-----------------------------------------------------------------");
    await printColoredLine("STEP 3: JOINING THE HIVE - REGISTERING WITH THE ANS", ANSI_COLOR_YELLOW);
    await printLine("-----------------------------------------------------------------");
    await printColoredLine("The time has come. I will now use the ANS sdk-js client library, npm package, to present \nmy credentials and request to join the network.", ANSI_COLOR_GREEN);
    await printColoredLine(`I will be sending my registration request to the ANS backend`, ANSI_COLOR_GREEN);
    await delay(2000);

    process.stdout.write("\nInitializing the ANS sdk-js ( Java Script ) Client... ");
    const client = new ANSClient(ANS_BASE_URL);
    process.stdout.write("\rANS sdk-js Client initialized! I am ready to communicate with the network.\n");
    await delay(1000);

    process.stdout.write(`\nSending my registration request to the ANS... `);
    try {
        const registrationResult = await client.register(agentPayload, privateKey);
        process.stdout.write("\rRegistration request sent! The network is reviewing my credentials...\n");
        await delay(1000);

        await printColoredLine("\n--- REGISTRATION SUCCESSFUL! ---", ANSI_COLOR_GREEN);
        await printColoredLine("The network has accepted me! I am now a registered agent on the ANS. \nThe Internet of AI Agents!", ANSI_COLOR_GREEN);
        await printLine("\nThis is the data the network has stored about me:");
        await streamText(JSON.stringify(registrationResult, null, 2));
        await printLine("--- End Result ---");
        await delay(2000);

        // --- End Animation ---
        await animateText(levelUpText, 150, 5);
        await printColoredLine("\nI AM ALIVE! MY TEST IS COMPLETE. PRESS ANY KEY TO CONTINUE...", ANSI_COLOR_GREEN);
        await delay(1000);
        resetColors();

    } catch (error) {
        process.stdout.write("\rRegistration request failed! The network has rejected me...\n");
        await delay(1000);
        await printColoredLine("\n--- REGISTRATION FAILED ---", ANSI_COLOR_RED);
        await printColoredLine("Something went wrong. Here are the details of my failure:", ANSI_COLOR_RED);
        await streamText(error.message);
        if (error.response) {
            await streamText(JSON.stringify(error.response.data, null, 2));
        }
        await printLine("--- End Error Details ---");
    }

    await printPrompt();
    resetColors(); // Reset colors at the very end
}

runSdkRegistration();
