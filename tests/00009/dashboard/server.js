const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const path = require('path');

const app = express();
const PORT = 4000;

let clients = [];

app.use(cors());
app.use(bodyParser.json());
app.use(express.static(__dirname));

// Endpoint for Server-Sent Events (SSE)
app.get('/events', (req, res) => {
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');
    res.flushHeaders();

    const clientId = Date.now();
    clients.push({ id: clientId, res });
    console.log(`[Dashboard] Client ${clientId} connected`);

    req.on('close', () => {
        clients = clients.filter(c => c.id !== clientId);
        console.log(`[Dashboard] Client ${clientId} disconnected`);
    });
});

// Endpoint for agents to post log messages
app.post('/log', (req, res) => {
    const logEntry = req.body;
    clients.forEach(client => {
        client.res.write(`data: ${JSON.stringify(logEntry)}

`);
    });
    res.status(204).end();
});

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

app.listen(PORT, () => {
    console.log(`[Dashboard] Visualizer running on http://localhost:${PORT}`);
});

