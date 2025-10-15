const WebSocket = require('ws');
const url = require('url');

const wss = new WebSocket.Server({ port: 8080 });
const clients = new Map();

wss.on('connection', (ws, req) => {
  const parameters = url.parse(req.url, true).query;
  const userId = parameters.userId;

  clients.set(userId, ws);
  console.log(`Client connected: ${userId}`);

  ws.on('message', (message) => {
    const data = JSON.parse(message);
    console.log('Received:', data);

    // Send to receiver
    const receiverWs = clients.get(data.data.receiverId);
    if (receiverWs && receiverWs.readyState === WebSocket.OPEN) {
      receiverWs.send(JSON.stringify(data));
    }

    // Send back to sender to confirm receipt
    ws.send(JSON.stringify({
      ...data,
      data: { ...data.data, status: 'sent' }
    }));
  });

  ws.on('close', () => {
    clients.delete(userId);
    console.log(`Client disconnected: ${userId}`);
  });
});

console.log('WebSocket server running on port 8080');
