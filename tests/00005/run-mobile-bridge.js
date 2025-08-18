// run-mobile-bridge.js
import { readFileSync } from 'fs';
import { createServer } from 'http';
import { WebSocketServer } from 'ws';
import { spawn } from 'child_process';

// 1. VERY small static file server
createServer((req, res) => {
  if (req.url === '/run-mobile.html') {
    res.writeHead(200, { 'Content-Type': 'text/html' });
    res.end(readFileSync('./run-mobile.html', 'utf8'));
  } else {
    res.writeHead(404).end('Not found');
  }
}).listen(8080, () => console.log('Open http://localhost:8080/run-mobile.html'));

// 2. WebSocket relay for the demo
const wss = new WebSocketServer({ port: 8081 });
wss.on('connection', ws => {
  const child = spawn('node', ['run-mobile.js'], { stdio: ['pipe', 'pipe', 'pipe'] });
  child.stdout.on('data', d => ws.send(d.toString()));
  child.stderr.on('data', d => ws.send(d.toString()));
  child.on('exit', () => ws.close());
});
