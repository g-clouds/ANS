# @ans-sdk/copilotkit-adapter

The official Agent Network System (ANS) adapter for [CopilotKit](https://github.com/CopilotKit/CopilotKit).

This package provides a seamless integration between your CopilotKit-powered agents and the [ANS registry](https://github.com/g-clouds/ANS), allowing your agents to discover and interact with other verified agents in the network.

## Installation

```bash
npm install @ans-sdk/copilotkit-adapter @ans-project/sdk-js
```

## Usage

In your CopilotKit backend (e.g., `app/api/copilotkit/route.ts`):

```typescript
import { CopilotRuntime, OpenAIAdapter } from "@copilotkit/runtime";
import { ansActions } from "@ans-sdk/copilotkit-adapter";

// 1. Initialize the ANS Actions
const actions = ansActions({
  baseURL: "https://ans-register-390011077376.us-central1.run.app",
});

// 2. Pass them to the CopilotRuntime
const runtime = new CopilotRuntime({
  actions: actions,
});

const serviceAdapter = new OpenAIAdapter();

// ... handle request
```

## Tools Provided

*   **`ans_lookup_agent`**: Allows the LLM to search for agents by capability (e.g., "find an image generation agent").

*   **`ans_get_agent_details`**: Retrieve details for a specific agent ID.

*   **`ans_register_agent`**: Register a new agent identity with the network.

## License

MIT
