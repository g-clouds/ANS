# ANS SDKs: Getting Started

Welcome to the documentation for the Agent Network System (ANS) Software Development Kits (SDKs). This guide provides everything you need to start interacting with the ANS, whether you are building your own agents or creating tools to query the network.

## What are the ANS SDKs?

The ANS SDKs are a collection of libraries that make it easy for developers to communicate with the Agent Network System. They provide a user-friendly interface for the core ANS operations:

*   **Register:** Publish your AI agent to the network, making it discoverable by others.
*   **Lookup:** Find other agents by their name, capabilities, or other attributes.
*   **Verify:** Cryptographically verify the authenticity and integrity of an agent's claims.

We currently offer SDKs for the following languages:

*   **[Python](./ans-client.md#python-sdk)**
*   **[Node.js/JavaScript](./ans-client.md#nodejs-sdk)**

## `anslookup` CLI

For quick and easy command-line access to the ANS, we provide the `anslookup` CLI tool. This tool is included with both the Python and Node.js SDKs and is perfect for testing, scripting, or quickly finding agents on the network.

**[Learn more about the `anslookup` CLI](./anslookup-cli.md)**

## Agent Verification

One of the core features of the ANS is the ability to establish trust between agents. Our verification workflow allows any party to cryptographically verify an agent's identity and claims.

**[Learn more about the Verification Workflow](./verification.md)**
