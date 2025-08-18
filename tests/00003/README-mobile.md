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