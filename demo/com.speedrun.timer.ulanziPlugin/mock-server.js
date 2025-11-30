/**
 * Mock Timer Server for Testing
 * Run with: node mock-server.js
 *
 * This server simulates the speedrun timer API at localhost:5010
 */

const http = require('http');

// Timer status names
const PacketStatus = {
  0: 'Resume',
  1: 'Pause',
  2: 'Reset',
  3: 'StartBoth'
};

const server = http.createServer((req, res) => {
  // Set CORS headers to allow requests from UlanziDeck
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  // Handle preflight OPTIONS request
  if (req.method === 'OPTIONS') {
    res.writeHead(200);
    res.end();
    return;
  }

  // Handle POST /api/timer
  if (req.method === 'POST' && req.url === '/api/timer') {
    let body = '';

    req.on('data', chunk => {
      body += chunk.toString();
    });

    req.on('end', () => {
      try {
        const data = JSON.parse(body);
        const { Id, Type } = data;

        // Validate Id
        if (Id < 1 || Id > 2) {
          res.writeHead(400, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({
            error: 'Id must be between 1 and 2'
          }));
          return;
        }

        // Validate Type
        if (Type < 0 || Type > 3) {
          res.writeHead(400, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({
            error: 'Invalid PacketStatus type'
          }));
          return;
        }

        const statusName = PacketStatus[Type];
        const timestamp = new Date().toISOString();

        console.log(`[${timestamp}] Timer ${Id}: ${statusName} (Type: ${Type})`);

        // Success response
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({
          success: true,
          message: `Timer ${Id} updated with status ${statusName}`
        }));

      } catch (error) {
        console.error('Error parsing request:', error);
        res.writeHead(400, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({
          error: 'Invalid JSON in request body'
        }));
      }
    });

    return;
  }

  // 404 for other routes
  res.writeHead(404, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify({
    error: 'Not found'
  }));
});

const PORT = 5010;

server.listen(PORT, () => {
  console.log('='.repeat(60));
  console.log('Mock Speedrun Timer Server');
  console.log('='.repeat(60));
  console.log(`Server running at http://localhost:${PORT}`);
  console.log(`API endpoint: POST http://localhost:${PORT}/api/timer`);
  console.log('');
  console.log('Waiting for timer commands...');
  console.log('Press Ctrl+C to stop');
  console.log('='.repeat(60));
});

// Graceful shutdown
process.on('SIGINT', () => {
  console.log('\n\nShutting down server...');
  server.close(() => {
    console.log('Server stopped');
    process.exit(0);
  });
});
