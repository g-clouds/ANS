# A2A-ANS Agent Collaboration Template

This directory contains a template for creating a sophisticated, two-agent system that uses the Agent Network System (ANS) for discovery and the Agent-to-Agent (A2A) protocol for direct, collaborative communication.

The agents are designed to leverage Google Cloud's Vertex AI for Retrieval-Augmented Generation (RAG), allowing them to answer questions based on your own private documents.

---

## High-Level Architecture

This template demonstrates a "Register -> Lookup -> Connect" flow where two AI agents collaborate to respond to a user query.

1.  **User Interaction:** A user interacts with the **Primary Agent** via a command-line interface.
2.  **Task Delegation:** When the user's query requires specialized knowledge (e.g., asking for a "strategy"), the Primary Agent decides to consult a partner.
3.  **ANS Discovery:** The Primary Agent queries the **Agent Network System (ANS)** for any agent possessing the `sales_strategy` capability. It then selects the first agent from the results list.
4.  **A2A Communication:** The Primary Agent retrieves the A2A endpoint from the discovered agent's record and establishes a direct **Agent-to-Agent (A2A)** connection with the **Partner Agent** to delegate the complex part of the query.
5.  **RAG & Internal Knowledge:** Both agents are connected to a **Vertex AI Search Datastore**. They use this private knowledge base to retrieve relevant information (RAG) to formulate their responses.
6.  **Firestore Memory:** The agents use **Cloud Firestore** to maintain conversation history and cache relevant customer information, providing context and memory across interactions.
7.  **Final Response:** The Partner Agent analyzes the request, queries its knowledge base, formulates a strategy, and sends it back to the Primary Agent via A2A. The Primary Agent then delivers the final, consolidated response to the user.

```
[ User ] <--> [ CLI Client ] <--> [ Primary Agent ] <---- A2A ----> [ Partner Agent ]
                                       |                                |
                                       +---------- ANS (Discovery) -----+
                                       |                                |
                                       +---- [ Vertex AI Search (RAG) ] -+
                                       |                                |
                                       +---- [ Cloud Firestore (Memory) ] --+
```

---

## Prerequisites

To run this demo successfully, you will need a Google Cloud project with the following services configured.

### 1. Google Cloud Project
- A Google Cloud project with a billing account enabled.

### 2. IAM Service Account
Create a service account to grant the agents the necessary permissions.
- Go to **IAM & Admin > Service Accounts** in the Google Cloud Console.
- Click **+ CREATE SERVICE ACCOUNT**.
- Give it a name (e.g., `a2a-ans-agent-sa`).
- Grant the following roles:
    - `Vertex AI User`
    - `Cloud Datastore User` (for Firestore access)
    - `Service Account Token Creator`
- Create a JSON key for this service account and download it to your local machine. You will need the path to this file.

### 3. Enable APIs
- Go to **APIs & Services > Enabled APIs & services**.
- Click **+ ENABLE APIS AND SERVICES**.
- Enable the following APIs for your project:
    - `Vertex AI API`
    - `Google Cloud Firestore API`

### 4. Cloud Firestore Database
- Go to **Firestore**.
- Click **+ CREATE DATABASE**.
- Choose **Native mode**.
- Select a location for your database.
- The application will automatically create the necessary collections (`conversations`, `BrainCache`) when it runs.

### 5. Vertex AI Search for RAG
The agents use a private datastore for Retrieval-Augmented Generation.
- Go to **Vertex AI > Search & Conversation**.
- Click **+ NEW APP**.
- Select the **Search** application type.
- Give your app a name (e.g., `agent-knowledge-base`).
- Under **Datastores**, click **+ CREATE NEW DATASTORE**.
    - Choose **Cloud Storage** as the source.
    - Create a new Cloud Storage bucket and upload your private documents (e.g., product info, sales guides, internal documentation in `.pdf` or `.txt` format).
    - Select the bucket and create the datastore.
- Once the datastore is created and has finished indexing your files, copy its **Datastore ID**. You will need this for the configuration.

---

## Configuration

### 1. Install Dependencies
From this directory (`A2A-ANS`), install the required Node.js packages.
```bash
npm install
```

### 2. Create and Update `.env` File
Create a file named `.env` by copying the example file:
```bash
cp .env.example .env
```
Now, open the `.env` file and update it with your specific GCP and agent configuration:

```
# --- GCP Configuration ---
PROJECT_ID=your-gcp-project-id
GOOGLE_APPLICATION_CREDENTIALS=/path/to/your/keyfile.json
DATA_STORE_ID=your-vertex-ai-datastore-id

# --- ANS Configuration ---
ANS_URL=https://ans-register-390011077376.us-central1.run.app

# --- Primary Agent Configuration ---
AGENT_NAME_PRIMARY=PrimaryAgent
AGENT_ID_PRIMARY=primary.ans
AGENT_URL_PRIMARY=http://localhost:41241/

# --- Partner Agent Configuration ---
AGENT_NAME_PARTNER=PartnerAgent
AGENT_ID_PARTNER=partner.ans
AGENT_URL_PARTNER=http://localhost:41242/
PARTNER_AGENT_CAPABILITY=sales_strategy
```

---

## Running the Demo

You will need **four separate terminals**, all opened to this directory (`A2A-ANS`). In each terminal where you run an agent, ensure your environment is authenticated to Google Cloud.

**Authentication (run in each agent terminal):**

**Windows (Command Prompt):**
```cmd
set GOOGLE_APPLICATION_CREDENTIALS=C:\path\to\your\keyfile.json
```

**Windows (PowerShell):**
```powershell
$env:GOOGLE_APPLICATION_CREDENTIALS="C:\path\to\your\keyfile.json"
```

**Linux/macOS:**
```bash
export GOOGLE_APPLICATION_CREDENTIALS="/path/to/your/keyfile.json"
```

### Terminal 1: Start the Dashboard
This provides the web interface for the demo.
```bash
npm run start:dashboard
```
*Navigate to `http://localhost:4000` in your browser to view the dashboard.*

### Terminal 2: Start the Partner Agent
```bash
npm run start:partner
```

### Terminal 3: Start the Primary Agent
```bash
npm run start:primary
```

### Terminal 4: Run the A2A Client
This client simulates a user talking to the primary agent.
```bash
npm run client
```
You should see a `PrimaryAgent > You:` prompt.


---

## Trigger the Agent Interaction

At the prompt in the client terminal, ask a question that requires a strategy, which will trigger the full A2a and RAG flow:

```
Hello, I'm interested in your services, but I need a strategy for how to get started.
```

You will see logs in all three terminals as the agents discover each other, communicate, and use their knowledge base to formulate a response.

```