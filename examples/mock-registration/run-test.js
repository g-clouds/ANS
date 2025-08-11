
import { registerSchema } from './schemas.js';
import crypto from 'crypto';
import { v4 as uuid } from 'uuid';
import { base58btc } from 'multiformats/bases/base58';
import { CID } from 'multiformats/cid';
import { sha256 } from 'multiformats/hashes/sha2';

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


async function runMockRegistration() {
    console.log("=================================================================");
    console.log("======         ANS Mock Registration Test Run            =====");
    console.log("=================================================================");

    // --- Stage 1: Generate a realistic, signed payload ---

    console.log("\nStep 1: Generating cryptographic key pair...");
    const { privateKey, publicKey } = crypto.generateKeyPairSync('ec', {
      namedCurve: 'prime256v1'
    });

    const publicKeyPem = publicKey.export({ type: 'spki', format: 'pem' });
    const privateKeyPem = privateKey.export({ type: 'pkcs8', format: 'pem' });

    console.log("\n--- Generated Public Key (PEM Format) ---");
    console.log(publicKeyPem);
    console.log("--- End Public Key ---");

    console.log("\n--- Generated Private Key (PEM Format - KEEP SECRET) ---");
    console.log(privateKeyPem);
    console.log("--- End Private Key ---");

    console.log("\nStep 2: Constructing agent data from config...");
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
    console.log("Agent data constructed.");

    console.log("\nStep 3: Generating signature...");
    const message = JSON.stringify(agent);
    console.log("\n--- Message to be Signed ---");
    console.log(message);
    console.log("--- End Message ---");

    const sign = crypto.createSign('SHA256');
    sign.update(message);
    sign.end();
    const signature = sign.sign(privateKey, 'hex');
    console.log("\n--- Generated Signature (Hex) ---");
    console.log(signature);
    console.log("--- End Signature ---");

    console.log("\nStep 4: Assembling final payload with proofOfOwnership...");
    const registrationPayload = {
      ...agent,
      proofOfOwnership: {
        signature: signature,
        timestamp: new Date().toISOString()
      }
    };
    console.log("\n--- Final Registration Payload ---");
    console.log(JSON.stringify(registrationPayload, null, 2));
    console.log("--- End Payload ---");

    // --- Stage 2: Complete Schema Validation ---

    console.log("\n--- Starting Complete Schema Validation Stage ---");
    console.log("Validating the entire payload object against the Joi schema...");

    const { error, value } = registerSchema.validate(registrationPayload);

    if (error) {
      console.error("\nSchema validation FAILED:");
      console.error(error.details);
    } else {
      console.log("\nSchema validation PASSED!");
      console.log("\n--- Field-by-Field Validation Results ---");
      for (const key in value) {
        if (Object.hasOwnProperty.call(value, key)) {
            let content = value[key];
            if (typeof content === 'object') {
                content = JSON.stringify(content);
            }
            console.log(`  - [PASSED] Field '${key}' is valid. Content: ${content.toString().substring(0, 100)}...`);
        }
      }
      
      // --- Stage 3: Simulate backend enrichment and print Firestore data ---

      console.log("\n--- Simulating Backend Data Enrichment ---");

      console.log("Generating real DID...");
      const hash = await sha256.digest(new TextEncoder().encode(value.public_key));
      const cid = CID.create(1, 0x70, hash);
      const multihash = cid.multihash.bytes;
      const did = `did:ans:${uuid()}:${base58btc.encode(multihash)}`;
      console.log(`Generated DID: ${did}`);

      const firestoreData = {
          ...value,
          did: did,
          verification_status: 'provisional',
          created_at: new Date(),
      };
      delete firestoreData.proofOfOwnership;

      console.log("\n--- Data to be written to Firestore ---");
      console.log("Collection: agents");
      console.log(`Document ID: ${firestoreData.agent_id}`);
      console.log("\nFields:");
      console.log(`- agent_id (string): ${firestoreData.agent_id}`);
      console.log(`- name (string): ${firestoreData.name}`);
      console.log(`- description (string): ${firestoreData.description}`);
      console.log(`- organization (string): ${firestoreData.organization}`);
      console.log(`- capabilities (array): ${JSON.stringify(firestoreData.capabilities)}`);
      console.log(`- endpoints (object): ${JSON.stringify(firestoreData.endpoints)}`);
      console.log(`- public_key (string):\n${firestoreData.public_key}`);
      console.log(`- did (string): ${firestoreData.did}`);
      console.log(`- verification_status (string): ${firestoreData.verification_status}`);
      console.log(`- created_at (timestamp): ${firestoreData.created_at.toISOString()}`);

      console.log("\nEnd-to-end mockup registration was successful!");
    }
}

runMockRegistration();