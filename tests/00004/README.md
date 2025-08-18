# Test 00004: Agent Registration Stress Test

This test is a stress test that verifies the agent registration functionality using the `@ans-project/sdk-js` package by attempting to register 100 agents in quick succession.

It performs the following steps:

1. Loops 100 times.
2. In each iteration, it generates a new key pair for an agent.
3. Constructs the agent registration payload.
4. Uses the `ANSClient` from the SDK to send the registration request to the ANS backend.
5. Prints the response from the backend.

# Mobile Demo Bridge – 30-second README

1. Start the server

```bash
node run-mobile-bridge.js
```

Console prints:

**Open** http://localhost:8080/run-mobile.html

2. Open / record

- Browse to the URL above (or open it full-screen then hit Win+Shift+R to record).
- Text appears **huge, wrapped, green-on-black** perfect for 1080×1080 mobile video.

3. What’s served

- **HTTP 8080** → run-mobile.html (static page).
- **WebSocket 8081** → live stdout/stderr of run-mobile.js.

4. Change the demo script
   Edit run-mobile-bridge.js, line:

```javascript
const child = spawn('node', ['run-mobile.js'], { stdio: ['pipe', 'pipe', 'pipe'] });
```

Restart the bridge. No other steps.
