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
let lastTable
let totIncome, totExpense

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
    lastTable = Number(await redisClient.get('infos.lastTable'))
    // loadTable(0)
  } catch (err) {
    console.error(err);
  }
}

async function loadTable(id){
  entries = []
  let tableSize = await redisClient.get(tableNames[id]+'.infos.size')
  for(let j = 0; j<tableSize; j++){
    let entryData = {entryType: await redisClient.get(tableNames[id]+"."+j+".type"),
      entryDate: await redisClient.get(tableNames[id]+"."+j+".date"),
      entryValue: await redisClient.get(tableNames[id]+"."+j+".value"),
      entryNote: await redisClient.get(tableNames[id]+"."+j+".note")}
    entries.push(entryData)
  }
}

async function sendEntriesToClient(clientId, tableId){
  await loadTable(tableId)
  let getEntriesServer = {messageType:"getEntriesServer",
    data:entries
  }
  if(clientId<0) broadcast(JSON.stringify(getEntriesServer))
  else clients.at(clientId).send(JSON.stringify(getEntriesServer))
}

async function changeLastTable(id){
  lastTable = id
  await redisClient.set('infos.lastTable', id)
}

async function registerEntry(tableId, data){
  entryId = await redisClient.get(tableNames[tableId]+".infos.size")
  await redisClient.set(tableNames[tableId]+"."+entryId+".type", data.entryType.toString())
  await redisClient.set(tableNames[tableId]+"."+entryId+".date", data.entryDate.toString())
  await redisClient.set(tableNames[tableId]+"."+entryId+".value", data.entryValue.toString())
  await redisClient.set(tableNames[tableId]+"."+entryId+".note", data.entryNote.toString())
  newSize = Number(entryId)+1
  await redisClient.set(tableNames[tableId]+".infos.size", (newSize).toString())
  sendEntriesToClient(-1, tableId)
  sendTotalToClient(-1, lastTable)
}

async function sendTotalToClient(clientId, tableId) {
  totIncome = 0
  totExpense = 0

  let tableSize = await redisClient.get(tableNames[tableId]+'.infos.size')
  for(let i = 0; i<tableSize; i++){
    let amount = Number(await redisClient.get(tableNames[tableId]+"."+i+".value"))
    let type = await redisClient.get(tableNames[tableId]+"."+i+".type")
    if(type==='false') totIncome+=amount
    else totExpense+=amount
  }
  let getTotalServer = {messageType:"getTotalServer", totIncome:totIncome, totExpense:totExpense}
  if(clientId<0) broadcast(JSON.stringify(getTotalServer))
  else clients.at(clientId).send(JSON.stringify(getTotalServer))
}

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
        sendEntriesToClient(id, lastTable)
        const getTableChoiceServerInit = {messageType:"getTableChoiceServer",
          data:tableFullNames
        }
        clients.at(id).send(JSON.stringify(getTableChoiceServerInit))
        sendTotalToClient(id, lastTable)
        break;
      case "submitEntryClient":
        // Ajout d'une entrée
        registerEntry(lastTable, data.data)
        break
      case "changeTableClient":
        sendEntriesToClient(id, data.tableId)
        changeLastTable(data.tableId)
        sendTotalToClient(id, lastTable)
        break
      case "getTotalClient":
        sendTotalToClient(id, lastTable)
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
