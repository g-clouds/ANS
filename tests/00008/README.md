# Test 00008: Agent Verification End-to-End Test

This test verifies the `/verify` endpoint of the Agent Network System (ANS) by performing a real, end-to-end verification flow.

## How to Run the Test

To execute this test, follow these steps:

1.  **Navigate to the Test Directory:**
    Open your terminal or command prompt and change to the test directory:
    ```bash
    cd tests/00008
    ```

2.  **Install Dependencies:**
    Install the necessary Node.js packages:
    ```bash
    npm install
    ```

3.  **Run the Test:**
    Start the test execution:
    ```bash
    npm start
    ```

This will run the `run.js` script, which performs the following actions against the live ANS backend:
1.  Registers a new, temporary agent.
2.  Creates a sample claim (attestation) and signs it with the new agent's private key.
3.  Calls the `/verify` endpoint to validate the signature.
4.  Calls the `/verify` endpoint again with an invalid signature to ensure it fails correctly.
