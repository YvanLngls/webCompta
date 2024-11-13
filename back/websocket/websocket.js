const { Server } = require('ws');
const { handleMessage, handleClose } = require('./handlers');

function setupWebSocket(server) {
  const wss = new Server({ server });
  const clients = [];

  wss.on('connection', (ws) => {
    console.log('Client connected');
    const id = clients.push(ws) - 1;

    ws.on('message', (message) => handleMessage(message, ws));
    
    ws.on('close', () => {
      console.log('Client disconnected');
      handleClose(ws, clients);
    });
  });
}

module.exports = setupWebSocket;
