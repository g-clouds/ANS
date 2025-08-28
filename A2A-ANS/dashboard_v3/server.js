const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const path = require('path');

const app = express();
const PORT = 4000;

let clients = [];

app.use(cors());
app.use(bodyParser.json());
// Serve static files from the current directory
app.use(express.static(path.join(__dirname, '')));

// Endpoint for Server-Sent Events (SSE)
app.get('/events', (req, res) => {
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');
    res.flushHeaders();

    const clientId = Date.now();
    const newClient = {
        id: clientId,
        res: res
    };
    clients.push(newClient);
    console.log(`[Dashboard] Client ${clientId} connected`);

    req.on('close', () => {
        clients = clients.filter(c => c.id !== clientId);
        console.log(`[Dashboard] Client ${clientId} disconnected`);
    });
});

// Endpoint for agents to post log messages to
app.post('/log', (req, res) => {
    const logEntry = req.body;
    console.log(`[Dashboard] Received log:`, logEntry);
    // Send the log entry to all connected clients
    clients.forEach(client => {
        client.res.write(`data: ${JSON.stringify(logEntry)}

`);
    });
    res.status(204).end();
});

// Serve the main index.html file
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

app.listen(PORT, () => {
    console.log(`[Dashboard] Live Dashboard v3 server running on http://localhost:${PORT}`);
});
