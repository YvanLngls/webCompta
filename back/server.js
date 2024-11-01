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
    loadTableNames()

    // Chargement des tables
    lastTable = Number(await redisClient.get('infos.lastTable'))
    // loadTable(0)
  } catch (err) {
    console.error(err);
  }
}

async function loadTableNames() {
  tableNames = []
  tableFullNames = []
  const infosSize = await redisClient.get('infos.size')
  for(let i = 0; i<infosSize; i++){
    let cour = await redisClient.get('infos.'+i)
    tableNames.push(cour)
    let fullName = await redisClient.get(cour+'.infos.name')
    tableFullNames.push(fullName)
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

async function loadGlobalTable(tableId){
  let infosSize = await redisClient.get('infos.size');
  let tableName = tableNames[tableId]
  await redisClient.set("glo.infos.size", 0)
  for(let i = 0; i<infosSize; i++){
    let tableType = Number(await redisClient.get(tableNames[i]+".infos.type"))
    if(tableType==1){
      let tableBalance = Number(await redisClient.get(tableNames[i]+".infos.balance"))
      let tableFullName =await redisClient.get(tableNames[i]+".infos.name")
      let gloId = Number(await redisClient.get(tableName+".infos.size"))
      await redisClient.set(tableName+"."+gloId+".type", 'false')
      await redisClient.set(tableName+"."+gloId+".value", tableBalance)
      await redisClient.set(tableName+"."+gloId+".note", tableFullName)
      gloId++
      await redisClient.set("glo.infos.size", gloId)
    }
  }
  await loadTable(tableId)
  await computeTotal(tableId)
}

// Send general infos about all tables
async function sendTableInfosToClient(clientId){
  let listTableSize = []
  let infosSize = await redisClient.get('infos.size');
  for(let i = 0; i<infosSize; i++){
    let sizeCour = await redisClient.get(tableNames[i]+".infos.size")
    listTableSize.push(sizeCour)
  }
  let getTableInfosServer = {messageType:"getTableInfosServer", listTableSize:listTableSize}
  clients.at(clientId).send(JSON.stringify(getTableInfosServer))
}

async function sendEntriesToClient(clientId, tableId){
  let tableType = Number(await redisClient.get(tableNames[tableId]+".infos.type"))
  if(tableType==1) await loadTable(tableId)
  else await loadGlobalTable(tableId)
  
  let tableFullName = await redisClient.get(tableNames[tableId]+".infos.name")
  let tableBalance = Number(await redisClient.get(tableNames[tableId]+".infos.balance"))
  let getEntriesServer = {messageType:"getEntriesServer", tableType:tableType,
    tableFullName:tableFullName, tableBalance:tableBalance, data:entries
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

async function computeTotal(tableId) {
  totIncome = 0
  totExpense = 0
  
  let tableSize = await redisClient.get(tableNames[tableId]+'.infos.size')
  for(let i = 0; i<tableSize; i++){
    let amount = Number(await redisClient.get(tableNames[tableId]+"."+i+".value"))
    let type = await redisClient.get(tableNames[tableId]+"."+i+".type")
    if(type==='false') totIncome+=amount
    else totExpense+=amount
  }
  await redisClient.set(tableNames[tableId]+".infos.balance", (totIncome-totExpense).toFixed(2))
  return {totIncome, totExpense}
}

async function sendTotalToClient(clientId, tableId) {
  let tot = await computeTotal(tableId)
  let getTotalServer = {messageType:"getTotalServer", totIncome:tot.totIncome, totExpense:tot.totExpense}  
  if(clientId<0) broadcast(JSON.stringify(getTotalServer))
  else clients.at(clientId).send(JSON.stringify(getTotalServer))
}

async function changeTableId(clientId, up, tableId){
  if(up && tableId==0) return
  if(up){
    let courA = await redisClient.get('infos.'+(tableId-1))
    let courB = await redisClient.get('infos.'+tableId)
    await redisClient.set("infos."+tableId,courA)
    await redisClient.set("infos."+(tableId-1),courB)
  }
  else{
    let tableSize = Number(await redisClient.get("infos.size"))
    if((tableId+1)==tableSize && !up) return
    let courA = await redisClient.get('infos.'+(tableId+1))
    let courB = await redisClient.get('infos.'+tableId)
    await redisClient.set("infos."+tableId,courA)
    await redisClient.set("infos."+(tableId+1),courB)
  }
  await loadTableNames()
  await getTableChoice(clientId)
  await sendTableInfosToClient(clientId)
}

async function getTableChoice(clientId) {
  const getTableChoiceServerInit = {messageType:"getTableChoiceServer",
    data:tableFullNames
  }
  if(clientId<0) broadcast(JSON.stringify(getTableChoiceServerInit))
  else clients.at(clientId).send(JSON.stringify(getTableChoiceServerInit))
}

async function addTable(clientId, fullName, shortName){
  let tableSize = Number(await redisClient.get("infos.size"))
  let tableId = tableSize
  tableSize++
  await redisClient.set("infos.size", tableSize)
  await redisClient.set("infos."+tableId, shortName)
  await redisClient.set(shortName+".infos.name", fullName)
  await redisClient.set(shortName+".infos.type", 1)
  await redisClient.set(shortName+".infos.size", 0)
  await loadTableNames()
  await getTableChoice(clientId)
  await sendTableInfosToClient(clientId)
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
        getTableChoice(id)
        sendTotalToClient(id, lastTable)
        sendTableInfosToClient(id)
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
      case "changeTableIdClient":
        changeTableId(id, data.up, data.tableId)
        break
      case "getTotalClient":
        sendTotalToClient(id, lastTable)
        break
      case "addTableClient":
        addTable(id, data.fullName, data.shortName)
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
