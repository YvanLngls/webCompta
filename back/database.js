const redis = require('redis');
const redisClient = redis.createClient();

// Connexion à Redis
async function connectToRedis() {
  redisClient.on('connect', () => {
    console.log('Redis database connection established successfully');
  });
  redisClient.on('error', (err) => {
    console.error('Redis error:', err);
  });
  await redisClient.connect();
}

// Fonctions utilitaires pour la gestion des données dans Redis
async function get(key) {
  return await redisClient.get(key);
}

async function set(key, value) {
  await redisClient.set(key, value.toString());
}

async function deleteAll() {
  await redisClient.del('*');
}

module.exports = {
  redisClient,
  connectToRedis,
  get,
  set,
  deleteAll
};
