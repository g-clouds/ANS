require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { v4: uuidv4 } = require('uuid');
const { AgentCard, Task, TaskState, Message } = require('@a2a-js/sdk');
const { InMemoryTaskStore, TaskStore, A2AExpressApp, AgentExecutor, RequestContext, ExecutionEventBus, DefaultRequestHandler } = require('@a2a-js/sdk/server');
const { ANSClient } = require('@ans-project/sdk-js');
const { VertexAI, HarmCategory, HarmBlockThreshold } = require('@google-cloud/vertexai');
const admin = require('firebase-admin');
const { systemInstructions } = require('./strategy_inst');
const axios = require('axios');

const logToDashboard = (agent, type, message) => {
    axios.post('http://localhost:4000/log', { agent, type, message }).catch(err => {});
};

const delay = ms => new Promise(res => setTimeout(res, ms));

// Initialize Firebase Admin
admin.initializeApp();
const db = admin.firestore();

// --- Atlas Agent Implementation ---

class AtlasAgentExecutor {
    async execute(requestContext, eventBus) {
        const userMessage = requestContext.userMessage;
        const taskId = requestContext.task?.id || uuidv4();
        const contextId = userMessage.contextId || requestContext.task?.contextId || uuidv4();
        logToDashboard('partner', 'info', `Processing request from primary agent for task ${taskId}`);

        // 1. Publish initial and working status
        if (!requestContext.task) {
            eventBus.publish({
                kind: 'task',
                id: taskId,
                contextId: contextId,
                status: { state: "submitted", timestamp: new Date().toISOString() },
                history: [userMessage],
            });
        }
        eventBus.publish({
            kind: 'status-update',
            taskId: taskId,
            contextId: contextId,
            status: { state: "working", timestamp: new Date().toISOString() },
            final: false,
        });

        try {
            // 2. Extract data from the incoming message
            const { conversation, brainCache } = JSON.parse(userMessage.parts[0].text);

            // 3. Core logic from original strategyChat function
            const { retrievalModel, strategyModel } = await this.initializeModels();

            const customerConversation = conversation.map(msg => `${msg.role.toUpperCase()}: ${msg.content}`).join('\n\n');
            
            const brainCacheInfo = brainCache ? JSON.stringify(brainCache, null, 2) : 'No additional customer information available.';

            const retrievalPrompt = `Analyze the following customer conversation and provide a sales strategy.\n\nConversation:\n${customerConversation}`; 
            const retrievalResponse = await retrievalModel.generateContent({
                contents: [{ role: 'user', parts: [{ text: retrievalPrompt }] }]
            });
            const retrievedKnowledge = retrievalResponse.response.candidates[0].content.parts[0].text;

            const enhancedContext = `# ATLAS ENHANCED CONTEXT
## CUSTOMER CONVERSATION TRANSCRIPT
${customerConversation}
## CUSTOMER DATA (BRAINCACHE)
${brainCacheInfo}
## RETRIEVED KNOWLEDGE
${retrievedKnowledge}
## ANALYSIS REQUEST
Generate a comprehensive sales strategy.`;

            const response = await strategyModel.generateContent({
                contents: [{ role: 'user', parts: [{ text: enhancedContext }] }]
            });
            logToDashboard('partner', 'info', 'Generating strategy...');
            const responseText = response.response.candidates[0].content.parts[0].text;

            // 4. Publish final task status update
            const agentMessage = {
                kind: 'message',
                role: 'agent',
                messageId: uuidv4(),
                parts: [{ kind: 'text', text: responseText }],
                taskId: taskId,
                contextId: contextId,
            };

            logToDashboard('partner', 'success', '[A2A] Strategy generated. Sending response.');
            eventBus.publish({
                kind: 'status-update',
                taskId: taskId,
                contextId: contextId,
                status: {
                    state: "completed",
                    message: agentMessage,
                    timestamp: new Date().toISOString(),
                },
                final: true,
            });
            logToDashboard('partner', 'info', `Task ${taskId} finished with state: completed`);

        } catch (error) {
            console.error(`[AtlasAgentExecutor] Error processing task ${taskId}:`, error);
            eventBus.publish({
                kind: 'status-update',
                taskId: taskId,
                contextId: contextId,
                status: {
                    state: "failed",
                    message: {
                        kind: 'message',
                        role: 'agent',
                        messageId: uuidv4(),
                        parts: [{ kind: 'text', text: `Agent error: ${error.message}` }],
                        taskId: taskId,
                        contextId: contextId,
                    },
                    timestamp: new Date().toISOString(),
                },
                final: true,
            });
        }
    }

