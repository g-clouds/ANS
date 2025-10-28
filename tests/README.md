# Demonstrations & Tests

This directory contains scripts that demonstrate and test the functionality of the Agent Network System (ANS).

## Running a Test

Each numbered subdirectory (e.g., `00001`, `00003`) contains a self-contained test case. To run a specific test, navigate into its directory, install its dependencies, and run the start script.

For example, to run Test #00001:

```bash
# Navigate to the test directory
cd tests/00001

# Install test-specific dependencies
npm install

# Run the test
npm start
```

Each test directory contains its own `README.md` with more specific details about its purpose.

### New Verification Tests

*   **Test `00008` (Programmatic Verification):** A clear, automated example of how to use the `/verify` endpoint.
*   **Test `00009` (Visual Verification Demo):** A powerful visual tool for demonstrating the entire decentralized verification workflow. It shows one agent looking up another on the ANS and verifying its claims.