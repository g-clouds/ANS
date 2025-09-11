import argparse
import json
import sys
from ans_project.sdk import ANSClient

def main():
    parser = argparse.ArgumentParser(
        description="ANS Lookup CLI",
        formatter_class=argparse.RawTextHelpFormatter
    )

    # Positional argument for agent_id (if no flags are used)
    parser.add_argument(
        "agent_id_positional",
        nargs="?", # 0 or 1 argument
        help="Looks up an agent by its specific ID (e.g., translator.ans)"
    )

    # Optional arguments
    parser.add_argument(
        "--query",
        help="Performs a prefix search on the agent's name."
    )
    parser.add_argument(
        "--agent-id",
        help="Looks up an agent by its specific ID (overrides positional if both used)."
    )
    parser.add_argument(
        "--capabilities",
        help="Searches for agents with specific capabilities (comma-separated, e.g., 'sales,lead generation')."
    )
    parser.add_argument(
        "--trust-level",
        help="Filters agents by trust level (e.g., provisional, verified)."
    )

    args = parser.parse_args()

    params = {}

    # Determine agent_id: --agent-id flag takes precedence over positional argument
    if args.agent_id:
        params["agent_id"] = args.agent_id
    elif args.agent_id_positional:
        params["agent_id"] = args.agent_id_positional

    if args.query:
        params["query"] = args.query
    if args.capabilities:
        # JS SDK splits by comma, so we do too.
        params["capabilities"] = args.capabilities.split(',')
    if args.trust_level:
        params["trust_level"] = args.trust_level

    if not params:
        parser.print_help()
        sys.exit(1)

    client = ANSClient()

    try:
        results = client.lookup(params)
        if results and results.get("results") and len(results["results"]) > 0:
            print(json.dumps(results["results"], indent=2))
        else:
            print("No agents found matching the criteria.")
    except Exception as e:
        print(f"An error occurred during lookup: {e}", file=sys.stderr)
        if hasattr(e, 'response') and e.response is not None:
            print(f"Backend Error Details: {e.response.text}", file=sys.stderr)
        sys.exit(1)

if __name__ == "__main__":
    main()
