const express = require('express');
const https = require('https');
const fs = require('fs');
const path = require('path');

const app = express();

// Serve static files from the web-workers-demo directory
app.use(express.static(path.join(__dirname, 'web-workers-demo')));

// Routes for each demo
app.get('/dedicated', (req, res) => {
    res.sendFile(path.join(__dirname, 'web-workers-demo/dedicated/index.html'));
});

app.get('/shared', (req, res) => {
    res.sendFile(path.join(__dirname, 'web-workers-demo/shared/index.html'));
});

app.get('/shared/multiplayer', (req, res) => {
    res.sendFile(path.join(__dirname, 'web-workers-demo/shared/Multiplayer/index.html'));
});

app.get('/service', (req, res) => {
    res.sendFile(path.join(__dirname, 'web-workers-demo/service/index.html'));
});

app.get('/service/weather-widget', (req, res) => {
    res.sendFile(path.join(__dirname, 'web-workers-demo/service/weather-widget/index.html'));
});

// Default route
app.get('/', (req, res) => {
    res.send(`
        <html>
            <head>
                <title>Web Workers Demo</title>
                <style>
                    body { font-family: Arial, sans-serif; max-width: 800px; margin: 0 auto; padding: 20px; }
                    .demo-link { display: block; margin: 20px 0; padding: 10px; background: #f0f0f0; }
                </style>
            </head>
            <body>
                <h1>Web Workers Demonstrations</h1>
                <a class="demo-link" href="/dedicated" target="blank">1. Dedicated Worker Demo - Image Processing</a>
                <a class="demo-link" href="/shared" target="blank">2. Shared Worker Demo - Multi-Window Chat</a>
                <a class="demo-link" href="/shared/multiplayer" target="blank">2.1 Shared Worker Demo - Multi-Player</a>
                <a class="demo-link" href="/service" target="blank">3. Service Worker Demo - Offline-Capable News App</a>
                <a class="demo-link" href="/service/weather-widget" target="blank">3.1 Service Worker Demo - Weather Widget</a>
            </body>
        </html>
    `);
});

// Start the server
const port = 3000;
app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
