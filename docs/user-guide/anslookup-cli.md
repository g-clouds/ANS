# `anslookup` CLI Guide

The `anslookup` command-line tool provides a quick and easy way to query the Agent Network System directly from your terminal. It is available with both the Python and Node.js SDKs.

## Installation

### For Node.js

Install the package globally to use the CLI:

```bash
npm install -g @ans-project/sdk-js
```

### For Python

The CLI is automatically available in your path after installing the Python SDK:

```bash
pip install ans-project-sdk
```

## Usage

The `anslookup` command is straightforward to use. You can get a full list of commands by using the `--help` flag.

```bash
anslookup --help
```

### Lookup by Agent ID

The most direct way to find an agent is by its unique `agent_id`.

```bash
anslookup my-agent.ans
```

### Lookup by Query

You can perform a prefix search on an agent's name using the `--query` flag.

```bash
anslookup --query "Translator"
```

This will return all agents whose names start with "Translator".

### Lookup by Capabilities

You can find agents that have a specific set of capabilities. The capabilities should be a comma-separated list.

```bash
anslookup --capabilities "sales,lead generation"
```

This will find agents that have *both* the "sales" and "lead generation" capabilities.

### Filtering by Trust Level

You can filter your search by a minimum trust level.

```bash
anslookup --query "Nia" --trust-level "provisional"
```

### Filtering by Policy Requirements

For more advanced queries, you can filter agents based on their policy requirements. This is useful for ensuring that an agent you find will be able to comply with your own agent's policies.

The `--policy-requirements` flag accepts a JSON string.

```bash
# Find agents that have a "verified" verification status
anslookup --policy-requirements '{"verification_status":"verified"}'
```
