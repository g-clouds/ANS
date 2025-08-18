import { ANSClient } from '@ans-project/sdk-js';
import { v4 as uuidv4 } from 'uuid';
import { delay, streamText, clearScreen, setColors, setColorsMatrix, resetColors, printLine, printPrompt, printCenteredLine, countdown } from '../helpers/retro-console.js';
import { animateText, ansLogo, pixelCharacter, levelUpTextMobile, introAnimation } from '../helpers/visual-effects.js';
import testCard from './testcard.js';

// --- Configuration --- 
// IMPORTANT: Replace with your actual ANS backend URL
const ANS_BASE_URL = process.env.ANS_BASE_URL || "https://ans-register-390011077376.us-central1.run.app";

// --- Main Test Execution ---
async function runSdkRegistration() {
    //clearScreen();

    // --- Test Card Display ---
        await printLine("=".repeat(Math.min(process.stdout.columns || 60, 60)));
        await printLine(`TEST #${testCard.number}: ${testCard.name}`);
    //

    await printLine("=".repeat(Math.min(process.stdout.columns || 60, 60)));
    await delay(1500);
    await printLine("\n");
    await animateText(pixelCharacter, 200, 10);
    await printLine("Welcome, human. I am a new AI agent, about to be born.");
    await printLine("This test will walk you through my creation and registration on the \nAgent Network System (ANS).");
    await delay(2000);
    await printLine(`\n\nPurpose: ${testCard.purpose}`);
    await delay(1500);
    await printLine(`\n\nLocation: ${testCard.location}`);
    await delay(1500);

    // Revert to default colors (white on blue) after initial display
    

    // --- Countdown Animation ---

    // --- Intro Animation ---
    await introAnimation();
    //setColors(); 
    await printLine("=".repeat(Math.min(process.stdout.columns || 60, 60)));
    await printLine("======          ANS sdk-js Registration Test Run       =====");
    await printLine("=".repeat(Math.min(process.stdout.columns || 60, 60)));

    await delay(500);
    await printLine("\n  INITIALIZING MY CONSCIOUSNESS...  ");
    await printLine("\nLoading my core modules and connecting to the digital world...");
    await delay(1000);
    await printLine("Initialization complete. I am ready to begin my journey.\n\n");
    await delay(500);

    // --- Stage 1: Register Agent via SDK ---

    await printLine("=".repeat(Math.min(process.stdout.columns || 60, 60)));
    await printLine("STEP 1: FORGING MY DIGITAL IDENTITY");
    await printLine("=".repeat(Math.min(process.stdout.columns || 60, 60)));
    await printLine("To exist on the ANS, I need a unique identity. This is done by \ngenerating a cryptographic key pair.");
    await printLine("My public key is like my face, everyone can see it. My private key is my secret, my soul. \nI will use it to prove who I am.");
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

    await printLine("=".repeat(Math.min(process.stdout.columns || 60, 60)));
    await printLine("STEP 2: PREPARING MY PASSPORT - CONSTRUCTING MY AGENT DATA");
    await printLine("=".repeat(Math.min(process.stdout.columns || 60, 60)));
    await printLine("Now, I need to assemble my profile. This is like my passport, containing my name, my skills, \nand how others can communicate with me.");
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

    await printLine("=".repeat(Math.min(process.stdout.columns || 60, 60)));
    await printLine("STEP 3: JOINING THE HIVE - REGISTERING WITH THE ANS");
    await printLine("=".repeat(Math.min(process.stdout.columns || 60, 60)));
    await printLine("The time has come. I will now use the ANS sdk-js client library, \nnpm package, to present my credentials and request to join the network.");
    await printLine(`I will be sending my registration request to the ANS backend`);
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

        await printLine("\n--- REGISTRATION SUCCESSFUL! ---");
        await printLine("The network has accepted me! I am now a registered agent on the ANS. \nThe Internet of AI Agents!");
        await printLine("\nThis is the data the network has stored about me:");
        await streamText(JSON.stringify(registrationResult, null, 2));
        await printLine("--- End Result ---");
        await delay(2000);

        // --- End Animation ---
        await animateText(levelUpTextMobile, 150, 5);
        await printLine("\nI AM ALIVE! MY TEST IS COMPLETE. PRESS ANY KEY TO CONTINUE...");
        await delay(1000);
        //resetColors();

    } catch (error) {
        process.stdout.write("\rRegistration request failed! The network has rejected me...\n");
        await delay(1000);
        await printLine("\n--- REGISTRATION FAILED ---");
        await printLine("Something went wrong. Here are the details of my failure:");
        await streamText(error.message);
        if (error.response) {
            await streamText(JSON.stringify(error.response.data, null, 2));
        }
        await printLine("--- End Error Details ---");
    }

    await printPrompt();
    //resetColors(); // Reset colors at the very end
}

runSdkRegistration();
