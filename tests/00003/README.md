# Test 00003: Agent Registration with ANS SDK

This test verifies the agent registration functionality using the `@ans-project/sdk-js` package.

It performs the following steps:

1. Generates a new key pair for the agent.
2. Constructs the agent registration payload.
3. Uses the `ANSClient` from the SDK to send the registration request to the ANS backend.
4. Prints the response from the backend.
