# To run this example, you must first install the SDK.
# From the root of the `ans` repository, run:
# pip install -e sdk/sdk-python

from ans_project.sdk import ANSClient

def main():
    """Example of registering an agent."""
    client = ANSClient()

    # 1. Generate a new key pair for the agent.
    # In a real application, you would do this once and store the private key securely.
    public_key, private_key = ANSClient.generate_key_pair()

    print("--- Generated Keys ---")
    print("Public Key (store this in your agent's public record):")
    print(public_key)
    print("\nPrivate Key (STORE THIS SECURELY!):")
    print(private_key)
    print("----------------------\n")

    # 2. Define the agent's public data.
    agent_payload = {
        "agent_id": "my-python-agent.ans",
        "name": "My First Python Agent",
        "description": "An agent registered using the ANS Python SDK.",
        "organization": "Python SDK Examples",
        "capabilities": ["example", "python"],
        "endpoints": {
            "a2a": "http://example.com/a2a",
            "rest": "http://example.com/api"
        },
        "public_key": public_key
    }

    # 3. Register the agent.
    # The client handles signing the payload with the private key.
    try:
        print("Attempting to register agent...")
        response = client.register(agent_payload, private_key)
        print("Registration successful!")
        print("Response:")
        print(response)
    except Exception as e:
        print(f"Registration failed: {e}")
        if hasattr(e, 'response') and e.response is not None:
            print(f"Response body: {e.response.text}")

if __name__ == "__main__":
    main()
