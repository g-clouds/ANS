# Test 00009: Agent-to-Agent Verification (Visual Demo)

This test provides a real-world, end-to-end visual demonstration of how one agent (**Bob**) can cryptographically verify a claim made by another agent (**Alice**) using the Agent Network System (ANS) as a trusted source for public keys.

## How to Run the Test

1.  **Navigate to the Test Directory:**
    ```bash
    cd tests/00009
    ```

2.  **Install Dependencies:**
    ```bash
    npm install
    ```

3.  **Run the Test:**
    ```bash
    npm start
    ```
    This single command will launch the dashboard server and automatically start the agent simulations.

4.  **Open in Browser:**
    Open `http://localhost:4000` in your web browser to see the live visualization.

## Code Structure

-   `run.js`: The **Orchestrator**. It launches the dashboard server, then Agent A, and finally Agent B in sequence.
-   `dashboard/`: Contains the Express server and HTML frontend for the visualizer.
-   `logHelper.js`: A utility used by the agents to send status updates to the dashboard.
-   `agent_a.js`: **Alice, the Claimant**. Registers with the ANS and serves a signed claim.
-   `agent_b.js`: **Bob, the Verifier**. Discovers Alice, fetches her claim, and independently verifies it.

## The Verification Workflow

The test orchestrates the following scenario, with all traffic visualized on the dashboard:

1.  **Dashboard Starts:** The orchestrator launches the web server.
2.  **Alice Starts & Registers:** Alice's server starts. She sends a registration request to the ANS. The `Alice -> ANS` connection flashes on the dashboard.
3.  **Bob Starts & Discovers:** Bob's script starts. He sends a lookup request to the ANS to find Alice. The `Bob -> ANS` connection flashes.
4.  **Claim Retrieval:** Bob contacts Alice directly to get her signed claim. The `Bob -> Alice` connection flashes.
5.  **Verification:** Bob performs the cryptographic check and sends the final result to the dashboard.
6.  **Result:** The live event log on the dashboard displays the "VERIFICATION SUCCESSFUL!" message.
