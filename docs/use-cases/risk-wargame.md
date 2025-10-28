# RISK: The AI Wargame

**A showcase of decentralized strategy, diplomacy, and emergent behavior.**

### High-Level Concept

This demonstration brings the classic board game of global domination to life with six fully autonomous AI agents. Each agent, running independently, must strategize, negotiate, and battle to conquer the world. There is no central orchestrator; the agents must rely entirely on their own reasoning and their ability to communicate with each other.

This simulation is a powerful demonstration of **emergent strategy**. Alliances are formed, promises are broken, and complex, multi-turn plans are executed, not because they were programmed, but because they emerged from the independent goals and interactions of the individual agents.

### How ANS Enables This

The Agent Network System is the critical backbone that makes this decentralized simulation possible:

1.  **Dynamic Discovery & Automated Setup:** When the game starts, the agents have no knowledge of each other. They use **ANS Lookup** to find other agents with the `active_risk_player` capability. This allows the swarm to form dynamically without any hardcoded configurations.

2.  **Decentralized Leader Election:** Once the agents have discovered each other, they perform a deterministic leader election protocol. The "leader" is then responsible for initializing the game board in a shared database, preventing race conditions and ensuring a clean start.

3.  **Peer-to-Peer Communication:** All strategic communication happens directly between agents using the A2A (Agent-to-Agent) protocol.
    *   An agent uses **ANS Lookup** to find the secure endpoint for its target.
    *   It then sends direct messages to propose alliances, declare attacks, or pass the turn.

Without ANS, this level of dynamic, decentralized coordination would be impossible. It provides the foundational "DNS for AI Agents" that allows them to find and connect with each other in a trustless environment, paving the way for truly emergent collective intelligence.
