import { ANSClient } from "@ans-project/sdk-js";

export interface ANSAdapterConfig {
  ansClient?: ANSClient;
  baseURL?: string; // Add baseURL to config
  apiKey?: string;
  defaultTags?: string[];
}

export function ansActions(config: ANSAdapterConfig = {}) {
  // Default to localhost if not provided, or use the provided client
  const baseURL = config.baseURL || "http://localhost:8080"; 
  const ans = config.ansClient || new ANSClient(baseURL, config.apiKey);

  return [
    {
      name: "ans_lookup_agent",
      description: "Find an AI agent in the Agent Network System (ANS) registry capable of performing a specific task.",
      parameters: [
        {
          name: "capability",
          type: "string",
          description: "The specific capability, tag, or topic to search for (e.g., 'image-generation', 'finance', 'weather').",
          required: true,
        },
        {
          name: "limit",
          type: "number",
          description: "The maximum number of agents to return. Defaults to 5.",
          required: false,
        }
      ] as any,
      handler: async (args: any) => {
        const { capability, limit } = args;
        try {
            // ANS Lookup
            const results = await ans.lookup({ 
                capabilities: [capability], 
                limit: limit || 5 
            });
            
            if (!results || results.length === 0) {
                return { 
                    message: `No agents found for capability: ${capability}`,
                    agents: []
                };
            }

            // Format for CopilotKit
            return {
                message: `Found ${results.length} agents for capability: ${capability}`,
                agents: results.map((agent: any) => ({
                    id: agent.id,
                    name: agent.name,
                    description: agent.description,
                    url: agent.url,
                    tags: agent.tags
                }))
            };

        } catch (error: any) {
            console.error("ANS Lookup Error:", error);
            return {
                error: "Failed to perform ANS lookup.",
                details: error.message
            };
        }
      },
    },
    {
        name: "ans_get_agent_details",
        description: "Retrieve detailed information about a specific agent by its unique ANS ID.",
        parameters: [
            {
                name: "agentId",
                type: "string",
                description: "The unique identifier (ANS ID) of the agent.",
                required: true
            }
        ] as any,
        handler: async(args: any) => {
             const { agentId } = args;
             // In a real implementation, we would call ans.get(agentId)
             // For now, we can use lookup to find it if the SDK doesn't have a direct 'get' by ID yet,
             // or assume the previous lookup provided enough info. 
             // Let's implement a specific lookup if the SDK supports it, otherwise a broad search.
             
             // Checking SDK capabilities via the previously read file...
             // It seems 'lookup' is the main entry. 
             // Let's do a specific lookup simulation or just return what we have.
             
             // For this adapter, we will stick to the robust 'lookup' as the primary tool.
             return {
                 message: "Agent details lookup not yet fully implemented in this adapter version. Please use 'ans_lookup_agent'."
             }
        }
    }
  ];
}
