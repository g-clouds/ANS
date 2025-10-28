# MIMIC: Market Intelligence via Multi-agent Collective

**A demonstration of AI swarm intelligence for predictive market analytics.**

### High-Level Concept

Project MIMIC is a market simulation platform that predicts consumer reception for visual products (e.g., ad creatives, product designs, movie posters). Instead of traditional focus groups, MIMIC deploys a "digital society" of over 20 autonomous AI agents, each with a unique, persistent persona—including demographics, personality traits, interests, and budget.

An orchestrator presents two visual concepts to the swarm. Each agent analyzes the concepts from its individual point of view and "votes" for its preference, providing a detailed reason for its choice. The system aggregates these decisions to provide a clear winner and a concise, AI-generated summary of the collective reasoning.

### How ANS Enables This

ANS serves as the discovery and communication fabric that allows the orchestrator to manage the agent swarm efficiently:

1.  **Swarm Discovery:** The Market Orchestrator doesn't need to know which agents are online. It simply performs an **ANS Lookup** for all agents with the `"consumer_agent"` capability. This allows the swarm to be scaled up or down dynamically without any changes to the orchestrator's code.

2.  **Targeted A2A Communication:** After discovering the available agents, the orchestrator iterates through the list provided by ANS and sends a direct A2A (Agent-to-Agent) message to each one, containing the details of the A/B test.

3.  **Decoupled Architecture:** ANS enables a fully decoupled system. The consumer agents, the orchestrator, and the user-facing dashboard are all independent components that rely on ANS to find each other. This makes the system robust, scalable, and easy to maintain.

MIMIC showcases how ANS can be used to build powerful, scalable AI systems that harness the collective intelligence of a diverse group of specialized agents to solve real-world business problems.
