const express = require('express')
const { Server } = require('ws')

const app = express()
const port = 3003

app.use(express.static('public'))

const server = app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`)
})

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
        break;
      case "submitEntryClient":
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
