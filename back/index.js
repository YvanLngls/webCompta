const express = require('express');
const { Server } = require('ws');
const { redisClient, connectToRedis } = require('./database');
const setupWebSocket = require('./websocket/websocket.js');
const { initInfos } = require('./services/infos.js');

const app = express();
const port = 3003;

app.use(express.static('public'));

// Connexion à Redis
connectToRedis();

// Initialisation d'infos au démarrage
initInfos();

// Serveur WebSocket
const server = app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});

setupWebSocket(server);
