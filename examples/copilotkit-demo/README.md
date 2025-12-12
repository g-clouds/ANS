# ANS + CopilotKit Demo

This is a Next.js application demonstrating how to build a **Multi-Agent System** using CopilotKit and the Agent Network System (ANS).

The embedded CoAgent can "lookup" other agents in the decentralized ANS registry to fulfill user requests.

## Prerequisites

*   Node.js 18+
*   OpenAI API Key

## Getting Started

1.  **Install dependencies:**
    ```bash
    npm install
    ```

2.  **Environment Setup:**
    Copy `.env.example` to `.env.local` and add your OpenAI API key.
    ```bash
    cp .env.example .env.local
    ```

3.  **Run the Development Server:**
    ```bash
    npm run dev
    ```

4.  **Open the App:**
    Navigate to `http://localhost:3000`.

5.  **Interact:**
    Open the Copilot Popup in the bottom right and ask:
    > "Find me an agent that handles weather data."

## Architecture

*   **Frontend:** Next.js + `@copilotkit/react-core` + `@copilotkit/react-ui`
*   **Backend:** Next.js API Route (`app/api/copilotkit/route.ts`)
*   **Integration:** `@ans-sdk/copilotkit-adapter` wrapping the ANS SDK.