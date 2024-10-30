const express = require('express')
const { Server } = require('ws')
const redis = require('redis')
const redisClient = redis.createClient()

const app = express()
const port = 3003

app.use(express.static('public'))

const server = app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`)
})


let tableNames = []
let tableFullNames = []

redisClient.on('connect', ()=>{
  console.log('Redis database connection established successfully')
})
redisClient.on('error', (err)=>{
  console.error('Redis error : ',err)
})

startRedisRoutine();

async function startRedisRoutine() {
  await redisClient.connect();
  try {
    // Chargement des infos générales sur la bdd
    const infosSize = await redisClient.get('infos.size');
    for(let i = 0; i<infosSize; i++){
      let cour = await redisClient.get('infos.'+i)
      tableNames.push(cour)
      let fullName = await redisClient.get(cour+'.infos.name')
      tableFullNames.push(fullName)
    }

    // Chargement des tables
    loadTable(0)
  } catch (err) {
    console.error(err);
  }
}

async function loadTable(id){
  let tableSize = await redisClient.get(tableNames[id]+'.infos.size')
  for(let j = 0; j<tableSize; j++){
    let entryData = {entryType: await redisClient.get(tableNames[id]+"."+j+".type"),
      entryDate: await redisClient.get(tableNames[id]+"."+j+".date"),
      entryValue: await redisClient.get(tableNames[id]+"."+j+".value"),
      entryNote: await redisClient.get(tableNames[id]+"."+j+".note")}
    entries.push(entryData)
  }
}

/*
sudo systemctl start redis

// Enregistrer une valeur
client.set('key', 'value', (err, reply) => {
  if (err) console.error(err);
  console.log(reply); // OK
});

// Récupérer une valeur
client.get('key', (err, value) => {
  if (err) console.error(err);
  console.log(value); // 'value'
});
 */


const wss = new Server({ server })
let clients = []
let usernames = []
let entries = []

wss.on('connection', (ws) => {
  console.log('Client connected')
  clients.push(ws)
  let id = clients.length-1
  ws.on('message', (message) => {
    const data = JSON.parse(message)
    console.log(data)
    switch(data.messageType){
      case "initClient":
        // Début de connection
        usernames.push(data.username)
        const getEntriesServerInit = {messageType:"getEntriesServer",
          data:entries
        }
        clients.at(id).send(JSON.stringify(getEntriesServerInit))
        const getTableChoiceServerInit = {messageType:"getTableChoiceServer",
          data:tableFullNames
        }
        clients.at(id).send(JSON.stringify(getTableChoiceServerInit))
        break;
      case "submitEntryClient":
        // Ajout d'une entrée
        entries.push(data.data)
        const getEntriesServer = {messageType:"getEntriesServer",
          data:entries
        }
        broadcast(JSON.stringify(getEntriesServer))
        break
      default:
        break
    }
    
  })

  ws.on('close', () => {
    console.log('Client disconnected')
    clients = clients.filter(client => client!==ws)
  })
})

function broadcast(message){
  clients.forEach(client =>{
    client.send(message)
  })
}
