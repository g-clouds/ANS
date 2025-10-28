// run-mobile-bridge.js
import { readFileSync } from 'fs';
import { createServer } from 'http';
import { WebSocketServer } from 'ws';
import { spawn } from 'child_process';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// 1. Static file server for the HTML page
createServer((req, res) => {
  if (req.url === '/run-mobile.html') {
    res.writeHead(200, { 'Content-Type': 'text/html' });
    res.end(readFileSync('./run-mobile.html', 'utf8'));
  } else {
    res.writeHead(404).end('Not found');
  }
}).listen(8080, () => console.log('Test ready. Open http://localhost:8080/run-mobile.html in your browser.'));

// 2. WebSocket server to relay the main test script's output
const wss = new WebSocketServer({ port: 8081 });
wss.on('connection', ws => {
  const child = spawn('node', [path.join(__dirname, 'run.js')], { stdio: 'pipe' });
  
  child.stdout.on('data', d => ws.send(d.toString()));
  child.stderr.on('data', d => ws.send(d.toString())); // Relay errors too
  child.on('exit', () => ws.close());
});
