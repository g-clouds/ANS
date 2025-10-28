// agent_b.js (Bob - The Verifier)
const { ANSClient } = require('@ans-project/sdk-js');
const crypto = require('crypto');
const axios = require('axios');
const { narrate, sendData, sendResult } = require('./logHelper.js');
const { delay } = require('../helpers/retro-console.js');

const ALICE_AGENT_ID = "alice.ans";

async function runVerification() {
    await narrate("Meanwhile, AI Agent Bob is activated with a mission: verify the authenticity of intel from 'alice.ans'.");
    await delay(4000);
    
    const ansClient = new ANSClient("https://ans-register-390011077376.us-central1.run.app");
    let aliceRecord;
    try {
        await narrate(`To begin, Bob queries the ANS, the single source of truth, for Alice's trusted public key.`);
        await sendData('bob', 'ans', `<b>LOOKUP</b><br>agent_id: ${ALICE_AGENT_ID}`);
        await delay(3000);
        const lookupResult = await ansClient.lookup({ agent_id: ALICE_AGENT_ID });
        if (!lookupResult.results || lookupResult.results.length === 0) throw new Error("Agent not found.");
        aliceRecord = lookupResult.results[0];
        await sendData('ans', 'bob', `<b>PUBLIC KEY</b><br>...${aliceRecord.public_key.slice(-20)}`);
    } catch (error) {
        await narrate(`Bob's mission hits a snag. The ANS lookup for Alice failed.`);
        process.exit(1);
    }
    await delay(4000);

    let signedClaim;
    try {
        await narrate("With the public key secured, Bob opens a direct channel to Alice to request the signed intel.");
        await sendData('bob', 'alice', `<b>GET</b> /get-claim`);
        await delay(3000);
        const response = await axios.get(aliceRecord.endpoints.a2a + '/get-claim');
        signedClaim = response.data;
    } catch (error) {
        await narrate(`Bob's direct request to Alice for her intel has failed!`);
        process.exit(1);
    }
    await delay(4000);

    try {
        await narrate("The final step: Bob uses the trusted key and the signed intel to perform the cryptographic verification.");
        await delay(5000);
        const { attestation, signature } = signedClaim;
        const trustedPublicKey = aliceRecord.public_key;

        const verify = crypto.createVerify('SHA256');
        verify.update(JSON.stringify(attestation));
        const isSignatureValid = verify.verify(trustedPublicKey, signature, 'hex');

        if (isSignatureValid) {
            await sendResult('SUCCESS', "VERIFICATION SUCCESSFUL");
        } else {
            await sendResult('FAILURE', "VERIFICATION FAILED");
        } 
    } catch (error) {
        await sendResult('FAILURE', `Error`);
    }
    process.exit(0);
}
runVerification();
