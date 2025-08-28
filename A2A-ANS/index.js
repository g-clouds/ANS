require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { v4: uuidv4 } = require('uuid');
const { AgentCard, Task, TaskState, Message } = require('@a2a-js/sdk');
const { InMemoryTaskStore, TaskStore, A2AExpressApp, AgentExecutor, RequestContext, ExecutionEventBus, DefaultRequestHandler } = require('@a2a-js/sdk/server');
const { ANSClient } = require('@ans-project/sdk-js');
const { A2AClient } = require('@a2a-js/sdk/client');
const { VertexAI, HarmCategory, HarmBlockThreshold } = require('@google-cloud/vertexai');
const admin = require('firebase-admin');
const { systemInstructions } = require('./system_inst');
const axios = require('axios');

const logToDashboard = (agent, type, message) => {
    axios.post('http://localhost:4000/log', { agent, type, message }).catch(err => {});
};

const delay = ms => new Promise(res => setTimeout(res, ms));

// Initialize Firebase Admin
admin.initializeApp();
const db = admin.firestore();

// --- Agent Implementation ---

class AgentExecutor {
    constructor() {
        this.ansClient = new ANSClient(process.env.ANS_URL || "https://ans-register-390011077376.us-central1.run.app");
    }

    async execute(requestContext, eventBus) {
        const userMessage = requestContext.userMessage;
        const taskId = requestContext.task?.id || uuidv4();
        const contextId = userMessage.contextId || requestContext.task?.contextId || uuidv4();
        logToDashboard('primary', 'info', `Processing message ${userMessage.messageId}`);
        logToDashboard('primary', 'conversation', `USER: ${userMessage.parts[0].text}`);

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
            // If the user mentions "strategy", immediately inform them of the next steps.
            if (userMessage.parts[0].text.toLowerCase().includes("strategy")) {
                const intermediateMessageText = "That's a great question. To get you the best possible strategy, I need to quickly consult with my supervisor, Atlas. I'll be right back with a detailed plan for you.";
                const intermediateAgentMessage = {
                    kind: 'message',
                    role: 'agent',
                    messageId: uuidv4(),
                    parts: [{ kind: 'text', text: intermediateMessageText }],
                    taskId: taskId,
                    contextId: contextId,
                };
                eventBus.publish({
                    kind: 'status-update',
                    taskId: taskId,
                    contextId: contextId,
                    status: {
                        state: "working",
                        message: intermediateAgentMessage,
                        timestamp: new Date().toISOString(),
                    },
                    final: false,
                });
                logToDashboard('primary', 'conversation', `AGENT: ${intermediateMessageText}`);
            }

            // 2. Core logic from original callGemini function
            const { retrievalModel, functionModel } = await this.initializeModels();
            const conversationRef = db.collection('conversations').doc(contextId);
            
            await conversationRef.set({ messages: [{ role: 'user', content: userMessage.parts[0].text }] }, { merge: true });
            const doc = await conversationRef.get();
            const messages = doc.data().messages;

            const retrievalResponse = await retrievalModel.generateContent({
                contents: this.prepareChatHistory(messages)
            });

            if (!retrievalResponse.response || !retrievalResponse.response.candidates || retrievalResponse.response.candidates.length === 0) {
                throw new Error("Retrieval model returned an empty response. This may be due to safety filters.");
            }
            const contextInfo = retrievalResponse.response.candidates[0];

            const functionResponse = await functionModel.generateContent({
                contents: [
                    ...this.prepareChatHistory(messages),
                    { role: 'user', parts: [{ text: `Context from knowledge base: ${contextInfo.content.parts[0].text}\n\nUser query: ${userMessage.parts[0].text}` }] }
                ]
            });

            if (!functionResponse.response || !functionResponse.response.candidates || functionResponse.response.candidates.length === 0) {
                throw new Error("Function model returned an empty response. This may be due to safety filters.");
            }

            const responseText = await this.handleResponse(functionResponse.response.candidates[0], contextId, conversationRef, eventBus, taskId);

            // 3. Publish final task status update
            const agentMessage = {
                kind: 'message',
                role: 'agent',
                messageId: uuidv4(),
                parts: [{ kind: 'text', text: responseText }],
                taskId: taskId,
                contextId: contextId,
            };

            logToDashboard('primary', 'conversation', `AGENT: ${responseText}`);

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

            console.log(`[AgentExecutor] Task ${taskId} finished with state: completed`);

        } catch (error) {
            console.error(`[AgentExecutor] Error processing task ${taskId}:`, error);
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

    async handleResponse(candidate, contextId, conversationRef, eventBus, taskId) {
        let responseMessage = '';
        for (const part of candidate.content.parts) {
            if (part.text) {
                responseMessage += part.text;
            }
        }

        // Check if the agent needs a strategy
        if (responseMessage.toLowerCase().includes("strategy")) {
            // Proceed with the lookup and A2A communication
            logToDashboard('primary', 'info', "[ANS] Strategy requested. Looking up partner agent...");
            const partnerAgentCapability = process.env.PARTNER_AGENT_CAPABILITY || "sales_strategy";
            const response = await this.ansClient.lookup({ capabilities: [partnerAgentCapability] });
            if (response && response.results && response.results.length > 0) {
                const partnerAgent = response.results[0]; // Get the first agent from the results array
                logToDashboard('primary', 'info', `[A2A] Partner agent found: ${partnerAgent.agent_id}. Sending request...`);

                const a2aClient = new A2AClient(partnerAgent.endpoints.a2a);
                const conversationDoc = await conversationRef.get();
                const conversation = conversationDoc.data().messages;
                const brainCacheRef = db.collection('BrainCache').doc(contextId);
                const brainCacheDoc = await brainCacheRef.get();
                const brainCache = brainCacheDoc.exists ? brainCacheDoc.data() : null;

                const messagePayload = {
                    messageId: uuidv4(),
                    kind: "message",
                    role: "user",
                    parts: [{ kind: 'text', text: JSON.stringify({ conversation, brainCache }) }]
                };
                
                const params = { message: messagePayload };
                const stream = a2aClient.sendMessageStream(params);
                let finalMessage = "I was unable to get a strategy from my partner agent.";

                for await (const event of stream) {
                    if (event.kind === 'status-update' && event.final) {
                        if (event.status.state === 'completed' && event.status.message) {
                            const textPart = event.status.message.parts.find(p => p.kind === 'text');
                            if (textPart) {
                                finalMessage = textPart.text;
                            }
                        } else if (event.status.state === 'failed' && event.status.message) {
                            const textPart = event.status.message.parts.find(p => p.kind === 'text');
                            finalMessage = `My partner agent failed with an error: ${textPart.text}`;
                        }
                        break;
                    }
                }
                responseMessage = finalMessage;

            } else {
                console.error(`Partner agent ${partnerAgentId} not found in ANS.`);
                responseMessage = "I need a moment to think about the strategy, but my usual consultant seems to be unavailable. Let me see what I can do.";
            }
        }

        await conversationRef.update({
            messages: admin.firestore.FieldValue.arrayUnion({ role: 'model', content: responseMessage })
        });

        return responseMessage;
    }

    prepareChatHistory(messages) {
        return messages.map(msg => ({
            role: msg.role === 'user' ? 'user' : 'model',
            parts: [{ text: msg.content }]
        }));
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
        const generationConfig = { maxOutputTokens: 1024, temperature: 0 };

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

        const functionModel = vertexAI.preview.getGenerativeModel({
            model: 'gemini-1.5-pro-002',
            systemInstruction: { parts: [{ text: systemInstructions }] },
            safetySettings,
            generationConfig,
        });

        return { retrievalModel, functionModel };
    }
}

// --- Server Setup ---

const agentCard = {
    name: process.env.AGENT_NAME || 'Nia',
    description: 'An AI sales assistant for gClouds that can answer questions about Google Cloud solutions.',
    url: process.env.AGENT_URL || 'http://localhost:41241/',
    provider: { organization: 'gClouds' },
    version: '0.0.1',
    capabilities: { streaming: true, pushNotifications: false, stateTransitionHistory: true },
    defaultInputModes: ['text'],
    defaultOutputModes: ['text', 'task-status'],
    skills: [{
        id: 'general_sales_chat',
        name: 'General Sales Chat',
        description: 'Answer general questions about Google Cloud solutions.',
        examples: ['What is Google Workspace?', 'How much does Google Cloud cost?'],
        inputModes: ['text'],
        outputModes: ['text', 'task-status']
    }],
};

async function registerAgent() {
    const cloudRunUrl = process.env.ANS_URL || "https://ans-register-390011077376.us-central1.run.app";
    const client = new ANSClient(cloudRunUrl);
    const { publicKey, privateKey } = ANSClient.generateKeyPair();

    const agentPayload = {
        agent_id: process.env.AGENT_ID || "nia.ans",
        name: agentCard.name,
        description: agentCard.description,
        organization: agentCard.provider.organization,
        capabilities: ["sales", "lead_generation"],
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
    const agentExecutor = new AgentExecutor();
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

    const PORT = process.env.PORT || 41241;
    expressApp.listen(PORT, () => {
        console.log(`[Agent] Server started on http://localhost:${PORT}`);
        console.log(`[Agent] Agent Card: http://localhost:${PORT}/.well-known/agent.json`);
        registerAgent();
    });
}

main().catch(console.error);