    async initializeModels() {
        const vertexAI = new VertexAI({
            project: process.env.PROJECT_ID,
            location: 'europe-west2',
        });
        const safetySettings = [{
            category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT,
            threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
        }];
        const generationConfig = { maxOutputTokens: 8192, temperature: 0 };

        const retrievalModel = vertexAI.preview.getGenerativeModel({
            model: 'gemini-1.5-pro-002',
            systemInstruction: { parts: [{ text: systemInstructions }] },
            safetySettings,
            generationConfig,
            tools: [{
                retrieval: {
                    vertexAiSearch: { datastore: `projects/${process.env.PROJECT_ID}/locations/eu/collections/default_collection/dataStores/${process.env.DATA_STORE_ID}` }
                }
            }]
        });

        const strategyModel = vertexAI.preview.getGenerativeModel({
            model: 'gemini-1.5-pro-002',
            systemInstruction: { parts: [{ text: systemInstructions }] },
            safetySettings,
            generationConfig
        });

        return { retrievalModel, strategyModel };
    }
}

// --- Server Setup ---

const agentCard = {
    name: process.env.AGENT_NAME || 'Atlas',
    description: 'A senior sales strategist AI that analyzes customer conversations and provides sales strategies.',
    url: process.env.AGENT_URL || 'http://localhost:41242/',
    provider: { organization: 'gClouds' },
    version: '0.0.1',
    capabilities: { streaming: true, pushNotifications: false, stateTransitionHistory: true },
    defaultInputModes: ['text'],
    defaultOutputModes: ['text', 'task-status'],
    skills: [{
        id: 'generate_sales_strategy',
        name: 'Generate Sales Strategy',
        description: 'Analyzes a customer conversation and generates a sales strategy.',
        examples: ['Analyze this conversation and provide a sales strategy.'],
        inputModes: ['text'],
        outputModes: ['text', 'task-status']
    }],
};

async function registerAgent() {
    const cloudRunUrl = process.env.ANS_URL || "https://ans-register-390011077376.us-central1.run.app";
    const client = new ANSClient(cloudRunUrl);
    const { publicKey, privateKey } = ANSClient.generateKeyPair();

    const agentPayload = {
        agent_id: process.env.AGENT_ID || "atlas.ans",
        name: agentCard.name,
        description: agentCard.description,
        organization: agentCard.provider.organization,
        capabilities: ["sales_strategy"],
        endpoints: { a2a: agentCard.url },
        public_key: publicKey,
    };

    try {
        console.log('Attempting to register with ANS...');
        const regResponse = await client.register(agentPayload, privateKey);

        // Perform a lookup to confirm and get the DID
        const lookupResponse = await client.lookup({ agent_id: agentPayload.agent_id });
        if (lookupResponse && lookupResponse.results && lookupResponse.results.length > 0) {
            const registeredAgent = lookupResponse.results[0];
            console.log(`Registered as: ${registeredAgent.agent_id}`);
            console.log(`DID: ${registeredAgent.did}`);
        } else {
            throw new Error('Agent not found after registration.');
        }

    } catch (error) {
        console.error(`Failed to register with ANS: ${error.message}`);
    }
}

async function main() {
    const taskStore = new InMemoryTaskStore();
    const agentExecutor = new AtlasAgentExecutor();
    const requestHandler = new DefaultRequestHandler(agentCard, taskStore, agentExecutor);
    
    const expressApp = express();

    // More robust CORS setup
    const corsOptions = {
        origin: 'http://localhost:3000',
        methods: ['GET', 'POST', 'OPTIONS'],
        allowedHeaders: ['Content-Type', 'Authorization'],
    };
    expressApp.use(cors(corsOptions));
    expressApp.options('*', cors(corsOptions)); // Pre-flight handling

    expressApp.use(express.json());
    
    const appBuilder = new A2AExpressApp(requestHandler);
    appBuilder.setupRoutes(expressApp);

    const PORT = process.env.PORT || 41242;
    expressApp.listen(PORT, () => {
        console.log(`[AtlasAgent] Server started on http://localhost:${PORT}`);
        console.log(`[AtlasAgent] Agent Card: http://localhost:${PORT}/.well-known/agent.json`);
        registerAgent();
    });
}

main().catch(console.error);
