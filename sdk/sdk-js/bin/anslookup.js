#!/usr/bin/env node

import { ANSClient } from '../dist/index.js';

const HELP_MESSAGE = `
ANS Lookup CLI

Usage: anslookup <agent_id> [options]

Performs a lookup for an agent in the Agent Network System.

Default lookup (if no flags are provided):
  <agent_id>    Looks up an agent by its specific ID.

Options:
  --query <name>              Performs a prefix search on the agent's name.
  --agent-id <id>             Looks up an agent by its specific ID.
  --capabilities <caps>       Searches for agents with specific capabilities (comma-separated).
                              Use quotes if a capability name contains spaces.
  --trust-level <level>       Filters agents by trust level (e.g., provisional, verified).
  --policy-requirements <json> Filters agents based on policy requirements (JSON string).
  -h, --help                  Displays this help message.

Examples:
  anslookup translator.ans
  anslookup --query "Translator" --trust-level "provisional"
  anslookup --capabilities "sales,lead generation"
  anslookup --policy-requirements '{"verification_status":"verified"}'
`;

function parseArgs(args) {
  const params = {};
  // Default case: one argument with no flag is treated as agent_id
  if (args.length === 1 && !args[0].startsWith('-')) {
    params.agent_id = args[0];
    return params;
  }

  for (let i = 0; i < args.length; i++) {
    const arg = args[i];
    if (arg.startsWith('--')) {
      const key = arg.substring(2).replace(/-/g, '_');
      const value = (i + 1 < args.length && !args[i+1].startsWith('--')) ? args[i+1] : true;
      
      if (key === 'capabilities') {
        params[key] = value.split(',');
      } else {
        params[key] = value;
      }

      if (value !== true) {
        i++; // Skip the value in the next iteration
      }
    } else if (arg.startsWith('-')) {
        // Handle single-dash flags like -h
        const key = arg.substring(1);
        if (key === 'h') {
            params.help = true;
        }
    }
  }
  return params;
}

async function main() {
  const args = process.argv.slice(2);
  if (args.length === 0 || args.includes('--help') || args.includes('-h')) {
    console.log(HELP_MESSAGE);
    return;
  }

  const params = parseArgs(args);

  // Replace with your actual Cloud Run service URL
  const cloudRunUrl = "https://ans-register-390011077376.us-central1.run.app"; 
  const client = new ANSClient(cloudRunUrl);

  try {
    const results = await client.lookup(params);
    if (results.results && results.results.length > 0) {
      console.log(JSON.stringify(results.results, null, 2));
    } else {
      console.log("No agents found matching the criteria.");
    }
  } catch (error) {
    console.error("An error occurred during lookup:", error);
  }
}

main();
