// register-agents.js
const { ANSClient } = require('./dist/index'); // Adjust path if needed
async function runTest() {
  // Replace with your actual Cloud Run service URL
  const cloudRunUrl = "https://ans-register-390011077376.us-central1.run.app";
  const client = new ANSClient(cloudRunUrl);
  // 1. Generate EC Key Pair
     const { publicKey, privateKey } = ANSClient.generateKeyPair();
     console.log("Generated Public Key (PEM):\n", publicKey);
     console.log("Generated Private Key (PEM):\n", privateKey); // Keep this secure!

     // 2. Construct Agent Data
     const agentPayload = {
       agent_id: "my-js-agent.ans",
       name: "My JS SDK Agent",
       description: "An agent registered via JS SDK.",
       organization: "JS SDK Test Org",
       capabilities: ["js_capability", "test_feature"],
       endpoints: { a2a: "https://js.test.com/a2a", rest: "https://js.test.com/api/v1" },
       public_key: publicKey,
     };

     try {
       // 3. Register Agent
       console.log("Attempting to register agent...");
       const response = await client.register(agentPayload, privateKey);
       console.log("Registration Response:\n", JSON.stringify(response, null, 2));

     } catch (error) {
       console.error("Error during agent registration:", error.message);
       if (error.response && error.response.data) {
         console.error("Backend Error Details:", JSON.stringify(error.response.data, null, 2));
       }
     }
   }

runTest();