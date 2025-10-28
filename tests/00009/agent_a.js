// agent_a.js (Alice - The Claimant)
const express = require('express');
const { ANSClient } = require('@ans-project/sdk-js');
const crypto = require('crypto');
const { narrate, sendData } = require('./logHelper.js');
const { delay } = require('../helpers/retro-console.js');

const PORT = 41250;
const AGENT_ID = "alice.ans";
const app = express();

let signedClaim = null;

async function initializeAgent() {
    await narrate('In a world of digital agents, AI Agent Alice is born. Her first task: establish a secure identity.');
    await delay(4000);
    const agentKeys = ANSClient.generateKeyPair();
    
    const client = new ANSClient("https://ans-register-390011077376.us-central1.run.app");
    const agentPayload = {
        agent_id: AGENT_ID,
        name: "Alice (Claimant Agent)",
        endpoints: { a2a: `http://localhost:${PORT}` },
        public_key: agentKeys.publicKey,
    };

    try {
        await narrate('Alice connects to the Agent Network System (ANS), the trusted network, to register her public key.');
        await sendData('alice', 'ans', `<b>REGISTER</b><br>publicKey: ...${agentKeys.publicKey.slice(-20)}`);
        await delay(3000);
        await client.register(agentPayload, agentKeys.privateKey);
    } catch (error) {
        await narrate(`Alice's registration failed! A critical error in her creation.`);
        process.exit(1);
    }
    await delay(3000);

    const attestation = {
        claim: "This document is authentic.",
        timestamp: new Date().toISOString()
    };
    const sign = crypto.createSign('SHA256');
    sign.update(JSON.stringify(attestation));
    const signature = sign.sign(agentKeys.privateKey, 'hex');
    
    signedClaim = { attestation, signature };
    await narrate('Now a recognized agent, Alice creates a critical piece of intel and signs it with her private key.');
    await delay(3000);
}

app.get('/get-claim', (req, res) => {
    sendData('alice', 'bob', `<b>SIGNED DOCUMENT</b><br>signature: ...${signedClaim.signature.slice(-20)}`);
    res.json(signedClaim);
});

app.listen(PORT, async () => {
    await initializeAgent();
    console.log('[Alice] ALICE_IS_READY');
});
