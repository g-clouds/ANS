# ANS Python SDK

Python SDK for interacting with the Agent Network System (ANS).

## Installation

Install from PyPI:

```bash
pip install ans-project-sdk
```

## Usage

### ANSClient

The main entry point for the SDK is the `ANSClient` class.

```python
from ans_project.sdk import ANSClient

client = ANSClient() # Defaults to public ANS endpoint

# Generate a new key pair
public_key, private_key = ANSClient.generate_key_pair()

# Register an agent
agent_data = {
    "agent_id": "my-python-agent.ans",
    "name": "My Python Agent",
    "capabilities": ["python_sdk_test"],
    "public_key": public_key
}
try:
    response = client.register(agent_data, private_key)
    print("Registration successful:", response)
except Exception as e:
    print("Registration failed:", e)


# Lookup an agent
try:
    response = client.lookup({"agent_id": "my-python-agent.ans"})
    print("Lookup successful:", response)
except Exception as e:
    print("Lookup failed:", e)
```

### anslookup CLI

The SDK includes a command-line interface tool, `anslookup`, for quickly querying the Agent Network System.

To use it, ensure the SDK is installed (e.g., `pip install ans-project-sdk`) 

```bash
# Get help and see all options
anslookup --help

# Lookup an agent by its ID
anslookup my-python-agent.ans

# Lookup agents by name and trust level
anslookup --query "Nexus Voyager" --trust-level "provisional"

# Lookup agents by capabilities (use quotes for capabilities with spaces)
anslookup --capabilities "discovery,learning"
```

### Payload Validation

The SDK uses `Pydantic` to perform client-side validation on the `register` method's payload. This ensures that the data conforms to the ANS backend schema before it is sent, providing fast and clear error messages.

For example, if you try to register an agent without the required `name` field:

```python
# Invalid payload (missing 'name')
invalid_agent_data = {
    "agent_id": "invalid-agent.ans",
    "public_key": public_key
}

try:
    client.register(invalid_agent_data, private_key)
except ValueError as e:
    print(f"Validation failed as expected: {e}")
```

This will immediately raise a `ValueError` with a detailed message about the missing field, preventing an unnecessary API call.

### Key Management

The `generate_key_pair` method returns a new public/private key pair in PEM format. **The private key must be stored securely and should not be checked into version control.**

For production applications, use a secure secret management system like Google Secret Manager.
